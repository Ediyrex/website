'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Bell, Search, ShieldCheck } from 'lucide-react'

export function AdminTopBar() {
  const pathname = usePathname()

  // Generate clean breadcrumb title
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Overview Dashboard'
    if (pathname.includes('/enquiries')) return 'Project Enquiries'
    if (pathname.includes('/projects')) return 'Portfolio Projects'
    if (pathname.includes('/services')) return 'Service Divisions'
    if (pathname.includes('/media')) return 'Media Library'
    if (pathname.includes('/settings')) return 'Site Settings'
    return 'Admin Workspace'
  }

  return (
    <header className="h-[64px] px-8 bg-[#0D0F12]/80 backdrop-blur-md border-b border-[#252A32] flex items-center justify-between sticky top-0 z-30">
      {/* Left: Breadcrumb / Page Title */}
      <div className="flex items-center gap-3">
        <span className="text-[11px] font-mono uppercase text-[#777D87] tracking-wider">
          WORKSPACE /
        </span>
        <h1 className="font-manrope font-bold text-[15px] text-[#F5F3EE]">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right: Operational Status & Shortcuts */}
      <div className="flex items-center gap-4">
        {/* System Status Pill */}
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#12151A] border border-[#252A32] text-[11px] font-mono text-[#4CAF8A]">
          <span className="w-1.5 h-1.5 rounded-full bg-[#4CAF8A] animate-pulse" />
          <span>System Online</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="text-[12px] font-inter font-medium px-3 py-1.5 rounded-lg bg-[#141820] hover:bg-[#1C2028] border border-[#252A32] hover:border-[#3A414B] text-[#D0CFCC] transition-colors"
        >
          Live Site ↗
        </Link>
      </div>
    </header>
  )
}
