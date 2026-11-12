export interface PhilosophyDivision {
  id: string;
  number: string;
  title: string;
  description: string;
  href: string;
}

export const PHILOSOPHY_DIVISIONS: readonly PhilosophyDivision[] = [
  {
    id: "branding-marketing",
    number: "01",
    title: "BRANDING & MARKETING",
    description:
      "Positioning, identity and growth strategies that create lasting brand value.",
    href: "/services/branding",
  },
  {
    id: "media-content-production",
    number: "02",
    title: "MEDIA & PRODUCTION",
    description:
      "Stories, content and motion that bring ideas to life across platforms.",
    href: "/services/media",
  },
  {
    id: "web-apps-digital-products",
    number: "03",
    title: "WEB, APPS & DIGITAL PRODUCTS",
    description:
      "Scalable digital experiences, platforms and software built for real business needs.",
    href: "/services/digital",
  },
  {
    id: "ai-automation",
    number: "04",
    title: "AI & AUTOMATION",
    description:
      "Agents, workflows and intelligent systems that accelerate how work gets done.",
    href: "/services/ai",
  },
];

