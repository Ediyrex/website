"use client";

import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  CircleCheck,
  Cpu,
  MessageCircle,
  UserRoundCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROCESS_NODES = [
  {
    id: "input",
    label: "Input",
    detail: "Context & Prompts",
    Icon: MessageCircle,
  },
  {
    id: "ai",
    label: "AI Processing",
    detail: "Autonomous Synthesis",
    Icon: Cpu,
  },
  {
    id: "review",
    label: "Human Review",
    detail: "Quality & Safety Gate",
    Icon: UserRoundCheck,
  },
  {
    id: "output",
    label: "Output",
    detail: "Verified Delivery",
    Icon: CircleCheck,
  },
] as const;

export function AIWorkflow() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Automated pipeline cycle (advances every 1.8s)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % PROCESS_NODES.length);
    }, 1800);

    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <div
      className="space-y-3"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 4-Step Interactive Pipeline Flow */}
      <div
        role="tablist"
        aria-label="AI Pipeline Workflow Steps"
        className="grid grid-cols-2 sm:flex sm:flex-nowrap items-center justify-between gap-1.5 sm:gap-2"
      >
        {PROCESS_NODES.map(({ id, label, Icon }, idx) => {
          const isActive = activeStep === idx;
          const isNextInFlow = (activeStep + 1) % PROCESS_NODES.length === idx;
          const isArrowActive = activeStep === idx && idx < PROCESS_NODES.length - 1;

          return (
            <React.Fragment key={id}>
              {/* Node Card Button */}
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveStep(idx)}
                onMouseEnter={() => setActiveStep(idx)}
                className={cn(
                  "group relative flex w-full sm:flex-1 flex-col items-center justify-center gap-1.5 rounded-[14px] border px-2 py-3 text-center transition-all duration-300 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6900]",
                  isActive
                    ? "border-[#FF6900] bg-[#FFF0E3] shadow-[0_8px_24px_-6px_rgba(255,105,0,0.38)] scale-[1.03] -translate-y-0.5 z-10"
                    : "border-[#E5DED5] bg-[#FAF6F0] hover:border-[#FF9A48] hover:bg-[#FFF7F0] hover:-translate-y-0.5"
                )}
              >
                {/* Active node pulsing signal dot */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute -top-1 -right-1 flex h-2.5 w-2.5"
                  >
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6900] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF6900]" />
                  </span>
                )}

                {/* Node Icon with micro-animation */}
                <div
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-250",
                    isActive ? "text-[#FF6900]" : "text-[#48433F] group-hover:text-[#FF6900]"
                  )}
                >
                  <Icon
                    className={cn(
                      "h-4.5 w-4.5 stroke-[1.85] transition-transform duration-300",
                      isActive && id === "ai" && "animate-pulse scale-110",
                      isActive && id === "output" && "scale-110 text-[#FF6900]",
                      isActive && id === "input" && "scale-105",
                      isActive && id === "review" && "scale-105"
                    )}
                    aria-hidden="true"
                  />
                </div>

                {/* Node Label */}
                <span
                  className={cn(
                    "font-heading text-[11px] leading-tight transition-colors duration-250",
                    isActive
                      ? "font-bold text-[#111111]"
                      : "font-medium text-[#48433F] group-hover:text-[#111111]"
                  )}
                >
                  {label}
                </span>
              </button>

              {/* Connecting Pipeline Flow Arrow */}
              {idx < PROCESS_NODES.length - 1 && (
                <div
                  aria-hidden="true"
                  className="relative hidden sm:flex items-center justify-center w-5 shrink-0"
                >
                  <ArrowRight
                    className={cn(
                      "h-3.5 w-3.5 transition-all duration-300",
                      isArrowActive
                        ? "text-[#FF6900] translate-x-0.5 scale-125"
                        : "text-[#B8AEA3]"
                    )}
                  />
                  {/* Flow beam indicator */}
                  {isArrowActive && (
                    <span className="absolute -top-1 h-1.5 w-1.5 rounded-full bg-[#FF6900] shadow-[0_0_8px_#FF6900] animate-ping opacity-80" />
                  )}
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Live Pipeline Step Indicator */}
      <div className="flex items-center justify-between text-[11px] font-mono text-[#78716A] px-1 pt-0.5 border-t border-[#E5DED5]/70">
        <span className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full bg-[#FF6900] opacity-75",
                !isPaused && "animate-ping"
              )}
            />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6900]" />
          </span>
          <span className="text-[#111111] font-semibold tracking-wider uppercase text-[10px]">
            Stage 0{activeStep + 1} · {PROCESS_NODES[activeStep].label}
          </span>
        </span>

        <span className="text-[10px] text-[#817A72] tracking-wider uppercase font-medium">
          {PROCESS_NODES[activeStep].detail}
        </span>
      </div>
    </div>
  );
}
