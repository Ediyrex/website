"use client";

import React, { useMemo } from "react";
import { CalendarEvent } from "../types/calendar.types";
import { CATEGORY_STYLES } from "../config/calendar.config";

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function MonthView({ currentDate, events, onSelectEvent }: MonthViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startingDayOfWeek = firstDayOfMonth.getDay();
    const daysInMonth = lastDayOfMonth.getDate();

    // Previous month padding
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }

    // Next month padding to fill complete grid of 35 or 42
    const totalSlots = days.length <= 35 ? 35 : 42;
    const remainingDays = totalSlots - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  const todayStr = useMemo(() => {
    const today = new Date();
    return `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  }, []);

  // Map events to day keys "YYYY-M-D"
  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const ev of events) {
      const d = new Date(ev.startsAt);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ev);
    }
    return map;
  }, [events]);

  return (
    <div className="bg-[#12151A] rounded-xl border border-[#252A32] overflow-hidden">
      {/* Day Headers */}
      <div className="grid grid-cols-7 border-b border-[#252A32] bg-[#0E1014]">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="py-2.5 text-center text-xs font-mono font-medium text-[#777D87] uppercase tracking-wider"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid of Days */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-[#252A32]/60">
        {calendarDays.map(({ date, isCurrentMonth }, idx) => {
          const dayKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          const isToday = dayKey === todayStr;
          const dayEvents = eventsByDay.get(dayKey) || [];

          return (
            <div
              key={idx}
              className={`min-h-[96px] sm:min-h-[120px] p-1.5 sm:p-2 transition-colors ${
                isCurrentMonth ? "bg-[#12151A]" : "bg-[#0A0C0E]/70"
              }`}
            >
              {/* Day Number */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs font-mono font-semibold w-6 h-6 flex items-center justify-center rounded-full ${
                    isToday
                      ? "bg-[#D6B77A] text-[#08090B] font-bold"
                      : isCurrentMonth
                      ? "text-[#F5F3EE]"
                      : "text-[#555A64]"
                  }`}
                >
                  {date.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] font-mono text-[#777D87] hidden sm:inline">
                    {dayEvents.length} {dayEvents.length === 1 ? "evt" : "evts"}
                  </span>
                )}
              </div>

              {/* Event Chips */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((ev) => {
                  const style = CATEGORY_STYLES[ev.category] || CATEGORY_STYLES.Other;
                  const timeLabel = new Date(ev.startsAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={() => onSelectEvent(ev)}
                      className="w-full text-left px-1.5 py-0.5 rounded text-[11px] truncate flex items-center gap-1.5 hover:opacity-85 transition-opacity"
                      style={{
                        backgroundColor: style.badgeBg,
                        border: `1px solid ${style.badgeBorder}`,
                        color: style.badgeText,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: style.dotColor }}
                      />
                      <span className="font-mono text-[9px] opacity-75 shrink-0 hidden sm:inline">
                        {timeLabel}
                      </span>
                      <span className="truncate font-medium">{ev.title}</span>
                    </button>
                  );
                })}

                {dayEvents.length > 3 && (
                  <div className="text-[10px] font-mono text-[#D6B77A] pl-1 pt-0.5">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
