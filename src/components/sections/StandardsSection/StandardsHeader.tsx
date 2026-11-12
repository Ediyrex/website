import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function StandardsHeader() {
  return (
    <header
      data-brutal-header
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start"
    >
      {/* Left column */}
      <div className="lg:col-span-7">
        <h2 className="font-heading font-bold tracking-[-0.03em] text-[#111111] text-[clamp(2.25rem,4.1vw,3.85rem)] leading-[1.04]">
          <span data-brutal-headline className="block">
            The principles
          </span>
          <span data-brutal-headline className="block">
            behind everything{" "}
            <span className="font-serif italic font-normal text-[#111111]">
              we build
            </span>
            <span className="text-[#FF6900]" aria-hidden="true">
              .
            </span>
          </span>
        </h2>
      </div>

      {/* Right column */}
      <div
        data-brutal-fade
        className="lg:col-span-5 lg:pt-1 space-y-5"
      >
        <div className="lg:border-l lg:border-[#D8CEC4] lg:pl-6 space-y-4 max-w-[420px]">
          <p className="text-[15px] sm:text-[16px] leading-[1.58] text-[#48433F]">
            Four principles. One standard of work. Built with transparency,
            connected execution, and long-term engineering ownership.
          </p>
          <div
            data-brutal-wipe
            className="h-[2px] w-10 rounded-full bg-[#FF6900]"
            aria-hidden="true"
          />
        </div>

        <div className="lg:pl-6">
          <Link
            href="/about"
            className="group inline-flex items-center gap-2 rounded-full border border-[#222222]/80 bg-transparent px-5 py-2.5 text-[13px] font-medium text-[#111111] transition-colors duration-200 hover:bg-[#111111] hover:text-[#FFFDFC]"
          >
            <span>Our Studio Standards</span>
            <ArrowUpRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
