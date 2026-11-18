"use client";

import React from "react";
import type { WorkflowStageSpec } from "./workflow.data";
import { WorkflowStageContent } from "./WorkflowStageContent";
import { WorkflowVisualPanel } from "./WorkflowVisualPanel";

interface WorkflowStageCanvasProps {
  activeStage: WorkflowStageSpec;
  activeStageIndex: number;
  totalStages: number;
}

export function WorkflowStageCanvas({
  activeStage,
  activeStageIndex,
  totalStages,
}: WorkflowStageCanvasProps) {
  return (
    <div className="relative rounded-[24px] bg-[#FFFDFC] border border-[#DED4CA] shadow-[0_24px_54px_-24px_rgba(17,17,17,0.12)] p-6 sm:p-8 lg:p-9 overflow-hidden">
      {/* Subtle Warm Gradient Wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_90%_10%,rgba(255,105,0,0.06),transparent_55%),radial-gradient(circle_at_10%_90%,rgba(255,154,72,0.04),transparent_50%)]"
      />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[48fr_52fr] gap-8 xl:gap-10 items-stretch">
        {/* Left Column: Stage Editorial Content */}
        <div className="flex flex-col justify-between">
          <WorkflowStageContent stage={activeStage} />
        </div>

        {/* Right Column: Visual Showcase for this Stage */}
        <div className="relative w-full h-full min-h-[340px] flex items-center justify-center">
          <WorkflowVisualPanel activeStageId={activeStage.id} />
        </div>
      </div>
    </div>
  );
}
