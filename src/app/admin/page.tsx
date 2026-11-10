import React, { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getAuthenticatedSession } from "@/lib/server/session";
import { AdminDashboardClient } from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Ediyrex Studio administrative portal for managing enquiries, services, and projects.",
  robots: { index: false, follow: false },
};

async function AdminGate() {
  await connection();
  const session = await getAuthenticatedSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminDashboardClient
      user={{
        id: session.userId,
        email: session.email,
        displayName: session.displayName,
        roles: session.roles,
      }}
    />
  );
}

export default function AdminDashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08090B] flex items-center justify-center text-xs font-mono text-[#777D87]">
          Verifying administrative session...
        </div>
      }
    >
      <AdminGate />
    </Suspense>
  );
}

