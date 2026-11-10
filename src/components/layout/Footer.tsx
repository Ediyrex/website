import React from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { CopyrightYear } from "./CopyrightYear";
import { SITE_CONFIG } from "@/config/site";

export function Footer() {
  return (
    <footer className="bg-[#08090B] border-t border-[#252A32] pt-16 pb-24 md:pb-6 text-[#B2B4BA] text-sm">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#252A32]">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A] rounded"
            >
              <span className="font-heading font-bold text-xl tracking-tight text-[#F5F3EE]">
                Ediyrex
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6B77A]" />
            </Link>
            <p className="text-sm text-[#B2B4BA] leading-relaxed max-w-xs">
              Creative media, digital experiences and intelligent systems.
            </p>
            <p className="text-xs font-mono text-[#777D87]">
              {SITE_CONFIG.contact.location}
            </p>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#F5F3EE]">
              Explore
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/services"
                  className="text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  href="/work"
                  className="text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                >
                  Work
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Capabilities */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#F5F3EE]">
              Capabilities
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/services/media"
                  className="text-[#B2B4BA] hover:text-[#E58A76] transition-colors"
                >
                  Media
                </Link>
              </li>
              <li>
                <Link
                  href="/services/digital"
                  className="text-[#B2B4BA] hover:text-[#7BA9F5] transition-colors"
                >
                  Digital
                </Link>
              </li>
              <li>
                <Link
                  href="/services/ai"
                  className="text-[#B2B4BA] hover:text-[#B5A0F5] transition-colors"
                >
                  AI
                </Link>
              </li>
              <li>
                <Link
                  href="/services/digital#brand-identity-graphic-design"
                  className="text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                >
                  Brand identity
                </Link>
              </li>
              <li>
                <Link
                  href="/services/ai#business-workflow-automation"
                  className="text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                >
                  Automation
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#F5F3EE]">
              Contact
            </h2>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${SITE_CONFIG.contact.email}`}
                  className="inline-flex items-center gap-2 text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#D6B77A]" />
                  <span>{SITE_CONFIG.contact.email}</span>
                </a>
              </li>
              {SITE_CONFIG.contact.phone && (
                <li>
                  <a
                    href={`tel:${SITE_CONFIG.contact.phone}`}
                    className="inline-flex items-center gap-2 text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#D6B77A]" />
                    <span>{SITE_CONFIG.contact.phone}</span>
                  </a>
                </li>
              )}
              <li>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-[#D6B77A] hover:text-[#E6CC99] font-medium transition-colors"
                >
                  <span>Book a discovery call</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777D87]">
          <p>
            © <CopyrightYear /> Ediyrex Studio. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-[#F5F3EE] transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#F5F3EE] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
