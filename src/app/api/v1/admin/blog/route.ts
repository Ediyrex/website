import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { blogPosts, getDb, mediaAssets } from "@/db";
import {
  apiBadRequest,
  apiError,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { blogPostUpsertSchema } from "@/lib/validations/cms";
import { paginationSchema } from "@/lib/validations/query";

const VALID_POST_STATUSES = ["draft", "published", "archived"] as const;

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { searchParams } = new URL(request.url);
    const parsedPage = paginationSchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });
    if (!parsedPage.success) {
      return apiBadRequest(
        "Invalid pagination parameters.",
        parsedPage.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const { page, limit } = parsedPage.data;
    const offset = (page - 1) * limit;
    const statusParam = searchParams.get("status")?.trim();
    const qParam = searchParams.get("q")?.trim();

    const conditions = [];
    if (
      statusParam &&
      (VALID_POST_STATUSES as readonly string[]).includes(statusParam)
    ) {
      conditions.push(
        eq(
          blogPosts.status,
          statusParam as (typeof VALID_POST_STATUSES)[number]
        )
      );
    }
    if (qParam) {
      const searchCond = or(
        ilike(blogPosts.title, `%${qParam}%`),
        ilike(blogPosts.slug, `%${qParam}%`),
        ilike(blogPosts.excerpt, `%${qParam}%`)
      );
      if (searchCond) conditions.push(searchCond);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        excerpt: blogPosts.excerpt,
        coverAssetId: blogPosts.coverAssetId,
        coverAssetUrl: mediaAssets.secureUrl,
        status: blogPosts.status,
        seoTitle: blogPosts.seoTitle,
        seoDescription: blogPosts.seoDescription,
        canonicalUrl: blogPosts.canonicalUrl,
        publishedAt: blogPosts.publishedAt,
        updatedAt: blogPosts.updatedAt,
      })
      .from(blogPosts)
      .leftJoin(mediaAssets, eq(blogPosts.coverAssetId, mediaAssets.id))
      .where(whereClause)
      .orderBy(desc(blogPosts.updatedAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(blogPosts)
      .where(whereClause);

    return apiOk(rows, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/blog");
  }
}

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

    const parsed = blogPostUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid blog post payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;
    const [existingSlug] = await db
      .select({ id: blogPosts.id })
      .from(blogPosts)
      .where(eq(blogPosts.slug, data.slug))
      .limit(1);

    if (existingSlug) {
      return apiError(
        "Conflict",
        "A blog post with this URL slug already exists.",
        409
      );
    }

    const publishedAt = data.status === "published" ? new Date() : null;

    const [created] = await db
      .insert(blogPosts)
      .values({
        authorUserId: auth.session.userId,
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
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "blog.created",
      entityType: "blog_post",
      entityId: created.id,
      metadata: { slug: created.slug, status: created.status },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/blog");
  }
}

