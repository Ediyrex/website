import React from "react";
import type { Metadata } from "next";
import { AdminMediaClient } from "@/components/admin/AdminMediaClient";

export const metadata: Metadata = {
  title: "Media Library CMS",
  robots: { index: false, follow: false },
};

export default function AdminMediaPage() {
  return <AdminMediaClient />;
}

