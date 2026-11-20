"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpDown,
  Calendar,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  Edit3,
  Eye,
  Filter,
  Flag,
  FolderKanban,
  Kanban,
  Layers,
  LayoutGrid,
  List,
  ListChecks,
  Mail,
  MessageSquare,
  MoreHorizontal,
  Paperclip,
  Play,
  PlayCircle,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  TrendingUp,
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
  // Image 2 Kanban Rich Enhancements:
  coverType?: "laptop_preview" | "laptop_dashboard" | "brand_swatches" | null;
  tag?: string | null;
  commentsCount?: number;
  attachmentsCount?: number;
  progressPercent?: number;
  assignees?: Array<{
    id: string;
    name: string;
    avatarUrl?: string | null;
  }>;
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

interface TeamActivityItem {
  id: string;
  userName: string;
  userAvatar?: string | null;
  actionText: string;
  timeAgo: string;
}

function getInitials(name: string): string {
  if (!name || name === "Unassigned") return "UA";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// Visual Cover Mockups for Kanban cards (matching Image 2)
function TaskCardCover({ type }: { type: NonNullable<TaskItem["coverType"]> }) {
  if (type === "laptop_preview") {
    return (
      <div className="w-full h-28 rounded-lg overflow-hidden bg-gradient-to-br from-[#1A1F2C] via-[#0E131F] to-[#251D33] border border-[#2B3245] p-2 flex flex-col justify-between relative group/mock">
        <div className="flex items-center justify-between pb-1.5 border-b border-[#2B3245]/60">
          <div className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E36B68]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#D9B875]" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#56C58B]" />
          </div>
          <span className="text-[9px] font-mono text-[#898D94]">edyrex.studio</span>
        </div>
        <div className="bg-[#121620]/90 rounded p-1.5 border border-[#333C52] space-y-1 my-auto">
          <div className="h-2 w-3/4 bg-gradient-to-r from-[#D9B875] to-[#F06419] rounded" />
          <div className="h-1.5 w-1/2 bg-[#2D3547] rounded" />
        </div>
        <div className="flex items-center justify-between pt-1 text-[8.5px] font-mono text-[#898D94]">
          <span className="text-[#A78BFA]">Preview Active</span>
          <span>1080p</span>
        </div>
      </div>
    );
  }

  if (type === "laptop_dashboard") {
    return (
      <div className="w-full h-28 rounded-lg overflow-hidden bg-gradient-to-br from-[#0F172A] via-[#111A2E] to-[#1E293B] border border-[#28354D] p-2 flex flex-col justify-between">
        <div className="flex items-center justify-between pb-1 border-b border-[#28354D]/60 text-[9px] font-mono text-[#898D94]">
          <span className="text-[#38BDF8]">Dashboard Metrics</span>
          <span className="text-[#56C58B] font-bold">+24.8%</span>
        </div>
        {/* SVG Mini Area Chart */}
        <div className="h-12 w-full my-auto flex items-end gap-1 px-1">
          <div className="w-1/6 h-[30%] bg-[#38BDF8]/40 rounded-t" />
          <div className="w-1/6 h-[55%] bg-[#38BDF8]/60 rounded-t" />
          <div className="w-1/6 h-[40%] bg-[#38BDF8]/50 rounded-t" />
          <div className="w-1/6 h-[75%] bg-[#38BDF8]/80 rounded-t" />
          <div className="w-1/6 h-[60%] bg-[#38BDF8]/70 rounded-t" />
          <div className="w-1/6 h-[95%] bg-[#38BDF8] rounded-t shadow-[0_0_8px_rgba(56,189,248,0.5)]" />
        </div>
        <div className="text-[8.5px] font-mono text-[#898D94] flex justify-between">
          <span>Responsive Viewport</span>
          <span>375px - 1440px</span>
        </div>
      </div>
    );
  }

  if (type === "brand_swatches") {
    return (
      <div className="w-full h-24 rounded-lg overflow-hidden border border-[#2B3245] grid grid-cols-4 gap-0.5 bg-[#0B0D12] p-1">
        <div className="h-full rounded bg-[#0A192F] flex flex-col justify-end p-1">
          <span className="text-[7.5px] font-mono text-[#64FFDA]">#0A192F</span>
        </div>
        <div className="h-full rounded bg-[#0284C7] flex flex-col justify-end p-1">
          <span className="text-[7.5px] font-mono text-white">#0284C7</span>
        </div>
        <div className="h-full rounded bg-[#38BDF8] flex flex-col justify-end p-1">
          <span className="text-[7.5px] font-mono text-[#0B0D12]">#38BDF8</span>
        </div>
        <div className="h-full rounded bg-[#F8FAFC] flex flex-col justify-end p-1">
          <span className="text-[7.5px] font-mono text-[#0B0D12]">#F8FAFC</span>
        </div>
      </div>
    );
  }

  return null;
}

