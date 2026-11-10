"use client";

import React, { useState } from "react";
import {
  AtSign,
  Bell,
  Check,
  CheckCircle2,
  Clock,
  Inbox,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  KANBAN_COLUMNS,
  PRIORITY_META,
  formatShortDate,
  getInitials,
  type PmsTemplateSummary,
  type StudioUserSummary,
  type TaskPriority,
  type TaskWorkflowStatus,
} from "./pms-types";

/* -------------------------------------------------------------------------- */
/*  1. My Tasks Personal Workspace                                            */
/* -------------------------------------------------------------------------- */

export interface MyTaskRow {
  id: string;
  pmsProjectId: string | null;
  projectTitle: string | null;
  projectRef: string | null;
  taskCode: string;
  title: string;
  workflowStatus: TaskWorkflowStatus;
  priority: TaskPriority;
  dueDate: string | null;
  dueDateLabel: string;
  completed: boolean;
}

export function PmsMyTasksView({
  tasks,
  counts,
  tab,
  onTabChange,
  loading,
  canEdit,
  onOpenTask,
  onToggleStatus,
}: {
  tasks: MyTaskRow[];
  counts: {
    all: number;
    today: number;
    upcoming: number;
    overdue: number;
    completed: number;
  };
  tab: "all" | "today" | "upcoming" | "overdue" | "completed";
  onTabChange: (
    next: "all" | "today" | "upcoming" | "overdue" | "completed"
  ) => void;
  loading: boolean;
  canEdit: boolean;
  onOpenTask: (taskId: string) => void;
  onToggleStatus: (task: MyTaskRow) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F2F2F0]">
          My Tasks
        </h1>
        <p className="text-sm text-[#A1A6AE] mt-1">
          Personal execution queue aggregated across all assigned studio
          projects.
        </p>
      </div>

      <div className="rounded-xl bg-[#111419] border border-[#252A31] overflow-hidden">
        <div className="px-4 border-b border-[#252A31] flex items-center gap-1 overflow-x-auto bg-[#0B0D0F]">
          {(
            [
              { id: "all", label: "All Active", count: counts.all },
              { id: "today", label: "Due Today", count: counts.today },
              { id: "upcoming", label: "Upcoming", count: counts.upcoming },
              { id: "overdue", label: "Overdue", count: counts.overdue },
              { id: "completed", label: "Completed", count: counts.completed },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={cn(
                "px-3.5 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer",
                tab === t.id
                  ? "border-[#D4AF77] text-[#F2F2F0]"
                  : "border-transparent text-[#6D7480] hover:text-[#A1A6AE]"
              )}
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs font-mono text-[#A1A6AE]">
            Loading your assigned tasks...
          </div>
        ) : tasks.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6D7480]">
            No tasks in this queue.
          </div>
        ) : (
          <div className="divide-y divide-[#252A31]">
            {tasks.map((task) => {
              const col =
                KANBAN_COLUMNS.find((c) => c.id === task.workflowStatus) ??
                KANBAN_COLUMNS[1];
              const pMeta =
                PRIORITY_META[task.priority] ?? PRIORITY_META.medium;
              return (
                <div
                  key={task.id}
                  className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-[#171B21]/65"
                >
                  <div className="flex items-start gap-3 min-w-0 flex-1">
                    <button
                      type="button"
                      disabled={!canEdit}
                      onClick={() => onToggleStatus(task)}
                      aria-label={`Toggle ${task.title}`}
                      className={cn(
                        "mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer",
                        task.completed
                          ? "bg-[#56C88A] border-[#56C88A] text-[#08090B]"
                          : "border-[#323946] hover:border-[#D4AF77]"
                      )}
                    >
                      {task.completed && <Check className="w-3 h-3" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => onOpenTask(task.id)}
                      className="text-left min-w-0 flex-1 cursor-pointer group"
                    >
                      <div
                        className={cn(
                          "text-sm font-medium truncate group-hover:text-[#D4AF77]",
                          task.completed
                            ? "line-through text-[#6D7480]"
                            : "text-[#F2F2F0]"
                        )}
                      >
                        {task.title}
                      </div>
                      <div className="text-xs text-[#6D7480] flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[#D4AF77]">
                          {task.taskCode}
                        </span>
                        <span>·</span>
                        <span>{task.projectTitle || "General Studio"}</span>
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[11px] font-medium border",
                        pMeta.badgeClass
                      )}
                    >
                      {pMeta.label}
                    </span>
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-[11px] font-medium border",
                        col.badgeClass
                      )}
                    >
                      {col.label}
                    </span>
                    <span className="text-xs font-mono text-[#A1A6AE] w-16 text-right">
                      {task.dueDate
                        ? formatShortDate(task.dueDate)
                        : task.dueDateLabel}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. Inbox & Notifications Center                                           */
/* -------------------------------------------------------------------------- */

export interface InboxNotificationRow {
  id: string;
  category: "task" | "mention" | "review" | "file" | "project";
  title: string;
  body: string;
  isRead: boolean;
  projectId: string | null;
  projectTitle: string | null;
  taskId: string | null;
  taskTitle: string | null;
  actorName: string | null;
  createdAt: string;
}

export function PmsInboxView({
  notifications,
  unreadCounts,
  tab,
  onTabChange,
  loading,
  onMarkRead,
  onMarkAllRead,
  onNavigateTarget,
}: {
  notifications: InboxNotificationRow[];
  unreadCounts: { all: number; tasks: number; mentions: number };
  tab: "all" | "tasks" | "mentions";
  onTabChange: (next: "all" | "tasks" | "mentions") => void;
  loading: boolean;
  onMarkRead: (id: string, isRead: boolean) => void;
  onMarkAllRead: () => void;
  onNavigateTarget: (projectId: string | null, taskId: string | null) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F2F2F0]">
            Inbox &amp; Notifications
          </h1>
          <p className="text-sm text-[#A1A6AE] mt-1">
            Task updates, review requests, file uploads, and direct @mentions.
          </p>
        </div>

        <button
          type="button"
          onClick={onMarkAllRead}
          className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#171B21] border border-[#252A31] text-xs font-medium text-[#D4AF77] hover:border-[#D4AF77]/45 cursor-pointer"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Mark All Read</span>
        </button>
      </div>

      <div className="rounded-xl bg-[#111419] border border-[#252A31] overflow-hidden">
        <div className="px-4 border-b border-[#252A31] flex items-center gap-1 bg-[#0B0D0F]">
          {(
            [
              { id: "all", label: "All", count: unreadCounts.all },
              { id: "tasks", label: "Tasks & Reviews", count: unreadCounts.tasks },
              { id: "mentions", label: "Mentions", count: unreadCounts.mentions },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => onTabChange(t.id)}
              className={cn(
                "px-3.5 py-3 text-xs font-medium border-b-2 transition-colors cursor-pointer flex items-center gap-2",
                tab === t.id
                  ? "border-[#D4AF77] text-[#F2F2F0]"
                  : "border-transparent text-[#6D7480] hover:text-[#A1A6AE]"
              )}
            >
              <span>{t.label}</span>
              {t.count > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-[#241E14] text-[#D4AF77] text-[10px] font-mono">
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-10 text-center text-xs font-mono text-[#A1A6AE]">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Inbox className="w-8 h-8 text-[#6D7480] mx-auto" />
            <div className="text-sm font-medium text-[#F2F2F0]">
              Inbox clear
            </div>
            <p className="text-xs text-[#6D7480]">
              Mentions, task assignments, and review updates will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#252A31]">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "px-5 py-4 flex items-start justify-between gap-4 transition-colors",
                  !n.isRead ? "bg-[#15181E]" : "hover:bg-[#171B21]/50"
                )}
              >
                <button
                  type="button"
                  onClick={() => {
                    if (!n.isRead) onMarkRead(n.id, true);
                    onNavigateTarget(n.projectId, n.taskId);
                  }}
                  className="flex items-start gap-3 text-left flex-1 min-w-0 cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-lg bg-[#241E14] border border-[#D4AF77]/30 flex items-center justify-center shrink-0 mt-0.5">
                    {n.category === "mention" ? (
                      <AtSign className="w-4 h-4 text-[#D4AF77]" />
                    ) : (
                      <Bell className="w-4 h-4 text-[#D4AF77]" />
                    )}
                  </span>
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#D4AF77] shrink-0" />
                      )}
                      <span className="text-sm font-medium text-[#F2F2F0]">
                        {n.title}
                      </span>
                    </div>
                    {n.body && (
                      <p className="text-xs text-[#A1A6AE] line-clamp-2">
                        {n.body}
                      </p>
                    )}
                    <div className="text-[11px] font-mono text-[#6D7480]">
                      {n.projectTitle || "Studio"} ·{" "}
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => onMarkRead(n.id, !n.isRead)}
                  className="text-[11px] font-mono text-[#D4AF77] hover:underline shrink-0 cursor-pointer"
                >
                  {n.isRead ? "Mark Unread" : "Mark Read"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. Team Workload & Capacity View                                          */
/* -------------------------------------------------------------------------- */

export interface WorkloadMemberRow {
  id: string;
  displayName: string;
  emailNormalized: string;
  assignedTasks: number;
  activeTasks: number;
  completedTasks: number;
  overdueTasks: number;
  estimatedHours: number;
  loggedHours: number;
  capacityHours: number;
  utilizationPercent: number;
}

export function PmsWorkloadView({
  members,
  loading,
}: {
  members: WorkloadMemberRow[];
  loading: boolean;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F2F2F0]">
          Team Workload &amp; Capacity
        </h1>
        <p className="text-sm text-[#A1A6AE] mt-1">
          Visibility into assigned tasks, estimated vs logged hours, overdue
          work, and weekly team capacity.
        </p>
      </div>

      <div className="rounded-xl bg-[#111419] border border-[#252A31] overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-xs font-mono text-[#A1A6AE]">
            Computing team workload...
          </div>
        ) : (
          <div className="divide-y divide-[#252A31]">
            {members.map((m) => (
              <div
                key={m.id}
                className="p-4 sm:px-5 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span className="w-9 h-9 rounded-full bg-[#241E14] border border-[#D4AF77]/35 text-[#D4AF77] text-xs font-semibold flex items-center justify-center">
                    {getInitials(m.displayName)}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-[#F2F2F0]">
                      {m.displayName}
                    </div>
                    <div className="text-xs text-[#6D7480]">
                      {m.activeTasks} active · {m.completedTasks} done
                      {m.overdueTasks > 0 && (
                        <span className="text-[#E47777] ml-2">
                          · {m.overdueTasks} overdue
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6 flex-1 max-w-md">
                  <div className="flex-1">
                    <div className="flex justify-between text-[11px] font-mono mb-1">
                      <span className="text-[#A1A6AE]">
                        Est: {m.estimatedHours}h / {m.capacityHours}h cap
                      </span>
                      <span
                        className={cn(
                          m.utilizationPercent >= 85
                            ? "text-[#E47777]"
                            : "text-[#D4AF77]"
                        )}
                      >
                        {m.utilizationPercent}%
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-[#08090B] border border-[#252A31] overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          m.utilizationPercent >= 85
                            ? "bg-[#E47777]"
                            : "bg-[#D4AF77]"
                        )}
                        style={{ width: `${m.utilizationPercent}%` }}
                      />
                    </div>
                  </div>
                  <div className="text-right text-xs font-mono text-[#A1A6AE] shrink-0">
                    <Clock className="w-3 h-3 inline mr-1 text-[#D4AF77]" />
                    {m.loggedHours}h logged
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. PMS Modals (New Project with Templates, New Task, Update Progress)     */
/* -------------------------------------------------------------------------- */

export function NewProjectModal({
  templates,
  clients,
  studioUsers,
  initialTemplateKey,
  onClose,
  onCreated,
}: {
  templates: PmsTemplateSummary[];
  clients: Array<{
    id: string;
    name: string;
    companyName: string | null;
    serviceInterest: string;
  }>;
  studioUsers: StudioUserSummary[];
  initialTemplateKey?: string;
  onClose: () => void;
  onCreated: (projectId: string) => void;
}) {
  const [templateKey, setTemplateKey] = useState(
    initialTemplateKey || "blank"
  );
  const [title, setTitle] = useState("");
  const [clientId, setClientId] = useState("");
  const [serviceInterest, setServiceInterest] = useState(() => {
    const found = templates.find((t) => t.key === initialTemplateKey);
    return found?.serviceInterest || "Studio Delivery";
  });
  const [dueDate, setDueDate] = useState("");
  const [summary, setSummary] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/pms/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          clientId: clientId || null,
          serviceInterest,
          templateKey,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          dueDateLabel: dueDate ? formatShortDate(dueDate) : "This month",
          summary,
          status: "planning",
          memberUserIds: memberIds,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to create project.");
        return;
      }
      onCreated(json.data.id);
      onClose();
    } catch {
      setError("Network error creating project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-2xl bg-[#111419] border border-[#252A31] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#252A31] flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#F2F2F0]">
              Create Studio Project
            </h3>
            <p className="text-xs text-[#A1A6AE]">
              Start blank or seed predefined milestones and tasks from an EDYREX
              template.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6D7480] hover:text-[#F2F2F0] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-[#2A1517] border border-[#E47777]/40 text-xs text-[#E47777]">
              {error}
            </div>
          )}

          <div>
            <label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-[#6D7480] mb-1.5">
              Project Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {templates.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => {
                    setTemplateKey(t.key);
                    setServiceInterest(t.serviceInterest);
                  }}
                  className={cn(
                    "p-2.5 rounded-lg border text-left transition-colors cursor-pointer",
                    templateKey === t.key
                      ? "bg-[#241E14] border-[#D4AF77] text-[#F2F2F0]"
                      : "bg-[#0B0D0F] border-[#252A31] text-[#A1A6AE] hover:text-[#F2F2F0]"
                  )}
                >
                  <div className="text-xs font-medium">{t.name}</div>
                  <div className="text-[10px] font-mono text-[#6D7480] mt-0.5">
                    {t.milestonesCount}ms · {t.tasksCount} tasks
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Lumina Brand Identity"
                className="w-full h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                CRM Client (Optional)
              </label>
              <select
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              >
                <option value="">Internal Studio Project</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName ? `${c.companyName} (${c.name})` : c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Service Division
              </label>
              <input
                type="text"
                required
                value={serviceInterest}
                onChange={(e) => setServiceInterest(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
              Team Members
            </label>
            <div className="flex flex-wrap gap-1.5">
              {studioUsers.map((u) => {
                const selected = memberIds.includes(u.id);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() =>
                      setMemberIds((prev) =>
                        prev.includes(u.id)
                          ? prev.filter((id) => id !== u.id)
                          : [...prev, u.id]
                      )
                    }
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs border cursor-pointer",
                      selected
                        ? "bg-[#241E14] border-[#D4AF77]/50 text-[#D4AF77]"
                        : "bg-[#08090B] border-[#252A31] text-[#A1A6AE]"
                    )}
                  >
                    {u.displayName}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
              Project Summary
            </label>
            <textarea
              rows={2}
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="Objectives, deliverables, and key scope notes..."
              className="w-full p-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
            />
          </div>

          <div className="pt-3 border-t border-[#252A31] flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg bg-[#171B21] border border-[#252A31] text-xs text-[#A1A6AE] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold cursor-pointer"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Create Project</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function NewTaskModal({
  projectId,
  initialStatus,
  studioUsers,
  onClose,
  onCreated,
}: {
  projectId: string;
  initialStatus: TaskWorkflowStatus;
  studioUsers: StudioUserSummary[];
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [workflowStatus, setWorkflowStatus] =
    useState<TaskWorkflowStatus>(initialStatus);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("2");
  const [labelsInput, setLabelsInput] = useState("Design");
  const [assigneeIds, setAssigneeIds] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/v1/admin/pms/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pmsProjectId: projectId,
          title: title.trim(),
          description,
          workflowStatus,
          priority,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          estimatedMinutes: Math.max(
            0,
            Math.round(Number(estimatedHours || 0) * 60)
          ),
          labels: labelsInput
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          assigneeUserIds: assigneeIds.length > 0 ? assigneeIds : undefined,
        }),
      });
      if (res.ok) {
        onCreated();
        onClose();
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-[#111419] border border-[#252A31] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#252A31] flex items-center justify-between">
          <h3 className="font-heading font-bold text-base text-[#F2F2F0]">
            Add Project Task
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6D7480] hover:text-[#F2F2F0] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-3.5">
          <div>
            <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Logo refinement & lockups"
              className="w-full h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Column
              </label>
              <select
                value={workflowStatus}
                onChange={(e) =>
                  setWorkflowStatus(e.target.value as TaskWorkflowStatus)
                }
                className="w-full h-9 px-2.5 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              >
                {KANBAN_COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full h-9 px-2.5 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Est. Hours
              </label>
              <input
                type="number"
                min={0}
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="w-full h-9 px-2.5 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
              Labels
            </label>
            <input
              type="text"
              value={labelsInput}
              onChange={(e) => setLabelsInput(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
              Assignees
            </label>
            <div className="flex flex-wrap gap-1.5">
              {studioUsers.map((u) => {
                const selected = assigneeIds.includes(u.id);
                return (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() =>
                      setAssigneeIds((prev) =>
                        prev.includes(u.id)
                          ? prev.filter((id) => id !== u.id)
                          : [...prev, u.id]
                      )
                    }
                    className={cn(
                      "px-2.5 py-1 rounded-full text-xs border cursor-pointer",
                      selected
                        ? "bg-[#241E14] border-[#D4AF77]/50 text-[#D4AF77]"
                        : "bg-[#08090B] border-[#252A31] text-[#A1A6AE]"
                    )}
                  >
                    {u.displayName}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 px-4 rounded-lg bg-[#171B21] border border-[#252A31] text-xs text-[#A1A6AE] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-9 px-4 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold cursor-pointer"
            >
              {saving ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
