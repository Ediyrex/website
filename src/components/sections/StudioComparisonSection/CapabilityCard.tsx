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
    <div data-sc-capability-card className="h-full">
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        aria-label={`${capability.title}: ${capability.subtitle} (${capability.items.join(", ")})`}
        className="group relative flex h-full min-h-[154px] flex-col justify-between px-5 py-5 sm:px-5.5 text-left cursor-pointer"
      >
        {/* Glassmorphic card plate with frosted translucency and specular sheen */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[20px] sm:-skew-x-6 backdrop-blur-md bg-gradient-to-br from-white/85 via-[#FFF4EA]/70 to-[#FFE9D5]/60 border border-white/90 shadow-[0_10px_30px_-10px_rgba(255,121,0,0.18),inset_0_1.5px_1px_rgba(255,255,255,0.95),inset_0_-1px_2px_rgba(255,140,60,0.12)] transition-all duration-300 group-hover:border-[#FF9A48]/80 group-hover:from-white/95 group-hover:via-[#FFF0E2]/80 group-hover:to-[#FFDFBE]/70 group-hover:shadow-[0_16px_36px_-8px_rgba(255,121,0,0.28),inset_0_2px_2px_rgba(255,255,255,1)]"
        />

        {/* Top-edge glass reflection sheen */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 top-1 h-[1.5px] rounded-full sm:-skew-x-6 bg-gradient-to-r from-transparent via-white to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Frosted Glass Icon Badge */}
        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/90 bg-white/80 backdrop-blur-md text-[#FF7900] shadow-[0_4px_14px_rgba(255,121,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.9)] transition-all duration-300 group-hover:border-[#FF7900]/50 group-hover:bg-white group-hover:scale-105 group-hover:shadow-[0_6px_18px_rgba(255,121,0,0.24)]">
          <Icon className="h-5 w-5 stroke-[1.8]" aria-hidden="true" />
        </div>

        {/* Text Body */}
        <div className="relative z-10 space-y-1 pt-4">
          <h4 className="font-heading text-[18px] sm:text-[19px] font-bold tracking-[-0.02em] text-[#111111] transition-colors duration-200 group-hover:text-[#FF6900]">
            {capability.title}
          </h4>
          <p className="text-[12.5px] sm:text-[13px] leading-[1.4] text-[#48433F] font-medium">
            {capability.subtitle}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
