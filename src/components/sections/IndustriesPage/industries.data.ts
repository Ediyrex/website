export interface SectorRecord {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  deliverables: readonly string[];
  ctaLabel: string;
  featured: boolean;
  published: boolean;
  displayOrder: number;
}

export const INDUSTRY_HERO_CONFIG = {
  chapterNumber: "05",
  title: "INDUSTRIES / SECTOR DIRECTORY",
  rightMetadata: "EDYREX / VERTICALS",
  headline: {
    line1: "Different industries.",
    line2: "Different realities.",
    line3: "One connected studio.",
  },
  description:
    "Every industry has its own customers, operational challenges and expectations. We combine branding, media, digital products and AI to build solutions around how each business actually works.",
  primaryCta: {
    label: "EXPLORE INDUSTRIES",
    targetId: "industry-directory",
  },
  secondaryCta: {
    label: "DISCUSS YOUR SECTOR",
    href: "/contact",
  },
  disciplines: [
    { number: "01", label: "BRANDING" },
    { number: "02", label: "MEDIA" },
    { number: "03", label: "DIGITAL" },
    { number: "04", label: "AI" },
  ],
  bottomSignature: "ONE STUDIO / FOUR CONNECTED DISCIPLINES",
};

export const INITIAL_SECTORS: readonly SectorRecord[] = [
  {
    id: "healthcare-clinics",
    slug: "healthcare-clinics",
    name: "Healthcare & Clinics",
    tagline: "PATIENT SYSTEMS / REGULATORY AUTHORITY",
    description:
      "Accessible clinic portals, appointment scheduling flows, medical practice branding, and compliant patient communication systems.",
    deliverables: [
      "Patient Scheduling & Triage Portals",
      "Medical Practice Brand Identity",
      "HIPAA/GDPR Compliant Inbound Flows",
      "Service & Location Landing Pages",
    ],
    ctaLabel: "Enquire for Healthcare",
    featured: true,
    published: true,
    displayOrder: 1,
  },
  {
    id: "real-estate-property",
    slug: "real-estate-property",
    name: "Real Estate & Property",
    tagline: "PROPERTY PORTALS / COMMERCIAL PRESENTATIONS",
    description:
      "Interactive property listing platforms, high-end architectural pitch decks, lead qualification automations, and developer brand systems.",
    deliverables: [
      "Custom Property Listing & Search Portals",
      "Architectural Pitch Decks & Brochures",
      "Automated Buyer & Tenant Qualification",
      "3D Virtual Tours & Interactive Floorplans",
    ],
    ctaLabel: "Enquire for Real Estate",
    featured: true,
    published: true,
    displayOrder: 2,
  },
  {
    id: "restaurants-cafes",
    slug: "restaurants-cafes",
    name: "Restaurants & Cafes",
    tagline: "HOSPITALITY NARRATIVES / DIRECT ORDERING",
    description:
      "Brand identities for culinary destinations, visual menu systems, direct ordering portals, and social content pipelines that build local loyalty.",
    deliverables: [
      "Culinary Identity & Menu Systems",
      "Direct Ordering & Reservation UX",
      "High-Craft Food & Beverage Video Media",
      "Local SEO & Multi-Location Discovery",
    ],
    ctaLabel: "Enquire for Hospitality",
    featured: true,
    published: true,
    displayOrder: 3,
  },
  {
    id: "retail-ecommerce",
    slug: "retail-ecommerce",
    name: "Retail & E-commerce",
    tagline: "HIGH-CONVERTING STOREFRONTS / D2C SYSTEMS",
    description:
      "High-performance headless storefronts, photorealistic 3D product renders, unboxing packaging dielines, and conversion-optimized checkout flows.",
    deliverables: [
      "Headless Next.js Commerce Storefronts",
      "Product Packaging & Dielines",
      "3D Motion Product Visuals",
      "Email Onboarding & Win-Back Flows",
    ],
    ctaLabel: "Enquire for Retail",
    featured: true,
    published: true,
    displayOrder: 4,
  },
  {
    id: "agencies-white-label",
    slug: "agencies-white-label",
    name: "Agencies & White-label",
    tagline: "DEVELOPMENT PARTNERSHIP / PRODUCTION CAPACITY",
    description:
      "White-label design engineering, turnkey motion graphics, and technical implementation partnerships for creative and marketing agencies.",
    deliverables: [
      "White-Label Next.js Full-Stack Engineering",
      "Motion Graphics & 3D Asset Batching",
      "Overflow Agency Delivery Sprints",
      "Client-Ready Technical Hand-offs",
    ],
    ctaLabel: "Enquire for Agencies",
    featured: true,
    published: true,
    displayOrder: 5,
  },
  {
    id: "gyms-fitness-sports",
    slug: "gyms-fitness-sports",
    name: "Gyms, Fitness & Sports",
    tagline: "MEMBER ACQUISITION / ENGAGEMENT SYSTEMS",
    description:
      "High-energy brand systems, member onboarding applications, recurring subscription flows, and motivational video content pipelines.",
    deliverables: [
      "Membership Sign-Up & Trial Funnels",
      "Studio Brand Identity & Signage",
      "Short-Form Social Video Engines",
      "Class Booking & Mobile Web Portals",
    ],
    ctaLabel: "Enquire for Fitness",
    featured: true,
    published: true,
    displayOrder: 6,
  },
  {
    id: "construction-builders",
    slug: "construction-builders",
    name: "Construction & Builders",
    tagline: "ESTIMATION FLOWS / COMMERCIAL AUTHORITY",
    description:
      "Contractor portfolios, project estimation quote funnels, bid proposal decks, and local search infrastructure for commercial builders.",
    deliverables: [
      "Project Showcase & Bid Proposal Decks",
      "Instant Quote & Estimation Calculators",
      "Subcontractor & Supplier Inbound Forms",
      "Local Commercial SEO Dominance",
    ],
    ctaLabel: "Enquire for Construction",
    featured: true,
    published: true,
    displayOrder: 7,
  },
  {
    id: "education-coaching",
    slug: "education-coaching",
    name: "Education & Coaching",
    tagline: "LEARNING PORTALS / COURSE CONVERSION",
    description:
      "Course platform UX, student onboarding workflows, educator personal branding, and high-converting curriculum launch funnels.",
    deliverables: [
      "Custom Student Learning Portals (LMS)",
      "Curriculum Launch & Sales Funnels",
      "Educational Video & Slide Systems",
      "Automated Student Lifecycle Sequences",
    ],
    ctaLabel: "Enquire for Education",
    featured: true,
    published: true,
    displayOrder: 8,
  },
  {
    id: "finance-fintech",
    slug: "finance-fintech",
    name: "Finance & Fintech",
    tagline: "INSTITUTIONAL TRUST / REGULATORY INTERFACES",
    description:
      "Institutional financial branding, secure client portals, KYC onboarding journeys, and automated reconciliation workflow pipelines.",
    deliverables: [
      "Institutional Brand Systems & Pitch Decks",
      "Secure KYC/KYB Onboarding Journeys",
      "Automated Reconciliation Pipelines (n8n)",
      "Regulatory-Compliant Client Portals",
    ],
    ctaLabel: "Enquire for Finance",
    featured: true,
    published: true,
    displayOrder: 9,
  },
  {
    id: "ai-devtools",
    slug: "ai-devtools",
    name: "AI & DevTools",
    tagline: "AUTONOMOUS SYSTEMS / INTERACTIVE RUNTIMES",
    description:
      "Production-grade agent frameworks, low-latency WebRTC voice streaming interfaces, interactive model playgrounds, and technical product documentation.",
    deliverables: [
      "Multi-Agent Orchestrator UI & Trace Dashboards",
      "Real-Time WebRTC & LiveKit Voice Streaming",
      "Interactive Model Playgrounds & API Docs",
      "Technical Product Launch Visuals & 3D Motion",
    ],
    ctaLabel: "Enquire for AI & DevTools",
    featured: false,
    published: true,
    displayOrder: 10,
  },
  {
    id: "b2b-saas",
    slug: "b2b-saas",
    name: "B2B SaaS & Cloud",
    tagline: "TELEMETRY DASHBOARDS / CONVERSION ENGINES",
    description:
      "High-contrast web applications, real-time telemetry dashboards, virtualized data tables, and scalable design systems built on Next.js.",
    deliverables: [
      "Streaming Telemetry & Data Visualization",
      "Self-Serve Trial-to-Paid Conversion Flows",
      "Multi-Tenant UI/UX & Design Systems",
      "High-Performance Marketing Platforms",
    ],
    ctaLabel: "Enquire for B2B SaaS",
    featured: false,
    published: true,
    displayOrder: 11,
  },
];
