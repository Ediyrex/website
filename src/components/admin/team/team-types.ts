export type TeamTabKey = "members" | "roles" | "groups" | "activity";

export interface ModulePermissionEntry {
  view: boolean;
  create: boolean;
  edit: boolean;
  delete: boolean;
}

export interface RolePermissionsMatrix {
  modules: Record<string, ModulePermissionEntry>;
  capabilities: {
    publish: boolean;
    approve: boolean;
    inviteUsers: boolean;
    manageBilling: boolean;
    viewConfidential: boolean;
  };
}

export interface RoleDefinitionRecord {
  id: string;
  key: string;
  name: string;
  baseRole: "admin" | "editor" | "viewer" | string;
  description: string;
  isSystem: boolean;
  permissions: RolePermissionsMatrix;
  memberCount?: number;
  createdAt: string;
}

export interface TeamMemberProjectLink {
  projectId: string;
  projectTitle: string;
  projectRole: string;
}

export interface TeamMemberRecord {
  id: string;
  emailNormalized: string;
  displayName: string;
  status: "invited" | "active" | "disabled";
  studioRole: string;
  studioRoleLabel: string;
  department: string;
  jobTitle: string | null;
  phone: string | null;
  avatarUrl: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
  roles: string[];
  pmsProjectsCount: number;
  pmsProjects: TeamMemberProjectLink[];
  assignedTasksCount: number;
  openTasksCount: number;
  activeSessionsCount: number;
  accessGroups: Array<{ id: string; name: string; division: string }>;
}

export interface TeamInvitationRecord {
  id: string;
  userId: string | null;
  emailNormalized: string;
  fullName: string;
  studioRole: string;
  studioRoleLabel: string;
  department: string;
  projectId: string | null;
  projectRole: string;
  status: "pending" | "accepted" | "expired" | "revoked";
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
}

export interface TeamActivityRecord {
  id: string;
  actorUserId: string | null;
  actorEmailSnapshot: string;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface PmsProjectOption {
  id: string;
  referenceCode: string | null;
  title: string;
  status: string;
}

export interface TeamOverviewResponse {
  members: TeamMemberRecord[];
  invitations: TeamInvitationRecord[];
  roles: RoleDefinitionRecord[];
  roleBreakdown: Array<{
    key: string;
    name: string;
    baseRole: string;
    count: number;
  }>;
  pmsProjectsList: PmsProjectOption[];
  departments: string[];
  kpis: {
    totalMembers: number;
    activeMembers: number;
    pendingInvitations: number;
    suspendedMembers: number;
    departmentsCount: number;
  };
  activityLogs: TeamActivityRecord[];
}

export interface AccessGroupMemberItem {
  userId: string;
  displayName: string;
  emailNormalized: string;
  studioRole: string;
  status: string;
  avatarUrl: string | null;
}

export interface AccessGroupProjectAccessItem {
  id: string;
  projectId: string;
  projectRole: string;
  allowedBoards: string[];
  boardRoles: Record<string, string>;
}

export interface AccessGroupRecord {
  id: string;
  name: string;
  slug: string;
  division: string;
  description: string;
  defaultStudioRole: string;
  createdAt: string;
  members: AccessGroupMemberItem[];
  projectAccess: AccessGroupProjectAccessItem[];
}

export const GROUP_PROJECT_BOARDS = [
  { key: "backlog", label: "Backlog" },
  { key: "todo", label: "To Do" },
  { key: "in_progress", label: "In Progress" },
  { key: "in_review", label: "In Review" },
  { key: "done", label: "Done" },
] as const;

export type GroupProjectBoardKey = (typeof GROUP_PROJECT_BOARDS)[number]["key"];

export const GROUP_PROJECT_ROLE_OPTIONS = [
  {
    value: "studio_admin",
    label: "Owner / Admin",
    shortLabel: "Owner",
    description: "Unrestricted access to project, boards, and settings.",
  },
  {
    value: "project_manager",
    label: "Manager",
    shortLabel: "Manager",
    description: "Can add and remove members, tasks, and milestones.",
  },
  {
    value: "team_lead",
    label: "Team Lead",
    shortLabel: "Team Lead",
    description: "Can coordinate workflow, review work, and assign tasks.",
  },
  {
    value: "team_member",
    label: "Member",
    shortLabel: "Member",
    description: "Can interact with tasks and files, cannot manage members.",
  },
  {
    value: "viewer",
    label: "Guest (Viewer)",
    shortLabel: "Guest",
    description: "Viewing access to project content, cannot make changes.",
  },
  {
    value: "no_access",
    label: "No Access",
    shortLabel: "No Access",
    description: "No group-level access to this project or board.",
  },
] as const;

export type GroupProjectRoleValue =
  (typeof GROUP_PROJECT_ROLE_OPTIONS)[number]["value"];

function escapeCsvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replaceAll('"', '""')}"`;
}

