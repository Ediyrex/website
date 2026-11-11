"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Archive,
  Calendar,
  CheckCircle2,
  Clock,
  Copy,
  FolderKanban,
  MoreHorizontal,
  PauseCircle,
  PlayCircle,
  Plus,
  Search,
  Star,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PROJECT_STATUS_META,
  formatShortDate,
  getInitials,
  type PmsProjectSummary,
  type PmsTemplateSummary,
} from "./pms-types";

interface PmsDashboardViewProps {
  title: string;
  projects: PmsProjectSummary[];
  kpis: {
    total: number;
    inProgress: number;
    completed: number;
    onHold: number;
  };
  upcomingDeadlines: Array<{
    id: string;
    projectId: string;
    projectTitle: string;
    title: string;
    priority: string;
    dueDate: string | null;
  }>;
  templates: PmsTemplateSummary[];
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  loading: boolean;
  canEdit: boolean;
  isAdmin: boolean;
  onOpenProject: (projectId: string) => void;
  onToggleStar: (projectId: string) => void;
  onStatusChange: (projectId: string, nextStatus: string) => void;
  onDuplicateProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onNewProject: (templateKey?: string) => void;
  onOpenTask: (projectId: string, taskId: string) => void;
}

export function PmsDashboardView({
  title,
  projects,
  kpis,
  upcomingDeadlines,
  templates,
  searchQuery,
  onSearchQueryChange,
  statusFilter,
  onStatusFilterChange,
  loading,
  canEdit,
  isAdmin,
  onOpenProject,
  onToggleStar,
  onStatusChange,
  onDuplicateProject,
  onDeleteProject,
  onNewProject,
  onOpenTask,
}: PmsDashboardViewProps) {
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [pendingDeleteProject, setPendingDeleteProject] = useState<{
    id: string;
    title: string;
    referenceCode: string;
  } | null>(null);
  const [deletingProject, setDeletingProject] = useState(false);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F2F2F0]">
            {title}
          </h1>
          <p className="text-sm text-[#A1A6AE] mt-1">
            Monitor studio projects, delivery milestones, team workload, and
            active tasks.
          </p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => onNewProject()}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold hover:bg-[#E2C28E] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <KpiBox
          icon={<FolderKanban className="w-4 h-4 text-[#D4AF77]" />}
          label="Total Projects"
          value={kpis.total}
          accent="bg-[#241E14] border-[#D4AF77]/30"
        />
        <KpiBox
          icon={<PlayCircle className="w-4 h-4 text-[#7BA8DF]" />}
          label="In Progress"
          value={kpis.inProgress}
          accent="bg-[#152131] border-[#7BA8DF]/30"
        />
        <KpiBox
          icon={<CheckCircle2 className="w-4 h-4 text-[#56C88A]" />}
          label="Completed"
          value={kpis.completed}
          accent="bg-[#13291E] border-[#56C88A]/30"
        />
        <KpiBox
          icon={<PauseCircle className="w-4 h-4 text-[#E47777]" />}
          label="On Hold"
          value={kpis.onHold}
          accent="bg-[#2A1517] border-[#E47777]/30"
        />
      </div>

      {/* Main Grid: Directory + Deadlines/Templates Rail */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-9 rounded-xl bg-[#111419] border border-[#252A31] overflow-hidden">
          {/* Toolbar */}
          <div className="px-4 py-3.5 border-b border-[#252A31] flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-3.5 h-3.5 text-[#6D7480] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="Search projects, IDs, clients, services..."
                className="w-full h-9 pl-8 pr-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0] placeholder:text-[#6D7480] focus:outline-none focus:border-[#D4AF77]"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              aria-label="Filter projects by status"
              className="h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0] focus:outline-none focus:border-[#D4AF77]"
            >
              <option value="all">All Active Statuses</option>
              <option value="planning">Planning</option>
              <option value="in_progress">In Progress</option>
              <option value="review">In Review</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {loading ? (
            <div className="p-10 text-center text-xs font-mono text-[#A1A6AE]">
              Loading PMS projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="p-12 text-center space-y-2">
              <div className="text-sm font-medium text-[#F2F2F0]">
                No projects match this filter
              </div>
              <p className="text-xs text-[#A1A6AE]">
                Create a project from an EDIYREX template or convert a won CRM
                inquiry.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#252A31] text-[10px] font-mono uppercase tracking-[0.14em] text-[#6D7480] bg-[#0B0D0F]">
                    <th className="py-3 pl-4 pr-2 font-normal">Project</th>
                    <th className="py-3 px-3 font-normal">Client</th>
                    <th className="py-3 px-3 font-normal">Service</th>
                    <th className="py-3 px-3 font-normal">Progress</th>
                    <th className="py-3 px-3 font-normal">Status</th>
                    <th className="py-3 px-3 font-normal">Due Date</th>
                    <th className="py-3 px-3 font-normal">Team</th>
                    <th className="py-3 pl-2 pr-4 font-normal text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252A31]">
                  {projects.map((p) => {
                    const statusMeta =
                      PROJECT_STATUS_META[p.status] ??
                      PROJECT_STATUS_META.planning;
                    return (
                      <tr
                        key={p.id}
                        className="hover:bg-[#171B21]/70 transition-colors"
                      >
                        <td className="py-3.5 pl-4 pr-2">
                          <div className="flex items-center gap-2.5">
                            <button
                              type="button"
                              onClick={() => onToggleStar(p.id)}
                              title={p.isStarred ? "Unstar" : "Star project"}
                              className="text-[#6D7480] hover:text-[#D4AF77] cursor-pointer shrink-0"
                            >
                              <Star
                                className={cn(
                                  "w-3.5 h-3.5",
                                  p.isStarred &&
                                    "text-[#D4AF77] fill-[#D4AF77]"
                                )}
                              />
                            </button>
                            <button
                              type="button"
                              onClick={() => onOpenProject(p.id)}
                              className="text-left group cursor-pointer"
                            >
                              <div className="text-sm font-medium text-[#F2F2F0] group-hover:text-[#D4AF77] line-clamp-1">
                                {p.title}
                              </div>
                              <div className="text-[11px] font-mono text-[#6D7480]">
                                #{p.referenceCode} · {p.completedTasks}/
                                {p.totalTasks} tasks
                              </div>
                            </button>
                          </div>
                        </td>
                        <td className="py-3.5 px-3 text-xs">
                          {p.clientName ? (
                            <Link
                              href="/admin/inquiries?view=clients"
                              className="text-[#D4AF77] hover:underline"
                            >
                              {p.clientCompany || p.clientName}
                            </Link>
                          ) : (
                            <span className="text-[#6D7480]">Internal</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-[#A1A6AE]">
                          {p.serviceInterest}
                        </td>
                        <td className="py-3.5 px-3">
                          <button
                            type="button"
                            onClick={() => onOpenProject(p.id)}
                            className="w-28 text-left cursor-pointer"
                          >
                            <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                              <span className="text-[#F2F2F0]">
                                {p.progress}%
                              </span>
                            </div>
                            <div className="h-1.5 rounded-full bg-[#08090B] overflow-hidden border border-[#252A31]">
                              <div
                                className="h-full bg-[#D4AF77] rounded-full transition-all"
                                style={{ width: `${p.progress}%` }}
                              />
                            </div>
                          </button>
                        </td>
                        <td className="py-3.5 px-3">
                          {canEdit ? (
                            <select
                              value={p.status}
                              onChange={(e) =>
                                onStatusChange(p.id, e.target.value)
                              }
                              aria-label={`Status for ${p.title}`}
                              className={cn(
                                "px-2 py-1 rounded-full text-[11px] font-medium border bg-[#08090B] cursor-pointer",
                                statusMeta.badgeClass
                              )}
                            >
                              <option value="planning">Planning</option>
                              <option value="in_progress">In Progress</option>
                              <option value="review">In Review</option>
                              <option value="completed">Completed</option>
                              <option value="on_hold">On Hold</option>
                              <option value="archived">Archived</option>
                            </select>
                          ) : (
                            <span
                              className={cn(
                                "inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
                                statusMeta.badgeClass
                              )}
                            >
                              {statusMeta.label}
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-3 text-xs text-[#A1A6AE] whitespace-nowrap">
                          {p.dueDate
                            ? formatShortDate(p.dueDate)
                            : p.dueDateLabel}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex -space-x-1.5">
                            {p.team.slice(0, 3).map((m) => (
                              <span
                                key={m.userId}
                                title={m.displayName}
                                className="w-6 h-6 rounded-full bg-[#241E14] border border-[#D4AF77]/45 text-[#D4AF77] text-[10px] font-semibold flex items-center justify-center"
                              >
                                {getInitials(m.displayName)}
                              </span>
                            ))}
                            {p.team.length > 3 && (
                              <span className="w-6 h-6 rounded-full bg-[#171B21] border border-[#252A31] text-[#A1A6AE] text-[10px] flex items-center justify-center">
                                +{p.team.length - 3}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 pl-2 pr-4 text-right relative">
                          <button
                            type="button"
                            onClick={() =>
                              setMenuOpenId(menuOpenId === p.id ? null : p.id)
                            }
                            aria-label={`More actions for ${p.title}`}
                            className="p-1.5 rounded-lg bg-[#171B21] border border-[#252A31] text-[#A1A6AE] hover:text-[#F2F2F0] cursor-pointer"
                          >
                            <MoreHorizontal className="w-3.5 h-3.5" />
                          </button>
                          {menuOpenId === p.id && (
                            <div className="absolute right-4 mt-1 w-44 rounded-xl bg-[#171B21] border border-[#252A31] shadow-2xl py-1.5 z-30 text-left">
                              <button
                                type="button"
                                onClick={() => {
                                  setMenuOpenId(null);
                                  onOpenProject(p.id);
                                }}
                                className="w-full px-3 py-2 text-xs text-[#F2F2F0] hover:bg-[#1E232B] flex items-center gap-2 cursor-pointer"
                              >
                                <FolderKanban className="w-3.5 h-3.5 text-[#D4AF77]" />
                                <span>Open Workspace</span>
                              </button>
                              {canEdit && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMenuOpenId(null);
                                      onDuplicateProject(p.id);
                                    }}
                                    className="w-full px-3 py-2 text-xs text-[#F2F2F0] hover:bg-[#1E232B] flex items-center gap-2 cursor-pointer"
                                  >
                                    <Copy className="w-3.5 h-3.5 text-[#7BA8DF]" />
                                    <span>Duplicate Project</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMenuOpenId(null);
                                      onStatusChange(p.id, "archived");
                                    }}
                                    className="w-full px-3 py-2 text-xs text-[#F2F2F0] hover:bg-[#1E232B] flex items-center gap-2 cursor-pointer"
                                  >
                                    <Archive className="w-3.5 h-3.5 text-[#E7B65D]" />
                                    <span>Archive</span>
                                  </button>
                                </>
                              )}
                              {isAdmin && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setMenuOpenId(null);
                                    setPendingDeleteProject({
                                      id: p.id,
                                      title: p.title,
                                      referenceCode: p.referenceCode,
                                    });
                                  }}
                                  className="w-full px-3 py-2 text-xs text-[#E47777] hover:bg-[#1E232B] flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Project</span>
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right Rail: Upcoming Deadlines + Project Templates */}
        <div className="xl:col-span-3 space-y-5">
          <div className="p-4 rounded-xl bg-[#111419] border border-[#252A31] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F2F2F0]">
              <Clock className="w-3.5 h-3.5 text-[#D4AF77]" />
              <span>Upcoming Deadlines</span>
            </div>
            {upcomingDeadlines.length === 0 ? (
              <div className="text-xs text-[#6D7480]">
                No upcoming task deadlines scheduled.
              </div>
            ) : (
              <div className="divide-y divide-[#1E222A]">
                {upcomingDeadlines.map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => onOpenTask(d.projectId, d.id)}
                    className="w-full py-2.5 first:pt-0 last:pb-0 flex items-start justify-between gap-2 text-left hover:opacity-90 cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#F2F2F0] truncate">
                        {d.title}
                      </div>
                      <div className="text-[11px] text-[#6D7480] truncate">
                        {d.projectTitle}
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-[#D4AF77] shrink-0">
                      {formatShortDate(d.dueDate)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-[#111419] border border-[#252A31] space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#F2F2F0]">
              <Calendar className="w-3.5 h-3.5 text-[#D4AF77]" />
              <span>Studio Project Templates</span>
            </div>
            <div className="space-y-1.5">
              {templates
                .filter((t) => t.key !== "blank")
                .slice(0, 5)
                .map((tpl) => (
                  <button
                    key={tpl.key}
                    type="button"
                    disabled={!canEdit}
                    onClick={() => onNewProject(tpl.key)}
                    className="w-full p-2.5 rounded-lg bg-[#0B0D0F] border border-[#252A31] hover:border-[#D4AF77]/45 text-left transition-colors cursor-pointer disabled:opacity-50"
                  >
                    <div className="flex items-center justify-between text-xs font-medium text-[#F2F2F0]">
                      <span>{tpl.name}</span>
                      <Plus className="w-3 h-3 text-[#D4AF77]" />
                    </div>
                    <div className="text-[10px] font-mono text-[#6D7480] mt-0.5">
                      {tpl.milestonesCount} milestones · {tpl.tasksCount} tasks
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>

      {pendingDeleteProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#E47777]/35 bg-[#111419] p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E47777]/35 bg-[#2A1517] text-[#E47777]">
                <Trash2 className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#F2F2F0]">
                  Shut Down & Delete Project?
                </h3>
                <p className="text-xs text-[#A1A6AE] mt-0.5">
                  #{pendingDeleteProject.referenceCode} ·{" "}
                  {pendingDeleteProject.title}
                </p>
              </div>
            </div>

            <p className="text-xs text-[#D8DCE3] leading-relaxed">
              This will permanently delete this project along with all of its
              tasks, milestones, files, and discussion history.
            </p>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                disabled={deletingProject}
                onClick={() => setPendingDeleteProject(null)}
                className="h-9 px-3 rounded-lg border border-[#252A31] text-xs text-[#A1A6AE] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingProject}
                onClick={async () => {
                  setDeletingProject(true);
                  try {
                    await onDeleteProject(pendingDeleteProject.id);
                    setPendingDeleteProject(null);
                  } finally {
                    setDeletingProject(false);
                  }
                }}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#D94A4A] text-xs font-semibold text-white hover:bg-[#E45B5B] disabled:opacity-50 cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>
                  {deletingProject
                    ? "Deleting..."
                    : "Delete Project Permanently"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function KpiBox({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-[#111419] border border-[#252A31] flex items-center gap-3.5">
      <div
        className={cn(
          "w-10 h-10 rounded-xl border flex items-center justify-center shrink-0",
          accent
        )}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs text-[#A1A6AE]">{label}</div>
        <div className="font-heading font-bold text-2xl text-[#F2F2F0] mt-0.5">
          {value}
        </div>
      </div>
    </div>
  );
}

