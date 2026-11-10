"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const ENGAGEMENT_MODELS = [
  {
    id: "project",
    index: "01",
    title: "Project-based",
    description:
      "A clearly defined deliverable—such as a flagship website, brand film, or custom AI workflow—with an agreed scope and milestone structure.",
    cadence: "Milestone-driven",
    scopeStatus: "Custom scope and quotation",
    usdLabel: "Scoped per milestone",
    inrLabel: "Scoped per milestone (INR)",
    includes: [
      "Fixed deliverable definition",
      "Discovery & architecture brief",
      "Full source & asset handover",
    ],
  },
  {
    id: "ongoing",
    index: "02",
    title: "Ongoing collaboration",
    description:
      "Continued creative direction, product engineering, or AI system maintenance for teams looking for a dependable long-term partner.",
    cadence: "Monthly partnership",
    scopeStatus: "Custom scope and quotation",
    usdLabel: "Retained capacity",
    inrLabel: "Retained capacity (INR)",
    includes: [
      "Dedicated sprint allocation",
      "Continuous media & UI updates",
      "Priority workflow support",
    ],
  },
  {
    id: "custom",
    index: "03",
    title: "Custom engagement",
    description:
      "An integrated combination of Media, Digital and AI services tailored to launch a new venture or modernize existing operations.",
    cadence: "Multi-division roadmap",
    scopeStatus: "Custom scope and quotation",
    usdLabel: "Tailored multi-pillar",
    inrLabel: "Tailored multi-pillar (INR)",
    includes: [
      "Media + Digital + AI combined",
      "Cross-discipline creative lead",
      "Phased rollout & documentation",
    ],
  },
];

export function EngagementSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [selectedId, setSelectedId] = useState("project");
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  const active =
    ENGAGEMENT_MODELS.find((m) => m.id === selectedId) || ENGAGEMENT_MODELS[0];

  return (
    <section
      id="engagement"
      className="py-16 md:py-28 bg-[#0D0F12] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
              Engagement Model
            </span>
            <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12]">
              Flexible ways to begin working together.
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="inline-flex rounded-lg border border-[#252A32] bg-[#12151A] p-1"
              role="group"
              aria-label="Preferred quotation currency"
            >
              {(["USD", "INR"] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => setCurrency(curr)}
                  className={cn(
                    "px-3 py-1 text-xs font-mono rounded-md transition-colors cursor-pointer",
                    currency === curr
                      ? "bg-[#D6B77A] text-[#17130B] font-semibold"
                      : "text-[#B2B4BA] hover:text-[#F5F3EE]"
                  )}
                >
                  {curr}
                </button>
              ))}
            </div>

            <Button href="/contact" variant="outline" size="md">
              <span>Discuss your project</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Interactive Engagement Cards + Rolling Quotation Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {ENGAGEMENT_MODELS.map((model) => {
              const isSelected = model.id === selectedId;
              return (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setSelectedId(model.id)}
                  className={cn(
                    "text-left p-6 rounded-2xl border transition-all duration-150 flex flex-col justify-between space-y-6 cursor-pointer",
                    isSelected
                      ? "bg-[#191D23] border-[#D6B77A]"
                      : "bg-[#12151A] border-[#252A32] hover:border-[#3A414B]"
                  )}
                >
                  <div className="space-y-3">
                    <span className="text-xs font-mono text-[#D6B77A]">
                      {model.index}
                    </span>
                    <h3 className="font-heading font-semibold text-lg text-[#F5F3EE]">
                      {model.title}
                    </h3>
                    <p className="text-xs text-[#B2B4BA] leading-relaxed">
                      {model.description}
                    </p>
                  </div>

                  <span className="text-[11px] font-mono text-[#777D87] pt-3 border-t border-[#252A32] block">
                    {model.cadence}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Rolling Scope & Quotation Readout */}
          <div className="lg:col-span-5 rounded-2xl bg-[#12151A] border border-[#252A32] p-7 flex flex-col justify-between space-y-6 overflow-hidden">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-mono text-[#777D87]">
                <span>ESTIMATION MODEL</span>
                <span className="text-[#D6B77A]">{currency} SCOPING</span>
              </div>

              <div className="overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${active.id}-${currency}`}
                    initial={
                      shouldReduceMotion ? false : { opacity: 0, y: 16 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={
                      shouldReduceMotion ? undefined : { opacity: 0, y: -16 }
                    }
                    transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                    className="space-y-2"
                  >
                    <div className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
                      {active.scopeStatus}
                    </div>
                    <p className="text-xs font-mono text-[#D6B77A]">
                      {currency === "USD" ? active.usdLabel : active.inrLabel}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <ul className="space-y-2.5 pt-4 border-t border-[#252A32]">
                {active.includes.map((inc) => (
                  <li
                    key={inc}
                    className="flex items-center gap-2.5 text-sm text-[#B2B4BA]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#54C99A] shrink-0" />
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Button href="/contact" variant="primary" size="md" className="w-full">
              <span>Request {active.title.toLowerCase()} quote</span>
              <ArrowUpRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
