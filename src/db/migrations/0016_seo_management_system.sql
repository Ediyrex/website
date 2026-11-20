-- Migration: 0016_seo_management_system.sql
-- Description: SEO & Metadata Management System schema for EDYREX Studio Admin

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

CREATE INDEX IF NOT EXISTS idx_seo_audits_created_at ON seo_audits (created_at);

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

CREATE INDEX IF NOT EXISTS idx_seo_audit_pages_audit_id ON seo_audit_pages (audit_id);
CREATE INDEX IF NOT EXISTS idx_seo_audit_pages_entity ON seo_audit_pages (entity_type, entity_id);

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

CREATE INDEX IF NOT EXISTS idx_seo_check_results_page ON seo_check_results (audit_page_id);
CREATE INDEX IF NOT EXISTS idx_seo_check_results_rule ON seo_check_results (rule_id);

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

CREATE INDEX IF NOT EXISTS idx_seo_issues_status_severity ON seo_issues (status, severity);
CREATE INDEX IF NOT EXISTS idx_seo_issues_entity ON seo_issues (entity_type, entity_id);

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

CREATE INDEX IF NOT EXISTS idx_seo_perf_date ON seo_search_performance (date);
CREATE INDEX IF NOT EXISTS idx_seo_perf_page ON seo_search_performance (page_url);
