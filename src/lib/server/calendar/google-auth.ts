import { createHash, randomBytes } from "node:crypto";
import type { GoogleOAuthTokenResponse, GoogleUserProfile } from "./types";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const GOOGLE_REVOKE_ENDPOINT = "https://oauth2.googleapis.com/revoke";
const GOOGLE_USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v2/userinfo";

export const GOOGLE_CALENDAR_SCOPES = [
  "https://www.googleapis.com/auth/calendar.readonly",
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
];

export function getGoogleOAuthCredentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim() || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim() || "";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const redirectUri =
    process.env.GOOGLE_REDIRECT_URI?.trim() ||
    `${siteUrl}/api/v1/admin/calendar/oauth/callback`;

  return {
    clientId,
    clientSecret,
    redirectUri,
    isConfigured: Boolean(clientId && clientSecret),
  };
}

/**
 * Generates an authorization URL for Google OAuth 2.0 with offline access (refresh token).
 */
export function createGoogleAuthUrl(state?: string): string {
  const { clientId, redirectUri } = getGoogleOAuthCredentials();
  if (!clientId) {
    throw new Error(
      "GOOGLE_CLIENT_ID is not configured in your environment variables."
    );
  }

  const csrfState = state || randomBytes(16).toString("hex");

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: GOOGLE_CALENDAR_SCOPES.join(" "),
    access_type: "offline",
    prompt: "consent", // Force to ensure refresh_token is returned
    state: csrfState,
  });

  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Exchanges authorization code for access and refresh tokens.
 */
export async function exchangeGoogleAuthCode(
  code: string
): Promise<GoogleOAuthTokenResponse> {
  const { clientId, clientSecret, redirectUri } = getGoogleOAuthCredentials();

  if (!clientId || !clientSecret) {
    throw new Error(
      "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured."
    );
  }

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `Failed to exchange Google OAuth code (${response.status}): ${errorBody}`
    );
  }

  return (await response.json()) as GoogleOAuthTokenResponse;
}

/**
 * Refreshes an expired Google access token using the encrypted refresh token.
 */
export async function refreshGoogleAccessToken(
  refreshToken: string
): Promise<{ accessToken: string; expiresIn: number }> {
  const { clientId, clientSecret } = getGoogleOAuthCredentials();

  if (!clientId || !clientSecret) {
    throw new Error(
      "GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured to refresh tokens."
    );
  }

  const response = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => "");
    throw new Error(
      `Failed to refresh Google token (${response.status}): ${errorBody}`
    );
  }

  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
  };

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Revokes a Google OAuth token upon account disconnect.
 */
export async function revokeGoogleToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(GOOGLE_REVOKE_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ token }),
    });

    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Retrieves the authenticated Google user's profile information.
 */
export async function getGoogleUserProfile(
  accessToken: string
): Promise<GoogleUserProfile> {
  const response = await fetch(GOOGLE_USERINFO_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch Google profile: ${response.statusText}`);
  }

  return (await response.json()) as GoogleUserProfile;
}

export const exchangeCodeForTokens = exchangeGoogleAuthCode;
export const refreshAccessToken = refreshGoogleAccessToken;
export const fetchGoogleUserProfile = getGoogleUserProfile;
