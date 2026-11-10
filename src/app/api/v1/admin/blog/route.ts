import {
  and,
  asc,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
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
const VALID_CONTENT_TYPES = ["post", "insight", "announcement"] as const;

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
    const typeParam = searchParams.get("type")?.trim();
    const scheduledParam = searchParams.get("scheduled")?.trim();
    const categorySlugParam = searchParams.get("category")?.trim();
    const authorIdParam = searchParams.get("author")?.trim();
    const tagParam = searchParams.get("tag")?.trim().toLowerCase();
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
    if (
      typeParam &&
      (VALID_CONTENT_TYPES as readonly string[]).includes(typeParam)
    ) {
      conditions.push(eq(blogPosts.contentType, typeParam));
    }
    if (scheduledParam === "1") {
      conditions.push(
        and(eq(blogPosts.status, "draft"), isNotNull(blogPosts.scheduledFor))
      );
    }
    if (authorIdParam) {
      conditions.push(eq(blogPosts.authorUserId, authorIdParam));
    }
    if (tagParam) {
      conditions.push(
        sql`${blogPosts.tags} @> ${JSON.stringify([tagParam])}::jsonb`
      );
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
        ilike(blogPosts.subtitle, `%${qParam}%`),
        ilike(blogPosts.slug, `%${qParam}%`),
        ilike(blogPosts.excerpt, `%${qParam}%`),
        sql`${blogPosts.tags}::text ilike ${`%${qParam}%`}`
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
      topInsights,
      recentDrafts,
      authorsList,
      allTagRows,
    ] = await Promise.all([
      db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          subtitle: blogPosts.subtitle,
          slug: blogPosts.slug,
          contentType: blogPosts.contentType,
          excerpt: blogPosts.excerpt,
          tags: blogPosts.tags,
          isFeatured: blogPosts.isFeatured,
          coverAssetId: blogPosts.coverAssetId,
          coverAssetUrl: mediaAssets.secureUrl,
          authorUserId: blogPosts.authorUserId,
          authorName: users.displayName,
          authorBio: blogPosts.authorBio,
          status: blogPosts.status,
          seoTitle: blogPosts.seoTitle,
          seoDescription: blogPosts.seoDescription,
          canonicalUrl: blogPosts.canonicalUrl,
          scheduledFor: blogPosts.scheduledFor,
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
          scheduledCount: sql<number>`count(*) filter (where ${blogPosts.status} = 'draft' and ${blogPosts.scheduledFor} is not null)::int`,
          insightsCount: sql<number>`count(*) filter (where ${blogPosts.contentType} = 'insight')::int`,
          announcementsCount: sql<number>`count(*) filter (where ${blogPosts.contentType} = 'announcement')::int`,
          archivedCount: sql<number>`count(*) filter (where ${blogPosts.status} = 'archived')::int`,
          publishedLast30Count: sql<number>`count(*) filter (where ${blogPosts.status} = 'published' and ${blogPosts.publishedAt} >= ${thirtyDaysAgoIso}::timestamptz)::int`,
        })
        .from(blogPosts),
      db
        .select({
          id: blogCategories.id,
          name: blogCategories.name,
          slug: blogCategories.slug,
          description: blogCategories.description,
          count: sql<number>`count(${blogPostCategories.blogPostId})::int`,
        })
        .from(blogCategories)
        .leftJoin(
          blogPostCategories,
          eq(blogCategories.id, blogPostCategories.categoryId)
        )
        .groupBy(
          blogCategories.id,
          blogCategories.name,
          blogCategories.slug,
          blogCategories.description
        )
        .orderBy(asc(blogCategories.name)),
      db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          contentType: blogPosts.contentType,
          isFeatured: blogPosts.isFeatured,
          publishedAt: blogPosts.publishedAt,
          updatedAt: blogPosts.updatedAt,
        })
        .from(blogPosts)
        .where(eq(blogPosts.status, "published"))
        .orderBy(
          desc(blogPosts.isFeatured),
          desc(blogPosts.publishedAt),
          desc(blogPosts.updatedAt)
        )
        .limit(4),
      db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          coverAssetUrl: mediaAssets.secureUrl,
          scheduledFor: blogPosts.scheduledFor,
          updatedAt: blogPosts.updatedAt,
        })
        .from(blogPosts)
        .leftJoin(mediaAssets, eq(blogPosts.coverAssetId, mediaAssets.id))
        .where(eq(blogPosts.status, "draft"))
        .orderBy(desc(blogPosts.updatedAt))
        .limit(4),
      db
        .select({
          id: users.id,
          displayName: users.displayName,
        })
        .from(users)
        .where(eq(users.status, "active"))
        .orderBy(asc(users.displayName)),
      db.select({ tags: blogPosts.tags }).from(blogPosts),
    ]);

    const uniqueTags = Array.from(
      new Set(allTagRows.flatMap((r) => (Array.isArray(r.tags) ? r.tags : [])))
    ).sort((a, b) => a.localeCompare(b));

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
        scheduledCount: globalStats?.scheduledCount ?? 0,
        insightsCount: globalStats?.insightsCount ?? 0,
        announcementsCount: globalStats?.announcementsCount ?? 0,
        archivedCount: globalStats?.archivedCount ?? 0,
        publishedLast30Count: globalStats?.publishedLast30Count ?? 0,
        categories: categoriesList,
        authors: authorsList,
        allTags: uniqueTags,
        topInsights,
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
    const scheduledFor =
      data.status === "draft" && data.scheduledFor
        ? new Date(data.scheduledFor)
        : null;

    const created = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(blogPosts)
        .values({
          authorUserId: data.authorUserId || auth.session.userId,
          authorBio: data.authorBio || null,
          title: data.title,
          subtitle: data.subtitle || null,
          slug: data.slug,
          contentType: data.contentType,
          excerpt: data.excerpt,
          bodyMarkdown: data.bodyMarkdown,
          tags: data.tags,
          isFeatured: data.isFeatured,
          coverAssetId: data.coverAssetId || null,
          status: data.status,
          scheduledFor,
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
      metadata: {
        slug: created.slug,
        status: created.status,
        contentType: created.contentType,
      },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/blog");
  }
}
