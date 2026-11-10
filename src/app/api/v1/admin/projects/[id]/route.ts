import { and, asc, eq, ne } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
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
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { projectUpsertSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid project ID.");

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid project identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!project) {
      return apiNotFound("Project not found.");
    }

    const [linkedServices, galleryRows, [study], coverRows, ogRows] =
      await Promise.all([
        db
          .select({ serviceId: projectServices.serviceId })
          .from(projectServices)
          .where(eq(projectServices.projectId, id)),
        db
          .select({
            id: mediaAssets.id,
            secureUrl: mediaAssets.secureUrl,
            altText: mediaAssets.altText,
            displayOrder: projectMedia.displayOrder,
          })
          .from(projectMedia)
          .innerJoin(mediaAssets, eq(projectMedia.mediaAssetId, mediaAssets.id))
          .where(eq(projectMedia.projectId, id))
          .orderBy(asc(projectMedia.displayOrder)),
        db
          .select()
          .from(caseStudies)
          .where(eq(caseStudies.projectId, id))
          .limit(1),
        project.coverAssetId
          ? db
              .select({ id: mediaAssets.id, secureUrl: mediaAssets.secureUrl, altText: mediaAssets.altText })
              .from(mediaAssets)
              .where(eq(mediaAssets.id, project.coverAssetId))
              .limit(1)
          : Promise.resolve([]),
        project.ogImageAssetId
          ? db
              .select({ id: mediaAssets.id, secureUrl: mediaAssets.secureUrl, altText: mediaAssets.altText })
              .from(mediaAssets)
              .where(eq(mediaAssets.id, project.ogImageAssetId))
              .limit(1)
          : Promise.resolve([]),
      ]);

    return apiOk({
      ...project,
      coverAsset: coverRows[0] ?? null,
      ogImageAsset: ogRows[0] ?? null,
      serviceIds: linkedServices.map((s) => s.serviceId),
      galleryAssets: galleryRows,
      galleryAssetIds: galleryRows.map((g) => g.id),
      caseStudy: study
        ? {
            challenge: study.challenge,
            approach: study.approach,
            solution: study.solution,
            verifiedOutcomes: study.verifiedOutcomes,
            processSteps: study.processSteps,
          }
        : null,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/projects/[id]");
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
      return apiBadRequest("Invalid project identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = projectUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid project update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existing] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);

    if (!existing) {
      return apiNotFound("Project not found.");
    }

    const data = parsed.data;

    const [slugConflict] = await db
      .select({ id: projects.id })
      .from(projects)
      .where(and(eq(projects.slug, data.slug), ne(projects.id, id)))
      .limit(1);

    if (slugConflict) {
      return apiError(
        "Conflict",
        "Another project already uses this URL slug.",
        409
      );
    }

    const isClientProject = data.projectType === "client";
    const normalizedClientName = isClientProject ? data.clientName || null : null;
    const normalizedClientIsPublic = isClientProject ? data.clientIsPublic : false;
    const publishedAt =
      data.status === "published" ? existing.publishedAt ?? new Date() : existing.publishedAt;

    const updated = await db.transaction(async (tx) => {
      const [row] = await tx
        .update(projects)
        .set({
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
        .where(eq(projects.id, id))
        .returning();

      await tx.delete(projectServices).where(eq(projectServices.projectId, id));
      if (data.serviceIds.length > 0) {
        await tx
          .insert(projectServices)
          .values(
            data.serviceIds.map((serviceId) => ({
              projectId: id,
              serviceId,
            }))
          )
          .onConflictDoNothing();
      }

      await tx.delete(projectMedia).where(eq(projectMedia.projectId, id));
      if (data.galleryAssetIds.length > 0) {
        await tx
          .insert(projectMedia)
          .values(
            data.galleryAssetIds.map((mediaAssetId, index) => ({
              projectId: id,
              mediaAssetId,
              mediaRole: "gallery" as const,
              displayOrder: index,
            }))
          )
          .onConflictDoNothing();
      }

      if (data.caseStudy) {
        await tx
          .insert(caseStudies)
          .values({
            projectId: id,
            challenge: data.caseStudy.challenge,
            approach: data.caseStudy.approach,
            solution: data.caseStudy.solution,
            verifiedOutcomes: data.caseStudy.verifiedOutcomes,
            processSteps: data.caseStudy.processSteps,
            status: data.status,
            publishedAt,
          })
          .onConflictDoUpdate({
            target: caseStudies.projectId,
            set: {
              challenge: data.caseStudy.challenge,
              approach: data.caseStudy.approach,
              solution: data.caseStudy.solution,
              verifiedOutcomes: data.caseStudy.verifiedOutcomes,
              processSteps: data.caseStudy.processSteps,
              status: data.status,
              publishedAt,
            },
          });
      }

      return row;
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "project.updated",
      entityType: "project",
      entityId: id,
      metadata: { slug: updated.slug, status: updated.status },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/projects/[id]");
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
      return apiBadRequest("Invalid project identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [deleted] = await db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning({ id: projects.id, slug: projects.slug });

    if (!deleted) {
      return apiNotFound("Project not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "project.deleted",
      entityType: "project",
      entityId: id,
      metadata: { slug: deleted.slug },
    });

    return apiOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/projects/[id]");
  }
}

