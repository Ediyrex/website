import { and, desc, eq, gt, isNull } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import {
  accessGroupMembers,
  accessGroups,
  auditLogs,
  roles,
  sessions,
  teamInvitations,
  teamRoleDefinitions,
  userRoles,
  users,
} from "@/db/schema/auth";
import { pmsProjectMembers, pmsProjects, studioTasks } from "@/db/schema/pms";
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
import {
  ensureTeamDefaultsBootstrapped,
  hasModulePermission,
  resolveBaseRole,
  syncUserBaseRole,
} from "@/lib/server/team-rbac";
import { teamMemberProfileUpdateSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid user ID.");

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid user identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureTeamDefaultsBootstrapped(db);

    const canView = await hasModulePermission(
      db,
      auth.session.userId,
      "team",
      "view"
    );
    if (!canView && auth.session.userId !== id) {
      return apiForbidden("You do not have permission to view this profile.");
    }

    const now = new Date();

    const [
      [member],
      roleAssignments,
      roleDefs,
      projectRows,
      taskRows,
      activeSessions,
      invitations,
      groupRows,
      recentActivity,
    ] = await Promise.all([
      db
        .select({
          id: users.id,
          emailNormalized: users.emailNormalized,
          displayName: users.displayName,
          status: users.status,
          studioRole: users.studioRole,
          department: users.department,
          jobTitle: users.jobTitle,
          phone: users.phone,
          avatarUrl: users.avatarUrl,
          lastLoginAt: users.lastLoginAt,
          removedAt: users.removedAt,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(eq(users.id, id))
        .limit(1),
      db
        .select({ roleName: roles.name })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id))
        .where(eq(userRoles.userId, id)),
      db.select().from(teamRoleDefinitions),
      db
        .select({
          projectId: pmsProjects.id,
          referenceCode: pmsProjects.referenceCode,
          title: pmsProjects.title,
          status: pmsProjects.status,
          progressPercent: pmsProjects.progressPercent,
          projectRole: pmsProjectMembers.projectRole,
        })
        .from(pmsProjectMembers)
        .innerJoin(pmsProjects, eq(pmsProjectMembers.projectId, pmsProjects.id))
        .where(
          and(
            eq(pmsProjectMembers.userId, id),
            eq(pmsProjectMembers.membershipStatus, "active")
          )
        ),
      db
        .select({
          id: studioTasks.id,
          taskCode: studioTasks.taskCode,
          title: studioTasks.title,
          workflowStatus: studioTasks.workflowStatus,
          priority: studioTasks.priority,
          completed: studioTasks.completed,
          pmsProjectId: studioTasks.pmsProjectId,
        })
        .from(studioTasks)
        .where(eq(studioTasks.assigneeUserId, id))
        .orderBy(desc(studioTasks.updatedAt))
        .limit(20),
      db
        .select({
          id: sessions.id,
          createdAt: sessions.createdAt,
          expiresAt: sessions.expiresAt,
        })
        .from(sessions)
        .where(
          and(
            eq(sessions.userId, id),
            isNull(sessions.revokedAt),
            gt(sessions.expiresAt, now)
          )
        )
        .orderBy(desc(sessions.createdAt)),
      db
        .select({
          id: teamInvitations.id,
          status: teamInvitations.status,
          expiresAt: teamInvitations.expiresAt,
          createdAt: teamInvitations.createdAt,
          acceptedAt: teamInvitations.acceptedAt,
        })
        .from(teamInvitations)
        .where(eq(teamInvitations.emailNormalized, auth.session.email))
        .limit(0), // replaced below using member.emailNormalized
      db
        .select({
          id: accessGroups.id,
          name: accessGroups.name,
          division: accessGroups.division,
        })
        .from(accessGroupMembers)
        .innerJoin(accessGroups, eq(accessGroupMembers.groupId, accessGroups.id))
        .where(eq(accessGroupMembers.userId, id)),
      db
        .select({
          id: auditLogs.id,
          action: auditLogs.action,
          entityType: auditLogs.entityType,
          entityId: auditLogs.entityId,
          actorEmailSnapshot: auditLogs.actorEmailSnapshot,
          createdAt: auditLogs.createdAt,
        })
        .from(auditLogs)
        .where(eq(auditLogs.actorUserId, id))
        .orderBy(desc(auditLogs.createdAt))
        .limit(15),
    ]);

    void invitations;

    if (!member) {
      return apiNotFound("Team member not found.");
    }

    const latestInvitations = await db
      .select({
        id: teamInvitations.id,
        status: teamInvitations.status,
        expiresAt: teamInvitations.expiresAt,
        createdAt: teamInvitations.createdAt,
        acceptedAt: teamInvitations.acceptedAt,
      })
      .from(teamInvitations)
      .where(eq(teamInvitations.emailNormalized, member.emailNormalized))
      .orderBy(desc(teamInvitations.createdAt))
      .limit(5);

    const roleDef = roleDefs.find((r) => r.key === member.studioRole);

    return apiOk({
      member: {
        ...member,
        studioRoleLabel: roleDef?.name ?? member.studioRole,
        roles: roleAssignments.map((r) => r.roleName),
        permissions: roleDef?.permissions ?? null,
      },
      activeSessions,
      latestInvitation: latestInvitations[0] ?? null,
      assignedProjects: projectRows,
      assignedTasks: taskRows,
      accessGroups: groupRows,
      recentActivity,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/team/[id]");
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid user identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureTeamDefaultsBootstrapped(db);

    const isAdmin = auth.session.roles.includes("admin");
    const canEdit =
      isAdmin ||
      (await hasModulePermission(db, auth.session.userId, "team", "edit"));
    if (!canEdit) {
      return apiForbidden("You do not have permission to modify team members.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = teamMemberProfileUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid team member update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const nextBaseRoleFromStudio = parsed.data.studioRole
      ? await resolveBaseRole(db, parsed.data.studioRole)
      : parsed.data.roleName;

    if (!isAdmin && nextBaseRoleFromStudio === "admin") {
      return apiForbidden(
        "Only administrators can assign administrator-level roles."
      );
    }

    // Prevent self-lockout
    if (
      id === auth.session.userId &&
      (parsed.data.status === "disabled" ||
        (nextBaseRoleFromStudio && nextBaseRoleFromStudio !== "admin"))
    ) {
      return apiForbidden(
        "You cannot disable or downgrade your own active administrator account."
      );
    }

    const [existingUser] = await db
      .select({
        id: users.id,
        emailNormalized: users.emailNormalized,
        studioRole: users.studioRole,
        status: users.status,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      return apiNotFound("Team member not found.");
    }

    const shouldRevokeSessions =
      Boolean(parsed.data.revokeAllSessions) ||
      parsed.data.status === "disabled";

    await db.transaction(async (tx) => {
      const updateFields: Partial<typeof users.$inferInsert> = {
        updatedAt: new Date(),
      };

      if (parsed.data.displayName !== undefined) {
        updateFields.displayName = parsed.data.displayName;
      }
      if (parsed.data.studioRole !== undefined) {
        updateFields.studioRole = parsed.data.studioRole;
      }
      if (parsed.data.department !== undefined) {
        updateFields.department = parsed.data.department;
      }
      if (parsed.data.jobTitle !== undefined) {
        updateFields.jobTitle = parsed.data.jobTitle ?? "";
      }
      if (parsed.data.phone !== undefined) {
        updateFields.phone = parsed.data.phone ?? "";
      }
      if (parsed.data.status !== undefined) {
        updateFields.status = parsed.data.status;
      }

      await tx.update(users).set(updateFields).where(eq(users.id, id));

      if (nextBaseRoleFromStudio) {
        await syncUserBaseRole(tx, id, nextBaseRoleFromStudio);
      }

      if (shouldRevokeSessions) {
        await tx
          .update(sessions)
          .set({ revokedAt: new Date() })
          .where(and(eq(sessions.userId, id), isNull(sessions.revokedAt)));
      }
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: shouldRevokeSessions && !parsed.data.studioRole && !parsed.data.status
        ? "team.sessions.revoked"
        : "team.member.updated",
      entityType: "user",
      entityId: id,
      metadata: {
        targetEmail: existingUser.emailNormalized,
        updatedFields: parsed.data,
        sessionsRevoked: shouldRevokeSessions,
      },
    });

    return apiOk({ updated: true, sessionsRevoked: shouldRevokeSessions });
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/team/[id]");
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
      return apiBadRequest("Invalid user identifier.");
    }

    if (id === auth.session.userId) {
      return apiForbidden("You cannot remove your own active administrator account.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureTeamDefaultsBootstrapped(db);

    const isAdmin = auth.session.roles.includes("admin");
    const canDelete =
      isAdmin ||
      (await hasModulePermission(db, auth.session.userId, "team", "delete"));
    if (!canDelete) {
      return apiForbidden("You do not have permission to remove team members.");
    }

    const [existingUser] = await db
      .select({
        id: users.id,
        emailNormalized: users.emailNormalized,
        removedAt: users.removedAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      return apiNotFound("Team member not found.");
    }

    // Soft-remove user while preserving historical tasks, comments, and project attribution
    await db.transaction(async (tx) => {
      const now = new Date();
      await tx
        .update(users)
        .set({
          status: "disabled",
          removedAt: now,
          updatedAt: now,
        })
        .where(eq(users.id, id));

      await tx
        .update(sessions)
        .set({ revokedAt: now })
        .where(and(eq(sessions.userId, id), isNull(sessions.revokedAt)));

      await tx
        .update(teamInvitations)
        .set({ status: "revoked" })
        .where(
          and(
            eq(teamInvitations.userId, id),
            eq(teamInvitations.status, "pending")
          )
        );
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "team.member.removed",
      entityType: "user",
      entityId: id,
      metadata: {
        targetEmail: existingUser.emailNormalized,
        attributionPreserved: true,
      },
    });

    return apiOk({ removed: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/team/[id]");
  }
}
