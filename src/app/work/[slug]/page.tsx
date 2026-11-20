import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getPublishedProjectBySlug,
  getPublishedProjects,
} from "@/lib/server/catalog";
import { PROJECTS_DATA } from "@/features/work/data";
import { CaseStudyHero } from "@/components/sections/CaseStudy/CaseStudyHero";
import { CaseStudyVisual } from "@/components/sections/CaseStudy/CaseStudyVisual";
import { CaseStudyDocumentation } from "@/components/sections/CaseStudy/CaseStudyDocumentation";
import { CaseStudyRelated } from "@/components/sections/CaseStudy/CaseStudyRelated";

export const instant = false;

type CaseStudyPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const projects = await getPublishedProjects().catch(() => []);
  const slugs = new Set<string>();

  for (const p of projects) {
    if (p.slug) slugs.add(p.slug);
  }

  // Ensure Next.js cache components build-time validation always has at least one static param
  if (slugs.size === 0) {
    for (const p of PROJECTS_DATA) {
      if (p.slug) slugs.add(p.slug);
    }
  }

  return Array.from(slugs).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({
  params,
}: CaseStudyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);

  if (!project) {
    return {
      title: "Case Study Not Found",
    };
  }

  return {
    title: project.seoTitle || project.title,
    description: project.seoDescription || project.summary,
    alternates: {
      canonical: `/work/${slug}`,
    },
    openGraph: {
      title: project.seoTitle || project.title,
      description: project.seoDescription || project.summary,
      images: [project.coverImage],
    },
  };
}

export default async function CaseStudyDetailPage({
  params,
}: CaseStudyPageProps) {
  const { slug } = await params;
  const [project, allPublished] = await Promise.all([
    getPublishedProjectBySlug(slug),
    getPublishedProjects(),
  ]);

  if (!project) {
    notFound();
  }

  const serviceSet = new Set(project.servicesDemonstrated);
  const relatedProjects = allPublished
    .filter((p) => p.slug !== project.slug && p.isPublished)
    .sort((a, b) => {
      const aScore =
        (a.category === project.category ? 3 : 0) +
        a.servicesDemonstrated.filter((s) => serviceSet.has(s)).length;
      const bScore =
        (b.category === project.category ? 3 : 0) +
        b.servicesDemonstrated.filter((s) => serviceSet.has(s)).length;
      return bScore - aScore;
    })
    .slice(0, 2);

  return (
    <div className="bg-[#0C0D0F]">
      <CaseStudyHero project={project} />

      {/* Main Visual seated inside the Warm Ivory upper band */}
      <div className="border-b border-[#CFC5B9] bg-[#F5EFE5] pb-10 sm:pb-14">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
          <CaseStudyVisual project={project} />
        </div>
      </div>

      <section className="py-14 text-[#F5F2EC] lg:py-20">
        <div className="mx-auto max-w-[1440px] space-y-14 px-5 sm:px-8 lg:px-14">
          <CaseStudyDocumentation project={project} />
          <CaseStudyRelated relatedProjects={relatedProjects} />
        </div>
      </section>
    </div>
  );
}
