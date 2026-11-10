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

  if (!analyticsAllowed || !SITE_CONFIG.analytics.plausibleDomain) {
    return null;
  }

  return (
    <Script
      defer
      data-domain={SITE_CONFIG.analytics.plausibleDomain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}

