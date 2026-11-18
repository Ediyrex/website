"use client";

import React from "react";
import { CheckCircle2, Clock } from "lucide-react";
import type { WorkflowStageSpec } from "./workflow.data";

export function WorkflowStageContent({
  stage,
}: {
  stage: WorkflowStageSpec;
}) {
  return (
    <div className="flex flex-col justify-between gap-6 h-full">
      {/* Top Header Block */}
      <div className="space-y-4">
        {/* Stage Header Badge + Timeline Duration */}
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-[#FF6900]">
            {stage.badgeLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FAF4ED] border border-[#E5DDD2] px-2.5 py-1 font-mono text-[11px] font-medium text-[#56514B]">
            <Clock className="w-3.5 h-3.5 text-[#FF6900]" />
            <span>{stage.duration}</span>
          </span>
        </div>

        {/* Primary Stage Headline */}
        <h3 className="text-[26px] sm:text-[32px] xl:text-[36px] font-bold text-[#111111] leading-[1.08] tracking-[-0.025em]">
          {stage.title}
        </h3>

        {/* Detailed Description */}
        <p className="text-[14.5px] sm:text-[15.5px] text-[#48433F] leading-[1.58] max-w-[480px]">
          {stage.description}
        </p>
      </div>

      {/* Concrete Deliverables Checklist */}
      <div className="space-y-2.5 rounded-[16px] bg-[#FAF6F0] border border-[#E5DDD2] p-4">
        <span className="font-mono text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#817A72] block">
          Key Phase Deliverables
        </span>
        <div className="space-y-2">
          {stage.deliverables.map((item) => (
            <div key={item} className="flex items-center gap-2.5 text-[13px] text-[#111111]">
              <CheckCircle2 className="w-4 h-4 text-[#FF6900] shrink-0 stroke-[2.2]" />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Metrics Row + Tags */}
      <div className="space-y-3 pt-1">
        <div className="grid grid-cols-3 gap-2">
          {stage.metrics.map((m) => (
            <div
              key={m.label}
              className="rounded-[12px] bg-white border border-[#E5DDD2] p-2.5 text-center shadow-xs"
            >
              <div className="font-heading text-[16px] sm:text-[18px] font-bold text-[#111111] leading-none">
                {m.value}
              </div>
              <div className="font-mono text-[9.5px] text-[#817A72] uppercase tracking-wider mt-1 truncate">
                {m.label}
              </div>
            </div>
          ))}
        </div>

        {/* Monospace Keyword Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          {stage.tags.map((tag) => (
            <span
              key={tag}
              className="font-mono text-[10px] font-medium text-[#56514B] bg-[#F2EAE0] rounded-md px-2 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
