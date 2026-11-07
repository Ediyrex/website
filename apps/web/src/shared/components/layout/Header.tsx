'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Media', href: '/media' },
  { label: 'Web', href: '/web' },
  { label: 'Agents & Automation', href: '/agents-automation' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
]

export function Header() {
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#000000]/90 backdrop-blur-md border-b border-[#161A24]">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex items-center justify-between h-[72px]">
        {/* Left wordmark: EDIYREX® */}
        <Link href="/" className="flex items-center group">
          <span className="font-manrope font-extrabold text-[22px] tracking-[-0.02em] text-[#FFFFFF]">
            EDIYREX
          </span>
          <span className="font-manrope font-extrabold text-[12px] text-[#FFFFFF] ml-0.5 -translate-y-1">
            ®
          </span>
        </Link>

        {/* Center/right navigation */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-8">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`font-inter font-medium text-[11.5px] tracking-wide transition-colors duration-200 relative py-1 ${
                  isActive
                    ? 'text-[#FFFFFF] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#2C3480]'
                    : 'text-[#7E8597] hover:text-[#FFFFFF]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Far right: Start a Project ↗ */}
        <div className="flex items-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-1.5 w-[124px] h-[35px] rounded-[11px] border border-[#2C3480] hover:border-[#414CA3] bg-[#2C3480]/15 hover:bg-[#2C3480]/30 text-[#FFFFFF] font-inter font-semibold text-[11.5px] transition-all duration-200"
          >
            <span>Start a Project</span>
            <ArrowUpRight size={13} className="text-[#D1D5DB] stroke-[2.2]" />
          </Link>
        </div>
      </div>
    </header>
  )
}
