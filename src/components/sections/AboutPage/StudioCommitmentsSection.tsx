import React from "react";

interface Commitment {
  index: string;
  title: string;
  description: string;
}

const COMMITMENTS: readonly Commitment[] = [
  {
    index: "01",
    title: "HONEST CONCEPT DISTINCTION",
    description:
      "We distinguish clearly between R&D prototypes and client deliverables, so you always know what's experimental and what's production-ready.",
  },
  {
    index: "02",
    title: "FULL OWNERSHIP & MAINTAINABILITY",
    description:
      "Codebases, brand systems and media masters are built cleanly and documented, so your organization retains control and long-term flexibility.",
  },
  {
    index: "03",
    title: "CLEAR SCOPE BEFORE EXECUTION",
    description:
      "Every engagement begins with a well-defined scope, realistic timelines and direct communication, so the project delivers the expected outcomes.",
  },
];

export function StudioCommitmentsSection() {
  return (
    <section
      id="commitments"
      aria-label="Studio Commitments"
      className="w-full bg-[#08090B] text-[#F5F3EE] py-16 md:py-24 lg:py-28 border-b border-[#252A32]"
    >
      <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-14">
        {/* Section Header */}
        <div className="space-y-4">
          {/* Kicker with Orange Square and Divider Rule */}
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 bg-[#FF6900] inline-block shrink-0" />
            <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#F5F3EE]">
              STUDIO COMMITMENTS
            </span>
            <span
              aria-hidden="true"
              className="h-px bg-[#252A32] w-24 sm:w-36 inline-block"
            />
          </div>

          {/* Headline with Orange Italic Accent */}
          <h2 className="font-heading font-extrabold text-[clamp(2.5rem,4.5vw,4.25rem)] leading-[1.05] tracking-[-0.035em] text-[#F5F3EE]">
            Credibility earned through
            <br />
            transparency,{" "}
            <span className="text-[#FF6900] italic font-heading font-normal">
              not inflated claims.
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-[#8A8F99] leading-relaxed max-w-2xl pt-1">
            The principles that guide how we work, build and partner with every client.
          </p>
        </div>

        {/* 3 Columns Swiss Grid with Vertical Dividers */}
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#252A32] mt-12 lg:mt-16 pt-2">
          {COMMITMENTS.map((item) => (
            <div
              key={item.index}
              className="py-8 md:py-2 md:px-8 first:pl-0 last:pr-0 flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                {/* Orange-bordered pill badge */}
                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded border border-[#FF6900] text-[#FF6900] font-mono text-[11px] font-bold tracking-wider">
                  {item.index}
                </span>
                <h3 className="font-heading font-extrabold text-[17px] sm:text-[18px] text-[#F5F3EE] tracking-tight uppercase leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-[13.5px] text-[#8A8F99] leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Orange Accent Bar */}
              <span
                aria-hidden="true"
                className="block w-8 h-[2px] bg-[#FF6900]"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

