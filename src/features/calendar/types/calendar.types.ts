export type CalendarSectionTab =
  | "overview"
  | "calendar"
  | "client-meetings"
  | "milestones"
  | "media-production"
  | "team-schedule"
  | "integrations";

export type CalendarViewMode = "month" | "week" | "day";

export type EventCategory =
  | "Client Meeting"
  | "Discovery Call"
  | "Project Kickoff"
  | "Project Milestone"
  | "Client Review"
  | "Media Production"
  | "Photography Shoot"
  | "Video Shoot"
  | "Editing Deadline"
  | "Content Publishing"
  | "Internal Meeting"
  | "Team Availability"
  | "Personal Event"
  | "Other";

export interface CalendarEvent {
  id: string;
  calendarId?: string;
  googleEventId?: string;
  title: string;
  description?: string;
  location?: string;
  startsAt: string;
  endsAt: string;
  isAllDay: boolean;
  timeZone?: string;
  status: string;
  category: EventCategory;
  htmlLink?: string;
  meetLink?: string;
  creatorEmail?: string;
  attendees?: {
    email: string;
    displayName?: string;
    responseStatus?: string;
  }[];
}

export interface ConnectedAccount {
  id: string;
  email: string;
  accountName?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  isConfigured?: boolean;
  connectedAt: string;
  updatedAt: string;
}

export interface ManagedCalendar {
  id: string;
  accountId: string;
  googleCalendarId: string;
  summary: string;
  description?: string | null;
  timeZone?: string;
  isPrimary: boolean;
  isSelected: boolean;
  backgroundColor?: string | null;
}
