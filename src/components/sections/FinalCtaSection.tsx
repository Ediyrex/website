"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function FinalCtaSection() {
  const shouldReduceMotion = Boolean(useReducedMotion());
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("hello@ediyrex.com");
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      // Ignore if clipboard unavailable
    }
  };

  return (
    <section
      className="py-20 md:py-32 bg-[#0D0F12] relative overflow-hidden"
      style={{
        backgroundImage:
          "radial-gradient(ellipse 60% 60% at 50% 50%, #29241B 0%, #0D0F12 75%)",
      }}
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 relative z-10 text-center space-y-6">
        <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
          Next Step
        </span>

        <h2 className="font-heading font-bold tracking-tight text-[#F5F3EE] text-[clamp(2.25rem,4.5vw,4rem)] leading-[1.08] max-w-3xl mx-auto">
          Have something worth building?
        </h2>

        <p className="text-base sm:text-lg text-[#B2B4BA] max-w-xl mx-auto leading-relaxed">
          Tell us what you are working on. We will help you explore the right creative, digital or AI approach.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button href="/contact" size="lg" variant="primary">
            <span>Start a conversation</span>
            <ArrowUpRight className="w-4 h-4" />
          </Button>

          <motion.button
            type="button"
            whileTap={shouldReduceMotion ? undefined : { scale: 0.97 }}
            onClick={handleCopy}
            className="h-12 px-5 rounded-[8px] bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] text-sm font-mono text-[#F5F3EE] inline-flex items-center gap-2 transition-colors cursor-pointer"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span
                  key="success"
                  initial={
                    shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }
                  }
                  animate={{ opacity: 1, scale: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  className="inline-flex items-center gap-2 text-[#54C99A]"
                >
                  <Check className="w-4 h-4" />
                  <span>Copied hello@ediyrex.com!</span>
                </motion.span>
              ) : (
                <motion.span
                  key="idle"
                  initial={shouldReduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0 }}
                  className="inline-flex items-center gap-2 text-[#B2B4BA]"
                >
                  <Copy className="w-4 h-4 text-[#D6B77A]" />
                  <span>Copy hello@ediyrex.com</span>
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <Link
            href="/services"
            className="text-sm font-medium text-[#B2B4BA] hover:text-[#F5F3EE] px-4 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A] rounded"
          >
            Explore our services
          </Link>
        </div>
      </div>
    </section>
  );
}
