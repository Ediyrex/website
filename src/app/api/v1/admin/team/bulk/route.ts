import { and, inArray, isNull } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb } from "@/db";
import {
  accessGroupMembers,
  sessions,
  users,
} from "@/db/schema/auth";
import {
  apiBadRequest,
  apiForbidden,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import {
  ensureTeamDefaultsBootstrapped,
  resolveBaseRole,
  syncUserBaseRole,
} from "@/lib/server/team-rbac";
import { teamBulkActionSchema } from "@/lib/validations/cms";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureTeamDefaultsBootstrapped(db);

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = teamBulkActionSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid bulk action payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const data = parsed.data;
    const uniqueIds = Array.from(new Set(data.userIds));

    if (data.action === "set_status") {
      if (data.status === "disabled" && uniqueIds.includes(auth.session.userId)) {
        return apiForbidden(
          "You cannot suspend your own active administrator account."
        );
      }

      const now = new Date();
      await db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({ status: data.status, updatedAt: now })
          .where(and(inArray(users.id, uniqueIds), isNull(users.removedAt)));

        if (data.status === "disabled") {
          await tx
            .update(sessions)
            .set({ revokedAt: now })
            .where(
              and(inArray(sessions.userId, uniqueIds), isNull(sessions.revokedAt))
            );
        }
      });

      await recordAuditLog({
        actorUserId: auth.session.userId,
        actorEmailSnapshot: auth.session.email,
        action: "team.members.bulk_status_updated",
        entityType: "user",
        entityId: uniqueIds[0],
        metadata: { count: uniqueIds.length, status: data.status },
      });

      return apiOk({ updatedCount: uniqueIds.length });
    }

    if (data.action === "set_role") {
      const targetBaseRole = await resolveBaseRole(db, data.studioRole);
      if (
        targetBaseRole !== "admin" &&
        uniqueIds.includes(auth.session.userId)
      ) {
        return apiForbidden(
          "You cannot downgrade your own active administrator account."
        );
      }

      const now = new Date();
      await db.transaction(async (tx) => {
        await tx
          .update(users)
          .set({ studioRole: data.studioRole, updatedAt: now })
          .where(and(inArray(users.id, uniqueIds), isNull(users.removedAt)));

        for (const uid of uniqueIds) {
          await syncUserBaseRole(tx, uid, targetBaseRole);
        }
      });

      await recordAuditLog({
        actorUserId: auth.session.userId,
        actorEmailSnapshot: auth.session.email,
        action: "team.members.bulk_role_updated",
        entityType: "user",
        entityId: uniqueIds[0],
        metadata: { count: uniqueIds.length, studioRole: data.studioRole },
      });

      return apiOk({ updatedCount: uniqueIds.length });
    }

    // add_to_group
    await db
      .insert(accessGroupMembers)
      .values(
        uniqueIds.map((uid) => ({
          groupId: data.groupId,
          userId: uid,
        }))
      )
      .onConflictDoNothing();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "team.access_group.bulk_members_added",
      entityType: "access_group",
      entityId: data.groupId,
      metadata: { count: uniqueIds.length },
    });

    return apiOk({ updatedCount: uniqueIds.length });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/team/bulk");
  }
}

