"use client";

import React, { useEffect, useRef } from "react";
import { OperationalHeader } from "./OperationalHeader";
import { TransformationVisual } from "./TransformationVisual";
import { BackgroundTerrain } from "./BackgroundTerrain";
import { BenefitsStrip } from "./BenefitsStrip";
import { initOperationalShiftAnimations } from "./animations";

export function OperationalShift() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    return initOperationalShiftAnimations(el);
  }, []);

  return (
    <section
      id="operational-shift"
      ref={sectionRef}
      style={
        {
          "--os-bg": "#F7F3ED",
          "--os-ink": "#111111",
          "--os-muted": "#333333",
          "--os-orange": "#F36B16",
          "--os-border": "#DED6CE",
        } as React.CSSProperties
      }
      className="relative w-full overflow-hidden bg-[#F7F3ED] text-[#111111] py-16 md:py-20 lg:py-24 border-t border-[#DED6CE]"
    >
      {/* Subtle Background Terrain & Atmospheric Texture Behind Content */}
      <BackgroundTerrain />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-14 space-y-10 lg:space-y-12">
        <OperationalHeader />

        <TransformationVisual />

        <BenefitsStrip />
      </div>
    </section>
  );
}