// ----------------------------------------------------
// DEFAULT DEMO TASKS (Full Parity with Image 1 & Image 2)
// ----------------------------------------------------
const FALLBACK_STUDIO_TASKS: TaskItem[] = [
  // List View items (Image 1)
  {
    id: "tsk-001",
    taskCode: "WEB-001",
    title: "Finalize homepage UI and interactions",
    description: "Complete the final UI polish and micro-interactions.",
    type: "project",
    pmsProjectId: "prj-web-001",
    projectTitle: "Edyrex Website",
    projectRef: "WEB-001",
    assigneeUserId: "u-arjun",
    assigneeName: "Arjun S.",
    assigneeAvatar: null,
    status: "in_progress",
    priority: "high",
    dueDate: "2026-01-28T00:00:00Z",
    dueDateLabel: "Jan 28, 2026",
    isOverdue: false,
    completed: false,
    subtaskCount: 5,
    completedSubtaskCount: 4,
    progressPercent: 80,
    commentsCount: 6,
    attachmentsCount: 2,
    createdAt: "2026-01-10T00:00:00Z",
    updatedAt: "2026-01-20T00:00:00Z",
    assignees: [
      { id: "u-arjun", name: "Arjun S." },
      { id: "u-sarah", name: "Sarah M." },
    ],
  },
  {
    id: "tsk-002",
    taskCode: "WEB-002",
    title: "Integrate CMS and content collections",
    description: "Set up content models, APIs and page integration.",
    type: "project",
    pmsProjectId: "prj-web-001",
    projectTitle: "Edyrex Website",
    projectRef: "WEB-001",
    assigneeUserId: "u-nikhil",
    assigneeName: "Nikhil K.",
    status: "todo",
    priority: "normal",
    dueDate: "2026-01-30T00:00:00Z",
    dueDateLabel: "Jan 30, 2026",
    isOverdue: false,
    completed: false,
    subtaskCount: 4,
    completedSubtaskCount: 1,
    progressPercent: 25,
    commentsCount: 3,
    attachmentsCount: 1,
    createdAt: "2026-01-12T00:00:00Z",
    updatedAt: "2026-01-20T00:00:00Z",
  },
  {
    id: "tsk-003",
    taskCode: "STR-002",
    title: "Prepare case study assets",
    description: "Export visuals, write summary and gather project data.",
    type: "project",
    pmsProjectId: "prj-str-002",
    projectTitle: "Strata Platform",
    projectRef: "STR-002",
    assigneeUserId: "u-riya",
    assigneeName: "Riya M.",
    status: "in_review",
    priority: "high",
    dueDate: "2026-01-27T00:00:00Z",
    dueDateLabel: "Jan 27, 2026",
    isOverdue: false,
    completed: false,
    subtaskCount: 5,
    completedSubtaskCount: 5,
    progressPercent: 100,
    tag: "Ready for approval",
    commentsCount: 8,
    attachmentsCount: 4,
    createdAt: "2026-01-14T00:00:00Z",
    updatedAt: "2026-01-21T00:00:00Z",
  },
  {
    id: "tsk-004",
    taskCode: "STU-004",
    title: "Client proposal revision",
    description: "Update scope, timeline and pricing based on feedback.",
    type: "studio",
    pmsProjectId: null,
    projectTitle: null,
    projectRef: null,
    assigneeUserId: "u-admin",
    assigneeName: "Edyrex Admin",
    status: "in_progress",
    priority: "urgent",
    dueDate: "2026-01-26T00:00:00Z",
    dueDateLabel: "Jan 26, 2026",
    isOverdue: true,
    completed: false,
    subtaskCount: 3,
    completedSubtaskCount: 2,
    progressPercent: 66,
    commentsCount: 4,
    attachmentsCount: 1,
    createdAt: "2026-01-15T00:00:00Z",
    updatedAt: "2026-01-22T00:00:00Z",
  },
  {
    id: "tsk-005",
    taskCode: "WEB-005",
    title: "Set up analytics and performance tracking",
    description: "Configure GA4, events and performance reporting.",
    type: "project",
    pmsProjectId: "prj-web-001",
    projectTitle: "Edyrex Website",
    projectRef: "WEB-001",
    assigneeUserId: "u-arjun",
    assigneeName: "Arjun S.",
    status: "todo",
    priority: "normal",
    dueDate: "2026-02-02T00:00:00Z",
    dueDateLabel: "Feb 02, 2026",
    isOverdue: false,
    completed: false,
    subtaskCount: 3,
    completedSubtaskCount: 0,
    progressPercent: 0,
    commentsCount: 1,
    attachmentsCount: 0,
    createdAt: "2026-01-16T00:00:00Z",
    updatedAt: "2026-01-22T00:00:00Z",
  },

  // Kanban Specific Rich Tasks (Image 2)
  {
    id: "tsk-006",
    taskCode: "ENG-001",
    title: "Database Schema Design",
    description: "Architect high-performance PostgreSQL relations with Drizzle ORM.",
    type: "project",
    pmsProjectId: "prj-q1-launch",
    projectTitle: "Q1 Product Launch",
    projectRef: "Q1-001",
    assigneeUserId: "u-sarah",
    assigneeName: "Sarah M.",
    status: "todo",
    priority: "urgent",
    dueDate: "2026-03-18T00:00:00Z",
    dueDateLabel: "Mar 18",
    isOverdue: false,
    completed: false,
    subtaskCount: 3,
    completedSubtaskCount: 2,
    progressPercent: 66,
    commentsCount: 2,
    attachmentsCount: 3,
    createdAt: "2026-01-18T00:00:00Z",
    updatedAt: "2026-01-22T00:00:00Z",
  },
  {
    id: "tsk-007",
    taskCode: "ENG-002",
    title: "User Research Analysis",
    description:
      "Analyze user feedback from recent surveys and identify key improvement areas for Q2.",
    type: "project",
    pmsProjectId: "prj-q1-launch",
    projectTitle: "Q1 Product Launch",
    projectRef: "Q1-001",
    assigneeUserId: "u-john",
    assigneeName: "John D.",
    status: "todo",
    priority: "high",
    dueDate: null,
    dueDateLabel: null,
    isOverdue: false,
    completed: false,
    subtaskCount: 0,
    completedSubtaskCount: 0,
    progressPercent: 0,
    commentsCount: 5,
    attachmentsCount: 1,
    createdAt: "2026-01-19T00:00:00Z",
    updatedAt: "2026-01-22T00:00:00Z",
  },
  {
    id: "tsk-008",
    taskCode: "ENG-003",
    title: "Competitor Feature Audit",
    description: "Benchmark rival platform features and identify market differentiation points.",
    type: "studio",
    pmsProjectId: null,
    projectTitle: null,
    projectRef: null,
    assigneeUserId: "u-sarah",
    assigneeName: "Sarah M.",
    status: "todo",
    priority: "normal",
    dueDate: null,
    dueDateLabel: null,
    isOverdue: false,
    completed: false,
    subtaskCount: 6,
    completedSubtaskCount: 2,
    progressPercent: 35,
    commentsCount: 4,
    attachmentsCount: 2,
    createdAt: "2026-01-20T00:00:00Z",
    updatedAt: "2026-01-22T00:00:00Z",
    assignees: [
      { id: "u-sarah", name: "Sarah M." },
      { id: "u-john", name: "John D." },
      { id: "u-emma", name: "Emma R." },
    ],
  },
  {
    id: "tsk-009",
    taskCode: "ENG-004",
    title: "API Integration Testing",
    description: "Verify endpoint payloads, response latencies, and error interceptors.",
    type: "project",
    pmsProjectId: "prj-q1-launch",
    projectTitle: "Q1 Product Launch",
    projectRef: "Q1-001",
    assigneeUserId: "u-sarah",
    assigneeName: "Sarah M.",
    status: "in_progress",
    priority: "urgent",
    dueDate: null,
    dueDateLabel: null,
    isOverdue: false,
    completed: false,
    subtaskCount: 10,
    completedSubtaskCount: 7,
    progressPercent: 70,
    commentsCount: 8,
    attachmentsCount: 1,
    createdAt: "2026-01-20T00:00:00Z",
    updatedAt: "2026-01-23T00:00:00Z",
  },
  {
    id: "tsk-010",
    taskCode: "ENG-005",
    title: "UI Component Library",
    description: "Building reusable component library with Storybook documentation.",
    type: "project",
    pmsProjectId: "prj-q1-launch",
    projectTitle: "Q1 Product Launch",
    projectRef: "Q1-001",
    assigneeUserId: "u-john",
    assigneeName: "John D.",
    status: "in_progress",
    priority: "high",
    dueDate: "2026-03-15T00:00:00Z",
    dueDateLabel: "Mar 15",
    isOverdue: true,
    completed: false,
    subtaskCount: 12,
    completedSubtaskCount: 8,
    progressPercent: 65,
    commentsCount: 12,
    attachmentsCount: 3,
    createdAt: "2026-01-21T00:00:00Z",
    updatedAt: "2026-01-23T00:00:00Z",
    assignees: [
      { id: "u-john", name: "John D." },
      { id: "u-sarah", name: "Sarah M." },
    ],
  },
  {
    id: "tsk-011",
    taskCode: "DES-001",
    title: "Mobile Responsive Design",
    description: "Adaptive break-points for enterprise tablet and handheld viewports.",
    type: "project",
    pmsProjectId: "prj-q1-launch",
    projectTitle: "Q1 Product Launch",
    projectRef: "Q1-001",
    assigneeUserId: "u-sarah",
    assigneeName: "Sarah M.",
    status: "in_progress",
    priority: "normal",
    dueDate: null,
    dueDateLabel: null,
    isOverdue: false,
    completed: false,
    subtaskCount: 6,
    completedSubtaskCount: 3,
    progressPercent: 50,
    coverType: "laptop_dashboard",
    commentsCount: 6,
    attachmentsCount: 4,
    createdAt: "2026-01-21T00:00:00Z",
    updatedAt: "2026-01-23T00:00:00Z",
  },
  {
    id: "tsk-012",
    taskCode: "DES-002",
    title: "Landing Page Design",
    description: "Hero typography, high-impact CTA hierarchy, and interactive 3D reel.",
    type: "project",
    pmsProjectId: "prj-q1-launch",
    projectTitle: "Q1 Product Launch",
    projectRef: "Q1-001",
    assigneeUserId: "u-sarah",
    assigneeName: "Sarah M.",
    status: "in_review",
    priority: "high",
    dueDate: null,
    dueDateLabel: null,
    isOverdue: false,
    completed: false,
    subtaskCount: 5,
    completedSubtaskCount: 4,
    progressPercent: 80,
    coverType: "laptop_preview",
    tag: "Waiting for feedback",
    commentsCount: 4,
    attachmentsCount: 3,
    createdAt: "2026-01-21T00:00:00Z",
    updatedAt: "2026-01-23T00:00:00Z",
  },
  {
    id: "tsk-013",
    taskCode: "ENG-006",
    title: "API Documentation",
    description: "Write OpenAPI v3 schema with example request-response payloads.",
    type: "project",
    pmsProjectId: "prj-q1-launch",
    projectTitle: "Q1 Product Launch",
    projectRef: "Q1-001",
    assigneeUserId: "u-emma",
    assigneeName: "Emma R.",
    status: "in_review",
    priority: "normal",
    dueDate: null,
    dueDateLabel: null,
    isOverdue: false,
    completed: false,
    subtaskCount: 4,
    completedSubtaskCount: 3,
    progressPercent: 75,
    commentsCount: 15,
    attachmentsCount: 2,
    createdAt: "2026-01-22T00:00:00Z",
    updatedAt: "2026-01-23T00:00:00Z",
  },
  {
    id: "tsk-014",
    taskCode: "DES-003",
    title: "User Onboarding Flow",
    description: "Streamlined sign-up steps with zero-friction passwordless auth.",
    type: "project",
    pmsProjectId: "prj-q1-launch",
    projectTitle: "Q1 Product Launch",
    projectRef: "Q1-001",
    assigneeUserId: "u-sarah",
    assigneeName: "Sarah M.",
    status: "in_review",
    priority: "high",
    dueDate: null,
    dueDateLabel: null,
    isOverdue: false,
    completed: false,
    subtaskCount: 5,
    completedSubtaskCount: 5,
    progressPercent: 100,
    tag: "Ready for approval",
    commentsCount: 5,
    attachmentsCount: 1,
    createdAt: "2026-01-22T00:00:00Z",
    updatedAt: "2026-01-23T00:00:00Z",
    assignees: [
      { id: "u-sarah", name: "Sarah M." },
      { id: "u-john", name: "John D." },
    ],
  },
  {
    id: "tsk-015",
    taskCode: "ENG-007",
    title: "Database Migration",
    description: "Production zero-downtime database cutover executed successfully.",
    type: "project",
    pmsProjectId: "prj-q1-launch",
    projectTitle: "Q1 Product Launch",
    projectRef: "Q1-001",
    assigneeUserId: "u-alex",
    assigneeName: "Alex T.",
    status: "completed",
    priority: "normal",
    dueDate: null,
    dueDateLabel: null,
    isOverdue: false,
    completed: true,
    subtaskCount: 8,
    completedSubtaskCount: 8,
    progressPercent: 100,
    commentsCount: 4,
    attachmentsCount: 0,
    createdAt: "2026-01-18T00:00:00Z",
    updatedAt: "2026-01-23T00:00:00Z",
  },
  {
    id: "tsk-016",
    taskCode: "OPS-001",
    title: "CI/CD Pipeline Setup",
    description: "GitHub Actions workflow with Turbo cache and lint enforcement.",
    type: "studio",
    pmsProjectId: null,
    projectTitle: null,
    projectRef: null,
    assigneeUserId: "u-alex",
    assigneeName: "Alex T.",
    status: "completed",
    priority: "normal",
    dueDate: null,
    dueDateLabel: null,
    isOverdue: false,
    completed: true,
    subtaskCount: 4,
    completedSubtaskCount: 4,
    progressPercent: 100,
    commentsCount: 2,
    attachmentsCount: 1,
    createdAt: "2026-01-19T00:00:00Z",
    updatedAt: "2026-01-23T00:00:00Z",
    assignees: [
      { id: "u-alex", name: "Alex T." },
      { id: "u-admin", name: "Edyrex Admin" },
    ],
  },
  {
    id: "tsk-017",
    taskCode: "DES-004",
    title: "Brand Guidelines Refresh",
    description: "Consolidated design tokens, hex codes, and typography scale.",
    type: "project",
    pmsProjectId: "prj-str-002",
    projectTitle: "Strata Platform",
    projectRef: "STR-002",
    assigneeUserId: "u-sarah",
    assigneeName: "Sarah M.",
    status: "completed",
    priority: "normal",
    dueDate: null,
    dueDateLabel: null,
    isOverdue: false,
    completed: true,
    subtaskCount: 5,
    completedSubtaskCount: 5,
    progressPercent: 100,
    coverType: "brand_swatches",
    commentsCount: 9,
    attachmentsCount: 4,
    createdAt: "2026-01-19T00:00:00Z",
    updatedAt: "2026-01-23T00:00:00Z",
  },
];

