import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/shared/utils'
import { SITE, NAV_LINKS, SERVICE_DIVISIONS } from '@/shared/constants'
import { Divider } from '@/shared/components/ui'

const SOCIAL_LINKS = [
  { label: 'Instagram', href: 'https://instagram.com/ediyrex' },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/ediyrex' },
  { label: 'Twitter / X', href: 'https://x.com/ediyrex' },
] as const

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
] as const

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer role="contentinfo" className="bg-[#08090B] border-t border-[#1C2028]">
      {/* Top section */}
      <div className="container-main pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2.5 w-fit">
              <div className={cn(
                'flex items-center justify-center',
                'w-8 h-8 rounded-[0.5rem]',
                'bg-[#D6B77A]/10 border border-[#D6B77A]/25',
                'transition-all duration-300 group-hover:bg-[#D6B77A]/18 group-hover:border-[#D6B77A]/50'
              )}>
                <span className="font-heading font-bold text-[#D6B77A] text-sm tracking-tight leading-none">
                  Ex
                </span>
              </div>
              <span className="font-heading font-semibold text-[#F0EDE8] text-lg tracking-tight transition-colors duration-300 group-hover:text-[#E8CFA0]">
                Ediyrex
              </span>
            </Link>

            <p className="text-[#5C6370] text-sm leading-relaxed max-w-sm">
              {SITE.tagline}
            </p>

            {/* Divisions */}
            <div className="flex flex-wrap gap-2 mt-1">
              {SERVICE_DIVISIONS.map((div) => (
                <span
                  key={div.id}
                  className="text-xs font-mono uppercase tracking-widest px-3 py-1 rounded-full border border-[#1C2028] text-[#5C6370]"
                >
                  {div.label}
                </span>
              ))}
            </div>

            {/* Contact */}
            <a
              href={`mailto:${SITE.email}`}
              className="text-sm text-[#9AA0AB] hover:text-[#D6B77A] transition-colors duration-200 w-fit mt-1"
            >
              {SITE.email}
            </a>
          </div>

          {/* Studio Links */}
          <div className="flex flex-col gap-4">
            <p className="label-mono text-[#5C6370]">Studio</p>
            <nav aria-label="Footer studio links">
              <ul className="flex flex-col gap-3">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#9AA0AB] hover:text-[#F0EDE8] transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="text-sm text-[#9AA0AB] hover:text-[#F0EDE8] transition-colors duration-200"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Connect Links */}
          <div className="flex flex-col gap-4">
            <p className="label-mono text-[#5C6370]">Connect</p>
            <nav aria-label="Footer social links">
              <ul className="flex flex-col gap-3">
                {SOCIAL_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm text-[#9AA0AB] hover:text-[#F0EDE8] transition-colors duration-200 group"
                    >
                      {link.label}
                      <ArrowUpRight
                        size={12}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <Divider />

      {/* Bottom bar */}
      <div className="container-main py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-[#5C6370]">
            © {year} {SITE.name}. All rights reserved.
            <span className="mx-2 text-[#252A33]">·</span>
            <span>India</span>
          </p>

          <nav aria-label="Legal links">
            <ul className="flex items-center gap-5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-[#5C6370] hover:text-[#9AA0AB] transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  )
}

