import { unstable_rethrow } from "next/navigation";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  getDb,
  pmsNotifications,
  pmsProjects,
  studioTasks,
  users,
} from "@/db";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { logger } from "@/lib/server/logger";
import { requireAdminRole } from "@/lib/server/session";

const inboxPatchSchema = z.object({
  notificationId: z.string().uuid().optional(),
  markAllRead: z.boolean().optional(),
  isRead: z.boolean().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab")?.trim() || "all";

    const conditions = [
      eq(pmsNotifications.recipientUserId, auth.session.userId),
    ];
    if (tab === "tasks") {
      conditions.push(inArray(pmsNotifications.category, ["task", "review"]));
    } else if (tab === "mentions") {
      conditions.push(eq(pmsNotifications.category, "mention"));
    }

    const [rows, [{ unreadAll }], [{ unreadTasks }], [{ unreadMentions }]] =
      await Promise.all([
        db
          .select({
            id: pmsNotifications.id,
            category: pmsNotifications.category,
            title: pmsNotifications.title,
            body: pmsNotifications.body,
            isRead: pmsNotifications.isRead,
            projectId: pmsNotifications.projectId,
            projectTitle: pmsProjects.title,
            taskId: pmsNotifications.taskId,
            taskTitle: studioTasks.title,
            actorName: users.displayName,
            createdAt: pmsNotifications.createdAt,
          })
          .from(pmsNotifications)
          .leftJoin(pmsProjects, eq(pmsNotifications.projectId, pmsProjects.id))
          .leftJoin(studioTasks, eq(pmsNotifications.taskId, studioTasks.id))
          .leftJoin(users, eq(pmsNotifications.actorUserId, users.id))
          .where(and(...conditions))
          .orderBy(desc(pmsNotifications.createdAt))
          .limit(80),
        db
          .select({ unreadAll: sql<number>`count(*)::int` })
          .from(pmsNotifications)
          .where(
            and(
              eq(pmsNotifications.recipientUserId, auth.session.userId),
              eq(pmsNotifications.isRead, false)
            )
          ),
        db
          .select({ unreadTasks: sql<number>`count(*)::int` })
          .from(pmsNotifications)
          .where(
            and(
              eq(pmsNotifications.recipientUserId, auth.session.userId),
              eq(pmsNotifications.isRead, false),
              inArray(pmsNotifications.category, ["task", "review"])
            )
          ),
        db
          .select({ unreadMentions: sql<number>`count(*)::int` })
          .from(pmsNotifications)
          .where(
            and(
              eq(pmsNotifications.recipientUserId, auth.session.userId),
              eq(pmsNotifications.isRead, false),
              eq(pmsNotifications.category, "mention")
            )
          ),
      ]);

    return apiOk({
      notifications: rows,
      unreadCounts: {
        all: unreadAll,
        tasks: unreadTasks,
        mentions: unreadMentions,
      },
    });
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to load PMS inbox");
    return apiServerError("Unable to load inbox notifications.");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = inboxPatchSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest("Invalid inbox update payload.");
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    if (parsed.data.markAllRead) {
      await db
        .update(pmsNotifications)
        .set({ isRead: true })
        .where(eq(pmsNotifications.recipientUserId, auth.session.userId));
      return apiOk({ updated: "all" });
    }

    if (!parsed.data.notificationId) {
      return apiBadRequest("notificationId or markAllRead is required.");
    }

    await db
      .update(pmsNotifications)
      .set({ isRead: parsed.data.isRead ?? true })
      .where(
        and(
          eq(pmsNotifications.id, parsed.data.notificationId),
          eq(pmsNotifications.recipientUserId, auth.session.userId)
        )
      );

    return apiOk({ updated: parsed.data.notificationId });
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/pms/inbox");
  }
}

