import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Cpu, Cloud, ShoppingBag, ShieldCheck, Activity, Briefcase } from "lucide-react";

export const metadata: Metadata = {
  title: "Industries We Serve | Ediyrex Studio",
  description:
    "Explore how Ediyrex Studio deploys Branding, Media Production, Digital Engineering, and AI Systems across high-growth industries.",
  alternates: {
    canonical: "/industries",
  },
};

interface IndustryItem {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  capabilities: readonly string[];
  icon: React.ComponentType<{ className?: string }>;
}

const INDUSTRIES: readonly IndustryItem[] = [
  {
    id: "ai-devtools",
    number: "01",
    title: "AI, Machine Learning & DevTools",
    tagline: "Autonomous Agent Architectures & Technical Product Marketing",
    description:
      "We design and build production-grade agentic frameworks, low-latency voice runtime interfaces, interactive model playgrounds, and technical documentation for AI-first companies.",
    capabilities: [
      "Multi-agent orchestrator UI & audit dashboards",
      "Real-time WebRTC / LiveKit voice streaming integrations",
      "Interactive technical documentation & API explorers",
      "High-craft 3D product motion graphics & launch films",
    ],
    icon: Cpu,
  },
  {
    id: "b2b-saas",
    number: "02",
    title: "B2B SaaS & Cloud Platforms",
    tagline: "High-Performance Web Platforms & Telemetry Systems",
    description:
      "For software companies outgrowing generic templates, we build bespoke Next.js platforms, interactive onboarding experiences, telemetry dashboards, and scalable brand systems.",
    capabilities: [
      "High-converting marketing sites & programmatic SEO",
      "Real-time analytics & DADV data visualization dashboards",
      "Enterprise design systems & component libraries",
      "Self-serve trial-to-paid conversion flow optimization",
    ],
    icon: Cloud,
  },
  {
    id: "dtc-commerce",
    number: "03",
    title: "DTC, Retail & Consumer Tech",
    tagline: "Motion Narratives & High-Velocity Content Engines",
    description:
      "We produce high-impact brand identities, photorealistic 3D product renders, programmatic vertical video pipelines, and headless commerce storefronts engineered for retention.",
    capabilities: [
      "Custom 3D product rendering & motion graphics",
      "Programmatic short-form video batching via RenderFlow",
      "Headless storefronts & headless CMS architectures",
      "Visual identity, packaging design & unboxing systems",
    ],
    icon: ShoppingBag,
  },
  {
    id: "fintech",
    number: "04",
    title: "FinTech & Financial Infrastructure",
    tagline: "Auditable Systems & Trust-Driven Interfaces",
    description:
      "Building trust in finance requires spotless visual authority and rock-solid software. We design secure user portals, institutional marketing assets, and auditable transaction workflows.",
    capabilities: [
      "Institutional-grade web design & visual identity",
      "Multi-step KYC, onboarding & transaction flow UX",
      "Automated financial reconciliation pipelines (n8n)",
      "Strict data privacy, encryption & security compliance",
    ],
    icon: ShieldCheck,
  },
  {
    id: "health-biotech",
    number: "05",
    title: "Biotech, HealthTech & Life Sciences",
    tagline: "Complex Data Visualization & Regulatory Precision",
    description:
      "From molecular 3D structural visualizers to secure clinical portals, we bridge deep scientific rigor with accessible, modern digital design.",
    capabilities: [
      "Interactive 3D biomolecular structure viewers (Mol*)",
      "Patient portals & clinical trial discovery platforms",
      "Research publication visualization & scientific media",
      "HIPAA/GDPR-compliant responsive web architectures",
    ],
    icon: Activity,
  },
  {
    id: "enterprise-ops",
    number: "06",
    title: "Professional Services & Modern Operators",
    tagline: "Workflow Automation & Autonomous Back-Office Systems",
    description:
      "We replace fragmented spreadsheets and manual data entry with unified n8n automation pipelines, AI voice receptionists, custom ERP connectors, and internal productivity hubs.",
    capabilities: [
      "End-to-end n8n & webhook automation architectures",
      "AI inbound voice agents for lead capture & triage",
      "Custom internal operations portals & CRM integrations",
      "Automated invoice, contract & document parsing engines",
    ],
    icon: Briefcase,
  },
];

