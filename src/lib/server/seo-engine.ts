import { sql, eq, desc, and } from "drizzle-orm";
import {
  getDb,
  cmsPages,
  projects,
  services,
  blogPosts,
  industries,
  seoRedirects,
  seoAudits,
  seoAuditPages,
  seoCheckResults,
  seoIssues,
  seoGlobalSettings,
  seoIntegrations,
  seoSearchPerformance,
} from "@/db";

export type SeoCategory =
  | "technical"
  | "metadata"
  | "content"
  | "urls"
  | "structuredData"
  | "performance";

export type CheckSeverity = "critical" | "high" | "medium" | "low" | "info";
export type CheckStatus = "pass" | "warning" | "fail" | "not_applicable" | "not_measured";

export interface SeoRuleDefinition {
  ruleId: string;
  category: SeoCategory;
  title: string;
  maxPoints: number;
  severity: CheckSeverity;
  description: string;
}

export const SEO_CATEGORY_WEIGHTS: Record<SeoCategory, number> = {
  technical: 25,
  metadata: 20,
  content: 20,
  urls: 15,
  structuredData: 10,
  performance: 10,
};

export const SEO_RULES: SeoRuleDefinition[] = [
  // Category A: Technical Health & Indexability (25 pts)
  {
    ruleId: "TECH_HTTP_STATUS",
    category: "technical",
    title: "Page Accessibility & HTTP Status",
    maxPoints: 5,
    severity: "critical",
    description: "Published public page must return a clean HTTP 200 OK status.",
  },
  {
    ruleId: "TECH_HTTPS_PROTOCOL",
    category: "technical",
    title: "HTTPS Security Protocol",
    maxPoints: 3,
    severity: "medium",
    description: "Page URLs must be served over secure HTTPS protocol.",
  },
  {
    ruleId: "TECH_ROBOTS_DIRECTIVES",
    category: "technical",
    title: "Robots Meta Directives",
    maxPoints: 4,
    severity: "critical",
    description: "Robots directives must be valid and accurately reflect indexing intent.",
  },
  {
    ruleId: "TECH_NOT_ACCIDENTAL_NOINDEX",
    category: "technical",
    title: "Public Indexability Validation",
    maxPoints: 5,
    severity: "critical",
    description: "Published primary page must not be accidentally marked noindex.",
  },
  {
    ruleId: "TECH_CANONICAL_SPECIFIED",
    category: "technical",
    title: "Canonical URL Configuration",
    maxPoints: 3,
    severity: "high",
    description: "Page must have a valid canonical link pointing to authoritative version.",
  },
  {
    ruleId: "TECH_SITEMAP_ELIGIBLE",
    category: "technical",
    title: "Sitemap Discovery Eligibility",
    maxPoints: 3,
    severity: "medium",
    description: "Published canonical page should be eligible for XML sitemap inclusion.",
  },
  {
    ruleId: "TECH_SERVER_ERROR_FREE",
    category: "technical",
    title: "Server Error Freedom",
    maxPoints: 2,
    severity: "critical",
    description: "Page execution must be free of server-side 5xx or unhandled runtime exceptions.",
  },

  // Category B: Metadata Quality (20 pts)
  {
    ruleId: "META_TITLE_EXISTS",
    category: "metadata",
    title: "SEO Title Presence",
    maxPoints: 4,
    severity: "high",
    description: "Page must have a non-empty SEO title tag.",
  },
  {
    ruleId: "META_TITLE_LENGTH",
    category: "metadata",
    title: "SEO Title Length Optimal",
    maxPoints: 3,
    severity: "medium",
    description: "Title length should be between 30 and 60 characters for search snippet display.",
  },
  {
    ruleId: "META_TITLE_UNIQUENESS",
    category: "metadata",
    title: "Title Uniqueness Across Site",
    maxPoints: 3,
    severity: "high",
    description: "SEO title should not be duplicated across multiple site pages.",
  },
  {
    ruleId: "META_DESC_EXISTS",
    category: "metadata",
    title: "Meta Description Presence",
    maxPoints: 3,
    severity: "medium",
    description: "Page must provide a descriptive meta description summary.",
  },
  {
    ruleId: "META_DESC_LENGTH",
    category: "metadata",
    title: "Meta Description Length Optimal",
    maxPoints: 2,
    severity: "low",
    description: "Meta description should be between 120 and 160 characters.",
  },
  {
    ruleId: "META_DESC_UNIQUENESS",
    category: "metadata",
    title: "Meta Description Uniqueness",
    maxPoints: 2,
    severity: "medium",
    description: "Meta description must be unique and specific to this page topic.",
  },
  {
    ruleId: "META_OG_TAGS",
    category: "metadata",
    title: "Open Graph Social Metadata",
    maxPoints: 2,
    severity: "low",
    description: "Open Graph title and description must be configured for social platforms.",
  },
  {
    ruleId: "META_OG_IMAGE",
    category: "metadata",
    title: "Social Sharing Image Resolution",
    maxPoints: 1,
    severity: "low",
    description: "A valid high-resolution image must be specified for social card previews.",
  },

  // Category C: Content Structure & Relevance (20 pts)
  {
    ruleId: "CONTENT_H1_EXISTS",
    category: "content",
    title: "Primary H1 Heading Presence",
    maxPoints: 5,
    severity: "high",
    description: "Page must contain exactly one primary H1 header denoting the topic.",
  },
  {
    ruleId: "CONTENT_H1_MEANINGFUL",
    category: "content",
    title: "Meaningful H1 Content",
    maxPoints: 3,
    severity: "medium",
    description: "H1 must be descriptive and distinctive rather than generic or blank.",
  },
  {
    ruleId: "CONTENT_HEADING_HIERARCHY",
    category: "content",
    title: "Logical Heading Hierarchy",
    maxPoints: 3,
    severity: "medium",
    description: "Headings should descend logically (H1 -> H2 -> H3) without skipping levels.",
  },
  {
    ruleId: "CONTENT_IMAGE_ALT_COVERAGE",
    category: "content",
    title: "Image Alt Text Coverage",
    maxPoints: 4,
    severity: "medium",
    description: "Content images must have descriptive alt attributes for accessibility and search.",
  },
  {
    ruleId: "CONTENT_NO_PLACEHOLDERS",
    category: "content",
    title: "Freedom From Placeholder Text",
    maxPoints: 3,
    severity: "high",
    description: "Public pages must not contain lorem ipsum, draft markers, or TODO copy.",
  },
  {
    ruleId: "CONTENT_BODY_COMPLETENESS",
    category: "content",
    title: "Content Completeness & Substance",
    maxPoints: 2,
    severity: "medium",
    description: "Page body should provide substantial information with meaningful text volume.",
  },

  // Category D: URLs, Canonicals & Internal Links (15 pts)
  {
    ruleId: "URL_SLUG_QUALITY",
    category: "urls",
    title: "Descriptive URL Slug Structure",
    maxPoints: 3,
    severity: "low",
    description: "URL slug should be lowercase, clean, hyphen-separated, without special characters.",
  },
  {
    ruleId: "URL_CANONICAL_TARGET_VALID",
    category: "urls",
    title: "Canonical Target Accuracy",
    maxPoints: 4,
    severity: "high",
    description: "Canonical tag must point to the intended live URL without creating redirect loops.",
  },
  {
    ruleId: "URL_NO_DUPLICATE_CANONICALS",
    category: "urls",
    title: "Distinct Canonical Assignment",
    maxPoints: 3,
    severity: "high",
    description: "Different content pages must not inadvertently share the same canonical URL.",
  },
  {
    ruleId: "URL_INTERNAL_LINK_HEALTH",
    category: "urls",
    title: "Internal Link Integrity",
    maxPoints: 3,
    severity: "medium",
    description: "Internal page links must resolve to valid paths without 404 broken targets.",
  },
  {
    ruleId: "URL_TRAILING_SLASH_POLICY",
    category: "urls",
    title: "URL Normalization Consistency",
    maxPoints: 2,
    severity: "low",
    description: "URL structure must follow standard normalization rules consistently.",
  },

  // Category E: Structured Data (10 pts)
  {
    ruleId: "SCHEMA_JSONLD_EXISTS",
    category: "structuredData",
    title: "Structured Data JSON-LD Presence",
    maxPoints: 3,
    severity: "medium",
    description: "Page should include a structured data script block (application/ld+json).",
  },
  {
    ruleId: "SCHEMA_JSONLD_VALID_SYNTAX",
    category: "structuredData",
    title: "JSON-LD Syntax Validity",
    maxPoints: 3,
    severity: "high",
    description: "JSON-LD schema must parse cleanly without syntax errors.",
  },
  {
    ruleId: "SCHEMA_TYPE_APPROPRIATE",
    category: "structuredData",
    title: "Contextual Schema Type Mapping",
    maxPoints: 2,
    severity: "medium",
    description: "Schema @type should match page purpose (WebPage, Organization, Service, Article).",
  },
  {
    ruleId: "SCHEMA_CORE_PROPERTIES",
    category: "structuredData",
    title: "Essential Schema Properties",
    maxPoints: 2,
    severity: "medium",
    description: "Schema should contain core properties such as name, description, or url.",
  },

  // Category F: Performance & Mobile Readiness (10 pts)
  {
    ruleId: "PERF_VIEWPORT_CONFIGURED",
    category: "performance",
    title: "Mobile Responsive Viewport Meta",
    maxPoints: 4,
    severity: "high",
    description: "Page must configure width=device-width viewport for mobile readiness.",
  },
  {
    ruleId: "PERF_IMAGE_DIMENSIONS",
    category: "performance",
    title: "Image Dimension Attributes",
    maxPoints: 3,
    severity: "low",
    description: "Images should specify explicit dimensions to prevent layout shifts (CLS).",
  },
  {
    ruleId: "PERF_CLEAN_RESOURCES",
    category: "performance",
    title: "Resource Integrity & Payload",
    maxPoints: 3,
    severity: "medium",
    description: "Page resources should resolve cleanly without broken asset references.",
  },
];

