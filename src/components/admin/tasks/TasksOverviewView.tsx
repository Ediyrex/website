"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit3,
  Eye,
  Filter,
  FolderKanban,
  Kanban,
  Layers,
  LayoutGrid,
  List,
  ListChecks,
  Mail,
  MoreHorizontal,
  PlayCircle,
  Plus,
  Search,
  Trash2,
  Upload,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "../AdminContext";

export interface TaskItem {
  id: string;
  taskCode: string;
  title: string;
  description: string;
  type: "project" | "studio";
  pmsProjectId: string | null;
  projectTitle: string | null;
  projectRef: string | null;
  assigneeUserId: string | null;
  assigneeName: string;
  assigneeEmail?: string | null;
  assigneeAvatar?: string | null;
  status: "todo" | "in_progress" | "in_review" | "blocked" | "completed";
  priority: "low" | "normal" | "high" | "urgent";
  dueDate: string | null;
  dueDateLabel: string | null;
  isOverdue: boolean;
  completed: boolean;
  subtaskCount: number;
  completedSubtaskCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface TaskDetailPayload extends TaskItem {
  subtasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    position: number;
  }>;
  comments: Array<{
    id: string;
    body: string;
    authorName: string | null;
    authorAvatar: string | null;
    createdAt: string;
  }>;
  activity: Array<{
    id: string;
    action: string;
    summary: string;
    createdAt: string;
  }>;
}

interface ProjectOption {
  id: string;
  title: string;
  referenceCode: string | null;
}

interface AssigneeOption {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
}

