"use client";

import React, { useEffect, useRef } from "react";
import { SectionHeader } from "./SectionHeader";
import { Manifesto } from "./Manifesto";
import { PurposeCard } from "./PurposeCard";
import { ProblemCard } from "./ProblemCard";
import { DivisionsCard } from "./DivisionsCard";
import { FounderCard } from "./FounderCard";
import { TechStackCard } from "./TechStackCard";
import { StudioStatsCard } from "./StudioStatsCard";
import { LocationCard } from "./LocationCard";
import { initAboutAnimations } from "./about.animations";

export function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    return initAboutAnimations(el);
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={
        {
          "--about-bg": "#F8F6F2",
          "--about-surface": "#F5F0E9",
          "--about-border": "#D9D2C8",
          "--about-ink": "#111111",
          "--about-muted": "#454545",
          "--about-accent": "#FF6900",
        } as React.CSSProperties
      }
      className="w-full bg-[#F8F6F2] text-[#111111] py-7 md:py-9 lg:py-8 xl:py-10 lg:min-h-[100svh] lg:flex lg:flex-col lg:justify-center border-t border-[#111111]/10"
    >
      <div className="w-full max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-10 xl:px-14">
        <SectionHeader />

        {/* Upper Editorial Grid: Manifesto (~38%) + Right Content Region (~62%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[38fr_62fr] gap-4 lg:gap-4 items-stretch">
          <Manifesto />

          <div className="flex flex-col gap-3.5 lg:gap-4">
            {/* Row 1 Right: Our Purpose (~65%) + The Big Problem (~35%) */}
            <div className="grid grid-cols-1 md:grid-cols-[65fr_35fr] gap-3.5 lg:gap-4 items-stretch">
              <PurposeCard />
              <ProblemCard />
            </div>

            {/* Row 2 Right: Our Divisions spanning full right region */}
            <DivisionsCard />
          </div>
        </div>

        {/* Bottom Bento Row: Behind the Code (~42%) + Built On (~29%) + Studio Info (~29%) */}
        <div className="mt-3.5 lg:mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[42fr_29fr_29fr] gap-3.5 lg:gap-4 items-stretch">
          <div className="md:col-span-2 lg:col-span-1">
            <FounderCard />
          </div>

          <div>
            <TechStackCard />
          </div>

          <div className="flex flex-col gap-3.5 lg:gap-4 h-full">
            <StudioStatsCard />
            <LocationCard />
          </div>
        </div>
      </div>
    </section>
  );
}
