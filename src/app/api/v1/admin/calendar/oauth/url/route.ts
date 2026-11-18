import { NextResponse } from "next/server";
import { getGoogleOAuthCredentials, createGoogleAuthUrl } from "@/lib/server/calendar/google-auth";
import { getAuthenticatedSession } from "@/lib/server/session";
import { apiForbidden, apiOk, apiUnauthorized } from "@/lib/server/api-response";

export async function GET() {
  const session = await getAuthenticatedSession();
  if (!session && process.env.NODE_ENV === "production") {
    return apiUnauthorized();
  }

  const creds = getGoogleOAuthCredentials();
  if (!creds.isConfigured) {
    return apiOk({
      isConfigured: false,
      url: null,
      message: "Google OAuth credentials (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET) are not configured.",
    });
  }

  try {
    const url = createGoogleAuthUrl();
    return apiOk({
      isConfigured: true,
      url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate auth URL" },
      { status: 500 }
    );
  }
}
