"use client";

import React, { useState } from "react";
import {
  CONNECTED_DIVISIONS,
  type ConnectedDivisionId,
} from "./operational.data";
import { ArchitectureConnections } from "./ArchitectureConnections";
import { CoreOrbitRings } from "./CoreOrbitRings";
import { EdiYrexCore } from "./EdiYrexCore";
import { DivisionCard } from "./DivisionCard";

export function ConnectedArchitecture() {
  const [hoveredId, setHoveredId] = useState<ConnectedDivisionId | null>(null);

  const creative = CONNECTED_DIVISIONS[0];
  const digital = CONNECTED_DIVISIONS[1];
  const media = CONNECTED_DIVISIONS[2];
  const intelligence = CONNECTED_DIVISIONS[3];

  return (
    <div className="relative flex flex-col items-center lg:items-stretch">
      {/* After Pill Badge */}
      <div className="mb-6 lg:mb-5 flex justify-center lg:justify-end">
        <span className="inline-flex items-center px-5 py-1.5 rounded-full bg-[#F36B16] shadow-[0_8px_20px_-6px_rgba(243,107,22,0.5)] text-[11px] sm:text-[11.5px] font-bold uppercase tracking-[0.12em] text-white">
          AFTER &middot; CONNECTED ARCHITECTURE
        </span>
      </div>

      {/* Desktop Connected Radial Architecture */}
      <div className="hidden lg:block relative w-full min-h-[420px] xl:min-h-[440px]">
        {/* Active Animated SVG Flow Wires Connecting Transition Node, Divisions & Hub */}
        <ArchitectureConnections hoveredId={hoveredId} />

        {/* 3-Column Symmetrical Architecture Layout */}
        <div className="relative z-20 grid grid-cols-[195px_1fr_195px] xl:grid-cols-[210px_1fr_210px] items-center h-full min-h-[420px] xl:min-h-[440px] py-2">
          {/* Left Column: Creative (Top) & Media (Bottom) */}
          <div className="flex flex-col justify-between h-full min-h-[360px] gap-8">
            <DivisionCard
              division={creative}
              isHighlighted={hoveredId === creative.id}
              onHoverChange={setHoveredId}
            />
            <DivisionCard
              division={media}
              isHighlighted={hoveredId === media.id}
              onHoverChange={setHoveredId}
            />
          </div>

          {/* Center Column: EDIYREX Engine Perfectly Centered in Concentric Circles */}
          <div className="relative flex items-center justify-center h-full min-h-[380px]">
            <CoreOrbitRings />
            <EdiYrexCore />
          </div>

          {/* Right Column: Digital (Top) & Intelligence (Bottom) */}
          <div className="flex flex-col justify-between h-full min-h-[360px] gap-8">
            <DivisionCard
              division={digital}
              isHighlighted={hoveredId === digital.id}
              onHoverChange={setHoveredId}
            />
            <DivisionCard
              division={intelligence}
              isHighlighted={hoveredId === intelligence.id}
              onHoverChange={setHoveredId}
            />
          </div>
        </div>
      </div>

      {/* Tablet & Mobile Reorganized Vertical Architecture */}
      <div className="lg:hidden w-full flex flex-col items-center gap-6">
        <div className="relative flex items-center justify-center my-2">
          <CoreOrbitRings compact />
          <EdiYrexCore />
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-w-[520px]">
          {CONNECTED_DIVISIONS.map((division) => (
            <DivisionCard
              key={division.id}
              division={division}
              isHighlighted={hoveredId === division.id}
              onHoverChange={setHoveredId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

