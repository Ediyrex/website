"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { EngagementTab } from "../hooks/useEngagementSelection";

interface EngagementNavigationProps {
  activeTab: EngagementTab;
  onTabChange: (tab: EngagementTab) => void;
}

export function EngagementNavigation({
  activeTab,
  onTabChange,
}: EngagementNavigationProps) {
  return (
    <div
      data-engagement-header
      className="flex flex-wrap items-center gap-3 pt-1"
    >
      {/* Segmented pill toggle */}
      <div
        role="tablist"
        aria-label="Engagement section views"
        className="inline-flex items-center rounded-full border border-[#E3D9CE] bg-[#FFFDFB]/85 p-1 shadow-[0_8px_20px_-10px_rgba(17,17,17,0.12)]"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "ways"}
          onClick={() => onTabChange("ways")}
          className={cn(
            "px-4 sm:px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 cursor-pointer",
            activeTab === "ways"
              ? "bg-gradient-to-b from-[#FF8429] via-[#FF6900] to-[#E05300] text-white shadow-[0_6px_16px_-4px_rgba(255,105,0,0.55)]"
              : "text-[#2B2927] hover:text-[#111111]"
          )}
        >
          Ways to Work
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === "faq"}
          onClick={() => onTabChange("faq")}
          className={cn(
            "px-4 sm:px-5 py-2 rounded-full text-[13px] font-medium transition-all duration-300 cursor-pointer",
            activeTab === "faq"
              ? "bg-gradient-to-b from-[#FF8429] via-[#FF6900] to-[#E05300] text-white shadow-[0_6px_16px_-4px_rgba(255,105,0,0.55)]"
              : "text-[#2B2927] hover:text-[#111111]"
          )}
        >
          FAQ
        </button>
      </div>

      {/* Outlined discuss CTA */}
      <Link
        href="/contact"
        className="inline-flex items-center gap-2 rounded-full border border-[#222222]/85 bg-transparent px-5 py-2.5 text-[13px] font-medium text-[#111111] transition-colors duration-200 hover:bg-[#111111] hover:text-[#FFFDFC]"
      >
        <span>Discuss your project</span>
        <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

