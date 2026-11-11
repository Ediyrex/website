import React from "react";
import { Users, Box } from "lucide-react";

interface FlywheelNodeProps {
  title: string;
  description: string;
  icon: "users" | "box";
  dataAttr: string;
}

export function FlywheelNode({
  title,
  description,
  icon,
  dataAttr,
}: FlywheelNodeProps) {
  return (
    <div
      data-we-flywheel-node={dataAttr}
      className="relative z-20 rounded-[18px] bg-white/78 backdrop-blur-md border border-white/90 ring-1 ring-inset ring-[#D8CEC3]/80 shadow-[0_18px_36px_-14px_rgba(17,17,17,0.12),inset_0_1px_1px_rgba(255,255,255,0.9)] px-4 py-3.5 sm:px-5 sm:py-4 flex items-start gap-3 max-w-[235px]"
    >
      <div className="w-8 h-8 rounded-lg bg-[#FFE2C5]/45 border border-[#FF6500]/25 flex items-center justify-center shrink-0 mt-0.5 text-[#FF6500]">
        {icon === "users" ? (
          <Users className="w-4 h-4" strokeWidth={1.7} />
        ) : (
          <Box className="w-4 h-4" strokeWidth={1.7} />
        )}
      </div>

      <div className="min-w-0">
        <h3 className="text-[14.5px] sm:text-[15.5px] font-bold text-[#111111] leading-tight tracking-[-0.015em]">
          {title}
        </h3>
        <p className="mt-1 text-[11.5px] sm:text-[12px] text-[#44403D] leading-[1.38]">
          {description}
        </p>
      </div>
    </div>
  );
}

