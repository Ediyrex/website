"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Check,
  Clock,
  GitBranch,
  Link2,
  Loader2,
  Paperclip,
  Pause,
  Play,
  Plus,
  Send,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  KANBAN_COLUMNS,
  PRIORITY_META,
  formatMinutes,
  getInitials,
  type StudioUserSummary,
  type TaskPriority,
  type TaskWorkflowStatus,
} from "./pms-types";

interface TaskDetailPayload {
  task: {
    id: string;
    pmsProjectId: string | null;
    projectTitle: string | null;
    taskCode: string;
    title: string;
    description: string;
    workflowStatus: TaskWorkflowStatus;
    priority: TaskPriority;
    labels: string[];
    dueDate: string | null;
    dueDateLabel: string;
    estimatedMinutes: number;
    loggedMinutes: number;
    reviewStatus: "none" | "pending_review" | "changes_requested" | "approved";
    reviewFeedback: string | null;
    dependencyTaskIds: string[];
    recurrenceRule?: "none" | "daily" | "weekly" | "biweekly" | "monthly";
  };
  assignees: Array<{
    userId: string;
    displayName: string;
    emailNormalized: string;
  }>;
  subtasks: Array<{
    id: string;
    title: string;
    completed: boolean;
  }>;
  comments: Array<{
    id: string;
    authorName: string | null;
    body: string;
    isReviewNote: boolean;
    createdAt: string;
  }>;
  workLogs: Array<{
    id: string;
    userName: string | null;
    minutes: number;
    note: string;
    loggedAt: string;
  }>;
  attachments: Array<{
    id: string;
    title: string;
    version: number;
    secureUrl: string;
  }>;
  activityLogs: Array<{
    id: string;
    summary: string;
    actorName: string | null;
    createdAt: string;
  }>;
  siblingTasks: Array<{
    id: string;
    taskCode: string | null;
    title: string;
    workflowStatus: string;
  }>;
}

interface PmsTaskDrawerProps {
  taskId: string | null;
  canEditTasks: boolean;
  canApproveReviews: boolean;
  studioUsers: StudioUserSummary[];
  onClose: () => void;
  onChanged: () => void;
}

