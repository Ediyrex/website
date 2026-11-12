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
    <article className="group flex h-full flex-col justify-between rounded-lg border border-[#292E35] bg-[#171B20] p-5 transition-colors duration-200 hover:border-[#343940]">
      <div>
        <div className="mb-3 flex items-center justify-between gap-3">
          <span
            className="font-mono text-[11px] font-medium tracking-[0.16em]"
            style={{ color: accentHex }}
          >
            {formattedIndex}
          </span>
          <Link
            href={`/contact?service=${encodeURIComponent(service.slug)}`}
            className="inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.14em] text-[#858991] transition-colors hover:text-[#F5F2EC]"
          >
            Inquire
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>

        <h4 className="text-lg font-medium tracking-tight text-[#F5F2EC]">
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
              className="rounded border border-[#292E35] bg-[#121519] px-2.5 py-1 font-mono text-[11px] text-[#B8B9BC]"
            >
              {capability}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

