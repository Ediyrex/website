import { and, desc, eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb, seoIssues } from "@/db";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { ensureSeoManagementTables } from "@/lib/server/seo-engine";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureSeoManagementTables();

    const { searchParams } = new URL(request.url);
    const statusFilter = searchParams.get("status") || "";
    const severityFilter = searchParams.get("severity") || "";
    const categoryFilter = searchParams.get("category") || "";

    const conditions = [];
    if (statusFilter && statusFilter !== "all") {
      conditions.push(eq(seoIssues.status, statusFilter));
    }
    if (severityFilter && severityFilter !== "all") {
      conditions.push(eq(seoIssues.severity, severityFilter));
    }
    if (categoryFilter && categoryFilter !== "all") {
      conditions.push(eq(seoIssues.category, categoryFilter));
    }

    const rows = await db
      .select()
      .from(seoIssues)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(seoIssues.lastDetectedAt))
      .limit(100);

    return apiOk(rows);
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/seo/issues");
  }
}
