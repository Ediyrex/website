"use client";

import { useId } from "react";
import { Minus, Plus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { FaqQuestion } from "./faq.data";

interface FAQItemProps {
  item: FaqQuestion;
  isOpen: boolean;
  onToggle: () => void;
}

export function FAQItem({ item, isOpen, onToggle }: FAQItemProps) {
  const baseId = useId();
  const buttonId = `${baseId}-button`;
  const panelId = `${baseId}-panel`;

  return (
    <div
      className={cn(
        "border-b border-[#292521] transition-all duration-300",
        isOpen
          ? "border-l-4 border-l-[#F06419] bg-[#FBE5D3] shadow-xs"
          : "bg-transparent hover:border-l-2 hover:border-l-[#F06419]/60 hover:bg-[#EFE8DC]/60"
      )}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className={cn(
          "group flex w-full cursor-pointer items-start justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] focus-visible:ring-inset sm:py-[18px]",
          isOpen ? "px-4 sm:px-5" : "px-1 sm:px-2"
        )}
      >
        <div className="flex min-w-0 items-baseline gap-4 sm:gap-6">
          <span className="shrink-0 font-mono text-[14px] font-semibold tracking-[0.1em] text-[#F06419] transition-transform duration-200 group-hover:scale-105 sm:text-[15px]">
            {item.number}
          </span>
          <span
            className={cn(
              "font-[var(--font-space-grotesk)] text-[17px] font-semibold leading-[1.35] transition-all duration-200 sm:text-[19.5px]",
              isOpen
                ? "text-[#171717]"
                : "text-[#171717] group-hover:translate-x-1 group-hover:text-[#F06419]"
            )}
          >
            {item.question}
          </span>
        </div>

        <span
          aria-hidden="true"
          className={cn(
            "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300",
            isOpen
              ? "bg-[#F06419] text-white shadow-xs rotate-0"
              : "text-[#292521] group-hover:bg-[#F06419]/15 group-hover:text-[#F06419] group-hover:rotate-90"
          )}
        >
          {isOpen ? (
            <Minus className="h-4 w-4 stroke-[2]" />
          ) : (
            <Plus className="h-4 w-4 stroke-[2]" />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pl-[44px] sm:px-5 sm:pb-6 sm:pl-[62px]">
              <motion.p
                initial={{ y: -6, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.25, delay: 0.05 }}
                className="max-w-[780px] font-[var(--font-space-grotesk)] text-[15.5px] leading-[1.65] text-[#49433E] sm:text-[17px]"
              >
                {item.answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

