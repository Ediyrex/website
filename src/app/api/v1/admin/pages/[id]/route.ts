import { and, eq, ne } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { cmsPages, getDb, mediaAssets } from "@/db";
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
import { cmsPageUpsertSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid page ID.");

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid page identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [page] = await db
      .select()
      .from(cmsPages)
      .where(eq(cmsPages.id, id))
      .limit(1);

    if (!page) {
      return apiNotFound("Page not found.");
    }

    const thumbRows = page.thumbnailAssetId
      ? await db
          .select({
            id: mediaAssets.id,
            secureUrl: mediaAssets.secureUrl,
            altText: mediaAssets.altText,
          })
          .from(mediaAssets)
          .where(eq(mediaAssets.id, page.thumbnailAssetId))
          .limit(1)
      : [];

    return apiOk({
      ...page,
      thumbnailAsset: thumbRows[0] ?? null,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/pages/[id]");
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
      return apiBadRequest("Invalid page identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = cmsPageUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid page update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existing] = await db
      .select()
      .from(cmsPages)
      .where(eq(cmsPages.id, id))
      .limit(1);

    if (!existing) {
      return apiNotFound("Page not found.");
    }

    const data = parsed.data;
    const [slugConflict] = await db
      .select({ id: cmsPages.id })
      .from(cmsPages)
      .where(and(eq(cmsPages.slug, data.slug), ne(cmsPages.id, id)))
      .limit(1);

    if (slugConflict) {
      return apiError(
        "Conflict",
        "Another page already uses this URL slug.",
        409
      );
    }

    const [updated] = await db
      .update(cmsPages)
      .set({
        title: data.title,
        subtitle: data.subtitle,
        slug: data.slug,
        pageType: data.pageType,
        thumbnailAssetId: data.thumbnailAssetId || null,
        bodyMarkdown: data.bodyMarkdown,
        status: data.status,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        noIndex: data.noIndex,
        displayOrder: data.displayOrder,
        updatedByUserId: auth.session.userId,
        publishedAt:
          data.status === "published"
            ? existing.publishedAt ?? new Date()
            : existing.publishedAt,
      })
      .where(eq(cmsPages.id, id))
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "page.updated",
      entityType: "cms_page",
      entityId: id,
      metadata: { slug: updated.slug, status: updated.status },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/pages/[id]");
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid page identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [deleted] = await db
      .delete(cmsPages)
      .where(eq(cmsPages.id, id))
      .returning({ id: cmsPages.id, slug: cmsPages.slug });

    if (!deleted) {
      return apiNotFound("Page not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "page.deleted",
      entityType: "cms_page",
      entityId: id,
      metadata: { slug: deleted.slug },
    });

    return apiOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/pages/[id]");
  }
}

