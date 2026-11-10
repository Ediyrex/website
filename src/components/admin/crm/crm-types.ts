export type CrmView = "leads" | "clients" | "followups";

export type EnquiryStatus =
  | "new"
  | "reviewing"
  | "qualified"
  | "proposal_sent"
  | "won"
  | "lost"
  | "archived";

export interface PipelineStageConfig {
  status: EnquiryStatus;
  label: string;
  badgeClass: string;
  activeRing: string;
}

export const PIPELINE_STAGES: PipelineStageConfig[] = [
  {
    status: "new",
    label: "New",
    badgeClass: "bg-[#2C2415] text-[#D6B77A] border-[#D6B77A]/35",
    activeRing: "border-[#D6B77A]/70 bg-[#18150F]",
  },
  {
    status: "reviewing",
    label: "Contacted",
    badgeClass: "bg-[#162235] text-[#8AB4F8] border-[#8AB4F8]/35",
    activeRing: "border-[#8AB4F8]/70 bg-[#121926]",
  },
  {
    status: "qualified",
    label: "In Discussion",
    badgeClass: "bg-[#241B35] text-[#C58AF9] border-[#C58AF9]/35",
    activeRing: "border-[#C58AF9]/70 bg-[#191425]",
  },
  {
    status: "proposal_sent",
    label: "Proposal",
    badgeClass: "bg-[#122B29] text-[#5CE1CE] border-[#5CE1CE]/35",
    activeRing: "border-[#5CE1CE]/70 bg-[#10201F]",
  },
  {
    status: "won",
    label: "Converted",
    badgeClass: "bg-[#13291E] text-[#6FCF97] border-[#6FCF97]/35",
    activeRing: "border-[#6FCF97]/70 bg-[#101F17]",
  },
];

export const ALL_STATUS_OPTIONS: Array<{
  status: EnquiryStatus;
  label: string;
  badgeClass: string;
}> = [
  ...PIPELINE_STAGES.map(({ status, label, badgeClass }) => ({
    status,
    label,
    badgeClass,
  })),
  {
    status: "lost",
    label: "Lost",
    badgeClass: "bg-[#2A1517] text-[#F28B82] border-[#F28B82]/35",
  },
  {
    status: "archived",
    label: "Archived",
    badgeClass: "bg-[#1B1E25] text-[#8D939E] border-[#2E3440]",
  },
];

export function getStatusMeta(status: string) {
  return (
    ALL_STATUS_OPTIONS.find((s) => s.status === status) ?? {
      status: status as EnquiryStatus,
      label: status,
      badgeClass: "bg-[#1B1E25] text-[#8D939E] border-[#2E3440]",
    }
  );
}

export function formatSourceLabel(source: string): string {
  const map: Record<string, string> = {
    website_contact_form: "Website",
    website: "Website",
    referral: "Referral",
    linkedin: "LinkedIn",
    manual_entry: "Direct / Manual",
    outbound: "Outbound",
    direct: "Direct",
  };
  const key = source.toLowerCase();
  if (map[key]) return map[key];
  return source
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "ED";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatRelativeDate(value: string | Date): string {
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDueBadge(value: string | Date, completed = false): {
  label: string;
  isUrgent: boolean;
} {
  const date = new Date(value);
  if (completed) {
    return {
      label: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      isUrgent: false,
    };
  }
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );
  const startOfDue = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
  const diffDays = Math.round(
    (startOfDue.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (diffDays < 0 || date.getTime() < now.getTime()) {
    if (diffDays === 0) return { label: "Today", isUrgent: true };
    return { label: "Overdue", isUrgent: true };
  }
  if (diffDays === 0) return { label: "Today", isUrgent: true };
  if (diffDays === 1) return { label: "Tomorrow", isUrgent: false };
  return {
    label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    isUrgent: false,
  };
}

export interface EnquirySummary {
  id: string;
  referenceCode: string;
  contactName: string;
  emailNormalized: string;
  companyName: string | null;
  phone: string | null;
  projectType: string;
  goalsAndRequirements: string;
  budgetMin: number | null;
  budgetMax: number | null;
  budgetCurrency: string | null;
  expectedTimeline: string;
  status: EnquiryStatus;
  source: string;
  convertedClientId: string | null;
  wantsDiscoveryCall: boolean;
  submittedAt: string;
  updatedAt: string;
}

export interface EnquiryDetail extends EnquirySummary {
  notes: Array<{
    id: string;
    note: string;
    authorId: string | null;
    authorName: string | null;
    createdAt: string;
  }>;
  history: Array<{
    id: string;
    previousStatus: string | null;
    newStatus: string;
    reason: string | null;
    createdAt: string;
  }>;
  followups: Array<{
    id: string;
    title: string;
    notes: string;
    channel: string;
    dueAt: string;
    completed: boolean;
    completedAt: string | null;
  }>;
  client: CrmClientRow | null;
  pmsProjects: Array<{
    id: string;
    title: string;
    status: string;
    dueDateLabel: string;
    createdAt: string;
  }>;
}

export interface CrmClientRow {
  id: string;
  name: string;
  emailNormalized: string;
  companyName: string | null;
  phone: string | null;
  serviceInterest: string;
  source: string;
  sourceEnquiryId: string | null;
  sourceReferenceCode?: string | null;
  status: "active" | "archived";
  notes: string;
  pmsProjectCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CrmFollowupRow {
  id: string;
  enquiryId: string | null;
  clientId: string | null;
  title: string;
  notes?: string;
  channel: "email" | "call" | "meeting" | "whatsapp" | "other";
  dueAt: string;
  completed: boolean;
  completedAt?: string | null;
  contactName: string;
  contactEmail?: string | null;
  enquiryReference?: string | null;
  clientCompany?: string | null;
}

export interface CrmDashboardPayload {
  enquiries: EnquirySummary[];
  kpis: {
    totalInquiries: number;
    inquiriesLast30Days: number;
    activeLeads: number;
    inDiscussionCount: number;
    totalClients: number;
    activeClients: number;
    convertedLeads: number;
    avgResponseHours: number | null;
    respondedCount: number;
    overdueFollowupsCount: number;
  };
  statusCounts: Record<string, number>;
  pipelineCounts: Record<string, number>;
  upcomingFollowups: CrmFollowupRow[];
  serviceOptions: string[];
  sourceOptions: string[];
}

