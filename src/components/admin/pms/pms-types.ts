export type PmsMainView =
  | "overview"
  | "my-tasks"
  | "inbox"
  | "all"
  | "starred"
  | "workload"
  | "templates"
  | "reports"
  | "project";

export type PmsProjectTab =
  | "overview"
  | "tasks"
  | "timeline"
  | "milestones"
  | "team"
  | "files"
  | "discussion"
  | "notes"
  | "client"
  | "settings";

export type TaskWorkflowStatus =
  | "backlog"
  | "todo"
  | "in_progress"
  | "in_review"
  | "done";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface KanbanColumnConfig {
  id: TaskWorkflowStatus;
  label: string;
  description: string;
  dotColor: string;
  badgeClass: string;
}

export const KANBAN_COLUMNS: KanbanColumnConfig[] = [
  {
    id: "backlog",
    label: "Backlog",
    description: "Tasks not yet scheduled",
    dotColor: "bg-[#8D939E]",
    badgeClass: "bg-[#191C22] text-[#A1A6AE] border-[#2C323B]",
  },
  {
    id: "todo",
    label: "To Do",
    description: "Ready to be executed",
    dotColor: "bg-[#7BA8DF]",
    badgeClass: "bg-[#152131] text-[#7BA8DF] border-[#7BA8DF]/35",
  },
  {
    id: "in_progress",
    label: "In Progress",
    description: "Currently being worked on",
    dotColor: "bg-[#D4AF77]",
    badgeClass: "bg-[#261E12] text-[#D4AF77] border-[#D4AF77]/40",
  },
  {
    id: "in_review",
    label: "In Review",
    description: "Awaiting approval",
    dotColor: "bg-[#C58AF9]",
    badgeClass: "bg-[#241B35] text-[#C58AF9] border-[#C58AF9]/35",
  },
  {
    id: "done",
    label: "Done",
    description: "Successfully completed",
    dotColor: "bg-[#56C88A]",
    badgeClass: "bg-[#13291E] text-[#56C88A] border-[#56C88A]/35",
  },
];

export const PROJECT_STATUS_META: Record<
  string,
  { label: string; dot: string; badgeClass: string }
> = {
  planning: {
    label: "Planning",
    dot: "bg-[#7BA8DF]",
    badgeClass: "bg-[#152131] text-[#7BA8DF] border-[#7BA8DF]/35",
  },
  in_progress: {
    label: "In Progress",
    dot: "bg-[#56C88A]",
    badgeClass: "bg-[#13291E] text-[#56C88A] border-[#56C88A]/35",
  },
  review: {
    label: "In Review",
    dot: "bg-[#E7B65D]",
    badgeClass: "bg-[#282012] text-[#E7B65D] border-[#E7B65D]/35",
  },
  completed: {
    label: "Completed",
    dot: "bg-[#56C88A]",
    badgeClass: "bg-[#13291E] text-[#56C88A] border-[#56C88A]/45",
  },
  on_hold: {
    label: "On Hold",
    dot: "bg-[#E47777]",
    badgeClass: "bg-[#2A1517] text-[#E47777] border-[#E47777]/35",
  },
  archived: {
    label: "Archived",
    dot: "bg-[#6D7480]",
    badgeClass: "bg-[#1B1E25] text-[#8D939E] border-[#2E3440]",
  },
};

export const PRIORITY_META: Record<
  TaskPriority,
  { label: string; badgeClass: string }
> = {
  low: {
    label: "Low",
    badgeClass: "bg-[#14251D] text-[#56C88A] border-[#56C88A]/30",
  },
  medium: {
    label: "Medium",
    badgeClass: "bg-[#272013] text-[#E7B65D] border-[#E7B65D]/30",
  },
  high: {
    label: "High",
    badgeClass: "bg-[#2A1617] text-[#E47777] border-[#E47777]/35",
  },
  urgent: {
    label: "Urgent",
    badgeClass: "bg-[#381417] text-[#FF8D8D] border-[#FF8D8D]/45",
  },
};

