'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, FolderGit2, ArrowUpRight, Check, Eye } from 'lucide-react'
import { ADMIN_PROJECTS } from '@/features/admin/data/mockAdminData'
import { AdminProjectItem } from '@/features/admin/types'

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<AdminProjectItem[]>(ADMIN_PROJECTS)

  const toggleStatus = (id: string) => {
    setProjects(
      projects.map((p) =>
        p.id === id
          ? { ...p, status: p.status === 'Published' ? 'Draft' : 'Published' }
          : p
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-manrope font-extrabold text-[22px] uppercase text-[#F5F3EE]">
            PORTFOLIO PROJECTS &amp; CASE STUDIES
          </h1>
          <p className="font-inter text-[13px] text-[#8C92A4] mt-0.5">
            Manage published work, case study artifacts, and division tags displayed on the public site
          </p>
        </div>
        <button
          onClick={() => alert('New project editor modal ready for Phase 5 CMS integration.')}
          className="inline-flex items-center gap-1.5 px-4 h-[38px] rounded-lg bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[12px] uppercase tracking-wide transition-colors"
        >
          <Plus size={14} />
          <span>New Project</span>
        </button>
      </div>

      {/* ── Projects Table ── */}
      <div className="rounded-xl bg-[#0D0F12] border border-[#252A32] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px] font-inter">
            <thead className="bg-[#12151A] text-[#777D87] font-mono text-[10.5px] uppercase tracking-wider border-b border-[#252A32]">
              <tr>
                <th className="py-3 px-5">Title &amp; Client</th>
                <th className="py-3 px-4">Division</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2028]">
              {projects.map((proj) => {
                const isPublished = proj.status === 'Published'
                return (
                  <tr key={proj.id} className="hover:bg-[#12151A]/60 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-[#F5F3EE]">{proj.title}</p>
                        {proj.featured && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#D6B77A]/15 text-[#D6B77A] border border-[#D6B77A]/30">
                            FEATURED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#777D87]">{proj.client}</p>
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] uppercase text-[#D0CFCC]">
                      {proj.division}
                    </td>

                    <td className="py-4 px-4 font-mono text-[11px] text-[#8C92A4]">
                      {proj.year}
                    </td>

                    <td className="py-4 px-4">
                      <button
                        onClick={() => toggleStatus(proj.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-colors ${
                          isPublished
                            ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/60'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800'
                        }`}
                        title="Click to toggle status"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isPublished ? 'bg-emerald-400' : 'bg-zinc-500'
                          }`}
                        />
                        <span>{proj.status}</span>
                      </button>
                    </td>

                    <td className="py-4 px-5 text-right space-x-3">
                      <Link
                        href={`/work/${proj.slug}`}
                        target="_blank"
                        className="text-[11px] font-mono uppercase text-[#D6B77A] hover:underline inline-flex items-center gap-1"
                      >
                        <span>View</span>
                        <ArrowUpRight size={12} />
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
