import { and, eq, ne } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import {
  getDb,
  sectorArchitectures,
  industrySectorArchitectures,
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
import { sectorArchitectureUpsertSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid sector architecture ID.");

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid sector architecture identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [arch] = await db
      .select()
      .from(sectorArchitectures)
      .where(eq(sectorArchitectures.id, id))
      .limit(1);

    if (!arch) {
      return apiNotFound("Sector architecture not found.");
    }

    const links = await db
      .select({ industryId: industrySectorArchitectures.industryId })
      .from(industrySectorArchitectures)
      .where(eq(industrySectorArchitectures.sectorArchitectureId, id));

    return apiOk({
      ...arch,
      industryIds: links.map((l) => l.industryId),
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/sector-architectures/[id]");
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
      return apiBadRequest("Invalid sector architecture identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = sectorArchitectureUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid sector architecture update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existing] = await db
      .select()
      .from(sectorArchitectures)
      .where(eq(sectorArchitectures.id, id))
      .limit(1);

    if (!existing) {
      return apiNotFound("Sector architecture not found.");
    }

    const data = parsed.data;

    const [slugConflict] = await db
      .select({ id: sectorArchitectures.id })
      .from(sectorArchitectures)
      .where(and(eq(sectorArchitectures.slug, data.slug), ne(sectorArchitectures.id, id)))
      .limit(1);

    if (slugConflict) {
      return apiError(
        "Conflict",
        "Another sector architecture already uses this URL slug.",
        409
      );
    }

    const [updated] = await db
      .update(sectorArchitectures)
      .set({
        slug: data.slug,
        number: data.number || null,
        category: data.category,
        title: data.title,
        description: data.description,
        capabilities: data.capabilities,
        displayOrder: data.displayOrder,
        status: data.status,
        isFeatured: data.isFeatured,
        isHighlighted: data.isHighlighted,
        detailRoute: data.detailRoute || "/contact",
        updatedAt: new Date(),
      })
      .where(eq(sectorArchitectures.id, id))
      .returning();

    // Re-link industries
    await db
      .delete(industrySectorArchitectures)
      .where(eq(industrySectorArchitectures.sectorArchitectureId, id));

    if (data.industryIds.length > 0) {
      for (const industryId of data.industryIds) {
        await db
          .insert(industrySectorArchitectures)
          .values({ industryId, sectorArchitectureId: id })
          .onConflictDoNothing();
      }
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "sector_architecture.update",
      entityType: "sector_architecture",
      entityId: id,
      metadata: {
        description: `Updated sector architecture "${updated.title}" (${updated.slug})`,
        slug: updated.slug,
      },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/sector-architectures/[id]");
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
      return apiBadRequest("Invalid sector architecture identifier.");
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existing] = await db
      .select({ id: sectorArchitectures.id, title: sectorArchitectures.title, slug: sectorArchitectures.slug })
      .from(sectorArchitectures)
      .where(eq(sectorArchitectures.id, id))
      .limit(1);

    if (!existing) {
      return apiNotFound("Sector architecture not found.");
    }

    await db.delete(sectorArchitectures).where(eq(sectorArchitectures.id, id));

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "sector_architecture.delete",
      entityType: "sector_architecture",
      entityId: id,
      metadata: {
        description: `Deleted sector architecture "${existing.title}" (${existing.slug})`,
        slug: existing.slug,
      },
    });

    return apiOk({ success: true, deletedId: id });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/sector-architectures/[id]");
  }
}
