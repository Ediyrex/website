import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { INITIAL_SECTORS, type SectorRecord } from "./industries.data";

interface IndustriesRegisterProps {
  sectors?: readonly SectorRecord[];
}

export function IndustriesRegister({
  sectors = INITIAL_SECTORS,
}: IndustriesRegisterProps) {
  const publishedSectors = sectors
    .filter((s) => s.published)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  return (
    <section
      id="industry-directory"
      aria-label="Industry Sector Register — Core Disciplines"
      className="relative w-full bg-[#0C0D0F] text-[#F5F2EC] py-16 sm:py-20 lg:py-24 border-b border-[#252A32] scroll-mt-20"
    >
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8 sm:space-y-10">
        {/* Main Editorial Headline */}
        <div className="space-y-4">
          <h2 className="font-heading font-extrabold text-[clamp(2.35rem,4.4vw,4.25rem)] leading-[0.98] tracking-[-0.035em] text-[#F5F2EC]">
            <span>Domain-specific systems. </span>
            <span className="italic text-[#F06419] font-extrabold">
              Proven across {String(publishedSectors.length).padStart(2, "0")} sectors.
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#B8B9BC] leading-relaxed max-w-4xl">
            Explore how EDYREX translates brand strategy, interactive software engineering, video production, and autonomous agent infrastructure into vertical-specific solutions.
          </p>
        </div>

        {/* Horizontal Divider Before Sector Register Rows */}
        <div className="h-px bg-[#444444] w-full" />

        {/* Full-Width Horizontal Sector Register Rows */}
        <div className="divide-y divide-[#444444]">
          {publishedSectors.map((sector, idx) => {
            const formattedNumber = String(idx + 1).padStart(2, "0");
            const isFirst = idx === 0;

            return (
              <div
                id={sector.slug}
                key={sector.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 items-center py-7 sm:py-9 transition-colors group scroll-mt-24"
              >
                {/* Column 1: Number + Divider */}
                <div className="lg:col-span-1 xl:col-span-1 flex items-center justify-between lg:pr-6">
                  <span className="font-heading font-extrabold text-5xl sm:text-6xl lg:text-[68px] text-[#F06419] leading-none shrink-0 group-hover:text-[#FF762F] transition-colors">
                    {formattedNumber}
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-px h-16 bg-[#444444] hidden lg:block shrink-0"
                  />
                </div>

                {/* Column 2: Sector Identity + Divider */}
                <div className="lg:col-span-4 xl:col-span-4 flex items-center justify-between lg:px-6">
                  <div className="space-y-1.5 min-w-0 pr-6">
                    <span className="block font-mono text-[11px] sm:text-xs uppercase tracking-wider text-[#D9B875] font-semibold">
                      {sector.tagline}
                    </span>
                    <h3 className="font-heading font-bold text-xl sm:text-2xl lg:text-[23px] text-[#F5F2EC] tracking-tight leading-snug group-hover:text-[#F06419] transition-colors">
                      {sector.name}
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

                {/* Column 3: Deliverables (2 columns) + Divider */}
                <div className="lg:col-span-4 xl:col-span-4 flex items-center justify-between lg:pl-6 lg:pr-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 lg:gap-x-6 gap-y-2.5 flex-1 pr-6">
                    {sector.deliverables.map((deliv) => (
                      <div
                        key={deliv}
                        className="flex items-center gap-2 text-xs sm:text-[13px] text-[#B8B9BC]"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#F06419] shrink-0" />
                        <span className="leading-snug">{deliv}</span>
                      </div>
                    ))}
                  </div>
                  <span
                    aria-hidden="true"
                    className="w-px h-16 bg-[#444444] hidden lg:block shrink-0"
                  />
                </div>

                {/* Column 4: Direct Enquiry Action */}
                <div className="lg:col-span-3 xl:col-span-3 flex items-center justify-start lg:pl-6">
                  <Link
                    href={`/contact?industry=${sector.slug}`}
                    className={`inline-flex items-center justify-between gap-3 px-5 py-3 rounded-xl text-xs sm:text-[13px] transition-all w-full sm:w-auto min-w-[240px] max-w-[290px] shadow-sm ${
                      isFirst
                        ? "bg-[#F06419] text-[#171717] font-bold hover:bg-[#E05308]"
                        : "border border-[#444444] text-[#F5F2EC] font-semibold hover:border-[#F06419] hover:text-[#F06419] hover:bg-[#F06419]/10"
                    }`}
                  >
                    <span>{sector.ctaLabel}</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Horizontal Divider Below Rows */}
        <div className="h-px bg-[#444444] w-full" />
      </div>
    </section>
  );
}
