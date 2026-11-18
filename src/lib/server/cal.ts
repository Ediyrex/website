/**
 * Cal.com API v2 Server Helper
 * Powered by CAL_API_KEY
 */

export interface CalUserProfile {
  id: number;
  email: string;
  name: string;
  username: string;
  timeZone: string;
}

export function getCalConfig() {
  const apiKey = process.env.CAL_API_KEY?.trim();
  const username = process.env.NEXT_PUBLIC_CAL_LINK?.trim() || "ediyrex-pbxgua";
  const baseUrl = "https://api.cal.com/v2";

  return {
    apiKey,
    username,
    baseUrl,
    isConfigured: Boolean(apiKey),
    bookingUrl: `https://cal.com/${username}`,
  };
}

export async function getCalUserProfile(): Promise<CalUserProfile | null> {
  const { apiKey, baseUrl, isConfigured } = getCalConfig();
  if (!isConfigured) return null;

  try {
    const res = await fetch(`${baseUrl}/me`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": "2024-08-13",
      },
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return null;
    }

    const json = (await res.json()) as { data?: CalUserProfile };
    return json.data || null;
  } catch {
    return null;
  }
}

export async function getCalBookings() {
  const { apiKey, baseUrl, isConfigured } = getCalConfig();
  if (!isConfigured) return null;

  try {
    const res = await fetch(`${baseUrl}/bookings`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": "2024-08-13",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
}
