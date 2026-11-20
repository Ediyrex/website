import { desc } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb, seoAudits } from "@/db";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { ensureSeoManagementTables, runFullSeoAudit } from "@/lib/server/seo-engine";

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureSeoManagementTables();

    const audits = await db
      .select()
      .from(seoAudits)
      .orderBy(desc(seoAudits.createdAt))
      .limit(30);

    return apiOk(audits);
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/seo/audits");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    let triggeredBy = "manual";
    try {
      const body = await request.json();
      if (body.triggeredBy) triggeredBy = String(body.triggeredBy);
    } catch {
      // Body is optional
    }

    const result = await runFullSeoAudit(auth.session.email || triggeredBy);

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "seo.audit_executed",
      entityType: "seo_audit",
      entityId: result.auditId,
      metadata: {
        overallScore: result.overallScore,
        pagesProcessed: result.pagesProcessed,
        pagesFailed: result.pagesFailed,
      },
    });

    return apiOk(result);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/seo/audits");
  }
}
