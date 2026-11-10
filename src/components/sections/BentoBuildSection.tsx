"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight,
  Bot,
  Film,
  Globe,
  MousePointer2,
  Pause,
  Play,
} from "lucide-react";

const TOUR_STEPS = [
  {
    id: "brief",
    label: "01 Brief",
    title: "Discovery & Scope Mapping",
    detail: "Align Media, Digital, and AI deliverables into one roadmap.",
    accent: "#D6B77A",
    cursorX: "18%",
    cursorY: "26%",
  },
  {
    id: "creative",
    label: "02 Craft",
    title: "Visual & Interface System",
    detail: "Brand films, editorial UI design, and responsive components.",
    accent: "#E58A76",
    cursorX: "68%",
    cursorY: "30%",
  },
  {
    id: "intelligence",
    label: "03 AI Core",
    title: "Agents & Workflow Automation",
    detail: "Connect RAG knowledge, chatbots, and voice receptionists.",
    accent: "#B5A0F5",
    cursorX: "30%",
    cursorY: "70%",
  },
  {
    id: "launch",
    label: "04 Launch",
    title: "Production Handover",
    detail: "Typed codebase, documented pipelines, and clear ownership.",
    accent: "#7BA9F5",
    cursorX: "74%",
    cursorY: "72%",
  },
];

