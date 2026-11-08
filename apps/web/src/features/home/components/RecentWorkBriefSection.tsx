'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PROJECTS_DATA } from '@/features/projects/data/projectsData'

export function RecentWorkBriefSection() {
  const [projects, setProjects] = useState(PROJECTS_DATA.slice(0, 3))

  useEffect(() => {
    // Dynamic real-time fetch from CMS
    fetch('/api/v1/projects/featured')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data && json.data.length > 0) {
          setProjects(json.data.slice(0, 3))
        }
      })
      .catch(() => {
        // Fallback to static seed
      })
  }, [])

  return (
    <section className="bg-[#0B0C10] py-20 border-t border-white/[0.08]">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#00E5FF]">
                PORTFOLIO PREVIEW &middot; SELECTED WORK
              </span>
            </div>
            <h2 className="font-manrope font-semibold text-2xl sm:text-4xl text-[#00E5FF] tracking-tight drop-shadow-[0_0_30px_rgba(0,229,255,0.12)]">
              EVIDENCE OF HIGH-STANDARD DELIVERY.
            </h2>
          </div>

          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-[#39FF14] hover:bg-[#32e012] text-[#0B0C10] font-mono font-semibold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_18px_rgba(57,255,20,0.25)] shrink-0 group"
          >
            <span>View All Projects</span>
            <ArrowUpRight size={14} className="text-[#0B0C10] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* 3 Portfolio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((p) => {
            const divisionRoute =
              p.division === 'media'
                ? '/media'
                : p.division === 'digital'
                ? '/web'
                : '/agents-automation'

            const metric = p.results?.[0]?.metric || 'Enterprise Grade'
            const metricLabel = p.results?.[0]?.label || 'Production Deployed'

            return (
              <div
                key={p.slug}
                className="group flex flex-col justify-between rounded-lg bg-[#12141A] border border-white/[0.08] p-7 hover:border-[#00E5FF]/40 transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/[0.06]">
                    <Link
                      href={divisionRoute}
                      className="font-mono text-[10px] uppercase tracking-wider text-[#00E5FF] hover:underline transition-colors"
                    >
                      {p.division} ↗
                    </Link>
                    <span className="font-mono text-xs text-[#00E5FF] opacity-75">
                      {p.year}
                    </span>
                  </div>

                  <p className="font-mono text-[11px] text-[#666666] uppercase tracking-wider mb-1">
                    Client: {p.client}
                  </p>

                  <Link href={`/work/${p.slug}`}>
                    <h3 className="font-manrope font-semibold text-lg text-[#EAEAEA] group-hover:text-[#00E5FF] transition-colors mb-3 leading-snug">
                      {p.title}
                    </h3>
                  </Link>

                  <p className="font-inter text-xs text-[#999999] leading-relaxed mb-6 line-clamp-3">
                    {p.overview}
                  </p>

                  {/* Primary result metric */}
                  <div className="py-3 px-4 rounded bg-[#0B0C10] border border-white/[0.06] mb-6">
                    <p className="font-mono text-base font-semibold text-[#00E5FF]">
                      {metric}
                    </p>
                    <p className="font-inter text-[11px] text-[#666666]">
                      {metricLabel}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between">
                  <Link
                    href={`/work/${p.slug}`}
                    className="font-inter text-xs font-medium text-[#EAEAEA] hover:text-[#39FF14] flex items-center gap-1 group/link transition-colors"
                  >
                    <span>Read Case Study</span>
                    <ArrowUpRight size={12} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
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
