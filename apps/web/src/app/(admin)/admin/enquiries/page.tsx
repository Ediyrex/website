'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Mail,
  User,
  Building,
  DollarSign,
  Calendar,
  Save,
  X,
  FileText,
} from 'lucide-react'
import { INITIAL_ENQUIRIES } from '@/features/admin/data/mockAdminData'
import { EnquiryItem, LeadStatus, ServiceDivisionId } from '@/features/admin/types'
import { StatusBadge } from '@/features/admin/components/StatusBadge'

const STATUS_OPTIONS: LeadStatus[] = [
  'New',
  'Reviewing',
  'Qualified',
  'Proposal Sent',
  'Won',
  'Lost',
  'Archived',
]

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(INITIAL_ENQUIRIES)
  const [search, setSearch] = useState('')
  const [divisionFilter, setDivisionFilter] = useState<'all' | ServiceDivisionId>('all')
  const [statusFilter, setStatusFilter] = useState<'all' | LeadStatus>('all')
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryItem | null>(null)
  const [notes, setNotes] = useState('')

  // Filtered dataset
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch =
      enq.name.toLowerCase().includes(search.toLowerCase()) ||
      enq.email.toLowerCase().includes(search.toLowerCase()) ||
      (enq.company && enq.company.toLowerCase().includes(search.toLowerCase()))

    const matchesDivision = divisionFilter === 'all' || enq.division === divisionFilter
    const matchesStatus = statusFilter === 'all' || enq.status === statusFilter

    return matchesSearch && matchesDivision && matchesStatus
  })

  // Select enquiry for detailed view
  const handleSelect = (enq: EnquiryItem) => {
    setSelectedEnquiry(enq)
    setNotes(enq.internalNotes || '')
  }

  // Update status
  const handleUpdateStatus = (newStatus: LeadStatus) => {
    if (!selectedEnquiry) return

    const updated = enquiries.map((item) =>
      item.id === selectedEnquiry.id
        ? {
            ...item,
            status: newStatus,
            statusUpdatedAt: new Date().toISOString(),
          }
        : item
    )

    setEnquiries(updated)
    setSelectedEnquiry({
      ...selectedEnquiry,
      status: newStatus,
      statusUpdatedAt: new Date().toISOString(),
    })
  }

  // Save internal notes
  const handleSaveNotes = () => {
    if (!selectedEnquiry) return

    const updated = enquiries.map((item) =>
      item.id === selectedEnquiry.id
        ? {
            ...item,
            internalNotes: notes,
          }
        : item
    )

    setEnquiries(updated)
    setSelectedEnquiry({
      ...selectedEnquiry,
      internalNotes: notes,
    })
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-manrope font-extrabold text-[22px] uppercase text-[#F5F3EE]">
            INBOUND PROJECT ENQUIRIES
          </h1>
          <p className="font-inter text-[13px] text-[#8C92A4] mt-0.5">
            Review, qualify, and track business briefs submitted by clients
          </p>
        </div>
        <div className="text-[12px] font-mono text-[#D6B77A]">
          {filteredEnquiries.length} {filteredEnquiries.length === 1 ? 'enquiry' : 'enquiries'} displayed
        </div>
      </div>

      {/* ── Filter Bar ── */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#0D0F12] border border-[#252A32] p-4 rounded-xl">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client name, email, or company..."
            className="w-full h-[40px] pl-9 pr-3 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[13px] text-[#F5F3EE] outline-none placeholder:text-[#555D69]"
          />
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#555D69]" />
        </div>

        {/* Division Filter */}
        <div className="sm:col-span-3">
          <select
            value={divisionFilter}
            onChange={(e) => setDivisionFilter(e.target.value as any)}
            className="w-full h-[40px] px-3 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[12.5px] text-[#D0CFCC] outline-none cursor-pointer"
          >
            <option value="all">All Divisions</option>
            <option value="media">Media Production</option>
            <option value="web">Web &amp; Digital</option>
            <option value="agents">Agents &amp; Automation</option>
            <option value="integrated">Full Studio Retainer</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="sm:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full h-[40px] px-3 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[12.5px] text-[#D0CFCC] outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Table & Detail Drawer Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Enquiries Table */}
        <div
          className={`${
            selectedEnquiry ? 'lg:col-span-7' : 'lg:col-span-12'
          } rounded-xl bg-[#0D0F12] border border-[#252A32] overflow-hidden transition-all duration-300`}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[12.5px] font-inter">
              <thead className="bg-[#12151A] text-[#777D87] font-mono text-[10.5px] uppercase tracking-wider border-b border-[#252A32]">
                <tr>
                  <th className="py-3 px-5">Client</th>
                  <th className="py-3 px-4">Discipline</th>
                  <th className="py-3 px-4">Budget</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1C2028]">
                {filteredEnquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-[#555D69] font-mono text-[12px]">
                      No enquiries matching the selected search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredEnquiries.map((enq) => {
                    const isSelected = selectedEnquiry?.id === enq.id
                    return (
                      <tr
                        key={enq.id}
                        onClick={() => handleSelect(enq)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-[#141820] border-l-2 border-[#D6B77A]'
                            : 'hover:bg-[#12151A]/60'
                        }`}
                      >
                        <td className="py-3.5 px-5">
                          <p className="font-semibold text-[#F5F3EE]">{enq.name}</p>
                          <p className="text-[11px] text-[#777D87]">{enq.company || enq.email}</p>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11.5px] uppercase text-[#D0CFCC]">
                          {enq.division}
                        </td>
                        <td className="py-3.5 px-4 text-[#8C92A4] text-[12px]">{enq.budget}</td>
                        <td className="py-3.5 px-4">
                          <StatusBadge status={enq.status} />
                        </td>
                        <td className="py-3.5 px-5 text-right font-mono text-[11px] text-[#D6B77A]">
                          {isSelected ? 'Viewing' : 'Inspect'}
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Enquiry Slide-over / Detail Drawer */}
        {selectedEnquiry && (
          <div className="lg:col-span-5 rounded-xl bg-[#0D0F12] border border-[#252A32] p-6 space-y-6 sticky top-[80px]">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-[#252A32] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-[#777D87]">
                  {selectedEnquiry.id}
                </span>
                <h3 className="font-manrope font-bold text-[18px] text-[#F5F3EE] uppercase mt-0.5">
                  {selectedEnquiry.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="p-1 rounded text-[#777D87] hover:text-[#F5F3EE] transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Status Change Control */}
            <div>
              <label className="block text-[11px] font-mono uppercase text-[#777D87] mb-2">
                Update Lead Status
              </label>
              <div className="flex flex-wrap gap-1.5">
                {STATUS_OPTIONS.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(st)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                      selectedEnquiry.status === st
                        ? 'bg-[#F5F3EE] text-[#17130B] font-bold'
                        : 'bg-[#12151A] text-[#8C92A4] hover:text-[#F5F3EE] border border-[#252A32]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 bg-[#12151A] p-4 rounded-lg border border-[#1C2028] text-[12px] font-inter">
              <div>
                <p className="text-[10px] font-mono text-[#777D87] uppercase">Email</p>
                <a
                  href={`mailto:${selectedEnquiry.email}`}
                  className="text-[#F5F3EE] hover:underline font-medium break-all"
                >
                  {selectedEnquiry.email}
                </a>
              </div>
              <div>
                <p className="text-[10px] font-mono text-[#777D87] uppercase">Company</p>
                <p className="text-[#F5F3EE] font-medium">{selectedEnquiry.company || '—'}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-[#777D87] uppercase">Budget Tier</p>
                <p className="text-[#D6B77A] font-mono font-medium">{selectedEnquiry.budget}</p>
              </div>
              <div>
                <p className="text-[10px] font-mono text-[#777D87] uppercase">Timeline</p>
                <p className="text-[#D0CFCC] font-medium">{selectedEnquiry.timeline}</p>
              </div>
            </div>

            {/* Project Message Brief */}
            <div>
              <p className="text-[11px] font-mono uppercase text-[#777D87] mb-2">
                Project Scope &amp; Brief
              </p>
              <div className="p-3.5 rounded-lg bg-[#08090B] border border-[#1C2028] text-[13px] text-[#D0CFCC] leading-relaxed font-inter">
                {selectedEnquiry.message}
              </div>
            </div>

            {/* Internal Notes (Admin Only) */}
            <div className="pt-4 border-t border-[#252A32]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-mono uppercase text-[#D6B77A]">
                  Private Internal Notes
                </span>
                <button
                  onClick={handleSaveNotes}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#1A1E26] hover:bg-[#252A32] text-[#F5F3EE] text-[11px] font-mono transition-colors"
                >
                  <Save size={12} />
                  <span>Save Note</span>
                </button>
              </div>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add private evaluation notes, proposal links, or client call summaries..."
                className="w-full p-3 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[12.5px] text-[#F5F3EE] outline-none placeholder:text-[#555D69] resize-none"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
