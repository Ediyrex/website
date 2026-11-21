import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ServiceItem } from "@/types";

interface CapabilityItemProps {
  service: ServiceItem;
  index: number;
  accentHex: string;
}

export function CapabilityItem({
  service,
  index,
  accentHex,
}: CapabilityItemProps) {
  const formattedIndex = String(index + 1).padStart(2, "0");

  return (
    <article className="group flex h-full flex-col justify-between rounded-lg border border-[#292E35] bg-[#171B20] p-5 transition-all duration-200 hover:border-[#F07824]/50 hover:bg-[#1C2127] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.3)]">
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <span
            className="font-mono text-[11px] font-semibold tracking-[0.16em] transition-transform duration-200 group-hover:scale-105 inline-block"
            style={{ color: accentHex }}
          >
            {formattedIndex}
          </span>
          <Link
            href={`/contact?service=${encodeURIComponent(service.slug)}`}
            className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#858991] transition-colors hover:text-[#F07824] group-hover:text-[#B8B9BC]"
          >
            Inquire
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
          </Link>
        </div>

        <h4 className="text-lg font-medium tracking-tight text-[#F5F2EC] group-hover:text-[#F07824] transition-colors duration-200">
          {service.title}
        </h4>
        <p className="mt-2 text-sm leading-relaxed text-[#B8B9BC]">
          {service.description}
        </p>
      </div>

      {service.capabilities.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-[#292E35] pt-3.5">
          {service.capabilities.map((capability) => (
            <li
              key={capability}
              className="rounded border border-[#292E35] bg-[#121519] px-2.5 py-1 font-mono text-[11px] text-[#B8B9BC] transition-colors duration-150 hover:border-[#F07824]/40 hover:text-[#F5F2EC]"
            >
              {capability}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

