import { asc, eq } from "drizzle-orm";
import { getDb, roles, userRoles, users } from "@/db";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [userRows, roleAssignments] = await Promise.all([
      db
        .select({
          id: users.id,
          emailNormalized: users.emailNormalized,
          displayName: users.displayName,
          status: users.status,
          lastLoginAt: users.lastLoginAt,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(asc(users.createdAt))
        .limit(50),
      db
        .select({
          userId: userRoles.userId,
          roleName: roles.name,
        })
        .from(userRoles)
        .innerJoin(roles, eq(userRoles.roleId, roles.id)),
    ]);

    const rolesByUser = new Map<string, string[]>();
    for (const assignment of roleAssignments) {
      const existing = rolesByUser.get(assignment.userId) ?? [];
      existing.push(assignment.roleName);
      rolesByUser.set(assignment.userId, existing);
    }

    const combined = userRows.map((u) => ({
      ...u,
      roles: rolesByUser.get(u.id) ?? [],
    }));

    return apiOk(combined);
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/team");
  }
}

