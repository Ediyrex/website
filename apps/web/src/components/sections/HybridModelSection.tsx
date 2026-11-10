import React from "react";
import { ArrowUpRight } from "lucide-react";
import { HYBRID_PRODUCTS_DATA } from "@/features/products/data";
import { Button } from "@/components/ui/Button";

const STUDIO_PRINCIPLES = [
  {
    index: "01",
    title: "One connected team",
    description:
      "Creative, digital and AI work are planned together from day one, eliminating fragmented agency handoffs.",
  },
  {
    index: "02",
    title: "Built around the objective",
    description:
      "Scope, visual treatment and technology stack are chosen strictly according to the business problem.",
  },
  {
    index: "03",
    title: "Craft meets function",
    description:
      "Editorial visual quality and practical everyday usability matter equally in every deliverable.",
  },
  {
    index: "04",
    title: "Designed to evolve",
    description:
      "Deliverables are documented, maintainable and engineered cleanly for future iteration and scale.",
  },
];

export function HybridModelSection() {
  return (
    <section
      id="hybrid-model"
      className="py-16 md:py-28 bg-[#08090B] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Integrated Principles */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
                Why Ediyrex
              </span>
              <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(2rem,3.4vw,3rem)] leading-[1.14]">
                Creative thinking. Technical execution. One connected process.
              </h2>
              <p className="text-[#B2B4BA] text-base leading-relaxed">
                Client engagements fund and pressure-test our internal product development—ensuring every pattern we deploy is grounded in real-world engineering.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {STUDIO_PRINCIPLES.map((item) => (
                <div
                  key={item.index}
                  className="p-5 rounded-xl bg-[#12151A] border border-[#252A32] space-y-2"
                >
                  <span className="text-xs font-mono text-[#D6B77A]">
                    {item.index}
                  </span>
                  <h3 className="font-heading font-semibold text-base text-[#F5F3EE]">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#B2B4BA] leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <Button href="/about" variant="outline" size="md">
                <span>About our studio approach</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Right Column: Hybrid Studio & Venture Pipeline Diagram */}
          <div className="lg:col-span-6 space-y-5">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-6">
              <div className="flex items-center justify-between border-b border-[#252A32] pb-4">
                <div>
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#D6B77A] block">
                    Hybrid Studio Flywheel
                  </span>
                  <h3 className="font-heading font-semibold text-lg text-[#F5F3EE] mt-1">
                    Client Services &times; In-House Labs
                  </h3>
                </div>
                <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#0D0F12] text-[#B2B4BA] border border-[#252A32]">
                  INTERNAL R&amp;D
                </span>
              </div>

              <div className="space-y-3">
                {HYBRID_PRODUCTS_DATA.map((product) => (
                  <div
                    key={product.id}
                    className="p-5 rounded-xl bg-[#0D0F12] border border-[#252A32] hover:border-[#3A414B] transition-colors space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-heading font-semibold text-base text-[#F5F3EE]">
                        {product.name}
                      </h4>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#12151A] text-[#D6B77A] border border-[#252A32]">
                        {product.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#B2B4BA] leading-relaxed">
                      {product.tagline}
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {product.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#12151A] text-[#777D87] border border-[#252A32]"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
