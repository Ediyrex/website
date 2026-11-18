import { EventCategory, CalendarSectionTab } from "../types/calendar.types";

export interface CategoryStyle {
  label: EventCategory;
  dotColor: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  cardBorder: string;
}

export const CATEGORY_STYLES: Record<EventCategory, CategoryStyle> = {
  "Client Meeting": {
    label: "Client Meeting",
    dotColor: "#D6B77A",
    badgeBg: "rgba(214, 183, 122, 0.12)",
    badgeBorder: "rgba(214, 183, 122, 0.35)",
    badgeText: "#E5CCA0",
    cardBorder: "#D6B77A",
  },
  "Discovery Call": {
    label: "Discovery Call",
    dotColor: "#F06419",
    badgeBg: "rgba(240, 100, 25, 0.12)",
    badgeBorder: "rgba(240, 100, 25, 0.35)",
    badgeText: "#FF9A62",
    cardBorder: "#F06419",
  },
  "Project Kickoff": {
    label: "Project Kickoff",
    dotColor: "#3B82F6",
    badgeBg: "rgba(59, 130, 246, 0.12)",
    badgeBorder: "rgba(59, 130, 246, 0.35)",
    badgeText: "#93C5FD",
    cardBorder: "#3B82F6",
  },
  "Project Milestone": {
    label: "Project Milestone",
    dotColor: "#10B981",
    badgeBg: "rgba(16, 185, 129, 0.12)",
    badgeBorder: "rgba(16, 185, 129, 0.35)",
    badgeText: "#6EE7B7",
    cardBorder: "#10B981",
  },
  "Client Review": {
    label: "Client Review",
    dotColor: "#A855F7",
    badgeBg: "rgba(168, 85, 247, 0.12)",
    badgeBorder: "rgba(168, 85, 247, 0.35)",
    badgeText: "#D8B4FE",
    cardBorder: "#A855F7",
  },
  "Media Production": {
    label: "Media Production",
    dotColor: "#EC4899",
    badgeBg: "rgba(236, 72, 153, 0.12)",
    badgeBorder: "rgba(236, 72, 153, 0.35)",
    badgeText: "#F472B6",
    cardBorder: "#EC4899",
  },
  "Photography Shoot": {
    label: "Photography Shoot",
    dotColor: "#F43F5E",
    badgeBg: "rgba(244, 63, 94, 0.12)",
    badgeBorder: "rgba(244, 63, 94, 0.35)",
    badgeText: "#FDA4AF",
    cardBorder: "#F43F5E",
  },
  "Video Shoot": {
    label: "Video Shoot",
    dotColor: "#E11D48",
    badgeBg: "rgba(225, 29, 72, 0.12)",
    badgeBorder: "rgba(225, 29, 72, 0.35)",
    badgeText: "#FB7185",
    cardBorder: "#E11D48",
  },
  "Editing Deadline": {
    label: "Editing Deadline",
    dotColor: "#EF4444",
    badgeBg: "rgba(239, 68, 68, 0.12)",
    badgeBorder: "rgba(239, 68, 68, 0.35)",
    badgeText: "#FCA5A5",
    cardBorder: "#EF4444",
  },
  "Content Publishing": {
    label: "Content Publishing",
    dotColor: "#F59E0B",
    badgeBg: "rgba(245, 158, 11, 0.12)",
    badgeBorder: "rgba(245, 158, 11, 0.35)",
    badgeText: "#FCD34D",
    cardBorder: "#F59E0B",
  },
  "Internal Meeting": {
    label: "Internal Meeting",
    dotColor: "#64748B",
    badgeBg: "rgba(100, 116, 139, 0.12)",
    badgeBorder: "rgba(100, 116, 139, 0.35)",
    badgeText: "#CBD5E1",
    cardBorder: "#64748B",
  },
  "Team Availability": {
    label: "Team Availability",
    dotColor: "#06B6D4",
    badgeBg: "rgba(6, 182, 212, 0.12)",
    badgeBorder: "rgba(6, 182, 212, 0.35)",
    badgeText: "#67E8F9",
    cardBorder: "#06B6D4",
  },
  "Personal Event": {
    label: "Personal Event",
    dotColor: "#8B5CF6",
    badgeBg: "rgba(139, 92, 246, 0.12)",
    badgeBorder: "rgba(139, 92, 246, 0.35)",
    badgeText: "#C4B5FD",
    cardBorder: "#8B5CF6",
  },
  Other: {
    label: "Other",
    dotColor: "#94A3B8",
    badgeBg: "rgba(148, 163, 184, 0.12)",
    badgeBorder: "rgba(148, 163, 184, 0.35)",
    badgeText: "#E2E8F0",
    cardBorder: "#94A3B8",
  },
};

export const CALENDAR_SECTION_TABS: { id: CalendarSectionTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "calendar", label: "Calendar" },
  { id: "client-meetings", label: "Client Meetings" },
  { id: "milestones", label: "Project Milestones" },
  { id: "media-production", label: "Media Production" },
  { id: "team-schedule", label: "Team Schedule" },
  { id: "integrations", label: "Integrations" },
];
