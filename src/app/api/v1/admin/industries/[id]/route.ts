import { and, eq, ne } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  getDb,
  industries,
  industryServices,
  industrySectorArchitectures,
  industryProjects,
  services,
  sectorArchitectures,
  projects,
  mediaAssets,
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
import { industryUpsertSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid industry ID.");

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid industry identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [industry] = await db
      .select()
      .from(industries)
      .where(eq(industries.id, id))
      .limit(1);

    if (!industry) {
      return apiNotFound("Industry not found.");
    }

    const [coverRows, ogRows, svcRows, archRows, projRows] = await Promise.all([
      industry.coverAssetId
        ? db
            .select({
              id: mediaAssets.id,
              secureUrl: mediaAssets.secureUrl,
              altText: mediaAssets.altText,
            })
            .from(mediaAssets)
            .where(eq(mediaAssets.id, industry.coverAssetId))
            .limit(1)
        : Promise.resolve([]),
      industry.ogImageAssetId
        ? db
            .select({
              id: mediaAssets.id,
              secureUrl: mediaAssets.secureUrl,
              altText: mediaAssets.altText,
            })
            .from(mediaAssets)
            .where(eq(mediaAssets.id, industry.ogImageAssetId))
            .limit(1)
        : Promise.resolve([]),
      db
        .select({
          serviceId: industryServices.serviceId,
          title: services.title,
          slug: services.slug,
        })
        .from(industryServices)
        .innerJoin(services, eq(industryServices.serviceId, services.id))
        .where(eq(industryServices.industryId, id)),
      db
        .select({
          architectureId: industrySectorArchitectures.sectorArchitectureId,
          title: sectorArchitectures.title,
          category: sectorArchitectures.category,
        })
        .from(industrySectorArchitectures)
        .innerJoin(
          sectorArchitectures,
          eq(industrySectorArchitectures.sectorArchitectureId, sectorArchitectures.id)
        )
        .where(eq(industrySectorArchitectures.industryId, id)),
      db
        .select({
          projectId: industryProjects.projectId,
          title: projects.title,
          slug: projects.slug,
        })
        .from(industryProjects)
        .innerJoin(projects, eq(industryProjects.projectId, projects.id))
        .where(eq(industryProjects.industryId, id)),
    ]);

    return apiOk({
      ...industry,
      coverAsset: coverRows[0] ?? null,
      ogImageAsset: ogRows[0] ?? null,
      serviceIds: svcRows.map((s) => s.serviceId),
      sectorArchitectureIds: archRows.map((a) => a.architectureId),
      projectIds: projRows.map((p) => p.projectId),
      services: svcRows,
      sectorArchitectures: archRows,
      projects: projRows,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/industries/[id]");
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
      return apiBadRequest("Invalid industry identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = industryUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid industry update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existing] = await db
      .select()
      .from(industries)
      .where(eq(industries.id, id))
      .limit(1);

    if (!existing) {
      return apiNotFound("Industry not found.");
    }

    const data = parsed.data;

    const [slugConflict] = await db
      .select({ id: industries.id })
      .from(industries)
      .where(and(eq(industries.slug, data.slug), ne(industries.id, id)))
      .limit(1);

    if (slugConflict) {
      return apiError(
        "Conflict",
        "Another industry already uses this URL slug.",
        409
      );
    }

    const publishedAt =
      data.status === "published"
        ? existing.publishedAt ?? new Date()
        : null;

    const [updated] = await db
      .update(industries)
      .set({
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
        updatedAt: new Date(),
      })
      .where(eq(industries.id, id))
      .returning();

    // Sync relations: clear and re-insert
    await db.delete(industryServices).where(eq(industryServices.industryId, id));
    if (data.serviceIds.length > 0) {
      for (const serviceId of data.serviceIds) {
        await db
          .insert(industryServices)
          .values({ industryId: id, serviceId })
          .onConflictDoNothing();
      }
    }

    await db
      .delete(industrySectorArchitectures)
      .where(eq(industrySectorArchitectures.industryId, id));
    if (data.sectorArchitectureIds.length > 0) {
      for (const sectorArchitectureId of data.sectorArchitectureIds) {
        await db
          .insert(industrySectorArchitectures)
          .values({ industryId: id, sectorArchitectureId })
          .onConflictDoNothing();
      }
    }

    await db.delete(industryProjects).where(eq(industryProjects.industryId, id));
    if (data.projectIds.length > 0) {
      for (const projectId of data.projectIds) {
        await db
          .insert(industryProjects)
          .values({ industryId: id, projectId })
          .onConflictDoNothing();
      }
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "industry.update",
      entityType: "industry",
      entityId: id,
      metadata: {
        description: `Updated industry "${updated.name}" (${updated.slug})`,
        slug: updated.slug,
        status: updated.status,
      },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/industries/[id]");
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
      return apiBadRequest("Invalid industry identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existing] = await db
      .select({ id: industries.id, name: industries.name, slug: industries.slug })
      .from(industries)
      .where(eq(industries.id, id))
      .limit(1);

    if (!existing) {
      return apiNotFound("Industry not found.");
    }

    await db.delete(industries).where(eq(industries.id, id));

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "industry.delete",
      entityType: "industry",
      entityId: id,
      metadata: {
        description: `Deleted industry "${existing.name}" (${existing.slug})`,
        slug: existing.slug,
      },
    });

    return apiOk({ success: true, deletedId: id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/industries/[id]");
  }
}
