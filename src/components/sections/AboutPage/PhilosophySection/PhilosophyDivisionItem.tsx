import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PhilosophyDivision } from "./philosophy.data";

export function PhilosophyDivisionItem({
  division,
  index,
}: {
  division: PhilosophyDivision;
  index: number;
}) {
  return (
    <Link
      href={division.href}
      className={`group flex h-full flex-col justify-between border-[#343434] py-8 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] focus-visible:ring-inset md:px-8 xl:px-9 xl:py-10 ${
        index > 0 ? "border-t md:border-t-0" : ""
      } ${index >= 2 ? "md:border-t xl:border-t-0" : ""} ${
        index % 2 === 1 ? "md:border-l" : ""
      } ${index > 0 ? "xl:border-l" : "xl:pl-0"} ${
        index === 3 ? "xl:pr-0" : ""
      }`}
    >
      <div>
        <span className="inline-flex items-center justify-center rounded-full border border-[#F06419]/65 px-3 py-0.5 font-heading text-sm font-semibold tabular-nums tracking-[0.06em] text-[#F06419]">
          {division.number}
        </span>

        <h3
          style={{
            fontFamily: "var(--font-space-grotesk), system-ui, sans-serif",
          }}
          className="mt-6 text-[22px] font-bold uppercase leading-[1.12] tracking-[-0.015em] text-[#F5F2EC] transition-colors duration-200 group-hover:text-[#F06419] sm:text-[26px]"
        >
          {division.title}
        </h3>

        <p className="mt-4 text-[15.5px] leading-[1.6] text-[#898D94] transition-colors duration-200 group-hover:text-[#B8B9BC] sm:text-[16.5px]">
          {division.description}
        </p>
      </div>

      <div className="mt-10 flex items-center justify-between pt-2">
        <span
          aria-hidden="true"
          className="h-1 w-14 bg-[#F06419] transition-all duration-200 group-hover:w-20"
        />
        <ArrowUpRight
          aria-hidden="true"
          className="h-5 w-5 text-[#F06419] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
    </Link>
  );
}

