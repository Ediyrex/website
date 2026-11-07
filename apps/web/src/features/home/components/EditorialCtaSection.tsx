import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function EditorialCtaSection() {
  return (
    <section className="bg-[#000000] pt-24 pb-32 relative overflow-hidden">
      {/* Signature Cobalt Blue Deep atmospheric glow */}
      <div
        aria-hidden="true"
        className="absolute -right-16 -bottom-20 w-[420px] h-[420px] rounded-full opacity-35 blur-[120px] pointer-events-none"
        style={{
          background: 'radial-gradient(circle, #2C3480 0%, #171B42 50%, transparent 80%)',
        }}
      />

      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">

          {/* Left: large serif headline in pure white */}
          <h2
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(44px, 6.5vw, 80px)',
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
            }}
          >
            Let&apos;s build
            <br />
            something great.
          </h2>

          {/* Right: sub-copy + button */}
          <div
            className="flex flex-col items-start gap-5 pb-1"
            style={{ maxWidth: 390 }}
          >
            <p
              className="font-inter font-normal text-[#D1D5DB] leading-relaxed"
              style={{ fontSize: 13.5 }}
            >
              A video, a website, an AI agent — or a bigger idea.
              <br />
              Tell us what you&apos;re planning, and we&apos;ll help you bring it to life.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-inter font-semibold uppercase tracking-wide text-[#000000] bg-[#FFFFFF] hover:bg-[#F2F4F8] transition-colors duration-200 rounded-[8px] shadow-[0_0_24px_rgba(44,52,128,0.35)]"
              style={{ fontSize: 12, padding: '12px 22px' }}
            >
              <span>Start a Conversation</span>
              <ArrowUpRight size={13} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
