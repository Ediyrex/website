import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb, serviceDivisions } from "@/db";
import {
  apiBadRequest,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { divisionUpdateSchema } from "@/lib/validations/cms";

const uuidSchema = z.string().uuid("Invalid division ID.");

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid division identifier.");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = divisionUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid service division update payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existing] = await db
      .select()
      .from(serviceDivisions)
      .where(eq(serviceDivisions.id, id))
      .limit(1);

    if (!existing) {
      return apiNotFound("Service division not found.");
    }

    const updateValues: Partial<typeof serviceDivisions.$inferInsert> = {
      updatedAt: new Date(),
    };

    if (parsed.data.displayNumber !== undefined)
      updateValues.displayNumber = parsed.data.displayNumber;
    if (parsed.data.name !== undefined) updateValues.name = parsed.data.name;
    if (parsed.data.heading !== undefined)
      updateValues.heading = parsed.data.heading;
    if (parsed.data.italicHeading !== undefined)
      updateValues.italicHeading = parsed.data.italicHeading;
    if (parsed.data.description !== undefined)
      updateValues.description = parsed.data.description;
    if (parsed.data.tags !== undefined) updateValues.tags = parsed.data.tags;
    if (parsed.data.ctaLabel !== undefined)
      updateValues.ctaLabel = parsed.data.ctaLabel;
    if (parsed.data.destinationUrl !== undefined)
      updateValues.destinationUrl =
        parsed.data.destinationUrl || `/services/${existing.slug}`;
    if (parsed.data.coverImageUrl !== undefined)
      updateValues.coverImageUrl = parsed.data.coverImageUrl || "";
    if (parsed.data.coverAlt !== undefined)
      updateValues.coverAlt = parsed.data.coverAlt;
    if (parsed.data.iconName !== undefined)
      updateValues.iconName = parsed.data.iconName || null;
    if (parsed.data.displayOrder !== undefined)
      updateValues.displayOrder = parsed.data.displayOrder;
    if (parsed.data.isActive !== undefined)
      updateValues.isActive = parsed.data.isActive;
    if (parsed.data.isFeatured !== undefined)
      updateValues.isFeatured = parsed.data.isFeatured;

    const [updated] = await db
      .update(serviceDivisions)
      .set(updateValues)
      .where(eq(serviceDivisions.id, id))
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "division.updated",
      entityType: "service_division",
      entityId: id,
      metadata: { slug: updated.slug, name: updated.name },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/divisions/[id]");
  }
}

