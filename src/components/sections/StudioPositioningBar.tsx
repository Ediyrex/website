import React from "react";

const MARKERS = [
  { label: "Creative production", dot: "#E58A76" },
  { label: "Digital experiences", dot: "#7BA9F5" },
  { label: "Intelligent systems", dot: "#B5A0F5" },
];

export function StudioPositioningBar() {
  return (
    <section
      aria-label="Studio Positioning"
      className="bg-[#08090B] border-y border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-6 sm:gap-10">
            {MARKERS.map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: item.dot }}
                />
                <span className="text-sm font-medium text-[#F5F3EE]">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <p className="text-xs font-mono uppercase tracking-wider text-[#777D87]">
            One integrated partner. Three connected disciplines.
          </p>
        </div>
      </div>
    </section>
  );
}

