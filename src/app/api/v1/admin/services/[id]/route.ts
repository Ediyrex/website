import { and, eq, ne, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  enquiries,
  getDb,
  mediaAssets,
  projectServices,
  serviceDivisions,
  services,
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
import { serviceUpsertSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid service ID.");

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid service identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [service] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!service) {
      return apiNotFound("Service not found.");
    }

    const [coverRows, ogRows] = await Promise.all([
      service.coverAssetId
        ? db
            .select({
              id: mediaAssets.id,
              secureUrl: mediaAssets.secureUrl,
              altText: mediaAssets.altText,
            })
            .from(mediaAssets)
            .where(eq(mediaAssets.id, service.coverAssetId))
            .limit(1)
        : Promise.resolve([]),
      service.ogImageAssetId
        ? db
            .select({
              id: mediaAssets.id,
              secureUrl: mediaAssets.secureUrl,
              altText: mediaAssets.altText,
            })
            .from(mediaAssets)
            .where(eq(mediaAssets.id, service.ogImageAssetId))
            .limit(1)
        : Promise.resolve([]),
    ]);

    return apiOk({
      ...service,
      coverAsset: coverRows[0] ?? null,
      ogImageAsset: ogRows[0] ?? null,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/services/[id]");
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
      return apiBadRequest("Invalid service identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = serviceUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid service update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existing] = await db
      .select()
      .from(services)
      .where(eq(services.id, id))
      .limit(1);

    if (!existing) {
      return apiNotFound("Service not found.");
    }

    const data = parsed.data;

    const [[divisionExists], [slugConflict]] = await Promise.all([
      db
        .select({ id: serviceDivisions.id })
        .from(serviceDivisions)
        .where(eq(serviceDivisions.id, data.divisionId))
        .limit(1),
      db
        .select({ id: services.id })
        .from(services)
        .where(and(eq(services.slug, data.slug), ne(services.id, id)))
        .limit(1),
    ]);

    if (!divisionExists) {
      return apiBadRequest("Selected service division does not exist.");
    }
    if (slugConflict) {
      return apiError(
        "Conflict",
        "Another service already uses this URL slug.",
        409
      );
    }

    const publishedAt =
      data.status === "published"
        ? existing.publishedAt ?? new Date()
        : existing.publishedAt;

    const [updated] = await db
      .update(services)
      .set({
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
      .where(eq(services.id, id))
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "service.updated",
      entityType: "service",
      entityId: id,
      metadata: { slug: updated.slug, status: updated.status },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/services/[id]");
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
      return apiBadRequest("Invalid service identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [[projRefs], [enqRefs]] = await Promise.all([
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(projectServices)
        .where(eq(projectServices.serviceId, id)),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(enquiries)
        .where(eq(enquiries.serviceId, id)),
    ]);

    if ((projRefs?.count ?? 0) > 0) {
      return apiError(
        "Conflict",
        "This service is linked to existing projects. Unlink it or set status to Archived.",
        409
      );
    }
    if ((enqRefs?.count ?? 0) > 0) {
      return apiError(
        "Conflict",
        "This service is referenced by historical enquiries. Set its status to Archived instead of deleting.",
        409
      );
    }

    const [deleted] = await db
      .delete(services)
      .where(eq(services.id, id))
      .returning({ id: services.id, slug: services.slug });

    if (!deleted) {
      return apiNotFound("Service not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "service.deleted",
      entityType: "service",
      entityId: id,
      metadata: { slug: deleted.slug },
    });

    return apiOk({ deleted: true, id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/services/[id]");
  }
}

