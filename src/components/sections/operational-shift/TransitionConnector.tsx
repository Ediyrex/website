import React from "react";
import { ArrowRight, ArrowDown } from "lucide-react";

export function TransitionConnector() {
  return (
    <div
      data-os-transition-node
      aria-hidden="true"
      className="relative z-20 flex items-center justify-center shrink-0 my-2 lg:my-0 lg:mt-10"
    >
      <div className="w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-white border border-[#F36B16]/80 shadow-[0_12px_30px_-8px_rgba(243,107,22,0.28)] flex items-center justify-center text-[#F36B16]">
        <ArrowRight className="hidden lg:block w-5 h-5" strokeWidth={1.9} />
        <ArrowDown className="lg:hidden w-5 h-5" strokeWidth={1.9} />
      </div>
    </div>
  );
}

