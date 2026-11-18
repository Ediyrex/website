"use client";

import React, { useMemo } from "react";
import { CalendarEvent } from "../types/calendar.types";
import { CATEGORY_STYLES } from "../config/calendar.config";
import { Video, MapPin, Clock, Users, ArrowUpRight } from "lucide-react";

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

export function DayView({ currentDate, events, onSelectEvent }: DayViewProps) {
  const dayStr = useMemo(() => {
    return `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
  }, [currentDate]);

  const dayEvents = useMemo(() => {
    return events
      .filter((ev) => {
        const d = new Date(ev.startsAt);
        return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}` === dayStr;
      })
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [events, dayStr]);

  const formattedDate = currentDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-[#12151A] rounded-xl border border-[#252A32] overflow-hidden">
      {/* Date Header */}
      <div className="py-4 px-6 border-b border-[#252A32] bg-[#0E1014] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-lg font-heading font-bold text-[#F5F3EE]">
            {formattedDate}
          </h2>
          <p className="text-xs font-mono text-[#777D87]">
            {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"} scheduled
          </p>
        </div>
      </div>

      {/* Events Agenda */}
      <div className="p-4 sm:p-6 space-y-4">
        {dayEvents.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Clock className="w-8 h-8 text-[#555A64] mx-auto" />
            <p className="text-sm font-mono text-[#777D87]">
              No events scheduled for this day
            </p>
          </div>
        ) : (
          dayEvents.map((ev) => {
            const style = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES.Other;
            const startTime = new Date(ev.startsAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            const endTime = new Date(ev.endsAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={ev.id}
                onClick={() => onSelectEvent(ev)}
                className="cursor-pointer p-4 rounded-xl border transition-all hover:border-[#D6B77A]/60 bg-[#161A20] flex flex-col md:flex-row md:items-start justify-between gap-4 group"
                style={{
                  borderLeftWidth: "4px",
                  borderLeftColor: style.dotColor,
                }}
              >
                {/* Left: Time and Title */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold"
                      style={{
                        backgroundColor: style.badgeBg,
                        border: `1px solid ${style.badgeBorder}`,
                        color: style.badgeText,
                      }}
                    >
                      {ev.category}
                    </span>

                    <span className="text-xs font-mono text-[#D6B77A] flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {startTime} – {endTime}
                    </span>
                  </div>

                  <h3 className="text-base font-heading font-bold text-[#F5F3EE] group-hover:text-[#D6B77A] transition-colors">
                    {ev.title}
                  </h3>

                  {ev.description && (
                    <p className="text-xs sm:text-sm text-[#B2B4BA] line-clamp-2">
                      {ev.description}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-[#888E99] pt-1">
                    {ev.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#D6B77A]" />
                        {ev.location}
                      </span>
                    )}

                    {ev.attendees && ev.attendees.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-[#777D87]" />
                        {ev.attendees.length} {ev.attendees.length === 1 ? "attendee" : "attendees"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-start md:self-center shrink-0">
                  {ev.meetLink && (
                    <a
                      href={ev.meetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D6B77A]/15 border border-[#D6B77A]/30 text-xs font-mono text-[#D6B77A] hover:bg-[#D6B77A] hover:text-[#08090B] font-semibold transition-all"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Meet</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectEvent(ev)}
                    className="px-3 py-1.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs font-mono text-[#B2B4BA] hover:text-[#F5F3EE] hover:border-[#D6B77A]/40 transition-colors"
                  >
                    Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
