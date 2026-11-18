"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ArrowUpRight, Menu, X, Calendar, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { BookCallButton } from "@/features/bookings";
import { SITE_CONFIG } from "@/config/site";

const NAV_LINKS = [
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const hasDarkHero =
    pathname === "/work" ||
    pathname === "/contact" ||
    pathname === "/industries" ||
    pathname === "/about" ||
    Boolean(pathname?.startsWith("/services/"));
  const isLightHeroNav = !hasDarkHero && !pastHero;

  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 16);
      const darkStartEl = document.getElementById("site-footer");
      const isPastLightSections = darkStartEl
        ? darkStartEl.getBoundingClientRect().top <= 80
        : false;
      setPastHero(isPastLightSections);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [pathname]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
        mobileTriggerRef.current?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Prevent background scrolling when mobile menu is open & move focus inside
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
      const firstLink = mobileMenuRef.current?.querySelector("a");
      firstLink?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-200",
          isLightHeroNav
            ? isScrolled
              ? "bg-[#F8F6F2]/88 backdrop-blur-md border-b border-[#0B0D10]/10"
              : "bg-transparent border-b border-transparent"
            : isScrolled
            ? "bg-[#08090B]/90 backdrop-blur-md border-b border-[#252A32]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14">
          <div className="h-[68px] md:h-20 flex items-center justify-between gap-6">
            {/* Official EDIYREX Brand Lockup */}
            <Link
              href="/"
              aria-label="EDIYREX Studio - Home"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A] rounded-md px-1 -ml-1 group"
            >
              <Image
                src="/images/logo/ediyrex-emblem.png"
                alt=""
                width={36}
                height={36}
                priority
                className="h-8 sm:h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
              <Image
                src="/images/logo/ediyrex-wordmark.png"
                alt="EDIYREX"
                width={124}
                height={20}
                priority
                className={cn(
                  "h-4 sm:h-[18px] w-auto object-contain transition-opacity",
                  isLightHeroNav ? "brightness-0" : "brightness-100"
                )}
              />
            </Link>

            {/* Desktop Navigation */}
            <nav
              aria-label="Primary Navigation"
              style={
                isLightHeroNav
                  ? { fontFamily: "var(--font-space-grotesk)" }
                  : undefined
              }
              className="hidden md:flex items-center gap-7 lg:gap-9"
            >
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onPointerEnter={() => router.prefetch(link.href)}
                    onPointerDown={() => router.prefetch(link.href)}
                    onTouchStart={() => router.prefetch(link.href)}
                    className={cn(
                      "text-sm font-medium transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] rounded",
                      isLightHeroNav
                        ? isActive
                          ? "text-[#0B0D10] underline underline-offset-8 decoration-[#0B0D10] decoration-2"
                          : "text-[#0B0D10]/80 hover:text-[#0B0D10]"
                        : isActive
                        ? "text-[#F5F3EE] underline underline-offset-8 decoration-[#F06419] decoration-2"
                        : "text-[#B2B4BA] hover:text-[#F5F3EE]"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Primary CTA & Mobile Trigger */}
            <div className="flex items-center gap-3">
              <div className="hidden md:block">
                {isLightHeroNav ? (
                  <BookCallButton variant="navbar-light">
                    <span>Book a Call ↗</span>
                  </BookCallButton>
                ) : (
                  <BookCallButton variant="navbar">
                    <span>Book a Call ↗</span>
                  </BookCallButton>
                )}
              </div>

              <button
                ref={mobileTriggerRef}
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className={cn(
                  "md:hidden w-11 h-11 flex items-center justify-center rounded-lg border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A]",
                  isLightHeroNav
                    ? "text-[#0B0D10] border-[#0B0D10]/15 bg-white/60"
                    : "text-[#F5F3EE] border-[#252A32] bg-[#12151A]"
                )}
                aria-label="Toggle Navigation Menu"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-overlay"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Full-Height Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-overlay"
          ref={mobileMenuRef}
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-40 md:hidden bg-[#08090B]/98 backdrop-blur-xl pt-24 pb-8 px-6 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200"
        >
          <div className="space-y-6">
            <nav aria-label="Mobile Menu Links" className="space-y-3">
              <div className="border-b border-[#252A32]/60 pb-2">
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-heading font-semibold text-2xl text-[#F5F3EE] hover:text-[#F06419] transition-colors py-1"
                >
                  Home
                </Link>
              </div>
              {NAV_LINKS.map((link) => (
                <div key={link.href} className="border-b border-[#252A32]/60 pb-2">
                  <Link
                    href={link.href}
                    onPointerDown={() => router.prefetch(link.href)}
                    onTouchStart={() => router.prefetch(link.href)}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block font-heading font-semibold text-2xl text-[#F5F3EE] hover:text-[#F06419] transition-colors py-1"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Quick Division Shortcuts on Mobile */}
            <div className="pt-2">
              <span className="block text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] mb-2.5">
                Our 4 Divisions
              </span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <Link
                  href="/services/branding"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-[#B8B9BC] hover:text-white hover:border-[#D6B77A] transition-colors"
                >
                  01 · Branding
                </Link>
                <Link
                  href="/services/media"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-[#B8B9BC] hover:text-white hover:border-[#F06419] transition-colors"
                >
                  02 · Media
                </Link>
                <Link
                  href="/services/digital"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-[#B8B9BC] hover:text-white hover:border-[#7ba9f5] transition-colors"
                >
                  03 · Digital
                </Link>
                <Link
                  href="/services/ai"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-[#B8B9BC] hover:text-white hover:border-[#b5a0f5] transition-colors"
                >
                  04 · AI &amp; Auto
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-6 space-y-4 border-t border-[#252A32]/80 mt-6">
            <div className="grid grid-cols-2 gap-3">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="h-12 rounded-[10px] bg-[#F06419] hover:bg-[#D95612] text-black font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-md active:scale-[0.98] transition-transform"
              >
                <span>Start Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
              <BookCallButton
                variant="outline"
                onClick={() => setMobileMenuOpen(false)}
                className="h-12 rounded-[10px] border border-[#383838] bg-[#12151A] text-[#F5F2EC] hover:bg-[#1A1D24] text-xs font-semibold flex items-center justify-center gap-1.5"
              >
                <Calendar className="w-3.5 h-3.5 text-[#D6B77A]" />
                <span>Book Call</span>
              </BookCallButton>
            </div>

            {/* Clickable Phone and Clickable Email in Mobile Menu */}
            <div className="flex flex-col items-center gap-2 pt-2 text-xs font-mono">
              <a
                href={`mailto:${SITE_CONFIG.contact.email}`}
                className="text-[#F06419] hover:underline inline-flex items-center gap-2 py-1 transition-colors"
                aria-label={`Email EDYREX at ${SITE_CONFIG.contact.email}`}
              >
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <span>{SITE_CONFIG.contact.email}</span>
              </a>
              <a
                href={`tel:${SITE_CONFIG.contact.phone.replace(/[^0-9+]/g, "")}`}
                className="text-[#B8B9BC] hover:text-[#F5F2EC] inline-flex items-center gap-2 py-1 transition-colors"
                aria-label={`Call EDYREX at ${SITE_CONFIG.contact.phone}`}
              >
                <Phone className="w-3.5 h-3.5 shrink-0 text-[#D6B77A]" />
                <span>{SITE_CONFIG.contact.phone}</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
