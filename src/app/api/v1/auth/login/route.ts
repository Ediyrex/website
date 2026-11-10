import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { eq } from "drizzle-orm";
import { getDb, users, userRoles, roles } from "@/db";
import { loginSchema } from "@/lib/validations/auth";
import { verifyPassword } from "@/lib/server/password";
import {
  createUserSession,
  setSessionCookie,
} from "@/lib/server/session";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { recordAuditLog } from "@/lib/server/audit";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
  apiTooManyRequests,
  apiUnauthorized,
} from "@/lib/server/api-response";
import { logger } from "@/lib/server/logger";

export async function POST(request: NextRequest) {
  try {
    const clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "local";
    const ipHash = createHash("sha256").update(clientIp).digest("hex");

    // Rate limit: 10 login attempts per 15 minutes per IP hash
    const rate = checkRateLimit(`auth:login:${ipHash}`, 10, 15 * 60 * 1000);
    if (!rate.allowed) {
      logger.warn({ ipHash }, "Auth login rate limit exceeded");
      return apiTooManyRequests(rate.retryAfterSeconds);
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid credentials format.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Authentication service requires database setup.");
    }

    const emailNormalized = parsed.data.email.toLowerCase();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.emailNormalized, emailNormalized))
      .limit(1);

    if (!user || !user.passwordHash || user.status !== "active") {
      return apiUnauthorized("Invalid email or password.");
    }

    const passwordValid = await verifyPassword(
      parsed.data.password,
      user.passwordHash
    );
    if (!passwordValid) {
      await recordAuditLog({
        actorUserId: user.id,
        actorEmailSnapshot: user.emailNormalized,
        action: "auth.login_failed",
        entityType: "user",
        entityId: user.id,
      });
      return apiUnauthorized("Invalid email or password.");
    }

    const { rawToken, sessionId, expiresAt } = await createUserSession(user.id);
    await setSessionCookie(rawToken, expiresAt);

    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    const roleRows = await db
      .select({ roleName: roles.name })
      .from(userRoles)
      .innerJoin(roles, eq(userRoles.roleId, roles.id))
      .where(eq(userRoles.userId, user.id));

    await recordAuditLog({
      actorUserId: user.id,
      actorEmailSnapshot: user.emailNormalized,
      action: "auth.login",
      entityType: "session",
      entityId: sessionId,
    });

    return apiOk({
      user: {
        id: user.id,
        email: user.emailNormalized,
        displayName: user.displayName,
        roles: roleRows.map((r) => r.roleName),
      },
      expiresAt: expiresAt.toISOString(),
    });
  } catch (err) {
    logger.error({ err }, "Unhandled error during POST /api/v1/auth/login");
    return apiServerError("Authentication error.");
  }
}

