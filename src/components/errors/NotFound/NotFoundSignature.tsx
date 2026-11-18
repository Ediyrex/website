import React from "react";

/**
 * Bottom studio signature for 404 — Signal Lost.
 * Features:
 * - Brand identifier: `//// EDYREX / DIGITAL STUDIO`.
 * - Full-width architectural horizontal divider.
 * - Studio pillars: `BUILD × BRAND × PRODUCE × AUTOMATE`.
 */
export function NotFoundSignature() {
  return (
    <footer className="w-full z-20">
      <div className="max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-14 py-6 md:py-8 flex items-center justify-between gap-4 font-mono text-[11px] sm:text-xs">
        {/* Left Studio Identifier */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[#F06419] font-bold tracking-tight">////</span>
          <span className="text-[#F5F2EC] tracking-[0.16em] uppercase font-medium">
            EDYREX / DIGITAL STUDIO
          </span>
        </div>

        {/* Flexible Center Divider */}
        <div className="h-[1px] bg-[#383838]/80 flex-1 mx-3 sm:mx-8" />

        {/* Right Studio Philosophy */}
        <div className="flex-shrink-0 text-[#B8B9BC] tracking-[0.18em] uppercase font-medium hidden sm:block">
          BUILD × BRAND × PRODUCE × AUTOMATE
        </div>
      </div>
    </footer>
  );
}
