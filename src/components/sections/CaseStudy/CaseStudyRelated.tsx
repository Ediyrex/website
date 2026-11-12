import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ProjectItem } from "@/types";

export function CaseStudyRelated({
  relatedProjects,
}: {
  relatedProjects: ProjectItem[];
}) {
  if (relatedProjects.length === 0) {
    return (
      <div className="border-t border-[#292E35] pt-10 text-center">
        <Link
          href="/work"
          className="font-mono text-xs uppercase tracking-[0.14em] text-[#D9B875] hover:text-[#F06419]"
        >
          ← Return to Work Archive
        </Link>
      </div>
    );
  }

  return (
    <div className="border-t border-[#292E35] pt-12">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.16em] text-[#D9B875]">
          NEXT / RELATED WORK
        </p>
        <Link
          href="/work"
          className="font-mono text-xs uppercase tracking-[0.14em] text-[#B8B9BC] transition-colors hover:text-[#F06419]"
        >
          View All Work →
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {relatedProjects.map((rel) => (
          <Link
            key={rel.id}
            href={`/work/${rel.slug}`}
            className="group flex flex-col justify-between rounded-lg border border-[#292E35] bg-[#12151A] p-6 transition-colors hover:border-[#4A5059]"
          >
            <div>
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#F06419]">
                {rel.category}
              </span>
              <h3 className="mt-2 font-heading text-xl font-semibold text-[#F5F2EC] transition-colors group-hover:text-[#F06419]">
                {rel.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-[#B8B9BC]">
                {rel.summary}
              </p>
            </div>
            <span className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-[#D9B875]">
              Read Case Study
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

