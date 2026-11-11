"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "motion/react";
import { ArrowRight, ArrowUpRight, Play, X } from "lucide-react";
import { gsap } from "@/lib/gsap";

const ITALIC_PHRASES = [
  { line3: "creative", line4: "impact." },
  { line3: "visual", line4: "stories." },
  { line3: "digital", line4: "craft." },
  { line3: "intelligent", line4: "systems." },
] as const;

const HERO_DESCRIPTION_WORDS =
  "From visual storytelling and digital products to intelligent automation, Ediyrex brings creativity and technology together to build what comes next.".split(
    " "
  );

export function Hero() {
  const shouldReduceMotion = useReducedMotion();
  const [ambientActive, setAmbientActive] = useState(false);
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [showreelOpen, setShowreelOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const sculptureRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 70, damping: 18, mass: 0.8 });
  const springY = useSpring(mouseY, { stiffness: 70, damping: 18, mass: 0.8 });

  const handleHeroMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion || !sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(nx * -18);
    mouseY.set(ny * -14);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  useEffect(() => {
    if (shouldReduceMotion) return;
    const raf = requestAnimationFrame(() => setAmbientActive(true));
    const timer = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % ITALIC_PHRASES.length);
    }, 3400);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!sectionRef.current || !sculptureRef.current) return;
    const mm = gsap.matchMedia();

    mm.add(
      "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
      () => {
        gsap.to(sculptureRef.current, {
          y: 28,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      }
    );

    return () => mm.revert();
  }, []);

  useEffect(() => {
    if (!showreelOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowreelOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [showreelOpen]);

  const activePhrase = ITALIC_PHRASES[phraseIndex];

  return (
    <>
      <section
        ref={sectionRef}
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        className="relative bg-[#F8F6F2] text-[#0B0D10] overflow-hidden pt-24 pb-0 md:pt-20 md:pb-6 lg:pt-22 lg:pb-8 md:h-[100svh] md:min-h-[600px] md:max-h-[980px] flex items-center"
      >
        <div className="max-w-[1440px] mx-auto px-5 sm:px-8 lg:px-14 w-full relative z-10">
          <div className="w-full md:w-[52%] lg:w-[47%] xl:w-[46%] relative z-10 space-y-3.5 md:space-y-4 xl:space-y-5">
            {/* Eyebrow Label */}
            <motion.div
              initial={{ opacity: 0, letterSpacing: "0.18em" }}
              animate={{ opacity: 1, letterSpacing: "0.08em" }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center"
            >
              <span
                style={{ fontFamily: "var(--font-space-mono)" }}
                className="text-[12px] sm:text-[13px] font-normal uppercase text-[#45484B]"
              >
                CREATIVE TECHNOLOGY STUDIO
              </span>
            </motion.div>

            {/* Four-Line Editorial Headline — Masked Curtain Slide + Rotating Serif Phrase */}
            <h1 className="m-0 pb-1 sm:pb-2">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  initial={{ y: "105%", skewY: 3, opacity: 0 }}
                  animate={{ y: "0%", skewY: 0, opacity: 1 }}
                  transition={{
                    duration: 0.72,
                    delay: 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "clamp(46px, min(6.4vw, 10.8svh), 112px)",
                  }}
                  className="block font-extrabold text-[#0B0D10] leading-[0.86] tracking-[-0.065em]"
                >
                  We turn
                </motion.span>
              </span>

              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  initial={{ y: "105%", skewY: 3, opacity: 0 }}
                  animate={{ y: "0%", skewY: 0, opacity: 1 }}
                  transition={{
                    duration: 0.72,
                    delay: 0.14,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  style={{
                    fontFamily: "var(--font-space-grotesk)",
                    fontSize: "clamp(46px, min(6.4vw, 10.8svh), 112px)",
                  }}
                  className="block font-extrabold text-[#0B0D10] leading-[0.86] tracking-[-0.065em]"
                >
                  vision into
                </motion.span>
              </span>

              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={`${activePhrase.line3}-${activePhrase.line4}`}
                  initial={{ opacity: 0, y: 22, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -18, filter: "blur(5px)" }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="block mt-1"
                >
                  <span
                    style={{
                      fontFamily: "var(--font-instrument-serif)",
                      fontSize: "clamp(50px, min(6.9vw, 11.4svh), 120px)",
                    }}
                    className="block font-normal italic text-[#686B70] leading-[0.88] tracking-[-0.025em]"
                  >
                    {activePhrase.line3}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-instrument-serif)",
                      fontSize: "clamp(50px, min(6.9vw, 11.4svh), 120px)",
                    }}
                    className="block font-normal italic text-[#686B70] leading-[0.96] tracking-[-0.025em]"
                  >
                    {activePhrase.line4}
                  </span>
                </motion.span>
              </AnimatePresence>
            </h1>

            {/* Supporting Description — Vertical Line Draw + Optical Blur Word Shimmer */}
            <div className="relative pl-4 sm:pl-5 max-w-[490px] pt-0.5">
              <motion.span
                aria-hidden="true"
                initial={{ scaleY: 0, opacity: 0 }}
                animate={{ scaleY: 1, opacity: 1 }}
                transition={{
                  duration: 0.65,
                  delay: 0.28,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="absolute left-0 top-1 bottom-1 w-px bg-[#0B0D10]/25 origin-top"
              />
              <p className="text-[14px] sm:text-[15.5px] xl:text-[17px] font-normal text-[#42464A] leading-[1.48] flex flex-wrap gap-x-[0.28em]">
                {HERO_DESCRIPTION_WORDS.map((word, idx) => (
                  <motion.span
                    key={`${idx}-${word}`}
                    initial={{ opacity: 0, x: -6, filter: "blur(5px)" }}
                    animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.4,
                      delay: 0.32 + idx * 0.018,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="inline-block"
                  >
                    {word}
                  </motion.span>
                ))}
              </p>
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-20 flex flex-wrap items-center gap-6 sm:gap-8 pt-1"
            >
              <Link
                href="/work"
                className="inline-flex items-center gap-2 rounded-full bg-[#0B0D10] text-white px-6 py-3 xl:px-7 xl:py-3.5 text-[15px] xl:text-[16px] font-semibold hover:bg-[#22262B] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0D10] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F8F6F2]"
              >
                <span>Explore our work</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => setShowreelOpen(true)}
                className="inline-flex items-center gap-2 bg-transparent text-[#0B0D10] text-[15px] xl:text-[16px] font-medium border-b border-[#0B0D10]/55 pb-1 hover:border-[#0B0D10] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B0D10]"
              >
                <span>Watch showreel</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Independent Transparent Sculpture Focal Asset */}
        <div
          ref={sculptureRef}
          className="relative mt-6 w-full flex justify-end md:mt-0 md:block md:absolute md:right-[-4%] lg:right-[-2%] md:bottom-[-3%] lg:bottom-[-4%] md:w-[54%] lg:w-[56%] md:h-[88%] lg:h-[92%] z-[1] pointer-events-none select-none"
        >
          <motion.div
            style={{ x: springX, y: springY }}
            className="w-full h-full flex justify-end md:block"
          >
            <motion.div
              initial={{ opacity: 0, y: 42, scale: 0.94, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              transition={{
                duration: 0.95,
                delay: 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full h-full flex justify-end md:block"
            >
              <motion.div
                animate={
                  ambientActive
                    ? { y: [0, -8, 0], rotate: [0, 0.35, 0] }
                    : undefined
                }
                transition={{
                  duration: 7.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-full h-full flex justify-end md:block"
              >
                <Image
                  src="/images/hero-sculpture.png"
                  alt="Monochrome classical marble sculpture with translucent orange accent across the eyes representing Ediyrex creativity and technology"
                  width={1024}
                  height={935}
                  priority
                  sizes="(min-width: 1440px) 58vw, (min-width: 768px) 56vw, 95vw"
                  className="w-[94%] max-w-[460px] ml-auto md:max-w-none md:w-full md:h-full object-contain object-bottom md:object-right-bottom"
                />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Studio Showreel Modal */}
      {showreelOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Ediyrex Studio Showreel"
          onClick={() => setShowreelOpen(false)}
          className="fixed inset-0 z-50 bg-[#08090B]/85 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-2xl bg-[#12151A] border border-[#252A32] p-6 sm:p-8 text-[#F5F3EE] shadow-2xl space-y-5"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A]">
                  EDIYREX STUDIO SHOWREEL
                </p>
                <h2 className="font-heading font-bold text-2xl mt-1">
                  Creative Production &times; Digital Craft &times; AI Systems
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowreelOpen(false)}
                aria-label="Close showreel dialog"
                className="p-2 rounded-lg border border-[#252A32] text-[#A1A6AE] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="rounded-xl bg-[#08090B] border border-[#252A32] p-6 sm:p-8 flex flex-col items-center text-center space-y-4">
              <span className="w-12 h-12 rounded-full bg-[#FF6A00]/15 border border-[#FF6A00]/40 text-[#FF6A00] flex items-center justify-center">
                <Play className="w-5 h-5 fill-current ml-0.5" />
              </span>
              <p className="text-sm text-[#B2B4BA] max-w-md leading-relaxed">
                Explore our selected commercial films, brand identities,
                interactive web platforms, and AI automation systems in the
                Ediyrex showcase.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                <Link
                  href="/work"
                  onClick={() => setShowreelOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#F5F3EE] text-[#08090B] px-6 py-2.5 text-sm font-semibold hover:bg-white transition-colors"
                >
                  <span>Browse Featured Work</span>
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/services/media"
                  onClick={() => setShowreelOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full border border-[#3A414B] px-5 py-2.5 text-sm font-medium text-[#F5F3EE] hover:border-[#D6B77A] transition-colors"
                >
                  <span>Media Division</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
