"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQ_ITEMS = [
  {
    question: "What does Ediyrex Studio do?",
    answer:
      "Ediyrex is a creative technology studio uniting three connected disciplines: Media (video production, brand films, photography, short-form reels, and motion graphics), Digital (websites, landing pages, e-commerce, SaaS platforms, and brand identity), and AI (autonomous agents, business workflow automation, chatbots, voice receptionists, and RAG knowledge systems).",
  },
  {
    question: "Can I combine Media, Digital and AI services in one project?",
    answer:
      "Yes. Combining divisions is one of our core strengths—for example, producing launch films and brand identity alongside a high-converting website and an integrated AI lead-qualification or support workflow.",
  },
  {
    question: "Do you work with startups and established businesses?",
    answer:
      "Yes. We partner with early-stage startups launching their first digital product or brand presence, as well as established organizations modernizing customer experiences and automating internal operations.",
  },
  {
    question: "Do you work with international clients?",
    answer:
      "Yes. Ediyrex serves clients across India and international markets, with remote collaboration workflows and transparent scoping in both INR and USD.",
  },
  {
    question: "How is project pricing determined?",
    answer:
      "We scope every engagement around your objectives, complexity, and required deliverables rather than forcing one-size-fits-all pricing. After an initial discovery call, we provide a clear custom quotation and milestone plan.",
  },
  {
    question: "What happens after I submit an enquiry?",
    answer:
      "Our studio leads review your brief directly and respond within 24 business hours to clarify requirements or schedule a 30-minute discovery call.",
  },
  {
    question: "Can you work with an existing team or product?",
    answer:
      "Yes. We regularly integrate AI capabilities into existing software products, refresh established websites, or collaborate alongside internal engineering and marketing teams.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. Following project delivery, teams can choose an ongoing collaboration arrangement for continued content production, platform iteration, or workflow maintenance.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="py-16 md:py-24 bg-[#08090B] border-b border-[#252A32]"
    >
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
              Questions
            </span>
            <h2 className="font-heading font-semibold tracking-tight text-[#F5F3EE] text-[clamp(1.75rem,3vw,2.5rem)] leading-[1.15]">
              Frequently asked questions
            </h2>
            <p className="text-sm text-[#B2B4BA] leading-relaxed">
              Practical answers about how Ediyrex plans, prices, and delivers creative, digital, and AI projects.
            </p>
          </div>

          <div className="lg:col-span-8 divide-y divide-[#252A32] border-y border-[#252A32]">
            {FAQ_ITEMS.map((item, index) => {
              const isOpen = openIndex === index;
              const panelId = `faq-panel-${index}`;
              const buttonId = `faq-button-${index}`;

              return (
                <div key={item.question} className="py-1">
                  <h3>
                    <button
                      id={buttonId}
                      type="button"
                      onClick={() => toggle(index)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="w-full py-5 flex items-center justify-between gap-4 text-left text-[#F5F3EE] hover:text-[#D6B77A] transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D6B77A] rounded"
                    >
                      <span className="font-heading font-medium text-base sm:text-lg">
                        {item.question}
                      </span>
                      <span className="w-7 h-7 rounded-md bg-[#12151A] border border-[#252A32] flex items-center justify-center shrink-0 text-[#B2B4BA]">
                        {isOpen ? (
                          <Minus className="w-4 h-4 text-[#D6B77A]" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                      </span>
                    </button>
                  </h3>

                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className={cn(
                      "overflow-hidden transition-all duration-200",
                      isOpen ? "max-h-96 pb-5" : "max-h-0"
                    )}
                  >
                    <p className="text-sm text-[#B2B4BA] leading-relaxed max-w-2xl">
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
