import React from "react";

export function EdiYrexCore() {
  return (
    <div
      data-os-core
      className="group relative z-20 w-[160px] h-[160px] sm:w-[180px] sm:h-[180px] xl:w-[196px] xl:h-[196px] rounded-[28px] p-5 flex flex-col items-center justify-center gap-3 border border-[#FFB36B]/70 shadow-[0_24px_56px_-10px_rgba(243,107,22,0.48),inset_0_1.5px_2px_rgba(255,235,215,0.65)] transition-all duration-300 ease-out hover:scale-[1.03] hover:shadow-[0_28px_64px_-8px_rgba(243,107,22,0.65)]"
      style={{
        background:
          "radial-gradient(circle at 68% 36%, rgba(255,154,82,0.92) 0%, rgba(243,107,22,0.95) 38%, rgba(36,24,16,0.98) 88%)",
      }}
    >
      {/* Glass Rim Highlight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[28px] bg-gradient-to-br from-white/20 via-transparent to-black/30"
      />

      {/* Brand Emblem (Three Slanted Studio Bars) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 40 32"
        fill="none"
        className="relative z-10 w-9 h-7 text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.3)]"
      >
        <path d="M10 6L28 2L25 8L7 12L10 6Z" fill="currentColor" />
        <path
          d="M8 15L29 10L26 16L5 21L8 15Z"
          fill="currentColor"
          fillOpacity="0.92"
        />
        <path
          d="M6 24L25 19L22 25L3 30L6 24Z"
          fill="currentColor"
          fillOpacity="0.82"
        />
      </svg>

      {/* Approved EDIYREX Wordmark */}
      <span
        style={{ fontFamily: "var(--font-space-grotesk)" }}
        className="relative z-10 text-[22px] sm:text-[25px] font-bold tracking-[0.04em] text-white leading-none"
      >
        EDIYREX
      </span>
    </div>
  );
}

