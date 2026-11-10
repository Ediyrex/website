import { unstable_rethrow } from "next/navigation";
import { asc, eq } from "drizzle-orm";
import { getDb, services, serviceDivisions } from "@/db";
import { requireAdminRole } from "@/lib/server/session";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { logger } from "@/lib/server/logger";

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const rows = await db
      .select({
        id: services.id,
        title: services.title,
        slug: services.slug,
        divisionSlug: serviceDivisions.slug,
        divisionName: serviceDivisions.name,
        status: services.status,
        isFeatured: services.isFeatured,
        displayOrder: services.displayOrder,
        updatedAt: services.updatedAt,
      })
      .from(services)
      .innerJoin(serviceDivisions, eq(services.divisionId, serviceDivisions.id))
      .orderBy(asc(services.displayOrder), asc(services.title));

    return apiOk(rows, { total: rows.length });
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to fetch admin services");
    return apiServerError("Unable to load services.");
  }
}
