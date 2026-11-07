import Link from 'next/link'
import { ArrowUpRight, Camera, Layout, Bot, Check } from 'lucide-react'

const SERVICES = [
  {
    num: '01',
    title: 'Media Production',
    slug: '/media',
    icon: Camera,
    tagline: 'Visual Storytelling & Commercials',
    desc: 'Cinematic brand films, high-impact commercials, photography, podcasts, and social-first content designed to captivate audiences.',
    capabilities: [
      'Commercials & Brand Documentaries',
      '4K Cinema & Studio Photography',
      'High-End Video Editing & Color Grade',
      'Motion Graphics & 3D Animation',
    ],
  },
  {
    num: '02',
    title: 'Web & Digital Products',
    slug: '/web',
    icon: Layout,
    tagline: 'High-Performance Web Platforms',
    desc: 'Modern, resilient digital platforms engineered with Next.js, React, and TypeScript. From converting sites to complex web apps.',
    capabilities: [
      'Custom Next.js & React Applications',
      'SaaS Dashboards & Internal Systems',
      'UI/UX Architecture & Design Systems',
      'API Integrations & Cloud Deployment',
    ],
  },
  {
    num: '03',
    title: 'Agents & Automation',
    slug: '/agents-automation',
    icon: Bot,
    tagline: 'Autonomous AI & Workflow Systems',
    desc: 'Intelligent AI agents, conversational voice systems, and enterprise workflow automations built to eliminate manual friction.',
    capabilities: [
      'Custom Autonomous AI Agents',
      'Conversational Voice & Chat Bots',
      'n8n & Zapier Enterprise Workflows',
      'RAG & Knowledge Base Automation',
    ],
  },
]

export function ServicesBriefSection() {
  return (
    <section className="bg-[#000000] py-20 border-t border-neutral-800">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                WHAT WE DO &middot; CORE SERVICES
              </span>
            </div>
            <h2 className="font-manrope font-extrabold uppercase text-2xl sm:text-4xl text-white tracking-tight">
              PRECISION EXECUTION ACROSS
              <br />
              THREE SPECIALIZED DISCIPLINES.
            </h2>
          </div>

          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 font-inter font-medium text-xs text-white hover:text-neutral-300 transition-colors uppercase tracking-wider shrink-0"
          >
            <span>Explore Full Service Scope</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* 3 Service Brief Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICES.map((svc) => {
            const Icon = svc.icon
            return (
              <div
                key={svc.num}
                className="group flex flex-col justify-between rounded-xl bg-[#080808] border border-neutral-800 p-7 hover:border-neutral-500 transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-neutral-800">
                    <span className="font-mono text-xs font-bold text-neutral-400 group-hover:text-white transition-colors">
                      {svc.num}
                    </span>
                    <div className="w-8 h-8 rounded-md border border-neutral-800 flex items-center justify-center text-neutral-300 group-hover:text-white group-hover:border-neutral-600 transition-colors">
                      <Icon size={16} />
                    </div>
                  </div>

                  <h3 className="font-manrope font-bold text-xl text-white mb-1">
                    {svc.title}
                  </h3>
                  <p className="font-mono text-[11px] text-neutral-400 mb-4">
                    {svc.tagline}
                  </p>
                  <p className="font-inter text-xs text-neutral-400 leading-relaxed mb-6">
                    {svc.desc}
                  </p>

                  {/* Bullet capabilities */}
                  <ul className="space-y-2 py-4 border-t border-neutral-800">
                    {svc.capabilities.map((cap, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-300">
                        <Check size={13} className="text-white shrink-0 mt-0.5" />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5 border-t border-neutral-800 mt-6">
                  <Link
                    href={svc.slug}
                    className="inline-flex items-center gap-1 text-xs font-inter font-medium text-white hover:underline"
                  >
                    <span>View {svc.title}</span>
                    <ArrowUpRight size={12} />
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
