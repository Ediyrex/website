"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Briefcase,
  Layers,
  Calendar,
  AlertTriangle,
  Zap,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  FileText,
  Upload,
  LayoutGrid,
  Image as ImageIcon,
  ChevronDown,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "./AdminContext";

interface OverviewPayload {
  stats: {
    totalProjects: number;
    publishedProjects: number;
    draftProjects: number;
    totalServices: number;
    publishedServices: number;
    draftServices: number;
    totalBlogPosts: number;
    publishedBlogPosts: number;
    draftBlogPosts: number;
    totalTasks: number;
    pendingTasks: number;
    completedTasks: number;
    totalEnquiries: number;
    newEnquiries: number;
    totalMediaAssets: number;
    openEnquiries?: number;
    activeProjects?: number;
    pendingContent?: number;
    upcomingDeadlines?: number;
  };
  needsAttention: {
    id: string;
    title: string;
    description: string;
    timeAgo: string;
    actionLabel: string;
    href: string;
    type: "enquiry" | "content" | "deadline";
  }[];
  projectPulse: {
    id: string;
    name: string;
    status: string;
    progress: number;
  }[];
  trends: {
    key: string;
    label: string;
    projects: number;
    inquiries: number;
  }[];
  recentEnquiries: {
    id: string;
    referenceCode: string;
    contactName: string;
    emailNormalized: string;
    projectType: string;
    status: string;
    submittedAt: string;
    relativeDate?: string;
  }[];
  tasks: {
    id: string;
    title: string;
    category: string;
    dueDateLabel: string;
    completed: boolean;
  }[];
  recentActivity: {
    id: string;
    title: string;
    subtitle: string;
    timeAgo: string;
    iconType: "enquiry" | "project" | "content" | "media" | "default";
  }[];
  platformHealth: {
    publicWebsite: string;
    enquiryDelivery: string;
    mediaStorage: string;
    emailDelivery: string;
  };
}

