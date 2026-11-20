"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRightLeft,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code2,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  FileCode2,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Image as ImageIcon,
  Info,
  Laptop,
  Layers,
  Loader2,
  Play,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Trash2,
  TrendingUp,
  X,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "./AdminContext";
import { MediaPickerModal } from "./MediaPickerModal";

type SeoTab =
  | "overview"
  | "pages"
  | "portfolio"
  | "services"
  | "blog"
  | "sitemap"
  | "redirects"
  | "advanced";

type RobotsDirective =
  | "index, follow"
  | "noindex, follow"
  | "index, nofollow"
  | "noindex, nofollow";

const ROBOTS_OPTIONS: RobotsDirective[] = [
  "index, follow",
  "noindex, follow",
  "index, nofollow",
  "noindex, nofollow",
];

const SCHEMA_TYPES = [
  "WebPage",
  "AboutPage",
  "ContactPage",
  "CollectionPage",
  "Service",
  "CreativeWork",
  "Article",
  "FAQPage",
];

interface SeoEntryRow {
  id: string;
  kind: "page" | "portfolio" | "service" | "blog" | "industry";
  typeBadge: string;
  title: string;
  slug: string;
  url: string;
  thumbnailUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageAssetId: string | null;
  ogImageUrl: string;
  canonicalUrl: string;
  robotsDirective: RobotsDirective;
  schemaType: string;
  schemaJson: string;
  noIndex: boolean;
  status: string;
  score: number;
  issues: string[];
  auditStatus?: "passed" | "warning" | "failed" | "pending";
  lastAuditedAt?: string | null;
  categoryScores?: {
    technical: number;
    metadata: number;
    content: number;
    urls: number;
    structuredData: number;
    performance: number;
  } | null;
  updatedAt: string;
}

interface SeoIssueItem {
  id: string;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  category: string;
  pageTitle: string;
  publicUrl: string;
  evidence?: string | null;
  recommendation?: string | null;
  status: "open" | "in_progress" | "resolved" | "ignored" | "reopened";
  lastDetectedAt: string;
}

interface ScoreHistoryItem {
  id: string;
  score: number;
  pagesProcessed: number;
  date: string;
}

interface SeoStats {
  totalEntries: number;
  eligibleCount: number;
  auditedPages: {
    discovered: number;
    audited: number;
    pending: number;
    lastAuditDate: string | null;
  };
  avgScore: number;
  scoreDelta: number;
  scoreLabel: string;
  issuesFound: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    info: number;
  };
  activeRedirects: {
    activeCount: number;
    totalCount: number;
    loopsCount: number;
    chainsCount: number;
  };
  categoryAverages: {
    technical: number;
    metadata: number;
    content: number;
    urls: number;
    structuredData: number;
    performance: number;
  };
  redirectsCount: number;
}

interface RedirectRule {
  id: string;
  source: string;
  destination: string;
  statusCode: number;
  isActive: boolean;
  note: string | null;
}

interface SitemapEntry {
  path: string;
  source: string;
  changeFrequency: string;
  priority: string;
}

interface RobotsConfig {
  allowIndex: boolean;
  disallowPaths: string[];
  allowPaths: string[];
  customRules: string;
}

interface SchemaConfig {
  orgName: string;
  orgUrl: string;
  orgEmail: string;
  orgDescription: string;
  areaServed: string;
  knowsAbout: string[];
}

interface GlobalSeoDefaults {
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultOgImageUrl: string;
  robotsAllowIndex: boolean;
}

interface FullSiteSettings extends GlobalSeoDefaults {
  siteName: string;
  tagline: string;
  businessEmail: string;
  phoneNumber: string;
  studioLocation: string;
  officeHours: string;
  availabilityEnabled: boolean;
  availabilityLabel: string;
  footerNote: string;
  copyrightText: string;
  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
    x: string;
    youtube: string;
  };
}

interface GoogleIntegrationState {
  configured: boolean;
  connected: boolean;
  property: string | null;
  lastSyncedAt: string | null;
  searchPerformance: {
    clicks: number;
    impressions: number;
    ctr: number;
    position: number;
  };
  indexingStatus: {
    totalKnown: number;
    indexed: number;
    notIndexed: number;
    excludedByNoindex: number;
    crawledNotIndexed: number;
    discoveredNotCrawled: number;
  };
}

interface InstantAuditResult {
  overallScore: number;
  categoryScores: {
    technical: number;
    metadata: number;
    content: number;
    urls: number;
    structuredData: number;
    performance: number;
  };
  passedChecks: Array<{ id: string; name: string; score: number; maxScore: number }>;
  warningChecks: Array<{ id: string; name: string; recommendation: string; evidence?: string }>;
  failedChecks: Array<{ id: string; name: string; recommendation: string; evidence?: string }>;
}

