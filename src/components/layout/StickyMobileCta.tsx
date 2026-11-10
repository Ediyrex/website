"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

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
      <Button href="/contact" size="md" variant="primary" className="w-full">
        <span>Book a discovery call</span>
        <ArrowUpRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
