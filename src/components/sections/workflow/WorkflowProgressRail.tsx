import React from "react";
import { Eye, Search, Layers, Box, Rocket, Flag } from "lucide-react";
import type { WorkflowStageId, WorkflowStageSpec } from "./workflow.data";

function RailIcon({
  id,
  isActive,
}: {
  id: WorkflowStageId;
  isActive: boolean;
}) {
  const className = `w-3.5 h-3.5 shrink-0 transition-colors duration-200 ${
    isActive ? "text-[#FF6900]" : "text-[#56514B]"
  }`;

  switch (id) {
    case "intro":
      return <Eye strokeWidth={1.75} className={className} />;
    case "discover":
      return <Search strokeWidth={1.75} className={className} />;
    case "define":
      return <Layers strokeWidth={1.75} className={className} />;
    case "create":
      return <Box strokeWidth={1.75} className={className} />;
    case "deliver":
      return <Rocket strokeWidth={1.75} className={className} />;
    case "outro":
      return <Flag strokeWidth={1.75} className={className} />;
  }
}

interface WorkflowProgressRailProps {
  stages: readonly WorkflowStageSpec[];
  activeStageId: WorkflowStageId;
  scrollProgress: number;
  onSelectStage: (stage: WorkflowStageSpec) => void;
}

export function WorkflowProgressRail({
  stages,
  activeStageId,
  scrollProgress,
  onSelectStage,
}: WorkflowProgressRailProps) {
  const fillPercent = Math.round(Math.min(1, Math.max(0, scrollProgress)) * 100);

  return (
    <aside
      aria-label="Workflow progression stages"
      className="relative"
    >
      {/* Desktop & Tablet Vertical Rail */}
      <div className="hidden lg:block relative pl-5">
        {/* Background Track Line */}
        <span
          aria-hidden="true"
          className="absolute left-[9px] top-3 bottom-3 w-[1.5px] bg-[#D9CFC3]"
        />
        {/* Active Progressive Orange Fill Line */}
        <span
          aria-hidden="true"
          className="absolute left-[9px] top-3 w-[1.5px] bg-[#FF6900] origin-top transition-all duration-150"
          style={{ height: `calc((100% - 24px) * ${scrollProgress})` }}
        />

        <div className="space-y-1.5">
          {stages.map((stage) => {
            const isActive = stage.id === activeStageId;
            return (
              <button
                key={stage.id}
                type="button"
                onClick={() => onSelectStage(stage)}
                className={`group relative w-full text-left rounded-xl px-3 py-2.5 cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6900] ${
                  isActive
                    ? "bg-[#FFFDFC] border border-[#DED4CA] shadow-[0_6px_18px_-10px_rgba(17,17,17,0.12)]"
                    : "border border-transparent hover:bg-[#FFFDFC]/55"
                }`}
              >
                {/* Node Indicator Dot on Track */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-[15px] top-4 w-2.5 h-2.5 rounded-full border transition-all duration-200 ${
                    isActive
                      ? "bg-[#FF6900] border-[#FF6900] scale-125 shadow-[0_0_0_3px_rgba(255,105,0,0.18)]"
                      : "bg-[#F7F1E9] border-[#BEB5AA] group-hover:border-[#FF6900]"
                  }`}
                />

                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <RailIcon id={stage.id} isActive={isActive} />
                    <span
                      className={`text-[13px] font-bold truncate ${
                        isActive ? "text-[#111111]" : "text-[#111111]/75"
                      }`}
                    >
                      {stage.id === "intro" || stage.id === "outro"
                        ? stage.label
                        : `${stage.railIndex} ${stage.label}`}
                    </span>
                  </div>

                  <span
                    style={{ fontFamily: "var(--font-mono)" }}
                    className={`text-[10px] shrink-0 ${
                      isActive ? "text-[#FF6900] font-semibold" : "text-[#56514B]/70"
                    }`}
                  >
                    {stage.rangeLabel}
                  </span>
                </div>

                <p className="mt-1 text-[11.5px] text-[#56514B] leading-[1.35] line-clamp-2">
                  {stage.railDescription}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile & Compact Tablet Horizontal Pill Stepper */}
      <div className="lg:hidden space-y-2.5">
        <div className="flex items-center justify-between text-[11px] font-mono text-[#56514B]">
          <span>WORKFLOW PROGRESS</span>
          <span className="font-semibold text-[#FF6900]">{fillPercent}%</span>
        </div>
        <div className="h-1 w-full rounded-full bg-[#DED4CA] overflow-hidden">
          <div
            className="h-full bg-[#FF6900] transition-all duration-200"
            style={{ width: `${fillPercent}%` }}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {stages
            .filter((s) => s.id !== "intro" && s.id !== "outro")
            .map((stage) => {
              const isActive = stage.id === activeStageId;
              return (
                <button
                  key={stage.id}
                  type="button"
                  onClick={() => onSelectStage(stage)}
                  className={`shrink-0 h-9 px-3.5 rounded-full border text-[12px] font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors ${
                    isActive
                      ? "bg-[#FFFDFC] border-[#FF6900] text-[#111111]"
                      : "bg-transparent border-[#DED4CA] text-[#56514B]"
                  }`}
                >
                  <RailIcon id={stage.id} isActive={isActive} />
                  <span>
                    {stage.railIndex} {stage.label}
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </aside>
  );
}

