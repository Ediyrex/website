import { getDb } from "@/db";
import { apiOk } from "@/lib/server/api-response";
import {
  DEFAULT_SITE_SETTINGS,
  loadMergedSiteSettings,
} from "@/lib/server/site-settings";

export async function GET() {
  const db = getDb();
  if (!db) {
    return apiOk({
      siteName: DEFAULT_SITE_SETTINGS.siteName,
      tagline: DEFAULT_SITE_SETTINGS.tagline,
      footerNote: DEFAULT_SITE_SETTINGS.footerNote,
      copyrightText: DEFAULT_SITE_SETTINGS.copyrightText,
      businessEmail: DEFAULT_SITE_SETTINGS.businessEmail,
      phoneNumber: DEFAULT_SITE_SETTINGS.phoneNumber,
      studioLocation: DEFAULT_SITE_SETTINGS.studioLocation,
      availabilityEnabled: DEFAULT_SITE_SETTINGS.availabilityEnabled,
      availabilityLabel: DEFAULT_SITE_SETTINGS.availabilityLabel,
      socialProfiles: DEFAULT_SITE_SETTINGS.socialProfiles.filter(
        (p) => p.visible && Boolean(p.url)
      ),
      announcement: DEFAULT_SITE_SETTINGS.banners.announcement,
      promotional: DEFAULT_SITE_SETTINGS.banners.promotional,
      cookieConsentEnabled:
        DEFAULT_SITE_SETTINGS.advanced.cookieConsentEnabled,
      maintenanceMode: DEFAULT_SITE_SETTINGS.advanced.maintenanceMode,
      maintenanceMessage: DEFAULT_SITE_SETTINGS.advanced.maintenanceMessage,
    });
  }

  const merged = await loadMergedSiteSettings(db);
  const now = Date.now();
  const isBannerScheduled = (b: typeof merged.banners.announcement) => {
    if (!b.enabled || !b.title.trim()) return false;
    if (b.startAt && Date.parse(b.startAt) > now) return false;
    if (b.endAt && Date.parse(b.endAt) < now) return false;
    return true;
  };

  return apiOk({
    siteName: merged.siteName,
    tagline: merged.tagline,
    footerNote: merged.footerNote,
    copyrightText: merged.copyrightText,
    businessEmail: merged.businessEmail,
    phoneNumber: merged.phoneNumber,
    studioLocation: merged.studioLocation,
    availabilityEnabled: merged.availabilityEnabled,
    availabilityLabel: merged.availabilityLabel,
    socialProfiles: merged.socialProfiles.filter(
      (p) => p.visible && Boolean(p.url)
    ),
    announcement: isBannerScheduled(merged.banners.announcement)
      ? merged.banners.announcement
      : null,
    promotional: isBannerScheduled(merged.banners.promotional)
      ? merged.banners.promotional
      : null,
    cookieConsentEnabled: merged.advanced.cookieConsentEnabled,
    maintenanceMode: merged.advanced.maintenanceMode,
    maintenanceMessage: merged.advanced.maintenanceMessage,
  });
}

