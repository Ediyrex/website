"use client";

import { motion } from "motion/react";
import { Code2, PlayCircle, Sparkles } from "lucide-react";
import type { CapabilityIconKey, StudioCapability } from "./comparison.data";

interface CapabilityCardProps {
  capability: StudioCapability;
}

const CAPABILITY_ICONS: Record<CapabilityIconKey, typeof PlayCircle> = {
  play: PlayCircle,
  code: Code2,
  sparkles: Sparkles,
};

export function CapabilityCard({ capability }: CapabilityCardProps) {
  const Icon = CAPABILITY_ICONS[capability.icon];

  return (
    <div data-sc-capability-card>
      <motion.div
        whileHover={{ y: -3 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        aria-label={`${capability.title}: ${capability.subtitle} (${capability.items.join(", ")})`}
        className="group relative flex h-full min-h-[146px] flex-col justify-between px-5 py-5 sm:px-6 text-left"
      >
        {/* Warm peach-tinted geometric card plate behind unskewed content */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[18px] border border-[#FFD5B2]/80 bg-gradient-to-br from-[#FFF2E5] via-[#FFECDA] to-[#FFE2C6]/85 shadow-[0_6px_18px_-12px_rgba(255,121,0,0.22)] transition-[border-color,background-color] duration-200 sm:-skew-x-6 group-hover:border-[#FF9A48] group-hover:from-[#FFEEDC] group-hover:to-[#FFDDBE]"
        />

        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#FF9A48]/55 bg-[#FFFCF8]/90 text-[#FF7900] transition-colors duration-200 group-hover:border-[#FF7900] group-hover:bg-white">
          <Icon className="h-5 w-5 stroke-[1.75]" aria-hidden="true" />
        </div>

        <div className="relative z-10 space-y-1 pt-4">
          <h4 className="font-heading text-[18px] sm:text-[19px] font-bold tracking-[-0.02em] text-[#111111]">
            {capability.title}
          </h4>
          <p className="text-[12.5px] sm:text-[13px] leading-[1.4] text-[#48433F]">
            {capability.subtitle}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

