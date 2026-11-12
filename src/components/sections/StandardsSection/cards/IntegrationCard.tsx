import Link from "next/link";
import { ArrowRight, Workflow } from "lucide-react";
import { IntegrationDiagram } from "../graphics/IntegrationDiagram";
import { STANDARDS_PRINCIPLES } from "../standards.data";

export function IntegrationCard() {
  const data = STANDARDS_PRINCIPLES.integration;

  return (
    <div data-brutal-card className="h-full min-w-0">
      <article className="group flex h-full min-h-[300px] flex-col justify-between rounded-[24px] border border-[#E5DED5] bg-[#FFFDFC] p-6 sm:p-8 text-[#111111] shadow-[0_18px_42px_-28px_rgba(17,17,17,0.12)] transition-[transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-[#FF9A48]">
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] items-center gap-6">
          <div className="space-y-3.5 min-w-0">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[22px] font-semibold leading-none text-[#FF6900]">
                {data.number}
              </span>
              <Workflow className="h-5 w-5 text-[#FF6900]" aria-hidden="true" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.18em] text-[#817A72]">
                {data.label}
              </span>
            </div>

            <h3 className="font-heading text-[24px] sm:text-[28px] font-bold tracking-[-0.025em] leading-[1.12] text-[#111111]">
              Everything connected.
            </h3>

            <p className="text-[14.5px] sm:text-[15px] leading-[1.58] text-[#48433F]">
              {data.description}
            </p>
          </div>

          <IntegrationDiagram />
        </div>

        {/* Footer row */}
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#E5DED5] pt-5">
          <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#48433F]">
            Cross-Discipline · {data.annotation}
          </span>

          <Link
            href={data.href}
            aria-label={`Explore ${data.label} at EDIYREX`}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#FF6900]/65 bg-transparent text-[#111111] transition-colors duration-250 hover:bg-[#FF6900] hover:text-white hover:border-[#FF6900] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6900]"
          >
            <ArrowRight
              className="h-4 w-4 transition-transform duration-250 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </Link>
        </div>
      </article>
    </div>
  );
}
