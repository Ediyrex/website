"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  BESPOKE_ENGAGEMENTS_CONFIG,
  type BespokeEngagementsConfig,
} from "./bespoke-engagements.data";

interface BespokeEngagementsProps {
  config?: BespokeEngagementsConfig;
}

export function BespokeEngagements({
  config = BESPOKE_ENGAGEMENTS_CONFIG,
}: BespokeEngagementsProps) {
  const scrollToDisciplines = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(config.secondaryCta.targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id={config.sectionId}
      aria-label="Beyond the Sector Index — Bespoke Domain Engagements"
      className="relative w-full bg-[#0C0D0F] text-[#F5F2EC] py-16 sm:py-20 lg:py-24 border-b border-[#252A32] scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12 sm:space-y-14 lg:space-y-16">
        {/* Main Two-Column Editorial Hero Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column (58%): Bespoke Manifesto, Supporting Copy & Actions */}
          <div className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-8">
            <h2 className="font-heading font-extrabold text-[clamp(2.4rem,4.5vw,4.5rem)] leading-[0.98] tracking-[-0.035em] text-[#F5F2EC]">
              <span className="block">{config.headlineLine1}</span>
              <span className="block italic text-[#F06419] font-extrabold">
                {config.headlineLine2}
              </span>
            </h2>

            <p className="text-base sm:text-lg lg:text-[19px] text-[#B8B9BC] leading-relaxed max-w-[680px]">
              {config.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 pt-2 sm:pt-4">
              <Link
                href={config.primaryCta.route}
                className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-[#F06419] text-[#171717] font-bold text-xs sm:text-[13px] uppercase font-mono tracking-wide hover:bg-[#E05308] transition-colors shadow-sm shrink-0"
              >
                <span>{config.primaryCta.label}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </Link>

              <a
                href={`#${config.secondaryCta.targetId}`}
                onClick={scrollToDisciplines}
                className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl border border-[#444444] text-[#F5F2EC] font-semibold text-xs sm:text-[13px] uppercase font-mono tracking-wide hover:border-[#F06419] hover:text-[#F06419] hover:bg-[#F06419]/10 transition-all shrink-0"
              >
                <span>{config.secondaryCta.label}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>

          {/* Right Column (42%): Three-Stage Engagement Process */}
          <div className="lg:col-span-5 xl:col-span-5 lg:border-l lg:border-[#444444] lg:pl-10 xl:pl-12 space-y-6">
            <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.14em] text-[#D9B875] font-bold block">
              {config.processHeading}
            </span>

            {/* Three Process Rows Separated by Thin Horizontal Lines with Top and Bottom Dividers */}
            <div className="border-t border-b border-[#444444] divide-y divide-[#444444]">
              {config.stages.map((stage) => (
                <div
                  key={stage.number}
                  className="py-5 sm:py-6 flex items-center gap-4 sm:gap-5 group"
                >
                  <span className="font-heading font-extrabold text-4xl sm:text-5xl text-[#F06419] leading-none shrink-0 group-hover:text-[#FF762F] transition-colors">
                    {stage.number}
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-px h-12 bg-[#555555] hidden sm:block shrink-0"
                  />
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-[#F5F2EC] tracking-tight">
                      {stage.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#B8B9BC] leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Concluding Statement */}
            <span className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.14em] text-[#D9B875] font-bold block pt-3 sm:pt-4">
              {config.processClosing}
            </span>
          </div>
        </div>

        {/* Full-Width Horizontal Structural Divider */}
        <div className="h-px bg-[#444444] w-full" />

        {/* Four Connected Disciplines Section */}
        <div
          id={config.secondaryCta.targetId}
          className="scroll-mt-24 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-center"
        >
          {/* Left Discipline Manifesto */}
          <div className="lg:col-span-3 xl:col-span-3 lg:pr-6">
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F5F2EC] leading-[1.05] tracking-tight">
              <span className="block">{config.disciplinesManifestoLine1}</span>
              <span className="block">{config.disciplinesManifestoLine2}</span>
            </h3>
          </div>

          {/* Four Disciplines Columns with Vertical Separators */}
          <div className="lg:col-span-9 xl:col-span-9 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0">
            {config.disciplines.map((item) => (
              <div
                key={item.number}
                className="flex items-center lg:border-l lg:border-[#555555] lg:px-6 xl:px-8 group"
              >
                <Link
                  href={item.route}
                  className="space-y-1.5 transition-colors block"
                >
                  <span className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F06419] leading-none block group-hover:text-[#FF762F] transition-colors">
                    {item.number}
                  </span>
                  <span className="font-heading font-semibold text-sm sm:text-base text-[#F5F2EC] leading-snug block group-hover:text-[#F06419] transition-colors">
                    {item.name}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
