import React from "react";
import { ArrowUpRight } from "lucide-react";

interface IntakeStep {
  number: string;
  title: string;
  subtitle: string;
}

const INTAKE_STEPS: readonly IntakeStep[] = [
  {
    number: "01",
    title: "THE IDEA",
    subtitle: "What are you trying to create or improve?",
  },
  {
    number: "02",
    title: "THE REQUIREMENT",
    subtitle: "Which capabilities or services do you need?",
  },
  {
    number: "03",
    title: "THE DIRECTION",
    subtitle: "Your timeline, priorities and expectations.",
  },
];

export function ContactProjectIntakeHero() {
  return (
    <section
      aria-label="Contact and Project Intake"
      className="w-full bg-[#08090B] text-[#F5F3EE] pt-32 pb-16 md:pt-40 md:pb-24 border-b border-[#252A32]"
    >
      <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0 items-start">
          {/* Left Column: Project Invitation */}
          <div className="lg:col-span-7 xl:col-span-7 pr-0 lg:pr-12 xl:pr-16 lg:border-r lg:border-[#252A32] space-y-6">
            {/* Tag / Kicker with Orange Square and Divider Line */}
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 bg-[#FF6900] inline-block shrink-0" />
              <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#F5F3EE]">
                CONTACT / PROJECT INTAKE
              </span>
              <span
                aria-hidden="true"
                className="h-px bg-[#252A32] w-24 sm:w-36 inline-block"
              />
            </div>

            {/* Display Headline */}
            <h1 className="font-heading font-extrabold text-[clamp(2.75rem,5vw,4.75rem)] leading-[1.04] tracking-[-0.035em] text-[#F5F3EE]">
              Have something
              <br />
              worth building?
              <br />
              <span className="text-[#FF6900] italic font-heading font-normal">
                Let&apos;s start a conversation.
              </span>
            </h1>

            {/* Approachable Introduction */}
            <p className="text-base sm:text-lg text-[#8A8F99] leading-relaxed max-w-xl">
              Tell us about your idea, the challenge you&apos;re facing or the system you want to
              build. We&apos;ll help you identify the right approach.
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6900] text-white text-xs sm:text-sm font-mono uppercase font-bold tracking-wider hover:bg-[#E55E00] transition-colors shadow-sm"
              >
                <span>START YOUR PROJECT BRIEF</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="mailto:ediyrex@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-transparent border border-[#3A414B] text-[#F5F3EE] text-xs sm:text-sm font-mono uppercase font-bold tracking-wider hover:border-[#F5F3EE] hover:bg-[#12151A] transition-all"
              >
                <span>EMAIL US</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Right Column: A Good Place to Start */}
          <div className="lg:col-span-5 xl:col-span-5 pl-0 lg:pl-12 xl:pl-16 flex flex-col justify-between pt-4 lg:pt-2">
            <div>
              {/* Kicker */}
              <span className="text-xs font-mono font-bold uppercase tracking-[0.18em] text-[#8A8F99] block mb-8">
                A GOOD PLACE TO START
              </span>

              {/* Informational Guidance Items */}
              <div className="space-y-6">
                {INTAKE_STEPS.map((step, idx) => (
                  <div key={step.number} className="space-y-6">
                    <div className="flex items-start gap-5">
                      <span className="font-heading font-extrabold text-2xl sm:text-3xl text-[#FF6900] leading-none shrink-0 w-8">
                        {step.number}
                      </span>
                      <span
                        aria-hidden="true"
                        className="w-px h-8 bg-[#252A32] shrink-0 self-center"
                      />
                      <div className="space-y-1">
                        <h2 className="font-heading font-extrabold text-base sm:text-lg text-[#F5F3EE] tracking-tight uppercase">
                          {step.title}
                        </h2>
                        <p className="text-xs sm:text-sm text-[#8A8F99] leading-relaxed">
                          {step.subtitle}
                        </p>
                      </div>
                    </div>
                    {idx < INTAKE_STEPS.length - 1 && (
                      <div className="h-px w-full bg-[#252A32]" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Encouraging Subline */}
            <div className="pt-8 border-t border-[#252A32] mt-8">
              <span className="font-mono text-[11px] sm:text-xs font-bold uppercase tracking-[0.18em] text-[#FF6900] block">
                YOU DON&apos;T NEED A PERFECT BRIEF. JUST A START.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

