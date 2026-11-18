"use client";

import { useId } from "react";
import { Minus, Plus } from "lucide-react";
import type { DirectoryDivision } from "./services.data";
import { DivisionNumber } from "./DivisionNumber";
import { DivisionIcon } from "./DivisionIcon";
import { DivisionDescription } from "./DivisionDescription";
import { ExpandedCapabilities } from "./ExpandedCapabilities";

interface DivisionAccordionProps {
  division: DirectoryDivision;
  isExpanded: boolean;
  isHighlighted: boolean;
  onToggle: () => void;
}

export function DivisionAccordion({
  division,
  isExpanded,
  isHighlighted,
  onToggle,
}: DivisionAccordionProps) {
  const baseId = useId();
  const headerId = `${baseId}-header`;
  const panelId = `${baseId}-panel`;

  return (
    <div
      className={`overflow-hidden rounded-[10px] border bg-[#121519] transition-colors duration-200 ${
        isExpanded
          ? "border-[#F07824]/60"
          : "border-[#343940] hover:border-[#F07824]/40"
      }`}
    >
      <button
        type="button"
        id={headerId}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={onToggle}
        className="group grid w-full cursor-pointer grid-cols-[104px_1fr_auto] items-stretch text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F07824] focus-visible:ring-inset md:grid-cols-[132px_92px_1px_1fr_auto_64px]"
      >
        <DivisionNumber
          number={division.number}
          isHighlighted={isHighlighted}
        />

        <div className="hidden items-center justify-center md:flex">
          <DivisionIcon icon={division.icon} isHighlighted={isHighlighted} />
        </div>

        <div className="hidden self-stretch py-4 md:block">
          <div className="h-full w-px bg-[#343940]" aria-hidden="true" />
        </div>

        <div className="flex min-w-0 items-center px-4 py-4 sm:px-6 md:py-5">
          <DivisionDescription
            name={division.name}
            description={division.description}
          />
        </div>

        <div className="hidden items-center justify-end pr-4 md:flex">
          <span
            className={`inline-flex items-center rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-colors ${
              isHighlighted
                ? "border-[#F07824]/60 bg-[#F07824]/10 text-[#F07824]"
                : "border-[#343940] bg-[#171B20] text-[#B8B9BC] group-hover:border-[#F07824]/50 group-hover:bg-[#F07824]/10 group-hover:text-[#F07824]"
            }`}
          >
            {division.capabilityCountLabel}
          </span>
        </div>

        <div className="flex items-center justify-center px-4 py-4 md:px-0">
          <span
            className={`flex h-9 w-9 items-center justify-center rounded-md border transition-colors ${
              isExpanded
                ? "border-[#F07824]/60 bg-[#F07824]/15 text-[#F07824]"
                : "border-[#292E35] bg-[#171B20] text-[#B8B9BC] group-hover:border-[#F07824]/60 group-hover:text-[#F07824]"
            }`}
            aria-hidden="true"
          >
            {isExpanded ? (
              <Minus className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
          </span>
        </div>
      </button>

      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isExpanded
            ? "grid-template-rows-[1fr] opacity-100"
            : "grid-template-rows-[0fr] opacity-0 pointer-events-none"
        }`}
      >
        <div className="overflow-hidden">
          <ExpandedCapabilities division={division} onCollapse={onToggle} />
        </div>
      </div>
    </div>
  );
}

