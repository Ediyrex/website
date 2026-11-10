import { createHmac, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { and, eq, gt, isNull, sql } from "drizzle-orm";
import { getDb, sessions, users, userRoles, roles } from "@/db";
import { apiForbidden, apiUnauthorized } from "./api-response";
import { getRequiredSessionSecret } from "./env";

import { SESSION_COOKIE_NAME } from "./session-constants";

export { SESSION_COOKIE_NAME };
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface AuthenticatedSession {
  sessionId: string;
  userId: string;
  email: string;
  displayName: string;
  roles: string[];
  expiresAt: Date;
}

export function hashSessionToken(rawToken: string): string {
  return createHmac("sha256", getRequiredSessionSecret())
    .update(rawToken)
    .digest("hex");
}

export async function createUserSession(userId: string): Promise<{
  rawToken: string;
  sessionId: string;
  expiresAt: Date;
}> {
  const db = getDb();
  if (!db) {
    throw new Error("Database connection unavailable for session creation.");
  }

  const rawToken = randomBytes(32).toString("hex");
  const tokenHash = hashSessionToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  const [created] = await db
    .insert(sessions)
    .values({
      userId,
      tokenHash,
      expiresAt,
    })
    .returning({ id: sessions.id });

  return {
    rawToken,
    sessionId: created.id,
    expiresAt,
  };
}

export async function setSessionCookie(
  rawToken: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies();
  const headerList = await headers();
  const isHttps =
    headerList.get("x-forwarded-proto") === "https" ||
    Boolean(process.env.NEXT_PUBLIC_SITE_URL?.startsWith("https://"));

  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    expires: expiresAt,
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getAuthenticatedSession(): Promise<AuthenticatedSession | null> {
  const db = getDb();
  if (!db) return null;

  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!rawToken) return null;

  const tokenHash = hashSessionToken(rawToken);

  const [row] = await db
    .select({
      sessionId: sessions.id,
      expiresAt: sessions.expiresAt,
      userId: users.id,
      email: users.emailNormalized,
      displayName: users.displayName,
      userStatus: users.status,
    })
    .from(sessions)
    .innerJoin(users, eq(sessions.userId, users.id))
    .where(
      and(
        eq(sessions.tokenHash, tokenHash),
        isNull(sessions.revokedAt),
        gt(sessions.expiresAt, sql`NOW()`)
      )
    )
    .limit(1);

  if (!row || row.userStatus !== "active") {
    return null;
  }

  const roleRows = await db
    .select({ roleName: roles.name })
    .from(userRoles)
    .innerJoin(roles, eq(userRoles.roleId, roles.id))
    .where(eq(userRoles.userId, row.userId));

  return {
    sessionId: row.sessionId,
    userId: row.userId,
    email: row.email,
    displayName: row.displayName,
    roles: roleRows.map((r) => r.roleName),
    expiresAt: row.expiresAt,
  };
}

export async function revokeSessionById(sessionId: string): Promise<void> {
  const db = getDb();
  if (!db) return;

  await db
    .update(sessions)
    .set({ revokedAt: new Date() })
    .where(eq(sessions.id, sessionId));
}

export async function requireAdminRole(
  allowedRoles: string[] = ["admin", "editor", "viewer"]
): Promise<
  | { session: AuthenticatedSession; errorResponse?: never }
  | { session?: never; errorResponse: Response }
> {
  const session = await getAuthenticatedSession();
  if (!session) {
    return { errorResponse: apiUnauthorized() };
  }

  const hasRole = session.roles.some((r) => allowedRoles.includes(r));
  if (!hasRole) {
    return { errorResponse: apiForbidden() };
  }

  return { session };
}
