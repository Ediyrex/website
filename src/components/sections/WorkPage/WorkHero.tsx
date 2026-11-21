"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import type { ProjectItem } from "@/types";
import { enrichProjects, PUBLISHED_PROJECTS } from "./projects.data";

export function WorkHero({ projects }: { projects?: ProjectItem[] }) {
  const items = projects ? enrichProjects(projects) : PUBLISHED_PROJECTS;
  const collageItems = items.slice(0, 3);

  return (
    <section
      aria-label="Work Archive Hero"
      className="relative overflow-hidden border-b border-[#292E35] bg-[#0C0D0F] pb-14 pt-28 text-[#F5EFE5] sm:pb-16 sm:pt-32 lg:pt-36"
    >
      {/* Ambient Breathing Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[580px] w-[580px] rounded-full bg-[#F06419]/10 blur-[130px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/4 h-[450px] w-[450px] rounded-full bg-[#F06419]/5 blur-[120px]"
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Work & Case Studies" },
            ]}
          />
        </motion.div>

        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Typography Column */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6 lg:col-span-6"
          >
            <h1
              style={{ fontFamily: "var(--font-space-grotesk), sans-serif" }}
              className="text-[clamp(2.75rem,5.2vw,5rem)] font-bold leading-[0.95] tracking-[-0.03em] text-[#F5EFE5]"
            >
              Selected work &amp; studio{" "}
              <span className="italic text-[#F06419]">explorations.</span>
            </h1>

            <p className="max-w-[620px] text-[16px] leading-[1.6] text-[#A9A39A] sm:text-[18px]">
              An evolving collection of digital products, creative work and
              intelligent systems. Explore the challenges, thinking and
              execution behind what we build.
            </p>
          </motion.div>

          {/* Right Overlapping Project Preview Collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6"
          >
            <div className="relative mx-auto grid max-w-[580px] grid-cols-12 gap-3 sm:gap-4">
              {collageItems[0] && (
                <Link
                  href={`/work/${collageItems[0].slug}`}
                  className="group col-span-8 overflow-hidden rounded-xl border border-[#292E35] bg-[#14171C] shadow-2xl transition-all duration-300 hover:z-20 hover:-translate-y-2 hover:border-[#F06419] hover:shadow-[0_12px_40px_rgba(240,100,25,0.25)] lg:-rotate-2 lg:hover:rotate-0"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#08090B]">
                    <Image
                      src={collageItems[0].coverImage}
                      alt={collageItems[0].coverAlt || collageItems[0].title}
                      width={720}
                      height={450}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      priority
                    />
                  </div>
                </Link>
              )}

              {collageItems[1] && (
                <Link
                  href={`/work/${collageItems[1].slug}`}
                  className="group col-span-6 col-start-7 -mt-6 overflow-hidden rounded-xl border border-[#292E35] bg-[#14171C] shadow-2xl transition-all duration-300 hover:z-20 hover:-translate-y-2 hover:border-[#F06419] hover:shadow-[0_12px_40px_rgba(240,100,25,0.25)] sm:-mt-12 lg:rotate-2 lg:hover:rotate-0"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#08090B]">
                    <Image
                      src={collageItems[1].coverImage}
                      alt={collageItems[1].coverAlt || collageItems[1].title}
                      width={560}
                      height={350}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                </Link>
              )}

              {collageItems[2] && (
                <Link
                  href={`/work/${collageItems[2].slug}`}
                  className="group col-span-7 col-start-3 -mt-6 overflow-hidden rounded-xl border border-[#292E35] bg-[#14171C] shadow-2xl transition-all duration-300 hover:z-20 hover:-translate-y-2 hover:border-[#F06419] hover:shadow-[0_12px_40px_rgba(240,100,25,0.25)] sm:-mt-10 lg:-rotate-1 lg:hover:rotate-0"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#08090B]">
                    <Image
                      src={collageItems[2].coverImage}
                      alt={collageItems[2].coverAlt || collageItems[2].title}
                      width={640}
                      height={360}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </div>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
