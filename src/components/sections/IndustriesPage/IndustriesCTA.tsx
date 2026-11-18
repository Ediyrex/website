import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function IndustriesCTA() {
  return (
    <section
      aria-label="Custom Sector Engagement"
      className="relative w-full bg-[#08090B] text-[#F5F2EC] py-20 sm:py-24 lg:py-28 border-b border-[#252A32] overflow-hidden"
    >
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col lg:flex-row lg:items-center justify-between gap-10 lg:gap-16">
        <div className="space-y-4 max-w-3xl">
          <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] text-[#D9B875] block">
            BESPOKE DOMAIN ENGAGEMENTS
          </span>
          <h2 className="font-heading font-extrabold text-[clamp(2.2rem,4vw,3.75rem)] leading-[1.0] tracking-[-0.035em] text-[#F5F2EC]">
            Don&apos;t see your specific sector listed?
          </h2>
          <p className="text-base sm:text-lg text-[#B8B9BC] leading-relaxed max-w-2xl">
            Our four connected disciplines are modular by design. We frequently adapt our technical architectures and creative playbooks to bespoke industries, regulated environments, and emerging technologies.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-[#F06419] text-[#171717] font-bold text-sm sm:text-base hover:bg-[#E05308] transition-colors shadow-sm shrink-0"
          >
            <span>Schedule a discovery call</span>
            <ArrowUpRight className="w-4 h-4 shrink-0" />
          </Link>

          <Link
            href="/services"
            className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl border border-[#444444] text-[#F5F2EC] font-semibold text-sm sm:text-base hover:border-[#F06419] hover:text-[#F06419] hover:bg-[#F06419]/10 transition-colors shrink-0"
          >
            <span>Explore all services</span>
            <ArrowUpRight className="w-4 h-4 shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}
