"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";

export interface ServiceDivisionCardData {
  id: string;
  displayNumber: string;
  name: string;
  slug: string;
  heading: string;
  italicHeading: string;
  description: string;
  tags: string[];
  ctaLabel: string;
  destinationUrl: string;
  coverImageUrl: string;
  coverAlt: string;
  displayOrder: number;
  isActive: boolean;
  isFeatured: boolean;
}

const FALLBACK_DIVISIONS: ServiceDivisionCardData[] = [
  {
    id: "branding",
    displayNumber: "01",
    name: "Branding & Marketing",
    slug: "branding",
    heading: "Build brands that",
    italicHeading: "last.",
    description:
      "Strategic branding, growth marketing and campaigns that create real demand.",
    tags: ["BRAND IDENTITY", "GROWTH", "SEO", "CAMPAIGNS", "PACKAGING"],
    ctaLabel: "Explore Branding",
    destinationUrl: "/services/branding",
    coverImageUrl: "/images/services/branding.jpg",
    coverAlt:
      "Cinema camera lens with warm orange reflections in a dark studio representing Branding and Marketing",
    displayOrder: 1,
    isActive: true,
    isFeatured: true,
  },
  {
    id: "digital",
    displayNumber: "02",
    name: "Web Development",
    slug: "digital",
    heading: "Digital products with",
    italicHeading: "intent.",
    description:
      "High-performance websites, SaaS platforms and digital experiences built for scale.",
    tags: ["WEBSITES", "SAAS", "DASHBOARDS", "UI / UX", "INTEGRATIONS"],
    ctaLabel: "Explore Web Dev",
    destinationUrl: "/services/digital",
    coverImageUrl: "/images/services/web-dev.jpg",
    coverAlt:
      "Minimalist dark laptop showing software engineering environment on textured rock representing Web Development",
    displayOrder: 2,
    isActive: true,
    isFeatured: true,
  },
  {
    id: "ai",
    displayNumber: "03",
    name: "Agents & Automation",
    slug: "ai",
    heading: "Intelligence",
    italicHeading: "into action.",
    description:
      "AI agents, conversational systems and workflow automation that get things done.",
    tags: ["AI AGENTS", "CHATBOTS", "AUTOMATION", "INTEGRATIONS", "WORKFLOW"],
    ctaLabel: "Explore Automation",
    destinationUrl: "/services/ai",
    coverImageUrl: "/images/services/automation.jpg",
    coverAlt:
      "Translucent computational glass core with connected AI workflow nodes representing Agents and Automation",
    displayOrder: 3,
    isActive: true,
    isFeatured: true,
  },
  {
    id: "media",
    displayNumber: "04",
    name: "Media",
    slug: "media",
    heading: "Stories worth",
    italicHeading: "seeing.",
    description:
      "End-to-end media production, from concept to cinematic content that engages and inspires.",
    tags: ["VIDEO PRODUCTION", "MOTION GRAPHICS", "PHOTOGRAPHY", "EDITING"],
    ctaLabel: "Explore Media",
    destinationUrl: "/services/media",
    coverImageUrl: "/images/services/media.jpg",
    coverAlt:
      "Edyrex production clapperboard, cinema camera, and studio headphones in dramatic orange studio light",
    displayOrder: 4,
    isActive: true,
    isFeatured: true,
  },
];

