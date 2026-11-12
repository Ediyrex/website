import React from "react";
import type { WorkflowStageId } from "./workflow.data";

export function WorkflowFallbackVisual({
  stageId,
}: {
  stageId: WorkflowStageId;
}) {
  if (stageId === "intro" || stageId === "discover") {
    const nodes = [
      [85, 165],
      [140, 105],
      [195, 195],
      [255, 85],
      [310, 155],
      [370, 95],
      [420, 175],
      [225, 245],
      [345, 235],
    ];
    return (
      <svg viewBox="0 0 500 320" className="w-full h-full" fill="none">
        <path
          d="M85 165 L140 105 L195 195 L255 85 L310 155 L370 95 L420 175 M140 105 L255 85 M195 195 L225 245 L345 235 L310 155 L420 175"
          stroke="#D9CFC3"
          strokeWidth="1.2"
        />
        {nodes.map(([cx, cy], idx) => (
          <g key={idx}>
            <circle
              cx={cx}
              cy={cy}
              r={idx % 3 === 0 ? 5.5 : 3.5}
              fill="#FF6900"
              fillOpacity={idx % 2 === 0 ? 0.95 : 0.7}
            />
            {idx % 3 === 0 && (
              <circle
                cx={cx}
                cy={cy}
                r={12}
                stroke="#FF6900"
                strokeOpacity="0.3"
                strokeWidth="1"
              />
            )}
          </g>
        ))}
      </svg>
    );
  }

  if (stageId === "define") {
    return (
      <svg viewBox="0 0 500 320" className="w-full h-full" fill="none">
        {/* Isometric Blueprint Wireframe */}
        <path
          d="M250 62 L410 132 L250 202 L90 132 Z"
          stroke="#FF6900"
          strokeWidth="1.6"
        />
        <path
          d="M250 92 L365 142 L250 192 L135 142 Z"
          stroke="#111111"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
        <path
          d="M90 132 V176 L250 246 L410 176 V132"
          stroke="#FF6900"
          strokeOpacity="0.7"
          strokeWidth="1.4"
        />
        <line
          x1="250"
          y1="202"
          x2="250"
          y2="246"
          stroke="#111111"
          strokeOpacity="0.5"
          strokeWidth="1.2"
        />
        <path
          d="M70 196 L245 272 L430 192"
          stroke="#D9CFC3"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
      </svg>
    );
  }

  if (stageId === "create") {
    return (
      <svg viewBox="0 0 500 320" className="w-full h-full" fill="none">
        <path
          d="M250 86 L405 152 L250 218 L95 152 Z"
          fill="#FFFDFC"
          fillOpacity="0.7"
          stroke="#111111"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
        <path
          d="M170 138 L260 98 L332 130 L332 186 L242 226 L170 194 Z"
          fill="#FF6900"
          fillOpacity="0.28"
          stroke="#FF6900"
          strokeWidth="1.5"
        />
        <path
          d="M250 218 V262 M405 152 V196 L250 262 L95 196 V152"
          stroke="#111111"
          strokeOpacity="0.45"
          strokeWidth="1.2"
        />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 500 320" className="w-full h-full" fill="none">
      {/* Ground Base */}
      <path d="M250 112 L420 184 L250 256 L80 184 Z" fill="#E8DFD3" />
      <path
        d="M80 184 V206 L250 278 L420 206 V184"
        fill="#2A2622"
        stroke="#FF6900"
        strokeOpacity="0.45"
        strokeWidth="1.2"
      />
      {/* Lit Architectural Interior & Cantilever Roof */}
      <path d="M135 156 V196 L250 244 V204 Z" fill="#F5EFE7" stroke="#262320" />
      <path d="M365 156 V196 L250 244 V204 Z" fill="#FF8A34" fillOpacity="0.9" stroke="#262320" />
      <path d="M250 100 L378 152 L250 204 L122 152 Z" fill="#22201E" />
      <path d="M250 64 L334 98 L250 132 L166 98 Z" fill="#181614" />
      <path d="M180 114 L250 142 L320 114" stroke="#FF6900" strokeWidth="1.8" />
    </svg>
  );
}

