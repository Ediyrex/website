import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function WorkCTA() {
  return (
    <section
      aria-label="Start a project"
      className="relative overflow-hidden border-t border-[#CFC5B9] bg-[#F5EFE5] py-12 text-[#171717] sm:py-16"
    >
      {/* Orange geometric corner accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-20 bg-[#F06419] sm:block"
        style={{ clipPath: "polygon(65% 0, 100% 0, 100% 100%, 0% 100%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-[#171717] sm:text-4xl">
              Have a project in mind?
            </h2>
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-[#CFC5B9] lg:pl-8">
            <p className="text-base leading-relaxed text-[#49433E]">
              Let&apos;s turn your idea into a real, well-executed outcome.
            </p>
          </div>

          <div className="lg:col-span-3 lg:flex lg:justify-end lg:pr-12">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-[4px] bg-[#F06419] px-6 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#FFFFFF] transition-colors hover:bg-[#D95612]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

