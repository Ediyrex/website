import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { teamInvitations, users } from "@/db/schema/auth";
import {
  apiBadRequest,
  apiForbidden,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { hashSessionToken, requireAdminRole } from "@/lib/server/session";
import { ensureTeamDefaultsBootstrapped, hasCapability } from "@/lib/server/team-rbac";
import { teamInvitationActionSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid invitation ID.");

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid invitation identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureTeamDefaultsBootstrapped(db);

    const canInvite =
      auth.session.roles.includes("admin") ||
      (await hasCapability(db, auth.session.userId, "inviteUsers"));
    if (!canInvite) {
      return apiForbidden("You do not have permission to manage invitations.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = teamInvitationActionSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest("Invalid invitation action payload.");
    }

    const [inv] = await db
      .select()
      .from(teamInvitations)
      .where(eq(teamInvitations.id, id))
      .limit(1);

    if (!inv) {
      return apiNotFound("Invitation not found.");
    }

    if (parsed.data.action === "resend") {
      const rawToken = randomBytes(24).toString("hex");
      const tokenHash = hashSessionToken(rawToken);
      const nextExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

      await db
        .update(teamInvitations)
        .set({
          tokenHash,
          status: "pending",
          expiresAt: nextExpiry,
        })
        .where(eq(teamInvitations.id, id));

      await recordAuditLog({
        actorUserId: auth.session.userId,
        actorEmailSnapshot: auth.session.email,
        action: "team.invitation.resent",
        entityType: "team_invitation",
        entityId: id,
        metadata: { email: inv.emailNormalized },
      });

      const inviteUrl = `${request.nextUrl.origin}/admin/login?invite=${rawToken}&email=${encodeURIComponent(
        inv.emailNormalized
      )}`;

      return apiOk({ resent: true, inviteUrl, expiresAt: nextExpiry });
    }

    // Activate member account manually
    const now = new Date();
    await db.transaction(async (tx) => {
      await tx
        .update(teamInvitations)
        .set({ status: "accepted", acceptedAt: now })
        .where(eq(teamInvitations.id, id));

      if (inv.userId) {
        await tx
          .update(users)
          .set({ status: "active", updatedAt: now })
          .where(eq(users.id, inv.userId));
      }
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "team.invitation.activated",
      entityType: "team_invitation",
      entityId: id,
      metadata: { email: inv.emailNormalized, userId: inv.userId },
    });

    return apiOk({ activated: true });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/team/invitations/[id]");
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid invitation identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureTeamDefaultsBootstrapped(db);

    const canInvite =
      auth.session.roles.includes("admin") ||
      (await hasCapability(db, auth.session.userId, "inviteUsers"));
    if (!canInvite) {
      return apiForbidden("You do not have permission to revoke invitations.");
    }

    const [inv] = await db
      .select({ id: teamInvitations.id, emailNormalized: teamInvitations.emailNormalized })
      .from(teamInvitations)
      .where(eq(teamInvitations.id, id))
      .limit(1);

    if (!inv) {
      return apiNotFound("Invitation not found.");
    }

    await db
      .update(teamInvitations)
      .set({ status: "revoked" })
      .where(eq(teamInvitations.id, id));

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "team.invitation.revoked",
      entityType: "team_invitation",
      entityId: id,
      metadata: { email: inv.emailNormalized },
    });

    return apiOk({ revoked: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/team/invitations/[id]");
  }
}

