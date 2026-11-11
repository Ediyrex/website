import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { OPERATING_PRINCIPLES } from "../data/studioProducts";
import { PrincipleRow } from "./PrincipleRow";

export function OperatingPrinciples() {
  return (
    <div className="flex flex-col justify-between space-y-7">
      <div className="border-t border-[#D8CEC3]">
        {OPERATING_PRINCIPLES.map((principle) => (
          <PrincipleRow key={principle.number} principle={principle} />
        ))}
      </div>

      <div>
        <Link
          href="/about"
          className="group inline-flex items-center gap-2 h-11 px-6 rounded-full border border-[#D94B00]/35 bg-[#F1E9DF]/80 text-[14px] font-semibold text-[#111111] transition-all duration-300 hover:border-[#FF6500] hover:bg-[#FFE2C5]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6500]"
        >
          <span>About our studio approach</span>
          <ArrowUpRight className="w-4 h-4 text-[#111111] transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FF6500]" />
        </Link>
      </div>
    </div>
  );
}

