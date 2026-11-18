import { describe, it, expect, beforeEach, afterEach } from "vitest";
import {
  inferEventCategory,
  mapGoogleEventToStandard,
  getCalendarEvents,
  CALENDAR_CATEGORIES,
} from "@/lib/server/calendar/calendar-service";
import {
  createGoogleAuthUrl,
  getGoogleOAuthCredentials,
} from "@/lib/server/calendar/google-auth";

describe("Calendar Service & Category Inference", () => {
  it("infers discovery calls correctly", () => {
    expect(
      inferEventCategory("Discovery Call · Brand System Redesign", "Initial project discovery")
    ).toBe("Discovery Call");
    expect(
      inferEventCategory("Intro call with client CTO", "")
    ).toBe("Discovery Call");
  });

  it("infers project milestones and kickoffs", () => {
    expect(
      inferEventCategory("Project Milestone · Architecture Sprint Sign-off", "Deliverable approval")
    ).toBe("Project Milestone");
    expect(
      inferEventCategory("Sprint Kickoff & Scope Alignment", "")
    ).toBe("Project Kickoff");
  });

  it("infers media production, video, and photography shoots", () => {
    expect(
      inferEventCategory("Studio Shoot Day 1", "On-location filming")
    ).toBe("Media Production");
    expect(
      inferEventCategory("Cinematic Video Shoot", "Camera setup on stage")
    ).toBe("Video Shoot");
    expect(
      inferEventCategory("Executive Portrait Photography Shoot", "")
    ).toBe("Photography Shoot");
  });

  it("infers editing deadlines and content publishing", () => {
    expect(
      inferEventCategory("Rough Cut Editing Deadline", "Final delivery before sound mix")
    ).toBe("Editing Deadline");
    expect(
      inferEventCategory("Social Campaign Content Publishing", "")
    ).toBe("Content Publishing");
  });

  it("infers internal meetings and team availability", () => {
    expect(
      inferEventCategory("Engineering Weekly Sync", "Standup and review")
    ).toBe("Internal Meeting");
    expect(
      inferEventCategory("Lead Designer OOO", "Team availability notice")
    ).toBe("Team Availability");
  });

  it("falls back to Client Meeting for client consultations", () => {
    expect(
      inferEventCategory("Q4 Strategy Consultation with Acme", "")
    ).toBe("Client Meeting");
  });

  it("correctly maps Google Calendar event item to standard format", () => {
    const rawGoogleItem = {
      id: "test-gid-123",
      summary: "Discovery Call · AI Platform",
      description: "Discussion on multi-agent architecture",
      location: "Google Meet",
      hangoutLink: "https://meet.google.com/abc-def-xyz",
      htmlLink: "https://calendar.google.com/event?eid=123",
      start: {
        dateTime: "2026-11-20T10:00:00Z",
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: "2026-11-20T10:30:00Z",
        timeZone: "Asia/Kolkata",
      },
      status: "confirmed",
      creator: { email: "ediyrex@gmail.com", displayName: "EDYREX" },
      attendees: [
        { email: "client@example.com", displayName: "Jane Doe", responseStatus: "accepted" },
      ],
    };

    const standard = mapGoogleEventToStandard(rawGoogleItem, "cal-primary-1");

    expect(standard.id).toBe("test-gid-123");
    expect(standard.calendarId).toBe("cal-primary-1");
    expect(standard.category).toBe("Discovery Call");
    expect(standard.meetLink).toBe("https://meet.google.com/abc-def-xyz");
    expect(standard.startsAt).toBe("2026-11-20T10:00:00Z");
    expect(standard.isAllDay).toBe(false);
    expect(standard.attendees).toHaveLength(1);
    expect(standard.attendees?.[0].email).toBe("client@example.com");
  });

  it("handles all-day events correctly", () => {
    const rawAllDay = {
      id: "all-day-1",
      summary: "Team Availability · National Holiday",
      start: { date: "2026-11-25" },
      end: { date: "2026-11-25" },
    };

    const standard = mapGoogleEventToStandard(rawAllDay);
    expect(standard.isAllDay).toBe(true);
    expect(standard.startsAt).toBe("2026-11-25T00:00:00Z");
  });

  it("returns mock events in development fallback mode", async () => {
    const events = await getCalendarEvents();
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toHaveProperty("title");
    expect(events[0]).toHaveProperty("category");
    expect(CALENDAR_CATEGORIES).toContain(events[0].category);
  });

  it("filters events by search query", async () => {
    const events = await getCalendarEvents({ search: "Discovery" });
    expect(events.every((e) => e.title.includes("Discovery") || e.description?.includes("Discovery"))).toBe(true);
  });
});

describe("Google OAuth URL Generation", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("throws error when GOOGLE_CLIENT_ID is not configured", () => {
    delete process.env.GOOGLE_CLIENT_ID;
    expect(() => createGoogleAuthUrl()).toThrow(/GOOGLE_CLIENT_ID is not configured/);
  });

  it("generates valid Google OAuth URL when configured", () => {
    process.env.GOOGLE_CLIENT_ID = "test-client-id.apps.googleusercontent.com";
    process.env.GOOGLE_CLIENT_SECRET = "test-client-secret";

    const creds = getGoogleOAuthCredentials();
    expect(creds.isConfigured).toBe(true);

    const url = createGoogleAuthUrl("test-state-123");
    expect(url).toContain("https://accounts.google.com/o/oauth2/v2/auth");
    expect(url).toContain("client_id=test-client-id.apps.googleusercontent.com");
    expect(url).toContain("access_type=offline");
    expect(url).toContain("state=test-state-123");
    expect(url).toContain("calendar.readonly");
  });
});
