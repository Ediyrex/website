import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function EditorialCtaSection() {
  return (
    <section className="bg-[#000000] pt-28 pb-36 relative overflow-hidden border-t border-neutral-800">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">

          {/* Left: large serif headline in pure white */}
          <div>
            <p className="text-neutral-500 font-mono text-[11px] uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />
              <span>START A CONVERSATION</span>
            </p>
            <h2
              className="font-serif italic font-normal text-white"
              style={{
                fontSize: 'clamp(44px, 6.5vw, 84px)',
                lineHeight: 0.95,
                letterSpacing: '-0.025em',
              }}
            >
              Let&apos;s build
              <br />
              something great.
            </h2>
          </div>

          {/* Right: sub-copy + button */}
          <div
            className="flex flex-col items-start gap-6 pb-2"
            style={{ maxWidth: 420 }}
          >
            <p
              className="font-inter font-normal text-neutral-400 leading-relaxed text-sm"
            >
              A high-impact brand film, a modern full-stack web application, an autonomous AI agent — or an integrated studio partnership.
              <br />
              Tell us what you&apos;re planning, and we&apos;ll engineer the solution.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-inter font-semibold uppercase tracking-wider text-[#000000] bg-[#FFFFFF] hover:bg-neutral-200 transition-colors duration-200 rounded-md"
              style={{ fontSize: 12, padding: '13px 24px' }}
            >
              <span>Start a Project</span>
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
