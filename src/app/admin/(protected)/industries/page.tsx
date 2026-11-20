import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminIndustriesClient } from "@/components/admin/industries/AdminIndustriesClient";

export const metadata: Metadata = {
  title: "Industries Management — EDYREX Studio Admin",
  robots: { index: false, follow: false },
};

export default function AdminIndustriesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-xs font-mono text-[#777D87]">
          Loading industries workspace...
        </div>
      }
    >
      <AdminIndustriesClient />
    </Suspense>
  );
}
