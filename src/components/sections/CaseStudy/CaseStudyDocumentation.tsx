import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { ProjectItem } from "@/types";

function getOutcomesHeading(project: ProjectItem): string {
  const status =
    project.workStatus ?? (project.isConcept ? "concept" : "shipped");

  switch (status) {
    case "shipped":
      return "04 / RESULTS & DELIVERABLES";
    case "in-progress":
      return "04 / PROGRESS & DELIVERABLES";
    case "rnd":
      return "04 / EXPERIMENTS & TECHNICAL FINDINGS";
    case "concept":
    default:
      return "04 / PROPOSED SOLUTION & DESIGN OUTPUTS";
  }
}

export function CaseStudyDocumentation({ project }: { project: ProjectItem }) {
  const outcomesHeading = getOutcomesHeading(project);
  const serviceHref = ["branding", "media", "digital", "ai"].includes(
    project.category,
  )
    ? `/services/${project.category}`
    : "/services";

  const enquiryUrl = `/contact?project=${encodeURIComponent(project.slug)}&title=${encodeURIComponent(project.title)}`;

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-[70%_1fr]">
      {/* Main Narrative Column */}
      <div className="divide-y divide-[#292E35] border-t border-[#292E35]">
        <div className="py-8">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#F06419]">
            01 / OVERVIEW
          </p>
          <p className="mt-4 text-base leading-[1.7] text-[#B8B9BC] sm:text-[17.5px]">
            {project.description}
          </p>
        </div>

        {project.challenge && (
          <div className="py-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#F06419]">
              02 / THE CHALLENGE
            </p>
            <p className="mt-4 text-base leading-[1.7] text-[#B8B9BC] sm:text-[17.5px]">
              {project.challenge}
            </p>
          </div>
        )}

        {project.approach && (
          <div className="py-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#F06419]">
              03 / EXECUTION APPROACH
            </p>
            <p className="mt-4 text-base leading-[1.7] text-[#B8B9BC] sm:text-[17.5px]">
              {project.approach}
            </p>
          </div>
        )}

        {(project.solution || (project.outcomes && project.outcomes.length > 0)) && (
          <div className="py-8">
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#F06419]">
              {outcomesHeading}
            </p>

            {project.solution && (
              <p className="mt-4 text-base leading-[1.7] text-[#B8B9BC] sm:text-[17.5px]">
                {project.solution}
              </p>
            )}

            {project.outcomes && project.outcomes.length > 0 && (
              <ul className="mt-5 space-y-3.5">
                {project.outcomes.map((outcome, i) => (
                  <li
                    key={outcome}
                    className="flex items-start gap-3.5 text-base leading-relaxed text-[#F5F2EC]"
                  >
                    <span className="mt-0.5 shrink-0 font-mono text-xs font-semibold text-[#F06419]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Right Capabilities & Contextual Enquiry Sidebar */}
      <aside>
        <div className="space-y-6 rounded-lg border border-[#292E35] bg-[#12151A] p-6 lg:sticky lg:top-28">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#D9B875]">
              CAPABILITIES DEMONSTRATED
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.servicesDemonstrated.map((service) => (
                <li key={service}>
                  <Link
                    href={serviceHref}
                    className="inline-block rounded border border-[#292E35] bg-[#171B20] px-3 py-1.5 font-mono text-xs text-[#F5F2EC] transition-colors hover:border-[#F06419]/60 hover:text-[#F06419]"
                  >
                    {service}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {project.techStack && project.techStack.length > 0 && (
            <div className="border-t border-[#292E35] pt-5">
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#898D94]">
                TECHNOLOGIES &amp; TOOLS
              </p>
              <ul className="mt-3 flex flex-wrap gap-1.5">
                {project.techStack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded border border-[#292E35] bg-[#0C0D0F] px-2.5 py-1 font-mono text-[11px] text-[#B8B9BC]"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {(project.liveUrl || project.repositoryUrl) && (
            <div className="flex flex-wrap gap-3 border-t border-[#292E35] pt-5">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-[#D9B875] hover:text-[#F5F2EC]"
                >
                  <span>Live Preview</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
              {project.repositoryUrl && (
                <a
                  href={project.repositoryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-[#B8B9BC] hover:text-[#F5F2EC]"
                >
                  <span>Repository</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              )}
            </div>
          )}

          <div className="border-t border-[#292E35] pt-6">
            <p className="text-sm leading-relaxed text-[#B8B9BC]">
              Interested in building a similar architecture or tailored
              engagement with EDIYREX?
            </p>
            <Link
              href={enquiryUrl}
              className="mt-4 inline-flex w-full items-center justify-between rounded-[4px] bg-[#F06419] px-4 py-3 font-mono text-xs font-semibold uppercase tracking-[0.12em] text-[#0C0D0F] transition-colors hover:bg-[#FF7D38]"
            >
              <span>Discuss a Similar Project</span>
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
}

