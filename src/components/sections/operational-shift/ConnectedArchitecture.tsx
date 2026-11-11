"use client";

import React, { useState } from "react";
import {
  CONNECTED_DIVISIONS,
  type ConnectedDivisionId,
} from "./operational.data";
import { ArchitectureConnections } from "./ArchitectureConnections";
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
      <div className="hidden lg:block relative w-full min-h-[410px] xl:min-h-[425px]">
        {/* Soft Warm Center Ambient Bloom */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full blur-3xl opacity-45"
          style={{
            background:
              "radial-gradient(circle, rgba(243,107,22,0.38) 0%, rgba(255,154,82,0.12) 48%, transparent 72%)",
          }}
        />

        <ArchitectureConnections hoveredId={hoveredId} />

        {/* Quadrant Grid + Central Core Overlay */}
        <div className="relative z-20 grid grid-cols-[195px_1fr_195px] xl:grid-cols-[210px_1fr_210px] grid-rows-[auto_auto] gap-y-10 items-center justify-between h-full py-2">
          {/* Top-Left: Creative */}
          <DivisionCard
            division={creative}
            isHighlighted={hoveredId === creative.id}
            onHoverChange={setHoveredId}
          />

          {/* Center Core Spans Both Rows Visually */}
          <div className="row-span-2 flex items-center justify-center">
            <EdiYrexCore />
          </div>

          {/* Top-Right: Digital */}
          <DivisionCard
            division={digital}
            isHighlighted={hoveredId === digital.id}
            onHoverChange={setHoveredId}
          />

          {/* Bottom-Left: Media */}
          <DivisionCard
            division={media}
            isHighlighted={hoveredId === media.id}
            onHoverChange={setHoveredId}
          />

          {/* Bottom-Right: Intelligence */}
          <DivisionCard
            division={intelligence}
            isHighlighted={hoveredId === intelligence.id}
            onHoverChange={setHoveredId}
          />
        </div>
      </div>

      {/* Tablet & Mobile Reorganized Vertical Architecture */}
      <div className="lg:hidden w-full flex flex-col items-center gap-6">
        <EdiYrexCore />

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

