"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Briefcase,
  Building,
  Calendar,
  CheckCircle2,
  CheckSquare,
  Clock,
  ExternalLink,
  FileText,
  FolderKanban,
  FolderPlus,
  HelpCircle,
  Inbox,
  Layers,
  LayoutGrid,
  Loader2,
  Mail,
  Plus,
  RefreshCw,
  Server,
  ShieldCheck,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "./AdminContext";

interface OverviewData {
  kpis: {
    openEnquiries: {
      total: number;
      awaitingFirstResponse: number;
      requiringAttention: number;
    };
    activeProjects: {
      total: number;
      inProgress: number;
      approachingDeadline: number;
    };
    pendingTasks: {
      total: number;
      assignedToMe: number;
      overdue: number;
    };
    upcomingDeadlines: {
      total: number;
      nextSevenDays: number;
      overdueCount: number;
    };
  };
  needsAttention: {
    id: string;
    title: string;
    module: "CRM / Leads" | "Tasks" | "Projects" | "Content" | "Follow-ups" | "Integrations";
    urgency: "critical" | "high" | "medium";
    status: string;
    timeAgo: string;
    actionLabel: string;
    href: string;
  }[];
  recentEnquiries: {
    id: string;
    referenceCode: string;
    contactName: string;
    companyName: string | null;
    emailNormalized: string;
    projectType: string;
    status: string;
    submittedAt: string;
    relativeDate: string;
  }[];
  projectPulse: {
    id: string;
    name: string;
    client: string;
    status: string;
    progress: number;
    deadline: string;
    serviceInterest: string;
  }[];
  upcomingDeadlines: {
    id: string;
    title: string;
    type: "task" | "project_milestone" | "client_deliverable" | "follow_up";
    dueAt: string;
    relativeDue: string;
    isOverdue: boolean;
    context: string;
    href: string;
  }[];
  recentActivity: {
    id: string;
    title: string;
    subtitle: string;
    timeAgo: string;
    iconType: "enquiry" | "project" | "content" | "media" | "task" | "default";
  }[];
  platformHealth: {
    website: { status: string; detail: string; isHealthy: boolean };
    database: { status: string; detail: string; isHealthy: boolean };
    emailDelivery: { status: string; detail: string; isHealthy: boolean };
    mediaStorage: { status: string; detail: string; isHealthy: boolean };
    calendarSync: { status: string; detail: string; isHealthy: boolean };
  };
  quickActions: { label: string; href: string; icon: string }[];
}

