import React from "react";
import type { Metadata } from "next";
import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";

export const metadata: Metadata = {
  title: "CMS Dashboard",
  robots: { index: false, follow: false },
};

export default function AdminDashboardAliasPage() {
  return <AdminOverviewClient />;
}

