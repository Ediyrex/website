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
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#08090b]/92 backdrop-blur-md border-b border-[#181a20]">
      <div className="container-main flex items-center justify-between h-[68px]">
        {/* Brand Wordmark with registered icon */}
        <Link href="/" className="flex items-center gap-0.5 group">
          <span className="font-sans font-extrabold text-[17px] tracking-[0.05em] text-[#f5f3ee]">
            EDIYREX
          </span>
          <span className="text-[10px] font-bold text-[#8c92a4] -translate-y-1">®</span>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isHome = item.href === '/' && pathname === '/'
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`text-[13px] tracking-wide transition-colors duration-200 ${
                  isHome
                    ? 'text-[#f5f3ee] font-medium border-b border-[#f5f3ee] pb-0.5'
                    : 'text-[#8c92a4] hover:text-[#f5f3ee]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Right CTA Button */}
        <div className="flex items-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#2b303c] hover:border-[#f5f3ee] text-[12px] font-medium text-[#f5f3ee] transition-all duration-200 hover:bg-white/5"
          >
            <span>Start a Project</span>
            <ArrowUpRight size={13} className="text-[#8c92a4]" />
          </Link>
        </div>
      </div>
    </header>
  )
}
