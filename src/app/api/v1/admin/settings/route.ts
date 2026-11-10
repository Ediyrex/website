import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { auditLogs, getDb, siteSettings } from "@/db";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import {
  DEFAULT_SITE_SETTINGS,
  loadMergedSiteSettings,
} from "@/lib/server/site-settings";
import { siteSettingsUpdateSchema } from "@/lib/validations/cms";

async function fetchSettingsAuditHistory(db: NonNullable<ReturnType<typeof getDb>>) {
  return db
    .select({
      id: auditLogs.id,
      action: auditLogs.action,
      actorEmail: auditLogs.actorEmailSnapshot,
      metadata: auditLogs.metadata,
      createdAt: auditLogs.createdAt,
    })
    .from(auditLogs)
    .where(eq(auditLogs.entityType, "site_settings"))
    .orderBy(desc(auditLogs.createdAt))
    .limit(15);
}

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [merged, changeHistory] = await Promise.all([
      loadMergedSiteSettings(db),
      fetchSettingsAuditHistory(db),
    ]);

    return apiOk({
      ...merged,
      changeHistory,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/settings");
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin"]);
    if (auth.errorResponse) return auth.errorResponse;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = siteSettingsUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid website settings payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;
    const section = data.section || "all";
    const include = (target: string) =>
      section === "all" || section === target;

    const entries: {
      settingKey: string;
      settingValue: Record<string, unknown>;
      description: string;
      isPublic: boolean;
    }[] = [];

    if (include("general")) {
      entries.push(
        {
          settingKey: "cms_site_config",
          settingValue: {
            siteName: data.siteName,
            tagline: data.tagline,
            footerNote: data.footerNote || "",
            copyrightText: data.copyrightText,
            defaultLanguage: data.defaultLanguage,
            defaultTimezone: data.defaultTimezone,
            logoUrl: data.logoUrl || "",
            faviconUrl: data.faviconUrl || "",
          },
          description: "Global website branding & footer copy",
          isPublic: true,
        },
        {
          settingKey: "contact_info",
          settingValue: {
            email: data.businessEmail,
            phone: data.phoneNumber || "",
            region: data.studioLocation,
            officeHours: data.officeHours,
            primaryContactNote: data.primaryContactNote || "",
          },
          description: "Public studio contact metadata",
          isPublic: true,
        },
        {
          settingKey: "availability_banner",
          settingValue: {
            enabled: data.availabilityEnabled,
            label: data.availabilityLabel,
          },
          description: "Hero availability indicator",
          isPublic: true,
        }
      );
    }

    if (include("seo") || include("general")) {
      entries.push({
        settingKey: "seo_defaults",
        settingValue: {
          defaultSeoTitle: data.defaultSeoTitle,
          defaultSeoDescription: data.defaultSeoDescription,
          defaultOgImageUrl: data.defaultOgImageUrl || "",
          defaultCanonicalBaseUrl:
            data.defaultCanonicalBaseUrl ||
            DEFAULT_SITE_SETTINGS.defaultCanonicalBaseUrl,
          robotsAllowIndex: data.robotsAllowIndex,
          autoGenerateSitemap: data.autoGenerateSitemap,
          useDefaultRobots: data.useDefaultRobots,
          socialTwitterCard: data.socialTwitterCard,
          socialLocale: data.socialLocale,
        },
        description: "Global SEO defaults",
        isPublic: true,
      });
    }

    if (include("social")) {
      const profiles = data.socialProfiles ?? [];
      const flat = {
        github:
          profiles.find((p) => p.platform === "github")?.url ||
          data.socialLinks?.github ||
          "",
        linkedin:
          profiles.find((p) => p.platform === "linkedin")?.url ||
          data.socialLinks?.linkedin ||
          "",
        instagram:
          profiles.find((p) => p.platform === "instagram")?.url ||
          data.socialLinks?.instagram ||
          "",
        facebook:
          profiles.find((p) => p.platform === "facebook")?.url ||
          data.socialLinks?.facebook ||
          "",
        behance:
          profiles.find((p) => p.platform === "behance")?.url ||
          data.socialLinks?.behance ||
          "",
        dribbble:
          profiles.find((p) => p.platform === "dribbble")?.url ||
          data.socialLinks?.dribbble ||
          "",
        x:
          profiles.find((p) => p.platform === "x")?.url ||
          data.socialLinks?.x ||
          "",
        youtube:
          profiles.find((p) => p.platform === "youtube")?.url ||
          data.socialLinks?.youtube ||
          "",
      };
      entries.push({
        settingKey: "social_links",
        settingValue: {
          ...flat,
          profiles,
        },
        description: "Public social profiles",
        isPublic: true,
      });
    }

    if (include("banners") && data.banners) {
      entries.push({
        settingKey: "banners_media",
        settingValue: {
          announcement: data.banners.announcement,
          promotional: data.banners.promotional,
          defaultOgImageUrl: data.banners.defaultOgImageUrl || "",
          defaultPlaceholderUrl: data.banners.defaultPlaceholderUrl || "",
          fallbackLogoUrl: data.banners.fallbackLogoUrl || "",
          faviconUrl: data.banners.faviconUrl || "",
          defaultThumbnailUrl: data.banners.defaultThumbnailUrl || "",
        },
        description: "Global banners and visual fallback assets",
        isPublic: true,
      });
    }

    if (include("integrations") && data.integrations) {
      entries.push({
        settingKey: "integrations_config",
        settingValue: {
          gaMeasurementId: data.integrations.gaMeasurementId || "",
          gtmContainerId: data.integrations.gtmContainerId || "",
          gscVerificationCode: data.integrations.gscVerificationCode || "",
          captchaProvider: data.integrations.captchaProvider,
          captchaSiteKey: data.integrations.captchaSiteKey || "",
          emailFromName: data.integrations.emailFromName || "",
        },
        description: "Non-secret integration identifiers & verification tokens",
        isPublic: false,
      });
    }

    if ((include("advanced") || include("general")) && data.advanced) {
      entries.push({
        settingKey: "advanced_config",
        settingValue: {
          cookieConsentEnabled: data.advanced.cookieConsentEnabled,
          cookieBannerTitle: data.advanced.cookieBannerTitle,
          cookieBannerDescription: data.advanced.cookieBannerDescription,
          defaultConsentMode: data.advanced.defaultConsentMode,
          maintenanceMode: data.advanced.maintenanceMode,
          maintenanceMessage: data.advanced.maintenanceMessage,
        },
        description: "Cookie consent, technical & maintenance configuration",
        isPublic: true,
      });
    }

    await db.transaction(async (tx) => {
      for (const entry of entries) {
        await tx
          .insert(siteSettings)
          .values({
            ...entry,
            updatedByUserId: auth.session.userId,
          })
          .onConflictDoUpdate({
            target: siteSettings.settingKey,
            set: {
              settingValue: entry.settingValue,
              description: entry.description,
              isPublic: entry.isPublic,
              updatedByUserId: auth.session.userId,
              updatedAt: new Date(),
            },
          });
      }
    });

    revalidatePath("/robots.txt");
    revalidatePath("/sitemap.xml");
    revalidatePath("/");

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: `settings.updated.${section}`,
      entityType: "site_settings",
      metadata: {
        section,
        keys: entries.map((e) => e.settingKey),
      },
    });

    const [merged, changeHistory] = await Promise.all([
      loadMergedSiteSettings(db),
      fetchSettingsAuditHistory(db),
    ]);

    return apiOk({
      ...merged,
      changeHistory,
    });
  } catch (err) {
    return handleApiError(err, "PUT /api/v1/admin/settings");
  }
}