export function BentoBuildSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay || shouldReduceMotion) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % TOUR_STEPS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, [autoPlay, shouldReduceMotion]);

  const currentStep = TOUR_STEPS[activeStep];

  return (
    <section
      id="bento"
      className="py-16 md:py-28 bg-[#08090B] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
        <div className="max-w-2xl space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
            Studio Architecture
          </span>
          <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12]">
            Built as one connected system.
          </h2>
          <p className="text-[#B2B4BA] text-base leading-relaxed">
            Explore how our divisions interlock—from interactive workflow planning to production launch.
          </p>
        </div>

        {/* 12-Column Asymmetrical Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Bento Tile 1 (Span 7): Interactive Cursor Tour */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 rounded-2xl bg-[#12151A] border border-[#252A32] p-6 md:p-7 flex flex-col justify-between space-y-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#D6B77A]">
                  Interactive Cursor Tour
                </span>
                <h3 className="font-heading font-semibold text-xl text-[#F5F3EE] mt-1">
                  Inside a Unified Studio Engagement
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setAutoPlay((p) => !p)}
                aria-label={autoPlay ? "Pause guided tour" : "Play guided tour"}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#3A414B] text-xs font-mono text-[#B2B4BA] hover:text-[#F5F3EE] cursor-pointer"
              >
                {autoPlay ? (
                  <>
                    <Pause className="w-3.5 h-3.5 text-[#D6B77A]" />
                    <span>Auto</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 text-[#D6B77A]" />
                    <span>Paused</span>
                  </>
                )}
              </button>
            </div>

            {/* Contained Cursor Tour Canvas */}
            <div className="relative rounded-xl bg-[#08090B] border border-[#252A32] p-4 sm:p-5 bg-editorial-grid overflow-hidden">
              <div className="grid grid-cols-2 gap-3 relative z-10">
                {TOUR_STEPS.map((step, idx) => {
                  const isActive = idx === activeStep;
                  return (
                    <button
                      key={step.id}
                      type="button"
                      onClick={() => {
                        setAutoPlay(false);
                        setActiveStep(idx);
                      }}
                      className="text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer"
                      style={{
                        backgroundColor: isActive ? "#191D23" : "#0D0F12",
                        borderColor: isActive ? step.accent : "#252A32",
                      }}
                    >
                      <span
                        className="text-[10px] font-mono uppercase tracking-wider block"
                        style={{ color: step.accent }}
                      >
                        {step.label}
                      </span>
                      <span className="font-heading font-semibold text-sm text-[#F5F3EE] block mt-1">
                        {step.title}
                      </span>
                      <span className="text-xs text-[#B2B4BA] block mt-1 leading-relaxed">
                        {step.detail}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Guided Virtual Cursor */}
              <motion.div
                aria-hidden="true"
                animate={{
                  left: currentStep.cursorX,
                  top: currentStep.cursorY,
                }}
                transition={{
                  type: "spring",
                  stiffness: 190,
                  damping: 24,
                }}
                className="hidden sm:flex items-center gap-1.5 absolute z-20 pointer-events-none"
              >
                <MousePointer2
                  className="w-5 h-5 drop-shadow-md"
                  style={{
                    color: currentStep.accent,
                    fill: currentStep.accent,
                  }}
                />
                <span
                  className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#08090B]/95 border text-[#F5F3EE]"
                  style={{ borderColor: currentStep.accent }}
                >
                  {currentStep.label}
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Bento Tile 2 (Span 5): Hybrid Venture Model */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.45,
              delay: 0.08,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-5 rounded-2xl bg-[#12151A] border border-[#252A32] p-6 md:p-7 flex flex-col justify-between space-y-6"
            style={{
              backgroundImage:
                "radial-gradient(circle at 85% 15%, rgba(214, 183, 122, 0.08) 0%, transparent 55%)",
            }}
          >
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#D6B77A]">
                Hybrid Studio Model
              </span>
              <h3 className="font-heading font-semibold text-2xl text-[#F5F3EE]">
                Client Craft &times; Studio Products
              </h3>
              <p className="text-sm text-[#B2B4BA] leading-relaxed">
                Client engagements directly fund and pressure-test our internal tools—from multi-agent orchestrators to low-latency voice runtimes.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                { name: "AgentCore Orchestrator", stage: "Beta" },
                { name: "Vocalis Voice Runtime", stage: "Alpha" },
                { name: "RenderFlow Asset Studio", stage: "Research" },
              ].map((prod) => (
                <div
                  key={prod.name}
                  className="px-4 py-3 rounded-xl bg-[#0D0F12] border border-[#252A32] flex items-center justify-between"
                >
                  <span className="text-xs font-medium text-[#F5F3EE]">
                    {prod.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#12151A] text-[#D6B77A] border border-[#252A32]">
                    {prod.stage}
                  </span>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D6B77A] hover:text-[#E6CC99]"
            >
              <span>Read about the studio model</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </motion.div>

          {/* Bento Tiles 3, 4, 5 (Span 4 each): Media, Digital, AI */}
          {[
            {
              title: "Media & Content",
              desc: "Brand films, commercials, photography, short-form reels, and motion design.",
              href: "/services/media",
              accent: "#E58A76",
              icon: Film,
              delay: 0.12,
            },
            {
              title: "Web & Digital",
              desc: "Editorial websites, e-commerce, SaaS dashboards, UI/UX, and full-stack apps.",
              href: "/services/digital",
              accent: "#7BA9F5",
              icon: Globe,
              delay: 0.16,
            },
            {
              title: "AI & Automation",
              desc: "Autonomous AI agents, chatbots, voice receptionists, and RAG systems.",
              href: "/services/ai",
              accent: "#B5A0F5",
              icon: Bot,
              delay: 0.2,
            },
          ].map((tile) => {
            const Icon = tile.icon;
            return (
              <motion.div
                key={tile.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.45,
                  delay: tile.delay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="lg:col-span-4 rounded-2xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] p-6 flex flex-col justify-between space-y-5 transition-colors"
              >
                <div className="space-y-3">
                  <div className="w-9 h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] flex items-center justify-center">
                    <Icon
                      className="w-4 h-4"
                      style={{ color: tile.accent }}
                    />
                  </div>
                  <h3 className="font-heading font-semibold text-lg text-[#F5F3EE]">
                    {tile.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#B2B4BA] leading-relaxed">
                    {tile.desc}
                  </p>
                </div>

                <Link
                  href={tile.href}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-[#F5F3EE] hover:text-[#D6B77A] transition-colors"
                >
                  <span>Explore division</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
