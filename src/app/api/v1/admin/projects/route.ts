import { unstable_rethrow } from "next/navigation";
import { asc, desc } from "drizzle-orm";
import { getDb, projects } from "@/db";
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
        id: projects.id,
        title: projects.title,
        slug: projects.slug,
        projectType: projects.projectType,
        status: projects.status,
        isFeatured: projects.isFeatured,
        displayOrder: projects.displayOrder,
        publishedAt: projects.publishedAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .orderBy(asc(projects.displayOrder), desc(projects.updatedAt));

    return apiOk(rows, { total: rows.length });
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to fetch admin projects");
    return apiServerError("Unable to load projects.");
  }
}
