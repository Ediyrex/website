"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cookie } from "lucide-react";
import { getConsentChoice, setConsentChoice } from "@/lib/analytics";

export function CookieBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = getConsentChoice();
    if (!existing) {
      const timer = setTimeout(() => setVisible(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  if (!visible || pathname.startsWith("/admin")) {
    return null;
  }

  const handleSelect = (choice: "essential" | "analytics") => {
    setConsentChoice(choice);
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie Preferences"
      className="fixed bottom-16 md:bottom-5 right-4 left-4 md:left-auto md:max-w-md z-40 rounded-2xl bg-[#12151A]/95 backdrop-blur-md border border-[#252A32] p-5 shadow-2xl space-y-3.5"
    >
      <div className="flex items-start gap-3">
        <Cookie className="w-4 h-4 text-[#D6B77A] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs leading-relaxed">
          <p className="font-medium text-[#F5F3EE]">Privacy &amp; Cookies</p>
          <p className="text-[#B2B4BA]">
            Ediyrex uses essential storage for site functionality and optional privacy-friendly analytics only if you agree.{" "}
            <Link
              href="/privacy"
              className="text-[#D6B77A] underline hover:text-[#E6CC99]"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      <div className="flex items-center justify-end gap-2.5">
        <button
          type="button"
          onClick={() => handleSelect("essential")}
          className="h-9 px-3.5 rounded-[8px] border border-[#3A414B] bg-[#0D0F12] text-xs font-medium text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors cursor-pointer"
        >
          Essential only
        </button>
        <button
          type="button"
          onClick={() => handleSelect("analytics")}
          className="h-9 px-3.5 rounded-[8px] bg-[#D6B77A] hover:bg-[#E6CC99] text-xs font-semibold text-[#17130B] transition-colors cursor-pointer"
        >
          Accept analytics
        </button>
      </div>
    </div>
  );
}
