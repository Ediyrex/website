export const BOOKING_CONFIG = {
  eventName: "Discovery Call",
  durationMinutes: 30,
  location: "Google Meet",
  bufferTimeMinutes: 10,
  minimumNoticeHours: 12,
  bookingWindowDays: 30,
  defaultCalUsername: "ediyrex-pbxgua",
  theme: "dark" as const,
  brandColor: "#D6B77A",
  layout: "month_view" as const,
};

/**
 * Resolves the public Cal booking link without requiring any API secret.
 * Priority:
 * 1. NEXT_PUBLIC_CAL_BOOKING_URL (e.g. "https://cal.com/ediyrex-pbxgua/30min" or "https://cal.com/ediyrex-pbxgua")
 * 2. NEXT_PUBLIC_CAL_LINK (e.g. "ediyrex-pbxgua")
 * 3. Default fallback "ediyrex-pbxgua"
 */
export function resolveCalLink(): string {
  const envUrl = process.env.NEXT_PUBLIC_CAL_BOOKING_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/^https?:\/\/cal\.com\//, "").replace(/\/$/, "");
  }

  const envLink = process.env.NEXT_PUBLIC_CAL_LINK?.trim();
  if (envLink) {
    return envLink.replace(/^https?:\/\/cal\.com\//, "").replace(/\/$/, "");
  }

  return BOOKING_CONFIG.defaultCalUsername;
}

/**
 * Returns full external booking URL as a fallback if the embed ever fails.
 */
export function getFullBookingUrl(calLink?: string): string {
  const link = calLink || resolveCalLink();
  return `https://cal.com/${link}`;
}
