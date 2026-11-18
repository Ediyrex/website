import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function IndustriesHero() {
  const stages = [
    {
      number: "01",
      title: "DIAGNOSE",
      description: "Map domain bottlenecks, regulatory bounds and audience expectations.",
    },
    {
      number: "02",
      title: "ARCHITECT",
      description: "Design connected brand, digital product and operational automation systems.",
    },
    {
      number: "03",
      title: "DEPLOY",
      description: "Ship high-craft media, resilient software and auditable workflow pipelines.",
    },
  ];

  return (
    <section
      aria-label="Industries Hero Manifesto"
      className="relative w-full bg-[#08090B] text-[#F5F2EC] pt-28 sm:pt-32 lg:pt-36 pb-16 sm:pb-20 lg:pb-24 border-b border-[#252A32] overflow-hidden"
    >
      {/* Subtle Warm Amber / Signal Orange Atmospheric Gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-0 w-[500px] lg:w-[700px] h-[500px] lg:h-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(240,100,25,0.075)_0%,_rgba(0,0,0,0)_70%)] blur-3xl -z-0"
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

        {/* Top Division Identifier Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-heading font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#F06419] leading-none">
              05
            </span>
            <span className="text-lg sm:text-xl text-[#F06419] font-light font-mono">
              /
            </span>
            <span className="font-heading font-bold text-sm sm:text-base lg:text-lg uppercase tracking-[0.12em] text-[#F5F2EC]">
              SECTOR INTELLIGENCE &amp; VERTICAL ARCHITECTURES
            </span>
          </div>

          <span
            aria-hidden="true"
            className="h-px bg-[#262A33] flex-1 hidden md:block mx-2"
          />

          <span className="text-xs sm:text-[13px] font-mono uppercase tracking-[0.18em] text-[#898D94] shrink-0">
            SECTORS DIRECTORY
          </span>
        </div>

        {/* Main 2-Column Editorial Manifesto */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 pt-2 items-start">
          {/* Left Column: Headline, Description & CTAs */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col space-y-6 sm:space-y-8">
            <h1 className="font-heading font-extrabold text-[clamp(2.5rem,4.6vw,4.75rem)] leading-[0.98] tracking-[-0.035em] text-[#F5F2EC]">
              <span className="block">Connected execution across</span>
              <span className="block">specialized sectors.</span>
              <span className="block italic text-[#F06419] font-extrabold">
                Engineered for depth.
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-[22px] text-[#B8B9BC] leading-[1.5] max-w-[760px]">
              Every industry operates under distinct velocity, compliance boundaries, and audience expectations. We adapt our four integrated disciplines to solve the exact operational, digital and creative challenges of each domain.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2 sm:pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl bg-[#F06419] text-[#171717] font-bold text-sm sm:text-base hover:bg-[#E05308] transition-colors shadow-sm shrink-0"
              >
                <span>Book a discovery call</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </Link>

              <Link
                href="/work"
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 sm:py-4 rounded-xl border border-[#444444] text-[#F5F2EC] font-semibold text-sm sm:text-base hover:border-[#F06419] hover:text-[#F06419] hover:bg-[#F06419]/10 transition-colors shrink-0"
              >
                <span>Explore blueprints</span>
                <ArrowUpRight className="w-4 h-4 shrink-0" />
              </Link>
            </div>
          </div>

          {/* Right Column: Deployment Process */}
          <div className="lg:col-span-5 xl:col-span-5 flex flex-col space-y-6 lg:border-l lg:border-[#262A33] lg:pl-10 xl:pl-12">
            <div className="text-xs sm:text-[13px] font-mono font-bold uppercase tracking-[0.16em] text-[#D9B875]">
              THE SECTOR INTEGRATION PROCESS
            </div>

            <div className="divide-y divide-[#262A33] space-y-6">
              {stages.map((stage, idx) => (
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
