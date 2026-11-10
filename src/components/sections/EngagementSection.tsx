import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

const ENGAGEMENT_MODELS = [
  {
    index: "01",
    title: "Project-based",
    description:
      "A clearly defined deliverable—such as a flagship website, brand film, or custom AI workflow—with an agreed scope and milestone structure.",
    scopeNote: "Custom scope and quotation",
  },
  {
    index: "02",
    title: "Ongoing collaboration",
    description:
      "Continued creative direction, product engineering, or AI system maintenance for teams looking for a dependable long-term partner.",
    scopeNote: "Custom scope and quotation",
  },
  {
    index: "03",
    title: "Custom engagement",
    description:
      "An integrated combination of Media, Digital and AI services tailored to launch a new venture or modernize existing operations.",
    scopeNote: "Custom scope and quotation",
  },
];

export function EngagementSection() {
  return (
    <section
      id="engagement"
      className="py-16 md:py-28 bg-[#08090B] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
              Engagement Model
            </span>
            <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12]">
              Flexible ways to begin working together.
            </h2>
          </div>

          <Button href="/contact" variant="outline" size="md">
            <span>Discuss your project</span>
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ENGAGEMENT_MODELS.map((model) => (
            <div
              key={model.index}
              className="p-7 md:p-8 rounded-2xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] transition-colors flex flex-col justify-between space-y-8"
            >
              <div className="space-y-4">
                <span className="text-xs font-mono text-[#777D87]">
                  {model.index}
                </span>
                <h3 className="font-heading font-semibold text-2xl text-[#F5F3EE]">
                  {model.title}
                </h3>
                <p className="text-sm text-[#B2B4BA] leading-relaxed">
                  {model.description}
                </p>
              </div>

              <div className="pt-4 border-t border-[#252A32]">
                <span className="text-xs font-mono text-[#D6B77A]">
                  {model.scopeNote}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
