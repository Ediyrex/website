"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

interface NextDirection {
  number: string;
  kicker: string;
  title: string;
  description: string;
  badge: string;
  href: string;
}

const NEXT_DIRECTIONS: readonly NextDirection[] = [
  {
    number: "01",
    kicker: "THE CAPABILITIES",
    title: "Explore our Services Directory",
    description:
      "Explore our four divisions and the capabilities available across branding, media, digital products and AI.",
    badge: "35+ CAPABILITIES / 04 DIVISIONS",
    href: "/services",
  },
  {
    number: "02",
    kicker: "THE EVIDENCE",
    title: "Explore our Work Archive",
    description:
      "Inspect published case studies, actual project deliverables, technical explorations and clearly labelled concepts.",
    badge: "CASE STUDIES / STUDIO R&D",
    href: "/work",
  },
];

export function AboutNextStep() {
  return (
    <section
      id="next-step"
      aria-label="05 / Where To Go Next"
      className="w-full bg-[#FAF8F5] text-[#0B0D10] py-16 sm:py-20 lg:py-24 border-b border-[#EAE5DC]"
    >
      <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8 lg:space-y-10">
        {/* Main Content: 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-0 items-start">
          {/* Left Column: Headline & Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:pr-10 xl:pr-14 lg:border-r lg:border-[#EAE5DC] space-y-6"
          >
            <div>
              <h2 className="font-heading font-extrabold text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[0.98] tracking-[-0.035em] text-[#0B0D10]">
                Choose your
                <br />
                next direction.
              </h2>
              <p className="text-[#FF6900] italic font-heading font-extrabold text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[0.98] tracking-[-0.035em] mt-2 mb-6">
                See what we do.
                <br />
                See what we build.
              </p>
              <p className="text-[15px] sm:text-[16px] text-[#555962] leading-relaxed max-w-md">
                Explore the capabilities behind the studio or discover the projects, systems and
                experiments that bring our approach to life.
              </p>
            </div>
          </motion.div>

          {/* Right Column: 2 Stacked Directions */}
          <div className="lg:col-span-7 lg:pl-10 xl:pl-14 divide-y divide-[#EAE5DC]">
            {NEXT_DIRECTIONS.map((direction, idx) => (
              <motion.div
                key={direction.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  duration: 0.45,
                  delay: idx * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  href={direction.href}
                  className="group py-8 first:pt-0 flex items-start justify-between gap-6 transition-all duration-300 hover:bg-[#FFFFFF] hover:-translate-y-1 hover:shadow-md px-4 sm:px-6 rounded-2xl block"
                >
                  {/* Number */}
                  <span className="font-heading font-extrabold text-4xl sm:text-5xl text-[#FF6900] leading-none shrink-0 w-16 pt-1 transition-transform duration-200 group-hover:scale-105 group-hover:text-[#FF762F]">
                    {direction.number}
                  </span>

                  {/* Content Block */}
                  <div className="flex-1 min-w-0 space-y-2">
                    <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#9E7B35] block">
                      {direction.kicker}
                    </span>
                    <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B0D10] tracking-tight group-hover:text-black transition-colors">
                      {direction.title}
                    </h3>
                    <p className="text-xs sm:text-[13.5px] text-[#555962] leading-relaxed max-w-lg">
                      {direction.description}
                    </p>
                    <div className="pt-2">
                      <span className="inline-flex items-center px-3.5 py-1 rounded-full border border-[#D9D2C8] bg-[#F5F1EB] text-[#555962] text-[10px] sm:text-[11px] font-mono font-bold uppercase tracking-wider transition-colors group-hover:border-[#FF6900]/50 group-hover:text-[#FF6900]">
                        {direction.badge}
                      </span>
                    </div>
                  </div>

                  {/* Arrow */}
                  <ArrowUpRight className="w-6 h-6 sm:w-7 sm:h-7 text-[#FF6900] shrink-0 pt-1 transition-transform duration-200 group-hover:translate-x-1.5 group-hover:-translate-y-1.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom Subline Bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-20px" }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="pt-8 border-t border-[#EAE5DC] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <span className="font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] text-[#777D87]">
            BUILT WITH INTENT. CONNECTED BY DESIGN.
          </span>

          <div className="flex items-center gap-4">
            <span
              aria-hidden="true"
              className="hidden sm:inline-block w-px h-5 bg-[#EAE5DC]"
            />
            <Link
              href="/contact"
              className="group inline-flex items-center gap-1.5 font-mono text-xs sm:text-[13px] font-bold uppercase tracking-[0.18em] text-[#FF6900] hover:text-[#E55E00] transition-colors"
            >
              <span>START A PROJECT</span>
              <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
