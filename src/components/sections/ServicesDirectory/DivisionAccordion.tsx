"use client";

import { useId } from "react";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
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
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-[10px] border bg-[#121519] transition-all duration-300",
        isExpanded
          ? "border-[#F07824]/70 shadow-[0_8px_30px_rgba(240,120,36,0.12)]"
          : "border-[#343940] hover:border-[#F07824]/50 hover:shadow-[0_4px_24px_rgba(0,0,0,0.4)] hover:-translate-y-0.5"
      )}
    >
      {/* Top subtle illumination gradient on hover / active */}
      <div
        className={cn(
          "pointer-events-none absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#F07824] to-transparent opacity-0 transition-opacity duration-500",
          isExpanded || isHighlighted ? "opacity-100" : "group-hover:opacity-60"
        )}
      />

      <button
        type="button"
        id={headerId}
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={onToggle}
        className="grid w-full cursor-pointer grid-cols-[104px_1fr_auto] items-stretch text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F07824] focus-visible:ring-inset md:grid-cols-[132px_92px_1px_1fr_auto_64px]"
      >
        <DivisionNumber
          number={division.number}
          isHighlighted={isHighlighted}
        />

        <div className="hidden items-center justify-center md:flex">
          <DivisionIcon icon={division.icon} isHighlighted={isHighlighted} />
        </div>

        <div className="hidden self-stretch py-4 md:block">
          <div
            className="h-full w-px bg-[#343940] transition-colors group-hover:bg-[#F07824]/30"
            aria-hidden="true"
          />
        </div>

        <div className="flex min-w-0 items-center px-4 py-4 sm:px-6 md:py-5">
          <DivisionDescription
            name={division.name}
            description={division.description}
          />
        </div>

        <div className="hidden items-center justify-end pr-4 md:flex">
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition-all duration-200",
              isHighlighted
                ? "border-[#F07824]/60 bg-[#F07824]/15 text-[#F07824] shadow-[0_0_12px_rgba(240,120,36,0.2)]"
                : "border-[#343940] bg-[#171B20] text-[#B8B9BC] group-hover:border-[#F07824]/50 group-hover:bg-[#F07824]/10 group-hover:text-[#F07824]"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full transition-colors",
                isHighlighted
                  ? "bg-[#F07824] animate-pulse"
                  : "bg-[#858991] group-hover:bg-[#F07824]"
              )}
            />
            {division.capabilityCountLabel}
          </span>
        </div>

        <div className="flex items-center justify-center px-4 py-4 md:px-0">
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-md border transition-all duration-300",
              isExpanded
                ? "border-[#F07824]/60 bg-[#F07824]/20 text-[#F07824] rotate-90"
                : "border-[#292E35] bg-[#171B20] text-[#B8B9BC] group-hover:border-[#F07824]/60 group-hover:text-[#F07824] group-hover:scale-105"
            )}
            aria-hidden="true"
          >
            {isExpanded ? (
              <Minus className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
            )}
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <ExpandedCapabilities division={division} onCollapse={onToggle} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

