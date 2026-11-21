"use client";

import { cn } from "@/lib/utils";
import type { FaqCategoryData } from "./faq.data";

interface FAQTopicNavigationProps {
  categories: FaqCategoryData[];
  activeCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export function FAQTopicNavigation({
  categories,
  activeCategoryId,
  onSelectCategory,
}: FAQTopicNavigationProps) {
  return (
    <nav aria-label="Browse FAQ by topic" className="pt-6">
      <p className="mb-3 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#F06419]">
        BROWSE BY TOPIC
      </p>

      <ul className="divide-y divide-[#CFC5B9] border-b border-t border-[#CFC5B9]">
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;

          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className={cn(
                  "group flex w-full cursor-pointer items-center justify-between gap-3 rounded-[3px] py-3 text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419]",
                  isActive
                    ? "bg-[#EFE7DC] pl-3.5 pr-2 shadow-xs"
                    : "px-2 hover:bg-[#EFE7DC]/60 hover:pl-3"
                )}
              >
                <span className="flex items-center gap-3.5">
                  <span
                    className={cn(
                      "font-mono text-[13px] font-semibold tracking-[0.12em] transition-transform duration-200",
                      isActive
                        ? "scale-105 text-[#F06419]"
                        : "text-[#F06419] group-hover:scale-105"
                    )}
                  >
                    {category.number}
                  </span>
                  <span
                    className={cn(
                      "font-[var(--font-space-grotesk)] text-[17px] leading-snug transition-colors duration-200 sm:text-[18px]",
                      isActive
                        ? "font-bold text-[#F06419]"
                        : "font-semibold text-[#171717] group-hover:text-[#F06419]"
                    )}
                  >
                    {category.title}
                  </span>
                </span>

                <span
                  className={cn(
                    "font-mono text-[13px] transition-colors duration-200",
                    isActive
                      ? "font-medium text-[#F06419]"
                      : "text-[#77716A] group-hover:text-[#171717]"
                  )}
                >
                  ({category.questionCount})
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

