"use client";

import React, { useMemo } from "react";
import {
  CalendarEvent,
  ConnectedAccount,
} from "../types/calendar.types";
import { CATEGORY_STYLES } from "../config/calendar.config";
import {
  Calendar,
  Clock,
  Video,
  CheckCircle2,
  Users,
  ArrowUpRight,
  Sparkles,
  Link2,
} from "lucide-react";

interface CalendarOverviewTabProps {
  events: CalendarEvent[];
  accounts: ConnectedAccount[];
  onSelectEvent: (event: CalendarEvent) => void;
  onNavigateToTab: (tab: any) => void;
}

export function CalendarOverviewTab({
  events,
  accounts,
  onSelectEvent,
  onNavigateToTab,
}: CalendarOverviewTabProps) {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`;

  // Metrics
  const todayEvents = useMemo(() => {
    return events.filter((ev) => {
      const d = new Date(ev.startsAt);
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` === todayStr;
    });
  }, [events, todayStr]);

  const discoveryCalls = useMemo(() => {
    return events.filter((ev) => ev.category === "Discovery Call");
  }, [events]);

  const milestones = useMemo(() => {
    return events.filter((ev) => ev.category === "Project Milestone");
  }, [events]);

  const mediaShoots = useMemo(() => {
    return events.filter(
      (ev) =>
        ev.category === "Media Production" ||
        ev.category === "Photography Shoot" ||
        ev.category === "Video Shoot"
    );
  }, [events]);

  // Next upcoming event
  const nextEvent = useMemo(() => {
    const upcoming = events
      .filter((ev) => new Date(ev.endsAt) >= now)
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
    return upcoming[0] || null;
  }, [events, now]);

  const isConnected = accounts.some((a) => a.isActive);

  return (
    <div className="space-y-6">
      {/* 4 Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#12151A] border border-[#252A32] space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#777D87]">
            <span>TODAY'S SCHEDULE</span>
            <Clock className="w-4 h-4 text-[#D6B77A]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F5F3EE]">
            {todayEvents.length}
          </div>
          <p className="text-[11px] text-[#B2B4BA]">
            {todayEvents.length === 1 ? "1 meeting scheduled" : `${todayEvents.length} meetings scheduled`}
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#12151A] border border-[#252A32] space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#777D87]">
            <span>DISCOVERY CALLS</span>
            <Sparkles className="w-4 h-4 text-[#F06419]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#F06419]">
            {discoveryCalls.length}
          </div>
          <p className="text-[11px] text-[#B2B4BA]">Active client discovery pipeline</p>
        </div>

        <div className="p-4 rounded-xl bg-[#12151A] border border-[#252A32] space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#777D87]">
            <span>PROJECT MILESTONES</span>
            <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#10B981]">
            {milestones.length}
          </div>
          <p className="text-[11px] text-[#B2B4BA]">Architecture &amp; design sprints</p>
        </div>

        <div className="p-4 rounded-xl bg-[#12151A] border border-[#252A32] space-y-1">
          <div className="flex items-center justify-between text-xs font-mono text-[#777D87]">
            <span>MEDIA PRODUCTIONS</span>
            <Video className="w-4 h-4 text-[#EC4899]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#EC4899]">
            {mediaShoots.length}
          </div>
          <p className="text-[11px] text-[#B2B4BA]">Studio filming &amp; photography</p>
        </div>
      </div>

      {/* Hero: Next Immediate Event / Highlight */}
      {nextEvent && (
        <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-[#161920] to-[#12151A] border border-[#D6B77A]/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D6B77A]/15 text-[#D6B77A] border border-[#D6B77A]/40 uppercase tracking-wider">
                Up Next
              </span>
              <span className="text-xs font-mono text-[#B2B4BA]">
                {new Date(nextEvent.startsAt).toLocaleString([], {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            <h3 className="text-lg font-heading font-bold text-[#F5F3EE]">
              {nextEvent.title}
            </h3>

            {nextEvent.description && (
              <p className="text-xs text-[#B2B4BA] max-w-2xl line-clamp-2">
                {nextEvent.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {nextEvent.meetLink && (
              <a
                href={nextEvent.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D6B77A] text-[#08090B] font-semibold text-xs font-mono hover:bg-[#E5CCA0] transition-colors"
              >
                <Video className="w-4 h-4" />
                <span>Join Google Meet</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            )}

            <button
              type="button"
              onClick={() => onSelectEvent(nextEvent)}
              className="px-3.5 py-2 rounded-lg bg-[#12151A] border border-[#252A32] text-xs font-mono text-[#F5F3EE] hover:border-[#D6B77A]/60 transition-colors"
            >
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Split Grid: Today's Agenda & Integration Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Today's Detailed Agenda */}
        <div className="lg:col-span-2 p-5 rounded-xl bg-[#12151A] border border-[#252A32] space-y-4">
          <div className="flex items-center justify-between border-b border-[#252A32] pb-3">
            <h3 className="text-sm font-heading font-bold text-[#F5F3EE] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D6B77A]" />
              <span>Today's Schedule</span>
            </h3>
            <button
              type="button"
              onClick={() => onNavigateToTab("calendar")}
              className="text-xs font-mono text-[#D6B77A] hover:underline"
            >
              Open Full Calendar &rarr;
            </button>
          </div>

          {todayEvents.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[#777D87]">
              No further meetings or sessions scheduled for today.
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayEvents.map((ev) => {
                const style = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES.Other;
                const time = new Date(ev.startsAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={ev.id}
                    onClick={() => onSelectEvent(ev)}
                    className="p-3 rounded-lg bg-[#0E1014] border border-[#252A32] hover:border-[#D6B77A]/40 transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: style.dotColor }}
                        />
                        <span className="text-[10px] font-mono text-[#888E99]">
                          {time}
                        </span>
                        <span
                          className="text-[10px] font-mono px-2 py-0.2 rounded"
                          style={{
                            backgroundColor: style.badgeBg,
                            color: style.badgeText,
                          }}
                        >
                          {ev.category}
                        </span>
                      </div>
                      <div className="text-xs font-semibold text-[#F5F3EE] truncate">
                        {ev.title}
                      </div>
                    </div>

                    {ev.meetLink && (
                      <a
                        href={ev.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded bg-[#D6B77A]/15 text-[#D6B77A] hover:bg-[#D6B77A] hover:text-[#08090B] transition-colors shrink-0"
                        title="Open Google Meet"
                      >
                        <Video className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right (1 col): Integration & Quick Actions */}
        <div className="p-5 rounded-xl bg-[#12151A] border border-[#252A32] space-y-4">
          <div className="border-b border-[#252A32] pb-3">
            <h3 className="text-sm font-heading font-bold text-[#F5F3EE] flex items-center gap-2">
              <Link2 className="w-4 h-4 text-[#D6B77A]" />
              <span>Google Calendar Sync</span>
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#B2B4BA]">Account Connection:</span>
              <span
                className={`font-mono font-semibold ${
                  isConnected ? "text-[#10B981]" : "text-[#F06419]"
                }`}
              >
                {isConnected ? "Active" : "Not Connected"}
              </span>
            </div>

            {accounts.length > 0 ? (
              <div className="p-3 rounded-lg bg-[#0E1014] border border-[#252A32] space-y-1">
                <div className="text-xs font-medium text-[#F5F3EE] truncate">
                  {accounts[0].accountName || accounts[0].email}
                </div>
                <div className="text-[11px] font-mono text-[#777D87] truncate">
                  {accounts[0].email}
                </div>
              </div>
            ) : null}

            <p className="text-[11px] text-[#777D87] leading-relaxed">
              Google Calendar provides bidirectional sync for discovery calls, production dates, and client reviews.
            </p>

            <button
              type="button"
              onClick={() => onNavigateToTab("integrations")}
              className="w-full py-2 px-3 rounded-lg bg-[#1E232B] hover:bg-[#252A32] border border-[#252A32] text-xs font-mono text-[#F5F3EE] transition-colors"
            >
              Manage Integrations &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
