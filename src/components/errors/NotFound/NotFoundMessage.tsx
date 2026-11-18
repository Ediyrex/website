import React from "react";

/**
 * Main error headline and narrative for 404 — Signal Lost.
 * Features:
 * - Technical error identifier line (`ERROR 404 / PAGE NOT FOUND`).
 * - Monumental live typography `404` in Warm White.
 * - Bold italic `SIGNAL LOST.` in Signal Orange (`#F06419`).
 * - High-contrast editorial supporting paragraph.
 */
export function NotFoundMessage() {
  return (
    <div className="space-y-2 max-w-[680px]">
      {/* Technical Error Identifier */}
      <div className="flex items-center gap-4">
        <span className="text-xs sm:text-sm font-mono font-semibold uppercase tracking-[0.16em] text-[#F06419]">
          ERROR 404 / PAGE NOT FOUND
        </span>
        <div className="h-[1px] bg-[#383838] flex-1 max-w-[240px]" />
      </div>

      {/* Monumental 404 Number */}
      <div className="overflow-visible select-none -my-2 sm:-my-4">
        <h1
          style={{ fontFamily: "var(--font-archivo-black), var(--font-heading), sans-serif" }}
          className="text-[100px] sm:text-[145px] md:text-[180px] lg:text-[210px] font-black text-[#F5F2EC] leading-[0.82] tracking-tighter"
        >
          404
        </h1>
      </div>

      {/* Main Headline — SIGNAL LOST */}
      <div>
        <h2
          style={{ fontFamily: "var(--font-archivo-black), var(--font-heading), sans-serif" }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[82px] font-black italic uppercase tracking-tight text-[#F06419] leading-[0.95]"
        >
          SIGNAL LOST.
        </h2>
      </div>

      {/* Supporting Error Description */}
      <p
        style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
        className="text-sm sm:text-base lg:text-lg text-[#B8B9BC] leading-relaxed max-w-[560px] pt-2"
      >
        The page you’re looking for isn’t here — it may have been moved, updated or no longer exists.
      </p>
    </div>
  );
}
