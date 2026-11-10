"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";
import { SITE_CONFIG } from "@/config/site";
import { getConsentChoice } from "@/lib/analytics";

export function AnalyticsProvider() {
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

  useEffect(() => {
    const sync = () => {
      setAnalyticsAllowed(getConsentChoice() === "analytics");
    };
    sync();
    window.addEventListener("ediyrex:consent-updated", sync);
    return () => window.removeEventListener("ediyrex:consent-updated", sync);
  }, []);

  if (!analyticsAllowed) {
    return null;
  }

  const gaId = SITE_CONFIG.analytics.gaMeasurementId;
  const plausibleDomain = SITE_CONFIG.analytics.plausibleDomain;

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
