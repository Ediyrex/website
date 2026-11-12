import React from "react";
import type { WorkflowStageSpec } from "./workflow.data";

export function WorkflowStageContent({
  stage,
}: {
  stage: WorkflowStageSpec;
}) {
  return (
    <div className="flex flex-col justify-between gap-6">
      <div className="space-y-3">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="inline-block text-[14px] font-semibold tracking-[0.06em] text-[#FF6900]"
        >
          {stage.counter ?? stage.railIndex}
        </span>

        <h3 className="text-[28px] sm:text-[34px] xl:text-[38px] font-bold text-[#111111] leading-[1.08] tracking-[-0.025em]">
          {stage.title}
        </h3>

        <p className="text-[14.5px] sm:text-[15.5px] text-[#56514B] leading-[1.52] max-w-[330px]">
          {stage.description}
        </p>
      </div>

      {/* Technical Monospace Keywords */}
      <div className="pt-2">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10.5px] sm:text-[11px] font-semibold uppercase tracking-[0.14em] text-[#56514B]">
          {stage.keywords.map((kw, idx) => (
            <React.Fragment key={kw}>
              {idx > 0 && (
                <span aria-hidden="true" className="text-[#FF6900]">
                  &bull;
                </span>
              )}
              <span style={{ fontFamily: "var(--font-mono)" }}>{kw}</span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

