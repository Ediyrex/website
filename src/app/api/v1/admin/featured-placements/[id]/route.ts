import { and, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { featuredPlacements, getDb, projects } from "@/db";
import {
  apiBadRequest,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";

const uuidSchema = z.string().uuid("Invalid placement ID.");

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid placement identifier.");
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    // Retrieve placement first
    const [placement] = await db
      .select({
        id: featuredPlacements.id,
        projectId: featuredPlacements.projectId,
        destination: featuredPlacements.destination,
        targetId: featuredPlacements.targetId,
        projectTitle: projects.title,
      })
      .from(featuredPlacements)
      .innerJoin(projects, eq(featuredPlacements.projectId, projects.id))
      .where(eq(featuredPlacements.id, id))
      .limit(1);

    if (!placement) {
      return apiNotFound("Featured placement not found.");
    }

    // Delete placement
    await db.delete(featuredPlacements).where(eq(featuredPlacements.id, id));

    // Check if project has any remaining placements
    const remainingPlacements = await db
      .select({ id: featuredPlacements.id })
      .from(featuredPlacements)
      .where(eq(featuredPlacements.projectId, placement.projectId))
      .limit(1);

    if (remainingPlacements.length === 0) {
      // If no other placements, turn off isFeatured flag on the project
      // Crucial: status remains published! Never unpublishes the project!
      await db
        .update(projects)
        .set({ isFeatured: false, updatedAt: new Date() })
        .where(eq(projects.id, placement.projectId));
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      action: "portfolio.placement.deleted",
      entityType: "featured_placement",
      entityId: id,
      metadata: {
        description: `Removed project "${placement.projectTitle}" from ${placement.destination} placement.`,
        placementId: id,
        projectId: placement.projectId,
        destination: placement.destination,
      },
    });

    return apiOk(
      { deleted: true, projectId: placement.projectId },
      { message: "Project removed from featured placement. The project remains published." }
    );
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/featured-placements/[id]");
  }
}
