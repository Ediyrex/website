"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Eye,
  FileText,
  Filter,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Phone,
  Plus,
  Search,
  SlidersHorizontal,
  Target,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  Building,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "./AdminContext";
import { CrmClientsView } from "./crm/CrmClientsView";
import { CrmFollowupsView } from "./crm/CrmFollowupsView";
import {
  AddClientModal,
  AddInquiryModal,
  ConvertToClientModal,
  CreateFollowupModal,
  CreatePmsProjectModal,
  LeadDetailModal,
} from "./crm/CrmModals";
import {
  PIPELINE_STAGES,
  formatDueBadge,
  formatRelativeDate,
  formatSourceLabel,
  getInitials,
  getStatusMeta,
  type CrmClientRow,
  type CrmDashboardPayload,
  type CrmFollowupRow,
  type CrmView,
  type EnquiryDetail,
  type EnquiryStatus,
  type EnquirySummary,
} from "./crm/crm-types";

export function AdminInquiriesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, canEdit } = useAdminUser();
  const isAdmin = user.roles.includes("admin");

  const viewParam = searchParams.get("view");
  const activeView: CrmView =
    viewParam === "clients"
      ? "clients"
      : viewParam === "followups"
        ? "followups"
        : "leads";

  const switchView = (next: CrmView) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "leads") {
      params.delete("view");
    } else {
      params.set("view", next);
    }
    const qs = params.toString();
    router.replace(qs ? `/admin/inquiries?${qs}` : "/admin/inquiries");
  };

  // Leads state
  const [statusFilter, setStatusFilter] = useState<string>(
    searchParams.get("status") || "all"
  );
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [savedView, setSavedView] = useState("all");
  const [windowFilter, setWindowFilter] = useState<"all" | "30d" | "7d">("all");
  const [pipelineWindow, setPipelineWindow] = useState<"30d" | "all">("30d");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Date range dropdown
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const [dashboard, setDashboard] = useState<CrmDashboardPayload>({
    enquiries: [],
    kpis: {
      totalInquiries: 0,
      inquiriesLast30Days: 0,
      activeLeads: 0,
      inDiscussionCount: 0,
      totalClients: 0,
      activeClients: 0,
      convertedLeads: 0,
      avgResponseHours: null,
      respondedCount: 0,
      overdueFollowupsCount: 0,
    },
    statusCounts: {},
    pipelineCounts: {},
    upcomingFollowups: [],
    serviceOptions: [],
    sourceOptions: [],
  });
  const [paginationMeta, setPaginationMeta] = useState({
    total: 0,
    totalPages: 1,
  });
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [bannerError, setBannerError] = useState("");
  const [bannerSuccess, setBannerSuccess] = useState("");

  // Clients view state
  const [clientsData, setClientsData] = useState<CrmClientRow[]>([]);
  const [clientCounts, setClientCounts] = useState({
    all: 0,
    active: 0,
    archived: 0,
  });
  const [clientStatusFilter, setClientStatusFilter] = useState<
    "all" | "active" | "archived"
  >("all");
  const [clientSearch, setClientSearch] = useState("");
  const [loadingClients, setLoadingClients] = useState(false);

  // Follow-ups view state
  const [followupsData, setFollowupsData] = useState<CrmFollowupRow[]>([]);
  const [followupCounts, setFollowupCounts] = useState({
    upcoming: 0,
    overdue: 0,
    completed: 0,
    all: 0,
  });
  const [followupFilter, setFollowupFilter] = useState<
    "upcoming" | "overdue" | "completed" | "all"
  >("upcoming");
  const [loadingFollowups, setLoadingFollowups] = useState(false);

  // Modals & inspector state
  const [showAddInquiry, setShowAddInquiry] = useState(false);
  const [showAddClient, setShowAddClient] = useState(false);
  const [followupModalTarget, setFollowupModalTarget] = useState<{
    open: boolean;
    enquiryId?: string | null;
    clientId?: string | null;
  }>({ open: false });
  const [convertModal, setConvertModal] = useState<{
    open: boolean;
    enquiry?: EnquirySummary | null;
  }>({ open: false });
  const [pmsProjectModal, setPmsProjectModal] = useState<{
    open: boolean;
    client?: CrmClientRow | null;
    enquiry?: EnquirySummary | null;
  }>({ open: false });

  const [detailEnquiry, setDetailEnquiry] = useState<EnquiryDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const loadDashboard = useCallback(async () => {
    setLoadingLeads(true);
    setBannerError("");
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: String(limit),
        window: windowFilter,
        pipelineWindow,
      });
      if (statusFilter !== "all") params.set("status", statusFilter);
      if (serviceFilter !== "all") params.set("service", serviceFilter);
      if (sourceFilter !== "all") params.set("source", sourceFilter);
      if (searchQuery.trim()) params.set("q", searchQuery.trim());

      const res = await fetch(`/api/v1/admin/enquiries?${params.toString()}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setBannerError(json.message || "Unable to fetch CRM leads.");
        return;
      }
      setDashboard(json.data);
      setPaginationMeta({
        total: json.meta?.total ?? json.data.enquiries.length,
        totalPages: json.meta?.totalPages ?? 1,
      });
    } catch {
      setBannerError("Network error loading CRM workspace.");
    } finally {
      setLoadingLeads(false);
    }
  }, [
    limit,
    page,
    pipelineWindow,
    router,
    searchQuery,
    serviceFilter,
    sourceFilter,
    statusFilter,
    windowFilter,
  ]);

  const loadClients = useCallback(async () => {
    setLoadingClients(true);
    try {
      const params = new URLSearchParams({ status: clientStatusFilter });
      if (clientSearch.trim()) params.set("q", clientSearch.trim());
      const res = await fetch(`/api/v1/admin/crm/clients?${params.toString()}`);
      const json = await res.json();
      if (res.ok) {
        setClientsData(json.data.clients);
        setClientCounts(json.data.counts);
      }
    } catch {
      // quiet
    } finally {
      setLoadingClients(false);
    }
  }, [clientSearch, clientStatusFilter]);

  const loadFollowups = useCallback(async () => {
    setLoadingFollowups(true);
    try {
      const params = new URLSearchParams({ filter: followupFilter });
      const res = await fetch(`/api/v1/admin/crm/followups?${params.toString()}`);
      const json = await res.json();
      if (res.ok) {
        setFollowupsData(json.data.followups);
        setFollowupCounts(json.data.counts);
      }
    } catch {
      // quiet
    } finally {
      setLoadingFollowups(false);
    }
  }, [followupFilter]);

  const refreshAll = useCallback(() => {
    loadDashboard();
    loadClients();
    loadFollowups();
  }, [loadDashboard, loadClients, loadFollowups]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    if (activeView === "clients") {
      loadClients();
    } else if (activeView === "followups") {
      loadFollowups();
    }
  }, [activeView, loadClients, loadFollowups]);

  const openEnquiryDetail = async (id: string) => {
    setLoadingDetail(true);
    setDetailOpen(true);
    try {
      const res = await fetch(`/api/v1/admin/enquiries/${id}`);
      const json = await res.json();
      if (res.ok) {
        setDetailEnquiry(json.data);
      }
    } catch {
      setBannerError("Failed to fetch inquiry details.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: EnquiryStatus) => {
    const res = await fetch(`/api/v1/admin/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      if (detailOpen && detailEnquiry?.id === id) {
        await openEnquiryDetail(id);
      }
      setBannerSuccess(`Lead marked as ${status}.`);
      await loadDashboard();
    }
  };

  const handleDeleteEnquiry = async (id: string) => {
    if (!confirm("Are you sure you want to delete this inquiry?")) return;
    const res = await fetch(`/api/v1/admin/enquiries/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setDetailOpen(false);
      setDetailEnquiry(null);
      setBannerSuccess("Inquiry deleted.");
      await loadDashboard();
    }
  };

  const handleToggleFollowup = async (id: string, completed: boolean) => {
    const res = await fetch(`/api/v1/admin/crm/followups/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed }),
    });
    if (res.ok) {
      if (detailOpen && detailEnquiry) {
        await openEnquiryDetail(detailEnquiry.id);
      }
      refreshAll();
    }
  };

  const handleDeleteFollowup = async (id: string) => {
    const res = await fetch(`/api/v1/admin/crm/followups/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      refreshAll();
    }
  };

  const handleToggleClientStatus = async (client: CrmClientRow) => {
    const nextStatus = client.status === "active" ? "archived" : "active";
    const res = await fetch(`/api/v1/admin/crm/clients/${client.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) {
      refreshAll();
    }
  };

  // CSV Export
  const handleExport = () => {
    const enquiriesToExport = dashboard.enquiries;
    if (enquiriesToExport.length === 0) {
      setBannerError("No records available to export.");
      return;
    }
    const headers = [
      "Reference",
      "Contact Name",
      "Email",
      "Company",
      "Service",
      "Status",
      "Source",
      "Submitted At",
    ];
    const rows = enquiriesToExport.map((e) => [
      e.referenceCode,
      `"${e.contactName.replace(/"/g, '""')}"`,
      e.emailNormalized,
      `"${(e.companyName || "").replace(/"/g, '""')}"`,
      `"${e.projectType.replace(/"/g, '""')}"`,
      e.status,
      e.source,
      e.submittedAt,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `ediyrex-crm-leads-${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const AVATAR_PALETTE = [
    "bg-[#2D1F3D] text-[#C084FC]",
    "bg-[#162738] text-[#38BDF8]",
    "bg-[#153226] text-[#34D399]",
    "bg-[#281D3B] text-[#A78BFA]",
    "bg-[#162B3D] text-[#60A5FA]",
  ];

  const getAvatarBg = (seed: string): string => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = (hash << 5) - hash + seed.charCodeAt(i);
      hash |= 0;
    }
    return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
  };

  const formatShortDate = (isoString?: string | null): string => {
    if (!isoString) return "—";
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return "—";
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "—";
    }
  };

  const displayRows = useMemo(() => {
    return dashboard.enquiries.map((row) => {
      const priority =
        (row as any).priority ||
        ((row.budgetMax && row.budgetMax >= 25000) || row.wantsDiscoveryCall
          ? "High"
          : (row.budgetMax && row.budgetMax >= 10000) ||
            row.status === "qualified" ||
            row.status === "proposal_sent"
          ? "Medium"
          : "Low");

      const ownerInitials = (row as any).ownerInitials || "EA";
      const nextFollowup = (row as any).nextFollowupAt
        ? formatShortDate((row as any).nextFollowupAt)
        : "—";
      const receivedDate = formatRelativeDate(row.submittedAt);
      const avatarBg = getAvatarBg(row.contactName || row.emailNormalized);

      return {
        ...row,
        priority,
        ownerInitials,
        nextFollowup,
        receivedDate,
        avatarBg,
      };
    });
  }, [dashboard.enquiries]);

  const startRow = paginationMeta.total === 0 ? 0 : (page - 1) * limit + 1;
  const endRow = paginationMeta.total === 0 ? 0 : Math.min(page * limit, paginationMeta.total);

  const pageNumbers = useMemo(() => {
    const total = Math.max(1, paginationMeta.totalPages);
    const pages: number[] = [];
    const maxButtons = 5;
    let start = Math.max(1, page - 2);
    const end = Math.min(total, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);
    for (let i = start; i <= end; i += 1) pages.push(i);
    return pages;
  }, [page, paginationMeta.totalPages]);

  const toggleSelectAll = () => {
    if (displayRows.length > 0 && selectedIds.length === displayRows.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(displayRows.map((e) => e.id));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Real data-driven KPI values
  const newInquiriesVal = dashboard.kpis.inquiriesLast30Days ?? dashboard.kpis.totalInquiries ?? 0;
  const activeLeadsVal = dashboard.kpis.activeLeads ?? 0;
  const activeClientsVal = dashboard.kpis.activeClients ?? dashboard.kpis.totalClients ?? 0;
  const followupsDueVal = dashboard.kpis.overdueFollowupsCount ?? 0;
  const avgResponseTimeVal =
    dashboard.kpis.avgResponseHours !== null && dashboard.kpis.avgResponseHours !== undefined
      ? `${dashboard.kpis.avgResponseHours}h`
      : "—";

  const inquiryTrend = (dashboard.kpis as any).inquiryTrendPercentage as number | null | undefined;

  // Real data-driven upcoming follow-ups
  const displayFollowups = useMemo(() => {
    return dashboard.upcomingFollowups.map((f) => {
      const dueInfo = formatDueBadge(f.dueAt, f.completed);
      return {
        ...f,
        badge: dueInfo.isUrgent ? dueInfo.label : undefined,
        dueLabel: dueInfo.label,
      };
    });
  }, [dashboard.upcomingFollowups]);

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header: Command Title & Actions */}
      <div className="flex flex-wrap items-start justify-between gap-4 pt-1">
        <div className="space-y-1">
          <div className="text-[11px] font-mono tracking-[0.2em] uppercase font-semibold text-[#F06419]">
            // CRM
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F2EC] tracking-tight">
            CRM / Leads &amp; Inquiries
          </h1>
          <p className="text-sm text-[#B8B9BC]">
            Manage incoming enquiries, nurture opportunities, maintain client relationships and track every interaction.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Date Range Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setDateDropdownOpen((prev) => !prev)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs font-medium text-[#F5F2EC] hover:border-[#363B43] transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[#898D94]" />
              <span>{dateRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#898D94]" />
            </button>
            {dateDropdownOpen && (
              <div className="absolute right-0 top-11 w-44 py-1.5 rounded-xl bg-[#161A1F] border border-[#292E35] shadow-2xl text-xs z-50">
                {["Last 7 Days", "Last 30 Days", "Last 90 Days", "This Month", "All Time"].map((range) => (
                  <button
                    key={range}
                    type="button"
                    onClick={() => {
                      setDateRange(range);
                      setDateDropdownOpen(false);
                      if (range === "Last 7 Days") setWindowFilter("7d");
                      else if (range === "Last 30 Days") setWindowFilter("30d");
                      else setWindowFilter("all");
                    }}
                    className={cn(
                      "w-full text-left px-3.5 py-2 hover:bg-[#1E232B] transition-colors cursor-pointer",
                      dateRange === range ? "text-[#F06419] font-medium" : "text-[#B8B9BC]"
                    )}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Action */}
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs font-medium text-[#F5F2EC] hover:border-[#363B43] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#898D94]" />
            <span>Export</span>
          </button>

          {/* Primary CTA: Add Inquiry */}
          {canEdit && (
            <button
              type="button"
              onClick={() => setShowAddInquiry(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F06419] hover:bg-[#d95510] text-[#0C0E10] text-xs font-bold shadow-[0_4px_16px_rgb(240_100_25_/_20%)] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#0C0E10] stroke-[2.5]" />
              <span>Add Inquiry</span>
            </button>
          )}
        </div>
      </div>

      {bannerError && (
        <div className="p-3.5 rounded-xl bg-[#2A1414] border border-[#E36B68]/40 text-xs text-[#E36B68] flex items-center justify-between">
          <span>{bannerError}</span>
          <button
            type="button"
            onClick={() => setBannerError("")}
            className="text-[#E36B68] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {bannerSuccess && (
        <div className="p-3.5 rounded-xl bg-[#112319] border border-[#56C58B]/40 text-xs text-[#56C58B] flex items-center justify-between">
          <span>{bannerSuccess}</span>
          <button
            type="button"
            onClick={() => setBannerSuccess("")}
            className="text-[#56C58B] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#121519] border border-[#292E35] w-fit">
        <button
          type="button"
          onClick={() => switchView("leads")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer",
            activeView === "leads"
              ? "bg-[#161A1F] border border-[#F06419]/35 text-[#F5F2EC] shadow-sm"
              : "text-[#898D94] hover:text-[#F5F2EC] border border-transparent"
          )}
        >
          <Users className={cn("w-4 h-4", activeView === "leads" ? "text-[#F06419]" : "text-[#898D94]")} />
          <span>Leads &amp; Inquiries</span>
        </button>

        <button
          type="button"
          onClick={() => switchView("clients")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer",
            activeView === "clients"
              ? "bg-[#161A1F] border border-[#F06419]/35 text-[#F5F2EC] shadow-sm"
              : "text-[#898D94] hover:text-[#F5F2EC] border border-transparent"
          )}
        >
          <Building className={cn("w-4 h-4", activeView === "clients" ? "text-[#F06419]" : "text-[#898D94]")} />
          <span>Clients</span>
        </button>

        <button
          type="button"
          onClick={() => switchView("followups")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition-all cursor-pointer",
            activeView === "followups"
              ? "bg-[#161A1F] border border-[#F06419]/35 text-[#F5F2EC] shadow-sm"
              : "text-[#898D94] hover:text-[#F5F2EC] border border-transparent"
          )}
        >
          <Calendar className={cn("w-4 h-4", activeView === "followups" ? "text-[#F06419]" : "text-[#898D94]")} />
          <span>Follow-ups</span>
        </button>
      </div>

      {/* 3. 5 KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* New Inquiries */}
        <div className="group relative p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#F06419]/50 transition-all duration-200 overflow-hidden space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#F06419]/15 border border-[#F06419]/30 flex items-center justify-center text-[#F06419]">
              <Mail className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">New Inquiries</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {String(newInquiriesVal).padStart(2, "0")}
            </span>
            {inquiryTrend !== null && inquiryTrend !== undefined ? (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[11px] font-mono font-medium border",
                  inquiryTrend >= 0
                    ? "bg-[#56C58B]/15 text-[#56C58B] border-[#56C58B]/25"
                    : "bg-[#E36B68]/15 text-[#E36B68] border-[#E36B68]/25"
                )}
              >
                {inquiryTrend >= 0 ? "↑ +" : "↓ "}
                {Math.abs(inquiryTrend)}%
              </span>
            ) : newInquiriesVal > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#56C58B]/15 text-[#56C58B] border border-[#56C58B]/25">
                Active
              </span>
            ) : null}
          </div>
          <p className="text-[11.5px] text-[#898D94]">Awaiting initial review</p>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#F06419]/70 to-transparent opacity-100 transition-opacity" />
        </div>

        {/* Active Leads */}
        <div className="group relative p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#E9B45A]/50 transition-all duration-200 overflow-hidden space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#E9B45A]/15 border border-[#E9B45A]/30 flex items-center justify-center text-[#E9B45A]">
              <Target className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">Active Leads</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {String(activeLeadsVal).padStart(2, "0")}
            </span>
            {activeLeadsVal > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#56C58B]/15 text-[#56C58B] border border-[#56C58B]/25">
                Pipeline
              </span>
            ) : null}
          </div>
          <p className="text-[11.5px] text-[#898D94]">Open opportunities</p>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#E9B45A]/70 to-transparent opacity-100 transition-opacity" />
        </div>

        {/* Active Clients */}
        <div className="group relative p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#D9B875]/50 transition-all duration-200 overflow-hidden space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#D9B875]/15 border border-[#D9B875]/30 flex items-center justify-center text-[#D9B875]">
              <Building className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">Active Clients</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {String(activeClientsVal).padStart(2, "0")}
            </span>
            {activeClientsVal > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#56C58B]/15 text-[#56C58B] border border-[#56C58B]/25">
                Active
              </span>
            ) : null}
          </div>
          <p className="text-[11.5px] text-[#898D94]">Current client relationships</p>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#D9B875]/70 to-transparent opacity-100 transition-opacity" />
        </div>

        {/* Follow-ups Due */}
        <div className="group relative p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#F06419]/50 transition-all duration-200 overflow-hidden space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#F06419]/15 border border-[#F06419]/30 flex items-center justify-center text-[#F06419]">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">Follow-ups Due</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {String(followupsDueVal).padStart(2, "0")}
            </span>
            {followupsDueVal > 0 ? (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#E36B68]/15 text-[#E36B68] border border-[#E36B68]/25">
                Action Due
              </span>
            ) : null}
          </div>
          <p className="text-[11.5px] text-[#898D94]">Overdue and due today</p>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#F06419]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Avg. First Response */}
        <div className="group relative p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#F06419]/50 transition-all duration-200 overflow-hidden space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#F06419]/15 border border-[#F06419]/30 flex items-center justify-center text-[#F06419]">
              <Clock className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">Avg. First Response</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {avgResponseTimeVal}
            </span>
          </div>
          <p className="text-[11.5px] text-[#898D94]">Average time to first response</p>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#F06419]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Active Workspace View */}
      {activeView === "clients" ? (
        <CrmClientsView
          clients={clientsData}
          counts={clientCounts}
          statusFilter={clientStatusFilter}
          onStatusFilterChange={setClientStatusFilter}
          searchQuery={clientSearch}
          onSearchQueryChange={setClientSearch}
          loading={loadingClients}
          canEdit={canEdit}
          onAddClient={() => setShowAddClient(true)}
          onCreateFollowup={(client) =>
            setFollowupModalTarget({
              open: true,
              clientId: client.id,
              enquiryId: null,
            })
          }
          onCreatePmsProject={(client) =>
            setPmsProjectModal({ open: true, client, enquiry: null })
          }
          onToggleClientStatus={handleToggleClientStatus}
        />
      ) : activeView === "followups" ? (
        <CrmFollowupsView
          followups={followupsData}
          counts={followupCounts}
          filter={followupFilter}
          onFilterChange={setFollowupFilter}
          loading={loadingFollowups}
          canEdit={canEdit}
          onCreateFollowup={() =>
            setFollowupModalTarget({ open: true, enquiryId: null, clientId: null })
          }
          onToggleComplete={(item) =>
            handleToggleFollowup(item.id, !item.completed)
          }
          onDeleteFollowup={handleDeleteFollowup}
          onOpenEnquiry={(id) => openEnquiryDetail(id)}
        />
      ) : (
        <>
          {/* 4. CRM Main Workspace: 2-Column Responsive Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Primary Column: Lead Pipeline + Inquiries & Leads Table */}
            <div className="lg:col-span-8 xl:col-span-8 2xl:col-span-9 space-y-5">
              {/* Lead Pipeline */}
              <div className="p-6 rounded-2xl bg-[#121519] border border-[#292E35] space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Filter className="w-4 h-4 text-[#F06419]" />
                  <h2 className="font-heading font-semibold text-base text-[#F5F2EC]">
                    Lead Pipeline
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setPage(1);
                  }}
                  className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#F06419] hover:underline cursor-pointer"
                >
                  <span>View Pipeline</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 6 Connected Stages */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5">
                {PIPELINE_STAGES.map((stage, idx) => {
                  const isActive = statusFilter === stage.status;
                  const count =
                    dashboard.pipelineCounts[stage.status] ?? 0;
                  const isWon = stage.status === "won";
                  return (
                    <div key={stage.status} className="relative flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setStatusFilter(statusFilter === stage.status ? "all" : stage.status);
                          setPage(1);
                        }}
                        className={cn(
                          "w-full py-3.5 px-3 rounded-xl border text-center transition-all cursor-pointer relative",
                          isActive
                            ? stage.activeRing
                            : isWon
                              ? "bg-[#13291E]/60 border-[#56C58B]/35 hover:border-[#56C58B]/60 text-[#56C58B]"
                              : "bg-[#161A1F] border border-[#292E35] hover:border-[#363B43]"
                        )}
                      >
                        <div
                          className={cn(
                            "text-[11px] font-medium truncate",
                            isActive
                              ? "text-[#F5F2EC]"
                              : isWon
                                ? "text-[#56C58B]"
                                : "text-[#898D94]"
                          )}
                        >
                          {stage.label}
                        </div>
                        <div
                          className={cn(
                            "font-heading font-bold text-xl mt-1",
                            isWon ? "text-[#56C58B]" : "text-[#F5F2EC]"
                          )}
                        >
                          {String(count).padStart(2, "0")}
                        </div>
                      </button>
                      {idx < PIPELINE_STAGES.length - 1 && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#363B43] shrink-0 hidden lg:block -mr-2 ml-0.5 z-10" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inquiries & Leads Table Container */}
            <div className="rounded-2xl bg-[#121519] border border-[#292E35] overflow-hidden space-y-0">
              {/* Header Bar */}
              <div className="p-5 border-b border-[#292E35] flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-[#F06419]" />
                  <h2 className="font-heading font-semibold text-base text-[#F5F2EC]">
                    Inquiries &amp; Leads ({paginationMeta.total})
                  </h2>
                </div>

                {/* Saved Views Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
                  {[
                    { id: "all", label: "All Records" },
                    { id: "new", label: "New & Unreviewed" },
                    { id: "assigned", label: "Assigned to Me" },
                    { id: "followup", label: "Needs Follow-up" },
                  ].map((tab) => {
                    const active = savedView === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setSavedView(tab.id);
                          if (tab.id === "new") setStatusFilter("new");
                          else if (tab.id === "all") setStatusFilter("all");
                          setPage(1);
                        }}
                        className={cn(
                          "px-3 py-1 rounded-full font-medium transition-colors cursor-pointer",
                          active
                            ? "bg-[#F0E6D2] text-[#0C0E10] font-semibold shadow-sm"
                            : "text-[#898D94] hover:text-[#F5F2EC]"
                        )}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    className="px-2 py-1 text-xs text-[#898D94] hover:text-[#F5F2EC] cursor-pointer"
                  >
                    ···
                  </button>
                </div>
              </div>

              {/* Search & Filter Toolbar */}
              <div className="p-4 border-b border-[#292E35] flex flex-wrap items-center gap-2.5 bg-[#0D0F12]/30">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-[#898D94] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search by name, company, email..."
                    className="w-full h-9 pl-9 pr-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] placeholder:text-[#898D94] focus:outline-none focus:border-[#F06419]"
                  />
                </div>

                <select
                  value={serviceFilter}
                  onChange={(e) => {
                    setServiceFilter(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by service"
                  className="h-9 px-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#F06419] cursor-pointer"
                >
                  <option value="all">Service ⌵</option>
                  {dashboard.serviceOptions.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by stage"
                  className="h-9 px-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#F06419] cursor-pointer"
                >
                  <option value="all">Stage ⌵</option>
                  {PIPELINE_STAGES.map((s) => (
                    <option key={s.status} value={s.status}>
                      {s.label}
                    </option>
                  ))}
                </select>

                <select
                  value={ownerFilter}
                  onChange={(e) => {
                    setOwnerFilter(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by owner"
                  className="h-9 px-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#F06419] cursor-pointer"
                >
                  <option value="all">Owner ⌵</option>
                  <option value="me">Assigned to Me</option>
                  <option value="unassigned">Unassigned</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={(e) => {
                    setPriorityFilter(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by priority"
                  className="h-9 px-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#F06419] cursor-pointer"
                >
                  <option value="all">Priority ⌵</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>

                <button
                  type="button"
                  onClick={() => {
                    setStatusFilter("all");
                    setServiceFilter("all");
                    setOwnerFilter("all");
                    setPriorityFilter("all");
                    setSearchQuery("");
                    setPage(1);
                  }}
                  title="Reset Filters"
                  className="p-2 rounded-xl bg-[#161A1F] border border-[#292E35] text-[#898D94] hover:text-[#F5F2EC] hover:border-[#363B43] cursor-pointer"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#292E35] text-[10.5px] font-mono uppercase tracking-[0.12em] text-[#898D94] bg-[#0D0F12]/50">
                      <th className="py-3.5 pl-5 pr-2 w-9">
                        <input
                          type="checkbox"
                          checked={
                            displayRows.length > 0 &&
                            selectedIds.length === displayRows.length
                          }
                          onChange={toggleSelectAll}
                          aria-label="Select all"
                          className="rounded border-[#292E35] bg-[#161A1F] accent-[#F06419]"
                        />
                      </th>
                      <th className="py-3.5 px-3 font-normal min-w-[180px]">Contact / Organisation</th>
                      <th className="py-3.5 px-3 font-normal whitespace-nowrap">Service Interest</th>
                      <th className="py-3.5 px-3 font-normal whitespace-nowrap">Stage</th>
                      <th className="py-3.5 px-3 font-normal whitespace-nowrap">Priority</th>
                      <th className="py-3.5 px-3 font-normal whitespace-nowrap">Owner</th>
                      <th className="py-3.5 px-3 font-normal whitespace-nowrap">Next Follow-up</th>
                      <th className="py-3.5 px-3 font-normal whitespace-nowrap">Received</th>
                      <th className="py-3.5 pl-3 pr-5 font-normal text-right w-10">···</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#292E35]/60 text-xs">
                    {loadingLeads ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="py-10 text-center text-xs font-mono text-[#898D94]"
                        >
                          Loading inquiries...
                        </td>
                      </tr>
                    ) : displayRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="py-10 text-center text-xs text-[#898D94]"
                        >
                          No inquiries match the current filters.
                        </td>
                      </tr>
                    ) : (
                      displayRows.map((item) => {
                        const stageLabel =
                          PIPELINE_STAGES.find((s) => s.status === item.status)?.label ||
                          item.status.toUpperCase();
                        const isNew = item.status === "new";
                        const isInDiscussion = item.status === "qualified";
                        const isProposal = item.status === "proposal_sent";
                        const isContacted = item.status === "reviewing";
                        const isWon = item.status === "won";
                        const isLost = item.status === "lost";

                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-[#161A1F]/70 transition-colors"
                          >
                            {/* Checkbox */}
                            <td className="py-3.5 pl-5 pr-2">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(item.id)}
                                onChange={() => toggleRow(item.id)}
                                aria-label={`Select ${item.contactName}`}
                                className="rounded border-[#292E35] bg-[#161A1F] accent-[#F06419]"
                              />
                            </td>

                            {/* Contact / Organisation */}
                            <td className="py-3.5 px-3">
                              <button
                                type="button"
                                onClick={() => openEnquiryDetail(item.id)}
                                className="flex items-center gap-3 text-left cursor-pointer group"
                              >
                                <span
                                  className={cn(
                                    "w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center shrink-0",
                                    (item as any).avatarBg || "bg-[#161A1F] border border-[#292E35] text-[#F5F2EC]"
                                  )}
                                >
                                  {getInitials(item.contactName)}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-xs font-medium text-[#F5F2EC] group-hover:text-[#F06419] truncate transition-colors">
                                    {item.contactName}
                                  </div>
                                  <div className="text-[11px] text-[#898D94] truncate">
                                    {item.companyName || "Independent"}
                                  </div>
                                </div>
                              </button>
                            </td>

                            {/* Service Interest */}
                            <td className="py-3.5 px-3 text-xs text-[#B8B9BC] whitespace-nowrap">
                              {item.projectType}
                            </td>

                            {/* Stage */}
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              <span
                                className={cn(
                                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase tracking-wider border whitespace-nowrap",
                                  isNew
                                    ? "bg-[#2D160E] text-[#F06419] border-[#F06419]/40"
                                    : isInDiscussion
                                    ? "bg-[#132338] text-[#60A5FA] border-[#3B82F6]/40"
                                    : isProposal
                                    ? "bg-[#2E2413] text-[#E9B45A] border-[#E9B45A]/40"
                                    : isContacted
                                    ? "bg-[#142A1E] text-[#56C58B] border-[#56C58B]/40"
                                    : isWon
                                    ? "bg-[#142A1E] text-[#56C58B] border-[#56C58B]/40"
                                    : isLost
                                    ? "bg-[#2E1618] text-[#E36B68] border-[#E36B68]/40"
                                    : "bg-[#161A1F] text-[#898D94] border-[#292E35]"
                                )}
                              >
                                {stageLabel}
                              </span>
                            </td>

                            {/* Priority */}
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-1.5 text-xs text-[#F5F2EC]">
                                <span
                                  className={cn(
                                    "w-1.5 h-1.5 rounded-full shrink-0",
                                    item.priority === "High"
                                      ? "bg-[#EF4444]"
                                      : item.priority === "Medium"
                                      ? "bg-[#F59E0B]"
                                      : "bg-[#10B981]"
                                  )}
                                />
                                <span>{item.priority}</span>
                              </div>
                            </td>

                            {/* Owner */}
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              <div
                                className={cn(
                                  "w-6 h-6 rounded-full text-[10px] font-mono font-semibold flex items-center justify-center shrink-0",
                                  item.ownerInitials === "EA"
                                    ? "bg-[#D9B875] text-[#0C0E10] font-bold"
                                    : "bg-[#252A32] text-[#B8B9BC]"
                                )}
                              >
                                {item.ownerInitials || "EA"}
                              </div>
                            </td>

                            {/* Next Follow-up */}
                            <td className="py-3.5 px-3 text-xs text-[#898D94] font-mono whitespace-nowrap">
                              {item.nextFollowup === "—" ? (
                                "—"
                              ) : (
                                <span className="flex items-center gap-1 text-[#F5F2EC]">
                                  <Calendar className="w-3 h-3 text-[#898D94]" />
                                  <span>{item.nextFollowup}</span>
                                </span>
                              )}
                            </td>

                            {/* Received */}
                            <td className="py-3.5 px-3 text-xs text-[#898D94] font-mono whitespace-nowrap">
                              {item.receivedDate}
                            </td>

                            {/* Row Actions */}
                            <td className="py-3.5 pl-3 pr-5 text-right relative">
                              <div className="inline-flex items-center justify-end">
                                {canEdit && (
                                  <div className="relative">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setOpenMenuId(
                                          openMenuId === item.id ? null : item.id
                                        )
                                      }
                                      title="More actions"
                                      className="p-1 text-[#898D94] hover:text-[#F5F2EC] transition-colors cursor-pointer"
                                    >
                                      <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                    {openMenuId === item.id && (
                                      <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-[#161A1F] border border-[#292E35] shadow-2xl py-1.5 z-30 text-left">
                                        {!item.convertedClientId && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenMenuId(null);
                                              setConvertModal({
                                                open: true,
                                                enquiry: item,
                                              });
                                            }}
                                            className="w-full px-3 py-2 text-xs text-[#F5F2EC] hover:bg-[#1E232B] flex items-center gap-2 cursor-pointer"
                                          >
                                            <UserCheck className="w-3.5 h-3.5 text-[#F06419]" />
                                            <span>Convert to Client</span>
                                          </button>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setOpenMenuId(null);
                                            setFollowupModalTarget({
                                              open: true,
                                              enquiryId: item.id,
                                              clientId: null,
                                            });
                                          }}
                                          className="w-full px-3 py-2 text-xs text-[#F5F2EC] hover:bg-[#1E232B] flex items-center gap-2 cursor-pointer"
                                        >
                                          <CalendarPlus className="w-3.5 h-3.5 text-[#D9B875]" />
                                          <span>Schedule Follow-up</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setOpenMenuId(null);
                                            setPmsProjectModal({
                                              open: true,
                                              enquiry: item,
                                              client: null,
                                            });
                                          }}
                                          className="w-full px-3 py-2 text-xs text-[#F5F2EC] hover:bg-[#1E232B] flex items-center gap-2 cursor-pointer"
                                        >
                                          <Briefcase className="w-3.5 h-3.5 text-[#56C58B]" />
                                          <span>Create Project</span>
                                        </button>
                                        {isAdmin && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenMenuId(null);
                                              handleDeleteEnquiry(item.id);
                                            }}
                                            className="w-full px-3 py-2 text-xs text-[#E36B68] hover:bg-[#1E232B] flex items-center gap-2 cursor-pointer"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            <span>Delete Inquiry</span>
                                          </button>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="p-4 border-t border-[#292E35] flex flex-wrap items-center justify-between gap-3 text-xs text-[#898D94]">
                <div>
                  Showing {startRow}–{endRow} of {paginationMeta.total} records
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span>Rows per page</span>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                      className="h-7 px-2 rounded-lg bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC]"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      aria-label="Previous page"
                      className="p-1 text-[#898D94] hover:text-[#F5F2EC] disabled:opacity-20 cursor-pointer transition-colors"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    {pageNumbers.map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPage(num)}
                        className={cn(
                          "w-6 h-6 rounded-md text-xs font-medium cursor-pointer transition-colors flex items-center justify-center",
                          num === page
                            ? "bg-[#F06419] text-[#0C0E10] font-bold shadow-sm"
                            : "text-[#898D94] hover:text-[#F5F2EC]"
                        )}
                      >
                        {num}
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={page >= paginationMeta.totalPages}
                      onClick={() =>
                        setPage((p) => Math.min(paginationMeta.totalPages, p + 1))
                      }
                      aria-label="Next page"
                      className="p-1 text-[#898D94] hover:text-[#F5F2EC] disabled:opacity-20 cursor-pointer transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* End Left Primary Column */}
          </div>

            {/* Right Contextual Column: Upcoming Follow-ups + Quick Actions */}
            <div className="lg:col-span-4 xl:col-span-4 2xl:col-span-3 space-y-5">
              {/* Upcoming Follow-ups Panel */}
              <div className="p-5 rounded-2xl bg-[#121519] border border-[#292E35] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#F06419]" />
                    <h2 className="font-heading font-semibold text-sm text-[#F5F2EC]">
                      Upcoming Follow-ups
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => switchView("followups")}
                    className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#F06419] hover:underline cursor-pointer"
                  >
                    <span>View All</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  {displayFollowups.length === 0 ? (
                    <div className="py-6 text-center text-xs text-[#898D94] space-y-2">
                      <p>No upcoming follow-ups scheduled.</p>
                      <button
                        type="button"
                        onClick={() =>
                          setFollowupModalTarget({
                            open: true,
                            enquiryId: null,
                            clientId: null,
                          })
                        }
                        className="inline-flex items-center gap-1 text-[#F06419] hover:underline font-mono text-[11px] cursor-pointer"
                      >
                        <span>+ Schedule Follow-up</span>
                      </button>
                    </div>
                  ) : (
                    displayFollowups.map((item) => {
                    const Icon =
                      item.channel === "call"
                        ? Phone
                        : item.channel === "meeting"
                        ? Calendar
                        : Mail;
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          if (item.enquiryId) openEnquiryDetail(item.enquiryId);
                        }}
                        className="p-2 -mx-2 rounded-xl hover:bg-[#161A1F] transition-colors cursor-pointer flex items-start justify-between gap-2.5"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-[#161A1F] border border-[#292E35] flex items-center justify-center text-[#F06419] shrink-0 mt-0.5">
                            <Icon className="w-3.5 h-3.5" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-medium text-[#F5F2EC] truncate">
                              {item.title}
                            </div>
                            <div className="text-[11px] text-[#898D94] truncate">
                              {item.notes || "Follow-up discussion"}
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          {item.badge ? (
                            <span
                              className={cn(
                                "px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold border",
                                item.badge === "Overdue"
                                  ? "bg-[#2D1615] text-[#E36B68] border-[#E36B68]/30"
                                  : "bg-[#2E2214] text-[#E9B45A] border-[#E9B45A]/30"
                              )}
                            >
                              {item.badge}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#161A1F] text-[#898D94] border border-[#292E35]">
                              {item.dueLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
                </div>
              </div>

              {/* Quick Actions Panel */}
              <div className="p-5 rounded-2xl bg-[#121519] border border-[#292E35] space-y-4">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#F06419]" />
                  <h2 className="font-heading font-semibold text-base text-[#F5F2EC]">
                    Quick Actions
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {/* + Add Inquiry */}
                  <button
                    type="button"
                    onClick={() => setShowAddInquiry(true)}
                    className="p-2.5 rounded-xl bg-[#F06419] hover:bg-[#d95510] text-[#0C0E10] font-bold text-[11px] flex flex-col items-center justify-center text-center shadow-[0_4px_16px_rgb(240_100_25_/_20%)] transition-colors min-h-[74px] cursor-pointer"
                  >
                    <span className="text-sm leading-none mb-1 font-bold">+</span>
                    <span className="leading-tight">Add Inquiry</span>
                  </button>

                  {/* + Add Client */}
                  <button
                    type="button"
                    onClick={() => setShowAddClient(true)}
                    className="p-2.5 rounded-xl bg-[#161A1F] border border-[#292E35] hover:border-[#F06419] text-[#F5F2EC] text-[11px] font-medium flex flex-col items-center justify-center text-center hover:shadow-[0_0_16px_rgba(240,100,25,0.15)] transition-all duration-200 min-h-[74px] cursor-pointer group"
                  >
                    <span className="text-sm leading-none mb-1 text-[#898D94] group-hover:text-[#F06419] transition-colors">
                      +
                    </span>
                    <span className="leading-tight">Add Client</span>
                  </button>

                  {/* Schedule Follow-up */}
                  <button
                    type="button"
                    onClick={() =>
                      setFollowupModalTarget({
                        open: true,
                        enquiryId: null,
                        clientId: null,
                      })
                    }
                    className="p-2.5 rounded-xl bg-[#161A1F] border border-[#292E35] hover:border-[#F06419] text-[#B8B9BC] hover:text-[#F5F2EC] text-[11px] font-medium flex flex-col items-center justify-center gap-1.5 text-center hover:shadow-[0_0_16px_rgba(240,100,25,0.15)] transition-all duration-200 min-h-[74px] cursor-pointer group"
                  >
                    <Calendar className="w-4 h-4 text-[#898D94] group-hover:text-[#F06419] transition-colors" />
                    <span className="leading-tight text-center">Schedule Follow-up</span>
                  </button>

                  {/* Export Records */}
                  <button
                    type="button"
                    onClick={handleExport}
                    className="p-2.5 rounded-xl bg-[#161A1F] border border-[#292E35] hover:border-[#F06419] text-[#B8B9BC] hover:text-[#F5F2EC] text-[11px] font-medium flex flex-col items-center justify-center gap-1.5 text-center hover:shadow-[0_0_16px_rgba(240,100,25,0.15)] transition-all duration-200 min-h-[74px] cursor-pointer group"
                  >
                    <Download className="w-4 h-4 text-[#898D94] group-hover:text-[#F06419] transition-colors" />
                    <span className="leading-tight text-center">Export Records</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modals & Inspectors */}
      {showAddInquiry && (
        <AddInquiryModal
          onClose={() => setShowAddInquiry(false)}
          onSuccess={() => {
            setShowAddInquiry(false);
            setBannerSuccess("New inquiry created.");
            refreshAll();
          }}
        />
      )}

      {showAddClient && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onSuccess={() => {
            setShowAddClient(false);
            setBannerSuccess("Client created.");
            refreshAll();
          }}
        />
      )}

      {followupModalTarget.open && (
        <CreateFollowupModal
          enquiriesList={dashboard.enquiries}
          clientsList={clientsData}
          initialEnquiryId={followupModalTarget.enquiryId}
          initialClientId={followupModalTarget.clientId}
          onClose={() => setFollowupModalTarget({ open: false })}
          onSuccess={() => {
            setFollowupModalTarget({ open: false });
            setBannerSuccess("Follow-up scheduled.");
            if (detailOpen && detailEnquiry) {
              openEnquiryDetail(detailEnquiry.id);
            }
            refreshAll();
          }}
        />
      )}

      {convertModal.open && (
        <ConvertToClientModal
          enquiriesList={dashboard.enquiries}
          initialEnquiry={convertModal.enquiry}
          onClose={() => setConvertModal({ open: false, enquiry: null })}
          onSuccess={() => {
            setConvertModal({ open: false, enquiry: null });
            setBannerSuccess("Lead converted to Client record.");
            if (detailOpen && detailEnquiry) {
              openEnquiryDetail(detailEnquiry.id);
            }
            refreshAll();
          }}
        />
      )}

      {pmsProjectModal.open && (
        <CreatePmsProjectModal
          client={pmsProjectModal.client || null}
          enquiry={pmsProjectModal.enquiry || null}
          onClose={() =>
            setPmsProjectModal({ open: false, client: null, enquiry: null })
          }
          onSuccess={() => {
            setPmsProjectModal({ open: false, client: null, enquiry: null });
            setBannerSuccess("Internal PMS project created.");
            if (detailOpen && detailEnquiry) {
              openEnquiryDetail(detailEnquiry.id);
            }
            refreshAll();
          }}
        />
      )}

      {detailOpen && (
        <LeadDetailModal
          detail={detailEnquiry}
          loading={loadingDetail}
          canEdit={canEdit}
          isAdmin={isAdmin}
          onClose={() => {
            setDetailOpen(false);
            setDetailEnquiry(null);
          }}
          onStatusChange={async (status: EnquiryStatus) => {
            if (detailEnquiry) await handleUpdateStatus(detailEnquiry.id, status);
          }}
          onAddNote={async (noteText: string) => {
            if (!detailEnquiry) return;
            try {
              const res = await fetch(
                `/api/v1/admin/enquiries/${detailEnquiry.id}/notes`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ note: noteText }),
                }
              );
              if (res.ok) {
                await openEnquiryDetail(detailEnquiry.id);
              }
            } catch {
              // ignore
            }
          }}
          onToggleFollowup={handleToggleFollowup}
          onScheduleFollowup={() => {
            if (detailEnquiry) {
              setFollowupModalTarget({
                open: true,
                enquiryId: detailEnquiry.id,
                clientId: detailEnquiry.convertedClientId,
              });
            }
          }}
          onConvertToClient={() => {
            if (detailEnquiry) {
              setConvertModal({ open: true, enquiry: detailEnquiry });
            }
          }}
          onCreatePmsProject={() => {
            if (detailEnquiry) {
              setPmsProjectModal({
                open: true,
                enquiry: detailEnquiry,
                client: null,
              });
            }
          }}
          onDeleteEnquiry={() => {
            if (detailEnquiry) {
              handleDeleteEnquiry(detailEnquiry.id);
              setDetailOpen(false);
              setDetailEnquiry(null);
            }
          }}
        />
      )}
    </div>
  );
}
