"use client";

import React, { useEffect } from "react";
import { CalendarEvent } from "../types/calendar.types";
import { CATEGORY_STYLES } from "../config/calendar.config";
import {
  X,
  Clock,
  MapPin,
  Video,
  Users,
  ExternalLink,
  Mail,
  Calendar as CalendarIcon,
} from "lucide-react";

interface EventDetailsDrawerProps {
  event: CalendarEvent | null;
  onClose: () => void;
}

export function EventDetailsDrawer({ event, onClose }: EventDetailsDrawerProps) {
  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (event) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [event, onClose]);

  if (!event) return null;

  const style = CATEGORY_STYLES[event.category] || CATEGORY_STYLES.Other;

  const startDate = new Date(event.startsAt);
  const endDate = new Date(event.endsAt);

  const formattedDate = startDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedStartTime = startDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const formattedEndTime = endDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Calculate duration in minutes
  const durationMinutes = Math.round(
    (endDate.getTime() - startDate.getTime()) / (1000 * 60)
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-event-title"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-[#0E1014] border-l border-[#252A32] h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="py-4 px-6 border-b border-[#252A32] flex items-center justify-between bg-[#12151A]">
          <span
            className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold"
            style={{
              backgroundColor: style.badgeBg,
              border: `1px solid ${style.badgeBorder}`,
              color: style.badgeText,
            }}
          >
            {event.category}
          </span>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#252A32]/60 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Title */}
          <div>
            <h2
              id="drawer-event-title"
              className="text-xl sm:text-2xl font-heading font-extrabold text-[#F5F3EE] tracking-tight leading-snug"
            >
              {event.title}
            </h2>
          </div>

          {/* Date & Time Meta */}
          <div className="p-4 rounded-xl bg-[#12151A] border border-[#252A32] space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-[#F5F3EE]">
              <CalendarIcon className="w-4 h-4 text-[#D6B77A] shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-[#B2B4BA]">
              <Clock className="w-4 h-4 text-[#777D87] shrink-0" />
              <span>
                {formattedStartTime} – {formattedEndTime} ({durationMinutes} mins)
              </span>
            </div>
            {event.timeZone && (
              <div className="text-[11px] font-mono text-[#777D87] pl-6.5">
                Timezone: {event.timeZone}
              </div>
            )}
          </div>

          {/* Actions: Google Meet & Calendar */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            {event.meetLink && (
              <a
                href={event.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#D6B77A] text-[#08090B] font-semibold text-xs font-mono hover:bg-[#E5CCA0] transition-colors shadow-sm"
              >
                <Video className="w-4 h-4" />
                <span>Join Google Meet</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {event.htmlLink && (
              <a
                href={event.htmlLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#12151A] border border-[#252A32] text-[#F5F3EE] hover:border-[#D6B77A]/50 text-xs font-mono transition-colors"
              >
                <span>Open in Calendar</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#777D87]" />
              </a>
            )}
          </div>

          {/* Location */}
          {event.location && (
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#777D87] block">
                Location
              </span>
              <div className="flex items-center gap-2 text-xs text-[#F5F3EE]">
                <MapPin className="w-4 h-4 text-[#D6B77A] shrink-0" />
                <span>{event.location}</span>
              </div>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div className="space-y-1.5">
              <span className="text-xs font-mono uppercase tracking-wider text-[#777D87] block">
                Description
              </span>
              <div className="p-3.5 rounded-xl bg-[#12151A] border border-[#252A32] text-xs text-[#B2B4BA] leading-relaxed whitespace-pre-wrap">
                {event.description}
              </div>
            </div>
          )}

          {/* Attendees */}
          {event.attendees && event.attendees.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-[#777D87]">
                <span className="uppercase tracking-wider">Attendees</span>
                <span>{event.attendees.length} people</span>
              </div>

              <div className="divide-y divide-[#252A32] rounded-xl bg-[#12151A] border border-[#252A32] overflow-hidden">
                {event.attendees.map((att) => (
                  <div
                    key={att.email}
                    className="p-3 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="min-w-0">
                      <div className="text-[#F5F3EE] font-medium truncate">
                        {att.displayName || att.email}
                      </div>
                      {att.displayName && (
                        <div className="text-[11px] font-mono text-[#777D87] truncate">
                          {att.email}
                        </div>
                      )}
                    </div>

                    {att.responseStatus && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded capitalize ${
                          att.responseStatus === "accepted"
                            ? "bg-[#10B981]/15 text-[#10B981]"
                            : att.responseStatus === "declined"
                            ? "bg-[#EF4444]/15 text-[#EF4444]"
                            : "bg-[#777D87]/15 text-[#B2B4BA]"
                        }`}
                      >
                        {att.responseStatus}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Creator / Organizer */}
          {event.creatorEmail && (
            <div className="pt-2 border-t border-[#252A32] flex items-center gap-2 text-xs text-[#777D87] font-mono">
              <Mail className="w-3.5 h-3.5" />
              <span>Created by: {event.creatorEmail}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