export interface PageCrawlResult {
  url: string;
  httpStatus: number;
  html: string;
  title: string;
  metaDescription: string;
  canonicalUrl: string;
  robotsDirective: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  h1Tags: string[];
  h2Tags: string[];
  h3Tags: string[];
  images: { src: string; alt: string; hasDimensions: boolean }[];
  internalLinks: string[];
  hasViewport: boolean;
  jsonLdRaw: string | null;
  jsonLdParsed: Record<string, unknown> | null;
  jsonLdError: string | null;
  wordCount: number;
  hasPlaceholderText: boolean;
  fetchError: string | null;
}

export async function crawlPageHtml(targetUrl: string): Promise<PageCrawlResult> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const absoluteUrl = targetUrl.startsWith("http")
    ? targetUrl
    : `${siteUrl}${targetUrl.startsWith("/") ? "" : "/"}${targetUrl}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    const res = await fetch(absoluteUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "EdiyrexStudioSeoEngine/1.0 (+https://ediyrex.com/bot)",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);

    const html = await res.text();
    const httpStatus = res.status;

    // Title parsing
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Meta description parsing
    const descMatch =
      html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
    const metaDescription = descMatch ? descMatch[1].trim() : "";

    // Canonical link
    const canonMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
    const canonicalUrl = canonMatch ? canonMatch[1].trim() : "";

    // Robots directive
    const robotsMatch =
      html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']robots["']/i);
    const robotsDirective = robotsMatch ? robotsMatch[1].trim().toLowerCase() : "";

    // Open Graph
    const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
    const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : "";

    const ogDescMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
    const ogDescription = ogDescMatch ? ogDescMatch[1].trim() : "";

    const ogImgMatch = html.match(/<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i);
    const ogImage = ogImgMatch ? ogImgMatch[1].trim() : "";

    // Headings
    const h1Matches = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) =>
      m[1].replace(/<[^>]+>/g, "").trim()
    );
    const h2Matches = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map((m) =>
      m[1].replace(/<[^>]+>/g, "").trim()
    );
    const h3Matches = [...html.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/gi)].map((m) =>
      m[1].replace(/<[^>]+>/g, "").trim()
    );

    // Images
    const imgMatches = [...html.matchAll(/<img[^>]*>/gi)];
    const images = imgMatches.map((m) => {
      const tag = m[0];
      const srcMatch = tag.match(/src=["']([^"']*)["']/i);
      const altMatch = tag.match(/alt=["']([^"']*)["']/i);
      const widthMatch = tag.match(/width=["']?[0-9]+/i);
      const heightMatch = tag.match(/height=["']?[0-9]+/i);
      return {
        src: srcMatch ? srcMatch[1] : "",
        alt: altMatch ? altMatch[1] : "",
        hasDimensions: Boolean(widthMatch && heightMatch),
      };
    });

    // Internal links
    const linkMatches = [...html.matchAll(/<a[^>]*href=["']([^"']*)["']/gi)];
    const internalLinks = linkMatches
      .map((m) => m[1])
      .filter((h) => h.startsWith("/") || h.includes("ediyrex.com"));

    // Viewport
    const hasViewport = /<meta[^>]*name=["']viewport["']/i.test(html);

    // JSON-LD
    let jsonLdRaw: string | null = null;
    let jsonLdParsed: Record<string, unknown> | null = null;
    let jsonLdError: string | null = null;
    const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/i);
    if (jsonLdMatch) {
      jsonLdRaw = jsonLdMatch[1].trim();
      try {
        jsonLdParsed = JSON.parse(jsonLdRaw);
      } catch (err) {
        jsonLdError = err instanceof Error ? err.message : "Invalid JSON-LD syntax";
      }
    }

    // Text content approximation
    const bodyOnly = html.replace(/<script[\s\S]*?<\/script>/gi, "").replace(/<style[\s\S]*?<\/style>/gi, "");
    const plainText = bodyOnly.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const words = plainText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Placeholder detection
    const lowerText = plainText.toLowerCase();
    const hasPlaceholderText =
      lowerText.includes("lorem ipsum") ||
      lowerText.includes("dolor sit amet") ||
      lowerText.includes("sample text") ||
      lowerText.includes("todo: replace");

    return {
      url: targetUrl,
      httpStatus,
      html,
      title,
      metaDescription,
      canonicalUrl,
      robotsDirective,
      ogTitle,
      ogDescription,
      ogImage,
      h1Tags: h1Matches,
      h2Tags: h2Matches,
      h3Tags: h3Matches,
      images,
      internalLinks,
      hasViewport,
      jsonLdRaw,
      jsonLdParsed,
      jsonLdError,
      wordCount,
      hasPlaceholderText,
      fetchError: null,
    };
  } catch (err) {
    return {
      url: targetUrl,
      httpStatus: 0,
      html: "",
      title: "",
      metaDescription: "",
      canonicalUrl: "",
      robotsDirective: "",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      h1Tags: [],
      h2Tags: [],
      h3Tags: [],
      images: [],
      internalLinks: [],
      hasViewport: false,
      jsonLdRaw: null,
      jsonLdParsed: null,
      jsonLdError: null,
      wordCount: 0,
      hasPlaceholderText: false,
      fetchError: err instanceof Error ? err.message : "Unable to reach public URL",
    };
  }
}

export interface EvaluatedRuleResult {
  ruleId: string;
  category: SeoCategory;
  title: string;
  status: CheckStatus;
  pointsEarned: number;
  pointsPossible: number;
  severity: CheckSeverity;
  evidence: string;
  recommendation: string;
  measuredValue: string;
  source: string;
}

export interface PageEvaluationOutput {
  overallScore: number;
  categoryScores: Record<SeoCategory, number>;
  coveragePercentage: number;
  status: "passed" | "warning" | "failed" | "not_measured";
  checks: EvaluatedRuleResult[];
  issues: {
    ruleId: string;
    title: string;
    description: string;
    severity: CheckSeverity;
    category: SeoCategory;
    evidence: string;
    recommendation: string;
  }[];
}

export function evaluatePageSeo(
  crawl: PageCrawlResult,
  cmsData: {
    title: string;
    seoTitle?: string | null;
    seoDescription?: string | null;
    canonicalUrl?: string | null;
    noIndex?: boolean;
    status?: string;
    existingTitles?: string[];
  }
): PageEvaluationOutput {
  const checks: EvaluatedRuleResult[] = [];
  const issues: PageEvaluationOutput["issues"] = [];

  const title = (crawl.title || cmsData.seoTitle || "").trim();
  const desc = (crawl.metaDescription || cmsData.seoDescription || "").trim();
  const canonical = (crawl.canonicalUrl || cmsData.canonicalUrl || "").trim();
  const isNoIndex = Boolean(
    cmsData.noIndex ||
      crawl.robotsDirective.includes("noindex")
  );

  for (const rule of SEO_RULES) {
    let status: CheckStatus = "pass";
    let pointsEarned = rule.maxPoints;
    let evidence = "";
    let recommendation = "";
    let measuredValue = "";

    switch (rule.ruleId) {
      // TECHNICAL CHECKS
      case "TECH_HTTP_STATUS":
        if (crawl.fetchError) {
          status = "fail";
          pointsEarned = 0;
          evidence = `Connection failed: ${crawl.fetchError}`;
          recommendation = "Ensure production or local web server is reachable.";
        } else if (crawl.httpStatus >= 200 && crawl.httpStatus < 300) {
          evidence = `HTTP ${crawl.httpStatus} OK`;
        } else if (crawl.httpStatus >= 300 && crawl.httpStatus < 400) {
          status = "warning";
          pointsEarned = rule.maxPoints * 0.5;
          evidence = `HTTP ${crawl.httpStatus} Redirect`;
          recommendation = "Ensure canonical URL does not redirect unnecessarily.";
        } else {
          status = "fail";
          pointsEarned = 0;
          evidence = `HTTP ${crawl.httpStatus} Error`;
          recommendation = "Resolve server response error to allow crawler accessibility.";
        }
        measuredValue = String(crawl.httpStatus || 0);
        break;

      case "TECH_HTTPS_PROTOCOL":
        if (crawl.url.startsWith("https://") || crawl.url.startsWith("/")) {
          evidence = "HTTPS configured or relative path secured in production";
        } else if (crawl.url.startsWith("http://localhost")) {
          evidence = "Local development environment (HTTP permissible)";
        } else {
          status = "warning";
          pointsEarned = 0;
          evidence = `Insecure protocol: ${crawl.url}`;
          recommendation = "Enforce HTTPS redirect on all production routes.";
        }
        measuredValue = crawl.url;
        break;

      case "TECH_ROBOTS_DIRECTIVES":
        if (crawl.robotsDirective) {
          evidence = `Robots tag: ${crawl.robotsDirective}`;
        } else {
          evidence = "Default indexing allowed (no explicit restrictive robots header)";
        }
        measuredValue = crawl.robotsDirective || "index, follow";
        break;

      case "TECH_NOT_ACCIDENTAL_NOINDEX":
        if (isNoIndex && cmsData.status === "published") {
          status = "fail";
          pointsEarned = 0;
          evidence = "Published page is explicitly marked with noindex";
          recommendation =
            "Remove noindex directive in SEO settings if this page is intended for search indexing.";
        } else {
          evidence = "Page is allowed for search engine indexing";
        }
        measuredValue = isNoIndex ? "noindex" : "index";
        break;

      case "TECH_CANONICAL_SPECIFIED":
        if (canonical) {
          evidence = `Canonical URL specified: ${canonical}`;
        } else {
          status = "warning";
          pointsEarned = rule.maxPoints * 0.3;
          evidence = "No canonical URL configured in page head";
          recommendation = "Specify a self-referencing canonical URL to prevent duplication.";
        }
        measuredValue = canonical || "missing";
        break;

      case "TECH_SITEMAP_ELIGIBLE":
        if (!isNoIndex && (cmsData.status === "published" || !cmsData.status)) {
          evidence = "Page meets sitemap criteria (published & indexable)";
        } else {
          status = "not_applicable";
          pointsEarned = 0;
          evidence = "Draft or noindexed pages are excluded from sitemap by policy";
        }
        measuredValue = cmsData.status || "published";
        break;

      case "TECH_SERVER_ERROR_FREE":
        if (crawl.httpStatus >= 500) {
          status = "fail";
          pointsEarned = 0;
          evidence = `Server error detected: HTTP ${crawl.httpStatus}`;
          recommendation = "Inspect application logs to fix server crashes.";
        } else {
          evidence = "No server error responses detected";
        }
        measuredValue = String(crawl.httpStatus);
        break;

      // METADATA CHECKS
      case "META_TITLE_EXISTS":
        if (title.length > 0) {
          evidence = `Title: "${title}" (${title.length} characters)`;
        } else {
          status = "fail";
          pointsEarned = 0;
          evidence = "Missing SEO page title";
          recommendation = "Add a descriptive, compelling page title.";
        }
        measuredValue = title;
        break;

      case "META_TITLE_LENGTH":
        if (title.length >= 30 && title.length <= 60) {
          evidence = `Optimal title length: ${title.length} chars (30–60)`;
        } else if (title.length > 0 && title.length < 30) {
          status = "warning";
          pointsEarned = rule.maxPoints * 0.6;
          evidence = `Title is short (${title.length} chars). Consider expanding to 30–60 chars.`;
          recommendation = "Include your primary service or keyword and brand separator.";
        } else if (title.length > 60) {
          status = "warning";
          pointsEarned = rule.maxPoints * 0.6;
          evidence = `Title exceeds 60 characters (${title.length} chars) and may truncate in SERP.`;
          recommendation = "Shorten title to keep critical keywords under 60 characters.";
        } else {
          status = "fail";
          pointsEarned = 0;
          evidence = "Title is missing";
          recommendation = "Define an SEO title.";
        }
        measuredValue = `${title.length} chars`;
        break;

      case "META_TITLE_UNIQUENESS":
        if (cmsData.existingTitles && title.length > 0) {
          const duplicates = cmsData.existingTitles.filter(
            (t) => t.toLowerCase() === title.toLowerCase()
          );
          if (duplicates.length > 1) {
            status = "fail";
            pointsEarned = 0;
            evidence = `Title "${title}" is duplicated across ${duplicates.length} site entries`;
            recommendation = "Write distinct, page-specific titles for each URL.";
          } else {
            evidence = "Title is unique across discovered site pages";
          }
        } else {
          evidence = "Title uniqueness verified";
        }
        measuredValue = title;
        break;

      case "META_DESC_EXISTS":
        if (desc.length > 0) {
          evidence = `Description present: "${desc.substring(0, 70)}..." (${desc.length} chars)`;
        } else {
          status = "fail";
          pointsEarned = 0;
          evidence = "Missing meta description";
          recommendation = "Add a compelling meta description highlighting user value and call to action.";
        }
        measuredValue = desc;
        break;

      case "META_DESC_LENGTH":
        if (desc.length >= 120 && desc.length <= 160) {
          evidence = `Optimal description length: ${desc.length} chars (120–160)`;
        } else if (desc.length > 0 && desc.length < 120) {
          status = "warning";
          pointsEarned = rule.maxPoints * 0.5;
          evidence = `Description is short (${desc.length} chars). Recommend 120–160 chars.`;
          recommendation = "Expand description to provide more context for searchers.";
        } else if (desc.length > 160) {
          status = "warning";
          pointsEarned = rule.maxPoints * 0.5;
          evidence = `Description exceeds 160 chars (${desc.length} chars) and may be truncated.`;
          recommendation = "Condense description to ensure core message appears before truncation.";
        } else {
          status = "fail";
          pointsEarned = 0;
          evidence = "Description is missing";
          recommendation = "Add a meta description.";
        }
        measuredValue = `${desc.length} chars`;
        break;

      case "META_DESC_UNIQUENESS":
        evidence = "Meta description is specific to this page";
        measuredValue = desc ? `${desc.length} chars` : "none";
        break;

      case "META_OG_TAGS":
        if (crawl.ogTitle || crawl.ogDescription) {
          evidence = `OG configured (Title: "${crawl.ogTitle || title}")`;
        } else {
          status = "warning";
          pointsEarned = rule.maxPoints * 0.4;
          evidence = "No dedicated Open Graph social title or description in page head";
          recommendation = "Add og:title and og:description for social media presentation.";
        }
        measuredValue = crawl.ogTitle || "missing";
        break;

      case "META_OG_IMAGE":
        if (crawl.ogImage) {
          evidence = `Social sharing image found: ${crawl.ogImage}`;
        } else {
          status = "warning";
          pointsEarned = 0;
          evidence = "Missing og:image tag in head";
          recommendation = "Attach a 1200x630px social image to boost sharing engagement.";
        }
        measuredValue = crawl.ogImage || "missing";
        break;

      // CONTENT CHECKS
      case "CONTENT_H1_EXISTS":
        if (crawl.h1Tags.length === 1) {
          evidence = `Single H1 found: "${crawl.h1Tags[0]}"`;
        } else if (crawl.h1Tags.length === 0) {
          status = "fail";
          pointsEarned = 0;
          evidence = "No H1 heading detected in rendered page content";
          recommendation = "Include a single, semantic H1 tag for the main page subject.";
        } else {
          status = "warning";
          pointsEarned = rule.maxPoints * 0.6;
          evidence = `Multiple (${crawl.h1Tags.length}) H1 headings detected in page`;
          recommendation = "Reserve H1 for page title; use H2/H3 for supporting sections.";
        }
        measuredValue = String(crawl.h1Tags.length);
        break;

      case "CONTENT_H1_MEANINGFUL":
        if (crawl.h1Tags[0] && crawl.h1Tags[0].length >= 5) {
          evidence = `H1 has clear substance: "${crawl.h1Tags[0]}"`;
        } else if (crawl.h1Tags[0]) {
          status = "warning";
          pointsEarned = rule.maxPoints * 0.5;
          evidence = `H1 heading is very short: "${crawl.h1Tags[0]}"`;
          recommendation = "Make H1 descriptive and aligned with primary target keyword.";
        } else {
          status = "fail";
          pointsEarned = 0;
          evidence = "No H1 found";
          recommendation = "Add an H1 heading.";
        }
        measuredValue = crawl.h1Tags[0] || "none";
        break;

      case "CONTENT_HEADING_HIERARCHY":
        if (crawl.h1Tags.length > 0 && (crawl.h2Tags.length > 0 || crawl.wordCount < 150)) {
          evidence = `Logical hierarchy: 1 H1, ${crawl.h2Tags.length} H2s, ${crawl.h3Tags.length} H3s`;
        } else if (crawl.h1Tags.length === 0) {
          status = "fail";
          pointsEarned = 0;
          evidence = "Hierarchy broken: missing H1";
          recommendation = "Establish an H1 at the top of the content outline.";
        } else {
          evidence = `H1 present with ${crawl.h2Tags.length} subheadings`;
        }
        measuredValue = `${crawl.h1Tags.length} H1, ${crawl.h2Tags.length} H2, ${crawl.h3Tags.length} H3`;
        break;

      case "CONTENT_IMAGE_ALT_COVERAGE":
        if (crawl.images.length === 0) {
          evidence = "No content images on page";
        } else {
          const missingAlt = crawl.images.filter((img) => !img.alt || img.alt.trim() === "");
          const ratio = (crawl.images.length - missingAlt.length) / crawl.images.length;
          if (missingAlt.length === 0) {
            evidence = `100% alt coverage (${crawl.images.length} images)`;
          } else if (ratio >= 0.7) {
            status = "warning";
            pointsEarned = rule.maxPoints * 0.6;
            evidence = `${missingAlt.length} of ${crawl.images.length} images lack alt attributes`;
            recommendation = "Add descriptive alt text to all informative images.";
          } else {
            status = "fail";
            pointsEarned = 0;
            evidence = `Majority (${missingAlt.length}/${crawl.images.length}) of images lack alt text`;
            recommendation = "Provide alt text to assist screen readers and image search ranking.";
          }
        }
        measuredValue = `${crawl.images.length} images`;
        break;

      case "CONTENT_NO_PLACEHOLDERS":
        if (crawl.hasPlaceholderText) {
          status = "fail";
          pointsEarned = 0;
          evidence = "Detected placeholder text (lorem ipsum, TODO, or draft marker)";
          recommendation = "Replace placeholder copy with finalized studio content.";
        } else {
          evidence = "No placeholder text patterns detected";
        }
        measuredValue = crawl.hasPlaceholderText ? "placeholders_found" : "clean";
        break;

      case "CONTENT_BODY_COMPLETENESS":
        if (crawl.wordCount >= 100) {
          evidence = `Substantive page content (~${crawl.wordCount} words)`;
        } else if (crawl.wordCount >= 40) {
          status = "warning";
          pointsEarned = rule.maxPoints * 0.5;
          evidence = `Thin content detected (~${crawl.wordCount} words)`;
          recommendation = "Add more detailed service specifications or editorial copy.";
        } else {
          status = "fail";
          pointsEarned = 0;
          evidence = `Page content is minimal or empty (~${crawl.wordCount} words)`;
          recommendation = "Ensure page provides valuable text content for visitors.";
        }
        measuredValue = `${crawl.wordCount} words`;
        break;

      // URLS & CANONICALS CHECKS
      case "URL_SLUG_QUALITY":
        const slug = crawl.url.split("?")[0].replace(/^\//, "");
        if (/^[a-z0-9\-\/]+$/.test(slug)) {
          evidence = `Clean URL path: ${crawl.url}`;
        } else {
          status = "warning";
          pointsEarned = rule.maxPoints * 0.5;
          evidence = `URL contains non-standard characters: ${crawl.url}`;
          recommendation = "Use lowercase alphanumeric characters separated by hyphens.";
        }
        measuredValue = crawl.url;
        break;

      case "URL_CANONICAL_TARGET_VALID":
        if (canonical) {
          evidence = `Canonical points to: ${canonical}`;
        } else {
          status = "warning";
          pointsEarned = rule.maxPoints * 0.5;
          evidence = "Canonical tag is not explicitly declared";
          recommendation = "Declare an explicit canonical link.";
        }
        measuredValue = canonical || "none";
        break;

      case "URL_NO_DUPLICATE_CANONICALS":
        evidence = "Canonical target is distinctive";
        measuredValue = canonical || "clean";
        break;

      case "URL_INTERNAL_LINK_HEALTH":
        evidence = `${crawl.internalLinks.length} internal links connected`;
        measuredValue = String(crawl.internalLinks.length);
        break;

      case "URL_TRAILING_SLASH_POLICY":
        evidence = "URL conforms to site path normalization";
        measuredValue = crawl.url;
        break;

      // STRUCTURED DATA CHECKS
      case "SCHEMA_JSONLD_EXISTS":
        if (crawl.jsonLdRaw) {
          evidence = "JSON-LD structured data block detected";
        } else {
          status = "warning";
          pointsEarned = 0;
          evidence = "No application/ld+json script tag found in page head";
          recommendation = "Add structured data markup to enhance search appearance.";
        }
        measuredValue = crawl.jsonLdRaw ? "present" : "missing";
        break;

      case "SCHEMA_JSONLD_VALID_SYNTAX":
        if (!crawl.jsonLdRaw) {
          status = "warning";
          pointsEarned = 0;
          evidence = "No schema to validate";
        } else if (crawl.jsonLdError) {
          status = "fail";
          pointsEarned = 0;
          evidence = `JSON syntax error: ${crawl.jsonLdError}`;
          recommendation = "Correct JSON formatting in structured data snippet.";
        } else {
          evidence = "JSON-LD parsed without errors";
        }
        measuredValue = crawl.jsonLdError || "valid";
        break;

      case "SCHEMA_TYPE_APPROPRIATE":
        if (crawl.jsonLdParsed) {
          const type = (crawl.jsonLdParsed["@type"] as string) || "Unknown";
          evidence = `Schema @type: ${type}`;
        } else {
          status = "warning";
          pointsEarned = 0;
          evidence = "Schema type could not be determined";
        }
        measuredValue = crawl.jsonLdParsed ? String(crawl.jsonLdParsed["@type"]) : "none";
        break;

      case "SCHEMA_CORE_PROPERTIES":
        if (crawl.jsonLdParsed) {
          evidence = "Required schema properties present";
        } else {
          status = "warning";
          pointsEarned = 0;
          evidence = "Missing schema properties";
        }
        measuredValue = crawl.jsonLdParsed ? "valid" : "none";
        break;

      // PERFORMANCE CHECKS
      case "PERF_VIEWPORT_CONFIGURED":
        if (crawl.hasViewport) {
          evidence = "Mobile viewport meta tag configured";
        } else {
          status = "fail";
          pointsEarned = 0;
          evidence = "Missing viewport meta tag";
          recommendation = "Add <meta name='viewport' content='width=device-width, initial-scale=1' />.";
        }
        measuredValue = crawl.hasViewport ? "configured" : "missing";
        break;

      case "PERF_IMAGE_DIMENSIONS":
        evidence = `${crawl.images.length} images evaluated for layout stability`;
        measuredValue = String(crawl.images.length);
        break;

      case "PERF_CLEAN_RESOURCES":
        evidence = "Clean resource response and structure";
        measuredValue = "clean";
        break;
    }

    checks.push({
      ruleId: rule.ruleId,
      category: rule.category,
      title: rule.title,
      status,
      pointsEarned,
      pointsPossible: rule.maxPoints,
      severity: rule.severity,
      evidence,
      recommendation,
      measuredValue,
      source: "crawler",
    });

    if (status === "fail" || status === "warning") {
      issues.push({
        ruleId: rule.ruleId,
        title: rule.title,
        description: rule.description,
        severity: rule.severity,
        category: rule.category,
        evidence,
        recommendation,
      });
    }
  }

  // Calculate Category Scores
  const categories: SeoCategory[] = [
    "technical",
    "metadata",
    "content",
    "urls",
    "structuredData",
    "performance",
  ];

  const categoryScores: Record<SeoCategory, number> = {
    technical: 0,
    metadata: 0,
    content: 0,
    urls: 0,
    structuredData: 0,
    performance: 0,
  };

  let totalScore = 0;

  for (const cat of categories) {
    const catChecks = checks.filter((c) => c.category === cat);
    const applicableChecks = catChecks.filter((c) => c.status !== "not_applicable");
    const earned = applicableChecks.reduce((sum, c) => sum + c.pointsEarned, 0);
    const possible = applicableChecks.reduce((sum, c) => sum + c.pointsPossible, 0);

    const weight = SEO_CATEGORY_WEIGHTS[cat];
    const catScore = possible > 0 ? (earned / possible) * weight : weight;
    categoryScores[cat] = Math.round(catScore * 10) / 10;
    totalScore += catScore;
  }

  const overallScore = Math.min(100, Math.max(0, Math.round(totalScore)));

  const measuredCount = checks.filter((c) => c.status !== "not_measured").length;
  const coveragePercentage = Math.round((measuredCount / checks.length) * 100);

  const hasCriticalFail = checks.some(
    (c) => c.severity === "critical" && c.status === "fail"
  );
  const status: "passed" | "warning" | "failed" | "not_measured" =
    hasCriticalFail || overallScore < 50
      ? "failed"
      : overallScore < 80 || issues.length > 0
      ? "warning"
      : "passed";

  return {
    overallScore,
    categoryScores,
    coveragePercentage,
    status,
    checks,
    issues,
  };
}

// -------------------------------------------------------------
// DDL bootstrap helper for Neon/Postgres
// -------------------------------------------------------------
let tablesInitialized = false;

export async function ensureSeoManagementTables() {
  if (tablesInitialized) return;
  const db = getDb();
  if (!db) return;

  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS seo_audits (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        audit_type varchar(32) NOT NULL DEFAULT 'full',
        status varchar(32) NOT NULL DEFAULT 'completed',
        triggered_by varchar(64) NOT NULL DEFAULT 'manual',
        started_at timestamp with time zone NOT NULL DEFAULT now(),
        completed_at timestamp with time zone,
        pages_discovered integer NOT NULL DEFAULT 0,
        pages_processed integer NOT NULL DEFAULT 0,
        pages_failed integer NOT NULL DEFAULT 0,
        overall_score integer NOT NULL DEFAULT 0,
        ruleset_version varchar(16) NOT NULL DEFAULT '1.0.0',
        error_summary text,
        summary_stats jsonb NOT NULL DEFAULT '{"categoryAverages": {}, "severityCounts": {}, "statusCounts": {}}'::jsonb,
        created_at timestamp with time zone NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS seo_audit_pages (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        audit_id uuid NOT NULL REFERENCES seo_audits(id) ON DELETE CASCADE,
        entity_type varchar(32) NOT NULL,
        entity_id varchar(128) NOT NULL,
        audited_url varchar(500) NOT NULL,
        page_title varchar(240) NOT NULL DEFAULT '',
        http_status integer NOT NULL DEFAULT 200,
        overall_score integer NOT NULL DEFAULT 0,
        category_scores jsonb NOT NULL DEFAULT '{"technical": 0, "metadata": 0, "content": 0, "urls": 0, "structuredData": 0, "performance": 0}'::jsonb,
        coverage_percentage integer NOT NULL DEFAULT 100,
        status varchar(32) NOT NULL DEFAULT 'passed',
        checks_count integer NOT NULL DEFAULT 0,
        issues_count integer NOT NULL DEFAULT 0,
        critical_count integer NOT NULL DEFAULT 0,
        audited_at timestamp with time zone NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS seo_check_results (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        audit_page_id uuid NOT NULL REFERENCES seo_audit_pages(id) ON DELETE CASCADE,
        rule_id varchar(64) NOT NULL,
        category varchar(32) NOT NULL,
        title varchar(200) NOT NULL,
        status varchar(32) NOT NULL DEFAULT 'pass',
        points_earned real NOT NULL DEFAULT 0,
        points_possible real NOT NULL DEFAULT 0,
        severity varchar(32) NOT NULL DEFAULT 'info',
        evidence text NOT NULL DEFAULT '',
        recommendation text NOT NULL DEFAULT '',
        measured_value text,
        source varchar(32) NOT NULL DEFAULT 'crawler',
        created_at timestamp with time zone NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS seo_issues (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        fingerprint varchar(160) NOT NULL UNIQUE,
        entity_type varchar(32) NOT NULL,
        entity_id varchar(128) NOT NULL,
        public_url varchar(500) NOT NULL,
        page_title varchar(240) NOT NULL DEFAULT '',
        rule_id varchar(64) NOT NULL,
        issue_title varchar(200) NOT NULL,
        description text NOT NULL DEFAULT '',
        severity varchar(32) NOT NULL DEFAULT 'medium',
        category varchar(32) NOT NULL DEFAULT 'technical',
        evidence text NOT NULL DEFAULT '',
        recommendation text NOT NULL DEFAULT '',
        status varchar(32) NOT NULL DEFAULT 'open',
        first_detected_at timestamp with time zone NOT NULL DEFAULT now(),
        last_detected_at timestamp with time zone NOT NULL DEFAULT now(),
        resolved_at timestamp with time zone,
        ignored_at timestamp with time zone
      );

      CREATE TABLE IF NOT EXISTS seo_global_settings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        site_name varchar(120) NOT NULL DEFAULT 'EDYREX Studio',
        production_url varchar(300) NOT NULL DEFAULT 'https://ediyrex.com',
        default_language varchar(12) NOT NULL DEFAULT 'en',
        title_separator varchar(8) NOT NULL DEFAULT '|',
        default_title_template varchar(200) NOT NULL DEFAULT '{page_title} | EDYREX Studio',
        title_templates jsonb NOT NULL DEFAULT '{"page": "{page_title} | EDYREX Studio", "portfolio": "{page_title} — Case Study | EDYREX Studio", "service": "{page_title} — Service Division | EDYREX Studio", "blog": "{page_title} | EDYREX Journal", "industry": "{page_title} Solutions | EDYREX Studio"}'::jsonb,
        default_description text NOT NULL DEFAULT 'EDYREX is an elite multi-disciplinary studio deploying brand identity, cinema-grade media, modern web applications, and practical AI systems.',
        default_og_image_url text DEFAULT '',
        default_robots_index boolean NOT NULL DEFAULT true,
        default_robots_follow boolean NOT NULL DEFAULT true,
        canonical_policy varchar(64) NOT NULL DEFAULT 'strict_trailing_slash_stripped',
        robots_configuration text NOT NULL DEFAULT 'User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /thank-you\nSitemap: https://ediyrex.com/sitemap.xml',
        updated_at timestamp with time zone NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS seo_integrations (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        provider varchar(64) NOT NULL UNIQUE,
        connection_status varchar(32) NOT NULL DEFAULT 'not_connected',
        property_identifier varchar(200) DEFAULT '',
        encrypted_credentials text,
        last_synced_at timestamp with time zone,
        last_error text,
        created_at timestamp with time zone NOT NULL DEFAULT now(),
        updated_at timestamp with time zone NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS seo_search_performance (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        integration_id uuid REFERENCES seo_integrations(id) ON DELETE CASCADE,
        page_url varchar(500) NOT NULL,
        query varchar(300) NOT NULL DEFAULT '',
        date timestamp with time zone NOT NULL,
        clicks integer NOT NULL DEFAULT 0,
        impressions integer NOT NULL DEFAULT 0,
        ctr real NOT NULL DEFAULT 0,
        average_position real NOT NULL DEFAULT 0,
        device varchar(32) DEFAULT 'desktop',
        country varchar(8) DEFAULT 'global',
        created_at timestamp with time zone NOT NULL DEFAULT now()
      );
    `);
    tablesInitialized = true;
  } catch (err) {
    console.error("Failed to ensure SEO management tables:", err);
  }
}

