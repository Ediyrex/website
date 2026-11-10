export type SettingsTabId =
  | "general"
  | "seo"
  | "social"
  | "banners"
  | "integrations"
  | "advanced";

export interface SocialProfileEntry {
  platform:
    | "instagram"
    | "linkedin"
    | "youtube"
    | "facebook"
    | "x"
    | "behance"
    | "dribbble"
    | "github";
  label: string;
  url: string;
  visible: boolean;
  order: number;
}

export interface BannerEntry {
  enabled: boolean;
  title: string;
  ctaText: string;
  ctaUrl: string;
  startAt: string;
  endAt: string;
}

export interface ChangeHistoryItem {
  id: string;
  action: string;
  actorEmail: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface SiteSettingsState {
  siteName: string;
  tagline: string;
  businessEmail: string;
  phoneNumber: string;
  studioLocation: string;
  officeHours: string;
  primaryContactNote: string;
  availabilityEnabled: boolean;
  availabilityLabel: string;
  footerNote: string;
  copyrightText: string;
  defaultLanguage: string;
  defaultTimezone: string;
  logoUrl: string;
  faviconUrl: string;
  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
    facebook: string;
    behance: string;
    dribbble: string;
    x: string;
    youtube: string;
  };
  socialProfiles: SocialProfileEntry[];
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultOgImageUrl: string;
  defaultCanonicalBaseUrl: string;
  robotsAllowIndex: boolean;
  autoGenerateSitemap: boolean;
  useDefaultRobots: boolean;
  socialTwitterCard: "summary" | "summary_large_image";
  socialLocale: string;
  seoSchema: {
    orgName: string;
    orgUrl: string;
    orgEmail: string;
    orgDescription: string;
    areaServed: string;
    knowsAbout: string[];
  };
  banners: {
    announcement: BannerEntry;
    promotional: BannerEntry;
    defaultOgImageUrl: string;
    defaultPlaceholderUrl: string;
    fallbackLogoUrl: string;
    faviconUrl: string;
    defaultThumbnailUrl: string;
  };
  integrations: {
    gaMeasurementId: string;
    gtmContainerId: string;
    gscVerificationCode: string;
    captchaProvider: "none" | "turnstile" | "recaptcha";
    captchaSiteKey: string;
    emailFromName: string;
  };
  integrationStatus: {
    cloudinaryConfigured: boolean;
    cloudinaryCloudName: string | null;
    emailConfigured: boolean;
    emailProviderLabel: string;
    captchaSecretConfigured: boolean;
    lastSyncedAt: string | null;
  };
  advanced: {
    cookieConsentEnabled: boolean;
    cookieBannerTitle: string;
    cookieBannerDescription: string;
    defaultConsentMode: "essential" | "analytics";
    maintenanceMode: boolean;
    maintenanceMessage: string;
  };
  environmentInfo: {
    nodeEnv: string;
    siteUrl: string;
    databaseConnected: boolean;
  };
  changeHistory: ChangeHistoryItem[];
  updatedAt?: string | null;
}

export type AssetFieldKey =
  | "logoUrl"
  | "faviconUrl"
  | "defaultOgImageUrl"
  | "defaultPlaceholderUrl"
  | "fallbackLogoUrl"
  | "defaultThumbnailUrl";

