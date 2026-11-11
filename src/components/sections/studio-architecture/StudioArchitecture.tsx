"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { ArchitectureHeader } from "./ArchitectureHeader";
import { WorkflowVisualization } from "./WorkflowVisualization";
import { HybridStudioModel } from "./HybridStudioModel";
import { DivisionNavigation } from "./DivisionNavigation";
import { initArchitectureAnimations } from "./architecture.animations";

export function StudioArchitecture() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    return initArchitectureAnimations(el);
  }, []);

  return (
    <section
      id="studio-architecture"
      ref={sectionRef}
      style={
        {
          "--arch-bg": "#F5F0E9",
          "--arch-ink": "#111111",
          "--arch-muted": "#333333",
          "--arch-orange": "#FF6900",
          "--arch-border": "#D9D2C8",
        } as React.CSSProperties
      }
      className="relative w-full overflow-hidden bg-[#F5F0E9] text-[#111111] py-7 md:py-9 lg:py-8 xl:py-9 lg:min-h-[100svh] lg:flex lg:flex-col lg:justify-center border-t border-[#111111]/10"
    >
      {/* Decorative Upper-Right Basalt Rock Formation (Behind Content) */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden md:block absolute top-0 right-0 w-[190px] lg:w-[245px] xl:w-[300px] aspect-[1024/481] z-0"
      >
        <Image
          src="/images/architecture/rock-top-right.png"
          alt=""
          fill
          sizes="(min-width: 1280px) 300px, 245px"
          className="object-contain object-right-top"
        />
      </div>

      {/* Decorative Lower-Left Basalt Rock Shard (Behind Content) */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute left-0 bottom-[135px] xl:bottom-[150px] w-[240px] xl:w-[310px] aspect-[1024/682] z-0"
      >
        <Image
          src="/images/architecture/rock-bottom-left.png"
          alt=""
          fill
          sizes="(min-width: 1280px) 310px, 240px"
          className="object-contain object-left-bottom"
        />
      </div>

      {/* Foreground Content Container */}
      <div className="relative z-10 w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-[4.5%]">
        {/* Region A: Introduction */}
        <ArchitectureHeader />

        {/* Region B: Workflow Visualization (~67%) + Hybrid Studio Model (~33%) */}
        <div className="mt-2 lg:mt-3 grid grid-cols-1 lg:grid-cols-[67fr_33fr] gap-8 lg:gap-6 xl:gap-8 items-center">
          <WorkflowVisualization />
          <HybridStudioModel />
        </div>

        {/* Region C: Four-Column Division Navigation */}
        <DivisionNavigation />
      </div>
    </section>
  );
}