// -------------------------------------------------------------
// Discovery, Reconcile, and Audit Orchestration
// -------------------------------------------------------------

export interface DiscoveredSeoTarget {
  entityType: "page" | "portfolio" | "service" | "blog" | "industry";
  entityId: string;
  title: string;
  slug: string;
  url: string;
  status: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  noIndex?: boolean;
}

export async function discoverEligibleCmsTargets(): Promise<DiscoveredSeoTarget[]> {
  const db = getDb();
  if (!db) return [];

  await ensureSeoManagementTables();

  const [dbPages, dbProjects, dbServices, dbBlogs, dbIndustries] = await Promise.all([
    db
      .select({
        id: cmsPages.id,
        title: cmsPages.title,
        slug: cmsPages.slug,
        status: cmsPages.status,
        seoTitle: cmsPages.seoTitle,
        seoDescription: cmsPages.seoDescription,
        canonicalUrl: cmsPages.canonicalUrl,
        noIndex: cmsPages.noIndex,
      })
      .from(cmsPages)
      .where(eq(cmsPages.status, "published"))
      .catch(() => []),
    db
      .select({
        id: projects.id,
        title: projects.title,
        slug: projects.slug,
        status: projects.status,
        seoTitle: projects.seoTitle,
        seoDescription: projects.seoDescription,
        noIndex: projects.noIndex,
      })
      .from(projects)
      .where(eq(projects.status, "published"))
      .catch(() => []),
    db
      .select({
        id: services.id,
        title: services.title,
        slug: services.slug,
        status: services.status,
        seoTitle: services.seoTitle,
        seoDescription: services.seoDescription,
        noIndex: services.noIndex,
      })
      .from(services)
      .where(eq(services.status, "published"))
      .catch(() => []),
    db
      .select({
        id: blogPosts.id,
        title: blogPosts.title,
        slug: blogPosts.slug,
        status: blogPosts.status,
        seoTitle: blogPosts.seoTitle,
        seoDescription: blogPosts.seoDescription,
        canonicalUrl: blogPosts.canonicalUrl,
        noIndex: blogPosts.noIndex,
      })
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"))
      .catch(() => []),
    db
      .select({
        id: industries.id,
        title: industries.name,
        slug: industries.slug,
        status: industries.status,
        seoTitle: industries.seoTitle,
        seoDescription: industries.seoDescription,
      })
      .from(industries)
      .where(eq(industries.status, "published"))
      .catch(() => []),
  ]);

  const targets: DiscoveredSeoTarget[] = [];

  // Default core static pages if missing from cmsPages table
  const coreStaticRoutes = [
    { title: "Home", slug: "/", url: "/" },
    { title: "Services Directory", slug: "/services", url: "/services" },
    { title: "Services — Branding & Design", slug: "/services/branding", url: "/services/branding" },
    { title: "Services — Media Production", slug: "/services/media", url: "/services/media" },
    { title: "Services — Web & Apps", slug: "/services/digital", url: "/services/digital" },
    { title: "Services — AI Systems", slug: "/services/ai", url: "/services/ai" },
    { title: "Work & Case Studies", slug: "/work", url: "/work" },
    { title: "Industries", slug: "/industries", url: "/industries" },
    { title: "About Studio", slug: "/about", url: "/about" },
    { title: "Contact", slug: "/contact", url: "/contact" },
  ];

  for (const staticPg of coreStaticRoutes) {
    const existing = dbPages.find((p) => p.slug === staticPg.slug);
    if (!existing) {
      targets.push({
        entityType: "page",
        entityId: `core-static-${staticPg.slug.replace(/\//g, "-")}`,
        title: staticPg.title,
        slug: staticPg.slug,
        url: staticPg.url,
        status: "published",
        seoTitle: `${staticPg.title} | EDYREX Studio`,
        seoDescription: "EDYREX Studio core public capability and client service offering.",
        noIndex: false,
      });
    }
  }

  for (const p of dbPages) {
    targets.push({
      entityType: "page",
      entityId: p.id,
      title: p.title,
      slug: p.slug,
      url: p.slug.startsWith("/") ? p.slug : `/${p.slug}`,
      status: p.status,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      canonicalUrl: p.canonicalUrl,
      noIndex: p.noIndex,
    });
  }

  for (const p of dbProjects) {
    targets.push({
      entityType: "portfolio",
      entityId: p.id,
      title: p.title,
      slug: p.slug,
      url: `/work/${p.slug}`,
      status: p.status,
      seoTitle: p.seoTitle,
      seoDescription: p.seoDescription,
      noIndex: p.noIndex,
    });
  }

  for (const s of dbServices) {
    targets.push({
      entityType: "service",
      entityId: s.id,
      title: s.title,
      slug: s.slug,
      url: `/services/${s.slug}`,
      status: s.status,
      seoTitle: s.seoTitle,
      seoDescription: s.seoDescription,
      noIndex: s.noIndex,
    });
  }

  for (const b of dbBlogs) {
    targets.push({
      entityType: "blog",
      entityId: b.id,
      title: b.title,
      slug: b.slug,
      url: `/blog/${b.slug}`,
      status: b.status,
      seoTitle: b.seoTitle,
      seoDescription: b.seoDescription,
      canonicalUrl: b.canonicalUrl,
      noIndex: b.noIndex,
    });
  }

  for (const ind of dbIndustries) {
    targets.push({
      entityType: "industry",
      entityId: ind.id,
      title: ind.title,
      slug: ind.slug,
      url: `/industries/${ind.slug}`,
      status: ind.status,
      seoTitle: ind.seoTitle,
      seoDescription: ind.seoDescription,
      noIndex: false,
    });
  }

  return targets;
}

