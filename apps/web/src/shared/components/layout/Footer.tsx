import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

const DIVISIONS = [
  { label: 'Media Production', href: '/media' },
  { label: 'Web & Digital', href: '/web' },
  { label: 'Agents & Automation', href: '/agents-automation' },
]

const STUDIO_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Selected Work', href: '/work' },
  { label: 'Services Scope', href: '/services' },
  { label: 'Reviews & Reputation', href: '/reviews' },
  { label: 'Start a Project', href: '/contact' },
]

const LEGAL_LINKS = [
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-[#080808] border-t border-white/[0.08] pt-16 pb-12 text-[#999999]">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-14 border-b border-white/[0.08]">
          
          {/* Brand info (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start gap-4">
            <Link href="/" className="flex items-center group">
              <span className="font-manrope font-extrabold text-[21px] tracking-[-0.03em] text-[#EAEAEA] group-hover:text-white transition-colors">
                EDIYREX
              </span>
              <span className="font-manrope font-extrabold text-[11px] text-[#EAEAEA] ml-0.5 -translate-y-1">
                ®
              </span>
            </Link>

            <p className="font-inter text-[13px] text-[#999999] leading-relaxed max-w-sm">
              A Creative × Technology Studio unifying cinematic media production, modern web applications, and autonomous AI systems.
            </p>

            <a
              href="mailto:hello@ediyrex.com"
              className="font-inter text-[13px] text-[#EAEAEA] hover:underline transition-colors"
            >
              hello@ediyrex.com
            </a>
          </div>

          {/* Divisions (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-3 font-inter">
            <p className="text-[10px] font-mono uppercase tracking-[2px] text-[#666666] mb-1">
              DIVISIONS
            </p>
            {DIVISIONS.map((div) => (
              <Link
                key={div.href}
                href={div.href}
                className="text-[13px] text-[#999999] hover:text-[#EAEAEA] transition-colors py-0.5"
              >
                {div.label}
              </Link>
            ))}
          </div>

          {/* Studio (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3 font-inter">
            <p className="text-[10px] font-mono uppercase tracking-[2px] text-[#666666] mb-1">
              STUDIO
            </p>
            {STUDIO_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] text-[#999999] hover:text-[#EAEAEA] transition-colors py-0.5"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Connect (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-3 font-inter">
            <p className="text-[10px] font-mono uppercase tracking-[2px] text-[#666666] mb-1">
              CONNECT
            </p>
            <a
              href="https://linkedin.com/company/ediyrex"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] text-[#999999] hover:text-[#EAEAEA] transition-colors py-0.5 group"
            >
              <span>LinkedIn</span>
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="https://instagram.com/ediyrex"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] text-[#999999] hover:text-[#EAEAEA] transition-colors py-0.5 group"
            >
              <span>Instagram</span>
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <a
              href="https://x.com/ediyrex"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[13px] text-[#999999] hover:text-[#EAEAEA] transition-colors py-0.5 group"
            >
              <span>X / Twitter</span>
              <ArrowUpRight size={12} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>
        </div>

        {/* Bottom row: copyright & legal */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 text-[12px] text-[#666666] font-inter">
          <div>
            &copy; {year} Ediyrex Studio. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-[#EAEAEA] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
