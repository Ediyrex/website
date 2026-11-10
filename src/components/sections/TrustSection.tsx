import React from "react";
import { ShieldCheck, FileCheck, Eye } from "lucide-react";

const STANDARDS = [
  {
    icon: Eye,
    title: "Honest Concept Distinction",
    description:
      "Self-initiated explorations and internal R&D prototypes are always clearly labeled as concept projects—never presented as commissioned client work.",
  },
  {
    icon: ShieldCheck,
    title: "Full Ownership & Maintainability",
    description:
      "Codebases, brand systems, and media masters are built cleanly and documented so your organization retains control and flexibility.",
  },
  {
    icon: FileCheck,
    title: "Clear Scope Before Execution",
    description:
      "Every collaboration begins with explicit deliverables, realistic timelines, and direct communication with the people building the work.",
  },
];

export function TrustSection() {
  return (
    <section
      aria-label="Studio Standards and Trust"
      className="py-16 md:py-24 bg-[#0D0F12] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
        <div className="max-w-2xl space-y-3">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
            Studio Commitments
          </span>
          <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.16]">
            Credibility earned through transparency, not inflated claims.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STANDARDS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-3"
              >
                <Icon className="w-5 h-5 text-[#D6B77A]" strokeWidth={1.75} />
                <h3 className="font-heading font-semibold text-lg text-[#F5F3EE]">
                  {item.title}
                </h3>
                <p className="text-sm text-[#B2B4BA] leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
