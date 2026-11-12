"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArrowUpRight, Infinity as InfinityIcon, Layers, Users } from "lucide-react";

const HERO_DIVISIONS = [
  {
    number: "01",
    title: "BRANDING & MARKETING",
    description: "Brand identity, strategy, marketing and positioning.",
    href: "/services/branding",
  },
  {
    number: "02",
    title: "MEDIA & CONTENT PRODUCTION",
    description: "Content strategy, copywriting, video, photography and motion design.",
    href: "/services/media",
  },
  {
    number: "03",
    title: "WEB, APPS & DIGITAL PRODUCTS",
    description: "Websites, UI/UX, mobile apps, SaaS, custom CRM, ERP and AMC.",
    href: "/services/digital",
  },
  {
    number: "04",
    title: "AI & AUTOMATION",
    description: "AI agents, workflow automation, voice systems and integrations.",
    href: "/services/ai",
  },
] as const;

const APPROACH_PILLARS = [
  {
    title: "FOUR DIVISIONS",
    description: "Creative, digital and intelligent.",
    Icon: Layers,
  },
  {
    title: "ONE CONNECTED TEAM",
    description: "Strategy, design, media and tech.",
    Icon: Users,
  },
  {
    title: "END-TO-END SOLUTIONS",
    description: "From idea to real-world impact.",
    Icon: InfinityIcon,
  },
] as const;

export function ServicesHeroSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = sectionRef.current;
    if (!container || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const reveals = container.querySelectorAll("[data-sh-reveal]");
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
      aria-label="Ediyrex Capabilities Overview"
      className="relative overflow-hidden bg-[#F6F1EA] border-b border-[#DED5CC] pt-28 sm:pt-32 lg:pt-36 pb-10 sm:pb-12 text-[#141414]"
    >
      {/* Left edge diagonal orange stripe accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute left-0 top-[30%] h-24 w-5 opacity-80"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #FF640A 0px, #FF640A 4px, transparent 4px, transparent 10px)",
        }}
      />

      {/* Right edge diagonal orange stripe accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute right-0 bottom-10 h-20 w-5 opacity-80"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #FF640A 0px, #FF640A 4px, transparent 4px, transparent 10px)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        {/* Main 2-Column Editorial Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-6 space-y-6">
            <h1
              data-sh-reveal
              className="font-heading font-bold tracking-[-0.035em] text-[#141414] text-[clamp(2.45rem,4.6vw,4.25rem)] leading-[0.96]"
            >
              <span className="block">Everything your</span>
              <span className="block">business needs.</span>
              <span className="block italic text-[#FF640A] mt-1">
                Nothing working
              </span>
              <span className="relative inline-block italic text-[#FF640A]">
                in isolation.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 260 14"
                  fill="none"
                  className="pointer-events-none absolute left-0 -bottom-2.5 w-full h-3"
                >
                  <path
                    d="M 3 10 C 80 4, 175 3, 256 5"
                    stroke="#FF640A"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p
              data-sh-reveal
              className="max-w-[440px] pt-2 text-[15px] sm:text-[16px] leading-[1.58] text-[#45413E]"
            >
              We bring creative direction, digital engineering, media production
              and intelligent automation together to build solutions that work
              beyond the screen.
            </p>

            <div
              data-sh-reveal
              className="flex flex-wrap items-center gap-3.5 pt-1"
            >
              <Link
                href="/contact"
                className="group inline-flex h-12 items-center gap-2 rounded-[6px] bg-[#FF640A] px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-white transition-colors duration-200 hover:bg-[#E85704] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF640A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F1EA]"
              >
                <span>DISCUSS YOUR PROJECT</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/work"
                className="inline-flex h-12 items-center rounded-[6px] border border-[#141414] bg-transparent px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.12em] text-[#141414] transition-colors duration-200 hover:bg-[#141414] hover:text-[#F6F1EA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#141414] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F1EA]"
              >
                EXPLORE OUR WORK
              </Link>
            </div>
          </div>

          {/* Right Column: 01–04 Numbered Division Directory */}
          <div className="lg:col-span-6 lg:border-l lg:border-[#141414]/25 lg:pl-10">
            <div className="divide-y divide-[#141414]/20 border-b border-[#141414]/20">
              {HERO_DIVISIONS.map((item) => (
                <Link
                  key={item.number}
                  href={item.href}
                  data-sh-reveal
                  className="group flex items-center justify-between gap-4 py-4 sm:py-5 transition-colors hover:bg-[#EFE7DC]/55 px-2 -mx-2 rounded-[6px]"
                >
                  <div className="flex items-center gap-4 sm:gap-5 min-w-0">
                    <span className="font-heading italic font-bold text-[clamp(2.1rem,3.3vw,3rem)] leading-none tracking-[-0.04em] text-[#FF640A] shrink-0 w-12 sm:w-14">
                      {item.number}
                    </span>

                    <span
                      aria-hidden="true"
                      className="h-10 w-px bg-[#141414]/25 shrink-0"
                    />

                    <div className="min-w-0">
                      <div className="font-heading text-[16px] sm:text-[18px] font-bold uppercase tracking-[-0.015em] text-[#141414] group-hover:text-[#FF640A] transition-colors">
                        {item.title}
                      </div>
                      <p className="text-[12.5px] sm:text-[13px] text-[#5B554E] leading-[1.4] truncate">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <ArrowUpRight
                    className="h-5 w-5 shrink-0 text-[#141414] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#FF640A]"
                    aria-hidden="true"
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom "THE EDIYREX APPROACH" 4-Column Bar */}
        <div
          data-sh-reveal
          className="mt-12 lg:mt-14 border-t border-b border-[#141414]/25 py-5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[0.7fr_1fr_1fr_1fr] gap-6 items-center">
            <div className="font-heading text-[13px] font-bold uppercase leading-[1.2] tracking-[0.06em] text-[#141414]">
              THE
              <br />
              EDIYREX
              <br />
              APPROACH
            </div>

            {APPROACH_PILLARS.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="flex items-center gap-3.5 lg:border-l lg:border-[#141414]/20 lg:pl-6"
              >
                <Icon
                  className="h-6 w-6 shrink-0 text-[#141414] stroke-[1.5]"
                  aria-hidden="true"
                />
                <div>
                  <div className="font-heading text-[13px] font-bold uppercase tracking-[0.04em] text-[#141414]">
                    {title}
                  </div>
                  <div className="text-[12.5px] text-[#5B554E]">
                    {description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

