import { LeadStatus } from '../types'

interface StatusBadgeProps {
  status: LeadStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case 'New':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-blue-950/60 text-blue-300 border border-blue-800/50">
          New
        </span>
      )
    case 'Reviewing':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-amber-950/60 text-amber-300 border border-amber-800/50">
          Reviewing
        </span>
      )
    case 'Qualified':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-purple-950/60 text-purple-300 border border-purple-800/50">
          Qualified
        </span>
      )
    case 'Proposal Sent':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
          Proposal Sent
        </span>
      )
    case 'Won':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-800/50">
          Won
        </span>
      )
    case 'Lost':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-rose-950/60 text-rose-300 border border-rose-800/50">
          Lost
        </span>
      )
    case 'Archived':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-mono font-medium bg-zinc-900 text-zinc-400 border border-zinc-700/50">
          Archived
        </span>
      )
  }
}

