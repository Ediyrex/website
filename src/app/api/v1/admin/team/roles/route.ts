import { asc, eq, isNull } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb } from "@/db";
import { teamRoleDefinitions, users } from "@/db/schema/auth";
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
  buildEmptyPermissions,
  ensureTeamDefaultsBootstrapped,
  hasModulePermission,
} from "@/lib/server/team-rbac";
import {
  teamCustomRoleCreateSchema,
  teamRolePermissionsSaveSchema,
} from "@/lib/validations/cms";

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
      return apiForbidden("You do not have permission to view roles.");
    }

    const [roleDefs, activeMembers] = await Promise.all([
      db
        .select()
        .from(teamRoleDefinitions)
        .orderBy(asc(teamRoleDefinitions.createdAt)),
      db
        .select({ studioRole: users.studioRole })
        .from(users)
        .where(isNull(users.removedAt)),
    ]);

    const counts = new Map<string, number>();
    for (const member of activeMembers) {
      counts.set(member.studioRole, (counts.get(member.studioRole) ?? 0) + 1);
    }

    return apiOk({
      roles: roleDefs.map((r) => ({
        ...r,
        memberCount: counts.get(r.key) ?? 0,
      })),
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/team/roles");
  }
}

export async function PUT(request: NextRequest) {
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

    const parsed = teamRolePermissionsSaveSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid role permissions payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const [existing] = await db
      .select()
      .from(teamRoleDefinitions)
      .where(eq(teamRoleDefinitions.key, parsed.data.key))
      .limit(1);

    if (!existing) {
      return apiNotFound("Role definition not found.");
    }

    if (existing.key === "super_admin") {
      return apiForbidden(
        "Super Admin safeguards cannot be restricted to prevent studio lockout."
      );
    }

    const [updated] = await db
      .update(teamRoleDefinitions)
      .set({
        name: parsed.data.name ?? existing.name,
        description: parsed.data.description ?? existing.description,
        baseRole: parsed.data.baseRole ?? existing.baseRole,
        permissions: parsed.data.permissions,
        updatedAt: new Date(),
      })
      .where(eq(teamRoleDefinitions.key, existing.key))
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "team.role.permissions_updated",
      entityType: "team_role_definition",
      entityId: updated.id,
      metadata: {
        roleKey: updated.key,
        roleName: updated.name,
      },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PUT /api/v1/admin/team/roles");
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

    const parsed = teamCustomRoleCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid custom role payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const [existing] = await db
      .select({ id: teamRoleDefinitions.id })
      .from(teamRoleDefinitions)
      .where(eq(teamRoleDefinitions.key, parsed.data.key))
      .limit(1);

    if (existing) {
      return apiBadRequest("A role with this key already exists.");
    }

    const permissions = parsed.data.permissions ?? buildEmptyPermissions();

    const [created] = await db
      .insert(teamRoleDefinitions)
      .values({
        key: parsed.data.key,
        name: parsed.data.name,
        description: parsed.data.description,
        baseRole: parsed.data.baseRole,
        isSystem: false,
        permissions,
      })
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "team.role.created",
      entityType: "team_role_definition",
      entityId: created.id,
      metadata: {
        roleKey: created.key,
        roleName: created.name,
        baseRole: created.baseRole,
      },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/team/roles");
  }
}
