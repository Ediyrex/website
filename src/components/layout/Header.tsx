"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const DIVISION_LINKS = [
  {
    label: "Media",
    description: "Brand films, reels, photography & motion",
    href: "/services/media",
    accent: "#E58A76",
  },
  {
    label: "Digital",
    description: "Websites, SaaS products, UI/UX & platforms",
    href: "/services/digital",
    accent: "#7BA9F5",
  },
  {
    label: "AI",
    description: "AI agents, automation, voice & RAG systems",
    href: "/services/ai",
    accent: "#B5A0F5",
  },
];

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services", hasDropdown: true },
  { label: "Work", href: "/work" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const pathname = usePathname();

  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setServicesOpen(false);
        if (mobileMenuOpen) {
          setMobileMenuOpen(false);
          mobileTriggerRef.current?.focus();
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
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
          isScrolled
            ? "bg-[#08090B]/88 backdrop-blur-md border-b border-[#252A32]"
            : "bg-transparent border-b border-transparent"
        )}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="h-[68px] md:h-20 flex items-center justify-between gap-6">
            {/* Wordmark */}
            <Link
              href="/"
              className="flex items-center gap-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A] rounded-md px-1 -ml-1"
            >
              <span className="font-heading font-bold text-2xl tracking-tight text-[#F5F3EE]">
                Ediyrex
              </span>
              <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#D6B77A]" />
            </Link>

            {/* Desktop Navigation */}
            <nav
              aria-label="Primary Navigation"
              className="hidden md:flex items-center gap-7 lg:gap-9"
            >
              {NAV_LINKS.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                if (link.hasDropdown) {
                  return (
                    <div
                      key={link.href}
                      ref={dropdownRef}
                      className="relative flex items-center gap-1"
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "text-sm font-medium transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A] rounded",
                          isActive
                            ? "text-[#F5F3EE]"
                            : "text-[#B2B4BA] hover:text-[#F5F3EE]"
                        )}
                      >
                        {link.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setServicesOpen((prev) => !prev)}
                        aria-expanded={servicesOpen}
                        aria-controls="services-desktop-dropdown"
                        aria-label="Toggle Services divisions menu"
                        className="p-1 text-[#B2B4BA] hover:text-[#F5F3EE] rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A] cursor-pointer"
                      >
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-150",
                            servicesOpen && "rotate-180"
                          )}
                        />
                      </button>

                      {servicesOpen && (
                        <div
                          id="services-desktop-dropdown"
                          className="absolute top-full left-0 mt-2 w-72 rounded-2xl bg-[#12151A] border border-[#252A32] p-2 shadow-2xl"
                        >
                          <div className="px-3 py-2 border-b border-[#252A32] mb-1">
                            <Link
                              href="/services"
                              onClick={() => setServicesOpen(false)}
                              className="text-xs font-mono uppercase tracking-wider text-[#D6B77A] hover:text-[#E6CC99]"
                            >
                              All 3 Divisions &rarr;
                            </Link>
                          </div>
                          {DIVISION_LINKS.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setServicesOpen(false)}
                              className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#191D23] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A]"
                            >
                              <span
                                className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                                style={{ backgroundColor: item.accent }}
                              />
                              <div>
                                <div className="text-sm font-medium text-[#F5F3EE]">
                                  {item.label}
                                </div>
                                <div className="text-xs text-[#777D87]">
                                  {item.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-sm font-medium transition-colors py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A] rounded",
                      isActive
                        ? "text-[#F5F3EE]"
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
                <Button href="/contact" size="md" variant="primary">
                  Book a discovery call
                </Button>
              </div>

              <button
                ref={mobileTriggerRef}
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden w-11 h-11 flex items-center justify-center text-[#F5F3EE] rounded-lg border border-[#252A32] bg-[#12151A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A]"
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
          <nav aria-label="Mobile Menu Links" className="space-y-4">
            {NAV_LINKS.map((link) => (
              <div key={link.href} className="border-b border-[#252A32]/60 pb-3">
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block font-heading font-semibold text-2xl text-[#F5F3EE] hover:text-[#D6B77A] transition-colors py-1"
                >
                  {link.label}
                </Link>
                {link.hasDropdown && (
                  <div className="mt-2 pl-3 space-y-2">
                    {DIVISION_LINKS.map((div) => (
                      <Link
                        key={div.href}
                        href={div.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-2 text-sm text-[#B2B4BA] hover:text-[#F5F3EE] py-1"
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: div.accent }}
                        />
                        <span>{div.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="pt-8 space-y-4">
            <Button
              href="/contact"
              size="lg"
              variant="primary"
              className="w-full"
              onClick={() => setMobileMenuOpen(false)}
            >
              Book a discovery call
            </Button>
            <p className="text-center text-xs font-mono text-[#777D87]">
              hello@ediyrex.com
            </p>
          </div>
        </div>
      )}
    </>
  );
}
