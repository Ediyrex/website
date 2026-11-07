import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { PROJECTS_DATA } from '@/features/projects/data/projectsData'

export function RecentWorkBriefSection() {
  const recentProjects = PROJECTS_DATA.slice(0, 3)

  return (
    <section className="bg-[#000000] py-20 border-t border-neutral-800">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-neutral-400">
                PORTFOLIO PREVIEW &middot; SELECTED WORK
              </span>
            </div>
            <h2 className="font-manrope font-extrabold uppercase text-2xl sm:text-4xl text-white tracking-tight">
              EVIDENCE OF HIGH-STANDARD DELIVERY.
            </h2>
          </div>

          <Link
            href="/work"
            className="inline-flex items-center gap-1.5 font-inter font-medium text-xs text-white hover:text-neutral-300 transition-colors uppercase tracking-wider shrink-0"
          >
            <span>View All Projects</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* 3 Portfolio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentProjects.map((p) => {
            const divisionRoute =
              p.division === 'media'
                ? '/media'
                : p.division === 'digital'
                ? '/web'
                : '/agents-automation'

            return (
              <div
                key={p.slug}
                className="group flex flex-col justify-between rounded-xl bg-[#080808] border border-neutral-800 p-7 hover:border-neutral-500 transition-colors duration-200"
              >
                <div>
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800">
                    <Link
                      href={divisionRoute}
                      className="font-mono text-[10px] uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
                    >
                      {p.divisionLabel} ↗
                    </Link>
                    <span className="font-mono text-xs text-neutral-400">
                      {p.year}
                    </span>
                  </div>

                  <p className="font-mono text-[11px] text-neutral-400 uppercase tracking-wider mb-1">
                    Client: {p.client}
                  </p>

                  <Link href={`/work/${p.slug}`}>
                    <h3 className="font-manrope font-bold text-lg text-white group-hover:text-neutral-300 transition-colors mb-3 leading-snug">
                      {p.title}
                    </h3>
                  </Link>

                  <p className="font-inter text-xs text-neutral-400 leading-relaxed mb-6 line-clamp-3">
                    {p.overview}
                  </p>

                  {/* Primary result metric */}
                  <div className="py-3 px-4 rounded-lg bg-[#000000] border border-neutral-800 mb-6">
                    <p className="font-mono text-base font-bold text-white">
                      {p.results[0]?.metric}
                    </p>
                    <p className="font-inter text-[11px] text-neutral-400">
                      {p.results[0]?.label}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800 flex items-center justify-between">
                  <Link
                    href={`/work/${p.slug}`}
                    className="font-inter text-xs font-medium text-white hover:underline flex items-center gap-1"
                  >
                    <span>Read Case Study</span>
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

