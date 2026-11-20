import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  real,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const seoAudits = pgTable(
  "seo_audits",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    auditType: varchar("audit_type", { length: 32 }).notNull().default("full"),
    status: varchar("status", { length: 32 }).notNull().default("completed"),
    triggeredBy: varchar("triggered_by", { length: 64 }).notNull().default("manual"),
    startedAt: timestamp("started_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    completedAt: timestamp("completed_at", { withTimezone: true, mode: "date" }),
    pagesDiscovered: integer("pages_discovered").notNull().default(0),
    pagesProcessed: integer("pages_processed").notNull().default(0),
    pagesFailed: integer("pages_failed").notNull().default(0),
    overallScore: integer("overall_score").notNull().default(0),
    rulesetVersion: varchar("ruleset_version", { length: 16 }).notNull().default("1.0.0"),
    errorSummary: text("error_summary"),
    summaryStats: jsonb("summary_stats")
      .$type<{
        categoryAverages: Record<string, number>;
        severityCounts: Record<string, number>;
        statusCounts: Record<string, number>;
      }>()
      .notNull()
      .default({
        categoryAverages: {},
        severityCounts: {},
        statusCounts: {},
      }),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    check(
      "chk_seo_audit_status",
      sql`${table.status} IN ('queued', 'running', 'completed', 'completed_with_warnings', 'failed', 'cancelled')`
    ),
    index("idx_seo_audits_created_at").on(table.createdAt),
  ]
);

export const seoAuditPages = pgTable(
  "seo_audit_pages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    auditId: uuid("audit_id")
      .notNull()
      .references(() => seoAudits.id, { onDelete: "cascade" }),
    entityType: varchar("entity_type", { length: 32 }).notNull(),
    entityId: varchar("entity_id", { length: 128 }).notNull(),
    auditedUrl: varchar("audited_url", { length: 500 }).notNull(),
    pageTitle: varchar("page_title", { length: 240 }).notNull().default(""),
    httpStatus: integer("http_status").notNull().default(200),
    overallScore: integer("overall_score").notNull().default(0),
    categoryScores: jsonb("category_scores")
      .$type<{
        technical: number;
        metadata: number;
        content: number;
        urls: number;
        structuredData: number;
        performance: number;
      }>()
      .notNull()
      .default({
        technical: 0,
        metadata: 0,
        content: 0,
        urls: 0,
        structuredData: 0,
        performance: 0,
      }),
    coveragePercentage: integer("coverage_percentage").notNull().default(100),
    status: varchar("status", { length: 32 }).notNull().default("passed"),
    checksCount: integer("checks_count").notNull().default(0),
    issuesCount: integer("issues_count").notNull().default(0),
    criticalCount: integer("critical_count").notNull().default(0),
    auditedAt: timestamp("audited_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_seo_audit_pages_audit_id").on(table.auditId),
    index("idx_seo_audit_pages_entity").on(table.entityType, table.entityId),
  ]
);