export default function IndustriesPage() {
  return (
    <div className="bg-[#08090B] text-[#F5F2EC] min-h-screen">
      {/* Hero Section */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 border-b border-[#262A33]">
        <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 space-y-6">
          {/* Kicker */}
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#FF6900] inline-block shrink-0" />
            <span className="text-xs sm:text-[13px] font-mono font-bold uppercase tracking-[0.18em] text-[#F5F2EC]">
              SECTOR FOCUS &middot; INDUSTRIES
            </span>
            <span
              aria-hidden="true"
              className="h-px bg-[#262A33] w-24 sm:w-48 inline-block"
            />
          </div>

          {/* Headline */}
          <h1 className="font-heading font-extrabold text-[clamp(2.75rem,5.5vw,4.75rem)] leading-[1.0] tracking-[-0.035em] text-[#F5F2EC]">
            Connected execution across
            <br />
            <span className="text-[#FF6900] italic font-heading font-normal">
              specialized sectors.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-[16px] sm:text-[18px] text-[#898D94] leading-relaxed max-w-3xl pt-1">
            Every industry moves at its own velocity with unique compliance, technical architecture,
            and customer expectations. We adapt our four integrated disciplines to solve the exact
            operational and creative challenges of each domain.
          </p>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-16 md:py-24 border-b border-[#262A33]">
        <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {INDUSTRIES.map((ind) => {
              const Icon = ind.icon;
              return (
                <div
                  key={ind.id}
                  className="p-6 sm:p-8 rounded-[20px] bg-[#0C0D11] border border-[#222731] hover:border-[#FF6900]/50 transition-all duration-200 flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    {/* Top Row: Number & Icon */}
                    <div className="flex items-center justify-between border-b border-[#1E232B] pb-4">
                      <span className="font-heading font-extrabold text-3xl text-[#FF6900] leading-none">
                        {ind.number}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-[#12151D] border border-[#262D3D] text-[#FF6900] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-1">
                      <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#F5F2EC] tracking-tight">
                        {ind.title}
                      </h2>
                      <p className="font-mono text-xs text-[#FF6900] font-semibold uppercase tracking-wider">
                        {ind.tagline}
                      </p>
                    </div>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-[#898D94] leading-relaxed">
                      {ind.description}
                    </p>
                  </div>

                  {/* Capabilities List */}
                  <div className="pt-4 border-t border-[#1E232B] space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#666B75] block">
                      Proven Deliverables
                    </span>
                    <ul className="space-y-1.5">
                      {ind.capabilities.map((cap) => (
                        <li
                          key={cap}
                          className="text-xs text-[#C2C6CE] flex items-start gap-2"
                        >
                          <span className="text-[#FF6900] font-mono mt-0.5">&rarr;</span>
                          <span>{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Discovery Call & Custom Sector CTA */}
      <section className="py-16 md:py-24 bg-[#0C0D11]">
        <div className="max-w-[1450px] mx-auto px-5 sm:px-8 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-2 max-w-2xl">
            <span className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-[#FF6900] block">
              CUSTOM DOMAIN ENGAGEMENTS
            </span>
            <h3 className="font-heading font-extrabold text-2xl sm:text-3xl text-[#F5F2EC] tracking-tight">
              Don&apos;t see your specific sector listed?
            </h3>
            <p className="text-sm sm:text-base text-[#898D94] leading-relaxed">
              Our four connected disciplines are modular by design. We frequently adapt our
              playbooks to bespoke industries, regulated environments, and emerging technologies.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6900] text-[#08090B] font-mono text-xs font-bold uppercase tracking-wider hover:bg-[#E55E00] transition-colors shadow-sm"
            >
              <span>SCHEDULE AN INDUSTRY DISCOVERY CALL</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>

            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-transparent border border-[#343B47] text-[#F5F2EC] font-mono text-xs font-bold uppercase tracking-wider hover:border-[#F5F2EC] hover:bg-[#12151D] transition-all"
            >
              <span>EXPLORE SERVICES</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

