"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { WorkflowStageId } from "./workflow.data";
import { WorkflowFallbackVisual } from "./WorkflowFallbackVisual";

const WorkflowBlueprint3D = dynamic(
  () => import("./WorkflowBlueprint3D").then((m) => m.WorkflowBlueprint3D),
  { ssr: false }
);

class CanvasErrorBoundary extends React.Component<
  { fallback: React.ReactNode; children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { fallback: React.ReactNode; children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

interface WorkflowVisualProps {
  activeStageId: WorkflowStageId;
  progressRef: React.MutableRefObject<number>;
}

export function WorkflowVisual({
  activeStageId,
  progressRef,
}: WorkflowVisualProps) {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  if (reduceMotion) {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <WorkflowFallbackVisual stageId={activeStageId} />
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <CanvasErrorBoundary
        fallback={
          <div className="w-full h-full flex items-center justify-center p-4">
            <WorkflowFallbackVisual stageId={activeStageId} />
          </div>
        }
      >
        <WorkflowBlueprint3D progressRef={progressRef} />
      </CanvasErrorBoundary>
    </div>
  );
}

