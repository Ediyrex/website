import React from "react";
import type { Metadata } from "next";
import { AdminTeamClient } from "@/components/admin/AdminTeamClient";

export const metadata: Metadata = {
  title: "Team & Access CMS",
  robots: { index: false, follow: false },
};

export default function AdminTeamPage() {
  return <AdminTeamClient />;
}

