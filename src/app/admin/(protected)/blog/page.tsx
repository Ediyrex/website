import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminBlogClient } from "@/components/admin/AdminBlogClient";

export const metadata: Metadata = {
  title: "Blog & Insights CMS",
  robots: { index: false, follow: false },
};

export default function AdminBlogPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-xs font-mono text-[#777D87]">
          Loading blog editor...
        </div>
      }
    >
      <AdminBlogClient />
    </Suspense>
  );
}

