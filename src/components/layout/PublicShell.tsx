"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { StickyMobileCta } from "./StickyMobileCta";
import { CookieBanner } from "./CookieBanner";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";

export function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <AnalyticsProvider />
      <Header />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
      <StickyMobileCta />
      <CookieBanner />
    </>
  );
}
