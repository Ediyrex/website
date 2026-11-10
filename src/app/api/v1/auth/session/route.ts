import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { getAuthenticatedSession } from "@/lib/server/session";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { handleApiError } from "@/lib/server/errors";
import {
  apiOk,
  apiTooManyRequests,
  apiUnauthorized,
} from "@/lib/server/api-response";

export async function GET(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "local";
    const ipHash = createHash("sha256").update(clientIp).digest("hex");

    const rate = checkRateLimit(`auth:session:${ipHash}`, 60, 60 * 1000);
    if (!rate.allowed) {
      return apiTooManyRequests(rate.retryAfterSeconds);
    }

    const session = await getAuthenticatedSession();
    if (!session) {
      return apiUnauthorized("No active administrative session.");
    }

    return apiOk({
      authenticated: true,
      user: {
        id: session.userId,
        email: session.email,
        displayName: session.displayName,
        roles: session.roles,
      },
      expiresAt: session.expiresAt.toISOString(),
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/auth/session");
  }
}
