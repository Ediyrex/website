import { SERVICES_DATA } from "@/features/services/data";
import type { ServiceDivision, ServiceItem } from "@/types";

export type DirectoryIconKey = "megaphone" | "video" | "layers" | "cpu";

export interface DirectoryDivision {
  id: ServiceDivision;
  number: string;
  name: string;
  description: string;
  capabilityCountLabel: string;
  icon: DirectoryIconKey;
  accentHex: string;
  href: string;
  capabilities: ServiceItem[];
}

const DIVISION_META: readonly Omit<
  DirectoryDivision,
  "capabilities" | "capabilityCountLabel"
>[] = [
  {
    id: "branding",
    number: "01",
    name: "Branding & Marketing",
    description:
      "Brand identity, growth strategy, campaigns and audience engagement.",
    icon: "megaphone",
    accentHex: "#F07824",
    href: "/services/branding",
  },
  {
    id: "media",
    number: "02",
    name: "Media & Production",
    description: "Video, photography, motion design and content production.",
    icon: "video",
    accentHex: "#E58A76",
    href: "/services/media",
  },
  {
    id: "digital",
    number: "03",
    name: "Web Development",
    description: "Websites, platforms, products and digital experiences.",
    icon: "layers",
    accentHex: "#7BA9F5",
    href: "/services/digital",
  },
  {
    id: "ai",
    number: "04",
    name: "AI & Automation",
    description:
      "AI agents, workflow automation and intelligent business systems.",
    icon: "cpu",
    accentHex: "#B5A0F5",
    href: "/services/ai",
  },
];

export const DIRECTORY_DIVISIONS: readonly DirectoryDivision[] =
  DIVISION_META.map((meta) => {
    const capabilities = SERVICES_DATA.filter(
      (service) => service.division === meta.id
    );
    const countPadded = String(capabilities.length).padStart(2, "0");
    return {
      ...meta,
      capabilities,
      capabilityCountLabel: `${countPadded} CAPABILITIES`,
    };
  });

export const TOTAL_CAPABILITIES_COUNT = SERVICES_DATA.length;

export const STUDIO_DIRECTORY_METRICS = [
  { value: "04", label: "Divisions" },
  {
    value: String(TOTAL_CAPABILITIES_COUNT).padStart(2, "0"),
    label: "Capabilities",
  },
  { value: "01", label: "Integrated Studio" },
] as const;

