import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

export function EditorialCtaSection() {
  return (
    <section className="bg-[#08090B] pt-20 pb-28 relative overflow-hidden">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">

          {/* Left: large serif headline */}
          <h2
            style={{
              fontFamily: 'Georgia, "Times New Roman", serif',
              fontStyle: 'italic',
              fontWeight: 400,
              fontSize: 'clamp(44px, 6.5vw, 80px)',
              lineHeight: 0.98,
              letterSpacing: '-0.02em',
              color: '#F5F3EE',
            }}
          >
            Let&apos;s build
            <br />
            something great.
          </h2>

          {/* Right: sub-copy + button */}
          <div
            className="flex flex-col items-start gap-5 pb-1"
            style={{ maxWidth: 380 }}
          >
            <p
              className="font-inter font-normal text-[#B2B4BA] leading-relaxed"
              style={{ fontSize: 13 }}
            >
              A video, a website, an AI agent — or a bigger idea.
              <br />
              Tell us what you&apos;re planning, and we&apos;ll help you bring it to life.
            </p>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 font-inter font-semibold uppercase tracking-wide text-[#17130B] bg-[#F5F3EE] hover:bg-white transition-colors duration-200 rounded-[6px]"
              style={{ fontSize: 12, padding: '11px 20px' }}
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