export function AdminOverviewClient() {
  const router = useRouter();
  const { user } = useAdminUser();

  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchOverview = useCallback(async () => {
    const res = await fetch("/api/v1/admin/overview");
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Failed to load studio overview.");
    }
    return json.data as OverviewData;
  }, [router]);

  useEffect(() => {
    let ignore = false;
    fetchOverview()
      .then((payload) => {
        if (!ignore && payload) setData(payload);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Network error loading overview.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [fetchOverview]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError("");
    try {
      const payload = await fetchOverview();
      if (payload) setData(payload);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Refresh failed.");
    } finally {
      setRefreshing(false);
    }
  };

  const kpis = data?.kpis;

  return (
    <div className="space-y-6 pb-12">
      {/* A. Page Header: Studio Command Center */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F2EC] tracking-tight">
              Studio Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#73C794]/15 border border-[#73C794]/30 text-[#73C794] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#73C794] animate-pulse" />
              Live Operations
            </span>
          </div>
          <p className="text-sm text-[#8F96A3] mt-1 max-w-2xl">
            A central overview of EDYREX operations, ongoing work, incoming opportunities and activities requiring attention.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={refreshing}
            onClick={handleRefresh}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] text-xs font-medium text-[#B2B4BA] transition-colors cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={cn("w-3.5 h-3.5 text-[#D6B77A]", refreshing && "animate-spin")} />
            <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
          </button>

          <Link
            href="/admin/inquiries"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#D6B77A] hover:bg-[#E2C58B] text-xs font-semibold text-[#17130B] transition-colors cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>View Enquiries</span>
          </Link>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-[#F07878]/10 border border-[#F07878]/30 text-xs text-[#F07878] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* B. Four Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Open Enquiries */}
        <Link
          href="/admin/inquiries"
          className="group rounded-2xl bg-[#12151A] border border-[#252A32] hover:border-[#D6B77A]/40 p-4 transition-all flex flex-col justify-between block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8F96A3]">Open Enquiries</span>
            <span className="w-8 h-8 rounded-xl bg-[#D6B77A]/12 border border-[#D6B77A]/25 flex items-center justify-center text-[#D6B77A] group-hover:scale-105 transition-transform">
              <Mail className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-[#F5F2EC]">
                {loading ? "—" : kpis?.openEnquiries.total ?? 0}
              </span>
              <span className="text-xs text-[#8F96A3]">unresolved</span>
            </div>
            <p className="text-[11px] text-[#777D87] mt-1">
              {kpis?.openEnquiries.awaitingFirstResponse ?? 0} awaiting first response
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#1E222A] flex items-center justify-between text-[10px]">
            <span className="text-[#8F96A3]">Requiring attention:</span>
            <span
              className={cn(
                "font-mono font-medium",
                (kpis?.openEnquiries.requiringAttention ?? 0) > 0 ? "text-[#F06419]" : "text-[#73C794]"
              )}
            >
              {kpis?.openEnquiries.requiringAttention ?? 0} flagged
            </span>
          </div>
        </Link>

        {/* KPI 2: Active Projects */}
        <Link
          href="/admin/projects"
          className="group rounded-2xl bg-[#12151A] border border-[#252A32] hover:border-[#73C794]/40 p-4 transition-all flex flex-col justify-between block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8F96A3]">Active Projects</span>
            <span className="w-8 h-8 rounded-xl bg-[#73C794]/12 border border-[#73C794]/25 flex items-center justify-center text-[#73C794] group-hover:scale-105 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-[#F5F2EC]">
                {loading ? "—" : kpis?.activeProjects.total ?? 0}
              </span>
              <span className="text-xs text-[#8F96A3]">active</span>
            </div>
            <p className="text-[11px] text-[#777D87] mt-1">
              {kpis?.activeProjects.inProgress ?? 0} currently in progress
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#1E222A] flex items-center justify-between text-[10px]">
            <span className="text-[#8F96A3]">Due within 14 days:</span>
            <span
              className={cn(
                "font-mono font-medium",
                (kpis?.activeProjects.approachingDeadline ?? 0) > 0 ? "text-[#D6B77A]" : "text-[#B2B4BA]"
              )}
            >
              {kpis?.activeProjects.approachingDeadline ?? 0} projects
            </span>
          </div>
        </Link>

        {/* KPI 3: Pending Tasks */}
        <Link
          href="/admin/tasks"
          className="group rounded-2xl bg-[#12151A] border border-[#252A32] hover:border-[#F06419]/40 p-4 transition-all flex flex-col justify-between block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8F96A3]">Pending Tasks</span>
            <span className="w-8 h-8 rounded-xl bg-[#F06419]/12 border border-[#F06419]/25 flex items-center justify-center text-[#F06419] group-hover:scale-105 transition-transform">
              <CheckSquare className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-[#F5F2EC]">
                {loading ? "—" : kpis?.pendingTasks.total ?? 0}
              </span>
              <span className="text-xs text-[#8F96A3]">incomplete</span>
            </div>
            <p className="text-[11px] text-[#777D87] mt-1">
              {kpis?.pendingTasks.assignedToMe ?? 0} assigned to your profile
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#1E222A] flex items-center justify-between text-[10px]">
            <span className="text-[#8F96A3]">Overdue tasks:</span>
            <span
              className={cn(
                "font-mono font-medium",
                (kpis?.pendingTasks.overdue ?? 0) > 0 ? "text-[#F07878]" : "text-[#73C794]"
              )}
            >
              {kpis?.pendingTasks.overdue ?? 0} past due
            </span>
          </div>
        </Link>

        {/* KPI 4: Upcoming Deadlines */}
        <Link
          href="/admin/tasks"
          className="group rounded-2xl bg-[#12151A] border border-[#252A32] hover:border-[#7BA9F5]/40 p-4 transition-all flex flex-col justify-between block cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#8F96A3]">Upcoming Deadlines</span>
            <span className="w-8 h-8 rounded-xl bg-[#7BA9F5]/12 border border-[#7BA9F5]/25 flex items-center justify-center text-[#7BA9F5] group-hover:scale-105 transition-transform">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-3xl font-bold text-[#F5F2EC]">
                {loading ? "—" : kpis?.upcomingDeadlines.nextSevenDays ?? 0}
              </span>
              <span className="text-xs text-[#8F96A3]">next 7 days</span>
            </div>
            <p className="text-[11px] text-[#777D87] mt-1">
              Studio deliverables &amp; milestones
            </p>
          </div>
          <div className="mt-3 pt-2.5 border-t border-[#1E222A] flex items-center justify-between text-[10px]">
            <span className="text-[#8F96A3]">Delayed / overdue:</span>
            <span
              className={cn(
                "font-mono font-medium",
                (kpis?.upcomingDeadlines.overdueCount ?? 0) > 0 ? "text-[#F07878]" : "text-[#73C794]"
              )}
            >
              {kpis?.upcomingDeadlines.overdueCount ?? 0} requiring action
            </span>
          </div>
        </Link>
      </div>

      {/* Main Grid: Needs Attention + Project Pulse */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Needs Attention & Recent Enquiries (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* C. Needs Attention */}
          <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F06419]" />
                <h2 className="font-heading text-sm font-semibold text-[#F5F2EC]">
                  Needs Attention
                </h2>
                <span className="text-[11px] font-mono text-[#8F96A3]">
                  ({data?.needsAttention?.length ?? 0} active priorities)
                </span>
              </div>
              <span className="text-[10px] font-mono uppercase text-[#777D87]">
                Actionable Operations
              </span>
            </div>

            {loading ? (
              <div className="py-8 flex items-center justify-center gap-2 text-xs text-[#8F96A3]">
                <Loader2 className="w-4 h-4 animate-spin text-[#D6B77A]" />
                <span>Checking operational state...</span>
              </div>
            ) : !data?.needsAttention?.length ? (
              <div className="py-8 text-center text-xs text-[#73C794] flex flex-col items-center gap-1.5">
                <CheckCircle2 className="w-5 h-5" />
                <span>All studio operations up to date. No pending alerts.</span>
              </div>
            ) : (
              <div className="space-y-2.5">
                {data.needsAttention.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] hover:border-[#252A32] transition-colors flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold",
                            item.urgency === "critical"
                              ? "bg-[#F07878]/15 text-[#F07878] border border-[#F07878]/30"
                              : item.urgency === "high"
                              ? "bg-[#F06419]/15 text-[#F06419] border border-[#F06419]/30"
                              : "bg-[#D6B77A]/15 text-[#D6B77A] border border-[#D6B77A]/30"
                          )}
                        >
                          {item.module}
                        </span>
                        <span className="text-[10px] text-[#777D87] font-mono">
                          · {item.timeAgo}
                        </span>
                      </div>
                      <p className="font-medium text-[#F5F2EC] truncate">{item.title}</p>
                    </div>

                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#1E222A] hover:bg-[#252A32] text-[11px] font-semibold text-[#D6B77A] transition-colors shrink-0"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* D. Recent Enquiries */}
          <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D6B77A]" />
                <h2 className="font-heading text-sm font-semibold text-[#F5F2EC]">
                  Recent Enquiries
                </h2>
              </div>
              <Link
                href="/admin/inquiries"
                className="text-xs text-[#D6B77A] hover:underline inline-flex items-center gap-1"
              >
                <span>CRM Workspace</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="py-6 text-center text-xs text-[#8F96A3]">Loading incoming leads...</div>
            ) : !data?.recentEnquiries?.length ? (
              <div className="py-6 text-center text-xs text-[#777D87]">No incoming enquiries logged.</div>
            ) : (
              <div className="divide-y divide-[#1E222A]">
                {data.recentEnquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className="py-3 flex items-center justify-between gap-3 text-xs first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-[#F5F2EC] truncate">
                          {inq.contactName}
                        </span>
                        {inq.companyName && (
                          <span className="text-[11px] text-[#8F96A3] truncate">
                            ({inq.companyName})
                          </span>
                        )}
                        <span className="font-mono text-[10px] text-[#777D87]">
                          · {inq.referenceCode}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#B2B4BA] truncate mt-0.5">
                        {inq.projectType}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-[10px] font-mono text-[#777D87]">
                        {inq.relativeDate}
                      </span>
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-mono capitalize",
                          inq.status === "new"
                            ? "bg-[#F06419]/20 text-[#F06419]"
                            : inq.status === "review"
                            ? "bg-[#D6B77A]/20 text-[#D6B77A]"
                            : "bg-[#73C794]/20 text-[#73C794]"
                        )}
                      >
                        {inq.status}
                      </span>
                      <Link
                        href={`/admin/inquiries?id=${inq.id}`}
                        className="p-1 rounded text-[#8F96A3] hover:text-[#F5F2EC] hover:bg-[#1E222A]"
                        title="Open enquiry"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Project Pulse, Upcoming Deadlines, Activity & Health (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* E. Project Pulse */}
          <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-[#73C794]" />
                <h2 className="font-heading text-sm font-semibold text-[#F5F2EC]">
                  Project Pulse
                </h2>
              </div>
              <Link
                href="/admin/projects"
                className="text-xs text-[#73C794] hover:underline inline-flex items-center gap-1"
              >
                <span>Projects</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {loading ? (
              <div className="py-6 text-center text-xs text-[#8F96A3]">Loading active projects...</div>
            ) : !data?.projectPulse?.length ? (
              <div className="py-6 text-center text-xs text-[#777D87]">No active projects tracked.</div>
            ) : (
              <div className="space-y-3">
                {data.projectPulse.map((project) => (
                  <div
                    key={project.id}
                    className="p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="min-w-0">
                        <span className="font-semibold text-[#F5F2EC] truncate block">
                          {project.name}
                        </span>
                        <span className="text-[11px] text-[#777D87] truncate block">
                          {project.client} · {project.serviceInterest}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#1E222A] text-[#B2B4BA]">
                        {project.status}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#777D87]">
                        <span>Progress</span>
                        <span className="font-mono text-[#D6B77A]">{project.progress}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#1E222A] overflow-hidden">
                        <div
                          className="h-full bg-[#D6B77A] rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-[#777D87] pt-1">
                      <span>Deadline:</span>
                      <span className="font-mono text-[#B2B4BA]">{project.deadline}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* F. Upcoming Deadlines */}
          <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#7BA9F5]" />
                <h2 className="font-heading text-sm font-semibold text-[#F5F2EC]">
                  Upcoming Deadlines
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#777D87]">Next 7 Days</span>
            </div>

            {!data?.upcomingDeadlines?.length ? (
              <div className="py-4 text-center text-xs text-[#73C794]">
                No pending deadlines within 7 days.
              </div>
            ) : (
              <div className="space-y-2 text-xs">
                {data.upcomingDeadlines.map((dl) => (
                  <Link
                    key={dl.id}
                    href={dl.href}
                    className="p-2.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] hover:border-[#252A32] flex items-center justify-between gap-2 block transition-colors"
                  >
                    <div className="min-w-0 space-y-0.5">
                      <span className="font-medium text-[#F5F2EC] truncate block">
                        {dl.title}
                      </span>
                      <span className="text-[10px] text-[#777D87] truncate block">
                        {dl.context}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-[#D6B77A] shrink-0">
                      {dl.relativeDue}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* G. Recent Activity */}
          <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#D6B77A]" />
                <h2 className="font-heading text-sm font-semibold text-[#F5F2EC]">
                  Recent Activity
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#777D87]">Audit Trail</span>
            </div>

            <div className="space-y-2.5 text-xs">
              {data?.recentActivity?.slice(0, 5).map((act) => (
                <div key={act.id} className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <span className="font-medium text-[#F5F2EC] block truncate">
                      {act.title}
                    </span>
                    <span className="text-[11px] text-[#777D87] block truncate">
                      {act.subtitle}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#5E6570] shrink-0">
                    {act.timeAgo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* H. Verified Platform Health */}
          <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
              <div className="flex items-center gap-2">
                <Server className="w-4 h-4 text-[#73C794]" />
                <h2 className="font-heading text-sm font-semibold text-[#F5F2EC]">
                  Platform &amp; Integration Health
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#73C794]">Verified Status</span>
            </div>

            <div className="grid grid-cols-1 gap-2 text-xs">
              {data?.platformHealth && (
                <>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0D0F12] border border-[#1E222A]">
                    <span className="text-[#8F96A3]">Public Website:</span>
                    <span className="text-[#73C794] font-medium font-mono text-[11px]">
                      {data.platformHealth.website.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0D0F12] border border-[#1E222A]">
                    <span className="text-[#8F96A3]">PostgreSQL Database:</span>
                    <span className="text-[#73C794] font-medium font-mono text-[11px]">
                      {data.platformHealth.database.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0D0F12] border border-[#1E222A]">
                    <span className="text-[#8F96A3]">Transactional Email:</span>
                    <span
                      className={cn(
                        "font-medium font-mono text-[11px]",
                        data.platformHealth.emailDelivery.isHealthy ? "text-[#73C794]" : "text-[#D6B77A]"
                      )}
                    >
                      {data.platformHealth.emailDelivery.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0D0F12] border border-[#1E222A]">
                    <span className="text-[#8F96A3]">Media Storage (Cloudinary):</span>
                    <span
                      className={cn(
                        "font-medium font-mono text-[11px]",
                        data.platformHealth.mediaStorage.isHealthy ? "text-[#73C794]" : "text-[#D6B77A]"
                      )}
                    >
                      {data.platformHealth.mediaStorage.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-[#0D0F12] border border-[#1E222A]">
                    <span className="text-[#8F96A3]">Google Calendar Sync:</span>
                    <span
                      className={cn(
                        "font-medium font-mono text-[11px]",
                        data.platformHealth.calendarSync.isHealthy ? "text-[#73C794]" : "text-[#777D87]"
                      )}
                    >
                      {data.platformHealth.calendarSync.status}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* I. Quick Operational Actions */}
      <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-3">
        <h2 className="font-heading text-sm font-semibold text-[#F5F2EC]">
          Quick Operational Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-xs">
          <Link
            href="/admin/projects"
            className="p-3 rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-center space-y-1.5 transition-colors cursor-pointer block"
          >
            <FolderPlus className="w-4 h-4 text-[#D6B77A] mx-auto" />
            <span className="font-medium text-[#F5F2EC] block truncate">Create Project</span>
          </Link>

          <Link
            href="/admin/tasks"
            className="p-3 rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-center space-y-1.5 transition-colors cursor-pointer block"
          >
            <CheckSquare className="w-4 h-4 text-[#D6B77A] mx-auto" />
            <span className="font-medium text-[#F5F2EC] block truncate">Create Task</span>
          </Link>

          <Link
            href="/admin/inquiries?view=clients"
            className="p-3 rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-center space-y-1.5 transition-colors cursor-pointer block"
          >
            <UserPlus className="w-4 h-4 text-[#D6B77A] mx-auto" />
            <span className="font-medium text-[#F5F2EC] block truncate">Add Client</span>
          </Link>

          <Link
            href="/admin/inquiries"
            className="p-3 rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-center space-y-1.5 transition-colors cursor-pointer block"
          >
            <Inbox className="w-4 h-4 text-[#D6B77A] mx-auto" />
            <span className="font-medium text-[#F5F2EC] block truncate">View Enquiries</span>
          </Link>

          <Link
            href="/admin/pages"
            className="p-3 rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-center space-y-1.5 transition-colors cursor-pointer block"
          >
            <FileText className="w-4 h-4 text-[#D6B77A] mx-auto" />
            <span className="font-medium text-[#F5F2EC] block truncate">Publish Content</span>
          </Link>

          <Link
            href="/admin/services"
            className="p-3 rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-center space-y-1.5 transition-colors cursor-pointer block"
          >
            <Layers className="w-4 h-4 text-[#D6B77A] mx-auto" />
            <span className="font-medium text-[#F5F2EC] block truncate">Manage Services</span>
          </Link>

          <Link
            href="/admin/industries"
            className="p-3 rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A] text-center space-y-1.5 transition-colors cursor-pointer block"
          >
            <LayoutGrid className="w-4 h-4 text-[#D6B77A] mx-auto" />
            <span className="font-medium text-[#F5F2EC] block truncate">Manage Industries</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
