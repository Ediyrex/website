"use client";

import { ArrowDown, ArrowRight } from "lucide-react";

interface TransitionArrowProps {
  onToggleMobileHighlight?: () => void;
}

export function TransitionArrow({
  onToggleMobileHighlight,
}: TransitionArrowProps) {
  return (
    <div className="flex items-center justify-center py-1 lg:py-0">
      <button
        type="button"
        data-sc-transition-arrow
        onClick={onToggleMobileHighlight}
        aria-label="Compare traditional vendors to EDIYREX Studio"
        className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#FF7900] text-white shadow-[0_14px_30px_-8px_rgba(255,121,0,0.55)] transition-transform duration-200 hover:scale-[1.03] lg:pointer-events-none"
      >
        <ArrowRight className="hidden lg:block h-6 w-6 stroke-[2.2]" aria-hidden="true" />
        <ArrowDown className="lg:hidden h-6 w-6 stroke-[2.2]" aria-hidden="true" />
      </button>
    </div>
  );
}

