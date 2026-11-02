'use client'

import { useState } from 'react'
import { SectionHeading } from '@/shared/components/ui'
import { ProjectCard } from '@/features/projects/components'
import { PROJECTS_DATA } from '@/features/projects/data/projectsData'
import { ProjectDivision } from '@/features/projects/types'

const FILTER_TABS: { label: string; value: 'all' | ProjectDivision }[] = [
  { label: 'All Projects', value: 'all' },
  { label: 'Media Production', value: 'media' },
  { label: 'Digital Products', value: 'digital' },
  { label: 'AI & Automation', value: 'ai' },
  { label: 'Cross-Disciplinary', value: 'hybrid' },
]

export default function WorkPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | ProjectDivision>('all')

  const filteredProjects =
    activeFilter === 'all'
      ? PROJECTS_DATA
      : PROJECTS_DATA.filter((p) => p.division === activeFilter)

  return (
    <div className="pt-28 pb-20">
      {/* Top Banner */}
      <section className="section-gap pt-8 pb-14 border-b border-[#1C2028]">
        <div className="container-main">
          <SectionHeading
            label="Selected Archive"
            title="Evidence of High-Standard Delivery"
            titleHighlight="High-Standard Delivery"
            description="Explore our cross-disciplinary case studies across luxury media, reactive web software, and autonomous enterprise artificial intelligence."
            align="left"
          />

          {/* Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2.5">
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.value
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveFilter(tab.value)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-[#D6B77A] text-[#08090B] font-semibold shadow-[0_0_16px_rgba(214,183,122,0.25)]'
                      : 'bg-[#12151A] text-[#9AA0AB] border border-[#252A33] hover:text-[#F0EDE8] hover:border-[#D6B77A]/40'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="container-main mt-14">
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-[#5C6370] font-mono text-sm">
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

