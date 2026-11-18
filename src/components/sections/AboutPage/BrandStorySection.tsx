import React from "react";
import { CheckCircle2 } from "lucide-react";

interface FragmentedNode {
  index: string;
  title: string;
  subtitle: string;
}

const FRAGMENTED_NODES: readonly FragmentedNode[] = [
  {
    index: "01",
    title: "BRANDING",
    subtitle: "Separate creative agency",
  },
  {
    index: "02",
    title: "MEDIA",
    subtitle: "Independent production team",
  },
  {
    index: "03",
    title: "DIGITAL",
    subtitle: "External development vendor",
  },
  {
    index: "04",
    title: "AI & AUTOMATION",
    subtitle: "Additional technology provider",
  },
];

interface ConnectedDivision {
  index: string;
  titleLines: readonly string[];
}

const CONNECTED_DIVISIONS: readonly ConnectedDivision[] = [
  {
    index: "01",
    titleLines: ["BRANDING &", "MARKETING"],
  },
  {
    index: "02",
    titleLines: ["MEDIA &", "CONTENT PRODUCTION"],
  },
  {
    index: "03",
    titleLines: ["WEB, APPS &", "DIGITAL PRODUCTS"],
  },
  {
    index: "04",
    titleLines: ["AI &", "AUTOMATION"],
  },
];

