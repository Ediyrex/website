"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  AppWindow,
  ArrowUpRight,
  Box,
  Layers,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BUILD_OPTIONS = [
  {
    id: "branding",
    number: "01",
    title: "Creative & Branding",
    description: "Identity, campaigns, and brand systems.",
    Icon: Box,
  },
  {
    id: "web-dev",
    number: "02",
    title: "Websites & Digital Products",
    description: "Websites, web apps and platform experiences.",
    Icon: AppWindow,
  },
  {
    id: "ai",
    number: "03",
    title: "AI & Automation",
    description: "AI agents, workflows and intelligent systems.",
    Icon: Layers,
  },
  {
    id: "media",
    number: "04",
    title: "Media & Production",
    description: "Brand films, content and post-production.",
    Icon: PlayCircle,
  },
] as const;

export function FinalCtaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [selectedService, setSelectedService] = useState<string>("branding");

  useEffect(() => {
    const container = sectionRef.current;
    if (!container || typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const items = container.querySelectorAll("[data-next-reveal]");
      if (items.length === 0) return;

      gsap.from(items, {
        opacity: 0,
        y: 18,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        clearProps: "opacity,transform",
        scrollTrigger: {
          trigger: container,
          start: "top 86%",
          once: true,
        },
      });
    }, container);

    const refreshTimer = window.setTimeout(() => {
      ScrollTrigger.refresh();
    }, 300);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return (
    <section
      id="final-cta"
      ref={sectionRef}
      aria-label="Start a conversation with EDIYREX"
      className="relative overflow-hidden bg-[#F6F1EA] border-t border-[#DED5CC] py-14 sm:py-16 lg:py-20 text-[#141414]"
    >
      {/* Left edge diagonal orange stripe accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden lg:block absolute left-0 top-[46%] h-24 w-5 opacity-75"
        style={{
          backgroundImage:
            "repeating-linear-gradient(-45deg, #FF640A 0px, #FF640A 4px, transparent 4px, transparent 10px)",
        }}
      />

      {/* Bottom-right corner orange geometric accent */}
      <div
        aria-hidden="true"
        className="pointer-events-none hidden sm:block absolute right-0 bottom-0 h-8 w-36 bg-[#FF640A]"
        style={{ clipPath: "polygon(18% 0, 100% 0, 100% 100%, 0 100%)" }}
      />

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14 space-y-10 lg:space-y-12">
        {/* Main 2-Column Editorial Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Headline + Subcopy */}
          <div className="lg:col-span-6 space-y-6">
            <h2
              data-next-reveal
              className="font-heading font-bold tracking-[-0.035em] text-[#141414] text-[clamp(2.35rem,4.5vw,4.15rem)] leading-[0.98]"
            >
              <span className="block">Have an idea</span>
              <span className="block">worth building?</span>
              <span className="relative inline-block italic text-[#FF640A] mt-1">
                Let&apos;s make it happen.
                {/* Subtle hand-drawn orange underline accent */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 220 14"
                  fill="none"
                  className="pointer-events-none absolute right-0 -bottom-2.5 w-[44%] h-3"
                >
                  <path
                    d="M 3 10 C 65 4, 145 3, 216 5"
                    stroke="#FF640A"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            <p
              data-next-reveal
              className="max-w-[430px] pt-2 text-[15.5px] sm:text-[16.5px] leading-[1.58] text-[#45413E]"
            >
              Tell us what you&apos;re working on. We&apos;ll help you explore
              the right creative, digital or AI approach.
            </p>
          </div>

          {/* Right Column: Interactive Build Scope Selector */}
          <div
            data-next-reveal
            className="lg:col-span-6 lg:border-l lg:border-[#CFC5B9] lg:pl-10 space-y-4"
          >
            <div className="font-mono text-[11.5px] font-semibold uppercase tracking-[0.18em] text-[#141414]">
              WHAT ARE YOU LOOKING TO BUILD?
            </div>

            <div
              role="group"
              aria-label="What are you looking to build?"
              className="space-y-2.5"
            >
              {BUILD_OPTIONS.map((option) => {
                const isSelected = selectedService === option.id;
                const Icon = option.Icon;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedService(option.id)}
                    aria-pressed={isSelected}
                    className={cn(
                      "group flex w-full items-center justify-between gap-4 rounded-[8px] border px-4 py-3 text-left transition-colors duration-200 cursor-pointer",
                      isSelected
                        ? "border-[#FF7A2F] bg-[#FFEADC]"
                        : "border-[#CFC5B9] bg-[#FAF6F0]/80 hover:border-[#141414]/60 hover:bg-[#FFFDFC]"
                    )}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span
                        className={cn(
                          "flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] transition-colors",
                          isSelected
                            ? "text-[#141414]"
                            : "text-[#45413E] group-hover:text-[#141414]"
                        )}
                      >
                        <Icon className="h-5 w-5 stroke-[1.6]" aria-hidden="true" />
                      </span>

                      <div className="min-w-0">
                        <div className="font-heading text-[15px] font-semibold text-[#141414] leading-snug">
                          {option.title}
                        </div>
                        <div className="text-[12.5px] text-[#5B554E] truncate">
                          {option.description}
                        </div>
                      </div>
                    </div>

                    <span className="shrink-0 font-mono text-[13px] font-medium text-[#FF640A]">
                      {option.number}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Full-Width Dark "START A CONVERSATION" Banner */}
        <div data-next-reveal>
          <Link
            href={`/contact?service=${encodeURIComponent(selectedService)}`}
            className="group relative flex min-h-[76px] sm:min-h-[86px] items-center justify-between gap-4 overflow-hidden rounded-[6px] bg-[#121110] px-5 sm:px-8 py-3.5 text-[#F6F1EA] shadow-[0_20px_48px_-24px_rgba(17,17,17,0.45)] transition-transform duration-250 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF640A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F6F1EA]"
          >
            {/* Warm burnt-orange ambient wave inside dark bar */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-0 inset-y-0 w-[55%] opacity-75"
              style={{
                background:
                  "radial-gradient(ellipse 75% 110% at 68% 65%, rgba(255,100,10,0.42), transparent 68%)",
              }}
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute right-10 inset-y-0 w-[45%] opacity-25"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,160,85,0.85) 1px, transparent 1px)",
                backgroundSize: "5px 5px",
              }}
            />

            <span className="relative z-10 font-mono sm:font-heading text-[15px] sm:text-[21px] font-medium uppercase tracking-[0.18em] text-[#F6F1EA]">
              START A CONVERSATION
            </span>

            <span
              aria-hidden="true"
              className="relative z-10 flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-[6px] bg-[#FF640A] text-[#141414] transition-colors duration-200 group-hover:bg-[#FF7A26]"
            >
              <ArrowUpRight className="h-5 w-5 stroke-[2.2] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
