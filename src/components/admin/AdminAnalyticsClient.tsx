"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  AlertCircle,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart2,
  BarChart3,
  Building,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Compass,
  Download,
  ExternalLink,
  Eye,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  Layers,
  LineChart,
  Loader2,
  Monitor,
  PieChart,
  Radio,
  RefreshCw,
  Search,
  Smartphone,
  Sparkles,
  Tablet,
  TrendingDown,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DeltaMetric {
  current: number;
  previous: number;
  diff: number;
  percentChange: number;
  trend: "up" | "down" | "flat";
}

interface AnalyticsPayload {
  mode?: "realtime" | "benchmark";
  realtime?: {
    activeUsersNow: number;
    activePages: Array<{ path: string; activeCount: number }>;
    isListening: boolean;
    lastUpdated: string;
  };
  reportingPeriod: {
    range: string;
    label: string;
    start: string;
    end: string;
    prevStart: string;
    prevEnd: string;
    lastUpdated: string;
  };
  kpis: {
    visitors: DeltaMetric;
    sessions: DeltaMetric;
    enquiries: DeltaMetric;
    qualifiedLeads: DeltaMetric;
    convertedClients: DeltaMetric;
    conversionRate: DeltaMetric;
    revenue: {
      status: "not_configured" | "active";
      label: string;
      note: string;
      estimatedPipelineUsd: number;
    };
    averageClientValue: {
      value: number;
      currency: string;
      note: string;
    };
  };
  website: {
    visitors: number;
    sessions: number;
    pageviews: number;
    engagedSessions: number;
    engagementRate: number;
    averageEngagementTime: string;
    bounceRate: number;
    deviceCategories: { device: string; percentage: number; sessions: number }[];
    geographicDistribution: { country: string; visitors: number; share: number }[];
    mostVisitedPages: {
      path: string;
      title: string;
      views: number;
      uniqueViews: number;
      avgDuration: string;
    }[];
  };
  acquisition: {
    channel: string;
    trafficVolume: number;
    trafficShare: number;
    enquiriesCount: number;
    qualifiedLeads: number;
    convertedClients: number;
    conversionRate: number;
  }[];
  seo: {
    clicks: number;
    impressions: number;
    ctr: number;
    averagePosition: number;
    topQueries: { query: string; impressions: number; clicks: number; position: number }[];
    topLandingPages: { url: string; clicks: number; impressions: number; ctr: number }[];
  };
  conversionFunnel: {
    stage: string;
    count: number;
    stepConversion: number;
    overallConversion: number;
  }[];
  crm: {
    stages: {
      new: number;
      reviewing: number;
      qualified: number;
      proposal_sent: number;
      won: number;
      lost: number;
      archived: number;
    };
    leadVelocityDays: number;
    proposalAcceptanceRate: number;
  };
  projects: {
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    onTimeDeliveryRate: number;
    averageDurationDays: number;
    delayedProjectsCount: number;
  };
  divisions: {
    name: string;
    enquiries: number;
    qualified: number;
    share: number;
  }[];
  content: {
    topServices: { id: string; title: string; slug: string; views: number }[];
    topCaseStudies: { id: string; title: string; slug: string; views: number }[];
    topArticles: { id: string; title: string; slug: string; views: number }[];
  };
}

const RANGES = [
  { id: "today", label: "Today" },
  { id: "7d", label: "Last 7 Days" },
  { id: "30d", label: "Last 30 Days" },
  { id: "90d", label: "Last 90 Days" },
  { id: "this_month", label: "This Month" },
  { id: "this_quarter", label: "This Quarter" },
  { id: "this_year", label: "This Year" },
];

