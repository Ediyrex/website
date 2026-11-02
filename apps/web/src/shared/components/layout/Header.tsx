'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X, Menu, ArrowUpRight } from 'lucide-react'
import { cn } from '@/shared/utils'
import { NAV_LINKS, SITE } from '@/shared/constants'
import { Button } from '@/shared/components/ui'

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  // Scroll detection — switch to frosted variant after 60px
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  // Trap focus and handle ESC key in mobile menu
  useEffect(() => {
    if (!mobileOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  return (
    <>
      <header
        role="banner"
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'transition-all duration-300 ease-out',
          scrolled
            ? 'bg-[#08090B]/85 backdrop-blur-xl border-b border-[#252A33]/60 py-4'
            : 'bg-transparent py-6'
        )}
      >
        <div className="container-main flex items-center justify-between gap-8">
          {/* Logo */}
          <Link
            href="/"
            aria-label={`${SITE.name} — Home`}
            className="flex items-center gap-3 group shrink-0"
          >
            <Logo />
          </Link>

          {/* Desktop Navigation */}
          <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-4 py-2 text-sm font-medium rounded-lg',
                    'transition-colors duration-200',
                    'after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2',
                    'after:h-px after:w-0 after:bg-[#D6B77A]/70',
                    'after:transition-all after:duration-300 after:ease-out',
                    'hover:after:w-4/5',
                    isActive
                      ? 'text-[#F0EDE8] after:w-4/5'
                      : 'text-[#9AA0AB] hover:text-[#F0EDE8]'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <Button
              variant="secondary"
              size="sm"
              rightIcon={<ArrowUpRight size={14} />}
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              Start a Project
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={cn(
              'md:hidden flex items-center justify-center',
              'w-10 h-10 rounded-lg',
              'text-[#9AA0AB] hover:text-[#F0EDE8]',
              'hover:bg-[#F0EDE8]/6',
              'transition-colors duration-200',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D6B77A]'
            )}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        aria-hidden={!mobileOpen}
        className={cn(
          'fixed inset-0 z-40 md:hidden',
          'flex flex-col',
          'bg-[#08090B]/97 backdrop-blur-xl',
          'transition-all duration-300 ease-out',
          mobileOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Mobile Nav Content */}
        <div className="flex flex-col h-full pt-24 pb-10 px-6">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1 flex-1">
            {NAV_LINKS.map((link, i) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex items-center justify-between',
                    'py-4 border-b border-[#1C2028]',
                    'text-2xl font-heading font-semibold tracking-tight',
                    'transition-all duration-200',
                    'group',
                    isActive ? 'text-[#D6B77A]' : 'text-[#5C6370] hover:text-[#F0EDE8]'
                  )}
                  style={{
                    transitionDelay: mobileOpen ? `${i * 50 + 100}ms` : '0ms',
                    transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
                    opacity: mobileOpen ? 1 : 0,
                  }}
                >
                  {link.label}
                  <ArrowUpRight
                    size={20}
                    className="text-[#252A33] group-hover:text-[#D6B77A] transition-colors duration-200"
                  />
                </Link>
              )
            })}
          </nav>

          {/* Mobile CTA */}
          <div
            className="flex flex-col gap-4"
            style={{
              transitionDelay: mobileOpen ? '350ms' : '0ms',
              transform: mobileOpen ? 'translateY(0)' : 'translateY(12px)',
              opacity: mobileOpen ? 1 : 0,
              transition: 'opacity 300ms ease-out, transform 300ms ease-out',
            }}
          >
            <Button variant="primary" size="lg" className="w-full">
              Start a Project
            </Button>
            <p className="text-xs text-[#5C6370] text-center">
              {SITE.email}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Logo ────────────────────────────────────────────────────────────────────

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      {/* Monogram mark */}
      <div
        aria-hidden="true"
        className={cn(
          'flex items-center justify-center',
          'w-8 h-8 rounded-[0.5rem]',
          'bg-[#D6B77A]/10 border border-[#D6B77A]/25',
          'transition-all duration-300',
          'group-hover:bg-[#D6B77A]/18 group-hover:border-[#D6B77A]/50'
        )}
      >
        <span
          className="font-heading font-bold text-[#D6B77A] text-sm tracking-tight leading-none"
          style={{ letterSpacing: '-0.03em' }}
        >
          Ex
        </span>
      </div>

      {/* Wordmark */}
      <span
        className={cn(
          'font-heading font-semibold text-[#F0EDE8] text-lg tracking-tight',
          'transition-colors duration-300 group-hover:text-[#E8CFA0]'
        )}
        style={{ letterSpacing: '-0.02em' }}
      >
        Ediyrex
      </span>
    </div>
  )
}

