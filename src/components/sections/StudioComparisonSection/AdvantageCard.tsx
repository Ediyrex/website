"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Check, Code2, Eye, Layers, Minus, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdvantageIconKey, KeyAdvantage } from "./comparison.data";

interface AdvantageCardProps {
  advantage: KeyAdvantage;
  index?: number;
  isActive?: boolean;
  onSelect?: () => void;
}

const ADVANTAGE_ICONS: Record<AdvantageIconKey, typeof Layers> = {
  layers: Layers,
  users: Users,
  eye: Eye,
  code: Code2,
  zap: Zap,
};

export function AdvantageCard({
  advantage,
  index = 0,
  isActive = false,
  onSelect,
}: AdvantageCardProps) {
  const Icon = ADVANTAGE_ICONS[advantage.icon];
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const isHighlighted = isActive || isHovered;

  return (
    <div
      data-sc-advantage-card
      className="h-full"
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.article
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.4, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
        whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
        className={cn(
          "group relative flex h-full flex-col justify-between rounded-[20px] bg-[#FFFCF8] p-5 sm:p-6 cursor-pointer overflow-hidden transition-all duration-300 select-none",
          isHighlighted
            ? "border border-[#FF6900] shadow-[0_20px_42px_-16px_rgba(255,105,0,0.32)]"
            : "border border-[#E5DED5] shadow-[0_8px_24px_-18px_rgba(17,17,17,0.08)] hover:border-[#FF9A48]/70"
        )}
      >
        {/* Dynamic Cursor Spotlight Radial Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-[20px] transition-opacity duration-300"
          style={{
            opacity: isHighlighted ? 1 : 0,
            background: isHovered
              ? `radial-gradient(280px circle at ${mousePos.x}px ${mousePos.y}px, rgba(255, 105, 0, 0.12), transparent 75%)`
              : "radial-gradient(circle at 50% 0%, rgba(255, 105, 0, 0.08), transparent 70%)",
          }}
        />

        {/* Luminous Top Shimmer Accent Bar */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute top-0 inset-x-4 h-[2px] transition-opacity duration-300",
            isHighlighted
              ? "opacity-100 bg-gradient-to-r from-transparent via-[#FF6900] to-transparent shadow-[0_0_12px_#FF6900]"
              : "opacity-0"
          )}
        />

        {/* Header Block: Icon, Index, Title */}
        <div className="relative z-10 space-y-3.5">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-300",
                isHighlighted
                  ? "bg-[#FF6900] text-black shadow-[0_0_16px_rgba(255,105,0,0.4)] scale-105"
                  : "bg-[#FF6900]/10 text-[#FF7900] border border-[#FF6900]/20 group-hover:scale-105"
              )}
            >
              <Icon className="h-4 w-4 stroke-[2]" aria-hidden="true" />
            </div>

            <span className="font-mono text-[11px] font-bold text-[#FF6900] tracking-wider uppercase bg-[#FF6900]/8 px-1.5 py-0.5 rounded border border-[#FF6900]/20">
              {advantage.index}
            </span>

            <h3 className="font-heading text-[16.5px] sm:text-[17.5px] font-bold tracking-tight text-[#111111] leading-tight">
              {advantage.title}
            </h3>
          </div>

          <div
            className={cn(
              "h-px w-full transition-colors duration-200",
              isHighlighted ? "bg-[#FF6900]/30" : "bg-[#E5DED5]"
            )}
            aria-hidden="true"
          />
        </div>

        {/* Comparisons Block */}
        <div className="relative z-10 space-y-3 pt-4">
          {/* Ediyrex Advantage (Green Checkmark) */}
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 w-4 h-4 rounded-full bg-[#18A879]/15 border border-[#18A879]/30 flex items-center justify-center text-[#18A879] shrink-0 transition-transform duration-200 group-hover:scale-110">
              <Check className="h-2.5 w-2.5 stroke-[3]" aria-label="EDIYREX advantage" />
            </div>
            <p className="text-[13px] sm:text-[13.5px] leading-[1.45] font-medium text-[#111111]">
              {advantage.ediyrex}
            </p>
          </div>

          {/* Traditional Agency Limitation (Muted Minus) */}
          <div className="flex items-start gap-2.5">
            <div className="mt-0.5 w-4 h-4 rounded-full bg-[#A89E94]/10 flex items-center justify-center text-[#817A72] shrink-0">
              <Minus className="h-2.5 w-2.5 stroke-[2.5]" aria-label="Traditional agency limitation" />
            </div>
            <p className="text-[12.5px] sm:text-[13px] leading-[1.45] text-[#7A736B]">
              {advantage.traditional}
            </p>
          </div>
        </div>
      </motion.article>
    </div>
  );
}
