import React from "react";
import type { Metadata } from "next";
import { AdminSeoClient } from "@/components/admin/AdminSeoClient";

export const metadata: Metadata = {
  title: "SEO & Metadata CMS",
  robots: { index: false, follow: false },
};

export default function AdminSeoPage() {
  return <AdminSeoClient />;
}

