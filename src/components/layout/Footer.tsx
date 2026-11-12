"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import { CopyrightYear } from "./CopyrightYear";
import { SITE_CONFIG } from "@/config/site";

interface PublicFooterSettings {
  siteName?: string;
  footerNote?: string;
  copyrightText?: string;
  businessEmail?: string;
  phoneNumber?: string;
  studioLocation?: string;
  socialProfiles?: Array<{
    platform: string;
    label: string;
    url: string;
    visible: boolean;
  }>;
}

export function Footer() {
  const [live, setLive] = useState<PublicFooterSettings | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch("/api/v1/settings")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!ignore && json?.data) {
          setLive(json.data);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  const email = live?.businessEmail || SITE_CONFIG.contact.email;
  const phone = live?.phoneNumber ?? SITE_CONFIG.contact.phone;
  const location = live?.studioLocation || SITE_CONFIG.contact.location;
  const footerNote =
    live?.footerNote ||
    "Creative media, digital experiences and intelligent systems.";
  const copyrightText =
    live?.copyrightText || "Ediyrex Studio. All rights reserved.";
  const socialProfiles = live?.socialProfiles ?? [];

  return (
    <footer
      id="site-footer"
      className="bg-[#08090B] border-t border-[#252A32] pt-16 pb-24 md:pb-6 text-[#B2B4BA] text-sm"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#252A32]">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A] rounded"
            >
              <span className="font-heading font-bold text-xl tracking-tight text-[#F5F3EE]">
                {live?.siteName || "Ediyrex"}
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#D6B77A]" />
            </Link>
            <p className="text-sm text-[#B2B4BA] leading-relaxed max-w-xs">
              {footerNote}
            </p>
            <p className="text-xs font-mono text-[#777D87]">{location}</p>
            {socialProfiles.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {socialProfiles.map((sp) => (
                  <a
                    key={sp.platform}
                    href={sp.url}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded-md bg-[#111419] border border-[#252A32] hover:border-[#D6B77A]/50 text-[11px] font-mono text-[#B2B4BA] hover:text-[#D6B77A] transition-colors"
                  >
                    {sp.label}
                  </a>
                ))}
              </div>
            )}
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
                  href="/services/branding"
                  className="text-[#B2B4BA] hover:text-[#D6B77A] transition-colors"
                >
                  Branding / Marketing
                </Link>
              </li>
              <li>
                <Link
                  href="/services/media"
                  className="text-[#B2B4BA] hover:text-[#E58A76] transition-colors"
                >
                  Media &amp; Video Editing
                </Link>
              </li>
              <li>
                <Link
                  href="/services/digital"
                  className="text-[#B2B4BA] hover:text-[#7BA9F5] transition-colors"
                >
                  Web Dev, Extensions &amp; DADV
                </Link>
              </li>
              <li>
                <Link
                  href="/services/ai"
                  className="text-[#B2B4BA] hover:text-[#B5A0F5] transition-colors"
                >
                  Agents &amp; n8n Automation
                </Link>
              </li>
              <li>
                <Link
                  href="/services#services"
                  className="text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                >
                  Full Service Directory
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
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-2 text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                >
                  <Mail className="w-4 h-4 text-[#D6B77A]" />
                  <span>{email}</span>
                </a>
              </li>
              {phone && (
                <li>
                  <a
                    href={`tel:${phone}`}
                    className="inline-flex items-center gap-2 text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#D6B77A]" />
                    <span>{phone}</span>
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
            © <CopyrightYear /> {copyrightText}
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
