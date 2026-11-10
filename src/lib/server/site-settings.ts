import { inArray } from "drizzle-orm";
import type { getDb } from "@/db";
import { siteSettings } from "@/db";

export type SocialPlatformId =
  | "instagram"
  | "linkedin"
  | "youtube"
  | "facebook"
  | "x"
  | "behance"
  | "dribbble"
  | "github";

export interface SocialProfileItem {
  platform: SocialPlatformId;
  label: string;
  url: string;
  visible: boolean;
  order: number;
}

export interface BannerItem {
  enabled: boolean;
  title: string;
  ctaText: string;
  ctaUrl: string;
  startAt: string;
  endAt: string;
}

export const ALL_SETTING_KEYS = [
  "cms_site_config",
  "contact_info",
  "availability_banner",
  "seo_defaults",
  "social_links",
  "banners_media",
  "integrations_config",
  "advanced_config",
  "seo_schema",
  "robots_config",
] as const;

export const DEFAULT_SOCIAL_PROFILES: SocialProfileItem[] = [
  { platform: "instagram", label: "Instagram", url: "", visible: true, order: 0 },
  { platform: "linkedin", label: "LinkedIn", url: "", visible: true, order: 1 },
  { platform: "youtube", label: "YouTube", url: "", visible: true, order: 2 },
  { platform: "facebook", label: "Facebook", url: "", visible: false, order: 3 },
  { platform: "x", label: "X", url: "", visible: true, order: 4 },
  { platform: "behance", label: "Behance", url: "", visible: true, order: 5 },
  { platform: "dribbble", label: "Dribbble", url: "", visible: false, order: 6 },
  { platform: "github", label: "GitHub", url: "", visible: true, order: 7 },
];

export const DEFAULT_SITE_SETTINGS = {
  siteName: "Ediyrex Studio",
  tagline: "Creative Technology, Media, Digital & AI",
  businessEmail: "hello@ediyrex.com",
  phoneNumber: "",
  studioLocation: "India & Global",
  officeHours: "Mon-Fri · 10:00 AM - 7:00 PM IST",
  primaryContactNote: "Response within 1 business day for qualified inquiries.",
  availabilityEnabled: true,
  availabilityLabel: "Available for selected projects",
  footerNote:
    "Independent creative technology studio uniting commercial media production, digital experiences, and intelligent AI systems.",
  copyrightText: "Ediyrex Studio. All rights reserved.",
  defaultLanguage: "en-US",
  defaultTimezone: "Asia/Kolkata",
  logoUrl: "",
  faviconUrl: "",
  socialLinks: {
    github: "",
    linkedin: "",
    instagram: "",
    facebook: "",
    behance: "",
    dribbble: "",
    x: "",
    youtube: "",
  },
  socialProfiles: DEFAULT_SOCIAL_PROFILES,
  defaultSeoTitle: "Ediyrex Studio — Creative Technology, Media, Digital & AI",
  defaultSeoDescription:
    "Independent creative technology studio uniting commercial media production, digital experiences, and intelligent AI systems.",
  defaultOgImageUrl: "",
  defaultCanonicalBaseUrl:
    process.env.NEXT_PUBLIC_SITE_URL || "https://ediyrex.com",
  robotsAllowIndex: true,
  autoGenerateSitemap: true,
  useDefaultRobots: true,
  socialTwitterCard: "summary_large_image" as "summary" | "summary_large_image",
  socialLocale: "en_US",
  seoSchema: {
    orgName: "Ediyrex Studio",
    orgUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://ediyrex.com",
    orgEmail: "hello@ediyrex.com",
    orgDescription:
      "Independent creative technology studio uniting commercial media, web architecture, and intelligent AI systems.",
    areaServed: "India & Global",
    knowsAbout: [
      "Creative Production",
      "Website Development",
      "AI Agents & Automation",
      "Brand Identity",
    ],
  },
  banners: {
    announcement: {
      enabled: false,
      title: "",
      ctaText: "Explore",
      ctaUrl: "/contact",
      startAt: "",
      endAt: "",
    } as BannerItem,
    promotional: {
      enabled: false,
      title: "",
      ctaText: "Book Discovery",
      ctaUrl: "/contact",
      startAt: "",
      endAt: "",
    } as BannerItem,
    defaultOgImageUrl: "",
    defaultPlaceholderUrl: "",
    fallbackLogoUrl: "",
    faviconUrl: "",
    defaultThumbnailUrl: "",
  },
  integrations: {
    gaMeasurementId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "",
    gtmContainerId: "",
    gscVerificationCode: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    captchaProvider: "none" as "none" | "turnstile" | "recaptcha",
    captchaSiteKey: "",
    emailFromName: "Ediyrex Studio",
  },
  advanced: {
    cookieConsentEnabled: true,
    cookieBannerTitle: "Privacy & Cookies",
    cookieBannerDescription:
      "Ediyrex uses essential storage for site functionality and optional privacy-friendly analytics only if you agree.",
    defaultConsentMode: "essential" as "essential" | "analytics",
    maintenanceMode: false,
    maintenanceMessage:
      "We are performing scheduled studio maintenance and will return shortly.",
  },
};

