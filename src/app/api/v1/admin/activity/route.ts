import { desc, eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { auditLogs, getDb } from "@/db";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { paginationSchema } from "@/lib/validations/query";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { searchParams } = new URL(request.url);
    const parsedPage = paginationSchema.safeParse({
      page: searchParams.get("page") ?? undefined,
      limit: searchParams.get("limit") ?? undefined,
    });
    if (!parsedPage.success) {
      return apiBadRequest(
        "Invalid pagination parameters.",
        parsedPage.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const { page, limit } = parsedPage.data;
    const offset = (page - 1) * limit;
    const entityType = searchParams.get("entityType")?.trim();

    const whereClause = entityType
      ? eq(auditLogs.entityType, entityType)
      : undefined;

    const rows = await db
      .select({
        id: auditLogs.id,
        actorEmailSnapshot: auditLogs.actorEmailSnapshot,
        action: auditLogs.action,
        entityType: auditLogs.entityType,
        entityId: auditLogs.entityId,
        metadata: auditLogs.metadata,
        createdAt: auditLogs.createdAt,
      })
      .from(auditLogs)
      .where(whereClause)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db
      .select({ total: sql<number>`count(*)::int` })
      .from(auditLogs)
      .where(whereClause);

    return apiOk(rows, {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/activity");
  }
}

