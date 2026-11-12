"use client";

import { Layers, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EngagementIconKey, EngagementModel } from "../data/engagementModels";

interface EngagementCardProps {
  model: EngagementModel;
  isActive: boolean;
  slotIndex: number;
  onSelect: () => void;
}

const ICONS: Record<EngagementIconKey, typeof Layers> = {
  layers: Layers,
  users: Users,
  zap: Zap,
};

const DESKTOP_TILT_CLASSES = [
  "md:[transform:perspective(1100px)_rotateY(12deg)_rotateX(3deg)_translateY(-4px)] md:z-30",
  "md:[transform:perspective(1100px)_rotateY(11deg)_rotateX(3deg)_translateY(2px)_scale(0.96)] md:z-20",
  "md:[transform:perspective(1100px)_rotateY(10deg)_rotateX(2deg)_translateY(8px)_scale(0.92)] md:z-10",
];

export function EngagementCard({
  model,
  isActive,
  slotIndex,
  onSelect,
}: EngagementCardProps) {
  const Icon = ICONS[model.icon];
  const tiltClass = DESKTOP_TILT_CLASSES[slotIndex] ?? DESKTOP_TILT_CLASSES[0];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={isActive}
      className={cn(
        "group relative flex flex-col justify-between text-left rounded-[24px] p-5 sm:p-6 transition-all duration-500 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6900] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F7F1E9]",
        "min-h-[300px] sm:min-h-[340px] w-full backdrop-blur-md",
        tiltClass,
        isActive
          ? "bg-gradient-to-br from-[#FFFDFC] via-[#FFF6EC] to-[#FFE8D1]/95 border border-[#FF9A4D] shadow-[0_26px_54px_-18px_rgba(255,105,0,0.34),0_12px_28px_-12px_rgba(17,17,17,0.12)] md:scale-[1.04] md:-translate-y-2 md:z-40"
          : "bg-gradient-to-br from-[#FFFDFC]/92 via-[#FAF4EC]/90 to-[#F3EBE2]/88 border border-[#E4DAD0] shadow-[0_18px_38px_-20px_rgba(17,17,17,0.14)] hover:border-[#FF9A4D]/65 hover:-translate-y-1.5"
      )}
    >
      {/* Dimensional active rim glow along bottom-left bezel */}
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[24px] transition-opacity duration-500",
          isActive
            ? "opacity-100 ring-1 ring-inset ring-[#FFB36B]/80 shadow-[inset_3px_-4px_16px_rgba(255,105,0,0.22)]"
            : "opacity-0 group-hover:opacity-60 ring-1 ring-inset ring-[#FF9A4D]/35"
        )}
      />

      {/* Ambient orange rim bloom behind active card */}
      {isActive && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-2 -left-2 right-4 h-12 rounded-full bg-[#FF6900]/22 blur-xl -z-10"
        />
      )}

      <div className="relative z-10 space-y-4">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              "font-mono text-xs font-semibold tracking-wider transition-colors",
              isActive ? "text-[#111111]" : "text-[#4B4742]"
            )}
          >
            {model.index}
          </span>
          {isActive && (
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6900]" aria-hidden="true" />
          )}
        </div>

        {/* Floating circular icon medallion */}
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full border transition-all duration-300",
            isActive
              ? "border-[#FF6900]/45 bg-gradient-to-br from-[#FFF4E8] to-[#FFE2C6] text-[#E65100] shadow-[0_6px_16px_-6px_rgba(255,105,0,0.45)]"
              : "border-[#E6DDD4] bg-[#FFFDFC]/90 text-[#DF6A18] group-hover:border-[#FF6900]/35"
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="space-y-2 pt-1">
          <h3 className="font-heading text-[18px] sm:text-[19px] font-bold tracking-[-0.02em] leading-[1.2] text-[#111111]">
            {model.title}
          </h3>
          <p className="text-[12.5px] sm:text-[13px] leading-[1.55] text-[#45413C]">
            {model.shortDesc}
          </p>
        </div>
      </div>

      {/* Bottom metadata pill */}
      <div className="relative z-10 pt-5">
        <span
          className={cn(
            "inline-flex items-center rounded-full border px-3 py-1 text-[10.5px] font-medium tracking-[0.01em] transition-colors",
            isActive
              ? "border-[#E9C3A4] bg-[#FFF8F0]/90 text-[#1F1D1B]"
              : "border-[#E2D9D0] bg-[#FAF4EC]/80 text-[#3F3B37]"
          )}
        >
          {model.chipLabel}
        </span>
      </div>
    </button>
  );
}

