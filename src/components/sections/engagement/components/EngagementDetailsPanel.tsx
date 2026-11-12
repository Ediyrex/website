"use client";

import { AnimatePresence, motion } from "motion/react";
import type { EngagementModel } from "../data/engagementModels";
import { EngagementBenefits } from "./EngagementBenefits";
import { EngagementCTA } from "./EngagementCTA";

interface EngagementDetailsPanelProps {
  model: EngagementModel;
}

export function EngagementDetailsPanel({ model }: EngagementDetailsPanelProps) {
  return (
    <div
      data-engagement-stage
      className="relative overflow-hidden rounded-[28px] border border-[#E5DBD1] bg-gradient-to-br from-[#FFFDFC] via-[#FCF6EE] to-[#F7EADF] p-6 sm:p-8 shadow-[0_28px_70px_-30px_rgba(17,17,17,0.16)]"
    >
      {/* Subtle diagonal soft highlight sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-[#FF6900]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 h-36 w-56 bg-gradient-to-tl from-[#FF9B4B]/12 via-transparent to-transparent"
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={model.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 space-y-6"
        >
          {/* Top micro-metadata bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-[10.5px] font-mono uppercase tracking-[0.14em] text-[#5B5650]">
            <span>{model.eyebrow}</span>
            <span className="text-[#45413C]">{model.tags}</span>
          </div>

          {/* Dynamic heading + subtitle */}
          <div className="space-y-1.5">
            <h3 className="font-heading text-[24px] sm:text-[28px] font-bold tracking-[-0.025em] leading-[1.15] text-[#111111]">
              {model.panelTitle}
            </h3>
            <p className="text-[14.5px] leading-[1.5] text-[#4B4742]">
              {model.panelSubtitle}
            </p>
          </div>

          {/* Soft divider */}
          <div className="h-px w-full bg-[#E8DFD5]" aria-hidden="true" />

          {/* Benefits list */}
          <EngagementBenefits benefits={model.benefits} />

          {/* Action CTA */}
          <div className="pt-1">
            <EngagementCTA label={model.ctaLabel} href={model.href} />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
