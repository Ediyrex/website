import Link from 'next/link'
import { ArrowRight, Film, Code2, Bot } from 'lucide-react'
import { Button } from '@/shared/components/ui'
import { SITE } from '@/shared/constants'

export function HeroSection() {
  return (
    <section
      id="hero"
      aria-label="Introduction"
      className="relative min-h-[92vh] flex flex-col justify-center pt-28 pb-16 overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 10%, rgba(214,183,122,0.08) 0%, transparent 70%)',
        }}
      />

      {/* Subtle grid pattern overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #F0EDE8 1px, transparent 1px), linear-gradient(to bottom, #F0EDE8 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="container-main relative z-10 flex flex-col items-center text-center">
        {/* Kicker badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D6B77A]/20 bg-[#D6B77A]/5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#D6B77A] animate-pulse" />
          <span className="text-xs font-mono tracking-widest text-[#D6B77A] uppercase">
            Creative Technology Studio
          </span>
        </div>

        {/* Primary headline */}
        <h1 className="font-heading font-extrabold tracking-tight text-[#F0EDE8] max-w-4xl text-balance">
          Unifying{' '}
          <span className="text-gradient-accent">Media, Digital</span>{' '}
          and <span className="text-gradient-accent">Artificial Intelligence</span>
        </h1>

        {/* Studio premise */}
        <p className="mt-6 max-w-2xl text-lg md:text-xl text-[#9AA0AB] leading-relaxed text-balance">
          {SITE.description}
        </p>

        {/* Action buttons */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="#divisions">
            <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
              Explore Capabilities
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="secondary" size="lg">
              Start a Project
            </Button>
          </Link>
        </div>

        {/* Three Pillars Quick Row */}
        <div className="mt-16 pt-8 border-t border-[#1C2028] grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl text-left">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#12151A] border border-[#252A33] text-[#D6B77A]">
              <Film size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F0EDE8]">Media Production</p>
              <p className="text-xs text-[#5C6370] mt-0.5">Films, visuals, motion & brand stories</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#12151A] border border-[#252A33] text-[#7AB4D6]">
              <Code2 size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F0EDE8]">Digital Products</p>
              <p className="text-xs text-[#5C6370] mt-0.5">High-performance web, SaaS & UI/UX</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#12151A] border border-[#252A33] text-[#A47AD6]">
              <Bot size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#F0EDE8]">AI & Automation</p>
              <p className="text-xs text-[#5C6370] mt-0.5">Autonomous agents, LLMs & workflows</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

