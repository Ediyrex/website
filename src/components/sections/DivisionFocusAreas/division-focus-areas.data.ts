export interface DiagnosticItem {
  id: string;
  number: string;
  category: string;
  title: string;
  description: string;
  impact: string;
}

export interface DivisionFocusAreasData {
  headerLeft: string;
  headerRight: string;
  headlineLine1: string;
  headlineLine2: string;
  description: string;
  items: readonly DiagnosticItem[];
  closingLabel: string;
  closingStatementWhite: string;
  closingStatementOrange: string;
}

export const DIVISION_FOCUS_AREAS_MAP: Record<string, DivisionFocusAreasData> = {
  branding: {
    headerLeft: "FOCUS AREAS",
    headerRight: "THREE GROWTH FRICTION POINTS",
    headlineLine1: "Where brand growth",
    headlineLine2: "loses momentum.",
    description:
      "The gaps between attention, brand consistency and customer engagement that prevent marketing from working as one connected system.",
    items: [
      {
        id: "paid-media-performance",
        number: "01",
        category: "PAID MEDIA / PERFORMANCE",
        title: "Attention without conversion.",
        description:
          "Paid campaigns burn through budgets when creative hooks are weak and funnel messaging is disconnected.",
        impact: "WEAK CREATIVE / FRAGMENTED FUNNELS",
      },
      {
        id: "brand-launch-experience",
        number: "02",
        category: "BRAND / LAUNCH EXPERIENCE",
        title: "A brand that looks different everywhere.",
        description:
          "Inconsistent packaging, promotional collateral and brand presentation weaken the experience across launch channels.",
        impact: "INCONSISTENT BRAND TOUCHPOINTS",
      },
      {
        id: "organic-customer-lifecycle",
        number: "03",
        category: "ORGANIC / CUSTOMER LIFECYCLE",
        title: "Visibility without follow-through.",
        description:
          "Under-indexed organic search and unsegmented email lifecycle follow-ups leave important opportunities underdeveloped.",
        impact: "SEARCH GAPS / DISCONNECTED FOLLOW-UPS",
      },
    ],
    closingLabel: "THE OBJECTIVE",
    closingStatementWhite: "Attention is only the beginning.",
    closingStatementOrange: "Consistency and follow-through make it count.",
  },

  media: {
    headerLeft: "FOCUS AREAS",
    headerRight: "THREE PRODUCTION FRICTION POINTS",
    headlineLine1: "Where media impact",
    headlineLine2: "loses momentum.",
    description:
      "The gaps between creative storytelling, visual craft and distribution that prevent content from engaging audiences.",
    items: [
      {
        id: "storytelling-retention",
        number: "01",
        category: "STORYTELLING / RETENTION",
        title: "Disconnected brand visuals and low retention.",
        description:
          "Raw podcast or event footage and unfocused creative direction that fails to hold viewer interest.",
        impact: "WEAK HOOKS / VIEWER DROPOFF",
      },
      {
        id: "pacing-shortform",
        number: "02",
        category: "PACING / SHORT-FORM",
        title: "High churn across social reels and shorts.",
        description:
          "Short-form content across Reels, TikTok, and YouTube Shorts suffering from slow editing pacing and generic styling.",
        impact: "LOW RETENTION / WEAK PACING",
      },
      {
        id: "brand-assets-motion",
        number: "03",
        category: "BRAND ASSETS / MOTION",
        title: "Fragmented motion graphics and design systems.",
        description:
          "Lack of unified design templates and motion systems across commercial launches and campaigns.",
        impact: "INCONSISTENT COLLATERAL / WEAK IDENTITY",
      },
    ],
    closingLabel: "THE OBJECTIVE",
    closingStatementWhite: "Visibility is only the beginning.",
    closingStatementOrange: "Narrative craft and retention make it count.",
  },

  digital: {
    headerLeft: "FOCUS AREAS",
    headerRight: "THREE DIGITAL FRICTION POINTS",
    headlineLine1: "Where digital products",
    headlineLine2: "lose momentum.",
    description:
      "The gaps between interface design, engineering performance and data visibility that slow product adoption.",
    items: [
      {
        id: "engineering-performance",
        number: "01",
        category: "ENGINEERING / PERFORMANCE",
        title: "Slow load times and fragile web foundations.",
        description:
          "Generic templates that undermine credibility and fail technical SEO and Core Web Vitals checks.",
        impact: "POOR VITALS / SLOW ARCHITECTURE",
      },
      {
        id: "uiux-flows",
        number: "02",
        category: "UI/UX / PRODUCT FLOWS",
        title: "Cluttered interfaces and onboarding friction.",
        description:
          "Web applications and SaaS flows lacking clear UX hierarchy, intuitive patterns and purposeful extensions.",
        impact: "HIGH CHURN / CONFUSING ONBOARDING",
      },
      {
        id: "data-dashboards",
        number: "03",
        category: "DATA / DASHBOARDS",
        title: "Scattered metrics and opaque operational data.",
        description:
          "Critical business data locked in disconnected silos without dedicated DADV portals and visual analytics.",
        impact: "DATA SILOS / MANUAL REPORTING",
      },
    ],
    closingLabel: "THE OBJECTIVE",
    closingStatementWhite: "Function is only the beginning.",
    closingStatementOrange: "Intuitive craft and reliable speed make it count.",
  },

  ai: {
    headerLeft: "FOCUS AREAS",
    headerRight: "THREE AUTOMATION FRICTION POINTS",
    headlineLine1: "Where intelligent systems",
    headlineLine2: "lose momentum.",
    description:
      "The gaps between AI models, business workflows and operational reliability that prevent systems from delivering real leverage.",
    items: [
      {
        id: "inbound-conversational-ai",
        number: "01",
        category: "INBOUND / CONVERSATIONAL AI",
        title: "Unresponsive leads and missed customer calls.",
        description:
          "Missed inbound calls, unaddressed queries and slow off-hours customer support across web and voice.",
        impact: "LOST LEADS / INCONSISTENT SUPPORT",
      },
      {
        id: "workflows-integrations",
        number: "02",
        category: "WORKFLOWS / INTEGRATIONS",
        title: "Repetitive manual tasks across disconnected tools.",
        description:
          "Time-consuming copy-pasting across CRM, email, spreadsheets and billing platforms without automated pipelines.",
        impact: "MANUAL REPETITION / HUMAN ERROR",
      },
      {
        id: "autonomous-execution",
        number: "03",
        category: "AUTONOMOUS EXECUTION / SAFETY",
        title: "Operational bottlenecks in complex triage.",
        description:
          "Tasks requiring deep context and multi-step action lacking autonomous AI agents with guardrails and oversight.",
        impact: "PROCESS BOTTLENECK / UNLEVERAGED TIME",
      },
    ],
    closingLabel: "THE OBJECTIVE",
    closingStatementWhite: "Automation is only the beginning.",
    closingStatementOrange: "Reliable integration and accuracy make it count.",
  },
};
