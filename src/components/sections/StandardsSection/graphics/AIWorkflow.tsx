import {
  ArrowRight,
  CircleCheck,
  Cpu,
  MessageCircle,
  UserRoundCheck,
} from "lucide-react";

const PROCESS_NODES = [
  { id: "input", label: "Input", Icon: MessageCircle, highlighted: false },
  { id: "ai", label: "AI Processing", Icon: Cpu, highlighted: true },
  {
    id: "review",
    label: "Human Review",
    Icon: UserRoundCheck,
    highlighted: false,
  },
  { id: "output", label: "Output", Icon: CircleCheck, highlighted: false },
] as const;

export function AIWorkflow() {
  return (
    <div
      aria-hidden="true"
      className="grid grid-cols-2 sm:flex sm:flex-wrap items-center justify-center gap-1.5"
    >
      {PROCESS_NODES.map(({ id, label, Icon, highlighted }, idx) => (
        <div key={id} className="flex items-center gap-1.5">
          <div
            style={{ transitionDelay: `${idx * 45}ms` }}
            className={
              highlighted
                ? "flex w-full sm:w-[92px] flex-col items-center justify-center gap-1 rounded-[12px] border border-[#FF6900] bg-[#FFF0E3] px-2.5 py-2.5 text-center shadow-[0_8px_18px_-10px_rgba(255,105,0,0.35)] transition-transform duration-250 group-hover:-translate-y-0.5"
                : "flex w-full sm:w-[84px] flex-col items-center justify-center gap-1 rounded-[12px] border border-[#E5DED5] bg-[#FAF6F0] px-2 py-2.5 text-center transition-colors duration-250 group-hover:border-[#D49F72]"
            }
          >
            <Icon
              className={
                highlighted
                  ? "h-4 w-4 text-[#FF6900] stroke-[1.9]"
                  : "h-4 w-4 text-[#48433F] stroke-[1.75]"
              }
            />
            <span
              className={
                highlighted
                  ? "font-heading text-[10.5px] font-semibold leading-tight text-[#111111]"
                  : "font-heading text-[10.5px] font-medium leading-tight text-[#48433F]"
              }
            >
              {label}
            </span>
          </div>

          {idx < PROCESS_NODES.length - 1 && (
            <ArrowRight
              style={{ transitionDelay: `${idx * 55}ms` }}
              className="hidden sm:block h-3.5 w-3.5 shrink-0 text-[#817A72] transition-transform duration-250 group-hover:translate-x-0.5 group-hover:text-[#FF6900]"
            />
          )}
        </div>
      ))}
    </div>
  );
}
