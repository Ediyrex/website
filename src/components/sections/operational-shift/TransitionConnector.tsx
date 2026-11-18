import React from "react";
import { ArrowRight, ArrowDown } from "lucide-react";

export function TransitionConnector() {
  return (
    <div
      data-os-transition-node
      aria-hidden="true"
      className="relative z-20 flex items-center justify-center shrink-0 my-2 lg:my-0 lg:mt-10"
    >
      <div className="group relative w-14 h-14 sm:w-[60px] sm:h-[60px] rounded-full bg-white border border-[#F36B16]/80 shadow-[0_14px_32px_-8px_rgba(243,107,22,0.32)] flex items-center justify-center text-[#F36B16] transition-transform duration-300 hover:scale-105">
        {/* Subtle soft ambient pulse aura */}
        <div className="pointer-events-none absolute -inset-1.5 rounded-full border border-[#F36B16]/30 animate-ping opacity-25" />
        <div className="pointer-events-none absolute -inset-1 rounded-full bg-[#F36B16]/10" />

        <ArrowRight className="relative z-10 hidden lg:block w-5 h-5 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={2.0} />
        <ArrowDown className="relative z-10 lg:hidden w-5 h-5" strokeWidth={2.0} />
      </div>
    </div>
  );
}

