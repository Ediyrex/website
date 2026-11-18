import type { FaqCategoryData } from "./faq.data";
import { FAQTopicNavigation } from "./FAQTopicNavigation";
import { FAQContactPanel } from "./FAQContactPanel";

interface FAQIntroductionProps {
  categories: FaqCategoryData[];
  activeCategoryId: string | null;
  onSelectCategory: (categoryId: string) => void;
}

export function FAQIntroduction({
  categories,
  activeCategoryId,
  onSelectCategory,
}: FAQIntroductionProps) {
  return (
    <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start lg:border-r lg:border-[#CFC5B9] lg:pr-10">
      <h2
        style={{ fontFamily: "var(--font-archivo-narrow), sans-serif" }}
        className="text-[clamp(3rem,5.2vw,5.4rem)] font-bold uppercase leading-[0.86] tracking-[-0.025em]"
      >
        <span className="block text-[#171717]">GOOD</span>
        <span className="block text-[#171717]">QUESTIONS.</span>
        <span className="block italic text-[#F06419]">STRAIGHT</span>
        <span className="block italic text-[#F06419]">ANSWERS.</span>
      </h2>

      <p className="mt-5 max-w-[380px] font-[var(--font-space-grotesk)] text-[17px] leading-[1.5] text-[#49433E] sm:text-[18.5px]">
        Everything worth knowing before we start building together.
      </p>

      <div className="mt-6 border-t-[1.5px] border-[#171717]" />

      <FAQTopicNavigation
        categories={categories}
        activeCategoryId={activeCategoryId}
        onSelectCategory={onSelectCategory}
      />

      <FAQContactPanel />
    </aside>
  );
}

