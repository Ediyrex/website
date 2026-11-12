import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, FlaskConical } from "lucide-react";
import type { ProjectItem } from "@/types";

const DIVISION_DISPLAY: Record<string, string> = {
  branding: "BRANDING & MARKETING",
  media: "MEDIA & PRODUCTION",
  digital: "WEB, APPS & DIGITAL",
  ai: "AI & AUTOMATION",
  hybrid: "AI & AUTOMATION / HYBRID",
};

function getStatusBadge(project: ProjectItem) {
  const status =
    project.workStatus ?? (project.isConcept ? "concept" : "shipped");

  if (status === "shipped") {
    return {
      label: "SHIPPED PROJECT",
      classes: "border-[#171717]/25 bg-[#171717] text-[#F5EFE5]",
      Icon: CheckCircle2,
    };
  }
  if (status === "rnd") {
    return {
      label: "R&D PROTOTYPE",
      classes: "border-[#7C3AED]/40 bg-[#EDE9FE] text-[#5B21B6]",
      Icon: FlaskConical,
    };
  }
  return {
    label: "CONCEPT PROJECT",
    classes: "border-[#F06419]/40 bg-[#FBE5D3] text-[#F06419]",
    Icon: AlertCircle,
  };
}

export function CaseStudyHero({ project }: { project: ProjectItem }) {
  const statusBadge = getStatusBadge(project);
  const StatusIcon = statusBadge.Icon;
  const divisionLabel =
    DIVISION_DISPLAY[project.category] ?? project.category.toUpperCase();
  const classificationLabel =
    project.classification ??
    (project.isConcept ? "STUDIO R&D CONCEPT" : "CLIENT CASE STUDY");

  return (
    <section className="bg-[#F5EFE5] pb-10 pt-28 text-[#171717] sm:pb-12 sm:pt-32">
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-14">
        {/* Top Navigation Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#CFC5B9] pb-5">
          <Link
            href="/work"
            className="group inline-flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-[0.14em] text-[#171717] transition-colors hover:text-[#F06419]"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
              aria-hidden="true"
            />
            <span>Back to Work</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2.5">
            <span className="rounded border border-[#171717]/25 bg-[#FFFCF7] px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[#171717]">
              {project.category}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] ${statusBadge.classes}`}
            >
              <StatusIcon className="h-3 w-3" aria-hidden="true" />
              {statusBadge.label}
            </span>
          </div>
        </div>

        {/* Asymmetrical Hero Content */}
        <div className="mt-8 grid grid-cols-1 items-end gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <h1
              style={{ fontFamily: "var(--font-archivo-narrow), sans-serif" }}
              className="text-[clamp(2.5rem,4.9vw,4.5rem)] font-bold uppercase leading-[0.94] tracking-[-0.02em] text-[#171717]"
            >
              {project.title}
            </h1>
            <p className="mt-5 max-w-[820px] text-[17px] leading-[1.55] text-[#49433E] sm:text-[19px]">
              {project.summary}
            </p>
          </div>

          <div className="lg:col-span-4 lg:border-l lg:border-[#CFC5B9] lg:pl-8">
            <dl className="divide-y divide-[#CFC5B9] font-mono text-xs">
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="uppercase tracking-[0.12em] text-[#77716A]">
                  Division
                </dt>
                <dd className="text-right font-semibold uppercase text-[#171717]">
                  {divisionLabel}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="uppercase tracking-[0.12em] text-[#77716A]">
                  Classification
                </dt>
                <dd className="text-right font-semibold uppercase text-[#F06419]">
                  {classificationLabel}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4 py-3">
                <dt className="uppercase tracking-[0.12em] text-[#77716A]">
                  Capabilities
                </dt>
                <dd className="text-right font-semibold text-[#171717]">
                  {String(project.servicesDemonstrated.length).padStart(2, "0")}{" "}
                  Demonstrated
                </dd>
              </div>
              {project.clientName && (
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="uppercase tracking-[0.12em] text-[#77716A]">
                    Client
                  </dt>
                  <dd className="text-right font-semibold text-[#171717]">
                    {project.clientName}
                  </dd>
                </div>
              )}
              {project.projectDate && (
                <div className="flex items-center justify-between gap-4 py-3">
                  <dt className="uppercase tracking-[0.12em] text-[#77716A]">
                    Year
                  </dt>
                  <dd className="text-right font-semibold text-[#171717]">
                    {project.projectDate}
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