export function ThreeDivisionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [divisions, setDivisions] =
    useState<ServiceDivisionCardData[]>(FALLBACK_DIVISIONS);

  useEffect(() => {
    let ignore = false;
    fetch("/api/v1/services/divisions")
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (
          !ignore &&
          Array.isArray(json?.data) &&
          json.data.length > 0
        ) {
          setDivisions(json.data as ServiceDivisionCardData[]);
        }
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = containerRef.current?.querySelectorAll(".division-card");
      if (!cards?.length) return;

      gsap.from(cards, {
        y: 22,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 84%",
          once: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="divisions"
      className="w-full bg-[#F8F6F2] text-[#111315] py-14 md:py-16 lg:py-20 border-t border-[#111315]/10"
    >
      <div
        ref={containerRef}
        className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 space-y-10 lg:space-y-12"
      >
        {/* Top Editorial Row */}
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                aria-hidden="true"
                className="w-7 h-px bg-[#17191C] shrink-0"
              />
              <span
                style={{ fontFamily: "var(--font-space-mono)" }}
                className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#17191C]"
              >
                OUR SERVICES
              </span>
            </div>

            <span
              style={{ fontFamily: "var(--font-space-grotesk)" }}
              className="text-sm sm:text-base font-bold tracking-tight text-[#17191C]"
            >
              EDIYREX<sup className="text-[9px] font-medium ml-0.5">®</sup>
            </span>
          </div>

          {/* Main Header + Supporting Copy + Studio Keywords */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-10">
            <h2 className="m-0">
              <span
                style={{ fontFamily: "var(--font-space-grotesk)" }}
                className="block font-bold text-[#111315] text-[38px] sm:text-[50px] md:text-[58px] lg:text-[64px] xl:text-[74px] leading-[0.92] tracking-[-0.065em]"
              >
                Four connected divisions
              </span>
              <span
                style={{ fontFamily: "var(--font-instrument-serif)" }}
                className="block font-normal italic text-[#77777A] text-[42px] sm:text-[56px] md:text-[64px] lg:text-[72px] xl:text-[84px] leading-[0.95] tracking-[-0.045em] -mt-0.5 sm:-mt-1"
              >
                inside one studio.
              </span>
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:gap-8">
              <div className="border-l border-[#111315]/25 pl-4 max-w-[420px]">
                <p className="text-[15px] sm:text-[16px] font-normal text-[#35383C] leading-[1.5]">
                  Branding &amp; Marketing builds demand. Media crafts visual
                  authority. Web Dev engineers high-converting software. Agents
                  &amp; Automation scales operations.
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-5 shrink-0">
                <span aria-hidden="true" className="w-8 h-px bg-[#17191C]/40" />
                <ul
                  aria-hidden="true"
                  style={{ fontFamily: "var(--font-space-mono)" }}
                  className="text-[11px] font-semibold leading-[1.8] tracking-[0.12em] text-[#17191C] uppercase list-none m-0 p-0"
                >
                  <li>CREATIVE</li>
                  <li>TECHNOLOGY</li>
                  <li>AUTOMATION</li>
                  <li>GROWTH</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Four Connected Service Division Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 xl:gap-4 items-stretch">
          {divisions.map((division) => (
            <article
              key={division.id}
              className="division-card group relative rounded-[18px] bg-[#151515] border border-[#303030] hover:border-[#4D4D4D] hover:-translate-y-[3px] transition-all duration-300 overflow-hidden flex flex-col text-[#F5F4F0]"
            >
              <Link
                href={division.destinationUrl || `/services/${division.slug}`}
                className="flex flex-col flex-1 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0D10] focus-visible:ring-inset rounded-[18px]"
              >
              {/* 16:9 Cinematic Photograph Thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-[#0E0E0E]">
                <Image
                  src={division.coverImageUrl || "/images/services/branding.jpg"}
                  alt={division.coverAlt || division.name}
                  fill
                  sizes="(min-width: 1024px) 24vw, (min-width: 768px) 48vw, 100vw"
                  className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-[#151515]/85 via-transparent to-black/35 pointer-events-none"
                />
                <span
                  style={{ fontFamily: "var(--font-space-mono)" }}
                  className="absolute top-3.5 left-4 text-[14px] font-medium tracking-[0.06em] text-[#F5F4F0]/85"
                >
                  {division.displayNumber}
                </span>
              </div>

              {/* Card Editorial Surface */}
              <div className="flex-1 p-6 xl:p-7 flex flex-col justify-between gap-6">
                <div>
                  <span
                    style={{ fontFamily: "var(--font-space-mono)" }}
                    className="block text-[12px] font-medium uppercase tracking-[0.12em] text-[#A9A9A9]"
                  >
                    {division.name}
                  </span>

                  <h3 className="mt-2.5 leading-[0.98]">
                    <span
                      style={{ fontFamily: "var(--font-space-grotesk)" }}
                      className="block font-bold text-[#F5F4F0] text-[30px] md:text-[32px] lg:text-[28px] xl:text-[38px] leading-[0.98] tracking-[-0.04em]"
                    >
                      {division.heading}
                    </span>
                    {division.italicHeading && (
                      <span
                        style={{ fontFamily: "var(--font-instrument-serif)" }}
                        className="block font-normal italic text-[#F5F4F0] text-[32px] md:text-[34px] lg:text-[30px] xl:text-[42px] leading-[1.02] tracking-[-0.02em]"
                      >
                        {division.italicHeading}
                      </span>
                    )}
                  </h3>

                  <p className="mt-3 text-[15px] text-[#A9A9A9] leading-[1.5]">
                    {division.description}
                  </p>

                  {division.tags.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-[6px]">
                      {division.tags.map((tag) => (
                        <span
                          key={tag}
                          style={{ fontFamily: "var(--font-space-mono)" }}
                          className="inline-block border border-[#3A3A3A] bg-transparent text-[#E6E5E0] text-[10px] uppercase tracking-[0.06em] px-[9px] py-[5px] rounded-[3px] leading-none"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Exploration Row + Circular Arrow */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#F5F4F0]">
                    <span>{division.ctaLabel}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>

                  <span
                    aria-hidden="true"
                    className="w-[46px] h-[46px] rounded-full border border-white/75 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:border-white"
                  >
                    <ArrowUpRight className="w-4 h-4 text-[#F5F4F0]" />
                  </span>
                </div>
              </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
