"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { FAQ_CATEGORIES } from "./faq.data";
import { FAQMasthead } from "./FAQMasthead";
import { FAQIntroduction } from "./FAQIntroduction";
import { FAQContent } from "./FAQContent";
import { FAQFooter } from "./FAQFooter";

export function FAQSection() {
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(
    "single-or-multiple-services",
  );
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    "working-together",
  );
  const [highlightedCategoryId, setHighlightedCategoryId] = useState<
    string | null
  >(null);
  const highlightTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    return () => {
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  const handleToggleQuestion = (questionId: string) => {
    setActiveQuestionId((current) =>
      current === questionId ? null : questionId,
    );
  };

  const handleSelectCategory = (categoryId: string) => {
    setActiveCategoryId(categoryId);
    setHighlightedCategoryId(categoryId);

    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedCategoryId(null);
    }, 1600);

    const target = document.getElementById(`faq-category-${categoryId}`);
    if (target) {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
  };

  return (
    <section
      id="faq"
      aria-label="Frequently Asked Questions"
      style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
      className="bg-[#F5EFE5] py-14 text-[#171717] sm:py-16 lg:py-[72px]"
    >
      <div className="mx-auto max-w-[1500px] px-6 sm:px-10 lg:px-14">
        <FAQMasthead />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:mt-12 lg:grid-cols-[30%_1fr] lg:gap-11">
          <FAQIntroduction
            categories={FAQ_CATEGORIES}
            activeCategoryId={activeCategoryId}
            onSelectCategory={handleSelectCategory}
          />

          <FAQContent
            categories={FAQ_CATEGORIES}
            activeQuestionId={activeQuestionId}
            highlightedCategoryId={highlightedCategoryId}
            onToggleQuestion={handleToggleQuestion}
          />
        </div>

        <FAQFooter />
      </div>
    </section>
  );
}

