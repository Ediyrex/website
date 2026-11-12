"use client";

import { motion } from "motion/react";
import { Check, Code2, Eye, Layers, Minus, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdvantageIconKey, KeyAdvantage } from "./comparison.data";

interface AdvantageCardProps {
  advantage: KeyAdvantage;
}

const ADVANTAGE_ICONS: Record<AdvantageIconKey, typeof Layers> = {
  layers: Layers,
  users: Users,
  eye: Eye,
  code: Code2,
  zap: Zap,
};

export function AdvantageCard({ advantage }: AdvantageCardProps) {
  const Icon = ADVANTAGE_ICONS[advantage.icon];

  return (
    <div data-sc-advantage-card className="h-full">
      <motion.article
        whileHover={{ y: -4 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className={cn(
          "group flex h-full flex-col justify-between rounded-[18px] bg-[#FFFCF8] p-6 transition-[border-color,box-shadow] duration-200",
          advantage.featured
            ? "border border-[#FF9A48] shadow-[0_14px_32px_-20px_rgba(255,121,0,0.28)] hover:border-[#FF7900]"
            : "border border-[#E5DED5] shadow-[0_8px_24px_-18px_rgba(17,17,17,0.1)] hover:border-[#D49F72]"
        )}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <Icon
              className="h-5 w-5 shrink-0 text-[#FF7900] stroke-[1.75] transition-transform duration-200 group-hover:scale-105"
              aria-hidden="true"
            />
            <span className="font-mono text-[12px] font-medium text-[#FF7900]">
              {advantage.index}
            </span>
            <h3 className="font-heading text-[17px] sm:text-[18px] font-semibold tracking-[-0.015em] text-[#111111]">
              {advantage.title}
            </h3>
          </div>

          <div className="h-px w-full bg-[#E5DED5]" aria-hidden="true" />
        </div>

        <div className="space-y-3.5 pt-4">
          <div className="flex items-start gap-2.5">
            <Check
              className="mt-0.5 h-4 w-4 shrink-0 text-[#18A879] stroke-[2.2]"
              aria-label="EDIYREX advantage"
            />
            <p className="text-[13.5px] sm:text-[14px] leading-[1.45] text-[#111111]">
              {advantage.ediyrex}
            </p>
          </div>

          <div className="flex items-start gap-2.5">
            <Minus
              className="mt-0.5 h-4 w-4 shrink-0 text-[#A89E94] stroke-[2]"
              aria-label="Traditional agency limitation"
            />
            <p className="text-[13px] leading-[1.45] text-[#817A72]">
              {advantage.traditional}
            </p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}

