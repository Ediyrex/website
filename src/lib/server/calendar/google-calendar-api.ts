import type { GoogleCalendarEntry, GoogleCalendarEventItem } from "./types";

const CALENDAR_API_BASE = "https://www.googleapis.com/calendar/v3";

/**
 * Fetches all authorized calendars for the authenticated Google user.
 */
export async function listUserCalendars(
  accessToken: string
): Promise<GoogleCalendarEntry[]> {
  const url = `${CALENDAR_API_BASE}/users/me/calendarList`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Google Calendar list request failed (${response.status}): ${errorText}`
    );
  }

  const data = (await response.json()) as {
    items?: GoogleCalendarEntry[];
  };

  return data.items || [];
}

/**
 * Fetches events for a specific calendar within a date range.
 */
export async function listCalendarEvents(
  accessToken: string,
  calendarId: string,
  options: {
    timeMin?: string;
    timeMax?: string;
    maxResults?: number;
    singleEvents?: boolean;
    orderBy?: "startTime" | "updated";
  } = {}
): Promise<GoogleCalendarEventItem[]> {
  const params = new URLSearchParams({
    singleEvents: String(options.singleEvents ?? true),
    orderBy: options.orderBy || "startTime",
    maxResults: String(options.maxResults || 250),
  });

  if (options.timeMin) {
    params.set("timeMin", options.timeMin);
  }
  if (options.timeMax) {
    params.set("timeMax", options.timeMax);
  }

  const encodedCalendarId = encodeURIComponent(calendarId);
  const url = `${CALENDAR_API_BASE}/calendars/${encodedCalendarId}/events?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(
      `Google Calendar events request failed (${response.status}): ${errorText}`
    );
  }

  const data = (await response.json()) as {
    items?: GoogleCalendarEventItem[];
  };

  return data.items || [];
}

/**
 * Generates realistic editorial mock events for local preview when Google OAuth is pending.
 */
export function generateMockCalendarEvents(): GoogleCalendarEventItem[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const day = now.getDate();

  return [
    {
      id: "mock-event-1",
      summary: "Discovery Call · Brand System Redesign",
      description: "Initial discovery call for eCommerce fashion brand re-positioning and custom web application.",
      location: "Google Meet",
      hangoutLink: "https://meet.google.com/edi-yrex-cal",
      start: {
        dateTime: new Date(year, month, day, 11, 0, 0).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: new Date(year, month, day, 11, 30, 0).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      status: "confirmed",
      creator: { email: "ediyrex@gmail.com", displayName: "Ediyrex Studio" },
      attendees: [
        { email: "client@example.com", displayName: "Alex Mercer", responseStatus: "accepted" },
        { email: "ediyrex@gmail.com", displayName: "Studio Lead", responseStatus: "accepted" },
      ],
    },
    {
      id: "mock-event-2",
      summary: "Project Milestone · Architecture Sprint Sign-off",
      description: "Technical sign-off for enterprise SaaS dashboard and n8n autonomous orchestration pipeline.",
      location: "Google Meet",
      hangoutLink: "https://meet.google.com/edi-arch-sign",
      start: {
        dateTime: new Date(year, month, day + 1, 15, 0, 0).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: new Date(year, month, day + 1, 16, 0, 0).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      status: "confirmed",
      creator: { email: "ediyrex@gmail.com", displayName: "Lead Architect" },
      attendees: [
        { email: "cto@partner.com", displayName: "Partner CTO", responseStatus: "accepted" },
      ],
    },
    {
      id: "mock-event-3",
      summary: "Media Production · Studio Shoot Day 1",
      description: "On-location visual assets capture for brand editorial campaign.",
      location: "Studio Floor A, Mumbai",
      start: {
        dateTime: new Date(year, month, day + 2, 9, 30, 0).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: new Date(year, month, day + 2, 14, 0, 0).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      status: "confirmed",
      creator: { email: "ediyrex@gmail.com", displayName: "Production Director" },
    },
    {
      id: "mock-event-4",
      summary: "Client Review · Motion Design & Trailer",
      description: "Presentation of initial rough cut 3D renders and typography animations.",
      location: "Google Meet",
      hangoutLink: "https://meet.google.com/edi-rev-cut",
      start: {
        dateTime: new Date(year, month, day - 1, 16, 30, 0).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: new Date(year, month, day - 1, 17, 30, 0).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      status: "confirmed",
      creator: { email: "ediyrex@gmail.com", displayName: "Creative Director" },
    },
    {
      id: "mock-event-5",
      summary: "Team Availability · Weekly Ops Sync",
      description: "Cross-disciplinary sync between Creative, Digital and Intelligence squads.",
      location: "Internal Meeting",
      start: {
        dateTime: new Date(year, month, day + 4, 10, 0, 0).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: new Date(year, month, day + 4, 11, 0, 0).toISOString(),
        timeZone: "Asia/Kolkata",
      },
      status: "confirmed",
      creator: { email: "ediyrex@gmail.com", displayName: "Operations" },
    },
  ];
}
