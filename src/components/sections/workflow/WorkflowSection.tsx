"use client";

import React, { useEffect, useState } from "react";
import { WORKFLOW_STAGES, type WorkflowStageSpec } from "./workflow.data";
import { WorkflowHeader } from "./WorkflowHeader";
import { WorkflowProgressRail } from "./WorkflowProgressRail";
import { WorkflowStageCanvas } from "./WorkflowStageCanvas";

export function WorkflowSection() {
  const [activeStage, setActiveStage] = useState<WorkflowStageSpec>(
    WORKFLOW_STAGES[0]
  );
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Auto-progress stages every 5s unless user hovers or manually interacts
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveStage((prev) => {
        const currentIndex = WORKFLOW_STAGES.findIndex((s) => s.id === prev.id);
        const nextIndex = (currentIndex + 1) % WORKFLOW_STAGES.length;
        return WORKFLOW_STAGES[nextIndex];
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const activeIndex = WORKFLOW_STAGES.findIndex((s) => s.id === activeStage.id);

  return (
    <section
      id="process"
      aria-label="Studio Workflow & Delivery Method"
      className="relative w-full bg-[#F7F1E9] text-[#111111] border-t border-[#DED4CA] py-14 sm:py-20 lg:py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 space-y-8 sm:space-y-10">
        {/* Single Authoritative Editorial Header */}
        <WorkflowHeader />

        {/* 2-Column Transformation Workspace (~24% Rail / ~76% Canvas) */}
        <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] xl:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
          <WorkflowProgressRail
            stages={WORKFLOW_STAGES}
            activeStageId={activeStage.id}
            onSelectStage={(stage) => {
              setActiveStage(stage);
              setIsPaused(true);
            }}
          />

          <WorkflowStageCanvas
            activeStage={activeStage}
            activeStageIndex={activeIndex}
            totalStages={WORKFLOW_STAGES.length}
          />
        </div>
      </div>
    </section>
  );
}
