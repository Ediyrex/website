import { Cpu, Layers, Megaphone, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DirectoryIconKey } from "./services.data";

interface DivisionIconProps {
  icon: DirectoryIconKey;
  isHighlighted: boolean;
}

const ICONS: Record<DirectoryIconKey, typeof Megaphone> = {
  megaphone: Megaphone,
  video: Video,
  layers: Layers,
  cpu: Cpu,
};

export function DivisionIcon({ icon, isHighlighted }: DivisionIconProps) {
  const Icon = ICONS[icon];

  return (
    <div
      className={cn(
        "relative flex h-12 w-12 sm:h-[58px] sm:w-[58px] shrink-0 items-center justify-center rounded-[8px] border transition-all duration-300 group-hover:scale-105",
        isHighlighted
          ? "border-[#F07824]/60 bg-[#F07824]/10 text-[#F07824] shadow-[0_0_20px_rgba(240,120,36,0.25)]"
          : "border-[#292E35] bg-[#171B20]/60 text-[#D9B875] group-hover:border-[#F07824]/60 group-hover:bg-[#F07824]/10 group-hover:text-[#F07824]"
      )}
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.6] transition-transform duration-300 group-hover:rotate-[-6deg]" aria-hidden="true" />
    </div>
  );
}

