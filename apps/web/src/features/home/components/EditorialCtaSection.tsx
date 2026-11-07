import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function EditorialCtaSection() {
  return (
    <section className="bg-[#000000] pt-28 pb-36 relative overflow-hidden border-t border-white/[0.08]">
      {/* Signature Cobalt Blue Deep atmospheric glow */}
      <div
        aria-hidden="true"
        className="absolute -right-20 -bottom-20 w-[480px] h-[480px] rounded-full opacity-25 blur-[130px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #2C3480 0%, #15193B 55%, transparent 80%)',
        }}
      />

      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">

          {/* Left: large serif headline in pure white */}
          <div>
            <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[2px] mb-4 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />
              <span>START A CONVERSATION</span>
            </p>
            <h2
              style={{
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic',
                fontWeight: 400,
                fontSize: 'clamp(44px, 6.5vw, 84px)',
                lineHeight: 0.95,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
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
              className="font-inter font-normal text-zinc-400 leading-relaxed text-sm"
            >
              A high-impact brand film, a modern full-stack web application, an autonomous AI agent — or an integrated studio partnership.
              <br />
              Tell us what you&apos;re planning, and we&apos;ll engineer the solution.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-inter font-semibold uppercase tracking-wider text-[#000000] bg-[#FFFFFF] hover:bg-[#F4F4F5] transition-all duration-200 rounded-[10px] shadow-[0_0_24px_rgba(255,255,255,0.18)] hover:shadow-[0_0_36px_rgba(255,255,255,0.28)]"
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
