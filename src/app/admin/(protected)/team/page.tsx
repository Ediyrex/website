import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminTeamClient } from "@/components/admin/AdminTeamClient";

export const metadata: Metadata = {
  title: "Team & Access Control | EDIYREX Admin",
  robots: { index: false, follow: false },
};

export default function AdminTeamPage() {
  return (
    <Suspense
      fallback={
        <div className="rounded-2xl border border-white/10 bg-[#121216] p-10 text-center text-xs text-neutral-400">
          Loading Team & Access Control Center...
        </div>
      }
    >
      <AdminTeamClient />
    </Suspense>
  );
}
