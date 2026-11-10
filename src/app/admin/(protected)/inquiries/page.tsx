import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminInquiriesClient } from "@/components/admin/AdminInquiriesClient";

export const metadata: Metadata = {
  title: "Inquiries CMS",
  robots: { index: false, follow: false },
};

export default function AdminInquiriesPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-xs font-mono text-[#777D87]">
          Loading inquiries manager...
        </div>
      }
    >
      <AdminInquiriesClient />
    </Suspense>
  );
}

