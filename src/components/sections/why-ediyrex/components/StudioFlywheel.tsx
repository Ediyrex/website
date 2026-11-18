"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { ArrowDown, ArrowUp } from "lucide-react";
import { FlywheelPaths } from "./FlywheelPaths";
import { FlywheelNode } from "./FlywheelNode";

const FlywheelScene3D = dynamic(
  () => import("./FlywheelScene3D").then((m) => m.FlywheelScene3D),
  { ssr: false }
);

class FlywheelErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn("Flywheel 3D scene fallback active:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          aria-hidden="true"
          className="w-full h-full rounded-full opacity-60 blur-2xl"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,101,0,0.3) 0%, rgba(214,183,122,0.15) 50%, transparent 70%)",
          }}
        />
      );
    }
    return this.props.children;
  }
}

function CentralEdiyrexSquare({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/about"
      aria-label="Learn more about EDYREX studio model and vision"
      data-we-flywheel-core
      className={`relative z-30 rounded-[22px] flex flex-col items-center justify-center gap-2.5 border border-[#FFE2C5]/80 shadow-[0_26px_58px_-10px_rgba(255,101,0,0.58),inset_0_1.5px_2px_rgba(255,255,255,0.8)] cursor-pointer hover:scale-[1.03] transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white ${compact
        ? "w-36 h-36 p-4"
        : "w-36 h-36 lg:w-40 lg:h-40 xl:w-[168px] xl:h-[168px] p-5 md:[transform:perspective(900px)_rotateY(-5deg)_rotate(-2deg)]"
        }`}
      style={{
        background:
          "radial-gradient(circle at 68% 30%, #FF9B42 0%, #FF6500 44%, #C94200 94%)",
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[22px] bg-gradient-to-br from-white/25 via-transparent to-black/20"
      />

      {/* Official 3D Crystalline Faceted Emblem */}
      <Image
        src="/images/logo/ediyrex-emblem.png"
        alt=""
        width={48}
        height={48}
        className="relative z-10 w-10 h-10 object-contain drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
      />

      {/* Official Metallic Wordmark */}
      <Image
        src="/images/logo/ediyrex-wordmark.png"
        alt="EDIYREX"
        width={100}
        height={18}
        className="relative z-10 h-3.5 w-auto object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)] brightness-110"
      />
    </Link>
  );
}

export function StudioFlywheel() {
  return (
    <div data-we-flywheel className="relative w-full">
      {/* Desktop & Tablet (md+): Real-Time Three.js / React Three Fiber 3D Refractive Glass Flywheel */}
      <div className="hidden md:flex relative w-full h-[380px] lg:h-[410px] xl:h-[435px] items-center justify-center">
        {/* Soft Warm Ambient Aura */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-[10%] top-[16%] bottom-[12%] rounded-full blur-3xl opacity-45"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(255,101,0,0.28) 0%, rgba(255,226,197,0.25) 55%, transparent 78%)",
          }}
        />

        {/* Real 3D WebGL Refractive Glass Loops */}
        <div className="absolute inset-0 z-10">
          <FlywheelErrorBoundary>
            <FlywheelScene3D />
          </FlywheelErrorBoundary>
        </div>

        {/* Crisp Curved Directional Arrows + Labels */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <FlywheelPaths />
        </div>

        {/* Positioned Floating Glass Nodes + Central Luminous 3D Core */}
        <div className="relative z-30 w-full flex items-center justify-between px-1 lg:px-2 xl:px-4 pointer-events-none">
          <div className="pointer-events-auto md:[transform:perspective(900px)_rotateY(8deg)_rotate(-1.5deg)]">
            <FlywheelNode
              dataAttr="left"
              icon="users"
              title="Client Engagements"
              description="Strategy, branding, media, digital & automation."
            />
          </div>

          <div className="pointer-events-auto">
            <CentralEdiyrexSquare />
          </div>

          <div className="pointer-events-auto md:[transform:perspective(900px)_rotateY(-8deg)_rotate(1.5deg)]">
            <FlywheelNode
              dataAttr="right"
              icon="box"
              title="Internal R&D"
              description="Agents, systems & studio products."
            />
          </div>
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
