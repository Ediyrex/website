"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

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
      "Ediyrex production clapperboard, cinema camera, and studio headphones in dramatic orange studio light",
    displayOrder: 4,
    isActive: true,
    isFeatured: true,
  },
];

export function ThreeDivisionsSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [divisions, setDivisions] =
    useState<ServiceDivisionCardData[]>(FALLBACK_DIVISIONS);
  const shouldReduceMotion = useReducedMotion();
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, amount: 0.05 });
  const gridInView = useInView(gridRef, { once: true, amount: 0.05 });
  const showHeader = Boolean(shouldReduceMotion) || headerInView;
  const showGrid = Boolean(shouldReduceMotion) || gridInView;

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

  return (
    <section
      id="divisions"
      className="w-full bg-[#F8F6F2] text-[#111315] py-14 md:py-16 lg:py-20 border-t border-[#111315]/10"
    >
      <div className="max-w-[1600px] mx-auto px-5 sm:px-8 lg:px-12 xl:px-16 space-y-10 lg:space-y-12">
        {/* Top Editorial Row */}
        <div ref={headerRef} className="space-y-6">
          <div className="flex items-center">
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.2em" }}
              animate={
                showHeader
                  ? { opacity: 1, letterSpacing: "0.12em" }
                  : { opacity: 0, letterSpacing: "0.2em" }
              }
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              style={{ fontFamily: "var(--font-space-mono)" }}
              className="text-[12px] font-semibold uppercase text-[#17191C]"
            >
              OUR SERVICES
            </motion.span>
          </div>

          {/* Main Header + Supporting Copy */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 lg:gap-10">
            <h2 className="m-0">
              <span className="block overflow-hidden pb-[0.08em] pr-[0.14em] pl-[0.04em] -ml-[0.04em]">
                <motion.span
                  initial={{ y: "100%", skewY: 2, opacity: 0 }}
                  animate={
                    showHeader
                      ? { y: "0%", skewY: 0, opacity: 1 }
                      : { y: "100%", skewY: 2, opacity: 0 }
                  }
                  transition={{
                    duration: 0.7,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ fontFamily: "var(--font-space-grotesk)" }}
                  className="block pr-[0.06em] font-bold text-[#111315] text-[38px] sm:text-[50px] md:text-[58px] lg:text-[64px] xl:text-[74px] leading-[0.94] tracking-[-0.065em]"
                >
                  Four connected divisions
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.1em] pr-[0.12em] pl-[0.04em] -ml-[0.04em] -mt-0.5 sm:-mt-1">
                <motion.span
                  initial={{
                    y: "100%",
                    opacity: 0,
                    filter: "blur(5px)",
                  }}
                  animate={
                    showHeader
                      ? {
                          y: "0%",
                          opacity: 1,
                          filter: "blur(0px)",
                        }
                      : {
                          y: "100%",
                          opacity: 0,
                          filter: "blur(5px)",
                        }
                  }
                  transition={{
                    duration: 0.75,
                    delay: 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{ fontFamily: "var(--font-instrument-serif)" }}
                  className="block pr-[0.06em] font-normal italic text-[#77777A] text-[42px] sm:text-[56px] md:text-[64px] lg:text-[72px] xl:text-[84px] leading-[0.96] tracking-[-0.045em]"
                >
                  inside one studio.
                </motion.span>
              </span>
            </h2>

            <div className="relative pl-4 max-w-[440px]">
              <motion.span
                aria-hidden="true"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={
                  showHeader
                    ? { scaleY: 1, opacity: 1 }
                    : { scaleY: 0, opacity: 0 }
                }
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute left-0 top-0.5 bottom-0.5 w-px bg-[#111315]/25 origin-top"
              />
              <motion.p
                initial={{ opacity: 0, x: -10, filter: "blur(4px)" }}
                animate={
                  showHeader
                    ? { opacity: 1, x: 0, filter: "blur(0px)" }
                    : { opacity: 0, x: -10, filter: "blur(4px)" }
                }
                transition={{
                  duration: 0.65,
                  delay: 0.24,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="text-[15px] sm:text-[16px] font-normal text-[#35383C] leading-[1.5]"
              >
                Branding &amp; Marketing builds demand. Media crafts visual
                authority. Web Dev engineers high-converting software. Agents
                &amp; Automation scales operations.
              </motion.p>
            </div>
          </div>
        </div>

        {/* Four Connected Service Division Cards */}
        <div
          ref={gridRef}
          onMouseLeave={() => setHoveredId(null)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5 xl:gap-4 items-stretch"
        >
          {divisions.map((division, idx) => {
            const isDimmed = hoveredId !== null && hoveredId !== division.id;

            return (
              <motion.article
                key={division.id}
                onMouseEnter={() => setHoveredId(division.id)}
                initial={{ opacity: 0, y: 26, scale: 0.985 }}
                animate={
                  showGrid
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: 0, y: 26, scale: 0.985 }
                }
                transition={{
                  duration: 0.6,
                  delay: idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`division-card group relative rounded-[18px] bg-[#151515] border border-[#303030] hover:border-[#525252] hover:-translate-y-[3px] transition-all duration-300 overflow-hidden flex flex-col text-[#F5F4F0] ${
                  isDimmed ? "lg:opacity-75" : "opacity-100"
                }`}
              >
                <Link
                  href={division.destinationUrl || `/services/${division.slug}`}
                  className="flex flex-col flex-1 h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0D10] focus-visible:ring-inset rounded-[18px]"
                >
                  {/* 16:9 Cinematic Photograph Thumbnail */}
                  <div className="relative aspect-video w-full overflow-hidden bg-[#0E0E0E]">
                    <Image
                      src={
                        division.coverImageUrl || "/images/services/branding.jpg"
                      }
                      alt={division.coverAlt || division.name}
                      fill
                      sizes="(min-width: 1024px) 24vw, (min-width: 768px) 48vw, 100vw"
                      className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    />
                    <div
                      aria-hidden="true"
                      className="absolute inset-0 bg-gradient-to-t from-[#151515]/85 via-transparent to-black/35 pointer-events-none transition-opacity duration-300 group-hover:opacity-80"
                    />
                    <span
                      style={{ fontFamily: "var(--font-space-mono)" }}
                      className="absolute top-3.5 left-4 text-[14px] font-medium tracking-[0.06em] text-[#F5F4F0]/85 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:text-white"
                    >
                      {division.displayNumber}
                    </span>
                  </div>

                  {/* Card Editorial Surface */}
                  <div className="flex-1 p-6 xl:p-7 flex flex-col justify-between gap-6">
                    <div>
                      <span
                        style={{ fontFamily: "var(--font-space-mono)" }}
                        className="block text-[12px] font-medium uppercase tracking-[0.12em] text-[#A9A9A9] transition-colors duration-300 group-hover:text-[#D5D4D0]"
                      >
                        {division.name}
                      </span>

                      <h3 className="mt-2.5 leading-[1.02] transition-transform duration-300 ease-out group-hover:translate-x-0.5">
                        <span
                          style={{ fontFamily: "var(--font-space-grotesk)" }}
                          className="font-bold text-[#F5F4F0] text-[28px] sm:text-[30px] md:text-[31px] lg:text-[26px] xl:text-[34px] leading-[1.02] tracking-[-0.04em]"
                        >
                          {division.heading}
                        </span>
                        {division.italicHeading && (
                          <>
                            {" "}
                            <span
                              style={{
                                fontFamily: "var(--font-instrument-serif)",
                              }}
                              className={`inline-block font-normal italic text-[#F5F4F0]/90 text-[30px] sm:text-[32px] md:text-[33px] lg:text-[28px] xl:text-[38px] leading-[1.02] tracking-[-0.02em] transition-colors duration-300 group-hover:text-white ${
                                division.italicHeading.length <= 16
                                  ? "whitespace-nowrap"
                                  : ""
                              }`}
                            >
                              {division.italicHeading}
                            </span>
                          </>
                        )}
                      </h3>

                      <p className="mt-3 text-[15px] text-[#A9A9A9] leading-[1.5] transition-colors duration-300 group-hover:text-[#C4C4C4]">
                        {division.description}
                      </p>

                      {division.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-[6px]">
                          {division.tags.map((tag) => (
                            <span
                              key={tag}
                              style={{ fontFamily: "var(--font-space-mono)" }}
                              className="inline-block border border-[#3A3A3A] group-hover:border-[#555555] bg-transparent text-[#E6E5E0] text-[10px] uppercase tracking-[0.06em] px-[9px] py-[5px] rounded-[3px] leading-none transition-colors duration-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Exploration Row + Circular Arrow */}
                    <div className="pt-2 flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#F5F4F0] relative pb-0.5 after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-[#F5F4F0] after:scale-x-0 after:origin-left after:transition-transform after:duration-300 group-hover:after:scale-x-100">
                        <span>{division.ctaLabel}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </span>

                      <span
                        aria-hidden="true"
                        className="w-[46px] h-[46px] rounded-full border border-white/75 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:translate-x-[3px] group-hover:-translate-y-[3px] group-hover:bg-[#F5F4F0] group-hover:border-[#F5F4F0]"
                      >
                        <ArrowUpRight className="w-4 h-4 text-[#F5F4F0] transition-colors duration-300 group-hover:text-[#151515]" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
