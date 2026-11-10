import { inArray } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { blogPosts, cmsPages, getDb, projects, services } from "@/db";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { seoBulkPatchSchema } from "@/lib/validations/cms";

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

    const parsed = seoBulkPatchSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid bulk SEO payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const { items, action, robotsDirective, schemaType } = parsed.data;

    if (action === "set_robots" && !robotsDirective) {
      return apiBadRequest("robotsDirective is required for set_robots.");
    }
    if (action === "set_schema" && !schemaType) {
      return apiBadRequest("schemaType is required for set_schema.");
    }

    const pageIds = items.filter((i) => i.kind === "page").map((i) => i.id);
    const projectIds = items.filter((i) => i.kind === "portfolio").map((i) => i.id);
    const serviceIds = items.filter((i) => i.kind === "service").map((i) => i.id);
    const blogIds = items.filter((i) => i.kind === "blog").map((i) => i.id);

    const updateSet: Record<string, unknown> = { updatedAt: new Date() };
    if (action === "set_robots" && robotsDirective) {
      updateSet.robotsDirective = robotsDirective;
      updateSet.noIndex = robotsDirective.startsWith("noindex");
    } else if (action === "set_schema" && schemaType) {
      updateSet.schemaType = schemaType;
    }

    await Promise.all([
      pageIds.length > 0
        ? db.update(cmsPages).set(updateSet).where(inArray(cmsPages.id, pageIds))
        : Promise.resolve(),
      projectIds.length > 0
        ? db.update(projects).set(updateSet).where(inArray(projects.id, projectIds))
        : Promise.resolve(),
      serviceIds.length > 0
        ? db.update(services).set(updateSet).where(inArray(services.id, serviceIds))
        : Promise.resolve(),
      blogIds.length > 0
        ? db.update(blogPosts).set(updateSet).where(inArray(blogPosts.id, blogIds))
        : Promise.resolve(),
    ]);

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: `seo.bulk_${action}`,
      entityType: "seo",
      metadata: { count: items.length, robotsDirective, schemaType },
    });

    return apiOk({ updatedCount: items.length });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/seo/bulk");
  }
}

