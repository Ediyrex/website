import { and, eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb, pmsTaskSubtasks, studioTasks } from "@/db";
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
import { pmsSubtaskActionSchema } from "@/lib/validations/pms";

const uuidSchema = z.string().uuid("Invalid task identifier.");

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid task identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = pmsSubtaskActionSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid subtask action payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const [task] = await db
      .select({
        id: studioTasks.id,
        pmsProjectId: studioTasks.pmsProjectId,
        title: studioTasks.title,
      })
      .from(studioTasks)
      .where(eq(studioTasks.id, id))
      .limit(1);

    if (!task) return apiNotFound("Task not found.");
    if (task.pmsProjectId) {
      const perms = await getProjectPermissions(
        db,
        auth.session,
        task.pmsProjectId
      );
      if (!perms.canEditTasks) {
        return apiForbidden("Viewers cannot modify subtasks.");
      }
    }

    const data = parsed.data;
    if (data.action === "add") {
      if (!data.title) return apiBadRequest("Subtask title is required.");
      const [{ maxPos }] = await db
        .select({
          maxPos: sql<number>`coalesce(max(${pmsTaskSubtasks.position}), -1)::int`,
        })
        .from(pmsTaskSubtasks)
        .where(eq(pmsTaskSubtasks.taskId, id));

      const [created] = await db
        .insert(pmsTaskSubtasks)
        .values({
          taskId: id,
          title: data.title,
          completed: false,
          position: maxPos + 1,
        })
        .returning();

      await logPmsActivity(db, {
        projectId: task.pmsProjectId,
        taskId: id,
        actorUserId: auth.session.userId,
        action: "subtask.added",
        summary: `Added subtask "${created.title}" to "${task.title}"`,
      });
      return apiOk(created, undefined, 201);
    }

    if (data.action === "toggle") {
      if (!data.subtaskId) return apiBadRequest("subtaskId is required.");
      const [updated] = await db
        .update(pmsTaskSubtasks)
        .set({ completed: Boolean(data.completed) })
        .where(
          and(
            eq(pmsTaskSubtasks.id, data.subtaskId),
            eq(pmsTaskSubtasks.taskId, id)
          )
        )
        .returning();
      if (!updated) return apiNotFound("Subtask not found.");
      return apiOk(updated);
    }

    if (!data.subtaskId) return apiBadRequest("subtaskId is required.");
    await db
      .delete(pmsTaskSubtasks)
      .where(
        and(
          eq(pmsTaskSubtasks.id, data.subtaskId),
          eq(pmsTaskSubtasks.taskId, id)
        )
      );
    return apiOk({ deleted: true });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/tasks/[id]/subtasks");
  }
}

