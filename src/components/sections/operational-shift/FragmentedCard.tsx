import React from "react";
import {
  Video,
  Layers,
  Code2,
  Megaphone,
  Bot,
  Database,
} from "lucide-react";
import type { FragmentedCardData, FragmentedIconName } from "./operational.data";

function FragmentedIcon({ icon }: { icon: FragmentedIconName }) {
  const className = "w-4 h-4 sm:w-[18px] sm:h-[18px] text-[#111111] shrink-0";
  switch (icon) {
    case "video":
      return <Video strokeWidth={1.6} className={className} />;
    case "layers":
      return <Layers strokeWidth={1.6} className={className} />;
    case "code":
      return <Code2 strokeWidth={1.6} className={className} />;
    case "megaphone":
      return <Megaphone strokeWidth={1.6} className={className} />;
    case "bot":
      return <Bot strokeWidth={1.6} className={className} />;
    case "database":
      return <Database strokeWidth={1.6} className={className} />;
  }
}

export function FragmentedCard({ card }: { card: FragmentedCardData }) {
  return (
    <div
      data-os-frag-card
      data-float-duration={card.floatDuration}
      data-float-delay={card.floatDelay}
      className={`group rounded-[18px] bg-[#FBF8F4]/92 backdrop-blur-sm border border-[#DED6CE] px-4 py-3.5 sm:px-4.5 sm:py-4 min-h-[86px] sm:min-h-[96px] flex items-center gap-3 shadow-[0_12px_28px_-14px_rgba(17,17,17,0.14)] transition-all duration-300 ease-out hover:-translate-y-1 hover:rotate-0 hover:border-[#C5BBB0] hover:shadow-[0_18px_36px_-14px_rgba(17,17,17,0.2)] ${card.desktopClass}`}
    >
      <div className="w-8 h-8 rounded-lg border border-[#E5DDD5] bg-[#F5F0E9]/80 flex items-center justify-center shrink-0">
        <FragmentedIcon icon={card.icon} />
      </div>
      <div className="min-w-0">
        <span className="block text-[13px] sm:text-[14px] font-semibold text-[#111111] leading-snug">
          {card.label}
        </span>
      </div>
    </div>
  );
}
