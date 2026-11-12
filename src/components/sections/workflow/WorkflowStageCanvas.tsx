import React from "react";
import type { WorkflowStageSpec } from "./workflow.data";
import { WorkflowStageContent } from "./WorkflowStageContent";
import { WorkflowVisual } from "./WorkflowVisual";

interface WorkflowStageCanvasProps {
  activeStage: WorkflowStageSpec;
  scrollProgress: number;
  progressRef: React.MutableRefObject<number>;
}

export function WorkflowStageCanvas({
  activeStage,
  scrollProgress,
  progressRef,
}: WorkflowStageCanvasProps) {
  const pct = Math.round(Math.min(1, Math.max(0, scrollProgress)) * 100);

  return (
    <div className="relative rounded-[24px] bg-[#FFFDFC]/92 border border-[#DED4CA] shadow-[0_22px_50px_-24px_rgba(17,17,17,0.14)] overflow-hidden">
      {/* Subtle Technical Grid Texture Backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(217,207,195,0.45) 1px, transparent 1px), linear-gradient(to bottom, rgba(217,207,195,0.45) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Minimal Architectural Corner Brackets */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3.5 left-3.5 w-3 h-3 border-t border-l border-[#C9BFB3]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-3.5 right-3.5 w-3 h-3 border-t border-r border-[#C9BFB3]"
      />

      <div className="relative z-10 p-6 sm:p-8 lg:p-9 flex flex-col justify-between min-h-[450px] lg:min-h-[480px] xl:min-h-[505px]">
        {/* Persistent Top Editorial Title Row Inside Canvas */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-[#DED4CA]/70">
          <div>
            <p className="text-[22px] sm:text-[26px] xl:text-[30px] font-bold text-[#111111] leading-[1.06] tracking-[-0.03em]">
              From first thought
              <span
                style={{ fontFamily: "var(--font-playfair)" }}
                className="block font-normal italic"
              >
                to finished reality
                <span
                  aria-hidden="true"
                  className="inline-block w-2 h-2 rounded-full bg-[#FF6900] ml-1.5 align-baseline"
                />
              </span>
            </p>
          </div>

          <p className="text-[13px] sm:text-[13.5px] text-[#56514B] leading-[1.45] max-w-[260px]">
            A connected process for turning ambitious ideas into meaningful
            outcomes.
          </p>
        </div>

        {/* Dynamic Stage Content (Left) + Morphing 3D Blueprint-to-Reality Model (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-[38fr_62fr] gap-6 items-center py-4 flex-1">
          <WorkflowStageContent stage={activeStage} />

          <div className="relative w-full h-[250px] sm:h-[290px] lg:h-[310px] xl:h-[330px]">
            <WorkflowVisual
              activeStageId={activeStage.id}
              progressRef={progressRef}
            />
          </div>
        </div>

        {/* Bottom Progress Indicator Strip */}
        <div className="pt-3 flex items-center gap-4">
          <div className="flex-1 h-[3px] rounded-full bg-[#EAE2D8] overflow-hidden">
            <div
              className="h-full bg-[#FF6900] transition-all duration-150"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span
            style={{ fontFamily: "var(--font-mono)" }}
            className="text-[11px] font-semibold text-[#56514B] tabular-nums w-9 text-right"
          >
            {pct}%
          </span>
        </div>
      </div>
    </div>
  );
}

