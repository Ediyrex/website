import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  SECTOR_INTELLIGENCE_CONFIG,
  FEATURED_SECTOR_ARCHITECTURES,
  type SectorArchitecture,
} from "./sector-intelligence.data";

interface SectorIntelligenceProps {
  sectors?: readonly SectorArchitecture[];
}

export function SectorIntelligence({
  sectors = FEATURED_SECTOR_ARCHITECTURES,
}: SectorIntelligenceProps) {
  const publishedSectors = sectors
    .filter((s) => s.published && s.featured)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  const rangeStart = "01";
  const rangeEnd = String(publishedSectors.length).padStart(2, "0");

  return (
    <section
      id={SECTOR_INTELLIGENCE_CONFIG.sectionId}
      aria-label="Sector Intelligence &amp; Featured Architectures"
      className="relative w-full bg-[#0C0D0F] text-[#F5F2EC] py-16 sm:py-20 lg:py-24 border-b border-[#252A32] scroll-mt-20"
    >
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8 sm:space-y-10">
        {/* Main Editorial Headline & Introduction */}
        <div className="space-y-4 pt-1 sm:pt-2">
          <h2 className="font-heading font-extrabold text-[clamp(2.4rem,4.5vw,4.25rem)] leading-[0.98] tracking-[-0.035em] text-[#F5F2EC]">
            <span className="block">{SECTOR_INTELLIGENCE_CONFIG.headlineLine1}</span>
            <span className="block italic text-[#F06419] font-extrabold">
              {SECTOR_INTELLIGENCE_CONFIG.headlineLine2}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#B8B9BC] leading-relaxed max-w-4xl">
            {SECTOR_INTELLIGENCE_CONFIG.description}
          </p>
        </div>

        {/* Six Outlined Sector Architecture Rows (Cards) */}
        <div className="space-y-3.5">
          {publishedSectors.map((sector, idx) => {
            const displayNumber = String(idx + 1).padStart(2, "0");
            const isHighlighted = sector.highlighted ?? idx === 0;

            return (
              <div
                key={sector.id}
                className={`relative rounded-[14px] sm:rounded-[16px] bg-[#101214] border p-5 sm:p-6 lg:py-5 lg:px-7 transition-all duration-200 group overflow-hidden ${
                  isHighlighted
                    ? "border-[#F06419]/50 shadow-[0_0_35px_-12px_rgba(240,100,25,0.18)]"
                    : "border-[#292E35] hover:border-[#F06419]/50 hover:shadow-[0_0_30px_-12px_rgba(240,100,25,0.14)]"
                }`}
              >
                {/* Subtle top edge shine on highlighted and hovered cards */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#FFA266]/70 to-transparent transition-opacity duration-200 ${
                    isHighlighted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 items-center">
                  {/* Column 1: Oversized Sector Number + Divider */}
                  <div className="lg:col-span-1 xl:col-span-1 flex items-center justify-between lg:pr-5">
                    <span className="font-heading font-extrabold text-5xl sm:text-6xl text-[#F06419] leading-none shrink-0 group-hover:text-[#FF762F] transition-colors">
                      {displayNumber}
                    </span>
                    <span
                      aria-hidden="true"
                      className="w-px h-16 bg-[#444444] hidden lg:block shrink-0"
                    />
                  </div>

                  {/* Column 2: Title & Description + Divider */}
                  <div className="lg:col-span-5 xl:col-span-5 flex items-center justify-between lg:px-6">
                    <div className="space-y-1.5 min-w-0 pr-6">
                      <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#F5F2EC] tracking-tight leading-snug group-hover:text-[#F06419] transition-colors">
                        {sector.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#B8B9BC] leading-relaxed">
                        {sector.description}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="w-px h-16 bg-[#444444] hidden lg:block shrink-0"
                    />
                  </div>

                  {/* Column 3: Four Capability Tags (2x2 Grid) + Divider */}
                  <div className="lg:col-span-4 xl:col-span-4 flex items-center justify-between lg:pl-6 lg:pr-0">
                    <div className="grid grid-cols-2 gap-2 flex-1 pr-6">
                      {sector.capabilities.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-full border border-[#444444] text-[10px] xl:text-[11px] font-mono uppercase tracking-wider text-[#B8B9BC] text-center whitespace-nowrap bg-transparent"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span
                      aria-hidden="true"
                      className="w-px h-16 bg-[#444444] hidden lg:block shrink-0"
                    />
                  </div>

                  {/* Column 4: Individual Sector Exploration Action */}
                  <div className="lg:col-span-2 xl:col-span-2 flex items-center justify-start lg:pl-6">
                    <Link
                      href={sector.detailRoute ?? `/contact?sector=${sector.slug}`}
                      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all w-full sm:w-auto min-w-[155px] shadow-sm ${
                        isHighlighted
                          ? "bg-[#F06419] text-[#171717] font-bold hover:bg-[#E05308]"
                          : "border border-[#444444] text-[#F5F2EC] font-semibold hover:border-[#F06419] hover:text-[#F06419] hover:bg-[#F06419]/10"
                      }`}
                    >
                      <span>Explore Sector</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mandatory Beyond These Six Expansion Panel with Luminous Top Shine */}
        <div className="relative rounded-[16px] sm:rounded-[18px] bg-gradient-to-b from-[#F06419]/[0.18] via-[#161210] to-[#101214] border border-[#F06419]/75 p-7 sm:p-9 lg:p-10 overflow-hidden shadow-[0_0_70px_-10px_rgba(240,100,25,0.30)]">
          {/* Luminous Top Edge Shine Streak */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FFA266] to-transparent opacity-100"
          />

          {/* Upper Radiant Ambient Glow Flare */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[850px] h-[240px] rounded-full bg-[radial-gradient(ellipse_at_top,_rgba(240,100,25,0.32)_0%,_rgba(240,100,25,0.12)_45%,_rgba(0,0,0,0)_75%)] blur-2xl pointer-events-none"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8 lg:gap-12">
            {/* Left Zone: Headline & Highlighted Statement */}
            <div className="space-y-1 lg:w-[38%] shrink-0">
              <h3 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
                {SECTOR_INTELLIGENCE_CONFIG.beyondSix.title}
              </h3>
              <p className="italic font-heading font-bold text-xl sm:text-2xl text-[#F06419]">
                {SECTOR_INTELLIGENCE_CONFIG.beyondSix.subtitle}
              </p>
            </div>

            {/* Middle Zone: Supporting Description with Vertical Divider */}
            <div className="lg:border-l lg:border-[#444444] lg:pl-8 lg:w-[38%] flex-1">
              <p className="text-sm sm:text-[15px] text-[#B8B9BC] leading-relaxed">
                {SECTOR_INTELLIGENCE_CONFIG.beyondSix.description}
              </p>
            </div>

            {/* Right Zone: Primary CTA Button */}
            <div className="lg:w-[24%] flex justify-start lg:justify-end shrink-0">
              <a
                href={`#${SECTOR_INTELLIGENCE_CONFIG.beyondSix.targetId}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F06419] text-[#171717] font-bold text-xs sm:text-[13px] font-mono uppercase tracking-wide hover:bg-[#E05308] transition-colors shadow-sm shrink-0 w-full sm:w-auto"
              >
                <span>{SECTOR_INTELLIGENCE_CONFIG.beyondSix.ctaLabel}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
