import React from "react";
import type { Metadata } from "next";
import { AdminActivityClient } from "@/components/admin/AdminActivityClient";

export const metadata: Metadata = {
  title: "Activity Log CMS",
  robots: { index: false, follow: false },
};

export default function AdminActivityPage() {
  return <AdminActivityClient />;
}

