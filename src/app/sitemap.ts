import { and, eq } from "drizzle-orm";
import type { MetadataRoute } from "next";
import { blogPosts, cmsPages, getDb, projects, serviceDivisions } from "@/db";
import { PROJECTS_DATA } from "@/features/work/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const lastModifiedStatic = new Date("2026-11-10T00:00:00Z");

  const defaultStaticPaths = [
    { path: "/", changeFrequency: "weekly" as const, priority: 1.0 },
    { path: "/services", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/services/branding", changeFrequency: "monthly" as const, priority: 0.85 },
    { path: "/services/media", changeFrequency: "monthly" as const, priority: 0.85 },
    { path: "/services/digital", changeFrequency: "monthly" as const, priority: 0.85 },
    { path: "/services/ai", changeFrequency: "monthly" as const, priority: 0.85 },
    { path: "/work", changeFrequency: "weekly" as const, priority: 0.9 },
    { path: "/about", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly" as const, priority: 0.8 },
    { path: "/privacy", changeFrequency: "yearly" as const, priority: 0.3 },
    { path: "/terms", changeFrequency: "yearly" as const, priority: 0.3 },
  ];

  const db = getDb();
  if (!db) {
    return [
      ...defaultStaticPaths.map((item) => ({
        url: `${siteUrl}${item.path}`,
        lastModified: lastModifiedStatic,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
      })),
      ...PROJECTS_DATA.filter((p) => p.isPublished).map((project) => ({
        url: `${siteUrl}/work/${project.slug}`,
        lastModified: new Date(project.updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ];
  }

  try {
    const [dbPages, dbDivisions, dbProjects, dbBlogs] = await Promise.all([
      db
        .select({ slug: cmsPages.slug, updatedAt: cmsPages.updatedAt })
        .from(cmsPages)
        .where(and(eq(cmsPages.status, "published"), eq(cmsPages.noIndex, false))),
      db
        .select({ slug: serviceDivisions.slug, updatedAt: serviceDivisions.updatedAt })
        .from(serviceDivisions)
        .where(eq(serviceDivisions.isActive, true)),
      db
        .select({ slug: projects.slug, updatedAt: projects.updatedAt })
        .from(projects)
        .where(and(eq(projects.status, "published"), eq(projects.noIndex, false))),
      db
        .select({ slug: blogPosts.slug, updatedAt: blogPosts.updatedAt })
        .from(blogPosts)
        .where(and(eq(blogPosts.status, "published"), eq(blogPosts.noIndex, false))),
    ]);

    const urlMap = new Map<string, MetadataRoute.Sitemap[number]>();

    for (const item of defaultStaticPaths) {
      urlMap.set(`${siteUrl}${item.path}`, {
        url: `${siteUrl}${item.path}`,
        lastModified: lastModifiedStatic,
        changeFrequency: item.changeFrequency,
        priority: item.priority,
      });
    }

    for (const pg of dbPages) {
      const fullUrl = `${siteUrl}${pg.slug}`;
      urlMap.set(fullUrl, {
        url: fullUrl,
        lastModified: pg.updatedAt,
        changeFrequency: pg.slug === "/" ? "weekly" : "monthly",
        priority: pg.slug === "/" ? 1.0 : 0.85,
      });
    }

    for (const div of dbDivisions) {
      const fullUrl = `${siteUrl}/services/${div.slug}`;
      urlMap.set(fullUrl, {
        url: fullUrl,
        lastModified: div.updatedAt,
        changeFrequency: "monthly",
        priority: 0.85,
      });
    }

    for (const proj of dbProjects) {
      const fullUrl = `${siteUrl}/work/${proj.slug}`;
      urlMap.set(fullUrl, {
        url: fullUrl,
        lastModified: proj.updatedAt,
        changeFrequency: "monthly",
        priority: 0.75,
      });
    }

    for (const post of dbBlogs) {
      const fullUrl = `${siteUrl}/blog/${post.slug}`;
      urlMap.set(fullUrl, {
        url: fullUrl,
        lastModified: post.updatedAt,
        changeFrequency: "weekly",
        priority: 0.7,
      });
    }

    return Array.from(urlMap.values());
  } catch {
    return defaultStaticPaths.map((item) => ({
      url: `${siteUrl}${item.path}`,
      lastModified: lastModifiedStatic,
      changeFrequency: item.changeFrequency,
      priority: item.priority,
    }));
  }
}
