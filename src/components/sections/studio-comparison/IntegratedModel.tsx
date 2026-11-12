import { Code2, PlayCircle, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { STUDIO_PILLARS, type PillarIconKey } from "./comparison.data";

const PILLAR_ICONS: Record<PillarIconKey, typeof PlayCircle> = {
  play: PlayCircle,
  code: Code2,
  sparkles: Sparkles,
};

export function IntegratedModel() {
  return (
    <div className="relative space-y-5">
      {/* Header block */}
      <div className="space-y-2.5 lg:pl-6">
        <span className="inline-flex items-center rounded-full border border-[#FF8A24]/55 bg-[#211A14]/90 px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#FFB347] shadow-[0_0_16px_rgba(255,138,36,0.16)]">
          THE EDIYREX WAY
        </span>
        <h3 className="font-heading text-[24px] sm:text-[28px] font-bold tracking-[-0.02em] text-[#F7F3ED]">
          EDIYREX Studio
        </h3>
        <p className="text-[14px] leading-[1.55] text-[#B8B0A7] max-w-[350px]">
          Media, Digital and AI working as one integrated system.
        </p>
      </div>

      {/* 3D Architectural Layered Stage */}
      <div className="relative mx-auto max-w-[540px] pt-4 pb-6 lg:pt-2">
        {/* Ambient radial floor illumination & concentric orbital rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-4 bottom-2 h-40 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(255,138,36,0.28),transparent_68%)] blur-2xl"
        />

        <svg
          aria-hidden="true"
          viewBox="0 0 540 220"
          fill="none"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-36 opacity-75"
        >
          <ellipse
            cx="270"
            cy="152"
            rx="242"
            ry="50"
            stroke="#FF8A24"
            strokeOpacity="0.34"
            strokeWidth="1.2"
          />
          <ellipse
            cx="270"
            cy="152"
            rx="192"
            ry="38"
            stroke="#FFB347"
            strokeOpacity="0.22"
            strokeWidth="1"
          />
        </svg>

        {/* Architectural Composition Stack */}
        <div className="relative flex flex-col items-center [perspective:1200px]">
          {/* TOP LAYER: Prominent EDIYREX Brand Plate */}
          <div
            data-comp-brand-plate
            className="relative z-30 mb-[-14px] sm:mb-[-18px] w-[200px] sm:w-[230px] rounded-[22px] border border-[#FF9B3D]/85 bg-gradient-to-br from-[#2B1B10] via-[#17110D] to-[#0D0A08] p-5 sm:p-6 text-center shadow-[0_24px_50px_-14px_rgba(0,0,0,0.9),0_0_32px_rgba(255,138,36,0.34),inset_0_1px_1px_rgba(255,215,170,0.38)] [transform:perspective(900px)_rotateX(16deg)_rotateY(-12deg)]"
          >
            {/* Bottom 3D bevel edge highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-[22px] ring-1 ring-inset ring-[#FFB347]/35 shadow-[inset_0_-4px_12px_rgba(255,138,36,0.25)]"
            />
            {/* Specular sheen */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-6 -right-6 h-24 w-28 rotate-12 bg-gradient-to-b from-white/12 to-transparent blur-md"
            />

            <div className="relative z-10 flex flex-col items-center gap-2">
              {/* Bespoke Geometric EDIYREX Monogram */}
              <svg
                viewBox="0 0 44 36"
                fill="none"
                aria-hidden="true"
                className="h-8 w-10 drop-shadow-[0_0_12px_rgba(255,179,71,0.45)]"
              >
                <path
                  d="M 8 5 L 36 5 L 33 11 L 14 11 L 12 15 L 30 15 L 27 21 L 10 21 L 8 25 L 31 25 L 28 31 L 2 31 L 8 5 Z"
                  fill="url(#ediyrex-brand-grad)"
                />
                <defs>
                  <linearGradient id="ediyrex-brand-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD28E" />
                    <stop offset="55%" stopColor="#FF963F" />
                    <stop offset="100%" stopColor="#D85B12" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="space-y-0.5">
                <div className="font-heading text-[18px] sm:text-[20px] font-bold tracking-[0.14em] text-[#F7F3ED]">
                  EDIYREX
                </div>
                <div className="font-mono text-[9.5px] uppercase tracking-[0.28em] text-[#E7B66D]">
                  STUDIO
                </div>
              </div>
            </div>
          </div>

          {/* MIDDLE GLASS RISER + SERVICE CARDS + FOUNDATION PLATFORM */}
          <div
            data-comp-glass-slab
            className="relative z-20 w-full rounded-[26px] border border-[#FF8A24]/45 bg-gradient-to-b from-[#2A1B12]/70 via-[#1B1410]/85 to-[#120E0B]/95 px-4 pt-9 pb-5 sm:px-6 sm:pt-11 sm:pb-6 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.92),0_12px_36px_-10px_rgba(255,138,36,0.22),inset_0_1px_0_rgba(255,190,130,0.28)] backdrop-blur-md"
          >
            {/* Translucent middle glass step slab behind cards */}
            <div
              aria-hidden="true"
              className="pointer-events-none mx-auto mb-[-34px] h-14 w-[76%] rounded-[18px] border border-white/15 bg-gradient-to-b from-white/[0.08] to-white/[0.02] shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]"
            />

            {/* Three connected pillar cards: Media · Digital · AI */}
            <div className="relative z-10 grid grid-cols-3 gap-2.5 sm:gap-4">
              {STUDIO_PILLARS.map((pillar) => {
                const Icon = PILLAR_ICONS[pillar.icon];
                return (
                  <div
                    key={pillar.id}
                    data-comp-pillar
                    className={cn(
                      "group relative flex flex-col items-center justify-center gap-2.5 rounded-[16px] border border-[#FF8A24]/55 bg-gradient-to-b from-[#251A13]/95 via-[#181310]/95 to-[#120E0B] px-2.5 py-5 sm:py-6 text-center shadow-[0_14px_28px_-12px_rgba(0,0,0,0.85),inset_0_1px_0_rgba(255,190,130,0.24)] transition-all duration-300 hover:border-[#FFB347]/80 hover:-translate-y-0.5",
                      pillar.tiltClass
                    )}
                  >
                    <span className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full border border-[#FF8A24]/50 bg-[#FF8A24]/12 text-[#FFB347] shadow-[0_0_16px_rgba(255,138,36,0.28)]">
                      <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="font-heading text-[13.5px] sm:text-[15px] font-semibold tracking-[-0.01em] text-[#F7F3ED]">
                      {pillar.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom illuminated orange glass platform lip */}
            <div
              aria-hidden="true"
              className="mt-4 h-[5px] w-full rounded-full bg-gradient-to-r from-[#FF8A24]/15 via-[#FFB347]/75 to-[#FF8A24]/15 shadow-[0_0_18px_rgba(255,138,36,0.5)]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
