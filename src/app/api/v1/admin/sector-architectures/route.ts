import { asc, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  getDb,
  sectorArchitectures,
  industrySectorArchitectures,
  industries,
} from "@/db";
import {
  apiBadRequest,
  apiError,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { ensureSectorArchitectureDefaults } from "@/lib/server/catalog";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { sectorArchitectureUpsertSchema } from "@/lib/validations/cms";

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureSectorArchitectureDefaults(db);

    const rows = await db
      .select()
      .from(sectorArchitectures)
      .orderBy(asc(sectorArchitectures.displayOrder), asc(sectorArchitectures.title));

    // Also get connected industry count or IDs for each architecture
    const links = await db
      .select({
        architectureId: industrySectorArchitectures.sectorArchitectureId,
        industryId: industries.id,
        industryName: industries.name,
      })
      .from(industrySectorArchitectures)
      .innerJoin(
        industries,
        eq(industrySectorArchitectures.industryId, industries.id)
      );

    const enriched = rows.map((arch) => ({
      ...arch,
      industryIds: links
        .filter((l) => l.architectureId === arch.id)
        .map((l) => l.industryId),
      industries: links
        .filter((l) => l.architectureId === arch.id)
        .map((l) => ({ id: l.industryId, name: l.industryName })),
    }));

    return apiOk(enriched);
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/sector-architectures");
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

    const parsed = sectorArchitectureUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid sector architecture payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureSectorArchitectureDefaults(db);

    const data = parsed.data;

    const [existingSlug] = await db
      .select({ id: sectorArchitectures.id })
      .from(sectorArchitectures)
      .where(eq(sectorArchitectures.slug, data.slug))
      .limit(1);

    if (existingSlug) {
      return apiError(
        "Conflict",
        "A sector architecture with this slug already exists.",
        409
      );
    }

    const [created] = await db
      .insert(sectorArchitectures)
      .values({
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
      })
      .returning();

    // Link industries
    if (data.industryIds.length > 0) {
      for (const industryId of data.industryIds) {
        await db
          .insert(industrySectorArchitectures)
          .values({
            industryId,
            sectorArchitectureId: created.id,
          })
          .onConflictDoNothing();
      }
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "sector_architecture.create",
      entityType: "sector_architecture",
      entityId: created.id,
      metadata: {
        description: `Created sector architecture "${created.title}" (${created.slug})`,
        slug: created.slug,
      },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/sector-architectures");
  }
}
