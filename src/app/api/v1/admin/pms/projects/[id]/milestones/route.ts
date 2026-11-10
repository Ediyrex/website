import { and, eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb, pmsMilestones } from "@/db";
import { logPmsActivity } from "@/lib/pms/notifications";
import { getProjectPermissions } from "@/lib/pms/permissions";
import {
  apiBadRequest,
  apiForbidden,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import {
  pmsMilestoneCreateSchema,
  pmsMilestoneUpdateSchema,
} from "@/lib/validations/pms";

const uuidSchema = z.string().uuid("Invalid identifier.");

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid project identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = pmsMilestoneCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid milestone payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("Project not found.");
    if (!perms.canEditTasks) {
      return apiForbidden("You do not have permission to create milestones.");
    }

    const data = parsed.data;
    const [{ maxPos }] = await db
      .select({
        maxPos: sql<number>`coalesce(max(${pmsMilestones.position}), -1)::int`,
      })
      .from(pmsMilestones)
      .where(eq(pmsMilestones.projectId, id));

    const [created] = await db
      .insert(pmsMilestones)
      .values({
        projectId: id,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        status: data.status,
        position: maxPos + 1,
      })
      .returning();

    await logPmsActivity(db, {
      projectId: id,
      actorUserId: auth.session.userId,
      action: "milestone.created",
      summary: `Added milestone "${created.title}"`,
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/projects/[id]/milestones");
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid project identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = pmsMilestoneUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid milestone update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("Project not found.");
    if (!perms.canEditTasks) {
      return apiForbidden("You do not have permission to update milestones.");
    }

    const data = parsed.data;
    const updates: Record<string, unknown> = { updatedAt: new Date() };
    if (data.title !== undefined) updates.title = data.title;
    if (data.description !== undefined) updates.description = data.description;
    if (data.dueDate !== undefined) {
      updates.dueDate = data.dueDate ? new Date(data.dueDate) : null;
    }
    if (data.status !== undefined) updates.status = data.status;

    const [updated] = await db
      .update(pmsMilestones)
      .set(updates)
      .where(
        and(
          eq(pmsMilestones.id, data.milestoneId),
          eq(pmsMilestones.projectId, id)
        )
      )
      .returning();

    if (!updated) return apiNotFound("Milestone not found.");

    await logPmsActivity(db, {
      projectId: id,
      actorUserId: auth.session.userId,
      action: "milestone.updated",
      summary: `Milestone "${updated.title}" marked ${updated.status}`,
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/pms/projects/[id]/milestones");
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    const { searchParams } = new URL(request.url);
    const milestoneId = searchParams.get("milestoneId") || "";
    if (
      !uuidSchema.safeParse(id).success ||
      !uuidSchema.safeParse(milestoneId).success
    ) {
      return apiBadRequest("Invalid project or milestone identifier.");
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("Project not found.");
    if (!perms.canManageProject) {
      return apiForbidden("Only project managers or admins can delete milestones.");
    }

    const [deleted] = await db
      .delete(pmsMilestones)
      .where(
        and(eq(pmsMilestones.id, milestoneId), eq(pmsMilestones.projectId, id))
      )
      .returning({ id: pmsMilestones.id, title: pmsMilestones.title });

    if (!deleted) return apiNotFound("Milestone not found.");

    return apiOk({ deleted: true });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/pms/projects/[id]/milestones");
  }
}

