import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb, roles, userRoles, users } from "@/db";
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
import { teamMemberUpdateSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid user ID.");

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid user identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = teamMemberUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid team member update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    // Prevent self-lockout
    if (
      id === auth.session.userId &&
      (parsed.data.status === "disabled" ||
        (parsed.data.roleName && parsed.data.roleName !== "admin"))
    ) {
      return apiForbidden(
        "You cannot disable or downgrade your own active administrator account."
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existingUser] = await db
      .select({ id: users.id, emailNormalized: users.emailNormalized })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      return apiNotFound("Team member not found.");
    }

    await db.transaction(async (tx) => {
      if (parsed.data.status) {
        await tx
          .update(users)
          .set({ status: parsed.data.status })
          .where(eq(users.id, id));
      }

      if (parsed.data.roleName) {
        const [targetRole] = await tx
          .select({ id: roles.id })
          .from(roles)
          .where(eq(roles.name, parsed.data.roleName))
          .limit(1);

        if (targetRole) {
          await tx.delete(userRoles).where(eq(userRoles.userId, id));
          await tx.insert(userRoles).values({
            userId: id,
            roleId: targetRole.id,
          });
        }
      }
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "team.member_updated",
      entityType: "user",
      entityId: id,
      metadata: parsed.data,
    });

    return apiOk({ updated: true, id });
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/team/[id]");
  }
}

