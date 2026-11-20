import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  featuredPlacements,
  getDb,
  mediaAssets,
  projects,
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
import { featuredPlacementInputSchema } from "@/lib/validations/cms";

// Initial seed helper if table is empty
async function ensureInitialPlacements(db: NonNullable<ReturnType<typeof getDb>>) {
  try {
    const [countRow] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(featuredPlacements);

    if (countRow && countRow.count > 0) return;

    // Fetch published projects with isFeatured = true
    const existingFeatured = await db
      .select({
        id: projects.id,
        slug: projects.slug,
        displayOrder: projects.displayOrder,
      })
      .from(projects)
      .where(and(eq(projects.status, "published"), eq(projects.isFeatured, true)))
      .orderBy(asc(projects.displayOrder));

    if (existingFeatured.length === 0) return;

    const seedEntries = [];
    // First project is Homepage Primary Featured
    if (existingFeatured[0]) {
      seedEntries.push({
        projectId: existingFeatured[0].id,
        destination: "homepage",
        targetId: "primary",
        displayOrder: 1,
        isActive: true,
      });
    }

    // All existing featured belong to Work Archive
    existingFeatured.forEach((p, idx) => {
      seedEntries.push({
        projectId: p.id,
        destination: "work_archive",
        targetId: null,
        displayOrder: idx + 1,
        isActive: true,
      });
    });

    if (seedEntries.length > 0) {
      await db.insert(featuredPlacements).values(seedEntries);
    }
  } catch {
    // Non-fatal if table not yet initialized
  }
}

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    await ensureInitialPlacements(db);

    const { searchParams } = new URL(request.url);
    const destination = searchParams.get("destination")?.trim();
    const targetId = searchParams.get("targetId")?.trim();

    const conditions = [];
    if (destination && destination !== "all") {
      conditions.push(eq(featuredPlacements.destination, destination));
    }
    if (targetId) {
      conditions.push(eq(featuredPlacements.targetId, targetId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const [rows, allPublished, statsRows] = await Promise.all([
      db
        .select({
          id: featuredPlacements.id,
          projectId: featuredPlacements.projectId,
          destination: featuredPlacements.destination,
          targetId: featuredPlacements.targetId,
          displayOrder: featuredPlacements.displayOrder,
          isActive: featuredPlacements.isActive,
          featuredFrom: featuredPlacements.featuredFrom,
          featuredUntil: featuredPlacements.featuredUntil,
          createdAt: featuredPlacements.createdAt,
          updatedAt: featuredPlacements.updatedAt,
          projectTitle: projects.title,
          projectSlug: projects.slug,
          projectSummary: projects.summary,
          projectType: projects.projectType,
          industry: projects.industry,
          projectStatus: projects.status,
          isFeatured: projects.isFeatured,
          coverAssetUrl: mediaAssets.secureUrl,
        })
        .from(featuredPlacements)
        .innerJoin(projects, eq(featuredPlacements.projectId, projects.id))
        .leftJoin(mediaAssets, eq(projects.coverAssetId, mediaAssets.id))
        .where(whereClause)
        .orderBy(asc(featuredPlacements.destination), asc(featuredPlacements.displayOrder)),

      db
        .select({
          id: projects.id,
          title: projects.title,
          slug: projects.slug,
          summary: projects.summary,
          projectType: projects.projectType,
          industry: projects.industry,
          coverAssetUrl: mediaAssets.secureUrl,
          displayOrder: projects.displayOrder,
          status: projects.status,
          isFeatured: projects.isFeatured,
        })
        .from(projects)
        .leftJoin(mediaAssets, eq(projects.coverAssetId, mediaAssets.id))
        .where(eq(projects.status, "published"))
        .orderBy(asc(projects.displayOrder)),

      db
        .select({
          destination: featuredPlacements.destination,
          count: sql<number>`count(*)::int`,
        })
        .from(featuredPlacements)
        .where(eq(featuredPlacements.isActive, true))
        .groupBy(featuredPlacements.destination),
    ]);

    const statsMap: Record<string, number> = {
      total: rows.length,
      homepage: 0,
      work_archive: 0,
      division: 0,
      industry: 0,
      campaign: 0,
    };
    for (const s of statsRows) {
      if (statsMap[s.destination] !== undefined) {
        statsMap[s.destination] = s.count;
      }
    }

    return apiOk({
      placements: rows,
      stats: statsMap,
      publishedProjects: allPublished,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/featured-placements");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await request.json().catch(() => null);
    const parsed = featuredPlacementInputSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid featured placement data.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const {
      projectId,
      destination,
      targetId,
      displayOrder,
      isActive,
      featuredFrom,
      featuredUntil,
      confirmReplace,
    } = parsed.data;

    // Rule: Project must exist and must be published
    const [project] = await db
      .select({
        id: projects.id,
        title: projects.title,
        status: projects.status,
        isFeatured: projects.isFeatured,
      })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1);

    if (!project) {
      return apiNotFound("Project not found.");
    }

    if (project.status !== "published") {
      return apiBadRequest(
        "Only published portfolio entries may be featured on the public website. Draft, In Review and Archived entries cannot be featured."
      );
    }

    // Rule: Check for single-slot conflict on Homepage
    if (destination === "homepage" && (displayOrder === 1 || displayOrder === 0)) {
      const [existingHomepagePrimary] = await db
        .select({
          id: featuredPlacements.id,
          projectId: featuredPlacements.projectId,
          title: projects.title,
        })
        .from(featuredPlacements)
        .innerJoin(projects, eq(featuredPlacements.projectId, projects.id))
        .where(
          and(
            eq(featuredPlacements.destination, "homepage"),
            eq(featuredPlacements.isActive, true),
            eq(featuredPlacements.displayOrder, 1)
          )
        )
        .limit(1);

      if (
        existingHomepagePrimary &&
        existingHomepagePrimary.projectId !== projectId &&
        !confirmReplace
      ) {
        return apiError(
          "Conflict",
          `Homepage primary featured is currently occupied by "${existingHomepagePrimary.title}". Replacing it will update the primary showcase on the public homepage.`,
          409,
          {
            conflict: true,
            currentProject: {
              id: existingHomepagePrimary.projectId,
              title: existingHomepagePrimary.title,
              placementId: existingHomepagePrimary.id,
            },
          }
        );
      }

      // If replace confirmed, shift existing primary to order 2
      if (existingHomepagePrimary && confirmReplace) {
        await db
          .update(featuredPlacements)
          .set({ displayOrder: 2, updatedAt: new Date() })
          .where(eq(featuredPlacements.id, existingHomepagePrimary.id));
      }
    }

    // Insert new placement
    const [inserted] = await db
      .insert(featuredPlacements)
      .values({
        projectId,
        destination,
        targetId: targetId || null,
        displayOrder: displayOrder || 1,
        isActive: isActive !== false,
        featuredFrom: featuredFrom ? new Date(featuredFrom) : null,
        featuredUntil: featuredUntil ? new Date(featuredUntil) : null,
      })
      .returning();

    // Ensure project is marked as isFeatured = true
    if (!project.isFeatured) {
      await db
        .update(projects)
        .set({ isFeatured: true, updatedAt: new Date() })
        .where(eq(projects.id, projectId));
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      action: "portfolio.placement.created",
      entityType: "featured_placement",
      entityId: inserted.id,
      metadata: {
        description: `Featured project "${project.title}" on ${destination}${targetId ? ` (${targetId})` : ""}.`,
        projectId,
        destination,
        targetId,
        displayOrder,
      },
    });

    return apiOk(inserted, { message: "Project successfully added to featured placement." });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/featured-placements");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await request.json().catch(() => null);
    if (!body) return apiBadRequest("Request body is required.");

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    // Handle batch reorder
    if (Array.isArray(body.reorder)) {
      for (const item of body.reorder) {
        if (item.id && typeof item.displayOrder === "number") {
          await db
            .update(featuredPlacements)
            .set({ displayOrder: item.displayOrder, updatedAt: new Date() })
            .where(eq(featuredPlacements.id, item.id));
        }
      }
      return apiOk({ updated: body.reorder.length }, { message: "Display order updated." });
    }

    // Handle single placement update
    if (body.id) {
      const updateData: Record<string, unknown> = { updatedAt: new Date() };
      if (typeof body.displayOrder === "number") updateData.displayOrder = body.displayOrder;
      if (typeof body.isActive === "boolean") updateData.isActive = body.isActive;
      if (body.targetId !== undefined) updateData.targetId = body.targetId;
      if (body.featuredFrom !== undefined) {
        updateData.featuredFrom = body.featuredFrom ? new Date(body.featuredFrom) : null;
      }
      if (body.featuredUntil !== undefined) {
        updateData.featuredUntil = body.featuredUntil ? new Date(body.featuredUntil) : null;
      }

      const [updated] = await db
        .update(featuredPlacements)
        .set(updateData)
        .where(eq(featuredPlacements.id, body.id))
        .returning();

      if (!updated) return apiNotFound("Featured placement not found.");

      return apiOk(updated, { message: "Placement updated." });
    }

    return apiBadRequest("Invalid request parameters.");
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/featured-placements");
  }
}
