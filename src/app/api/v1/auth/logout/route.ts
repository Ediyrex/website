import {
  clearSessionCookie,
  getAuthenticatedSession,
  revokeSessionById,
} from "@/lib/server/session";
import { recordAuditLog } from "@/lib/server/audit";
import { apiOk, apiServerError } from "@/lib/server/api-response";
import { logger } from "@/lib/server/logger";

export async function POST() {
  try {
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
    logger.error({ err }, "Error during POST /api/v1/auth/logout");
    return apiServerError("Unable to complete logout.");
  }
}

