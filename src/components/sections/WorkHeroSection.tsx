"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import { PROJECTS_DATA } from "@/features/work/data";

export function WorkHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const publishedCount = String(
    PROJECTS_DATA.filter((p) => p.isPublished).length,
  ).padStart(2, "0");

  useEffect(() => {
    const container = sectionRef.current;
    if (!container || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const reveals = container.querySelectorAll("[data-wh-reveal]");
      if (reveals.length > 0) {
        gsap.from(reveals, {
          opacity: 0,
          y: 18,
          duration: 0.6,
          stagger: 0.06,
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
      aria-label="Work and Case Studies Overview"
      className="relative overflow-hidden border-b border-[#DED5CC] bg-[#F6F1EA] pb-12 pt-28 text-[#141414] sm:pb-16 sm:pt-32 lg:pt-36"
    >
      {/* Left edge diagonal orange stripe accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-[30%] hidden h-24 w-5 opacity-80 lg:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #FF640A 0px, #FF640A 4px, transparent 4px, transparent 10px)",
        }}
      />

      {/* Right edge diagonal orange stripe accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 right-0 hidden h-20 w-5 opacity-80 lg:block"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #FF640A 0px, #FF640A 4px, transparent 4px, transparent 10px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column */}
          <div className="space-y-6 lg:col-span-7">
            <p
              data-wh-reveal
              className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#F06419]"
            >
              WORK / CASE STUDIES &amp; STUDIO BLUEPRINTS
            </p>

            <h1
              data-wh-reveal
              style={{ fontFamily: "var(--font-archivo-narrow), sans-serif" }}
              className="text-[clamp(2.85rem,5.4vw,5.1rem)] font-bold uppercase leading-[0.88] tracking-[-0.025em] text-[#141414]"
            >
              <span className="block">Selected Work &amp;</span>
              <span className="mt-1 block italic text-[#FF640A]">
                Studio Explorations.
              </span>
            </h1>

            <p
              data-wh-reveal
              className="max-w-[600px] text-[15.5px] leading-[1.6] text-[#49433E] sm:text-[17px]"
            >
              Every case study breaks down the architectural challenge,
              execution approach, and tangible deliverables. Independent R&amp;D
              explorations are explicitly labeled as{" "}
              <span className="font-semibold text-[#141414]">
                Concept Project
              </span>{" "}
              for complete transparency.
            </p>

            <div data-wh-reveal className="flex flex-wrap items-center gap-3.5 pt-1">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-[4px] bg-[#FF640A] px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#FFFFFF] transition-colors hover:bg-[#E55400]"
              >
                <span>Start a Project</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>

              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-[4px] border border-[#141414] bg-transparent px-5 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#141414] transition-colors hover:bg-[#141414] hover:text-[#F6F1EA]"
              >
                Explore Services
              </Link>
            </div>
          </div>

          {/* Right Column — Editorial Index Summary */}
          <div
            data-wh-reveal
            className="lg:col-span-5 lg:border-l lg:border-[#DED5CC] lg:pl-10"
          >
            <div className="divide-y divide-[#DED5CC] border-b border-t border-[#DED5CC]">
              <div className="flex items-baseline justify-between py-4">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#77716A]">
                  Published Index
                </span>
                <span className="font-heading text-2xl font-bold text-[#141414]">
                  {publishedCount} Projects
                </span>
              </div>
              <div className="flex items-baseline justify-between py-4">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#77716A]">
                  Disciplines
                </span>
                <span className="text-sm font-semibold text-[#141414]">
                  Branding · Media · Digital · AI
                </span>
              </div>
              <div className="flex items-baseline justify-between py-4">
                <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#77716A]">
                  Transparency
                </span>
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.1em] text-[#F06419]">
                  Concept Work Labeled
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