export function BrandStorySection() {
  return (
    <section
      id="brand-story"
      aria-label="01 / Brand Story & Origin"
      className="w-full bg-[#FAF8F5] text-[#0B0D10] py-16 sm:py-20 lg:py-24 border-b border-[#EAE5DC]"
    >
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10 lg:space-y-12">
        {/* 02. SECTION INTRODUCTION */}
        <div className="space-y-4">
          <h2 className="font-heading font-extrabold text-[clamp(2.35rem,4.4vw,4.25rem)] leading-[0.98] tracking-[-0.035em] text-[#0B0D10]">
            Great ideas shouldn&apos;t get lost between teams.
            <br />
            <span className="text-[#F06419] italic font-heading font-extrabold">
              We built a better way to work.
            </span>
          </h2>

          <p className="text-[16px] sm:text-[18px] text-[#555962] leading-[1.55] max-w-[1300px] pt-1">
            Building a modern business requires branding, content, web engineering and automation.
            Yet traditional agency structures often separate these disciplines, creating unnecessary
            handoffs, repeated conversations and disconnected execution.
          </p>
        </div>

        {/* 03. DIAGRAMS WRAPPER */}
        <div className="space-y-6">
          {/* STAGE 01 — THE FRAGMENTED MODEL */}
          <div className="rounded-[20px] bg-[#FFFFFF] border border-[#EAE5DC] p-5 sm:p-7 lg:p-8 space-y-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
            {/* Stage Status Header */}
            <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-[#EAE5DC]">
              <div className="flex items-center gap-2 text-[#F06464]">
                <span className="inline-flex items-center justify-center w-4 h-4 rounded-full border border-[#F06464] text-[10px] font-bold leading-none">
                  &times;
                </span>
                <span className="text-xs sm:text-[13px] font-mono font-bold uppercase tracking-wider">
                  THE FRAGMENTED MODEL
                </span>
              </div>
              <span className="text-[#D9D2C8]">|</span>
              <span className="text-xs sm:text-[12px] font-mono uppercase tracking-wider text-[#777D87]">
                MULTIPLE TEAMS &middot; DISCONNECTED EXECUTION
              </span>
            </div>

            {/* 4 Nodes with Handoff Connectors */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-0">
              {FRAGMENTED_NODES.map((node, idx) => (
                <React.Fragment key={node.index}>
                  {/* Node Box */}
                  <div className="flex-1 rounded-[14px] border border-[#EAE5DC] bg-[#FAF8F5] p-5 min-h-[110px] flex flex-col justify-between">
                    <span className="font-mono text-xs font-bold text-[#F06419] block mb-2">
                      {node.index}
                    </span>
                    <div>
                      <h3 className="font-heading font-extrabold text-[16px] sm:text-[17px] text-[#0B0D10] tracking-tight uppercase leading-tight">
                        {node.title}
                      </h3>
                      <p className="text-[12.5px] sm:text-[13px] text-[#555962] mt-1 leading-snug">
                        {node.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Broken Handoff Connector */}
                  {idx < FRAGMENTED_NODES.length - 1 && (
                    <div className="hidden md:flex flex-col items-center justify-center shrink-0 w-16 lg:w-24 px-1 text-center">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F06464] whitespace-nowrap mb-1">
                        &times; HANDOFF
                      </span>
                      <div className="w-full border-t border-dashed border-[#F06464]/70 h-0" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* The Three Problems Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#EAE5DC] pt-6 border-t border-[#EAE5DC] text-[14px] sm:text-[15px] text-[#555962]">
              <div className="flex items-center gap-3 py-2 md:py-0 md:pr-4">
                <span className="text-[#F06464] font-bold text-base shrink-0">&times;</span>
                <span>Context gets lost between teams.</span>
              </div>
              <div className="flex items-center gap-3 py-2 md:py-0 md:px-6">
                <span className="text-[#F06464] font-bold text-base shrink-0">&times;</span>
                <span>Creative intent gets compromised during execution.</span>
              </div>
              <div className="flex items-center gap-3 py-2 md:py-0 md:pl-6">
                <span className="text-[#F06464] font-bold text-base shrink-0">&times;</span>
                <span>Business operations remain disconnected.</span>
              </div>
            </div>
          </div>

          {/* TRANSITION ARROW */}
          <div className="w-full flex items-center justify-center py-2">
            <svg
              className="w-7 h-7 text-[#F06419]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>

          {/* STAGE 02 — THE EDYREX MODEL (Vibrant Signal Orange Container) */}
          <div className="rounded-[22px] sm:rounded-[24px] bg-[#F06419] p-6 sm:p-9 lg:p-10 text-[#090A0D] shadow-xl relative">
            {/* Model Header */}
            <div className="flex items-center gap-3 pb-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#090A0D] shrink-0 stroke-[2.5]" />
                <span className="text-xs sm:text-[13px] font-mono font-bold uppercase tracking-wider text-[#090A0D]">
                  THE EDIYREX MODEL
                </span>
              </div>
              <span
                aria-hidden="true"
                className="h-px bg-[#090A0D]/30 flex-1 inline-block ml-2"
              />
            </div>

            {/* Main Heading */}
            <h3 className="font-heading font-black text-[clamp(1.85rem,3.4vw,2.85rem)] tracking-[-0.035em] leading-[1.05] text-[#090A0D] mt-2 mb-8">
              ONE STUDIO. FOUR CONNECTED DISCIPLINES.
            </h3>

            {/* Four Connected Disciplines with Solid Connectors */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 md:gap-0">
              {CONNECTED_DIVISIONS.map((division, idx) => (
                <React.Fragment key={division.index}>
                  {/* Discipline Card */}
                  <div className="flex-1 rounded-[14px] border-[1.8px] border-[#090A0D] bg-transparent p-5 sm:p-6 min-h-[110px] flex flex-col justify-between">
                    <span className="font-mono text-xs font-bold text-[#090A0D] block mb-2">
                      {division.index}
                    </span>
                    <h4 className="font-heading font-extrabold text-[15px] sm:text-[16px] text-[#090A0D] uppercase tracking-tight leading-snug">
                      {division.titleLines.map((line) => (
                        <span key={line} className="block">
                          {line}
                        </span>
                      ))}
                    </h4>
                  </div>

                  {/* Solid Continuous Connecting Rule between cards */}
                  {idx < CONNECTED_DIVISIONS.length - 1 && (
                    <div
                      aria-hidden="true"
                      className="hidden md:block w-8 lg:w-12 h-[2px] bg-[#090A0D] shrink-0"
                    />
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Centered Pill Badge Signature with Flanking Lines */}
            <div className="flex items-center justify-center pt-8 mt-3">
              <span aria-hidden="true" className="h-px bg-[#090A0D]/35 flex-1" />
              <div className="px-5 py-2 rounded-full bg-[#090A0D] text-[#F5F2EC] text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.16em] mx-4 shrink-0 shadow-sm">
                EDIYREX / ONE CONNECTED TEAM
              </div>
              <span aria-hidden="true" className="h-px bg-[#090A0D]/35 flex-1" />
            </div>
          </div>
        </div>

        {/* 04. STAGE 03 — THE STUDIO THESIS */}
        <div className="pt-8 border-t border-[#EAE5DC] flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <span className="text-xs sm:text-[14px] font-mono font-bold uppercase tracking-[0.18em] text-[#F06419] shrink-0">
            THE STUDIO THESIS
          </span>
          <span
            aria-hidden="true"
            className="hidden sm:inline-block w-px h-8 bg-[#EAE5DC]"
          />
          <p className="text-[18px] sm:text-[21px] lg:text-[23px] text-[#0B0D10] font-heading font-semibold leading-[1.38]">
            We founded EDIYREX to bring high-craft creative direction and robust technical
            engineering together, executed through one connected team.
          </p>
        </div>
      </div>
    </section>
  );
}
