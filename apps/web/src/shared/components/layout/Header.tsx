'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Media', href: '/services#media' },
  { label: 'Web', href: '/services#web' },
  { label: 'Agents & Automation', href: '/services#agents' },
  { label: 'About', href: '/studio' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#050507]/90 backdrop-blur-md border-b border-[#14161C]/80">
      <div className="container-main flex items-center justify-between h-20">
        {/* Brand Logo with Registered Symbol */}
        <Link href="/" className="flex items-center gap-1 group">
          <span className="font-sans font-extrabold text-xl tracking-wider text-white">
            EDIYREX
          </span>
          <span className="text-[10px] font-bold text-[#8C92A4] -translate-y-1">®</span>
        </Link>

        {/* Center Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => {
            const isHome = item.href === '/' && pathname === '/'
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-xs tracking-wider transition-colors duration-200 ${
                  isHome
                    ? 'text-white font-medium border-b border-white pb-0.5'
                    : 'text-[#8C92A4] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Start a Project Pill Button with Arrow */}
        <div className="flex items-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#2A2E39] hover:border-white text-xs font-medium text-white transition-all duration-200 hover:bg-white/5"
          >
            <span>Start a Project</span>
            <ArrowUpRight size={13} className="text-[#8C92A4]" />
          </Link>
        </div>
      </div>
    </header>
  )
}
