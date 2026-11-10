"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MotionConfig } from "motion/react";
import { X } from "lucide-react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyMobileCta } from "./StickyMobileCta";
import { CookieBanner } from "./CookieBanner";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";

interface PublicAnnouncement {
  title: string;
  ctaText?: string;
  ctaUrl?: string;
}

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const [announcement, setAnnouncement] = useState<PublicAnnouncement | null>(
    null
  );
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    if (isAdminRoute) return;
    let ignore = false;
    fetch("/api/v1/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!ignore && json?.data?.announcement) {
          setAnnouncement(json.data.announcement);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <MotionConfig reducedMotion="user">
      <AnalyticsProvider />
      {announcement && !bannerDismissed && (
        <div className="relative z-50 bg-[#17130C] border-b border-[#D6B77A]/35 px-4 py-2 text-center text-xs text-[#F5F3EE] flex items-center justify-center gap-3">
          <span>{announcement.title}</span>
          {announcement.ctaText && announcement.ctaUrl && (
            <Link
              href={announcement.ctaUrl}
              className="font-semibold text-[#D6B77A] hover:underline"
            >
              {announcement.ctaText} →
            </Link>
          )}
          <button
            type="button"
            onClick={() => setBannerDismissed(true)}
            aria-label="Dismiss announcement"
            className="text-[#8D939E] hover:text-[#F5F3EE] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <StickyMobileCta />
      <CookieBanner />
    </MotionConfig>
  );
}
