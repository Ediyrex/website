import React from "react";
import { WORKFLOW_STAGES } from "./architecture.data";
import { WorkflowPanel } from "./WorkflowPanel";
import { RockPlatform } from "./RockPlatform";

const DESKTOP_TILTS = [
  "z-[2] translate-y-2 lg:[transform:perspective(1200px)_rotateY(-11deg)_rotate(-2deg)] lg:hover:[transform:perspective(1200px)_rotateY(-9deg)_rotate(-1.5deg)_translateY(-6px)]",
  "z-[3] -ml-5 xl:-ml-7 -translate-y-1.5 lg:[transform:perspective(1200px)_rotateY(-10deg)_rotate(-1deg)] lg:hover:[transform:perspective(1200px)_rotateY(-8deg)_rotate(-0.5deg)_translateY(-6px)]",
  "z-[4] -ml-5 xl:-ml-7 translate-y-2 lg:[transform:perspective(1200px)_rotateY(-9deg)_rotate(-1.5deg)] lg:hover:[transform:perspective(1200px)_rotateY(-7deg)_rotate(-1deg)_translateY(-6px)]",
  "z-[5] -ml-5 xl:-ml-7 -translate-y-3 lg:[transform:perspective(1200px)_rotateY(-7deg)_rotate(-3deg)] lg:hover:[transform:perspective(1200px)_rotateY(-5deg)_rotate(-2deg)_translateY(-7px)]",
] as const;

export function WorkflowVisualization() {
  return (
    <div data-arch-workflow className="relative">
      {/* Desktop 3D Perspective Scene: cards directly share stacking context with RockPlatform for real backdrop-filter refraction */}
      <div className="hidden lg:block relative pt-4 pb-[52px] xl:pb-[64px]">
        <RockPlatform />

        <div className="relative flex items-end justify-start pl-1 xl:pl-2">
          {WORKFLOW_STAGES.map((stage, idx) => (
            <WorkflowPanel
              key={stage.id}
              stage={stage}
              tiltClassName={`shrink-0 ${DESKTOP_TILTS[idx] ?? ""}`}
              className="w-[184px] xl:w-[222px] 2xl:w-[244px] min-h-[218px] xl:min-h-[246px] 2xl:min-h-[262px]"
            />
          ))}
        </div>
      </div>

      {/* Tablet (640px - 1023px): Clean 2x2 Grid */}
      <div className="hidden sm:grid lg:hidden grid-cols-2 gap-4 pt-2">
        {WORKFLOW_STAGES.map((stage) => (
          <WorkflowPanel
            key={stage.id}
            stage={stage}
            className="min-h-[205px]"
          />
        ))}
      </div>

      {/* Mobile (< 640px): Vertical Connected Workflow Sequence */}
      <div className="sm:hidden relative pl-6 pt-2 space-y-4">
        <span
          aria-hidden="true"
          className="absolute left-2 top-5 bottom-5 w-px bg-gradient-to-b from-[#A9A29A] via-[#A9A29A] to-[#FF6900]"
        />
        {WORKFLOW_STAGES.map((stage) => (
          <div key={stage.id} className="relative">
            <span
              aria-hidden="true"
              className={`absolute -left-[21px] top-7 w-2.5 h-2.5 rounded-full border-2 border-[#F5F0E9] ${
                stage.variant === "orange" ? "bg-[#FF6900]" : "bg-[#111111]"
              }`}
            />
            <WorkflowPanel stage={stage} className="min-h-[180px]" />
          </div>
        ))}
      </div>
    </div>
  );
}
