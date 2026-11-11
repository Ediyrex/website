"use client";

import React, { useEffect, useRef } from "react";
import { StudioManifesto } from "./components/StudioManifesto";
import { StudioFlywheel } from "./components/StudioFlywheel";
import { OperatingPrinciples } from "./components/OperatingPrinciples";
import { InHouseProducts } from "./components/InHouseProducts";
import { BottomWave } from "./components/BottomWave";
import { initWhyEdiyrexAnimations } from "./animations/whyEdiyrexAnimations";

export function WhyEdiyrexSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    return initWhyEdiyrexAnimations(el);
  }, []);

  return (
    <section
      id="why-ediyrex"
      ref={sectionRef}
      style={
        {
          "--we-bg": "#F7F1EA",
          "--we-bg-soft": "#F1E9DF",
          "--we-ink": "#111111",
          "--we-muted": "#44403D",
          "--we-orange": "#FF6500",
          "--we-orange-deep": "#D94B00",
          "--we-border": "#D8CEC3",
        } as React.CSSProperties
      }
      className="relative w-full overflow-hidden bg-[#F7F1EA] text-[#111111] py-20 md:py-24 lg:py-28 border-t border-[#D8CEC3]"
    >
      {/* Subtle Decorative Flowing Bottom Contour Wave Behind Content */}
      <BottomWave />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-20 space-y-16 lg:space-y-20">
        {/* Region A: Studio Philosophy (Left ~42%) + Interactive Studio Flywheel (Right ~58%) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="lg:col-span-5">
            <StudioManifesto />
          </div>
          <div className="lg:col-span-7">
            <StudioFlywheel />
          </div>
        </div>

        {/* Region B & C: Operating Principles (Left) + In-House Products (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-start">
          <div className="lg:col-span-5">
            <OperatingPrinciples />
          </div>
          <div className="lg:col-span-7">
            <InHouseProducts />
          </div>
        </div>
      </div>
    </section>
  );
}

