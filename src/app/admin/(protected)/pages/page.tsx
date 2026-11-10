import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminPagesClient } from "@/components/admin/AdminPagesClient";

export const metadata: Metadata = {
  title: "Pages CMS",
  robots: { index: false, follow: false },
};

export default function AdminPagesPage() {
  return (
    <Suspense>
      <AdminPagesClient />
    </Suspense>
  );
}

