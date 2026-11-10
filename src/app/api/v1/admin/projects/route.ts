import { and, asc, desc, eq, ilike, or, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  caseStudies,
  getDb,
  mediaAssets,
  projectMedia,
  projects,
  projectServices,
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
import { projectUpsertSchema } from "@/lib/validations/cms";
import { paginationSchema } from "@/lib/validations/query";

const VALID_PROJECT_STATUSES = ["draft", "published", "archived"] as const;

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
    const categoryParam = searchParams.get("category")?.trim();
    const qParam = searchParams.get("q")?.trim();

    const conditions = [];
    if (
      statusParam &&
      (VALID_PROJECT_STATUSES as readonly string[]).includes(statusParam)
    ) {
      conditions.push(
        eq(
          projects.status,
          statusParam as (typeof VALID_PROJECT_STATUSES)[number]
        )
      );
    }
    if (categoryParam) {
      conditions.push(eq(projects.industry, categoryParam));
    }
    if (qParam) {
      const searchCond = or(
        ilike(projects.title, `%${qParam}%`),
        ilike(projects.slug, `%${qParam}%`),
        ilike(projects.industry, `%${qParam}%`),
        ilike(projects.clientName, `%${qParam}%`)
      );
      if (searchCond) conditions.push(searchCond);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, [{ total }], [globalStats], distinctCategories] =
      await Promise.all([
        db
          .select({
            id: projects.id,
            title: projects.title,
            slug: projects.slug,
            summary: projects.summary,
            projectType: projects.projectType,
            industry: projects.industry,
            clientName: projects.clientName,
            clientIsPublic: projects.clientIsPublic,
            projectDate: projects.projectDate,
            coverAssetId: projects.coverAssetId,
            coverAssetUrl: mediaAssets.secureUrl,
            status: projects.status,
            isFeatured: projects.isFeatured,
            displayOrder: projects.displayOrder,
            publishedAt: projects.publishedAt,
            createdAt: projects.createdAt,
            updatedAt: projects.updatedAt,
          })
          .from(projects)
          .leftJoin(mediaAssets, eq(projects.coverAssetId, mediaAssets.id))
          .where(whereClause)
          .orderBy(asc(projects.displayOrder), desc(projects.updatedAt))
          .limit(limit)
          .offset(offset),
        db
          .select({ total: sql<number>`count(*)::int` })
          .from(projects)
          .where(whereClause),
        db
          .select({
            totalAll: sql<number>`count(*)::int`,
            publishedCount: sql<number>`count(*) filter (where ${projects.status} = 'published')::int`,
            draftCount: sql<number>`count(*) filter (where ${projects.status} = 'draft')::int`,
          })
          .from(projects),
        db
          .selectDistinct({ industry: projects.industry })
          .from(projects),
      ]);

    const categories = distinctCategories
      .map((c) => c.industry)
      .filter((val): val is string => Boolean(val && val.trim()))
      .sort();

    return apiOk(rows, {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
      stats: {
        totalAll: globalStats?.totalAll ?? 0,
        publishedCount: globalStats?.publishedCount ?? 0,
        draftCount: globalStats?.draftCount ?? 0,
        categoriesCount: categories.length,
        categories,
      },
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/projects");
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

    const parsed = projectUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid project payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;

    const [existingSlug] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.slug, data.slug))
      .limit(1);

    if (existingSlug) {
      return apiError(
        "Conflict",
        "A project with this URL slug already exists.",
        409
      );
    }

    // Enforce client honesty constraint (`chk_project_client_honesty`)
    const isClientProject = data.projectType === "client";
    const normalizedClientName = isClientProject ? data.clientName || null : null;
    const normalizedClientIsPublic = isClientProject ? data.clientIsPublic : false;
    const publishedAt = data.status === "published" ? new Date() : null;

    const created = await db.transaction(async (tx) => {
      const [row] = await tx
        .insert(projects)
        .values({
          title: data.title,
          slug: data.slug,
          summary: data.summary,
          description: data.description,
          projectType: data.projectType,
          industry: data.industry || null,
          clientName: normalizedClientName,
          clientIsPublic: normalizedClientIsPublic,
          coverAssetId: data.coverAssetId || null,
          projectDate: data.projectDate || null,
          techStack: data.techStack,
          liveUrl: data.liveUrl || null,
          repositoryUrl: data.repositoryUrl || null,
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

      if (data.serviceIds.length > 0) {
        await tx
          .insert(projectServices)
          .values(
            data.serviceIds.map((serviceId) => ({
              projectId: row.id,
              serviceId,
            }))
          )
          .onConflictDoNothing();
      }

      if (data.galleryAssetIds.length > 0) {
        await tx
          .insert(projectMedia)
          .values(
            data.galleryAssetIds.map((mediaAssetId, index) => ({
              projectId: row.id,
              mediaAssetId,
              mediaRole: "gallery" as const,
              displayOrder: index,
            }))
          )
          .onConflictDoNothing();
      }

      if (data.caseStudy) {
        await tx.insert(caseStudies).values({
          projectId: row.id,
          challenge: data.caseStudy.challenge,
          approach: data.caseStudy.approach,
          solution: data.caseStudy.solution,
          verifiedOutcomes: data.caseStudy.verifiedOutcomes,
          processSteps: data.caseStudy.processSteps,
          status: data.status,
          publishedAt,
        });
      }

      return row;
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "project.created",
      entityType: "project",
      entityId: created.id,
      metadata: { slug: created.slug, status: created.status },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/projects");
  }
}
