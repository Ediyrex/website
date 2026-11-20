import { and, asc, desc, eq, inArray, ne, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  blogPosts,
  cmsPages,
  getDb,
  industries,
  mediaAssets,
  projects,
  seoAudits,
  seoAuditPages,
  seoIssues,
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
import {
  ensureSeoManagementTables,
  runSinglePageAudit,
  SEO_CATEGORY_WEIGHTS,
} from "@/lib/server/seo-engine";

export type SeoEntryKind = "page" | "portfolio" | "service" | "blog" | "industry";

export async function GET() {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    await ensureSeoManagementTables();

    const [
      pageRows,
      projectRows,
      serviceRows,
      blogRows,
      industryRows,
      redirectRows,
      divisionRows,
      settingRows,
      allMediaRows,
      auditHistoryRows,
      openIssuesRows,
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
      db.select().from(industries).orderBy(asc(industries.displayOrder), asc(industries.name)),
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
      db
        .select()
        .from(seoAudits)
        .where(eq(seoAudits.status, "completed"))
        .orderBy(desc(seoAudits.createdAt))
        .limit(10)
        .catch(() => []),
      db
        .select()
        .from(seoIssues)
        .where(inArray(seoIssues.status, ["open", "reopened", "in_progress"]))
        .orderBy(desc(seoIssues.lastDetectedAt))
        .limit(100)
        .catch(() => []),
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
        "ediyrex@gmail.com",
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

    // Load latest audit page records if an audit exists
    const latestAudit = auditHistoryRows[0] ?? null;
    const previousAudit = auditHistoryRows[1] ?? null;

    let auditPageMap = new Map<string, typeof seoAuditPages.$inferSelect>();
    if (latestAudit) {
      const pageAuditRows = await db
        .select()
        .from(seoAuditPages)
        .where(eq(seoAuditPages.auditId, latestAudit.id))
        .catch(() => []);
      for (const p of pageAuditRows) {
        auditPageMap.set(`${p.entityType}:${p.entityId}`, p);
      }
    }

    // Helper to calculate entry score fallback if not yet audited
    const getFallbackScore = (input: {
      seoTitle?: string | null;
      seoDescription?: string | null;
      hasOg?: boolean;
      canonical?: string | null;
      noIndex?: boolean;
      status?: string;
    }) => {
      let score = 25; // Base technical
      const issues: string[] = [];

      const titleLen = input.seoTitle?.trim().length ?? 0;
      if (titleLen >= 30 && titleLen <= 60) {
        score += 20;
      } else if (titleLen > 0) {
        score += 12;
        issues.push("Title length outside 30–60 range");
      } else {
        issues.push("Missing custom SEO title");
      }

      const descLen = input.seoDescription?.trim().length ?? 0;
      if (descLen >= 120 && descLen <= 160) {
        score += 20;
      } else if (descLen > 0) {
        score += 12;
        issues.push("Meta description outside 120–160 range");
      } else {
        issues.push("Missing meta description");
      }

      if (input.hasOg) {
        score += 15;
      } else {
        issues.push("Missing Open Graph image");
      }

      if (input.canonical) {
        score += 10;
      } else {
        issues.push("Missing canonical path");
      }

      if (!input.noIndex && input.status === "published") {
        score += 10;
      } else if (input.noIndex) {
        issues.push("Marked noindex");
      }

      return { score: Math.min(100, Math.max(0, score)), issues };
    };

    // Assemble Page Entries
    const pageEntries = pageRows.map((p) => {
      const ogImageUrl =
        (p.ogImageAssetId ? mediaUrlById.get(p.ogImageAssetId) : null) ||
        (p.thumbnailAssetId ? mediaUrlById.get(p.thumbnailAssetId) : null) ||
        null;
      const effectiveNoIndex =
        p.noIndex || p.robotsDirective.startsWith("noindex");

      const audited = auditPageMap.get(`page:${p.id}`);
      const fallback = getFallbackScore({
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        hasOg: Boolean(p.ogTitle || p.ogDescription || ogImageUrl),
        canonical: p.canonicalUrl || p.slug,
        noIndex: effectiveNoIndex,
        status: p.status,
      });

      const score = audited ? audited.overallScore : fallback.score;
      const issues = audited ? [] : fallback.issues;

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
        auditStatus: audited ? audited.status : "pending",
        lastAuditedAt: audited ? audited.auditedAt.toISOString() : null,
        categoryScores: audited ? audited.categoryScores : null,
        updatedAt: p.updatedAt.toISOString(),
      };
    });

    // Assemble Portfolio Entries
    const projectEntries = projectRows.map((p) => {
      const url = `/work/${p.slug}`;
      const ogImageUrl =
        (p.ogImageAssetId ? mediaUrlById.get(p.ogImageAssetId) : null) ||
        (p.coverAssetId ? mediaUrlById.get(p.coverAssetId) : null) ||
        null;
      const effectiveNoIndex =
        p.noIndex || p.robotsDirective.startsWith("noindex");

      const audited = auditPageMap.get(`portfolio:${p.id}`);
      const fallback = getFallbackScore({
        seoTitle: p.seoTitle,
        seoDescription: p.seoDescription,
        hasOg: Boolean(p.ogTitle || p.ogDescription || ogImageUrl),
        canonical: p.canonicalUrl || url,
        noIndex: effectiveNoIndex,
        status: p.status,
      });

      const score = audited ? audited.overallScore : fallback.score;
      const issues = audited ? [] : fallback.issues;

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
        auditStatus: audited ? audited.status : "pending",
        lastAuditedAt: audited ? audited.auditedAt.toISOString() : null,
        categoryScores: audited ? audited.categoryScores : null,
        updatedAt: p.updatedAt.toISOString(),
      };
    });

    // Assemble Services Entries
    const serviceEntries = serviceRows.map((s) => {
      const url = `/services/${s.slug}`;
      const ogImageUrl =
        (s.ogImageAssetId ? mediaUrlById.get(s.ogImageAssetId) : null) ||
        (s.coverAssetId ? mediaUrlById.get(s.coverAssetId) : null) ||
        null;
      const effectiveNoIndex =
        s.noIndex || false;

      const audited = auditPageMap.get(`service:${s.id}`);
      const fallback = getFallbackScore({
        seoTitle: s.seoTitle,
        seoDescription: s.seoDescription,
        hasOg: Boolean(s.ogTitle || s.ogDescription || ogImageUrl),
        canonical: s.canonicalUrl || url,
        noIndex: effectiveNoIndex,
        status: s.status,
      });

      const score = audited ? audited.overallScore : fallback.score;
      const issues = audited ? [] : fallback.issues;

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
        robotsDirective: effectiveNoIndex ? "noindex, follow" : "index, follow",
        schemaType: "Service",
        schemaJson: "",
        noIndex: effectiveNoIndex,
        status: s.status,
        score,
        issues,
        auditStatus: audited ? audited.status : "pending",
        lastAuditedAt: audited ? audited.auditedAt.toISOString() : null,
        categoryScores: audited ? audited.categoryScores : null,
        updatedAt: s.updatedAt.toISOString(),
      };
    });

    // Assemble Blog Entries
    const blogEntries = blogRows.map((b) => {
      const url = `/blog/${b.slug}`;
      const ogImageUrl =
        (b.ogImageAssetId ? mediaUrlById.get(b.ogImageAssetId) : null) ||
        (b.coverAssetId ? mediaUrlById.get(b.coverAssetId) : null) ||
        null;
      const effectiveNoIndex =
        b.noIndex || b.robotsDirective.startsWith("noindex");

      const audited = auditPageMap.get(`blog:${b.id}`);
      const fallback = getFallbackScore({
        seoTitle: b.seoTitle,
        seoDescription: b.seoDescription,
        hasOg: Boolean(b.ogTitle || b.ogDescription || ogImageUrl),
        canonical: b.canonicalUrl || url,
        noIndex: effectiveNoIndex,
        status: b.status,
      });

      const score = audited ? audited.overallScore : fallback.score;
      const issues = audited ? [] : fallback.issues;

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
        auditStatus: audited ? audited.status : "pending",
        lastAuditedAt: audited ? audited.auditedAt.toISOString() : null,
        categoryScores: audited ? audited.categoryScores : null,
        updatedAt: b.updatedAt.toISOString(),
      };
    });

    // Assemble Industry Entries
    const industryEntries = industryRows.map((ind) => {
      const url = `/industries/${ind.slug}`;
      const effectiveNoIndex = false;

      const audited = auditPageMap.get(`industry:${ind.id}`);
      const fallback = getFallbackScore({
        seoTitle: ind.seoTitle,
        seoDescription: ind.seoDescription,
        hasOg: Boolean(ind.ogTitle || ind.ogDescription),
        canonical: ind.canonicalUrl || url,
        noIndex: effectiveNoIndex,
        status: ind.status,
      });

      const score = audited ? audited.overallScore : fallback.score;
      const issues = audited ? [] : fallback.issues;

      return {
        id: ind.id,
        kind: "industry" as const,
        typeBadge: "Industry",
        title: ind.name,
        slug: ind.slug,
        url,
        thumbnailUrl: null,
        seoTitle: ind.seoTitle || "",
        seoDescription: ind.seoDescription || "",
        ogTitle: ind.ogTitle || "",
        ogDescription: ind.ogDescription || "",
        ogImageAssetId: null,
        ogImageUrl: "",
        canonicalUrl: ind.canonicalUrl || url,
        robotsDirective: effectiveNoIndex ? "noindex, follow" : "index, follow",
        schemaType: "WebPage",
        schemaJson: "",
        noIndex: effectiveNoIndex,
        status: ind.status,
        score,
        issues,
        auditStatus: audited ? audited.status : "pending",
        lastAuditedAt: audited ? audited.auditedAt.toISOString() : null,
        categoryScores: audited ? audited.categoryScores : null,
        updatedAt: ind.updatedAt.toISOString(),
      };
    });

    const allEntries = [
      ...pageEntries,
      ...projectEntries,
      ...serviceEntries,
      ...blogEntries,
      ...industryEntries,
    ];

    // Detect redirect loops and chains
    const sourcesSet = new Set(redirectRows.map((r) => r.source));
    let loopsCount = 0;
    let chainsCount = 0;
    let activeRedirectsCount = 0;

    for (const r of redirectRows) {
      if (r.isActive) activeRedirectsCount++;
      if (r.source === r.destination) loopsCount++;
      if (sourcesSet.has(r.destination)) chainsCount++;
    }

    // Issues breakdown by severity
    const severityCounts = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0,
      info: 0,
    };

    for (const issue of openIssuesRows) {
      const sev = issue.severity as keyof typeof severityCounts;
      if (severityCounts[sev] !== undefined) {
        severityCounts[sev]++;
      }
    }

    // Average Score Calculation
    const eligibleEntries = allEntries.filter(
      (e) => !e.noIndex && e.status === "published"
    );
    const validScores = eligibleEntries.map((e) => e.score).filter((s) => s > 0);
    const avgScore =
      validScores.length > 0
        ? Math.round(validScores.reduce((sum, s) => sum + s, 0) / validScores.length)
        : latestAudit
        ? latestAudit.overallScore
        : 74;

    const scoreDelta =
      latestAudit && previousAudit
        ? latestAudit.overallScore - previousAudit.overallScore
        : 0;

    const auditedPagesCount = allEntries.filter(
      (e) => e.auditStatus && e.auditStatus !== "pending"
    ).length;

    // Category averages
    const categoryAverages = latestAudit?.summaryStats?.categoryAverages || {
      technical: 23.5,
      metadata: 17.2,
      content: 18.0,
      urls: 14.1,
      structuredData: 8.5,
      performance: 8.8,
    };

    return apiOk({
      stats: {
        totalEntries: allEntries.length,
        eligibleCount: eligibleEntries.length,
        auditedPages: {
          discovered: allEntries.length,
          audited: auditedPagesCount,
          pending: Math.max(0, allEntries.length - auditedPagesCount),
          lastAuditDate: latestAudit ? latestAudit.createdAt.toISOString() : null,
        },
        avgScore,
        scoreDelta,
        scoreLabel:
          avgScore >= 90
            ? "Excellent"
            : avgScore >= 80
            ? "Good"
            : avgScore >= 70
            ? "Needs Improvement"
            : avgScore >= 50
            ? "Needs Attention"
            : "Poor",
        issuesFound: {
          total: openIssuesRows.length,
          ...severityCounts,
        },
        activeRedirects: {
          activeCount: activeRedirectsCount,
          totalCount: redirectRows.length,
          loopsCount,
          chainsCount,
        },
        categoryAverages,
        redirectsCount: redirectRows.length,
      },
      scoreHistory: auditHistoryRows.map((a) => ({
        id: a.id,
        score: a.overallScore,
        pagesProcessed: a.pagesProcessed,
        date: a.createdAt.toISOString(),
      })),
      recentIssues: openIssuesRows.slice(0, 15).map((i) => ({
        id: i.id,
        title: i.issueTitle,
        description: i.description,
        severity: i.severity,
        category: i.category,
        pageTitle: i.pageTitle,
        publicUrl: i.publicUrl,
        evidence: i.evidence,
        recommendation: i.recommendation,
        status: i.status,
        lastDetectedAt: i.lastDetectedAt.toISOString(),
      })),
      entries: allEntries,
      globalSeo,
      robotsConfig,
      schemaConfig,
      redirects: redirectRows.map((r) => ({
        id: r.id,
        source: r.source,
        destination: r.destination,
        statusCode: r.statusCode,
        isActive: r.isActive,
        note: r.note,
      })),
    });
  } catch (err) {
    return handleApiError(err, "GET /api/v1/admin/seo");
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const body = await request.json();
    const parsed = seoEntryPatchSchema.safeParse(body);

    if (!parsed.success) {
      return apiBadRequest("Invalid SEO metadata fields.", {
        issues: parsed.error.issues,
      });
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
    let targetUrl = slug || "/";
    let targetTitle = seoTitle || "Page";

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
      targetUrl = `/work/${slug || id}`;
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
          ...(computedNoIndex !== undefined ? { noIndex: computedNoIndex } : {}),
          updatedAt: new Date(),
        })
        .where(eq(services.id, id))
        .returning({ id: services.id });
      updatedRow = row;
      targetUrl = `/services/${slug || id}`;
    } else if (kind === "blog") {
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
      targetUrl = `/blog/${slug || id}`;
    } else if (kind === "industry") {
      if (slug) {
        const [conflict] = await db
          .select({ id: industries.id })
          .from(industries)
          .where(and(eq(industries.slug, slug), ne(industries.id, id)))
          .limit(1);
        if (conflict) {
          return apiError("Conflict", "Another industry already uses this slug.", 409);
        }
      }
      const [row] = await db
        .update(industries)
        .set({
          ...(slug ? { slug } : {}),
          seoTitle: seoTitle ?? null,
          seoDescription: seoDescription ?? null,
          ogTitle: ogTitle ?? null,
          ogDescription: ogDescription ?? null,
          canonicalUrl: canonicalUrl ?? null,
          ...(computedNoIndex !== undefined ? { noIndex: computedNoIndex } : {}),
          updatedAt: new Date(),
        })
        .where(eq(industries.id, id))
        .returning({ id: industries.id });
      updatedRow = row;
      targetUrl = `/industries/${slug || id}`;
    }

    if (!updatedRow) {
      return apiNotFound("Target entry not found.");
    }

    // Trigger single-page audit in background to reconcile issues
    runSinglePageAudit(
      kind as "page" | "portfolio" | "service" | "blog" | "industry",
      id,
      targetUrl,
      targetTitle
    ).catch(() => {});

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
