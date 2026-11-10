import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  getDb,
  pmsTaskAssignees,
  pmsTaskComments,
  studioTasks,
  users,
} from "@/db";
import {
  extractMentionedUserIds,
  logPmsActivity,
  notifyPmsUsers,
} from "@/lib/pms/notifications";
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
import { pmsTaskCommentCreateSchema } from "@/lib/validations/pms";

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

    const parsed = pmsTaskCommentCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid comment payload.",
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
        return apiForbidden("Viewers cannot post task comments.");
      }
    }

    const [activeUsers, assignees] = await Promise.all([
      db
        .select({
          id: users.id,
          displayName: users.displayName,
          emailNormalized: users.emailNormalized,
        })
        .from(users)
        .where(eq(users.status, "active")),
      db
        .select({ userId: pmsTaskAssignees.userId })
        .from(pmsTaskAssignees)
        .where(eq(pmsTaskAssignees.taskId, id)),
    ]);

    const data = parsed.data;
    const mentionedIds = extractMentionedUserIds(data.body, activeUsers);

    const [created] = await db
      .insert(pmsTaskComments)
      .values({
        taskId: id,
        authorUserId: auth.session.userId,
        body: data.body,
        mentions: mentionedIds,
        attachmentAssetIds: data.attachmentAssetIds,
        isReviewNote: false,
      })
      .returning();

    await logPmsActivity(db, {
      projectId: task.pmsProjectId,
      taskId: id,
      actorUserId: auth.session.userId,
      action: "task.commented",
      summary: `Commented on "${task.title}"`,
    });

    if (mentionedIds.length > 0) {
      await notifyPmsUsers(db, {
        recipientUserIds: mentionedIds,
        actorUserId: auth.session.userId,
        projectId: task.pmsProjectId,
        taskId: id,
        category: "mention",
        title: `${auth.session.displayName} mentioned you in "${task.title}"`,
        body: data.body.slice(0, 180),
      });
    }

    const otherAssignees = assignees
      .map((a) => a.userId)
      .filter((uid) => !mentionedIds.includes(uid));

    if (otherAssignees.length > 0) {
      await notifyPmsUsers(db, {
        recipientUserIds: otherAssignees,
        actorUserId: auth.session.userId,
        projectId: task.pmsProjectId,
        taskId: id,
        category: "task",
        title: `New comment on "${task.title}"`,
        body: data.body.slice(0, 180),
      });
    }

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/tasks/[id]/comments");
  }
}

