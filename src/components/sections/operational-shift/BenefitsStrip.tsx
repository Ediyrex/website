import React from "react";
import { Zap, Layers, BarChart3, Infinity as InfinityIcon } from "lucide-react";
import {
  OPERATIONAL_BENEFITS,
  type BenefitItemData,
} from "./operational.data";

function BenefitIcon({ icon }: { icon: BenefitItemData["icon"] }) {
  const className = "w-5 h-5 text-[#F36B16] shrink-0";
  switch (icon) {
    case "zap":
      return <Zap strokeWidth={1.7} className={className} />;
    case "layers":
      return <Layers strokeWidth={1.7} className={className} />;
    case "chart":
      return <BarChart3 strokeWidth={1.7} className={className} />;
    case "infinity":
      return <InfinityIcon strokeWidth={1.7} className={className} />;
  }
}

export function BenefitsStrip() {
  return (
    <div
      data-os-benefits
      className="pt-8 lg:pt-9 border-t border-[#DED6CE] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-0 lg:divide-x lg:divide-[#DED6CE]"
    >
      {OPERATIONAL_BENEFITS.map((benefit, idx) => (
        <div
          key={benefit.id}
          className={`flex items-start gap-3.5 ${
            idx > 0 ? "lg:pl-7 xl:pl-8" : ""
          } ${idx < OPERATIONAL_BENEFITS.length - 1 ? "lg:pr-6 xl:pr-8" : ""}`}
        >
          <div className="mt-1">
            <BenefitIcon icon={benefit.icon} />
          </div>
          <div className="space-y-1.5">
            <h3 className="text-[20px] sm:text-[22px] font-bold text-[#111111] tracking-[-0.02em] leading-tight">
              {benefit.title}
            </h3>
            <p className="text-[14.5px] sm:text-[15.5px] text-[#333333] leading-[1.48]">
              {benefit.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

