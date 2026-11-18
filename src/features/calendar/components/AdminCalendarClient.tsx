"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  CalendarSectionTab,
  CalendarViewMode,
  CalendarEvent,
  ConnectedAccount,
  ManagedCalendar,
} from "../types/calendar.types";
import { CalendarHeader } from "./CalendarHeader";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import { CalendarOverviewTab } from "./CalendarOverviewTab";
import { CalendarIntegrationsTab } from "./CalendarIntegrationsTab";
import { EventDetailsDrawer } from "./EventDetailsDrawer";

export function AdminCalendarClient() {
  const [currentTab, setCurrentTab] = useState<CalendarSectionTab>("overview");
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [calendars, setCalendars] = useState<ManagedCalendar[]>([]);
  const [oauthUrl, setOauthUrl] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Fetch initial metadata and accounts
  const loadAccountsAndConfig = useCallback(async () => {
    try {
      const [accRes, urlRes, calRes] = await Promise.all([
        fetch("/api/v1/admin/calendar/accounts"),
        fetch("/api/v1/admin/calendar/oauth/url"),
        fetch("/api/v1/admin/calendar/calendars"),
      ]);

      if (accRes.ok) {
        const data = await accRes.json();
        setAccounts(data.accounts || []);
      }
      if (urlRes.ok) {
        const data = await urlRes.json();
        setOauthUrl(data.url || null);
        setIsConfigured(Boolean(data.isConfigured));
      }
      if (calRes.ok) {
        const data = await calRes.json();
        setCalendars(data.calendars || []);
      }
    } catch (err) {
      console.warn("Failed to load calendar config:", err);
    }
  }, []);

  // Fetch events based on current view/date
  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    try {
      // Calculate start and end date of currently viewed window
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      // Broad window covering month +/- 15 days
      const start = new Date(year, month - 1, 1).toISOString();
      const end = new Date(year, month + 2, 0).toISOString();

      const params = new URLSearchParams({ start, end });
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/v1/admin/calendar/events?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEvents(data.events || []);
      }
    } catch (err) {
      console.warn("Failed to fetch calendar events:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, searchQuery]);

  useEffect(() => {
    loadAccountsAndConfig();
  }, [loadAccountsAndConfig]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Handle date navigation
  const handlePrevDate = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (viewMode === "month") {
        next.setMonth(next.getMonth() - 1);
      } else if (viewMode === "week") {
        next.setDate(next.getDate() - 7);
      } else {
        next.setDate(next.getDate() - 1);
      }
      return next;
    });
  };

  const handleNextDate = () => {
    setCurrentDate((prev) => {
      const next = new Date(prev);
      if (viewMode === "month") {
        next.setMonth(next.getMonth() + 1);
      } else if (viewMode === "week") {
        next.setDate(next.getDate() + 7);
      } else {
        next.setDate(next.getDate() + 1);
      }
      return next;
    });
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Date range label
  const dateRangeLabel = useMemo(() => {
    if (viewMode === "month") {
      return currentDate.toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      });
    }

    if (viewMode === "week") {
      const curr = new Date(currentDate);
      const dayOfWeek = curr.getDay();
      const sunday = new Date(curr);
      sunday.setDate(curr.getDate() - dayOfWeek);
      const saturday = new Date(sunday);
      saturday.setDate(sunday.getDate() + 6);

      const startMonth = sunday.toLocaleDateString(undefined, { month: "short" });
      const endMonth = saturday.toLocaleDateString(undefined, { month: "short" });

      if (startMonth === endMonth) {
        return `${startMonth} ${sunday.getDate()} – ${saturday.getDate()}, ${saturday.getFullYear()}`;
      }
      return `${startMonth} ${sunday.getDate()} – ${endMonth} ${saturday.getDate()}, ${saturday.getFullYear()}`;
    }

    return currentDate.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [currentDate, viewMode]);

  // Filter events based on active section tab or category selection
  const filteredEvents = useMemo(() => {
    let result = [...events];

    // Section-specific automatic category scoping
    if (currentTab === "client-meetings") {
      result = result.filter(
        (ev) =>
          ev.category === "Client Meeting" ||
          ev.category === "Discovery Call" ||
          ev.category === "Client Review"
      );
    } else if (currentTab === "milestones") {
      result = result.filter(
        (ev) =>
          ev.category === "Project Milestone" ||
          ev.category === "Project Kickoff"
      );
    } else if (currentTab === "media-production") {
      result = result.filter(
        (ev) =>
          ev.category === "Media Production" ||
          ev.category === "Photography Shoot" ||
          ev.category === "Video Shoot" ||
          ev.category === "Editing Deadline" ||
          ev.category === "Content Publishing"
      );
    } else if (currentTab === "team-schedule") {
      result = result.filter(
        (ev) =>
          ev.category === "Internal Meeting" ||
          ev.category === "Team Availability" ||
          ev.category === "Personal Event"
      );
    } else if (currentTab === "calendar") {
      if (selectedCategory && selectedCategory !== "All") {
        result = result.filter((ev) => ev.category === selectedCategory);
      }
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (ev) =>
          ev.title.toLowerCase().includes(q) ||
          (ev.description?.toLowerCase().includes(q) ?? false) ||
          (ev.location?.toLowerCase().includes(q) ?? false)
      );
    }

    return result;
  }, [events, currentTab, selectedCategory, searchQuery]);

  // Sync action
  const handleSync = async () => {
    setIsSyncing(true);
    try {
      if (accounts.length > 0) {
        await fetch("/api/v1/admin/calendar/calendars", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ syncAccountId: accounts[0].id }),
        });
      }
      await loadEvents();
      await loadAccountsAndConfig();
    } finally {
      setIsSyncing(false);
    }
  };

  // Toggle calendar selection
  const handleToggleCalendar = async (calendarId: string, isSelected: boolean) => {
    await fetch("/api/v1/admin/calendar/calendars", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ calendarId, isSelected }),
    });
    setCalendars((prev) =>
      prev.map((c) => (c.id === calendarId ? { ...c, isSelected } : c))
    );
    loadEvents();
  };

  // Disconnect Google Account
  const handleDisconnectAccount = async (accountId: string) => {
    await fetch("/api/v1/admin/calendar/oauth/disconnect", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accountId }),
    });
    await loadAccountsAndConfig();
    await loadEvents();
  };

  return (
    <div className="space-y-6">
      <CalendarHeader
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        currentDate={currentDate}
        onPrevDate={handlePrevDate}
        onNextDate={handleNextDate}
        onToday={handleToday}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isSyncing={isSyncing}
        onSync={handleSync}
        dateRangeLabel={dateRangeLabel}
      />

      {/* Main View Area */}
      {currentTab === "overview" && (
        <CalendarOverviewTab
          events={events}
          accounts={accounts}
          onSelectEvent={setSelectedEvent}
          onNavigateToTab={setCurrentTab}
        />
      )}

      {currentTab === "integrations" && (
        <CalendarIntegrationsTab
          accounts={accounts}
          calendars={calendars}
          isConfigured={isConfigured}
          oauthUrl={oauthUrl}
          onRefresh={loadAccountsAndConfig}
          onToggleCalendar={handleToggleCalendar}
          onDisconnectAccount={handleDisconnectAccount}
        />
      )}

      {currentTab !== "overview" && currentTab !== "integrations" && (
        <div>
          {isLoading && events.length === 0 ? (
            <div className="py-20 text-center text-xs font-mono text-[#777D87] bg-[#12151A] rounded-xl border border-[#252A32]">
              Loading schedule events...
            </div>
          ) : viewMode === "month" ? (
            <MonthView
              currentDate={currentDate}
              events={filteredEvents}
              onSelectEvent={setSelectedEvent}
            />
          ) : viewMode === "week" ? (
            <WeekView
              currentDate={currentDate}
              events={filteredEvents}
              onSelectEvent={setSelectedEvent}
            />
          ) : (
            <DayView
              currentDate={currentDate}
              events={filteredEvents}
              onSelectEvent={setSelectedEvent}
            />
          )}
        </div>
      )}

      {/* Event Details Drawer */}
      <EventDetailsDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />
    </div>
  );
}
