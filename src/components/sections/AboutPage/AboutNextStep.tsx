import React from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";

export function AboutNextStep() {
  return (
    <section
      id="next-step"
      aria-label="Next Steps"
      className="py-16 md:py-24 bg-[#08090B]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
        {/* Section Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#FF6900]">
              05 / WHERE TO GO NEXT
            </span>
          </div>
          <h2 className="font-heading font-semibold text-[#F5F3EE] text-[clamp(2rem,3.2vw,2.75rem)] leading-[1.15] tracking-tight">
            Ready to explore our work or capabilities?
          </h2>
          <p className="text-[#B2B4BA] text-sm sm:text-base leading-relaxed">
            Choose your next step below to see our complete service directory or inspect published project case studies.
          </p>
        </div>

        {/* 2-Column Direct Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Services Directory */}
          <Link
            href="/services"
            className="group p-6 sm:p-8 rounded-2xl bg-[#0D0F12] border border-[#252A32] hover:border-[#FF6900] transition-all duration-200 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D6B77A] px-2.5 py-1 rounded bg-[#12151A] border border-[#252A32]">
                  35+ CAPABILITIES &middot; 4 DIVISIONS
                </span>
                <ArrowUpRight className="w-5 h-5 text-[#777D87] group-hover:text-[#FF6900] transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-xl sm:text-2xl text-[#F5F3EE] group-hover:text-white transition-colors">
                Explore the Services Directory
              </h3>
              <p className="text-xs sm:text-sm text-[#9EA2A8] leading-relaxed">
                Detailed breakdowns of our capabilities across Branding &amp; Marketing, Media Production, Web &amp; App Engineering, and AI Systems.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#FF6900] pt-2">
              <span>View full directory</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* Card 2: Work Archive */}
          <Link
            href="/work"
            className="group p-6 sm:p-8 rounded-2xl bg-[#0D0F12] border border-[#252A32] hover:border-[#FF6900] transition-all duration-200 flex flex-col justify-between space-y-6"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#D6B77A] px-2.5 py-1 rounded bg-[#12151A] border border-[#252A32]">
                  CASE STUDIES &amp; R&amp;D CONCEPTS
                </span>
                <ArrowUpRight className="w-5 h-5 text-[#777D87] group-hover:text-[#FF6900] transition-colors" />
              </div>
              <h3 className="font-heading font-semibold text-xl sm:text-2xl text-[#F5F3EE] group-hover:text-white transition-colors">
                Inspect Published Work
              </h3>
              <p className="text-xs sm:text-sm text-[#9EA2A8] leading-relaxed">
                Review real case studies, technical architecture diagrams, autonomous agent workflows, and digital products engineered by our studio.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono font-semibold uppercase text-[#FF6900] pt-2">
              <span>Browse case studies</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

