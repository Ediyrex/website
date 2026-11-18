import { inArray } from "drizzle-orm";
import type { MetadataRoute } from "next";
import { getDb, siteSettings } from "@/db";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let allowIndex = true;
  let disallowPaths = ["/admin/", "/api/", "/thank-you"];
  let allowPaths: string[] = ["/"];

  const db = getDb();
  if (db) {
    try {
      const rows = await db
        .select()
        .from(siteSettings)
        .where(inArray(siteSettings.settingKey, ["robots_config", "seo_defaults"]));

      const byKey = new Map(rows.map((r) => [r.settingKey, r.settingValue]));
      const seoDefaults = byKey.get("seo_defaults") ?? {};
      const robotsConfig = byKey.get("robots_config") ?? {};

      if (typeof robotsConfig.allowIndex === "boolean") {
        allowIndex = robotsConfig.allowIndex;
      } else if (typeof seoDefaults.robotsAllowIndex === "boolean") {
        allowIndex = seoDefaults.robotsAllowIndex;
      }

      if (Array.isArray(robotsConfig.disallowPaths) && robotsConfig.disallowPaths.length > 0) {
        disallowPaths = robotsConfig.disallowPaths.map(String);
      }
      if (Array.isArray(robotsConfig.allowPaths) && robotsConfig.allowPaths.length > 0) {
        allowPaths = robotsConfig.allowPaths.map(String);
      }
    } catch {
      // Fallback to defaults if DB query fails during static generation
    }
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: allowIndex ? allowPaths : [],
        disallow: allowIndex ? disallowPaths : ["/"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
