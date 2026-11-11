import React from "react";
import {
  Sparkles,
  Bot,
  ShieldCheck,
  Film,
  Layers,
  Workflow,
} from "lucide-react";
import type { WorkFilterKey, WorkFilterOption } from "@/data/projects";

function FilterIcon({
  filterKey,
  isActive,
}: {
  filterKey: WorkFilterKey;
  isActive: boolean;
}) {
  const className = `w-4 h-4 shrink-0 transition-all duration-250 group-hover:translate-x-[2px] ${
    isActive
      ? "text-[#F36B16]"
      : "text-[#55514D] group-hover:text-[#F36B16]"
  }`;

  switch (filterKey) {
    case "all":
      return <Sparkles strokeWidth={1.7} className={className} />;
    case "ai-agents":
      return <Bot strokeWidth={1.7} className={className} />;
    case "brand-identity":
      return <ShieldCheck strokeWidth={1.7} className={className} />;
    case "media-video":
      return <Film strokeWidth={1.7} className={className} />;
    case "platforms-tools":
      return <Layers strokeWidth={1.7} className={className} />;
    case "automation":
      return <Workflow strokeWidth={1.7} className={className} />;
  }
}

interface WorkFiltersProps {
  options: readonly WorkFilterOption[];
  activeFilter: WorkFilterKey;
  onSelectFilter: (key: WorkFilterKey) => void;
}

export function WorkFilters({
  options,
  activeFilter,
  onSelectFilter,
}: WorkFiltersProps) {
  return (
    <div
      data-sw-filters
      role="group"
      aria-label="Filter projects by category"
      className="flex items-center gap-2.5 sm:gap-3 flex-nowrap overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 md:flex-wrap"
    >
      {options.map((option) => {
        const isActive = activeFilter === option.key;
        return (
          <button
            key={option.key}
            type="button"
            aria-pressed={isActive}
            onClick={() => onSelectFilter(option.key)}
            className={`group shrink-0 h-[44px] px-5 sm:px-6 rounded-full border text-[14px] font-semibold inline-flex items-center gap-2 cursor-pointer transition-all duration-250 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F36B16] ${
              isActive
                ? "border-[#F36B16] bg-[#F36B16]/[0.09] text-[#111111]"
                : "border-[#DED6CE] bg-transparent text-[#111111]/85 hover:border-[#F36B16]/75 hover:bg-[#FBF8F4] hover:text-[#111111]"
            }`}
          >
            <FilterIcon filterKey={option.key} isActive={isActive} />
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

