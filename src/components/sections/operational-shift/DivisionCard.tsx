import React from "react";
import { Palette, Layers, PlayCircle, Sparkles } from "lucide-react";
import type {
  ConnectedDivisionData,
  ConnectedDivisionId,
} from "./operational.data";

function DivisionIcon({
  id,
  isHighlighted,
}: {
  id: ConnectedDivisionId;
  isHighlighted: boolean;
}) {
  const className = `w-5 h-5 transition-all duration-300 ${
    isHighlighted
      ? "text-[#F36B16] drop-shadow-[0_0_8px_rgba(243,107,22,0.55)]"
      : "text-[#F36B16]"
  }`;

  switch (id) {
    case "creative":
      return <Palette strokeWidth={1.65} className={className} />;
    case "digital":
      return <Layers strokeWidth={1.65} className={className} />;
    case "media":
      return <PlayCircle strokeWidth={1.65} className={className} />;
    case "intelligence":
      return <Sparkles strokeWidth={1.65} className={className} />;
  }
}

interface DivisionCardProps {
  division: ConnectedDivisionData;
  isHighlighted: boolean;
  onHoverChange: (id: ConnectedDivisionId | null) => void;
}

export function DivisionCard({
  division,
  isHighlighted,
  onHoverChange,
}: DivisionCardProps) {
  return (
    <div
      data-os-connected-card
      onMouseEnter={() => onHoverChange(division.id)}
      onMouseLeave={() => onHoverChange(null)}
      className={`group relative z-20 rounded-[20px] p-4 sm:p-5 border backdrop-blur-md transition-all duration-300 ease-out hover:-translate-y-1.5 ${
        isHighlighted
          ? "border-[#F36B16]/75 bg-white/80 shadow-[0_20px_42px_-14px_rgba(243,107,22,0.22)]"
          : "border-white/90 ring-1 ring-inset ring-[#DED6CE]/70 bg-[#FBF8F4]/78 shadow-[0_16px_34px_-14px_rgba(17,17,17,0.12)]"
      }`}
    >
      <div className="w-9 h-9 rounded-full bg-[#F36B16]/[0.09] border border-[#F36B16]/25 flex items-center justify-center mb-3">
        <DivisionIcon id={division.id} isHighlighted={isHighlighted} />
      </div>

      <h3 className="text-[19px] sm:text-[21px] font-bold text-[#111111] tracking-[-0.025em] leading-tight">
        {division.title}
      </h3>

      <p className="mt-1.5 text-[13px] sm:text-[14px] text-[#55514D] leading-[1.4]">
        {division.description}
      </p>
    </div>
  );
}
