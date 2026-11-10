"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  Layers,
  BookOpen,
  CheckSquare,
  Mail,
  Plus,
  Image as ImageIcon,
  Settings,
  ArrowRight,
  Calendar,
  Check,
  Activity,
  Upload,
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
  };
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
    action: string;
    entityType: string;
    actorEmailSnapshot: string | null;
    metadata: Record<string, unknown>;
    createdAt: string;
  }[];
}

function buildSmoothSvgPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const midX = (p0.x + p1.x) / 2;
    d += ` C ${midX} ${p0.y}, ${midX} ${p1.y}, ${p1.x} ${p1.y}`;
  }
  return d;
}

function formatAuditTitle(action: string): string {
  const map: Record<string, string> = {
    "media.uploaded": "Media uploaded",
    "media.registered": "Media asset registered",
    "project.created": "Portfolio project created",
    "project.updated": "Project updated",
    "service.created": "Service created",
    "service.updated": "Service updated",
    "blog.created": "Insight article created",
    "blog.updated": "Insight article updated",
    "enquiry.status_updated": "Inquiry status updated",
    "settings.updated": "Website settings updated",
    "auth.login": "Admin signed in",
    "task.created": "Task created",
    "task.updated": "Task updated",
  };
  return map[action] || action.replace(/\./g, " ");
}

function formatShortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function AdminOverviewClient() {
  const router = useRouter();
  const { user, canEdit } = useAdminUser();
  const [data, setData] = useState<OverviewPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [clientDateLabel, setClientDateLabel] = useState("");
  const [greeting, setGreeting] = useState("Welcome back");

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
    const now = new Date();
    const hr = now.getHours();
    const label =
      hr < 12 ? "Good morning" : hr < 17 ? "Good afternoon" : "Good evening";
    const formatted = now.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    let ignore = false;
    Promise.resolve().then(() => {
      if (!ignore) {
        setGreeting(label);
        setClientDateLabel(formatted);
      }
    });

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

  const toggleTask = async (taskId: string, nextCompleted: boolean) => {
    if (!canEdit || !data) return;
    setData({
      ...data,
      tasks: data.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: nextCompleted } : t
      ),
    });

    await fetch(`/api/v1/admin/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: nextCompleted }),
    }).catch(() => {});
  };

  const stats = data?.stats;
  const trends = data?.trends ?? [];
  const maxTrendVal = Math.max(
    4,
    ...trends.map((t) => Math.max(t.projects, t.inquiries))
  );

  const chartW = 540;
  const chartH = 165;
  const padX = 22;
  const padTop = 14;
  const padBottom = 26;
  const usableW = chartW - padX * 2;
  const usableH = chartH - padTop - padBottom;

  const projectPts = trends.map((t, idx) => ({
    x:
      trends.length > 1
        ? padX + (idx / (trends.length - 1)) * usableW
        : chartW / 2,
    y: padTop + usableH - (t.projects / maxTrendVal) * usableH,
  }));
  const inquiryPts = trends.map((t, idx) => ({
    x:
      trends.length > 1
        ? padX + (idx / (trends.length - 1)) * usableW
        : chartW / 2,
    y: padTop + usableH - (t.inquiries / maxTrendVal) * usableH,
  }));

  const projLine = buildSmoothSvgPath(projectPts);
  const inqLine = buildSmoothSvgPath(inquiryPts);
  const baselineY = padTop + usableH;
  const projArea =
    projectPts.length > 0
      ? `${projLine} L ${projectPts[projectPts.length - 1].x} ${baselineY} L ${projectPts[0].x} ${baselineY} Z`
      : "";

  const kpiCards = [
    {
      label: "Portfolio Projects",
      value: stats?.totalProjects ?? 0,
      sub: `${stats?.publishedProjects ?? 0} published · ${stats?.draftProjects ?? 0} drafts`,
      href: "/admin/projects",
      icon: FolderKanban,
    },
    {
      label: "Services",
      value: stats?.totalServices ?? 0,
      sub: `${stats?.publishedServices ?? 0} published · ${stats?.draftServices ?? 0} drafts`,
      href: "/admin/services",
      icon: Layers,
    },
    {
      label: "Blog Posts",
      value: stats?.totalBlogPosts ?? 0,
      sub: `${stats?.publishedBlogPosts ?? 0} published · ${stats?.draftBlogPosts ?? 0} drafts`,
      href: "/admin/blog",
      icon: BookOpen,
    },
    {
      label: "Active Tasks",
      value: stats?.pendingTasks ?? 0,
      sub: `${stats?.completedTasks ?? 0} completed · ${stats?.totalTasks ?? 0} total`,
      href: "/admin/tasks",
      icon: CheckSquare,
    },
    {
      label: "Inquiries",
      value: stats?.totalEnquiries ?? 0,
      sub: `${stats?.newEnquiries ?? 0} new awaiting review`,
      href: "/admin/inquiries",
      icon: Mail,
    },
  ];

  const quickActions = [
    {
      label: "New Portfolio Project",
      href: "/admin/projects?create=1",
      icon: FolderKanban,
      featured: true,
    },
    {
      label: "New Service",
      href: "/admin/services?create=1",
      icon: Layers,
      featured: false,
    },
    {
      label: "New Blog Post",
      href: "/admin/blog?create=1",
      icon: BookOpen,
      featured: false,
    },
    {
      label: "Create Task",
      href: "/admin/tasks?create=1",
      icon: Plus,
      featured: false,
    },
    {
      label: "Upload Media",
      href: "/admin/media",
      icon: ImageIcon,
      featured: false,
    },
    {
      label: "Website Settings",
      href: "/admin/settings",
      icon: Settings,
      featured: false,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Greeting Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-heading font-bold text-2xl sm:text-[28px] tracking-tight text-[#F5F3EE]">
            {greeting}, {user.displayName}
          </h1>
          <p className="text-sm text-[#8D939E]">
            Welcome to the Ediyrex Studio Admin. Manage your content, inquiries,
            tasks, and studio operations.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-xs font-mono text-[#B2B4BA]">
          <Calendar className="w-3.5 h-3.5 text-[#D6B77A]" />
          <span>{clientDateLabel || "Live Workspace"}</span>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-[#2A1414] border border-[#F28B82]/40 text-xs text-[#F28B82]">
          {error}
        </div>
      )}

      {/* 5-Card KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] hover:border-[#D6B77A]/40 transition-colors space-y-3"
            >
              <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                <span className="p-1.5 rounded-md bg-[#181B22] border border-[#252A32] text-[#D6B77A]">
                  <Icon className="w-3.5 h-3.5" />
                </span>
                <span className="truncate font-medium">{card.label}</span>
              </div>
              <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
                {loading ? "—" : card.value}
              </div>
              <div className="text-[11px] text-[#777D87] truncate">
                {card.sub}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Main Middle Grid: Trends Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Project & Inquiry Trends */}
        <section className="lg:col-span-7 p-5 rounded-xl bg-[#111419] border border-[#1E222A] flex flex-col justify-between space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <h2 className="font-heading font-semibold text-sm text-[#F5F3EE]">
                Project &amp; Inquiry Trends
              </h2>
              <div className="flex items-center gap-4 text-[11px] text-[#8D939E]">
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#D6B77A]" />
                  Projects
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#9AA1AC]" />
                  Inquiries
                </span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-[#161920] border border-[#252A32] text-[11px] font-mono text-[#B2B4BA]">
              Last 6 Months
            </span>
          </div>

          <div className="w-full overflow-hidden">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-44"
              role="img"
              aria-label="Project and inquiry monthly trends"
            >
              <defs>
                <linearGradient id="ediyrexGoldArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D6B77A" stopOpacity="0.32" />
                  <stop offset="100%" stopColor="#D6B77A" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              {[0, 0.33, 0.66, 1].map((frac, idx) => {
                const y = padTop + frac * usableH;
                return (
                  <line
                    key={idx}
                    x1={padX}
                    x2={chartW - padX}
                    y1={y}
                    y2={y}
                    stroke="#1E222A"
                    strokeDasharray="3 3"
                  />
                );
              })}

              {projArea && <path d={projArea} fill="url(#ediyrexGoldArea)" />}
              {inqLine && (
                <path
                  d={inqLine}
                  fill="none"
                  stroke="#9AA1AC"
                  strokeWidth="1.75"
                />
              )}
              {projLine && (
                <path
                  d={projLine}
                  fill="none"
                  stroke="#D6B77A"
                  strokeWidth="2.25"
                />
              )}

              {projectPts.map((pt, idx) => (
                <circle
                  key={`p-${idx}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={idx === projectPts.length - 1 ? 4 : 2.5}
                  fill="#D6B77A"
                />
              ))}
              {inquiryPts.map((pt, idx) => (
                <circle
                  key={`i-${idx}`}
                  cx={pt.x}
                  cy={pt.y}
                  r={idx === inquiryPts.length - 1 ? 3.5 : 2}
                  fill="#9AA1AC"
                />
              ))}

              {trends.map((t, idx) => {
                const x =
                  trends.length > 1
                    ? padX + (idx / (trends.length - 1)) * usableW
                    : chartW / 2;
                return (
                  <text
                    key={t.key}
                    x={x}
                    y={chartH - 6}
                    textAnchor="middle"
                    fill="#777D87"
                    fontSize="10"
                    fontFamily="monospace"
                  >
                    {t.label}
                  </text>
                );
              })}
            </svg>
          </div>
        </section>

        {/* Quick Actions 2x3 Grid */}
        <section className="lg:col-span-5 p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-4">
          <h2 className="font-heading font-semibold text-sm text-[#F5F3EE]">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {quickActions.map((act) => {
              const Icon = act.icon;
              return (
                <Link
                  key={act.label}
                  href={act.href}
                  className={cn(
                    "p-3.5 rounded-xl border flex flex-col items-center justify-center text-center gap-2.5 transition-colors min-h-[92px]",
                    act.featured
                      ? "bg-[#1A160E] border-[#D6B77A]/50 text-[#F5E7C8] hover:border-[#D6B77A]"
                      : "bg-[#15181F] border-[#222731] text-[#B2B4BA] hover:text-[#F5F3EE] hover:border-[#323946]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      act.featured ? "text-[#D6B77A]" : "text-[#9CA3AF]"
                    )}
                  />
                  <span className="text-xs font-medium leading-snug">
                    {act.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>

      {/* Bottom 3-Column Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Inquiries */}
        <section className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-sm text-[#F5F3EE]">
              Recent Inquiries
            </h2>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1 text-xs text-[#D6B77A] hover:underline"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-xs font-mono text-[#777D87] py-4">
                Loading inquiries...
              </div>
            ) : !data?.recentEnquiries.length ? (
              <div className="text-xs text-[#777D87] py-4">
                No inquiries received yet.
              </div>
            ) : (
              data.recentEnquiries.map((inq) => {
                const initials = inq.contactName
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <Link
                    key={inq.id}
                    href={`/admin/inquiries?id=${inq.id}`}
                    className="flex items-center justify-between gap-3 p-2 -mx-2 rounded-lg hover:bg-[#161A21] transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#1C1811] border border-[#D6B77A]/30 text-[#D6B77A] text-[11px] font-semibold flex items-center justify-center shrink-0">
                        {initials || "IN"}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[#F5F3EE] truncate">
                          {inq.contactName}
                        </div>
                        <div className="text-[11px] text-[#777D87] truncate">
                          {inq.projectType}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] text-[#6D7480]">
                        {formatShortDate(inq.submittedAt)}
                      </span>
                      <span
                        className={cn(
                          "text-[10px] font-mono px-2 py-0.5 rounded-md border",
                          inq.status === "new"
                            ? "bg-[#D6B77A]/15 text-[#D6B77A] border-[#D6B77A]/30"
                            : "bg-[#181C24] text-[#9CA3AF] border-[#252A32]"
                        )}
                      >
                        {inq.status}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* My Tasks */}
        <section className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-sm text-[#F5F3EE]">
              My Tasks
            </h2>
            <Link
              href="/admin/tasks"
              className="inline-flex items-center gap-1 text-xs text-[#D6B77A] hover:underline"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-xs font-mono text-[#777D87] py-4">
                Loading tasks...
              </div>
            ) : !data?.tasks.length ? (
              <div className="py-4 space-y-2 text-xs text-[#777D87]">
                <p>No studio tasks created yet.</p>
                <Link
                  href="/admin/tasks?create=1"
                  className="inline-block text-[#D6B77A] hover:underline"
                >
                  + Create your first task
                </Link>
              </div>
            ) : (
              data.tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between gap-3"
                >
                  <button
                    type="button"
                    disabled={!canEdit}
                    onClick={() => toggleTask(task.id, !task.completed)}
                    className="flex items-start gap-2.5 text-left min-w-0 cursor-pointer disabled:cursor-default"
                  >
                    <span
                      className={cn(
                        "mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors",
                        task.completed
                          ? "bg-[#D6B77A] border-[#D6B77A] text-[#08090B]"
                          : "bg-[#15181F] border-[#323946]"
                      )}
                    >
                      {task.completed && <Check className="w-3 h-3" />}
                    </span>
                    <div className="min-w-0">
                      <div
                        className={cn(
                          "text-xs font-medium truncate",
                          task.completed
                            ? "line-through text-[#6D7480]"
                            : "text-[#F5F3EE]"
                        )}
                      >
                        {task.title}
                      </div>
                      <div className="text-[11px] text-[#777D87] truncate">
                        {task.category}
                      </div>
                    </div>
                  </button>
                  <span className="text-[10px] font-mono text-[#777D87] shrink-0">
                    {task.completed ? "Completed" : task.dueDateLabel}
                  </span>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-sm text-[#F5F3EE]">
              Recent Activity
            </h2>
            <Link
              href="/admin/activity"
              className="inline-flex items-center gap-1 text-xs text-[#D6B77A] hover:underline"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="text-xs font-mono text-[#777D87] py-4">
                Loading activity...
              </div>
            ) : !data?.recentActivity.length ? (
              <div className="text-xs text-[#777D87] py-4">
                No audit activity recorded yet.
              </div>
            ) : (
              data.recentActivity.map((act) => {
                const isUpload = act.action.startsWith("media.");
                return (
                  <div
                    key={act.id}
                    className="flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#161920] border border-[#252A32] flex items-center justify-center text-[#D6B77A] shrink-0">
                        {isUpload ? (
                          <Upload className="w-3.5 h-3.5 text-[#7CD69F]" />
                        ) : (
                          <Activity className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[#F5F3EE] truncate">
                          {formatAuditTitle(act.action)}
                        </div>
                        <div className="text-[11px] text-[#777D87] truncate">
                          {act.entityType}
                          {act.actorEmailSnapshot
                            ? ` · ${act.actorEmailSnapshot}`
                            : ""}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#6D7480] shrink-0">
                      {formatShortDate(act.createdAt)}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