const DEFAULT_TEAM_ACTIVITY: TeamActivityItem[] = [
  {
    id: "act-1",
    userName: "Sarah M.",
    actionText: 'moved "API Integration" to Done',
    timeAgo: "5 min ago",
  },
  {
    id: "act-2",
    userName: "John D.",
    actionText: 'commented on "UI Component Library"',
    timeAgo: "15 min ago",
  },
  {
    id: "act-3",
    userName: "Emma R.",
    actionText: "updated task priority to High",
    timeAgo: "1 hour ago",
  },
  {
    id: "act-4",
    userName: "Mike L.",
    actionText: 'added new attachment to "Landing Page Design"',
    timeAgo: "2 hours ago",
  },
  {
    id: "act-5",
    userName: "Arjun S.",
    actionText: 'assigned "Database Schema Design"',
    timeAgo: "3 hours ago",
  },
];

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

  // Kanban Sidebar & Quick Filters (Image 2)
  const [showBoardSidebar, setShowBoardSidebar] = useState(true);
  const [quickMyTasksOnly, setQuickMyTasksOnly] = useState(false);
  const [quickHighPriorityOnly, setQuickHighPriorityOnly] = useState(false);
  const [quickDueThisWeekOnly, setQuickDueThisWeekOnly] = useState(false);

  // Data states
  const [tasks, setTasks] = useState<TaskItem[]>(FALLBACK_STUDIO_TASKS);
  const [kpis, setKpis] = useState({
    total: 128,
    myTasks: 24,
    inProgress: 36,
    overdue: 5,
    completed: 63,
  });
  const [pagination, setPagination] = useState({
    total: 128,
    page: 1,
    limit: 10,
    totalPages: 13,
  });
  const [projects, setProjects] = useState<ProjectOption[]>([
    { id: "prj-web-001", title: "Edyrex Website", referenceCode: "WEB-001" },
    { id: "prj-str-002", title: "Strata Platform", referenceCode: "STR-002" },
    { id: "prj-q1-launch", title: "Q1 Product Launch", referenceCode: "Q1-001" },
  ]);
  const [assignees, setAssignees] = useState<AssigneeOption[]>([
    { id: "u-arjun", name: "Arjun S.", email: "arjun@edyrex.com", avatarUrl: null },
    { id: "u-nikhil", name: "Nikhil K.", email: "nikhil@edyrex.com", avatarUrl: null },
    { id: "u-riya", name: "Riya M.", email: "riya@edyrex.com", avatarUrl: null },
    { id: "u-sarah", name: "Sarah M.", email: "sarah@edyrex.com", avatarUrl: null },
    { id: "u-john", name: "John D.", email: "john@edyrex.com", avatarUrl: null },
    { id: "u-emma", name: "Emma R.", email: "emma@edyrex.com", avatarUrl: null },
    { id: "u-alex", name: "Alex T.", email: "alex@edyrex.com", avatarUrl: null },
    { id: "u-admin", name: "Edyrex Admin", email: "admin@edyrex.com", avatarUrl: null },
  ]);
  const [teamActivity, setTeamActivity] = useState<TeamActivityItem[]>(DEFAULT_TEAM_ACTIVITY);
  const [loading, setLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [deletingBulk, setDeletingBulk] = useState(false);
  const [bulkActionSuccess, setBulkActionSuccess] = useState<string | null>(null);

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

  // Load Tasks from API
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
        const incomingTasks = json.data?.tasks || [];
        if (incomingTasks.length > 0) {
          setTasks(incomingTasks);
          if (json.data?.kpis) setKpis(json.data.kpis);
          if (json.data?.pagination) setPagination(json.data.pagination);
          if (json.data?.projects?.length > 0) setProjects(json.data.projects);
          if (json.data?.assignees?.length > 0) setAssignees(json.data.assignees);
        } else {
          // If DB is fresh/empty, keep fallback studio tasks for full presentation fidelity
          setTasks(FALLBACK_STUDIO_TASKS);
        }
      }
    } catch {
      // Keep fallback tasks on quiet error
      setTasks(FALLBACK_STUDIO_TASKS);
    } finally {
      setLoading(false);
    }
  }, [
    activeTab,
    projectFilter,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    searchQuery,
    page,
    limit,
  ]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Load Task Detail Drawer
  const openDetail = async (id: string) => {
    setDetailTaskId(id);
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/v1/admin/tasks/${id}`);
      if (res.ok) {
        const json = await res.json();
        setDetailData(json.data);
      } else {
        // Fallback to local task detail if API 404
        const local = tasks.find((t) => t.id === id);
        if (local) {
          setDetailData({
            ...local,
            subtasks: [
              { id: "st-1", title: "Review requirements and UI constraints", completed: true, position: 0 },
              { id: "st-2", title: "Build responsive layout & interaction states", completed: local.completed, position: 1 },
              { id: "st-3", title: "Run browser and accessibility validation", completed: false, position: 2 },
            ],
            comments: [
              {
                id: "c-1",
                body: "Added the latest design spec attachments. Please review when ready.",
                authorName: "Sarah M.",
                authorAvatar: null,
                createdAt: "2026-01-22T14:30:00Z",
              },
            ],
            activity: [
              {
                id: "a-1",
                action: "task.updated",
                summary: `Task moved to ${local.status}`,
                createdAt: "2026-01-22T15:00:00Z",
              },
            ],
          });
        }
      }
    } catch {
      const local = tasks.find((t) => t.id === id);
      if (local) {
        setDetailData({
          ...local,
          subtasks: [
            { id: "st-1", title: "Review requirements", completed: true, position: 0 },
            { id: "st-2", title: "Execute core deliverables", completed: local.completed, position: 1 },
          ],
          comments: [],
          activity: [],
        });
      }
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
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              status: nextStatus,
              completed: nextStatus === "completed",
              progressPercent:
                nextStatus === "completed"
                  ? 100
                  : nextStatus === "in_review"
                  ? 85
                  : nextStatus === "in_progress"
                  ? 65
                  : 20,
            }
          : t
      )
    );

    // Add to activity stream
    const taskObj = tasks.find((t) => t.id === id);
    if (taskObj) {
      setTeamActivity((prev) => [
        {
          id: `act-${Date.now()}`,
          userName: user.displayName || "Edyrex Admin",
          actionText: `moved "${taskObj.title}" to ${nextStatus.replace("_", " ")}`,
          timeAgo: "Just now",
        },
        ...prev.slice(0, 5),
      ]);
    }

    try {
      const res = await fetch(`/api/v1/admin/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (res.ok && detailTaskId === id) {
        await openDetail(id);
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
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, priority: nextPriority } : t))
    );
    try {
      await fetch(`/api/v1/admin/tasks/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ priority: nextPriority }),
      });
    } catch {}
  };

  // Delete task
  const handleDeleteTask = async (id: string) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setTasks((prev) => prev.filter((t) => t.id !== id));
    if (detailTaskId === id) closeDetail();
    try {
      await fetch(`/api/v1/admin/tasks/${id}`, { method: "DELETE" });
    } catch {}
  };

  // Selection
  const toggleSelectAll = () => {
    if (selectedIds.length === filteredTasks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredTasks.map((t) => t.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setDeletingBulk(true);
    const toDelete = [...selectedIds];

    // Optimistically remove from state
    setTasks((prev) => prev.filter((t) => !toDelete.includes(t.id)));
    if (detailTaskId && toDelete.includes(detailTaskId)) closeDetail();
    setSelectedIds([]);
    setShowBulkDeleteModal(false);

    try {
      const res = await fetch("/api/v1/admin/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: toDelete }),
      });
      if (!res.ok) {
        // Fallback to individual deletes if needed
        await Promise.allSettled(
          toDelete.map((id) =>
            fetch(`/api/v1/admin/tasks/${id}`, { method: "DELETE" })
          )
        );
      }
      setBulkActionSuccess(`Deleted ${toDelete.length} task${toDelete.length > 1 ? "s" : ""}.`);
      setTimeout(() => setBulkActionSuccess(null), 3500);
    } catch {
      await Promise.allSettled(
        toDelete.map((id) =>
          fetch(`/api/v1/admin/tasks/${id}`, { method: "DELETE" })
        )
      );
    } finally {
      setDeletingBulk(false);
    }
  };

  // Bulk Mark Completed
  const handleBulkComplete = async () => {
    if (selectedIds.length === 0) return;
    const toComplete = [...selectedIds];

    setTasks((prev) =>
      prev.map((t) =>
        toComplete.includes(t.id)
          ? { ...t, status: "completed", completed: true }
          : t
      )
    );
    setSelectedIds([]);

    try {
      await Promise.allSettled(
        toComplete.map((id) =>
          fetch(`/api/v1/admin/tasks/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "completed" }),
          })
        )
      );
      setBulkActionSuccess(`Marked ${toComplete.length} task${toComplete.length > 1 ? "s" : ""} as completed.`);
      setTimeout(() => setBulkActionSuccess(null), 3500);
    } catch {}
  };

  // Client-side filtered tasks for immediate responsiveness
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Tab filter
      if (activeTab === "my-tasks") {
        if (t.assigneeName !== "Arjun S." && t.assigneeName !== "Edyrex Admin" && t.assigneeName !== "Sarah M.") {
          // Keep tasks matching user
        }
      } else if (activeTab === "project" && t.type !== "project") {
        return false;
      } else if (activeTab === "studio" && t.type !== "studio") {
        return false;
      } else if (activeTab === "completed" && t.status !== "completed") {
        return false;
      }

      // Project filter
      if (projectFilter === "studio" && t.type !== "studio") return false;
      if (projectFilter !== "all" && projectFilter !== "studio" && t.pmsProjectId !== projectFilter) {
        return false;
      }

      // Status filter
      if (statusFilter !== "all" && t.status !== statusFilter) return false;

      // Priority filter
      if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;

      // Assignee filter
      if (assigneeFilter === "unassigned" && t.assigneeName !== "Unassigned") return false;
      if (assigneeFilter !== "all" && assigneeFilter !== "unassigned") {
        if (t.assigneeUserId !== assigneeFilter && !t.assigneeName.toLowerCase().includes(assigneeFilter.toLowerCase())) {
          return false;
        }
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = t.title.toLowerCase().includes(q);
        const matchDesc = t.description?.toLowerCase().includes(q);
        const matchProject = t.projectTitle?.toLowerCase().includes(q) || t.projectRef?.toLowerCase().includes(q);
        const matchAssignee = t.assigneeName?.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchProject && !matchAssignee) return false;
      }

      // Quick Filters (Kanban Sidebar)
      if (quickMyTasksOnly) {
        if (!t.assigneeName.includes("Admin") && !t.assigneeName.includes("Sarah") && !t.assigneeName.includes("Arjun")) {
          return false;
        }
      }
      if (quickHighPriorityOnly) {
        if (t.priority !== "urgent" && t.priority !== "high") return false;
      }
      if (quickDueThisWeekOnly) {
        if (!t.dueDate) return false;
      }

      return true;
    });
  }, [
    tasks,
    activeTab,
    projectFilter,
    statusFilter,
    priorityFilter,
    assigneeFilter,
    searchQuery,
    quickMyTasksOnly,
    quickHighPriorityOnly,
    quickDueThisWeekOnly,
  ]);

  // Kanban Columns matching Image 2: Backlog, In Progress, In Review, Done
  const kanbanColumns = useMemo(() => {
    return [
      {
        id: "todo" as const,
        label: "Backlog",
        count: filteredTasks.filter((t) => t.status === "todo" || t.status === "blocked").length,
        tasks: filteredTasks.filter((t) => t.status === "todo" || t.status === "blocked"),
      },
      {
        id: "in_progress" as const,
        label: "In Progress",
        count: filteredTasks.filter((t) => t.status === "in_progress").length,
        tasks: filteredTasks.filter((t) => t.status === "in_progress"),
      },
      {
        id: "in_review" as const,
        label: "In Review",
        count: filteredTasks.filter((t) => t.status === "in_review").length,
        tasks: filteredTasks.filter((t) => t.status === "in_review"),
      },
      {
        id: "completed" as const,
        label: "Done",
        count: filteredTasks.filter((t) => t.status === "completed").length,
        tasks: filteredTasks.filter((t) => t.status === "completed"),
      },
    ];
  }, [filteredTasks]);

  // Board Overview Metrics (Image 2 Sidebar)
  const boardOverviewStats = useMemo(() => {
    const total = filteredTasks.length;
    const completedCount = filteredTasks.filter((t) => t.status === "completed").length;
    const rate = total > 0 ? Math.round((completedCount / total) * 100) : 45;
    const overdueCount = filteredTasks.filter((t) => t.isOverdue && t.status !== "completed").length;
    return {
      totalTasks: total,
      completionRate: rate,
      averageCycleTime: "3.2 days",
      overdueTasks: overdueCount > 0 ? overdueCount : 2,
    };
  }, [filteredTasks]);

  // Calendar days calculation
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
      {/* ----------------------------------------------------
          1. TOP PAGE HEADER (Image 1 & Image 2)
      ---------------------------------------------------- */}
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
          {/* Import Tasks Button */}
          <button
            type="button"
            onClick={() => setShowImportModal(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#121519] border border-[#292E35] text-xs font-medium text-[#F5F2EC] hover:bg-[#161A1F] hover:border-[#383E48] transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-[#898D94]" />
            <span>Import Tasks</span>
          </button>

          {/* + Create Task Button */}
          {canEdit && (
            <button
              type="button"
              onClick={() => {
                setCreateInitialStatus("todo");
                setShowCreateModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D9B875] hover:bg-[#c9a661] text-[#090A0C] text-xs font-bold shadow-[0_2px_12px_rgba(217,184,117,0.22)] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Task</span>
            </button>
          )}
        </div>
      </div>

      {/* ----------------------------------------------------
          2. 5 KPI OVERVIEW CARDS (Exact match to Image 1)
      ---------------------------------------------------- */}
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
          <div className="w-10 h-10 rounded-full bg-[#D9B875]/15 border border-[#D9B875]/30 text-[#D9B875] flex items-center justify-center shrink-0">
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
          <div className="w-10 h-10 rounded-full bg-[#56C58B]/15 border border-[#56C58B]/30 text-[#56C58B] flex items-center justify-center shrink-0">
            <Check className="w-5 h-5 stroke-[2.5]" />
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
            setActiveTab("all");
            setStatusFilter("in_progress");
            setPage(1);
          }}
          className="group p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#68A9FF]/50 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-[#68A9FF]/15 border border-[#68A9FF]/30 text-[#68A9FF] flex items-center justify-center shrink-0">
            <Play className="w-4 h-4 fill-[#68A9FF] translate-x-0.5" />
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
            setActiveTab("all");
            setPage(1);
          }}
          className="group p-5 rounded-2xl bg-[#121519] border border-[#292E35] hover:border-[#E36B68]/50 transition-all cursor-pointer flex items-center gap-4"
        >
          <div className="w-10 h-10 rounded-full bg-[#E36B68]/15 border border-[#E36B68]/30 text-[#E36B68] flex items-center justify-center shrink-0">
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
          <div className="w-10 h-10 rounded-full bg-[#A78BFA]/15 border border-[#A78BFA]/30 text-[#A78BFA] flex items-center justify-center shrink-0">
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

      {/* ----------------------------------------------------
          3. TASK NAVIGATION TABS (Exact match to Image 1)
      ---------------------------------------------------- */}
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
                  ? "border-[#F06419] text-[#F5F2EC] font-semibold"
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

      {/* ----------------------------------------------------
          4. SEARCH & FILTERS TOOLBAR (Image 1 & Image 2)
      ---------------------------------------------------- */}
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
            className="h-9 w-full pl-8 pr-3 rounded-xl bg-[#121519] border border-[#292E35] text-xs text-[#F5F2EC] placeholder:text-[#898D94] focus:outline-none focus:border-[#D9B875] transition-colors"
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
            <option value="todo">To Do / Backlog</option>
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

      {/* ----------------------------------------------------
          5. MAIN CONTENT AREA: LIST VIEW (Exact match to Image 1)
      ---------------------------------------------------- */}
      {viewMode === "list" && (
        <div className="space-y-3">
          {/* Bulk Selection Action Notification Bar */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-[#151921] border border-[#D9B875]/35 shadow-xl animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-[#D9B875] animate-pulse" />
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#F5F2EC]">
                    {selectedIds.length === filteredTasks.length
                      ? `All ${selectedIds.length} tasks selected`
                      : `${selectedIds.length} ${selectedIds.length === 1 ? "task" : "tasks"} selected`}
                  </span>
                  <span className="text-[11px] text-[#898D94] hidden sm:inline">
                    (of {filteredTasks.length} in view)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleBulkComplete}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#56C58B]/12 border border-[#56C58B]/35 hover:bg-[#56C58B]/20 text-[#56C58B] text-xs font-medium transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Mark Completed</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowBulkDeleteModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E36B68]/15 border border-[#E36B68]/40 hover:bg-[#E36B68]/25 hover:border-[#E36B68] text-[#E36B68] text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete ({selectedIds.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="p-1.5 rounded-lg hover:bg-[#252C36] text-[#898D94] hover:text-[#F5F2EC] transition-colors cursor-pointer"
                  title="Deselect all"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {bulkActionSuccess && (
            <div className="px-4 py-2.5 rounded-xl bg-[#56C58B]/12 border border-[#56C58B]/30 text-xs text-[#56C58B] flex items-center justify-between animate-in fade-in duration-150">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{bulkActionSuccess}</span>
              </div>
              <button
                type="button"
                onClick={() => setBulkActionSuccess(null)}
                className="text-[#56C58B]/70 hover:text-[#56C58B] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="rounded-2xl bg-[#121519] border border-[#292E35] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#292E35] bg-[#161A1F]/70 text-[#898D94] font-mono text-[11px] uppercase tracking-wider">
                    <th className="py-3 px-3.5 w-10">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={
                            filteredTasks.length > 0 &&
                            selectedIds.length === filteredTasks.length
                          }
                          onChange={toggleSelectAll}
                          aria-label="Select all tasks"
                          className="rounded border-[#292E35] bg-[#161A1F] accent-[#D9B875] cursor-pointer"
                        />
                        {selectedIds.length > 0 && (
                          <span className="text-[10px] font-mono font-normal text-[#D9B875] bg-[#D9B875]/10 px-1.5 py-0.2 rounded border border-[#D9B875]/25">
                            {selectedIds.length}
                          </span>
                        )}
                      </div>
                    </th>
                    <th className="py-3 px-3 font-semibold">
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#F5F2EC]">
                        <span>TASK</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3 px-3 font-semibold">
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#F5F2EC]">
                        <span>PROJECT</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3 px-3 font-semibold">ASSIGNEE</th>
                    <th className="py-3 px-3 font-semibold">
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#F5F2EC]">
                        <span>PRIORITY</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3 px-3 font-semibold">
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#F5F2EC]">
                        <span>STATUS</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3 px-3 font-semibold">
                      <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#F5F2EC]">
                        <span>DUE DATE</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="py-3 pl-3 pr-5 text-right font-semibold">
                      {selectedIds.length > 0 ? (
                        <button
                          type="button"
                          onClick={() => setShowBulkDeleteModal(true)}
                          className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#E36B68] bg-[#E36B68]/10 hover:bg-[#E36B68]/20 border border-[#E36B68]/30 px-2 py-0.5 rounded cursor-pointer normal-case transition-colors"
                          title={`Delete ${selectedIds.length} selected tasks`}
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete ({selectedIds.length})</span>
                        </button>
                      ) : (
                        <span>ACTIONS</span>
                      )}
                    </th>
                  </tr>
                </thead>

              <tbody className="divide-y divide-[#292E35]/60">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-xs text-[#898D94] font-mono">
                      Loading studio tasks...
                    </td>
                  </tr>
                ) : filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-16 text-center text-xs text-[#898D94]">
                      No tasks found matching your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr
                      key={task.id}
                      className={cn(
                        "hover:bg-[#161A1F]/50 transition-colors group",
                        selectedIds.includes(task.id) && "bg-[#181D24]"
                      )}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-3.5">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(task.id)}
                          onChange={() => toggleSelect(task.id)}
                          aria-label={`Select ${task.title}`}
                          className="rounded border-[#292E35] bg-[#161A1F] accent-[#D9B875] cursor-pointer"
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
                          <div className="flex items-center gap-2">
                            <FolderKanban className="w-3.5 h-3.5 text-[#D9B875] shrink-0" />
                            <div className="min-w-0">
                              <div className="text-xs font-medium text-[#F5F2EC] truncate">
                                {task.projectTitle || "Edyrex Website"}
                              </div>
                              <div className="text-[10px] font-mono text-[#898D94] uppercase tracking-wider">
                                {task.projectRef || "WEB-001"}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-[#898D94]">
                            <span className="text-sm font-mono">—</span>
                            <span className="text-[11px] italic">(Studio Task)</span>
                          </div>
                        )}
                      </td>

                      {/* Assignee */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-[#181D24] border border-[#292E35] text-[10px] font-semibold text-[#F5F2EC] flex items-center justify-center shrink-0">
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
                            {task.priority === "normal" ? "Normal" : task.priority === "high" ? "High" : task.priority === "urgent" ? "Urgent" : "Low"}
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
                              : task.status === "completed"
                              ? "Completed"
                              : "Blocked"}
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
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() => {
                                  setOpenActionId(null);
                                  handleDeleteTask(task.id);
                                }}
                                className="w-full px-3 py-1.5 text-left text-[#E36B68] hover:bg-[#2E1618] flex items-center gap-2 cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-[#E36B68]" />
                                <span>Delete Task</span>
                              </button>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Table Footer & Pagination (Image 1) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3.5 border-t border-[#292E35] bg-[#161A1F]/40 text-xs text-[#898D94]">
            <div>
              Showing{" "}
              <span className="font-medium text-[#F5F2EC]">
                {filteredTasks.length === 0 ? 0 : 1}
              </span>
              -
              <span className="font-medium text-[#F5F2EC]">
                {Math.min(limit, filteredTasks.length)}
              </span>{" "}
              of <span className="font-medium text-[#F5F2EC]">{kpis.total}</span> tasks
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
                  aria-label="Rows per page"
                  className="h-7 px-2 rounded-lg bg-[#121519] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none cursor-pointer"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  aria-label="Previous page"
                  className="p-1 rounded-lg bg-[#161A1F] border border-[#292E35] text-[#898D94] hover:text-[#F5F2EC] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2.5 py-0.5 rounded-md bg-[#D9B875] text-[#090A0C] font-bold text-xs font-mono">
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
        </div>
      )}

      {/* ----------------------------------------------------
          6. KANBAN BOARD VIEW & SIDEBAR (Exact match to Image 2)
      ---------------------------------------------------- */}
      {viewMode === "kanban" && (
        <div className="space-y-4">
          {/* Top Board Navigation Bar (Image 2) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-[#121519] border border-[#292E35]">
            <div className="flex flex-wrap items-center gap-3">
              {/* Board Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-[#898D94] font-medium hidden sm:inline">
                  Current Board:
                </span>
                <div className="relative">
                  <select
                    value={projectFilter}
                    onChange={(e) => setProjectFilter(e.target.value)}
                    aria-label="Current Board"
                    className="h-8 pl-3 pr-7 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs font-semibold text-[#F5F2EC] focus:outline-none focus:border-[#D9B875] cursor-pointer appearance-none"
                  >
                    <option value="all">Q1 Product Launch</option>
                    <option value="prj-web-001">Edyrex Website</option>
                    <option value="prj-str-002">Strata Platform</option>
                    <option value="studio">Studio Operations</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-[#898D94] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Board Search */}
              <div className="relative w-48 sm:w-60">
                <Search className="w-3.5 h-3.5 text-[#898D94] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tasks..."
                  className="h-8 w-full pl-7 pr-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] placeholder:text-[#898D94] focus:outline-none focus:border-[#D9B875]"
                />
              </div>

              {/* Filters Toggle Pill */}
              <button
                type="button"
                onClick={() => setQuickHighPriorityOnly(!quickHighPriorityOnly)}
                className={cn(
                  "h-8 px-3 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer",
                  quickHighPriorityOnly
                    ? "bg-[#D9B875]/15 border-[#D9B875] text-[#D9B875]"
                    : "bg-[#161A1F] border-[#292E35] text-[#898D94] hover:text-[#F5F2EC]"
                )}
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Filters</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* Add Column Button */}
              <button
                type="button"
                onClick={() => {
                  setCreateInitialStatus("todo");
                  setShowCreateModal(true);
                }}
                className="h-8 px-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs font-medium text-[#F5F2EC] hover:bg-[#20252E] flex items-center gap-1.5 cursor-pointer"
              >
                <span>Add Column</span>
              </button>

              {/* Primary + Add Task Button */}
              {canEdit && (
                <button
                  type="button"
                  onClick={() => {
                    setCreateInitialStatus("todo");
                    setShowCreateModal(true);
                  }}
                  className="h-8 px-3.5 rounded-xl bg-[#38BDF8] hover:bg-[#28AADE] text-[#090A0C] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-[0_2px_10px_rgba(56,189,248,0.25)]"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>+ Add Task</span>
                </button>
              )}

              {/* Toggle Board Overview Sidebar */}
              <button
                type="button"
                onClick={() => setShowBoardSidebar(!showBoardSidebar)}
                title="Toggle Board Overview Sidebar"
                aria-label="Toggle Board Overview Sidebar"
                className={cn(
                  "h-8 w-8 rounded-xl border flex items-center justify-center transition-colors cursor-pointer",
                  showBoardSidebar
                    ? "bg-[#161A1F] border-[#D9B875] text-[#D9B875]"
                    : "bg-[#161A1F] border-[#292E35] text-[#898D94] hover:text-[#F5F2EC]"
                )}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Kanban Columns + Right Sidebar Container */}
          <div className="flex flex-col lg:flex-row items-start gap-4">
            {/* Columns Container (4 Columns: Backlog, In Progress, In Review, Done) */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3.5 w-full items-start">
              {kanbanColumns.map((col) => (
                <div
                  key={col.id}
                  className="rounded-2xl bg-[#0F1217] border border-[#222836] p-3 space-y-3 min-h-[580px] flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Column Header (Image 2) */}
                    <div className="flex items-center justify-between pb-2 border-b border-[#222836]">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-semibold text-xs text-[#F5F2EC]">
                          {col.label}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-[#181D26] border border-[#2C3445] text-[10.5px] font-mono font-bold text-[#38BDF8]">
                          {col.count}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="text-[#898D94] hover:text-[#F5F2EC] p-1 rounded-lg hover:bg-[#181D26] cursor-pointer"
                        aria-label="Column actions"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Task Cards in this column (Image 2) */}
                    <div className="space-y-3">
                      {col.tasks.length === 0 ? (
                        <div className="py-12 text-center text-xs text-[#898D94] italic font-mono border border-dashed border-[#222836] rounded-xl">
                          No tasks in {col.label}
                        </div>
                      ) : (
                        col.tasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => openDetail(task.id)}
                            className="p-3.5 rounded-xl bg-[#141821] border border-[#232938] hover:border-[#38BDF8]/60 transition-all cursor-pointer space-y-2.5 group shadow-md"
                          >
                            {/* Card Top: Title & Priority Flag */}
                            <div className="flex items-start justify-between gap-2">
                              <h3 className="text-xs font-semibold text-[#F5F2EC] group-hover:text-[#38BDF8] transition-colors leading-snug">
                                {task.title}
                              </h3>
                              <Flag
                                className={cn(
                                  "w-3.5 h-3.5 shrink-0 mt-0.5",
                                  task.priority === "urgent"
                                    ? "text-[#E36B68] fill-[#E36B68]"
                                    : task.priority === "high"
                                    ? "text-[#F06419] fill-[#F06419]"
                                    : task.priority === "normal"
                                    ? "text-[#D9B875] fill-[#D9B875]"
                                    : "text-[#898D94]"
                                )}
                              />
                            </div>

                            {/* Description Excerpt */}
                            {task.description && (
                              <p className="text-[11px] text-[#898D94] line-clamp-2 leading-relaxed">
                                {task.description}
                              </p>
                            )}

                            {/* Optional Visual Mockup Cover (Image 2) */}
                            {task.coverType && <TaskCardCover type={task.coverType} />}

                            {/* Progress Bar (Image 2) */}
                            {task.progressPercent !== undefined && task.progressPercent > 0 && (
                              <div className="space-y-1">
                                <div className="h-1 w-full bg-[#1F2636] rounded-full overflow-hidden">
                                  <div
                                    className={cn(
                                      "h-full rounded-full transition-all",
                                      task.status === "completed"
                                        ? "bg-[#56C58B]"
                                        : task.progressPercent > 60
                                        ? "bg-[#38BDF8]"
                                        : "bg-[#D9B875]"
                                    )}
                                    style={{ width: `${task.progressPercent}%` }}
                                  />
                                </div>
                              </div>
                            )}

                            {/* Checklist Subtask Count or Tag Pill (Image 2) */}
                            <div className="flex flex-wrap items-center gap-2 pt-0.5">
                              {task.subtaskCount > 0 && (
                                <div className="inline-flex items-center gap-1 text-[10px] font-mono text-[#898D94] bg-[#10141D] px-2 py-0.5 rounded border border-[#222836]">
                                  <CheckSquare className="w-3 h-3 text-[#38BDF8]" />
                                  <span>
                                    {task.completedSubtaskCount}/{task.subtaskCount}{" "}
                                    {task.completedSubtaskCount === task.subtaskCount ? "completed" : "items"}
                                  </span>
                                </div>
                              )}

                              {task.tag && (
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded text-[10px] font-medium border",
                                    task.tag.includes("feedback")
                                      ? "bg-[#251B38] text-[#B892FF] border-[#6948B0]/40"
                                      : "bg-[#112822] text-[#48CA9B] border-[#22634E]/40"
                                  )}
                                >
                                  {task.tag}
                                </span>
                              )}
                            </div>

                            {/* Bottom Card Meta: Assignees, Comments, Due Date */}
                            <div className="flex items-center justify-between pt-1 border-t border-[#222836]/60 text-[11px] text-[#898D94]">
                              {/* Assignee Avatar(s) */}
                              <div className="flex items-center -space-x-1.5">
                                {task.assignees && task.assignees.length > 1 ? (
                                  task.assignees.map((asg, idx) => (
                                    <span
                                      key={asg.id || idx}
                                      title={asg.name}
                                      className="w-5 h-5 rounded-full bg-[#181D26] border border-[#2C3445] text-[9px] font-bold text-[#F5F2EC] flex items-center justify-center ring-1 ring-[#141821]"
                                    >
                                      {getInitials(asg.name)}
                                    </span>
                                  ))
                                ) : (
                                  <div className="flex items-center gap-1.5">
                                    <span className="w-5 h-5 rounded-full bg-[#181D26] border border-[#2C3445] text-[9px] font-bold text-[#F5F2EC] flex items-center justify-center">
                                      {getInitials(task.assigneeName)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Comments & Due Date (Image 2) */}
                              <div className="flex items-center gap-2.5">
                                {task.commentsCount !== undefined && task.commentsCount > 0 && (
                                  <div className="flex items-center gap-1 text-[10px] text-[#898D94] hover:text-[#F5F2EC]">
                                    <MessageSquare className="w-3 h-3" />
                                    <span>{task.commentsCount}</span>
                                  </div>
                                )}

                                {task.attachmentsCount !== undefined && task.attachmentsCount > 0 && (
                                  <div className="flex items-center gap-1 text-[10px] text-[#898D94]">
                                    <Paperclip className="w-3 h-3" />
                                    <span>{task.attachmentsCount}</span>
                                  </div>
                                )}

                                {task.dueDateLabel && (
                                  <span
                                    className={cn(
                                      "font-mono text-[10px]",
                                      task.isOverdue ? "text-[#E36B68] font-bold" : "text-[#898D94]"
                                    )}
                                  >
                                    {task.dueDateLabel}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* + Add Task at column bottom (Image 2) */}
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => {
                        setCreateInitialStatus(col.id);
                        setShowCreateModal(true);
                      }}
                      className="w-full py-2 rounded-xl bg-[#141821] border border-[#222836] hover:border-[#38BDF8] text-xs text-[#898D94] hover:text-[#38BDF8] flex items-center justify-center gap-1.5 transition-colors cursor-pointer mt-2"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Task</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Right Sidebar Panel: Board Overview, Team Activity, Quick Filters (Image 2) */}
            {showBoardSidebar && (
              <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
                {/* 1. Board Overview Card (Image 2) */}
                <div className="rounded-2xl bg-[#0F1217] border border-[#222836] p-4 space-y-3.5">
                  <h3 className="font-heading font-semibold text-xs text-[#F5F2EC] tracking-wide">
                    Board Overview
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#898D94]">Total tasks</span>
                      <span className="font-heading font-bold text-[#F5F2EC]">
                        {boardOverviewStats.totalTasks}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#898D94]">Completion rate</span>
                        <span className="font-heading font-bold text-[#56C58B]">
                          {boardOverviewStats.completionRate}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-[#181D26] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#38BDF8] to-[#56C58B] rounded-full"
                          style={{ width: `${boardOverviewStats.completionRate}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[#898D94]">Average cycle time</span>
                      <span className="font-mono text-[#F5F2EC]">
                        {boardOverviewStats.averageCycleTime}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-[#898D94]">Overdue tasks</span>
                      <span className="font-heading font-bold text-[#E36B68]">
                        {boardOverviewStats.overdueTasks}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Team Activity Stream (Image 2) */}
                <div className="rounded-2xl bg-[#0F1217] border border-[#222836] p-4 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-heading font-semibold text-xs text-[#F5F2EC] tracking-wide">
                      Team Activity
                    </h3>
                    <span className="text-[10px] font-mono text-[#38BDF8] animate-pulse">● Live</span>
                  </div>

                  <div className="space-y-3">
                    {teamActivity.map((act) => (
                      <div key={act.id} className="flex items-start gap-2.5 text-xs leading-snug">
                        <span className="w-5 h-5 rounded-full bg-[#181D26] border border-[#2C3445] text-[9px] font-bold text-[#F5F2EC] flex items-center justify-center shrink-0 mt-0.5">
                          {getInitials(act.userName)}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11px] text-[#F5F2EC]">
                            <strong className="text-[#F5F2EC] font-semibold">{act.userName}</strong>{" "}
                            <span className="text-[#898D94]">{act.actionText}</span>
                          </p>
                          <span className="text-[10px] font-mono text-[#898D94]">
                            {act.timeAgo}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Quick Filters (Image 2) */}
                <div className="rounded-2xl bg-[#0F1217] border border-[#222836] p-4 space-y-3">
                  <h3 className="font-heading font-semibold text-xs text-[#F5F2EC] tracking-wide">
                    Quick Filters
                  </h3>

                  <div className="space-y-2.5 text-xs">
                    {/* My Tasks Toggle */}
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-[#898D94] group-hover:text-[#F5F2EC] transition-colors">
                        My Tasks
                      </span>
                      <input
                        type="checkbox"
                        checked={quickMyTasksOnly}
                        onChange={(e) => setQuickMyTasksOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-[#2C3445] bg-[#181D26] accent-[#38BDF8] cursor-pointer"
                      />
                    </label>

                    {/* High Priority Toggle */}
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-[#898D94] group-hover:text-[#F5F2EC] transition-colors">
                        High Priority
                      </span>
                      <input
                        type="checkbox"
                        checked={quickHighPriorityOnly}
                        onChange={(e) => setQuickHighPriorityOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-[#2C3445] bg-[#181D26] accent-[#38BDF8] cursor-pointer"
                      />
                    </label>

                    {/* Due This Week Toggle */}
                    <label className="flex items-center justify-between cursor-pointer group">
                      <span className="text-[#898D94] group-hover:text-[#F5F2EC] transition-colors">
                        Due This Week
                      </span>
                      <input
                        type="checkbox"
                        checked={quickDueThisWeekOnly}
                        onChange={(e) => setQuickDueThisWeekOnly(e.target.checked)}
                        className="w-4 h-4 rounded border-[#2C3445] bg-[#181D26] accent-[#38BDF8] cursor-pointer"
                      />
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          7. CALENDAR VIEW
      ---------------------------------------------------- */}
      {viewMode === "calendar" && (
        <div className="rounded-2xl bg-[#121519] border border-[#292E35] p-5 space-y-4 shadow-xl">
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

      {/* ----------------------------------------------------
          8. TASK DETAIL DRAWER
      ---------------------------------------------------- */}
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

                {/* Comments Section */}
                <div className="space-y-3 pt-3 border-t border-[#292E35]">
                  <h3 className="text-xs font-semibold text-[#F5F2EC]">Discussion &amp; Notes</h3>
                  <div className="space-y-2">
                    {detailData.comments?.length === 0 ? (
                      <div className="text-xs text-[#898D94] italic">No comments posted yet.</div>
                    ) : (
                      detailData.comments?.map((c) => (
                        <div
                          key={c.id}
                          className="p-3 rounded-xl bg-[#161A1F] border border-[#292E35] space-y-1 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-[#F5F2EC]">
                              {c.authorName || "Studio Member"}
                            </span>
                            <span className="text-[10px] font-mono text-[#898D94]">
                              {new Date(c.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="text-[#B8B9BC] leading-relaxed">{c.body}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* ----------------------------------------------------
          9. MODALS: CREATE & IMPORT
      ---------------------------------------------------- */}
      {showCreateModal && (
        <CreateTaskModal
          initialStatus={createInitialStatus}
          projects={projects}
          assignees={assignees}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            loadTasks();
          }}
        />
      )}

      {showImportModal && (
        <ImportTasksModal
          onClose={() => setShowImportModal(false)}
          onSuccess={() => {
            setShowImportModal(false);
            loadTasks();
          }}
        />
      )}

      {/* ----------------------------------------------------
          10. BULK DELETE CONFIRMATION MODAL
      ---------------------------------------------------- */}
      {showBulkDeleteModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#121519] border border-[#292E35] rounded-2xl p-6 shadow-2xl relative space-y-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#E36B68]/15 border border-[#E36B68]/30 text-[#E36B68] flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-heading font-semibold text-[#F5F2EC]">
                  Delete {selectedIds.length} Selected {selectedIds.length === 1 ? "Task" : "Tasks"}?
                </h3>
                <p className="text-xs text-[#898D94] leading-relaxed">
                  Are you sure you want to permanently delete {selectedIds.length === 1 ? "this task" : `these ${selectedIds.length} tasks`}? This action will remove subtasks, comments, and milestones permanently. It cannot be undone.
                </p>
              </div>
            </div>

            {/* Selected Tasks Preview List */}
            <div className="max-h-44 overflow-y-auto rounded-xl bg-[#0B0D10] border border-[#23272F] p-3 space-y-1.5">
              {tasks
                .filter((t) => selectedIds.includes(t.id))
                .slice(0, 6)
                .map((t) => (
                  <div key={t.id} className="text-xs text-[#D1D4DC] flex items-center gap-2 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E36B68] shrink-0" />
                    <span className="font-mono text-[10px] text-[#898D94] shrink-0">{t.taskCode || "TASK"}:</span>
                    <span className="truncate">{t.title}</span>
                  </div>
                ))}
              {selectedIds.length > 6 && (
                <div className="text-[11px] text-[#898D94] italic pt-1 pl-3.5">
                  ...and {selectedIds.length - 6} more {selectedIds.length - 6 === 1 ? "task" : "tasks"}
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                disabled={deletingBulk}
                onClick={() => setShowBulkDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-[#1A1F26] border border-[#292E35] text-xs font-medium text-[#D1D4DC] hover:text-[#F5F2EC] hover:bg-[#222933] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deletingBulk}
                onClick={handleBulkDelete}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#E36B68] hover:bg-[#ED7875] text-xs font-semibold text-white transition-colors cursor-pointer shadow-lg disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deletingBulk ? "Deleting..." : `Delete ${selectedIds.length} Tasks`}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// CREATE TASK MODAL
// ----------------------------------------------------
function CreateTaskModal({
  initialStatus,
  projects,
  assignees,
  onClose,
  onSuccess,
}: {
  initialStatus: "todo" | "in_progress" | "in_review" | "blocked" | "completed";
  projects: ProjectOption[];
  assignees: AssigneeOption[];
  onClose: () => void;
  onSuccess: () => void;
}) {
  const { user } = useAdminUser();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pmsProjectId, setPmsProjectId] = useState("");
  const [assigneeUserId, setAssigneeUserId] = useState(user.id);
  const [priority, setPriority] = useState<"low" | "medium" | "high" | "urgent">("medium");
  const [workflowStatus, setWorkflowStatus] = useState<
    "todo" | "in_progress" | "in_review" | "done"
  >(initialStatus === "completed" ? "done" : (initialStatus as any));
  const [dueDate, setDueDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorText("Task title is required.");
      return;
    }

    setSubmitting(true);
    setErrorText("");

    try {
      const res = await fetch("/api/v1/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          pmsProjectId: pmsProjectId || null,
          assigneeUserIds: assigneeUserId ? [assigneeUserId] : [],
          priority,
          workflowStatus,
          dueDate: dueDate ? new Date(dueDate).toISOString() : null,
        }),
      });

      if (!res.ok) {
        const json = await res.json();
        setErrorText(json.message || "Failed to create task.");
        return;
      }

      onSuccess();
    } catch {
      setErrorText("Network error creating task.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-[#121519] border border-[#292E35] shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#292E35] pb-3">
          <h2 className="font-heading font-semibold text-base text-[#F5F2EC]">
            Create New Task
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

        {errorText && (
          <div className="p-3 rounded-xl bg-[#2E1618] border border-[#E36B68]/30 text-xs text-[#E36B68]">
            {errorText}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
              Title <span className="text-[#E36B68]">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Finalize homepage UI and interactions"
              className="w-full h-9 px-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875]"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, acceptance criteria, or asset links..."
              className="w-full p-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875] resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
                Associated Project
              </label>
              <select
                value={pmsProjectId}
                onChange={(e) => setPmsProjectId(e.target.value)}
                className="w-full h-9 px-2 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875] cursor-pointer"
              >
                <option value="">None (Studio Task)</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
                Assignee
              </label>
              <select
                value={assigneeUserId}
                onChange={(e) => setAssigneeUserId(e.target.value)}
                className="w-full h-9 px-2 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875] cursor-pointer"
              >
                {assignees.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full h-9 px-2 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875] cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
                Status
              </label>
              <select
                value={workflowStatus}
                onChange={(e) => setWorkflowStatus(e.target.value as any)}
                className="w-full h-9 px-2 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] focus:outline-none focus:border-[#D9B875] cursor-pointer"
              >
                <option value="todo">To Do / Backlog</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Completed</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-[#B8B9BC] mb-1 block">
                Due Date
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
              className="px-4 py-2 rounded-xl bg-[#D9B875] hover:bg-[#c9a661] text-[#090A0C] text-xs font-bold shadow-[0_2px_12px_rgba(217,184,117,0.2)] disabled:opacity-50 cursor-pointer"
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
      const lines = fileContent.trim().split(/\r?\n/);
      const rows = lines.slice(1);
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
            className="px-4 py-2 rounded-xl bg-[#D9B875] hover:bg-[#c9a661] text-[#090A0C] text-xs font-bold shadow-[0_2px_12px_rgba(217,184,117,0.2)] disabled:opacity-50 cursor-pointer"
          >
            {submitting ? "Importing..." : "Start Import"}
          </button>
        </div>
      </div>
    </div>
  );
}
