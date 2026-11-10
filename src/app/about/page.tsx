import type { Metadata } from "next";
import { ArrowUpRight, Cpu, Film, Globe } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HybridModelSection } from "@/components/sections/HybridModelSection";
import { TrustSection } from "@/components/sections/TrustSection";
import { FinalCtaSection } from "@/components/sections/FinalCtaSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "About Ediyrex Studio: an independent creative technology studio uniting Media, Digital, and Artificial Intelligence.",
};

export default function AboutPage() {
  return (
    <div className="bg-[#08090B]">
      {/* Hero */}
      <section
        className="pt-36 pb-20 border-b border-[#252A32]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 65% 55% at 50% 20%, #29241B 0%, #08090B 72%)",
        }}
      >
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl space-y-6">
            <Badge variant="accent">About Ediyrex</Badge>
            <h1 className="font-heading font-bold tracking-tight text-[#F5F3EE] text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.06]">
              One integrated studio for creativity, technology and intelligence.
            </h1>
            <p className="text-base sm:text-lg text-[#B2B4BA] leading-relaxed">
              Ediyrex brings together media production, full-stack software engineering, and practical AI automation. Operating across India and international markets, our client services fund and refine our own studio-built products.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Button href="/contact" variant="primary" size="lg">
                <span>Book a discovery call</span>
                <ArrowUpRight className="w-4 h-4" />
              </Button>
              <Button href="/services" variant="secondary" size="lg">
                <span>Explore services</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What Connects Media, Digital and AI */}
      <section className="py-16 md:py-24 bg-[#0D0F12] border-b border-[#252A32]">
        <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-12 space-y-10">
          <div className="max-w-2xl space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
              Philosophy
            </span>
            <h2 className="font-heading font-semibold text-2xl sm:text-4xl text-[#F5F3EE]">
              Why three disciplines belong together
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-7 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-3">
              <Film className="w-5 h-5 text-[#E58A76]" strokeWidth={1.75} />
              <h3 className="font-heading font-semibold text-xl text-[#F5F3EE]">
                01 / Media
              </h3>
              <p className="text-sm text-[#B2B4BA] leading-relaxed">
                Visual craft captures attention and communicates brand value before a prospect ever reads a technical specification.
              </p>
            </div>
            <div className="p-7 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-3">
              <Globe className="w-5 h-5 text-[#7BA9F5]" strokeWidth={1.75} />
              <h3 className="font-heading font-semibold text-xl text-[#F5F3EE]">
                02 / Digital
              </h3>
              <p className="text-sm text-[#B2B4BA] leading-relaxed">
                Thoughtful web platforms, e-commerce systems, and SaaS applications convert that attention into measurable customer action.
              </p>
            </div>
            <div className="p-7 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-3">
              <Cpu className="w-5 h-5 text-[#B5A0F5]" strokeWidth={1.75} />
              <h3 className="font-heading font-semibold text-xl text-[#F5F3EE]">
                03 / Artificial Intelligence
              </h3>
              <p className="text-sm text-[#B2B4BA] leading-relaxed">
                Autonomous agents, RAG retrieval, and workflow automation remove repetitive friction once systems are live.
              </p>
            </div>
          </div>
        </div>
      </section>

      <HybridModelSection />
      <TrustSection />
      <FinalCtaSection />
    </div>
  );
}
