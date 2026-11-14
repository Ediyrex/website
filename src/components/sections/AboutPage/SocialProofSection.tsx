import React from "react";
import { Eye, ShieldCheck, FileCheck } from "lucide-react";

interface MilestoneMetric {
  value: string;
  label: string;
  description: string;
}

const MILESTONES: readonly MilestoneMetric[] = [
  {
    value: "04",
    label: "Connected Disciplines",
    description: "Branding, Media, Web Engineering, and AI Systems under one roof.",
  },
  {
    value: "20+",
    label: "Projects & Concept Builds",
    description: "Production deployments, published architectures, and enterprise tools.",
  },
  {
    value: "10+",
    label: "Active Client Partners",
    description: "Startups, modern scale-ups, and forward-thinking businesses.",
  },
  {
    value: "100%",
    label: "Client Asset Ownership",
    description: "Every repo, design master, and workflow file is 100% owned by you.",
  },
];

const CREDIBILITY_STANDARDS = [
  {
    icon: Eye,
    title: "Honest Concept Distinction",
    description:
      "Self-initiated explorations and internal R&D prototypes are always clearly labeled as concept projects—never disguised as commissioned work.",
  },
  {
    icon: ShieldCheck,
    title: "Full Code & IP Ownership",
    description:
      "All repositories, design components, and workflow pipelines are transferred cleanly to your organization upon project completion.",
  },
  {
    icon: FileCheck,
    title: "Fixed Scope & Strict Timelines",
    description:
      "Every project starts with unambiguous deliverables, defined milestones, and direct communication with the engineers building the work.",
  },
];

export function SocialProofSection() {
  return (
    <section
      id="credibility"
      aria-label="Social Proof, Milestones and Credibility"
      className="py-16 md:py-24 bg-[#08090B] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-12">
        {/* Section Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6900]" />
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#FF6900]">
              04 / CREDIBILITY &amp; MILESTONES
            </span>
          </div>
          <h2 className="font-heading font-semibold text-[#F5F3EE] text-[clamp(2rem,3.2vw,3rem)] leading-[1.14] tracking-tight">
            Proof in our numbers and engineering standards.
          </h2>
          <p className="text-[#B2B4BA] text-base sm:text-lg leading-relaxed pt-1">
            We don&apos;t rely on vague promises or inflated claims. Credibility is earned through
            tested architectures, transparent scoping, and complete client ownership.
          </p>
        </div>

        {/* Milestone Numbers Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {MILESTONES.map((item) => (
            <div
              key={item.label}
              className="p-6 rounded-2xl bg-[#0D0F12] border border-[#252A32] space-y-2 flex flex-col justify-between"
            >
              <div className="text-[clamp(2rem,3.5vw,3rem)] font-heading font-extrabold text-[#FF6900] leading-none tracking-tight">
                {item.value}
              </div>
              <div className="space-y-1 pt-2 border-t border-[#1E232B]">
                <h3 className="font-heading font-semibold text-sm sm:text-base text-[#F5F3EE]">
                  {item.label}
                </h3>
                <p className="text-xs text-[#8A8F99] leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Studio Credibility Commitments */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          {CREDIBILITY_STANDARDS.map((standard) => {
            const Icon = standard.icon;
            return (
              <div
                key={standard.title}
                className="p-6 sm:p-7 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-3.5"
              >
                <div className="w-9 h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] flex items-center justify-center text-[#D6B77A]">
                  <Icon className="w-4 h-4" strokeWidth={1.75} />
                </div>
                <h3 className="font-heading font-semibold text-base sm:text-lg text-[#F5F3EE]">
                  {standard.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#9EA2A8] leading-relaxed">
                  {standard.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

