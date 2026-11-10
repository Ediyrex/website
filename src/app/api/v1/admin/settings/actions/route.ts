import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";
import { z } from "zod";
import { getDb, siteSettings } from "@/db";
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
  DEFAULT_SOCIAL_PROFILES,
  loadMergedSiteSettings,
} from "@/lib/server/site-settings";

const actionSchema = z.object({
  action: z.enum(["revalidate_cache", "reset_section"]),
  section: z
    .enum(["general", "seo", "social", "banners", "integrations", "advanced"])
    .optional(),
});

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin"]);
    if (auth.errorResponse) return auth.errorResponse;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = actionSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid settings action payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) return apiServerError("Database connection unavailable.");

    const { action, section } = parsed.data;

    if (action === "revalidate_cache") {
      revalidatePath("/", "layout");
      revalidatePath("/services");
      revalidatePath("/work");
      revalidatePath("/about");
      revalidatePath("/contact");
      revalidatePath("/sitemap.xml");
      revalidatePath("/robots.txt");

      await recordAuditLog({
        actorUserId: auth.session.userId,
        actorEmailSnapshot: auth.session.email,
        action: "settings.cache_revalidated",
        entityType: "site_settings",
        metadata: { paths: ["/", "/services", "/work", "/about", "/contact"] },
      });

      return apiOk({
        revalidated: true,
        timestamp: new Date().toISOString(),
      });
    }

    if (!section) {
      return apiBadRequest("Section is required for reset_section.");
    }

    const resetEntries: {
      settingKey: string;
      settingValue: Record<string, unknown>;
      description: string;
      isPublic: boolean;
    }[] = [];

    if (section === "general") {
      resetEntries.push(
        {
          settingKey: "cms_site_config",
          settingValue: {
            siteName: DEFAULT_SITE_SETTINGS.siteName,
            tagline: DEFAULT_SITE_SETTINGS.tagline,
            footerNote: DEFAULT_SITE_SETTINGS.footerNote,
            copyrightText: DEFAULT_SITE_SETTINGS.copyrightText,
            defaultLanguage: DEFAULT_SITE_SETTINGS.defaultLanguage,
            defaultTimezone: DEFAULT_SITE_SETTINGS.defaultTimezone,
            logoUrl: "",
            faviconUrl: "",
          },
          description: "Global website branding & footer copy",
          isPublic: true,
        },
        {
          settingKey: "contact_info",
          settingValue: {
            email: DEFAULT_SITE_SETTINGS.businessEmail,
            phone: DEFAULT_SITE_SETTINGS.phoneNumber,
            region: DEFAULT_SITE_SETTINGS.studioLocation,
            officeHours: DEFAULT_SITE_SETTINGS.officeHours,
            primaryContactNote: DEFAULT_SITE_SETTINGS.primaryContactNote,
          },
          description: "Public studio contact metadata",
          isPublic: true,
        },
        {
          settingKey: "availability_banner",
          settingValue: {
            enabled: DEFAULT_SITE_SETTINGS.availabilityEnabled,
            label: DEFAULT_SITE_SETTINGS.availabilityLabel,
          },
          description: "Hero availability indicator",
          isPublic: true,
        }
      );
    } else if (section === "seo") {
      resetEntries.push({
        settingKey: "seo_defaults",
        settingValue: {
          defaultSeoTitle: DEFAULT_SITE_SETTINGS.defaultSeoTitle,
          defaultSeoDescription: DEFAULT_SITE_SETTINGS.defaultSeoDescription,
          defaultOgImageUrl: "",
          defaultCanonicalBaseUrl: DEFAULT_SITE_SETTINGS.defaultCanonicalBaseUrl,
          robotsAllowIndex: DEFAULT_SITE_SETTINGS.robotsAllowIndex,
          autoGenerateSitemap: DEFAULT_SITE_SETTINGS.autoGenerateSitemap,
          useDefaultRobots: DEFAULT_SITE_SETTINGS.useDefaultRobots,
          socialTwitterCard: DEFAULT_SITE_SETTINGS.socialTwitterCard,
          socialLocale: DEFAULT_SITE_SETTINGS.socialLocale,
        },
        description: "Global SEO defaults",
        isPublic: true,
      });
    } else if (section === "social") {
      resetEntries.push({
        settingKey: "social_links",
        settingValue: {
          ...DEFAULT_SITE_SETTINGS.socialLinks,
          profiles: DEFAULT_SOCIAL_PROFILES,
        },
        description: "Public social profiles",
        isPublic: true,
      });
    } else if (section === "banners") {
      resetEntries.push({
        settingKey: "banners_media",
        settingValue: DEFAULT_SITE_SETTINGS.banners,
        description: "Global banners and visual fallback assets",
        isPublic: true,
      });
    } else if (section === "integrations") {
      resetEntries.push({
        settingKey: "integrations_config",
        settingValue: DEFAULT_SITE_SETTINGS.integrations,
        description: "Non-secret integration identifiers",
        isPublic: false,
      });
    } else if (section === "advanced") {
      resetEntries.push({
        settingKey: "advanced_config",
        settingValue: DEFAULT_SITE_SETTINGS.advanced,
        description: "Cookie consent & technical configuration",
        isPublic: true,
      });
    }

    await db.transaction(async (tx) => {
      for (const entry of resetEntries) {
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
              updatedByUserId: auth.session.userId,
              updatedAt: new Date(),
            },
          });
      }
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: `settings.section_reset.${section}`,
      entityType: "site_settings",
      metadata: { section },
    });

    const refreshed = await loadMergedSiteSettings(db);
    return apiOk(refreshed);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/settings/actions");
  }
}

