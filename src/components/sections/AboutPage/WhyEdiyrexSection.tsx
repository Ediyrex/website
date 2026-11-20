import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface StudioPrinciple {
  index: string;
  title: string;
  description: string;
}

const PRINCIPLES: readonly StudioPrinciple[] = [
  {
    index: "01",
    title: "ONE CONNECTED TEAM",
    description:
      "Creative, digital and AI work are planned together from day one, eliminating fragmented agency handoffs.",
  },
  {
    index: "02",
    title: "BUILT AROUND THE OBJECTIVE",
    description:
      "Scope, visual treatment and technology stack are chosen strictly according to the business problem.",
  },
  {
    index: "03",
    title: "CRAFT MEETS FUNCTION",
    description:
      "Editorial visual quality and practical everyday usability matter equally in every deliverable.",
  },
  {
    index: "04",
    title: "DESIGNED TO EVOLVE",
    description:
      "Deliverables are documented, maintainable and engineered cleanly for future iteration and scale.",
  },
];

export function WhyEdiyrexSection() {
  return (
    <section
      id="why-ediyrex"
      aria-label="Why Ediyrex — Studio Philosophy & In-House Labs"
      className="w-full bg-[#FAF8F5] text-[#0B0D10] py-16 md:py-24 lg:py-28 border-b border-[#EAE5DC]"
    >
      <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-14">
        <div className="max-w-5xl space-y-10">
          {/* Header Block */}
          <div className="space-y-4">
            {/* Display Headline */}
            <h2 className="font-heading font-extrabold text-[clamp(2.5rem,4.4vw,4.25rem)] leading-[1.04] tracking-[-0.035em] text-[#0B0D10]">
              Creative thinking.
              <br />
              Technical execution.
              <br />
              <span className="text-[#FF6900] italic font-heading font-extrabold">
                One connected process.
              </span>
            </h2>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-[#555962] leading-relaxed max-w-2xl pt-1">
              Client engagements fuel and pressure-test our engineering discipline &mdash;
              ensuring every pattern we deploy is grounded in real-world production systems.
            </p>
          </div>

          {/* 4 Principles in Responsive Row with Vertical Dividers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE5DC] pt-2">
            {PRINCIPLES.map((principle, idx) => (
              <div
                key={principle.index}
                className={`flex flex-col justify-between space-y-4 ${
                  idx === 0 ? "sm:pr-5 xl:pr-6" : "sm:px-5 xl:px-6"
                } ${idx > 0 ? "pt-5 sm:pt-0" : ""}`}
              >
                <div className="space-y-2.5">
                  {/* Orange-bordered pill badge */}
                  <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-[5px] border border-[#FF6900] text-[#FF6900] font-mono text-[11px] font-bold tracking-wider">
                    {principle.index}
                  </span>
                  <h3 className="font-heading font-extrabold text-[15px] sm:text-[16px] text-[#0B0D10] tracking-tight leading-snug uppercase pt-1">
                    {principle.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#555962] leading-relaxed">
                    {principle.description}
                  </p>
                </div>
                {/* Bottom Orange Accent Bar */}
                <span
                  aria-hidden="true"
                  className="block w-10 h-[2.5px] bg-[#FF6900]"
                />
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              href="#philosophy"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6900] text-white text-sm font-bold hover:bg-[#E55E00] transition-colors shadow-sm"
            >
              <span>Explore our studio approach</span>
              <ArrowUpRight className="w-4 h-4 text-white" strokeWidth={2.5} />
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-transparent border border-[#0B0D10] text-[#0B0D10] text-sm font-semibold hover:bg-[#0B0D10] hover:text-white transition-all duration-200"
            >
              <span>View our work</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
