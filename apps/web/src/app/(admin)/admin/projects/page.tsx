'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, FolderGit2, ArrowUpRight, Check, Eye, Trash2, X, RefreshCw } from 'lucide-react'

interface ProjectItem {
  id: string
  slug: string
  title: string
  client: string
  division: 'media' | 'digital' | 'ai' | 'hybrid'
  year: string
  status: 'Published' | 'Draft'
  featured?: boolean
  heroTagline?: string
  overview?: string
  technologies?: string[]
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [filterDivision, setFilterDivision] = useState<string>('all')

  // Form State
  const [title, setTitle] = useState('')
  const [client, setClient] = useState('')
  const [division, setDivision] = useState<'media' | 'digital' | 'ai' | 'hybrid'>('digital')
  const [year, setYear] = useState(String(new Date().getFullYear()))
  const [heroTagline, setHeroTagline] = useState('')
  const [overview, setOverview] = useState('')
  const [technologies, setTechnologies] = useState('')
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published')

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/v1/admin/projects')
      const json = await res.json()
      if (json.success && json.data) {
        setProjects(json.data)
      }
    } catch (err) {
      console.error('Failed to load projects:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleToggleStatus = async (id: string) => {
    try {
      const res = await fetch(`/api/v1/admin/projects/${id}/status`, {
        method: 'PATCH',
      })
      const json = await res.json()
      if (json.success && json.data) {
        setProjects((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: json.data.status } : p))
        )
      }
    } catch (err) {
      console.error('Failed to toggle status:', err)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      const res = await fetch(`/api/v1/admin/projects/${id}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (json.success) {
        setProjects((prev) => prev.filter((p) => p.id !== id))
      }
    } catch (err) {
      console.error('Failed to delete project:', err)
    }
  }

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !client) return
    setIsSubmitting(true)
    try {
      const techArray = technologies
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const res = await fetch('/api/v1/admin/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          client,
          division,
          year,
          heroTagline,
          overview,
          technologies: techArray,
          status,
        }),
      })
      const json = await res.json()
      if (json.success && json.data) {
        setProjects((prev) => [json.data, ...prev])
        setIsModalOpen(false)
        // Reset form
        setTitle('')
        setClient('')
        setHeroTagline('')
        setOverview('')
        setTechnologies('')
      }
    } catch (err) {
      console.error('Failed to create project:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filtered =
    filterDivision === 'all'
      ? projects
      : projects.filter((p) => p.division === filterDivision)

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-manrope font-extrabold text-[22px] uppercase text-[#FFFFFF]">
            PORTFOLIO PROJECTS &amp; CMS
          </h1>
          <p className="font-inter text-[13px] text-neutral-400 mt-0.5">
            Live content management system synced directly with the public website
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchProjects}
            className="p-2.5 rounded-lg border border-neutral-800 hover:border-neutral-600 text-neutral-400 hover:text-white transition-colors"
            title="Refresh List"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 h-[38px] rounded-lg bg-[#FFFFFF] hover:bg-neutral-200 text-[#000000] font-inter font-semibold text-[12px] uppercase tracking-wide transition-colors"
          >
            <Plus size={14} strokeWidth={2.5} />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* ── Filter Strip ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['all', 'media', 'digital', 'ai', 'hybrid'].map((div) => (
          <button
            key={div}
            onClick={() => setFilterDivision(div)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono uppercase tracking-wider transition-colors ${
              filterDivision === div
                ? 'bg-white text-black font-semibold'
                : 'bg-[#080808] text-neutral-400 border border-neutral-800 hover:text-white'
            }`}
          >
            {div === 'all' ? 'All Divisions' : div}
          </button>
        ))}
      </div>

      {/* ── Projects Table ── */}
      <div className="rounded-xl bg-[#080808] border border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[12.5px] font-inter">
            <thead className="bg-[#0D0D0D] text-neutral-400 font-mono text-[10.5px] uppercase tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3 px-5">Title &amp; Client</th>
                <th className="py-3 px-4">Division</th>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-850">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500 font-mono text-xs">
                    Loading CMS projects from database...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500 font-mono text-xs">
                    No projects found. Click &quot;New Project&quot; to publish your first portfolio piece.
                  </td>
                </tr>
              ) : (
                filtered.map((proj) => {
                  const isPublished = proj.status === 'Published'
                  return (
                    <tr key={proj.id} className="hover:bg-neutral-900/40 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 shrink-0">
                            <FolderGit2 size={14} />
                          </div>
                          <div>
                            <Link
                              href={`/work/${proj.slug}`}
                              target="_blank"
                              className="font-manrope font-bold text-white hover:underline flex items-center gap-1.5"
                            >
                              <span>{proj.title}</span>
                              <ArrowUpRight size={11} className="text-neutral-500" />
                            </Link>
                            <p className="text-[11.5px] text-neutral-400 mt-0.5">
                              {proj.client} &middot; <span className="font-mono text-neutral-500">{proj.id}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 font-mono text-[11px] uppercase tracking-wider text-neutral-300">
                        {proj.division}
                      </td>
                      <td className="py-4 px-4 font-mono text-neutral-400">
                        {proj.year}
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleStatus(proj.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10.5px] font-mono tracking-wider uppercase transition-colors cursor-pointer ${
                            isPublished
                              ? 'bg-neutral-900 text-white border border-neutral-700 hover:border-neutral-500'
                              : 'bg-neutral-950 text-neutral-500 border border-neutral-850 hover:text-neutral-300'
                          }`}
                          title="Click to toggle Published / Draft"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isPublished ? 'bg-[#2C3480] shadow-[0_0_6px_#2C3480]' : 'bg-neutral-600'
                            }`}
                          />
                          <span>{proj.status}</span>
                        </button>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={`/work/${proj.slug}`}
                            target="_blank"
                            className="p-1.5 rounded border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-600 transition-colors"
                            title="Preview on Public Site"
                          >
                            <Eye size={13} />
                          </Link>
                          <button
                            onClick={() => handleDelete(proj.id, proj.title)}
                            className="p-1.5 rounded border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-900/60 transition-colors cursor-pointer"
                            title="Delete Project"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── New Project Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-xl rounded-xl bg-[#080808] border border-neutral-800 p-6 md:p-8 relative shadow-[0_10px_40px_rgba(0,0,0,0.9)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-800">
              <div>
                <h2 className="font-manrope font-extrabold text-lg text-white">
                  PUBLISH NEW PROJECT
                </h2>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Adds project directly to CMS and publishes to the public site
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-neutral-800"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lumina Origin Cinema Campaign"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black border border-neutral-800 text-white text-sm focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="e.g. Lumina Optics"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black border border-neutral-800 text-white text-sm focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Division *
                  </label>
                  <select
                    value={division}
                    onChange={(e) => setDivision(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black border border-neutral-800 text-white text-sm focus:outline-none focus:border-white"
                  >
                    <option value="digital">Web &amp; Digital</option>
                    <option value="media">Media Production</option>
                    <option value="ai">Agents &amp; Automation</option>
                    <option value="hybrid">Cross-Disciplinary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Year
                  </label>
                  <input
                    type="text"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black border border-neutral-800 text-white text-sm focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                    Publish Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-black border border-neutral-800 text-white text-sm focus:outline-none focus:border-white"
                  >
                    <option value="Published">Published (Live immediately)</option>
                    <option value="Draft">Draft (Internal only)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Hero Tagline / One-Liner
                </label>
                <input
                  type="text"
                  value={heroTagline}
                  onChange={(e) => setHeroTagline(e.target.value)}
                  placeholder="e.g. Sub-second telemetry observability platform for logistics"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black border border-neutral-800 text-white text-sm focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Overview / Description
                </label>
                <textarea
                  rows={3}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Comprehensive description of the engagement and outcome..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black border border-neutral-800 text-white text-sm focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-neutral-400 mb-1.5">
                  Technologies / Scope (comma separated)
                </label>
                <input
                  type="text"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  placeholder="e.g. Next.js 15, TypeScript, RED Cinema, n8n"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-black border border-neutral-800 text-white text-sm focus:outline-none focus:border-white"
                />
              </div>

              <div className="pt-4 border-t border-neutral-800 flex items-center justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-md border border-neutral-800 text-neutral-400 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-md bg-white hover:bg-neutral-200 text-black text-xs font-mono font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Publishing...' : 'Save & Publish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
