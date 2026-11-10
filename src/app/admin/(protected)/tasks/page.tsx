import React from "react";
import type { Metadata } from "next";
import { AdminTasksClient } from "@/components/admin/AdminTasksClient";

export const metadata: Metadata = {
  title: "Projects & Tasks CMS",
  robots: { index: false, follow: false },
};

export default function AdminTasksPage() {
  return <AdminTasksClient />;
}

