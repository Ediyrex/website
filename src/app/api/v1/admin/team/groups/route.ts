import { and, asc, eq, isNull } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb } from "@/db";
import { accessGroupMembers, accessGroups, users } from "@/db/schema/auth";
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

    const [groups, memberLinks] = await Promise.all([
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

    return apiOk({
      groups: groups.map((g) => ({
        ...g,
        members: membersByGroup.get(g.id) ?? [],
      })),
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

    if (parsed.data.action === "add_member") {
      await db
        .insert(accessGroupMembers)
        .values({
          groupId: parsed.data.groupId,
          userId: parsed.data.userId,
        })
        .onConflictDoNothing();

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
