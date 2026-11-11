import { asc, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb, serviceDivisions } from "@/db";
import {
  apiBadRequest,
  apiError,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { ensureDivisionEditorialDefaults } from "@/lib/server/catalog";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { divisionCreateSchema } from "@/lib/validations/cms";

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureDivisionEditorialDefaults(db);

    const rows = await db
      .select()
      .from(serviceDivisions)
      .orderBy(asc(serviceDivisions.displayOrder), asc(serviceDivisions.name));

    return apiOk(rows);
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/divisions");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin"]);
    if (auth.errorResponse) return auth.errorResponse;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = divisionCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid service division payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [existingSlug] = await db
      .select({ id: serviceDivisions.id })
      .from(serviceDivisions)
      .where(eq(serviceDivisions.slug, parsed.data.slug))
      .limit(1);

    if (existingSlug) {
      return apiError(
        "Conflict",
        "A service division with this slug already exists.",
        409
      );
    }

    const [created] = await db
      .insert(serviceDivisions)
      .values({
        displayNumber: parsed.data.displayNumber,
        name: parsed.data.name,
        slug: parsed.data.slug,
        heading: parsed.data.heading,
        italicHeading: parsed.data.italicHeading,
        description: parsed.data.description,
        tags: parsed.data.tags,
        ctaLabel: parsed.data.ctaLabel,
        destinationUrl: parsed.data.destinationUrl || `/services/${parsed.data.slug}`,
        coverImageUrl: parsed.data.coverImageUrl || "",
        coverAlt: parsed.data.coverAlt || parsed.data.name,
        iconName: parsed.data.iconName || null,
        displayOrder: parsed.data.displayOrder,
        isActive: parsed.data.isActive,
        isFeatured: parsed.data.isFeatured,
      })
      .returning();

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "division.created",
      entityType: "service_division",
      entityId: created.id,
      metadata: { slug: created.slug },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/divisions");
  }
}
