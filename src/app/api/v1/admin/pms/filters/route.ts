import { unstable_rethrow } from "next/navigation";
import { and, desc, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb, pmsSavedFilters } from "@/db";
import {
  apiBadRequest,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { logger } from "@/lib/server/logger";
import { requireAdminRole } from "@/lib/server/session";
import { pmsSavedFilterCreateSchema } from "@/lib/validations/pms";

const uuidSchema = z.string().uuid("Invalid filter identifier.");

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope")?.trim();

    const conditions = [eq(pmsSavedFilters.userId, auth.session.userId)];
    if (scope && ["projects", "tasks", "my_tasks"].includes(scope)) {
      conditions.push(eq(pmsSavedFilters.scope, scope));
    }

    const rows = await db
      .select()
      .from(pmsSavedFilters)
      .where(and(...conditions))
      .orderBy(desc(pmsSavedFilters.createdAt));

    return apiOk(rows);
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to fetch saved PMS filters");
    return apiServerError("Unable to load saved filters.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = pmsSavedFilterCreateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid saved filter payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const [created] = await db
      .insert(pmsSavedFilters)
      .values({
        userId: auth.session.userId,
        scope: parsed.data.scope,
        name: parsed.data.name,
        filterConfig: parsed.data.filterConfig,
      })
      .returning();

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/filters");
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") || "";
    if (!uuidSchema.safeParse(id).success) {
      return apiBadRequest("Invalid filter identifier.");
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const [deleted] = await db
      .delete(pmsSavedFilters)
      .where(
        and(
          eq(pmsSavedFilters.id, id),
          eq(pmsSavedFilters.userId, auth.session.userId)
        )
      )
      .returning({ id: pmsSavedFilters.id });

    if (!deleted) return apiNotFound("Saved filter not found.");
    return apiOk({ deleted: true });
  } catch (err) {
    return handleApiError(err, "DELETE /api/v1/admin/pms/filters");
  }
}

