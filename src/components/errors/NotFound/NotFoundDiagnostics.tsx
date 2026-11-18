"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Right-side technical monitoring overlay for 404 — Signal Lost.
 * Features:
 * - Industrial HUD aesthetic with Signal Orange corner framing brackets.
 * - Dynamic requested path resolution with SSRF and XSS sanitization.
 * - Live interactive recovery jump routes.
 * - Translucent surface preserving the dark concrete architectural backdrop.
 */
export function NotFoundDiagnostics({ className }: { className?: string }) {
  const pathname = usePathname();
  const [safePath, setSafePath] = useState<string>("/unavailable-path");

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = pathname || window.location.pathname || "";
        // Sanitize path to prevent any script or markup injection
        const cleaned = raw.replace(/[^\w\-/.]/g, "").slice(0, 36);
        setSafePath(cleaned || "/404");
      } catch {
        setSafePath("UNAVAILABLE");
      }
    }
  }, [pathname]);

  return (
    <div
      className={cn(
        "relative w-full max-w-[280px] p-5 sm:p-6 bg-[#0E1012]/65 backdrop-blur-md border border-[#383838]/60 rounded-[8px] text-left select-none transition-all duration-300",
        className
      )}
    >
      {/* HUD Corner Framing Brackets in Signal Orange */}
      <span className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-[#F06419]" />
      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-[#F06419]" />
      <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-[#F06419]" />
      <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-[#F06419]" />

      <div className="space-y-4 font-mono">
        {/* Block 01: Page Status */}
        <div className="space-y-1">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#898D94] block">
            // PAGE STATUS
          </span>
          <span className="text-sm sm:text-base font-bold text-[#F06419] tracking-wider block">
            NOT FOUND
          </span>
        </div>

        <div className="h-[1px] bg-[#383838]/80 w-full" />

        {/* Block 02: Error Code */}
        <div className="space-y-1">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#898D94] block">
            // ERROR CODE
          </span>
          <span className="text-sm sm:text-base font-medium text-[#F5F2EC] tracking-wider block">
            404
          </span>
        </div>

        <div className="h-[1px] bg-[#383838]/80 w-full" />

        {/* Block 03: Requested Path */}
        <div className="space-y-1">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#898D94] block">
            // REQUESTED PATH
          </span>
          <span
            className="text-xs sm:text-sm font-normal text-[#B8B9BC] truncate block max-w-full"
            title={safePath}
          >
            {safePath}
          </span>
        </div>

        <div className="h-[1px] bg-[#383838]/80 w-full" />

        {/* Block 04: Suggested Actions / Next Action */}
        <div className="space-y-2">
          <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-[#898D94] block">
            // NEXT ACTION
          </span>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[#F5F2EC]">
            <Link
              href="/"
              className="hover:text-[#F06419] transition-colors focus-visible:outline-none focus-visible:underline"
            >
              RETURN
            </Link>
            <span className="text-[#383838]">/</span>
            <Link
              href="/work"
              className="hover:text-[#F06419] transition-colors focus-visible:outline-none focus-visible:underline"
            >
              EXPLORE
            </Link>
            <span className="text-[#383838]">/</span>
            <Link
              href="/contact"
              className="hover:text-[#F06419] transition-colors focus-visible:outline-none focus-visible:underline"
            >
              CONTACT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
