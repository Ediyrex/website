import { unstable_rethrow } from "next/navigation";
import { getAuthenticatedSession } from "@/lib/server/session";
import {
  apiOk,
  apiServerError,
  apiUnauthorized,
} from "@/lib/server/api-response";
import { logger } from "@/lib/server/logger";

export async function GET() {
  try {
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
    unstable_rethrow(err);
    logger.error({ err }, "Error checking session");
    return apiServerError("Unable to verify session.");
  }
}
