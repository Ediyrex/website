"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { BookCallButton } from "@/features/bookings";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Industries", href: "/industries" },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
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
            {/* Official Brand Lockup */}
            <Link
              href="/"
              aria-label="EDIYREX Studio - Home"
              className="group flex items-center gap-2.5 sm:gap-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF640A] rounded-md px-1 -ml-1 transition-transform"
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
                alt="EDIYREX STUDIO"
                width={124}
                height={20}
                priority
                className={cn(
                  "h-4 sm:h-[18px] w-auto object-contain transition-all duration-200",
                  isLightHeroNav ? "brightness-0" : ""
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
          className="fixed inset-0 z-40 md:hidden bg-[#08090B] pt-24 pb-8 px-6 flex flex-col justify-between overflow-y-auto"
        >
          <div>
            <div className="flex items-center pb-5 mb-4 border-b border-[#252A32]/60">
              <Link
                href="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5"
              >
                <Image
                  src="/images/logo/ediyrex-emblem.png"
                  alt=""
                  width={32}
                  height={32}
                  className="h-7 w-auto object-contain"
                />
                <Image
                  src="/images/logo/ediyrex-wordmark.png"
                  alt="EDIYREX STUDIO"
                  width={110}
                  height={18}
                  className="h-3.5 w-auto object-contain"
                />
              </Link>
            </div>

            <nav aria-label="Mobile Menu Links" className="space-y-4">
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="border-b border-[#252A32]/60 pb-3">
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-heading font-semibold text-2xl text-[#F5F3EE] hover:text-[#F06419] transition-colors py-1"
                >
                  {link.label}
                </Link>
              </div>
            ))}
            </nav>
          </div>

          <div className="pt-8 space-y-4">
            <BookCallButton
              variant="primary"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full h-12 rounded-[8px] bg-[#F06419] hover:bg-[#D95612] text-black font-mono font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Call ↗</span>
            </BookCallButton>
            <p className="text-center text-xs font-mono text-[#777D87]">
              ediyrex@gmail.com
            </p>
          </div>
        </div>
      )}
    </>
  );
}
