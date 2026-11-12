import React from "react";
import { ArrowRight } from "lucide-react";
import {
  CORE_STORYBOARD_STAGES,
  type WorkflowStageId,
  type WorkflowStageSpec,
} from "./workflow.data";
import { StageMiniVisual } from "./stages/StageMiniVisuals";

interface WorkflowStoryboardProps {
  activeStageId: WorkflowStageId;
  onSelectStage: (stage: WorkflowStageSpec) => void;
}

export function WorkflowStoryboard({
  activeStageId,
  onSelectStage,
}: WorkflowStoryboardProps) {
  return (
    <div className="pt-5 lg:pt-6 border-t border-[#DED4CA]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Storyboard Title */}
        <div className="shrink-0">
          <span className="block text-[14px] font-bold text-[#111111] tracking-[-0.01em]">
            Visual Transformation
          </span>
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="block mt-0.5 text-[11px] uppercase tracking-[0.1em] text-[#56514B]"
          >
            (Single Asset Evolution)
          </span>
        </div>

        {/* Four Synchronized Mini Stages Connected by Orange Arrows */}
        <div className="flex-1 grid grid-cols-2 sm:flex sm:items-center sm:justify-between gap-3 sm:gap-2 overflow-x-auto no-scrollbar">
          {CORE_STORYBOARD_STAGES.map((stage, idx) => {
            const isActive =
              activeStageId === stage.id ||
              (activeStageId === "intro" && stage.id === "discover") ||
              (activeStageId === "outro" && stage.id === "deliver");

            return (
              <React.Fragment key={stage.id}>
                {idx > 0 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="hidden sm:block w-4 h-4 text-[#FF6900] shrink-0"
                  />
                )}
                <button
                  type="button"
                  onClick={() => onSelectStage(stage)}
                  className={`group flex-1 min-w-[130px] flex flex-col items-center text-center rounded-xl p-2 cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6900] ${
                    isActive
                      ? "bg-[#FFFDFC] border border-[#FF6900]/45 shadow-sm"
                      : "border border-transparent hover:bg-[#FFFDFC]/60"
                  }`}
                >
                  <div className="w-24 h-12 mb-1.5">
                    <StageMiniVisual stageId={stage.id} />
                  </div>
                  <span
                    className={`text-[12.5px] font-bold leading-tight ${
                      isActive ? "text-[#111111]" : "text-[#111111]/75"
                    }`}
                  >
                    {stage.label}
                  </span>
                  <span className="text-[11px] text-[#56514B]">
                    ({stage.storyboardSubtitle})
                  </span>
                </button>
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}

