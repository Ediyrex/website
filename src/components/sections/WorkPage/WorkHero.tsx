"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { AlertCircle } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { ProjectItem } from "@/types";
import { enrichProjects, PUBLISHED_PROJECTS } from "./projects.data";

export function WorkHero({ projects }: { projects?: ProjectItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const items = projects ? enrichProjects(projects) : PUBLISHED_PROJECTS;
  const collageItems = items.slice(0, 3);

  useEffect(() => {
    const container = sectionRef.current;
    if (!container || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const reveals = container.querySelectorAll("[data-work-hero]");
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
      aria-label="Work Archive Hero"
      className="relative overflow-hidden border-b border-[#292E35] bg-[#0C0D0F] pb-14 pt-28 text-[#F5EFE5] sm:pb-16 sm:pt-32 lg:pt-36"
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <div data-work-hero className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Work & Case Studies" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Typography Column */}
          <div className="space-y-6 lg:col-span-6">
            <div data-work-hero className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-full border border-[#F06419]/60 bg-[#F06419]/10 px-3.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#F06419]">
                PORTFOLIO &amp; CASE STUDIES
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D9B875]/45 bg-[#14171C] px-3.5 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.14em] text-[#D9B875]">
                <AlertCircle className="h-3 w-3" aria-hidden="true" />
                CONCEPT WORK CLEARLY LABELED
              </span>
            </div>

            <h1
              data-work-hero
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              className="text-[clamp(2.75rem,5.2vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[#F5EFE5]"
            >
              Selected work &amp; studio{" "}
              <span className="italic text-[#F06419]">explorations.</span>
            </h1>

            <p
              data-work-hero
              className="max-w-[620px] text-[16px] leading-[1.6] text-[#A9A39A] sm:text-[18px]"
            >
              An evolving collection of digital products, creative work and
              intelligent systems. Explore the challenges, thinking and
              execution behind what we build.
            </p>
          </div>

          {/* Right Overlapping Project Preview Collage */}
          <div data-work-hero className="lg:col-span-6">
            <div className="relative mx-auto grid max-w-[580px] grid-cols-12 gap-3 sm:gap-4">
              {collageItems[0] && (
                <Link
                  href={`/work/${collageItems[0].slug}`}
                  className="group col-span-8 overflow-hidden rounded-lg border border-[#292E35] bg-[#14171C] shadow-2xl transition-transform duration-300 hover:z-20 hover:border-[#F06419]/70 lg:-rotate-2 lg:hover:rotate-0"
                >
                  <div className="relative aspect-[16/10] w-full bg-[#08090B]">
                    <Image
                      src={collageItems[0].coverImage}
                      alt={collageItems[0].coverAlt || collageItems[0].title}
                      width={720}
                      height={450}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      priority
                    />
                  </div>
                </Link>
              )}

              {collageItems[1] && (
                <Link
                  href={`/work/${collageItems[1].slug}`}
                  className="group col-span-6 col-start-7 -mt-6 overflow-hidden rounded-lg border border-[#292E35] bg-[#14171C] shadow-2xl transition-transform duration-300 hover:z-20 hover:border-[#F06419]/70 sm:-mt-12 lg:rotate-2 lg:hover:rotate-0"
                >
                  <div className="relative aspect-[16/10] w-full bg-[#08090B]">
                    <Image
                      src={collageItems[1].coverImage}
                      alt={collageItems[1].coverAlt || collageItems[1].title}
                      width={560}
                      height={350}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                </Link>
              )}

              {collageItems[2] && (
                <Link
                  href={`/work/${collageItems[2].slug}`}
                  className="group col-span-7 col-start-3 -mt-6 overflow-hidden rounded-lg border border-[#292E35] bg-[#14171C] shadow-2xl transition-transform duration-300 hover:z-20 hover:border-[#F06419]/70 sm:-mt-10 lg:-rotate-1 lg:hover:rotate-0"
                >
                  <div className="relative aspect-[16/9] w-full bg-[#08090B]">
                    <Image
                      src={collageItems[2].coverImage}
                      alt={collageItems[2].coverAlt || collageItems[2].title}
                      width={640}
                      height={360}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
