"use client";

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

      <ul className="divide-y divide-[#CFC5B9] border-t border-b border-[#CFC5B9]">
        {categories.map((category) => {
          const isActive = activeCategoryId === category.id;

          return (
            <li key={category.id}>
              <button
                type="button"
                onClick={() => onSelectCategory(category.id)}
                className="group flex w-full cursor-pointer items-center justify-between gap-3 py-3 text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419]"
              >
                <span className="flex items-center gap-3.5">
                  <span className="font-mono text-[13px] font-semibold tracking-[0.12em] text-[#F06419]">
                    {category.number}
                  </span>
                  <span
                    className={`font-[var(--font-space-grotesk)] text-[17px] leading-snug transition-colors duration-200 sm:text-[18px] ${
                      isActive
                        ? "font-bold text-[#F06419]"
                        : "font-semibold text-[#171717] group-hover:text-[#F06419]"
                    }`}
                  >
                    {category.title}
                  </span>
                </span>

                <span className="font-mono text-[13px] text-[#77716A] transition-colors group-hover:text-[#49433E]">
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

