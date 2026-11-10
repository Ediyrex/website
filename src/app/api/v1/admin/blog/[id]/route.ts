import { and, eq, ne } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { blogPosts, getDb, mediaAssets } from "@/db";
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
import { blogPostUpsertSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid blog post ID.");

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid blog post identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [post] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (!post) {
      return apiNotFound("Blog post not found.");
    }

    const coverRows = post.coverAssetId
      ? await db
          .select({
            id: mediaAssets.id,
            secureUrl: mediaAssets.secureUrl,
            altText: mediaAssets.altText,
          })
          .from(mediaAssets)
          .where(eq(mediaAssets.id, post.coverAssetId))
          .limit(1)
      : [];

    return apiOk({
      ...post,
      coverAsset: coverRows[0] ?? null,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/blog/[id]");
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
      return apiBadRequest("Invalid blog post identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = blogPostUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid blog post update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existing] = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.id, id))
      .limit(1);

    if (!existing) {
      return apiNotFound("Blog post not found.");
    }

    const data = parsed.data;
    const [slugConflict] = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(and(eq(blogPosts.slug, data.slug), ne(blogPosts.id, id)))
      .limit(1);

    if (slugConflict) {
      return apiError(
        "Conflict",
        "Another blog post already uses this URL slug.",
        409
      );
    }

    const publishedAt =
      data.status === "published"
        ? existing.publishedAt ?? new Date()
        : existing.publishedAt;

    const [updated] = await db
      .update(blogPosts)
      .set({
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        bodyMarkdown: data.bodyMarkdown,
        coverAssetId: data.coverAssetId || null,
        status: data.status,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        canonicalUrl: data.canonicalUrl || null,
        publishedAt,
      })
      .where(eq(blogPosts.id, id))
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "blog.updated",
      entityType: "blog_post",
      entityId: id,
      metadata: { slug: updated.slug, status: updated.status },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/blog/[id]");
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
      return apiBadRequest("Invalid blog post identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [deleted] = await db
      .delete(blogPosts)
      .where(eq(blogPosts.id, id))
      .returning({ id: blogPosts.id, slug: blogPosts.slug });

    if (!deleted) {
      return apiNotFound("Blog post not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "blog.deleted",
      entityType: "blog_post",
      entityId: id,
      metadata: { slug: deleted.slug },
    });

    return apiOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/blog/[id]");
  }
}

