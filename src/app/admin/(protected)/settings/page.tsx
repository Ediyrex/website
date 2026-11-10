import React from "react";
import type { Metadata } from "next";
import { AdminSettingsClient } from "@/components/admin/AdminSettingsClient";

export const metadata: Metadata = {
  title: "Website Settings CMS",
  robots: { index: false, follow: false },
};

export default function AdminSettingsPage() {
  return <AdminSettingsClient />;
}

