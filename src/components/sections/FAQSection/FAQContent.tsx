import type { FaqCategoryData } from "./faq.data";
import { FAQCategory } from "./FAQCategory";

interface FAQContentProps {
  categories: FaqCategoryData[];
  activeQuestionId: string | null;
  highlightedCategoryId: string | null;
  onToggleQuestion: (questionId: string) => void;
}

export function FAQContent({
  categories,
  activeQuestionId,
  highlightedCategoryId,
  onToggleQuestion,
}: FAQContentProps) {
  return (
    <div className="space-y-9 sm:space-y-10">
      {categories.map((category) => (
        <FAQCategory
          key={category.id}
          category={category}
          activeQuestionId={activeQuestionId}
          isHighlighted={highlightedCategoryId === category.id}
          onToggleQuestion={onToggleQuestion}
        />
      ))}
    </div>
  );
}

