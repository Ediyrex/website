'use client'

import Link from 'next/link'
import {
  Inbox,
  CheckCircle2,
  TrendingUp,
  FolderGit2,
  ArrowUpRight,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react'
import { INITIAL_ENQUIRIES, ADMIN_PROJECTS, ACTIVITY_LOGS } from '@/features/admin/data/mockAdminData'
import { StatusBadge } from '@/features/admin/components/StatusBadge'

export default function AdminOverviewPage() {
  const totalEnquiries = INITIAL_ENQUIRIES.length
  const newEnquiries = INITIAL_ENQUIRIES.filter((e) => e.status === 'New').length
  const qualifiedLeads = INITIAL_ENQUIRIES.filter((e) => e.status === 'Qualified' || e.status === 'Proposal Sent').length
  const publishedProjects = ADMIN_PROJECTS.filter((p) => p.status === 'Published').length

  const recentEnquiries = INITIAL_ENQUIRIES.slice(0, 4)

  return (
    <div className="space-y-8">
      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-5">
          <div className="flex items-center justify-between text-[#777D87] mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider">Total Enquiries</span>
            <Inbox size={16} className="text-[#D6B77A]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-manrope font-extrabold text-[28px] text-[#F5F3EE]">{totalEnquiries}</span>
            <span className="text-[11px] font-mono text-emerald-400 font-medium">+2 this week</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-5">
          <div className="flex items-center justify-between text-[#777D87] mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider">New Incoming Leads</span>
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-manrope font-extrabold text-[28px] text-[#F5F3EE]">{newEnquiries}</span>
            <span className="text-[11px] font-mono text-blue-400 font-medium">Requires review</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-5">
          <div className="flex items-center justify-between text-[#777D87] mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider">Qualified In Pipeline</span>
            <TrendingUp size={16} className="text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-manrope font-extrabold text-[28px] text-[#F5F3EE]">{qualifiedLeads}</span>
            <span className="text-[11px] font-mono text-[#8C92A4]">Active discussions</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-5">
          <div className="flex items-center justify-between text-[#777D87] mb-3">
            <span className="text-[11px] font-mono uppercase tracking-wider">Published Projects</span>
            <FolderGit2 size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-manrope font-extrabold text-[28px] text-[#F5F3EE]">{publishedProjects}</span>
            <span className="text-[11px] font-mono text-[#8C92A4]">On public portfolio</span>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Enquiries Table (8 cols) */}
        <div className="lg:col-span-8 rounded-xl bg-[#0D0F12] border border-[#252A32] overflow-hidden">
          <div className="p-5 border-b border-[#252A32] flex items-center justify-between">
            <div>
              <h2 className="font-manrope font-bold text-[15px] uppercase text-[#F5F3EE]">
                Recent Inbound Enquiries
              </h2>
              <p className="font-inter text-[12px] text-[#777D87] mt-0.5">
                Client leads submitted through the public website
              </p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-[12px] font-inter text-[#D6B77A] hover:underline flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px] font-inter">
              <thead className="bg-[#12151A] text-[#777D87] font-mono text-[10.5px] uppercase tracking-wider border-b border-[#252A32]">
                <tr>
                  <th className="py-3 px-5">Lead</th>
                  <th className="py-3 px-4">Discipline</th>
                  <th className="py-3 px-4">Budget</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C2028]">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-[#12151A]/60 transition-colors">
                    <td className="py-3.5 px-5">
                      <p className="font-semibold text-[#F5F3EE]">{enq.name}</p>
                      <p className="text-[11px] text-[#777D87]">{enq.company || enq.email}</p>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11.5px] uppercase text-[#D0CFCC]">
                      {enq.division}
                    </td>
                    <td className="py-3.5 px-4 text-[#8C92A4] text-[12px]">
                      {enq.budget}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={enq.status} />
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/admin/enquiries?id=${enq.id}`}
                        className="text-[11px] font-mono uppercase text-[#D6B77A] hover:underline"
                      >
                        Inspect &rarr;
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: Activity Feed & Quick Actions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions */}
          <div className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-5">
            <h3 className="font-manrope font-bold text-[13px] uppercase text-[#F5F3EE] mb-3">
              Quick Actions
            </h3>
            <div className="space-y-2">
              <Link
                href="/admin/enquiries"
                className="flex items-center justify-between p-3 rounded-lg bg-[#12151A] hover:bg-[#161A22] border border-[#252A32] text-[12.5px] font-inter text-[#D0CFCC] transition-colors"
              >
                <span>Process New Enquiries</span>
                <span className="text-[11px] font-mono text-[#D6B77A]">{newEnquiries} Pending</span>
              </Link>
              <Link
                href="/admin/projects"
                className="flex items-center justify-between p-3 rounded-lg bg-[#12151A] hover:bg-[#161A22] border border-[#252A32] text-[12.5px] font-inter text-[#D0CFCC] transition-colors"
              >
                <span>Manage Portfolio Projects</span>
                <span className="text-[11px] font-mono text-[#8C92A4]">&rarr;</span>
              </Link>
              <Link
                href="/admin/media"
                className="flex items-center justify-between p-3 rounded-lg bg-[#12151A] hover:bg-[#161A22] border border-[#252A32] text-[12.5px] font-inter text-[#D0CFCC] transition-colors"
              >
                <span>Browse Media Assets</span>
                <span className="text-[11px] font-mono text-[#8C92A4]">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Activity Log */}
          <div className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-5">
            <h3 className="font-manrope font-bold text-[13px] uppercase text-[#F5F3EE] mb-4">
              Audit Activity Log
            </h3>
            <div className="space-y-4">
              {ACTIVITY_LOGS.map((log) => (
                <div key={log.id} className="text-[12px] font-inter border-l border-[#252A32] pl-3 py-0.5">
                  <p className="text-[#F5F3EE] font-medium leading-tight">{log.action}</p>
                  <p className="text-[#8C92A4] text-[11px] mt-0.5">{log.target}</p>
                  <span className="text-[10px] font-mono text-[#555D69] block mt-1">{log.timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

