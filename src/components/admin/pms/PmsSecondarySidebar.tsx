"use client";

import React from "react";
import {
  BarChart3,
  CheckSquare,
  FolderKanban,
  Inbox,
  Layers,
  LayoutDashboard,
  Plus,
  Star,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PmsMainView } from "./pms-types";

interface PmsSecondarySidebarProps {
  activeView: PmsMainView;
  activeProjectId: string | null;
  onSelectView: (view: PmsMainView) => void;
  onSelectProject: (projectId: string) => void;
  onNewProject: () => void;
  canCreateProject: boolean;
  myPendingCount: number;
  unreadInboxCount: number;
  projects: Array<{
    id: string;
    title: string;
    status: string;
    isStarred: boolean;
  }>;
}

export function PmsSecondarySidebar({
  activeView,
  activeProjectId,
  onSelectView,
  onSelectProject,
  onNewProject,
  canCreateProject,
  myPendingCount,
  unreadInboxCount,
  projects,
}: PmsSecondarySidebarProps) {
  const navItems: Array<{
    id: PmsMainView;
    label: string;
    icon: React.ElementType;
    badge?: number;
  }> = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    {
      id: "my-tasks",
      label: "My Tasks",
      icon: CheckSquare,
      badge: myPendingCount,
    },
    { id: "inbox", label: "Inbox", icon: Inbox, badge: unreadInboxCount },
    { id: "all", label: "All Projects", icon: FolderKanban },
    { id: "starred", label: "Starred", icon: Star },
  ];

  return (
    <aside className="w-full lg:w-60 shrink-0 rounded-xl bg-[#0B0D0F] border border-[#252A31] p-3 flex flex-col gap-5">
      <div>
        <div className="px-2.5 text-[10px] font-mono uppercase tracking-[0.14em] text-[#6D7480] mb-2">
          PMS Workspace
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = activeView === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={cn(
                  "flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                  active
                    ? "bg-[#171B21] text-[#D4AF77] border border-[#D4AF77]/35"
                    : "text-[#A1A6AE] hover:text-[#F2F2F0] hover:bg-[#111419] border border-transparent"
                )}
              >
                <span className="flex items-center gap-2 min-w-0">
                  <Icon
                    className={cn(
                      "w-3.5 h-3.5 shrink-0",
                      active ? "text-[#D4AF77]" : "text-[#6D7480]"
                    )}
                  />
                  <span className="truncate">{item.label}</span>
                </span>
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span
                    className={cn(
                      "px-1.5 py-0.5 rounded-full text-[10px] font-mono font-semibold",
                      item.id === "inbox"
                        ? "bg-[#2C2415] text-[#D4AF77]"
                        : "bg-[#171B21] text-[#F2F2F0]"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-[#1D2128] pt-3">
        <div className="px-2.5 flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#6D7480]">
            Projects
          </span>
          {canCreateProject && (
            <button
              type="button"
              onClick={onNewProject}
              title="New Project"
              className="text-[#D4AF77] hover:text-[#E5C690] cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="space-y-0.5 max-h-64 overflow-y-auto">
          {projects.length === 0 ? (
            <div className="px-2.5 py-2 text-[11px] text-[#6D7480]">
              No active projects
            </div>
          ) : (
            projects.map((p) => {
              const isSelected =
                activeView === "project" && activeProjectId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectProject(p.id)}
                  className={cn(
                    "w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer",
                    isSelected
                      ? "bg-[#171B21] text-[#F2F2F0] border border-[#D4AF77]/35 font-medium"
                      : "text-[#A1A6AE] hover:text-[#F2F2F0] hover:bg-[#111419] border border-transparent"
                  )}
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <span
                      className={cn(
                        "w-1.5 h-1.5 rounded-full shrink-0",
                        p.status === "completed"
                          ? "bg-[#56C88A]"
                          : p.status === "on_hold"
                          ? "bg-[#E47777]"
                          : "bg-[#D4AF77]"
                      )}
                    />
                    <span className="truncate">{p.title}</span>
                  </span>
                  {p.isStarred && (
                    <Star className="w-3 h-3 text-[#D4AF77] fill-[#D4AF77] shrink-0" />
                  )}
                </button>
              );
            })
          )}
        </div>

        {canCreateProject && (
          <button
            type="button"
            onClick={onNewProject}
            className="mt-3 w-full h-8 rounded-lg bg-[#111419] border border-[#252A31] hover:border-[#D4AF77]/45 text-xs font-medium text-[#D4AF77] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="border-t border-[#1D2128] pt-3 space-y-0.5">
        <div className="px-2.5 text-[10px] font-mono uppercase tracking-[0.14em] text-[#6D7480] mb-1.5">
          Insights &amp; System
        </div>
        {(
          [
            { id: "workload", label: "Team Workload", icon: Users },
            { id: "templates", label: "Project Templates", icon: Layers },
            { id: "reports", label: "Reports & Analytics", icon: BarChart3 },
          ] as const
        ).map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={cn(
                "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                activeView === item.id
                  ? "bg-[#171B21] text-[#D4AF77] border border-[#D4AF77]/35"
                  : "text-[#A1A6AE] hover:text-[#F2F2F0] hover:bg-[#111419] border border-transparent"
              )}
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

