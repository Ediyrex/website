import { inArray } from "drizzle-orm";
import type { NextRequest } from "next/server";
import { getDb, siteSettings } from "@/db";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { siteSettingsUpdateSchema } from "@/lib/validations/cms";

const SETTING_KEYS = [
  "cms_site_config",
  "contact_info",
  "availability_banner",
  "seo_defaults",
  "social_links",
] as const;

const DEFAULT_SETTINGS_PAYLOAD = {
  siteName: "Ediyrex Studio",
  tagline: "Creative Technology, Media, Digital & AI",
  businessEmail: "hello@ediyrex.com",
  phoneNumber: "",
  studioLocation: "India & Global",
  officeHours: "Mon-Fri · 10:00 AM - 7:00 PM IST",
  availabilityEnabled: true,
  availabilityLabel: "Available for selected projects",
  footerNote:
    "Independent creative technology studio uniting commercial media production, digital experiences, and intelligent AI systems.",
  copyrightText: "Ediyrex Studio. All rights reserved.",
  socialLinks: {
    github: "",
    linkedin: "",
    instagram: "",
    x: "",
    youtube: "",
  },
  defaultSeoTitle: "Ediyrex Studio — Creative Technology, Media, Digital & AI",
  defaultSeoDescription:
    "Independent creative technology studio uniting commercial media production, digital experiences, and intelligent AI systems.",
  defaultOgImageUrl: "",
  robotsAllowIndex: true,
};

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const rows = await db
      .select()
      .from(siteSettings)
      .where(inArray(siteSettings.settingKey, [...SETTING_KEYS]));

    const byKey = new Map(rows.map((r) => [r.settingKey, r.settingValue]));

    const siteConfig = byKey.get("cms_site_config") ?? {};
    const contact = byKey.get("contact_info") ?? {};
    const availability = byKey.get("availability_banner") ?? {};
    const seo = byKey.get("seo_defaults") ?? {};
    const social = byKey.get("social_links") ?? {};

    const latestUpdatedAt =
      rows.reduce<Date | null>((acc, r) => {
        if (!acc || r.updatedAt > acc) return r.updatedAt;
        return acc;
      }, null) ?? null;

    return apiOk({
      siteName:
        (siteConfig.siteName as string) || DEFAULT_SETTINGS_PAYLOAD.siteName,
      tagline:
        (siteConfig.tagline as string) || DEFAULT_SETTINGS_PAYLOAD.tagline,
      businessEmail:
        (contact.email as string) || DEFAULT_SETTINGS_PAYLOAD.businessEmail,
      phoneNumber:
        (contact.phone as string) ?? DEFAULT_SETTINGS_PAYLOAD.phoneNumber,
      studioLocation:
        (contact.region as string) || DEFAULT_SETTINGS_PAYLOAD.studioLocation,
      officeHours:
        (contact.officeHours as string) || DEFAULT_SETTINGS_PAYLOAD.officeHours,
      availabilityEnabled:
        typeof availability.enabled === "boolean"
          ? availability.enabled
          : DEFAULT_SETTINGS_PAYLOAD.availabilityEnabled,
      availabilityLabel:
        (availability.label as string) ||
        DEFAULT_SETTINGS_PAYLOAD.availabilityLabel,
      footerNote:
        (siteConfig.footerNote as string) ?? DEFAULT_SETTINGS_PAYLOAD.footerNote,
      copyrightText:
        (siteConfig.copyrightText as string) ||
        DEFAULT_SETTINGS_PAYLOAD.copyrightText,
      socialLinks: {
        github: (social.github as string) || "",
        linkedin: (social.linkedin as string) || "",
        instagram: (social.instagram as string) || "",
        x: (social.x as string) || "",
        youtube: (social.youtube as string) || "",
      },
      defaultSeoTitle:
        (seo.defaultSeoTitle as string) ||
        DEFAULT_SETTINGS_PAYLOAD.defaultSeoTitle,
      defaultSeoDescription:
        (seo.defaultSeoDescription as string) ||
        DEFAULT_SETTINGS_PAYLOAD.defaultSeoDescription,
      defaultOgImageUrl: (seo.defaultOgImageUrl as string) || "",
      robotsAllowIndex:
        typeof seo.robotsAllowIndex === "boolean"
          ? seo.robotsAllowIndex
          : DEFAULT_SETTINGS_PAYLOAD.robotsAllowIndex,
      updatedAt: latestUpdatedAt?.toISOString() ?? null,
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
    const entries: {
      settingKey: string;
      settingValue: Record<string, unknown>;
      description: string;
      isPublic: boolean;
    }[] = [
      {
        settingKey: "cms_site_config",
        settingValue: {
          siteName: data.siteName,
          tagline: data.tagline,
          footerNote: data.footerNote || "",
          copyrightText: data.copyrightText,
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
      },
      {
        settingKey: "seo_defaults",
        settingValue: {
          defaultSeoTitle: data.defaultSeoTitle,
          defaultSeoDescription: data.defaultSeoDescription,
          defaultOgImageUrl: data.defaultOgImageUrl || "",
          robotsAllowIndex: data.robotsAllowIndex,
        },
        description: "Global SEO defaults",
        isPublic: true,
      },
      {
        settingKey: "social_links",
        settingValue: {
          github: data.socialLinks.github || "",
          linkedin: data.socialLinks.linkedin || "",
          instagram: data.socialLinks.instagram || "",
          x: data.socialLinks.x || "",
          youtube: data.socialLinks.youtube || "",
        },
        description: "Public social links",
        isPublic: true,
      },
    ];

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
            },
          });
      }
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "settings.updated",
      entityType: "site_settings",
      metadata: { keys: [...SETTING_KEYS] },
    });

    return apiOk({
      ...data,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    return handleApiError(err, "PUT /api/v1/admin/settings");
  }
}

