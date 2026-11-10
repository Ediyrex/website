"use client";

import React, { useState } from "react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  Clock,
  FolderPlus,
  Layers,
  Plus,
  Repeat,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatMinutes } from "./pms-types";

/* -------------------------------------------------------------------------- */
/*  1. Custom Project Templates & Workflows View (PMS v1.5)                   */
/* -------------------------------------------------------------------------- */

export interface CustomTemplateItem {
  id?: string;
  key: string;
  name: string;
  serviceInterest: string;
  description: string;
  labels?: string[];
  milestones: Array<{ title: string; offsetDays: number }>;
  tasks: Array<{ title: string; priority: string; workflowStatus: string }>;
  isBuiltIn: boolean;
}

export function PmsTemplatesView({
  builtIn,
  custom,
  loading,
  canEdit,
  onUseTemplate,
  onCreateCustom,
  onDeleteCustom,
}: {
  builtIn: CustomTemplateItem[];
  custom: CustomTemplateItem[];
  loading: boolean;
  canEdit: boolean;
  onUseTemplate: (templateKey: string) => void;
  onCreateCustom: (payload: {
    name: string;
    serviceInterest: string;
    description: string;
    labels: string[];
    milestones: Array<{ title: string; offsetDays: number }>;
    tasks: Array<{
      title: string;
      workflowStatus: "backlog" | "todo" | "in_progress" | "in_review" | "done";
      priority: "low" | "medium" | "high" | "urgent";
      labels: string[];
      offsetDays: number;
      estimatedMinutes: number;
    }>;
  }) => Promise<void>;
  onDeleteCustom: (id: string) => Promise<void>;
}) {
  const [showBuilder, setShowBuilder] = useState(false);
  const [name, setName] = useState("");
  const [serviceInterest, setServiceInterest] = useState("Studio Delivery");
  const [description, setDescription] = useState("");
  const [milestonesText, setMilestonesText] = useState(
    "Kickoff & Brief\nConcept Review\nFinal Handoff"
  );
  const [tasksText, setTasksText] = useState(
    "Setup workspace & research\nDesign initial direction\nFinal QA & delivery"
  );
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try {
      const milestones = milestonesText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((title, idx) => ({ title, offsetDays: (idx + 1) * 7 }));
      const tasks = tasksText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((title, idx) => ({
          title,
          workflowStatus: "todo" as const,
          priority: "medium" as const,
          labels: [serviceInterest.split("/")[0]?.trim() || "Studio"],
          offsetDays: (idx + 1) * 4,
          estimatedMinutes: 180,
        }));

      await onCreateCustom({
        name: name.trim(),
        serviceInterest: serviceInterest.trim(),
        description: description.trim(),
        labels: [],
        milestones,
        tasks,
      });
      setName("");
      setDescription("");
      setShowBuilder(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F2F2F0]">
            Project Templates &amp; Workflows
          </h1>
          <p className="text-sm text-[#A1A6AE] mt-1">
            Reusable division blueprints with predefined milestones, starter
            tasks, and workflow labels.
          </p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => setShowBuilder((v) => !v)}
            className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold hover:bg-[#E2C28E] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Custom Template</span>
          </button>
        )}
      </div>

      {showBuilder && canEdit && (
        <form
          onSubmit={handleSave}
          className="p-5 rounded-xl bg-[#111419] border border-[#D4AF77]/35 space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Template Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Product Launch Film"
                className="w-full h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Division / Service
              </label>
              <input
                type="text"
                required
                value={serviceInterest}
                onChange={(e) => setServiceInterest(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="When to use this template..."
              className="w-full h-9 px-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Milestones (1 per line)
              </label>
              <textarea
                rows={4}
                value={milestonesText}
                onChange={(e) => setMilestonesText(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-mono uppercase text-[#6D7480] mb-1">
                Starter Tasks (1 per line)
              </label>
              <textarea
                rows={4}
                value={tasksText}
                onChange={(e) => setTasksText(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#08090B] border border-[#252A31] text-xs text-[#F2F2F0]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowBuilder(false)}
              className="h-9 px-4 rounded-lg bg-[#171B21] border border-[#252A31] text-xs text-[#A1A6AE] cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="h-9 px-4 rounded-lg bg-[#D4AF77] text-[#08090B] text-xs font-semibold cursor-pointer"
            >
              {saving ? "Saving..." : "Save Template"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="p-10 text-center text-xs font-mono text-[#A1A6AE]">
          Loading project templates...
        </div>
      ) : (
        <div className="space-y-6">
          {custom.length > 0 && (
            <div className="space-y-3">
              <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#D4AF77]">
                Custom Studio Templates ({custom.length})
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {custom.map((tpl) => (
                  <TemplateCard
                    key={tpl.key}
                    tpl={tpl}
                    canEdit={canEdit}
                    onUse={() => onUseTemplate(tpl.key)}
                    onDelete={
                      tpl.id ? () => onDeleteCustom(tpl.id!) : undefined
                    }
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="text-[11px] font-mono uppercase tracking-[0.14em] text-[#6D7480]">
              Built-in EDYREX Blueprints
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {builtIn
                .filter((b) => b.key !== "blank")
                .map((tpl) => (
                  <TemplateCard
                    key={tpl.key}
                    tpl={tpl}
                    canEdit={canEdit}
                    onUse={() => onUseTemplate(tpl.key)}
                  />
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TemplateCard({
  tpl,
  canEdit,
  onUse,
  onDelete,
}: {
  tpl: CustomTemplateItem;
  canEdit: boolean;
  onUse: () => void;
  onDelete?: () => void;
}) {
  return (
    <div className="p-4 rounded-xl bg-[#111419] border border-[#252A31] flex flex-col justify-between gap-4">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase text-[#D4AF77]">
              {tpl.serviceInterest}
            </span>
            <h3 className="font-heading font-semibold text-base text-[#F2F2F0] mt-0.5">
              {tpl.name}
            </h3>
          </div>
          {onDelete && canEdit && (
            <button
              type="button"
              onClick={onDelete}
              className="text-[#6D7480] hover:text-[#E47777] cursor-pointer"
              title="Delete custom template"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        {tpl.description && (
          <p className="text-xs text-[#A1A6AE] line-clamp-2">
            {tpl.description}
          </p>
        )}
        <div className="text-[11px] font-mono text-[#6D7480]">
          {tpl.milestones.length} milestones · {tpl.tasks.length} starter tasks
        </div>
      </div>

      {canEdit && (
        <button
          type="button"
          onClick={onUse}
          className="w-full h-8 rounded-lg bg-[#171B21] border border-[#252A31] hover:border-[#D4AF77]/50 text-xs font-medium text-[#D4AF77] flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <FolderPlus className="w-3.5 h-3.5" />
          <span>Use Template</span>
        </button>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. Reports, Time & Health Analytics View (PMS v1.5)                       */
/* -------------------------------------------------------------------------- */

export interface PmsReportsPayload {
  summary: {
    totalProjects: number;
    totalTasks: number;
    completedTasks: number;
    overdueTasks: number;
    totalEstimatedHours: number;
    totalLoggedHours: number;
    recurringCount: number;
  };
  projectHealth: Array<{
    id: string;
    referenceCode: string;
    title: string;
    serviceInterest: string;
    status: string;
    health: "on_track" | "at_risk" | "delayed" | "completed";
    totalTasks: number;
    doneTasks: number;
    overdueTasks: number;
    estimatedHours: number;
    loggedHours: number;
  }>;
  workflowBreakdown: Record<string, number>;
  priorityBreakdown: Record<string, number>;
  recentWorkLogs: Array<{
    id: string;
    userName: string | null;
    minutes: number;
    note: string;
    loggedAt: string;
    taskTitle: string | null;
    projectTitle: string | null;
  }>;
}

export function PmsReportsView({
  reports,
  loading,
  onOpenProject,
}: {
  reports: PmsReportsPayload | null;
  loading: boolean;
  onOpenProject: (projectId: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F2F2F0]">
          Reports &amp; Studio Analytics
        </h1>
        <p className="text-sm text-[#A1A6AE] mt-1">
          Real-time project health, task completion velocity, time tracking
          utilization, and recurring workflows.
        </p>
      </div>

      {loading || !reports ? (
        <div className="p-10 text-center text-xs font-mono text-[#A1A6AE]">
          Generating studio analytics...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <StatTile
              icon={<BarChart3 className="w-4 h-4 text-[#D4AF77]" />}
              label="Task Completion"
              value={`${reports.summary.completedTasks}/${reports.summary.totalTasks}`}
              sub={`${
                reports.summary.totalTasks > 0
                  ? Math.round(
                      (reports.summary.completedTasks /
                        reports.summary.totalTasks) *
                        100
                    )
                  : 0
              }% overall rate`}
            />
            <StatTile
              icon={<Clock className="w-4 h-4 text-[#7BA8DF]" />}
              label="Hours Logged / Est."
              value={`${reports.summary.totalLoggedHours}h`}
              sub={`${reports.summary.totalEstimatedHours}h estimated across tasks`}
            />
            <StatTile
              icon={<AlertTriangle className="w-4 h-4 text-[#E47777]" />}
              label="Overdue Tasks"
              value={String(reports.summary.overdueTasks)}
              sub="Needs manager attention"
            />
            <StatTile
              icon={<Repeat className="w-4 h-4 text-[#56C88A]" />}
              label="Recurring Workflows"
              value={String(reports.summary.recurringCount)}
              sub="Auto-spawning tasks"
            />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
            {/* Project Health Table */}
            <div className="xl:col-span-8 rounded-xl bg-[#111419] border border-[#252A31] overflow-hidden">
              <div className="px-5 py-3.5 border-b border-[#252A31] flex items-center gap-2 text-sm font-semibold text-[#F2F2F0]">
                <Layers className="w-4 h-4 text-[#D4AF77]" />
                <span>Project Health &amp; Time Rollup</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#252A31] text-[10px] font-mono uppercase tracking-[0.14em] text-[#6D7480] bg-[#0B0D0F]">
                      <th className="py-3 px-4 font-normal">Project</th>
                      <th className="py-3 px-3 font-normal">Health</th>
                      <th className="py-3 px-3 font-normal">Tasks</th>
                      <th className="py-3 px-3 font-normal">Overdue</th>
                      <th className="py-3 px-4 font-normal text-right">
                        Logged / Est
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#252A31]">
                    {reports.projectHealth.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => onOpenProject(p.id)}
                        className="hover:bg-[#171B21]/65 cursor-pointer"
                      >
                        <td className="py-3 px-4">
                          <div className="text-xs font-medium text-[#F2F2F0]">
                            {p.title}
                          </div>
                          <div className="text-[10px] font-mono text-[#6D7480]">
                            #{p.referenceCode} · {p.serviceInterest}
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border",
                              p.health === "completed" || p.health === "on_track"
                                ? "bg-[#13291E] text-[#56C88A] border-[#56C88A]/35"
                                : p.health === "delayed"
                                ? "bg-[#2A1517] text-[#E47777] border-[#E47777]/35"
                                : "bg-[#282012] text-[#E7B65D] border-[#E7B65D]/35"
                            )}
                          >
                            {p.health.replace("_", " ")}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-xs font-mono text-[#A1A6AE]">
                          {p.doneTasks}/{p.totalTasks}
                        </td>
                        <td className="py-3 px-3 text-xs font-mono text-[#E47777]">
                          {p.overdueTasks}
                        </td>
                        <td className="py-3 px-4 text-right text-xs font-mono text-[#D4AF77]">
                          {p.loggedHours}h / {p.estimatedHours}h
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Time Logs Feed + Stage Distribution */}
            <div className="xl:col-span-4 space-y-5">
              <div className="p-4 rounded-xl bg-[#111419] border border-[#252A31] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F2F2F0]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF77]" />
                  <span>Workflow Distribution</span>
                </div>
                <div className="space-y-2 text-xs">
                  {Object.entries(reports.workflowBreakdown).map(
                    ([stage, count]) => (
                      <div
                        key={stage}
                        className="flex items-center justify-between text-[#A1A6AE]"
                      >
                        <span className="capitalize">
                          {stage.replace("_", " ")}
                        </span>
                        <span className="font-mono text-[#F2F2F0]">
                          {count}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#111419] border border-[#252A31] space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#F2F2F0]">
                  <Activity className="w-3.5 h-3.5 text-[#D4AF77]" />
                  <span>Recent Time Logs</span>
                </div>
                {reports.recentWorkLogs.length === 0 ? (
                  <div className="text-xs text-[#6D7480]">
                    No work sessions logged yet.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {reports.recentWorkLogs.slice(0, 10).map((w) => (
                      <div
                        key={w.id}
                        className="p-2.5 rounded-lg bg-[#0B0D0F] border border-[#252A31] text-xs space-y-0.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium text-[#F2F2F0]">
                            {w.userName || "Member"}
                          </span>
                          <span className="font-mono text-[#D4AF77]">
                            {formatMinutes(w.minutes)}
                          </span>
                        </div>
                        <div className="text-[11px] text-[#6D7480] truncate">
                          {w.taskTitle || "Task"} · {w.note || "Session"}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function StatTile({
  icon,
  label,
  value,
  sub,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="p-4 rounded-xl bg-[#111419] border border-[#252A31] space-y-1">
      <div className="flex items-center gap-2 text-xs text-[#A1A6AE]">
        {icon}
        <span>{label}</span>
      </div>
      <div className="font-heading font-bold text-2xl text-[#F2F2F0]">
        {value}
      </div>
      <div className="text-[11px] text-[#6D7480]">{sub}</div>
    </div>
  );
}
