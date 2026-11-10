import { eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  getDb,
  pmsProjects,
  pmsTaskAssignees,
  studioTasks,
} from "@/db";
import { logPmsActivity, notifyPmsUsers } from "@/lib/pms/notifications";
import { getProjectPermissions } from "@/lib/pms/permissions";
import {
  apiBadRequest,
  apiForbidden,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { pmsTaskCreateSchema } from "@/lib/validations/pms";

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

    const parsed = pmsTaskCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid task payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const data = parsed.data;
    if (data.pmsProjectId) {
      const perms = await getProjectPermissions(
        db,
        auth.session,
        data.pmsProjectId
      );
      if (!perms.exists) return apiNotFound("PMS project not found.");
      if (!perms.canEditTasks) {
        return apiForbidden("Viewers cannot create tasks in this project.");
      }
    }

    const assignees = Array.from(
      new Set(
        data.assigneeUserIds && data.assigneeUserIds.length > 0
          ? data.assigneeUserIds
          : [auth.session.userId]
      )
    );

    const created = await db.transaction(async (tx) => {
      const [{ count }] = await tx
        .select({ count: sql<number>`count(*)::int` })
        .from(studioTasks);
      const taskCode = `TSK-${String(count + 101)}`;
      const parsedDue = data.dueDate ? new Date(data.dueDate) : null;
      const dueDateLabel = parsedDue
        ? parsedDue.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })
        : data.dueDateLabel;

      const [task] = await tx
        .insert(studioTasks)
        .values({
          pmsProjectId: data.pmsProjectId || null,
          taskCode,
          title: data.title,
          description: data.description,
          category: data.category,
          workflowStatus: data.workflowStatus,
          priority: data.priority,
          labels: data.labels,
          dueDateLabel,
          startDate: data.startDate ? new Date(data.startDate) : null,
          dueDate: parsedDue,
          estimatedMinutes: data.estimatedMinutes,
          dependencyTaskIds: data.dependencyTaskIds ?? [],
          recurrenceRule: data.recurrenceRule,
          completed: data.workflowStatus === "done",
          assigneeUserId: assignees[0] || auth.session.userId,
          position: count,
        })
        .returning();

      if (assignees.length > 0) {
        await tx.insert(pmsTaskAssignees).values(
          assignees.map((userId) => ({
            taskId: task.id,
            userId,
          }))
        );
      }

      if (data.pmsProjectId) {
        await tx
          .update(pmsProjects)
          .set({ updatedAt: new Date() })
          .where(eq(pmsProjects.id, data.pmsProjectId));
      }

      await logPmsActivity(tx, {
        projectId: data.pmsProjectId || null,
        taskId: task.id,
        actorUserId: auth.session.userId,
        action: "task.created",
        summary: `Created task ${taskCode}: ${task.title}`,
      });

      await notifyPmsUsers(tx, {
        recipientUserIds: assignees,
        actorUserId: auth.session.userId,
        projectId: data.pmsProjectId || null,
        taskId: task.id,
        category: "task",
        title: `New task assigned: ${task.title}`,
        body: `Priority: ${task.priority} · Due: ${task.dueDateLabel}`,
      });

      return task;
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "pms_task.created",
      entityType: "studio_task",
      entityId: created.id,
      metadata: { title: created.title, pmsProjectId: created.pmsProjectId },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/tasks");
  }
}