type DbClient = NonNullable<ReturnType<typeof getDb>>;

export async function loadMergedSiteSettings(db: DbClient) {
  const rows = await db
    .select()
    .from(siteSettings)
    .where(inArray(siteSettings.settingKey, [...ALL_SETTING_KEYS]));

  const byKey = new Map(rows.map((r) => [r.settingKey, r.settingValue]));

  const siteConfig = byKey.get("cms_site_config") ?? {};
  const contact = byKey.get("contact_info") ?? {};
  const availability = byKey.get("availability_banner") ?? {};
  const seo = byKey.get("seo_defaults") ?? {};
  const social = byKey.get("social_links") ?? {};
  const bannersRaw = byKey.get("banners_media") ?? {};
  const integrationsRaw = byKey.get("integrations_config") ?? {};
  const advancedRaw = byKey.get("advanced_config") ?? {};
  const schemaRaw = byKey.get("seo_schema") ?? {};
  const robotsRaw = byKey.get("robots_config") ?? {};

  const latestUpdatedAt =
    rows.reduce<Date | null>((acc, r) => {
      if (!acc || r.updatedAt > acc) return r.updatedAt;
      return acc;
    }, null) ?? null;

  // Normalize socialProfiles + flat socialLinks
  const rawProfiles = Array.isArray(social.profiles)
    ? (social.profiles as SocialProfileItem[])
    : null;

  const socialProfiles: SocialProfileItem[] = DEFAULT_SOCIAL_PROFILES.map(
    (def) => {
      const fromList = rawProfiles?.find((p) => p.platform === def.platform);
      if (fromList) {
        return {
          platform: def.platform,
          label: fromList.label || def.label,
          url: fromList.url || "",
          visible:
            typeof fromList.visible === "boolean"
              ? fromList.visible
              : def.visible,
          order: typeof fromList.order === "number" ? fromList.order : def.order,
        };
      }
      const flatUrl = (social[def.platform] as string) || "";
      return {
        ...def,
        url: flatUrl,
        visible: flatUrl ? true : def.visible,
      };
    }
  ).sort((a, b) => a.order - b.order);

  const socialLinks = {
    github: socialProfiles.find((p) => p.platform === "github")?.url || "",
    linkedin: socialProfiles.find((p) => p.platform === "linkedin")?.url || "",
    instagram:
      socialProfiles.find((p) => p.platform === "instagram")?.url || "",
    facebook: socialProfiles.find((p) => p.platform === "facebook")?.url || "",
    behance: socialProfiles.find((p) => p.platform === "behance")?.url || "",
    dribbble: socialProfiles.find((p) => p.platform === "dribbble")?.url || "",
    x: socialProfiles.find((p) => p.platform === "x")?.url || "",
    youtube: socialProfiles.find((p) => p.platform === "youtube")?.url || "",
  };

  const ann = (bannersRaw.announcement as Partial<BannerItem>) ?? {};
  const promo = (bannersRaw.promotional as Partial<BannerItem>) ?? {};

  return {
    siteName:
      (siteConfig.siteName as string) || DEFAULT_SITE_SETTINGS.siteName,
    tagline: (siteConfig.tagline as string) || DEFAULT_SITE_SETTINGS.tagline,
    businessEmail:
      (contact.email as string) || DEFAULT_SITE_SETTINGS.businessEmail,
    phoneNumber:
      (contact.phone as string) ?? DEFAULT_SITE_SETTINGS.phoneNumber,
    studioLocation:
      (contact.region as string) || DEFAULT_SITE_SETTINGS.studioLocation,
    officeHours:
      (contact.officeHours as string) || DEFAULT_SITE_SETTINGS.officeHours,
    primaryContactNote:
      (contact.primaryContactNote as string) ??
      DEFAULT_SITE_SETTINGS.primaryContactNote,
    availabilityEnabled:
      typeof availability.enabled === "boolean"
        ? availability.enabled
        : DEFAULT_SITE_SETTINGS.availabilityEnabled,
    availabilityLabel:
      (availability.label as string) ||
      DEFAULT_SITE_SETTINGS.availabilityLabel,
    footerNote:
      (siteConfig.footerNote as string) ?? DEFAULT_SITE_SETTINGS.footerNote,
    copyrightText:
      (siteConfig.copyrightText as string) ||
      DEFAULT_SITE_SETTINGS.copyrightText,
    defaultLanguage:
      (siteConfig.defaultLanguage as string) ||
      DEFAULT_SITE_SETTINGS.defaultLanguage,
    defaultTimezone:
      (siteConfig.defaultTimezone as string) ||
      DEFAULT_SITE_SETTINGS.defaultTimezone,
    logoUrl: (siteConfig.logoUrl as string) || "",
    faviconUrl:
      (siteConfig.faviconUrl as string) ||
      (bannersRaw.faviconUrl as string) ||
      "",
    socialLinks,
    socialProfiles,
    defaultSeoTitle:
      (seo.defaultSeoTitle as string) ||
      DEFAULT_SITE_SETTINGS.defaultSeoTitle,
    defaultSeoDescription:
      (seo.defaultSeoDescription as string) ||
      DEFAULT_SITE_SETTINGS.defaultSeoDescription,
    defaultOgImageUrl:
      (seo.defaultOgImageUrl as string) ||
      (bannersRaw.defaultOgImageUrl as string) ||
      "",
    defaultCanonicalBaseUrl:
      (seo.defaultCanonicalBaseUrl as string) ||
      DEFAULT_SITE_SETTINGS.defaultCanonicalBaseUrl,
    robotsAllowIndex:
      typeof robotsRaw.allowIndex === "boolean"
        ? robotsRaw.allowIndex
        : typeof seo.robotsAllowIndex === "boolean"
        ? seo.robotsAllowIndex
        : DEFAULT_SITE_SETTINGS.robotsAllowIndex,
    autoGenerateSitemap:
      typeof seo.autoGenerateSitemap === "boolean"
        ? seo.autoGenerateSitemap
        : DEFAULT_SITE_SETTINGS.autoGenerateSitemap,
    useDefaultRobots:
      typeof seo.useDefaultRobots === "boolean"
        ? seo.useDefaultRobots
        : DEFAULT_SITE_SETTINGS.useDefaultRobots,
    socialTwitterCard:
      seo.socialTwitterCard === "summary"
        ? ("summary" as const)
        : ("summary_large_image" as const),
    socialLocale:
      (seo.socialLocale as string) || DEFAULT_SITE_SETTINGS.socialLocale,
    seoSchema: {
      orgName:
        (schemaRaw.orgName as string) || DEFAULT_SITE_SETTINGS.seoSchema.orgName,
      orgUrl:
        (schemaRaw.orgUrl as string) || DEFAULT_SITE_SETTINGS.seoSchema.orgUrl,
      orgEmail:
        (schemaRaw.orgEmail as string) ||
        DEFAULT_SITE_SETTINGS.seoSchema.orgEmail,
      orgDescription:
        (schemaRaw.orgDescription as string) ||
        DEFAULT_SITE_SETTINGS.seoSchema.orgDescription,
      areaServed:
        (schemaRaw.areaServed as string) ||
        DEFAULT_SITE_SETTINGS.seoSchema.areaServed,
      knowsAbout: Array.isArray(schemaRaw.knowsAbout)
        ? schemaRaw.knowsAbout.map(String)
        : DEFAULT_SITE_SETTINGS.seoSchema.knowsAbout,
    },
    banners: {
      announcement: {
        enabled:
          typeof ann.enabled === "boolean"
            ? ann.enabled
            : DEFAULT_SITE_SETTINGS.banners.announcement.enabled,
        title: ann.title ?? DEFAULT_SITE_SETTINGS.banners.announcement.title,
        ctaText:
          ann.ctaText ?? DEFAULT_SITE_SETTINGS.banners.announcement.ctaText,
        ctaUrl: ann.ctaUrl ?? DEFAULT_SITE_SETTINGS.banners.announcement.ctaUrl,
        startAt: ann.startAt ?? "",
        endAt: ann.endAt ?? "",
      },
      promotional: {
        enabled:
          typeof promo.enabled === "boolean"
            ? promo.enabled
            : DEFAULT_SITE_SETTINGS.banners.promotional.enabled,
        title: promo.title ?? DEFAULT_SITE_SETTINGS.banners.promotional.title,
        ctaText:
          promo.ctaText ?? DEFAULT_SITE_SETTINGS.banners.promotional.ctaText,
        ctaUrl: promo.ctaUrl ?? DEFAULT_SITE_SETTINGS.banners.promotional.ctaUrl,
        startAt: promo.startAt ?? "",
        endAt: promo.endAt ?? "",
      },
      defaultOgImageUrl:
        (bannersRaw.defaultOgImageUrl as string) ||
        (seo.defaultOgImageUrl as string) ||
        "",
      defaultPlaceholderUrl: (bannersRaw.defaultPlaceholderUrl as string) || "",
      fallbackLogoUrl:
        (bannersRaw.fallbackLogoUrl as string) ||
        (siteConfig.logoUrl as string) ||
        "",
      faviconUrl:
        (bannersRaw.faviconUrl as string) ||
        (siteConfig.faviconUrl as string) ||
        "",
      defaultThumbnailUrl: (bannersRaw.defaultThumbnailUrl as string) || "",
    },
    integrations: {
      gaMeasurementId:
        (integrationsRaw.gaMeasurementId as string) ??
        DEFAULT_SITE_SETTINGS.integrations.gaMeasurementId,
      gtmContainerId: (integrationsRaw.gtmContainerId as string) || "",
      gscVerificationCode:
        (integrationsRaw.gscVerificationCode as string) ??
        DEFAULT_SITE_SETTINGS.integrations.gscVerificationCode,
      captchaProvider:
        integrationsRaw.captchaProvider === "turnstile" ||
        integrationsRaw.captchaProvider === "recaptcha"
          ? (integrationsRaw.captchaProvider as "turnstile" | "recaptcha")
          : ("none" as const),
      captchaSiteKey: (integrationsRaw.captchaSiteKey as string) || "",
      emailFromName:
        (integrationsRaw.emailFromName as string) ||
        DEFAULT_SITE_SETTINGS.integrations.emailFromName,
    },
    integrationStatus: {
      cloudinaryConfigured: Boolean(
        process.env.CLOUDINARY_CLOUD_NAME &&
          process.env.CLOUDINARY_API_KEY &&
          process.env.CLOUDINARY_API_SECRET
      ),
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME || null,
      emailConfigured: Boolean(
        process.env.RESEND_API_KEY || process.env.SMTP_HOST
      ),
      emailProviderLabel: process.env.RESEND_API_KEY
        ? "Resend"
        : process.env.SMTP_HOST
        ? "SMTP"
        : "Not Configured",
      captchaSecretConfigured: Boolean(
        process.env.TURNSTILE_SECRET_KEY || process.env.RECAPTCHA_SECRET_KEY
      ),
      lastSyncedAt: latestUpdatedAt?.toISOString() ?? null,
    },
    advanced: {
      cookieConsentEnabled:
        typeof advancedRaw.cookieConsentEnabled === "boolean"
          ? advancedRaw.cookieConsentEnabled
          : DEFAULT_SITE_SETTINGS.advanced.cookieConsentEnabled,
      cookieBannerTitle:
        (advancedRaw.cookieBannerTitle as string) ||
        DEFAULT_SITE_SETTINGS.advanced.cookieBannerTitle,
      cookieBannerDescription:
        (advancedRaw.cookieBannerDescription as string) ||
        DEFAULT_SITE_SETTINGS.advanced.cookieBannerDescription,
      defaultConsentMode:
        advancedRaw.defaultConsentMode === "analytics"
          ? ("analytics" as const)
          : ("essential" as const),
      maintenanceMode:
        typeof advancedRaw.maintenanceMode === "boolean"
          ? advancedRaw.maintenanceMode
          : DEFAULT_SITE_SETTINGS.advanced.maintenanceMode,
      maintenanceMessage:
        (advancedRaw.maintenanceMessage as string) ||
        DEFAULT_SITE_SETTINGS.advanced.maintenanceMessage,
    },
    environmentInfo: {
      nodeEnv: process.env.NODE_ENV || "development",
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      databaseConnected: true,
    },
    updatedAt: latestUpdatedAt?.toISOString() ?? null,
  };
}

