import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminCalendarClient } from "@/features/calendar";

export const metadata: Metadata = {
  title: "Calendar & Schedule | EDIYREX Studio CMS",
  description: "Centralized Google Calendar management, client discovery calls, and studio operations.",
  robots: { index: false, follow: false },
};

export default function AdminCalendarPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-xs font-mono text-[#777D87]">
          Loading EDIYREX Studio Calendar &amp; Scheduling...
        </div>
      }
    >
      <AdminCalendarClient />
    </Suspense>
  );
}
