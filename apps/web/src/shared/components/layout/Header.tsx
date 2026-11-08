'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowUpRight, Menu, X } from 'lucide-react'

const NAV_ITEMS = [
  { label: 'About', href: '/about' },
  { label: 'Work', href: '/work' },
  { label: 'Services', href: '/services' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'Contact', href: '/contact' },
]

export function Header() {
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Real-time dynamic scroll state
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0C10]/90 backdrop-blur-xl border-b border-white/[0.10] h-[76px] shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent border-b border-transparent h-[82px]'
      } flex items-center`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex items-center justify-between">
        {/* Left wordmark: EDIYREX® */}
        <Link href="/" className="flex items-center group select-none py-1">
          <span className="font-manrope font-extrabold text-[21px] tracking-[-0.03em] text-[#00E5FF] group-hover:brightness-110 transition-colors">
            EDIYREX
          </span>
          <span className="font-manrope font-extrabold text-[10.5px] text-[#00E5FF] ml-0.5 -translate-y-1">
            ®
          </span>
        </Link>

        {/* Center navigation links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`font-inter font-medium text-[12px] tracking-wide transition-colors duration-200 relative py-1.5 ${
                  isActive
                    ? 'text-[#39FF14] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#39FF14] font-semibold'
                    : 'text-[#999999] hover:text-[#00E5FF]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Far right actions: Studio availability & Start a Project CTA */}
        <div className="hidden md:flex items-center gap-4">
          {/* Subtle real-time availability flavour */}
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/[0.10] bg-[#12141A] text-[10.5px] font-mono text-[#00E5FF] select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
            <span>Studio Open Q1/Q2</span>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-1.5 px-4 h-[36px] rounded-md bg-[#39FF14] hover:bg-[#32e012] text-[#0B0C10] font-mono font-semibold text-[11.5px] uppercase tracking-wider transition-all duration-200 shadow-[0_0_18px_rgba(57,255,20,0.25)] group"
          >
            <span>Start a Project</span>
            <ArrowUpRight size={13} className="text-[#0B0C10] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md border border-white/[0.10] text-[#999999] hover:text-[#00E5FF] transition-colors"
          aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[76px] bg-[#0B0C10]/98 backdrop-blur-2xl border-b border-white/[0.10] px-6 py-8 flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.10] bg-[#12141A] text-[10.5px] font-mono text-[#00E5FF] w-fit mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_6px_#00E5FF]" />
            <span>Studio Open Q1/Q2</span>
          </div>

          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`text-base font-inter font-medium py-2.5 px-3 rounded-lg transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#12141A] text-[#39FF14] font-semibold border border-[#39FF14]/30'
                      : 'text-[#999999] hover:text-[#00E5FF] hover:bg-[#12141A]/50'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#39FF14]" />}
                </Link>
              )
            })}
          </nav>

          <div className="pt-4 border-t border-white/[0.10] mt-2">
            <Link
              href="/contact"
              className="w-full h-11 rounded-md bg-[#39FF14] hover:bg-[#32e012] text-[#0B0C10] font-inter font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors shadow-[0_0_20px_rgba(57,255,20,0.25)]"
            >
              <span>Start a Project</span>
              <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
