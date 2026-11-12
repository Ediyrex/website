import React from "react";
import type { WorkflowStageId } from "../workflow.data";

export function StageMiniVisual({ stageId }: { stageId: WorkflowStageId }) {
  if (stageId === "discover" || stageId === "intro") {
    const pts = [
      [18, 36],
      [34, 22],
      [48, 38],
      [64, 18],
      [78, 32],
      [94, 24],
      [56, 48],
      [84, 46],
    ];
    return (
      <svg viewBox="0 0 112 64" className="w-full h-full" fill="none">
        <path
          d="M18 36 L34 22 L48 38 L64 18 L78 32 L94 24 M34 22 L48 38 L56 48 L78 32 M64 18 L84 46"
          stroke="#D9CFC3"
          strokeWidth="0.9"
        />
        {pts.map(([cx, cy], idx) => (
          <circle
            key={idx}
            cx={cx}
            cy={cy}
            r={idx % 3 === 0 ? 2.1 : 1.5}
            fill="#FF6900"
            fillOpacity={idx % 2 === 0 ? 0.95 : 0.65}
          />
        ))}
      </svg>
    );
  }

  if (stageId === "define") {
    return (
      <svg viewBox="0 0 112 64" className="w-full h-full" fill="none">
        {/* Isometric Blueprint Foundation */}
        <path
          d="M56 12 L94 28 L56 44 L18 28 Z"
          stroke="#FF6900"
          strokeWidth="1.15"
        />
        <path
          d="M56 20 L84 32 L56 44 L28 32 Z"
          stroke="#111111"
          strokeOpacity="0.45"
          strokeWidth="0.9"
        />
        <path
          d="M18 28 V36 L56 52 L94 36 V28"
          stroke="#FF6900"
          strokeOpacity="0.65"
          strokeWidth="1"
        />
        <line
          x1="56"
          y1="44"
          x2="56"
          y2="52"
          stroke="#111111"
          strokeOpacity="0.5"
          strokeWidth="0.9"
        />
        <line
          x1="12"
          y1="34"
          x2="52"
          y2="54"
          stroke="#D9CFC3"
          strokeWidth="0.8"
          strokeDasharray="2 2"
        />
      </svg>
    );
  }

  if (stageId === "create") {
    return (
      <svg viewBox="0 0 112 64" className="w-full h-full" fill="none">
        <path
          d="M56 36 L94 22 L56 8 L18 22 Z"
          fill="#FFFDFC"
          fillOpacity="0.7"
          stroke="#111111"
          strokeOpacity="0.4"
          strokeWidth="0.9"
        />
        {/* Glowing Translucent Orange Bay */}
        <path
          d="M36 28 L58 20 L74 26 L74 40 L52 48 L36 42 Z"
          fill="#FF6900"
          fillOpacity="0.35"
          stroke="#FF6900"
          strokeWidth="1.1"
        />
        <path
          d="M56 36 V54 M94 22 V38 L56 54 L18 38 V22"
          stroke="#111111"
          strokeOpacity="0.5"
          strokeWidth="1"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 112 64" className="w-full h-full" fill="none">
      {/* Podium */}
      <path d="M56 38 L98 24 L56 10 L14 24 Z" fill="#2A2622" />
      <path d="M14 24 V38 L56 52 V38 Z" fill="#EFE7DC" stroke="#2A2622" strokeWidth="0.8" />
      <path d="M98 24 V38 L56 52 V38 Z" fill="#FF8C3B" fillOpacity="0.85" stroke="#2A2622" strokeWidth="0.8" />
      {/* Upper Roof Canopy */}
      <path d="M56 18 L84 9 L56 2 L28 9 Z" fill="#1F1C19" />
      <path d="M36 15 L56 22 L76 15" stroke="#FF6900" strokeWidth="1.2" />
    </svg>
  );
}
