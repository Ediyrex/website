import { unlink } from "node:fs/promises";
import path from "node:path";
import { eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  getDb,
  mediaAssets,
  projectMedia,
  projects,
  services,
} from "@/db";
import {
  apiBadRequest,
  apiError,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { mediaUpdateSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid media asset ID.");

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid media identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = mediaUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid media update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [updated] = await db
      .update(mediaAssets)
      .set({
        altText: parsed.data.altText,
        caption: parsed.data.caption || null,
      })
      .where(eq(mediaAssets.id, id))
      .returning();

    if (!updated) {
      return apiNotFound("Media asset not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "media.updated",
      entityType: "media_asset",
      entityId: id,
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/media/[id]");
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid media identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existing] = await db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.id, id))
      .limit(1);

    if (!existing) {
      return apiNotFound("Media asset not found.");
    }

    const [[coverCount], [galleryCount], [serviceCount]] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(projects)
        .where(eq(projects.coverAssetId, id)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(projectMedia)
        .where(eq(projectMedia.mediaAssetId, id)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(services)
        .where(eq(services.coverAssetId, id)),
    ]);

    const totalRefs =
      (coverCount?.count ?? 0) +
      (galleryCount?.count ?? 0) +
      (serviceCount?.count ?? 0);

    if (totalRefs > 0) {
      return apiError(
        "Conflict",
        "Media asset is currently attached to one or more projects or services. Detach it before deleting.",
        409
      );
    }

    await db.delete(mediaAssets).where(eq(mediaAssets.id, id));

    if (
      existing.storageProvider === "local" &&
      existing.providerPublicId &&
      !existing.providerPublicId.includes("..")
    ) {
      const localPath = path.join(
        process.cwd(),
        "public",
        "uploads",
        "cms",
        path.basename(existing.providerPublicId)
      );
      await unlink(localPath).catch(() => {});
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "media.deleted",
      entityType: "media_asset",
      entityId: id,
    });

    return apiOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/media/[id]");
  }
}

