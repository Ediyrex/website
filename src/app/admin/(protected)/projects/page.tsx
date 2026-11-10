import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminProjectsClient } from "@/components/admin/AdminProjectsClient";

export const metadata: Metadata = {
  title: "Projects CMS",
  robots: { index: false, follow: false },
};

export default function AdminProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-xs font-mono text-[#777D87]">
          Loading projects editor...
        </div>
      }
    >
      <AdminProjectsClient />
    </Suspense>
  );
}

