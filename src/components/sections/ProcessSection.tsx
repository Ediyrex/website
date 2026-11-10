import React from "react";

const STAGES = [
  {
    index: "01",
    title: "Discover",
    description:
      "Understand the business, audience, operational bottlenecks and desired commercial outcome.",
  },
  {
    index: "02",
    title: "Define",
    description:
      "Agree on clear scope, deliverables, priorities, milestones and measurable criteria.",
  },
  {
    index: "03",
    title: "Create",
    description:
      "Design, develop, produce and review the agreed solution in transparent checkpoints.",
  },
  {
    index: "04",
    title: "Deliver",
    description:
      "Launch or hand over the work cleanly with documentation and defined next steps.",
  },
];

export function ProcessSection() {
  return (
    <section
      id="process"
      className="py-16 md:py-28 bg-[#0D0F12] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
            Workflow
          </span>
          <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12]">
            A straightforward path from concept to launch.
          </h2>
        </div>

        {/* 4-Stage Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
          {STAGES.map((stage, i) => (
            <div key={stage.index} className="relative space-y-4">
              {/* Index & Connecting Line */}
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-[#12151A] border border-[#3A414B] flex items-center justify-center text-xs font-mono text-[#D6B77A] shrink-0">
                  {stage.index}
                </span>
                {i < STAGES.length - 1 && (
                  <div
                    aria-hidden="true"
                    className="hidden md:block flex-1 h-px bg-[#252A32]"
                  />
                )}
              </div>

              <div className="space-y-2">
                <h3 className="font-heading font-semibold text-xl text-[#F5F3EE]">
                  {stage.title}
                </h3>
                <p className="text-sm text-[#B2B4BA] leading-relaxed">
                  {stage.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
