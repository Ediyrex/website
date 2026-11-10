import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";

export const metadata: Metadata = {
  title: "Website Settings CMS",
  robots: { index: false, follow: false },
};

export default function AdminSettingsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-xs font-mono text-[#777D87]">
          Loading website settings...
        </div>
      }
    >
      <AdminSettingsClient />
    </Suspense>
  );
}
