import { NextRequest } from "next/server";
import { requireAdminRole } from "@/lib/server/session";
import { apiBadRequest, apiOk } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import { retryOutboxJob, processOutboxJobs } from "@/lib/server/notifications";

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const body = await request.json().catch(() => ({}));
    const { jobId } = body;

    if (!jobId || typeof jobId !== "string") {
      return apiBadRequest("Invalid or missing jobId");
    }

    const reloaded = await retryOutboxJob(jobId);
    if (!reloaded) {
      return apiBadRequest("Failed to retry outbox job or job not found");
    }

    // Process immediately in the background
    processOutboxJobs(5).catch(() => {});

    return apiOk({ success: true, message: "Outbox job re-queued for delivery." });
  } catch (error) {
    return handleApiError(error, "POST /api/v1/admin/notifications/retry");
  }
}
