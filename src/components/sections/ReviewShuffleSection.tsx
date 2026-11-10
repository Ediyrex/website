"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Shuffle } from "lucide-react";

const STUDIO_NOTES = [
  {
    id: "note-1",
    tag: "Principle 01 · Transparency",
    accent: "#D6B77A",
    quote:
      "Every self-initiated prototype or concept blueprint is explicitly labeled as concept work. We never fabricate client logos, testimonials, or inflated numbers.",
    author: "Ediyrex Editorial Standard",
    role: "Portfolio & Case Study Policy",
  },
  {
    id: "note-2",
    tag: "Principle 02 · Integration",
    accent: "#E58A76",
    quote:
      "Your launch film, web storefront, and AI customer support pipeline are designed by one connected team so tone, typography, and conversion goals align.",
    author: "Cross-Discipline Workflow",
    role: "Media × Digital × AI",
  },
  {
    id: "note-3",
    tag: "Principle 03 · Ownership",
    accent: "#7BA9F5",
    quote:
      "Clean Next.js, TypeScript, and PostgreSQL architectures are documented and delivered without proprietary template lock-in.",
    author: "Engineering Handover",
    role: "Maintainable Codebase Standard",
  },
  {
    id: "note-4",
    tag: "Principle 04 · Practical AI",
    accent: "#B5A0F5",
    quote:
      "We deploy AI agents, voice receptionists, and RAG systems only where they measurably remove manual bottlenecks—backed by audit trails and human guardrails.",
    author: "Applied Intelligence",
    role: "Automation Engineering",
  },
];

export function ReviewShuffleSection() {
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % STUDIO_NOTES.length);
  };

  const activeNote = STUDIO_NOTES[index];

  return (
    <section
      aria-label="Studio Standards Shuffle Deck"
      className="py-16 md:py-24 bg-[#0D0F12] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-5 space-y-5">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
              Standards &amp; Collaboration
            </span>
            <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15]">
              How we uphold craft before client testimonials go live.
            </h2>
            <p className="text-sm text-[#B2B4BA] leading-relaxed">
              Verified client testimonials will appear here once published with permission. Until then, shuffle through the studio principles that govern every engagement.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex items-center gap-2 h-11 px-5 rounded-[8px] bg-[#12151A] border border-[#3A414B] hover:border-[#D6B77A] text-sm font-medium text-[#F5F3EE] transition-colors cursor-pointer"
              >
                <Shuffle className="w-4 h-4 text-[#D6B77A]" />
                <span>Shuffle card ({index + 1}/{STUDIO_NOTES.length})</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 relative min-h-[250px] flex items-center">
            <div
              aria-hidden="true"
              className="hidden sm:block absolute inset-x-4 top-4 bottom-0 rounded-2xl bg-[#08090B] border border-[#252A32] translate-y-3 opacity-60"
            />
            <div
              aria-hidden="true"
              className="hidden sm:block absolute inset-x-2 top-2 bottom-0 rounded-2xl bg-[#12151A] border border-[#252A32] translate-y-1.5 opacity-80"
            />

            <AnimatePresence mode="wait">
              <motion.div
                key={activeNote.id}
                initial={{ opacity: 0, x: 24, rotate: 1 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: -24, rotate: -1 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                onClick={handleNext}
                className="relative z-10 w-full rounded-2xl bg-[#12151A] border border-[#3A414B] p-7 sm:p-9 space-y-6 cursor-pointer hover:border-[#D6B77A]/70 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-mono uppercase tracking-wider"
                    style={{ color: activeNote.accent }}
                  >
                    {activeNote.tag}
                  </span>
                  <ArrowRight className="w-4 h-4 text-[#777D87]" />
                </div>

                <blockquote className="font-heading text-lg sm:text-xl text-[#F5F3EE] leading-relaxed">
                  &ldquo;{activeNote.quote}&rdquo;
                </blockquote>

                <div className="pt-4 border-t border-[#252A32] flex items-center justify-between text-xs">
                  <div>
                    <div className="font-medium text-[#F5F3EE]">
                      {activeNote.author}
                    </div>
                    <div className="text-[#777D87] font-mono">
                      {activeNote.role}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono uppercase text-[#777D87]">
                    Click card to cycle
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
