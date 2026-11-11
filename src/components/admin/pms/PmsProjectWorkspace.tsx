"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  Activity,
  Archive,
  Bookmark,
  Calendar as CalendarIcon,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Flag,
  FolderOpen,
  GanttChart,
  GitBranch,
  History,
  Kanban,
  Layers,
  LayoutDashboard,
  List as ListIcon,
  MessageCircle,
  MessageSquare,
  Paperclip,
  Plus,
  Repeat,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  Star,
  StickyNote,
  Trash2,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  KANBAN_COLUMNS,
  PRIORITY_META,
  PROJECT_ROLE_LABELS,
  PROJECT_STATUS_META,
  formatMinutes,
  formatShortDate,
  getInitials,
  type PmsProjectTab,
  type PmsSavedFilterRow,
  type PmsTaskItem,
  type PmsWorkspacePayload,
  type TaskWorkflowStatus,
} from "./pms-types";

interface PmsProjectWorkspaceProps {
  workspace: PmsWorkspacePayload;
  savedFilters: PmsSavedFilterRow[];
  activeTab: PmsProjectTab;
  onTabChange: (tab: PmsProjectTab) => void;
  onBackToProjects: () => void;
  onRefresh: () => Promise<void>;
  onDeleteProject: () => Promise<void>;
  onOpenTask: (taskId: string) => void;
  onNewTask: (initialStatus: TaskWorkflowStatus) => void;
  onToggleStar: () => Promise<void>;
  onSaveFilter: (name: string, filterConfig: Record<string, string>) => Promise<void>;
  onDeleteFilter: (id: string) => Promise<void>;
}

const PROJECT_TABS: Array<{
  id: PmsProjectTab;
  label: string;
  icon: React.ElementType;
}> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "tasks", label: "Tasks", icon: CheckSquare },
  { id: "timeline", label: "Timeline", icon: GanttChart },
  { id: "milestones", label: "Milestones", icon: Flag },
  { id: "team", label: "Team", icon: Users },
  { id: "files", label: "Files", icon: FolderOpen },
  { id: "discussion", label: "Discussion", icon: MessageCircle },
  { id: "notes", label: "Notes", icon: StickyNote },
  { id: "client", label: "Client", icon: UserCheck },
  { id: "settings", label: "Settings", icon: Settings },
];

