import React from "react";
import { Check, Minus } from "lucide-react";

const COMPARISON_ROWS = [
  {
    dimension: "Disciplines",
    ediyrex: "Media, Digital, and AI planned as one system",
    traditional: "Siloed video, web, and software vendors",
  },
  {
    dimension: "Communication",
    ediyrex: "Direct access to engineers and creative leads",
    traditional: "Multiple account-manager relay layers",
  },
  {
    dimension: "Transparency",
    ediyrex: "Concept explorations honestly labeled; clear scope",
    traditional: "Inflated projections and vague retainers",
  },
  {
    dimension: "Architecture",
    ediyrex: "Clean TypeScript, Next.js, and PostgreSQL ownership",
    traditional: "Bloated templates and rigid plugin lock-in",
  },
  {
    dimension: "AI Capability",
    ediyrex: "Practical agents, voice reception & RAG integrated",
    traditional: "Surface-level chatbots bolted on afterwards",
  },
];

export function UsVsThemSection() {
  return (
    <section
      id="comparison"
      className="py-16 md:py-24 bg-[#08090B] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
        <div className="max-w-2xl space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
            Studio Comparison
          </span>
          <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(1.75rem,3.2vw,2.75rem)] leading-[1.14]">
            Why integrated beats fragmented.
          </h2>
        </div>

        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 border-b border-[#252A32] bg-[#0D0F12] text-xs font-mono uppercase tracking-wider">
            <div className="md:col-span-3 px-6 py-4 text-[#777D87]">
              Dimension
            </div>
            <div className="md:col-span-5 px-6 py-4 text-[#D6B77A] border-t md:border-t-0 md:border-l border-[#252A32]">
              Ediyrex Studio
            </div>
            <div className="md:col-span-4 px-6 py-4 text-[#777D87] border-t md:border-t-0 md:border-l border-[#252A32]">
              Traditional Siloed Agencies
            </div>
          </div>

          <div className="divide-y divide-[#252A32]">
            {COMPARISON_ROWS.map((row) => (
              <div
                key={row.dimension}
                className="grid grid-cols-1 md:grid-cols-12 text-sm"
              >
                <div className="md:col-span-3 px-6 py-5 font-heading font-semibold text-[#F5F3EE]">
                  {row.dimension}
                </div>
                <div className="md:col-span-5 px-6 py-5 text-[#F5F3EE] md:border-l border-[#252A32] flex items-start gap-2.5 bg-[#12151A]">
                  <Check className="w-4 h-4 text-[#54C99A] shrink-0 mt-0.5" />
                  <span>{row.ediyrex}</span>
                </div>
                <div className="md:col-span-4 px-6 py-5 text-[#777D87] md:border-l border-[#252A32] flex items-start gap-2.5 bg-[#0D0F12]/40">
                  <Minus className="w-4 h-4 text-[#777D87] shrink-0 mt-0.5" />
                  <span>{row.traditional}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

