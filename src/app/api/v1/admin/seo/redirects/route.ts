import { asc, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb, seoRedirects } from "@/db";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { seoRedirectUpsertSchema } from "@/lib/validations/cms";

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const rows = await db
      .select()
      .from(seoRedirects)
      .orderBy(asc(seoRedirects.source));

    return apiOk(rows);
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/seo/redirects");
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

    const parsed = seoRedirectUpsertSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid redirect payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;
    if (data.source === data.destination) {
      return apiBadRequest("Source and destination paths cannot be identical.");
    }

    const [created] = await db
      .insert(seoRedirects)
      .values({
        source: data.source,
        destination: data.destination,
        statusCode: data.statusCode,
        isActive: data.isActive,
        note: data.note || null,
      })
      .onConflictDoUpdate({
        target: seoRedirects.source,
        set: {
          destination: data.destination,
          statusCode: data.statusCode,
          isActive: data.isActive,
          note: data.note || null,
          updatedAt: new Date(),
        },
      })
      .returning();

    const [check] = await db
      .select()
      .from(seoRedirects)
      .where(eq(seoRedirects.id, created.id))
      .limit(1);

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "seo.redirect_saved",
      entityType: "seo_redirect",
      entityId: created.id,
      metadata: {
        source: data.source,
        destination: data.destination,
        statusCode: data.statusCode,
      },
    });

    return apiOk(check ?? created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/seo/redirects");
  }
}

