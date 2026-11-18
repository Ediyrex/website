import React from "react";
import {
  DIVISION_FOCUS_AREAS_MAP,
  type DivisionFocusAreasData,
} from "./division-focus-areas.data";

interface DivisionFocusAreasProps {
  division: string;
}

export function DivisionFocusAreas({ division }: DivisionFocusAreasProps) {
  const data: DivisionFocusAreasData =
    DIVISION_FOCUS_AREAS_MAP[division] ?? DIVISION_FOCUS_AREAS_MAP.branding;

  return (
    <section
      aria-label={`${data.headlineLine1} ${data.headlineLine2}`}
      className="relative w-full bg-[#0C0D0F] text-[#F5F2EC] py-16 sm:py-20 lg:py-24 border-b border-[#252A32]"
    >
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8 sm:space-y-10">
        {/* Main Diagnostic Headline */}
        <div className="space-y-4">
          <h2 className="font-heading font-extrabold text-[clamp(2.4rem,4.5vw,4.25rem)] leading-[0.98] tracking-[-0.035em] text-[#F5F2EC] text-balance">
            <span className="block">{data.headlineLine1}</span>
            <span className="block text-[#F06419] font-extrabold">
              {data.headlineLine2}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#B8B9BC] leading-relaxed max-w-4xl">
            {data.description}
          </p>
        </div>

        {/* Horizontal Divider Before Diagnostic Rows */}
        <div className="h-px bg-[#444444] w-full" />

        {/* 3 Horizontal Diagnostic Rows */}
        <div className="divide-y divide-[#444444]">
          {data.items.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 items-center py-8 sm:py-10 transition-colors"
            >
              {/* Column 1: Number + Divider */}
              <div className="lg:col-span-2 flex items-center justify-between lg:pr-8">
                <span className="font-heading font-extrabold text-6xl sm:text-7xl lg:text-[84px] text-[#F06419] leading-none shrink-0">
                  {item.number}
                </span>
                <span
                  aria-hidden="true"
                  className="w-px h-16 sm:h-20 bg-[#444444] hidden lg:block shrink-0"
                />
              </div>

              {/* Column 2: Category & Title + Divider */}
              <div className="lg:col-span-5 flex items-center justify-between lg:px-8">
                <div className="space-y-1.5 min-w-0 pr-4">
                  <span className="block font-mono text-xs sm:text-[13px] uppercase tracking-wider font-semibold text-[#D9B875]">
                    {item.category}
                  </span>
                  <h3 className="font-heading font-bold text-xl sm:text-2xl lg:text-[26px] text-[#F5F2EC] tracking-tight leading-snug">
                    {item.title}
                  </h3>
                </div>
                <span
                  aria-hidden="true"
                  className="w-px h-16 sm:h-20 bg-[#444444] hidden lg:block shrink-0"
                />
              </div>

              {/* Column 3: Explanation & Impact Annotation */}
              <div className="lg:col-span-5 lg:pl-8 space-y-3">
                <p className="text-sm sm:text-[15px] text-[#B8B9BC] leading-relaxed">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#898D94]">
                  <span className="w-2 h-2 bg-[#F06419] shrink-0 inline-block" />
                  <span>{item.impact}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Horizontal Divider Below Rows */}
        <div className="h-px bg-[#444444] w-full" />

        {/* Closing Objective Statement */}
        <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-mono text-xs sm:text-[14px] uppercase tracking-[0.18em] text-[#F06419] font-bold">
              {data.closingLabel}
            </span>
            <span
              aria-hidden="true"
              className="w-8 sm:w-12 h-px bg-[#444444] hidden sm:inline-block"
            />
          </div>
          <p className="text-lg sm:text-xl lg:text-[22px] font-heading font-semibold text-[#F5F2EC]">
            <span>{data.closingStatementWhite} </span>
            <span className="text-[#F06419] font-bold">
              {data.closingStatementOrange}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
