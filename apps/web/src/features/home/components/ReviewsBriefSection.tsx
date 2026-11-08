import Link from 'next/link'
import { ArrowUpRight, Star, Quote } from 'lucide-react'

const CURATED_REVIEWS = [
  {
    quote:
      'Ediyrex delivered a cinematic brand film that completely redefined how enterprise clients perceive our positioning. Their visual direction, camera mastery, and audio engineering are unmatched.',
    author: 'Marcus Vance',
    title: 'Chief Marketing Officer',
    company: 'Lumina Origin',
    metric: '4.2M+ Views & 48% Lift in Demos',
  },
  {
    quote:
      'Finding a studio that can execute both world-class UI design and resilient Next.js/TypeScript architecture is virtually impossible. Ediyrex built our full platform from scratch in 6 weeks.',
    author: 'Elena Rostova',
    title: 'VP of Product',
    company: 'Aegis Platform',
    metric: '99.99% Uptime & 220ms Global Latency',
  },
  {
    quote:
      'The custom RAG agent and n8n workflows built by Ediyrex eliminated over 30 hours of weekly manual reporting across our operations team. It was the highest-ROI software investment this year.',
    author: 'Devon Wright',
    title: 'Founder & Managing Director',
    company: 'Synthesis Operations',
    metric: '32 hrs/week saved & zero drift',
  },
]

export function ReviewsBriefSection() {
  return (
    <section className="bg-[#080808] py-20 border-t border-white/[0.08]">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#999999]">
                CLIENT REPUTATION &middot; TESTIMONIALS
              </span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="font-manrope font-semibold text-2xl sm:text-4xl text-[#EAEAEA] tracking-tight">
                VERIFIED CLIENT IMPACT.
              </h2>
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded bg-[#111111] border border-white/[0.08] text-xs font-mono text-[#EAEAEA]">
                <Star size={11} className="fill-[#EAEAEA] stroke-[#EAEAEA]" />
                <span>4.9 / 5.0</span>
              </div>
            </div>
          </div>

          <Link
            href="/reviews"
            className="inline-flex items-center gap-1.5 font-inter font-medium text-xs text-[#EAEAEA] hover:text-white transition-colors uppercase tracking-wider shrink-0 group"
          >
            <span>Read All Client Reviews</span>
            <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* 3 Review Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CURATED_REVIEWS.map((r, i) => (
            <div
              key={i}
              className="flex flex-col justify-between rounded-lg bg-[#111111] border border-white/[0.08] p-7 hover:border-white/[0.20] transition-colors duration-200"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                  <div className="flex items-center gap-1 text-[#EAEAEA]">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} size={11} className="fill-[#EAEAEA] stroke-[#EAEAEA]" />
                    ))}
                  </div>
                  <Quote size={15} className="text-[#666666]" />
                </div>

                <p className="font-inter text-xs md:text-[13px] text-[#999999] leading-relaxed mb-6">
                  &ldquo;{r.quote}&rdquo;
                </p>
              </div>

              <div className="pt-4 border-t border-white/[0.06]">
                <p className="font-mono text-[11px] font-semibold text-[#EAEAEA] mb-2">
                  {r.metric}
                </p>
                <div>
                  <p className="font-manrope font-semibold text-xs text-[#EAEAEA]">
                    {r.author}
                  </p>
                  <p className="text-[11px] text-[#666666]">
                    {r.title}, <span className="text-[#999999]">{r.company}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

