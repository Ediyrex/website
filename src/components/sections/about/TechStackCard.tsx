import React from "react";
import Image from "next/image";

function NextJsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
      <circle cx="12" cy="12" r="10" fill="white" />
      <path
        d="M8.5 16V8.5L17.2 19.2"
        stroke="#11100F"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.5 8.5V14"
        stroke="#11100F"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
    </svg>
  );
}

function NodeJsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
      <path
        d="M12 2.5L20.2 7.25V16.75L12 21.5L3.8 16.75V7.25L12 2.5Z"
        fill="#539E43"
        fillOpacity="0.22"
        stroke="#6CC24A"
        strokeWidth="1.6"
      />
      <path
        d="M9.5 14.2C9.5 15.1 10.6 15.8 12 15.8C13.5 15.8 14.5 15 14.5 14C14.5 12.9 13.4 12.6 11.9 12.3C10.5 12 9.6 11.7 9.6 10.7C9.6 9.7 10.6 9 12 9C13.3 9 14.2 9.6 14.3 10.4"
        stroke="#6CC24A"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PostgresIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
      <ellipse
        cx="12"
        cy="6.5"
        rx="6.5"
        ry="2.8"
        stroke="#699ECA"
        strokeWidth="1.6"
      />
      <path
        d="M5.5 6.5V12C5.5 13.55 8.4 14.8 12 14.8C15.6 14.8 18.5 13.55 18.5 12V6.5"
        stroke="#699ECA"
        strokeWidth="1.6"
      />
      <path
        d="M5.5 12V17.2C5.5 18.75 8.4 20 12 20C15.6 20 18.5 18.75 18.5 17.2V12"
        stroke="#699ECA"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function ReactIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
      <circle cx="12" cy="12" r="1.8" fill="#61DAFB" />
      <ellipse
        cx="12"
        cy="12"
        rx="9.5"
        ry="3.6"
        stroke="#61DAFB"
        strokeWidth="1.4"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9.5"
        ry="3.6"
        transform="rotate(60 12 12)"
        stroke="#61DAFB"
        strokeWidth="1.4"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="9.5"
        ry="3.6"
        transform="rotate(120 12 12)"
        stroke="#61DAFB"
        strokeWidth="1.4"
      />
    </svg>
  );
}

function DockerIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
      <path
        d="M3.5 13.5H18.5C19.8 13.5 21 12.7 21.5 11.7C20.2 11.4 19.3 11.7 18.7 12.1C18.9 10.9 18.3 9.7 17.4 9.1C16.8 10 16.7 11.2 17 12H3.5C3.5 16 6.2 19 11 19C15.3 19 18.3 16.8 19.2 13.5"
        stroke="#2496ED"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="6" y="10" width="2.4" height="2" rx="0.3" fill="#2496ED" />
      <rect x="9.3" y="10" width="2.4" height="2" rx="0.3" fill="#2496ED" />
      <rect x="12.6" y="10" width="2.4" height="2" rx="0.3" fill="#2496ED" />
      <rect x="9.3" y="7.2" width="2.4" height="2" rx="0.3" fill="#2496ED" />
    </svg>
  );
}

function AiAgentsIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" fill="none">
      <path
        d="M12 3L14.2 9.8L21 12L14.2 14.2L12 21L9.8 14.2L3 12L9.8 9.8L12 3Z"
        stroke="#FF6900"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const TECH_STACK = [
  { label: "Next.js", Icon: NextJsIcon },
  { label: "Node.js", Icon: NodeJsIcon },
  { label: "PostgreSQL", Icon: PostgresIcon },
  { label: "React", Icon: ReactIcon },
  { label: "Docker", Icon: DockerIcon },
  { label: "AI / Agents", Icon: AiAgentsIcon },
] as const;

export function TechStackCard() {
  return (
    <article
      data-about-tech
      className="relative overflow-hidden rounded-[18px] bg-[#11100F] text-white p-5 sm:p-5 lg:p-6 flex flex-col justify-between gap-4 h-full"
    >
      {/* Background Abstract Flowing Light */}
      <Image
        src="/images/about/tech-stack.png"
        alt="Abstract black and warm orange light background representing studio engineering stack"
        fill
        sizes="(min-width: 1024px) 29vw, (min-width: 768px) 50vw, 100vw"
        className="object-cover object-bottom-right"
      />

      {/* Subtle Dark Scrim for Pill & Text Clarity */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#11100F]/85 via-[#11100F]/60 to-[#11100F]/40"
      />

      {/* Top Heading + Statement */}
      <div className="relative z-10 space-y-2.5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-white/90 shrink-0">
            BUILT ON
          </span>
          <span aria-hidden="true" className="h-px flex-1 bg-white/20" />
        </div>

        <h3
          style={{ fontFamily: "var(--font-playfair)" }}
          className="text-[20px] sm:text-[21px] lg:text-[19px] xl:text-[22px] font-normal leading-[1.2] text-white"
        >
          A modern, scalable and automation-first stack.
        </h3>
      </div>

      {/* Technology Pills */}
      <div className="relative z-10 flex flex-wrap gap-2">
        {TECH_STACK.map(({ label, Icon }) => (
          <div
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full bg-black/55 backdrop-blur-sm border border-white/15 px-2.5 py-1.5 text-[11.5px] xl:text-[12.5px] font-medium text-white whitespace-nowrap transition-colors duration-200 hover:border-[#FF6900]/60"
          >
            <Icon />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
