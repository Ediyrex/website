import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { cmsPages, getDb, mediaAssets } from "@/db";
import {
  apiBadRequest,
  apiError,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { cmsPageUpsertSchema } from "@/lib/validations/cms";
import { paginationSchema } from "@/lib/validations/query";

const VALID_STATUSES = ["draft", "published", "archived"] as const;
const VALID_TYPES = ["home", "static", "listing", "legal"] as const;

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
    const qParam = searchParams.get("q")?.trim();

    const conditions = [];
    if (
      statusParam &&
      (VALID_STATUSES as readonly string[]).includes(statusParam)
    ) {
      conditions.push(
        eq(cmsPages.status, statusParam as (typeof VALID_STATUSES)[number])
      );
    }
    if (
      typeParam &&
      (VALID_TYPES as readonly string[]).includes(typeParam)
    ) {
      conditions.push(eq(cmsPages.pageType, typeParam));
    }
    if (qParam) {
      const searchCond = or(
        ilike(cmsPages.title, `%${qParam}%`),
        ilike(cmsPages.subtitle, `%${qParam}%`),
        ilike(cmsPages.slug, `%${qParam}%`)
      );
      if (searchCond) conditions.push(searchCond);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, [{ total }], [globalStats], latestPages] = await Promise.all([
      db
        .select({
          id: cmsPages.id,
          title: cmsPages.title,
          subtitle: cmsPages.subtitle,
          slug: cmsPages.slug,
          pageType: cmsPages.pageType,
          thumbnailAssetId: cmsPages.thumbnailAssetId,
          thumbnailUrl: mediaAssets.secureUrl,
          status: cmsPages.status,
          seoTitle: cmsPages.seoTitle,
          seoDescription: cmsPages.seoDescription,
          canonicalUrl: cmsPages.canonicalUrl,
          noIndex: cmsPages.noIndex,
          displayOrder: cmsPages.displayOrder,
          publishedAt: cmsPages.publishedAt,
          updatedAt: cmsPages.updatedAt,
        })
        .from(cmsPages)
        .leftJoin(mediaAssets, eq(cmsPages.thumbnailAssetId, mediaAssets.id))
        .where(whereClause)
        .orderBy(asc(cmsPages.displayOrder), desc(cmsPages.updatedAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: sql<number>`count(*)::int` })
        .from(cmsPages)
        .where(whereClause),
      db
        .select({
          totalAll: sql<number>`count(*)::int`,
          publishedCount: sql<number>`count(*) filter (where ${cmsPages.status} = 'published')::int`,
          draftCount: sql<number>`count(*) filter (where ${cmsPages.status} = 'draft')::int`,
        })
        .from(cmsPages),
      db
        .select({
          title: cmsPages.title,
          updatedAt: cmsPages.updatedAt,
        })
        .from(cmsPages)
        .orderBy(desc(cmsPages.updatedAt))
        .limit(2),
    ]);

    return apiOk(rows, {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      stats: {
        totalAll: globalStats?.totalAll ?? 0,
        publishedCount: globalStats?.publishedCount ?? 0,
        draftCount: globalStats?.draftCount ?? 0,
        latestUpdatedAt: latestPages[0]?.updatedAt?.toISOString() ?? null,
        latestTitles: latestPages.map((p) => p.title),
      },
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/pages");
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

    const parsed = cmsPageUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid page payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;
    const [existingSlug] = await db
      .select({ id: cmsPages.id })
      .from(cmsPages)
      .where(eq(cmsPages.slug, data.slug))
      .limit(1);

    if (existingSlug) {
      return apiError(
        "Conflict",
        "A page with this URL slug already exists.",
        409
      );
    }

    const [created] = await db
      .insert(cmsPages)
      .values({
        title: data.title,
        subtitle: data.subtitle,
        slug: data.slug,
        pageType: data.pageType,
        thumbnailAssetId: data.thumbnailAssetId || null,
        bodyMarkdown: data.bodyMarkdown,
        status: data.status,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        canonicalUrl: data.canonicalUrl || data.slug,
        noIndex: data.noIndex,
        displayOrder: data.displayOrder,
        updatedByUserId: auth.session.userId,
        publishedAt: data.status === "published" ? new Date() : null,
      })
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "page.created",
      entityType: "cms_page",
      entityId: created.id,
      metadata: { slug: created.slug, status: created.status },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pages");
  }
}

