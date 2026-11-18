import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

/**
 * Primary and Secondary recovery actions for 404 — Signal Lost.
 * Features:
 * - High-contrast Signal Orange primary CTA (`/`).
 * - Translucent industrial brutalist secondary CTA (`/work`).
 * - Animated arrow hover microinteractions.
 * - Responsive desktop horizontal row / mobile vertical stack.
 */
export function NotFoundActions() {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-3 sm:pt-4">
      {/* Primary Action — Return to Home */}
      <Link
        href="/"
        className="group inline-flex items-center justify-center gap-2.5 bg-[#F06419] hover:bg-[#ff762b] text-[#101113] font-bold text-sm sm:text-base px-7 py-4 sm:py-4.5 rounded-[12px] transition-all duration-200 shadow-lg shadow-[#F06419]/25 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        <span>Return to Home</span>
        <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>

      {/* Secondary Action — Explore Our Work */}
      <Link
        href="/work"
        className="group inline-flex items-center justify-center gap-2.5 bg-[#101113]/80 hover:bg-[#15171C] text-[#F5F2EC] hover:text-white border border-[#383838] hover:border-[#F06419]/70 font-semibold text-sm sm:text-base px-7 py-4 sm:py-4.5 rounded-[12px] transition-all duration-200 backdrop-blur-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419]"
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
      >
        <span>Explore Our Work</span>
        <ArrowUpRight className="w-4 h-4 text-[#898D94] group-hover:text-[#F06419] transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  );
}