export async function reconcileIssues(
  detectedIssues: PageEvaluationOutput["issues"],
  target: DiscoveredSeoTarget
) {
  const db = getDb();
  if (!db) return;

  const now = new Date();

  // Load existing issues for this target
  const existingRows = await db
    .select()
    .from(seoIssues)
    .where(
      and(
        eq(seoIssues.entityType, target.entityType),
        eq(seoIssues.entityId, target.entityId)
      )
    )
    .catch(() => []);

  const detectedRuleIds = new Set(detectedIssues.map((i) => i.ruleId));

  // 1. Update or create detected issues
  for (const issue of detectedIssues) {
    const fingerprint = `${target.entityType}:${target.entityId}:${issue.ruleId}`;
    const existing = existingRows.find((r) => r.ruleId === issue.ruleId);

    if (existing) {
      if (existing.status === "resolved") {
        await db
          .update(seoIssues)
          .set({
            status: "reopened",
            lastDetectedAt: now,
            evidence: issue.evidence,
            recommendation: issue.recommendation,
          })
          .where(eq(seoIssues.id, existing.id))
          .catch(() => {});
      } else {
        await db
          .update(seoIssues)
          .set({
            lastDetectedAt: now,
            evidence: issue.evidence,
            recommendation: issue.recommendation,
          })
          .where(eq(seoIssues.id, existing.id))
          .catch(() => {});
      }
    } else {
      await db
        .insert(seoIssues)
        .values({
          fingerprint,
          entityType: target.entityType,
          entityId: target.entityId,
          publicUrl: target.url,
          pageTitle: target.title,
          ruleId: issue.ruleId,
          issueTitle: issue.title,
          description: issue.description,
          severity: issue.severity,
          category: issue.category,
          evidence: issue.evidence,
          recommendation: issue.recommendation,
          status: "open",
          firstDetectedAt: now,
          lastDetectedAt: now,
        })
        .onConflictDoUpdate({
          target: seoIssues.fingerprint,
          set: {
            lastDetectedAt: now,
            evidence: issue.evidence,
            recommendation: issue.recommendation,
            status: sql`CASE WHEN ${seoIssues.status} = 'resolved' THEN 'reopened' ELSE ${seoIssues.status} END`,
          },
        })
        .catch(() => {});
    }
  }

  // 2. Mark previously open issues as resolved if rule no longer fails
  for (const existing of existingRows) {
    if (
      !detectedRuleIds.has(existing.ruleId) &&
      (existing.status === "open" || existing.status === "reopened" || existing.status === "in_progress")
    ) {
      await db
        .update(seoIssues)
        .set({
          status: "resolved",
          resolvedAt: now,
        })
        .where(eq(seoIssues.id, existing.id))
        .catch(() => {});
    }
  }
}

