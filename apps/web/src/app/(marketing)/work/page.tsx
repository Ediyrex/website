'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Film, Code, Bot } from 'lucide-react'
import { ProjectCard } from '@/features/projects/components'
import { PROJECTS_DATA } from '@/features/projects/data/projectsData'
import { ProjectDivision, CaseStudy } from '@/features/projects/types'

const DIVISION_PORTFOLIOS = [
  {
    title: 'Media & Production',
    slug: '/media',
    icon: Film,
    description: 'Commercials, brand films, documentaries, podcasts, motion design, and high-engagement social media content.',
    deliverables: ['Commercial Direction', '4K/6K Cinema Shoot', 'Sound Design', 'Motion Graphics'],
    highlight: '4.8M+ Organic Impressions',
  },
  {
    title: 'Web & Digital Products',
    slug: '/web',
    icon: Code,
    description: 'High-performance Next.js web applications, SaaS dashboards, e-commerce platforms, and scalable digital design systems.',
    deliverables: ['Full-Stack Development', 'UI/UX Architecture', 'Design Systems', 'API Engineering'],
    highlight: '< 250ms Global Query Speed',
  },
  {
    title: 'AI & Automation Systems',
    slug: '/agents-automation',
    icon: Bot,
    description: 'Autonomous multi-step AI agents, conversational voice systems, n8n workflow pipelines, and enterprise RAG solutions.',
    deliverables: ['Custom AI Agents', 'Voice Bots', 'n8n Automations', 'Knowledge Pipelines'],
    highlight: '74% Manual Work Reduction',
  },
]

const FILTER_TABS: { label: string; value: 'all' | ProjectDivision }[] = [
  { label: 'All Projects', value: 'all' },
  { label: 'Media Production', value: 'media' },
  { label: 'Web & Digital', value: 'digital' },
  { label: 'AI & Automation', value: 'ai' },
]

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | ProjectDivision>('all')
  const [projects, setProjects] = useState<CaseStudy[]>(PROJECTS_DATA)

  useEffect(() => {
    // Dynamic real-time fetch from CMS backend
    fetch('/api/v1/projects')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          const merged = json.data.map((apiProj: any) => {
            const seedMatch = PROJECTS_DATA.find((s) => s.slug === apiProj.slug)
            if (seedMatch) return { ...seedMatch, ...apiProj }
            return {
              slug: apiProj.slug || apiProj.id,
              title: apiProj.title,
              client: apiProj.client,
              year: apiProj.year,
              division: apiProj.division,
              divisionLabel:
                apiProj.division === 'media'
                  ? 'Media & Production'
                  : apiProj.division === 'digital'
                  ? 'Web & Digital'
                  : 'AI & Automation',
              heroTagline: apiProj.heroTagline || '',
              overview: apiProj.overview || '',
              challenge: 'Delivered under high-velocity studio execution standards.',
              solution: 'Custom architecture tailored for high performance and brand prestige.',
              results: [
                { metric: '100%', label: 'Delivery On Schedule' },
                { metric: 'Production Ready', label: 'Verified QA' },
              ],
              technologies: apiProj.technologies || ['Full-Stack', 'Modern Cloud'],
              deliverables: ['Production System', 'Codebase Artifacts'],
              gallery: [],
            }
          })
          setProjects(merged)
        }
      })
      .catch(() => {
        // Fallback to static seed
      })
  }, [])

  const filteredProjects =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.division === activeFilter || (p.division === 'hybrid' && activeFilter === 'digital'))

  return (
    <div className="bg-[#0B0C10] pt-28 pb-24 text-[#EAEAEA]">
      {/* Top Banner */}
      <section className="pt-8 pb-16 border-b border-white/[0.08]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00E5FF]">
              PORTFOLIO &amp; CASE ARCHIVE
            </span>
          </div>

          <h1
            className="font-manrope font-semibold text-3xl sm:text-5xl lg:text-6xl tracking-[-0.035em] text-[#00E5FF] max-w-4xl drop-shadow-[0_0_35px_rgba(0,229,255,0.15)]"
            style={{ lineHeight: 1.05 }}
          >
            OUR WORK ACROSS
            <br />
            THREE INTEGRATED DISCIPLINES.
          </h1>

          <p className="font-inter text-[#999999] text-base max-w-2xl mt-5 leading-relaxed">
            Select a specific discipline below to explore dedicated capabilities, or browse our comprehensive case study archive synced directly with our studio CMS.
          </p>

          {/* Division Gateway Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {DIVISION_PORTFOLIOS.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.title}
                  href={item.slug}
                  className="group flex flex-col justify-between rounded-xl bg-[#12141A] border border-white/[0.08] p-7 hover:border-[#00E5FF]/40 transition-colors duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                      <div className="w-9 h-9 rounded-lg border border-white/[0.08] bg-[#0B0C10] flex items-center justify-center text-[#00E5FF] group-hover:scale-105 transition-transform">
                        <Icon size={17} />
                      </div>
                      <div className="flex items-center gap-1 font-mono text-xs text-[#999999] group-hover:text-[#39FF14] transition-colors">
                        <span>Explore</span>
                        <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>

                    <h2 className="font-manrope font-semibold text-lg text-[#EAEAEA] group-hover:text-[#00E5FF] transition-colors mb-2">
                      {item.title}
                    </h2>
                    <p className="font-inter text-xs text-[#999999] leading-relaxed mb-6">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06]">
                    <p className="font-mono text-[11px] text-[#00E5FF] font-medium mb-3">
                      Impact: {item.highlight}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {item.deliverables.map((del) => (
                        <span
                          key={del}
                          className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#0B0C10] border border-[#00E5FF]/20 text-[#00E5FF] opacity-80"
                        >
                          {del}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Filter Tabs for Individual Projects (Neon Lime for active filter) */}
          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 pt-10 border-t border-white/[0.08]">
            <h2 className="font-manrope font-semibold text-xl text-[#00E5FF]">
              Featured Case Studies
            </h2>

            <div className="flex flex-wrap gap-2">
              {FILTER_TABS.map((tab) => {
                const isActive = activeFilter === tab.value
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveFilter(tab.value)}
                    className={`px-4 py-2 rounded-md text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#39FF14] text-[#0B0C10] font-bold shadow-[0_0_15px_rgba(57,255,20,0.3)]'
                        : 'bg-[#12141A] text-[#999999] border border-white/[0.08] hover:text-[#00E5FF] hover:border-[#00E5FF]/40'
                    }`}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 pt-14">
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-[#666666] font-mono text-sm">
            No case studies found under this category filter.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