function getInitials(name: string): string {
  if (!name || name === "Unassigned") return "UA";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function TasksOverviewView() {
  const { user, canEdit } = useAdminUser();
  const isAdmin = user.roles.includes("admin");

  // View & Filter states
  const [activeTab, setActiveTab] = useState<
    "my-tasks" | "all" | "project" | "studio" | "completed"
  >("my-tasks");
  const [viewMode, setViewMode] = useState<"list" | "kanban" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [projectFilter, setProjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // Data states
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [kpis, setKpis] = useState({
    total: 0,
    myTasks: 0,
    inProgress: 0,
    overdue: 0,
    completed: 0,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [assignees, setAssignees] = useState<AssigneeOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Modals & Drawer
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createInitialStatus, setCreateInitialStatus] = useState<
    "todo" | "in_progress" | "in_review" | "blocked" | "completed"
  >("todo");
  const [showImportModal, setShowImportModal] = useState(false);
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<TaskDetailPayload | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Calendar state
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  // Load Tasks
  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        tab: activeTab,
        projectId: projectFilter,
        status: statusFilter,
        priority: priorityFilter,
        assigneeId: assigneeFilter,
        q: searchQuery,
        page: String(page),
        limit: String(limit),
      });

      const res = await fetch(`/api/v1/admin/tasks?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        setTasks(json.data.tasks || []);
        setKpis(json.data.kpis || { total: 0, myTasks: 0, inProgress: 0, overdue: 0, completed: 0 });
        setPagination(json.data.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
        setProjects(json.data.projects || []);
        setAssignees(json.data.assignees || []);
      }
    } catch {
      // quiet
    } finally {
      setLoading(false);
    }
  }, [activeTab, projectFilter, statusFilter, priorityFilter, assigneeFilter, searchQuery, page, limit]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Load Task Detail
  const openDetail = async (id: string) => {
    setDetailTaskId(id);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/v1/admin/tasks/${id}`);
      if (res.ok) {
        const json = await res.json();
        setDetailData(json.data);
      }
    } catch {
      // quiet
    } finally {
      setLoadingDetail(false);
    }
  };

  const closeDetail = () => {
    setDetailTaskId(null);
    setDetailData(null);
  };

  // Status update
  const handleUpdateStatus = async (
    id: string,
    nextStatus: "todo" | "in_progress" | "in_review" | "blocked" | "completed"
  ) => {
    try {
      const res = await fetch(`/api/v1/admin/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok) {
        if (detailTaskId === id) {
          await openDetail(id);
        }
        await loadTasks();
      }
    } catch {
      // quiet
    }
  };

  // Priority update
  const handleUpdatePriority = async (
    id: string,
    nextPriority: "low" | "normal" | "high" | "urgent"
  ) => {
    try {
      const res = await fetch(`/api/v1/admin/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: nextPriority }),
      });
      if (res.ok) {
        if (detailTaskId === id) {
          await openDetail(id);
        }
        await loadTasks();
      }
    } catch {
      // quiet
    }
  };

  // Delete task
  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      const res = await fetch(`/api/v1/admin/tasks/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        if (detailTaskId === id) closeDetail();
        await loadTasks();
      }
    } catch {
      // quiet
    }
  };

  // Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === tasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tasks.map((t) => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Kanban Columns
  const kanbanColumns = useMemo(() => {
    return [
      {
        id: "todo",
        label: "To Do",
        tasks: tasks.filter((t) => t.status === "todo"),
      },
      {
        id: "in_progress",
        label: "In Progress",
        tasks: tasks.filter((t) => t.status === "in_progress"),
      },
      {
        id: "in_review",
        label: "In Review",
        tasks: tasks.filter((t) => t.status === "in_review"),
      },
      {
        id: "blocked",
        label: "Blocked",
        tasks: tasks.filter((t) => t.status === "blocked"),
      },
      {
        id: "completed",
        label: "Completed",
        tasks: tasks.filter((t) => t.status === "completed"),
      },
    ] as const;
  }, [tasks]);

  // Calendar dates calculation
  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{
      date: Date;
      isCurrentMonth: boolean;
      dayNumber: number;
      tasks: TaskItem[];
    }> = [];

    // Prev month days
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date: d,
        isCurrentMonth: false,
        dayNumber: prevMonthDays - i,
        tasks: [],
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i);
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(i).padStart(2, "0")}`;
      const dayTasks = tasks.filter((t) => {
        if (!t.dueDate) return false;
        return t.dueDate.startsWith(dateString);
      });
      days.push({
        date: d,
        isCurrentMonth: true,
        dayNumber: i,
        tasks: dayTasks,
      });
    }

    // Next month days to fill 35 or 42 cells
    const remaining = 35 - days.length > 0 ? 35 - days.length : 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        isCurrentMonth: false,
        dayNumber: i,
        tasks: [],
      });
    }

    return days;
  }, [calendarMonth, tasks]);

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#F5F2EC] tracking-tight">
            Tasks
          </h1>
          <p className="text-xs text-[#898D94] mt-1">
            Manage and track all work across projects and studio operations.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs font-medium text-[#F5F2EC] hover:border-[#363B43] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#898D94]" />
            <span>Import Tasks</span>
          </button>

          {canEdit && (
            <button
              type="button"
              onClick={() => {
                setCreateInitialStatus("todo");
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D9B875] hover:bg-[#c4a460] text-[#090A0C] text-xs font-bold shadow-[0_2px_12px_rgba(217,184,117,0.2)] transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Task</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. 5 KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Total Tasks */}
        <div
          onClick={() => {
            setActiveTab("all");
            setStatusFilter("all");
            setPage(1);
          }}
          className="group p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#D9B875]/50 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-[#D9B875]/10 border border-[#D9B875]/30 text-[#D9B875] flex items-center justify-center shrink-0">
            <ListChecks className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#B8B9BC]">Total Tasks</div>
            <div className="font-heading font-bold text-3xl text-[#F5F2EC] tracking-tight my-0.5">
              {kpis.total}
            </div>
            <div className="text-[11px] text-[#898D94] truncate">Across all projects</div>
          </div>
        </div>

        {/* My Tasks */}
        <div
          onClick={() => {
            setActiveTab("my-tasks");
            setStatusFilter("all");
            setPage(1);
          }}
          className="group p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#56C58B]/50 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-[#56C58B]/10 border border-[#56C58B]/30 text-[#56C58B] flex items-center justify-center shrink-0">
            <UserCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#B8B9BC]">My Tasks</div>
            <div className="font-heading font-bold text-3xl text-[#F5F2EC] tracking-tight my-0.5">
              {kpis.myTasks}
            </div>
            <div className="text-[11px] text-[#898D94] truncate">Assigned to me</div>
          </div>
        </div>

        {/* In Progress */}
        <div
          onClick={() => {
            setStatusFilter("in_progress");
            setPage(1);
          }}
          className="group p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#68A9FF]/50 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-[#68A9FF]/10 border border-[#68A9FF]/30 text-[#68A9FF] flex items-center justify-center shrink-0">
            <PlayCircle className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#B8B9BC]">In Progress</div>
            <div className="font-heading font-bold text-3xl text-[#F5F2EC] tracking-tight my-0.5">
              {kpis.inProgress}
            </div>
            <div className="text-[11px] text-[#898D94] truncate">Currently being worked on</div>
          </div>
        </div>

        {/* Overdue */}
        <div
          onClick={() => {
            setStatusFilter("all");
            setPage(1);
          }}
          className="group p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#F06419]/50 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-[#F06419]/10 border border-[#F06419]/30 text-[#F06419] flex items-center justify-center shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#B8B9BC]">Overdue</div>
            <div className="font-heading font-bold text-3xl text-[#F5F2EC] tracking-tight my-0.5">
              {kpis.overdue}
            </div>
            <div className="text-[11px] text-[#898D94] truncate">Past due date</div>
          </div>
        </div>

        {/* Completed */}
        <div
          onClick={() => {
            setActiveTab("completed");
            setStatusFilter("completed");
            setPage(1);
          }}
          className="group p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#A78BFA]/50 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-[#A78BFA]/10 border border-[#A78BFA]/30 text-[#A78BFA] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs font-medium text-[#B8B9BC]">Completed</div>
            <div className="font-heading font-bold text-3xl text-[#F5F2EC] tracking-tight my-0.5">
              {kpis.completed}
            </div>
            <div className="text-[11px] text-[#898D94] truncate">This period</div>
          </div>
        </div>
      </div>

      {/* 3. Task Navigation Tabs */}
      <div className="flex items-center gap-6 border-b border-[#292E35] overflow-x-auto text-xs font-medium pt-1">
        {(
          [
            { id: "my-tasks", label: "My Tasks", icon: User },
            { id: "all", label: "All Tasks", icon: List },
            { id: "project", label: "Project Tasks", icon: Layers },
            { id: "studio", label: "Studio Tasks", icon: LayoutGrid },
            { id: "completed", label: "Completed", icon: CheckCircle2 },
          ] as const
        ).map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setActiveTab(t.id);
                setPage(1);
              }}
              className={cn(
                "inline-flex items-center gap-2 pb-3.5 -mb-[1px] transition-colors cursor-pointer border-b-2 whitespace-nowrap",
                isActive
                  ? "border-[#F06419] text-[#F5F2EC]"
                  : "border-transparent text-[#898D94] hover:text-[#F5F2EC]"
              )}
            >
              <Icon
                className={cn("w-4 h-4", isActive ? "text-[#F06419]" : "text-[#898D94]")}
              />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Task Search & Filters Toolbar */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Left: Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-[#898D94] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search tasks by title, project, or assignee..."
            className="h-9 w-full pl-8 pr-3 rounded-xl bg-[#121519] border border-[#292E35] text-xs text-[#F5F2EC] placeholder:text-[#898D94] focus:outline-none focus:border-[#D9B875]"
          />
        </div>

        {/* Middle: Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => {
              setProjectFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by project"
            className="h-9 px-3 rounded-xl bg-[#121519] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875] cursor-pointer"
          >
            <option value="all">All Projects</option>
            <option value="studio">Studio Tasks (No Project)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title} {p.referenceCode ? `(${p.referenceCode})` : ""}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by status"
            className="h-9 px-3 rounded-xl bg-[#121519] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875] cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="in_review">In Review</option>
            <option value="blocked">Blocked</option>
            <option value="completed">Completed</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by priority"
            className="h-9 px-3 rounded-xl bg-[#121519] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875] cursor-pointer"
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>

          {/* Assignee Filter */}
          <select
            value={assigneeFilter}
            onChange={(e) => {
              setAssigneeFilter(e.target.value);
              setPage(1);
            }}
            aria-label="Filter by assignee"
            className="h-9 px-3 rounded-xl bg-[#121519] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875] cursor-pointer"
          >
            <option value="all">All Assignees</option>
            <option value="me">Assigned to me</option>
            <option value="unassigned">Unassigned</option>
            {assignees.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: View Mode Switcher */}
        <div className="flex items-center gap-1 bg-[#121519] border border-[#292E35] p-1 rounded-xl shrink-0">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
              viewMode === "list"
                ? "bg-[#D9B875] text-[#090A0C]"
                : "text-[#898D94] hover:text-[#F5F2EC]"
            )}
          >
            <List className="w-3.5 h-3.5" />
            <span>List</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("kanban")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
              viewMode === "kanban"
                ? "bg-[#D9B875] text-[#090A0C]"
                : "text-[#898D94] hover:text-[#F5F2EC]"
            )}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode("calendar")}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer",
              viewMode === "calendar"
                ? "bg-[#D9B875] text-[#090A0C]"
                : "text-[#898D94] hover:text-[#F5F2EC]"
            )}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
        </div>
      </div>

      {/* 5. Main Content Area */}
      {viewMode === "list" && (
        <div className="rounded-2xl bg-[#121519] border border-[#292E35] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#292E35] text-[10.5px] font-mono uppercase tracking-[0.12em] text-[#898D94] bg-[#0D0F12]/50">
                  <th className="py-3.5 pl-5 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={tasks.length > 0 && selectedIds.length === tasks.length}
                      onChange={toggleSelectAll}
                      aria-label="Select all tasks"
                      className="rounded border-[#292E35] bg-[#161A1F] accent-[#D9B875]"
                    />
                  </th>
                  <th className="py-3.5 px-3 font-normal min-w-[240px]">
                    <div className="flex items-center gap-1">
                      <span>Task</span>
                      <ArrowUpDown className="w-3 h-3 text-[#898D94]" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 font-normal min-w-[170px]">
                    <div className="flex items-center gap-1">
                      <span>Project</span>
                      <ArrowUpDown className="w-3 h-3 text-[#898D94]" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 font-normal min-w-[130px]">Assignee</th>
                  <th className="py-3.5 px-3 font-normal whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <span>Priority</span>
                      <ArrowUpDown className="w-3 h-3 text-[#898D94]" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 font-normal whitespace-nowrap min-w-[125px]">
                    <div className="flex items-center gap-1">
                      <span>Status</span>
                      <ArrowUpDown className="w-3 h-3 text-[#898D94]" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 font-normal whitespace-nowrap min-w-[120px]">
                    <div className="flex items-center gap-1">
                      <span>Due Date</span>
                      <ArrowUpDown className="w-3 h-3 text-[#898D94]" />
                    </div>
                  </th>
                  <th className="py-3.5 pl-3 pr-5 font-normal text-right w-12">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292E35]/60 text-xs">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-14 text-center text-xs font-mono text-[#898D94]">
                      Loading studio tasks...
                    </td>
                  </tr>
                ) : tasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 px-4">
                      <div className="max-w-md mx-auto text-center space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#161A1F] border border-[#292E35] flex items-center justify-center mx-auto text-[#898D94]">
                          <ListChecks className="w-6 h-6 text-[#D9B875]" />
                        </div>
                        <h3 className="font-heading font-semibold text-base text-[#F5F2EC]">
                          {pagination.total === 0 ? "No tasks created yet" : "No matching tasks"}
                        </h3>
                        <p className="text-xs text-[#898D94] leading-relaxed">
                          {pagination.total === 0
                            ? "Create internal project tasks or operational studio tasks to organize your team's deliverables."
                            : "Try clearing your search query or adjusting project, status, priority, or assignee filters."}
                        </p>
                        {pagination.total === 0 && canEdit && (
                          <button
                            type="button"
                            onClick={() => {
                              setCreateInitialStatus("todo");
                              setShowCreateModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D9B875] hover:bg-[#c4a460] text-[#090A0C] text-xs font-bold transition-colors cursor-pointer mt-2"
                          >
                            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                            <span>Create Your First Task</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  tasks.map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-[#161A1F]/70 transition-colors group"
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 pl-5 pr-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(task.id)}
                          onChange={() => toggleSelect(task.id)}
                          aria-label={`Select ${task.title}`}
                          className="rounded border-[#292E35] bg-[#161A1F] accent-[#D9B875]"
                        />
                      </td>

                      {/* Task Title & Description */}
                      <td className="py-3.5 px-3">
                        <button
                          type="button"
                          onClick={() => openDetail(task.id)}
                          className="text-left cursor-pointer group/title block"
                        >
                          <div className="text-xs font-semibold text-[#F5F2EC] group-hover/title:text-[#D9B875] transition-colors leading-snug">
                            {task.title}
                          </div>
                          {task.description && (
                            <div className="text-[11px] text-[#898D94] line-clamp-1 mt-0.5 font-normal">
                              {task.description}
                            </div>
                          )}
                        </button>
                      </td>

                      {/* Project */}
                      <td className="py-3.5 px-3">
                        {task.type === "project" ? (
                          <Link
                            href={`/admin/projects?project=${task.pmsProjectId}`}
                            className="flex items-center gap-2 group/p"
                          >
                            <FolderKanban className="w-3.5 h-3.5 text-[#D9B875] shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-[#F5F2EC] group-hover/p:text-[#D9B875] truncate transition-colors">
                                {task.projectTitle || "Project"}
                              </div>
                              <div className="text-[10px] font-mono text-[#898D94] uppercase tracking-wider">
                                {task.projectRef || "PRJ-001"}
                              </div>
                            </div>
                          </Link>
                        ) : (
                          <div className="flex items-center gap-2 text-[#898D94]">
                            <span className="text-sm">—</span>
                            <span className="text-[11px] italic">(Studio Task)</span>
                          </div>
                        )}
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#161A1F] border border-[#292E35] text-[10px] font-semibold text-[#F5F2EC] flex items-center justify-center shrink-0">
                            {getInitials(task.assigneeName)}
                          </span>
                          <span className="text-xs text-[#F5F2EC] truncate">
                            {task.assigneeName}
                          </span>
                        </div>
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              task.priority === "urgent"
                                ? "bg-[#E36B68]"
                                : task.priority === "high"
                                ? "bg-[#F06419]"
                                : task.priority === "normal"
                                ? "bg-[#D9B875]"
                                : "bg-[#898D94]"
                            )}
                          />
                          <span
                            className={cn(
                              "capitalize font-medium",
                              task.priority === "urgent"
                                ? "text-[#E36B68]"
                                : task.priority === "high"
                                ? "text-[#F06419]"
                                : task.priority === "normal"
                                ? "text-[#D9B875]"
                                : "text-[#898D94]"
                            )}
                          >
                            {task.priority === "normal" ? "Normal" : task.priority}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3 whitespace-nowrap min-w-[125px]">
                        <span
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-mono font-semibold uppercase tracking-wider border leading-none whitespace-nowrap",
                            task.status === "completed"
                              ? "bg-[#142A1E] text-[#56C58B] border-[#56C58B]/30"
                              : task.status === "in_progress"
                              ? "bg-[#132338] text-[#68A9FF] border-[#3B82F6]/30"
                              : task.status === "in_review"
                              ? "bg-[#241A33] text-[#A78BFA] border-[#A78BFA]/30"
                              : task.status === "blocked"
                              ? "bg-[#2E1618] text-[#E36B68] border-[#E36B68]/30"
                              : "bg-[#161A1F] text-[#898D94] border-[#292E35]"
                          )}
                        >
                          <span
                            className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              task.status === "completed"
                                ? "bg-[#56C58B]"
                                : task.status === "in_progress"
                                ? "bg-[#68A9FF]"
                                : task.status === "in_review"
                                ? "bg-[#A78BFA]"
                                : task.status === "blocked"
                                ? "bg-[#E36B68]"
                                : "bg-[#898D94]"
                            )}
                          />
                          <span>
                            {task.status === "in_progress"
                              ? "In Progress"
                              : task.status === "in_review"
                              ? "In Review"
                              : task.status === "todo"
                              ? "To Do"
                              : task.status}
                          </span>
                        </span>
                      </td>

                      {/* Due Date */}
                      <td className="py-3.5 px-3 whitespace-nowrap min-w-[120px]">
                        {task.dueDateLabel ? (
                          <div
                            className={cn(
                              "flex items-center gap-1.5 text-xs font-mono",
                              task.isOverdue ? "text-[#E36B68]" : "text-[#898D94]"
                            )}
                          >
                            <Calendar
                              className={cn(
                                "w-3.5 h-3.5",
                                task.isOverdue ? "text-[#E36B68]" : "text-[#898D94]"
                              )}
                            />
                            <span>{task.dueDateLabel}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-[#898D94] font-mono">—</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 pl-3 pr-5 text-right relative">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenActionId(openActionId === task.id ? null : task.id)
                          }
                          aria-label={`Actions for ${task.title}`}
                          className="p-1 rounded-lg text-[#898D94] hover:text-[#F5F2EC] hover:bg-[#161A1F] transition-colors cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {openActionId === task.id && (
                          <div className="absolute right-5 top-10 w-44 rounded-xl bg-[#161A1F] border border-[#292E35] shadow-xl py-1 z-30 text-xs">
                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionId(null);
                                openDetail(task.id);
                              }}
                              className="w-full px-3 py-1.5 text-left text-[#F5F2EC] hover:bg-[#222731] flex items-center gap-2 cursor-pointer"
                            >
                              <Eye className="w-3.5 h-3.5 text-[#898D94]" />
                              <span>View Detail</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionId(null);
                                handleUpdateStatus(
                                  task.id,
                                  task.status === "completed" ? "todo" : "completed"
                                );
                              }}
                              className="w-full px-3 py-1.5 text-left text-[#F5F2EC] hover:bg-[#222731] flex items-center gap-2 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#56C58B]" />
                              <span>
                                {task.status === "completed"
                                  ? "Mark Incomplete"
                                  : "Mark Completed"}
                              </span>
                            </button>
                            <div className="h-[1px] bg-[#292E35] my-1" />
                            <button
                              type="button"
                              onClick={() => {
                                setOpenActionId(null);
                                handleDeleteTask(task.id);
                              }}
                              className="w-full px-3 py-1.5 text-left text-[#E36B68] hover:bg-[#2A1414] flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Task</span>
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="p-4 border-t border-[#292E35] flex flex-wrap items-center justify-between gap-4 text-xs text-[#898D94]">
            <div>
              Showing {tasks.length === 0 ? "0" : `1-${tasks.length}`} of {pagination.total} tasks
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span>Rows per page</span>
                <select
                  value={limit}
                  onChange={(e) => {
                    setLimit(Number(e.target.value));
                    setPage(1);
                  }}
                  aria-label="Rows per page"
                  className="h-7 px-2 rounded-lg bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                  className="p-1 rounded-lg bg-[#161A1F] border border-[#292E35] text-[#898D94] hover:text-[#F5F2EC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 py-0.5 rounded-md bg-[#D9B875] text-[#090A0C] font-bold text-xs font-mono">
                  {page}
                </span>
                <button
                  type="button"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                  aria-label="Next page"
                  className="p-1 rounded-lg bg-[#161A1F] border border-[#292E35] text-[#898D94] hover:text-[#F5F2EC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Kanban Board View */}
      {viewMode === "kanban" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {kanbanColumns.map((col) => (
            <div
              key={col.id}
              className="rounded-2xl bg-[#121519] border border-[#292E35] p-3.5 space-y-3 min-h-[460px] flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Column Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#292E35]/60">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-semibold text-xs text-[#F5F2EC] uppercase tracking-wider">
                      {col.label}
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-[#161A1F] border border-[#292E35] text-[10px] font-mono text-[#898D94]">
                      {col.tasks.length}
                    </span>
                  </div>
                </div>

                {/* Cards */}
                <div className="space-y-2.5">
                  {col.tasks.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#898D94] italic font-mono">
                      No tasks in this stage.
                    </div>
                  ) : (
                    col.tasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={() => openDetail(task.id)}
                        className="p-3.5 rounded-xl bg-[#161A1F] border border-[#292E35] hover:border-[#D9B875]/50 transition-all cursor-pointer space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-semibold text-[#F5F2EC] group-hover:text-[#D9B875] transition-colors leading-snug">
                            {task.title}
                          </span>
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full shrink-0 mt-1",
                              task.priority === "urgent"
                                ? "bg-[#E36B68]"
                                : task.priority === "high"
                                ? "bg-[#F06419]"
                                : task.priority === "normal"
                                ? "bg-[#D9B875]"
                                : "bg-[#898D94]"
                            )}
                          />
                        </div>

                        {task.type === "project" ? (
                          <div className="text-[10.5px] text-[#D9B875] truncate flex items-center gap-1 font-medium">
                            <FolderKanban className="w-3 h-3 shrink-0" />
                            <span>{task.projectTitle}</span>
                          </div>
                        ) : (
                          <div className="text-[10.5px] text-[#898D94] italic">
                            Studio Task
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-1 text-[11px] text-[#898D94]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#121519] border border-[#292E35] text-[9px] font-bold text-[#F5F2EC] flex items-center justify-center">
                              {getInitials(task.assigneeName)}
                            </span>
                            <span className="truncate max-w-[80px]">
                              {task.assigneeName.split(" ")[0]}
                            </span>
                          </div>

                          {task.dueDateLabel && (
                            <span
                              className={cn(
                                "font-mono text-[10px]",
                                task.isOverdue ? "text-[#E36B68]" : "text-[#898D94]"
                              )}
                            >
                              {task.dueDateLabel}
                            </span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* + Add Task at column bottom */}
              {canEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setCreateInitialStatus(col.id);
                    setShowCreateModal(true);
                  }}
                  className="w-full py-2 rounded-xl bg-[#161A1F] border border-[#292E35] hover:border-[#D9B875] text-xs text-[#898D94] hover:text-[#D9B875] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Task</span>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 7. Calendar View */}
      {viewMode === "calendar" && (
        <div className="rounded-2xl bg-[#121519] border border-[#292E35] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-semibold text-lg text-[#F5F2EC]">
              {calendarMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCalendarMonth(new Date())}
                className="px-3 py-1 rounded-lg bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] hover:border-[#363B43] cursor-pointer"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() =>
                  setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))
                }
                aria-label="Previous month"
                className="p-1.5 rounded-lg bg-[#161A1F] border border-[#292E35] text-[#898D94] hover:text-[#F5F2EC] cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() =>
                  setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))
                }
                aria-label="Next month"
                className="p-1.5 rounded-lg bg-[#161A1F] border border-[#292E35] text-[#898D94] hover:text-[#F5F2EC] cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center font-mono text-[11px] uppercase tracking-wider text-[#898D94] py-1"
              >
                {day}
              </div>
            ))}

            {calendarDays.map((cell, idx) => (
              <div
                key={idx}
                className={cn(
                  "min-h-[90px] rounded-xl border p-2 flex flex-col justify-between transition-colors",
                  cell.isCurrentMonth
                    ? "bg-[#161A1F]/70 border-[#292E35]"
                    : "bg-[#0E1013]/40 border-[#1C2026] opacity-40"
                )}
              >
                <div className="text-right text-[11px] font-mono text-[#898D94]">
                  {cell.dayNumber}
                </div>

                <div className="space-y-1">
                  {cell.tasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      onClick={() => openDetail(t.id)}
                      className="px-1.5 py-0.5 rounded bg-[#121519] border border-[#292E35] hover:border-[#D9B875] text-[10px] text-[#F5F2EC] truncate cursor-pointer flex items-center gap-1"
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          t.priority === "urgent" ? "bg-[#E36B68]" : "bg-[#D9B875]"
                        )}
                      />
                      <span className="truncate">{t.title}</span>
                    </div>
                  ))}
                  {cell.tasks.length > 2 && (
                    <div className="text-[9.5px] font-mono text-[#D9B875] text-right">
                      +{cell.tasks.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. Task Detail Drawer */}
      {detailTaskId && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-xl h-full bg-[#121519] border-l border-[#292E35] shadow-2xl p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b border-[#292E35] pb-4">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-[#898D94]">
                  {detailData?.taskCode || "TSK-000"}
                </span>
                <span className="text-xs text-[#898D94]">•</span>
                <span className="text-xs text-[#D9B875] font-medium capitalize">
                  {detailData?.type === "project" ? detailData?.projectTitle : "Studio Task"}
                </span>
              </div>
              <button
                type="button"
                onClick={closeDetail}
                aria-label="Close drawer"
                className="p-1 rounded-lg text-[#898D94] hover:text-[#F5F2EC] hover:bg-[#161A1F] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {loadingDetail ? (
              <div className="py-20 text-center font-mono text-xs text-[#898D94]">
                Loading task details...
              </div>
            ) : detailData ? (
              <div className="space-y-6">
                <div>
                  <h2 className="font-heading font-bold text-xl text-[#F5F2EC]">
                    {detailData.title}
                  </h2>
                  <p className="text-xs text-[#898D94] mt-2 whitespace-pre-wrap leading-relaxed">
                    {detailData.description || "No description provided for this task."}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs">
                  <div>
                    <label className="text-[11px] text-[#898D94]">Status</label>
                    <select
                      value={detailData.status}
                      onChange={(e) =>
                        handleUpdateStatus(detailData.id, e.target.value as any)
                      }
                      className="mt-1 w-full h-8 px-2 rounded-lg bg-[#121519] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none"
                    >
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="in_review">In Review</option>
                      <option value="blocked">Blocked</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#898D94]">Priority</label>
                    <select
                      value={detailData.priority}
                      onChange={(e) =>
                        handleUpdatePriority(detailData.id, e.target.value as any)
                      }
                      className="mt-1 w-full h-8 px-2 rounded-lg bg-[#121519] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#898D94]">Assignee</label>
                    <div className="mt-1 text-xs text-[#F5F2EC] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#121519] border border-[#292E35] text-[9px] font-bold text-[#F5F2EC] flex items-center justify-center">
                        {getInitials(detailData.assigneeName)}
                      </span>
                      <span>{detailData.assigneeName}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] text-[#898D94]">Due Date</label>
                    <div className="mt-1 text-xs text-[#F5F2EC] font-mono">
                      {detailData.dueDateLabel || "No due date"}
                    </div>
                  </div>
                </div>

                {/* Subtasks Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#F5F2EC]">
                    <span>Checklist &amp; Subtasks</span>
                    <span className="text-[11px] font-mono text-[#898D94]">
                      {detailData.subtasks?.filter((s) => s.completed).length || 0}/
                      {detailData.subtasks?.length || 0}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {detailData.subtasks?.length === 0 ? (
                      <div className="text-xs text-[#898D94] italic">
                        No checklist items yet.
                      </div>
                    ) : (
                      detailData.subtasks?.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center gap-2.5 p-2 rounded-lg bg-[#161A1F] border border-[#292E35]"
                        >
                          <input
                            type="checkbox"
                            checked={sub.completed}
                            readOnly
                            className="rounded border-[#292E35] bg-[#121519] accent-[#D9B875]"
                          />
                          <span
                            className={cn(
                              "text-xs",
                              sub.completed ? "line-through text-[#898D94]" : "text-[#F5F2EC]"
                            )}
                          >
                            {sub.title}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Internal Comments & Activity */}
                <div className="space-y-2 pt-2 border-t border-[#292E35]">
                  <h3 className="text-xs font-semibold text-[#F5F2EC]">Activity &amp; Notes</h3>
                  <div className="space-y-2 max-h-48 overflow-y-auto text-xs">
                    {detailData.activity?.map((act) => (
                      <div
                        key={act.id}
                        className="p-2 rounded-lg bg-[#161A1F] text-[#898D94] text-[11.5px]"
                      >
                        <span className="text-[#F5F2EC] font-medium">{act.summary}</span>
                        <div className="text-[10px] font-mono mt-0.5">
                          {new Date(act.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-[#292E35] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(detailData.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2A1414] text-[#E36B68] text-xs font-medium hover:bg-[#381B1B] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Task</span>
                  </button>
                  <button
                    type="button"
                    onClick={closeDetail}
                    className="px-4 py-2 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs font-medium text-[#F5F2EC] hover:border-[#363B43] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 9. Create Task Modal */}
      {showCreateModal && (
        <CreateTaskModal
          projects={projects}
          assignees={assignees}
          initialStatus={createInitialStatus}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadTasks();
          }}
        />
      )}

      {/* 10. Import Tasks Modal */}
      {showImportModal && (
        <ImportTasksModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            loadTasks();
          }}
        />
      )}
    </div>
  );
}

// ----------------------------------------------------
// CREATE TASK MODAL
// ----------------------------------------------------
interface CreateTaskModalProps {
  projects: ProjectOption[];
  assignees: AssigneeOption[];
  initialStatus: "todo" | "in_progress" | "in_review" | "blocked" | "completed";
  onClose: () => void;
  onSuccess: () => void;
}

function CreateTaskModal({
  projects,
  assignees,
  initialStatus,
  onClose,
  onSuccess,
}: CreateTaskModalProps) {
  const [taskType, setTaskType] = useState<"project" | "studio">("project");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pmsProjectId, setPmsProjectId] = useState(projects[0]?.id || "");
  const [assigneeUserId, setAssigneeUserId] = useState(assignees[0]?.id || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [workflowStatus, setWorkflowStatus] = useState(initialStatus);
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg("Task title is required.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const payload: any = {
        title: title.trim(),
        description: description.trim(),
        workflowStatus,
        priority,
        pmsProjectId: taskType === "project" && pmsProjectId ? pmsProjectId : null,
        assigneeUserIds: assigneeUserId ? [assigneeUserId] : [],
        dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      };

      const res = await fetch("/api/v1/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorMsg(json.message || "Failed to create task.");
        return;
      }

      onSuccess();
    } catch {
      setErrorMsg("Network error creating task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#121519] border border-[#292E35] shadow-2xl p-6 space-y-5">
        <div className="flex items-center justify-between border-b border-[#292E35] pb-3.5">
          <h2 className="font-heading font-semibold text-base text-[#F5F2EC]">
            Create Task
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-[#898D94] hover:text-[#F5F2EC] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#2A1414] border border-[#E36B68]/30 text-xs text-[#E36B68]">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Task Type Switcher */}
          <div>
            <label className="text-xs font-medium text-[#B8B9BC] mb-1.5 block">
              Task Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-[#161A1F] border border-[#292E35]">
              <button
                type="button"
                onClick={() => setTaskType("project")}
                className={cn(
                  "py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
                  taskType === "project"
                    ? "bg-[#D9B875] text-[#090A0C]"
                    : "text-[#898D94] hover:text-[#F5F2EC]"
                )}
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Project Task</span>
              </button>
              <button
                type="button"
                onClick={() => setTaskType("studio")}
                className={cn(
                  "py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer",
                  taskType === "studio"
                    ? "bg-[#D9B875] text-[#090A0C]"
                    : "text-[#898D94] hover:text-[#F5F2EC]"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Studio Task</span>
              </button>
            </div>
          </div>

          {/* Project Dropdown if project task */}
          {taskType === "project" && (
            <div>
              <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
                Associated Project
              </label>
              <select
                value={pmsProjectId}
                onChange={(e) => setPmsProjectId(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875]"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} {p.referenceCode ? `(${p.referenceCode})` : ""}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Task Title */}
          <div>
            <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
              Task Title <span className="text-[#F06419]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finalize homepage UI and interactions"
              className="w-full h-9 px-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] placeholder:text-[#898D94] focus:outline-none focus:border-[#D9B875]"
            />
          </div>

          {/* Task Description */}
          <div>
            <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, acceptance criteria or internal notes..."
              className="w-full p-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] placeholder:text-[#898D94] focus:outline-none focus:border-[#D9B875]"
            />
          </div>

          {/* Grid: Assignee, Priority, Status, Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
                Assignee
              </label>
              <select
                value={assigneeUserId}
                onChange={(e) => setAssigneeUserId(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875]"
              >
                <option value="">Unassigned</option>
                {assignees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full h-9 px-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875]"
              >
                <option value="low">Low</option>
                <option value="medium">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
                Initial Status
              </label>
              <select
                value={workflowStatus}
                onChange={(e) => setWorkflowStatus(e.target.value as any)}
                className="w-full h-9 px-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875]"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Completed</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
                Target Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-9 px-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875]"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs font-medium text-[#F5F2EC] hover:border-[#363B43] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 rounded-xl bg-[#D9B875] hover:bg-[#c4a460] text-[#090A0C] text-xs font-bold shadow-[0_2px_12px_rgba(217,184,117,0.2)] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// IMPORT TASKS MODAL
// ----------------------------------------------------
function ImportTasksModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [fileContent, setFileContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusText, setStatusText] = useState("");

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target?.result as string);
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!fileContent.trim()) {
      setStatusText("Please select or paste a CSV file to import.");
      return;
    }

    setSubmitting(true);
    setStatusText("Processing and validating records...");

    try {
      // Parse CSV rows
      const lines = fileContent.trim().split(/\r?\n/);
      const rows = lines.slice(1); // skip header
      let createdCount = 0;

      for (const line of rows) {
        const [title, description, priority, dueDate] = line.split(",").map((s) => s?.trim());
        if (!title) continue;

        await fetch("/api/v1/admin/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description: description || "",
            priority: ["low", "medium", "high", "urgent"].includes(priority?.toLowerCase())
              ? priority.toLowerCase()
              : "medium",
            workflowStatus: "todo",
            dueDate: dueDate ? new Date(dueDate).toISOString() : null,
          }),
        });
        createdCount++;
      }

      setStatusText(`Successfully imported ${createdCount} task(s)!`);
      setTimeout(() => {
        onSuccess();
      }, 800);
    } catch {
      setStatusText("Failed to process import records.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-[#121519] border border-[#292E35] shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#292E35] pb-3">
          <h2 className="font-heading font-semibold text-base text-[#F5F2EC]">
            Import Tasks (CSV)
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-lg text-[#898D94] hover:text-[#F5F2EC] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#898D94] leading-relaxed">
          Upload a standard CSV file with headers: <br />
          <code className="text-[#D9B875] font-mono">title,description,priority,dueDate</code>
        </p>

        <div className="p-4 rounded-xl border border-dashed border-[#292E35] bg-[#161A1F] text-center space-y-2">
          <Upload className="w-6 h-6 text-[#898D94] mx-auto" />
          <div className="text-xs text-[#F5F2EC]">Choose CSV file from your device</div>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={handleFileUpload}
            className="text-xs text-[#898D94] file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:bg-[#D9B875] file:text-[#090A0C] file:font-semibold file:cursor-pointer"
          />
        </div>

        {statusText && (
          <div className="p-2.5 rounded-xl bg-[#161A1F] text-xs text-[#D9B875] font-mono">
            {statusText}
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs font-medium text-[#F5F2EC] hover:border-[#363B43] cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={submitting || !fileContent}
            onClick={handleImport}
            className="px-4 py-2 rounded-xl bg-[#D9B875] hover:bg-[#c4a460] text-[#090A0C] text-xs font-bold shadow-[0_2px_12px_rgba(217,184,117,0.2)] disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Importing..." : "Start Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
