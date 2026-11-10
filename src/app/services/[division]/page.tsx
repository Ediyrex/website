import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SERVICES_DATA } from "@/features/services/data";
import { PROJECTS_DATA } from "@/features/work/data";
import { ServiceDivision } from "@/types";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProcessSection } from "@/components/sections/ProcessSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

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
    title: config.title,
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

  const services = SERVICES_DATA.filter(
    (s) => s.division === key && s.isPublished
  );
  const relatedProjects = PROJECTS_DATA.filter(
    (p) => (p.category === key || p.category === "hybrid") && p.isPublished
  );

  return (
    <div className="bg-[#08090B]">
      {/* Division Hero */}
      <section
        className="pt-36 pb-20 border-b border-[#252A32]"
        style={{ backgroundImage: config.gradient }}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              { label: config.title },
            ]}
          />
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Services</span>
          </Link>

          <div className="max-w-3xl space-y-5">
            <span
              className="text-xs font-mono uppercase tracking-[0.16em] block"
              style={{ color: config.accent }}
            >
              {config.label} — {config.title}
            </span>
            <h1 className="font-heading font-bold tracking-tight text-[#F5F3EE] text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.06]">
              {config.headline}
            </h1>
            <p className="text-base sm:text-lg text-[#B2B4BA] leading-relaxed">
              {config.description}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button href="/contact" variant="primary" size="lg">
                <span>Book a discovery call</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
              <Button href="/work" variant="secondary" size="lg">
                <span>View related work</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Addressed */}
      <section className="py-16 md:py-24 bg-[#0D0F12] border-b border-[#252A32]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
              Focus Areas
            </span>
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-[#F5F3EE]">
              Challenges this division solves
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {config.problems.map((problem, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-3"
              >
                <span
                  className="text-xs font-mono"
                  style={{ color: config.accent }}
                >
                  0{idx + 1}
                </span>
                <p className="text-sm text-[#B2B4BA] leading-relaxed">
                  {problem}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specific Offerings */}
      <section className="py-16 md:py-24 bg-[#08090B] border-b border-[#252A32]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
              Capabilities &amp; Deliverables
            </span>
            <h2 className="font-heading font-semibold text-2xl sm:text-4xl text-[#F5F3EE]">
              {config.title} Services
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                id={service.slug}
                className="p-7 rounded-2xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] transition-colors flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <h3 className="font-heading font-semibold text-xl text-[#F5F3EE]">
                    {service.title}
                  </h3>
                  <p className="text-sm text-[#B2B4BA] leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#252A32] space-y-3">
                  <ul className="space-y-1.5">
                    {service.capabilities.map((cap) => (
                      <li
                        key={cap}
                        className="flex items-center gap-2 text-xs text-[#B2B4BA]"
                      >
                        <CheckCircle2
                          className="w-3.5 h-3.5 shrink-0"
                          style={{ color: config.accent }}
                        />
                        <span>{cap}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/contact?service=${service.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D6B77A] hover:text-[#E6CC99] pt-2"
                  >
                    <span>Enquire about {service.title}</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related Blueprints */}
      {relatedProjects.length > 0 && (
        <section className="py-16 md:py-24 bg-[#0D0F12] border-b border-[#252A32]">
          <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-[#F5F3EE]">
                Relevant Blueprints
              </h2>
              <Link
                href="/work"
                className="text-sm text-[#D6B77A] hover:text-[#E6CC99]"
              >
                All work &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/work/${project.slug}`}
                  className="group p-6 rounded-2xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] transition-colors space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs font-mono uppercase"
                      style={{ color: config.accent }}
                    >
                      {project.category}
                    </span>
                    {project.isConcept && (
                      <Badge variant="concept">Concept project</Badge>
                    )}
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-[#F5F3EE] group-hover:text-[#D6B77A] transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[#B2B4BA]">{project.summary}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <ProcessSection />
      <FinalCtaSection />
    </div>
  );
}

