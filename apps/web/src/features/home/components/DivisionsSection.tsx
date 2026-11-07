import Link from 'next/link'
import { ArrowUpRight, Camera, Layout, Bot } from 'lucide-react'

const CARDS = [
  {
    num: '01',
    href: '/media',
    icon: Camera,
    category: 'MEDIA & PRODUCTION',
    title: 'Visual Storytelling\n& Commercial Media',
    desc: 'Cinematic brand films, high-impact commercials, photography, podcasts, and social-first content designed to captivate audiences and build brand equity.',
    tags: ['Brand Films', 'Commercials', 'Video Editing', 'Motion Graphics', 'Photography', 'Social Content'],
  },
  {
    num: '02',
    href: '/web',
    icon: Layout,
    category: 'WEB & DIGITAL PRODUCTS',
    title: 'High-Performance Web\n& SaaS Applications',
    desc: 'Modern, resilient digital platforms engineered with Next.js, React, and TypeScript. From high-converting marketing sites to complex enterprise dashboards.',
    tags: ['Web Development', 'SaaS Products', 'UI/UX Design', 'Full-Stack Apps', 'Design Systems', 'Dashboards'],
  },
  {
    num: '03',
    href: '/agents-automation',
    icon: Bot,
    category: 'AGENTS & INTELLIGENCE',
    title: 'Autonomous AI Agents\n& Workflow Systems',
    desc: 'Intelligent AI agents, conversational voice systems, and enterprise workflow automations built to eliminate manual friction and scale studio throughput.',
    tags: ['Custom AI Agents', 'Voice Agents', 'n8n Workflows', 'RAG Systems', 'Process Automation', 'API Integrations'],
  },
]

export function DivisionsSection() {
  return (
    <section className="bg-[#000000] py-20 relative">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">

        {/* Section header */}
        <div className="relative mb-14">
          {/* Top-right decorative bracket in restrained border */}
          <div
            aria-hidden="true"
            className="absolute -top-1 -right-1 pointer-events-none hidden md:block"
            style={{ width: 16, height: 16, borderTop: '1px solid rgba(255, 255, 255, 0.15)', borderRight: '1px solid rgba(255, 255, 255, 0.15)' }}
          />

          <div className="flex flex-col md:flex-row md:items-end gap-8 md:gap-0 md:justify-between">
            {/* Left headline */}
            <div>
              <p
                className="font-inter font-medium uppercase text-zinc-500 mb-3 flex items-center gap-2"
                style={{ fontSize: 10, letterSpacing: '0.2em' }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />
                <span>OUR CORE DISCIPLINES</span>
              </p>
              <h2
                className="font-manrope font-extrabold uppercase text-[#FFFFFF]"
                style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 0.98, letterSpacing: '-0.03em' }}
              >
                THREE
                <br />
                WAYS WE
                <br />
                CREATE
                <br />
                <em
                  className="not-italic"
                  style={{
                    fontFamily: 'Georgia, "Times New Roman", serif',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    letterSpacing: '-0.01em',
                    textTransform: 'lowercase',
                    color: '#FFFFFF',
                  }}
                >
                  impact.
                </em>
              </h2>
            </div>

            {/* Right paragraph */}
            <p
              className="font-inter font-normal text-zinc-400 leading-relaxed md:self-center"
              style={{ fontSize: 14, maxWidth: 380 }}
            >
              From cinematic visual storytelling to scalable full-stack web platforms and autonomous AI agents — Ediyrex unifies creativity and modern engineering into a single studio partner.
            </p>
          </div>
        </div>

        {/* Three service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CARDS.map((card) => {
            const Icon = card.icon
            return (
              <Link
                key={card.num}
                href={card.href}
                className="group flex flex-col justify-between rounded-2xl bg-[#07080B] border border-white/[0.08] hover:border-[#2C3480]/80 hover:shadow-[0_0_36px_rgba(44,52,128,0.20)] transition-all duration-300 p-7 lg:p-8 relative overflow-hidden"
              >
                {/* Ambient hover glow */}
                <div
                  aria-hidden="true"
                  className="absolute -right-20 -top-20 w-48 h-48 rounded-full bg-[#2C3480] opacity-0 group-hover:opacity-15 blur-[60px] transition-opacity duration-500 pointer-events-none"
                />

                {/* Card Top: Index, Category Icon, Arrow */}
                <div>
                  <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-zinc-500 group-hover:text-white transition-colors">
                        {card.num}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[1.5px] text-zinc-400">
                        {card.category}
                      </span>
                    </div>

                    <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-zinc-400 group-hover:text-white group-hover:border-white/20 transition-all">
                      <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>

                  {/* Icon Emblem */}
                  <div className="w-11 h-11 rounded-xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center text-zinc-300 mb-5 group-hover:border-[#2C3480]/60 group-hover:text-white transition-all">
                    <Icon size={20} strokeWidth={1.75} />
                  </div>

                  {/* Title */}
                  <h3
                    className="font-manrope font-bold text-xl lg:text-[22px] text-[#FFFFFF] mb-3 leading-snug tracking-tight"
                  >
                    {card.title.split('\n').map((line, i) => (
                      <span key={i} className="block">
                        {line}
                      </span>
                    ))}
                  </h3>

                  {/* Description */}
                  <p className="font-inter text-[13.5px] text-zinc-400 leading-relaxed mb-6">
                    {card.desc}
                  </p>
                </div>

                {/* Card Bottom: Tags & Direct Link */}
                <div className="pt-4 border-t border-white/[0.05]">
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {card.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10.5px] font-inter px-2.5 py-1 rounded-md bg-white/[0.02] border border-white/[0.07] text-zinc-400 group-hover:border-white/[0.12] group-hover:text-zinc-300 transition-colors"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 font-inter text-[11.5px] font-medium text-zinc-400 group-hover:text-white transition-colors">
                    <span>Explore Discipline</span>
                    <ArrowUpRight size={12} />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
