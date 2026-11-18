"use client";

import React, { useMemo } from "react";
import { CalendarEvent } from "../types/calendar.types";
import { CATEGORY_STYLES } from "../config/calendar.config";
import { Video, MapPin, Clock } from "lucide-react";

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function WeekView({ currentDate, events, onSelectEvent }: WeekViewProps) {
  // Compute the 7 dates of the current week
  const weekDays = useMemo(() => {
    const curr = new Date(currentDate);
    const dayOfWeek = curr.getDay();
    const sunday = new Date(curr);
    sunday.setDate(curr.getDate() - dayOfWeek);

    const days: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(sunday);
      d.setDate(sunday.getDate() + i);
      days.push(d);
    }
    return days;
  }, [currentDate]);

  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  }, []);

  // Map events to days
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const d = new Date(ev.startsAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    // Sort events by time
    map.forEach((list) => {
      list.sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
    });
    return map;
  }, [events]);

  return (
    <div className="bg-[#12151A] rounded-xl border border-[#252A32] overflow-hidden">
      {/* 7 Columns for Days */}
      <div className="grid grid-cols-1 md:grid-cols-7 divide-y md:divide-y-0 md:divide-x divide-[#252A32]">
        {weekDays.map((day, idx) => {
          const dayKey = `${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`;
          const isToday = dayKey === todayStr;
          const dayEvents = eventsByDay.get(dayKey) || [];

          return (
            <div key={idx} className="flex flex-col min-h-[360px] bg-[#12151A]">
              {/* Day Header */}
              <div
                className={`py-3 px-3 border-b border-[#252A32] text-center ${
                  isToday ? "bg-[#D6B77A]/10" : "bg-[#0E1014]"
                }`}
              >
                <div className="text-[11px] font-mono uppercase text-[#777D87]">
                  {WEEKDAYS[day.getDay()]}
                </div>
                <div
                  className={`text-sm font-mono font-bold mt-0.5 inline-block px-2 py-0.5 rounded-full ${
                    isToday
                      ? "bg-[#D6B77A] text-[#08090B]"
                      : "text-[#F5F3EE]"
                  }`}
                >
                  {day.getDate()} {day.toLocaleDateString(undefined, { month: "short" })}
                </div>
              </div>

              {/* Day Event List */}
              <div className="p-2 space-y-2 flex-1">
                {dayEvents.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-center p-3 text-[11px] text-[#555A64] font-mono">
                    No events
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
                      <button
                        key={ev.id}
                        type="button"
                        onClick={() => onSelectEvent(ev)}
                        className="w-full text-left p-2 rounded-lg border transition-all hover:scale-[1.01] hover:shadow-md space-y-1"
                        style={{
                          backgroundColor: style.badgeBg,
                          borderColor: style.badgeBorder,
                        }}
                      >
                        <div className="flex items-center justify-between gap-1 text-[10px] font-mono">
                          <span
                            className="inline-flex items-center gap-1 font-semibold"
                            style={{ color: style.badgeText }}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full"
                              style={{ backgroundColor: style.dotColor }}
                            />
                            {ev.category}
                          </span>
                          <span className="text-[#888E99]">
                            {startTime}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-[#F5F3EE] line-clamp-2">
                          {ev.title}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] text-[#888E99] pt-0.5">
                          {ev.meetLink ? (
                            <span className="inline-flex items-center gap-1 text-[#D6B77A]">
                              <Video className="w-3 h-3" /> Meet
                            </span>
                          ) : ev.location ? (
                            <span className="inline-flex items-center gap-1 truncate">
                              <MapPin className="w-3 h-3 shrink-0" /> {ev.location}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {startTime} - {endTime}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
