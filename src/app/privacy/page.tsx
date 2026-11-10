import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Ediyrex Studio collects, processes, and protects project enquiry information.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 bg-[#08090B] min-h-screen">
      <div className="max-w-3xl mx-auto px-5 sm:px-8 space-y-10">
        <div>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Privacy Policy" },
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
            Legal &amp; Privacy
          </span>
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-[#F5F3EE]">
            Privacy Policy
          </h1>
          <p className="text-sm font-mono text-[#777D87]">
            Notice version: v1.0 &middot; Ediyrex Studio
          </p>
        </header>

        <div className="space-y-8 text-sm sm:text-base text-[#B2B4BA] leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-heading font-semibold text-xl text-[#F5F3EE]">
              1. Information We Collect
            </h2>
            <p>
              When you submit a project enquiry or discovery-call request on our website, we collect only the details you voluntarily provide: your name, email address, optional company name, optional phone number, service area, indicative budget range, expected timeline, and project goals.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-semibold text-xl text-[#F5F3EE]">
              2. How We Use Your Information
            </h2>
            <p>
              We use submitted enquiry data solely to evaluate your project requirements, prepare a scope response, schedule requested discovery calls, and communicate with you about working with Ediyrex Studio. We do not sell, rent, or trade contact details with third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-semibold text-xl text-[#F5F3EE]">
              3. Cookies &amp; Consent-Gated Analytics
            </h2>
            <p>
              Ediyrex uses essential browser storage to remember your privacy preference and manage secure administrative sessions when signed in. Optional privacy-friendly analytics are only loaded if you explicitly choose &ldquo;Accept analytics&rdquo; in our cookie preferences banner. We never run invasive advertising trackers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-heading font-semibold text-xl text-[#F5F3EE]">
              4. Data Retention &amp; Requests
            </h2>
            <p>
              We retain enquiry records only as long as reasonably necessary to manage active project discussions or fulfill legal obligations. To request access, correction, or deletion of your enquiry details, please email{" "}
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

