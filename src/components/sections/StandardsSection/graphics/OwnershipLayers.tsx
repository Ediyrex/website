import { BookOpen, Database, PanelsTopLeft, Server } from "lucide-react";

const ARCH_LAYERS = [
  {
    id: "frontend",
    label: "Frontend",
    note: "Next.js",
    Icon: PanelsTopLeft,
    offsetClass: "ml-0 mr-4",
  },
  {
    id: "backend",
    label: "Backend",
    note: "TypeScript",
    Icon: Server,
    offsetClass: "ml-1.5 mr-2.5",
  },
  {
    id: "database",
    label: "Database",
    note: "PostgreSQL",
    Icon: Database,
    offsetClass: "ml-3 mr-1",
  },
  {
    id: "docs",
    label: "Documentation",
    note: "Handover",
    Icon: BookOpen,
    offsetClass: "ml-4 mr-0",
  },
] as const;

export function OwnershipLayers() {
  return (
    <div
      aria-hidden="true"
      className="flex w-[184px] shrink-0 flex-col gap-1.5 mx-auto sm:mx-0"
    >
      {ARCH_LAYERS.map(({ id, label, note, Icon, offsetClass }, idx) => (
        <div
          key={id}
          style={{ transitionDelay: `${idx * 35}ms` }}
          className={`flex items-center justify-between gap-2 rounded-[10px] border border-[#E5DED5] border-l-[3px] border-l-[#FF6900] bg-[#FAF6F0] px-3 py-1.5 text-[#111111] transition-[background-color,border-color,transform] duration-250 group-hover:translate-x-0.5 hover:border-[#FF9A48] hover:bg-[#FFF0E3] ${offsetClass}`}
        >
          <div className="flex items-center gap-1.5 min-w-0">
            <Icon className="h-3.5 w-3.5 shrink-0 text-[#FF6900] stroke-[1.75]" />
            <span className="truncate font-heading text-[11px] font-semibold text-[#111111]">
              {label}
            </span>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.06em] text-[#817A72] shrink-0">
            {note}
          </span>
        </div>
      ))}
    </div>
  );
}
