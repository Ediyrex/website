'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Inbox,
  FolderGit2,
  Layers,
  Image as ImageIcon,
  Settings,
  ExternalLink,
  LogOut,
  ShieldAlert,
} from 'lucide-react'

const SIDEBAR_ITEMS = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Enquiries', href: '/admin/enquiries', icon: Inbox },
  { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
  { label: 'Services', href: '/admin/services', icon: Layers },
  { label: 'Media Library', href: '/admin/media', icon: ImageIcon },
  { label: 'Site Settings', href: '/admin/settings', icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-[240px] shrink-0 bg-[#0D0F12] border-r border-[#252A32] flex flex-col justify-between min-h-screen text-[#B2B4BA]">
      {/* Top: Brand Header & Navigation */}
      <div>
        <div className="h-[64px] px-6 flex items-center justify-between border-b border-[#252A32]">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="font-manrope font-extrabold text-[16px] text-[#F5F3EE] tracking-tight">
              EDIYREX
            </span>
            <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#D6B77A]/15 text-[#D6B77A] border border-[#D6B77A]/30">
              ADMIN
            </span>
          </Link>
        </div>

        <nav className="p-3 space-y-1">
          {SIDEBAR_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname === item.href || pathname?.startsWith(item.href + '/')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-[13px] font-inter font-medium transition-colors ${
                  isActive
                    ? 'bg-[#141820] text-[#F5F3EE] border border-[#3A414B]'
                    : 'text-[#8C92A4] hover:text-[#F5F3EE] hover:bg-[#12151A]'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#D6B77A]' : 'text-[#777D87]'} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Bottom: Profile & Shortcuts */}
      <div className="p-3 border-t border-[#252A32] space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-lg text-[12px] font-inter text-[#8C92A4] hover:text-[#F5F3EE] hover:bg-[#12151A] transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink size={14} />
            <span>View Public Site</span>
          </span>
          <span className="text-[10px] font-mono text-[#555D69]">↗</span>
        </Link>

        <div className="pt-2 border-t border-[#1C2028] flex items-center justify-between px-3 py-1">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#1A1E26] border border-[#3A414B] flex items-center justify-center text-[11px] font-bold text-[#F5F3EE]">
              ED
            </div>
            <div className="text-left">
              <p className="text-[12px] font-semibold text-[#F5F3EE] leading-tight">Studio Lead</p>
              <p className="text-[10px] font-mono text-[#777D87]">Super Admin</p>
            </div>
          </div>
          <Link
            href="/admin/login"
            title="Log out"
            className="p-1.5 rounded hover:bg-[#1A1E26] text-[#777D87] hover:text-red-400 transition-colors"
          >
            <LogOut size={14} />
          </Link>
        </div>
      </div>
    </aside>
  )
}

