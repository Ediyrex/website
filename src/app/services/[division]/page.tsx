import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { ServiceDivision } from "@/types";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";
import { DivisionManifestoHero } from "@/components/sections/DivisionManifestoHero/DivisionManifestoHero";
import { DivisionFocusAreas } from "@/components/sections/DivisionFocusAreas/DivisionFocusAreas";
import { DivisionCapabilitiesRegister } from "@/components/sections/DivisionCapabilitiesRegister/DivisionCapabilitiesRegister";
import { RelevantBlueprints } from "@/components/sections/RelevantBlueprints/RelevantBlueprints";

export const instant = false;

const DIVISION_CONFIG: Record<
  ServiceDivision,
  {
    label: string;
    title: string;
    headline: string;
    description: string;
    accent: string;
    gradient: string;
    problems: string[];
  }
> = {
  branding: {
    label: "01 / BRANDING & MARKETING",
    title: "Branding & Marketing",
    headline: "Attention that compounds.",
    description:
      "Ads and engagement campaigns, packaging and promotional design, SEO optimization, influencer marketing, and email marketing systems built for measurable growth.",
    accent: "#D6B77A",
    gradient: "radial-gradient(ellipse 65% 55% at 50% 20%, #29241B 0%, #08090B 72%)",
    problems: [
      "Paid ad spend burning budget due to weak creative hooks and fragmented funnel messaging.",
      "Inconsistent packaging, promotional collateral, and brand presentation across launch channels.",
      "Under-indexed organic search visibility and unsegmented email lifecycle follow-ups.",
    ],
  },
  media: {
    label: "02 / MEDIA",
    title: "Media & Content",
    headline: "Stories worth seeing.",
    description:
      "Video editing across podcasts, short-form reels, and event videos, paired with motion graphics, graphics design, video production, and commercial photography.",
    accent: "#E58A76",
    gradient: "radial-gradient(ellipse 65% 55% at 50% 20%, #241411 0%, #08090B 72%)",
    problems: [
      "Disconnected brand visuals and raw podcast or event footage that fails to retain viewers.",
      "Low short-form retention across Reels, TikTok, and YouTube Shorts due to weak editing pacing.",
      "Lack of cohesive motion graphics and graphics design systems for product launches.",
    ],
  },
  digital: {
    label: "03 / WEB DEV",
    title: "Web Dev & Product Engineering",
    headline: "Digital built with intent.",
    description:
      "Custom web development, technical SEO, UI/UX design, browser web extensions, and DADV (Dashboards, Data Analytics & Visualization) engineered for speed and clarity.",
    accent: "#7BA9F5",
    gradient: "radial-gradient(ellipse 65% 55% at 50% 20%, #101C31 0%, #08090B 72%)",
    problems: [
      "Generic templates that undermine credibility and fail technical SEO and Core Web Vitals checks.",
      "Cluttered web interfaces and SaaS flows lacking intuitive UI/UX hierarchy and custom extensions.",
      "Scattered operational data needing dedicated DADV dashboards and interactive analytics portals.",
    ],
  },
  ai: {
    label: "04 / AGENTS & AUTOMATION",
    title: "Agents & Automation",
    headline: "Intelligence into action.",
    description:
      "Production chatbots, AI calling agents, autonomous AI agents, and n8n workflow automation integrated cleanly into CRM, support, and internal operations.",
    accent: "#B5A0F5",
    gradient: "radial-gradient(ellipse 65% 55% at 50% 20%, #21172D 0%, #08090B 72%)",
    problems: [
      "Missed inbound calls, unresponded leads, and slow off-hours support across web and voice.",
      "Repetitive manual copy-pasting across CRM, email, and billing tools without n8n pipelines.",
      "Operational bottlenecks where autonomous AI agents can research, triage, and execute safely.",
    ],
  },
};

type DivisionPageProps = {
  params: Promise<{ division: string }>;
};

export async function generateStaticParams() {
  return [
    { division: "branding" },
    { division: "media" },
    { division: "digital" },
    { division: "ai" },
  ];
}

export async function generateMetadata({
  params,
}: DivisionPageProps): Promise<Metadata> {
  const { division } = await params;
  const config = DIVISION_CONFIG[division as ServiceDivision];
  if (!config) return { title: "Division Not Found" };

  return {
    title: `${config.title} — ${config.headline}`,
    description: config.description,
    alternates: {
      canonical: `/services/${division}`,
    },
  };
}

export default async function DivisionDetailPage({ params }: DivisionPageProps) {
  const { division } = await params;
  const key = division as ServiceDivision;
  const config = DIVISION_CONFIG[key];

  if (!config) {
    notFound();
  }

  return (
    <div className="bg-[#08090B]">
      <DivisionManifestoHero division={division} />
      <DivisionFocusAreas division={division} />
      <DivisionCapabilitiesRegister division={division} />
      <RelevantBlueprints division={division} />
      <FinalCtaSection />
    </div>
  );
}

