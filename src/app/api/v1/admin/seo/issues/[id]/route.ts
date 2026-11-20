import { eq } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb, seoIssues } from "@/db";
import { apiBadRequest, apiNotFound, apiOk, apiServerError } from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";

const patchIssueSchema = z.object({
  status: z.enum(["open", "in_progress", "resolved", "ignored", "reopened"]),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const parsed = patchIssueSchema.safeParse(body);

    if (!parsed.success) {
      return apiBadRequest("Invalid issue status update", {
        issues: parsed.error.issues,
      });
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const now = new Date();
    const updateValues: Record<string, unknown> = {
      status: parsed.data.status,
    };

    if (parsed.data.status === "resolved") {
      updateValues.resolvedAt = now;
    } else if (parsed.data.status === "ignored") {
      updateValues.ignoredAt = now;
    }

    const [updated] = await db
      .update(seoIssues)
      .set(updateValues)
      .where(eq(seoIssues.id, id))
      .returning();

    if (!updated) {
      return apiNotFound("Issue not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "seo.issue_updated",
      entityType: "seo_issue",
      entityId: id,
      metadata: { newStatus: parsed.data.status },
    });

    return apiOk(updated);
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/seo/issues/[id]");
  }
}
