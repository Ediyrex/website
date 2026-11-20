"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "@/config/site";
import { getConsentChoice } from "@/lib/analytics";

export function AnalyticsProvider() {
  const pathname = usePathname();
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  // 1. First-party Realtime Visitor Ping (anonymized, server-side session ring)
  useEffect(() => {
    // Only track public client-facing pages, ignore /admin pages
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    try {
      const payload = {
        path: pathname,
        referrer: typeof document !== "undefined" ? document.referrer || null : null,
        device:
          typeof window !== "undefined"
            ? window.innerWidth < 768
              ? "Mobile"
              : window.innerWidth < 1024
              ? "Tablet"
              : "Desktop"
            : "Desktop",
      };

      if (typeof navigator !== "undefined" && navigator.sendBeacon) {
        navigator.sendBeacon(
          "/api/v1/analytics/track",
          new Blob([JSON.stringify(payload)], { type: "application/json" })
        );
      } else {
        fetch("/api/v1/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      }
    } catch {
      // quiet
    }
  }, [pathname]);

  // 2. Third-party cookie / tracking consent
  useEffect(() => {
    const sync = () => {
      setAnalyticsAllowed(getConsentChoice() === "analytics");
    };
    sync();
    window.addEventListener("ediyrex:consent-updated", sync);
    return () => window.removeEventListener("ediyrex:consent-updated", sync);
  }, []);

  const gaId = SITE_CONFIG.analytics.gaMeasurementId;
  const plausibleDomain = SITE_CONFIG.analytics.plausibleDomain;

  if (!analyticsAllowed) {
    return null;
  }

  return (
    <>
      {plausibleDomain && (
        <Script
          defer
          data-domain={plausibleDomain}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      )}
      {gaId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
            strategy="afterInteractive"
          />
          <Script id="ediyrex-ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', ${JSON.stringify(gaId)}, { anonymize_ip: true });`}
          </Script>
        </>
      )}
    </>
  );
}
