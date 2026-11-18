"use client";

import React from "react";
import { Compass, Layers, Rocket, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { WorkflowStageId, WorkflowStageSpec } from "./workflow.data";

const STAGE_ICONS: Record<WorkflowStageId, typeof Compass> = {
  discover: Compass,
  define: Layers,
  create: Zap,
  deliver: Rocket,
};

interface WorkflowProgressRailProps {
  stages: readonly WorkflowStageSpec[];
  activeStageId: WorkflowStageId;
  onSelectStage: (stage: WorkflowStageSpec) => void;
}

export function WorkflowProgressRail({
  stages,
  activeStageId,
  onSelectStage,
}: WorkflowProgressRailProps) {
  return (
    <aside aria-label="Workflow progression stages" className="w-full">
      {/* Desktop & Tablet Vertical Rail */}
      <div className="hidden lg:flex flex-col gap-2 relative pl-5">
        {/* Background Track Guide Line */}
        <span
          aria-hidden="true"
          className="absolute left-[8px] top-6 bottom-6 w-[1.5px] bg-[#D9CFC3]"
        />

        {stages.map((stage) => {
          const isActive = stage.id === activeStageId;
          const Icon = STAGE_ICONS[stage.id];

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelectStage(stage)}
              className={cn(
                "group relative w-full text-left rounded-[16px] p-3.5 cursor-pointer transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6900]",
                isActive
                  ? "bg-[#FFFDFC] border border-[#FF6900]/45 shadow-[0_8px_20px_-8px_rgba(255,105,0,0.18)] translate-x-1"
                  : "border border-transparent bg-transparent hover:bg-white/60"
              )}
            >
              {/* Node Bullet on Vertical Track */}
              <span
                aria-hidden="true"
                className={cn(
                  "absolute -left-[18px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border transition-all duration-250",
                  isActive
                    ? "bg-[#FF6900] border-[#FF6900] scale-125 shadow-[0_0_0_4px_rgba(255,105,0,0.18)]"
                    : "bg-[#F7F1E9] border-[#BEB5AA] group-hover:border-[#FF6900]"
                )}
              />

              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-200",
                      isActive
                        ? "bg-[#FF6900] text-white"
                        : "bg-[#FAF4ED] text-[#56514B] group-hover:text-[#FF6900]"
                    )}
                  >
                    <Icon className="w-3.5 h-3.5 stroke-[2]" />
                  </div>

                  <div className="min-w-0">
                    <span
                      className={cn(
                        "block font-heading text-[14px] font-bold leading-tight truncate transition-colors",
                        isActive ? "text-[#111111]" : "text-[#48433F] group-hover:text-[#111111]"
                      )}
                    >
                      {stage.stepNumber} · {stage.tabLabel}
                    </span>
                    <span className="block font-mono text-[10px] text-[#817A72] truncate mt-0.5">
                      {stage.duration}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Mobile & Tablet Horizontal Tab Stepper */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {stages.map((stage) => {
          const isActive = stage.id === activeStageId;
          const Icon = STAGE_ICONS[stage.id];

          return (
            <button
              key={stage.id}
              type="button"
              onClick={() => onSelectStage(stage)}
              className={cn(
                "shrink-0 h-10 px-4 rounded-full border text-[12.5px] font-semibold inline-flex items-center gap-2 cursor-pointer transition-all duration-200 whitespace-nowrap",
                isActive
                  ? "bg-[#FFFDFC] border-[#FF6900] text-[#111111] shadow-xs"
                  : "bg-white/60 border-[#DED4CA] text-[#56514B]"
              )}
            >
              <Icon
                className={cn(
                  "w-3.5 h-3.5",
                  isActive ? "text-[#FF6900]" : "text-[#56514B]"
                )}
              />
              <span>
                {stage.stepNumber} · {stage.tabLabel}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
