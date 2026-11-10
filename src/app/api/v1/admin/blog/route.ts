import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
} from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  blogCategories,
  blogPostCategories,
  blogPosts,
  getDb,
  mediaAssets,
  users,
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
      limit: searchParams.get("limit") ?? "10",
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
    const categorySlugParam = searchParams.get("category")?.trim();
    const authorIdParam = searchParams.get("author")?.trim();
    const qParam = searchParams.get("q")?.trim();

    const conditions = [];
    if (
      statusParam &&
      (VALID_POST_STATUSES as readonly string[]).includes(statusParam)
    ) {
      conditions.push(
        eq(blogPosts.status, statusParam as (typeof VALID_POST_STATUSES)[number])
      );
    }

    if (authorIdParam) {
      conditions.push(eq(blogPosts.authorUserId, authorIdParam));
    }

    if (categorySlugParam) {
      const catPostRows = await db
        .select({ blogPostId: blogPostCategories.blogPostId })
        .from(blogPostCategories)
        .innerJoin(
          blogCategories,
          eq(blogPostCategories.categoryId, blogCategories.id)
        )
        .where(eq(blogCategories.slug, categorySlugParam));

      const matchedPostIds = catPostRows.map((r) => r.blogPostId);
      if (matchedPostIds.length === 0) {
        conditions.push(sql`1 = 0`);
      } else {
        conditions.push(inArray(blogPosts.id, matchedPostIds));
      }
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
    const thirtyDaysAgoIso = new Date(
      Date.now() - 30 * 24 * 60 * 60 * 1000
    ).toISOString();

    const [
      rows,
      [{ total }],
      [globalStats],
      categoriesList,
      recentPublished,
      recentDrafts,
      authorsList,
    ] = await Promise.all([
      db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          excerpt: blogPosts.excerpt,
          coverAssetId: blogPosts.coverAssetId,
          coverAssetUrl: mediaAssets.secureUrl,
          authorUserId: blogPosts.authorUserId,
          authorName: users.displayName,
          status: blogPosts.status,
          seoTitle: blogPosts.seoTitle,
          seoDescription: blogPosts.seoDescription,
          canonicalUrl: blogPosts.canonicalUrl,
          publishedAt: blogPosts.publishedAt,
          updatedAt: blogPosts.updatedAt,
        })
        .from(blogPosts)
        .leftJoin(mediaAssets, eq(blogPosts.coverAssetId, mediaAssets.id))
        .leftJoin(users, eq(blogPosts.authorUserId, users.id))
        .where(whereClause)
        .orderBy(desc(blogPosts.updatedAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: sql<number>`count(*)::int` })
        .from(blogPosts)
        .where(whereClause),
      db
        .select({
          totalAll: sql<number>`count(*)::int`,
          publishedCount: sql<number>`count(*) filter (where ${blogPosts.status} = 'published')::int`,
          draftCount: sql<number>`count(*) filter (where ${blogPosts.status} = 'draft')::int`,
          archivedCount: sql<number>`count(*) filter (where ${blogPosts.status} = 'archived')::int`,
          publishedLast30Count: sql<number>`count(*) filter (where ${blogPosts.status} = 'published' and ${blogPosts.publishedAt} >= ${thirtyDaysAgoIso}::timestamptz)::int`,
        })
        .from(blogPosts),
      db
        .select({
          id: blogCategories.id,
          name: blogCategories.name,
          slug: blogCategories.slug,
          count: sql<number>`count(${blogPostCategories.blogPostId})::int`,
        })
        .from(blogCategories)
        .leftJoin(
          blogPostCategories,
          eq(blogCategories.id, blogPostCategories.categoryId)
        )
        .groupBy(blogCategories.id, blogCategories.name, blogCategories.slug)
        .orderBy(asc(blogCategories.name)),
      db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          publishedAt: blogPosts.publishedAt,
          updatedAt: blogPosts.updatedAt,
        })
        .from(blogPosts)
        .where(eq(blogPosts.status, "published"))
        .orderBy(desc(blogPosts.publishedAt), desc(blogPosts.updatedAt))
        .limit(3),
      db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          coverAssetUrl: mediaAssets.secureUrl,
          updatedAt: blogPosts.updatedAt,
        })
        .from(blogPosts)
        .leftJoin(mediaAssets, eq(blogPosts.coverAssetId, mediaAssets.id))
        .where(eq(blogPosts.status, "draft"))
        .orderBy(desc(blogPosts.updatedAt))
        .limit(3),
      db
        .selectDistinct({
          id: users.id,
          displayName: users.displayName,
        })
        .from(blogPosts)
        .innerJoin(users, eq(blogPosts.authorUserId, users.id)),
    ]);

    const postIds = rows.map((r) => r.id);
    const categoriesByPost = new Map<
      string,
      { id: string; name: string; slug: string }[]
    >();

    if (postIds.length > 0) {
      const catLinks = await db
        .select({
          blogPostId: blogPostCategories.blogPostId,
          id: blogCategories.id,
          name: blogCategories.name,
          slug: blogCategories.slug,
        })
        .from(blogPostCategories)
        .innerJoin(
          blogCategories,
          eq(blogPostCategories.categoryId, blogCategories.id)
        )
        .where(inArray(blogPostCategories.blogPostId, postIds));

      for (const link of catLinks) {
        const list = categoriesByPost.get(link.blogPostId) ?? [];
        list.push({ id: link.id, name: link.name, slug: link.slug });
        categoriesByPost.set(link.blogPostId, list);
      }
    }

    const enrichedRows = rows.map((r) => ({
      ...r,
      categories: categoriesByPost.get(r.id) ?? [],
    }));

    return apiOk(enrichedRows, {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      stats: {
        totalAll: globalStats?.totalAll ?? 0,
        publishedCount: globalStats?.publishedCount ?? 0,
        draftCount: globalStats?.draftCount ?? 0,
        archivedCount: globalStats?.archivedCount ?? 0,
        publishedLast30Count: globalStats?.publishedLast30Count ?? 0,
        categories: categoriesList,
        authors: authorsList,
        recentPublished,
        recentDrafts,
      },
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

    const created = await db.transaction(async (tx) => {
      const [row] = await tx
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

      if (data.categoryIds.length > 0) {
        await tx
          .insert(blogPostCategories)
          .values(
            data.categoryIds.map((categoryId) => ({
              blogPostId: row.id,
              categoryId,
            }))
          )
          .onConflictDoNothing();
      }

      return row;
    });

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
