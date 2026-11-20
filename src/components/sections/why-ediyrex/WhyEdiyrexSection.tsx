"use client";

import React, { useEffect, useRef } from "react";
import type { HybridProduct } from "@/types";
import { StudioManifesto } from "./components/StudioManifesto";
import { StudioFlywheel } from "./components/StudioFlywheel";
import { OperatingPrinciples } from "./components/OperatingPrinciples";
import { InHouseProducts } from "./components/InHouseProducts";
import { BottomWave } from "./components/BottomWave";
import { initWhyEdiyrexAnimations } from "./animations/whyEdiyrexAnimations";

export function WhyEdiyrexSection({
  products,
}: {
  products?: HybridProduct[];
}) {
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

        {/* Region B: Operating Principles */}
        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-12 items-start">
            <div className="lg:col-span-5">
              <OperatingPrinciples />
            </div>
            <div className="lg:col-span-7">
              <InHouseProducts products={products} />
            </div>
          </div>
        ) : (
          <div className="border-t border-[#D8CEC3] pt-12 lg:pt-16">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
              <div className="lg:col-span-4 space-y-3">
                <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#FF6500] font-semibold block">
                  Operational Framework
                </span>
                <h3 className="text-[28px] sm:text-[34px] font-bold text-[#111111] leading-[1.15] tracking-[-0.03em]">
                  How we operate
                </h3>
                <p className="text-[14.5px] sm:text-[15.5px] text-[#44403D] leading-relaxed">
                  Core principles governing every project, line of code, and creative deliverable from inception to deployment.
                </p>
              </div>
              <div className="lg:col-span-8">
                <OperatingPrinciples />
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

