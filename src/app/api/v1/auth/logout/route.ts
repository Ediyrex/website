import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import {
  clearSessionCookie,
  getAuthenticatedSession,
  revokeSessionById,
} from "@/lib/server/session";
import { recordAuditLog } from "@/lib/server/audit";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { handleApiError } from "@/lib/server/errors";
import { apiOk, apiTooManyRequests } from "@/lib/server/api-response";

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "local";
    const ipHash = createHash("sha256").update(clientIp).digest("hex");

    const rate = checkRateLimit(`auth:logout:${ipHash}`, 20, 60 * 1000);
    if (!rate.allowed) {
      return apiTooManyRequests(rate.retryAfterSeconds);
    }

    const session = await getAuthenticatedSession();

    if (session) {
      await revokeSessionById(session.sessionId);
      await recordAuditLog({
        actorUserId: session.userId,
        actorEmailSnapshot: session.email,
        action: "auth.logout",
        entityType: "session",
        entityId: session.sessionId,
      });
    }

    await clearSessionCookie();
    return apiOk({ loggedOut: true });
  } catch (err) {
    return handleApiError(err, "POST /api/v1/auth/logout");
  }
}