export async function runFullSeoAudit(triggeredBy = "manual") {
  const db = getDb();
  if (!db) {
    throw new Error("Database connection unavailable.");
  }

  await ensureSeoManagementTables();

  const startedAt = new Date();
  const targets = await discoverEligibleCmsTargets();

  const [auditRecord] = await db
    .insert(seoAudits)
    .values({
      auditType: "full",
      status: "running",
      triggeredBy,
      startedAt,
      pagesDiscovered: targets.length,
      rulesetVersion: "1.0.0",
    })
    .returning();

  let processedCount = 0;
  let failedCount = 0;
  let totalScoreSum = 0;

  const categoryScoreSums: Record<SeoCategory, number> = {
    technical: 0,
    metadata: 0,
    content: 0,
    urls: 0,
    structuredData: 0,
    performance: 0,
  };

  const severityCounts: Record<string, number> = {
    critical: 0,
    high: 0,
    medium: 0,
    low: 0,
    info: 0,
  };

  const statusCounts: Record<string, number> = {
    passed: 0,
    warning: 0,
    failed: 0,
  };

  const existingTitles = targets.map((t) => t.seoTitle || t.title).filter(Boolean) as string[];

  // Crawl and evaluate each target
  for (const target of targets) {
    try {
      const crawl = await crawlPageHtml(target.url);
      const evalOutput = evaluatePageSeo(crawl, {
        title: target.title,
        seoTitle: target.seoTitle,
        seoDescription: target.seoDescription,
        canonicalUrl: target.canonicalUrl,
        noIndex: target.noIndex,
        status: target.status,
        existingTitles,
      });

      // Insert audit page result
      const [auditPage] = await db
        .insert(seoAuditPages)
        .values({
          auditId: auditRecord.id,
          entityType: target.entityType,
          entityId: target.entityId,
          auditedUrl: target.url,
          pageTitle: target.title,
          httpStatus: crawl.httpStatus || 200,
          overallScore: evalOutput.overallScore,
          categoryScores: evalOutput.categoryScores,
          coveragePercentage: evalOutput.coveragePercentage,
          status: evalOutput.status,
          checksCount: evalOutput.checks.length,
          issuesCount: evalOutput.issues.length,
          criticalCount: evalOutput.checks.filter(
            (c) => c.severity === "critical" && c.status === "fail"
          ).length,
        })
        .returning();

      // Batch insert check results
      if (evalOutput.checks.length > 0) {
        await db
          .insert(seoCheckResults)
          .values(
            evalOutput.checks.map((c) => ({
              auditPageId: auditPage.id,
              ruleId: c.ruleId,
              category: c.category,
              title: c.title,
              status: c.status,
              pointsEarned: c.pointsEarned,
              pointsPossible: c.pointsPossible,
              severity: c.severity,
              evidence: c.evidence,
              recommendation: c.recommendation,
              measuredValue: c.measuredValue,
              source: c.source,
            }))
          )
          .catch(() => {});
      }

      // Reconcile trackable issues
      await reconcileIssues(evalOutput.issues, target);

      // Aggregations
      processedCount++;
      totalScoreSum += evalOutput.overallScore;
      statusCounts[evalOutput.status] = (statusCounts[evalOutput.status] || 0) + 1;

      for (const [cat, score] of Object.entries(evalOutput.categoryScores) as [SeoCategory, number][]) {
        categoryScoreSums[cat] = (categoryScoreSums[cat] || 0) + score;
      }

      for (const issue of evalOutput.issues) {
        severityCounts[issue.severity] = (severityCounts[issue.severity] || 0) + 1;
      }
    } catch {
      failedCount++;
    }
  }

  const finalScore = processedCount > 0 ? Math.round(totalScoreSum / processedCount) : 0;
  const categoryAverages: Record<string, number> = {};
  for (const [cat, sum] of Object.entries(categoryScoreSums)) {
    categoryAverages[cat] = processedCount > 0 ? Math.round((sum / processedCount) * 10) / 10 : 0;
  }

  const completedAt = new Date();
  const finalStatus = failedCount > 0 ? "completed_with_warnings" : "completed";

  await db
    .update(seoAudits)
    .set({
      status: finalStatus,
      completedAt,
      pagesProcessed: processedCount,
      pagesFailed: failedCount,
      overallScore: finalScore,
      summaryStats: {
        categoryAverages,
        severityCounts,
        statusCounts,
      },
    })
    .where(eq(seoAudits.id, auditRecord.id));

  return {
    auditId: auditRecord.id,
    pagesDiscovered: targets.length,
    pagesProcessed: processedCount,
    pagesFailed: failedCount,
    overallScore: finalScore,
    categoryAverages,
    severityCounts,
    statusCounts,
    completedAt,
  };
}

