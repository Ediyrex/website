import { and, asc, eq, ilike, or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb, mediaAssets, serviceDivisions, services } from "@/db";
import {
  apiBadRequest,
  apiError,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { serviceUpsertSchema } from "@/lib/validations/cms";
import { paginationSchema } from "@/lib/validations/query";

const VALID_SERVICE_STATUSES = ["draft", "published", "archived"] as const;

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { searchParams } = new URL(request.url);
    const parsedQuery = paginationSchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });
    if (!parsedQuery.success) {
      return apiBadRequest(
        "Invalid pagination parameters.",
        parsedQuery.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const { page, limit } = parsedQuery.data;
    const offset = (page - 1) * limit;
    const statusParam = searchParams.get("status")?.trim();
    const divisionSlugParam = searchParams.get("division")?.trim();
    const qParam = searchParams.get("q")?.trim();

    const conditions = [];
    if (
      statusParam &&
      (VALID_SERVICE_STATUSES as readonly string[]).includes(statusParam)
    ) {
      conditions.push(
        eq(
          services.status,
          statusParam as (typeof VALID_SERVICE_STATUSES)[number]
        )
      );
    }
    if (divisionSlugParam) {
      conditions.push(eq(serviceDivisions.slug, divisionSlugParam));
    }
    if (qParam) {
      const searchCond = or(
        ilike(services.title, `%${qParam}%`),
        ilike(services.slug, `%${qParam}%`),
        ilike(services.summary, `%${qParam}%`)
      );
      if (searchCond) conditions.push(searchCond);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, [{ total }], [globalStats], groupedDivisions] =
      await Promise.all([
        db
          .select({
            id: services.id,
            divisionId: services.divisionId,
            title: services.title,
            slug: services.slug,
            summary: services.summary,
            deliverables: services.deliverables,
            iconName: services.iconName,
            divisionSlug: serviceDivisions.slug,
            divisionName: serviceDivisions.name,
            coverAssetId: services.coverAssetId,
            coverAssetUrl: mediaAssets.secureUrl,
            status: services.status,
            isFeatured: services.isFeatured,
            displayOrder: services.displayOrder,
            publishedAt: services.publishedAt,
            updatedAt: services.updatedAt,
          })
          .from(services)
          .innerJoin(
            serviceDivisions,
            eq(services.divisionId, serviceDivisions.id)
          )
          .leftJoin(mediaAssets, eq(services.coverAssetId, mediaAssets.id))
          .where(whereClause)
          .orderBy(asc(services.displayOrder), asc(services.title))
          .limit(limit)
          .offset(offset),
        db
          .select({ total: sql<number>`count(*)::int` })
          .from(services)
          .innerJoin(
            serviceDivisions,
            eq(services.divisionId, serviceDivisions.id)
          )
          .where(whereClause),
        db
          .select({
            totalAll: sql<number>`count(*)::int`,
            publishedCount: sql<number>`count(*) filter (where ${services.status} = 'published')::int`,
            draftCount: sql<number>`count(*) filter (where ${services.status} = 'draft')::int`,
          })
          .from(services),
        db
          .select({
            slug: serviceDivisions.slug,
            name: serviceDivisions.name,
            count: sql<number>`count(${services.id})::int`,
          })
          .from(serviceDivisions)
          .leftJoin(services, eq(serviceDivisions.id, services.divisionId))
          .groupBy(
            serviceDivisions.id,
            serviceDivisions.slug,
            serviceDivisions.name,
            serviceDivisions.displayOrder
          )
          .orderBy(asc(serviceDivisions.displayOrder)),
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
        divisionsCount: groupedDivisions.length,
        divisionCounts: groupedDivisions,
      },
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/services");
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

    const parsed = serviceUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid service payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;

    const [[divisionExists], [existingSlug]] = await Promise.all([
      db
        .select({ id: serviceDivisions.id })
        .from(serviceDivisions)
        .where(eq(serviceDivisions.id, data.divisionId))
        .limit(1),
      db
        .select({ id: services.id })
        .from(services)
        .where(eq(services.slug, data.slug))
        .limit(1),
    ]);

    if (!divisionExists) {
      return apiBadRequest("Selected service division does not exist.");
    }
    if (existingSlug) {
      return apiError(
        "Conflict",
        "A service with this URL slug already exists.",
        409
      );
    }

    const publishedAt = data.status === "published" ? new Date() : null;

    const [created] = await db
      .insert(services)
      .values({
        divisionId: data.divisionId,
        title: data.title,
        slug: data.slug,
        summary: data.summary,
        description: data.description,
        deliverables: data.deliverables,
        iconName: data.iconName || null,
        coverAssetId: data.coverAssetId || null,
        isFeatured: data.isFeatured,
        displayOrder: data.displayOrder,
        status: data.status,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        ogTitle: data.ogTitle || null,
        ogDescription: data.ogDescription || null,
        ogImageAssetId: data.ogImageAssetId || null,
        noIndex: data.noIndex,
        publishedAt,
      })
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "service.created",
      entityType: "service",
      entityId: created.id,
      metadata: { slug: created.slug, status: created.status },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/services");
  }
}
