"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Copy,
  Mail,
} from "lucide-react";
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

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

const SERVICE_LINKS = [
  { label: "Web Development", href: "/services/digital" },
  { label: "Digital Products", href: "/services/digital" },
  { label: "AI & Automation", href: "/services/ai" },
  { label: "Branding & Identity", href: "/services/branding" },
  { label: "Media & Production", href: "/services/media" },
] as const;

const INDUSTRY_ITEMS = [
  "Healthcare & Clinics",
  "Real Estate & Property",
  "Restaurants & Hospitality",
  "Retail & E-Commerce",
  "Education & Coaching",
] as const;

export function Footer() {
  const [live, setLive] = useState<PublicFooterSettings | null>(null);
  const [copied, setCopied] = useState(false);

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
  const footerNote =
    live?.footerNote ||
    "A creative and technology studio that helps businesses build websites, digital products and intelligent systems that work in the real world.";
  const copyrightText =
    live?.copyrightText || "EDIYREX STUDIO®. All rights reserved.";
  const socialProfiles = live?.socialProfiles ?? [];

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      // Ignore if clipboard unavailable
    }
  };

  return (
    <footer
      id="site-footer"
      className="relative overflow-hidden bg-[#080807] border-t border-white/10 pt-14 pb-24 md:pb-8 text-[#D4CEC6] text-sm"
    >
      {/* Right-edge diagonal Signal Orange architectural accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden xl:block absolute -right-2 top-0 bottom-14 w-16 bg-[#FF640A]"
        style={{ clipPath: "polygon(52% 0, 100% 0, 48% 100%, 0 100%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.75fr_0.95fr_1.05fr_1.15fr] gap-9 lg:gap-6 pb-12">
          {/* Column 1: Brand + Slanted Accent + Studio Updates */}
          <div className="space-y-5 lg:pr-4">
            <Link
              href="/"
              className="inline-block font-heading text-[20px] font-bold uppercase tracking-[0.02em] text-[#FFFDFC] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF640A]"
            >
              {(live?.siteName || "EDIYREX STUDIO").toUpperCase()}
              <sup className="ml-0.5 text-[10px]">®</sup>
            </Link>

            <p className="text-[13.5px] leading-[1.65] text-[#C8C2B9] max-w-[300px]">
              {footerNote}
            </p>

            {/* Slanted orange studio stripes */}
            <div aria-hidden="true" className="flex items-center gap-2 pt-0.5">
              {[0, 1, 2, 3, 4].map((idx) => (
                <span
                  key={idx}
                  className="h-3.5 w-3 -skew-x-[26deg] bg-[#FF640A]"
                />
              ))}
            </div>

            {/* Outlined Studio Updates Box */}
            <Link
              href="/contact"
              className="group flex max-w-[300px] items-center justify-between gap-3 rounded-[6px] border border-white/25 bg-white/[0.02] px-4 py-3 transition-colors duration-200 hover:border-[#FF640A] hover:bg-white/[0.04]"
            >
              <div className="flex items-center gap-3 min-w-0">
                <Mail
                  className="h-4 w-4 shrink-0 text-[#F5F3EE] group-hover:text-[#FF640A] transition-colors"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <div className="font-mono text-[10.5px] font-semibold uppercase tracking-[0.14em] text-[#FFFDFC]">
                    GET STUDIO UPDATES
                  </div>
                  <div className="text-[11.5px] text-[#9E978E] truncate">
                    New work, ideas and releases.
                  </div>
                </div>
              </div>
              <ArrowUpRight
                className="h-4 w-4 shrink-0 text-[#D4CEC6] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FF640A]"
                aria-hidden="true"
              />
            </Link>
          </div>

          {/* Column 2: Explore */}
          <div className="space-y-3.5 lg:border-l lg:border-white/15 lg:pl-7">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FFFDFC]">
              EXPLORE
            </h2>
            <ul className="space-y-2.5 text-[13.5px]">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[#C8C2B9] hover:text-[#FF640A] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Services */}
          <div className="space-y-3.5 lg:border-l lg:border-white/15 lg:pl-7">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FFFDFC]">
              SERVICES
            </h2>
            <ul className="space-y-2.5 text-[13.5px]">
              {SERVICE_LINKS.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-[#C8C2B9] hover:text-[#FF640A] transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Industries */}
          <div className="space-y-3.5 lg:border-l lg:border-white/15 lg:pl-7">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FFFDFC]">
              INDUSTRIES
            </h2>
            <ul className="space-y-2.5 text-[13.5px]">
              {INDUSTRY_ITEMS.map((label) => (
                <li key={label}>
                  <Link
                    href="/services"
                    className="text-[#C8C2B9] hover:text-[#FF640A] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 text-[#FFFDFC] hover:text-[#FF640A] font-medium transition-colors"
                >
                  <span>More Industries</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Let's Build */}
          <div className="space-y-4 lg:border-l lg:border-white/15 lg:pl-7 xl:pr-12">
            <h2 className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-[#FFFDFC]">
              LET&apos;S BUILD
            </h2>

            {/* Orange email + clipboard copy button */}
            <div className="flex items-center gap-2.5">
              <a
                href={`mailto:${email}`}
                className="font-heading text-[16px] font-semibold text-[#FF640A] hover:text-[#FF853D] transition-colors truncate"
              >
                {email}
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                aria-label={`Copy ${email}`}
                title={copied ? "Copied!" : `Copy ${email}`}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded border border-white/15 bg-white/[0.03] text-[#C8C2B9] hover:border-[#FF640A] hover:text-white transition-colors cursor-pointer"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5 text-[#4ADE80]" aria-hidden="true" />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Solid Orange Start a Project CTA */}
            <Link
              href="/contact"
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[#FF640A] px-5 font-heading text-[15px] font-semibold text-white transition-colors duration-200 hover:bg-[#FF7828] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF640A]"
            >
              <span>Start a Project</span>
              <ArrowUpRight
                className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </Link>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              {socialProfiles.length > 0 ? (
                socialProfiles.map((sp) => (
                  <a
                    key={sp.platform}
                    href={sp.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={sp.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-[11px] font-mono uppercase text-[#E5DFD6] hover:border-[#FF640A] hover:text-[#FF640A] transition-colors"
                  >
                    {sp.label.slice(0, 2)}
                  </a>
                ))
              ) : (
                <>
                  <Link
                    href="/contact"
                    aria-label="LinkedIn"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 font-heading text-[12px] font-bold text-[#E5DFD6] hover:border-[#FF640A] hover:text-[#FF640A] transition-colors"
                  >
                    in
                  </Link>
                  <Link
                    href="/contact"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-[#E5DFD6] hover:border-[#FF640A] hover:text-[#FF640A] transition-colors"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                    </svg>
                  </Link>
                  <Link
                    href="/contact"
                    aria-label="YouTube"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-[#E5DFD6] hover:border-[#FF640A] hover:text-[#FF640A] transition-colors"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      className="h-4 w-4"
                      aria-hidden="true"
                    >
                      <rect x="2.5" y="5.5" width="19" height="13" rx="4" />
                      <polygon points="10,9 16,12 10,15" fill="currentColor" stroke="none" />
                    </svg>
                  </Link>
                  <Link
                    href="/contact"
                    aria-label="X"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 font-mono text-[12px] font-semibold text-[#E5DFD6] hover:border-[#FF640A] hover:text-[#FF640A] transition-colors"
                  >
                    𝕏
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal / THINK BUILD DELIVER Strip */}
        <div className="border-t border-white/20 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[12px] text-[#9E978E]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2">
            <p className="font-mono text-[11px] tracking-[0.04em] text-[#C8C2B9]">
              © <CopyrightYear /> {copyrightText}
            </p>
            <Link
              href="/privacy"
              className="hover:text-[#FFFDFC] transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              className="hover:text-[#FFFDFC] transition-colors"
            >
              Terms
            </Link>
          </div>

          <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-[#D4CEC6]">
            THINK &nbsp;/&nbsp; BUILD &nbsp;/&nbsp; DELIVER
          </span>
        </div>
      </div>
    </footer>
  );
}