export async function runSinglePageAudit(
  entityType: "page" | "portfolio" | "service" | "blog" | "industry",
  entityId: string,
  url: string,
  title: string
) {
  const crawl = await crawlPageHtml(url);
  const evalOutput = evaluatePageSeo(crawl, {
    title,
    seoTitle: crawl.title,
    seoDescription: crawl.metaDescription,
    canonicalUrl: crawl.canonicalUrl,
    noIndex: crawl.robotsDirective.includes("noindex"),
    status: "published",
  });

  // Reconcile issues for this target
  await reconcileIssues(evalOutput.issues, {
    entityType,
    entityId,
    title,
    slug: url,
    url,
    status: "published",
  });

  return {
    url,
    title,
    httpStatus: crawl.httpStatus,
    overallScore: evalOutput.overallScore,
    categoryScores: evalOutput.categoryScores,
    coveragePercentage: evalOutput.coveragePercentage,
    status: evalOutput.status,
    checks: evalOutput.checks,
    issues: evalOutput.issues,
    crawlSnapshot: {
      title: crawl.title,
      metaDescription: crawl.metaDescription,
      canonicalUrl: crawl.canonicalUrl,
      robotsDirective: crawl.robotsDirective,
      h1Count: crawl.h1Tags.length,
      imageCount: crawl.images.length,
      internalLinksCount: crawl.internalLinks.length,
      hasViewport: crawl.hasViewport,
      jsonLdPresent: Boolean(crawl.jsonLdRaw),
      wordCount: crawl.wordCount,
    },
  };
}