export function exportTeamMembersCsv(
  members: TeamMemberRecord[],
  filenamePrefix = "ediyrex-team-members"
): void {
  const headers = [
    "Name",
    "Email",
    "Studio Role",
    "Department",
    "Access Groups",
    "Status",
    "PMS Projects",
    "Date Added",
    "Last Active",
  ];
  const rows = members.map((m) => [
    m.displayName,
    m.emailNormalized,
    m.studioRoleLabel,
    m.department || "Studio",
    m.accessGroups.map((g) => g.name).join("; "),
    m.status === "invited"
      ? "Pending"
      : m.status === "disabled"
      ? "Suspended"
      : "Active",
    String(m.pmsProjectsCount),
    new Date(m.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    m.lastLoginAt
      ? new Date(m.lastLoginAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "Never",
  ]);

  const csvContent = [headers, ...rows]
    .map((row) => row.map(escapeCsvCell).join(","))
    .join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filenamePrefix}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export interface TeamMemberDetailResponse {
  member: TeamMemberRecord & {
    removedAt: string | null;
    permissions: RolePermissionsMatrix | null;
  };
  activeSessions: Array<{
    id: string;
    createdAt: string;
    expiresAt: string;
  }>;
  latestInvitation: {
    id: string;
    status: string;
    expiresAt: string;
    createdAt: string;
    acceptedAt: string | null;
  } | null;
  assignedProjects: Array<{
    projectId: string;
    referenceCode: string | null;
    title: string;
    status: string;
    progressPercent: number;
    projectRole: string;
  }>;
  assignedTasks: Array<{
    id: string;
    taskCode: string | null;
    title: string;
    workflowStatus: string;
    priority: string;
    completed: boolean;
    pmsProjectId: string | null;
  }>;
  accessGroups: Array<{
    id: string;
    name: string;
    division: string;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string | null;
    actorEmailSnapshot: string;
    createdAt: string;
  }>;
}

export const TEAM_MODULE_LIST = [
  { key: "pages", label: "Pages" },
  { key: "portfolio", label: "Portfolio" },
  { key: "services", label: "Services" },
  { key: "blog", label: "Blog" },
  { key: "media", label: "Media" },
  { key: "crm", label: "CRM" },
  { key: "pms", label: "PMS" },
  { key: "settings", label: "Settings" },
  { key: "team", label: "Team" },
] as const;

export const TEAM_CAPABILITY_LIST = [
  {
    key: "publish",
    label: "Publish Content",
    description: "Publish pages, portfolio works, services, and blog articles.",
  },
  {
    key: "approve",
    label: "Approve Deliverables",
    description: "Approve PMS tasks, creative reviews, and milestone outputs.",
  },
  {
    key: "inviteUsers",
    label: "Invite & Manage Users",
    description: "Send member invitations and manage invitation lifecycle.",
  },
  {
    key: "manageBilling",
    label: "Manage Billing",
    description: "Access billing controls, vendor rates, and client contracts.",
  },
  {
    key: "viewConfidential",
    label: "View Confidential",
    description: "Access private internal notes and audit trails.",
  },
] as const;

export const DEPARTMENT_OPTIONS = [
  "Creative",
  "Digital",
  "AI",
  "Studio Operations",
  "Client Strategy",
];

export function getInitials(name: string, email: string): string {
  const source = (name || email || "U").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

export function formatRelativeTime(isoString: string | null): string {
  if (!isoString) return "Never";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "—";
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHrs = Math.floor(diffMin / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function getRoleBadgeClass(studioRole: string): string {
  switch (studioRole) {
    case "super_admin":
      return "border-[#e6c27a]/40 bg-[#e6c27a]/15 text-[#f0d290]";
    case "studio_admin":
      return "border-amber-400/35 bg-amber-400/10 text-amber-200";
    case "project_manager":
      return "border-sky-400/35 bg-sky-400/10 text-sky-200";
    case "team_lead":
      return "border-violet-400/35 bg-violet-400/10 text-violet-200";
    case "team_member":
      return "border-emerald-400/30 bg-emerald-400/10 text-emerald-200";
    case "viewer":
      return "border-white/15 bg-white/[0.05] text-neutral-300";
    default:
      return "border-cyan-400/35 bg-cyan-400/10 text-cyan-200";
  }
}

export function getStatusDotAndLabel(status: string): {
  label: string;
  dotClass: string;
  textClass: string;
  pillClass: string;
} {
  switch (status) {
    case "active":
      return {
        label: "Active",
        dotClass: "bg-emerald-400",
        textClass: "text-emerald-300",
        pillClass: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
      };
    case "invited":
      return {
        label: "Pending",
        dotClass: "bg-amber-400",
        textClass: "text-amber-300",
        pillClass: "border-amber-500/25 bg-amber-500/10 text-amber-300",
      };
    default:
      return {
        label: "Suspended",
        dotClass: "bg-rose-400",
        textClass: "text-rose-300",
        pillClass: "border-rose-500/25 bg-rose-500/10 text-rose-300",
      };
  }
}

