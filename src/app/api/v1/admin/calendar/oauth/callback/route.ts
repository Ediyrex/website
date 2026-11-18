import { NextRequest, NextResponse } from "next/server";
import { exchangeCodeForTokens, fetchGoogleUserProfile } from "@/lib/server/calendar/google-auth";
import { encryptToken } from "@/lib/server/encryption";
import { getDb } from "@/db";
import { googleCalendarAccounts } from "@/db/schema/calendar";
import { eq } from "drizzle-orm";
import { syncCalendarsForAccount } from "@/lib/server/calendar/calendar-service";
import { getAuthenticatedSession } from "@/lib/server/session";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (error || !code) {
    console.error("Google OAuth callback error:", error || "Missing code");
    return NextResponse.redirect(
      new URL(`/admin/calendar?error=${encodeURIComponent(error || "access_denied")}`, siteUrl)
    );
  }

  try {
    const session = await getAuthenticatedSession();
    const userId = session?.userId;

    const tokenData = await exchangeCodeForTokens(code);
    const profile = await fetchGoogleUserProfile(tokenData.access_token);

    const db = getDb();
    if (!db) {
      console.warn("Database not available during OAuth callback; redirecting to calendar preview");
      return NextResponse.redirect(new URL("/admin/calendar?connected=preview", siteUrl));
    }

    // Require valid user record in database to link account
    let linkUserId = userId;
    if (!linkUserId) {
      // Find default admin user if session cookie is not passed through OAuth redirect
      const existingUsers = await db.query.users.findMany({ limit: 1 });
      if (existingUsers.length > 0) {
        linkUserId = existingUsers[0].id;
      } else {
        throw new Error("No admin user found to associate Google Calendar with.");
      }
    }

    const refreshTokenEncrypted = tokenData.refresh_token
      ? encryptToken(tokenData.refresh_token)
      : null;

    const expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);

    // Check if account already exists for this email
    const existing = await db
      .select({ id: googleCalendarAccounts.id, refreshEnc: googleCalendarAccounts.refreshTokenEncrypted })
      .from(googleCalendarAccounts)
      .where(eq(googleCalendarAccounts.email, profile.email))
      .limit(1);

    let accountId: string;

    if (existing.length > 0) {
      accountId = existing[0].id;
      await db
        .update(googleCalendarAccounts)
        .set({
          googleUserId: profile.id,
          accountName: profile.name,
          avatarUrl: profile.picture,
          accessToken: tokenData.access_token,
          refreshTokenEncrypted: refreshTokenEncrypted ?? existing[0].refreshEnc,
          tokenExpiresAt: expiresAt,
          scope: tokenData.scope,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(googleCalendarAccounts.id, accountId));
    } else {
      const [inserted] = await db
        .insert(googleCalendarAccounts)
        .values({
          userId: linkUserId,
          googleUserId: profile.id,
          email: profile.email,
          accountName: profile.name,
          avatarUrl: profile.picture,
          accessToken: tokenData.access_token,
          refreshTokenEncrypted,
          tokenExpiresAt: expiresAt,
          scope: tokenData.scope,
          isActive: true,
        })
        .returning({ id: googleCalendarAccounts.id });
      accountId = inserted.id;
    }

    // Automatically sync calendars for the newly connected account
    try {
      await syncCalendarsForAccount(accountId);
    } catch (syncErr) {
      console.warn("Initial calendar sync warning:", syncErr);
    }

    return NextResponse.redirect(new URL("/admin/calendar?connected=success", siteUrl));
  } catch (err) {
    console.error("Google OAuth callback exception:", err);
    return NextResponse.redirect(
      new URL(
        `/admin/calendar?error=${encodeURIComponent(
          err instanceof Error ? err.message : "oauth_failed"
        )}`,
        siteUrl
      )
    );
  }
}
