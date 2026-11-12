import { TOTAL_FAQ_COUNT } from "./faq.data";

export function FAQMasthead() {
  const formattedTotal = String(TOTAL_FAQ_COUNT).padStart(3, "0");

  return (
    <header className="flex h-12 items-center justify-between border-b-[1.5px] border-[#171717] pb-3 sm:h-14">
      <div className="flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className="h-2.5 w-2.5 shrink-0 bg-[#F06419]"
        />
        <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#171717] sm:text-[13px]">
          EDYREX / INFORMATION DESK
        </span>
      </div>

      <span className="font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#F06419] sm:text-[13px]">
        FAQ / {formattedTotal}
      </span>
    </header>
  );
}

