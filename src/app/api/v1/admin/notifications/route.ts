import { NextRequest } from "next/server";
import { requireAdminRole } from "@/lib/server/session";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { handleApiError } from "@/lib/server/errors";
import {
  getOutboxStats,
  listOutboxJobs,
  processOutboxJobs,
} from "@/lib/server/notifications";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const { searchParams } = new URL(request.url);
    const limit = Math.min(
      Math.max(parseInt(searchParams.get("limit") || "50", 10), 1),
      100
    );
    const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
    const offset = (page - 1) * limit;
    const status = searchParams.get("status") || undefined;

    const [stats, jobs] = await Promise.all([
      getOutboxStats(),
      listOutboxJobs({ limit, offset, status }),
    ]);

    const totalForStatus = status
      ? status === "pending"
        ? stats.pending
        : status === "sent"
        ? stats.sent
        : status === "failed"
        ? stats.failed
        : status === "dead_letter"
        ? stats.deadLetter
        : stats.total
      : stats.total;

    const totalPages = Math.max(1, Math.ceil(totalForStatus / limit));

    return apiOk({
      stats,
      jobs,
      pagination: {
        page,
        limit,
        total: totalForStatus,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    return handleApiError(error, "GET /api/v1/admin/notifications");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin"]);
    if (auth.errorResponse) return auth.errorResponse;

    // Trigger immediate outbox processor run
    const result = await processOutboxJobs(20);
    return apiOk(result);
  } catch (error) {
    return handleApiError(error, "POST /api/v1/admin/notifications");
  }
}
