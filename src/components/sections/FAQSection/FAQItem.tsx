"use client";

import { useId } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Minus, Plus } from "lucide-react";
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
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className={`border-b border-[#292521] transition-colors duration-200 ${
        isOpen
          ? "border-l-4 border-l-[#F06419] bg-[#FBE5D3]"
          : "bg-transparent"
      }`}
    >
      <button
        type="button"
        id={buttonId}
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={onToggle}
        className={`group flex w-full cursor-pointer items-start justify-between gap-4 py-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] focus-visible:ring-inset sm:py-[18px] ${
          isOpen ? "px-4 sm:px-5" : "px-1 sm:px-2"
        }`}
      >
        <div className="flex min-w-0 items-baseline gap-4 sm:gap-6">
          <span className="shrink-0 font-mono text-[14px] font-semibold tracking-[0.1em] text-[#F06419] sm:text-[15px]">
            {item.number}
          </span>
          <span
            className={`font-[var(--font-space-grotesk)] text-[17px] font-semibold leading-[1.35] transition-colors duration-200 sm:text-[19.5px] ${
              isOpen
                ? "text-[#171717]"
                : "text-[#171717] group-hover:text-[#F06419]"
            }`}
          >
            {item.question}
          </span>
        </div>

        <span
          aria-hidden="true"
          className={`mt-0.5 shrink-0 transition-colors duration-200 ${
            isOpen
              ? "text-[#171717]"
              : "text-[#292521] group-hover:text-[#F06419]"
          }`}
        >
          {isOpen ? (
            <Minus className="h-5 w-5" strokeWidth={1.75} />
          ) : (
            <Plus className="h-5 w-5" strokeWidth={1.75} />
          )}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={
              prefersReducedMotion
                ? { opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            animate={
              prefersReducedMotion
                ? { opacity: 1 }
                : { height: "auto", opacity: 1 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { height: 0, opacity: 0 }
            }
            transition={{
              duration: prefersReducedMotion ? 0 : 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-5 pl-[44px] sm:px-5 sm:pb-6 sm:pl-[62px]">
              <p className="max-w-[780px] font-[var(--font-space-grotesk)] text-[15.5px] leading-[1.65] text-[#49433E] sm:text-[17px]">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

