export type EngagementId = "project-based" | "ongoing-collaboration" | "custom-engagement";

export type EngagementIconKey = "layers" | "users" | "zap";

export interface EngagementModel {
  id: EngagementId;
  index: string;
  title: string;
  shortDesc: string;
  chipLabel: string;
  icon: EngagementIconKey;
  eyebrow: string;
  tags: string;
  panelTitle: string;
  panelSubtitle: string;
  benefits: [string, string, string];
  ctaLabel: string;
  href: string;
}

export interface EngagementFaqItem {
  id: string;
  question: string;
  answer: string;
}

export const ENGAGEMENT_MODELS: readonly EngagementModel[] = [
  {
    id: "project-based",
    index: "01",
    title: "Project-based",
    shortDesc:
      "A clearly defined deliverable such as a digital product, campaign or custom solution with an agreed scope and timeline.",
    chipLabel: "Fixed scope • Defined outcome",
    icon: "layers",
    eyebrow: "GET STARTED QUICKLY",
    tags: "FAST · FLEXIBLE · CLEAR",
    panelTitle: "Custom scope and quotation",
    panelSubtitle: "Get a tailored plan for your project.",
    benefits: [
      "Fixed or flexible scope definition",
      "Discovery and solution architecture",
      "Full cost, timeline and delivery plan",
    ],
    ctaLabel: "Request project-based quote",
    href: "/contact?engagement=project-based",
  },
  {
    id: "ongoing-collaboration",
    index: "02",
    title: "Ongoing collaboration",
    shortDesc:
      "A continuous partnership with a dedicated team, flexible scope and iterative delivery for long-term goals.",
    chipLabel: "Flexible • Scalable team",
    icon: "users",
    eyebrow: "CONTINUOUS MOMENTUM",
    tags: "DEDICATED · ITERATIVE · SCALABLE",
    panelTitle: "Dedicated studio partnership",
    panelSubtitle: "Embed creative, product and AI capacity directly into your roadmap.",
    benefits: [
      "Dedicated multidisciplinary creative and engineering pods",
      "Monthly sprint cadence with priority roadmap adjustments",
      "Unified brand, web, media and automation execution",
    ],
    ctaLabel: "Start ongoing collaboration",
    href: "/contact?engagement=ongoing-collaboration",
  },
  {
    id: "custom-engagement",
    index: "03",
    title: "Custom engagement",
    shortDesc:
      "A tailored model that blends strategy, design and engineering to fit unique requirements and working styles.",
    chipLabel: "Built around you",
    icon: "zap",
    eyebrow: "BESPOKE ARCHITECTURE",
    tags: "HYBRID · STRATEGIC · TAILORED",
    panelTitle: "Tailored collaboration framework",
    panelSubtitle: "Designed around internal workflows, R&D milestones or phased launches.",
    benefits: [
      "Hybrid mix of fixed milestones and advisory sprints",
      "Co-building alongside your internal leadership or tech team",
      "Custom SLAs, security review and phased deployment",
    ],
    ctaLabel: "Design custom engagement",
    href: "/contact?engagement=custom-engagement",
  },
];

export const ENGAGEMENT_FAQS: readonly EngagementFaqItem[] = [
  {
    id: "faq-difference",
    question: "How do I choose between Project-based and Ongoing collaboration?",
    answer:
      "Choose Project-based when you have a clear launch goal—like a flagship site, brand system, or custom AI workflow—with a defined delivery window. Choose Ongoing collaboration if your roadmap evolves every month across campaigns, product iterations, and automation.",
  },
  {
    id: "faq-scoping",
    question: "What happens after I request a quote or submit an enquiry?",
    answer:
      "Within 24–48 business hours, our studio leads review your goals and schedule a focused 30-minute discovery session. From there, you receive a clear scope breakdown, milestone architecture, timeline, and fixed or retainer pricing in USD or INR.",
  },
  {
    id: "faq-timeline",
    question: "How quickly can an engagement kick off?",
    answer:
      "Project-based engagements typically kick off within 5–7 business days of scope alignment. Ongoing partnerships and urgent sprint engagements can often mobilize sooner depending on studio pod availability.",
  },
  {
    id: "faq-capabilities",
    question: "Can one engagement combine branding, web development, media, and AI?",
    answer:
      "Yes—this is how EDIYREX is structured. Every model draws from one connected studio across Creative, Digital, Media, and Intelligence so you never have to coordinate separate agencies or handoffs.",
  },
  {
    id: "faq-ownership",
    question: "Who owns the source code, design files, and systems delivered?",
    answer:
      "You retain 100% ownership of all custom source code, brand assets, media deliverables, and trained workflows upon final milestone payment, complete with documentation and clean repository handoff.",
  },
  {
    id: "faq-switch",
    question: "Can we start with a single project and transition to ongoing collaboration?",
    answer:
      "Many partners begin with a focused initial project—such as a core product build or system audit—and smoothly transition into an Ongoing or Custom model once the foundation is live.",
  },
];

