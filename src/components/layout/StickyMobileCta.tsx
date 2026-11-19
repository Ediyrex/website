"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Calendar } from "lucide-react";
import { BookCallButton } from "@/features/bookings";

export function StickyMobileCta() {
  const pathname = usePathname();
  const hiddenRoutes = ["/contact", "/thank-you"];
  const shouldHide =
    pathname.startsWith("/admin") || hiddenRoutes.includes(pathname);

  if (shouldHide) return null;

  return (
    <div
      role="region"
      aria-label="Quick Contact Action"
      className="fixed bottom-0 left-0 right-0 z-30 md:hidden bg-[#08090B]/95 backdrop-blur-md border-t border-[#252A32] px-4 py-3"
    >
      <BookCallButton size="md" variant="primary" className="w-full">
        <Calendar className="w-4 h-4 mr-1 text-[#07090D]" />
        <span>Book a Call</span>
      </BookCallButton>
    </div>
  );
}


