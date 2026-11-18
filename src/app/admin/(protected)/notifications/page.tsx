import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminNotificationsClient } from "@/features/notifications";

export const metadata: Metadata = {
  title: "Email & Notifications | EDIYREX Studio CMS",
  description:
    "Centralized Resend transactional email delivery, outbox worker status, and notification telemetry.",
  robots: { index: false, follow: false },
};

export default function AdminNotificationsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-xs font-mono text-[#777D87]">
          Loading EDIYREX Studio Notifications Outbox...
        </div>
      }
    >
      <AdminNotificationsClient />
    </Suspense>
  );
}
