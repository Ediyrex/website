import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { DirectoryDivision } from "./services.data";
import { CapabilityItem } from "./CapabilityItem";

interface ExpandedCapabilitiesProps {
  division: DirectoryDivision;
}

export function ExpandedCapabilities({ division }: ExpandedCapabilitiesProps) {
  return (
    <div className="border-t border-[#292E35] bg-[#0F1215] px-5 py-6 sm:px-7 sm:py-7">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {division.capabilities.map((service, index) => (
          <CapabilityItem
            key={service.id}
            service={service}
            index={index}
            accentHex={division.accentHex}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col items-start justify-between gap-3 border-t border-[#292E35] pt-4 sm:flex-row sm:items-center">
        <p className="font-mono text-xs uppercase tracking-[0.14em] text-[#858991]">
          {division.number} / {division.name} — {division.capabilityCountLabel}
        </p>
        <Link
          href={division.href}
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.14em] text-[#D9B875] transition-colors hover:text-[#F5F2EC]"
        >
          View Division Overview
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

