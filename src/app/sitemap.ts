import type { MetadataRoute } from "next";
import { PROJECTS_DATA } from "@/features/work/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const lastModifiedStatic = new Date("2026-11-10T00:00:00Z");

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${siteUrl}/`,
      lastModified: lastModifiedStatic,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: lastModifiedStatic,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/services/media`,
      lastModified: lastModifiedStatic,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/services/digital`,
      lastModified: lastModifiedStatic,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/services/ai`,
      lastModified: lastModifiedStatic,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${siteUrl}/work`,
      lastModified: lastModifiedStatic,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/about`,
      lastModified: lastModifiedStatic,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/contact`,
      lastModified: lastModifiedStatic,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/privacy`,
      lastModified: lastModifiedStatic,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: lastModifiedStatic,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const caseStudyRoutes: MetadataRoute.Sitemap = PROJECTS_DATA.filter(
    (p) => p.isPublished
  ).map((project) => ({
    url: `${siteUrl}/work/${project.slug}`,
    lastModified: new Date(project.updatedAt),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...caseStudyRoutes];
}
