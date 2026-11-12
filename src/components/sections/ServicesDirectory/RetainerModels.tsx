import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { STUDIO_RETAINERS } from "./services.data";

export function RetainerModels() {
  return (
    <div className="mt-16 border-t border-[#292E35] pt-12">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#D9B875]">
            CROSS-DIVISION ENGAGEMENT MODEL
          </p>
          <h3 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-[#F5F2EC] sm:text-3xl">
            Ongoing Support &amp; Studio Retainers
          </h3>
          <p className="mt-2 max-w-[680px] text-sm leading-relaxed text-[#858991]">
            Available across all four divisions as separately scoped Annual
            Maintenance Contracts (AMC) and monthly retainers.
          </p>
        </div>

        <Link
          href="/contact"
          className="inline-flex shrink-0 items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-[#F07824] transition-colors hover:text-[#F5F2EC]"
        >
          Discuss Support Scope
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STUDIO_RETAINERS.map((retainer) => (
          <div
            key={retainer.id}
            className="rounded-lg border border-[#292E35] bg-[#121519] p-5"
          >
            <span className="font-mono text-[11px] font-medium tracking-[0.16em] text-[#F07824]">
              {retainer.number}
            </span>
            <h4 className="mt-2 text-base font-medium tracking-tight text-[#F5F2EC]">
              {retainer.title}
            </h4>
            <ul className="mt-3 space-y-1.5 border-t border-[#292E35] pt-3">
              {retainer.items.map((item) => (
                <li key={item} className="text-xs leading-relaxed text-[#B8B9BC]">
                  • {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

