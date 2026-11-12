import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function FAQContactPanel() {
  return (
    <Link
      href="/contact"
      className="group mt-7 flex items-center justify-between gap-4 rounded-[2px] border border-[#171717] bg-[#171717] p-5 transition-colors duration-200 hover:border-[#292521] hover:bg-[#1E1C1A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F5EFE5]"
    >
      <div>
        <p className="font-[var(--font-space-grotesk)] text-[18px] font-semibold leading-snug text-[#F5EFE5] sm:text-[19px]">
          Still have a question?
        </p>
        <p className="mt-1 inline-flex items-center gap-1.5 font-[var(--font-space-grotesk)] text-[14px] font-medium text-[#F06419] transition-colors group-hover:text-[#FF7D38]">
          Talk to our studio
          <ArrowUpRight
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            aria-hidden="true"
          />
        </p>
      </div>

      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[2px] bg-[#F06419] text-[#171717] transition-colors duration-200 group-hover:bg-[#D95612]"
      >
        <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </span>
    </Link>
  );
}

