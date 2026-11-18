import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import {
  DIVISION_MANIFESTO_MAP,
  type DivisionManifestoData,
} from "./division-manifesto.data";

interface DivisionManifestoHeroProps {
  division: string;
}

export function DivisionManifestoHero({ division }: DivisionManifestoHeroProps) {
  const data: DivisionManifestoData =
    DIVISION_MANIFESTO_MAP[division] ?? DIVISION_MANIFESTO_MAP.branding;

  return (
    <section
      aria-label={`${data.divisionTitle} — Division Manifesto`}
      className="relative w-full text-[#F5F2EC] pt-28 sm:pt-32 lg:pt-36 pb-12 sm:pb-16 border-b border-[#252A32] overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 75% 10%, rgba(240, 100, 25, 0.09), transparent 42%), #0C0D0F",
      }}
    >
      <div className="relative z-10 max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8 sm:space-y-10">
        {/* Navigation Area: Breadcrumb & Return Link */}
        <div className="space-y-3 sm:space-y-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs sm:text-[13px] font-mono"
          >
            <Link
              href="/"
              className="text-[#898D94] hover:text-[#F5F2EC] transition-colors"
            >
              Home
            </Link>
            <span className="text-[#444851]">&gt;</span>
            <Link
              href="/services"
              className="text-[#898D94] hover:text-[#F5F2EC] transition-colors"
            >
              Services
            </Link>
            <span className="text-[#444851]">&gt;</span>
            <span className="text-[#F5F2EC] font-medium" aria-current="page">
              {data.divisionTitle}
            </span>
          </nav>

          <div>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-xs sm:text-[13px] font-mono text-[#F5F2EC] hover:text-[#F06419] transition-colors"
            >
              <span className="transition-transform duration-200 group-hover:-translate-x-1">
                &larr;
              </span>
              <span>All Services</span>
            </Link>
          </div>
        </div>

        {/* Division Identifier Row */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-[34px] text-[#F06419] leading-none">
              {data.number}
            </span>
            <span className="text-lg sm:text-xl text-[#F06419] font-light font-mono">
              /
            </span>
            <span className="font-heading font-bold text-sm sm:text-base lg:text-lg uppercase tracking-[0.12em] text-[#F5F2EC]">
              {data.divisionTitle}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="h-px bg-[#262A33] flex-1 hidden md:block mx-2"
          />

          <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-[#898D94] shrink-0">
            {data.studioIdentifier}
          </span>
        </div>

        {/* Main 2-Column Editorial Manifesto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 pt-2 items-start">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col space-y-6 sm:space-y-8">
            <h1 className="font-heading font-extrabold text-[clamp(2.5rem,4.6vw,4.75rem)] leading-[0.98] tracking-[-0.035em] text-[#F5F2EC] text-balance">
              <span className="block">{data.headline.line1}</span>
              <span className="block">{data.headline.line2}</span>
              <span className="block text-[#F06419] font-extrabold">
                {data.headline.line3}
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-[22px] text-[#B8B9BC] leading-[1.5] max-w-[760px]">
              {data.description}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 sm:pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-[#F06419] text-[#171717] font-bold text-sm sm:text-base hover:bg-[#E05308] transition-colors shadow-sm shrink-0"
              >
                <span>Book a discovery call</span>
                <ArrowUpRight className="w-4 h-4 text-[#171717] shrink-0" />
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl border border-[#F5F2EC]/40 text-[#F5F2EC] font-semibold text-sm sm:text-base hover:border-[#F06419] hover:text-[#F06419] transition-colors shrink-0"
              >
                <span>Explore related work</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>

          {/* Right Column: Strategic Growth Process */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col space-y-6 lg:pl-10 lg:border-l lg:border-[#262A33]">
            <div className="text-xs sm:text-[13px] font-mono font-bold uppercase tracking-[0.16em] text-[#D9B875]">
              {data.processHeading}
            </div>

            <div className="divide-y divide-[#262A33] space-y-6">
              {data.processStages.map((stage, idx) => (
                <div
                  key={stage.number}
                  className={idx > 0 ? "pt-6 space-y-2" : "space-y-2"}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F06419] leading-none">
                      {stage.number}
                    </span>
                    <span className="text-base sm:text-lg text-[#F06419] font-mono">
                      /
                    </span>
                    <h3 className="font-heading font-bold text-lg sm:text-xl lg:text-[22px] uppercase tracking-wide text-[#F5F2EC]">
                      {stage.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-[15px] text-[#898D94] leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
