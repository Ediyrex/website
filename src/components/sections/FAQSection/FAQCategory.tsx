"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { FaqCategoryData } from "./faq.data";
import { FAQItem } from "./FAQItem";

interface FAQCategoryProps {
  category: FaqCategoryData;
  activeQuestionId: string | null;
  isHighlighted: boolean;
  onToggleQuestion: (questionId: string) => void;
}

export function FAQCategory({
  category,
  activeQuestionId,
  isHighlighted,
  onToggleQuestion,
}: FAQCategoryProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      id={`faq-category-${category.id}`}
      aria-labelledby={`faq-heading-${category.id}`}
      className="scroll-mt-28"
    >
      <div
        className={cn(
          "flex items-center justify-between border-b-[1.5px] pb-3 transition-colors duration-300 relative",
          isHighlighted ? "border-[#F06419]" : "border-[#171717]"
        )}
      >
        <h3
          id={`faq-heading-${category.id}`}
          style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
          className="flex items-center gap-2 text-[14px] font-bold uppercase tracking-[0.12em] sm:text-[15px]"
        >
          <span className="font-mono font-semibold text-[#F06419]">
            {category.number}
          </span>
          <span className="font-mono text-[#77716A]" aria-hidden="true">
            /
          </span>
          <span className="text-[#171717]">{category.title}</span>
        </h3>
      </div>

      <div>
        {category.questions.map((item) => (
          <FAQItem
            key={item.id}
            item={item}
            isOpen={activeQuestionId === item.id}
            onToggle={() => onToggleQuestion(item.id)}
          />
        ))}
      </div>
    </motion.section>
  );
}

