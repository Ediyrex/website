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
      className="w-full bg-[#FAF8F5] text-[#0B0D10] py-16 md:py-24 lg:py-28 border-b border-[#EAE5DC]"
    >
      <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          {/* Left Column: Heading, Subtitle, 4 Principles, and CTAs */}
          <div className="lg:col-span-7 xl:col-span-7 flex flex-col justify-between space-y-10">
            {/* Header Block */}
            <div className="space-y-4">
              {/* Display Headline */}
              <h2 className="font-heading font-extrabold text-[clamp(2.5rem,4.4vw,4.25rem)] leading-[1.04] tracking-[-0.035em] text-[#0B0D10]">
                Creative thinking.
                <br />
                Technical execution.
                <br />
                <span className="text-[#FF6900] italic font-heading font-extrabold">
                  One connected process.
                </span>
              </h2>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-[#555962] leading-relaxed max-w-2xl pt-1">
                Client engagements fuel and pressure-test our internal product development &mdash;
                ensuring every pattern we deploy is grounded in real-world engineering.
              </p>
            </div>

            {/* 4 Principles in Responsive Row with Vertical Dividers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[#EAE5DC] pt-2">
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
                    <h3 className="font-heading font-extrabold text-[15px] sm:text-[16px] text-[#0B0D10] tracking-tight leading-snug uppercase pt-1">
                      {principle.title}
                    </h3>
                    <p className="text-xs sm:text-[13px] text-[#555962] leading-relaxed">
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
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6900] text-white text-sm font-bold hover:bg-[#E55E00] transition-colors shadow-sm"
              >
                <span>Explore our studio approach</span>
                <ArrowUpRight className="w-4 h-4 text-white" strokeWidth={2.5} />
              </Link>
              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-transparent border border-[#0B0D10] text-[#0B0D10] text-sm font-semibold hover:bg-[#0B0D10] hover:text-white transition-all duration-200"
              >
                <span>View our work</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right Column: In-House Labs Showcase */}
          <div className="lg:col-span-5 xl:col-span-5">
            <div className="p-6 sm:p-8 rounded-[28px] bg-[#FFFFFF] border border-[#EAE5DC] shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-6">
              {/* Card Header */}
              <div className="flex items-start justify-between gap-4 border-b border-[#EAE5DC] pb-5">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-[0.18em] text-[#FF6900] font-semibold block mb-1">
                    IN-HOUSE LABS
                  </span>
                  <h3 className="font-heading font-extrabold text-xl sm:text-2xl text-[#0B0D10] tracking-tight">
                    Client Services &times; Product R&amp;D
                  </h3>
                </div>
                <span className="shrink-0 px-3.5 py-1 rounded-full border border-[#D9D2C8] text-[10px] font-mono uppercase tracking-wider text-[#555962] bg-[#FAF8F5] font-semibold">
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
                      className="p-5 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-[#EAE5DC] hover:border-[#FF6900]/50 hover:bg-[#FFFFFF] transition-all duration-200 flex items-center gap-5"
                    >
                      {/* Left Icon with Vertical Divider Rule */}
                      <div className="pr-4 border-r border-[#EAE5DC] flex items-center justify-center self-stretch shrink-0">
                        <div className="w-12 h-12 rounded-xl bg-[#FFFFFF] border border-[#FF6900]/30 text-[#FF6900] flex items-center justify-center shrink-0 shadow-sm">
                          <Icon className="w-5 h-5 text-[#FF6900]" />
                        </div>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-heading font-bold text-base text-[#0B0D10] truncate">
                            {product.name}
                          </h4>
                          <span className="shrink-0 text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border border-[#FF6900] text-[#FF6900] bg-[#FF6900]/5 tracking-wider">
                            {product.status}
                          </span>
                        </div>
                        <p className="text-xs sm:text-[13px] text-[#555962] leading-relaxed">
                          {product.tagline}
                        </p>
                        {/* Tech Stack Tags */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {product.techStack.map((tech) => (
                            <span
                              key={tech}
                              className="text-[10px] sm:text-[10.5px] font-mono px-2 py-0.5 rounded-[4px] bg-[#FFFFFF] text-[#555962] border border-[#EAE5DC] font-medium"
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
