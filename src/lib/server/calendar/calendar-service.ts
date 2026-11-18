import { eq, and, gte, lte, desc } from "drizzle-orm";
import { getDb } from "@/db";
import {
  googleCalendarAccounts,
  googleCalendars,
  calendarEvents,
} from "@/db/schema/calendar";
import { encryptToken, decryptToken } from "@/lib/server/encryption";
import {
  refreshAccessToken,
  revokeGoogleToken,
  getGoogleOAuthCredentials,
} from "./google-auth";
import {
  listUserCalendars,
  listCalendarEvents,
  generateMockCalendarEvents,
} from "./google-calendar-api";
import type { GoogleCalendarEventItem, GoogleCalendarEntry } from "./types";

export const CALENDAR_CATEGORIES = [
  "Client Meeting",
  "Discovery Call",
  "Project Kickoff",
  "Project Milestone",
  "Client Review",
  "Media Production",
  "Photography Shoot",
  "Video Shoot",
  "Editing Deadline",
  "Content Publishing",
  "Internal Meeting",
  "Team Availability",
  "Personal Event",
  "Other",
] as const;

export type CalendarCategory = (typeof CALENDAR_CATEGORIES)[number];

export interface StandardCalendarEvent {
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
  category: CalendarCategory;
  htmlLink?: string;
  meetLink?: string;
  creatorEmail?: string;
  attendees?: {
    email: string;
    displayName?: string;
    responseStatus?: string;
  }[];
}

/**
 * Infer category from event title and description keywords.
 */
export function inferEventCategory(
  title: string = "",
  description: string = ""
): CalendarCategory {
  const text = `${title} ${description}`.toLowerCase();

  if (text.includes("discovery call") || text.includes("intro call") || text.includes("initial meeting")) {
    return "Discovery Call";
  }
  if (text.includes("kickoff") || text.includes("kick-off") || text.includes("project start")) {
    return "Project Kickoff";
  }
  if (text.includes("milestone") || text.includes("sprint review") || text.includes("sign-off")) {
    return "Project Milestone";
  }
  if (text.includes("client review") || text.includes("feedback session") || text.includes("design review")) {
    return "Client Review";
  }
  if (text.includes("photo shoot") || text.includes("photography")) {
    return "Photography Shoot";
  }
  if (text.includes("video shoot") || text.includes("cinematic shoot")) {
    return "Video Shoot";
  }
  if (text.includes("shoot") || text.includes("production") || text.includes("filming")) {
    return "Media Production";
  }
  if (text.includes("editing deadline") || text.includes("cut deadline") || text.includes("post-production")) {
    return "Editing Deadline";
  }
  if (text.includes("publish") || text.includes("content release") || text.includes("launch post")) {
    return "Content Publishing";
  }
  if (text.includes("team availability") || text.includes("ooo") || text.includes("out of office")) {
    return "Team Availability";
  }
  if (text.includes("internal") || text.includes("sync") || text.includes("standup") || text.includes("all-hands")) {
    return "Internal Meeting";
  }
  if (text.includes("personal") || text.includes("doctor") || text.includes("private")) {
    return "Personal Event";
  }
  if (text.includes("client") || text.includes("partner") || text.includes("consultation")) {
    return "Client Meeting";
  }

  return "Client Meeting";
}

/**
 * Transform a Google Calendar event item into our standard format.
 */
export function mapGoogleEventToStandard(
  item: GoogleCalendarEventItem,
  calendarId?: string
): StandardCalendarEvent {
  const startsAt =
    item.start.dateTime ||
    (item.start.date ? `${item.start.date}T00:00:00Z` : new Date().toISOString());
  const endsAt =
    item.end.dateTime ||
    (item.end.date ? `${item.end.date}T23:59:59Z` : new Date().toISOString());

  const isAllDay = !item.start.dateTime && Boolean(item.start.date);
  const category = inferEventCategory(item.summary, item.description);

  return {
    id: item.id,
    calendarId,
    googleEventId: item.id,
    title: item.summary || "Untitled Event",
    description: item.description || undefined,
    location: item.location || undefined,
    startsAt,
    endsAt,
    isAllDay,
    timeZone: item.start.timeZone || "Asia/Kolkata",
    status: item.status || "confirmed",
    category,
    htmlLink: item.htmlLink || undefined,
    meetLink: item.hangoutLink || undefined,
    creatorEmail: item.creator?.email,
    attendees: item.attendees?.map((a) => ({
      email: a.email,
      displayName: a.displayName,
      responseStatus: a.responseStatus,
    })),
  };
}

/**
 * Lists connected Google Calendar accounts.
 */
