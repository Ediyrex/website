import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminTasksClient } from "@/components/admin/AdminTasksClient";

export const metadata: Metadata = {
  title: "Tasks",
  robots: { index: false, follow: false },
};

export default function AdminTasksPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-xs font-mono text-[#777D87]">
          Loading Tasks...
        </div>
      }
    >
      <AdminTasksClient
        basePath="/admin/tasks"
        defaultView="my-tasks"
        titleOverride="Tasks"
        descriptionOverride="Track and manage team assignments, deliverables, and operational progress."
      />
    </Suspense>
  );
}
