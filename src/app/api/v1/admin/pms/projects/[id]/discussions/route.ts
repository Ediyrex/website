import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  getDb,
  pmsDiscussions,
  pmsProjectMembers,
  pmsProjects,
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
import { pmsDiscussionCreateSchema } from "@/lib/validations/pms";

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

    const parsed = pmsDiscussionCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid discussion payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("Project not found.");
    if (!perms.canEditTasks) {
      return apiForbidden("Viewers cannot post in project discussions.");
    }

    const [activeUsers, [project], projectMembers] = await Promise.all([
      db
        .select({
          id: users.id,
          displayName: users.displayName,
          emailNormalized: users.emailNormalized,
        })
        .from(users)
        .where(eq(users.status, "active")),
      db
        .select({ id: pmsProjects.id, title: pmsProjects.title })
        .from(pmsProjects)
        .where(eq(pmsProjects.id, id))
        .limit(1),
      db
        .select({ userId: pmsProjectMembers.userId })
        .from(pmsProjectMembers)
        .where(eq(pmsProjectMembers.projectId, id)),
    ]);

    const data = parsed.data;
    const mentionedIds = extractMentionedUserIds(data.body, activeUsers);

    const [created] = await db
      .insert(pmsDiscussions)
      .values({
        projectId: id,
        parentId: data.parentId || null,
        authorUserId: auth.session.userId,
        body: data.body,
        mentions: mentionedIds,
        attachmentAssetIds: data.attachmentAssetIds,
      })
      .returning();

    await logPmsActivity(db, {
      projectId: id,
      actorUserId: auth.session.userId,
      action: "discussion.posted",
      summary: data.parentId
        ? "Replied in project discussion"
        : "Started a project discussion thread",
    });

    if (mentionedIds.length > 0) {
      await notifyPmsUsers(db, {
        recipientUserIds: mentionedIds,
        actorUserId: auth.session.userId,
        projectId: id,
        category: "mention",
        title: `${auth.session.displayName} mentioned you in ${project?.title || "a project"}`,
        body: data.body.slice(0, 180),
      });
    } else {
      await notifyPmsUsers(db, {
        recipientUserIds: projectMembers.map((m) => m.userId),
        actorUserId: auth.session.userId,
        projectId: id,
        category: "project",
        title: `New discussion message in ${project?.title || "project"}`,
        body: data.body.slice(0, 180),
      });
    }

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/projects/[id]/discussions");
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
    const discussionId = searchParams.get("discussionId") || "";
    if (
      !uuidSchema.safeParse(id).success ||
      !uuidSchema.safeParse(discussionId).success
    ) {
      return apiBadRequest("Invalid identifier.");
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("Project not found.");

    const [msg] = await db
      .select()
      .from(pmsDiscussions)
      .where(
        and(eq(pmsDiscussions.id, discussionId), eq(pmsDiscussions.projectId, id))
      )
      .limit(1);

    if (!msg) return apiNotFound("Message not found.");
    if (msg.authorUserId !== auth.session.userId && !perms.canManageProject) {
      return apiForbidden("Only the author or project manager can delete this message.");
    }

    await db.delete(pmsDiscussions).where(eq(pmsDiscussions.id, discussionId));
    return apiOk({ deleted: true });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/pms/projects/[id]/discussions");
  }
}