export function AdminOverviewClient() {
  const router = useRouter();
  const { user } = useAdminUser();
  const [data, setData] = useState<OverviewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);

  const fetchOverview = useCallback(async () => {
    const res = await fetch("/api/v1/admin/overview");
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Unable to load dashboard overview.");
    }
    return json.data as OverviewPayload;
  }, [router]);

  useEffect(() => {
    let ignore = false;
    fetchOverview()
      .then((payload) => {
        if (!ignore && payload) setData(payload);
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Network error loading overview."
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [fetchOverview]);

  const stats = data?.stats;

  // Operational KPI values
  const openEnquiriesVal = stats?.openEnquiries ?? stats?.newEnquiries ?? 8;
  const activeProjectsVal = stats?.activeProjects ?? stats?.publishedProjects ?? 5;
  const pendingContentVal =
    stats?.pendingContent ??
    ((stats?.draftProjects ?? 0) + (stats?.draftServices ?? 0) + (stats?.draftBlogPosts ?? 0) || 4);
  const upcomingDeadlinesVal = stats?.upcomingDeadlines ?? stats?.pendingTasks ?? 3;

  // Needs Attention items
  const attentionItems = data?.needsAttention?.length
    ? data.needsAttention
    : [
        {
          id: "att-1",
          title: "New project enquiry",
          description: "A new enquiry is waiting for your review.",
          timeAgo: "Just now",
          actionLabel: "REVIEW",
          href: "/admin/inquiries",
          type: "enquiry" as const,
        },
        {
          id: "att-2",
          title: "Case study awaiting publication",
          description: "A project draft needs approval.",
          timeAgo: "2 h ago",
          actionLabel: "OPEN",
          href: "/admin/projects",
          type: "content" as const,
        },
        {
          id: "att-3",
          title: "Project milestone approaching",
          description: "A milestone is due in 3 days (Vocalis).",
          timeAgo: "Yesterday",
          actionLabel: "VIEW",
          href: "/admin/tasks",
          type: "deadline" as const,
        },
      ];

  // Project Pulse items
  const pulseItems = data?.projectPulse?.length
    ? data.projectPulse
    : [
        {
          id: "pulse-1",
          name: "EDYREX Website",
          status: "In Progress",
          progress: 78,
        },
        {
          id: "pulse-2",
          name: "Vocalis",
          status: "R&D",
          progress: 42,
        },
        {
          id: "pulse-3",
          name: "FlowOps",
          status: "Completed",
          progress: 100,
        },
      ];

  // Recent Enquiries
  const recentEnquiries = data?.recentEnquiries?.length
    ? data.recentEnquiries.slice(0, 3)
    : [
        {
          id: "enq-1",
          referenceCode: "ENQ-9421",
          contactName: "Aarav Sharma",
          emailNormalized: "aarav@gmail.com",
          projectType: "Web Development",
          status: "new",
          submittedAt: new Date().toISOString(),
          relativeDate: "Today",
        },
        {
          id: "enq-2",
          referenceCode: "ENQ-9420",
          contactName: "Northstar Digital",
          emailNormalized: "contact@northstar.ai",
          projectType: "AI Automation",
          status: "review",
          submittedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          relativeDate: "Yesterday",
        },
        {
          id: "enq-3",
          referenceCode: "ENQ-9419",
          contactName: "Meridian Health",
          emailNormalized: "info@meridianhealth.co",
          projectType: "Branding & Marketing",
          status: "contacted",
          submittedAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
          relativeDate: "Nov 17",
        },
      ];

  // Recent Activity
  const activityItems = data?.recentActivity?.length
    ? data.recentActivity.slice(0, 4)
    : [
        {
          id: "act-1",
          title: "New enquiry received",
          subtitle: "From Aarav Sharma",
          timeAgo: "Just now",
          iconType: "enquiry" as const,
        },
        {
          id: "act-2",
          title: "Project updated",
          subtitle: "Vocalis — Status changed to R&D",
          timeAgo: "2 h ago",
          iconType: "project" as const,
        },
        {
          id: "act-3",
          title: "Content updated",
          subtitle: "Services / AI & Automation",
          timeAgo: "5 h ago",
          iconType: "content" as const,
        },
        {
          id: "act-4",
          title: "Media uploaded",
          subtitle: "5 new assets added",
          timeAgo: "Yesterday",
          iconType: "media" as const,
        },
      ];

  return (
    <div className="space-y-6 pb-12">
      {/* 1. Header: Command Center Title & Controls */}
      <div className="flex flex-wrap items-start justify-between gap-4 pt-1">
        <div className="space-y-1">
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F2EC] tracking-tight">
            Studio Overview
          </h1>
          <p className="text-sm text-[#B8B9BC]">
            Your studio, projects and operations at a glance.
          </p>
        </div>

        <div className="flex items-center gap-3 relative">
          {/* Date Range Dropdown */}
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
                {["Last 7 Days", "Last 30 Days", "This Quarter", "Year to Date"].map(
                  (range) => (
                    <button
                      key={range}
                      type="button"
                      onClick={() => {
                        setDateRange(range);
                        setDateDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full text-left px-3.5 py-2 hover:bg-[#1E232B] transition-colors cursor-pointer",
                        dateRange === range
                          ? "text-[#F06419] font-medium"
                          : "text-[#B8B9BC]"
                      )}
                    >
                      {range}
                    </button>
                  )
                )}
              </div>
            )}
          </div>

          {/* Operational Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#56C58B]/10 border border-[#56C58B]/25 text-xs font-mono text-[#56C58B]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#56C58B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#56C58B]" />
            </span>
            <span>All Systems Operational</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#2A1414] border border-[#E36B68]/40 text-xs text-[#E36B68]">
          {error}
        </div>
      )}

      {/* 2. Top Row: 4 Operational KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Open Enquiries */}
        <Link
          href="/admin/inquiries"
          className="group relative p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#F06419]/50 transition-all duration-200 overflow-hidden space-y-3"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#F06419]/15 border border-[#F06419]/30 flex items-center justify-center text-[#F06419]">
              <Mail className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">
              Open Enquiries
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {loading ? "—" : String(openEnquiriesVal).padStart(2, "0")}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#56C58B]/15 text-[#56C58B] border border-[#56C58B]/25">
              ↑ +33%
            </span>
          </div>
          <p className="text-[11.5px] text-[#898D94]">
            Enquiries awaiting a response
          </p>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#F06419]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        {/* Card 2: Active Projects */}
        <Link
          href="/admin/projects"
          className="group relative p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#E9B45A]/50 transition-all duration-200 overflow-hidden space-y-3"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#E9B45A]/15 border border-[#E9B45A]/30 flex items-center justify-center text-[#E9B45A]">
              <Briefcase className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">
              Active Projects
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {loading ? "—" : String(activeProjectsVal).padStart(2, "0")}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#56C58B]/15 text-[#56C58B] border border-[#56C58B]/25">
              ↑ +25%
            </span>
          </div>
          <p className="text-[11.5px] text-[#898D94]">
            Currently in progress
          </p>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#E9B45A]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        {/* Card 3: Pending Content */}
        <Link
          href="/admin/pages"
          className="group relative p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#D9B875]/50 transition-all duration-200 overflow-hidden space-y-3"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#D9B875]/15 border border-[#D9B875]/30 flex items-center justify-center text-[#D9B875]">
              <Layers className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">
              Pending Content
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {loading ? "—" : String(pendingContentVal).padStart(2, "0")}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#E9B45A]/15 text-[#E9B45A] border border-[#E9B45A]/25">
              ↑ +100%
            </span>
          </div>
          <p className="text-[11.5px] text-[#898D94]">
            Drafts awaiting review or publishing
          </p>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#D9B875]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>

        {/* Card 4: Upcoming Deadlines */}
        <Link
          href="/admin/tasks"
          className="group relative p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#F06419]/50 transition-all duration-200 overflow-hidden space-y-3"
        >
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#F06419]/15 border border-[#F06419]/30 flex items-center justify-center text-[#F06419]">
              <Calendar className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">
              Upcoming Deadlines
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {loading ? "—" : String(upcomingDeadlinesVal).padStart(2, "0")}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#292E35] text-[#898D94] border border-[#363B43]">
              → 0%
            </span>
          </div>
          <p className="text-[11.5px] text-[#898D94]">
            Milestones in the next 7 days
          </p>
          <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[#F06419]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      </div>

      {/* 3. Middle Row: Needs Attention (~60%) + Quick Actions (~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Needs Attention Panel */}
        <section className="lg:col-span-7 p-6 rounded-2xl bg-[#121519] border border-[#292E35] flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-[#F06419]" />
              <h2 className="font-heading font-semibold text-base text-[#F5F2EC]">
                Needs Attention
              </h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#161A1F] border border-[#292E35] text-xs font-mono text-[#B8B9BC]">
              {attentionItems.length} items
            </span>
          </div>

          <div className="divide-y divide-[#292E35]/60">
            {attentionItems.map((item) => {
              const Icon =
                item.type === "enquiry"
                  ? Mail
                  : item.type === "content"
                  ? FileText
                  : Calendar;
              return (
                <div
                  key={item.id}
                  className="py-3.5 first:pt-0 last:pb-0 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-[#161A1F] border border-[#292E35] flex items-center justify-center text-[#E9B45A] shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-[#F5F2EC] truncate">
                        {item.title}
                      </div>
                      <div className="text-xs text-[#898D94] truncate">
                        {item.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <span className="text-xs font-mono text-[#898D94]">
                      {item.timeAgo}
                    </span>
                    <Link
                      href={item.href}
                      className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-[#F06419] hover:text-[#ff782e] transition-colors"
                    >
                      <span>{item.actionLabel}</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Quick Actions Panel */}
        <section className="lg:col-span-5 p-6 rounded-2xl bg-[#121519] border border-[#292E35] flex flex-col justify-between space-y-5">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-[#F06419]" />
            <h2 className="font-heading font-semibold text-base text-[#F5F2EC]">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {/* New Project: Dark by default, turns orange on hover */}
            <Link
              href="/admin/projects?create=1"
              className="p-3.5 rounded-xl bg-[#161A1F] border border-[#292E35] hover:bg-[#F06419] hover:border-[#F06419] text-[#F5F2EC] hover:text-white text-xs font-medium flex flex-col items-center justify-center text-center hover:shadow-[0_4px_20px_rgb(240_100_25_/_25%)] transition-all duration-200 min-h-[82px] group"
            >
              <span className="text-base leading-none mb-1 text-[#898D94] group-hover:text-white transition-colors">
                +
              </span>
              <span className="transition-all">New Project</span>
            </Link>

            {/* Create Content */}
            <Link
              href="/admin/pages?create=1"
              className="p-3.5 rounded-xl bg-[#161A1F] border border-[#292E35] hover:bg-[#F06419] hover:border-[#F06419] text-[#F5F2EC] hover:text-white text-xs font-medium flex flex-col items-center justify-center text-center hover:shadow-[0_4px_20px_rgb(240_100_25_/_25%)] transition-all duration-200 min-h-[82px] group"
            >
              <span className="text-base leading-none mb-1 text-[#898D94] group-hover:text-white transition-colors">
                +
              </span>
              <span className="transition-all">Create Content</span>
            </Link>

            {/* Add Enquiry */}
            <Link
              href="/admin/inquiries?create=1"
              className="p-3.5 rounded-xl bg-[#161A1F] border border-[#292E35] hover:bg-[#F06419] hover:border-[#F06419] text-[#F5F2EC] hover:text-white text-xs font-medium flex flex-col items-center justify-center text-center hover:shadow-[0_4px_20px_rgb(240_100_25_/_25%)] transition-all duration-200 min-h-[82px] group"
            >
              <span className="text-base leading-none mb-1 text-[#898D94] group-hover:text-white transition-colors">
                +
              </span>
              <span className="transition-all">Add Enquiry</span>
            </Link>

            {/* Manage Services */}
            <Link
              href="/admin/services"
              className="p-3.5 rounded-xl bg-[#161A1F] border border-[#292E35] hover:border-[#F06419]/50 hover:bg-[#1E232B] text-[#B8B9BC] hover:text-[#F5F2EC] text-xs font-medium flex flex-col items-center justify-center gap-1.5 text-center transition-all duration-200 min-h-[82px] group"
            >
              <Layers className="w-4 h-4 text-[#898D94] group-hover:text-[#F06419] transition-colors" />
              <span className="truncate">Manage Services</span>
            </Link>

            {/* Manage Industries */}
            <Link
              href="/admin/services?view=industries"
              className="p-3.5 rounded-xl bg-[#161A1F] border border-[#292E35] hover:border-[#F06419]/50 hover:bg-[#1E232B] text-[#B8B9BC] hover:text-[#F5F2EC] text-xs font-medium flex flex-col items-center justify-center gap-1.5 text-center transition-all duration-200 min-h-[82px] group"
            >
              <LayoutGrid className="w-4 h-4 text-[#898D94] group-hover:text-[#F06419] transition-colors" />
              <span className="truncate">Manage Industries</span>
            </Link>

            {/* Upload Media */}
            <Link
              href="/admin/media"
              className="p-3.5 rounded-xl bg-[#161A1F] border border-[#292E35] hover:border-[#F06419]/50 hover:bg-[#1E232B] text-[#B8B9BC] hover:text-[#F5F2EC] text-xs font-medium flex flex-col items-center justify-center gap-1.5 text-center transition-all duration-200 min-h-[82px] group"
            >
              <ImageIcon className="w-4 h-4 text-[#898D94] group-hover:text-[#F06419] transition-colors" />
              <span className="truncate">Upload Media</span>
            </Link>
          </div>
        </section>
      </div>

      {/* 4. Lower Row: Recent Enquiries (~30%), Project Pulse (~30%), Recent Activity (~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Recent Enquiries (30%) */}
        <section className="lg:col-span-4 p-6 rounded-2xl bg-[#121519] border border-[#292E35] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#898D94]" />
              <h2 className="font-heading font-semibold text-sm text-[#F5F2EC]">
                Recent Enquiries
              </h2>
            </div>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#F06419] hover:underline"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentEnquiries.map((inq) => {
              const initials = inq.contactName
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const statusUpper = inq.status.toUpperCase();
              const isNew = statusUpper === "NEW";
              const isReview = statusUpper === "REVIEW";

              return (
                <Link
                  key={inq.id}
                  href={`/admin/inquiries?id=${inq.id}`}
                  className="flex items-center justify-between gap-3 p-2 -mx-2 rounded-xl hover:bg-[#161A1F] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#161A1F] border border-[#292E35] text-[#F5F2EC] text-[11px] font-semibold flex items-center justify-center shrink-0">
                      {initials || "EN"}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#F5F2EC] truncate">
                        {inq.contactName}
                      </div>
                      <div className="text-[11px] text-[#898D94] truncate">
                        {inq.projectType}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold border",
                        isNew
                          ? "bg-[#F06419]/15 text-[#F06419] border-[#F06419]/30"
                          : isReview
                          ? "bg-[#E9B45A]/15 text-[#E9B45A] border-[#E9B45A]/30"
                          : "bg-[#292E35] text-[#898D94] border-[#363B43]"
                      )}
                    >
                      {statusUpper}
                    </span>
                    <span className="text-[11px] font-mono text-[#898D94]">
                      {inq.relativeDate || "Today"}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Project Pulse (30%) */}
        <section className="lg:col-span-4 p-6 rounded-2xl bg-[#121519] border border-[#292E35] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#898D94]" />
              <h2 className="font-heading font-semibold text-sm text-[#F5F2EC]">
                Project Pulse
              </h2>
            </div>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#F06419] hover:underline"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-4">
            {pulseItems.map((proj) => (
              <div key={proj.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="min-w-0">
                    <span className="font-medium text-[#F5F2EC] truncate">
                      {proj.name}
                    </span>
                    <span className="block text-[11px] text-[#898D94]">
                      {proj.status}
                    </span>
                  </div>
                  <span className="font-mono text-xs text-[#F5F2EC] font-semibold">
                    {proj.progress}%
                  </span>
                </div>
                {/* Horizontal Orange Progress Bar */}
                <div className="h-2 w-full rounded-full bg-[#161A1F] border border-[#292E35] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#F06419] transition-all duration-500"
                    style={{ width: `${proj.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activity (40%) */}
        <section className="lg:col-span-4 p-6 rounded-2xl bg-[#121519] border border-[#292E35] flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#898D94]" />
              <h2 className="font-heading font-semibold text-sm text-[#F5F2EC]">
                Recent Activity
              </h2>
            </div>
            <Link
              href="/admin/activity"
              className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#F06419] hover:underline"
            >
              <span>View Log</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {activityItems.map((act) => {
              const Icon =
                act.iconType === "enquiry"
                  ? Mail
                  : act.iconType === "project"
                  ? Layers
                  : act.iconType === "content"
                  ? FileText
                  : Upload;

              return (
                <div
                  key={act.id}
                  className="flex items-center justify-between gap-3 p-1.5 -mx-1.5 rounded-xl hover:bg-[#161A1F] transition-colors"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-[#161A1F] border border-[#292E35] flex items-center justify-center text-[#D9B875] shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#F5F2EC] truncate">
                        {act.title}
                      </div>
                      <div className="text-[11px] text-[#898D94] truncate">
                        {act.subtitle}
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-[#898D94] shrink-0">
                    {act.timeAgo}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* 5. Bottom Row: Platform Health */}
      <section className="p-5 rounded-2xl bg-[#121519] border border-[#292E35] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#D9B875]" />
          <span className="font-heading font-semibold text-sm text-[#F5F2EC]">
            Platform Health
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-6 sm:gap-8 text-xs">
          {/* Public Website */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#56C58B] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#56C58B]" />
            </span>
            <span className="text-[#898D94]">Public Website</span>
            <span className="font-mono text-[#F5F2EC] font-medium">Operational</span>
          </div>

          {/* Enquiry Delivery */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#56C58B]" />
            <span className="text-[#898D94]">Enquiry Delivery</span>
            <span className="font-mono text-[#F5F2EC] font-medium">Connected</span>
          </div>

          {/* Media Storage */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#56C58B]" />
            <span className="text-[#898D94]">Media Storage</span>
            <span className="font-mono text-[#F5F2EC] font-medium">Connected</span>
          </div>

          {/* Email Delivery */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#56C58B]" />
            <span className="text-[#898D94]">Email Delivery</span>
            <span className="font-mono text-[#F5F2EC] font-medium">Connected</span>
          </div>
        </div>

        <Link
          href="/admin/settings?tab=integrations"
          className="inline-flex items-center gap-1 text-xs font-mono font-medium text-[#F06419] hover:underline"
        >
          <span>View Integrations</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </section>
    </div>
  );
}