export function PmsProjectWorkspace({
  workspace,
  savedFilters,
  activeTab,
  onTabChange,
  onBackToProjects,
  onRefresh,
  onDeleteProject,
  onOpenTask,
  onNewTask,
  onToggleStar,
  onSaveFilter,
  onDeleteFilter,
}: PmsProjectWorkspaceProps) {
  const { project, permissions, tasks, milestones, members, files, discussions, activityLogs, studioUsers } =
    workspace;

  const [taskView, setTaskView] = useState<
    "kanban" | "list" | "calendar" | "timeline"
  >("kanban");
  const [taskSearch, setTaskSearch] = useState("");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [labelFilter, setLabelFilter] = useState("all");
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskWorkflowStatus | null>(
    null
  );

  const [showProgressEditor, setShowProgressEditor] = useState(false);
  const [manualProgress, setManualProgress] = useState(
    String(project.progressPercent ?? project.progress)
  );

  const [calendarCursor, setCalendarCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  // Sub-tab local forms
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDue, setNewMilestoneDue] = useState("");
  const [newMemberId, setNewMemberId] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("team_member");
  const [discussionInput, setDiscussionInput] = useState("");
  const [replyParentId, setReplyParentId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState(project.internalNotes || "");
  const [notesSavedMsg, setNotesSavedMsg] = useState("");
  const [uploadingFile, setUploadingFile] = useState(false);
  const [fileCategory, setFileCategory] = useState<
    "deliverable" | "reference" | "export" | "document"
  >("deliverable");
  const [fileTaskId, setFileTaskId] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [expandedFileGroups, setExpandedFileGroups] = useState<string[]>([]);
  const [showSaveFilter, setShowSaveFilter] = useState(false);
  const [filterNameInput, setFilterNameInput] = useState("");
  const [savingTemplateMsg, setSavingTemplateMsg] = useState("");

  // Settings form
  const [settingsTitle, setSettingsTitle] = useState(project.title);
  const [settingsService, setSettingsService] = useState(
    project.serviceInterest
  );
  const [settingsSummary, setSettingsSummary] = useState(project.summary);
  const [settingsDue, setSettingsDue] = useState(
    project.dueDate ? new Date(project.dueDate).toISOString().slice(0, 10) : ""
  );
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  // Project-wide quick search (⌘K) + Board stage customization
  const [projectSearch, setProjectSearch] = useState("");
  const projectSearchRef = useRef<HTMLInputElement | null>(null);
  const [showBoardSettings, setShowBoardSettings] = useState(false);
  const [stageNameDrafts, setStageNameDrafts] = useState<Record<string, string>>(
    () => ({ ...(project.workflowConfig?.stageNames ?? {}) })
  );
  const [customLabelsDraft, setCustomLabelsDraft] = useState<string[]>(
    () => [...(project.workflowConfig?.labels ?? [])]
  );
  const [newBoardLabel, setNewBoardLabel] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        projectSearchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const getStageLabel = (colId: TaskWorkflowStatus, fallback: string) =>
    project.workflowConfig?.stageNames?.[colId]?.trim() || fallback;

  const statusMeta =
    PROJECT_STATUS_META[project.status] ?? PROJECT_STATUS_META.planning;

  const availableLabels = useMemo(() => {
    const set = new Set<string>(project.workflowConfig?.labels ?? []);
    for (const t of tasks) {
      for (const l of t.labels) set.add(l);
    }
    return Array.from(set).sort();
  }, [project.workflowConfig?.labels, tasks]);

  const taskImagesByTaskId = useMemo(() => {
    const map = new Map<string, Array<{ id: string; title: string; url: string }>>();
    for (const f of files) {
      if (!f.taskId) continue;
      const isImage =
        f.resourceType === "image" || f.mimeType.startsWith("image/");
      if (!isImage) continue;
      const list = map.get(f.taskId) ?? [];
      list.push({ id: f.id, title: f.title, url: f.secureUrl });
      map.set(f.taskId, list);
    }
    return map;
  }, [files]);

  const projectCoverPreview = useMemo(() => {
    if (project.coverUrl) return project.coverUrl;
    const firstImage = files.find(
      (f) => f.resourceType === "image" || f.mimeType.startsWith("image/")
    );
    return firstImage?.secureUrl ?? null;
  }, [files, project.coverUrl]);

  const projectSearchResults = useMemo(() => {
    const q = projectSearch.trim().toLowerCase();
    if (!q) return null;
    return {
      tasks: tasks
        .filter((t) =>
          `${t.title} ${t.taskCode} ${t.labels.join(" ")}`
            .toLowerCase()
            .includes(q)
        )
        .slice(0, 5),
      milestones: milestones
        .filter((m) => `${m.title} ${m.description}`.toLowerCase().includes(q))
        .slice(0, 3),
      files: files
        .filter((f) => `${f.title} ${f.category}`.toLowerCase().includes(q))
        .slice(0, 3),
    };
  }, [files, milestones, projectSearch, tasks]);

  const unfinishedTaskIds = useMemo(() => {
    return new Set(
      tasks
        .filter((t) => !t.completed && t.workflowStatus !== "done")
        .map((t) => t.id)
    );
  }, [tasks]);

  const groupedFiles = useMemo(() => {
    const groups = new Map<
      string,
      PmsWorkspacePayload["files"]
    >();
    for (const f of files) {
      const key = f.versionGroupId || f.title;
      const list = groups.get(key) ?? [];
      list.push(f);
      groups.set(key, list);
    }
    return Array.from(groups.entries()).map(([groupKey, versions]) => {
      const sorted = [...versions].sort((a, b) => b.version - a.version);
      return {
        groupKey,
        latest: sorted[0],
        history: sorted,
      };
    });
  }, [files]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      if (taskSearch.trim()) {
        const hay = `${t.title} ${t.taskCode} ${t.description}`.toLowerCase();
        if (!hay.includes(taskSearch.trim().toLowerCase())) return false;
      }
      if (
        assigneeFilter !== "all" &&
        !t.assignees.some((a) => a.userId === assigneeFilter)
      ) {
        return false;
      }
      if (priorityFilter !== "all" && t.priority !== priorityFilter) {
        return false;
      }
      if (labelFilter !== "all" && !t.labels.includes(labelFilter)) {
        return false;
      }
      return true;
    });
  }, [assigneeFilter, labelFilter, priorityFilter, taskSearch, tasks]);

  const patchProject = async (payload: Record<string, unknown>) => {
    const res = await fetch(`/api/v1/admin/pms/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      await onRefresh();
    }
  };

  const handleTaskMove = async (
    taskId: string,
    nextStatus: TaskWorkflowStatus
  ) => {
    if (!permissions.canEditTasks) return;
    await fetch(`/api/v1/admin/pms/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ workflowStatus: nextStatus }),
    });
    await onRefresh();
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;
    const res = await fetch(
      `/api/v1/admin/pms/projects/${project.id}/milestones`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newMilestoneTitle.trim(),
          dueDate: newMilestoneDue
            ? new Date(newMilestoneDue).toISOString()
            : null,
          status: "pending",
        }),
      }
    );
    if (res.ok) {
      setNewMilestoneTitle("");
      setNewMilestoneDue("");
      await onRefresh();
    }
  };

  const handleMilestoneStatus = async (
    milestoneId: string,
    status: "pending" | "in_progress" | "completed" | "delayed"
  ) => {
    await fetch(`/api/v1/admin/pms/projects/${project.id}/milestones`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ milestoneId, status }),
    });
    await onRefresh();
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberId) return;
    const res = await fetch(
      `/api/v1/admin/pms/projects/${project.id}/members`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: newMemberId,
          projectRole: newMemberRole,
        }),
      }
    );
    if (res.ok) {
      setNewMemberId("");
      await onRefresh();
    }
  };

  const handleUpdateMemberRole = async (userId: string, projectRole: string) => {
    await fetch(`/api/v1/admin/pms/projects/${project.id}/members`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, projectRole }),
    });
    await onRefresh();
  };

  const handleRemoveMember = async (userId: string) => {
    await fetch(
      `/api/v1/admin/pms/projects/${project.id}/members?userId=${userId}`,
      { method: "DELETE" }
    );
    await onRefresh();
  };

  const handleUploadProjectFile = async (
    e: React.ChangeEvent<HTMLInputElement>,
    options?: { versionGroupId?: string | null; fixedTitle?: string }
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingFile(true);
    setUploadError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "Projects");
      const upRes = await fetch("/api/v1/admin/media/upload", {
        method: "POST",
        body: fd,
      });
      const upJson = await upRes.json();
      if (!upRes.ok) {
        setUploadError(upJson.message || "File upload failed.");
        return;
      }

      const regRes = await fetch(
        `/api/v1/admin/pms/projects/${project.id}/files`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mediaAssetId: upJson.data.id,
            taskId: fileTaskId || null,
            title: options?.fixedTitle || file.name,
            category: fileCategory,
            versionGroupId: options?.versionGroupId || null,
            versionNote: options?.versionGroupId
              ? `Updated from ${file.name}`
              : undefined,
          }),
        }
      );
      if (!regRes.ok) {
        const regJson = await regRes.json();
        setUploadError(regJson.message || "Unable to register file in project.");
        return;
      }
      await onRefresh();
    } catch {
      setUploadError("Network error during file upload.");
    } finally {
      setUploadingFile(false);
      e.target.value = "";
    }
  };

  const handlePostDiscussion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!discussionInput.trim()) return;
    const res = await fetch(
      `/api/v1/admin/pms/projects/${project.id}/discussions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          parentId: replyParentId,
          body: discussionInput.trim(),
        }),
      }
    );
    if (res.ok) {
      setDiscussionInput("");
      setReplyParentId(null);
      await onRefresh();
    }
  };

  const topDiscussions = discussions.filter((d) => !d.parentId);
  const repliesByParent = useMemo(() => {
    const map = new Map<string, typeof discussions>();
    for (const d of discussions) {
      if (!d.parentId) continue;
      const list = map.get(d.parentId) ?? [];
      list.push(d);
      map.set(d.parentId, list);
    }
    return map;
  }, [discussions]);

  const timelineRange = useMemo(() => {
    const startMs = project.startDate
      ? new Date(project.startDate).getTime()
      : new Date(project.createdAt).getTime();
    const candidateEnds = [
      project.dueDate ? new Date(project.dueDate).getTime() : 0,
      ...tasks.map((t) => (t.dueDate ? new Date(t.dueDate).getTime() : 0)),
      ...milestones.map((m) =>
        m.dueDate ? new Date(m.dueDate).getTime() : 0
      ),
    ].filter(Boolean);
    const maxEnd = Math.max(startMs + 14 * 86400000, ...candidateEnds);
    return {
      startMs,
      spanMs: Math.max(86400000, maxEnd - startMs),
    };
  }, [milestones, project.createdAt, project.dueDate, project.startDate, tasks]);

  const calendarDays = useMemo(() => {
    const year = calendarCursor.getFullYear();
    const month = calendarCursor.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ day: number | null; dateStr: string }> = [];
    for (let i = 0; i < firstDay; i += 1) {
      cells.push({ day: null, dateStr: "" });
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;
      cells.push({ day: d, dateStr: iso });
    }
    return cells;
  }, [calendarCursor]);

  return (
    <div className="space-y-5">
      {/* Breadcrumb + Search in project (⌘K) */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-[#6D7480]">
          <button
            type="button"
            onClick={onBackToProjects}
            className="hover:text-[#D4AF77] cursor-pointer"
          >
            Projects
          </button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#F2F2F0] font-medium">{project.title}</span>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-[#6D7480] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            ref={projectSearchRef}
            type="search"
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            placeholder="Search in project..."
            className="w-full h-8 pl-8 pr-12 rounded-lg bg-[#111419] border border-[#252A31] text-xs text-[#F2F2F0] placeholder-[#6D7480] focus:outline-none focus:border-[#D4AF77]/60"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 rounded border border-[#252A31] bg-[#0B0D0F] px-1.5 py-0.5 text-[10px] font-mono text-[#6D7480]">
            ⌘K
          </kbd>

          {projectSearchResults && (
            <div className="absolute right-0 z-40 mt-1.5 w-80 rounded-xl border border-[#252A31] bg-[#111419] p-2.5 shadow-2xl space-y-2 text-xs">
              {projectSearchResults.tasks.length === 0 &&
              projectSearchResults.milestones.length === 0 &&
              projectSearchResults.files.length === 0 ? (
                <div className="py-3 text-center text-[#6D7480]">
                  No project items match &ldquo;{projectSearch}&rdquo;.
                </div>
              ) : (
                <>
                  {projectSearchResults.tasks.length > 0 && (
                    <div>
                      <div className="px-2 pb-1 text-[10px] font-mono uppercase text-[#6D7480]">
                        Tasks
                      </div>
                      {projectSearchResults.tasks.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          onClick={() => {
                            setProjectSearch("");
                            onOpenTask(t.id);
                          }}
                          className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-[#171B21] text-left cursor-pointer"
                        >
                          <span className="truncate text-[#F2F2F0]">
                            {t.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#D4AF77] shrink-0">
                            {t.taskCode}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {projectSearchResults.milestones.length > 0 && (
                    <div>
                      <div className="px-2 pb-1 text-[10px] font-mono uppercase text-[#6D7480]">
                        Milestones
                      </div>
                      {projectSearchResults.milestones.map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => {
                            setProjectSearch("");
                            onTabChange("milestones");
                          }}
                          className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-[#171B21] text-left cursor-pointer"
                        >
                          <span className="truncate text-[#F2F2F0]">
                            {m.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#A1A6AE]">
                            {m.status}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                  {projectSearchResults.files.length > 0 && (
                    <div>
                      <div className="px-2 pb-1 text-[10px] font-mono uppercase text-[#6D7480]">
                        Files
                      </div>
                      {projectSearchResults.files.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => {
                            setProjectSearch("");
                            onTabChange("files");
                          }}
                          className="w-full flex items-center justify-between gap-2 px-2 py-1.5 rounded-lg hover:bg-[#171B21] text-left cursor-pointer"
                        >
                          <span className="truncate text-[#F2F2F0]">
                            {f.title}
                          </span>
                          <span className="text-[10px] font-mono text-[#A1A6AE]">
                            v{f.version}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Project Header */}
      <div className="p-5 rounded-xl bg-[#111419] border border-[#252A31] space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4 min-w-0">
            <div
              role={projectCoverPreview ? "img" : undefined}
              aria-label={projectCoverPreview ? `${project.title} cover` : undefined}
              style={
                projectCoverPreview
                  ? { backgroundImage: `url("${projectCoverPreview}")` }
                  : undefined
              }
              className="w-20 h-14 rounded-xl bg-gradient-to-br from-[#2B2316] via-[#171B21] to-[#0B0D0F] bg-cover bg-center border border-[#D4AF77]/35 flex items-center justify-center text-[#D4AF77] font-heading font-bold text-lg shrink-0 overflow-hidden"
            >
              {!projectCoverPreview && getInitials(project.title)}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-heading font-bold text-xl sm:text-2xl text-[#F2F2F0] truncate">
                  {project.title}
                </h1>
                <button
                  type="button"
                  onClick={onToggleStar}
                  title="Star project"
                  className="text-[#6D7480] hover:text-[#D4AF77] cursor-pointer"
                >
                  <Star
                    className={cn(
                      "w-4 h-4",
                      project.isStarred && "text-[#D4AF77] fill-[#D4AF77]"
                    )}
                  />
                </button>
              </div>
              <div className="text-xs text-[#A1A6AE] mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-mono text-[#D4AF77]">
                  #{project.referenceCode}
                </span>
                <span>·</span>
                <span>
                  {project.clientCompany || project.clientName || "Studio Internal"}
                </span>
                <span>·</span>
                <span>{project.serviceInterest}</span>
                <span>·</span>
                <span>{project.progress}% complete</span>
              </div>
              {project.summary && (
                <p className="text-xs text-[#A1A6AE] mt-2 max-w-2xl">
                  {project.summary}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {permissions.canManageProject ? (
              <select
                value={project.status}
                onChange={(e) => patchProject({ status: e.target.value })}
                aria-label="Project status"
                className={cn(
                  "h-9 px-3 rounded-lg text-xs font-medium border bg-[#08090B] cursor-pointer",
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
                  "h-9 px-3 rounded-lg text-xs font-medium border inline-flex items-center",
                  statusMeta.badgeClass
                )}
              >
                {statusMeta.label}
              </span>
            )}

            {permissions.canManageProject && (
              <button
                type="button"
                onClick={() => setShowProgressEditor((v) => !v)}
                className="h-9 px-3.5 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold hover:bg-[#E2C28E] cursor-pointer"
              >
                Update Progress
              </button>
            )}

            {permissions.canEditTasks && (
              <button
                type="button"
                onClick={() => onNewTask("todo")}
                className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-[#171B21] border border-[#252A31] text-xs font-medium text-[#F2F2F0] hover:border-[#D4AF77]/45 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#D4AF77]" />
                <span>Add Task</span>
              </button>
            )}

            {permissions.canDeleteProject && (
              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(true)}
                title="Shut down and delete project"
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#2A1517] border border-[#E47777]/35 text-xs font-medium text-[#E47777] hover:bg-[#3A1C1F] hover:border-[#E47777]/60 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project</span>
              </button>
            )}
          </div>
        </div>

        {showProgressEditor && permissions.canManageProject && (
          <div className="p-3 rounded-lg bg-[#0B0D0F] border border-[#252A31] flex flex-wrap items-center gap-3 text-xs">
            <span className="text-[#A1A6AE]">
              Manual Baseline Progress % (auto-calculated when tasks exist:{" "}
              {project.completedTasks}/{project.totalTasks}):
            </span>
            <input
              type="number"
              min={0}
              max={100}
              value={manualProgress}
              onChange={(e) => setManualProgress(e.target.value)}
              className="w-20 h-8 px-2 rounded bg-[#111419] border border-[#252A31] text-[#F2F2F0]"
            />
            <button
              type="button"
              onClick={async () => {
                await patchProject({ progressPercent: Number(manualProgress) });
                setShowProgressEditor(false);
              }}
              className="h-8 px-3 rounded bg-[#D4AF77] text-[#08090B] font-semibold cursor-pointer"
            >
              Save
            </button>
          </div>
        )}

        {/* 10 Project Navigation Tabs */}
        <div className="pt-1 border-t border-[#252A31] flex items-center gap-1 overflow-x-auto">
          {PROJECT_TABS.map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTabChange(t.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer",
                  active
                    ? "border-[#D4AF77] text-[#D4AF77]"
                    : "border-transparent text-[#A1A6AE] hover:text-[#F2F2F0]"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-5">
            <div className="p-5 rounded-xl bg-[#111419] border border-[#252A31] space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-[#F2F2F0]">
                  Delivery Completion
                </span>
                <span className="font-mono text-[#D4AF77]">
                  {project.completedTasks} of {project.totalTasks} tasks (
                  {project.progress}%)
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-[#08090B] border border-[#252A31] overflow-hidden">
                <div
                  className="h-full bg-[#D4AF77] rounded-full transition-all"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {KANBAN_COLUMNS.slice(1).map((c) => {
                  const count = tasks.filter(
                    (t) => t.workflowStatus === c.id
                  ).length;
                  return (
                    <div
                      key={c.id}
                      className="p-3 rounded-lg bg-[#0B0D0F] border border-[#252A31]"
                    >
                      <div className="text-[11px] text-[#A1A6AE] flex items-center gap-1.5">
                        <span className={cn("w-2 h-2 rounded-full", c.dotColor)} />
                        <span>{c.label}</span>
                      </div>
                      <div className="font-heading font-bold text-lg text-[#F2F2F0] mt-1">
                        {count}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#111419] border border-[#252A31] space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-semibold text-sm text-[#F2F2F0]">
                  Key Milestones
                </h2>
                <button
                  type="button"
                  onClick={() => onTabChange("milestones")}
                  className="text-xs text-[#D4AF77] hover:underline cursor-pointer"
                >
                  Manage →
                </button>
              </div>
              {milestones.length === 0 ? (
                <div className="text-xs text-[#6D7480]">
                  No milestones defined yet.
                </div>
              ) : (
                <div className="divide-y divide-[#252A31]">
                  {milestones.map((m) => (
                    <div
                      key={m.id}
                      className="py-2.5 flex items-center justify-between text-xs"
                    >
                      <span className="text-[#F2F2F0] font-medium">
                        {m.title}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-[#6D7480]">
                          {formatShortDate(m.dueDate)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#171B21] border border-[#252A31] text-[10px] uppercase font-mono text-[#D4AF77]">
                          {m.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="p-5 rounded-xl bg-[#111419] border border-[#252A31] space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#F2F2F0]">
                <Activity className="w-4 h-4 text-[#D4AF77]" />
                <span>Recent Project Activity</span>
              </div>
              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {activityLogs.slice(0, 12).map((a) => (
                  <div
                    key={a.id}
                    className="text-xs border-l-2 border-[#252A31] pl-3 py-0.5"
                  >
                    <div className="text-[#F2F2F0]">{a.summary}</div>
                    <div className="text-[10px] font-mono text-[#6D7480]">
                      {a.actorName || "Studio"} ·{" "}
                      {new Date(a.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TASKS (Kanban | List | Calendar | Timeline) */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          {/* Task Toolbar */}
          <div className="p-3.5 rounded-xl bg-[#111419] border border-[#252A31] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap flex-1">
              <div className="relative min-w-[180px] flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 text-[#6D7480] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={taskSearch}
                  onChange={(e) => setTaskSearch(e.target.value)}
                  placeholder="Search tasks..."
                  className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
                />
              </div>

              <div className="flex items-center rounded-lg bg-[#08090B] border border-[#252A31] p-0.5">
                {(
                  [
                    { id: "kanban", label: "Kanban", icon: Kanban },
                    { id: "list", label: "List", icon: ListIcon },
                    { id: "calendar", label: "Calendar", icon: CalendarIcon },
                    { id: "timeline", label: "Timeline", icon: GanttChart },
                  ] as const
                ).map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setTaskView(mode.id)}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium cursor-pointer",
                        taskView === mode.id
                          ? "bg-[#D4AF77] text-[#08090B] font-semibold"
                          : "text-[#A1A6AE] hover:text-[#F2F2F0]"
                      )}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                aria-label="Filter by assignee"
                className="h-8 px-2.5 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              >
                <option value="all">Assignee: All</option>
                {studioUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.displayName}
                  </option>
                ))}
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                aria-label="Filter by priority"
                className="h-8 px-2.5 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              >
                <option value="all">Priority: All</option>
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {availableLabels.length > 0 && (
                <select
                  value={labelFilter}
                  onChange={(e) => setLabelFilter(e.target.value)}
                  aria-label="Filter by label"
                  className="h-8 px-2.5 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
                >
                  <option value="all">Labels: All</option>
                  {availableLabels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              )}

              <button
                type="button"
                onClick={() => setShowSaveFilter((v) => !v)}
                className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg bg-[#171B21] border border-[#252A31] hover:border-[#D4AF77]/45 text-xs text-[#D4AF77] cursor-pointer"
                title="Save current filter view"
              >
                <Bookmark className="w-3 h-3" />
                <span>Save View</span>
              </button>

              {permissions.canManageProject && (
                <button
                  type="button"
                  onClick={() => setShowBoardSettings((v) => !v)}
                  className={cn(
                    "inline-flex items-center justify-center h-8 w-8 rounded-lg border cursor-pointer",
                    showBoardSettings
                      ? "bg-[#261E12] border-[#D4AF77]/50 text-[#D4AF77]"
                      : "bg-[#171B21] border-[#252A31] text-[#A1A6AE] hover:text-white"
                  )}
                  title="Customize Kanban stages & labels"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {showBoardSettings && permissions.canManageProject && (
            <div className="p-4 rounded-xl bg-[#0B0D0F] border border-[#D4AF77]/35 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#F2F2F0]">
                  Customize Workflow Stages &amp; Project Labels
                </span>
                <button
                  type="button"
                  onClick={() => setShowBoardSettings(false)}
                  className="text-xs text-[#6D7480] hover:text-white"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                {KANBAN_COLUMNS.map((col) => (
                  <div key={col.id}>
                    <label className="block text-[10px] font-mono text-[#6D7480] mb-1">
                      {col.label}
                    </label>
                    <input
                      type="text"
                      value={stageNameDrafts[col.id] ?? col.label}
                      onChange={(e) =>
                        setStageNameDrafts((prev) => ({
                          ...prev,
                          [col.id]: e.target.value,
                        }))
                      }
                      className="w-full h-8 px-2.5 rounded-lg bg-[#111419] border border-[#252A31] text-xs text-[#F2F2F0]"
                    />
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {customLabelsDraft.map((lbl) => (
                  <span
                    key={lbl}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#171B21] border border-[#252A31] text-[11px] text-[#D4AF77]"
                  >
                    {lbl}
                    <button
                      type="button"
                      onClick={() =>
                        setCustomLabelsDraft((prev) =>
                          prev.filter((l) => l !== lbl)
                        )
                      }
                      className="text-[#6D7480] hover:text-[#E47777]"
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  type="text"
                  value={newBoardLabel}
                  onChange={(e) => setNewBoardLabel(e.target.value)}
                  placeholder="Add label..."
                  className="h-7 px-2.5 rounded bg-[#111419] border border-[#252A31] text-xs text-[#F2F2F0]"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = newBoardLabel.trim();
                    if (val && !customLabelsDraft.includes(val)) {
                      setCustomLabelsDraft((prev) => [...prev, val]);
                    }
                    setNewBoardLabel("");
                  }}
                  className="h-7 px-2.5 rounded border border-[#252A31] text-xs text-[#D4AF77]"
                >
                  + Label
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    await patchProject({
                      workflowConfig: {
                        stageNames: stageNameDrafts,
                        labels: customLabelsDraft,
                      },
                    });
                    setShowBoardSettings(false);
                  }}
                  className="ml-auto h-7 px-3 rounded bg-[#D4AF77] text-[#08090B] text-xs font-semibold cursor-pointer"
                >
                  Save Board Config
                </button>
              </div>
            </div>
          )}

          {(showSaveFilter || savedFilters.length > 0) && (
            <div className="px-3.5 py-2.5 rounded-xl bg-[#0B0D0F] border border-[#252A31] flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] font-mono uppercase text-[#6D7480] mr-1">
                  Saved Views:
                </span>
                {savedFilters.map((sf) => (
                  <span
                    key={sf.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#111419] border border-[#252A31] text-[11px] text-[#F2F2F0]"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setTaskSearch(sf.filterConfig.q || "");
                        setAssigneeFilter(sf.filterConfig.assignee || "all");
                        setPriorityFilter(sf.filterConfig.priority || "all");
                        setLabelFilter(sf.filterConfig.label || "all");
                      }}
                      className="hover:text-[#D4AF77] cursor-pointer"
                    >
                      {sf.name}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteFilter(sf.id)}
                      className="text-[#6D7480] hover:text-[#E47777] cursor-pointer"
                      aria-label={`Delete saved view ${sf.name}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {showSaveFilter && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!filterNameInput.trim()) return;
                    await onSaveFilter(filterNameInput.trim(), {
                      q: taskSearch,
                      assignee: assigneeFilter,
                      priority: priorityFilter,
                      label: labelFilter,
                    });
                    setFilterNameInput("");
                    setShowSaveFilter(false);
                  }}
                  className="flex items-center gap-1.5"
                >
                  <input
                    type="text"
                    required
                    value={filterNameInput}
                    onChange={(e) => setFilterNameInput(e.target.value)}
                    placeholder="Preset name (e.g. High Priority)..."
                    className="h-7 px-2.5 rounded bg-[#111419] border border-[#252A31] text-xs text-[#F2F2F0]"
                  />
                  <button
                    type="submit"
                    className="h-7 px-2.5 rounded bg-[#D4AF77] text-[#08090B] text-xs font-semibold cursor-pointer"
                  >
                    Save
                  </button>
                </form>
              )}
            </div>
          )}

          {/* 4.1 KANBAN VIEW */}
          {taskView === "kanban" && (
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-3.5 items-start">
              {KANBAN_COLUMNS.map((col) => {
                const colTasks = filteredTasks.filter(
                  (t) => t.workflowStatus === col.id
                );
                return (
                  <div
                    key={col.id}
                    onDragOver={(e) => {
                      if (!permissions.canEditTasks) return;
                      e.preventDefault();
                      setDragOverCol(col.id);
                    }}
                    onDragLeave={() => setDragOverCol(null)}
                    onDrop={async (e) => {
                      e.preventDefault();
                      setDragOverCol(null);
                      if (draggedTaskId) {
                        await handleTaskMove(draggedTaskId, col.id);
                        setDraggedTaskId(null);
                      }
                    }}
                    className={cn(
                      "rounded-xl bg-[#0B0D0F] border p-3 space-y-2.5 min-h-[260px] transition-colors",
                      dragOverCol === col.id
                        ? "border-[#D4AF77]"
                        : "border-[#252A31]"
                    )}
                  >
                    <div className="flex items-center justify-between px-1">
                      <div className="flex items-center gap-2">
                        <span className={cn("w-2 h-2 rounded-full", col.dotColor)} />
                        <span className="text-xs font-semibold text-[#F2F2F0]">
                          {getStageLabel(col.id, col.label)}
                        </span>
                        <span className="text-[11px] font-mono text-[#6D7480]">
                          {colTasks.length}
                        </span>
                      </div>
                      {permissions.canEditTasks && (
                        <button
                          type="button"
                          onClick={() => onNewTask(col.id)}
                          className="text-[#6D7480] hover:text-[#D4AF77] cursor-pointer"
                          title={`Add task in ${col.label}`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-2.5">
                      {colTasks.map((task) => {
                        const subPct =
                          task.subtasksTotal > 0
                            ? Math.round(
                                (task.subtasksCompleted / task.subtasksTotal) *
                                  100
                              )
                            : task.workflowStatus === "done"
                            ? 100
                            : 0;
                        return (
                          <div
                            key={task.id}
                            draggable={permissions.canEditTasks}
                            onDragStart={() => setDraggedTaskId(task.id)}
                            onClick={() => onOpenTask(task.id)}
                            className="p-3 rounded-xl bg-[#111419] border border-[#252A31] hover:border-[#D4AF77]/50 space-y-2.5 cursor-pointer transition-colors"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="text-xs font-semibold text-[#F2F2F0] leading-snug">
                                {task.title}
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-1">
                              {task.labels.slice(0, 3).map((l) => (
                                <span
                                  key={l}
                                  className="px-1.5 py-0.5 rounded bg-[#171B21] border border-[#252A31] text-[10px] text-[#A1A6AE]"
                                >
                                  {l}
                                </span>
                              ))}
                              <span
                                className={cn(
                                  "px-1.5 py-0.5 rounded border text-[10px] font-medium",
                                  PRIORITY_META[task.priority].badgeClass
                                )}
                              >
                                {PRIORITY_META[task.priority].label}
                              </span>
                              {task.dependencyTaskIds.some((depId) =>
                                unfinishedTaskIds.has(depId)
                              ) && (
                                <span
                                  title="Blocked by unfinished dependency"
                                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#2A1517] border border-[#E47777]/35 text-[10px] text-[#E47777]"
                                >
                                  <GitBranch className="w-2.5 h-2.5" />
                                  <span>Blocked</span>
                                </span>
                              )}
                              {task.recurrenceRule &&
                                task.recurrenceRule !== "none" && (
                                  <span
                                    title={`Repeats ${task.recurrenceRule}`}
                                    className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#13291E] border border-[#56C88A]/35 text-[10px] text-[#56C88A]"
                                  >
                                    <Repeat className="w-2.5 h-2.5" />
                                    <span className="capitalize">
                                      {task.recurrenceRule}
                                    </span>
                                  </span>
                                )}
                            </div>

                            {/* Visual Task Media / Moodboard Preview */}
                            {(() => {
                              const thumbs = taskImagesByTaskId.get(task.id) ?? [];
                              if (thumbs.length === 1) {
                                return (
                                  <div
                                    role="img"
                                    aria-label={thumbs[0].title}
                                    style={{
                                      backgroundImage: `url("${thumbs[0].url}")`,
                                    }}
                                    className="h-20 w-full rounded-lg border border-[#252A31] bg-cover bg-center"
                                  />
                                );
                              }
                              if (thumbs.length >= 2) {
                                return (
                                  <div className="grid grid-cols-3 gap-1.5">
                                    {thumbs.slice(0, 3).map((thumb) => (
                                      <div
                                        key={thumb.id}
                                        role="img"
                                        aria-label={thumb.title}
                                        style={{
                                          backgroundImage: `url("${thumb.url}")`,
                                        }}
                                        className="h-11 rounded-md border border-[#252A31] bg-cover bg-center"
                                      />
                                    ))}
                                  </div>
                                );
                              }
                              return null;
                            })()}

                            {col.id === "done" || task.completed ? (
                              <div className="inline-flex items-center gap-1 text-[11px] font-medium text-[#56C88A]">
                                <Check className="w-3 h-3 stroke-[2.5]" />
                                <span>Completed</span>
                              </div>
                            ) : (
                              <div className="space-y-1">
                                <div className="flex justify-between text-[10px] font-mono text-[#6D7480]">
                                  <span>{subPct}%</span>
                                  {task.subtasksTotal > 0 && (
                                    <span>
                                      {task.subtasksCompleted}/
                                      {task.subtasksTotal}
                                    </span>
                                  )}
                                </div>
                                <div className="h-1 rounded-full bg-[#08090B] overflow-hidden">
                                  <div
                                    className="h-full bg-[#D4AF77]"
                                    style={{ width: `${subPct}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            <div className="pt-1 border-t border-[#1C2027] flex items-center justify-between text-[11px] text-[#6D7480]">
                              <div className="flex -space-x-1">
                                {task.assignees.slice(0, 3).map((a) => (
                                  <span
                                    key={a.userId}
                                    title={a.displayName}
                                    className="w-5 h-5 rounded-full bg-[#241E14] border border-[#D4AF77]/45 text-[#D4AF77] text-[9px] font-semibold flex items-center justify-center"
                                  >
                                    {getInitials(a.displayName)}
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center gap-2 font-mono text-[10px]">
                                {task.attachmentsCount > 0 && (
                                  <span className="inline-flex items-center gap-0.5">
                                    <Paperclip className="w-3 h-3" />
                                    {task.attachmentsCount}
                                  </span>
                                )}
                                {task.commentsCount > 0 && (
                                  <span className="inline-flex items-center gap-0.5">
                                    <MessageSquare className="w-3 h-3" />
                                    {task.commentsCount}
                                  </span>
                                )}
                                <span>
                                  {task.dueDate
                                    ? formatShortDate(task.dueDate)
                                    : task.dueDateLabel}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {permissions.canEditTasks && (
                      <button
                        type="button"
                        onClick={() => onNewTask(col.id)}
                        className="w-full py-1.5 rounded-lg border border-dashed border-[#252A31] hover:border-[#D4AF77]/45 text-[11px] text-[#6D7480] hover:text-[#D4AF77] cursor-pointer"
                      >
                        + Add Task
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 4.2 LIST VIEW */}
          {taskView === "list" && (
            <div className="rounded-xl bg-[#111419] border border-[#252A31] overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#252A31] text-[10px] font-mono uppercase tracking-[0.14em] text-[#6D7480] bg-[#0B0D0F]">
                    <th className="py-3 px-4 font-normal">Task</th>
                    <th className="py-3 px-3 font-normal">Status</th>
                    <th className="py-3 px-3 font-normal">Priority</th>
                    <th className="py-3 px-3 font-normal">Assignees</th>
                    <th className="py-3 px-3 font-normal">Subtasks</th>
                    <th className="py-3 px-3 font-normal">Time</th>
                    <th className="py-3 px-4 font-normal text-right">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252A31]">
                  {filteredTasks.map((t) => {
                    const col =
                      KANBAN_COLUMNS.find((c) => c.id === t.workflowStatus) ??
                      KANBAN_COLUMNS[1];
                    return (
                      <tr
                        key={t.id}
                        onClick={() => onOpenTask(t.id)}
                        className="hover:bg-[#171B21]/70 cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <div className="text-xs font-medium text-[#F2F2F0]">
                            {t.title}
                          </div>
                          <div className="text-[10px] font-mono text-[#6D7480]">
                            #{t.taskCode}
                          </div>
                        </td>
                        <td
                          className="py-3 px-3"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            disabled={!permissions.canEditTasks}
                            value={t.workflowStatus}
                            onChange={(e) =>
                              handleTaskMove(
                                t.id,
                                e.target.value as TaskWorkflowStatus
                              )
                            }
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[11px] border bg-[#08090B]",
                              col.badgeClass
                            )}
                          >
                            {KANBAN_COLUMNS.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.label}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[11px] border",
                              PRIORITY_META[t.priority].badgeClass
                            )}
                          >
                            {PRIORITY_META[t.priority].label}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs text-[#A1A6AE]">
                          {t.assignees.map((a) => a.displayName).join(", ") ||
                            "—"}
                        </td>
                        <td className="py-3 px-3 text-xs font-mono text-[#A1A6AE]">
                          {t.subtasksCompleted}/{t.subtasksTotal}
                        </td>
                        <td className="py-3 px-3 text-xs font-mono text-[#D4AF77]">
                          {formatMinutes(t.loggedMinutes)}
                        </td>
                        <td className="py-3 px-4 text-right text-xs text-[#A1A6AE]">
                          {t.dueDate
                            ? formatShortDate(t.dueDate)
                            : t.dueDateLabel}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* 4.3 CALENDAR VIEW */}
          {taskView === "calendar" && (
            <div className="rounded-xl bg-[#111419] border border-[#252A31] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-sm text-[#F2F2F0]">
                  {calendarCursor.toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarCursor(
                        new Date(
                          calendarCursor.getFullYear(),
                          calendarCursor.getMonth() - 1,
                          1
                        )
                      )
                    }
                    className="p-1.5 rounded bg-[#0B0D0F] border border-[#252A31] text-[#A1A6AE] cursor-pointer"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarCursor(
                        new Date(
                          calendarCursor.getFullYear(),
                          calendarCursor.getMonth() + 1,
                          1
                        )
                      )
                    }
                    className="p-1.5 rounded bg-[#0B0D0F] border border-[#252A31] text-[#A1A6AE] cursor-pointer"
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-[10px] font-mono uppercase text-[#6D7480] text-center">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.map((cell, idx) => {
                  const dayTasks = cell.day
                    ? filteredTasks.filter(
                        (t) =>
                          t.dueDate &&
                          new Date(t.dueDate).toISOString().slice(0, 10) ===
                            cell.dateStr
                      )
                    : [];
                  return (
                    <div
                      key={idx}
                      className="min-h-[86px] p-1.5 rounded-lg bg-[#0B0D0F] border border-[#252A31] space-y-1"
                    >
                      {cell.day && (
                        <>
                          <div className="text-[10px] font-mono text-[#6D7480]">
                            {cell.day}
                          </div>
                          {dayTasks.map((t) => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => onOpenTask(t.id)}
                              className="w-full px-1.5 py-1 rounded bg-[#171B21] border border-[#D4AF77]/35 text-[10px] text-[#F2F2F0] truncate text-left cursor-pointer"
                            >
                              {t.title}
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4.4 INLINE TIMELINE VIEW */}
          {taskView === "timeline" && (
            <TimelinePanel
              tasks={filteredTasks}
              milestones={milestones}
              timelineRange={timelineRange}
              onOpenTask={onOpenTask}
            />
          )}
        </div>
      )}

      {/* TAB 3: TIMELINE */}
      {activeTab === "timeline" && (
        <TimelinePanel
          tasks={tasks}
          milestones={milestones}
          timelineRange={timelineRange}
          onOpenTask={onOpenTask}
        />
      )}

      {/* TAB 4: MILESTONES */}
      {activeTab === "milestones" && (
        <div className="rounded-xl bg-[#111419] border border-[#252A31] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-base text-[#F2F2F0]">
              Deliverable Milestones
            </h2>
          </div>

          {permissions.canEditTasks && (
            <form
              onSubmit={handleAddMilestone}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2.5"
            >
              <input
                type="text"
                required
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                placeholder="Milestone name (e.g. Brand Discovery)..."
                className="sm:col-span-7 h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
              <input
                type="date"
                value={newMilestoneDue}
                onChange={(e) => setNewMilestoneDue(e.target.value)}
                className="sm:col-span-3 h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
              <button
                type="submit"
                className="sm:col-span-2 h-9 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold cursor-pointer"
              >
                Add Milestone
              </button>
            </form>
          )}

          <div className="divide-y divide-[#252A31] rounded-xl bg-[#0B0D0F] border border-[#252A31]">
            {milestones.length === 0 ? (
              <div className="p-8 text-center text-xs text-[#6D7480]">
                No milestones created yet.
              </div>
            ) : (
              milestones.map((m) => (
                <div
                  key={m.id}
                  className="px-4 py-3 flex flex-wrap items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-medium text-[#F2F2F0]">
                      {m.title}
                    </div>
                    <div className="text-xs text-[#6D7480]">
                      Due: {formatShortDate(m.dueDate)}
                    </div>
                  </div>
                  <select
                    disabled={!permissions.canEditTasks}
                    value={m.status}
                    onChange={(e) =>
                      handleMilestoneStatus(
                        m.id,
                        e.target.value as
                          | "pending"
                          | "in_progress"
                          | "completed"
                          | "delayed"
                      )
                    }
                    className="h-8 px-2.5 rounded-lg bg-[#111419] border border-[#252A31] text-xs text-[#D4AF77]"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="delayed">Delayed</option>
                  </select>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 5: TEAM */}
      {activeTab === "team" && (
        <div className="rounded-xl bg-[#111419] border border-[#252A31] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-semibold text-base text-[#F2F2F0]">
                Project Team &amp; Permissions
              </h2>
              <p className="text-xs text-[#A1A6AE]">
                Project roles and capacity are enforced at the API level.
              </p>
            </div>
          </div>

          {permissions.canManageProject && (
            <form
              onSubmit={handleAddMember}
              className="grid grid-cols-1 sm:grid-cols-12 gap-2.5"
            >
              <select
                required
                value={newMemberId}
                onChange={(e) => setNewMemberId(e.target.value)}
                className="sm:col-span-6 h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              >
                <option value="">Select team member to assign...</option>
                {studioUsers.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.displayName} ({u.emailNormalized})
                  </option>
                ))}
              </select>
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="sm:col-span-4 h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              >
                <option value="project_manager">Project Manager</option>
                <option value="team_lead">Team Lead</option>
                <option value="team_member">Team Member</option>
                <option value="viewer">Viewer (Read-only)</option>
              </select>
              <button
                type="submit"
                className="sm:col-span-2 inline-flex items-center justify-center gap-1 h-9 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold cursor-pointer"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Assign</span>
              </button>
            </form>
          )}

          <div className="divide-y divide-[#252A31] rounded-xl bg-[#0B0D0F] border border-[#252A31]">
            {members.map((m) => (
              <div
                key={m.id}
                className="px-4 py-3 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#241E14] border border-[#D4AF77]/35 text-[#D4AF77] text-xs font-semibold flex items-center justify-center">
                    {getInitials(m.displayName)}
                  </span>
                  <div>
                    <div className="text-sm font-medium text-[#F2F2F0]">
                      {m.displayName}
                    </div>
                    <div className="text-xs text-[#6D7480]">
                      {m.assignedTasks} tasks · {m.completedTasks} done ·{" "}
                      {formatMinutes(m.loggedMinutes)} logged
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {permissions.canManageProject ? (
                    <select
                      value={m.projectRole}
                      onChange={(e) =>
                        handleUpdateMemberRole(m.userId, e.target.value)
                      }
                      className="h-8 px-2.5 rounded-lg bg-[#111419] border border-[#252A31] text-xs text-[#D4AF77]"
                    >
                      <option value="project_manager">Project Manager</option>
                      <option value="team_lead">Team Lead</option>
                      <option value="team_member">Team Member</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  ) : (
                    <span className="text-xs font-mono text-[#D4AF77]">
                      {PROJECT_ROLE_LABELS[m.projectRole] || m.projectRole}
                    </span>
                  )}

                  {permissions.canManageProject && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(m.userId)}
                      className="p-1.5 text-[#6D7480] hover:text-[#E47777] cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: FILES */}
      {activeTab === "files" && (
        <div className="rounded-xl bg-[#111419] border border-[#252A31] p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-heading font-semibold text-base text-[#F2F2F0]">
                Project Files &amp; Deliverables
              </h2>
              <p className="text-xs text-[#A1A6AE]">
                Cloudinary-backed project assets with automatic version tracking.
              </p>
            </div>

            {permissions.canEditTasks && (
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={fileCategory}
                  onChange={(e) =>
                    setFileCategory(
                      e.target.value as
                        | "deliverable"
                        | "reference"
                        | "export"
                        | "document"
                    )
                  }
                  className="h-9 px-2.5 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
                >
                  <option value="deliverable">Deliverable</option>
                  <option value="reference">Reference</option>
                  <option value="export">Design Export</option>
                  <option value="document">Document</option>
                </select>
                <select
                  value={fileTaskId}
                  onChange={(e) => setFileTaskId(e.target.value)}
                  className="h-9 px-2.5 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
                >
                  <option value="">General Project File</option>
                  {tasks.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.taskCode}: {t.title}
                    </option>
                  ))}
                </select>
                <label className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold cursor-pointer">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingFile ? "Uploading..." : "Upload File"}</span>
                  <input
                    type="file"
                    onChange={handleUploadProjectFile}
                    disabled={uploadingFile}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>

          {uploadError && (
            <div className="p-3 rounded-lg bg-[#2A1517] border border-[#E47777]/40 text-xs text-[#E47777]">
              {uploadError}
            </div>
          )}

          {groupedFiles.length === 0 ? (
            <div className="p-10 rounded-xl bg-[#0B0D0F] border border-[#252A31] text-center text-xs text-[#6D7480]">
              No files uploaded to this project yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {groupedFiles.map(({ groupKey, latest, history }) => {
                const isExpanded = expandedFileGroups.includes(groupKey);
                return (
                  <div
                    key={groupKey}
                    className="p-3.5 rounded-xl bg-[#0B0D0F] border border-[#252A31] space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="w-9 h-9 rounded-lg bg-[#171B21] border border-[#252A31] flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-[#D4AF77]" />
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-[#F2F2F0] truncate">
                            {latest.title}
                          </div>
                          <div className="text-[10px] font-mono text-[#6D7480]">
                            <span className="text-[#D4AF77]">
                              v{latest.version}
                            </span>{" "}
                            · {latest.category} ·{" "}
                            {latest.uploaderName || "Studio"} ·{" "}
                            {formatShortDate(latest.createdAt)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {permissions.canEditTasks && (
                          <label
                            title="Upload new version of this file"
                            className="px-2 py-1 rounded-lg bg-[#171B21] border border-[#252A31] hover:border-[#D4AF77]/45 text-[10px] font-mono text-[#D4AF77] cursor-pointer"
                          >
                            + Version
                            <input
                              type="file"
                              onChange={(ev) =>
                                handleUploadProjectFile(ev, {
                                  versionGroupId: latest.versionGroupId,
                                  fixedTitle: latest.title,
                                })
                              }
                              disabled={uploadingFile}
                              className="hidden"
                            />
                          </label>
                        )}
                        <a
                          href={latest.secureUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-[#171B21] border border-[#252A31] text-[#D4AF77]"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {history.length > 1 && (
                      <div className="pt-2 border-t border-[#1D2128]">
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedFileGroups((prev) =>
                              prev.includes(groupKey)
                                ? prev.filter((k) => k !== groupKey)
                                : [...prev, groupKey]
                            )
                          }
                          className="inline-flex items-center gap-1 text-[11px] font-mono text-[#7BA8DF] hover:underline cursor-pointer"
                        >
                          <History className="w-3 h-3" />
                          <span>Version History ({history.length})</span>
                          <ChevronDown
                            className={cn(
                              "w-3 h-3 transition-transform",
                              isExpanded && "rotate-180"
                            )}
                          />
                        </button>
                        {isExpanded && (
                          <div className="mt-2 space-y-1">
                            {history.map((ver) => (
                              <div
                                key={ver.id}
                                className="flex items-center justify-between text-[11px] px-2 py-1 rounded bg-[#111419]"
                              >
                                <span className="text-[#A1A6AE]">
                                  <span className="font-mono text-[#D4AF77] mr-1.5">
                                    v{ver.version}
                                  </span>
                                  {ver.versionNote || ver.uploaderName || "Upload"} ·{" "}
                                  {formatShortDate(ver.createdAt)}
                                </span>
                                <a
                                  href={ver.secureUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-[#7BA8DF] hover:underline"
                                >
                                  Open
                                </a>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 7: DISCUSSION */}
      {activeTab === "discussion" && (
        <div className="rounded-xl bg-[#111419] border border-[#252A31] p-5 space-y-4">
          <div>
            <h2 className="font-heading font-semibold text-base text-[#F2F2F0]">
              Project Discussion
            </h2>
            <p className="text-xs text-[#A1A6AE]">
              Team conversations at the project level (use @Name to trigger
              Inbox mentions).
            </p>
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto">
            {topDiscussions.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#0B0D0F] border border-[#252A31] text-center text-xs text-[#6D7480]">
                Start the conversation for {project.title}.
              </div>
            ) : (
              topDiscussions.map((msg) => {
                const replies = repliesByParent.get(msg.id) ?? [];
                return (
                  <div
                    key={msg.id}
                    className="p-4 rounded-xl bg-[#0B0D0F] border border-[#252A31] space-y-2.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-[#D4AF77]">
                        {msg.authorName || "Studio Team"}
                      </span>
                      <span className="text-[11px] font-mono text-[#6D7480]">
                        {new Date(msg.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-[#F2F2F0] whitespace-pre-wrap">
                      {msg.body}
                    </p>
                    {permissions.canEditTasks && (
                      <button
                        type="button"
                        onClick={() => setReplyParentId(msg.id)}
                        className="text-[11px] text-[#7BA8DF] hover:underline cursor-pointer"
                      >
                        Reply to thread
                      </button>
                    )}

                    {replies.length > 0 && (
                      <div className="pl-4 border-l border-[#252A31] space-y-2 mt-2">
                        {replies.map((rep) => (
                          <div key={rep.id} className="text-xs space-y-0.5">
                            <span className="font-medium text-[#D4AF77]">
                              {rep.authorName || "Studio"}
                            </span>
                            <span className="text-[#6D7480] ml-2 font-mono text-[10px]">
                              {new Date(rep.createdAt).toLocaleString()}
                            </span>
                            <p className="text-[#E4E0D8]">{rep.body}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {permissions.canEditTasks && (
            <form onSubmit={handlePostDiscussion} className="space-y-2 pt-2">
              {replyParentId && (
                <div className="text-xs text-[#7BA8DF] flex items-center gap-2">
                  <span>Replying to thread...</span>
                  <button
                    type="button"
                    onClick={() => setReplyParentId(null)}
                    className="text-[#E47777] hover:underline cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
              <div className="flex flex-wrap gap-1">
                {studioUsers.slice(0, 6).map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() =>
                      setDiscussionInput((b) =>
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
                  value={discussionInput}
                  onChange={(e) => setDiscussionInput(e.target.value)}
                  placeholder="Write a project update or @mention teammate..."
                  className="flex-1 h-10 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
                />
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post</span>
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* TAB 8: NOTES */}
      {activeTab === "notes" && (
        <div className="rounded-xl bg-[#111419] border border-[#252A31] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading font-semibold text-base text-[#F2F2F0]">
                Internal Documentation &amp; Notes
              </h2>
              <p className="text-xs text-[#A1A6AE]">
                Briefings, creative direction notes, credentials pointers, and
                meeting minutes.
              </p>
            </div>
            {permissions.canManageProject && (
              <button
                type="button"
                onClick={async () => {
                  await patchProject({ internalNotes: notesDraft });
                  setNotesSavedMsg("Saved!");
                  setTimeout(() => setNotesSavedMsg(""), 2500);
                }}
                className="h-9 px-4 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold cursor-pointer"
              >
                {notesSavedMsg || "Save Notes"}
              </button>
            )}
          </div>
          <textarea
            rows={12}
            disabled={!permissions.canManageProject}
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Write project specifications, design constraints, meeting notes..."
            className="w-full p-4 rounded-xl bg-[#08090B] border border-[#252A31] text-sm text-[#F2F2F0] font-sans leading-relaxed focus:outline-none focus:border-[#D4AF77]"
          />
        </div>
      )}

      {/* TAB 9: CLIENT */}
      {activeTab === "client" && (
        <div className="rounded-xl bg-[#111419] border border-[#252A31] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-base text-[#F2F2F0]">
              Associated Client Record
            </h2>
            <Link
              href="/admin/inquiries?view=clients"
              className="inline-flex items-center gap-1.5 text-xs text-[#D4AF77] hover:underline"
            >
              <span>Open in CRM</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
          {project.clientName ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#0B0D0F] border border-[#252A31] text-xs">
              <div>
                <div className="text-[10px] font-mono uppercase text-[#6D7480]">
                  Contact Name
                </div>
                <div className="text-sm font-medium text-[#F2F2F0] mt-0.5">
                  {project.clientName}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-[#6D7480]">
                  Company
                </div>
                <div className="text-sm text-[#F2F2F0] mt-0.5">
                  {project.clientCompany || "Independent"}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-[#6D7480]">
                  Email
                </div>
                <div className="text-sm text-[#D4AF77] mt-0.5">
                  {project.clientEmail}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-[#6D7480]">
                  Phone
                </div>
                <div className="text-sm text-[#F2F2F0] mt-0.5">
                  {project.clientPhone || "Not provided"}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-xl bg-[#0B0D0F] border border-[#252A31] text-xs text-[#A1A6AE]">
              This is an internal studio project with no linked CRM client yet.
            </div>
          )}
        </div>
      )}

      {/* TAB 10: SETTINGS */}
      {activeTab === "settings" && (
        <div className="rounded-xl bg-[#111419] border border-[#252A31] p-5 space-y-4">
          <h2 className="font-heading font-semibold text-base text-[#F2F2F0]">
            Project Settings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Project Title
              </label>
              <input
                type="text"
                disabled={!permissions.canManageProject}
                value={settingsTitle}
                onChange={(e) => setSettingsTitle(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Service Interest
              </label>
              <input
                type="text"
                disabled={!permissions.canManageProject}
                value={settingsService}
                onChange={(e) => setSettingsService(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Target Due Date
              </label>
              <input
                type="date"
                disabled={!permissions.canManageProject}
                value={settingsDue}
                onChange={(e) => setSettingsDue(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Summary
              </label>
              <textarea
                rows={3}
                disabled={!permissions.canManageProject}
                value={settingsSummary}
                onChange={(e) => setSettingsSummary(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
            </div>
          </div>

          {permissions.canManageProject && (
            <div className="pt-3 border-t border-[#252A31] flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => patchProject({ action: "duplicate" })}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#171B21] border border-[#252A31] text-xs text-[#F2F2F0] cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5 text-[#7BA8DF]" />
                  <span>Duplicate</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const res = await fetch("/api/v1/admin/pms/templates", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name: `${project.title} Blueprint`,
                        serviceInterest: project.serviceInterest,
                        description: project.summary,
                        sourceProjectId: project.id,
                      }),
                    });
                    if (res.ok) {
                      setSavingTemplateMsg("Saved Template!");
                      setTimeout(() => setSavingTemplateMsg(""), 3000);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#171B21] border border-[#252A31] text-xs text-[#D4AF77] cursor-pointer"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>{savingTemplateMsg || "Save as Template"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => patchProject({ status: "archived" })}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-[#171B21] border border-[#252A31] text-xs text-[#E7B65D] cursor-pointer"
                >
                  <Archive className="w-3.5 h-3.5" />
                  <span>Archive Project</span>
                </button>
              </div>
              <button
                type="button"
                onClick={() =>
                  patchProject({
                    title: settingsTitle,
                    serviceInterest: settingsService,
                    summary: settingsSummary,
                    dueDate: settingsDue
                      ? new Date(settingsDue).toISOString()
                      : null,
                    dueDateLabel: settingsDue
                      ? formatShortDate(settingsDue)
                      : project.dueDateLabel,
                  })
                }
                className="h-9 px-4 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold cursor-pointer"
              >
                Save Project Settings
              </button>
            </div>
          )}

          {permissions.canDeleteProject && (
            <div className="mt-6 rounded-xl border border-[#E47777]/30 bg-[#1B1113] p-4 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#E47777]">
                  Danger Zone — Shut Down Project
                </h4>
                <p className="text-xs text-[#A1A6AE] mt-1">
                  Permanently shut down this project and delete its{" "}
                  {tasks.length} tasks, {milestones.length} milestones,{" "}
                  {files.length} files, and discussion history. This cannot be
                  undone.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmDeleteOpen(true)}
                className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#D94A4A] text-white text-xs font-semibold hover:bg-[#E45B5B] cursor-pointer shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Project Permanently</span>
              </button>
            </div>
          )}
        </div>
      )}

      {confirmDeleteOpen && permissions.canDeleteProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-[#E47777]/35 bg-[#111419] p-6 shadow-2xl space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#E47777]/35 bg-[#2A1517] text-[#E47777]">
                  <Trash2 className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[#F2F2F0]">
                    Shut Down & Delete Project?
                  </h3>
                  <p className="text-xs text-[#A1A6AE] mt-0.5">
                    #{project.referenceCode} · {project.title}
                  </p>
                </div>
              </div>
              <button
                type="button"
                disabled={deletingProject}
                onClick={() => setConfirmDeleteOpen(false)}
                className="rounded-lg p-1 text-[#A1A6AE] hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-xl border border-[#252A31] bg-[#0B0D0F] p-3.5 text-xs text-[#D8DCE3] space-y-1.5">
              <p>
                This will permanently shut down{" "}
                <strong className="text-white">{project.title}</strong> and
                remove:
              </p>
              <ul className="list-disc pl-4 text-[#A1A6AE] space-y-0.5">
                <li>{tasks.length} project tasks, subtasks, and work logs</li>
                <li>{milestones.length} milestones & {files.length} attached files</li>
                <li>{discussions.length} discussion comments & member links</li>
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                type="button"
                disabled={deletingProject}
                onClick={async () => {
                  setConfirmDeleteOpen(false);
                  await patchProject({ status: "archived" });
                }}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg border border-[#252A31] bg-[#171B21] text-xs text-[#E7B65D] hover:border-[#E7B65D]/45 cursor-pointer"
              >
                <Archive className="h-3.5 w-3.5" />
                <span>Archive Instead</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={deletingProject}
                  onClick={() => setConfirmDeleteOpen(false)}
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
                      await onDeleteProject();
                      setConfirmDeleteOpen(false);
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
        </div>
      )}
    </div>
  );
}

function TimelinePanel({
  tasks,
  milestones,
  timelineRange,
  onOpenTask,
}: {
  tasks: PmsTaskItem[];
  milestones: PmsWorkspacePayload["milestones"];
  timelineRange: { startMs: number; spanMs: number };
  onOpenTask: (taskId: string) => void;
}) {
  const pctFor = (dateStr: string | null | undefined, fallbackOffset = 0) => {
    const ms = dateStr
      ? new Date(dateStr).getTime()
      : timelineRange.startMs + fallbackOffset;
    return Math.max(
      0,
      Math.min(96, ((ms - timelineRange.startMs) / timelineRange.spanMs) * 100)
    );
  };

  return (
    <div className="rounded-xl bg-[#111419] border border-[#252A31] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-heading font-semibold text-base text-[#F2F2F0]">
            Project Schedule &amp; Timeline
          </h2>
          <p className="text-xs text-[#A1A6AE]">
            Chronological view of milestones, task spans, dependencies, and
            deliverables.
          </p>
        </div>
      </div>

      {milestones.length === 0 && tasks.length === 0 ? (
        <div className="p-8 text-center text-xs text-[#6D7480]">
          Add milestones or task due dates to visualize the timeline.
        </div>
      ) : (
        <div className="space-y-2.5">
          {/* Week Ruler Header */}
          <div className="grid grid-cols-12 items-center gap-3 px-2.5 text-[10px] font-mono uppercase text-[#6D7480]">
            <div className="col-span-4">Deliverable / Task</div>
            <div className="col-span-8 grid grid-cols-4 border-b border-[#252A31] pb-1 text-center">
              <span>W1</span>
              <span>W2</span>
              <span>W3</span>
              <span>W4+</span>
            </div>
          </div>
          {milestones.map((m) => {
            const pos = pctFor(m.dueDate, 7 * 86400000);
            return (
              <div
                key={m.id}
                className="grid grid-cols-12 items-center gap-3 p-2.5 rounded-lg bg-[#0B0D0F] border border-[#252A31]"
              >
                <div className="col-span-4 min-w-0">
                  <div className="text-xs font-medium text-[#D4AF77] truncate">
                    ◆ {m.title}
                  </div>
                  <div className="text-[10px] font-mono text-[#6D7480]">
                    {formatShortDate(m.dueDate)} · {m.status.replace("_", " ")}
                  </div>
                </div>
                <div className="col-span-8 relative h-5 rounded bg-[#111419] border border-[#1E222A]">
                  <div
                    className={cn(
                      "absolute top-1 h-3 rounded-full px-2 text-[9px] font-mono flex items-center",
                      m.status === "completed"
                        ? "bg-[#56C88A] text-[#08090B]"
                        : m.status === "delayed"
                        ? "bg-[#E47777] text-[#08090B]"
                        : "bg-[#D4AF77] text-[#08090B]"
                    )}
                    style={{ left: `${pos}%`, width: "16%" }}
                  >
                    Milestone
                  </div>
                </div>
              </div>
            );
          })}

          {tasks.map((t, idx) => {
            const startPct = pctFor(t.startDate, idx * 2 * 86400000);
            const endPct = pctFor(
              t.dueDate,
              (idx * 2 + 5) * 86400000
            );
            const barLeft = Math.min(startPct, endPct);
            const barWidth = Math.max(10, Math.abs(endPct - startPct));
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onOpenTask(t.id)}
                className="w-full grid grid-cols-12 items-center gap-3 p-2.5 rounded-lg bg-[#0B0D0F] border border-[#252A31] hover:border-[#D4AF77]/40 text-left cursor-pointer"
              >
                <div className="col-span-4 min-w-0">
                  <div className="text-xs font-medium text-[#F2F2F0] truncate">
                    {t.title}
                  </div>
                  <div className="text-[10px] font-mono text-[#6D7480]">
                    {t.dueDate ? formatShortDate(t.dueDate) : t.dueDateLabel}
                    {t.dependencyTaskIds.length > 0 &&
                      ` · ${t.dependencyTaskIds.length} deps`}
                  </div>
                </div>
                <div className="col-span-8 relative h-5 rounded bg-[#111419] border border-[#1E222A]">
                  <div
                    className={cn(
                      "absolute top-1 h-3 rounded-full",
                      t.workflowStatus === "done"
                        ? "bg-[#56C88A]/80"
                        : t.workflowStatus === "in_review"
                        ? "bg-[#C58AF9]/80"
                        : "bg-[#7BA8DF]/80"
                    )}
                    style={{
                      left: `${barLeft}%`,
                      width: `${Math.min(100 - barLeft, barWidth)}%`,
                    }}
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