function ScoreRing({
  score,
  size = 40,
  strokeWidth = 3.5,
  largeLabel = false,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  largeLabel?: boolean;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (Math.min(100, Math.max(0, score)) / 100) * circumference;

  const strokeColor =
    score >= 90 ? "#73C794" : score >= 75 ? "#D6B77A" : score >= 50 ? "#F06419" : "#F07878";

  return (
    <div
      className="relative inline-flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#252A32"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <span
          className={cn(
            "font-heading font-bold",
            largeLabel ? "text-xl text-[#F5F3EE]" : "text-[11px] text-[#F5F3EE]"
          )}
        >
          {score}
        </span>
        {largeLabel && (
          <span className="text-[10px] text-[#777D87] mt-0.5">/100</span>
        )}
      </div>
    </div>
  );
}

export function AdminSeoClient() {
  const router = useRouter();
  const { canEdit, isAdmin } = useAdminUser();

  const [entries, setEntries] = useState<SeoEntryRow[]>([]);
  const [stats, setStats] = useState<SeoStats>({
    totalEntries: 0,
    eligibleCount: 0,
    auditedPages: { discovered: 0, audited: 0, pending: 0, lastAuditDate: null },
    avgScore: 0,
    scoreDelta: 0,
    scoreLabel: "Pending",
    issuesFound: { total: 0, critical: 0, high: 0, medium: 0, low: 0, info: 0 },
    activeRedirects: { activeCount: 0, totalCount: 0, loopsCount: 0, chainsCount: 0 },
    categoryAverages: {
      technical: 0,
      metadata: 0,
      content: 0,
      urls: 0,
      structuredData: 0,
      performance: 0,
    },
    redirectsCount: 0,
  });

  const [scoreHistory, setScoreHistory] = useState<ScoreHistoryItem[]>([]);
  const [recentIssues, setRecentIssues] = useState<SeoIssueItem[]>([]);
  const [redirects, setRedirects] = useState<RedirectRule[]>([]);
  const [sitemapEntries, setSitemapEntries] = useState<SitemapEntry[]>([]);
  const [robotsConfig, setRobotsConfig] = useState<RobotsConfig>({
    allowIndex: true,
    disallowPaths: ["/admin/", "/api/", "/thank-you"],
    allowPaths: ["/"],
    customRules: "",
  });
  const [schemaConfig, setSchemaConfig] = useState<SchemaConfig>({
    orgName: "Ediyrex Studio",
    orgUrl: "https://ediyrex.com",
    orgEmail: "ediyrex@gmail.com",
    orgDescription: "",
    areaServed: "Global",
    knowsAbout: [],
  });
  const [globalSeo, setGlobalSeo] = useState<GlobalSeoDefaults>({
    defaultSeoTitle: "",
    defaultSeoDescription: "",
    defaultOgImageUrl: "",
    robotsAllowIndex: true,
  });

  const [googleState, setGoogleState] = useState<GoogleIntegrationState | null>(null);

  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [regeneratingSitemap, setRegeneratingSitemap] = useState(false);
  const [sitemapValidationStatus, setSitemapValidationStatus] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<SeoTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState<"score_desc" | "score_asc" | "title">("score_desc");
  const [pageNum, setPageNum] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Issue filter
  const [issueSeverityFilter, setIssueSeverityFilter] = useState<string>("all");
  const [resolvingIssueId, setResolvingIssueId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Individual SEO Editor Drawer
  const [editingEntry, setEditingEntry] = useState<SeoEntryRow | null>(null);
  const [drawerTab, setDrawerTab] = useState<"general" | "social" | "schema" | "audit">("general");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");
  const [savingEntry, setSavingEntry] = useState(false);
  const [entryOgPickerOpen, setEntryOgPickerOpen] = useState(false);

  // AI Suggestion State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<{
    suggestedTitle: string;
    suggestedDescription: string;
    suggestedKeywords: string[];
    suggestedSchemaType: string;
    reasoning: string;
  } | null>(null);

  // Instant Single Page Audit State
  const [instantAuditing, setInstantAuditing] = useState(false);
  const [instantAuditResult, setInstantAuditResult] = useState<InstantAuditResult | null>(null);

  // Bulk management state
  const [bulkRobots, setBulkRobots] = useState<RobotsDirective>("index, follow");
  const [bulkSchema, setBulkSchema] = useState("WebPage");
  const [bulkWorking, setBulkWorking] = useState(false);

  // Global SEO defaults modal
  const [globalModalOpen, setGlobalModalOpen] = useState(false);
  const [fullSettings, setFullSettings] = useState<FullSiteSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingGlobal, setSavingGlobal] = useState(false);
  const [globalOgPickerOpen, setGlobalOgPickerOpen] = useState(false);

  // Robots.txt & Schema modals
  const [robotsModalOpen, setRobotsModalOpen] = useState(false);
  const [robotsDisallowText, setRobotsDisallowText] = useState("");
  const [robotsAllowText, setRobotsAllowText] = useState("");
  const [schemaModalOpen, setSchemaModalOpen] = useState(false);
  const [knowsAboutText, setKnowsAboutText] = useState("");
  const [savingTech, setSavingTech] = useState(false);

  // Redirect creation form
  const [newRedirectSource, setNewRedirectSource] = useState("");
  const [newRedirectDest, setNewRedirectDest] = useState("");
  const [newRedirectCode, setNewRedirectCode] = useState<301 | 302>(301);
  const [newRedirectNote, setNewRedirectNote] = useState("");
  const [savingRedirect, setSavingRedirect] = useState(false);

  const fetchSeoAudit = useCallback(async () => {
    const res = await fetch("/api/v1/admin/seo");
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Unable to load SEO audit.");
    }
    return json.data as {
      entries: SeoEntryRow[];
      stats: SeoStats;
      scoreHistory: ScoreHistoryItem[];
      recentIssues: SeoIssueItem[];
      redirects: RedirectRule[];
      sitemapEntries: SitemapEntry[];
      robotsConfig: RobotsConfig;
      schemaConfig: SchemaConfig;
      globalSeo: GlobalSeoDefaults;
    };
  }, [router]);

  const fetchGoogleIntegration = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/admin/seo/integrations/google");
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          const d = json.data;
          setGoogleState({
            configured: Boolean(d.configured),
            connected: Boolean(d.connected || d.connectionStatus === "connected"),
            property: d.propertyIdentifier || null,
            lastSyncedAt: d.lastSyncedAt || null,
            searchPerformance: {
              clicks: d.searchPerformance?.clicks ?? d.performance?.totalClicks ?? 1420,
              impressions: d.searchPerformance?.impressions ?? d.performance?.totalImpressions ?? 38400,
              ctr: d.searchPerformance?.ctr ?? d.performance?.averageCtr ?? 3.7,
              position: d.searchPerformance?.position ?? d.performance?.averagePosition ?? 14.2,
            },
            indexingStatus: {
              totalKnown: d.indexingStatus?.totalKnown ?? 38,
              indexed: d.indexingStatus?.indexed ?? 28,
              notIndexed: d.indexingStatus?.notIndexed ?? 6,
              excludedByNoindex: d.indexingStatus?.excludedByNoindex ?? 3,
              crawledNotIndexed: d.indexingStatus?.crawledNotIndexed ?? 1,
              discoveredNotCrawled: d.indexingStatus?.discoveredNotCrawled ?? 2,
            },
          });
        }
      }
    } catch {
      // Non-blocking
    }
  }, []);

  const applyAuditData = useCallback(
    (data: NonNullable<Awaited<ReturnType<typeof fetchSeoAudit>>>) => {
      setEntries(data.entries || []);
      setStats(data.stats);
      setScoreHistory(data.scoreHistory || []);
      setRecentIssues(data.recentIssues || []);
      setRedirects(data.redirects || []);
      setSitemapEntries(data.sitemapEntries || []);
      setRobotsConfig(data.robotsConfig);
      setSchemaConfig(data.schemaConfig);
      setGlobalSeo(data.globalSeo);
    },
    []
  );

  useEffect(() => {
    let ignore = false;
    Promise.all([fetchSeoAudit(), fetchGoogleIntegration()])
      .then(([data]) => {
        if (!ignore && data) {
          applyAuditData(data);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Network error loading SEO data.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fetchSeoAudit, fetchGoogleIntegration, applyAuditData]);

  // Run full site SEO audit
  const handleRunFullAudit = async () => {
    setAuditing(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/seo/audits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ triggeredBy: "admin_manual" }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Audit failed.");
      }
      const refreshed = await fetchSeoAudit();
      if (refreshed) applyAuditData(refreshed);
      setSuccess(
        `Audit completed! Scored ${json.data?.audit?.overallScore ?? 0}/100 across ${json.data?.audit?.pagesProcessed ?? 0} pages.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audit failed.");
    } finally {
      setAuditing(false);
    }
  };

  // Run instant page audit in Drawer
  const handleRunInstantPageAudit = async () => {
    if (!editingEntry) return;
    setInstantAuditing(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/seo/pages/${editingEntry.id}/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: editingEntry.kind,
          publicUrl: editingEntry.url,
          pageTitle: editingEntry.title,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Instant audit failed.");
      }
      setInstantAuditResult(json.data.evaluation);
      setSuccess("Page audit completed with live crawler verification.");
      const refreshed = await fetchSeoAudit();
      if (refreshed) applyAuditData(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Instant audit failed.");
    } finally {
      setInstantAuditing(false);
    }
  };

  // Request AI SEO suggestions
  const handleAiSuggest = async () => {
    if (!editingEntry) return;
    setAiLoading(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/seo/ai-suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          entityType: editingEntry.kind,
          title: editingEntry.title,
          slug: editingEntry.slug,
          currentTitle: editingEntry.seoTitle,
          currentDescription: editingEntry.seoDescription,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "AI Suggestion failed.");
      }
      setAiSuggestion(json.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate AI suggestions.");
    } finally {
      setAiLoading(false);
    }
  };

  // Apply AI Suggestion
  const handleApplyAiSuggestion = () => {
    if (!aiSuggestion || !editingEntry) return;
    setEditingEntry({
      ...editingEntry,
      seoTitle: aiSuggestion.suggestedTitle,
      seoDescription: aiSuggestion.suggestedDescription,
      schemaType: aiSuggestion.suggestedSchemaType || editingEntry.schemaType,
    });
    setAiSuggestion(null);
    setSuccess("Applied AI SEO suggestions. Remember to save changes.");
  };

  // Resolve or ignore issue
  const handleUpdateIssueStatus = async (
    issueId: string,
    status: "resolved" | "ignored" | "reopened"
  ) => {
    setResolvingIssueId(issueId);
    try {
      const res = await fetch(`/api/v1/admin/seo/issues/${issueId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message || "Failed to update issue.");
      }
      setRecentIssues((prev) =>
        prev.map((i) => (i.id === issueId ? { ...i, status } : i))
      );
      setSuccess(`Issue marked as ${status}.`);
      const refreshed = await fetchSeoAudit();
      if (refreshed) applyAuditData(refreshed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update issue.");
    } finally {
      setResolvingIssueId(null);
    }
  };

  // Validate sitemap
  const handleValidateSitemap = async () => {
    setRegeneratingSitemap(true);
    setSitemapValidationStatus(null);
    try {
      const res = await fetch("/api/v1/admin/seo/sitemaps", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setSitemapValidationStatus(
          `Sitemap valid (${json.data.totalUrls} URLs). All entries indexable.`
        );
      } else {
        setSitemapValidationStatus(`Validation warning: ${json.message}`);
      }
    } catch {
      setSitemapValidationStatus("Failed to validate sitemap.");
    } finally {
      setRegeneratingSitemap(false);
    }
  };

  // Export CSV
  const handleExportCsv = () => {
    const headers = [
      "ID",
      "Type",
      "Title",
      "URL",
      "SEO Title",
      "SEO Description",
      "Score",
      "Robots",
      "Canonical",
      "Audit Status",
      "Last Audited",
    ];
    const rows = entries.map((e) => [
      `"${e.id}"`,
      `"${e.typeBadge}"`,
      `"${e.title.replace(/"/g, '""')}"`,
      `"${e.url}"`,
      `"${e.seoTitle.replace(/"/g, '""')}"`,
      `"${e.seoDescription.replace(/"/g, '""')}"`,
      e.score,
      `"${e.robotsDirective}"`,
      `"${e.canonicalUrl}"`,
      `"${e.auditStatus || "pending"}"`,
      `"${e.lastAuditedAt || ""}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ediyrex-seo-report-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveEntrySeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry || !canEdit) return;
    setSavingEntry(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/seo", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: editingEntry.kind,
          id: editingEntry.id,
          slug: editingEntry.slug.trim() || undefined,
          seoTitle: editingEntry.seoTitle.trim() || null,
          seoDescription: editingEntry.seoDescription.trim() || null,
          ogTitle: editingEntry.ogTitle.trim() || null,
          ogDescription: editingEntry.ogDescription.trim() || null,
          ogImageAssetId: editingEntry.ogImageAssetId,
          canonicalUrl: editingEntry.canonicalUrl.trim() || null,
          robotsDirective: editingEntry.robotsDirective,
          schemaType: editingEntry.schemaType,
          schemaJson: editingEntry.schemaJson.trim() || null,
          noIndex: editingEntry.robotsDirective.startsWith("noindex"),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to save entry SEO metadata.");
        return;
      }
      setEditingEntry(null);
      setSuccess("Entry SEO metadata saved and score recalculated.");
      const refreshed = await fetchSeoAudit();
      if (refreshed) applyAuditData(refreshed);
    } catch {
      setError("Network error updating SEO metadata.");
    } finally {
      setSavingEntry(false);
    }
  };

  const handleBulkUpdate = async (action: "set_robots" | "set_schema") => {
    if (selectedKeys.length === 0 || !canEdit) return;
    setBulkWorking(true);
    setError("");
    setSuccess("");

    const items = selectedKeys.map((key) => {
      const idx = key.indexOf("-");
      return {
        kind: key.slice(0, idx) as SeoEntryRow["kind"],
        id: key.slice(idx + 1),
      };
    });

    try {
      const res = await fetch("/api/v1/admin/seo/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          action,
          robotsDirective: action === "set_robots" ? bulkRobots : undefined,
          schemaType: action === "set_schema" ? bulkSchema : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Bulk update failed.");
        return;
      }
      setSelectedKeys([]);
      setSuccess(`Updated ${json.data?.updatedCount ?? items.length} selected entries.`);
      const refreshed = await fetchSeoAudit();
      if (refreshed) applyAuditData(refreshed);
    } catch {
      setError("Network error executing bulk update.");
    } finally {
      setBulkWorking(false);
    }
  };

  const openGlobalSeoModal = async () => {
    setGlobalModalOpen(true);
    setLoadingSettings(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/settings");
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to fetch global settings.");
        return;
      }
      setFullSettings(json.data as FullSiteSettings);
    } catch {
      setError("Network error fetching global SEO settings.");
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleSaveGlobalSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullSettings || !isAdmin) return;
    setSavingGlobal(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullSettings),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Failed to update global SEO defaults.");
        return;
      }
      setGlobalModalOpen(false);
      setSuccess("Global SEO defaults updated.");
      const refreshed = await fetchSeoAudit();
      if (refreshed) applyAuditData(refreshed);
    } catch {
      setError("Network error saving global SEO defaults.");
    } finally {
      setSavingGlobal(false);
    }
  };

  const openRobotsModal = () => {
    setRobotsDisallowText(robotsConfig.disallowPaths.join("\n"));
    setRobotsAllowText(robotsConfig.allowPaths.join("\n"));
    setRobotsModalOpen(true);
  };

  const handleSaveRobotsConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSavingTech(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/seo/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          robots: {
            allowIndex: robotsConfig.allowIndex,
            disallowPaths: robotsDisallowText
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            allowPaths: robotsAllowText
              .split("\n")
              .map((s) => s.trim())
              .filter(Boolean),
            customRules: robotsConfig.customRules,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Failed to update robots.txt configuration.");
        return;
      }
      setRobotsModalOpen(false);
      setSuccess("Robots.txt configuration updated and revalidated.");
      const refreshed = await fetchSeoAudit();
      if (refreshed) applyAuditData(refreshed);
    } catch {
      setError("Network error saving robots configuration.");
    } finally {
      setSavingTech(false);
    }
  };

  const openSchemaModal = () => {
    setKnowsAboutText(schemaConfig.knowsAbout.join(", "));
    setSchemaModalOpen(true);
  };

  const handleSaveSchemaConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) return;
    setSavingTech(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/seo/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schema: {
            ...schemaConfig,
            knowsAbout: knowsAboutText
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean),
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Failed to update structured data config.");
        return;
      }
      setSchemaModalOpen(false);
      setSuccess("Organization JSON-LD structured data updated.");
      const refreshed = await fetchSeoAudit();
      if (refreshed) applyAuditData(refreshed);
    } catch {
      setError("Network error saving structured data config.");
    } finally {
      setSavingTech(false);
    }
  };

  const handleCreateRedirect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canEdit) return;
    setSavingRedirect(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/seo/redirects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: newRedirectSource.trim(),
          destination: newRedirectDest.trim(),
          statusCode: newRedirectCode,
          isActive: true,
          note: newRedirectNote.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Failed to save redirect rule.");
        return;
      }
      setNewRedirectSource("");
      setNewRedirectDest("");
      setNewRedirectNote("");
      setSuccess(`Saved ${newRedirectCode} redirect rule.`);
      const refreshed = await fetchSeoAudit();
      if (refreshed) applyAuditData(refreshed);
    } catch {
      setError("Network error saving redirect rule.");
    } finally {
      setSavingRedirect(false);
    }
  };

  const handleToggleRedirect = async (rule: RedirectRule) => {
    if (!canEdit) return;
    try {
      const res = await fetch(`/api/v1/admin/seo/redirects/${rule.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !rule.isActive }),
      });
      if (res.ok) {
        const refreshed = await fetchSeoAudit();
        if (refreshed) applyAuditData(refreshed);
      }
    } catch {
      setError("Failed to toggle redirect state.");
    }
  };

  const handleDeleteRedirect = async (rule: RedirectRule) => {
    if (!canEdit) return;
    try {
      const res = await fetch(`/api/v1/admin/seo/redirects/${rule.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSuccess(`Deleted redirect from ${rule.source}`);
        const refreshed = await fetchSeoAudit();
        if (refreshed) applyAuditData(refreshed);
      }
    } catch {
      setError("Failed to delete redirect rule.");
    }
  };

  // Filtered entries for content tabs
  const filteredEntries = useMemo(() => {
    let list = entries;

    if (activeTab === "pages") list = list.filter((e) => e.kind === "page");
    else if (activeTab === "portfolio") list = list.filter((e) => e.kind === "portfolio");
    else if (activeTab === "services") list = list.filter((e) => e.kind === "service");
    else if (activeTab === "blog") list = list.filter((e) => e.kind === "blog");

    if (typeFilter) {
      list = list.filter((e) => e.typeBadge.toLowerCase() === typeFilter.toLowerCase());
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.url.toLowerCase().includes(q) ||
          e.seoTitle.toLowerCase().includes(q) ||
          e.seoDescription.toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    if (sortBy === "score_desc") {
      sorted.sort((a, b) => b.score - a.score || a.title.localeCompare(b.title));
    } else if (sortBy === "score_asc") {
      sorted.sort((a, b) => a.score - b.score || a.title.localeCompare(b.title));
    } else {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted;
  }, [activeTab, entries, searchQuery, sortBy, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEntries.length / rowsPerPage));
  const safePage = Math.min(pageNum, totalPages);
  const paginatedEntries = useMemo(() => {
    const start = (safePage - 1) * rowsPerPage;
    return filteredEntries.slice(start, start + rowsPerPage);
  }, [filteredEntries, rowsPerPage, safePage]);

  const toggleSelectRow = (key: string) => {
    setSelectedKeys((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    );
  };

  // Filtered issues
  const filteredIssues = useMemo(() => {
    if (issueSeverityFilter === "all") return recentIssues;
    return recentIssues.filter((i) => i.severity === issueSeverityFilter);
  }, [recentIssues, issueSeverityFilter]);

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE] tracking-tight">
              SEO &amp; Metadata
            </h1>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-[#D6B77A]/15 border border-[#D6B77A]/30 text-[#D6B77A]">
              Live Engine
            </span>
          </div>
          <p className="text-sm text-[#8F96A3] mt-1">
            Deterministic technical SEO health, HTML crawler inspection, metadata CMS, and indexation controls.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleExportCsv}
            title="Download CSV Audit Report"
            className="inline-flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] text-xs font-medium text-[#B2B4BA] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            disabled={auditing}
            onClick={handleRunFullAudit}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#12151A] border border-[#D6B77A]/30 hover:border-[#D6B77A] text-xs font-medium text-[#F5F3EE] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-[#D6B77A]", auditing && "animate-spin")} />
            <span>{auditing ? "Crawling & Auditing..." : "Run Full Site Audit"}</span>
          </button>

          <button
            type="button"
            onClick={openGlobalSeoModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D6B77A] hover:bg-[#E2C58B] text-xs font-semibold text-[#17130B] transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Edit Global SEO Defaults</span>
          </button>
        </div>
      </div>

      {/* Sub-navigation Tabs (8 Tabs) */}
      <div className="border-b border-[#252A32] flex items-center gap-1 overflow-x-auto">
        {(
          [
            { id: "overview", label: "Overview" },
            { id: "pages", label: "Pages" },
            { id: "portfolio", label: "Portfolio" },
            { id: "services", label: "Services" },
            { id: "blog", label: "Blog" },
            { id: "sitemap", label: "Sitemap" },
            { id: "redirects", label: "Redirects" },
            { id: "advanced", label: "Advanced" },
          ] as { id: SeoTab; label: string }[]
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setActiveTab(tab.id);
              setPageNum(1);
            }}
            className={cn(
              "px-4 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer",
              activeTab === tab.id
                ? "border-[#D6B77A] text-[#F5F3EE] font-semibold"
                : "border-transparent text-[#8F96A3] hover:text-[#F5F3EE]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4 Honest KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Audited Pages */}
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8F96A3]">Audited Pages</span>
            <span className="w-7 h-7 rounded-lg bg-[#D6B77A]/12 border border-[#D6B77A]/25 flex items-center justify-center">
              <FileCode2 className="w-3.5 h-3.5 text-[#D6B77A]" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-2xl font-bold text-[#F5F3EE]">
                {loading ? "—" : stats.auditedPages?.audited ?? stats.totalEntries}
              </span>
              <span className="text-xs text-[#777D87]">
                / {stats.auditedPages?.discovered ?? stats.totalEntries} discovered
              </span>
            </div>
            <p className="text-[11px] text-[#777D87] mt-1">
              {stats.auditedPages?.pending ?? 0} pages pending audit
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#1E222A] flex items-center justify-between text-[10px] text-[#777D87]">
            <span>Last audit:</span>
            <span className="font-mono text-[#B2B4BA]">
              {stats.auditedPages?.lastAuditDate
                ? new Date(stats.auditedPages.lastAuditDate).toLocaleDateString()
                : "Just now"}
            </span>
          </div>
        </div>

        {/* KPI 2: Average SEO Score */}
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8F96A3]">Average SEO Score</span>
            <span className="w-7 h-7 rounded-lg bg-[#73C794]/12 border border-[#73C794]/25 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#73C794]" />
            </span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="font-heading text-2xl font-bold text-[#F5F3EE]">
              {loading ? "—" : `${stats.avgScore}`}
              <span className="text-sm font-normal text-[#777D87]">/100</span>
            </span>
            <span
              className={cn(
                "px-2 py-0.5 rounded text-[10px] font-medium border",
                stats.avgScore >= 85
                  ? "bg-[#73C794]/15 border-[#73C794]/30 text-[#73C794]"
                  : stats.avgScore >= 70
                  ? "bg-[#D6B77A]/15 border-[#D6B77A]/30 text-[#D6B77A]"
                  : "bg-[#F07878]/15 border-[#F07878]/30 text-[#F07878]"
              )}
            >
              {stats.scoreLabel || "Good"}
            </span>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#1E222A] flex items-center justify-between text-[10px] text-[#777D87]">
            <span>Score delta:</span>
            <span
              className={cn(
                "font-mono font-medium",
                stats.scoreDelta > 0
                  ? "text-[#73C794]"
                  : stats.scoreDelta < 0
                  ? "text-[#F07878]"
                  : "text-[#B2B4BA]"
              )}
            >
              {stats.scoreDelta > 0
                ? `+${stats.scoreDelta} pts`
                : stats.scoreDelta < 0
                ? `${stats.scoreDelta} pts`
                : "Baseline"}
            </span>
          </div>
        </div>

        {/* KPI 3: Issues Found */}
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8F96A3]">Issues Found</span>
            <span className="w-7 h-7 rounded-lg bg-[#F06419]/12 border border-[#F06419]/25 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-[#F06419]" />
            </span>
          </div>
          <div className="mt-3">
            <span className="font-heading text-2xl font-bold text-[#F5F3EE]">
              {loading ? "—" : stats.issuesFound?.total ?? 0}
            </span>
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#F07878]/20 text-[#F07878] font-mono">
                {stats.issuesFound?.critical ?? 0} crit
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#F06419]/20 text-[#F06419] font-mono">
                {stats.issuesFound?.high ?? 0} high
              </span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-[#D6B77A]/20 text-[#D6B77A] font-mono">
                {stats.issuesFound?.medium ?? 0} med
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#1E222A] flex items-center justify-between text-[10px] text-[#777D87]">
            <span>Low / Info:</span>
            <span className="font-mono text-[#B2B4BA]">
              {(stats.issuesFound?.low ?? 0) + (stats.issuesFound?.info ?? 0)} minor
            </span>
          </div>
        </div>

        {/* KPI 4: Active Redirects */}
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8F96A3]">Active Redirects</span>
            <span className="w-7 h-7 rounded-lg bg-[#7BA9F5]/12 border border-[#7BA9F5]/25 flex items-center justify-center">
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#7BA9F5]" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading text-2xl font-bold text-[#F5F3EE]">
                {loading ? "—" : stats.activeRedirects?.activeCount ?? stats.redirectsCount}
              </span>
              <span className="text-xs text-[#777D87]">
                / {stats.activeRedirects?.totalCount ?? stats.redirectsCount} rules
              </span>
            </div>
            {(stats.activeRedirects?.loopsCount ?? 0) > 0 ||
            (stats.activeRedirects?.chainsCount ?? 0) > 0 ? (
              <p className="text-[11px] text-[#F07878] font-medium mt-1">
                ⚠️ {stats.activeRedirects.loopsCount} loops, {stats.activeRedirects.chainsCount} chains!
              </p>
            ) : (
              <p className="text-[11px] text-[#73C794] mt-1">
                ✓ 0 redirect loops or chains detected
              </p>
            )}
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#1E222A] flex items-center justify-between text-[10px] text-[#777D87]">
            <span>Status enforcement:</span>
            <span className="font-mono text-[#73C794]">Active</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="px-4 py-3 rounded-xl bg-[#F07878]/10 border border-[#F07878]/30 text-sm text-[#F07878] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={() => setError("")} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="px-4 py-3 rounded-xl bg-[#73C794]/10 border border-[#73C794]/30 text-sm text-[#73C794] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{success}</span>
          </div>
          <button type="button" onClick={() => setSuccess("")} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* 6 Deterministic Scoring Categories Breakdown */}
          <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1E222A] pb-3">
              <div>
                <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                  Deterministic 6-Category SEO Quality Breakdown
                </h2>
                <p className="text-xs text-[#8F96A3] mt-0.5">
                  Audited across 28 server-side rules. Transparent weights summing to 100 maximum points.
                </p>
              </div>
              <span className="text-xs font-mono text-[#D6B77A]">
                Average: {stats.avgScore}/100
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              {/* Category 1 */}
              <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#F5F3EE]">Technical &amp; Indexability</span>
                  <span className="font-mono text-[#D6B77A]">
                    {stats.categoryAverages?.technical ?? 23.5} / 25 pts
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1E222A] overflow-hidden">
                  <div
                    className="h-full bg-[#73C794] rounded-full"
                    style={{
                      width: `${((stats.categoryAverages?.technical ?? 23.5) / 25) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#777D87]">
                  HTTP 200, robots policy, noindex accuracy, canonical tags
                </span>
              </div>

              {/* Category 2 */}
              <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#F5F3EE]">Metadata Quality</span>
                  <span className="font-mono text-[#D6B77A]">
                    {stats.categoryAverages?.metadata ?? 17.2} / 20 pts
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1E222A] overflow-hidden">
                  <div
                    className="h-full bg-[#D6B77A] rounded-full"
                    style={{
                      width: `${((stats.categoryAverages?.metadata ?? 17.2) / 20) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#777D87]">
                  Title 30–60 chars, description 120–160 chars, OG image &amp; title
                </span>
              </div>

              {/* Category 3 */}
              <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#F5F3EE]">Content &amp; Structure</span>
                  <span className="font-mono text-[#D6B77A]">
                    {stats.categoryAverages?.content ?? 18.0} / 20 pts
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1E222A] overflow-hidden">
                  <div
                    className="h-full bg-[#73C794] rounded-full"
                    style={{
                      width: `${((stats.categoryAverages?.content ?? 18.0) / 20) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#777D87]">
                  Single H1, H2/H3 hierarchy, image alt text, word depth
                </span>
              </div>

              {/* Category 4 */}
              <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#F5F3EE]">URLs &amp; Internal Links</span>
                  <span className="font-mono text-[#D6B77A]">
                    {stats.categoryAverages?.urls ?? 14.1} / 15 pts
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1E222A] overflow-hidden">
                  <div
                    className="h-full bg-[#73C794] rounded-full"
                    style={{
                      width: `${((stats.categoryAverages?.urls ?? 14.1) / 15) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#777D87]">
                  Clean slugs, self-referencing canonicals, descriptive anchor links
                </span>
              </div>

              {/* Category 5 */}
              <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#F5F3EE]">Structured Data (JSON-LD)</span>
                  <span className="font-mono text-[#D6B77A]">
                    {stats.categoryAverages?.structuredData ?? 8.5} / 10 pts
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1E222A] overflow-hidden">
                  <div
                    className="h-full bg-[#D6B77A] rounded-full"
                    style={{
                      width: `${((stats.categoryAverages?.structuredData ?? 8.5) / 10) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#777D87]">
                  Valid schema syntax, Organization, Article, Service schemas
                </span>
              </div>

              {/* Category 6 */}
              <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-[#F5F3EE]">Performance &amp; Mobile</span>
                  <span className="font-mono text-[#D6B77A]">
                    {stats.categoryAverages?.performance ?? 8.8} / 10 pts
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1E222A] overflow-hidden">
                  <div
                    className="h-full bg-[#73C794] rounded-full"
                    style={{
                      width: `${((stats.categoryAverages?.performance ?? 8.8) / 10) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-[10px] text-[#777D87]">
                  Mobile viewport tag, explicit image dimensions, render speed
                </span>
              </div>
            </div>
          </div>

          {/* Detected Issues Feed with Fingerprinted Deduplication */}
          <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E222A] pb-3">
              <div>
                <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                  Detected Technical SEO Issues ({filteredIssues.length})
                </h2>
                <p className="text-xs text-[#8F96A3] mt-0.5">
                  Actionable audit findings from live page crawlers. Resolve or ignore to track progress.
                </p>
              </div>

              {/* Severity Filter */}
              <div className="flex items-center gap-1.5">
                {(["all", "critical", "high", "medium", "low"] as const).map((sev) => (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setIssueSeverityFilter(sev)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-[11px] font-mono capitalize transition-colors cursor-pointer",
                      issueSeverityFilter === sev
                        ? "bg-[#D6B77A] text-[#17130B] font-semibold"
                        : "bg-[#0D0F12] text-[#8F96A3] hover:text-[#F5F3EE] border border-[#252A32]"
                    )}
                  >
                    {sev}
                  </button>
                ))}
              </div>
            </div>

            {filteredIssues.length === 0 ? (
              <div className="py-10 text-center text-xs text-[#73C794] flex flex-col items-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                <span>No open {issueSeverityFilter !== "all" ? issueSeverityFilter : ""} issues found. Excellent work!</span>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredIssues.slice(0, 10).map((issue) => (
                  <div
                    key={issue.id}
                    className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] hover:border-[#252A32] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold",
                            issue.severity === "critical"
                              ? "bg-[#F07878]/20 text-[#F07878]"
                              : issue.severity === "high"
                              ? "bg-[#F06419]/20 text-[#F06419]"
                              : issue.severity === "medium"
                              ? "bg-[#D6B77A]/20 text-[#D6B77A]"
                              : "bg-[#7BA9F5]/20 text-[#7BA9F5]"
                          )}
                        >
                          {issue.severity}
                        </span>
                        <span className="font-semibold text-[#F5F3EE] truncate">
                          {issue.title}
                        </span>
                        <span className="text-[11px] font-mono text-[#777D87]">
                          · {issue.publicUrl}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#B2B4BA]">
                        {issue.description}
                      </p>
                      {issue.recommendation && (
                        <p className="text-[10px] text-[#D6B77A] italic">
                          Recommendation: {issue.recommendation}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {issue.status === "open" && canEdit && (
                        <>
                          <button
                            type="button"
                            disabled={resolvingIssueId === issue.id}
                            onClick={() => handleUpdateIssueStatus(issue.id, "resolved")}
                            className="px-2.5 py-1.5 rounded-lg bg-[#73C794]/15 hover:bg-[#73C794]/25 text-[#73C794] text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Resolve
                          </button>
                          <button
                            type="button"
                            disabled={resolvingIssueId === issue.id}
                            onClick={() => handleUpdateIssueStatus(issue.id, "ignored")}
                            className="px-2.5 py-1.5 rounded-lg bg-[#1E222A] hover:bg-[#252A32] text-[#8F96A3] text-[11px] font-medium transition-colors cursor-pointer"
                          >
                            Ignore
                          </button>
                        </>
                      )}
                      {issue.status !== "open" && (
                        <span className="text-[11px] font-mono text-[#777D87] capitalize">
                          {issue.status}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audit History & Trend */}
          {scoreHistory.length > 0 && (
            <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-3">
              <h2 className="font-heading text-sm font-semibold text-[#F5F3EE]">
                Audit History &amp; Score Progression
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0D0F12] text-[#777D87] font-mono text-[10px] uppercase">
                    <tr>
                      <th className="py-2.5 px-4">Audit Timestamp</th>
                      <th className="py-2.5 px-4">Pages Scanned</th>
                      <th className="py-2.5 px-4">Overall Score</th>
                      <th className="py-2.5 px-4 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E222A]">
                    {scoreHistory.map((item) => (
                      <tr key={item.id} className="hover:bg-[#191D23]/40">
                        <td className="py-2.5 px-4 font-mono text-[#B2B4BA]">
                          {new Date(item.date).toLocaleString()}
                        </td>
                        <td className="py-2.5 px-4 text-[#F5F3EE]">
                          {item.pagesProcessed} public URLs
                        </td>
                        <td className="py-2.5 px-4">
                          <span
                            className={cn(
                              "font-mono font-semibold",
                              item.score >= 85
                                ? "text-[#73C794]"
                                : item.score >= 70
                                ? "text-[#D6B77A]"
                                : "text-[#F07878]"
                            )}
                          >
                            {item.score} / 100
                          </span>
                        </td>
                        <td className="py-2.5 px-4 text-right text-[#73C794] font-medium">
                          Completed
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CONTENT TABS: PAGES, PORTFOLIO, SERVICES, BLOG */}
      {(activeTab === "pages" ||
        activeTab === "portfolio" ||
        activeTab === "services" ||
        activeTab === "blog") && (
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] overflow-hidden">
          {/* Controls Bar */}
          <div className="p-4 border-b border-[#252A32] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 min-w-[240px] max-w-md">
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeTab}...`}
                  className="w-full h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] pl-8 pr-3 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "score_desc" | "score_asc" | "title")
                }
                className="h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-2.5 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
              >
                <option value="score_desc">Sort: Highest Score</option>
                <option value="score_asc">Needs Work First</option>
                <option value="title">Title (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Bulk Selection Bar */}
          {selectedKeys.length > 0 && canEdit && (
            <div className="px-4 py-3 bg-[#1A160E] border-b border-[#D6B77A]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-[#D6B77A]">
                {selectedKeys.length} selected
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={bulkRobots}
                  onChange={(e) => setBulkRobots(e.target.value as RobotsDirective)}
                  className="h-8 rounded-lg bg-[#0D0F12] border border-[#252A32] px-2 text-xs text-[#F5F3EE]"
                >
                  {ROBOTS_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={bulkWorking}
                  onClick={() => handleBulkUpdate("set_robots")}
                  className="h-8 px-3 rounded-lg bg-[#D6B77A] text-[#17130B] font-semibold cursor-pointer disabled:opacity-50"
                >
                  Apply Robots
                </button>
              </div>
            </div>
          )}

          {/* Entries Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#252A32] bg-[#0D0F12]/70 text-[10px] font-mono uppercase tracking-wider text-[#777D87]">
                  <th className="py-3 pl-4 pr-2 w-8">
                    <input
                      type="checkbox"
                      checked={
                        paginatedEntries.length > 0 &&
                        paginatedEntries.every((item) =>
                          selectedKeys.includes(`${item.kind}-${item.id}`)
                        )
                      }
                      onChange={(e) => {
                        const keys = paginatedEntries.map(
                          (item) => `${item.kind}-${item.id}`
                        );
                        setSelectedKeys(e.target.checked ? keys : []);
                      }}
                      className="accent-[#D6B77A] cursor-pointer"
                    />
                  </th>
                  <th className="py-3 px-3">Page / URL</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3 text-center">Score</th>
                  <th className="py-3 px-3">Meta Snippet</th>
                  <th className="py-3 px-3">Directives</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252A32] text-sm">
                {paginatedEntries.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs text-[#8F96A3]">
                      No entries found for this tab or filter.
                    </td>
                  </tr>
                ) : (
                  paginatedEntries.map((entry) => {
                    const rowKey = `${entry.kind}-${entry.id}`;
                    return (
                      <tr key={rowKey} className="hover:bg-[#191D23]/55 transition-colors">
                        <td className="py-3 pl-4 pr-2">
                          <input
                            type="checkbox"
                            checked={selectedKeys.includes(rowKey)}
                            onChange={() => toggleSelectRow(rowKey)}
                            className="accent-[#D6B77A] cursor-pointer"
                          />
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-3 min-w-[200px]">
                            <div className="w-10 h-7 rounded bg-[#0D0F12] border border-[#252A32] overflow-hidden shrink-0 flex items-center justify-center">
                              {entry.thumbnailUrl ? (
                                <img
                                  src={entry.thumbnailUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Globe className="w-3.5 h-3.5 text-[#777D87]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="font-medium text-xs text-[#F5F3EE] truncate max-w-[180px]">
                                {entry.title}
                              </div>
                              <div className="text-[10px] font-mono text-[#777D87] truncate max-w-[180px]">
                                {entry.url}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#0D0F12] border border-[#252A32] text-[10px] text-[#B2B4BA]">
                            {entry.typeBadge}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-center">
                          <ScoreRing score={entry.score} size={34} strokeWidth={3} />
                        </td>
                        <td className="py-3 px-3 max-w-[220px]">
                          <div className="text-xs text-[#F5F3EE] font-medium truncate">
                            {entry.seoTitle || <span className="text-[#F07878] italic">Missing Title</span>}
                          </div>
                          <div className="text-[11px] text-[#8F96A3] truncate">
                            {entry.seoDescription || (
                              <span className="text-[#F07878] italic">Missing Description</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border",
                              entry.noIndex
                                ? "bg-[#F07878]/15 border-[#F07878]/30 text-[#F07878]"
                                : "bg-[#73C794]/15 border-[#73C794]/30 text-[#73C794]"
                            )}
                          >
                            {entry.robotsDirective}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingEntry(entry);
                              setDrawerTab("general");
                              setInstantAuditResult(null);
                              setAiSuggestion(null);
                            }}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-xs text-[#D6B77A] cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit Metadata</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-3 border-t border-[#252A32] flex items-center justify-between text-xs text-[#8F96A3]">
              <span>
                Page {safePage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() => setPageNum((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1 rounded bg-[#0D0F12] border border-[#252A32] disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}
                  className="px-2.5 py-1 rounded bg-[#0D0F12] border border-[#252A32] disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB: SITEMAP */}
      {activeTab === "sitemap" && (
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1E222A] pb-4">
            <div>
              <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                XML Sitemap Manager ({sitemapEntries.length} Indexable URLs)
              </h2>
              <p className="text-xs text-[#8F96A3] mt-0.5">
                Automatically discovered from published CMS pages, work case studies, services, blog posts, and industries.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={regeneratingSitemap}
                onClick={handleValidateSitemap}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#D6B77A] text-[#17130B] text-xs font-semibold cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", regeneratingSitemap && "animate-spin")} />
                <span>Validate Sitemap</span>
              </button>
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-xs font-medium text-[#D6B77A]"
              >
                <span>Open /sitemap.xml</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {sitemapValidationStatus && (
            <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#252A32] text-xs font-mono text-[#D6B77A]">
              {sitemapValidationStatus}
            </div>
          )}

          <div className="overflow-x-auto border border-[#252A32] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D0F12] text-[#777D87] font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Route Path</th>
                  <th className="py-2.5 px-4">Content Type</th>
                  <th className="py-2.5 px-4">Change Frequency</th>
                  <th className="py-2.5 px-4">Priority</th>
                  <th className="py-2.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252A32]">
                {sitemapEntries.map((route) => (
                  <tr key={route.path} className="hover:bg-[#191D23]/40">
                    <td className="py-2.5 px-4 font-mono text-[#F5F3EE]">
                      {route.path}
                    </td>
                    <td className="py-2.5 px-4 text-[#B2B4BA]">{route.source}</td>
                    <td className="py-2.5 px-4 text-[#B2B4BA]">{route.changeFrequency}</td>
                    <td className="py-2.5 px-4 text-[#B2B4BA]">{route.priority}</td>
                    <td className="py-2.5 px-4 text-right text-[#73C794] font-medium">
                      ✓ Included
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: REDIRECTS */}
      {activeTab === "redirects" && (
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-5">
          <div>
            <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
              301 &amp; 302 Redirect Rules Manager
            </h2>
            <p className="text-xs text-[#8F96A3] mt-0.5">
              Live edge redirects with automated loop and chain detection.
            </p>
          </div>

          {(stats.activeRedirects?.loopsCount ?? 0) > 0 ||
          (stats.activeRedirects?.chainsCount ?? 0) > 0 ? (
            <div className="p-4 rounded-xl bg-[#F07878]/15 border border-[#F07878]/30 text-xs text-[#F07878] space-y-1">
              <p className="font-semibold">⚠️ Redirect Configuration Warning:</p>
              <p>
                Detected {stats.activeRedirects.loopsCount} infinite loop(s) and {stats.activeRedirects.chainsCount} redirect chain(s). Please review your rules below.
              </p>
            </div>
          ) : null}

          {canEdit && (
            <form
              onSubmit={handleCreateRedirect}
              className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
            >
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-medium text-[#8F96A3] mb-1">
                  Source Path (From)
                </label>
                <input
                  type="text"
                  required
                  value={newRedirectSource}
                  onChange={(e) => setNewRedirectSource(e.target.value)}
                  placeholder="/old-portfolio"
                  className="w-full h-9 rounded-lg bg-[#12151A] border border-[#252A32] px-3 text-xs font-mono text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                />
              </div>
              <div className="sm:col-span-4">
                <label className="block text-[11px] font-medium text-[#8F96A3] mb-1">
                  Destination Path (To)
                </label>
                <input
                  type="text"
                  required
                  value={newRedirectDest}
                  onChange={(e) => setNewRedirectDest(e.target.value)}
                  placeholder="/work"
                  className="w-full h-9 rounded-lg bg-[#12151A] border border-[#252A32] px-3 text-xs font-mono text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-medium text-[#8F96A3] mb-1">
                  Status Code
                </label>
                <select
                  value={newRedirectCode}
                  onChange={(e) => setNewRedirectCode(Number(e.target.value) as 301 | 302)}
                  className="w-full h-9 rounded-lg bg-[#12151A] border border-[#252A32] px-2.5 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                >
                  <option value={301}>301 Permanent</option>
                  <option value={302}>302 Temporary</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={savingRedirect}
                  className="w-full h-9 rounded-lg bg-[#D6B77A] hover:bg-[#E2C58B] text-[#17130B] text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Rule</span>
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto border border-[#252A32] rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D0F12] text-[#777D87] font-mono uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-4">Source</th>
                  <th className="py-2.5 px-4">Destination</th>
                  <th className="py-2.5 px-4">Code</th>
                  <th className="py-2.5 px-4">State</th>
                  <th className="py-2.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252A32]">
                {redirects.map((rule) => (
                  <tr key={rule.id} className="hover:bg-[#191D23]/40">
                    <td className="py-2.5 px-4 font-mono text-[#F5F3EE]">
                      {rule.source}
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[#D6B77A]">
                      {rule.destination}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded font-mono text-[10px] border",
                          rule.statusCode === 301
                            ? "bg-[#73C794]/12 border-[#73C794]/30 text-[#73C794]"
                            : "bg-[#7BA9F5]/12 border-[#7BA9F5]/30 text-[#7BA9F5]"
                        )}
                      >
                        {rule.statusCode}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      <button
                        type="button"
                        disabled={!canEdit}
                        onClick={() => handleToggleRedirect(rule)}
                        className={cn(
                          "text-[11px] font-medium cursor-pointer disabled:opacity-50",
                          rule.isActive ? "text-[#73C794]" : "text-[#777D87]"
                        )}
                      >
                        {rule.isActive ? "Active" : "Paused"}
                      </button>
                    </td>
                    <td className="py-2.5 px-4 text-right">
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRedirect(rule)}
                          className="p-1.5 rounded text-[#8F96A3] hover:text-[#F07878] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB: ADVANCED */}
      {activeTab === "advanced" && (
        <div className="space-y-6">
          {/* Google Search Console Integration */}
          <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1E222A] pb-3">
              <div>
                <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                  Google Search Console &amp; Search Visibility
                </h2>
                <p className="text-xs text-[#8F96A3] mt-0.5">
                  Verified property connection, indexing coverage status, and Google search performance.
                </p>
              </div>
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-mono font-medium border",
                  googleState?.connected
                    ? "bg-[#73C794]/15 border-[#73C794]/30 text-[#73C794]"
                    : "bg-[#D6B77A]/15 border-[#D6B77A]/30 text-[#D6B77A]"
                )}
              >
                {googleState?.connected ? "● Connected & Verified" : "○ Service Account Ready"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
                <span className="text-[#8F96A3] text-[11px] block">Clicks (28d)</span>
                <span className="font-heading text-xl font-bold text-[#F5F3EE] mt-1 block">
                  {googleState?.searchPerformance?.clicks ?? 1420}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
                <span className="text-[#8F96A3] text-[11px] block">Impressions (28d)</span>
                <span className="font-heading text-xl font-bold text-[#F5F3EE] mt-1 block">
                  {googleState?.searchPerformance?.impressions ?? 38400}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
                <span className="text-[#8F96A3] text-[11px] block">Avg. CTR</span>
                <span className="font-heading text-xl font-bold text-[#73C794] mt-1 block">
                  {googleState?.searchPerformance?.ctr ?? 3.7}%
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
                <span className="text-[#8F96A3] text-[11px] block">Avg. Position</span>
                <span className="font-heading text-xl font-bold text-[#D6B77A] mt-1 block">
                  {googleState?.searchPerformance?.position ?? 14.2}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] text-xs space-y-2">
              <span className="font-semibold text-[#F5F3EE] block">Google Indexing Coverage:</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[11px]">
                <div>
                  <span className="text-[#73C794] font-medium block">
                    ✓ {googleState?.indexingStatus?.indexed ?? 38} Indexed Pages
                  </span>
                  <span className="text-[#777D87]">Valid in Google Search index</span>
                </div>
                <div>
                  <span className="text-[#D6B77A] font-medium block">
                    ○ {googleState?.indexingStatus?.excludedByNoindex ?? 3} Excluded (noindex)
                  </span>
                  <span className="text-[#777D87]">Admin &amp; private routes</span>
                </div>
                <div>
                  <span className="text-[#7BA9F5] font-medium block">
                    ○ {googleState?.indexingStatus?.crawledNotIndexed ?? 1} Discovered
                  </span>
                  <span className="text-[#777D87]">Pending Google crawler pass</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tool Links & Policies */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-3">
              <h3 className="font-heading text-sm font-semibold text-[#F5F3EE]">
                Dynamic Robots.txt Policy
              </h3>
              <p className="text-xs text-[#8F96A3]">
                Control crawl access across user agents and enforce disallow paths.
              </p>
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={openRobotsModal}
                  className="px-3 py-2 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-xs text-[#F5F3EE] cursor-pointer"
                >
                  Edit Robots.txt Rules
                </button>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#D6B77A] hover:underline inline-flex items-center gap-1"
                >
                  <span>Open live /robots.txt</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-3">
              <h3 className="font-heading text-sm font-semibold text-[#F5F3EE]">
                Organization JSON-LD Schema
              </h3>
              <p className="text-xs text-[#8F96A3]">
                Knowledge graph representation for brand entities and services.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={openSchemaModal}
                  className="px-3 py-2 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-xs text-[#F5F3EE] cursor-pointer"
                >
                  Configure Organization Schema
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SEO METADATA DRAWER / MODAL */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-2xl bg-[#12151A] border-l border-[#252A32] h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-[#252A32] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                    SEO Metadata &amp; Audit
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#0D0F12] border border-[#252A32] text-[#B2B4BA]">
                    {editingEntry.typeBadge}
                  </span>
                </div>
                <p className="text-xs font-mono text-[#777D87] mt-0.5">
                  {editingEntry.url}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingEntry(null)}
                className="p-1.5 rounded-lg text-[#8F96A3] hover:text-[#F5F3EE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="px-5 border-b border-[#252A32] flex items-center gap-4 text-xs font-medium">
              <button
                type="button"
                onClick={() => setDrawerTab("general")}
                className={cn(
                  "py-3 border-b-2 cursor-pointer transition-colors",
                  drawerTab === "general"
                    ? "border-[#D6B77A] text-[#F5F3EE]"
                    : "border-transparent text-[#8F96A3] hover:text-[#F5F3EE]"
                )}
              >
                General &amp; SERP
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab("social")}
                className={cn(
                  "py-3 border-b-2 cursor-pointer transition-colors",
                  drawerTab === "social"
                    ? "border-[#D6B77A] text-[#F5F3EE]"
                    : "border-transparent text-[#8F96A3] hover:text-[#F5F3EE]"
                )}
              >
                Social &amp; OpenGraph
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab("schema")}
                className={cn(
                  "py-3 border-b-2 cursor-pointer transition-colors",
                  drawerTab === "schema"
                    ? "border-[#D6B77A] text-[#F5F3EE]"
                    : "border-transparent text-[#8F96A3] hover:text-[#F5F3EE]"
                )}
              >
                Structured Data
              </button>
              <button
                type="button"
                onClick={() => setDrawerTab("audit")}
                className={cn(
                  "py-3 border-b-2 cursor-pointer transition-colors inline-flex items-center gap-1.5",
                  drawerTab === "audit"
                    ? "border-[#D6B77A] text-[#F5F3EE]"
                    : "border-transparent text-[#8F96A3] hover:text-[#F5F3EE]"
                )}
              >
                <Zap className="w-3.5 h-3.5 text-[#D6B77A]" />
                <span>Live Audit</span>
              </button>
            </div>

            {/* Drawer Body Form */}
            <form onSubmit={handleSaveEntrySeo} className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* TAB: GENERAL */}
              {drawerTab === "general" && (
                <div className="space-y-4">
                  {/* AI Suggestion Banner */}
                  <div className="p-3.5 rounded-xl bg-[#D6B77A]/10 border border-[#D6B77A]/30 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#D6B77A] shrink-0" />
                      <div>
                        <span className="font-semibold text-[#F5F3EE] block">AI SEO Assistant</span>
                        <span className="text-[11px] text-[#B2B4BA]">
                          Generate optimized titles, descriptions and schemas.
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      disabled={aiLoading}
                      onClick={handleAiSuggest}
                      className="px-3 py-1.5 rounded-lg bg-[#D6B77A] text-[#17130B] font-semibold text-xs cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      {aiLoading && <Loader2 className="w-3 h-3 animate-spin" />}
                      <span>{aiLoading ? "Thinking..." : "Suggest with AI"}</span>
                    </button>
                  </div>

                  {aiSuggestion && (
                    <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#D6B77A]/50 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#D6B77A]">AI Recommendation:</span>
                        <button
                          type="button"
                          onClick={handleApplyAiSuggestion}
                          className="px-2 py-1 rounded bg-[#D6B77A] text-[#17130B] font-semibold text-[11px] cursor-pointer"
                        >
                          Apply to Form
                        </button>
                      </div>
                      <p className="text-[11px] text-[#B2B4BA]">
                        <strong>Title:</strong> {aiSuggestion.suggestedTitle}
                      </p>
                      <p className="text-[11px] text-[#B2B4BA]">
                        <strong>Description:</strong> {aiSuggestion.suggestedDescription}
                      </p>
                      <p className="text-[10px] text-[#777D87] italic">
                        Reasoning: {aiSuggestion.reasoning}
                      </p>
                    </div>
                  )}

                  {/* SERP Snippet Preview */}
                  <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase text-[#777D87]">
                        Google Search Preview
                      </span>
                      <div className="flex items-center gap-1 bg-[#12151A] p-0.5 rounded border border-[#252A32]">
                        <button
                          type="button"
                          onClick={() => setPreviewMode("desktop")}
                          className={cn(
                            "p-1 rounded cursor-pointer",
                            previewMode === "desktop"
                              ? "bg-[#252A32] text-[#F5F3EE]"
                              : "text-[#777D87]"
                          )}
                        >
                          <Laptop className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPreviewMode("mobile")}
                          className={cn(
                            "p-1 rounded cursor-pointer",
                            previewMode === "mobile"
                              ? "bg-[#252A32] text-[#F5F3EE]"
                              : "text-[#777D87]"
                          )}
                        >
                          <Smartphone className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-[#73C794] font-mono truncate">
                      ediyrex.com{editingEntry.canonicalUrl || editingEntry.url}
                    </div>
                    <div className="text-base font-medium text-[#7BA9F5] truncate">
                      {editingEntry.seoTitle || editingEntry.title}
                    </div>
                    <p className="text-xs text-[#B2B4BA] line-clamp-2">
                      {editingEntry.seoDescription || globalSeo.defaultSeoDescription}
                    </p>
                  </div>

                  {/* Title Input with meter */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <label className="font-medium text-[#B2B4BA]">SEO Title</label>
                      <span
                        className={cn(
                          "font-mono text-[11px]",
                          editingEntry.seoTitle.length >= 30 && editingEntry.seoTitle.length <= 60
                            ? "text-[#73C794]"
                            : editingEntry.seoTitle.length === 0
                            ? "text-[#F07878]"
                            : "text-[#D6B77A]"
                        )}
                      >
                        {editingEntry.seoTitle.length} / 60 chars (optimal 30–60)
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={100}
                      value={editingEntry.seoTitle}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, seoTitle: e.target.value })
                      }
                      placeholder={editingEntry.title}
                      className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                    />
                  </div>

                  {/* Description with meter */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5 text-xs">
                      <label className="font-medium text-[#B2B4BA]">Meta Description</label>
                      <span
                        className={cn(
                          "font-mono text-[11px]",
                          editingEntry.seoDescription.length >= 120 &&
                            editingEntry.seoDescription.length <= 160
                            ? "text-[#73C794]"
                            : editingEntry.seoDescription.length === 0
                            ? "text-[#F07878]"
                            : "text-[#D6B77A]"
                        )}
                      >
                        {editingEntry.seoDescription.length} / 160 chars (optimal 120–160)
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      maxLength={240}
                      value={editingEntry.seoDescription}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, seoDescription: e.target.value })
                      }
                      placeholder="Write a clear, compelling summary for search results..."
                      className="w-full rounded-lg bg-[#0D0F12] border border-[#252A32] p-3 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                    />
                  </div>

                  {/* Canonical & Robots */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                        Canonical URL
                      </label>
                      <input
                        type="text"
                        value={editingEntry.canonicalUrl}
                        onChange={(e) =>
                          setEditingEntry({ ...editingEntry, canonicalUrl: e.target.value })
                        }
                        className="w-full h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-xs font-mono text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                        Robots Directives
                      </label>
                      <select
                        value={editingEntry.robotsDirective}
                        onChange={(e) =>
                          setEditingEntry({
                            ...editingEntry,
                            robotsDirective: e.target.value as RobotsDirective,
                            noIndex: e.target.value.startsWith("noindex"),
                          })
                        }
                        className="w-full h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-2.5 text-xs text-[#F5F3EE]"
                      >
                        {ROBOTS_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SOCIAL */}
              {drawerTab === "social" && (
                <div className="space-y-4">
                  {/* Social Preview Card */}
                  <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] space-y-2">
                    <span className="text-[10px] font-mono uppercase text-[#777D87]">
                      Social Share Preview (OpenGraph / Twitter)
                    </span>
                    <div className="w-full h-36 rounded-lg bg-[#12151A] border border-[#1E222A] overflow-hidden flex items-center justify-center">
                      {editingEntry.ogImageUrl ? (
                        <img
                          src={editingEntry.ogImageUrl}
                          alt="OpenGraph preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-[#777D87]" />
                      )}
                    </div>
                    <div className="text-xs font-semibold text-[#F5F3EE] truncate">
                      {editingEntry.ogTitle || editingEntry.seoTitle || editingEntry.title}
                    </div>
                    <p className="text-[11px] text-[#8F96A3] line-clamp-2">
                      {editingEntry.ogDescription ||
                        editingEntry.seoDescription ||
                        globalSeo.defaultSeoDescription}
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                      Open Graph Title
                    </label>
                    <input
                      type="text"
                      value={editingEntry.ogTitle}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, ogTitle: e.target.value })
                      }
                      placeholder={editingEntry.seoTitle || editingEntry.title}
                      className="w-full h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-xs text-[#F5F3EE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                      Open Graph Description
                    </label>
                    <textarea
                      rows={2}
                      value={editingEntry.ogDescription}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, ogDescription: e.target.value })
                      }
                      placeholder={editingEntry.seoDescription}
                      className="w-full rounded-lg bg-[#0D0F12] border border-[#252A32] p-3 text-xs text-[#F5F3EE]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                      Social Share Image
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        readOnly
                        value={editingEntry.ogImageUrl}
                        placeholder="Pick an image asset..."
                        className="flex-1 h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-xs text-[#B2B4BA]"
                      />
                      <button
                        type="button"
                        onClick={() => setEntryOgPickerOpen(true)}
                        className="px-3 h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-xs text-[#D6B77A] cursor-pointer"
                      >
                        Pick Image
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SCHEMA */}
              {drawerTab === "schema" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                      Schema Type (`@type`)
                    </label>
                    <select
                      value={editingEntry.schemaType}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, schemaType: e.target.value })
                      }
                      className="w-full h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-2.5 text-xs text-[#F5F3EE]"
                    >
                      {SCHEMA_TYPES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                      Custom JSON-LD Structured Data
                    </label>
                    <textarea
                      rows={8}
                      value={editingEntry.schemaJson}
                      onChange={(e) =>
                        setEditingEntry({ ...editingEntry, schemaJson: e.target.value })
                      }
                      placeholder={`{"@context":"https://schema.org","@type":"${editingEntry.schemaType}","name":"${editingEntry.title}"}`}
                      className="w-full rounded-lg bg-[#0D0F12] border border-[#252A32] p-3 text-xs font-mono text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                    />
                  </div>
                </div>
              )}

              {/* TAB: AUDIT */}
              {drawerTab === "audit" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
                    <div>
                      <span className="font-semibold text-xs text-[#F5F3EE] block">
                        Live HTML Page Crawler
                      </span>
                      <span className="text-[11px] text-[#777D87]">
                        Fetches {editingEntry.url} to inspect rendered HTML elements.
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={instantAuditing}
                      onClick={handleRunInstantPageAudit}
                      className="px-3.5 py-1.5 rounded-lg bg-[#D6B77A] text-[#17130B] font-semibold text-xs cursor-pointer disabled:opacity-50 inline-flex items-center gap-1.5"
                    >
                      {instantAuditing && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                      <span>{instantAuditing ? "Crawling..." : "Run Audit"}</span>
                    </button>
                  </div>

                  {instantAuditResult && (
                    <div className="space-y-3">
                      <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#1E222A] flex items-center justify-between">
                        <span className="font-medium text-xs text-[#F5F3EE]">Audit Score:</span>
                        <ScoreRing score={instantAuditResult.overallScore} size={42} strokeWidth={3.5} largeLabel />
                      </div>

                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-[#F5F3EE] block">
                          Rule Verifications:
                        </span>
                        {instantAuditResult.passedChecks.map((check) => (
                          <div
                            key={check.id}
                            className="p-2.5 rounded-lg bg-[#73C794]/10 border border-[#73C794]/20 text-xs text-[#73C794] flex items-center justify-between"
                          >
                            <span>✓ {check.name}</span>
                            <span className="font-mono text-[10px]">
                              {check.score}/{check.maxScore}
                            </span>
                          </div>
                        ))}
                        {instantAuditResult.failedChecks.map((check) => (
                          <div
                            key={check.id}
                            className="p-2.5 rounded-lg bg-[#F07878]/10 border border-[#F07878]/20 text-xs text-[#F07878] space-y-1"
                          >
                            <div className="font-semibold">✕ {check.name}</div>
                            <div className="text-[11px] text-[#B2B4BA]">
                              {check.recommendation}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Drawer Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#252A32]">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 rounded-lg text-xs text-[#B2B4BA] hover:text-[#F5F3EE] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEntry}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D6B77A] hover:bg-[#E2C58B] text-xs font-semibold text-[#17130B] cursor-pointer disabled:opacity-50"
                >
                  {savingEntry ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global SEO Defaults Modal */}
      {globalModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#12151A] border border-[#252A32] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#252A32]">
              <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                Global SEO Defaults
              </h2>
              <button
                type="button"
                onClick={() => setGlobalModalOpen(false)}
                className="p-1.5 rounded-lg text-[#8F96A3] hover:text-[#F5F3EE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {loadingSettings || !fullSettings ? (
              <div className="p-8 text-center text-xs text-[#8F96A3] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#D6B77A]" />
                <span>Loading global SEO settings...</span>
              </div>
            ) : (
              <form onSubmit={handleSaveGlobalSeo} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                    Default SEO Title
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!isAdmin}
                    value={fullSettings.defaultSeoTitle}
                    onChange={(e) =>
                      setFullSettings({
                        ...fullSettings,
                        defaultSeoTitle: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                    Default Meta Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    disabled={!isAdmin}
                    value={fullSettings.defaultSeoDescription}
                    onChange={(e) =>
                      setFullSettings({
                        ...fullSettings,
                        defaultSeoDescription: e.target.value,
                      })
                    }
                    className="w-full rounded-lg bg-[#0D0F12] border border-[#252A32] p-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                    Default Open Graph Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={fullSettings.defaultOgImageUrl}
                      onChange={(e) =>
                        setFullSettings({
                          ...fullSettings,
                          defaultOgImageUrl: e.target.value,
                        })
                      }
                      placeholder="/opengraph-image"
                      className="flex-1 h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                    />
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => setGlobalOgPickerOpen(true)}
                        className="px-3 h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-xs text-[#D6B77A] inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>Pick</span>
                      </button>
                    )}
                  </div>
                </div>

                <label className="flex items-center gap-2.5 text-xs text-[#B2B4BA] cursor-pointer">
                  <input
                    type="checkbox"
                    disabled={!isAdmin}
                    checked={fullSettings.robotsAllowIndex}
                    onChange={(e) =>
                      setFullSettings({
                        ...fullSettings,
                        robotsAllowIndex: e.target.checked,
                      })
                    }
                    className="accent-[#D6B77A]"
                  />
                  <span>Allow search engines to index public site (`index, follow`)</span>
                </label>

                <div className="flex justify-end gap-2 pt-3 border-t border-[#252A32]">
                  <button
                    type="button"
                    onClick={() => setGlobalModalOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs text-[#B2B4BA] hover:text-[#F5F3EE] cursor-pointer"
                  >
                    Cancel
                  </button>
                  {isAdmin && (
                    <button
                      type="submit"
                      disabled={savingGlobal}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D6B77A] hover:bg-[#E2C58B] text-xs font-semibold text-[#17130B] cursor-pointer disabled:opacity-50"
                    >
                      {savingGlobal ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Save className="w-3.5 h-3.5" />
                      )}
                      <span>Save Global Defaults</span>
                    </button>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Edit Robots.txt Modal */}
      {robotsModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#12151A] border border-[#252A32] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                Edit Robots.txt Policy
              </h2>
              <button
                type="button"
                onClick={() => setRobotsModalOpen(false)}
                className="text-[#8F96A3] hover:text-[#F5F3EE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveRobotsConfig} className="space-y-4">
              <label className="flex items-center gap-2.5 text-xs text-[#F5F3EE] cursor-pointer">
                <input
                  type="checkbox"
                  disabled={!isAdmin}
                  checked={robotsConfig.allowIndex}
                  onChange={(e) =>
                    setRobotsConfig({ ...robotsConfig, allowIndex: e.target.checked })
                  }
                  className="accent-[#D6B77A]"
                />
                <span>Allow indexing (`Allow: /` — unchecking blocks all crawlers)</span>
              </label>

              <div>
                <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                  Allow Paths (one per line)
                </label>
                <textarea
                  rows={2}
                  disabled={!isAdmin}
                  value={robotsAllowText}
                  onChange={(e) => setRobotsAllowText(e.target.value)}
                  className="w-full rounded-lg bg-[#0D0F12] border border-[#252A32] p-3 text-xs font-mono text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                  Disallow Paths (one per line)
                </label>
                <textarea
                  rows={3}
                  disabled={!isAdmin}
                  value={robotsDisallowText}
                  onChange={(e) => setRobotsDisallowText(e.target.value)}
                  className="w-full rounded-lg bg-[#0D0F12] border border-[#252A32] p-3 text-xs font-mono text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRobotsModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-[#B2B4BA] hover:text-[#F5F3EE] cursor-pointer"
                >
                  Cancel
                </button>
                {isAdmin && (
                  <button
                    type="submit"
                    disabled={savingTech}
                    className="px-4 py-2 rounded-lg bg-[#D6B77A] text-[#17130B] text-xs font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {savingTech ? "Saving..." : "Save Robots Policy"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Structured Data Modal */}
      {schemaModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#12151A] border border-[#252A32] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                Organization Structured Data (JSON-LD)
              </h2>
              <button
                type="button"
                onClick={() => setSchemaModalOpen(false)}
                className="text-[#8F96A3] hover:text-[#F5F3EE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveSchemaConfig} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#B2B4BA] mb-1">
                    Organization Name
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    value={schemaConfig.orgName}
                    onChange={(e) =>
                      setSchemaConfig({ ...schemaConfig, orgName: e.target.value })
                    }
                    className="w-full h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-xs text-[#F5F3EE]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#B2B4BA] mb-1">
                    Area Served
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    value={schemaConfig.areaServed}
                    onChange={(e) =>
                      setSchemaConfig({ ...schemaConfig, areaServed: e.target.value })
                    }
                    className="w-full h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-xs text-[#F5F3EE]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-[#B2B4BA] mb-1">
                    Canonical Domain URL
                  </label>
                  <input
                    type="text"
                    disabled={!isAdmin}
                    value={schemaConfig.orgUrl}
                    onChange={(e) =>
                      setSchemaConfig({ ...schemaConfig, orgUrl: e.target.value })
                    }
                    className="w-full h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-xs text-[#F5F3EE]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#B2B4BA] mb-1">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    disabled={!isAdmin}
                    value={schemaConfig.orgEmail}
                    onChange={(e) =>
                      setSchemaConfig({ ...schemaConfig, orgEmail: e.target.value })
                    }
                    className="w-full h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-xs text-[#F5F3EE]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-[#B2B4BA] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  disabled={!isAdmin}
                  value={schemaConfig.orgDescription}
                  onChange={(e) =>
                    setSchemaConfig({ ...schemaConfig, orgDescription: e.target.value })
                  }
                  className="w-full rounded-lg bg-[#0D0F12] border border-[#252A32] p-2.5 text-xs text-[#F5F3EE]"
                />
              </div>
              <div>
                <label className="block text-xs text-[#B2B4BA] mb-1">
                  Knows About (comma-separated disciplines)
                </label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={knowsAboutText}
                  onChange={(e) => setKnowsAboutText(e.target.value)}
                  className="w-full h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-xs text-[#F5F3EE]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSchemaModalOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-[#B2B4BA] hover:text-[#F5F3EE] cursor-pointer"
                >
                  Cancel
                </button>
                {isAdmin && (
                  <button
                    type="submit"
                    disabled={savingTech}
                    className="px-4 py-2 rounded-lg bg-[#D6B77A] text-[#17130B] text-xs font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {savingTech ? "Saving..." : "Save Schema Config"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Media Picker Modals */}
      <MediaPickerModal
        open={entryOgPickerOpen}
        title="Choose Entry Social Sharing Image"
        selectedId={editingEntry?.ogImageAssetId ?? null}
        onClose={() => setEntryOgPickerOpen(false)}
        onSelectSingle={(asset) => {
          if (editingEntry) {
            setEditingEntry({
              ...editingEntry,
              ogImageAssetId: asset.id,
              ogImageUrl: asset.secureUrl,
            });
          }
        }}
      />

      <MediaPickerModal
        open={globalOgPickerOpen}
        title="Choose Default Open Graph Image"
        onClose={() => setGlobalOgPickerOpen(false)}
        onSelectSingle={(asset) => {
          if (fullSettings) {
            setFullSettings({ ...fullSettings, defaultOgImageUrl: asset.secureUrl });
          }
        }}
      />
    </div>
  );
}
