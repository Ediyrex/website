import Link from 'next/link'
import { ArrowUpRight, Film, Globe, Cpu, Check } from 'lucide-react'
import { SectionHeading, Badge } from '@/shared/components/ui'

const DIVISIONS = [
  {
    id: 'media',
    title: 'Media & Production',
    subtitle: 'High-craft cinematic storytelling & motion design',
    icon: Film,
    color: '#D6B77A',
    description:
      'We craft brand films, high-fidelity commercials, motion graphics, and editorial media designed to captivate audiences and define distinct market presence.',
    capabilities: [
      'Cinematic Brand Commercials',
      '3D Motion Design & VFX',
      'Editorial & Campaign Photography',
      'High-Impact Social & Product Videos',
      'Art Direction & Content Strategy',
    ],
    linkText: 'Explore Media Services',
    href: '/services#media',
  },
  {
    id: 'digital',
    title: 'Digital Experiences',
    subtitle: 'Modern software, SaaS applications & interactive web',
    icon: Globe,
    color: '#7AB4D6',
    description:
      'From custom enterprise platforms to conversion-engineered marketing sites, we build fast, scalable, and responsive web products with impeccable aesthetic standards.',
    capabilities: [
      'Full-Stack Next.js & React Applications',
      'SaaS Platforms & Interactive Dashboards',
      'Conversion-Focused Marketing Architecture',
      'Design Systems & Accessible UI/UX',
      'E-commerce & Custom Web Portals',
    ],
    linkText: 'Explore Digital Services',
    href: '/services#digital',
  },
  {
    id: 'ai',
    title: 'Artificial Intelligence',
    subtitle: 'Autonomous agents, customized models & intelligent systems',
    icon: Cpu,
    color: '#A47AD6',
    description:
      'Transform operational velocity and unlock intelligent customer experiences with bespoke AI agent workflows, voice interfaces, and cognitive data infrastructure.',
    capabilities: [
      'Autonomous Business AI Agents',
      'Voice Receptionists & Conversational Bots',
      'Internal Knowledge Engines & RAG',
      'Automated Workflow Pipelines',
      'Custom LLM Tuning & Integration',
    ],
    linkText: 'Explore AI Solutions',
    href: '/services#ai',
  },
] as const

export function DivisionsSection() {
  return (
    <section id="divisions" className="section-gap relative bg-[#08090B]">
      <div className="container-main">
        {/* Section title */}
        <SectionHeading
          label="Three Disciplines · One Studio"
          title="Integrated Capabilities Designed for Scale"
          titleHighlight="Integrated Capabilities"
          description="We eliminate fractured agency coordination by uniting media artistry, software engineering, and artificial intelligence under one singular vision."
          align="left"
        />

        {/* Division Cards */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {DIVISIONS.map((div) => {
            const Icon = div.icon
            return (
              <div
                key={div.id}
                className="group relative flex flex-col justify-between p-8 rounded-2xl bg-[#12151A] border border-[#252A33] hover:border-[#D6B77A]/40 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.6)]"
              >
                <div>
                  {/* Top Bar with Icon */}
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="p-3 rounded-xl border"
                      style={{
                        backgroundColor: `${div.color}15`,
                        borderColor: `${div.color}30`,
                        color: div.color,
                      }}
                    >
                      <Icon size={24} />
                    </div>
                    <Badge variant="mono">{div.id}</Badge>
                  </div>

                  {/* Titles */}
                  <h3 className="text-xl font-heading font-bold text-[#F0EDE8] group-hover:text-[#D6B77A] transition-colors duration-200">
                    {div.title}
                  </h3>
                  <p className="text-xs text-[#D6B77A]/80 font-mono mt-1 mb-4">
                    {div.subtitle}
                  </p>
                  <p className="text-sm text-[#9AA0AB] leading-relaxed mb-6">
                    {div.description}
                  </p>

                  {/* Capabilities List */}
                  <div className="space-y-2.5 pt-4 border-t border-[#1C2028]">
                    {div.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-xs text-[#F0EDE8]/80">
                        <Check size={14} className="text-[#D6B77A] shrink-0" />
                        <span>{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom link */}
                <div className="mt-8 pt-6 border-t border-[#1C2028]">
                  <Link
                    href={div.href}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#F0EDE8] group-hover:text-[#D6B77A] transition-colors duration-200"
                  >
                    <span>{div.linkText}</span>
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