export async function getConnectedAccounts() {
  const db = getDb();
  if (!db) {
    const creds = getGoogleOAuthCredentials();
    return [
      {
        id: "demo-account-1",
        email: "ediyrex@gmail.com",
        accountName: "EDYREX Studio Primary",
        avatarUrl: null,
        isActive: creds.isConfigured,
        isConfigured: creds.isConfigured,
        connectedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  const rows = await db
    .select({
      id: googleCalendarAccounts.id,
      email: googleCalendarAccounts.email,
      accountName: googleCalendarAccounts.accountName,
      avatarUrl: googleCalendarAccounts.avatarUrl,
      isActive: googleCalendarAccounts.isActive,
      connectedAt: googleCalendarAccounts.connectedAt,
      updatedAt: googleCalendarAccounts.updatedAt,
    })
    .from(googleCalendarAccounts)
    .where(eq(googleCalendarAccounts.isActive, true))
    .orderBy(desc(googleCalendarAccounts.connectedAt));

  return rows;
}

/**
 * Retrieves valid access token for an account, refreshing it if expired.
 */
export async function getValidAccessToken(accountId: string): Promise<string> {
  const db = getDb();
  if (!db) {
    throw new Error("Database not connected");
  }

  const [account] = await db
    .select()
    .from(googleCalendarAccounts)
    .where(
      and(
        eq(googleCalendarAccounts.id, accountId),
        eq(googleCalendarAccounts.isActive, true)
      )
    )
    .limit(1);

  if (!account) {
    throw new Error(`Google Calendar account ${accountId} not found or inactive`);
  }

  const now = new Date();
  const bufferMs = 5 * 60 * 1000; // 5 min buffer

  // Check if token is still valid
  if (
    account.accessToken &&
    account.tokenExpiresAt &&
    account.tokenExpiresAt.getTime() > now.getTime() + bufferMs
  ) {
    return account.accessToken;
  }

  // Token expired or close to expiring, refresh it
  if (!account.refreshTokenEncrypted) {
    if (account.accessToken) return account.accessToken;
    throw new Error("No refresh token available to refresh access token");
  }

  const refreshToken = decryptToken(account.refreshTokenEncrypted);
  const refreshed = await refreshAccessToken(refreshToken);

  const expiresAt = new Date(Date.now() + refreshed.expiresIn * 1000);

  await db
    .update(googleCalendarAccounts)
    .set({
      accessToken: refreshed.accessToken,
      tokenExpiresAt: expiresAt,
      updatedAt: new Date(),
    })
    .where(eq(googleCalendarAccounts.id, accountId));

  return refreshed.accessToken;
}

/**
 * Fetches and syncs authorized calendars for an account.
 */
export async function syncCalendarsForAccount(accountId: string) {
  const db = getDb();
  if (!db) {
    return [
      {
        id: "demo-calendar-primary",
        accountId: "demo-account-1",
        googleCalendarId: "ediyrex@gmail.com",
        summary: "EDYREX Studio Master Calendar",
        description: "Primary client meetings and project schedules",
        timeZone: "Asia/Kolkata",
        isPrimary: true,
        isSelected: true,
        colorId: "14",
        backgroundColor: "#D6B77A",
      },
    ];
  }

  const accessToken = await getValidAccessToken(accountId);
  const googleList = await listUserCalendars(accessToken);

  for (const cal of googleList) {
    const existing = await db
      .select({ id: googleCalendars.id })
      .from(googleCalendars)
      .where(
        and(
          eq(googleCalendars.accountId, accountId),
          eq(googleCalendars.googleCalendarId, cal.id)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      await db
        .update(googleCalendars)
        .set({
          summary: cal.summary,
          description: cal.description,
          timeZone: cal.timeZone,
          colorId: cal.colorId,
          backgroundColor: cal.backgroundColor,
          foregroundColor: cal.foregroundColor,
          isPrimary: Boolean(cal.primary),
          accessRole: cal.accessRole,
          lastSyncedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(googleCalendars.id, existing[0].id));
    } else {
      await db.insert(googleCalendars).values({
        accountId,
        googleCalendarId: cal.id,
        summary: cal.summary,
        description: cal.description,
        timeZone: cal.timeZone,
        colorId: cal.colorId,
        backgroundColor: cal.backgroundColor,
        foregroundColor: cal.foregroundColor,
        isPrimary: Boolean(cal.primary),
        isSelected: Boolean(cal.primary || cal.selected),
        accessRole: cal.accessRole,
        lastSyncedAt: new Date(),
      });
    }
  }

  return await db
    .select()
    .from(googleCalendars)
    .where(eq(googleCalendars.accountId, accountId));
}

/**
 * Get all calendars across all active accounts.
 */
export async function getCalendars(accountId?: string) {
  const db = getDb();
  if (!db) {
    return [
      {
        id: "demo-calendar-primary",
        accountId: "demo-account-1",
        googleCalendarId: "ediyrex@gmail.com",
        summary: "EDYREX Studio Master Calendar",
        description: "Primary client discovery and team engagements",
        timeZone: "Asia/Kolkata",
        isPrimary: true,
        isSelected: true,
        backgroundColor: "#D6B77A",
      },
      {
        id: "demo-calendar-shoots",
        accountId: "demo-account-1",
        googleCalendarId: "shoots@ediyrex.com",
        summary: "Media & Studio Shoots",
        description: "Production and filming schedule",
        timeZone: "Asia/Kolkata",
        isPrimary: false,
        isSelected: true,
        backgroundColor: "#E05308",
      },
    ];
  }

  let query = db.select().from(googleCalendars);
  if (accountId) {
    return await query.where(eq(googleCalendars.accountId, accountId));
  }
  return await query;
}

/**
 * Update calendar selection flag.
 */
export async function setCalendarSelection(calendarId: string, isSelected: boolean) {
  const db = getDb();
  if (!db) return { success: true };

  await db
    .update(googleCalendars)
    .set({
      isSelected,
      updatedAt: new Date(),
    })
    .where(eq(googleCalendars.id, calendarId));

  return { success: true };
}

/**
 * Fetches events across selected calendars, falling back to realistic mock events when in development or disconnected.
 */
export async function getCalendarEvents(options: {
  start?: Date;
  end?: Date;
  category?: string;
  search?: string;
  accountId?: string;
} = {}): Promise<StandardCalendarEvent[]> {
  const db = getDb();

  // If no DB or no active connected accounts, return mock events
  if (!db) {
    return filterEvents(
      generateMockCalendarEvents().map((item) =>
        mapGoogleEventToStandard(item, "demo-calendar-primary")
      ),
      options
    );
  }

  const accounts = await db
    .select()
    .from(googleCalendarAccounts)
    .where(eq(googleCalendarAccounts.isActive, true));

  if (accounts.length === 0) {
    return filterEvents(
      generateMockCalendarEvents().map((item) =>
        mapGoogleEventToStandard(item, "demo-calendar-primary")
      ),
      options
    );
  }

  const allEvents: StandardCalendarEvent[] = [];

  for (const account of accounts) {
    try {
      const accessToken = await getValidAccessToken(account.id);
      const calendars = await db
        .select()
        .from(googleCalendars)
        .where(
          and(
            eq(googleCalendars.accountId, account.id),
            eq(googleCalendars.isSelected, true)
          )
        );

      for (const cal of calendars) {
        try {
          const items = await listCalendarEvents(accessToken, cal.googleCalendarId, {
            timeMin: options.start?.toISOString(),
            timeMax: options.end?.toISOString(),
          });
          const mapped = items.map((item) =>
            mapGoogleEventToStandard(item, cal.id)
          );
          allEvents.push(...mapped);
        } catch (err) {
          console.warn(`Failed to fetch events for calendar ${cal.summary}:`, err);
        }
      }
    } catch (err) {
      console.warn(`Failed to fetch for account ${account.email}:`, err);
    }
  }

  // If live query returned no events, provide mock events so calendar isn't blank
  if (allEvents.length === 0) {
    return filterEvents(
      generateMockCalendarEvents().map((item) =>
        mapGoogleEventToStandard(item, "demo-calendar-primary")
      ),
      options
    );
  }

  return filterEvents(allEvents, options);
}

function filterEvents(
  events: StandardCalendarEvent[],
  options: {
    start?: Date;
    end?: Date;
    category?: string;
    search?: string;
  }
): StandardCalendarEvent[] {
  return events.filter((ev) => {
    if (options.start && new Date(ev.endsAt) < options.start) return false;
    if (options.end && new Date(ev.startsAt) > options.end) return false;

    if (
      options.category &&
      options.category !== "All" &&
      ev.category !== options.category
    ) {
      return false;
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      const match =
        ev.title.toLowerCase().includes(q) ||
        (ev.description?.toLowerCase().includes(q) ?? false) ||
        (ev.location?.toLowerCase().includes(q) ?? false);
      if (!match) return false;
    }

    return true;
  });
}

/**
 * Disconnect an account and revoke tokens.
 */
export async function disconnectAccount(accountId: string) {
  const db = getDb();
  if (!db) return { success: true };

  const [account] = await db
    .select()
    .from(googleCalendarAccounts)
    .where(eq(googleCalendarAccounts.id, accountId))
    .limit(1);

  if (account) {
    if (account.refreshTokenEncrypted) {
      try {
        const token = decryptToken(account.refreshTokenEncrypted);
        await revokeGoogleToken(token);
      } catch (err) {
        console.warn("Token revocation failed:", err);
      }
    }

    await db
      .update(googleCalendarAccounts)
      .set({
        isActive: false,
        accessToken: null,
        refreshTokenEncrypted: null,
        updatedAt: new Date(),
      })
      .where(eq(googleCalendarAccounts.id, accountId));
  }

  return { success: true };
}