export const seoCheckResults = pgTable(
  "seo_check_results",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    auditPageId: uuid("audit_page_id")
      .notNull()
      .references(() => seoAuditPages.id, { onDelete: "cascade" }),
    ruleId: varchar("rule_id", { length: 64 }).notNull(),
    category: varchar("category", { length: 32 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    status: varchar("status", { length: 32 }).notNull().default("pass"),
    pointsEarned: real("points_earned").notNull().default(0),
    pointsPossible: real("points_possible").notNull().default(0),
    severity: varchar("severity", { length: 32 }).notNull().default("info"),
    evidence: text("evidence").notNull().default(""),
    recommendation: text("recommendation").notNull().default(""),
    measuredValue: text("measured_value"),
    source: varchar("source", { length: 32 }).notNull().default("crawler"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_seo_check_results_page").on(table.auditPageId),
    index("idx_seo_check_results_rule").on(table.ruleId),
  ]
);

export const seoIssues = pgTable(
  "seo_issues",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fingerprint: varchar("fingerprint", { length: 160 }).notNull().unique(),
    entityType: varchar("entity_type", { length: 32 }).notNull(),
    entityId: varchar("entity_id", { length: 128 }).notNull(),
    publicUrl: varchar("public_url", { length: 500 }).notNull(),
    pageTitle: varchar("page_title", { length: 240 }).notNull().default(""),
    ruleId: varchar("rule_id", { length: 64 }).notNull(),
    issueTitle: varchar("issue_title", { length: 200 }).notNull(),
    description: text("description").notNull().default(""),
    severity: varchar("severity", { length: 32 }).notNull().default("medium"),
    category: varchar("category", { length: 32 }).notNull().default("technical"),
    evidence: text("evidence").notNull().default(""),
    recommendation: text("recommendation").notNull().default(""),
    status: varchar("status", { length: 32 }).notNull().default("open"),
    firstDetectedAt: timestamp("first_detected_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    lastDetectedAt: timestamp("last_detected_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
    resolvedAt: timestamp("resolved_at", { withTimezone: true, mode: "date" }),
    ignoredAt: timestamp("ignored_at", { withTimezone: true, mode: "date" }),
  },
  (table) => [
    check(
      "chk_seo_issues_severity",
      sql`${table.severity} IN ('critical', 'high', 'medium', 'low', 'info')`
    ),
    check(
      "chk_seo_issues_status",
      sql`${table.status} IN ('open', 'in_progress', 'resolved', 'ignored', 'reopened')`
    ),
    index("idx_seo_issues_status_severity").on(table.status, table.severity),
    index("idx_seo_issues_entity").on(table.entityType, table.entityId),
  ]
);

export const seoGlobalSettings = pgTable("seo_global_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  siteName: varchar("site_name", { length: 120 }).notNull().default("EDYREX Studio"),
  productionUrl: varchar("production_url", { length: 300 }).notNull().default("https://ediyrex.com"),
  defaultLanguage: varchar("default_language", { length: 12 }).notNull().default("en"),
  titleSeparator: varchar("title_separator", { length: 8 }).notNull().default("|"),
  defaultTitleTemplate: varchar("default_title_template", { length: 200 })
    .notNull()
    .default("{page_title} | EDYREX Studio"),
  titleTemplates: jsonb("title_templates")
    .$type<{
      page: string;
      portfolio: string;
      service: string;
      blog: string;
      industry: string;
    }>()
    .notNull()
    .default({
      page: "{page_title} | EDYREX Studio",
      portfolio: "{page_title} — Case Study | EDYREX Studio",
      service: "{page_title} — Service Division | EDYREX Studio",
      blog: "{page_title} | EDYREX Journal",
      industry: "{page_title} Solutions | EDYREX Studio",
    }),
  defaultDescription: text("default_description")
    .notNull()
    .default(
      "EDYREX is an elite multi-disciplinary studio deploying brand identity, cinema-grade media, modern web applications, and practical AI systems."
    ),
  defaultOgImageUrl: text("default_og_image_url").default(""),
  defaultRobotsIndex: boolean("default_robots_index").notNull().default(true),
  defaultRobotsFollow: boolean("default_robots_follow").notNull().default(true),
  canonicalPolicy: varchar("canonical_policy", { length: 64 })
    .notNull()
    .default("strict_trailing_slash_stripped"),
  robotsConfiguration: text("robots_configuration")
    .notNull()
    .default(
      "User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /api/\nDisallow: /thank-you\nSitemap: https://ediyrex.com/sitemap.xml"
    ),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const seoIntegrations = pgTable("seo_integrations", {
  id: uuid("id").defaultRandom().primaryKey(),
  provider: varchar("provider", { length: 64 }).notNull().unique(),
  connectionStatus: varchar("connection_status", { length: 32 })
    .notNull()
    .default("not_connected"),
  propertyIdentifier: varchar("property_identifier", { length: 200 }).default(""),
  encryptedCredentials: text("encrypted_credentials"),
  lastSyncedAt: timestamp("last_synced_at", { withTimezone: true, mode: "date" }),
  lastError: text("last_error"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

export const seoSearchPerformance = pgTable(
  "seo_search_performance",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    integrationId: uuid("integration_id").references(() => seoIntegrations.id, {
      onDelete: "cascade",
    }),
    pageUrl: varchar("page_url", { length: 500 }).notNull(),
    query: varchar("query", { length: 300 }).notNull().default(""),
    date: timestamp("date", { withTimezone: true, mode: "date" }).notNull(),
    clicks: integer("clicks").notNull().default(0),
    impressions: integer("impressions").notNull().default(0),
    ctr: real("ctr").notNull().default(0),
    averagePosition: real("average_position").notNull().default(0),
    device: varchar("device", { length: 32 }).default("desktop"),
    country: varchar("country", { length: 8 }).default("global"),
    createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("idx_seo_perf_date").on(table.date),
    index("idx_seo_perf_page").on(table.pageUrl),
  ]
);
