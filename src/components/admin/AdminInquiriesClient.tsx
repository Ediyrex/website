"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Briefcase,
  Calendar,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Eye,
  FileText,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
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
  const [windowFilter, setWindowFilter] = useState<"all" | "30d" | "7d">("all");
  const [pipelineWindow, setPipelineWindow] = useState<"30d" | "all">("30d");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

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
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      if (res.ok && json.data) {
        setClientsData(json.data.clients || []);
        setClientCounts(
          json.data.counts || { all: 0, active: 0, archived: 0 }
        );
      }
    } catch {
      setBannerError("Network error loading CRM clients.");
    } finally {
      setLoadingClients(false);
    }
  }, [clientSearch, clientStatusFilter, router]);

  const loadFollowups = useCallback(async () => {
    setLoadingFollowups(true);
    try {
      const res = await fetch(
        `/api/v1/admin/crm/followups?filter=${followupFilter}`
      );
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      if (res.ok && json.data) {
        setFollowupsData(json.data.followups || []);
        setFollowupCounts(
          json.data.counts || {
            upcoming: 0,
            overdue: 0,
            completed: 0,
            all: 0,
          }
        );
      }
    } catch {
      setBannerError("Network error loading follow-ups.");
    } finally {
      setLoadingFollowups(false);
    }
  }, [followupFilter, router]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadDashboard();
    }, 150);
    return () => clearTimeout(timer);
  }, [loadDashboard]);

  useEffect(() => {
    if (activeView !== "clients" && !followupModalTarget.open) return;
    const timer = setTimeout(() => {
      loadClients();
    }, 0);
    return () => clearTimeout(timer);
  }, [activeView, followupModalTarget.open, loadClients]);

  useEffect(() => {
    if (activeView !== "followups") return;
    const timer = setTimeout(() => {
      loadFollowups();
    }, 0);
    return () => clearTimeout(timer);
  }, [activeView, loadFollowups]);

  const refreshAll = useCallback(() => {
    loadDashboard();
    if (activeView === "clients") loadClients();
    if (activeView === "followups") loadFollowups();
  }, [activeView, loadClients, loadDashboard, loadFollowups]);

  const openEnquiryDetail = async (id: string) => {
    setDetailOpen(true);
    setLoadingDetail(true);
    setOpenMenuId(null);
    try {
      const res = await fetch(`/api/v1/admin/enquiries/${id}`);
      const json = await res.json();
      if (res.ok && json.data) {
        setDetailEnquiry(json.data);
      } else {
        setDetailOpen(false);
        setBannerError(json.message || "Unable to open lead detail.");
      }
    } catch {
      setDetailOpen(false);
      setBannerError("Network error loading lead detail.");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleStatusChange = async (
    enquiryId: string,
    nextStatus: EnquiryStatus
  ) => {
    const res = await fetch(`/api/v1/admin/enquiries/${enquiryId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    if (res.ok) {
      if (detailEnquiry?.id === enquiryId) {
        await openEnquiryDetail(enquiryId);
      }
      await loadDashboard();
    }
  };

  const handleAddNote = async (enquiryId: string, noteText: string) => {
    const res = await fetch(`/api/v1/admin/enquiries/${enquiryId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: noteText }),
    });
    if (res.ok) {
      await openEnquiryDetail(enquiryId);
      await loadDashboard();
    }
  };

  const handleDeleteEnquiry = async (enquiryId: string) => {
    const res = await fetch(`/api/v1/admin/enquiries/${enquiryId}`, {
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

  const visibleEnquiries = dashboard.enquiries;
  const startRow =
    paginationMeta.total === 0 ? 0 : (page - 1) * limit + 1;
  const endRow = Math.min(page * limit, paginationMeta.total);

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
    if (
      visibleEnquiries.length > 0 &&
      selectedIds.length === visibleEnquiries.length
    ) {
      setSelectedIds([]);
    } else {
      setSelectedIds(visibleEnquiries.map((e) => e.id));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const viewTitle =
    activeView === "clients"
      ? "CRM — Clients"
      : activeView === "followups"
      ? "CRM — Follow-ups"
      : "CRM — Leads & Inquiries";

  return (
    <div className="space-y-6">
      {/* Header + View Switcher */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
            {viewTitle}
          </h1>
          <p className="text-sm text-[#8D939E] mt-1">
            Manage incoming inquiries, track leads, and convert them into
            clients and projects.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl bg-[#111419] border border-[#1E222A] p-1">
          {(
            [
              { id: "leads", label: "Leads & Inquiries" },
              { id: "clients", label: "Clients" },
              { id: "followups", label: "Follow-ups" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => switchView(tab.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                activeView === tab.id
                  ? "bg-[#D6B77A] text-[#08090B] font-semibold"
                  : "text-[#8D939E] hover:text-[#F5F3EE]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {bannerError && (
        <div className="p-3.5 rounded-xl bg-[#2A1414] border border-[#F28B82]/40 text-xs text-[#F28B82] flex items-center justify-between">
          <span>{bannerError}</span>
          <button
            type="button"
            onClick={() => setBannerError("")}
            className="text-[#F28B82] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {bannerSuccess && (
        <div className="p-3.5 rounded-xl bg-[#112319] border border-[#6FCF97]/40 text-xs text-[#6FCF97] flex items-center justify-between">
          <span>{bannerSuccess}</span>
          <button
            type="button"
            onClick={() => setBannerSuccess("")}
            className="text-[#6FCF97] hover:underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 5 KPI Cards (Real DB counts — Zero fabricated trends) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard
          icon={<Mail className="w-4 h-4 text-[#D6B77A]" />}
          iconBg="bg-[#241E14] border-[#D6B77A]/30"
          label="Total Inquiries"
          value={String(dashboard.kpis.totalInquiries)}
          subtext={`${dashboard.kpis.inquiriesLast30Days} in last 30 days`}
        />
        <KpiCard
          icon={<Users className="w-4 h-4 text-[#D6B77A]" />}
          iconBg="bg-[#241E14] border-[#D6B77A]/30"
          label="Active Leads"
          value={String(dashboard.kpis.activeLeads)}
          subtext={`${dashboard.kpis.inDiscussionCount} in discussion`}
        />
        <KpiCard
          icon={<UserCheck className="w-4 h-4 text-[#D6B77A]" />}
          iconBg="bg-[#241E14] border-[#D6B77A]/30"
          label="Clients"
          value={String(dashboard.kpis.totalClients)}
          subtext={`${dashboard.kpis.activeClients} active accounts`}
        />
        <KpiCard
          icon={<CheckCircle2 className="w-4 h-4 text-[#6FCF97]" />}
          iconBg="bg-[#12261C] border-[#6FCF97]/30"
          label="Converted"
          value={String(dashboard.kpis.convertedLeads)}
          subtext="Inquiry to client"
        />
        <KpiCard
          icon={<Clock className="w-4 h-4 text-[#D6B77A]" />}
          iconBg="bg-[#241E14] border-[#D6B77A]/30"
          label="Avg. Response Time"
          value={
            dashboard.kpis.avgResponseHours !== null
              ? `${dashboard.kpis.avgResponseHours} hrs`
              : "—"
          }
          subtext={
            dashboard.kpis.respondedCount > 0
              ? `Across ${dashboard.kpis.respondedCount} responded leads`
              : "Awaiting first team response"
          }
        />
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
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
          {/* Center Column: Lead Pipeline + Recent Inquiries */}
          <div className="xl:col-span-9 space-y-5">
            {/* Lead Pipeline */}
            <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-4">
              <div className="flex items-center justify-between gap-3">
                <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
                  Lead Pipeline
                </h2>
                <select
                  value={pipelineWindow}
                  onChange={(e) =>
                    setPipelineWindow(e.target.value as "30d" | "all")
                  }
                  aria-label="Pipeline time range"
                  className="h-8 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#E4E0D8] focus:outline-none focus:border-[#D6B77A]"
                >
                  <option value="30d">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {PIPELINE_STAGES.map((stage, index) => {
                  const isActive = statusFilter === stage.status;
                  const count = dashboard.pipelineCounts[stage.status] ?? 0;
                  return (
                    <div key={stage.status} className="relative flex items-center">
                      <button
                        type="button"
                        onClick={() => {
                          setStatusFilter(
                            statusFilter === stage.status ? "all" : stage.status
                          );
                          setPage(1);
                        }}
                        className={cn(
                          "w-full py-3.5 px-3 rounded-xl border text-center transition-all cursor-pointer",
                          isActive
                            ? stage.activeRing
                            : "bg-[#0D0F12] border-[#1E222A] hover:border-[#2E3440]"
                        )}
                      >
                        <div className="text-[11px] font-medium text-[#A2A8B3]">
                          {stage.label}
                        </div>
                        <div className="font-heading font-bold text-xl text-[#F5F3EE] mt-1">
                          {count}
                        </div>
                      </button>
                      {index < PIPELINE_STAGES.length - 1 && (
                        <ChevronRight className="w-3.5 h-3.5 text-[#3D4451] shrink-0 hidden sm:block -mr-2 ml-0.5 z-10" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Inquiries Card */}
            <div className="rounded-xl bg-[#111419] border border-[#1E222A] overflow-hidden">
              <div className="px-5 pt-4 pb-3 border-b border-[#1E222A] flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
                  Recent Inquiries
                </h2>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => setShowAddInquiry(true)}
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Inquiry</span>
                  </button>
                )}
              </div>

              {/* Pipeline Tabs */}
              <div className="px-5 pt-2 border-b border-[#1E222A] flex items-center gap-1 overflow-x-auto">
                {[
                  {
                    id: "all",
                    label: "All",
                    count: dashboard.kpis.totalInquiries,
                  },
                  ...PIPELINE_STAGES.map((s) => ({
                    id: s.status,
                    label: s.label,
                    count: dashboard.statusCounts[s.status] ?? 0,
                  })),
                ].map((tab) => {
                  const active = statusFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setStatusFilter(tab.id);
                        setPage(1);
                      }}
                      className={cn(
                        "px-3 py-2.5 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer",
                        active
                          ? "border-[#D6B77A] text-[#F5F3EE]"
                          : "border-transparent text-[#777D87] hover:text-[#C8C3B8]"
                      )}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  );
                })}
              </div>

              {/* Filter Toolbar */}
              <div className="px-5 py-3.5 border-b border-[#1E222A] flex flex-wrap items-center gap-2.5">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-[#6D7480] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search inquiries..."
                    className="w-full h-9 pl-8 pr-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE] placeholder:text-[#6D7480] focus:outline-none focus:border-[#D6B77A]"
                  />
                </div>

                <select
                  value={serviceFilter}
                  onChange={(e) => {
                    setServiceFilter(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by service"
                  className="h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#E4E0D8] focus:outline-none focus:border-[#D6B77A]"
                >
                  <option value="all">All Services</option>
                  {dashboard.serviceOptions.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>

                <select
                  value={sourceFilter}
                  onChange={(e) => {
                    setSourceFilter(e.target.value);
                    setPage(1);
                  }}
                  aria-label="Filter by source"
                  className="h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#E4E0D8] focus:outline-none focus:border-[#D6B77A]"
                >
                  <option value="all">All Sources</option>
                  {dashboard.sourceOptions.map((src) => (
                    <option key={src} value={src}>
                      {formatSourceLabel(src)}
                    </option>
                  ))}
                </select>

                <select
                  value={windowFilter}
                  onChange={(e) => {
                    setWindowFilter(e.target.value as "all" | "30d" | "7d");
                    setPage(1);
                  }}
                  aria-label="Filter by date range"
                  className="h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#E4E0D8] focus:outline-none focus:border-[#D6B77A]"
                >
                  <option value="all">All Time</option>
                  <option value="30d">Last 30 Days</option>
                  <option value="7d">Last 7 Days</option>
                </select>
              </div>

              {/* Inquiries Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1E222A] text-[10px] font-mono uppercase tracking-[0.14em] text-[#777D87] bg-[#0D0F12]/50">
                      <th className="py-3 pl-5 pr-2 w-9">
                        <input
                          type="checkbox"
                          checked={
                            visibleEnquiries.length > 0 &&
                            selectedIds.length === visibleEnquiries.length
                          }
                          onChange={toggleSelectAll}
                          aria-label="Select all visible inquiries"
                          className="rounded border-[#323946] bg-[#0D0F12]"
                        />
                      </th>
                      <th className="py-3 px-3 font-normal">Inquiry</th>
                      <th className="py-3 px-3 font-normal">Service Interest</th>
                      <th className="py-3 px-3 font-normal">Source</th>
                      <th className="py-3 px-3 font-normal">Status</th>
                      <th className="py-3 px-3 font-normal">Submitted</th>
                      <th className="py-3 pl-3 pr-5 font-normal text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E222A]">
                    {loadingLeads ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-10 text-center text-xs font-mono text-[#777D87]"
                        >
                          Loading inquiries...
                        </td>
                      </tr>
                    ) : visibleEnquiries.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-10 text-center text-xs text-[#777D87]"
                        >
                          No inquiries match the current filters.
                        </td>
                      </tr>
                    ) : (
                      visibleEnquiries.map((item) => {
                        const statusMeta = getStatusMeta(item.status);
                        return (
                          <tr
                            key={item.id}
                            className="hover:bg-[#161920]/70 transition-colors"
                          >
                            <td className="py-3.5 pl-5 pr-2">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(item.id)}
                                onChange={() => toggleRow(item.id)}
                                aria-label={`Select ${item.contactName}`}
                                className="rounded border-[#323946] bg-[#0D0F12]"
                              />
                            </td>
                            <td className="py-3.5 px-3">
                              <button
                                type="button"
                                onClick={() => openEnquiryDetail(item.id)}
                                className="flex items-center gap-3 text-left cursor-pointer group"
                              >
                                <span className="w-8 h-8 rounded-full bg-[#241E14] border border-[#D6B77A]/35 text-[#D6B77A] text-[11px] font-semibold flex items-center justify-center shrink-0">
                                  {getInitials(item.contactName)}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-sm font-medium text-[#F5F3EE] group-hover:text-[#D6B77A] truncate">
                                    {item.contactName}
                                  </div>
                                  <div className="text-xs text-[#777D87] truncate">
                                    {item.emailNormalized}
                                  </div>
                                </div>
                              </button>
                            </td>
                            <td className="py-3.5 px-3 text-xs text-[#E4E0D8]">
                              {item.projectType}
                            </td>
                            <td className="py-3.5 px-3">
                              <span className="inline-flex px-2.5 py-0.5 rounded-md bg-[#181B22] border border-[#262B35] text-[11px] text-[#C8C3B8]">
                                {formatSourceLabel(item.source)}
                              </span>
                            </td>
                            <td className="py-3.5 px-3">
                              <span
                                className={cn(
                                  "inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
                                  statusMeta.badgeClass
                                )}
                              >
                                {statusMeta.label}
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-xs text-[#8D939E] whitespace-nowrap">
                              {formatRelativeDate(item.submittedAt)}
                            </td>
                            <td className="py-3.5 pl-3 pr-5 text-right relative">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => openEnquiryDetail(item.id)}
                                  title="Inspect Lead"
                                  className="p-1.5 rounded-lg bg-[#161920] border border-[#252A32] text-[#A2A8B3] hover:text-[#F5F3EE] cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => openEnquiryDetail(item.id)}
                                  title="Notes & Follow-up"
                                  className="p-1.5 rounded-lg bg-[#161920] border border-[#252A32] text-[#A2A8B3] hover:text-[#F5F3EE] cursor-pointer"
                                >
                                  <MessageSquare className="w-3.5 h-3.5" />
                                </button>
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
                                      className="p-1.5 rounded-lg bg-[#161920] border border-[#252A32] text-[#A2A8B3] hover:text-[#F5F3EE] cursor-pointer"
                                    >
                                      <MoreHorizontal className="w-3.5 h-3.5" />
                                    </button>
                                    {openMenuId === item.id && (
                                      <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-[#161920] border border-[#282D37] shadow-2xl py-1.5 z-30 text-left">
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
                                            className="w-full px-3 py-2 text-xs text-[#E4E0D8] hover:bg-[#1E222C] flex items-center gap-2 cursor-pointer"
                                          >
                                            <UserCheck className="w-3.5 h-3.5 text-[#D6B77A]" />
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
                                          className="w-full px-3 py-2 text-xs text-[#E4E0D8] hover:bg-[#1E222C] flex items-center gap-2 cursor-pointer"
                                        >
                                          <CalendarPlus className="w-3.5 h-3.5 text-[#8AB4F8]" />
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
                                          className="w-full px-3 py-2 text-xs text-[#E4E0D8] hover:bg-[#1E222C] flex items-center gap-2 cursor-pointer"
                                        >
                                          <Briefcase className="w-3.5 h-3.5 text-[#6FCF97]" />
                                          <span>Create PMS Project</span>
                                        </button>
                                        {isAdmin && (
                                          <button
                                            type="button"
                                            onClick={() => {
                                              setOpenMenuId(null);
                                              handleDeleteEnquiry(item.id);
                                            }}
                                            className="w-full px-3 py-2 text-xs text-[#F28B82] hover:bg-[#1E222C] flex items-center gap-2 cursor-pointer"
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
              <div className="px-5 py-3.5 border-t border-[#1E222A] flex flex-wrap items-center justify-between gap-3 text-xs text-[#8D939E]">
                <div>
                  Showing {startRow}–{endRow} of {paginationMeta.total}{" "}
                  inquiries
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span>Rows per page</span>
                    <select
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                      className="h-8 px-2 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="w-8 h-8 rounded-lg bg-[#0D0F12] border border-[#252A32] flex items-center justify-center text-[#8D939E] disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </button>
                    {pageNumbers.map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setPage(num)}
                        className={cn(
                          "w-8 h-8 rounded-lg text-xs font-medium cursor-pointer",
                          num === page
                            ? "bg-[#D6B77A] text-[#08090B] font-semibold"
                            : "bg-[#0D0F12] border border-[#252A32] text-[#A2A8B3] hover:text-[#F5F3EE]"
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
                      className="w-8 h-8 rounded-lg bg-[#0D0F12] border border-[#252A32] flex items-center justify-center text-[#8D939E] disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Rail: Upcoming Follow-ups + Quick Actions */}
          <div className="xl:col-span-3 space-y-5">
            <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-4">
              <div className="flex items-center justify-between gap-2">
                <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
                  Upcoming Follow-ups
                </h2>
                <button
                  type="button"
                  onClick={() => switchView("followups")}
                  className="text-xs font-medium text-[#D6B77A] hover:underline cursor-pointer"
                >
                  View All →
                </button>
              </div>

              {dashboard.upcomingFollowups.length === 0 ? (
                <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#1E222A] text-xs text-[#777D87] text-center space-y-2">
                  <div>No upcoming follow-ups scheduled.</div>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() =>
                        setFollowupModalTarget({
                          open: true,
                          enquiryId: null,
                          clientId: null,
                        })
                      }
                      className="text-[#D6B77A] font-medium hover:underline cursor-pointer"
                    >
                      + Schedule first follow-up
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-[#1E222A]">
                  {dashboard.upcomingFollowups.map((item) => {
                    const due = formatDueBadge(item.dueAt, item.completed);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          item.enquiryId
                            ? openEnquiryDetail(item.enquiryId)
                            : switchView("followups")
                        }
                        className="w-full py-3 first:pt-1 last:pb-1 flex items-start justify-between gap-3 text-left hover:opacity-90 cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <span className="w-7 h-7 rounded-lg bg-[#241E14] border border-[#D6B77A]/30 flex items-center justify-center shrink-0 mt-0.5">
                            <Calendar className="w-3.5 h-3.5 text-[#D6B77A]" />
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-medium text-[#F5F3EE] truncate">
                              {item.contactName}
                            </div>
                            <div className="text-[11px] text-[#777D87] truncate">
                              {item.title}
                            </div>
                          </div>
                        </div>
                        <span
                          className={cn(
                            "text-[11px] font-medium shrink-0",
                            due.isUrgent ? "text-[#F28B82]" : "text-[#8D939E]"
                          )}
                        >
                          {due.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-3.5">
              <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
                Quick Actions
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                <QuickActionButton
                  icon={<Plus className="w-4 h-4 text-[#D6B77A]" />}
                  label="Add Inquiry"
                  disabled={!canEdit}
                  onClick={() => setShowAddInquiry(true)}
                />
                <QuickActionButton
                  icon={<UserPlus className="w-4 h-4 text-[#D6B77A]" />}
                  label="Add Client"
                  disabled={!canEdit}
                  onClick={() => setShowAddClient(true)}
                />
                <QuickActionButton
                  icon={<CalendarPlus className="w-4 h-4 text-[#D6B77A]" />}
                  label="Create Follow-up"
                  disabled={!canEdit}
                  onClick={() =>
                    setFollowupModalTarget({
                      open: true,
                      enquiryId: selectedIds[0] || null,
                      clientId: null,
                    })
                  }
                />
                <QuickActionButton
                  icon={<FileText className="w-4 h-4 text-[#D6B77A]" />}
                  label="Convert to Client"
                  disabled={!canEdit}
                  onClick={() => {
                    const chosen =
                      visibleEnquiries.find((e) => e.id === selectedIds[0]) ||
                      null;
                    setConvertModal({ open: true, enquiry: chosen });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddInquiry && (
        <AddInquiryModal
          onClose={() => setShowAddInquiry(false)}
          onSuccess={() => {
            setBannerSuccess("Inquiry added to CRM.");
            refreshAll();
          }}
        />
      )}

      {showAddClient && (
        <AddClientModal
          onClose={() => setShowAddClient(false)}
          onSuccess={() => {
            setBannerSuccess("Client added to CRM directory.");
            refreshAll();
          }}
        />
      )}

      {followupModalTarget.open && (
        <CreateFollowupModal
          enquiriesList={visibleEnquiries}
          clientsList={clientsData}
          initialEnquiryId={followupModalTarget.enquiryId}
          initialClientId={followupModalTarget.clientId}
          onClose={() => setFollowupModalTarget({ open: false })}
          onSuccess={() => {
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
          enquiriesList={visibleEnquiries}
          initialEnquiry={convertModal.enquiry}
          onClose={() => setConvertModal({ open: false })}
          onSuccess={() => {
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
          client={pmsProjectModal.client}
          enquiry={pmsProjectModal.enquiry}
          onClose={() => setPmsProjectModal({ open: false })}
          onSuccess={() => {
            setBannerSuccess(
              "Internal PMS project & kickoff task created under Projects & Tasks."
            );
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
          onClose={() => setDetailOpen(false)}
          onStatusChange={async (status) => {
            if (detailEnquiry) await handleStatusChange(detailEnquiry.id, status);
          }}
          onAddNote={async (noteText) => {
            if (detailEnquiry) await handleAddNote(detailEnquiry.id, noteText);
          }}
          onToggleFollowup={handleToggleFollowup}
          onScheduleFollowup={() => {
            if (detailEnquiry) {
              setFollowupModalTarget({
                open: true,
                enquiryId: detailEnquiry.id,
                clientId: null,
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
                client: detailEnquiry.client,
              });
            }
          }}
          onDeleteEnquiry={() => {
            if (detailEnquiry) handleDeleteEnquiry(detailEnquiry.id);
          }}
        />
      )}
    </div>
  );
}

function KpiCard({
  icon,
  iconBg,
  label,
  value,
  subtext,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  subtext: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] flex items-start gap-3.5">
      <div
        className={cn(
          "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0",
          iconBg
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-xs text-[#8D939E]">{label}</div>
        <div className="font-heading font-bold text-2xl text-[#F5F3EE] mt-0.5 leading-tight">
          {value}
        </div>
        <div className="text-[11px] text-[#6D7480] mt-1 truncate">
          {subtext}
        </div>
      </div>
    </div>
  );
}

function QuickActionButton({
  icon,
  label,
  disabled,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] hover:border-[#D6B77A]/45 flex flex-col items-center justify-center gap-2 text-center transition-colors disabled:opacity-45 cursor-pointer disabled:cursor-default"
    >
      {icon}
      <span className="text-xs font-medium text-[#E4E0D8]">{label}</span>
    </button>
  );
}
