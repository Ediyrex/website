import React from "react";
import Link from "next/link";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import {
  DIVISION_CAPABILITIES_MAP,
  type DivisionCapabilitiesData,
} from "./division-capabilities.data";

interface DivisionCapabilitiesRegisterProps {
  division: string;
}

export function DivisionCapabilitiesRegister({
  division,
}: DivisionCapabilitiesRegisterProps) {
  const data: DivisionCapabilitiesData =
    DIVISION_CAPABILITIES_MAP[division] ?? DIVISION_CAPABILITIES_MAP.branding;

  // As requested: if more than 5 services to show, then only show the view all button
  const hasMoreThan5 = data.services.length > 5;

  return (
    <section
      aria-label={`${data.headlineLine1} ${data.headlineLine2}`}
      className="relative w-full bg-[#0C0D0F] text-[#F5F2EC] py-16 sm:py-20 lg:py-24 border-b border-[#252A32]"
    >
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8 sm:space-y-10">
        {/* Main Editorial Headline */}
        <div className="space-y-4">
          <h2 className="font-heading font-extrabold text-[clamp(2.35rem,4.4vw,4.25rem)] leading-[0.98] tracking-[-0.035em] text-[#F5F2EC]">
            <span>{data.headlineLine1} </span>
            <span className="italic text-[#F06419] font-extrabold">
              {data.headlineLine2}
            </span>
          </h2>
          <p className="text-base sm:text-lg text-[#B8B9BC] leading-relaxed max-w-4xl">
            {data.description}
          </p>
        </div>

        {/* Horizontal Divider Before Service Register Rows */}
        <div className="h-px bg-[#444444] w-full" />

        {/* 5 Full-Width Horizontal Service Register Rows */}
        <div className="divide-y divide-[#444444]">
          {data.services.map((service, idx) => {
            const isFirst = idx === 0;

            return (
              <div
                key={service.id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-0 items-center py-7 sm:py-9 transition-colors group"
              >
                {/* Column 1: Number + Divider */}
                <div className="lg:col-span-1 xl:col-span-1 flex items-center justify-between lg:pr-6">
                  <span className="font-heading font-extrabold text-5xl sm:text-6xl lg:text-[68px] text-[#F06419] leading-none shrink-0 group-hover:text-[#FF762F] transition-colors">
                    {service.number}
                  </span>
                  <span
                    aria-hidden="true"
                    className="w-px h-16 bg-[#444444] hidden lg:block shrink-0"
                  />
                </div>

                {/* Column 2: Service Identity + Divider */}
                <div className="lg:col-span-4 xl:col-span-4 flex items-center justify-between lg:px-6">
                  <div className="space-y-1.5 min-w-0 pr-6">
                    <h3 className="font-heading font-bold text-xl sm:text-2xl lg:text-[23px] text-[#F5F2EC] tracking-tight leading-snug group-hover:text-[#F06419] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#B8B9BC] leading-relaxed">
                      {service.description}
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
                    {service.deliverables.map((deliv) => (
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

                {/* Column 4: Enquiry Action */}
                <div className="lg:col-span-3 xl:col-span-3 flex items-center justify-start lg:pl-6">
                  <Link
                    href={`/contact?division=${division}&service=${service.slug}`}
                    className={`inline-flex items-center justify-between gap-3 px-5 py-3 rounded-xl text-xs sm:text-[13px] transition-all w-full sm:w-auto min-w-[240px] max-w-[290px] shadow-sm ${
                      isFirst
                        ? "bg-[#F06419] text-[#171717] font-bold hover:bg-[#E05308]"
                        : "border border-[#444444] text-[#F5F2EC] font-semibold hover:border-[#F06419] hover:text-[#F06419] hover:bg-[#F06419]/10"
                    }`}
                  >
                    <span>{service.shortCta}</span>
                    <ArrowUpRight className="w-4 h-4 shrink-0" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Horizontal Divider Below Rows */}
        <div className="h-px bg-[#444444] w-full" />

        {hasMoreThan5 && (
          <div className="pt-2 sm:pt-4 flex justify-end">
            <Link
              href="/services"
              className="font-mono text-xs sm:text-[13px] uppercase tracking-[0.18em] text-[#F06419] font-bold hover:text-[#FF762F] transition-colors inline-flex items-center gap-1.5"
            >
              <span>EXPLORE ALL CAPABILITIES</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
