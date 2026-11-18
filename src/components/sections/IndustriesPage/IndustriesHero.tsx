"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  INDUSTRY_HERO_CONFIG,
  INITIAL_SECTORS,
  type SectorRecord,
} from "./industries.data";

interface IndustriesHeroProps {
  sectors?: readonly SectorRecord[];
  displayLimit?: number;
}

export function IndustriesHero({
  sectors = INITIAL_SECTORS,
  displayLimit = 9,
}: IndustriesHeroProps) {
  // Only display published and featured sectors up to the configured limit
  const featuredSectors = sectors
    .filter((s) => s.published && s.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .slice(0, displayLimit);

  const rangeStart = "01";
  const rangeEnd = String(featuredSectors.length).padStart(2, "0");

  const scrollToDirectory = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(INDUSTRY_HERO_CONFIG.primaryCta.targetId);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-label="Industries Hero Manifesto &amp; Sector Directory"
      className="relative w-full bg-[#0C0D0F] text-[#F5F2EC] pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 border-b border-[#252A32] overflow-hidden"
    >
      {/* Subtle Warm Amber Atmospheric Background Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 w-[500px] lg:w-[700px] h-[500px] lg:h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(240,100,25,0.065)_0%,_rgba(0,0,0,0)_70%)] blur-3xl -z-0"
      />

      <div className="relative z-10 max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8 lg:space-y-12">
        {/* Navigation Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs font-mono text-[#898D94]"
        >
          <Link href="/" className="hover:text-[#F5F2EC] transition-colors">
            Home
          </Link>
          <span className="text-[#444444]">/</span>
          <span className="text-[#F5F2EC]">Industries</span>
        </nav>

        {/* Main 2-Column Editorial Manifesto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 pt-2 items-start">
          {/* Left Column: Headline, Description & Action CTAs */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col space-y-6 sm:space-y-8">
            <h1 className="font-heading font-extrabold text-[clamp(2.5rem,4.6vw,4.75rem)] leading-[0.98] tracking-[-0.035em] text-[#F5F2EC]">
              <span className="block">{INDUSTRY_HERO_CONFIG.headline.line1}</span>
              <span className="block italic text-[#F06419] font-extrabold">
                {INDUSTRY_HERO_CONFIG.headline.line2}
              </span>
              <span className="block">{INDUSTRY_HERO_CONFIG.headline.line3}</span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-[22px] text-[#B8B9BC] leading-[1.5] max-w-[760px]">
              {INDUSTRY_HERO_CONFIG.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 sm:pt-4">
              <a
                href={`#${INDUSTRY_HERO_CONFIG.primaryCta.targetId}`}
                onClick={scrollToDirectory}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-[#F06419] text-[#171717] font-bold text-sm sm:text-base hover:bg-[#E05308] transition-colors shadow-sm shrink-0 uppercase tracking-wide font-mono"
              >
                <span>{INDUSTRY_HERO_CONFIG.primaryCta.label}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>

              <Link
                href={INDUSTRY_HERO_CONFIG.secondaryCta.href}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl border border-[#444444] text-[#F5F2EC] font-semibold text-sm sm:text-base hover:border-[#F06419] hover:text-[#F06419] hover:bg-[#F06419]/10 transition-colors shrink-0 uppercase tracking-wide font-mono"
              >
                <span>{INDUSTRY_HERO_CONFIG.secondaryCta.label}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>

          {/* Right Column: Sector Index Directory */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col space-y-4 lg:border-l lg:border-[#262A33] lg:pl-10 xl:pl-12">
            {/* Sector Index Header Row */}
            <div className="flex items-center justify-between pb-3 border-b border-[#262A33]">
              <span className="text-xs sm:text-[13px] font-mono font-bold uppercase tracking-[0.16em] text-[#D9B875]">
                SECTOR INDEX
              </span>
              <span className="text-xs sm:text-[13px] font-mono text-[#898D94] uppercase tracking-wider">
                {rangeStart} — {rangeEnd}
              </span>
            </div>

            {/* List of 9 Sector Rows */}
            <div className="divide-y divide-[#262A33]">
              {featuredSectors.map((sector, index) => {
                const displayNumber = String(index + 1).padStart(2, "0");

                return (
                  <Link
                    key={sector.id}
                    href={`#${sector.slug}`}
                    className="group flex items-center justify-between py-2.5 sm:py-3 transition-colors hover:border-[#F06419]/60"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="font-heading font-bold text-lg sm:text-xl text-[#F06419] shrink-0 group-hover:text-[#FF762F] transition-colors">
                        {displayNumber}
                      </span>
                      <span className="text-[#898D94] font-mono text-sm shrink-0">
                        /
                      </span>
                      <span className="font-heading font-semibold text-base sm:text-[17px] text-[#F5F2EC] truncate group-hover:text-[#F06419] transition-colors">
                        {sector.name}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-[#898D94] shrink-0 group-hover:text-[#F06419] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                );
              })}
            </div>

            {/* + AND MANY MORE Directory Entry */}
            <div className="pt-3 border-t border-[#262A33]">
              <a
                href={`#${INDUSTRY_HERO_CONFIG.primaryCta.targetId}`}
                onClick={scrollToDirectory}
                className="group flex items-start justify-between gap-3 text-left transition-colors"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base text-[#F06419] font-mono font-bold">
                      +
                    </span>
                    <span className="font-heading font-bold text-sm sm:text-base text-[#F5F2EC] group-hover:text-[#F06419] transition-colors uppercase tracking-wide">
                      AND MANY MORE INDUSTRIES
                    </span>
                  </div>
                  <p className="text-xs text-[#898D94] leading-relaxed max-w-sm">
                    Your industry doesn&apos;t have to fit into a predefined category. Explore more sectors or discuss a solution shaped around your business.
                  </p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-[#F06419] shrink-0 mt-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
