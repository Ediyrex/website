"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";

const ROTATING_WORDS = [
  { text: "brand films.", color: "#E58A76" },
  { text: "digital products.", color: "#7BA9F5" },
  { text: "AI agents.", color: "#B5A0F5" },
  { text: "growth systems.", color: "#D6B77A" },
];

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [wordIndex, setWordIndex] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion) return;
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2600);
    return () => clearInterval(interval);
  }, [shouldReduceMotion]);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@ediyrex.com");
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2200);
    } catch {
      // Fallback ignored if clipboard blocked
    }
  };

  const activeWord = ROTATING_WORDS[wordIndex];

  return (
    <section
      className="relative min-h-[680px] flex items-center pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-[#08090B]"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 65% 55% at 50% 25%, #29241B 0%, #08090B 72%)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Editorial Column with Staggered Hero Reveal */}
          <div className="lg:col-span-8 max-w-[820px] space-y-7">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap items-center gap-4"
            >
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] text-[#D6B77A]">
                INDEPENDENT CREATIVE TECHNOLOGY STUDIO
              </span>
              <span className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-[#777D87]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#54C99A]" />
                Available for selected projects
              </span>
            </motion.div>

            <motion.h1
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="font-heading font-bold tracking-tight text-[#F5F3EE] text-[clamp(2.5rem,5.2vw,5rem)] leading-[1.06]"
            >
              We turn ideas into{" "}
              <span className="inline-block relative min-w-[260px] sm:min-w-[380px] align-bottom">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={activeWord.text}
                    initial={
                      shouldReduceMotion ? false : { opacity: 0, y: 18 }
                    }
                    animate={{ opacity: 1, y: 0 }}
                    exit={shouldReduceMotion ? undefined : { opacity: 0, y: -18 }}
                    transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                    className="inline-block"
                    style={{ color: activeWord.color }}
                  >
                    {activeWord.text}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-base sm:text-lg md:text-xl text-[#B2B4BA] max-w-[600px] leading-[1.6]"
            >
              From visual storytelling and digital products to intelligent automation, Ediyrex brings creativity and technology together to build what comes next.
            </motion.p>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-wrap items-center gap-3.5 pt-2"
            >
              <Button href="/contact" size="lg" variant="primary">
                <span>Book a discovery call</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
              <Button href="/work" size="lg" variant="secondary">
                <span>Explore our work</span>
              </Button>

              {/* Click-success quick studio email pill */}
              <button
                type="button"
                onClick={handleCopyEmail}
                className="relative h-12 px-4 rounded-[8px] border border-[#252A32] bg-[#0D0F12] hover:border-[#3A414B] text-xs font-mono text-[#B2B4BA] hover:text-[#F5F3EE] inline-flex items-center gap-2 transition-colors cursor-pointer"
                aria-label="Copy studio email address"
              >
                <AnimatePresence mode="wait">
                  {copiedEmail ? (
                    <motion.span
                      key="copied"
                      initial={shouldReduceMotion ? false : { scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                      className="inline-flex items-center gap-1.5 text-[#54C99A]"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Copied hello@ediyrex.com</span>
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={shouldReduceMotion ? false : { opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                      className="inline-flex items-center gap-1.5"
                    >
                      <Copy className="w-3.5 h-3.5 text-[#D6B77A]" />
                      <span>hello@ediyrex.com</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          </div>

          {/* Right CSS Architectural Composition with Subtle Reveal */}
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.65,
              delay: 0.2,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="lg:col-span-4 hidden lg:block"
          >
            <div
              aria-hidden="true"
              className="relative aspect-[4/5] rounded-2xl bg-[#12151A] border border-[#252A32] p-6 flex flex-col justify-between overflow-hidden bg-editorial-grid"
            >
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, rgba(214, 183, 122, 0.10) 0%, transparent 65%)",
                }}
              />

              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[#777D87]">
                <span>EDY-SYS // 01</span>
                <span className="text-[#D6B77A]">INTEGRATED</span>
              </div>

              <div className="relative z-10 space-y-3 my-auto">
                {[
                  {
                    label: "01 / MEDIA",
                    sub: "STORYTELLING",
                    dot: "#E58A76",
                    active: wordIndex === 0,
                  },
                  {
                    label: "02 / DIGITAL",
                    sub: "PLATFORMS",
                    dot: "#7BA9F5",
                    active: wordIndex === 1,
                  },
                  {
                    label: "03 / AI",
                    sub: "AUTOMATION",
                    dot: "#B5A0F5",
                    active: wordIndex === 2 || wordIndex === 3,
                  },
                ].map((node, i) => (
                  <React.Fragment key={node.label}>
                    <div
                      className="p-3.5 rounded-xl bg-[#0D0F12]/90 border transition-colors duration-300 flex items-center justify-between"
                      style={{
                        borderColor: node.active ? node.dot : "#252A32",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: node.dot }}
                        />
                        <span className="text-xs font-mono text-[#F5F3EE]">
                          {node.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#777D87]">
                        {node.sub}
                      </span>
                    </div>
                    {i < 2 && (
                      <div className="flex justify-center">
                        <div className="w-px h-4 bg-[#3A414B]" />
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <div className="relative z-10 pt-4 border-t border-[#252A32] flex items-center justify-between text-[11px] font-mono text-[#777D87]">
                <span>CLIENT CRAFT</span>
                <span className="text-[#D6B77A]">&times; STUDIO PRODUCTS</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
