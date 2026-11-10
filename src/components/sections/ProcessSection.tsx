"use client";

import React from "react";
import { motion, useReducedMotion } from "motion/react";

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
  const shouldReduceMotion = Boolean(useReducedMotion());

  return (
    <section
      id="process"
      className="py-16 md:py-28 bg-[#08090B] border-b border-[#252A32]"
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

        {/* 4-Stage Timeline with Scroll-Drawn SVG Connector */}
        <div className="relative">
          {/* Desktop Animated SVG Draw Path */}
          <svg
            aria-hidden="true"
            className="hidden md:block absolute top-4 left-4 right-4 w-[calc(100%-2rem)] h-2 pointer-events-none"
            preserveAspectRatio="none"
          >
            <line
              x1="0%"
              y1="4"
              x2="100%"
              y2="4"
              stroke="#252A32"
              strokeWidth="1"
            />
            <motion.line
              x1="0%"
              y1="4"
              x2="100%"
              y2="4"
              stroke="#D6B77A"
              strokeWidth="1.5"
              initial={shouldReduceMotion ? { pathLength: 1 } : { pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative z-10">
            {STAGES.map((stage, i) => (
              <motion.div
                key={stage.index}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{
                  duration: 0.4,
                  delay: shouldReduceMotion ? 0 : i * 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative space-y-4"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#12151A] border border-[#D6B77A]/60 flex items-center justify-center text-xs font-mono text-[#D6B77A] shrink-0">
                    {stage.index}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-heading font-semibold text-xl text-[#F5F3EE]">
                    {stage.title}
                  </h3>
                  <p className="text-sm text-[#B2B4BA] leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
