import React, { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { getAuthenticatedSession } from "@/lib/server/session";
import { AdminProvider } from "@/components/admin/AdminContext";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: "Ediyrex CMS",
  description:
    "Ediyrex Studio content management portal for projects, services, inquiries, media, and website settings.",
  robots: { index: false, follow: false },
};

async function ProtectedAdminGate({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  const session = await getAuthenticatedSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <AdminProvider
      user={{
        id: session.userId,
        email: session.email,
        displayName: session.displayName,
        roles: session.roles,
      }}
    >
      <AdminShell>{children}</AdminShell>
    </AdminProvider>
  );
}

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08090B] flex items-center justify-center text-xs font-mono text-[#777D87]">
          Verifying administrative session...
        </div>
      }
    >
      <ProtectedAdminGate>{children}</ProtectedAdminGate>
    </Suspense>
  );
}

