"use client";

import React, { useState } from "react";
import { Code2, PlayCircle, Bot } from "lucide-react";
import { cn } from "@/lib/utils";

export function IntegrationDiagram() {
  const [activeCircle, setActiveCircle] = useState<string | null>(null);

  return (
    <div
      aria-label="Orbiting Venn diagram of Media, Digital and AI"
      className="relative flex h-[154px] w-[154px] shrink-0 items-center justify-center mx-auto sm:mx-0 select-none"
    >
      {/* Rotating Venn Container */}
      <div
        className="relative w-full h-full flex items-center justify-center venn-orbit-container"
        style={{ transformOrigin: "50% 50%" }}
      >
        {/* SVG with 3 Intersecting Circles */}
        <svg
          viewBox="0 0 184 192"
          fill="none"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          {/* Subtle Ambient Radial Glow at Intersecting Center */}
          <circle
            cx="92"
            cy="96"
            r="16"
            fill="#FF6900"
            className="venn-core-pulse"
          />

          {/* Circle 1 (Top: Media) */}
          <circle
            cx="92"
            cy="56"
            r="44"
            stroke="#FF6900"
            strokeWidth={activeCircle === "media" ? "2.2" : "1.4"}
            fill={activeCircle === "media" ? "rgba(255, 105, 0, 0.12)" : "transparent"}
            className="transition-all duration-300"
          />

          {/* Circle 2 (Bottom-Left: Digital) */}
          <circle
            cx="58"
            cy="116"
            r="44"
            stroke="#FF6900"
            strokeWidth={activeCircle === "digital" ? "2.2" : "1.4"}
            fill={activeCircle === "digital" ? "rgba(255, 105, 0, 0.12)" : "transparent"}
            className="transition-all duration-300"
          />

          {/* Circle 3 (Bottom-Right: AI) */}
          <circle
            cx="126"
            cy="116"
            r="44"
            stroke="#FF6900"
            strokeWidth={activeCircle === "ai" ? "2.2" : "1.4"}
            fill={activeCircle === "ai" ? "rgba(255, 105, 0, 0.12)" : "transparent"}
            className="transition-all duration-300"
          />

          {/* Intersection Center Core Outline */}
          <circle
            cx="92"
            cy="96"
            r="12"
            stroke="#FF6900"
            strokeWidth="1.2"
            strokeDasharray="2 3"
            fill="#FF6900"
            fillOpacity="0.22"
          />
        </svg>

        {/* Node 1: Media (centered at 50%, 29.17%) */}
        <div
          style={{
            position: "absolute",
            top: "29.17%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          onMouseEnter={() => setActiveCircle("media")}
          onMouseLeave={() => setActiveCircle(null)}
          className="cursor-pointer"
        >
          <div className="venn-counter-node flex flex-col items-center justify-center text-[#111111]">
            <PlayCircle
              className={cn(
                "h-4 w-4 stroke-[1.85] transition-all duration-200",
                activeCircle === "media" ? "text-[#FF6900] scale-110" : "text-[#FF6900]"
              )}
            />
            <span
              className={cn(
                "font-heading text-[10px] leading-tight mt-0.5 transition-colors duration-200",
                activeCircle === "media" ? "font-bold text-[#FF6900]" : "font-semibold text-[#111111]"
              )}
            >
              Media
            </span>
          </div>
        </div>

        {/* Node 2: Digital (centered at 31.52%, 60.42%) */}
        <div
          style={{
            position: "absolute",
            top: "60.42%",
            left: "31.52%",
            transform: "translate(-50%, -50%)",
          }}
          onMouseEnter={() => setActiveCircle("digital")}
          onMouseLeave={() => setActiveCircle(null)}
          className="cursor-pointer"
        >
          <div className="venn-counter-node flex flex-col items-center justify-center text-[#111111]">
            <Code2
              className={cn(
                "h-4 w-4 stroke-[1.85] transition-all duration-200",
                activeCircle === "digital" ? "text-[#FF6900] scale-110" : "text-[#111111]"
              )}
            />
            <span
              className={cn(
                "font-heading text-[10px] leading-tight mt-0.5 transition-colors duration-200",
                activeCircle === "digital" ? "font-bold text-[#FF6900]" : "font-semibold text-[#111111]"
              )}
            >
              Digital
            </span>
          </div>
        </div>

        {/* Node 3: AI (centered at 68.48%, 60.42%) */}
        <div
          style={{
            position: "absolute",
            top: "60.42%",
            left: "68.48%",
            transform: "translate(-50%, -50%)",
          }}
          onMouseEnter={() => setActiveCircle("ai")}
          onMouseLeave={() => setActiveCircle(null)}
          className="cursor-pointer"
        >
          <div className="venn-counter-node flex flex-col items-center justify-center text-[#111111]">
            <Bot
              className={cn(
                "h-4 w-4 stroke-[1.85] transition-all duration-200",
                activeCircle === "ai" ? "text-[#FF6900] scale-110" : "text-[#111111]"
              )}
            />
            <span
              className={cn(
                "font-heading text-[10px] leading-tight mt-0.5 transition-colors duration-200",
                activeCircle === "ai" ? "font-bold text-[#FF6900]" : "font-semibold text-[#111111]"
              )}
            >
              AI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
