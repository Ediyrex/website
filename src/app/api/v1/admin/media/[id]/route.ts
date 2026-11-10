import { unlink } from "node:fs/promises";
import path from "node:path";
import { eq, or } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
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
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { mediaUpdateSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid media asset ID.");

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid media identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [asset] = await db
      .select()
      .from(mediaAssets)
      .where(eq(mediaAssets.id, id))
      .limit(1);

    if (!asset) {
      return apiNotFound("Media asset not found.");
    }

    const [usedInProjects, usedInGallery, usedInServices, usedInBlog, usedInPages] =
      await Promise.all([
        db
          .select({ id: projects.id, title: projects.title, slug: projects.slug })
          .from(projects)
          .where(or(eq(projects.coverAssetId, id), eq(projects.ogImageAssetId, id))),
        db
          .select({ id: projects.id, title: projects.title, slug: projects.slug })
          .from(projectMedia)
          .innerJoin(projects, eq(projectMedia.projectId, projects.id))
          .where(eq(projectMedia.mediaAssetId, id)),
        db
          .select({ id: services.id, title: services.title, slug: services.slug })
          .from(services)
          .where(or(eq(services.coverAssetId, id), eq(services.ogImageAssetId, id))),
        db
          .select({ id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug })
          .from(blogPosts)
          .where(or(eq(blogPosts.coverAssetId, id), eq(blogPosts.ogImageAssetId, id))),
        db
          .select({ id: cmsPages.id, title: cmsPages.title, slug: cmsPages.slug })
          .from(cmsPages)
          .where(or(eq(cmsPages.thumbnailAssetId, id), eq(cmsPages.ogImageAssetId, id))),
      ]);

    return apiOk({
      ...asset,
      usage: [
        ...usedInProjects.map((p) => ({ kind: "Project Cover", ...p })),
        ...usedInGallery.map((p) => ({ kind: "Project Gallery", ...p })),
        ...usedInServices.map((s) => ({ kind: "Service", ...s })),
        ...usedInBlog.map((b) => ({ kind: "Blog Post", ...b })),
        ...usedInPages.map((pg) => ({ kind: "Page", ...pg })),
      ],
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/media/[id]");
  }
}

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

    const updateSet: Record<string, unknown> = {
      altText: parsed.data.altText,
      caption: parsed.data.caption || null,
    };
    if (parsed.data.folder !== undefined) updateSet.folder = parsed.data.folder;
    if (parsed.data.tags !== undefined) updateSet.tags = parsed.data.tags;

    const [updated] = await db
      .update(mediaAssets)
      .set(updateSet)
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

    const [usedInProjects, usedInGallery, usedInServices, usedInBlog, usedInPages] =
      await Promise.all([
        db
          .select({ id: projects.id, title: projects.title, slug: projects.slug })
          .from(projects)
          .where(or(eq(projects.coverAssetId, id), eq(projects.ogImageAssetId, id))),
        db
          .select({ id: projects.id, title: projects.title, slug: projects.slug })
          .from(projectMedia)
          .innerJoin(projects, eq(projectMedia.projectId, projects.id))
          .where(eq(projectMedia.mediaAssetId, id)),
        db
          .select({ id: services.id, title: services.title, slug: services.slug })
          .from(services)
          .where(or(eq(services.coverAssetId, id), eq(services.ogImageAssetId, id))),
        db
          .select({ id: blogPosts.id, title: blogPosts.title, slug: blogPosts.slug })
          .from(blogPosts)
          .where(or(eq(blogPosts.coverAssetId, id), eq(blogPosts.ogImageAssetId, id))),
        db
          .select({ id: cmsPages.id, title: cmsPages.title, slug: cmsPages.slug })
          .from(cmsPages)
          .where(or(eq(cmsPages.thumbnailAssetId, id), eq(cmsPages.ogImageAssetId, id))),
      ]);

    const refs = [
      ...usedInProjects.map((p) => `Project: ${p.title}`),
      ...usedInGallery.map((p) => `Gallery: ${p.title}`),
      ...usedInServices.map((s) => `Service: ${s.title}`),
      ...usedInBlog.map((b) => `Blog: ${b.title}`),
      ...usedInPages.map((pg) => `Page: ${pg.title}`),
    ];

    if (refs.length > 0) {
      return apiError(
        "Conflict",
        `Cannot delete: asset is referenced by ${refs.slice(0, 4).join(", ")}${refs.length > 4 ? ` (+${refs.length - 4} more)` : ""}. Detach it first.`,
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
