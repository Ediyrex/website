"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Calendar } from "lucide-react";
import { BookCallButton } from "@/features/bookings";

/**
 * Sticky Mobile CTA bar displayed at viewport bottom on small devices.
 * Automatically hides when already on conversion routes (`/contact`, `/thank-you`)
 * or within the administrative shell.
 */
export function StickyMobileCta() {
  const pathname = usePathname();
  const hiddenRoutes = ["/contact", "/thank-you"];
  const shouldHide =
    pathname.startsWith("/admin") || hiddenRoutes.includes(pathname);

  if (shouldHide) return null;

  return (
    <div
      role="region"
      aria-label="Quick Mobile Actions"
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-[#08090B]/95 backdrop-blur-md border-t border-[#252A32] px-4 py-2.5 safe-area-bottom shadow-2xl"
    >
      <div className="flex items-center gap-2.5">
        <Link
          href="/contact"
          className="flex-1 flex items-center justify-center gap-1.5 h-11 px-4 rounded-[10px] bg-[#F06419] hover:bg-[#ff762b] text-[#101113] font-bold text-xs uppercase tracking-wider transition-all duration-150 shadow-md shadow-[#F06419]/25 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <span>Start Project</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
        <BookCallButton
          size="md"
          variant="outline"
          className="flex-1 h-11 px-3 rounded-[10px] border border-[#383838] bg-[#12151A] text-[#F5F2EC] hover:bg-[#1A1D24] text-xs font-semibold"
        >
          <Calendar className="w-3.5 h-3.5 mr-1 text-[#D6B77A]" />
          <span>Book a Call</span>
        </BookCallButton>
      </div>
    </div>
  );
}
