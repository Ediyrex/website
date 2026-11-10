import { ProjectItem } from "@/types";

export const PROJECTS_DATA: ProjectItem[] = [
  {
    id: "proj-1",
    slug: "nexus-automations-os",
    title: "Autonomous Ops Agent & Workflow Suite",
    summary:
      "Concept architecture for an autonomous enterprise operations hub integrating multi-agent coordination, document parsing, and human-in-the-loop review.",
    category: "ai",
    servicesDemonstrated: [
      "Autonomous AI Agents",
      "Business Workflow Automation",
      "AI Research & Knowledge Systems (RAG)",
      "SaaS Products & Dashboards",
    ],
    coverImage: "/portfolio/concept-ai-agent.svg",
    description:
      "An internal studio blueprint exploring how multi-agent architectures can coordinate across ERP, CRM, and communication platforms to streamline invoice reconciliation and supplier workflows.",
    challenge:
      "Back-office operations frequently lose significant team hours moving structured data between disconnected tools and reviewing recurring contract clauses manually.",
    approach:
      "Designed a multi-agent hierarchy featuring an orchestrator agent, a document-extraction specialist, and an auditable human-in-the-loop review queue built on Next.js and PostgreSQL.",
    outcomes: [
      "End-to-end multi-agent state machine blueprint with deterministic handoffs",
      "Structured confidence-scored audit trails for every automated action",
    ],
    isConcept: true,
    featured: true,
    isPublished: true,
    createdAt: "2026-10-15T00:00:00Z",
    updatedAt: "2026-11-01T00:00:00Z",
  },
  {
    id: "proj-2",
    slug: "lumina-cinematic-campaign",
    title: "Lumina Brand Identity & Motion Narrative",
    summary:
      "Visual identity, 3D product motion graphics, and short-form video system created as a concept showcase for sustainable consumer hardware.",
    category: "media",
    servicesDemonstrated: [
      "Brand Films & Commercials",
      "Motion Graphics & Animation",
      "Reels & Short-Form Video",
      "Brand Identity & Graphic Design",
    ],
    coverImage: "/portfolio/concept-media-lumina.svg",
    description:
      "An exploration in high-contrast cinematic storytelling, combining product motion renders with editorial typography to demonstrate structured short-form social pacing.",
    challenge:
      "Translating technical hardware engineering into clear, emotionally resonant visual hooks built for modern vertical and widescreen formats.",
    approach:
      "Developed an original narrative storyboard, modular motion system, and multi-variant vertical opening cuts tailored for social distribution.",
    outcomes: [
      "Unified brand motion guidelines and typographic asset kit",
      "Turnkey multi-aspect master templates (16:9 widescreen and 9:16 vertical)",
    ],
    isConcept: true,
    featured: true,
    isPublished: true,
    createdAt: "2026-09-20T00:00:00Z",
    updatedAt: "2026-10-28T00:00:00Z",
  },
  {
    id: "proj-3",
    slug: "strata-cloud-dashboard",
    title: "Strata Cloud Metrics & Telemetry Platform",
    summary:
      "High-contrast SaaS web application and modular design system engineered for streaming telemetry workflows and developer tooling.",
    category: "digital",
    servicesDemonstrated: [
      "Website Design & Development",
      "SaaS Products & Dashboards",
      "UI / UX Design",
      "Full-Stack App Development",
    ],
    coverImage: "/portfolio/concept-digital-strata.svg",
    description:
      "An interface architecture prototype designed to deliver responsive rendering and legible typography across dense time-series telemetry tables and workspace views.",
    challenge:
      "Complex operational dashboards often suffer from cluttered visual hierarchy, sluggish DOM updates, and inconsistent keyboard accessibility.",
    approach:
      "Engineered a clean design token library using Tailwind CSS and Next.js App Router, pairing virtualized table views with layout-stable chart containers.",
    outcomes: [
      "Modular React component library with consistent semantic tokens",
      "Full keyboard navigation and accessible contrast architecture",
    ],
    isConcept: true,
    featured: true,
    isPublished: true,
    createdAt: "2026-08-10T00:00:00Z",
    updatedAt: "2026-10-15T00:00:00Z",
  },
  {
    id: "proj-4",
    slug: "vocalis-voice-receptionist",
    title: "Vocalis Intelligent Voice Receptionist",
    summary:
      "Low-latency conversational voice agent architecture designed for natural inbound call handling, calendar scheduling, and structured lead capture.",
    category: "hybrid",
    servicesDemonstrated: [
      "AI Voice Receptionist",
      "AI Agents",
      "Business Workflow Automation",
      "Custom AI Applications",
    ],
    coverImage: "/portfolio/concept-hybrid-voice.svg",
    description:
      "An internal studio R&D prototype combining streaming audio transport, real-time speech transcription, tool-calling state guards, and neural voice synthesis.",
    challenge:
      "Replacing rigid touch-tone phone trees with responsive conversational voice workflows that reliably capture structured booking details.",
    approach:
      "Designed an event-driven streaming audio pipeline paired with deterministic state-machine guardrails to validate appointment details before dispatch.",
    outcomes: [
      "Streaming voice-turn orchestration with interruptible speech handling",
      "Validated JSON payload dispatch into external booking and CRM webhooks",
    ],
    isConcept: true,
    featured: true,
    isPublished: true,
    createdAt: "2026-10-01T00:00:00Z",
    updatedAt: "2026-11-05T00:00:00Z",
  },
];
