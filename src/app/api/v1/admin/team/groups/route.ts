import { and, asc, eq, inArray, isNull, ne } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb } from "@/db";
import { accessGroupMembers, accessGroups, users } from "@/db/schema/auth";
import {
  accessGroupProjectAccess,
  pmsProjectMembers,
  pmsProjects,
} from "@/db/schema/pms";
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
  hasModulePermission,
} from "@/lib/server/team-rbac";
import { accessGroupActionSchema } from "@/lib/validations/cms";

const ALL_BOARDS = [
  "backlog",
  "todo",
  "in_progress",
  "in_review",
  "done",
] as const;

function slugifyGroupName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);
}

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

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
    if (!canView) {
      return apiForbidden("You do not have permission to view access groups.");
    }

    const [groups, memberLinks, projectAccessRows, projectRows] =
      await Promise.all([
        db.select().from(accessGroups).orderBy(asc(accessGroups.name)),
        db
          .select({
            groupId: accessGroupMembers.groupId,
            userId: users.id,
            displayName: users.displayName,
            emailNormalized: users.emailNormalized,
            studioRole: users.studioRole,
            status: users.status,
            avatarUrl: users.avatarUrl,
          })
          .from(accessGroupMembers)
          .innerJoin(users, eq(accessGroupMembers.userId, users.id))
          .where(isNull(users.removedAt)),
        db.select().from(accessGroupProjectAccess),
        db
          .select({
            id: pmsProjects.id,
            referenceCode: pmsProjects.referenceCode,
            title: pmsProjects.title,
            status: pmsProjects.status,
          })
          .from(pmsProjects)
          .where(ne(pmsProjects.status, "archived"))
          .orderBy(asc(pmsProjects.title)),
      ]);

    const membersByGroup = new Map<
      string,
      Array<{
        userId: string;
        displayName: string;
        emailNormalized: string;
        studioRole: string;
        status: string;
        avatarUrl: string | null;
      }>
    >();

    for (const row of memberLinks) {
      const list = membersByGroup.get(row.groupId) ?? [];
      list.push({
        userId: row.userId,
        displayName: row.displayName,
        emailNormalized: row.emailNormalized,
        studioRole: row.studioRole,
        status: row.status,
        avatarUrl: row.avatarUrl,
      });
      membersByGroup.set(row.groupId, list);
    }

    const accessByGroup = new Map<
      string,
      Array<{
        id: string;
        projectId: string;
        projectRole: string;
        allowedBoards: string[];
        boardRoles: Record<string, string>;
      }>
    >();

    for (const row of projectAccessRows) {
      const list = accessByGroup.get(row.groupId) ?? [];
      list.push({
        id: row.id,
        projectId: row.projectId,
        projectRole: row.projectRole,
        allowedBoards: row.allowedBoards ?? [...ALL_BOARDS],
        boardRoles: row.boardRoles ?? {},
      });
      accessByGroup.set(row.groupId, list);
    }

    return apiOk({
      groups: groups.map((g) => ({
        ...g,
        members: membersByGroup.get(g.id) ?? [],
        projectAccess: accessByGroup.get(g.id) ?? [],
      })),
      projects: projectRows,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/team/groups");
  }
}

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

    const parsed = accessGroupActionSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid access group payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    if (parsed.data.action === "create_group") {
      const baseSlug = slugifyGroupName(parsed.data.name) || "studio-group";
      const [existing] = await db
        .select({ id: accessGroups.id })
        .from(accessGroups)
        .where(eq(accessGroups.slug, baseSlug))
        .limit(1);

      const finalSlug = existing
        ? `${baseSlug}-${Date.now().toString(36).slice(-4)}`
        : baseSlug;

      const [created] = await db
        .insert(accessGroups)
        .values({
          name: parsed.data.name,
          slug: finalSlug,
          division: parsed.data.division,
          description: parsed.data.description,
          defaultStudioRole: parsed.data.defaultStudioRole,
        })
        .returning();

      await recordAuditLog({
        actorUserId: auth.session.userId,
        actorEmailSnapshot: auth.session.email,
        action: "team.access_group.created",
        entityType: "access_group",
        entityId: created.id,
        metadata: { name: created.name, division: created.division },
      });

      return apiOk(created, undefined, 201);
    }

    if (parsed.data.action === "update_group") {
      const [updated] = await db
        .update(accessGroups)
        .set({
          name: parsed.data.name,
          division: parsed.data.division,
          description: parsed.data.description,
          defaultStudioRole: parsed.data.defaultStudioRole,
          updatedAt: new Date(),
        })
        .where(eq(accessGroups.id, parsed.data.groupId))
        .returning();

      await recordAuditLog({
        actorUserId: auth.session.userId,
        actorEmailSnapshot: auth.session.email,
        action: "team.access_group.updated",
        entityType: "access_group",
        entityId: parsed.data.groupId,
        metadata: { name: parsed.data.name, division: parsed.data.division },
      });

      return apiOk(updated);
    }

    if (parsed.data.action === "add_member") {
      const { groupId, userId } = parsed.data;
      await db.transaction(async (tx) => {
        await tx
          .insert(accessGroupMembers)
          .values({
            groupId,
            userId,
          })
          .onConflictDoNothing();

        // Sync any existing group project access rules to the newly added member
        const rules = await tx
          .select()
          .from(accessGroupProjectAccess)
          .where(
            and(
              eq(accessGroupProjectAccess.groupId, groupId),
              ne(accessGroupProjectAccess.projectRole, "no_access")
            )
          );

        for (const rule of rules) {
          await tx
            .insert(pmsProjectMembers)
            .values({
              projectId: rule.projectId,
              userId,
              projectRole: rule.projectRole,
              membershipStatus: "active",
            })
            .onConflictDoNothing();
        }
      });

      await recordAuditLog({
        actorUserId: auth.session.userId,
        actorEmailSnapshot: auth.session.email,
        action: "team.access_group.member_added",
        entityType: "access_group",
        entityId: parsed.data.groupId,
        metadata: { userId: parsed.data.userId },
      });

      return apiOk({ added: true });
    }

    if (parsed.data.action === "remove_member") {
      await db
        .delete(accessGroupMembers)
        .where(
          and(
            eq(accessGroupMembers.groupId, parsed.data.groupId),
            eq(accessGroupMembers.userId, parsed.data.userId)
          )
        );

      await recordAuditLog({
        actorUserId: auth.session.userId,
        actorEmailSnapshot: auth.session.email,
        action: "team.access_group.member_removed",
        entityType: "access_group",
        entityId: parsed.data.groupId,
        metadata: { userId: parsed.data.userId },
      });

      return apiOk({ removed: true });
    }

    if (parsed.data.action === "set_project_access") {
      const { groupId, projectId, projectRole } = parsed.data;
      const resolvedBoardRoles: Record<string, string> = {
        ...(parsed.data.boardRoles ?? {}),
      };
      for (const board of ALL_BOARDS) {
        if (!resolvedBoardRoles[board]) {
          resolvedBoardRoles[board] = projectRole;
        }
      }

      const resolvedAllowedBoards =
        projectRole === "no_access"
          ? []
          : parsed.data.allowedBoards ??
            ALL_BOARDS.filter((b) => resolvedBoardRoles[b] !== "no_access");

      await db.transaction(async (tx) => {
        await tx
          .insert(accessGroupProjectAccess)
          .values({
            groupId,
            projectId,
            projectRole,
            allowedBoards: resolvedAllowedBoards,
            boardRoles: resolvedBoardRoles,
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [
              accessGroupProjectAccess.groupId,
              accessGroupProjectAccess.projectId,
            ],
            set: {
              projectRole,
              allowedBoards: resolvedAllowedBoards,
              boardRoles: resolvedBoardRoles,
              updatedAt: new Date(),
            },
          });

        const groupMembers = await tx
          .select({ userId: accessGroupMembers.userId })
          .from(accessGroupMembers)
          .where(eq(accessGroupMembers.groupId, groupId));

        if (groupMembers.length > 0) {
          const memberIds = groupMembers.map((m) => m.userId);
          if (projectRole !== "no_access") {
            for (const uid of memberIds) {
              await tx
                .insert(pmsProjectMembers)
                .values({
                  projectId,
                  userId: uid,
                  projectRole,
                  membershipStatus: "active",
                })
                .onConflictDoUpdate({
                  target: [pmsProjectMembers.projectId, pmsProjectMembers.userId],
                  set: {
                    projectRole,
                    membershipStatus: "active",
                  },
                });
            }
          } else {
            // Only deactivate if no other access group grants active project access
            const otherActiveRules = await tx
              .select({ groupId: accessGroupProjectAccess.groupId })
              .from(accessGroupProjectAccess)
              .where(
                and(
                  eq(accessGroupProjectAccess.projectId, projectId),
                  ne(accessGroupProjectAccess.groupId, groupId),
                  ne(accessGroupProjectAccess.projectRole, "no_access")
                )
              );

            const otherGroupIds = otherActiveRules.map((r) => r.groupId);
            const protectedUserIds = new Set<string>();
            if (otherGroupIds.length > 0) {
              const protectedRows = await tx
                .select({ userId: accessGroupMembers.userId })
                .from(accessGroupMembers)
                .where(inArray(accessGroupMembers.groupId, otherGroupIds));
              for (const r of protectedRows) {
                protectedUserIds.add(r.userId);
              }
            }

            const toDeactivate = memberIds.filter(
              (uid) => !protectedUserIds.has(uid)
            );
            if (toDeactivate.length > 0) {
              await tx
                .update(pmsProjectMembers)
                .set({ membershipStatus: "inactive" })
                .where(
                  and(
                    eq(pmsProjectMembers.projectId, projectId),
                    inArray(pmsProjectMembers.userId, toDeactivate)
                  )
                );
            }
          }
        }
      });

      await recordAuditLog({
        actorUserId: auth.session.userId,
        actorEmailSnapshot: auth.session.email,
        action: "team.access_group.project_access_updated",
        entityType: "access_group",
        entityId: groupId,
        metadata: {
          projectId,
          projectRole,
          boardsCount: resolvedAllowedBoards.length,
        },
      });

      return apiOk({
        updated: true,
        projectId,
        projectRole,
        allowedBoards: resolvedAllowedBoards,
        boardRoles: resolvedBoardRoles,
      });
    }

    // delete_group
    await db
      .delete(accessGroups)
      .where(eq(accessGroups.id, parsed.data.groupId));

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "team.access_group.deleted",
      entityType: "access_group",
      entityId: parsed.data.groupId,
      metadata: {},
    });

    return apiOk({ deleted: true });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/team/groups");
  }
}
