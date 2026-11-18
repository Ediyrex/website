"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "SERVICES", href: "/services" },
  { label: "INDUSTRIES", href: "/industries" },
  { label: "WORK", href: "/work" },
  { label: "ABOUT", href: "/about" },
  { label: "CONTACT", href: "/contact", hasArrow: true },
];

/**
 * Top navigation header for 404 — Signal Lost.
 * Follows EDYREX brand identity with Warm White typography,
 * subtle tracking, Signal Orange hover states, and responsive mobile menu.
 */
export function NotFoundHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative w-full z-20">
      <div className="max-w-[1700px] mx-auto px-5 sm:px-8 lg:px-14 py-6 md:py-8 flex items-center justify-between gap-6">
        {/* Wordmark */}
        <Link
          href="/"
          className="flex items-center gap-1 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] rounded-md px-1 -ml-1 transition-opacity hover:opacity-90"
        >
          <span
            style={{ fontFamily: "var(--font-space-grotesk)" }}
            className="font-bold text-2xl sm:text-3xl tracking-tight text-[#F5F2EC]"
          >
            EDYREX
            <sup className="text-xs font-semibold ml-0.5 text-[#F06419] align-super">
              ®
            </sup>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          aria-label="404 Primary Navigation"
          className="hidden md:flex items-center gap-7 lg:gap-10"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-mono font-medium uppercase tracking-[0.16em] text-[#F5F2EC]/85 hover:text-[#F06419] transition-colors duration-200 flex items-center gap-1 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] rounded"
            >
              <span>{link.label}</span>
              {link.hasArrow && (
                <ArrowUpRight className="w-3.5 h-3.5 text-[#F06419]" />
              )}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          className="md:hidden p-2 text-[#F5F2EC] hover:text-[#F06419] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] rounded"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#08090A]/95 backdrop-blur-xl border-b border-[#383838] px-6 py-6 space-y-4 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
          <nav aria-label="Mobile Navigation" className="flex flex-col space-y-3">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-mono font-semibold uppercase tracking-[0.16em] text-[#F5F2EC] hover:text-[#F06419] transition-colors py-2 flex items-center justify-between border-b border-[#252A32]/50"
              >
                <span>{link.label}</span>
                {link.hasArrow ? (
                  <ArrowUpRight className="w-4 h-4 text-[#F06419]" />
                ) : null}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
