"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { gsap } from "@/lib/gsap";

const DIVISIONS = [
  {
    id: "branding",
    label: "01 / BRANDING & MARKETING",
    heading: "Attention that compounds.",
    description:
      "Position products for measurable growth with performance creative, packaging systems, search visibility, and retention campaigns.",
    examples:
      "Ads & engagement, packaging & promotional design, SEO optimization, influencer marketing & email marketing.",
    cta: "Explore Branding / Marketing",
    href: "/services/branding",
    accent: "#D6B77A",
    gradient: "linear-gradient(160deg, #272013 0%, #12151A 60%)",
  },
  {
    id: "media",
    label: "02 / MEDIA",
    heading: "Stories worth seeing.",
    description:
      "Create high-retention video edits, motion systems, and graphic design crafted to build brand authority.",
    examples:
      "Video editing (podcast, short-forms, event videos), motion graphics, graphics design & studio shoots.",
    cta: "Explore Media",
    href: "/services/media",
    accent: "#E58A76",
    gradient: "linear-gradient(160deg, #241411 0%, #12151A 60%)",
  },
  {
    id: "digital",
    label: "03 / WEB DEV",
    heading: "Digital built with intent.",
    description:
      "Engineer fast web platforms, intuitive interfaces, custom browser extensions, and real-time analytics products.",
    examples:
      "Web dev, technical SEO, UI/UX design, web extensions & DADV (dashboards & data visualization).",
    cta: "Explore Web Dev",
    href: "/services/digital",
    accent: "#7BA9F5",
    gradient: "linear-gradient(160deg, #101C31 0%, #12151A 60%)",
  },
  {
    id: "ai",
    label: "04 / AGENTS & AUTOMATION",
    heading: "Intelligence into action.",
    description:
      "Connect conversational AI, voice systems, and workflow automation with real operations to scale output cleanly.",
    examples:
      "Chatbots, calling agents, autonomous AI agents & n8n workflow automation.",
    cta: "Explore Agents & Automation",
    href: "/services/ai",
    accent: "#B5A0F5",
    gradient: "linear-gradient(160deg, #21172D 0%, #12151A 60%)",
  },
];

export function ThreeDivisionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cards = containerRef.current?.querySelectorAll(".division-card");
      if (!cards?.length) return;

      gsap.from(cards, {
        y: 26,
        opacity: 0,
        duration: 0.55,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 82%",
          once: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      id="divisions"
      className="py-16 md:py-28 bg-[#08090B] border-b border-[#252A32]"
    >
      <div
        ref={containerRef}
        className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10 md:space-y-12"
      >
        <div className="max-w-2xl space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
            Capabilities
          </span>
          <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12]">
            Four connected divisions inside one studio.
          </h2>
          <p className="text-[#B2B4BA] text-base leading-relaxed">
            Branding &amp; Marketing builds demand, Media crafts visual authority, Web Dev engineers high-converting software, and Agents &amp; Automation scales operations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DIVISIONS.map((division) => (
            <div
              key={division.id}
              className="division-card group relative rounded-2xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] transition-colors p-7 md:p-8 flex flex-col justify-between overflow-hidden"
            >
              <div className="space-y-6">
                <div
                  className="h-32 rounded-xl border border-[#252A32] p-5 flex items-center justify-center relative overflow-hidden"
                  style={{ backgroundImage: division.gradient }}
                >
                  {division.id === "branding" && (
                    <div className="w-full h-full flex items-center justify-center gap-3">
                      <div className="w-16 h-16 rounded-2xl border border-[#D6B77A]/50 bg-[#D6B77A]/10 rotate-6" />
                      <div className="w-16 h-16 rounded-2xl border border-[#D6B77A]/70 bg-[#12151A] -translate-x-4 -rotate-3 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full bg-[#D6B77A]" />
                      </div>
                    </div>
                  )}

                  {division.id === "media" && (
                    <div className="w-full h-full flex items-center justify-center gap-3">
                      <div className="w-12 h-20 rounded-md border border-[#E58A76]/40 bg-[#E58A76]/10" />
                      <div className="w-28 h-20 rounded-md border border-[#E58A76]/50 bg-[#0D0F12]/90 flex items-center justify-center">
                        <div className="w-6 h-6 rounded-full border border-[#E58A76]/60 flex items-center justify-center">
                          <div className="w-0 h-0 border-y-4 border-y-transparent border-l-6 border-l-[#E58A76] ml-0.5" />
                        </div>
                      </div>
                    </div>
                  )}

                  {division.id === "digital" && (
                    <div className="w-full h-full relative flex items-center justify-center">
                      <div className="w-40 h-20 rounded-lg border border-[#7BA9F5]/30 bg-[#0D0F12] translate-x-3 -translate-y-1.5" />
                      <div className="w-40 h-20 rounded-lg border border-[#7BA9F5]/60 bg-[#12151A] absolute -translate-x-2 translate-y-1.5 p-2.5 flex flex-col justify-between">
                        <div className="flex gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#7BA9F5]/60" />
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3A414B]" />
                        </div>
                        <div className="space-y-1.5">
                          <div className="w-20 h-1.5 rounded bg-[#7BA9F5]/40" />
                          <div className="w-28 h-1 rounded bg-[#252A32]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {division.id === "ai" && (
                    <div className="w-full h-full flex items-center justify-center gap-4">
                      <div className="w-8 h-8 rounded-full border border-[#B5A0F5]/40 bg-[#B5A0F5]/10" />
                      <div className="w-8 h-px bg-[#B5A0F5]/50" />
                      <div className="w-12 h-12 rounded-xl border border-[#B5A0F5]/70 bg-[#B5A0F5]/15 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-[#B5A0F5]" />
                      </div>
                      <div className="w-8 h-px bg-[#B5A0F5]/50" />
                      <div className="w-8 h-8 rounded-full border border-[#B5A0F5]/40 bg-[#B5A0F5]/10" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <span
                    className="text-xs font-mono uppercase tracking-[0.14em] block"
                    style={{ color: division.accent }}
                  >
                    {division.label}
                  </span>
                  <h3 className="font-heading font-semibold text-2xl text-[#F5F3EE]">
                    {division.heading}
                  </h3>
                  <p className="text-sm text-[#B2B4BA] leading-relaxed">
                    {division.description}
                  </p>
                  <p className="text-xs text-[#777D87] leading-relaxed pt-1">
                    {division.examples}
                  </p>
                </div>
              </div>

              <div className="pt-8 mt-6 border-t border-[#252A32]">
                <Link
                  href={division.href}
                  className="inline-flex items-center gap-2 text-sm font-medium text-[#F5F3EE] hover:text-[#D6B77A] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A] rounded"
                >
                  <span>{division.cta}</span>
                  <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
