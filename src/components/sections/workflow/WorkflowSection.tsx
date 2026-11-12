"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import {
  WORKFLOW_STAGES,
  getStageForProgress,
  type WorkflowStageSpec,
} from "./workflow.data";
import { WorkflowHeader } from "./WorkflowHeader";
import { WorkflowProgressRail } from "./WorkflowProgressRail";
import { WorkflowStageCanvas } from "./WorkflowStageCanvas";
import { WorkflowStoryboard } from "./WorkflowStoryboard";

export function WorkflowSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef<number>(0.18);

  const [scrollProgress, setScrollProgress] = useState<number>(0.18);
  const [activeStage, setActiveStage] = useState<WorkflowStageSpec>(
    WORKFLOW_STAGES[1]
  );

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      progressRef.current = 0.25;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;
          setScrollProgress(p);
          const nextStage = getStageForProgress(p);
          setActiveStage((prev) => (prev.id === nextStage.id ? prev : nextStage));
        },
      });
    }, el);

    return () => ctx.revert();
  }, []);

  const handleSelectStage = useCallback((stage: WorkflowStageSpec) => {
    const el = sectionRef.current;
    if (!el || typeof window === "undefined") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isDesktop = window.innerWidth >= 1024;

    if (reduce || !isDesktop) {
      progressRef.current = stage.targetProgress;
      setScrollProgress(stage.targetProgress);
      setActiveStage(stage);
      return;
    }

    const rect = el.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const scrollableDistance = Math.max(1, el.offsetHeight - window.innerHeight);
    const targetScrollY = sectionTop + scrollableDistance * stage.targetProgress;

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth",
    });
  }, []);

  return (
    <section
      id="process"
      ref={sectionRef}
      style={
        {
          "--wf-bg": "#F7F1E9",
          "--wf-ink": "#111111",
          "--wf-muted": "#56514B",
          "--wf-orange": "#FF6900",
          "--wf-grid": "#D9CFC3",
          "--wf-border": "#DED4CA",
        } as React.CSSProperties
      }
      className="relative w-full bg-[#F7F1E9] text-[#111111] border-t border-[#DED4CA] lg:min-h-[340vh]"
    >
      {/* Sticky Viewport Stage on Desktop; Normal Flowing Container on Tablet/Mobile */}
      <div className="lg:sticky lg:top-[76px] w-full py-10 md:py-12 lg:py-6">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-12 space-y-5">
          {/* Editorial Header */}
          <WorkflowHeader />

          {/* Two-Column Transformation Workspace (~19% Rail / ~81% Canvas) */}
          <div className="grid grid-cols-1 lg:grid-cols-[230px_1fr] xl:grid-cols-[260px_1fr] gap-6 lg:gap-7 items-start">
            <WorkflowProgressRail
              stages={WORKFLOW_STAGES}
              activeStageId={activeStage.id}
              scrollProgress={scrollProgress}
              onSelectStage={handleSelectStage}
            />

            <WorkflowStageCanvas
              activeStage={activeStage}
              scrollProgress={scrollProgress}
              progressRef={progressRef}
            />
          </div>

          {/* Bottom Visual Evolution Storyboard */}
          <WorkflowStoryboard
            activeStageId={activeStage.id}
            onSelectStage={handleSelectStage}
          />
        </div>
      </div>
    </section>
  );
}

