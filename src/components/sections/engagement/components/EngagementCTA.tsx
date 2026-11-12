import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface EngagementCTAProps {
  label: string;
  href: string;
}

export function EngagementCTA({ label, href }: EngagementCTAProps) {
  return (
    <Link
      href={href}
      className="group relative flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#FF7A1A] via-[#FF6900] to-[#DE5000] px-6 py-4 text-[14.5px] font-semibold text-white shadow-[0_14px_30px_-8px_rgba(255,105,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-8px_rgba(255,105,0,0.72)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF6900] focus-visible:ring-offset-2 focus-visible:ring-offset-[#FFFDFC]"
    >
      <span>{label}</span>
      <ArrowUpRight
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        aria-hidden="true"
      />
    </Link>
  );
}