export function PmsTaskDrawer({
  taskId,
  canEditTasks,
  canApproveReviews,
  studioUsers,
  onClose,
  onChanged,
}: PmsTaskDrawerProps) {
  const [tab, setTab] = useState<"details" | "subtasks" | "comments" | "activity">(
    "details"
  );
  const [detail, setDetail] = useState<TaskDetailPayload | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [estHoursInput, setEstHoursInput] = useState("0");
  const [labelsInput, setLabelsInput] = useState("");
  const [dueDateInput, setDueDateInput] = useState("");

  const [subtaskTitle, setSubtaskTitle] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const [reviewFeedback, setReviewFeedback] = useState("");
  const [manualMinutes, setManualMinutes] = useState("30");
  const [manualNote, setManualNote] = useState("");

  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [busyAction, setBusyAction] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadTask = useCallback(async (id: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/pms/tasks/${id}`);
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to load task details.");
        return;
      }
      const d = json.data as TaskDetailPayload;
      setDetail(d);
      setTitleInput(d.task.title);
      setDescInput(d.task.description);
      setEstHoursInput(String(Math.round((d.task.estimatedMinutes || 0) / 60)));
      setLabelsInput((d.task.labels || []).join(", "));
      setDueDateInput(
        d.task.dueDate
          ? new Date(d.task.dueDate).toISOString().slice(0, 10)
          : ""
      );
    } catch {
      setError("Network error loading task details.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!taskId) return;
    const t = setTimeout(() => {
      loadTask(taskId);
    }, 0);
    return () => clearTimeout(t);
  }, [loadTask, taskId]);

  useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  if (!taskId) return null;

  const patchTask = async (payload: Record<string, unknown>) => {
    if (!detail) return;
    setBusyAction(true);
    try {
      const res = await fetch(`/api/v1/admin/pms/tasks/${detail.task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        await loadTask(detail.task.id);
        onChanged();
      }
    } finally {
      setBusyAction(false);
    }
  };

  const handleSaveDetails = async () => {
    const labels = labelsInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const estMins = Math.max(0, Math.round(Number(estHoursInput || 0) * 60));
    await patchTask({
      title: titleInput.trim() || detail?.task.title,
      description: descInput,
      estimatedMinutes: estMins,
      labels,
      dueDate: dueDateInput ? new Date(dueDateInput).toISOString() : null,
    });
  };

  const handleToggleAssignee = async (userId: string) => {
    if (!detail || !canEditTasks) return;
    const current = detail.assignees.map((a) => a.userId);
    const next = current.includes(userId)
      ? current.filter((id) => id !== userId)
      : [...current, userId];
    await patchTask({ assigneeUserIds: next });
  };

  const handleToggleDependency = async (depId: string) => {
    if (!detail || !canEditTasks) return;
    const current = detail.task.dependencyTaskIds || [];
    const next = current.includes(depId)
      ? current.filter((id) => id !== depId)
      : [...current, depId];
    await patchTask({ dependencyTaskIds: next });
  };

  const handleSubtask = async (
    action: "add" | "toggle" | "delete",
    subtaskId?: string,
    completed?: boolean
  ) => {
    if (!detail) return;
    if (action === "add" && !subtaskTitle.trim()) return;
    const res = await fetch(
      `/api/v1/admin/pms/tasks/${detail.task.id}/subtasks`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          subtaskId,
          title: action === "add" ? subtaskTitle.trim() : undefined,
          completed,
        }),
      }
    );
    if (res.ok) {
      if (action === "add") setSubtaskTitle("");
      await loadTask(detail.task.id);
      onChanged();
    }
  };

  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!detail || !commentBody.trim()) return;
    setBusyAction(true);
    try {
      const res = await fetch(
        `/api/v1/admin/pms/tasks/${detail.task.id}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ body: commentBody.trim() }),
        }
      );
      if (res.ok) {
        setCommentBody("");
        await loadTask(detail.task.id);
        onChanged();
      }
    } finally {
      setBusyAction(false);
    }
  };

  const handleReview = async (
    decision: "submit" | "approve" | "request_revisions"
  ) => {
    if (!detail) return;
    setBusyAction(true);
    try {
      const res = await fetch(
        `/api/v1/admin/pms/tasks/${detail.task.id}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            decision,
            feedback: reviewFeedback.trim() || undefined,
          }),
        }
      );
      if (res.ok) {
        setReviewFeedback("");
        await loadTask(detail.task.id);
        onChanged();
      } else {
        const j = await res.json();
        setError(j.message || "Unable to complete review action.");
      }
    } finally {
      setBusyAction(false);
    }
  };

  const handleLogTime = async (mins: number, note: string) => {
    if (!detail || mins <= 0) return;
    const res = await fetch(
      `/api/v1/admin/pms/tasks/${detail.task.id}/work-logs`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes: mins, note }),
      }
    );
    if (res.ok) {
      await loadTask(detail.task.id);
      onChanged();
    }
  };

  const handleStopTimer = async () => {
    setTimerRunning(false);
    const loggedMins = Math.max(1, Math.round(timerSeconds / 60));
    setTimerSeconds(0);
    await handleLogTime(loggedMins, "Timer session");
  };

  const handleDeleteTask = async () => {
    if (!detail) return;
    const res = await fetch(`/api/v1/admin/pms/tasks/${detail.task.id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      onChanged();
      onClose();
    }
  };

  const subtasksDone = detail?.subtasks.filter((s) => s.completed).length ?? 0;
  const subtasksTotal = detail?.subtasks.length ?? 0;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full bg-[#111419] border-l border-[#252A31] shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#252A31] flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#D4AF77]">
              <span>#{detail?.task.taskCode || "TASK"}</span>
              {detail?.task.projectTitle && (
                <span className="text-[#6D7480] truncate">
                  · {detail.task.projectTitle}
                </span>
              )}
            </div>
            {canEditTasks ? (
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                onBlur={handleSaveDetails}
                className="mt-1 w-full bg-transparent font-heading font-bold text-lg text-[#F2F2F0] focus:outline-none focus:border-b focus:border-[#D4AF77]"
              />
            ) : (
              <h2 className="mt-1 font-heading font-bold text-lg text-[#F2F2F0]">
                {detail?.task.title}
              </h2>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {detail && (
              <button
                type="button"
                onClick={async () => {
                  const url = `${window.location.origin}/admin/tasks?${
                    detail.task.pmsProjectId
                      ? `project=${detail.task.pmsProjectId}&tab=tasks&`
                      : ""
                  }task=${detail.task.id}`;
                  await navigator.clipboard.writeText(url);
                  setCopiedLink(true);
                  setTimeout(() => setCopiedLink(false), 2000);
                }}
                title="Copy task link"
                className="p-1.5 rounded-lg text-[#A1A6AE] hover:text-[#D4AF77] hover:bg-[#171B21] cursor-pointer"
              >
                {copiedLink ? (
                  <Check className="w-4 h-4 text-[#56C88A]" />
                ) : (
                  <Link2 className="w-4 h-4" />
                )}
              </button>
            )}
            {canEditTasks && detail && (
              <button
                type="button"
                onClick={handleDeleteTask}
                title="Delete task"
                className="p-1.5 rounded-lg text-[#A1A6AE] hover:text-[#E47777] hover:bg-[#171B21] cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A1A6AE] hover:text-[#F2F2F0] cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Tabs */}
        <div className="px-5 border-b border-[#252A31] flex items-center gap-1 bg-[#0B0D0F]">
          {(
            [
              { id: "details", label: "Details" },
              {
                id: "subtasks",
                label: `Subtasks (${subtasksDone}/${subtasksTotal})`,
              },
              {
                id: "comments",
                label: `Comments (${detail?.comments.length ?? 0})`,
              },
              { id: "activity", label: "Activity" },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={cn(
                "px-3 py-2.5 text-xs font-medium border-b-2 transition-colors cursor-pointer",
                tab === t.id
                  ? "border-[#D4AF77] text-[#F2F2F0]"
                  : "border-transparent text-[#6D7480] hover:text-[#A1A6AE]"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-[#2A1517] border border-[#E47777]/40 text-xs text-[#E47777]">
              {error}
            </div>
          )}

          {loading || !detail ? (
            <div className="py-16 text-center text-xs font-mono text-[#A1A6AE] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#D4AF77]" />
              <span>Loading task...</span>
            </div>
          ) : tab === "details" ? (
            <div className="space-y-5">
              {/* Description */}
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-[0.14em] text-[#6D7480] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  disabled={!canEditTasks}
                  value={descInput}
                  onChange={(e) => setDescInput(e.target.value)}
                  onBlur={handleSaveDetails}
                  placeholder="Describe task scope, acceptance criteria, or deliverables..."
                  className="w-full p-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0] placeholder:text-[#6D7480] focus:outline-none focus:border-[#D4AF77]"
                />
              </div>

              {/* Metadata Grid */}
              <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#252A31] grid grid-cols-2 gap-3.5 text-xs">
                <div>
                  <span className="text-[10px] font-mono uppercase text-[#6D7480] block mb-1">
                    Status
                  </span>
                  <select
                    disabled={!canEditTasks}
                    value={detail.task.workflowStatus}
                    onChange={(e) =>
                      patchTask({ workflowStatus: e.target.value })
                    }
                    className="w-full h-8 px-2.5 rounded-lg bg-[#111419] border border-[#252A31] text-xs text-[#F2F2F0]"
                  >
                    {KANBAN_COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#6D7480] block mb-1">
                    Priority
                  </span>
                  <select
                    disabled={!canEditTasks}
                    value={detail.task.priority}
                    onChange={(e) => patchTask({ priority: e.target.value })}
                    className={cn(
                      "w-full h-8 px-2.5 rounded-lg border text-xs bg-[#111419]",
                      PRIORITY_META[detail.task.priority].badgeClass
                    )}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#6D7480] block mb-1">
                    Due Date
                  </span>
                  <input
                    type="date"
                    disabled={!canEditTasks}
                    value={dueDateInput}
                    onChange={(e) => {
                      setDueDateInput(e.target.value);
                      patchTask({
                        dueDate: e.target.value
                          ? new Date(e.target.value).toISOString()
                          : null,
                      });
                    }}
                    className="w-full h-8 px-2.5 rounded-lg bg-[#111419] border border-[#252A31] text-xs text-[#F2F2F0]"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#6D7480] block mb-1">
                    Estimated Hours
                  </span>
                  <input
                    type="number"
                    min={0}
                    disabled={!canEditTasks}
                    value={estHoursInput}
                    onChange={(e) => setEstHoursInput(e.target.value)}
                    onBlur={handleSaveDetails}
                    className="w-full h-8 px-2.5 rounded-lg bg-[#111419] border border-[#252A31] text-xs text-[#F2F2F0]"
                  />
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#6D7480] block mb-1">
                    Recurrence Rule
                  </span>
                  <select
                    disabled={!canEditTasks}
                    value={detail.task.recurrenceRule || "none"}
                    onChange={(e) =>
                      patchTask({ recurrenceRule: e.target.value })
                    }
                    className="w-full h-8 px-2.5 rounded-lg bg-[#111419] border border-[#252A31] text-xs text-[#F2F2F0]"
                  >
                    <option value="none">One-time (None)</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="biweekly">Biweekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] font-mono uppercase text-[#6D7480] block mb-1">
                    Labels (comma separated)
                  </span>
                  <input
                    type="text"
                    disabled={!canEditTasks}
                    value={labelsInput}
                    onChange={(e) => setLabelsInput(e.target.value)}
                    onBlur={handleSaveDetails}
                    placeholder="Design, Branding, UI"
                    className="w-full h-8 px-2.5 rounded-lg bg-[#111419] border border-[#252A31] text-xs text-[#F2F2F0]"
                  />
                </div>
              </div>

              {/* Assignees */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6D7480]">
                  Assignees
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {studioUsers.map((u) => {
                    const assigned = detail.assignees.some(
                      (a) => a.userId === u.id
                    );
                    return (
                      <button
                        key={u.id}
                        type="button"
                        disabled={!canEditTasks}
                        onClick={() => handleToggleAssignee(u.id)}
                        className={cn(
                          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs border transition-colors cursor-pointer disabled:cursor-default",
                          assigned
                            ? "bg-[#241E14] border-[#D4AF77]/50 text-[#D4AF77]"
                            : "bg-[#0B0D0F] border-[#252A31] text-[#A1A6AE] hover:text-[#F2F2F0]"
                        )}
                      >
                        <span className="w-4 h-4 rounded-full bg-[#171B21] text-[9px] flex items-center justify-center">
                          {getInitials(u.displayName)}
                        </span>
                        <span>{u.displayName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dependencies */}
              {detail.siblingTasks.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.14em] text-[#6D7480]">
                    <span className="flex items-center gap-1.5">
                      <GitBranch className="w-3 h-3 text-[#D4AF77]" />
                      <span>Blocking Dependencies</span>
                    </span>
                    {detail.siblingTasks.some(
                      (s) =>
                        detail.task.dependencyTaskIds.includes(s.id) &&
                        s.workflowStatus !== "done"
                    ) && (
                      <span className="text-[#E47777]">
                        Blocked by unfinished task
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {detail.siblingTasks.slice(0, 8).map((s) => {
                      const active = detail.task.dependencyTaskIds.includes(s.id);
                      return (
                        <button
                          key={s.id}
                          type="button"
                          disabled={!canEditTasks}
                          onClick={() => handleToggleDependency(s.id)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg text-[11px] border text-left cursor-pointer",
                            active
                              ? "bg-[#152131] border-[#7BA8DF]/45 text-[#7BA8DF]"
                              : "bg-[#0B0D0F] border-[#252A31] text-[#A1A6AE]"
                          )}
                        >
                          {s.taskCode || "TASK"}: {s.title}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Inline Subtasks Checklist (Details tab preview & toggle) */}
              <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#252A31] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-[#F2F2F0]">
                    Subtasks
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-[#D4AF77]">
                      {subtasksDone}/{subtasksTotal}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTab("subtasks")}
                      className="text-[11px] text-[#A1A6AE] hover:text-[#D4AF77] cursor-pointer"
                    >
                      Manage →
                    </button>
                  </div>
                </div>

                {subtasksTotal > 0 && (
                  <div className="h-1.5 rounded-full bg-[#171B21] overflow-hidden">
                    <div
                      className="h-full bg-[#D4AF77] transition-all"
                      style={{
                        width: `${Math.round((subtasksDone / subtasksTotal) * 100)}%`,
                      }}
                    />
                  </div>
                )}

                {detail.subtasks.length === 0 ? (
                  <p className="text-[11px] text-[#6D7480]">
                    No subtasks added yet.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {detail.subtasks.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        disabled={!canEditTasks}
                        onClick={() => handleSubtask("toggle", st.id)}
                        className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-[#111419] border border-[#252A31] hover:border-[#D4AF77]/35 text-left cursor-pointer disabled:opacity-60"
                      >
                        <span
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                            st.completed
                              ? "bg-[#56C88A] border-[#56C88A] text-[#08090B]"
                              : "border-[#383F4B]"
                          )}
                        >
                          {st.completed && <Check className="w-3 h-3 stroke-[2.5]" />}
                        </span>
                        <span
                          className={cn(
                            "text-xs truncate",
                            st.completed
                              ? "line-through text-[#6D7480]"
                              : "text-[#F2F2F0]"
                          )}
                        >
                          {st.title}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Review & Approval Workflow */}
              <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#252A31] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#F2F2F0]">
                    <ShieldCheck className="w-4 h-4 text-[#D4AF77]" />
                    <span>Review &amp; Approval</span>
                  </div>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border",
                      detail.task.reviewStatus === "approved"
                        ? "bg-[#13291E] text-[#56C88A] border-[#56C88A]/35"
                        : detail.task.reviewStatus === "pending_review"
                        ? "bg-[#241B35] text-[#C58AF9] border-[#C58AF9]/35"
                        : detail.task.reviewStatus === "changes_requested"
                        ? "bg-[#2A1517] text-[#E47777] border-[#E47777]/35"
                        : "bg-[#171B21] text-[#A1A6AE] border-[#252A31]"
                    )}
                  >
                    {detail.task.reviewStatus.replace("_", " ")}
                  </span>
                </div>

                {detail.task.reviewFeedback && (
                  <div className="p-2.5 rounded-lg bg-[#111419] border border-[#252A31] text-xs text-[#A1A6AE]">
                    {detail.task.reviewFeedback}
                  </div>
                )}

                {canEditTasks && (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={reviewFeedback}
                      onChange={(e) => setReviewFeedback(e.target.value)}
                      placeholder="Optional submission note or revision feedback..."
                      className="w-full h-8 px-2.5 rounded-lg bg-[#111419] border border-[#252A31] text-xs text-[#F2F2F0]"
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={busyAction}
                        onClick={() => handleReview("submit")}
                        className="px-3 py-1.5 rounded-lg bg-[#171B21] border border-[#D4AF77]/45 text-xs font-medium text-[#D4AF77] hover:bg-[#1E232B] cursor-pointer"
                      >
                        Submit for Review
                      </button>
                      {canApproveReviews && (
                        <>
                          <button
                            type="button"
                            disabled={busyAction}
                            onClick={() => handleReview("approve")}
                            className="px-3 py-1.5 rounded-lg bg-[#56C88A] text-[#08090B] text-xs font-semibold hover:opacity-90 cursor-pointer"
                          >
                            Approve &amp; Complete
                          </button>
                          <button
                            type="button"
                            disabled={busyAction}
                            onClick={() => handleReview("request_revisions")}
                            className="px-3 py-1.5 rounded-lg bg-[#2A1517] border border-[#E47777]/40 text-xs font-medium text-[#E47777] cursor-pointer"
                          >
                            Request Revisions
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Time Tracking & Work Logs */}
              <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#252A31] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#F2F2F0]">
                    <Clock className="w-4 h-4 text-[#D4AF77]" />
                    <span>Time &amp; Work Logs</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#A1A6AE]">
                    Logged:{" "}
                    <span className="text-[#D4AF77]">
                      {formatMinutes(detail.task.loggedMinutes)}
                    </span>{" "}
                    / Est: {formatMinutes(detail.task.estimatedMinutes)}
                  </div>
                </div>

                {canEditTasks && (
                  <div className="flex flex-wrap items-center gap-2">
                    {!timerRunning ? (
                      <button
                        type="button"
                        onClick={() => setTimerRunning(true)}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#171B21] border border-[#252A31] text-xs text-[#56C88A] hover:border-[#56C88A]/45 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Start Timer</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleStopTimer}
                        className="inline-flex items-center gap-1.5 h-8 px-3 rounded-lg bg-[#2A1517] border border-[#E47777]/45 text-xs text-[#E47777] cursor-pointer"
                      >
                        <Pause className="w-3 h-3" />
                        <span>
                          Stop &amp; Log ({Math.floor(timerSeconds / 60)}:
                          {String(timerSeconds % 60).padStart(2, "0")})
                        </span>
                      </button>
                    )}

                    <input
                      type="number"
                      min={1}
                      value={manualMinutes}
                      onChange={(e) => setManualMinutes(e.target.value)}
                      className="w-16 h-8 px-2 rounded-lg bg-[#111419] border border-[#252A31] text-xs text-[#F2F2F0]"
                      title="Minutes"
                    />
                    <input
                      type="text"
                      value={manualNote}
                      onChange={(e) => setManualNote(e.target.value)}
                      placeholder="Work note..."
                      className="flex-1 min-w-[100px] h-8 px-2.5 rounded-lg bg-[#111419] border border-[#252A31] text-xs text-[#F2F2F0]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleLogTime(
                          Number(manualMinutes || 30),
                          manualNote.trim()
                        );
                        setManualNote("");
                      }}
                      className="h-8 px-3 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold cursor-pointer"
                    >
                      Log
                    </button>
                  </div>
                )}

                {detail.workLogs.length > 0 && (
                  <div className="space-y-1.5 max-h-28 overflow-y-auto pt-1">
                    {detail.workLogs.map((w) => (
                      <div
                        key={w.id}
                        className="flex items-center justify-between text-[11px] text-[#A1A6AE]"
                      >
                        <span>
                          {w.userName || "Member"} · {w.note || "Work logged"}
                        </span>
                        <span className="font-mono text-[#D4AF77]">
                          {formatMinutes(w.minutes)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Linked Attachments */}
              {detail.attachments.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase text-[#6D7480]">
                    <Paperclip className="w-3 h-3" />
                    <span>Task Files ({detail.attachments.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {detail.attachments.map((f) => (
                      <a
                        key={f.id}
                        href={f.secureUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2.5 rounded-lg bg-[#0B0D0F] border border-[#252A31] hover:border-[#D4AF77]/45 flex items-center justify-between text-xs text-[#F2F2F0]"
                      >
                        <span className="truncate">{f.title}</span>
                        <span className="text-[10px] font-mono text-[#D4AF77]">
                          v{f.version}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : tab === "subtasks" ? (
            <div className="space-y-4">
              {subtasksTotal > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-[#A1A6AE]">
                    <span>Subtask Completion</span>
                    <span className="font-mono text-[#D4AF77]">
                      {subtasksDone}/{subtasksTotal}
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-[#08090B] border border-[#252A31] overflow-hidden">
                    <div
                      className="h-full bg-[#56C88A] transition-all"
                      style={{
                        width: `${Math.round(
                          (subtasksDone / subtasksTotal) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}

              {canEditTasks && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={subtaskTitle}
                    onChange={(e) => setSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleSubtask("add");
                      }
                    }}
                    placeholder="Add subtask checklist item..."
                    className="flex-1 h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
                  />
                  <button
                    type="button"
                    onClick={() => handleSubtask("add")}
                    className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              )}

              <div className="divide-y divide-[#252A31] rounded-xl bg-[#0B0D0F] border border-[#252A31]">
                {detail.subtasks.length === 0 ? (
                  <div className="p-6 text-center text-xs text-[#6D7480]">
                    No subtasks yet.
                  </div>
                ) : (
                  detail.subtasks.map((st) => (
                    <div
                      key={st.id}
                      className="px-3.5 py-2.5 flex items-center justify-between gap-2"
                    >
                      <button
                        type="button"
                        disabled={!canEditTasks}
                        onClick={() =>
                          handleSubtask("toggle", st.id, !st.completed)
                        }
                        className="flex items-center gap-2.5 text-left flex-1 min-w-0 cursor-pointer"
                      >
                        <span
                          className={cn(
                            "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                            st.completed
                              ? "bg-[#56C88A] border-[#56C88A] text-[#08090B]"
                              : "border-[#323946]"
                          )}
                        >
                          {st.completed && <Check className="w-3 h-3" />}
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            st.completed
                              ? "line-through text-[#6D7480]"
                              : "text-[#F2F2F0]"
                          )}
                        >
                          {st.title}
                        </span>
                      </button>
                      {canEditTasks && (
                        <button
                          type="button"
                          onClick={() => handleSubtask("delete", st.id)}
                          className="text-[#6D7480] hover:text-[#E47777] cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : tab === "comments" ? (
            <div className="space-y-4">
              <div className="space-y-2.5">
                {detail.comments.length === 0 ? (
                  <div className="p-6 rounded-xl bg-[#0B0D0F] border border-[#252A31] text-center text-xs text-[#6D7480]">
                    No task comments yet. Use @Name to mention a teammate.
                  </div>
                ) : (
                  detail.comments.map((c) => (
                    <div
                      key={c.id}
                      className={cn(
                        "p-3.5 rounded-xl border space-y-1",
                        c.isReviewNote
                          ? "bg-[#1A1624] border-[#C58AF9]/35"
                          : "bg-[#0B0D0F] border-[#252A31]"
                      )}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-medium text-[#D4AF77]">
                          {c.authorName || "Studio Member"}
                        </span>
                        <span className="text-[#6D7480]">
                          {new Date(c.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-[#F2F2F0] whitespace-pre-wrap">
                        {c.body}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {canEditTasks && (
                <form onSubmit={handlePostComment} className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {studioUsers.slice(0, 6).map((u) => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() =>
                          setCommentBody((b) =>
                            `${b} @${u.displayName.split(" ")[0]} `.trimStart()
                          )
                        }
                        className="px-2 py-0.5 rounded bg-[#171B21] border border-[#252A31] text-[10px] text-[#A1A6AE] hover:text-[#D4AF77] cursor-pointer"
                      >
                        @{u.displayName.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentBody}
                      onChange={(e) => setCommentBody(e.target.value)}
                      placeholder="Write a comment or @mention teammate..."
                      className="flex-1 h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
                    />
                    <button
                      type="submit"
                      disabled={busyAction || !commentBody.trim()}
                      className="inline-flex items-center gap-1 h-9 px-3.5 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {detail.activityLogs.length === 0 ? (
                <div className="text-xs text-[#6D7480]">
                  No activity recorded yet.
                </div>
              ) : (
                detail.activityLogs.map((a) => (
                  <div
                    key={a.id}
                    className="p-3 rounded-lg bg-[#0B0D0F] border border-[#252A31] text-xs space-y-0.5"
                  >
                    <div className="text-[#F2F2F0]">{a.summary}</div>
                    <div className="text-[11px] text-[#6D7480]">
                      {a.actorName || "Studio"} ·{" "}
                      {new Date(a.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
