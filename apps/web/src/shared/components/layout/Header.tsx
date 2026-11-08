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
          ? 'bg-[#080808]/90 backdrop-blur-xl border-b border-white/[0.10] h-[76px] shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-transparent border-b border-transparent h-[82px]'
      } flex items-center`}
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16 flex items-center justify-between">
        {/* Left wordmark: EDIYREX® */}
        <Link href="/" className="flex items-center group select-none py-1">
          <span className="font-manrope font-extrabold text-[21px] tracking-[-0.03em] text-[#EAEAEA] group-hover:text-white transition-colors">
            EDIYREX
          </span>
          <span className="font-manrope font-extrabold text-[10.5px] text-[#EAEAEA] ml-0.5 -translate-y-1">
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
                    ? 'text-[#EAEAEA] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[1.5px] after:bg-[#2C3480]'
                    : 'text-[#999999] hover:text-[#EAEAEA]'
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
          <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded-full border border-white/[0.10] bg-[#111111]/80 text-[10.5px] font-mono text-[#999999] select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480] shadow-[0_0_6px_#2C3480]" />
            <span>Studio Open Q1/Q2</span>
          </div>

          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-1.5 px-4 h-[36px] rounded-md border border-white/20 hover:border-white text-[#EAEAEA] hover:bg-white hover:text-black font-mono text-[11.5px] uppercase tracking-wider transition-all duration-200 group"
          >
            <span>Start a Project</span>
            <ArrowUpRight size={13} className="text-[#999999] group-hover:text-black transition-colors" />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 rounded-md border border-white/[0.10] text-[#999999] hover:text-white transition-colors"
          aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-[76px] bg-[#080808]/98 backdrop-blur-2xl border-b border-white/[0.10] px-6 py-8 flex flex-col gap-5 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.10] bg-[#111111] text-[10.5px] font-mono text-[#999999] w-fit mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />
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
                      ? 'bg-[#111111] text-white font-semibold border border-white/[0.10]'
                      : 'text-[#999999] hover:text-white hover:bg-[#111111]/50'
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#2C3480]" />}
                </Link>
              )
            })}
          </nav>

          <div className="pt-4 border-t border-white/[0.10] mt-2">
            <Link
              href="/contact"
              className="w-full h-11 rounded-md bg-white hover:bg-neutral-200 text-black font-inter font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
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
