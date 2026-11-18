export interface IndustrySector {
  id: string;
  number: string;
  title: string;
  tagline: string;
  description: string;
  deliverables: readonly string[];
  ctaLabel: string;
  slug: string;
}

export const INDUSTRIES_DATA: readonly IndustrySector[] = [
  {
    id: "ai-devtools",
    number: "01",
    title: "AI, Machine Learning & DevTools",
    tagline: "AUTONOMOUS SYSTEMS / INTERACTIVE RUNTIMES",
    description:
      "Production-grade agent frameworks, low-latency WebRTC voice streaming interfaces, interactive model playgrounds, and technical product documentation for AI-first engineering teams.",
    deliverables: [
      "Multi-Agent Orchestrator UI & Trace Dashboards",
      "Real-Time WebRTC & LiveKit Voice Streaming",
      "Interactive Model Playgrounds & API Docs",
      "Technical Product Launch Visuals & 3D Motion",
    ],
    ctaLabel: "Enquire for AI & DevTools",
    slug: "ai-devtools",
  },
  {
    id: "b2b-saas",
    number: "02",
    title: "B2B SaaS & Cloud Infrastructure",
    tagline: "TELEMETRY DASHBOARDS / CONVERSION ENGINES",
    description:
      "High-contrast web applications, real-time telemetry dashboards, virtualized data tables, and scalable design systems built on Next.js for high-growth software companies.",
    deliverables: [
      "Streaming Telemetry & Data Visualization",
      "Self-Serve Trial-to-Paid Conversion Flows",
      "Multi-Tenant UI/UX & Design Systems",
      "High-Performance Marketing Platforms",
    ],
    ctaLabel: "Enquire for B2B SaaS",
    slug: "b2b-saas",
  },
  {
    id: "dtc-commerce",
    number: "03",
    title: "DTC, Retail & Consumer Tech",
    tagline: "BRAND EXPERIENCE / HIGH-VELOCITY COMMERCE",
    description:
      "Full-funnel brand identities, photorealistic 3D product rendering, packaging dielines, and headless commerce architectures built for customer loyalty and high average order value.",
    deliverables: [
      "Complete Visual Identity & Packaging Dielines",
      "Photorealistic 3D Product Renders & Motion",
      "Headless Next.js Storefronts & Custom Cart UX",
      "Programmatic Creative & Vertical Video Pipelines",
    ],
    ctaLabel: "Enquire for DTC & Retail",
    slug: "dtc-commerce",
  },
  {
    id: "fintech",
    number: "04",
    title: "FinTech & Financial Infrastructure",
    tagline: "AUDITABLE SYSTEMS / TRUST-LED INTERFACES",
    description:
      "High-security user portals, multi-step KYC/KYB onboarding flows, automated ledger reconciliation pipelines, and institutional visual authority engineered for regulatory compliance.",
    deliverables: [
      "Institutional-Grade Brand Authority & Portals",
      "Multi-Step KYC / KYB Verification UX",
      "Automated Financial Reconciliation (n8n)",
      "Audit Trails & Encrypted Client Workflows",
    ],
    ctaLabel: "Enquire for FinTech",
    slug: "fintech",
  },
  {
    id: "health-biotech",
    number: "05",
    title: "Biotech, HealthTech & Life Sciences",
    tagline: "SCIENTIFIC RIGOR / ACCESSIBLE DIGITAL SYSTEMS",
    description:
      "Interactive 3D biomolecular structure viewers, patient engagement portals, clinical trial matchmaking platforms, and HIPAA/GDPR-compliant responsive web architectures.",
    deliverables: [
      "Interactive 3D Biomolecular Structure Viewers (Mol*)",
      "Clinical Trial Discovery & Patient Portals",
      "Scientific Publication Visuals & Media",
      "HIPAA & GDPR Compliant Web Architectures",
    ],
    ctaLabel: "Enquire for Biotech",
    slug: "health-biotech",
  },
  {
    id: "enterprise-ops",
    number: "06",
    title: "Professional Services & Modern Operators",
    tagline: "AUTONOMOUS OPERATIONS / CRM & ERP SYSTEMS",
    description:
      "We eliminate fragmented spreadsheets and manual coordination through end-to-end n8n workflow pipelines, AI inbound voice receptionists, custom ERP connectors, and unified team hubs.",
    deliverables: [
      "End-to-End n8n & Webhook Workflow Pipelines",
      "Autonomous AI Inbound Voice Receptionists",
      "Custom Internal Operations & ERP Portals",
      "Automated Document, Invoice & Contract Parsing",
    ],
    ctaLabel: "Enquire for Operations",
    slug: "enterprise-ops",
  },
];
