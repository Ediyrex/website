import React from "react";
import type { Metadata } from "next";
import { AdminOverviewClient } from "@/components/admin/AdminOverviewClient";

export const metadata: Metadata = {
  title: "Studio Command Center · EDYREX Admin",
  robots: { index: false, follow: false },
};

export default function AdminOverviewRoute() {
  return <AdminOverviewClient />;
}
