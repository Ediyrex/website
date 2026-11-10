import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  CheckCircle2,
  Layers,
  Target,
  Wrench,
} from "lucide-react";
import { PROJECTS_DATA } from "@/features/work/data";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Button } from "@/components/ui/Button";

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return PROJECTS_DATA.filter((p) => p.isPublished).map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS_DATA.find(
    (p) => p.slug === slug && p.isPublished
  );

  if (!project) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: project.title,
    description: project.summary,
    alternates: {
      canonical: `/work/${slug}`,
    },
    openGraph: {
      title: project.title,
      description: project.summary,
      images: [project.coverImage],
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: CaseStudyPageProps) {
  const { slug } = await params;
  const project = PROJECTS_DATA.find(
    (p) => p.slug === slug && p.isPublished
  );

  if (!project) {
    notFound();
  }

  const relatedProjects = PROJECTS_DATA.filter(
    (p) => p.slug !== project.slug && p.isPublished
  ).slice(0, 2);

  return (
    <div className="pt-32 pb-24 bg-[#08090B] min-h-screen">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 space-y-12">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Work", href: "/work" },
            { label: project.title },
          ]}
        />
        {/* Back link */}
        <div>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Work</span>
          </Link>
        </div>

        {/* Hero Block */}
        <header className="space-y-6 pb-10 border-b border-[#252A32]">
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge variant="accent">{project.category.toUpperCase()}</Badge>
            {project.isConcept ? (
              <Badge variant="concept">
                <AlertCircle className="w-3 h-3" />
                <span>Concept project</span>
              </Badge>
            ) : (
              <Badge variant="featured">Client project</Badge>
            )}
            <span className="text-xs font-mono text-[#777D87]">
              {new Date(project.createdAt).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
                timeZone: "UTC",
              })}
            </span>
          </div>

          <h1 className="font-heading font-bold tracking-tight text-[#F5F3EE] text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.08]">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-[#B2B4BA] leading-relaxed">
            {project.summary}
          </p>

          {project.isConcept && (
            <div className="p-4 rounded-xl bg-[#E9B86A]/10 border border-[#E9B86A]/30 text-xs text-[#F5F3EE] flex items-start gap-3 leading-relaxed">
              <AlertCircle className="w-4 h-4 text-[#E9B86A] shrink-0 mt-0.5" />
              <p>
                <strong>Concept Project Disclosure:</strong> This case study documents an independent Ediyrex Studio exploration built to demonstrate architectural craft and capabilities rather than a commissioned third-party client project.
              </p>
            </div>
          )}
        </header>

        {/* Hero Visual */}
        <div className="aspect-[16/10] rounded-2xl bg-[#12151A] border border-[#252A32] overflow-hidden">
          <Image
            src={project.coverImage}
            alt={project.coverAlt || project.title}
            width={800}
            height={500}
            priority
            className="w-full h-full object-cover"
          />
        </div>

        {/* Overview */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#D6B77A]">
            <Layers className="w-4 h-4" />
            <span>Project Overview</span>
          </div>
          <p className="text-sm sm:text-base text-[#B2B4BA] leading-relaxed">
            {project.description}
          </p>
        </section>

        {/* Challenge & Approach */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.challenge && (
            <div className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#E58A76]">
                <Target className="w-4 h-4" />
                <span>The Challenge</span>
              </div>
              <p className="text-sm text-[#B2B4BA] leading-relaxed">
                {project.challenge}
              </p>
            </div>
          )}

          {project.approach && (
            <div className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#7BA9F5]">
                <Wrench className="w-4 h-4" />
                <span>Approach &amp; Implementation</span>
              </div>
              <p className="text-sm text-[#B2B4BA] leading-relaxed">
                {project.approach}
              </p>
            </div>
          )}
        </section>

        {/* Deliverables & Services */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {project.outcomes && project.outcomes.length > 0 && (
            <div className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-4">
              <h2 className="text-xs font-mono uppercase tracking-wider text-[#D6B77A]">
                {project.isConcept
                  ? "Architectural Deliverables"
                  : "Verified Outcomes"}
              </h2>
              <ul className="space-y-2.5">
                {project.outcomes.map((outcome, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-2.5 text-sm text-[#F5F3EE]"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#54C99A] shrink-0 mt-0.5" />
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-wider text-[#D6B77A]">
              Capabilities Demonstrated
            </h2>
            <div className="flex flex-wrap gap-2">
              {project.servicesDemonstrated.map((serviceName) => (
                <span
                  key={serviceName}
                  className="text-xs font-mono px-3 py-1.5 rounded-lg bg-[#0D0F12] text-[#B2B4BA] border border-[#252A32]"
                >
                  {serviceName}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="pt-8 border-t border-[#252A32] space-y-6">
            <h2 className="font-heading font-semibold text-xl text-[#F5F3EE]">
              Related Work
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {relatedProjects.map((item) => (
                <Link
                  key={item.id}
                  href={`/work/${item.slug}`}
                  className="p-5 rounded-xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] transition-colors space-y-2"
                >
                  <span className="text-[11px] font-mono uppercase text-[#D6B77A]">
                    {item.category}
                  </span>
                  <h3 className="font-heading font-semibold text-base text-[#F5F3EE]">
                    {item.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA Footer */}
        <section className="p-8 rounded-2xl bg-[#12151A] border border-[#252A32] flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h2 className="font-heading text-xl font-semibold text-[#F5F3EE]">
              Have something worth building?
            </h2>
            <p className="text-sm text-[#B2B4BA]">
              Let&apos;s explore how this approach translates to your team&apos;s objectives.
            </p>
          </div>
          <Button href="/contact" variant="primary" size="md">
            <span>Book a discovery call</span>
            <ArrowUpRight className="w-4 h-4" />
          </Button>
        </section>
      </div>
    </div>
  );
}
