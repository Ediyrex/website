import { NextRequest } from "next/server";
import { getAuthenticatedSession } from "@/lib/server/session";
import { apiForbidden, apiOk, apiServerError, apiUnauthorized } from "@/lib/server/api-response";
import { disconnectAccount } from "@/lib/server/calendar/calendar-service";

export async function POST(request: NextRequest) {
  const session = await getAuthenticatedSession();
  if (!session && process.env.NODE_ENV === "production") {
    return apiUnauthorized();
  }

  try {
    const body = await request.json().catch(() => ({}));
    const { accountId } = body;

    if (!accountId) {
      return apiServerError("accountId is required");
    }

    await disconnectAccount(accountId);
    return apiOk({ success: true, message: "Google account disconnected and tokens revoked" });
  } catch (error) {
    return apiServerError(
      error instanceof Error ? error.message : "Failed to disconnect account"
    );
  }
}
