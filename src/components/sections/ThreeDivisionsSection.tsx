import React from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const DIVISIONS = [
  {
    id: "media",
    label: "01 / MEDIA",
    heading: "Stories worth seeing.",
    description:
      "Create visual content that captures attention, communicates meaning and builds brand recognition.",
    examples:
      "Brand films, photography, short-form video, motion graphics and content strategy.",
    cta: "Explore Media",
    href: "/services/media",
    accent: "#E58A76",
    gradient: "linear-gradient(160deg, #241411 0%, #12151A 60%)",
  },
  {
    id: "digital",
    label: "02 / DIGITAL",
    heading: "Digital built with intent.",
    description:
      "Design and build websites, applications and digital products that turn complex ideas into useful experiences.",
    examples:
      "Websites, e-commerce, SaaS, dashboards, UI/UX and full-stack applications.",
    cta: "Explore Digital",
    href: "/services/digital",
    accent: "#7BA9F5",
    gradient: "linear-gradient(160deg, #101C31 0%, #12151A 60%)",
  },
  {
    id: "ai",
    label: "03 / AI",
    heading: "Intelligence into action.",
    description:
      "Connect AI with real workflows to reduce repetitive work, improve access to information and support better decisions.",
    examples:
      "AI agents, workflow automation, chatbots, voice receptionists and knowledge systems.",
    cta: "Explore AI",
    href: "/services/ai",
    accent: "#B5A0F5",
    gradient: "linear-gradient(160deg, #21172D 0%, #12151A 60%)",
  },
];

export function ThreeDivisionsSection() {
  return (
    <section
      id="divisions"
      className="py-16 md:py-28 bg-[#08090B] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10 md:space-y-12">
        <div className="max-w-2xl space-y-4">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
            Capabilities
          </span>
          <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(2rem,3.6vw,3.25rem)] leading-[1.12]">
            Three connected disciplines inside one studio.
          </h2>
          <p className="text-[#B2B4BA] text-base leading-relaxed">
            Media creates demand, Digital converts and delivers value, and AI scales operations behind the scenes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {DIVISIONS.map((division) => (
            <div
              key={division.id}
              className="group relative rounded-2xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] p-7 md:p-8 flex flex-col justify-between transition-all duration-200 overflow-hidden"
              style={{ backgroundImage: division.gradient }}
            >
              <div className="space-y-6">
                {/* Division Artwork Motif */}
                <div
                  aria-hidden="true"
                  className="h-32 rounded-xl bg-[#08090B]/70 border border-[#252A32] p-4 flex items-center justify-center relative overflow-hidden group-hover:border-[#3A414B] transition-colors"
                >
                  {division.id === "media" && (
                    <div className="w-full h-full flex items-center justify-center gap-2">
                      <div className="w-10 h-16 rounded border border-[#E58A76]/30 bg-[#E58A76]/5" />
                      <div className="w-24 h-20 rounded-md border border-[#E58A76]/60 bg-[#E58A76]/10 flex items-center justify-center">
                        <div className="w-4 h-4 rounded-full border border-[#E58A76]" />
                      </div>
                      <div className="w-10 h-16 rounded border border-[#E58A76]/30 bg-[#E58A76]/5" />
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

