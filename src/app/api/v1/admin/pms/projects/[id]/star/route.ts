import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb, pmsStarredProjects } from "@/db";
import { getProjectPermissions } from "@/lib/pms/permissions";
import {
  apiBadRequest,
  apiForbidden,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";

const uuidSchema = z.string().uuid("Invalid project identifier.");

export async function POST(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid project identifier.");
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const perms = await getProjectPermissions(db, auth.session, id);
    if (!perms.exists) return apiNotFound("PMS project not found.");
    if (!perms.canView) {
      return apiForbidden("You do not have access to this project.");
    }

    const [existing] = await db
      .select()
      .from(pmsStarredProjects)
      .where(
        and(
          eq(pmsStarredProjects.projectId, id),
          eq(pmsStarredProjects.userId, auth.session.userId)
        )
      )
      .limit(1);

    if (existing) {
      await db
        .delete(pmsStarredProjects)
        .where(
          and(
            eq(pmsStarredProjects.projectId, id),
            eq(pmsStarredProjects.userId, auth.session.userId)
          )
        );
      return apiOk({ isStarred: false });
    }

    await db.insert(pmsStarredProjects).values({
      projectId: id,
      userId: auth.session.userId,
    });
    return apiOk({ isStarred: true });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/projects/[id]/star");
  }
}

