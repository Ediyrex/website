import { inArray, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  blogPosts,
  getDb,
  mediaAssets,
  projectMedia,
  projects,
  services,
} from "@/db";
import {
  apiBadRequest,
  apiError,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { mediaBulkActionSchema } from "@/lib/validations/cms";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = mediaBulkActionSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid bulk media action payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const { ids, action, folder, tag } = parsed.data;

    if (action === "move_folder") {
      if (!folder) {
        return apiBadRequest("Target folder name is required.");
      }
      await db
        .update(mediaAssets)
        .set({ folder })
        .where(inArray(mediaAssets.id, ids));

      await recordAuditLog({
        actorUserId: auth.session.userId,
        actorEmailSnapshot: auth.session.email,
        action: "media.bulk_moved",
        entityType: "media_asset",
        metadata: { count: ids.length, folder },
      });

      return apiOk({ updated: ids.length, folder });
    }

    if (action === "add_tag") {
      if (!tag) {
        return apiBadRequest("Tag value is required.");
      }
      const existing = await db
        .select({ id: mediaAssets.id, tags: mediaAssets.tags })
        .from(mediaAssets)
        .where(inArray(mediaAssets.id, ids));

      await db.transaction(async (tx) => {
        for (const row of existing) {
          const merged = Array.from(new Set([...(row.tags || []), tag])).slice(
            0,
            20
          );
          await tx
            .update(mediaAssets)
            .set({ tags: merged })
            .where(inArray(mediaAssets.id, [row.id]));
        }
      });

      return apiOk({ updated: existing.length, tag });
    }

    // Bulk delete (verify none are referenced as required assets)
    const [[pRefs], [gRefs], [sRefs], [bRefs]] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(projects)
        .where(inArray(projects.coverAssetId, ids)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(projectMedia)
        .where(inArray(projectMedia.mediaAssetId, ids)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(services)
        .where(inArray(services.coverAssetId, ids)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(blogPosts)
        .where(inArray(blogPosts.coverAssetId, ids)),
    ]);

    const refTotal =
      (pRefs?.count ?? 0) +
      (gRefs?.count ?? 0) +
      (sRefs?.count ?? 0) +
      (bRefs?.count ?? 0);

    if (refTotal > 0) {
      return apiError(
        "Conflict",
        "One or more selected assets are currently attached to projects, services, or blog posts.",
        409
      );
    }

    await db.delete(mediaAssets).where(inArray(mediaAssets.id, ids));

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "media.bulk_deleted",
      entityType: "media_asset",
      metadata: { count: ids.length },
    });

    return apiOk({ deleted: ids.length });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/media/bulk");
  }
}

