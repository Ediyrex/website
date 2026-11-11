import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArchitectureDivisionItem } from "./architecture.data";

interface DivisionItemProps {
  division: ArchitectureDivisionItem;
  showLeftDivider?: boolean;
}

export function DivisionItem({
  division,
  showLeftDivider = false,
}: DivisionItemProps) {
  return (
    <Link
      href={division.href}
      data-arch-division-col
      className={`group relative flex flex-col justify-between py-1 sm:py-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6900] rounded-sm ${
        showLeftDivider
          ? "lg:pl-6 xl:pl-7 lg:before:content-[''] lg:before:absolute lg:before:left-0 lg:before:top-1.5 lg:before:h-[96px] lg:before:w-px lg:before:bg-[#C9C0B6]"
          : ""
      }`}
    >
      <div>
        <span
          style={{ fontFamily: "var(--font-space-mono)" }}
          className="block text-[13px] sm:text-[14px] font-bold text-[#FF6900] transition-colors duration-250 group-hover:text-[#FF7F24]"
        >
          {division.number}
        </span>

        <h3 className="mt-1.5 text-[18px] sm:text-[20px] xl:text-[22px] font-extrabold tracking-[-0.025em] text-[#111111] transition-transform duration-250 ease-out group-hover:-translate-y-[2px]">
          {division.title}
        </h3>

        <p className="mt-1 text-[12.5px] sm:text-[13px] xl:text-[14px] text-[#333333] leading-[1.4]">
          {division.description}
        </p>
      </div>

      <div className="mt-3 inline-flex items-center gap-1.5 text-[13px] xl:text-[14px] font-semibold text-[#111111]">
        <span className="border-b border-transparent transition-colors duration-250 group-hover:border-[#111111]">
          Explore division
        </span>
        <ArrowUpRight className="w-4 h-4 transition-transform duration-250 ease-out group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

