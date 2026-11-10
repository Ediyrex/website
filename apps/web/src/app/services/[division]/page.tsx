import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { SERVICES_DATA } from "@/features/services/data";
import { PROJECTS_DATA } from "@/features/work/data";
import { ServiceDivision } from "@/types";
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
  media: {
    label: "01 / MEDIA",
    title: "Media & Content",
    headline: "Stories worth seeing.",
    description:
      "Commercial video production, brand films, photography, short-form reels, and motion graphics crafted to build authority and capture attention.",
    accent: "#E58A76",
    gradient: "radial-gradient(ellipse 65% 55% at 50% 20%, #241411 0%, #08090B 72%)",
    problems: [
      "Disconnected brand visuals that fail to communicate product quality.",
      "Low short-form retention across social channels due to weak opening hooks.",
      "Lack of cohesive photography and motion systems for product launches.",
    ],
  },
  digital: {
    label: "02 / DIGITAL",
    title: "Web & Digital Experience",
    headline: "Digital built with intent.",
    description:
      "Editorial websites, conversion landing pages, e-commerce platforms, SaaS dashboards, and full-stack software built for speed and clarity.",
    accent: "#7BA9F5",
    gradient: "radial-gradient(ellipse 65% 55% at 50% 20%, #101C31 0%, #08090B 72%)",
    problems: [
      "Generic templates that undermine credibility with enterprise or international buyers.",
      "Slow, cluttered web interfaces causing drop-offs before enquiries or signups.",
      "Complex SaaS workflows that lack intuitive UX hierarchy and maintainable code.",
    ],
  },
  ai: {
    label: "03 / AI",
    title: "AI Agents & Automation",
    headline: "Intelligence into action.",
    description:
      "Autonomous AI agents, workflow automation, voice receptionists, customer support bots, and RAG knowledge systems integrated into real operations.",
    accent: "#B5A0F5",
    gradient: "radial-gradient(ellipse 65% 55% at 50% 20%, #21172D 0%, #08090B 72%)",
    problems: [
      "Repetitive manual data entry across CRM, support, and internal back-office tools.",
      "Missed inbound calls or slow response times during off-hours and high-volume peaks.",
      "Scattered company documentation that teams struggle to search and synthesize.",
    ],
  },
};

type DivisionPageProps = {
  params: Promise<{ division: string }>;
};

export async function generateStaticParams() {
  return [{ division: "media" }, { division: "digital" }, { division: "ai" }];
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

