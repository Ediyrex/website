"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";

export function WorkCTA() {
  return (
    <section
      aria-label="Start a project"
      className="relative overflow-hidden border-t border-[#CFC5B9] bg-[#F5EFE5] py-12 text-[#171717] sm:py-16"
    >
      {/* Orange geometric corner accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-20 bg-[#F06419] sm:block opacity-90 transition-opacity hover:opacity-100"
        style={{ clipPath: "polygon(65% 0, 100% 0, 100% 100%, 0% 100%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 items-center gap-6 lg:grid-cols-12"
        >
          <div className="lg:col-span-5">
            <h2 className="font-heading text-3xl font-bold leading-tight tracking-tight text-[#171717] sm:text-4xl">
              Have a project in mind?
            </h2>
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-[#CFC5B9] lg:pl-8">
            <p className="text-base leading-relaxed text-[#49433E]">
              Let&apos;s turn your idea into a real, well-executed outcome.
            </p>
          </div>

          <div className="lg:col-span-3 lg:flex lg:justify-end lg:pr-12">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#F06419] px-7 py-3.5 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#FFFFFF] shadow-sm transition-all duration-200 hover:scale-[1.02] hover:bg-[#D95612] hover:shadow-[0_4px_20px_rgba(240,100,25,0.35)] active:scale-[0.98]"
            >
              <span>Start a Project</span>
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1 group-hover:-translate-y-1" aria-hidden="true" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
