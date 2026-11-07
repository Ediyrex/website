import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Compass, Shield, Zap, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About the Studio — EDIYREX®',
  description:
    'Ediyrex is a creative technology studio unifying cinematic media production, digital product engineering, and intelligent AI automation under one roof.',
}

const PRINCIPLES = [
  {
    num: '01',
    title: 'Creative + Technical Unity',
    desc: 'Most companies hire a production house for video, an agency for code, and a consultant for AI. Ediyrex unifies all three into one coherent vision without translation loss.',
  },
  {
    num: '02',
    title: 'Craft Over Fluff',
    desc: 'We do not sell vaporware or deliver bloated decks. We deliver cinema-grade film masters, production-grade Next.js applications, and verified automation pipelines.',
  },
  {
    num: '03',
    title: 'Direct Maker Collaboration',
    desc: 'You work directly with the directors, software engineers, and automation architects executing your work. No layers of non-technical account managers.',
  },
  {
    num: '04',
    title: 'Engineered for Real Growth',
    desc: 'Every video shot, every web interface designed, and every agent deployed has a clear operational or commercial objective: save time, elevate brand value, and generate revenue.',
  },
]

export default function AboutPage() {
  return (
    <div className="bg-[#08090B] min-h-screen text-[#F5F3EE] pt-[72px]">
      {/* ── Studio Hero ── */}
      <section className="relative overflow-hidden py-20 lg:py-28 border-b border-[#292929]/70">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="max-w-3xl">
            <p className="font-inter font-medium text-[10.5px] tracking-[2px] uppercase text-[#D6B77A] mb-4">
              ABOUT EDIYREX STUDIO
            </p>
            <h1 className="font-manrope font-extrabold text-[42px] sm:text-[56px] lg:text-[68px] leading-[0.96] tracking-[-2.5px] uppercase mb-6">
              ONE PARTNER FOR
              <br />
              <span className="text-[#D6B77A]">CREATIVITY</span>, TECHNOLOGY,
              <br />
              AND INTELLIGENCE.
            </h1>
            <p className="font-inter text-[#B2B4BA] text-[15px] sm:text-[16px] leading-relaxed max-w-2xl mb-8">
              Ediyrex is a new breed of studio. We bridge the gap between creative visual production, 
              modern web engineering, and autonomous AI systems — giving ambitious businesses 
              everything they need to build an unmatched digital presence.
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-6 h-[42px] rounded-[10px] bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[12px] transition-colors"
              >
                <span>Work With Us</span>
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-5 h-[42px] rounded-[10px] border border-[#3A414B] hover:border-[#F5F3EE] text-[#F5F3EE] font-inter font-medium text-[12px] transition-colors"
              >
                <span>Explore Work</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Studio Philosophy ── */}
      <section className="py-20 border-b border-[#292929]/60">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-5">
              <p className="font-inter font-medium text-[10px] tracking-[2px] uppercase text-[#777D87] mb-2">
                THE THESIS
              </p>
              <h2 className="font-manrope font-extrabold text-[32px] sm:text-[42px] leading-tight uppercase text-[#F5F3EE]">
                WHY WE BUILT AN INTEGRATED STUDIO
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-6 text-[#B2B4BA] text-[14.5px] leading-relaxed font-inter">
              <p>
                In the digital era, the boundaries between content production, web interfaces, and intelligent automation have completely collapsed. 
                A high-budget brand commercial falls flat if the landing page is slow, ugly, or clunky. A cutting-edge web application fails if its visual storytelling lacks emotion. And an operational team burns out if manual data tasks aren&apos;t automated.
              </p>
              <p>
                Ediyrex was founded to eliminate this fragmentation. We assemble creative directors, camera operators, senior software architects, and AI automation specialists into a single, unified execution unit.
              </p>
              <p className="text-[#F5F3EE] font-medium border-l-2 border-[#D6B77A] pl-4 italic">
                &ldquo;We don&apos;t build digital experiences for the sake of trends. We engineer high-leverage assets that give modern brands an unfair advantage.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Working Principles ── */}
      <section className="py-20 border-b border-[#292929]/60">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="mb-14">
            <p className="font-inter font-medium text-[10px] tracking-[2px] uppercase text-[#777D87] mb-2">
              FOUNDATIONAL VALUES
            </p>
            <h2 className="font-manrope font-extrabold text-[32px] sm:text-[42px] leading-tight uppercase">
              STUDIO PRINCIPLES
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PRINCIPLES.map((item) => (
              <div
                key={item.num}
                className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-8"
              >
                <span className="font-mono text-[#D6B77A] text-[13px] font-bold block mb-3">
                  {item.num}
                </span>
                <h3 className="font-manrope font-bold text-[20px] uppercase text-[#F5F3EE] mb-3">
                  {item.title}
                </h3>
                <p className="font-inter text-[#B2B4BA] text-[13.5px] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing Callout ── */}
      <section className="py-20 bg-[#0A0C0F]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 text-center">
          <h2 className="font-manrope font-extrabold text-[32px] sm:text-[46px] uppercase text-[#F5F3EE] mb-4">
            LET&apos;S BUILD SOMETHING GREAT
          </h2>
          <p className="font-inter text-[#B2B4BA] text-[14px] max-w-lg mx-auto mb-8">
            Tell us about your company, your vision, or the problem you need solved. We would love to collaborate.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 h-[44px] rounded-[10px] bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[12px] uppercase tracking-wide transition-colors"
          >
            <span>Start a Conversation</span>
            <ArrowUpRight size={14} strokeWidth={2.5} />
          </Link>
        </div>
      </section>
    </div>
  )
}
