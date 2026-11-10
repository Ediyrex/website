import React from "react";
import type { Metadata } from "next";
import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";

export const metadata: Metadata = {
  title: "CMS Overview",
  robots: { index: false, follow: false },
};

export default function AdminOverviewPage() {
  return <AdminOverviewClient />;
}

