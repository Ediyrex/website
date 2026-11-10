import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms governing use of the Ediyrex Studio website and informational materials.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="pt-32 pb-24 bg-[#08090B] min-h-screen">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-10">
        <div>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Terms of Service" },
            ]}
          />
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-mono text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
        </div>

        <header className="space-y-4 border-b border-[#252A32] pb-8">
          <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-[#D6B77A] block">
            Legal
          </span>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-[#F5F3EE]">
            Terms of Service
          </h1>
          <p className="text-sm font-mono text-[#777D87]">
            Ediyrex Studio &middot; Informational Website Terms
          </p>
        </header>

        <div className="space-y-8 text-sm sm:text-base text-[#B2B4BA] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-heading font-semibold text-xl text-[#F5F3EE]">
              1. Informational Purpose
            </h2>
            <p>
              This website presents the capabilities, services, and concept explorations of Ediyrex Studio. Content on this website does not constitute a binding commercial offer or fixed quotation. All client engagements are governed by separate written statements of work and service agreements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-semibold text-xl text-[#F5F3EE]">
              2. Concept Work &amp; Intellectual Property
            </h2>
            <p>
              Case studies labeled as &ldquo;Concept project&rdquo; represent internal research and studio prototypes created to illustrate design and engineering capabilities. All original copy, design tokens, visual compositions, and code showcased on this website belong to Ediyrex Studio unless noted otherwise.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-semibold text-xl text-[#F5F3EE]">
              3. Acceptable Use
            </h2>
            <p>
              You agree not to attempt unauthorized access to administrative systems, disrupt public API endpoints, or submit automated spam through the project enquiry interface.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-semibold text-xl text-[#F5F3EE]">
              4. Contact
            </h2>
            <p>
              Questions regarding these terms may be directed to{" "}
              <a
                href="mailto:hello@ediyrex.com"
                className="text-[#D6B77A] hover:text-[#E6CC99] underline"
              >
                hello@ediyrex.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

