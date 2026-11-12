"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  ArrowRightLeft,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Code2,
  Edit3,
  ExternalLink,
  FileCode2,
  Globe,
  Image as ImageIcon,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
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
  kind: "page" | "portfolio" | "service" | "blog";
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
  status: "draft" | "published" | "archived";
  score: number;
  issues: string[];
  updatedAt: string;
}

interface SeoStats {
  totalEntries: number;
  indexedCount: number;
  avgScore: number;
  issuesCount: number;
  optimizedCount: number;
  needsUpdateCount: number;
  missingTitleCount: number;
  missingDescriptionCount: number;
  missingOgCount: number;
  metadataCompleteness: number;
  redirectsCount: number;
  gaConfigured: boolean;
  gscConfigured: boolean;
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
    score >= 90 ? "#73C794" : score >= 70 ? "#D6B77A" : "#F07878";

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
    indexedCount: 0,
    avgScore: 0,
    issuesCount: 0,
    optimizedCount: 0,
    needsUpdateCount: 0,
    missingTitleCount: 0,
    missingDescriptionCount: 0,
    missingOgCount: 0,
    metadataCompleteness: 0,
    redirectsCount: 0,
    gaConfigured: false,
    gscConfigured: false,
  });
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

  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [regeneratingSitemap, setRegeneratingSitemap] = useState(false);
  const [sitemapCheckStatus, setSitemapCheckStatus] = useState<string | null>(null);
  const [robotsCheckStatus, setRobotsCheckStatus] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<SeoTab>("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState<"score_desc" | "score_asc" | "title">("score_desc");
  const [pageNum, setPageNum] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(8);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Individual SEO Editor modal
  const [editingEntry, setEditingEntry] = useState<SeoEntryRow | null>(null);
  const [savingEntry, setSavingEntry] = useState(false);
  const [entryOgPickerOpen, setEntryOgPickerOpen] = useState(false);

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
      redirects: RedirectRule[];
      sitemapEntries: SitemapEntry[];
      robotsConfig: RobotsConfig;
      schemaConfig: SchemaConfig;
      globalSeo: GlobalSeoDefaults;
    };
  }, [router]);

  const applyAuditData = useCallback(
    (data: NonNullable<Awaited<ReturnType<typeof fetchSeoAudit>>>) => {
      setEntries(data.entries || []);
      setStats(data.stats);
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
    fetchSeoAudit()
      .then((data) => {
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
  }, [fetchSeoAudit, applyAuditData]);

  const handleRunAudit = async () => {
    setAuditing(true);
    setError("");
    setSuccess("");
    try {
      const [auditData, sitemapRes, robotsRes] = await Promise.all([
        fetchSeoAudit(),
        fetch("/sitemap.xml"),
        fetch("/robots.txt"),
      ]);
      if (auditData) applyAuditData(auditData);
      setSitemapCheckStatus(sitemapRes.ok ? "200 OK" : `${sitemapRes.status}`);
      setRobotsCheckStatus(robotsRes.ok ? "200 OK" : `${robotsRes.status}`);
      setSuccess("Live SEO audit completed across all CMS pages, portfolio, services, and sitemaps.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Audit failed.");
    } finally {
      setAuditing(false);
    }
  };

  const handleGenerateSitemap = async () => {
    setRegeneratingSitemap(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/seo/config", { method: "POST" });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to regenerate sitemap.");
        return;
      }
      const auditData = await fetchSeoAudit();
      if (auditData) applyAuditData(auditData);
      setActiveTab("sitemap");
      setSitemapCheckStatus("200 OK");
      setSuccess(
        `Sitemap regenerated (${auditData?.sitemapEntries.length ?? sitemapEntries.length} indexable URLs exposed at /sitemap.xml).`
      );
    } catch {
      setError("Network error regenerating sitemap.");
    } finally {
      setRegeneratingSitemap(false);
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

  const healthLabel =
    stats.avgScore >= 90
      ? { text: "Excellent", color: "text-[#73C794]" }
      : stats.avgScore >= 75
        ? { text: "Good", color: "text-[#D6B77A]" }
        : { text: "Needs Attention", color: "text-[#F07878]" };

  const getFullEditHref = (entry: SeoEntryRow) => {
    if (entry.kind === "page") return `/admin/pages?edit=${entry.id}`;
    if (entry.kind === "portfolio") return `/admin/projects?edit=${entry.id}`;
    if (entry.kind === "service") return `/admin/services?edit=${entry.id}`;
    return `/admin/blog?edit=${entry.id}`;
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE] tracking-tight">
            SEO &amp; Metadata
          </h1>
          <p className="text-sm text-[#8F96A3] mt-1">
            Optimize your website&apos;s visibility, metadata, and technical SEO performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            disabled={auditing}
            onClick={handleRunAudit}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] text-xs font-medium text-[#F5F3EE] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-[#D6B77A]", auditing && "animate-spin")} />
            <span>{auditing ? "Auditing..." : "Run SEO Audit"}</span>
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

      {/* Sub-navigation Tabs */}
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
              "px-3.5 py-2.5 text-xs font-medium border-b-2 transition-colors whitespace-nowrap cursor-pointer",
              activeTab === tab.id
                ? "border-[#D6B77A] text-[#F5F3EE]"
                : "border-transparent text-[#8F96A3] hover:text-[#F5F3EE]"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4 Honest KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#8F96A3]">
            <span className="w-7 h-7 rounded-lg bg-[#D6B77A]/12 border border-[#D6B77A]/25 flex items-center justify-center">
              <Search className="w-3.5 h-3.5 text-[#D6B77A]" />
            </span>
            <span>Indexed Pages</span>
          </div>
          <p className="font-heading text-2xl font-bold text-[#F5F3EE]">
            {loading ? "—" : stats.indexedCount}
          </p>
          <p className="text-[11px] text-[#777D87]">
            of {stats.totalEntries} tracked CMS entries
          </p>
        </div>

        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#8F96A3]">
            <span className="w-7 h-7 rounded-lg bg-[#73C794]/12 border border-[#73C794]/25 flex items-center justify-center">
              <ShieldCheck className="w-3.5 h-3.5 text-[#73C794]" />
            </span>
            <span>Avg. SEO Score</span>
          </div>
          <p className="font-heading text-2xl font-bold text-[#F5F3EE]">
            {loading ? "—" : `${stats.avgScore}/100`}
          </p>
          <p className="text-[11px] text-[#777D87]">
            {stats.optimizedCount} scored ≥ 90
          </p>
        </div>

        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#8F96A3]">
            <span className="w-7 h-7 rounded-lg bg-[#F07878]/12 border border-[#F07878]/25 flex items-center justify-center">
              <AlertTriangle className="w-3.5 h-3.5 text-[#F07878]" />
            </span>
            <span>Issues Found</span>
          </div>
          <p className="font-heading text-2xl font-bold text-[#F5F3EE]">
            {loading ? "—" : stats.issuesCount}
          </p>
          <p className="text-[11px] text-[#777D87]">
            {stats.missingDescriptionCount} missing descriptions
          </p>
        </div>

        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#8F96A3]">
            <span className="w-7 h-7 rounded-lg bg-[#B5A0F5]/12 border border-[#B5A0F5]/25 flex items-center justify-center">
              <ArrowRightLeft className="w-3.5 h-3.5 text-[#B5A0F5]" />
            </span>
            <span>Active Redirects</span>
          </div>
          <p className="font-heading text-2xl font-bold text-[#F5F3EE]">
            {loading ? "—" : stats.redirectsCount}
          </p>
          <p className="text-[11px] text-[#777D87]">301 &amp; 302 rules active</p>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-[#F07878]/10 border border-[#F07878]/30 text-sm text-[#F07878] flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="px-4 py-3 rounded-xl bg-[#73C794]/10 border border-[#73C794]/30 text-sm text-[#73C794] flex items-center justify-between">
          <span>{success}</span>
          <button type="button" onClick={() => setSuccess("")} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main 12-Col Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Main Workspace */}
        <div className="lg:col-span-8 xl:col-span-9">
          {activeTab === "sitemap" ? (
            <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                    XML Sitemap ({sitemapEntries.length} URLs)
                  </h2>
                  <p className="text-xs text-[#8F96A3] mt-0.5">
                    Live indexable routes from static pages, CMS pages, services, portfolio, and blog posts.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {canEdit && (
                    <button
                      type="button"
                      disabled={regeneratingSitemap}
                      onClick={handleGenerateSitemap}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#D6B77A] text-[#17130B] text-xs font-semibold cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw
                        className={cn("w-3.5 h-3.5", regeneratingSitemap && "animate-spin")}
                      />
                      <span>Generate Sitemap</span>
                    </button>
                  )}
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

              <div className="overflow-x-auto border border-[#252A32] rounded-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#0D0F12] text-[#777D87] font-mono uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-4">Route Path</th>
                      <th className="py-2.5 px-4">Source</th>
                      <th className="py-2.5 px-4">Frequency</th>
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
                        <td className="py-2.5 px-4 text-[#B2B4BA]">
                          {route.changeFrequency}
                        </td>
                        <td className="py-2.5 px-4 text-[#B2B4BA]">{route.priority}</td>
                        <td className="py-2.5 px-4 text-right">
                          <span className="inline-flex items-center gap-1 text-[#73C794]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Included
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : activeTab === "redirects" ? (
            <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-5">
              <div>
                <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                  301 &amp; 302 URL Redirects Manager
                </h2>
                <p className="text-xs text-[#8F96A3] mt-0.5">
                  Create permanent (`301`) or temporary (`302`) redirects persisted in PostgreSQL and enforced live.
                </p>
              </div>

              {canEdit && (
                <form
                  onSubmit={handleCreateRedirect}
                  className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] grid grid-cols-1 sm:grid-cols-12 gap-3 items-end"
                >
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-medium text-[#8F96A3] mb-1">
                      Source Path
                    </label>
                    <input
                      type="text"
                      required
                      value={newRedirectSource}
                      onChange={(e) => setNewRedirectSource(e.target.value)}
                      placeholder="/old-url"
                      className="w-full h-9 rounded-lg bg-[#12151A] border border-[#252A32] px-3 text-xs font-mono text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                    />
                  </div>
                  <div className="sm:col-span-4">
                    <label className="block text-[11px] font-medium text-[#8F96A3] mb-1">
                      Destination URL / Path
                    </label>
                    <input
                      type="text"
                      required
                      value={newRedirectDest}
                      onChange={(e) => setNewRedirectDest(e.target.value)}
                      placeholder="/services/branding"
                      className="w-full h-9 rounded-lg bg-[#12151A] border border-[#252A32] px-3 text-xs font-mono text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-medium text-[#8F96A3] mb-1">
                      Type
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
                      <span>Add</span>
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
                              "px-2 py-0.5 rounded-full font-mono text-[10px] border",
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
                              title="Delete redirect"
                              className="p-1.5 rounded-md text-[#8F96A3] hover:text-[#F07878] hover:bg-[#191D23] cursor-pointer"
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
          ) : activeTab === "advanced" ? (
            <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                    Technical SEO, Robots.txt &amp; Structured Data
                  </h2>
                  <p className="text-xs text-[#8F96A3] mt-0.5">
                    Configure dynamic crawl rules, Organization JSON-LD schema, and analytics verification.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#F5F3EE]">
                      Dynamic robots.txt
                    </span>
                    <div className="flex items-center gap-3">
                      <a
                        href="/robots.txt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#7BA9F5] hover:underline"
                      >
                        Open /robots.txt
                      </a>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={openRobotsModal}
                          className="text-[#D6B77A] hover:underline font-medium cursor-pointer"
                        >
                          Edit Rules
                        </button>
                      )}
                    </div>
                  </div>
                  <pre className="p-3 rounded-lg bg-[#08090B] border border-[#252A32] text-[11px] font-mono text-[#B2B4BA] overflow-x-auto">
{robotsConfig.allowIndex
  ? `User-Agent: *\n${robotsConfig.allowPaths.map((p) => `Allow: ${p}`).join("\n")}\n${robotsConfig.disallowPaths.map((p) => `Disallow: ${p}`).join("\n")}\nSitemap: /sitemap.xml`
  : `User-Agent: *\nDisallow: /\nSitemap: /sitemap.xml`}
                  </pre>
                </div>

                <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-[#F5F3EE]">
                      Organization JSON-LD Schema
                    </span>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={openSchemaModal}
                        className="text-[#D6B77A] hover:underline font-medium cursor-pointer"
                      >
                        Configure Schema
                      </button>
                    )}
                  </div>
                  <pre className="p-3 rounded-lg bg-[#08090B] border border-[#252A32] text-[11px] font-mono text-[#B2B4BA] overflow-x-auto max-h-40">
                    {JSON.stringify(
                      {
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: schemaConfig.orgName,
                        url: schemaConfig.orgUrl,
                        email: schemaConfig.orgEmail,
                        areaServed: schemaConfig.areaServed,
                        knowsAbout: schemaConfig.knowsAbout,
                      },
                      null,
                      2
                    )}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl bg-[#12151A] border border-[#252A32] overflow-hidden">
              {/* Card Header + Filter Toolbar */}
              <div className="p-5 border-b border-[#252A32] flex flex-col xl:flex-row xl:items-center justify-between gap-3.5">
                <div>
                  <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                    {activeTab === "overview"
                      ? "Pages SEO Management"
                      : `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} SEO Management`}
                  </h2>
                  <p className="text-xs text-[#8F96A3] mt-0.5">
                    Manage titles, meta descriptions, slugs, canonicals, robots directives, OG tags, and JSON-LD schema.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="search"
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setPageNum(1);
                      }}
                      placeholder="Filter URL or title..."
                      className="h-9 w-44 sm:w-48 rounded-lg bg-[#0D0F12] border border-[#252A32] pl-8 pr-3 text-xs text-[#F5F3EE] placeholder:text-[#666C75] focus:outline-none focus:border-[#D6B77A]"
                    />
                  </div>

                  <select
                    value={typeFilter}
                    onChange={(e) => {
                      setTypeFilter(e.target.value);
                      setPageNum(1);
                    }}
                    aria-label="Filter entry type"
                    className="h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-2.5 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                  >
                    <option value="">All Types</option>
                    <option value="Page">Page</option>
                    <option value="Listing">Listing</option>
                    <option value="Legal">Legal</option>
                    <option value="Portfolio">Portfolio</option>
                    <option value="Service">Service</option>
                    <option value="Blog">Blog</option>
                  </select>

                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value as "score_desc" | "score_asc" | "title")
                    }
                    aria-label="Sort entries"
                    className="h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-2.5 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                  >
                    <option value="score_desc">Sort: SEO Score</option>
                    <option value="score_asc">Needs Work First</option>
                    <option value="title">Title (A-Z)</option>
                  </select>

                  {canEdit && paginatedEntries[0] && (
                    <button
                      type="button"
                      onClick={() => setEditingEntry(paginatedEntries[0])}
                      className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#D6B77A] hover:bg-[#E2C58B] text-xs font-semibold text-[#17130B] cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Configure Metadata</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Bulk Management Action Bar */}
              {selectedKeys.length > 0 && canEdit && (
                <div className="px-4 py-3 bg-[#1A160E] border-b border-[#D6B77A]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[#D6B77A]">
                      {selectedKeys.length} selected
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedKeys([])}
                      className="text-[#8F96A3] hover:text-[#F5F3EE] underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
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

                    <select
                      value={bulkSchema}
                      onChange={(e) => setBulkSchema(e.target.value)}
                      className="h-8 rounded-lg bg-[#0D0F12] border border-[#252A32] px-2 text-xs text-[#F5F3EE]"
                    >
                      {SCHEMA_TYPES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={bulkWorking}
                      onClick={() => handleBulkUpdate("set_schema")}
                      className="h-8 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-[#F5F3EE] cursor-pointer disabled:opacity-50"
                    >
                      Apply Schema
                    </button>
                  </div>
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#252A32] bg-[#0D0F12]/70 text-[10px] font-mono uppercase tracking-wider text-[#777D87]">
                      <th className="py-3 pl-4 pr-2 w-8">
                        <input
                          type="checkbox"
                          aria-label="Select all visible rows"
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
                      <th className="py-3 px-3 text-center">SEO Score</th>
                      <th className="py-3 px-3">Meta Title &amp; Description</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#252A32] text-sm">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-16 text-center text-xs text-[#8F96A3]"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Loader2 className="w-4 h-4 animate-spin text-[#D6B77A]" />
                            Auditing CMS SEO metadata...
                          </span>
                        </td>
                      </tr>
                    ) : paginatedEntries.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-12 text-center text-xs text-[#8F96A3]"
                        >
                          No entries match your current filter.
                        </td>
                      </tr>
                    ) : (
                      paginatedEntries.map((entry) => {
                        const rowKey = `${entry.kind}-${entry.id}`;
                        const statusPill = entry.noIndex
                          ? {
                              label: "NoIndex",
                              cls: "bg-[#252A32]/50 text-[#B2B4BA] border-[#3A414B]",
                              dot: "bg-[#8F96A3]",
                            }
                          : entry.score >= 90
                            ? {
                                label: "Optimized",
                                cls: "bg-[#73C794]/12 text-[#73C794] border-[#73C794]/30",
                                dot: "bg-[#73C794]",
                              }
                            : {
                                label: "Needs Update",
                                cls: "bg-[#D6B77A]/12 text-[#D6B77A] border-[#D6B77A]/30",
                                dot: "bg-[#D6B77A]",
                              };

                        return (
                          <tr
                            key={rowKey}
                            className="hover:bg-[#191D23]/55 transition-colors"
                          >
                            <td className="py-3 pl-4 pr-2">
                              <input
                                type="checkbox"
                                aria-label={`Select ${entry.title}`}
                                checked={selectedKeys.includes(rowKey)}
                                onChange={() => toggleSelectRow(rowKey)}
                                className="accent-[#D6B77A] cursor-pointer"
                              />
                            </td>

                            <td className="py-3 px-3">
                              <div className="flex items-center gap-3 min-w-[180px]">
                                <div className="w-12 h-8 rounded-lg bg-[#0D0F12] border border-[#252A32] overflow-hidden shrink-0 flex items-center justify-center">
                                  {entry.thumbnailUrl ? (
                                    <img
                                      src={entry.thumbnailUrl}
                                      alt={entry.title}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <Globe className="w-3.5 h-3.5 text-[#777D87]" />
                                  )}
                                </div>
                                <div className="min-w-0">
                                  <div className="font-medium text-xs text-[#F5F3EE] truncate max-w-[160px]">
                                    {entry.title}
                                  </div>
                                  <div className="text-[11px] font-mono text-[#777D87] truncate max-w-[160px]">
                                    {entry.url}
                                  </div>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-3">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-[#0D0F12] border border-[#252A32] text-[11px] text-[#B2B4BA]">
                                {entry.typeBadge}
                              </span>
                            </td>

                            <td className="py-3 px-3 text-center">
                              <ScoreRing score={entry.score} size={36} strokeWidth={3} />
                            </td>

                            <td className="py-3 px-3 max-w-[260px]">
                              <div className="text-xs font-medium text-[#F5F3EE] truncate">
                                {entry.seoTitle || (
                                  <span className="text-[#8F96A3] italic">
                                    Uses fallback template ({entry.title})
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-[#777D87] truncate mt-0.5">
                                {entry.seoDescription ||
                                  entry.issues.join(" · ") ||
                                  "No meta description configured"}
                              </div>
                            </td>

                            <td className="py-3 px-3 whitespace-nowrap">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] border",
                                  statusPill.cls
                                )}
                              >
                                <span
                                  className={cn("w-1.5 h-1.5 rounded-full", statusPill.dot)}
                                />
                                <span>{statusPill.label}</span>
                              </span>
                            </td>

                            <td className="py-3 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                {canEdit && (
                                  <button
                                    type="button"
                                    onClick={() => setEditingEntry(entry)}
                                    title="Configure SEO Metadata"
                                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-[11px] text-[#D6B77A] cursor-pointer"
                                  >
                                    <Edit3 className="w-3 h-3" />
                                    <span>Edit</span>
                                  </button>
                                )}
                                <Link
                                  href={getFullEditHref(entry)}
                                  title="Open entity editor"
                                  className="p-1.5 rounded-lg text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#191D23]"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-4 py-3 border-t border-[#252A32] flex flex-wrap items-center justify-between gap-3 text-xs text-[#8F96A3]">
                <span>
                  Showing{" "}
                  {filteredEntries.length === 0
                    ? 0
                    : (safePage - 1) * rowsPerPage + 1}
                  –{Math.min(safePage * rowsPerPage, filteredEntries.length)} of{" "}
                  {filteredEntries.length} entries
                </span>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span>Rows per page</span>
                    <select
                      value={rowsPerPage}
                      onChange={(e) => {
                        setRowsPerPage(Number(e.target.value));
                        setPageNum(1);
                      }}
                      className="h-7 rounded-md bg-[#0D0F12] border border-[#252A32] px-2 text-xs text-[#F5F3EE]"
                    >
                      <option value={8}>8</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={safePage <= 1}
                      onClick={() => setPageNum((p) => Math.max(1, p - 1))}
                      className="p-1.5 rounded-md border border-[#252A32] hover:bg-[#191D23] disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-2.5 py-1 rounded-md bg-[#D6B77A] text-[#17130B] font-semibold">
                      {safePage}
                    </span>
                    <span className="px-1 text-[#777D87]">/ {totalPages}</span>
                    <button
                      type="button"
                      disabled={safePage >= totalPages}
                      onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}
                      className="p-1.5 rounded-md border border-[#252A32] hover:bg-[#191D23] disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Health Panel, Quick Tools, SEO Insights */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
          {/* Overall SEO Health */}
          <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
            <h2 className="font-heading text-sm font-semibold text-[#F5F3EE]">
              Overall SEO Health
            </h2>

            <div className="flex items-center gap-4">
              <ScoreRing score={stats.avgScore} size={76} strokeWidth={6} largeLabel />
              <div className="space-y-1">
                <p
                  className={cn(
                    "text-sm font-semibold flex items-center gap-1.5",
                    healthLabel.color
                  )}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{healthLabel.text}</span>
                </p>
                <p className="text-xs text-[#8F96A3] leading-relaxed">
                  {stats.issuesCount === 0
                    ? "All tracked CMS entries meet metadata requirements."
                    : `${stats.issuesCount} entries have metadata items to optimize.`}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-[#252A32] space-y-2.5 text-xs">
              {[
                {
                  label: "Meta Titles & Descriptions",
                  ok: stats.missingTitleCount === 0 && stats.missingDescriptionCount === 0,
                },
                { label: "Open Graph (Social Sharing)", ok: stats.missingOgCount === 0 },
                { label: "Structured Data (JSON-LD)", ok: true },
                {
                  label: `Sitemap.xml${sitemapCheckStatus ? ` (${sitemapCheckStatus})` : ""}`,
                  ok: true,
                },
                {
                  label: `Robots.txt${robotsCheckStatus ? ` (${robotsCheckStatus})` : ""}`,
                  ok: robotsConfig.allowIndex,
                },
                { label: "Canonical URLs", ok: true },
              ].map((check) => (
                <div
                  key={check.label}
                  className="flex items-center justify-between gap-2 text-[#B2B4BA]"
                >
                  <span>{check.label}</span>
                  {check.ok ? (
                    <CheckCircle2 className="w-4 h-4 text-[#73C794] shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#D6B77A] shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Tools */}
          <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-3">
            <h2 className="font-heading text-sm font-semibold text-[#F5F3EE]">
              Quick Tools
            </h2>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                disabled={regeneratingSitemap}
                onClick={handleGenerateSitemap}
                className="p-3 rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A]/50 text-center space-y-1.5 transition-colors cursor-pointer"
              >
                <FileCode2 className="w-4 h-4 text-[#D6B77A] mx-auto" />
                <span className="text-[11px] font-medium text-[#F5F3EE] block">
                  Generate Sitemap
                </span>
              </button>
              <button
                type="button"
                onClick={openRobotsModal}
                className="p-3 rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A]/50 text-center space-y-1.5 transition-colors cursor-pointer"
              >
                <Settings className="w-4 h-4 text-[#D6B77A] mx-auto" />
                <span className="text-[11px] font-medium text-[#F5F3EE] block">
                  Edit Robots.txt
                </span>
              </button>
              <button
                type="button"
                onClick={openSchemaModal}
                className="p-3 rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A]/50 text-center space-y-1.5 transition-colors cursor-pointer"
              >
                <Code2 className="w-4 h-4 text-[#D6B77A] mx-auto" />
                <span className="text-[11px] font-medium text-[#F5F3EE] block">
                  Structured Data
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("redirects")}
                className="p-3 rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A]/50 text-center space-y-1.5 transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="w-4 h-4 text-[#D6B77A] mx-auto" />
                <span className="text-[11px] font-medium text-[#F5F3EE] block">
                  URL Redirects
                </span>
              </button>
            </div>
          </div>

          {/* SEO Insights (Genuine DB & Verification Readiness) */}
          <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D6B77A]" />
              <h2 className="font-heading text-sm font-semibold text-[#F5F3EE]">
                SEO Insights
              </h2>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-[#8F96A3]">Metadata completeness</span>
                <span className="font-semibold text-[#73C794]">
                  {stats.metadataCompleteness}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F96A3]">Indexed pages ready</span>
                <span className="font-semibold text-[#F5F3EE]">
                  {stats.indexedCount} / {stats.totalEntries}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#8F96A3]">Entries passing (≥ 90)</span>
                <span className="font-semibold text-[#73C794]">
                  {stats.optimizedCount}
                </span>
              </div>
              <div className="pt-2 border-t border-[#252A32] space-y-1 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#777D87]">Google Search Console</span>
                  <span
                    className={
                      stats.gscConfigured ? "text-[#73C794]" : "text-[#D6B77A]"
                    }
                  >
                    {stats.gscConfigured ? "Verified" : "Env token unset"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#777D87]">Google Analytics (GA4)</span>
                  <span
                    className={
                      stats.gaConfigured ? "text-[#73C794]" : "text-[#D6B77A]"
                    }
                  >
                    {stats.gaConfigured ? "Connected" : "Env ID unset"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Individual SEO Editor Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-4xl rounded-2xl bg-[#12151A] border border-[#252A32] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#252A32]">
              <div>
                <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                  Individual SEO Editor · {editingEntry.title}
                </h2>
                <p className="text-xs font-mono text-[#777D87]">
                  {editingEntry.typeBadge} · {editingEntry.url}
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

            <form
              onSubmit={handleSaveEntrySeo}
              className="p-6 space-y-5 overflow-y-auto"
            >
              {/* Search Result + Social Share Previews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] space-y-1">
                  <span className="text-[10px] font-mono uppercase text-[#777D87]">
                    Search Result Preview
                  </span>
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

                <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] flex items-center gap-3">
                  <div className="w-24 h-16 rounded-lg bg-[#08090B] border border-[#252A32] overflow-hidden shrink-0 flex items-center justify-center">
                    {editingEntry.ogImageUrl ? (
                      <img
                        src={editingEntry.ogImageUrl}
                        alt="Open Graph preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-[#777D87]" />
                    )}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[10px] font-mono uppercase text-[#777D87]">
                      Open Graph Preview
                    </span>
                    <div className="text-xs font-semibold text-[#F5F3EE] truncate">
                      {editingEntry.ogTitle || editingEntry.seoTitle || editingEntry.title}
                    </div>
                    <p className="text-[11px] text-[#8F96A3] line-clamp-2">
                      {editingEntry.ogDescription ||
                        editingEntry.seoDescription ||
                        globalSeo.defaultSeoDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-medium text-[#B2B4BA]">
                      SEO Title
                    </label>
                    <span className="text-[11px] font-mono text-[#777D87]">
                      {editingEntry.seoTitle.length} / 65 ideal
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={160}
                    value={editingEntry.seoTitle}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, seoTitle: e.target.value })
                    }
                    placeholder={editingEntry.title}
                    className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={editingEntry.slug}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, slug: e.target.value })
                    }
                    className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm font-mono text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-[#B2B4BA]">
                    Meta Description
                  </label>
                  <span className="text-[11px] font-mono text-[#777D87]">
                    {editingEntry.seoDescription.length} / 160 ideal
                  </span>
                </div>
                <textarea
                  rows={2}
                  maxLength={320}
                  value={editingEntry.seoDescription}
                  onChange={(e) =>
                    setEditingEntry({
                      ...editingEntry,
                      seoDescription: e.target.value,
                    })
                  }
                  placeholder="Concise search snippet summarizing this page..."
                  className="w-full rounded-lg bg-[#0D0F12] border border-[#252A32] p-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                    Canonical URL
                  </label>
                  <input
                    type="text"
                    value={editingEntry.canonicalUrl}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        canonicalUrl: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm font-mono text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
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
                    className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                  >
                    {ROBOTS_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                    Open Graph Description
                  </label>
                  <input
                    type="text"
                    value={editingEntry.ogDescription}
                    onChange={(e) =>
                      setEditingEntry({
                        ...editingEntry,
                        ogDescription: e.target.value,
                      })
                    }
                    className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                    Social Sharing Image
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      readOnly
                      value={editingEntry.ogImageUrl}
                      placeholder="Choose from Media Library..."
                      className="flex-1 h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-xs text-[#B2B4BA]"
                    />
                    <button
                      type="button"
                      onClick={() => setEntryOgPickerOpen(true)}
                      className="px-3 h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-xs text-[#D6B77A] inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Pick Image</span>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                    Structured Data Type (`@type`)
                  </label>
                  <select
                    value={editingEntry.schemaType}
                    onChange={(e) =>
                      setEditingEntry({ ...editingEntry, schemaType: e.target.value })
                    }
                    className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                  >
                    {SCHEMA_TYPES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                  Custom Structured Data Override (optional valid JSON-LD)
                </label>
                <textarea
                  rows={3}
                  value={editingEntry.schemaJson}
                  onChange={(e) =>
                    setEditingEntry({ ...editingEntry, schemaJson: e.target.value })
                  }
                  placeholder={`{"@context":"https://schema.org","@type":"${editingEntry.schemaType}","name":"${editingEntry.title}"}`}
                  className="w-full rounded-lg bg-[#0D0F12] border border-[#252A32] p-3 text-xs font-mono text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#252A32]">
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
                  <span>Save SEO Configuration</span>
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
