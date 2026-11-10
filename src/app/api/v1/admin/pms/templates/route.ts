import { randomBytes } from "node:crypto";
import { unstable_rethrow } from "next/navigation";
import { asc, desc, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  getDb,
  pmsCustomTemplates,
  pmsMilestones,
  pmsProjects,
  studioTasks,
} from "@/db";
import { PMS_PROJECT_TEMPLATES } from "@/lib/pms/templates";
import {
  apiBadRequest,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { logger } from "@/lib/server/logger";
import { requireAdminRole } from "@/lib/server/session";
import { pmsCustomTemplateCreateSchema } from "@/lib/validations/pms";

const uuidSchema = z.string().uuid("Invalid template identifier.");

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const customRows = await db
      .select()
      .from(pmsCustomTemplates)
      .orderBy(desc(pmsCustomTemplates.createdAt));

    return apiOk({
      builtIn: PMS_PROJECT_TEMPLATES.map((t) => ({
        ...t,
        isBuiltIn: true,
      })),
      custom: customRows.map((c) => ({
        id: c.id,
        key: c.key,
        name: c.name,
        serviceInterest: c.serviceInterest,
        description: c.description,
        labels: c.labelsJson,
        milestones: c.milestonesJson,
        tasks: c.tasksJson,
        isBuiltIn: false,
        createdAt: c.createdAt,
      })),
    });
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to fetch PMS templates");
    return apiServerError("Unable to load PMS templates.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = pmsCustomTemplateCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid project template payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const data = parsed.data;
    let milestones = data.milestones;
    let tasks = data.tasks;
    let serviceInterest = data.serviceInterest;
    let description = data.description;
    let labels = data.labels;

    if (data.sourceProjectId) {
      const [[srcProject], srcMilestones, srcTasks] = await Promise.all([
        db
          .select()
          .from(pmsProjects)
          .where(eq(pmsProjects.id, data.sourceProjectId))
          .limit(1),
        db
          .select()
          .from(pmsMilestones)
          .where(eq(pmsMilestones.projectId, data.sourceProjectId))
          .orderBy(asc(pmsMilestones.position)),
        db
          .select()
          .from(studioTasks)
          .where(eq(studioTasks.pmsProjectId, data.sourceProjectId))
          .orderBy(asc(studioTasks.position)),
      ]);

      if (!srcProject) return apiNotFound("Source project not found.");
      const baseTime = srcProject.startDate
        ? new Date(srcProject.startDate).getTime()
        : new Date(srcProject.createdAt).getTime();

      serviceInterest = srcProject.serviceInterest || serviceInterest;
      description = srcProject.summary || description;
      labels = srcProject.workflowConfig?.labels || labels;

      milestones = srcMilestones.map((m, idx) => ({
        title: m.title,
        offsetDays: m.dueDate
          ? Math.max(
              1,
              Math.round((new Date(m.dueDate).getTime() - baseTime) / 86400000)
            )
          : (idx + 1) * 7,
      }));

      tasks = srcTasks.map((t, idx) => ({
        title: t.title,
        workflowStatus: (t.workflowStatus === "done"
          ? "todo"
          : t.workflowStatus) as
          | "backlog"
          | "todo"
          | "in_progress"
          | "in_review"
          | "done",
        priority: t.priority as "low" | "medium" | "high" | "urgent",
        labels: t.labels || [],
        offsetDays: t.dueDate
          ? Math.max(
              1,
              Math.round((new Date(t.dueDate).getTime() - baseTime) / 86400000)
            )
          : (idx + 1) * 4,
        estimatedMinutes: t.estimatedMinutes || 120,
      }));
    }

    const key = `custom_${data.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_|_$/g, "")}_${randomBytes(2).toString("hex")}`.slice(0, 80);

    const [created] = await db
      .insert(pmsCustomTemplates)
      .values({
        key,
        name: data.name,
        serviceInterest,
        description,
        labelsJson: labels,
        milestonesJson: milestones,
        tasksJson: tasks,
        createdByUserId: auth.session.userId,
      })
      .returning();

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/templates");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "";
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid template identifier.");
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const [deleted] = await db
      .delete(pmsCustomTemplates)
      .where(eq(pmsCustomTemplates.id, id))
      .returning({ id: pmsCustomTemplates.id });

    if (!deleted) return apiNotFound("Custom template not found.");
    return apiOk({ deleted: true });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/pms/templates");
  }
}
