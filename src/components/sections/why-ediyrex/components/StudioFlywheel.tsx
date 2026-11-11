import React from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { FlywheelPaths } from "./FlywheelPaths";
import { FlywheelNode } from "./FlywheelNode";

function CentralEdiyrexSquare({ compact = false }: { compact?: boolean }) {
  return (
    <div
      data-we-flywheel-core
      className={`relative z-30 rounded-[22px] flex flex-col items-center justify-center gap-2.5 border border-[#FFE2C5]/75 shadow-[0_24px_56px_-10px_rgba(255,101,0,0.52),inset_0_1.5px_2px_rgba(255,255,255,0.75)] ${
        compact ? "w-36 h-36 p-4" : "w-36 h-36 lg:w-40 lg:h-40 xl:w-[172px] xl:h-[172px] p-5"
      }`}
      style={{
        background:
          "radial-gradient(circle at 68% 30%, #FF9B42 0%, #FF6500 44%, #D94B00 92%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-br from-white/25 via-transparent to-black/20"
      />

      {/* Brand Emblem (Three Slanted Studio Bars) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 40 32"
        fill="none"
        className="relative z-10 w-8 h-6 text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]"
      >
        <path d="M10 6L28 2L25 8L7 12L10 6Z" fill="currentColor" />
        <path
          d="M8 15L29 10L26 16L5 21L8 15Z"
          fill="currentColor"
          fillOpacity="0.92"
        />
        <path
          d="M6 24L25 19L22 25L3 30L6 24Z"
          fill="currentColor"
          fillOpacity="0.82"
        />
      </svg>

      <span
        style={{ fontFamily: "var(--font-space-grotesk)" }}
        className="relative z-10 text-[20px] xl:text-[22px] font-bold tracking-[0.04em] text-white leading-none"
      >
        EDIYREX
      </span>
    </div>
  );
}

export function StudioFlywheel() {
  return (
    <div data-we-flywheel className="relative w-full">
      {/* Desktop & Tablet (md+): Interactive Glass Infinity Flywheel */}
      <div className="hidden md:flex relative w-full h-[350px] lg:h-[380px] xl:h-[405px] items-center justify-center">
        {/* Soft Warm Ambient Aura */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[12%] top-[18%] bottom-[14%] rounded-full blur-3xl opacity-45"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,101,0,0.28) 0%, rgba(255,226,197,0.25) 55%, transparent 78%)",
          }}
        />

        {/* SVG Double-Loop Infinity Illustration */}
        <div className="absolute inset-0">
          <FlywheelPaths />
        </div>

        {/* Positioned Floating Nodes + Central Luminous Core */}
        <div className="relative z-20 w-full flex items-center justify-between px-2 lg:px-3 xl:px-6">
          <FlywheelNode
            dataAttr="left"
            icon="users"
            title="Client Engagements"
            description="Strategy, branding, media, digital & automation."
          />

          <CentralEdiyrexSquare />

          <FlywheelNode
            dataAttr="right"
            icon="box"
            title="Internal R&D"
            description="Agents, systems & studio products."
          />
        </div>
      </div>

      {/* Mobile (< 768px): Simplified Vertical Feedback Loop */}
      <div className="md:hidden flex flex-col items-center gap-3.5 py-2">
        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#D94B00]"
        >
          REAL-WORLD INSIGHTS
        </span>

        <FlywheelNode
          dataAttr="left"
          icon="users"
          title="Client Engagements"
          description="Strategy, branding, media, digital & automation."
        />

        <div className="flex items-center gap-4 text-[#FF6500]">
          <ArrowDown className="w-4 h-4" />
          <span className="h-5 w-px bg-[#D8CEC3]" />
          <ArrowUp className="w-4 h-4" />
        </div>

        <CentralEdiyrexSquare compact />

        <div className="flex items-center gap-4 text-[#FF6500]">
          <ArrowDown className="w-4 h-4" />
          <span className="h-5 w-px bg-[#D8CEC3]" />
          <ArrowUp className="w-4 h-4" />
        </div>

        <FlywheelNode
          dataAttr="right"
          icon="box"
          title="Internal R&D"
          description="Agents, systems & studio products."
        />

        <span
          style={{ fontFamily: "var(--font-mono)" }}
          className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#D94B00]"
        >
          PRODUCTS &amp; CAPABILITIES
        </span>
      </div>
    </div>
  );
}

