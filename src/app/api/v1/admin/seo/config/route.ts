import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { getDb, siteSettings } from "@/db";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { seoTechConfigSchema } from "@/lib/validations/cms";

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin"]);
    if (auth.errorResponse) return auth.errorResponse;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = seoTechConfigSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid SEO configuration payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const { robots, schema } = parsed.data;

    if (robots) {
      await db
        .insert(siteSettings)
        .values({
          settingKey: "robots_config",
          settingValue: robots,
          description: "Dynamic robots.txt crawl policy",
          isPublic: true,
          updatedByUserId: auth.session.userId,
        })
        .onConflictDoUpdate({
          target: siteSettings.settingKey,
          set: {
            settingValue: robots,
            updatedByUserId: auth.session.userId,
            updatedAt: new Date(),
          },
        });
      revalidatePath("/robots.txt");
    }

    if (schema) {
      await db
        .insert(siteSettings)
        .values({
          settingKey: "seo_schema",
          settingValue: schema,
          description: "Global Organization JSON-LD metadata",
          isPublic: true,
          updatedByUserId: auth.session.userId,
        })
        .onConflictDoUpdate({
          target: siteSettings.settingKey,
          set: {
            settingValue: schema,
            updatedByUserId: auth.session.userId,
            updatedAt: new Date(),
          },
        });
      revalidatePath("/");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "seo.tech_config_updated",
      entityType: "site_settings",
      metadata: { updatedRobots: Boolean(robots), updatedSchema: Boolean(schema) },
    });

    return apiOk({ saved: true });
  } catch (err) {
    return handleApiError(err, "PUT /api/v1/admin/seo/config");
  }
}

export async function POST() {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    revalidatePath("/sitemap.xml");
    revalidatePath("/robots.txt");

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "seo.sitemap_regenerated",
      entityType: "sitemap",
    });

    return apiOk({
      regenerated: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/seo/config");
  }
}

