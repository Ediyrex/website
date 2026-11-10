import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function Hero() {
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
          {/* Left Editorial Column (~820px max) */}
          <div className="lg:col-span-8 max-w-[820px] space-y-7">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-[11px] sm:text-xs font-mono uppercase tracking-[0.16em] text-[#D6B77A]">
                INDEPENDENT CREATIVE TECHNOLOGY STUDIO
              </span>
              <span className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-[#777D87]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#54C99A]" />
                Available for selected projects
              </span>
            </div>

            <h1 className="font-heading font-bold tracking-tight text-[#F5F3EE] text-[clamp(2.625rem,5.4vw,5.25rem)] leading-[1.04]">
              We turn ideas into experiences that move businesses forward.
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#B2B4BA] max-w-[600px] leading-[1.6]">
              From visual storytelling and digital products to intelligent automation, Ediyrex brings creativity and technology together to build what comes next.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button href="/contact" size="lg" variant="primary">
                <span>Book a discovery call</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
              <Button href="/work" size="lg" variant="secondary">
                <span>Explore our work</span>
              </Button>
            </div>
          </div>

          {/* Right CSS Architectural Composition (Media × Digital × AI) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div
              aria-hidden="true"
              className="relative aspect-[4/5] rounded-2xl bg-[#12151A] border border-[#252A32] p-6 flex flex-col justify-between overflow-hidden bg-editorial-grid"
            >
              {/* Soft radial gold backdrop */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 45%, rgba(214, 183, 122, 0.10) 0%, transparent 65%)",
                }}
              />

              {/* Top Node Indicator */}
              <div className="relative z-10 flex items-center justify-between text-[11px] font-mono text-[#777D87]">
                <span>EDY-SYS // 01</span>
                <span className="text-[#D6B77A]">INTEGRATED</span>
              </div>

              {/* Three Connected Discipline Layers */}
              <div className="relative z-10 space-y-3 my-auto">
                <div className="p-3.5 rounded-xl bg-[#0D0F12]/90 border border-[#252A32] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E58A76]" />
                    <span className="text-xs font-mono text-[#F5F3EE]">
                      01 / MEDIA
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#777D87]">
                    STORYTELLING
                  </span>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-4 bg-[#3A414B]" />
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D0F12]/90 border border-[#252A32] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#7BA9F5]" />
                    <span className="text-xs font-mono text-[#F5F3EE]">
                      02 / DIGITAL
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#777D87]">
                    PLATFORMS
                  </span>
                </div>

                <div className="flex justify-center">
                  <div className="w-px h-4 bg-[#3A414B]" />
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D0F12]/90 border border-[#252A32] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B5A0F5]" />
                    <span className="text-xs font-mono text-[#F5F3EE]">
                      03 / AI
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#777D87]">
                    AUTOMATION
                  </span>
                </div>
              </div>

              {/* Bottom Bar */}
              <div className="relative z-10 pt-4 border-t border-[#252A32] flex items-center justify-between text-[11px] font-mono text-[#777D87]">
                <span>CLIENT CRAFT</span>
                <span className="text-[#D6B77A]">× STUDIO PRODUCTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
