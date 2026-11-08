import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Camera, Layout, Bot } from 'lucide-react'
import { SERVICES_DATA } from '@/features/services/data/servicesData'
import { DivisionBlock } from '@/features/services/components'

export const metadata: Metadata = {
  title: 'Services & Capabilities · Ediyrex Studio',
  description:
    'Comprehensive service catalogue across Media Production, Full-Stack Web Development, and Autonomous AI Automation.',
}

const DIVISION_GATEWAYS = [
  {
    title: 'Media Production',
    href: '/media',
    icon: Camera,
    headline: 'Visual Storytelling & Commercials',
    desc: 'Commercial films, photography, motion design, podcasts, and social content systems engineered to build brand prestige.',
    actionText: 'Go to Media Services ↗',
  },
  {
    title: 'Web & Digital Products',
    href: '/web',
    icon: Layout,
    headline: 'High-Performance Web Platforms',
    desc: 'Bespoke Next.js web applications, SaaS dashboards, full-stack systems, and design systems built for speed and scale.',
    actionText: 'Go to Web Services ↗',
  },
  {
    title: 'Agents & Automation',
    href: '/agents-automation',
    icon: Bot,
    headline: 'Autonomous Enterprise AI',
    desc: 'Intelligent AI agents, conversational voice bots, n8n automated workflows, and RAG architectures that streamline operations.',
    actionText: 'Go to AI Services ↗',
  },
]

export default function ServicesPage() {
  return (
    <div className="bg-[#0B0C10] pt-28 pb-24 text-[#EAEAEA]">
      {/* Top Hero Banner */}
      <section className="pt-8 pb-16 border-b border-white/[0.08]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00E5FF]">
              SERVICE CATALOGUE &amp; CAPABILITIES
            </span>
          </div>

          <h1
            className="font-manrope font-semibold text-3xl sm:text-5xl lg:text-6xl tracking-[-0.035em] text-[#00E5FF] max-w-4xl drop-shadow-[0_0_35px_rgba(0,229,255,0.15)]"
            style={{ lineHeight: 1.05 }}
          >
            PRECISION EXECUTION ACROSS
            <br />
            THREE INTEGRATED DISCIPLINES.
          </h1>

          <p className="font-inter text-[#999999] text-base max-w-2xl mt-5 leading-relaxed">
            Click any division below to dive directly into dedicated capabilities and case studies, or scroll down to browse our full scope breakdown.
          </p>

          {/* Division Gateway Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {DIVISION_GATEWAYS.map((gateway) => {
              const Icon = gateway.icon
              return (
                <Link
                  key={gateway.title}
                  href={gateway.href}
                  className="group flex flex-col justify-between rounded-xl bg-[#12141A] border border-white/[0.08] p-7 hover:border-[#00E5FF]/40 transition-colors duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                      <div className="w-9 h-9 rounded-lg border border-white/[0.08] bg-[#0B0C10] flex items-center justify-center text-[#00E5FF] group-hover:scale-105 transition-transform">
                        <Icon size={17} />
                      </div>
                      <div className="flex items-center gap-1 font-mono text-xs text-[#999999] group-hover:text-[#39FF14] transition-colors">
                        <span>{gateway.actionText}</span>
                      </div>
                    </div>

                    <h2 className="font-manrope font-semibold text-lg text-[#EAEAEA] group-hover:text-[#00E5FF] transition-colors mb-1">
                      {gateway.title}
                    </h2>
                    <p className="font-mono text-[11px] text-[#666666] mb-3">
                      {gateway.headline}
                    </p>
                    <p className="font-inter text-xs text-[#999999] leading-relaxed">
                      {gateway.desc}
                    </p>
                  </div>

                  <div className="pt-6 border-t border-white/[0.06] mt-6 flex items-center gap-1 text-xs font-mono text-[#00E5FF] group-hover:text-[#39FF14] transition-colors">
                    <span>View Division Scope</span>
                    <ArrowUpRight size={13} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Main Divisions Detailed Content */}
      <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-8">
        {SERVICES_DATA.map((division, index) => (
          <DivisionBlock key={division.id} division={division} index={index} />
        ))}
      </section>

      {/* Conversion Banner */}
      <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 mt-20">
        <div className="p-10 md:p-14 rounded-xl bg-[#12141A] border border-white/[0.08] text-center flex flex-col items-center">
          <h3 className="font-manrope font-semibold text-2xl md:text-3xl text-[#00E5FF] max-w-xl">
            Need an integrated cross-disciplinary scope?
          </h3>
          <p className="mt-3 text-sm text-[#999999] max-w-md">
            Our highest-impact partnerships combine visual production, modern web development, and autonomous AI agents under one unified studio contract.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-md bg-[#39FF14] hover:bg-[#32e012] text-[#0B0C10] font-mono font-semibold text-xs px-6 py-3 transition-all uppercase tracking-wider shadow-[0_0_20px_rgba(57,255,20,0.25)] group"
            >
              <span>Discuss Your Scope</span>
              <ArrowUpRight size={14} className="text-[#0B0C10] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
