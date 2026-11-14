"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { STUDIO_DISCIPLINES } from "./about.data";

export function AboutHero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = sectionRef.current;
    if (!container || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const reveals = container.querySelectorAll("[data-about-reveal]");
      if (reveals.length > 0) {
        gsap.from(reveals, {
          opacity: 0,
          y: 16,
          duration: 0.55,
          stagger: 0.05,
          ease: "power3.out",
          clearProps: "opacity,transform",
        });
      }
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="About Ediyrex Studio Manifesto"
      style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
      className="border-b border-[#DED5CC] bg-[#FAF8F5] pb-12 pt-28 text-[#141414] sm:pb-14 sm:pt-32 lg:pt-36"
    >
      <div className="mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14">
        {/* Breadcrumb & Outlined Label */}
        <nav
          aria-label="Breadcrumb"
          data-about-reveal
          className="mb-8 flex items-center gap-1.5 font-mono text-xs text-[#77716A]"
        >
          <Link href="/" className="transition-colors hover:text-[#F06419]">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-[#77716A]" aria-hidden="true" />
          <span className="font-medium text-[#141414]">About</span>
        </nav>

        {/* Two-Column Editorial Split (52% / 48%) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[52%_1px_1fr] lg:items-center lg:gap-12">
          {/* Left Manifesto Column */}
          <div className="space-y-6">
            <h1
              data-about-reveal
              style={{ fontFamily: "var(--font-archivo-narrow), sans-serif" }}
              className="text-[clamp(2.75rem,5.2vw,5.25rem)] font-bold uppercase leading-[0.9] tracking-[-0.025em]"
            >
              <span className="block text-[#141414]">ONE INTEGRATED</span>
              <span className="block text-[#141414]">STUDIO.</span>
              <span className="mt-1 block italic text-[#F06419]">
                FOUR CONNECTED
              </span>
              <span className="block italic text-[#F06419]">DISCIPLINES.</span>
            </h1>

            <p
              data-about-reveal
              className="max-w-[620px] text-[16px] leading-[1.6] text-[#49433E] sm:text-[18px]"
            >
              We bring creative direction, media production, digital engineering
              and intelligent systems together to build meaningful work for real
              businesses.
            </p>

            <div
              data-about-reveal
              className="flex flex-col gap-3.5 pt-2 sm:flex-row sm:items-center"
            >
              <Link
                href="/contact"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-[#F06419] px-6 text-sm font-semibold text-[#FFFFFF] transition-colors duration-200 hover:bg-[#D95612] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F1EA]"
              >
                <span>Book a discovery call</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/work"
                className="inline-flex h-12 items-center justify-center rounded-[4px] border border-[#141414] bg-transparent px-6 text-sm font-medium text-[#141414] transition-colors duration-200 hover:bg-[#141414] hover:text-[#F6F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F1EA]"
              >
                Explore our work
              </Link>
            </div>
          </div>

          {/* Central Divider (Horizontal on mobile, 1px Vertical on desktop) */}
          <div className="h-px w-full bg-[#CFC5B9] lg:h-full lg:w-px" />

          {/* Right Discipline Directory */}
          <nav aria-label="Studio Disciplines">
            <ul className="divide-y divide-[#CFC5B9] border-b border-[#CFC5B9] lg:border-t lg:border-t-transparent">
              {STUDIO_DISCIPLINES.map((discipline) => (
                <li key={discipline.id} data-about-reveal>
                  <Link
                    href={discipline.href}
                    className="group flex items-center justify-between gap-4 py-6 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] sm:py-7"
                  >
                    <div className="flex min-w-0 items-center gap-5 sm:gap-7">
                      <span className="w-16 shrink-0 font-heading text-[48px] font-bold leading-none tracking-[-0.04em] tabular-nums text-[#F06419] sm:w-24 sm:text-[68px] lg:text-[76px]">
                        {discipline.number}
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-[17px] font-bold uppercase leading-tight tracking-[-0.01em] text-[#141414] transition-colors duration-200 group-hover:text-[#F06419] sm:text-[22px]">
                          {discipline.title}
                        </h2>
                        <p className="mt-1 text-sm text-[#77716A] transition-colors duration-200 group-hover:text-[#49433E] sm:text-[15px]">
                          {discipline.descriptor}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-[#F06419] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </section>
  );
}
