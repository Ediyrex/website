"use client";

import React, { useEffect, useState, useRef } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import { X, Calendar, ExternalLink, Loader2 } from "lucide-react";
import type { BookingPrefill } from "../types/booking.types";
import { BOOKING_CONFIG, getFullBookingUrl } from "../config/booking.config";

interface CalBookingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  calLink: string;
  prefill?: BookingPrefill;
  title?: string;
  description?: string;
}

export function CalBookingDialog({
  isOpen,
  onClose,
  calLink,
  prefill,
  title = "Schedule a Discovery Call",
  description = "Select a live date & time below for a 30-minute Google Meet consultation with EDYREX Studio.",
}: CalBookingDialogProps) {
  const [calReady, setCalReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Initialize Cal.com Embed UI
  useEffect(() => {
    let active = true;

    async function initCal() {
      try {
        const cal = await getCalApi();
        if (!active) return;

        cal("ui", {
          theme: BOOKING_CONFIG.theme,
          styles: {
            branding: {
              brandColor: BOOKING_CONFIG.brandColor,
            },
          },
          hideEventTypeDetails: false,
          layout: BOOKING_CONFIG.layout,
        });

        // Listen for booking successful event
        cal("on", {
          action: "bookingSuccessful",
          callback: () => {
            // Give user a moment to see confirmation before auto-closing or let user close
          },
        });

        setCalReady(true);
      } catch (err) {
        console.warn("Cal embed initialization warning:", err);
        if (active) {
          setHasError(true);
          setCalReady(true);
        }
      }
    }

    initCal();

    return () => {
      active = false;
    };
  }, []);

  // Keyboard accessibility: Escape to close
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Body scroll locking & Focus management
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      closeButtonRef.current?.focus();

      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const externalUrl = getFullBookingUrl(calLink);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cal-dialog-title"
      aria-describedby="cal-dialog-description"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-8 animate-fadeIn"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#08090B]/85 backdrop-blur-md transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Surface */}
      <div
        ref={dialogRef}
        className="relative z-10 w-full max-w-4xl max-h-[92vh] sm:max-h-[88vh] rounded-2xl bg-[#08090B] border border-[#252A32] shadow-[0_24px_64px_-12px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-[#F5F3EE]"
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 sm:py-5 border-b border-[#252A32] bg-[#12151A]/80 backdrop-blur-sm shrink-0">
          <div className="space-y-1 pr-4 min-w-0">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D6B77A] inline-block animate-pulse" />
              <span className="text-[11px] font-mono font-bold uppercase tracking-[0.18em] text-[#D6B77A]">
                DISCOVERY CALL · 30 MIN
              </span>
            </div>
            <h2
              id="cal-dialog-title"
              className="font-heading font-extrabold text-lg sm:text-xl text-[#F5F3EE] tracking-tight truncate"
            >
              {title}
            </h2>
            <p
              id="cal-dialog-description"
              className="text-xs text-[#B2B4BA] hidden sm:block truncate"
            >
              {description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Fallback Direct Link */}
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#252A32] bg-[#0E1012] text-xs font-mono text-[#B2B4BA] hover:text-[#F5F3EE] hover:border-[#3D4450] transition-colors"
              title="Open Cal.com in a new tab"
            >
              <span>Direct Link</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            {/* Accessible Close Button */}
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close booking modal"
              className="w-9 h-9 rounded-lg border border-[#252A32] bg-[#12151A] hover:bg-[#1E232B] text-[#B2B4BA] hover:text-[#F5F3EE] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Embed Body Container */}
        <div className="relative flex-1 w-full overflow-y-auto min-h-[500px] sm:min-h-[580px] bg-[#08090B]">
          {!calReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#08090B] text-[#B2B4BA] z-10">
              <Loader2 className="w-6 h-6 animate-spin text-[#D6B77A]" />
              <span className="text-xs font-mono">Loading real-time availability...</span>
            </div>
          )}

          {hasError ? (
            <div className="p-8 text-center space-y-4 max-w-md mx-auto my-auto pt-16">
              <div className="w-12 h-12 rounded-full bg-[#E85D04]/10 border border-[#E85D04]/30 flex items-center justify-center mx-auto text-[#E85D04]">
                <Calendar className="w-6 h-6" />
              </div>
              <h3 className="font-heading font-bold text-lg text-[#F5F3EE]">
                Booking System Available
              </h3>
              <p className="text-sm text-[#B2B4BA] leading-relaxed">
                The embedded scheduling view could not load in your current browser session. You can open the live calendar directly.
              </p>
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E85D04] hover:bg-[#F97316] text-[#07090D] font-semibold text-sm transition-all shadow-lg"
              >
                <span>Open Calendar in New Tab</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="w-full h-full min-h-[500px] sm:min-h-[580px]">
              <Cal
                calLink={calLink}
                style={{ width: "100%", height: "100%", overflow: "auto" }}
                config={{
                  layout: BOOKING_CONFIG.layout,
                  theme: BOOKING_CONFIG.theme,
                  name: prefill?.name,
                  email: prefill?.email,
                  notes: prefill?.notes,
                  guests: prefill?.guests,
                }}
              />
            </div>
          )}
        </div>

        {/* Footer Bar */}
        <div className="px-5 sm:px-7 py-3 border-t border-[#252A32] bg-[#0C0E12] flex items-center justify-between text-[11px] font-mono text-[#777D87] shrink-0">
          <span>Synced with Google Meet &amp; Calendar</span>
          <span>EDYREX STUDIO · DISCOVERY</span>
        </div>
      </div>
    </div>
  );
}
