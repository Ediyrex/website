import { randomBytes } from "node:crypto";
import { and, asc, desc, eq, gt, isNull } from "drizzle-orm";
import type { NextRequest } from "next/server";
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
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { hashSessionToken, requireAdminRole } from "@/lib/server/session";
import {
  ensureTeamDefaultsBootstrapped,
  hasCapability,
  hasModulePermission,
  resolveBaseRole,
  syncUserBaseRole,
} from "@/lib/server/team-rbac";
import { teamInviteCreateSchema } from "@/lib/validations/cms";

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureTeamDefaultsBootstrapped(db);

    const canViewTeam = await hasModulePermission(
      db,
      auth.session.userId,
      "team",
      "view"
    );
    if (!canViewTeam) {
      return apiForbidden("You do not have permission to view team members.");
    }

    const now = new Date();

    const [
      userRows,
      roleAssignments,
      roleDefs,
      projectMemberRows,
      taskRows,
      activeSessionRows,
      invitationRows,
      groupRows,
      groupMemberRows,
      pmsProjectRows,
      recentAuditRows,
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
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        })
        .from(users)
        .where(isNull(users.removedAt))
        .orderBy(asc(users.createdAt))
        .limit(100),
      db
        .select({
          userId: userRoles.userId,
          roleName: roles.name,
        })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id)),
      db
        .select()
        .from(teamRoleDefinitions)
        .orderBy(asc(teamRoleDefinitions.createdAt)),
      db
        .select({
          userId: pmsProjectMembers.userId,
          projectId: pmsProjectMembers.projectId,
          projectRole: pmsProjectMembers.projectRole,
          projectTitle: pmsProjects.title,
        })
        .from(pmsProjectMembers)
        .innerJoin(pmsProjects, eq(pmsProjectMembers.projectId, pmsProjects.id))
        .where(eq(pmsProjectMembers.membershipStatus, "active")),
      db
        .select({
          assigneeUserId: studioTasks.assigneeUserId,
          completed: studioTasks.completed,
        })
        .from(studioTasks),
      db
        .select({
          userId: sessions.userId,
        })
        .from(sessions)
        .where(and(isNull(sessions.revokedAt), gt(sessions.expiresAt, now))),
      db
        .select({
          id: teamInvitations.id,
          userId: teamInvitations.userId,
          emailNormalized: teamInvitations.emailNormalized,
          fullName: teamInvitations.fullName,
          studioRole: teamInvitations.studioRole,
          department: teamInvitations.department,
          projectId: teamInvitations.projectId,
          projectRole: teamInvitations.projectRole,
          status: teamInvitations.status,
          expiresAt: teamInvitations.expiresAt,
          acceptedAt: teamInvitations.acceptedAt,
          createdAt: teamInvitations.createdAt,
        })
        .from(teamInvitations)
        .orderBy(desc(teamInvitations.createdAt))
        .limit(50),
      db.select().from(accessGroups).orderBy(asc(accessGroups.name)),
      db.select().from(accessGroupMembers),
      db
        .select({
          id: pmsProjects.id,
          referenceCode: pmsProjects.referenceCode,
          title: pmsProjects.title,
          status: pmsProjects.status,
        })
        .from(pmsProjects)
        .orderBy(asc(pmsProjects.title))
        .limit(50),
      db
        .select({
          id: auditLogs.id,
          actorUserId: auditLogs.actorUserId,
          actorEmailSnapshot: auditLogs.actorEmailSnapshot,
          action: auditLogs.action,
          entityType: auditLogs.entityType,
          entityId: auditLogs.entityId,
          metadata: auditLogs.metadata,
          createdAt: auditLogs.createdAt,
        })
        .from(auditLogs)
        .orderBy(desc(auditLogs.createdAt))
        .limit(60),
    ]);

    const rolesByUser = new Map<string, string[]>();
    for (const row of roleAssignments) {
      const list = rolesByUser.get(row.userId) ?? [];
      list.push(row.roleName);
      rolesByUser.set(row.userId, list);
    }

    const projectsByUser = new Map<
      string,
      Array<{ projectId: string; projectTitle: string; projectRole: string }>
    >();
    for (const row of projectMemberRows) {
      const list = projectsByUser.get(row.userId) ?? [];
      list.push({
        projectId: row.projectId,
        projectTitle: row.projectTitle,
        projectRole: row.projectRole,
      });
      projectsByUser.set(row.userId, list);
    }

    const tasksByUser = new Map<string, { total: number; open: number }>();
    for (const t of taskRows) {
      if (!t.assigneeUserId) continue;
      const entry = tasksByUser.get(t.assigneeUserId) ?? { total: 0, open: 0 };
      entry.total += 1;
      if (!t.completed) entry.open += 1;
      tasksByUser.set(t.assigneeUserId, entry);
    }

    const sessionsByUser = new Map<string, number>();
    for (const s of activeSessionRows) {
      sessionsByUser.set(s.userId, (sessionsByUser.get(s.userId) ?? 0) + 1);
    }

    const groupsById = new Map(groupRows.map((g) => [g.id, g]));
    const groupsByUser = new Map<
      string,
      Array<{ id: string; name: string; division: string }>
    >();
    for (const gm of groupMemberRows) {
      const group = groupsById.get(gm.groupId);
      if (!group) continue;
      const list = groupsByUser.get(gm.userId) ?? [];
      list.push({ id: group.id, name: group.name, division: group.division });
      groupsByUser.set(gm.userId, list);
    }

    const roleNameByKey = new Map(roleDefs.map((r) => [r.key, r.name]));

    const members = userRows.map((u) => {
      const userProjects = projectsByUser.get(u.id) ?? [];
      const taskStats = tasksByUser.get(u.id) ?? { total: 0, open: 0 };
      return {
        ...u,
        studioRoleLabel: roleNameByKey.get(u.studioRole) ?? u.studioRole,
        roles: rolesByUser.get(u.id) ?? [],
        pmsProjectsCount: userProjects.length,
        pmsProjects: userProjects,
        assignedTasksCount: taskStats.total,
        openTasksCount: taskStats.open,
        activeSessionsCount: sessionsByUser.get(u.id) ?? 0,
        accessGroups: groupsByUser.get(u.id) ?? [],
      };
    });

    const invitations = invitationRows.map((inv) => {
      const effectiveStatus =
        inv.status === "pending" && inv.expiresAt < now ? "expired" : inv.status;
      return {
        ...inv,
        status: effectiveStatus,
        studioRoleLabel: roleNameByKey.get(inv.studioRole) ?? inv.studioRole,
      };
    });

    const activeCount = members.filter((m) => m.status === "active").length;
    const pendingInvitesCount = invitations.filter(
      (i) => i.status === "pending"
    ).length;
    const invitedMembersCount = members.filter(
      (m) => m.status === "invited"
    ).length;
    const suspendedCount = members.filter((m) => m.status === "disabled").length;

    const departmentSet = new Set(
      members
        .map((m) => m.department.trim())
        .filter((d) => d.length > 0)
    );
    for (const g of groupRows) {
      if (g.division.trim()) departmentSet.add(g.division.trim());
    }

    const roleCountMap = new Map<string, number>();
    for (const m of members) {
      roleCountMap.set(m.studioRole, (roleCountMap.get(m.studioRole) ?? 0) + 1);
    }

    const roleBreakdown = roleDefs.map((def) => ({
      key: def.key,
      name: def.name,
      baseRole: def.baseRole,
      count: roleCountMap.get(def.key) ?? 0,
    }));

    return apiOk({
      members,
      invitations,
      roles: roleDefs,
      roleBreakdown,
      pmsProjectsList: pmsProjectRows,
      departments: Array.from(departmentSet).sort(),
      kpis: {
        totalMembers: members.length,
        activeMembers: activeCount,
        pendingInvitations: Math.max(pendingInvitesCount, invitedMembersCount),
        suspendedMembers: suspendedCount,
        departmentsCount: departmentSet.size,
      },
      activityLogs: recentAuditRows,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/team");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureTeamDefaultsBootstrapped(db);

    const isAdmin = auth.session.roles.includes("admin");
    const canInvite =
      isAdmin || (await hasCapability(db, auth.session.userId, "inviteUsers"));
    if (!canInvite) {
      return apiForbidden("You do not have permission to invite team members.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = teamInviteCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid team invitation payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const emailNormalized = parsed.data.email.trim().toLowerCase();
    const targetBaseRole = await resolveBaseRole(db, parsed.data.studioRole);

    if (!isAdmin && targetBaseRole === "admin") {
      return apiForbidden(
        "Only administrators can assign administrator-level roles."
      );
    }

    const [existingUser] = await db
      .select({
        id: users.id,
        removedAt: users.removedAt,
      })
      .from(users)
      .where(eq(users.emailNormalized, emailNormalized))
      .limit(1);

    if (existingUser && !existingUser.removedAt) {
      return apiBadRequest(
        "A team member with this email already exists in the studio."
      );
    }

    const rawToken = randomBytes(24).toString("hex");
    const tokenHash = hashSessionToken(rawToken);
    const expiresAt = new Date(
      Date.now() + parsed.data.expiryDays * 24 * 60 * 60 * 1000
    );

    const createdResult = await db.transaction(async (tx) => {
      let userId: string;

      if (existingUser && existingUser.removedAt) {
        userId = existingUser.id;
        await tx
          .update(users)
          .set({
            displayName: parsed.data.fullName,
            status: "invited",
            studioRole: parsed.data.studioRole,
            department: parsed.data.department,
            jobTitle: parsed.data.jobTitle ?? "",
            phone: parsed.data.phone ?? "",
            removedAt: null,
            updatedAt: new Date(),
          })
          .where(eq(users.id, userId));
      } else {
        const [insertedUser] = await tx
          .insert(users)
          .values({
            emailNormalized,
            displayName: parsed.data.fullName,
            status: "invited",
            studioRole: parsed.data.studioRole,
            department: parsed.data.department,
            jobTitle: parsed.data.jobTitle ?? "",
            phone: parsed.data.phone ?? "",
          })
          .returning({ id: users.id });
        userId = insertedUser.id;
      }

      await syncUserBaseRole(tx, userId, targetBaseRole);

      const [invitation] = await tx
        .insert(teamInvitations)
        .values({
          userId,
          emailNormalized,
          fullName: parsed.data.fullName,
          studioRole: parsed.data.studioRole,
          department: parsed.data.department,
          projectId: parsed.data.projectId ?? null,
          projectRole: parsed.data.projectRole,
          tokenHash,
          status: "pending",
          expiresAt,
          invitedByUserId: auth.session.userId,
        })
        .returning({
          id: teamInvitations.id,
          userId: teamInvitations.userId,
          emailNormalized: teamInvitations.emailNormalized,
          fullName: teamInvitations.fullName,
          studioRole: teamInvitations.studioRole,
          department: teamInvitations.department,
          status: teamInvitations.status,
          expiresAt: teamInvitations.expiresAt,
          createdAt: teamInvitations.createdAt,
        });

      if (parsed.data.projectId) {
        await tx
          .insert(pmsProjectMembers)
          .values({
            projectId: parsed.data.projectId,
            userId,
            projectRole: parsed.data.projectRole,
            membershipStatus: "active",
          })
          .onConflictDoUpdate({
            target: [pmsProjectMembers.projectId, pmsProjectMembers.userId],
            set: {
              projectRole: parsed.data.projectRole,
              membershipStatus: "active",
            },
          });
      }

      const [matchingGroup] = await tx
        .select({ id: accessGroups.id })
        .from(accessGroups)
        .where(eq(accessGroups.division, parsed.data.department))
        .limit(1);

      if (matchingGroup) {
        await tx
          .insert(accessGroupMembers)
          .values({
            groupId: matchingGroup.id,
            userId,
          })
          .onConflictDoNothing();
      }

      return { userId, invitation };
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "team.member.invited",
      entityType: "user",
      entityId: createdResult.userId,
      metadata: {
        email: emailNormalized,
        studioRole: parsed.data.studioRole,
        department: parsed.data.department,
        projectId: parsed.data.projectId ?? null,
      },
    });

    const origin = request.nextUrl.origin;
    const inviteUrl = `${origin}/admin/login?invite=${rawToken}&email=${encodeURIComponent(
      emailNormalized
    )}`;

    return apiOk(
      {
        userId: createdResult.userId,
        invitation: createdResult.invitation,
        inviteUrl,
      },
      undefined,
      201
    );
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/team");
  }
}
