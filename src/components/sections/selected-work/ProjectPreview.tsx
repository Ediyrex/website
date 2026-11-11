import React from "react";
import { Play, Mic } from "lucide-react";
import type { ProjectPreviewVariant } from "@/data/projects";

function LuminaPreview() {
  const waveformHeights = [
    18, 30, 22, 44, 28, 52, 34, 48, 24, 56, 38, 46, 26, 40, 20, 34, 48, 30, 42,
    22, 36, 18,
  ];

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center px-6 py-4 overflow-hidden">
      {/* Subtle Orange Ambient Glow */}
      <div
        aria-hidden="true"
        className="absolute -bottom-6 right-4 w-44 h-28 rounded-full blur-2xl opacity-45"
        style={{
          background:
            "radial-gradient(circle, rgba(243,107,22,0.8) 0%, rgba(243,107,22,0) 70%)",
        }}
      />

      {/* Tilted Frosted Video Frame */}
      <div className="relative z-10 w-[82%] max-w-[260px] h-[72px] rounded-xl border border-[#FF9A52]/40 bg-gradient-to-br from-white/[0.08] via-[#1C1815]/90 to-[#F36B16]/15 backdrop-blur-md flex items-center justify-center shadow-[0_12px_28px_rgba(0,0,0,0.5)] [transform:perspective(700px)_rotateX(8deg)_rotateY(-6deg)]">
        <div className="w-8 h-8 rounded-full bg-white/12 border border-white/25 flex items-center justify-center text-white">
          <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
        </div>
        <span
          aria-hidden="true"
          className="absolute bottom-2 left-3 right-3 h-px bg-gradient-to-r from-[#F36B16] via-[#FF9A52]/60 to-white/15"
        />
      </div>

      {/* Audio Waveform */}
      <div
        aria-hidden="true"
        className="relative z-10 mt-2.5 flex items-center gap-[3px] h-6"
      >
        {waveformHeights.map((h, i) => (
          <span
            key={i}
            className="w-[2px] rounded-full bg-gradient-to-t from-[#F36B16] to-[#FF9A52]"
            style={{ height: `${Math.max(5, Math.round(h * 0.42))}px` }}
          />
        ))}
      </div>
    </div>
  );
}

function StrataPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center px-5 py-3.5 overflow-hidden">
      {/* Warm Telemetry Bloom */}
      <div
        aria-hidden="true"
        className="absolute -bottom-6 left-1/3 w-48 h-24 rounded-full blur-2xl opacity-35"
        style={{
          background:
            "radial-gradient(circle, rgba(243,107,22,0.7) 0%, rgba(243,107,22,0) 70%)",
        }}
      />

      {/* Telemetry Graph Frame */}
      <div className="relative z-10 w-[88%] max-w-[290px] h-[108px] rounded-xl border border-white/15 bg-white/[0.04] backdrop-blur-sm p-3 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F36B16]" />
            <span className="w-1.5 h-1.5 rounded-full bg-white/30" />
            <span className="w-8 h-1 rounded-full bg-white/15 ml-1" />
          </div>
          <span className="rounded-md bg-white/[0.08] border border-white/15 px-2 py-0.5 text-[10px] font-semibold text-[#EAE4DD]">
            +42%
          </span>
        </div>

        {/* SVG Metrics Line Chart */}
        <svg viewBox="0 0 240 62" className="w-full h-14 overflow-visible">
          <path
            d="M 4 50 C 32 46, 54 34, 82 36 C 110 38, 128 24, 156 26 C 182 28, 204 12, 234 10"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="1.2"
          />
          <path
            d="M 4 54 C 36 52, 62 40, 92 42 C 122 44, 148 22, 178 24 C 204 26, 220 12, 236 8"
            fill="none"
            stroke="#F36B16"
            strokeWidth="1.75"
            strokeLinecap="round"
          />
          <circle cx="92" cy="42" r="2.5" fill="#FF9A52" />
          <circle cx="178" cy="24" r="2.5" fill="#FF9A52" />
          <circle cx="236" cy="8" r="3" fill="#F36B16" />
        </svg>
      </div>
    </div>
  );
}

function VocalisPreview() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden px-4">
      {/* Ambient Orange Wave Glow */}
      <div
        aria-hidden="true"
        className="absolute inset-x-8 bottom-0 h-20 rounded-full blur-2xl opacity-45"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(243,107,22,0.75) 0%, rgba(243,107,22,0) 70%)",
        }}
      />

      {/* Flowing Orange Sound Wave Paths */}
      <svg
        aria-hidden="true"
        viewBox="0 0 360 120"
        fill="none"
        className="absolute inset-0 w-full h-full"
      >
        <path
          d="M 0 68 Q 55 34, 110 66 T 220 64 T 360 58"
          stroke="#F36B16"
          strokeWidth="1.5"
          strokeOpacity="0.85"
        />
        <path
          d="M 0 74 Q 70 96, 135 66 T 260 68 T 360 72"
          stroke="#FF9A52"
          strokeWidth="1.15"
          strokeOpacity="0.6"
        />
        <path
          d="M 0 60 Q 90 48, 175 72 T 360 64"
          stroke="rgba(255,255,255,0.16)"
          strokeWidth="1"
        />
      </svg>

      {/* Central Voice Interface Orb */}
      <div className="relative z-10 w-12 h-12 rounded-full bg-[#1C1815]/90 border border-[#FF9A52]/65 shadow-[0_0_26px_rgba(243,107,22,0.35)] flex items-center justify-center text-white">
        <Mic className="w-5 h-5 text-[#EAE4DD]" strokeWidth={1.7} />
      </div>
    </div>
  );
}

interface ProjectPreviewProps {
  variant?: ProjectPreviewVariant;
}

export function ProjectPreview({ variant = "lumina" }: ProjectPreviewProps) {
  return (
    <div className="relative w-full h-[142px] sm:h-[148px] bg-[#151311] overflow-hidden">
      <div className="w-full h-full transition-all duration-350 ease-out group-hover:scale-[1.04] group-hover:brightness-110">
        {variant === "lumina" && <LuminaPreview />}
        {variant === "strata" && <StrataPreview />}
        {variant === "vocalis" && <VocalisPreview />}
      </div>
    </div>
  );
}