export const PROJECT_ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  studio_admin: "Studio Admin",
  project_manager: "Project Manager",
  team_lead: "Team Lead",
  team_member: "Team Member",
  viewer: "Viewer",
};

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ED";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatShortDate(value: string | Date | null | undefined): string {
  if (!value) return "TBD";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function formatMinutes(mins: number): string {
  if (!mins || mins <= 0) return "0h";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export interface StudioUserSummary {
  id: string;
  displayName: string;
  emailNormalized: string;
}

export interface PmsProjectSummary {
  id: string;
  referenceCode: string;
  title: string;
  clientId: string | null;
  clientName: string | null;
  clientCompany: string | null;
  sourceEnquiryId: string | null;
  sourceReferenceCode: string | null;
  serviceInterest: string;
  status: string;
  dueDateLabel: string;
  summary: string;
  description: string;
  coverAssetId: string | null;
  coverUrl: string | null;
  progress: number;
  progressPercent: number;
  startDate: string | null;
  dueDate: string | null;
  templateKey: string | null;
  isStarred: boolean;
  totalTasks: number;
  completedTasks: number;
  milestonesCount: number;
  completedMilestonesCount: number;
  team: Array<{
    userId: string;
    displayName: string;
    emailNormalized: string;
    projectRole: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface PmsTaskItem {
  id: string;
  pmsProjectId: string | null;
  taskCode: string;
  title: string;
  description: string;
  category: string;
  workflowStatus: TaskWorkflowStatus;
  priority: TaskPriority;
  labels: string[];
  dueDateLabel: string;
  startDate: string | null;
  dueDate: string | null;
  estimatedMinutes: number;
  loggedMinutes: number;
  position: number;
  completed: boolean;
  reviewStatus: "none" | "pending_review" | "changes_requested" | "approved";
  reviewFeedback: string | null;
  dependencyTaskIds: string[];
  recurrenceRule?: "none" | "daily" | "weekly" | "biweekly" | "monthly";
  assignees: Array<{
    userId: string;
    displayName: string;
    emailNormalized: string;
  }>;
  subtasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    position: number;
  }>;
  subtasksTotal: number;
  subtasksCompleted: number;
  commentsCount: number;
  attachmentsCount: number;
}

export interface PmsWorkspacePayload {
  project: PmsProjectSummary & {
    clientEmail: string | null;
    clientPhone: string | null;
    clientService: string | null;
    internalNotes: string;
    workflowConfig?: {
      labels?: string[];
      stageNames?: Record<string, string>;
    };
  };
  permissions: {
    effectiveRole: string | null;
    canView: boolean;
    canEditTasks: boolean;
    canManageProject: boolean;
    canApproveReviews: boolean;
    canDeleteProject: boolean;
  };
  tasks: PmsTaskItem[];
  milestones: Array<{
    id: string;
    projectId: string;
    title: string;
    description: string;
    dueDate: string | null;
    status: "pending" | "in_progress" | "completed" | "delayed";
    position: number;
  }>;
  members: Array<{
    id: string;
    userId: string;
    projectRole: string;
    capacityHoursPerWeek: number;
    membershipStatus: "active" | "inactive";
    displayName: string;
    emailNormalized: string;
    assignedTasks: number;
    completedTasks: number;
    overdueTasks: number;
    estimatedMinutes: number;
    loggedMinutes: number;
  }>;
  files: Array<{
    id: string;
    projectId: string;
    taskId: string | null;
    mediaAssetId: string;
    title: string;
    category: "deliverable" | "reference" | "export" | "document";
    versionGroupId: string | null;
    version: number;
    versionNote: string | null;
    uploaderName: string | null;
    secureUrl: string;
    resourceType: string;
    mimeType: string;
    fileSizeBytes: number;
    createdAt: string;
  }>;
  discussions: Array<{
    id: string;
    projectId: string;
    parentId: string | null;
    authorUserId: string | null;
    authorName: string | null;
    body: string;
    mentions: string[];
    attachmentAssetIds: string[];
    createdAt: string;
  }>;
  activityLogs: Array<{
    id: string;
    action: string;
    summary: string;
    taskId: string | null;
    actorName: string | null;
    createdAt: string;
  }>;
  studioUsers: StudioUserSummary[];
}

export interface PmsTemplateSummary {
  key: string;
  name: string;
  serviceInterest: string;
  description: string;
  milestonesCount: number;
  tasksCount: number;
  isBuiltIn?: boolean;
}

export interface PmsSavedFilterRow {
  id: string;
  scope: "projects" | "tasks" | "my_tasks";
  name: string;
  filterConfig: Record<string, string>;
}
