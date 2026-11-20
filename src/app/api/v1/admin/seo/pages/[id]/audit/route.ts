import type { NextRequest } from "next/server";
import { z } from "zod";
import { apiBadRequest, apiOk } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { runSinglePageAudit } from "@/lib/server/seo-engine";

const auditPageRequestSchema = z.object({
  entityType: z.enum(["page", "portfolio", "service", "blog", "industry"]),
  url: z.string().trim().min(1),
  title: z.string().trim().min(1),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { id } = await context.params;
    const body = await request.json().catch(() => ({}));
    const parsed = auditPageRequestSchema.safeParse(body);

    if (!parsed.success) {
      return apiBadRequest("Invalid page audit parameters", {
        issues: parsed.error.issues,
      });
    }

    const { entityType, url, title } = parsed.data;
    const result = await runSinglePageAudit(entityType, id, url, title);

    return apiOk(result);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/seo/pages/[id]/audit");
  }
}
