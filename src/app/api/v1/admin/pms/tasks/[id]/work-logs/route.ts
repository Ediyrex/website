import { eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb, pmsTaskWorkLogs, studioTasks } from "@/db";
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
import { pmsWorkLogCreateSchema } from "@/lib/validations/pms";

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

    const parsed = pmsWorkLogCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid work log payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const [task] = await db
      .select()
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
        return apiForbidden("Viewers cannot log work hours.");
      }
    }

    const data = parsed.data;
    const result = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(pmsTaskWorkLogs)
        .values({
          taskId: id,
          userId: auth.session.userId,
          minutes: data.minutes,
          note: data.note,
        })
        .returning();

      await tx
        .update(studioTasks)
        .set({
          loggedMinutes: sql`${studioTasks.loggedMinutes} + ${data.minutes}`,
          updatedAt: new Date(),
        })
        .where(eq(studioTasks.id, id));

      await logPmsActivity(tx, {
        projectId: task.pmsProjectId,
        taskId: id,
        actorUserId: auth.session.userId,
        action: "worklog.added",
        summary: `Logged ${data.minutes}m on "${task.title}"`,
      });

      return created;
    });

    return apiOk(result, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/tasks/[id]/work-logs");
  }
}

