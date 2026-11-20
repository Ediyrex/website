import { and, asc, eq, ilike, or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  getDb,
  industries,
  sectorArchitectures,
  industryServices,
  industrySectorArchitectures,
  industryProjects,
  services,
  projects,
  mediaAssets,
} from "@/db";
import {
  apiBadRequest,
  apiError,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { ensureIndustryEditorialDefaults } from "@/lib/server/catalog";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { industryUpsertSchema } from "@/lib/validations/cms";
import { paginationSchema } from "@/lib/validations/query";

const VALID_STATUSES = ["draft", "published", "archived"] as const;

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

    await ensureIndustryEditorialDefaults(db);

    const { page, limit } = parsedQuery.data;
    const offset = (page - 1) * limit;
    const statusParam = searchParams.get("status")?.trim();
    const featuredParam = searchParams.get("featured")?.trim();
    const qParam = searchParams.get("q")?.trim();

    const conditions = [];
    if (
      statusParam &&
      (VALID_STATUSES as readonly string[]).includes(statusParam)
    ) {
      conditions.push(
        eq(
          industries.status,
          statusParam as (typeof VALID_STATUSES)[number]
        )
      );
    }
    if (featuredParam === "true") {
      conditions.push(eq(industries.isFeatured, true));
    }
    if (qParam) {
      const searchCond = or(
        ilike(industries.name, `%${qParam}%`),
        ilike(industries.slug, `%${qParam}%`),
        ilike(industries.tagline, `%${qParam}%`),
        ilike(industries.shortDescription, `%${qParam}%`)
      );
      if (searchCond) conditions.push(searchCond);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, [{ total }], [globalStats], [{ sectorCount }]] =
      await Promise.all([
        db
          .select({
            id: industries.id,
            slug: industries.slug,
            name: industries.name,
            tagline: industries.tagline,
            shortDescription: industries.shortDescription,
            description: industries.description,
            heroHeadline: industries.heroHeadline,
            heroDescription: industries.heroDescription,
            heroSupportingLabel: industries.heroSupportingLabel,
            ctaLabel: industries.ctaLabel,
            ctaDestination: industries.ctaDestination,
            subIndustries: industries.subIndustries,
            deliverables: industries.deliverables,
            challenges: industries.challenges,
            opportunities: industries.opportunities,
            solutions: industries.solutions,
            faqs: industries.faqs,
            coverImageUrl: industries.coverImageUrl,
            coverAssetId: industries.coverAssetId,
            coverAssetUrl: mediaAssets.secureUrl,
            displayOrder: industries.displayOrder,
            status: industries.status,
            isFeatured: industries.isFeatured,
            isHeroFeatured: industries.isHeroFeatured,
            seoTitle: industries.seoTitle,
            seoDescription: industries.seoDescription,
            canonicalUrl: industries.canonicalUrl,
            publishedAt: industries.publishedAt,
            createdAt: industries.createdAt,
            updatedAt: industries.updatedAt,
          })
          .from(industries)
          .leftJoin(mediaAssets, eq(industries.coverAssetId, mediaAssets.id))
          .where(whereClause)
          .orderBy(asc(industries.displayOrder), asc(industries.name))
          .limit(limit)
          .offset(offset),
        db
          .select({ total: sql<number>`count(*)::int` })
          .from(industries)
          .where(whereClause),
        db
          .select({
            totalAll: sql<number>`count(*)::int`,
            publishedCount: sql<number>`count(*) filter (where ${industries.status} = 'published')::int`,
            draftCount: sql<number>`count(*) filter (where ${industries.status} = 'draft')::int`,
            featuredCount: sql<number>`count(*) filter (where ${industries.isFeatured} = true)::int`,
          })
          .from(industries),
        db
          .select({ sectorCount: sql<number>`count(*)::int` })
          .from(sectorArchitectures),
      ]);

    // Fetch relations for current rows in parallel
    const industryIds = rows.map((r) => r.id);
    let linkedServices: { industryId: string; serviceId: string; title: string; divisionSlug: string }[] = [];
    let linkedArchitectures: { industryId: string; architectureId: string; title: string; category: string }[] = [];
    let linkedProjects: { industryId: string; projectId: string; title: string; slug: string }[] = [];

    if (industryIds.length > 0) {
      const [svcRes, archRes, projRes] = await Promise.all([
        db
          .select({
            industryId: industryServices.industryId,
            serviceId: services.id,
            title: services.title,
            divisionSlug: services.slug,
          })
          .from(industryServices)
          .innerJoin(services, eq(industryServices.serviceId, services.id)),
        db
          .select({
            industryId: industrySectorArchitectures.industryId,
            architectureId: sectorArchitectures.id,
            title: sectorArchitectures.title,
            category: sectorArchitectures.category,
          })
          .from(industrySectorArchitectures)
          .innerJoin(
            sectorArchitectures,
            eq(industrySectorArchitectures.sectorArchitectureId, sectorArchitectures.id)
          ),
        db
          .select({
            industryId: industryProjects.industryId,
            projectId: projects.id,
            title: projects.title,
            slug: projects.slug,
          })
          .from(industryProjects)
          .innerJoin(projects, eq(industryProjects.projectId, projects.id)),
      ]);

      linkedServices = svcRes;
      linkedArchitectures = archRes;
      linkedProjects = projRes;
    }

    const enrichedRows = rows.map((row) => ({
      ...row,
      services: linkedServices.filter((s) => s.industryId === row.id),
      sectorArchitectures: linkedArchitectures.filter((a) => a.industryId === row.id),
      projects: linkedProjects.filter((p) => p.industryId === row.id),
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
        featuredCount: globalStats?.featuredCount ?? 0,
        sectorArchitecturesCount: sectorCount ?? 0,
      },
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/industries");
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

    const parsed = industryUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid industry payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureIndustryEditorialDefaults(db);

    const data = parsed.data;

    const [existingSlug] = await db
      .select({ id: industries.slug })
      .from(industries)
      .where(eq(industries.slug, data.slug))
      .limit(1);

    if (existingSlug) {
      return apiError(
        "Conflict",
        "An industry with this URL slug already exists.",
        409
      );
    }

    const publishedAt = data.status === "published" ? new Date() : null;

    const [created] = await db
      .insert(industries)
      .values({
        name: data.name,
        slug: data.slug,
        tagline: data.tagline,
        shortDescription: data.shortDescription,
        description: data.description,
        heroHeadline: data.heroHeadline || data.name,
        heroDescription: data.heroDescription || data.shortDescription,
        heroSupportingLabel: data.heroSupportingLabel || null,
        ctaLabel: data.ctaLabel,
        ctaDestination: data.ctaDestination || "/contact",
        subIndustries: data.subIndustries,
        deliverables: data.deliverables,
        challenges: data.challenges,
        opportunities: data.opportunities,
        solutions: data.solutions,
        faqs: data.faqs,
        coverImageUrl: data.coverImageUrl || "",
        coverAssetId: data.coverAssetId || null,
        displayOrder: data.displayOrder,
        status: data.status,
        isFeatured: data.isFeatured,
        isHeroFeatured: data.isHeroFeatured,
        seoTitle: data.seoTitle || null,
        seoDescription: data.seoDescription || null,
        ogTitle: data.ogTitle || null,
        ogDescription: data.ogDescription || null,
        ogImageAssetId: data.ogImageAssetId || null,
        canonicalUrl: data.canonicalUrl || null,
        publishedAt,
      })
      .returning();

    // Link relations
    if (data.serviceIds.length > 0) {
      for (const serviceId of data.serviceIds) {
        await db
          .insert(industryServices)
          .values({ industryId: created.id, serviceId })
          .onConflictDoNothing();
      }
    }

    if (data.sectorArchitectureIds.length > 0) {
      for (const sectorArchitectureId of data.sectorArchitectureIds) {
        await db
          .insert(industrySectorArchitectures)
          .values({ industryId: created.id, sectorArchitectureId })
          .onConflictDoNothing();
      }
    }

    if (data.projectIds.length > 0) {
      for (const projectId of data.projectIds) {
        await db
          .insert(industryProjects)
          .values({ industryId: created.id, projectId })
          .onConflictDoNothing();
      }
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "industry.create",
      entityType: "industry",
      entityId: created.id,
      metadata: {
        description: `Created industry "${created.name}" (${created.slug})`,
        slug: created.slug,
        status: created.status,
      },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/industries");
  }
}
