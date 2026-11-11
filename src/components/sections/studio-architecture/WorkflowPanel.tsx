import React from "react";
import type { WorkflowIconName, WorkflowStage } from "./architecture.data";

function StageIcon({
  icon,
  isOrange,
}: {
  icon: WorkflowIconName;
  isOrange: boolean;
}) {
  const baseClass = `w-7 h-7 xl:w-8 xl:h-8 transition-transform duration-300 ease-out ${
    isOrange
      ? "text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:scale-105"
      : "text-[#111111] group-hover:scale-110 group-hover:-rotate-3"
  }`;

  switch (icon) {
    case "crosshair":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={baseClass}>
          <circle
            cx="18"
            cy="18"
            r="9.5"
            stroke="currentColor"
            strokeWidth="1.65"
          />
          <circle
            cx="18"
            cy="18"
            r="4.8"
            stroke="currentColor"
            strokeWidth="1.65"
          />
          <line
            x1="18"
            y1="3.5"
            x2="18"
            y2="8.5"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
          />
          <line
            x1="18"
            y1="27.5"
            x2="18"
            y2="32.5"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
          />
          <line
            x1="3.5"
            y1="18"
            x2="8.5"
            y2="18"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
          />
          <line
            x1="27.5"
            y1="18"
            x2="32.5"
            y2="18"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
          />
        </svg>
      );
    case "layers":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={baseClass}>
          <path
            d="M18 6.5L30.5 13L18 19.5L5.5 13L18 6.5Z"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 18.2L18 24.7L30.5 18.2"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M5.5 23.4L18 29.9L30.5 23.4"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "zap":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={baseClass}>
          <path
            d="M21 5.5L10.5 19.5H18L15 30.5L25.5 16.5H18L21 5.5Z"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "rocket":
      return (
        <svg viewBox="0 0 36 36" fill="none" className={baseClass}>
          <path
            d="M18 4.5C21.8 8.2 23.2 14.5 22.2 21.5H13.8C12.8 14.5 14.2 8.2 18 4.5Z"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinejoin="round"
          />
          <circle
            cx="18"
            cy="13"
            r="2.4"
            stroke="currentColor"
            strokeWidth="1.65"
          />
          <path
            d="M13.8 17.5L9.5 20.5V24L13.8 21.8"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinejoin="round"
          />
          <path
            d="M22.2 17.5L26.5 20.5V24L22.2 21.8"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinejoin="round"
          />
          <path
            d="M18 19.2V25"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M10 30.5C10.5 28.5 12.2 27.6 13.8 28.4C14.8 27 17.2 26.8 18.6 28C20.2 26.8 22.5 27.2 23.2 28.6C24.7 28.1 26 29 26.4 30.5"
            stroke="currentColor"
            strokeWidth="1.55"
            strokeLinecap="round"
          />
        </svg>
      );
  }
}

interface WorkflowPanelProps {
  stage: WorkflowStage;
  className?: string;
  tiltClassName?: string;
}

export function WorkflowPanel({
  stage,
  className = "",
  tiltClassName = "",
}: WorkflowPanelProps) {
  const isOrange = stage.variant === "orange";

  return (
    <article
      data-arch-card={stage.id}
      className={`group relative rounded-[20px] p-5 xl:p-6 flex flex-col justify-between transition-all duration-300 ease-out ${
        isOrange
          ? "text-white border border-[#FFB36B]/85 shadow-[0_22px_46px_-10px_rgba(255,105,0,0.44),inset_0_1.5px_2px_rgba(255,245,230,0.75),inset_0_-2px_5px_rgba(120,35,0,0.28)] hover:shadow-[0_28px_56px_-8px_rgba(255,105,0,0.56),inset_0_1.5px_2px_rgba(255,255,255,0.9)] hover:brightness-[1.04]"
          : "text-[#111111] border border-white/75 ring-1 ring-inset ring-[rgba(70,60,50,0.16)] shadow-[0_18px_36px_-12px_rgba(20,16,12,0.14),inset_0_1.5px_1px_rgba(255,255,255,0.92),inset_1.5px_0_1px_rgba(255,255,255,0.68),inset_0_-2px_4px_rgba(35,28,20,0.16)] hover:border-white hover:shadow-[0_24px_46px_-10px_rgba(20,16,12,0.2),inset_0_1.5px_1.5px_rgba(255,255,255,0.96)]"
      } ${tiltClassName} ${className}`}
      style={
        isOrange
          ? {
              background:
                "linear-gradient(135deg, rgba(255,156,56,0.90) 0%, rgba(248,117,18,0.88) 54%, rgba(196,68,0,0.92) 100%)",
              backdropFilter: "blur(18px) saturate(165%)",
              WebkitBackdropFilter: "blur(18px) saturate(165%)",
            }
          : {
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.12) 48%, rgba(248,244,238,0.28) 100%)",
              backdropFilter: "blur(20px) saturate(150%)",
              WebkitBackdropFilter: "blur(20px) saturate(150%)",
            }
      }
    >
      {/* Diagonal Glass Specular Reflection & Bottom Rim */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 rounded-[20px] ${
          isOrange
            ? "bg-gradient-to-br from-white/25 via-transparent to-black/15"
            : "bg-[linear-gradient(125deg,rgba(255,255,255,0.45)_0%,rgba(255,255,255,0.06)_38%,rgba(255,255,255,0)_55%,rgba(255,160,90,0.08)_100%)]"
        }`}
      />

      {/* Icon */}
      <div className="relative z-10">
        <StageIcon icon={stage.icon} isOrange={isOrange} />
      </div>

      {/* Stage Copy */}
      <div className="relative z-10 space-y-1 pt-4">
        <span
          className={`block text-[13px] font-semibold tracking-[0.02em] ${
            isOrange ? "text-white/90" : "text-[#111111]/75"
          }`}
        >
          {stage.number}
        </span>

        <h3
          className={`text-[22px] lg:text-[23px] xl:text-[27px] 2xl:text-[30px] font-bold tracking-[-0.035em] leading-[1.05] ${
            isOrange ? "text-white" : "text-[#111111]"
          }`}
        >
          {stage.title}
        </h3>

        <p
          className={`text-[12.5px] xl:text-[13.5px] 2xl:text-[14.5px] leading-[1.4] ${
            isOrange ? "text-white/95" : "text-[#333333]"
          }`}
        >
          {stage.description}
        </p>
      </div>
    </article>
  );
}
