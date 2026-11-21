"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 pt-1 sm:pt-2"
        >
          <h2 className="font-heading font-extrabold text-[clamp(2.4rem,4.5vw,4.25rem)] leading-[0.98] tracking-[-0.035em] text-[#F5F2EC] text-balance">
            <span className="block">{SECTOR_INTELLIGENCE_CONFIG.headlineLine1}</span>
            <span className="block text-[#F06419] font-extrabold">
              {SECTOR_INTELLIGENCE_CONFIG.headlineLine2}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#B8B9BC] leading-relaxed max-w-4xl">
            {SECTOR_INTELLIGENCE_CONFIG.description}
          </p>
        </motion.div>

        {/* Six Outlined Sector Architecture Rows (Cards) */}
        <div className="space-y-3.5">
          {publishedSectors.map((sector, idx) => {
            const displayNumber = String(idx + 1).padStart(2, "0");
            const isHighlighted = Boolean(sector.highlighted);

            return (
              <motion.div
                key={sector.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-20px" }}
                transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`relative rounded-[14px] sm:rounded-[16px] bg-[#101214] border p-5 sm:p-6 lg:py-5 lg:px-7 transition-all duration-300 group overflow-hidden ${
                  isHighlighted
                    ? "border-[#F06419]/60 shadow-[0_0_35px_-12px_rgba(240,100,25,0.22)]"
                    : "border-[#292E35] hover:border-[#F06419]/60 hover:bg-[#13161A] hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.5),0_0_24px_rgba(240,100,25,0.12)]"
                }`}
              >
                {/* Subtle top edge shine on highlighted and hovered cards */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#F06419] to-transparent transition-opacity duration-300 ${
                    isHighlighted ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 items-center">
                  {/* Column 1: Oversized Sector Number + Divider */}
                  <div className="lg:col-span-1 xl:col-span-1 flex items-center justify-between lg:pr-5">
                    <span className="font-heading font-extrabold text-5xl sm:text-6xl text-[#F06419] leading-none shrink-0 group-hover:text-[#FF762F] group-hover:scale-105 transition-all duration-200 inline-block">
                      {displayNumber}
                    </span>
                    <span
                      aria-hidden="true"
                      className="w-px h-16 bg-[#444444] hidden lg:block shrink-0 group-hover:bg-[#F06419]/30 transition-colors"
                    />
                  </div>

                  {/* Column 2: Title & Description + Divider */}
                  <div className="lg:col-span-5 xl:col-span-5 flex items-center justify-between lg:px-6">
                    <div className="space-y-1.5 min-w-0 pr-6 transition-transform duration-200 group-hover:translate-x-1">
                      <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#F5F2EC] tracking-tight leading-snug group-hover:text-[#F06419] transition-colors">
                        {sector.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#B8B9BC] leading-relaxed group-hover:text-[#D1D4DC] transition-colors">
                        {sector.description}
                      </p>
                    </div>
                    <span
                      aria-hidden="true"
                      className="w-px h-16 bg-[#444444] hidden lg:block shrink-0 group-hover:bg-[#F06419]/30 transition-colors"
                    />
                  </div>

                  {/* Column 3: Four Capability Tags (2x2 Grid) + Divider */}
                  <div className="lg:col-span-4 xl:col-span-4 flex items-center justify-between lg:pl-6 lg:pr-0">
                    <div className="grid grid-cols-2 gap-2 flex-1 pr-6">
                      {sector.capabilities.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center justify-center px-2.5 py-1.5 rounded-full border border-[#444444] text-[10px] xl:text-[11px] font-mono uppercase tracking-wider text-[#B8B9BC] text-center whitespace-nowrap bg-transparent transition-all duration-200 hover:border-[#F06419]/60 hover:bg-[#F06419]/15 hover:text-white hover:scale-[1.02] cursor-default"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span
                      aria-hidden="true"
                      className="w-px h-16 bg-[#444444] hidden lg:block shrink-0 group-hover:bg-[#F06419]/30 transition-colors"
                    />
                  </div>

                  {/* Column 4: Individual Sector Exploration Action */}
                  <div className="lg:col-span-2 xl:col-span-2 flex items-center justify-start lg:pl-6">
                    <Link
                      href={sector.detailRoute ?? `/contact?sector=${sector.slug}`}
                      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-[13px] transition-all duration-200 w-full sm:w-auto min-w-[155px] shadow-sm hover:scale-[1.02] active:scale-[0.98] ${
                        isHighlighted
                          ? "bg-[#F06419] text-[#171717] font-bold hover:bg-[#E05308] hover:shadow-[0_4px_16px_rgba(240,100,25,0.35)]"
                          : "border border-[#444444] text-[#F5F2EC] font-semibold group-hover:border-[#F06419] group-hover:bg-[#F06419] group-hover:text-[#171717] group-hover:font-bold hover:!bg-[#E05308]"
                      }`}
                    >
                      <span>Explore Sector</span>
                      <ArrowUpRight className="w-3.5 h-3.5 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Mandatory Beyond These Six Expansion Panel with Luminous Top Shine */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[16px] sm:rounded-[18px] bg-gradient-to-b from-[#F06419]/[0.18] via-[#161210] to-[#101214] border border-[#F06419]/75 p-7 sm:p-9 lg:p-10 overflow-hidden shadow-[0_0_70px_-10px_rgba(240,100,25,0.30)] hover:shadow-[0_0_90px_-10px_rgba(240,100,25,0.40)] transition-shadow duration-300"
        >
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
              <p className="font-heading font-bold text-xl sm:text-2xl text-[#F06419]">
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
                className="group inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 rounded-xl bg-[#F06419] text-[#171717] font-bold text-xs sm:text-[13px] font-mono uppercase tracking-wide hover:bg-[#E05308] hover:shadow-[0_4px_24px_rgba(240,100,25,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-sm shrink-0 w-full sm:w-auto"
              >
                <span>{SECTOR_INTELLIGENCE_CONFIG.beyondSix.ctaLabel}</span>
                <ArrowUpRight className="w-4 h-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
