export interface StudioDiscipline {
  id: string;
  number: string;
  title: string;
  descriptor: string;
  href: string;
}

export const STUDIO_DISCIPLINES: readonly StudioDiscipline[] = [
  {
    id: "branding-marketing",
    number: "01",
    title: "BRANDING & MARKETING",
    descriptor: "Positioning / Identity / Growth",
    href: "/services/branding",
  },
  {
    id: "media-content-production",
    number: "02",
    title: "MEDIA & CONTENT PRODUCTION",
    descriptor: "Stories / Content / Motion",
    href: "/services/media",
  },
  {
    id: "web-apps-digital-products",
    number: "03",
    title: "WEB, APPS & DIGITAL PRODUCTS",
    descriptor: "Experiences / Platforms / Software",
    href: "/services/digital",
  },
  {
    id: "ai-automation",
    number: "04",
    title: "AI & AUTOMATION",
    descriptor: "Agents / Intelligence / Systems",
    href: "/services/ai",
  },
];

