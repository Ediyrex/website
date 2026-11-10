import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminServicesClient } from "@/components/admin/AdminServicesClient";

export const metadata: Metadata = {
  title: "Services CMS",
  robots: { index: false, follow: false },
};

export default function AdminServicesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-xs font-mono text-[#777D87]">
          Loading services editor...
        </div>
      }
    >
      <AdminServicesClient />
    </Suspense>
  );
}

