import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminTasksClient } from "@/components/admin/AdminTasksClient";

export const metadata: Metadata = {
  title: "Projects & Tasks PMS",
  robots: { index: false, follow: false },
};

export default function AdminTasksPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-xs font-mono text-[#777D87]">
          Loading EDIYREX Studio PMS...
        </div>
      }
    >
      <AdminTasksClient />
    </Suspense>
  );
}
