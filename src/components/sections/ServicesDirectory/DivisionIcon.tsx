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
        "flex h-12 w-12 sm:h-[58px] sm:w-[58px] shrink-0 items-center justify-center rounded-[8px] border transition-colors duration-300",
        isHighlighted
          ? "border-[#F07824]/60 bg-[#F07824]/10 text-[#F07824]"
          : "border-[#292E35] bg-[#171B20]/60 text-[#D9B875] group-hover:border-[#D9B875]/55"
      )}
    >
      <Icon className="h-5 w-5 sm:h-6 sm:w-6 stroke-[1.6]" aria-hidden="true" />
    </div>
  );
}

