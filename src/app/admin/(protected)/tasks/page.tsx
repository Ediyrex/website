import React, { Suspense } from "react";
import type { Metadata } from "next";
import { TasksOverviewView } from "@/components/admin/tasks/TasksOverviewView";

export const metadata: Metadata = {
  title: "Tasks",
  robots: { index: false, follow: false },
};

export default function AdminTasksPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-xs font-mono text-[#898D94]">
          Loading Tasks Workspace...
        </div>
      }
    >
      <TasksOverviewView />
    </Suspense>
  );
}
