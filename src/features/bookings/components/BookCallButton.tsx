"use client";

import React, { useRef } from "react";
import { Calendar, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookingModal } from "../context/BookingContext";
import type { BookingPrefill } from "../types/booking.types";

export interface BookCallButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "navbar" | "navbar-light" | "outline" | "editorial";
  size?: "sm" | "md" | "lg";
  calLink?: string;
  prefill?: BookingPrefill;
  showIcon?: boolean;
}

/**
 * High-speed booking trigger button:
 * - "Replay in 100 ms": duration-75 active:scale-[0.97]
 * - "Press before the lift": opens modal on pointerdown, eliminating tap-release delay
 */
export function BookCallButton({
  variant = "primary",
  size = "md",
  calLink,
  prefill,
  showIcon = true,
  children,
  className,
  onClick,
  onPointerDown,
  ...props
}: BookCallButtonProps) {
  const { openBookingModal } = useBookingModal();
  const openedOnPressRef = useRef(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    onPointerDown?.(e);
    if (e.button === 0) {
      openedOnPressRef.current = true;
      openBookingModal({ calLink, prefill });
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e);
    if (!e.defaultPrevented && !openedOnPressRef.current) {
      openBookingModal({ calLink, prefill });
    }
    openedOnPressRef.current = false;
  };

  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-all duration-75 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A] disabled:opacity-50 disabled:pointer-events-none cursor-pointer";

  const sizeStyles = {
    sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
    md: "h-10 px-5 text-sm rounded-[8px] gap-2",
    lg: "h-12 px-6 text-base rounded-xl gap-2.5",
  };

  const variantStyles = {
    primary:
      "bg-[#E85D04] hover:bg-[#F97316] text-[#07090D] shadow-lg shadow-[#E85D04]/20",
    navbar:
      "border border-[#F06419] bg-transparent text-[#F5F2EC] hover:bg-[#F06419]/10 hover:border-[#FF7A29]",
    "navbar-light":
      "bg-[#0B0D10] text-white hover:bg-[#1F242B]",
    outline:
      "border border-[#252A32] bg-[#12151A] hover:bg-[#1C2028] text-[#F5F3EE] hover:border-[#3D4450]",
    editorial:
      "border border-[#D6B77A]/40 bg-[#D6B77A]/10 hover:bg-[#D6B77A]/20 text-[#D6B77A] font-mono text-xs uppercase tracking-wider",
  };

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      className={cn(baseStyles, sizeStyles[size], variantStyles[variant], className)}
      {...props}
    >
      {showIcon && variant === "navbar" && (
        <Calendar className="w-4 h-4 text-[#F06419] shrink-0" />
      )}
      {children || <span>Book a Call ↗</span>}
      {showIcon && variant === "navbar-light" && (
        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
      )}
    </button>
  );
}
