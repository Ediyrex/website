import { inArray, or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  blogPosts,
  cmsPages,
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

      return apiOk({ affected: ids.length, updated: ids.length, folder });
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

      return apiOk({ affected: existing.length, updated: existing.length, tag });
    }

    // Bulk delete (verify none are referenced by any CMS pages, projects, services, or blog posts)
    const [[pRefs], [gRefs], [sRefs], [bRefs], [pgRefs]] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(projects)
        .where(or(inArray(projects.coverAssetId, ids), inArray(projects.ogImageAssetId, ids))),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(projectMedia)
        .where(inArray(projectMedia.mediaAssetId, ids)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(services)
        .where(or(inArray(services.coverAssetId, ids), inArray(services.ogImageAssetId, ids))),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(blogPosts)
        .where(or(inArray(blogPosts.coverAssetId, ids), inArray(blogPosts.ogImageAssetId, ids))),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(cmsPages)
        .where(or(inArray(cmsPages.thumbnailAssetId, ids), inArray(cmsPages.ogImageAssetId, ids))),
    ]);

    const refTotal =
      (pRefs?.count ?? 0) +
      (gRefs?.count ?? 0) +
      (sRefs?.count ?? 0) +
      (bRefs?.count ?? 0) +
      (pgRefs?.count ?? 0);

    if (refTotal > 0) {
      return apiError(
        "Conflict",
        "One or more selected assets are referenced by pages, projects, services, or blog posts. Detach them first.",
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

    return apiOk({ affected: ids.length, deleted: ids.length });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/media/bulk");
  }
}

