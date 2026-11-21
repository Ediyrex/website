"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import { STUDIO_DISCIPLINES } from "./about.data";

export function AboutHero() {
  return (
    <section
      aria-label="About Ediyrex Studio Manifesto"
      style={{ fontFamily: "var(--font-space-grotesk), system-ui, sans-serif" }}
      className="relative overflow-hidden border-b border-[#292E35] bg-[#0C0D0F] pb-12 pt-28 text-[#F5F2EC] sm:pb-14 sm:pt-32 lg:pt-36"
    >
      {/* Ambient Breathing Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 h-[600px] w-[600px] rounded-full bg-[#F06419]/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-1/3 h-[500px] w-[500px] rounded-full bg-[#F06419]/5 blur-[130px]"
      />

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 sm:px-8 lg:px-14">
        {/* Breadcrumb & Outlined Label */}
        <motion.nav
          aria-label="Breadcrumb"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8 flex items-center gap-1.5 font-mono text-xs text-[#898D94]"
        >
          <Link href="/" className="transition-colors hover:text-[#F06419]">
            Home
          </Link>
          <ChevronRight className="h-3 w-3 text-[#898D94]" aria-hidden="true" />
          <span className="font-medium text-[#F5F2EC]">About</span>
        </motion.nav>

        {/* Two-Column Editorial Split (52% / 48%) */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[52%_1px_1fr] lg:items-center lg:gap-12">
          {/* Left Manifesto Column */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <h1
              style={{ fontFamily: "var(--font-archivo-narrow), sans-serif" }}
              className="text-[clamp(2.75rem,5.2vw,5.25rem)] font-bold uppercase leading-[0.9] tracking-[-0.025em]"
            >
              <span className="block text-[#F5F2EC]">ONE INTEGRATED</span>
              <span className="block text-[#F5F2EC]">STUDIO.</span>
              <span className="mt-1 block italic text-[#F06419]">
                FOUR CONNECTED
              </span>
              <span className="block italic text-[#F06419]">DISCIPLINES.</span>
            </h1>

            <p className="max-w-[620px] text-[16px] leading-[1.6] text-[#B8B9BC] sm:text-[18px]">
              We bring creative direction, media production, digital engineering
              and intelligent systems together to build meaningful work for real
              businesses.
            </p>

            <div className="flex flex-col gap-3.5 pt-2 sm:flex-row sm:items-center">
              <Link
                href="/contact"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#F06419] px-7 text-sm font-semibold text-[#FFFFFF] shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-[#D95612] hover:shadow-[0_4px_20px_rgba(240,100,25,0.35)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0D0F]"
              >
                <span>Book a discovery call</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/work"
                className="inline-flex h-12 items-center justify-center rounded-xl border border-[#292E35] bg-transparent px-6 text-sm font-medium text-[#F5F2EC] transition-all duration-200 hover:border-[#F06419]/60 hover:bg-[#121519] hover:text-[#F06419] hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C0D0F]"
              >
                Explore our work
              </Link>
            </div>
          </motion.div>

          {/* Central Divider (Horizontal on mobile, 1px Vertical on desktop) */}
          <div className="h-px w-full bg-[#292E35] lg:h-full lg:w-px" />

          {/* Right Discipline Directory */}
          <motion.nav
            aria-label="Studio Disciplines"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
          >
            <ul className="divide-y divide-[#292E35] border-b border-[#292E35] lg:border-t lg:border-t-transparent">
              {STUDIO_DISCIPLINES.map((discipline, idx) => (
                <motion.li
                  key={discipline.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.45,
                    delay: 0.2 + idx * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  <Link
                    href={discipline.href}
                    className="group flex items-center justify-between gap-4 rounded-xl px-3 py-6 transition-all duration-200 hover:bg-[#121519]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F06419] sm:py-7"
                  >
                    <div className="flex min-w-0 items-center gap-5 sm:gap-7">
                      <span className="w-16 shrink-0 font-heading text-[48px] font-bold leading-none tracking-[-0.04em] tabular-nums text-[#F06419] transition-transform duration-200 group-hover:scale-105 group-hover:text-[#FF762F] sm:w-24 sm:text-[68px] lg:text-[76px]">
                        {discipline.number}
                      </span>
                      <div className="min-w-0 transition-transform duration-200 group-hover:translate-x-1">
                        <h2 className="text-[17px] font-bold uppercase leading-tight tracking-[-0.01em] text-[#F5F2EC] transition-colors duration-200 group-hover:text-[#F06419] sm:text-[22px]">
                          {discipline.title}
                        </h2>
                        <p className="mt-1 text-sm text-[#898D94] transition-colors duration-200 group-hover:text-[#B8B9BC] sm:text-[15px]">
                          {discipline.descriptor}
                        </p>
                      </div>
                    </div>

                    <ArrowUpRight
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-[#F06419] transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.nav>
        </div>
      </div>
    </section>
  );
}