export function AdminAnalyticsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mode, setMode] = useState<"realtime" | "benchmark">("realtime");
  const [range, setRange] = useState(searchParams.get("range") || "30d");
  const [divisionFilter, setDivisionFilter] = useState<string>("all");
  const [channelFilter, setChannelFilter] = useState<string>("all");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [pingStatus, setPingStatus] = useState<string | null>(null);

  const [data, setData] = useState<AnalyticsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchAnalytics = useCallback(async () => {
    const params = new URLSearchParams({ range, mode });
    if (divisionFilter !== "all") params.set("divisionId", divisionFilter);
    if (channelFilter !== "all") params.set("channel", channelFilter);

    const res = await fetch(`/api/v1/admin/analytics?${params.toString()}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Failed to load business intelligence.");
    }
    return json.data as AnalyticsPayload;
  }, [range, mode, divisionFilter, channelFilter, router]);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    fetchAnalytics()
      .then((payload) => {
        if (!ignore && payload) setData(payload);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Error loading analytics.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [fetchAnalytics]);

  // Real-time background auto-refresh every 12 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const timer = setInterval(() => {
      fetchAnalytics().then((payload) => {
        if (payload) setData(payload);
      });
    }, 12000);
    return () => clearInterval(timer);
  }, [autoRefresh, fetchAnalytics]);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const payload = await fetchAnalytics();
      if (payload) setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  };

  // Trigger test live visit ping to verify tracking live
  const handleTestPing = async () => {
    setPingStatus("Sending test visit ping...");
    try {
      await fetch("/api/v1/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: "/",
          referrer: "https://google.com",
          device: "Desktop",
        }),
      });
      setPingStatus("Test visit recorded! Refreshing metrics...");
      setTimeout(async () => {
        await handleRefresh();
        setPingStatus(null);
      }, 600);
    } catch {
      setPingStatus("Ping failed.");
      setTimeout(() => setPingStatus(null), 2000);
    }
  };

  const kpis = data?.kpis;
  const isZeroTraffic = (data?.website?.visitors ?? 0) === 0 && mode === "realtime";
  const activeUsers = data?.realtime?.activeUsersNow ?? 0;

  return (
    <div className="space-y-6 pb-14">
      {/* ----------------------------------------------------
          A. HEADER: ANALYTICS & REALTIME STATUS
      ---------------------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-b border-[#1E222A] pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F2EC] tracking-tight">
              Analytics &amp; Performance
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#D6B77A]/15 border border-[#D6B77A]/30 text-[#D6B77A]">
              Business Intelligence
            </span>
            {mode === "realtime" ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#56C58B]/15 border border-[#56C58B]/30 text-[#56C58B]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#56C58B] animate-pulse" />
                <span>LIVE REAL-TIME</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#A78BFA]/15 border border-[#A78BFA]/30 text-[#A78BFA]">
                <span>BENCHMARK SIMULATION</span>
              </span>
            )}
          </div>
          <p className="text-sm text-[#8F96A3] mt-1 max-w-2xl">
            Live real-time visitor tracking, conversion velocity, enquiry volume, and business intelligence.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Data Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-[#12151A] border border-[#252A32] text-xs">
            <button
              type="button"
              onClick={() => setMode("realtime")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5",
                mode === "realtime"
                  ? "bg-[#D6B77A] text-[#17130B] font-bold"
                  : "text-[#898D94] hover:text-[#F5F2EC]"
              )}
            >
              <Radio className="w-3 h-3" />
              <span>Real-Time Live</span>
            </button>
            <button
              type="button"
              onClick={() => setMode("benchmark")}
              className={cn(
                "px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer flex items-center gap-1.5",
                mode === "benchmark"
                  ? "bg-[#D6B77A] text-[#17130B] font-bold"
                  : "text-[#898D94] hover:text-[#F5F2EC]"
              )}
            >
              <Sparkles className="w-3 h-3" />
              <span>Benchmark Mode</span>
            </button>
          </div>

          {/* Test Live Ping */}
          <button
            type="button"
            onClick={handleTestPing}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#12151A] border border-[#252A32] hover:border-[#38BDF8] text-xs font-medium text-[#38BDF8] transition-colors cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Test Visit Ping</span>
          </button>

          {/* Refresh Button */}
          <button
            type="button"
            disabled={refreshing}
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] text-xs font-medium text-[#B2B4BA] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-[#D6B77A]", refreshing && "animate-spin")} />
            <span>{refreshing ? "Updating..." : "Refresh"}</span>
          </button>
        </div>
      </div>

      {pingStatus && (
        <div className="px-4 py-2.5 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 text-xs font-mono text-[#38BDF8] flex items-center gap-2 animate-fade-in">
          <Activity className="w-4 h-4 animate-spin" />
          <span>{pingStatus}</span>
        </div>
      )}

      {/* ----------------------------------------------------
          REAL-TIME ACTIVE STATUS STRIP
      ---------------------------------------------------- */}
      <div className="rounded-2xl bg-gradient-to-r from-[#12151A] via-[#10141C] to-[#12151A] border border-[#252A32] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#56C58B] animate-pulse" />
            <span className="font-semibold text-xs text-[#F5F2EC]">
              Active Visitors Right Now:
            </span>
          </div>
          <span className="font-heading font-bold text-lg text-[#56C58B] font-mono">
            {loading ? "..." : activeUsers}
          </span>
          <span className="text-[11px] text-[#898D94] border-l border-[#252A32] pl-3 hidden sm:inline">
            {activeUsers === 0
              ? "Awaiting live public visits"
              : `${activeUsers} active session${activeUsers > 1 ? "s" : ""} in the last 5 minutes`}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <label className="flex items-center gap-1.5 cursor-pointer text-[#898D94] hover:text-[#F5F2EC]">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded border-[#252A32] bg-[#0D0F12] accent-[#56C58B] cursor-pointer"
            />
            <span>Auto-poll (12s)</span>
          </label>

          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1 text-[#D6B77A] hover:underline"
          >
            <span>Open Public Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* ----------------------------------------------------
          ZERO TRAFFIC REALTIME NOTICE (Image / Context parity)
      ---------------------------------------------------- */}
      {isZeroTraffic && (
        <div className="p-4 rounded-2xl bg-[#161B24] border border-[#2B3547] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2 font-semibold text-[#F5F2EC]">
              <Sparkles className="w-4 h-4 text-[#D6B77A]" />
              <span>Real-Time Visitor Tracking Online</span>
            </div>
            <p className="text-[#898D94] text-[11px] leading-relaxed max-w-2xl">
              Zero external visitors recorded for this period yet. The first-party listener is active on all public routes (<code className="text-[#D6B77A] font-mono">/</code>, <code className="text-[#D6B77A] font-mono">/work</code>, <code className="text-[#D6B77A] font-mono">/services</code>, <code className="text-[#D6B77A] font-mono">/contact</code>). As visitors arrive, real traffic counts, device splits, and geographic data will populate automatically.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMode("benchmark")}
            className="px-3.5 py-2 rounded-xl bg-[#1D2433] hover:bg-[#252E40] border border-[#3A4761] text-[#D6B77A] font-medium text-xs whitespace-nowrap cursor-pointer transition-colors"
          >
            View Benchmark Simulation
          </button>
        </div>
      )}

      {/* ----------------------------------------------------
          B. GLOBAL DATE RANGE & MULTI-DIMENSIONAL FILTERS
      ---------------------------------------------------- */}
      <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Date Ranges */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-[#D6B77A] mr-1" />
          {RANGES.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => setRange(r.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                range === r.id
                  ? "bg-[#D6B77A] text-[#17130B] font-semibold"
                  : "bg-[#0D0F12] text-[#8F96A3] hover:text-[#F5F2EC] border border-[#252A32]"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Filters: Division & Channel */}
        <div className="flex items-center gap-2">
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value)}
            className="h-8 rounded-lg bg-[#0D0F12] border border-[#252A32] px-2.5 text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D6B77A]"
          >
            <option value="all">All Divisions</option>
            <option value="branding">Branding &amp; Marketing</option>
            <option value="media">Media Production</option>
            <option value="digital">Web &amp; Digital</option>
            <option value="ai">AI &amp; Automation</option>
          </select>

          <select
            value={channelFilter}
            onChange={(e) => setChannelFilter(e.target.value)}
            className="h-8 rounded-lg bg-[#0D0F12] border border-[#252A32] px-2.5 text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D6B77A]"
          >
            <option value="all">All Channels</option>
            <option value="organic">Organic Search</option>
            <option value="direct">Direct</option>
            <option value="referral">Referral</option>
            <option value="social">Organic Social</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-[#F07878]/10 border border-[#F07878]/30 text-xs text-[#F07878]">
          {error}
        </div>
      )}

      {/* ----------------------------------------------------
          C. BUSINESS PERFORMANCE KPIS WITH COMPARISON
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Visitors */}
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8F96A3]">
            <span>Website Visitors</span>
            <Globe className="w-4 h-4 text-[#7BA9F5]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-[#F5F2EC]">
              {loading ? "—" : kpis?.visitors.current.toLocaleString()}
            </span>
            <span
              className={cn(
                "inline-flex items-center text-[11px] font-mono font-medium",
                (kpis?.visitors.percentChange ?? 0) >= 0 ? "text-[#73C794]" : "text-[#F07878]"
              )}
            >
              {(kpis?.visitors.percentChange ?? 0) >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {Math.abs(kpis?.visitors.percentChange ?? 0)}%
            </span>
          </div>
          <p className="text-[10px] text-[#777D87]">
            vs. {kpis?.visitors.previous.toLocaleString()} in previous period
          </p>
        </div>

        {/* Enquiries Received */}
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8F96A3]">
            <span>Enquiries Received</span>
            <Users className="w-4 h-4 text-[#D6B77A]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-[#F5F2EC]">
              {loading ? "—" : kpis?.enquiries.current}
            </span>
            <span
              className={cn(
                "inline-flex items-center text-[11px] font-mono font-medium",
                (kpis?.enquiries.percentChange ?? 0) >= 0 ? "text-[#73C794]" : "text-[#F07878]"
              )}
            >
              {(kpis?.enquiries.percentChange ?? 0) >= 0 ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {Math.abs(kpis?.enquiries.percentChange ?? 0)}%
            </span>
          </div>
          <p className="text-[10px] text-[#777D87]">
            vs. {kpis?.enquiries.previous} in previous period
          </p>
        </div>

        {/* Lead Conversion Rate */}
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8F96A3]">
            <span>Lead Conversion Rate</span>
            <Zap className="w-4 h-4 text-[#73C794]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-2xl font-bold text-[#F5F2EC]">
              {loading ? "—" : `${kpis?.conversionRate.current}%`}
            </span>
            <span
              className={cn(
                "inline-flex items-center text-[11px] font-mono font-medium",
                (kpis?.conversionRate.diff ?? 0) >= 0 ? "text-[#73C794]" : "text-[#F07878]"
              )}
            >
              {(kpis?.conversionRate.diff ?? 0) >= 0 ? "+" : ""}
              {kpis?.conversionRate.diff}%
            </span>
          </div>
          <p className="text-[10px] text-[#777D87]">
            {kpis?.convertedClients.current} converted clients this period
          </p>
        </div>

        {/* Revenue Performance */}
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8F96A3]">
            <span>Revenue Tracking</span>
            <span className="text-[10px] font-mono text-[#D6B77A] bg-[#D6B77A]/15 px-1.5 py-0.5 rounded">
              Pipeline
            </span>
          </div>
          <div>
            <div className="font-heading text-2xl font-bold text-[#F5F2EC]">
              ${(kpis?.revenue.estimatedPipelineUsd ?? 0).toLocaleString()}
            </div>
            <p className="text-[10px] text-[#777D87] mt-1">
              Estimated pipeline budget value
            </p>
          </div>
          <p className="text-[10px] text-[#5E6570] italic">
            Invoicing integration not connected
          </p>
        </div>
      </div>

      {/* ----------------------------------------------------
          D. CONVERSION FUNNEL (6 Stages)
      ---------------------------------------------------- */}
      <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
          <div>
            <h2 className="font-heading text-base font-semibold text-[#F5F2EC]">
              Enquiry Conversion Funnel
            </h2>
            <p className="text-xs text-[#8F96A3] mt-0.5">
              Visitor intent progression from initial page landing to signed client engagement.
            </p>
          </div>
          <span className="text-xs font-mono text-[#D6B77A]">
            Overall: {data?.conversionFunnel?.[data.conversionFunnel.length - 1]?.overallConversion}%
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {data?.conversionFunnel?.map((step, idx) => (
            <div
              key={step.stage}
              className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-2 relative"
            >
              <div className="text-[10px] font-mono uppercase text-[#777D87]">
                Step 0{idx + 1}
              </div>
              <div className="font-medium text-xs text-[#F5F2EC] truncate">
                {step.stage}
              </div>
              <div className="font-heading text-xl font-bold text-[#F5F2EC]">
                {step.count.toLocaleString()}
              </div>
              <div className="pt-1.5 border-t border-[#1E222A] flex items-center justify-between text-[10px]">
                <span className="text-[#8F96A3]">Step Conv:</span>
                <span className="font-mono text-[#73C794] font-medium">
                  {step.stepConversion}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------
          2-COLUMN SPLIT: ACQUISITION & WEBSITE ENGAGEMENT
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* E. Acquisition Analytics (7 cols) */}
        <div className="lg:col-span-7 rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
            <div>
              <h2 className="font-heading text-sm font-semibold text-[#F5F2EC]">
                Acquisition Channels &amp; Source Attribution
              </h2>
              <p className="text-xs text-[#8F96A3] mt-0.5">
                Session volume, enquiry conversion, and client acquisition by originating marketing channel.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0D0F12] text-[#777D87] font-mono text-[10px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Channel</th>
                  <th className="py-2.5 px-3">Sessions</th>
                  <th className="py-2.5 px-3">Share</th>
                  <th className="py-2.5 px-3">Enquiries</th>
                  <th className="py-2.5 px-3">Qualified</th>
                  <th className="py-2.5 px-3 text-right">Conv. Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E222A]">
                {data?.acquisition?.map((ch) => (
                  <tr key={ch.channel} className="hover:bg-[#191D23]/40">
                    <td className="py-2.5 px-3 font-medium text-[#F5F2EC]">
                      {ch.channel}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#B2B4BA]">
                      {ch.trafficVolume.toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-12 h-1.5 rounded-full bg-[#1E222A] overflow-hidden">
                          <div
                            className="h-full bg-[#D6B77A] rounded-full"
                            style={{ width: `${ch.trafficShare}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-[#777D87]">
                          {ch.trafficShare}%
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#F5F2EC]">
                      {ch.enquiriesCount}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[#73C794]">
                      {ch.qualifiedLeads}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium text-[#D6B77A]">
                      {ch.conversionRate}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* D. Website Engagement & Device Breakdown (5 cols) */}
        <div className="lg:col-span-5 rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
            <h2 className="font-heading text-sm font-semibold text-[#F5F2EC]">
              Website Engagement &amp; Technology
            </h2>
            <span className="text-[10px] font-mono text-[#73C794]">
              {data?.website?.engagementRate}% Engaged
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
              <span className="text-[11px] text-[#8F96A3] block">Pageviews</span>
              <span className="font-heading text-xl font-bold text-[#F5F2EC] mt-1 block">
                {data?.website?.pageviews.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
              <span className="text-[11px] text-[#8F96A3] block">Avg. Session Time</span>
              <span className="font-heading text-xl font-bold text-[#D6B77A] mt-1 block">
                {data?.website?.averageEngagementTime}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="text-xs font-semibold text-[#F5F2EC] block">
              Device Distribution
            </span>
            {data?.website?.deviceCategories?.map((d) => (
              <div key={d.device} className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#B2B4BA] flex items-center gap-1.5">
                    {d.device === "Desktop" && <Monitor className="w-3.5 h-3.5 text-[#7BA9F5]" />}
                    {d.device === "Mobile" && <Smartphone className="w-3.5 h-3.5 text-[#73C794]" />}
                    {d.device === "Tablet" && <Tablet className="w-3.5 h-3.5 text-[#D6B77A]" />}
                    {d.device}
                  </span>
                  <span className="font-mono text-[#777D87]">{d.percentage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-[#1E222A] overflow-hidden">
                  <div
                    className="h-full bg-[#D6B77A] rounded-full"
                    style={{ width: `${d.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2 border-t border-[#1E222A]">
            <span className="text-xs font-semibold text-[#F5F2EC] block">
              Top Geographic Territories
            </span>
            {data?.website?.geographicDistribution && data.website.geographicDistribution.length > 0 ? (
              <div className="flex flex-wrap gap-2 text-[11px]">
                {data.website.geographicDistribution.map((geo) => (
                  <span
                    key={geo.country}
                    className="px-2.5 py-1 rounded-lg bg-[#0D0F12] border border-[#1E222A] text-[#B2B4BA]"
                  >
                    {geo.country}: <strong className="text-[#F5F2EC]">{geo.share}%</strong>
                  </span>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-[#777D87] italic">
                Awaiting geographic visitor sessions...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          F. SEO SEARCH PERFORMANCE & MOST VISITED PAGES
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Search Performance */}
        <div className="lg:col-span-7 rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
            <div>
              <h2 className="font-heading text-sm font-semibold text-[#F5F2EC]">
                Search Performance &amp; Top Queries
              </h2>
              <p className="text-xs text-[#8F96A3] mt-0.5">
                Google Search Console impressions, organic clicks, CTR, and average rank position.
              </p>
            </div>
            <Link
              href="/admin/seo"
              className="text-xs text-[#D6B77A] hover:underline inline-flex items-center gap-1"
            >
              <span>Technical SEO</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
              <span className="text-[#8F96A3] text-[11px] block">Organic Clicks</span>
              <span className="font-heading text-xl font-bold text-[#F5F2EC] mt-1 block">
                {data?.seo?.clicks.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
              <span className="text-[#8F96A3] text-[11px] block">Impressions</span>
              <span className="font-heading text-xl font-bold text-[#F5F2EC] mt-1 block">
                {data?.seo?.impressions.toLocaleString()}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
              <span className="text-[#8F96A3] text-[11px] block">Average CTR</span>
              <span className="font-heading text-xl font-bold text-[#73C794] mt-1 block">
                {data?.seo?.ctr}%
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
              <span className="text-[#8F96A3] text-[11px] block">Average Position</span>
              <span className="font-heading text-xl font-bold text-[#D6B77A] mt-1 block">
                {data?.seo?.averagePosition}
              </span>
            </div>
          </div>

          {data?.seo?.topQueries && data.seo.topQueries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0D0F12] text-[#777D87] font-mono text-[10px] uppercase">
                  <tr>
                    <th className="py-2 px-3">Search Query</th>
                    <th className="py-2 px-3">Impressions</th>
                    <th className="py-2 px-3">Clicks</th>
                    <th className="py-2 px-3 text-right">Avg. Position</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E222A]">
                  {data.seo.topQueries.map((q) => (
                    <tr key={q.query} className="hover:bg-[#191D23]/40">
                      <td className="py-2.5 px-3 font-medium text-[#F5F2EC]">
                        {q.query}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#B2B4BA]">
                        {q.impressions.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 font-mono text-[#73C794]">
                        {q.clicks}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-[#D6B77A]">
                        {q.position}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-[#898D94] italic font-mono border border-dashed border-[#1E222A] rounded-xl">
              Connect Google Search Console in SEO &amp; Metadata to stream verified keyword impressions.
            </div>
          )}
        </div>

        {/* Most Visited Pages */}
        <div className="lg:col-span-5 rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
            <h2 className="font-heading text-sm font-semibold text-[#F5F2EC]">
              Most Visited Pages
            </h2>
            <span className="text-[10px] font-mono text-[#777D87]">Page Engagement</span>
          </div>

          <div className="space-y-3 text-xs">
            {data?.website?.mostVisitedPages && data.website.mostVisitedPages.length > 0 ? (
              data.website.mostVisitedPages.map((p) => (
                <div
                  key={p.path}
                  className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-[#F5F2EC] truncate max-w-[200px]">
                      {p.title}
                    </span>
                    <span className="font-mono text-[#D6B77A] text-[11px]">
                      {p.views.toLocaleString()} views
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[#777D87]">
                    <span className="font-mono">{p.path}</span>
                    <span>Avg: {p.avgDuration}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-[#898D94] italic font-mono border border-dashed border-[#1E222A] rounded-xl">
                No pageview traffic logged yet for this period.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ----------------------------------------------------
          K. SERVICE & DIVISION PERFORMANCE ACROSS 4 DIVISIONS
      ---------------------------------------------------- */}
      <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
          <div>
            <h2 className="font-heading text-base font-semibold text-[#F5F2EC]">
              Service &amp; Division Performance
            </h2>
            <p className="text-xs text-[#8F96A3] mt-0.5">
              Enquiry distribution, qualified leads, and market demand across the four EDYREX operational divisions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data?.divisions?.map((div) => (
            <div
              key={div.name}
              className="p-4 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-[#F5F2EC]">{div.name}</span>
                <span className="text-[10px] font-mono font-bold text-[#D6B77A]">
                  {div.share}%
                </span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-[#1E222A] overflow-hidden">
                <div
                  className="h-full bg-[#D6B77A] rounded-full"
                  style={{ width: `${div.share}%` }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-[#8F96A3]">
                <div>
                  <span className="block text-[10px] text-[#777D87]">Enquiries:</span>
                  <strong className="text-[#F5F2EC] font-mono text-sm">{div.enquiries}</strong>
                </div>
                <div>
                  <span className="block text-[10px] text-[#777D87]">Qualified:</span>
                  <strong className="text-[#73C794] font-mono text-sm">{div.qualified}</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------
          J & L: PROJECT DELIVERY & CONTENT PERFORMANCE
      ---------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Project Delivery Analytics */}
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
            <h2 className="font-heading text-sm font-semibold text-[#F5F2EC]">
              Project Delivery Performance
            </h2>
            <span className="text-xs font-mono text-[#73C794]">
              {data?.projects?.onTimeDeliveryRate}% On-Time Delivery
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
              <span className="text-[#777D87] text-[10px] block">Active Workload</span>
              <span className="font-heading text-xl font-bold text-[#F5F2EC] mt-1 block">
                {data?.projects?.activeProjects}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
              <span className="text-[#777D87] text-[10px] block">Completed</span>
              <span className="font-heading text-xl font-bold text-[#73C794] mt-1 block">
                {data?.projects?.completedProjects}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A]">
              <span className="text-[#777D87] text-[10px] block">Avg. Duration</span>
              <span className="font-heading text-xl font-bold text-[#D6B77A] mt-1 block">
                {data?.projects?.averageDurationDays}d
              </span>
            </div>
          </div>
        </div>

        {/* Content Performance */}
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
            <h2 className="font-heading text-sm font-semibold text-[#F5F2EC]">
              Top Case Studies &amp; Published Content
            </h2>
            <span className="text-[10px] font-mono text-[#777D87]">Portfolio Traffic</span>
          </div>

          <div className="space-y-2 text-xs">
            {data?.content?.topCaseStudies && data.content.topCaseStudies.length > 0 ? (
              data.content.topCaseStudies.map((cs) => (
                <div
                  key={cs.id}
                  className="p-2.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] flex items-center justify-between"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-[#F5F2EC] block truncate">
                      {cs.title}
                    </span>
                    <span className="text-[10px] font-mono text-[#777D87]">
                      /work/{cs.slug}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-[#D6B77A] shrink-0">
                    {cs.views.toLocaleString()} views
                  </span>
                </div>
              ))
            ) : (
              <div className="py-6 text-center text-xs text-[#898D94] italic font-mono">
                No case study views logged yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
