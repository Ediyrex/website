import React, { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SITE_CONFIG } from "@/config/site";

export const metadata: Metadata = {
  title: "Enquiry Received",
  description:
    "Thank you for contacting Ediyrex Studio. Review your submission confirmation and next steps.",
  robots: {
    index: false,
    follow: false,
  },
};

async function ThankYouContent({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; stored?: string; call?: string }>;
}) {
  const { ref, stored, call } = await searchParams;
  const isStored = stored === "true";
  const wantsCall = call === "true";

  return (
    <div className="max-w-2xl mx-auto px-5 py-36 text-center space-y-8">
      <div className="w-14 h-14 rounded-full bg-[#54C99A]/10 border border-[#54C99A]/30 text-[#54C99A] flex items-center justify-center mx-auto">
        <CheckCircle className="w-7 h-7" />
      </div>

      <div className="space-y-3">
        <Badge variant={isStored ? "featured" : "concept"}>
          {isStored ? "Enquiry Saved" : "Validated Preview"}
        </Badge>
        <h1 className="font-heading font-bold tracking-tight text-[#F5F3EE] text-3xl sm:text-5xl">
          {isStored ? "Thank you for reaching out." : "Enquiry Validated."}
        </h1>
        {ref && (
          <p className="text-xs font-mono text-[#D6B77A]">
            Reference Code: {ref}
          </p>
        )}
      </div>

      <p className="text-sm sm:text-base text-[#B2B4BA] leading-relaxed">
        {isStored
          ? "Your project brief has been saved securely. Our studio leads will review your scope and follow up within 24 business hours."
          : "Your project brief passed validation in local preview mode. For immediate direct contact, email us using the address below."}
      </p>

      {wantsCall && (
        <div className="p-5 rounded-2xl bg-[#12151A] border border-[#252A32] text-left flex items-start gap-3.5 max-w-lg mx-auto">
          <Calendar className="w-5 h-5 text-[#D6B77A] shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <p className="font-medium text-[#F5F3EE]">
              Discovery Call Requested
            </p>
            <p className="text-[#B2B4BA] leading-relaxed">
              We noted your request for a 30-minute discovery call and will include scheduling options in our reply.
            </p>
          </div>
        </div>
      )}

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Button href="/work" variant="primary" size="md">
          <span>Explore Selected Work</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
        <Link
          href="/services"
          className="text-sm font-medium text-[#B2B4BA] hover:text-[#F5F3EE] px-4 py-2 transition-colors"
        >
          Browse Capabilities
        </Link>
      </div>

      <p className="text-xs font-mono text-[#777D87] pt-4 border-t border-[#252A32]">
        Direct contact:{" "}
        <a
          href={`mailto:${SITE_CONFIG.contact.email}`}
          className="text-[#D6B77A] hover:underline"
        >
          {SITE_CONFIG.contact.email}
        </a>
      </p>
    </div>
  );
}

export default function ThankYouPage(props: {
  searchParams: Promise<{ ref?: string; stored?: string; call?: string }>;
}) {
  return (
    <div className="min-h-[85vh] bg-[#08090B]">
      <Suspense
        fallback={
          <div className="py-36 text-center text-xs font-mono text-[#777D87]">
            Loading confirmation...
          </div>
        }
      >
        <ThankYouContent searchParams={props.searchParams} />
      </Suspense>
    </div>
  );
}
