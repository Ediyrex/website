import React, { Suspense } from "react";
import type { Metadata } from "next";
import { AdminTasksClient } from "@/components/admin/AdminTasksClient";

export const metadata: Metadata = {
  title: "Project Management",
  robots: { index: false, follow: false },
};

export default function AdminProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-xs font-mono text-[#777D87]">
          Loading Project Management...
        </div>
      }
    >
      <AdminTasksClient
        basePath="/admin/projects"
        defaultView="overview"
        titleOverride="Project Management"
        descriptionOverride="Manage internal project execution, tasks, milestones, team assignments and delivery."
      />
    </Suspense>
  );
}
