import React from "react";
import Link from "next/link";
import { ArrowUpRight, Layers, Mic } from "lucide-react";

interface StudioPrinciple {
  index: string;
  title: string;
  description: string;
}

const PRINCIPLES: readonly StudioPrinciple[] = [
  {
    index: "01",
    title: "ONE CONNECTED TEAM",
    description:
      "Creative, digital and AI work are planned together from day one, eliminating fragmented agency handoffs.",
  },
  {
    index: "02",
    title: "BUILT AROUND THE OBJECTIVE",
    description:
      "Scope, visual treatment and technology stack are chosen strictly according to the business problem.",
  },
  {
    index: "03",
    title: "CRAFT MEETS FUNCTION",
    description:
      "Editorial visual quality and practical everyday usability matter equally in every deliverable.",
  },
  {
    index: "04",
    title: "DESIGNED TO EVOLVE",
    description:
      "Deliverables are documented, maintainable and engineered cleanly for future iteration and scale.",
  },
];

interface InHouseProduct {
  id: string;
  name: string;
  status: "BETA" | "ALPHA" | "RESEARCH";
  tagline: string;
  techStack: readonly string[];
  icon: React.ComponentType<{ className?: string }>;
}

function RenderFlowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="18" x="3" y="3" rx="3" />
      <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
    </svg>
  );
}

const IN_HOUSE_PRODUCTS: readonly InHouseProduct[] = [
  {
    id: "agent-core",
    name: "AgentCore Orchestrator",
    status: "BETA",
    tagline: "Autonomous multi-agent execution framework with verifiable audit logs.",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "FastAPI", "Vector DB"],
    icon: Layers,
  },
  {
    id: "vocalis",
    name: "Vocalis Voice Runtime",
    status: "ALPHA",
    tagline:
      "Ultra-low-latency real-time voice streaming gateway for inbound customer operations.",
    techStack: ["WebRTC", "Node.js", "LiveKit", "Whisper", "PostgreSQL"],
    icon: Mic,
  },
  {
    id: "renderflow",
    name: "RenderFlow",
    status: "RESEARCH",
    tagline: "Programmatic short-form video batch generator for high-velocity brands.",
    techStack: ["FFmpeg", "Next.js", "Tailwind CSS", "Cloudinary"],
    icon: RenderFlowIcon,
  },
];

export function WhyEdiyrexSection() {
  return (
    <section
      id="why-ediyrex"
      aria-label="Why Ediyrex — Studio Philosophy & In-House Labs"
      className="w-full bg-[#08090B] text-[#F5F3EE] py-16 md:py-24 lg:py-28 border-b border-[#222731]"
    >
      <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left Column: Heading, Subtitle, 4 Principles, and CTAs */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between space-y-10">
            {/* Header Block */}
            <div className="space-y-4">
              {/* Tag / Kicker with Orange Square and Divider */}
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 bg-[#FF6900] inline-block shrink-0" />
                <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#C2C6CE]">
                  WHY EDIYREX
                </span>
                <span
                  aria-hidden="true"
                  className="h-px bg-[#262B34] w-24 sm:w-36 inline-block"
                />
              </div>

              {/* Display Headline */}
              <h2 className="font-heading font-extrabold text-[clamp(2.5rem,4.4vw,4.25rem)] leading-[1.04] tracking-[-0.035em] text-[#F5F3EE]">
                Creative thinking.
                <br />
                Technical execution.
                <br />
                <span className="text-[#FF6900] italic font-heading font-normal">
                  One connected process.
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#9EA2A8] leading-relaxed max-w-2xl pt-1">
                Client engagements fuel and pressure-test our internal product development &mdash;
                ensuring every pattern we deploy is grounded in real-world engineering.
              </p>
            </div>

            {/* 4 Principles in Responsive Row with Vertical Dividers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#222731] pt-2">
              {PRINCIPLES.map((principle, idx) => (
                <div
                  key={principle.index}
                  className={`flex flex-col justify-between space-y-4 ${
                    idx === 0 ? "sm:pr-5 xl:pr-6" : "sm:px-5 xl:px-6"
                  } ${idx > 0 ? "pt-5 sm:pt-0" : ""}`}
                >
                  <div className="space-y-2.5">
                    {/* Orange-bordered pill badge */}
                    <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-[5px] border border-[#FF6900] text-[#FF6900] font-mono text-[11px] font-bold tracking-wider">
                      {principle.index}
                    </span>
                    <h3 className="font-heading font-extrabold text-[15px] sm:text-[16px] text-[#F5F3EE] tracking-tight leading-snug uppercase pt-1">
                      {principle.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#8C919C] leading-relaxed">
                      {principle.description}
                    </p>
                  </div>
                  {/* Bottom Orange Accent Bar */}
                  <span
                    aria-hidden="true"
                    className="block w-10 h-[2.5px] bg-[#FF6900]"
                  />
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                href="#philosophy"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6900] text-[#090A0D] text-sm font-bold hover:bg-[#E55E00] transition-colors shadow-sm"
              >
                <span>Explore our studio approach</span>
                <ArrowUpRight className="w-4 h-4 text-[#090A0D]" strokeWidth={2.5} />
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-transparent border border-[#343B47] text-[#F5F3EE] text-sm font-semibold hover:border-[#F5F3EE] hover:bg-[#12151A] transition-all duration-200"
              >
                <span>View our work</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: In-House Labs Showcase */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="p-6 sm:p-8 rounded-[28px] bg-[#0E1015] border border-[#222731] space-y-6">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#222731] pb-5">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#FF6900] font-semibold block mb-1">
                    IN-HOUSE LABS
                  </span>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#F5F3EE] tracking-tight">
                    Client Services &times; Product R&amp;D
                  </h3>
                </div>
                <span className="shrink-0 px-3.5 py-1 rounded-full border border-[#2E3542] text-[10px] font-mono uppercase tracking-wider text-[#8C919C] bg-[#13171E] font-semibold">
                  HYBRID STUDIO
                </span>
              </div>

              {/* 3 In-House Products */}
              <div className="space-y-4">
                {IN_HOUSE_PRODUCTS.map((product) => {
                  const Icon = product.icon;
                  return (
                    <div
                      key={product.id}
                      className="p-5 sm:p-6 rounded-2xl bg-[#12151D] border border-[#222731] hover:border-[#333B49] transition-all duration-200 flex items-center gap-5"
                    >
                      {/* Left Icon with Vertical Divider Rule */}
                      <div className="pr-4 border-r border-[#222731] flex items-center justify-center self-stretch shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-[#171B25] border border-[#262D3D] text-[#FF6900] flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-[#FF6900]" />
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-heading font-bold text-base text-[#F5F3EE] truncate">
                            {product.name}
                          </h4>
                          <span className="shrink-0 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border border-[#FF6900] text-[#FF6900] tracking-wider">
                            {product.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-[#8C919C] leading-relaxed">
                          {product.tagline}
                        </p>
                        {/* Tech Stack Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {product.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] sm:text-[10.5px] font-mono px-2 py-0.5 rounded-[4px] bg-[#161B24] text-[#8C919C] border border-[#262D3D] font-medium"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
