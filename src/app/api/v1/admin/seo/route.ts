import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  blogPosts,
  cmsPages,
  getDb,
  mediaAssets,
  projects,
  seoRedirects,
  serviceDivisions,
  services,
  siteSettings,
} from "@/db";
import {
  apiBadRequest,
  apiError,
  apiNotFound,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { requireAdminRole } from "@/lib/server/session";
import { seoEntryPatchSchema } from "@/lib/validations/cms";

export type SeoEntryKind = "page" | "portfolio" | "service" | "blog";

function computeSeoScore(input: {
  seoTitle?: string | null;
  seoDescription?: string | null;
  hasOg?: boolean;
  hasCanonicalOrUrl?: boolean;
  hasSchema?: boolean;
  noIndex?: boolean;
  status?: string;
}): { score: number; issues: string[] } {
  let score = 0;
  const issues: string[] = [];

  const titleLen = input.seoTitle?.trim().length ?? 0;
  if (titleLen >= 20 && titleLen <= 65) {
    score += 25;
  } else if (titleLen > 0) {
    score += 15;
    issues.push(
      titleLen < 20
        ? "SEO title under 20 chars"
        : "SEO title exceeds 65 chars"
    );
  } else {
    score += 6;
    issues.push("Missing custom SEO title");
  }

  const descLen = input.seoDescription?.trim().length ?? 0;
  if (descLen >= 60 && descLen <= 165) {
    score += 25;
  } else if (descLen > 0) {
    score += 15;
    issues.push(
      descLen < 60
        ? "Meta description under 60 chars"
        : "Meta description exceeds 165 chars"
    );
  } else {
    score += 6;
    issues.push("Missing meta description");
  }

  if (input.hasOg) {
    score += 15;
  } else {
    issues.push("Missing Open Graph image or social text");
  }

  if (input.hasCanonicalOrUrl) {
    score += 15;
  } else {
    issues.push("Missing canonical path");
  }

  if (input.hasSchema) {
    score += 10;
  } else {
    issues.push("Missing structured data type");
  }

  if (!input.noIndex && input.status === "published") {
    score += 10;
  } else if (input.noIndex) {
    issues.push("Marked noindex");
  } else {
    score += 4;
    issues.push("Entry in draft / unpublished");
  }

  return {
    score: Math.min(100, Math.max(0, score)),
    issues,
  };
}

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const [
      pageRows,
      projectRows,
      serviceRows,
      blogRows,
      redirectRows,
      divisionRows,
      settingRows,
      allMediaRows,
    ] = await Promise.all([
      db
        .select()
        .from(cmsPages)
        .orderBy(asc(cmsPages.displayOrder), desc(cmsPages.updatedAt)),
      db
        .select()
        .from(projects)
        .orderBy(asc(projects.displayOrder), desc(projects.updatedAt)),
      db
        .select()
        .from(services)
        .orderBy(asc(services.displayOrder), asc(services.title)),
      db.select().from(blogPosts).orderBy(desc(blogPosts.updatedAt)),
      db.select().from(seoRedirects).orderBy(asc(seoRedirects.source)),
      db
        .select({ slug: serviceDivisions.slug, updatedAt: serviceDivisions.updatedAt })
        .from(serviceDivisions)
        .where(eq(serviceDivisions.isActive, true)),
      db
        .select()
        .from(siteSettings)
        .where(
          inArray(siteSettings.settingKey, [
            "seo_defaults",
            "robots_config",
            "seo_schema",
            "contact_info",
          ])
        ),
      db
        .select({ id: mediaAssets.id, secureUrl: mediaAssets.secureUrl })
        .from(mediaAssets),
    ]);

    const mediaUrlById = new Map(allMediaRows.map((m) => [m.id, m.secureUrl]));
    const settingsByKey = new Map(
      settingRows.map((row) => [row.settingKey, row.settingValue])
    );

    const seoDefaults = settingsByKey.get("seo_defaults") ?? {};
    const robotsSaved = settingsByKey.get("robots_config") ?? {};
    const schemaSaved = settingsByKey.get("seo_schema") ?? {};
    const contactSaved = settingsByKey.get("contact_info") ?? {};

    const globalSeo = {
      defaultSeoTitle:
        (seoDefaults.defaultSeoTitle as string) ||
        "Ediyrex Studio — Branding, Media, Web Dev & AI Agents",
      defaultSeoDescription:
        (seoDefaults.defaultSeoDescription as string) ||
        "Independent creative technology studio uniting branding & marketing, media editing & motion, web dev & DADV dashboards, and AI agents & n8n automation.",
      defaultOgImageUrl: (seoDefaults.defaultOgImageUrl as string) || "",
      robotsAllowIndex:
        typeof robotsSaved.allowIndex === "boolean"
          ? robotsSaved.allowIndex
          : typeof seoDefaults.robotsAllowIndex === "boolean"
            ? seoDefaults.robotsAllowIndex
            : true,
    };

    const robotsConfig = {
      allowIndex: globalSeo.robotsAllowIndex,
      disallowPaths: Array.isArray(robotsSaved.disallowPaths)
        ? robotsSaved.disallowPaths.map(String)
        : ["/admin/", "/api/", "/thank-you"],
      allowPaths: Array.isArray(robotsSaved.allowPaths)
        ? robotsSaved.allowPaths.map(String)
        : ["/"],
      customRules: (robotsSaved.customRules as string) || "",
    };

    const schemaConfig = {
      orgName: (schemaSaved.orgName as string) || "Ediyrex Studio",
      orgUrl:
        (schemaSaved.orgUrl as string) ||
        process.env.NEXT_PUBLIC_SITE_URL ||
        "https://ediyrex.com",
      orgEmail:
        (schemaSaved.orgEmail as string) ||
        (contactSaved.email as string) ||
        "hello@ediyrex.com",
      orgDescription:
        (schemaSaved.orgDescription as string) ||
        "Independent creative technology studio uniting Branding & Marketing, Media, Web Dev, and Agents & Automation.",
      areaServed: (schemaSaved.areaServed as string) || "Global",
      knowsAbout: Array.isArray(schemaSaved.knowsAbout)
        ? schemaSaved.knowsAbout.map(String)
        : [
            "Branding & Marketing",
            "Media & Video Editing",
            "Web Dev & DADV",
            "AI Agents & n8n Automation",
          ],
    };

    const pageEntries = pageRows.map((p) => {
      const ogImageUrl =
        (p.ogImageAssetId ? mediaUrlById.get(p.ogImageAssetId) : null) ||
        (p.thumbnailAssetId ? mediaUrlById.get(p.thumbnailAssetId) : null) ||
        null;
      const effectiveNoIndex =
        p.noIndex || p.robotsDirective.startsWith("noindex");
      const { score, issues } = computeSeoScore({
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        hasOg: Boolean(
          p.ogTitle || p.ogDescription || ogImageUrl || globalSeo.defaultOgImageUrl
        ),
        hasCanonicalOrUrl: Boolean(p.canonicalUrl || p.slug),
        hasSchema: Boolean(p.schemaType),
        noIndex: effectiveNoIndex,
        status: p.status,
      });
      const typeLabel =
        p.pageType === "legal"
          ? "Legal"
          : p.pageType === "listing"
            ? "Listing"
            : "Page";
      return {
        id: p.id,
        kind: "page" as const,
        typeBadge: typeLabel,
        title: p.title,
        slug: p.slug,
        url: p.slug,
        thumbnailUrl: ogImageUrl,
        seoTitle: p.seoTitle || "",
        seoDescription: p.seoDescription || "",
        ogTitle: p.ogTitle || "",
        ogDescription: p.ogDescription || "",
        ogImageAssetId: p.ogImageAssetId ?? p.thumbnailAssetId ?? null,
        ogImageUrl: ogImageUrl || "",
        canonicalUrl: p.canonicalUrl || p.slug,
        robotsDirective: p.robotsDirective || (p.noIndex ? "noindex, follow" : "index, follow"),
        schemaType: p.schemaType || "WebPage",
        schemaJson: p.schemaJson || "",
        noIndex: effectiveNoIndex,
        status: p.status,
        score,
        issues,
        updatedAt: p.updatedAt.toISOString(),
      };
    });

    const projectEntries = projectRows.map((p) => {
      const url = `/work/${p.slug}`;
      const ogImageUrl =
        (p.ogImageAssetId ? mediaUrlById.get(p.ogImageAssetId) : null) ||
        (p.coverAssetId ? mediaUrlById.get(p.coverAssetId) : null) ||
        null;
      const effectiveNoIndex =
        p.noIndex || p.robotsDirective.startsWith("noindex");
      const { score, issues } = computeSeoScore({
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        hasOg: Boolean(p.ogTitle || p.ogDescription || ogImageUrl),
        hasCanonicalOrUrl: Boolean(p.canonicalUrl || url),
        hasSchema: Boolean(p.schemaType),
        noIndex: effectiveNoIndex,
        status: p.status,
      });
      return {
        id: p.id,
        kind: "portfolio" as const,
        typeBadge: "Portfolio",
        title: p.title,
        slug: p.slug,
        url,
        thumbnailUrl: ogImageUrl,
        seoTitle: p.seoTitle || "",
        seoDescription: p.seoDescription || "",
        ogTitle: p.ogTitle || "",
        ogDescription: p.ogDescription || "",
        ogImageAssetId: p.ogImageAssetId ?? p.coverAssetId ?? null,
        ogImageUrl: ogImageUrl || "",
        canonicalUrl: p.canonicalUrl || url,
        robotsDirective: p.robotsDirective || (p.noIndex ? "noindex, follow" : "index, follow"),
        schemaType: p.schemaType || "CreativeWork",
        schemaJson: p.schemaJson || "",
        noIndex: effectiveNoIndex,
        status: p.status,
        score,
        issues,
        updatedAt: p.updatedAt.toISOString(),
      };
    });

    const serviceEntries = serviceRows.map((s) => {
      const url = `/services#${s.slug}`;
      const ogImageUrl =
        (s.ogImageAssetId ? mediaUrlById.get(s.ogImageAssetId) : null) ||
        (s.coverAssetId ? mediaUrlById.get(s.coverAssetId) : null) ||
        null;
      const effectiveNoIndex =
        s.noIndex || s.robotsDirective.startsWith("noindex");
      const { score, issues } = computeSeoScore({
        seoTitle: s.seoTitle,
        seoDescription: s.seoDescription,
        hasOg: Boolean(s.ogTitle || s.ogDescription || ogImageUrl || globalSeo.defaultOgImageUrl),
        hasCanonicalOrUrl: Boolean(s.canonicalUrl || url),
        hasSchema: Boolean(s.schemaType),
        noIndex: effectiveNoIndex,
        status: s.status,
      });
      return {
        id: s.id,
        kind: "service" as const,
        typeBadge: "Service",
        title: s.title,
        slug: s.slug,
        url,
        thumbnailUrl: ogImageUrl,
        seoTitle: s.seoTitle || "",
        seoDescription: s.seoDescription || "",
        ogTitle: s.ogTitle || "",
        ogDescription: s.ogDescription || "",
        ogImageAssetId: s.ogImageAssetId ?? s.coverAssetId ?? null,
        ogImageUrl: ogImageUrl || "",
        canonicalUrl: s.canonicalUrl || url,
        robotsDirective: s.robotsDirective || (s.noIndex ? "noindex, follow" : "index, follow"),
        schemaType: s.schemaType || "Service",
        schemaJson: s.schemaJson || "",
        noIndex: effectiveNoIndex,
        status: s.status,
        score,
        issues,
        updatedAt: s.updatedAt.toISOString(),
      };
    });

    const blogEntries = blogRows.map((b) => {
      const url = `/blog/${b.slug}`;
      const ogImageUrl =
        (b.ogImageAssetId ? mediaUrlById.get(b.ogImageAssetId) : null) ||
        (b.coverAssetId ? mediaUrlById.get(b.coverAssetId) : null) ||
        null;
      const effectiveNoIndex =
        b.noIndex || b.robotsDirective.startsWith("noindex");
      const { score, issues } = computeSeoScore({
        seoTitle: b.seoTitle,
        seoDescription: b.seoDescription,
        hasOg: Boolean(b.ogTitle || b.ogDescription || ogImageUrl || globalSeo.defaultOgImageUrl),
        hasCanonicalOrUrl: Boolean(b.canonicalUrl || url),
        hasSchema: Boolean(b.schemaType),
        noIndex: effectiveNoIndex,
        status: b.status,
      });
      return {
        id: b.id,
        kind: "blog" as const,
        typeBadge: "Blog",
        title: b.title,
        slug: b.slug,
        url,
        thumbnailUrl: ogImageUrl,
        seoTitle: b.seoTitle || "",
        seoDescription: b.seoDescription || "",
        ogTitle: b.ogTitle || "",
        ogDescription: b.ogDescription || "",
        ogImageAssetId: b.ogImageAssetId ?? b.coverAssetId ?? null,
        ogImageUrl: ogImageUrl || "",
        canonicalUrl: b.canonicalUrl || url,
        robotsDirective: b.robotsDirective || (b.noIndex ? "noindex, follow" : "index, follow"),
        schemaType: b.schemaType || "Article",
        schemaJson: b.schemaJson || "",
        noIndex: effectiveNoIndex,
        status: b.status,
        score,
        issues,
        updatedAt: b.updatedAt.toISOString(),
      };
    });

    const allEntries = [
      ...pageEntries,
      ...projectEntries,
      ...serviceEntries,
      ...blogEntries,
    ];

    const totalEntries = allEntries.length;
    const avgScore =
      totalEntries > 0
        ? Math.round(
            allEntries.reduce((sum, item) => sum + item.score, 0) / totalEntries
          )
        : 0;
    const indexedCount = allEntries.filter(
      (item) => item.status === "published" && !item.noIndex
    ).length;
    const optimizedCount = allEntries.filter((item) => item.score >= 90).length;
    const issuesCount = allEntries.filter((item) => item.issues.length > 0).length;
    const missingTitleCount = allEntries.filter((item) => !item.seoTitle.trim()).length;
    const missingDescriptionCount = allEntries.filter(
      (item) => !item.seoDescription.trim()
    ).length;
    const missingOgCount = allEntries.filter(
      (item) => !item.ogTitle.trim() && !item.ogImageUrl.trim()
    ).length;
    const metadataCompleteness =
      totalEntries > 0
        ? Math.round(
            (allEntries.filter(
              (item) => item.seoTitle.trim() && item.seoDescription.trim()
            ).length /
              totalEntries) *
              100
          )
        : 0;

    // Live sitemap URLs preview
    const sitemapUrlSet = new Map<
      string,
      { path: string; source: string; changeFrequency: string; priority: string }
    >();
    const baseStatic = [
      { path: "/", freq: "weekly", prio: "1.0" },
      { path: "/services", freq: "weekly", prio: "0.9" },
      { path: "/services/branding", freq: "monthly", prio: "0.85" },
      { path: "/services/media", freq: "monthly", prio: "0.85" },
      { path: "/services/digital", freq: "monthly", prio: "0.85" },
      { path: "/services/ai", freq: "monthly", prio: "0.85" },
      { path: "/work", freq: "weekly", prio: "0.9" },
      { path: "/about", freq: "monthly", prio: "0.8" },
      { path: "/contact", freq: "monthly", prio: "0.8" },
      { path: "/privacy", freq: "yearly", prio: "0.3" },
      { path: "/terms", freq: "yearly", prio: "0.3" },
    ];
    for (const s of baseStatic) {
      sitemapUrlSet.set(s.path, {
        path: s.path,
        source: "Static Route",
        changeFrequency: s.freq,
        priority: s.prio,
      });
    }
    for (const pg of pageRows) {
      if (pg.status === "published" && !pg.noIndex) {
        sitemapUrlSet.set(pg.slug, {
          path: pg.slug,
          source: "CMS Page",
          changeFrequency: pg.slug === "/" ? "weekly" : "monthly",
          priority: pg.slug === "/" ? "1.0" : "0.85",
        });
      }
    }
    for (const div of divisionRows) {
      sitemapUrlSet.set(`/services/${div.slug}`, {
        path: `/services/${div.slug}`,
        source: "Service Division",
        changeFrequency: "monthly",
        priority: "0.85",
      });
    }
    for (const proj of projectRows) {
      if (proj.status === "published" && !proj.noIndex) {
        sitemapUrlSet.set(`/work/${proj.slug}`, {
          path: `/work/${proj.slug}`,
          source: "Portfolio Case Study",
          changeFrequency: "monthly",
          priority: "0.75",
        });
      }
    }
    for (const post of blogRows) {
      if (post.status === "published" && !post.noIndex) {
        sitemapUrlSet.set(`/blog/${post.slug}`, {
          path: `/blog/${post.slug}`,
          source: "Blog Post",
          changeFrequency: "weekly",
          priority: "0.7",
        });
      }
    }

    return apiOk({
      entries: allEntries,
      stats: {
        totalEntries,
        indexedCount,
        avgScore,
        issuesCount,
        optimizedCount,
        needsUpdateCount: totalEntries - optimizedCount,
        missingTitleCount,
        missingDescriptionCount,
        missingOgCount,
        metadataCompleteness,
        redirectsCount: redirectRows.filter((r) => r.isActive).length,
        gaConfigured: Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID),
        gscConfigured: Boolean(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION),
      },
      redirects: redirectRows,
      sitemapEntries: Array.from(sitemapUrlSet.values()),
      robotsConfig,
      schemaConfig,
      globalSeo,
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/seo");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = seoEntryPatchSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid SEO metadata payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const {
      kind,
      id,
      slug,
      seoTitle,
      seoDescription,
      ogTitle,
      ogDescription,
      ogImageAssetId,
      canonicalUrl,
      robotsDirective,
      schemaType,
      schemaJson,
      noIndex,
    } = parsed.data;

    const computedNoIndex =
      typeof noIndex === "boolean"
        ? noIndex
        : robotsDirective
          ? robotsDirective.startsWith("noindex")
          : undefined;

    const cleanDirective =
      robotsDirective ??
      (computedNoIndex === true
        ? "noindex, follow"
        : computedNoIndex === false
          ? "index, follow"
          : undefined);

    if (schemaJson) {
      try {
        JSON.parse(schemaJson);
      } catch {
        return apiBadRequest("Structured data JSON-LD must be valid JSON.");
      }
    }

    let updatedRow: { id: string } | undefined;

    if (kind === "page") {
      if (slug) {
        const [conflict] = await db
          .select({ id: cmsPages.id })
          .from(cmsPages)
          .where(and(eq(cmsPages.slug, slug), ne(cmsPages.id, id)))
          .limit(1);
        if (conflict) {
          return apiError("Conflict", "Another page already uses this URL slug.", 409);
        }
      }
      const [row] = await db
        .update(cmsPages)
        .set({
          ...(slug ? { slug } : {}),
          seoTitle: seoTitle ?? null,
          seoDescription: seoDescription ?? null,
          ogTitle: ogTitle ?? null,
          ogDescription: ogDescription ?? null,
          ...(ogImageAssetId !== undefined ? { ogImageAssetId } : {}),
          canonicalUrl: canonicalUrl ?? null,
          ...(cleanDirective ? { robotsDirective: cleanDirective } : {}),
          ...(schemaType ? { schemaType } : {}),
          schemaJson: schemaJson ?? null,
          ...(computedNoIndex !== undefined ? { noIndex: computedNoIndex } : {}),
          updatedAt: new Date(),
        })
        .where(eq(cmsPages.id, id))
        .returning({ id: cmsPages.id });
      updatedRow = row;
    } else if (kind === "portfolio") {
      if (slug) {
        const [conflict] = await db
          .select({ id: projects.id })
          .from(projects)
          .where(and(eq(projects.slug, slug), ne(projects.id, id)))
          .limit(1);
        if (conflict) {
          return apiError("Conflict", "Another project already uses this slug.", 409);
        }
      }
      const [row] = await db
        .update(projects)
        .set({
          ...(slug ? { slug } : {}),
          seoTitle: seoTitle ?? null,
          seoDescription: seoDescription ?? null,
          ogTitle: ogTitle ?? null,
          ogDescription: ogDescription ?? null,
          ...(ogImageAssetId !== undefined ? { ogImageAssetId } : {}),
          canonicalUrl: canonicalUrl ?? null,
          ...(cleanDirective ? { robotsDirective: cleanDirective } : {}),
          ...(schemaType ? { schemaType } : {}),
          schemaJson: schemaJson ?? null,
          ...(computedNoIndex !== undefined ? { noIndex: computedNoIndex } : {}),
          updatedAt: new Date(),
        })
        .where(eq(projects.id, id))
        .returning({ id: projects.id });
      updatedRow = row;
    } else if (kind === "service") {
      if (slug) {
        const [conflict] = await db
          .select({ id: services.id })
          .from(services)
          .where(and(eq(services.slug, slug), ne(services.id, id)))
          .limit(1);
        if (conflict) {
          return apiError("Conflict", "Another service already uses this slug.", 409);
        }
      }
      const [row] = await db
        .update(services)
        .set({
          ...(slug ? { slug } : {}),
          seoTitle: seoTitle ?? null,
          seoDescription: seoDescription ?? null,
          ogTitle: ogTitle ?? null,
          ogDescription: ogDescription ?? null,
          ...(ogImageAssetId !== undefined ? { ogImageAssetId } : {}),
          canonicalUrl: canonicalUrl ?? null,
          ...(cleanDirective ? { robotsDirective: cleanDirective } : {}),
          ...(schemaType ? { schemaType } : {}),
          schemaJson: schemaJson ?? null,
          ...(computedNoIndex !== undefined ? { noIndex: computedNoIndex } : {}),
          updatedAt: new Date(),
        })
        .where(eq(services.id, id))
        .returning({ id: services.id });
      updatedRow = row;
    } else {
      if (slug) {
        const [conflict] = await db
          .select({ id: blogPosts.id })
          .from(blogPosts)
          .where(and(eq(blogPosts.slug, slug), ne(blogPosts.id, id)))
          .limit(1);
        if (conflict) {
          return apiError("Conflict", "Another post already uses this slug.", 409);
        }
      }
      const [row] = await db
        .update(blogPosts)
        .set({
          ...(slug ? { slug } : {}),
          seoTitle: seoTitle ?? null,
          seoDescription: seoDescription ?? null,
          ogTitle: ogTitle ?? null,
          ogDescription: ogDescription ?? null,
          ...(ogImageAssetId !== undefined ? { ogImageAssetId } : {}),
          canonicalUrl: canonicalUrl ?? null,
          ...(cleanDirective ? { robotsDirective: cleanDirective } : {}),
          ...(schemaType ? { schemaType } : {}),
          schemaJson: schemaJson ?? null,
          ...(computedNoIndex !== undefined ? { noIndex: computedNoIndex } : {}),
          updatedAt: new Date(),
        })
        .where(eq(blogPosts.id, id))
        .returning({ id: blogPosts.id });
      updatedRow = row;
    }

    if (!updatedRow) {
      return apiNotFound("Target entry not found.");
    }

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "seo.metadata_updated",
      entityType: kind,
      entityId: id,
    });

    return apiOk({ updated: true, id, kind });
  } catch (err) {
    return handleApiError(err, "PATCH /api/v1/admin/seo");
  }
}
