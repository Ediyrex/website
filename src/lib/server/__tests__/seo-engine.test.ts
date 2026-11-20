import { describe, it, expect } from "vitest";
import {
  evaluatePageSeo,
  SEO_CATEGORY_WEIGHTS,
  SEO_RULES,
  PageCrawlResult,
} from "../seo-engine";

describe("SEO Scoring Engine", () => {
  it("category weights sum to exactly 100", () => {
    const total = Object.values(SEO_CATEGORY_WEIGHTS).reduce(
      (sum, w) => sum + w,
      0
    );
    expect(total).toBe(100);
    expect(SEO_CATEGORY_WEIGHTS.technical).toBe(25);
    expect(SEO_CATEGORY_WEIGHTS.metadata).toBe(20);
    expect(SEO_CATEGORY_WEIGHTS.content).toBe(20);
    expect(SEO_CATEGORY_WEIGHTS.urls).toBe(15);
    expect(SEO_CATEGORY_WEIGHTS.structuredData).toBe(10);
    expect(SEO_CATEGORY_WEIGHTS.performance).toBe(10);
  });

  it("defines all 28 deterministic rules across categories", () => {
    expect(SEO_RULES.length).toBeGreaterThanOrEqual(28);
    for (const rule of SEO_RULES) {
      expect(rule.ruleId).toBeDefined();
      expect(rule.category).toBeDefined();
      expect(rule.maxPoints).toBeGreaterThan(0);
      expect(rule.severity).toBeDefined();
    }
  });

  it("calculates a high score (> 90) for an optimized page", () => {
    const mockCrawl: PageCrawlResult = {
      url: "https://ediyrex.com/services/branding",
      httpStatus: 200,
      html: "<html>...</html>",
      fetchError: null,
      title: "Strategic Branding & Visual Identity Studio | EDYREX",
      metaDescription:
        "High-caliber brand identity, design systems, and art direction for visionary brands. Discover our comprehensive brand development process.",
      canonicalUrl: "https://ediyrex.com/services/branding",
      robotsDirective: "index, follow",
      ogTitle: "Strategic Branding & Visual Identity Studio | EDYREX",
      ogDescription:
        "High-caliber brand identity, design systems, and art direction for visionary brands.",
      ogImage: "https://ediyrex.com/images/branding-og.jpg",
      h1Tags: ["Strategic Branding & Visual Systems"],
      h2Tags: ["Our Core Methodology", "Disciplines & Deliverables"],
      h3Tags: ["Identity Foundations", "Design Systems"],
      images: [
        {
          src: "/images/branding-hero.jpg",
          alt: "Branding system layout showcase",
          hasDimensions: true,
        },
      ],
      internalLinks: ["/work", "/services", "/contact"],
      wordCount: 820,
      hasViewport: true,
      hasPlaceholderText: false,
      jsonLdRaw: '{"@context":"https://schema.org","@type":"Service"}',
      jsonLdParsed: {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Branding & Visual Identity",
      },
      jsonLdError: null,
    };

    const evaluation = evaluatePageSeo(mockCrawl, {
      title: "Branding & Visual Identity",
      seoTitle: "Strategic Branding & Visual Identity Studio | EDYREX",
      seoDescription:
        "High-caliber brand identity, design systems, and art direction for visionary brands. Discover our comprehensive brand development process.",
      canonicalUrl: "/services/branding",
      noIndex: false,
      status: "published",
    });

    expect(evaluation.overallScore).toBeGreaterThanOrEqual(90);
    expect(evaluation.categoryScores.technical).toBeGreaterThanOrEqual(23);
    expect(evaluation.categoryScores.metadata).toBeGreaterThanOrEqual(18);
    expect(evaluation.categoryScores.content).toBeGreaterThanOrEqual(18);
    expect(evaluation.issues.filter((i) => i.severity === "critical")).toHaveLength(0);
  });

  it("detects critical issues and lowers score for a problematic page", () => {
    const mockCrawl: PageCrawlResult = {
      url: "https://ediyrex.com/services/bad-page",
      httpStatus: 500,
      html: "",
      fetchError: "Server Error 500",
      title: "",
      metaDescription: "",
      canonicalUrl: "",
      robotsDirective: "noindex, nofollow",
      ogTitle: "",
      ogDescription: "",
      ogImage: "",
      h1Tags: [], // missing H1
      h2Tags: [],
      h3Tags: [],
      images: [
        {
          src: "/images/unnamed.jpg",
          alt: "", // missing alt
          hasDimensions: false,
        },
      ],
      internalLinks: [],
      wordCount: 45,
      hasViewport: false,
      hasPlaceholderText: true, // lorem ipsum
      jsonLdRaw: "{ broken json }",
      jsonLdParsed: null,
      jsonLdError: "Invalid JSON-LD syntax",
    };

    const evaluation = evaluatePageSeo(mockCrawl, {
      title: "Broken Page",
      status: "published",
      noIndex: false,
    });

    expect(evaluation.overallScore).toBeLessThan(50);
    expect(evaluation.issues.length).toBeGreaterThan(5);

    const ruleIds = evaluation.issues.map((i) => i.ruleId);
    expect(ruleIds).toContain("TECH_HTTP_STATUS");
    expect(ruleIds).toContain("META_TITLE_EXISTS");
    expect(ruleIds).toContain("META_DESC_EXISTS");
    expect(ruleIds).toContain("CONTENT_H1_EXISTS");
    expect(ruleIds).toContain("CONTENT_IMAGE_ALT_COVERAGE");
    expect(ruleIds).toContain("CONTENT_NO_PLACEHOLDERS");
  });
});
