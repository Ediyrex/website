import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy — EDIYREX®',
  description: 'How Ediyrex Studio handles and protects your project enquiry and website information.',
}

export default function PrivacyPage() {
  return (
    <div className="bg-[#08090B] min-h-screen text-[#F5F3EE] pt-[72px] pb-24">
      <div className="w-full max-w-[900px] mx-auto px-6 sm:px-10 py-16">
        <p className="font-inter font-medium text-[10.5px] tracking-[2px] uppercase text-[#777D87] mb-3">
          LEGAL
        </p>
        <h1 className="font-manrope font-extrabold text-[36px] sm:text-[48px] uppercase tracking-[-1.5px] mb-8">
          PRIVACY POLICY
        </h1>
        <div className="space-y-8 text-[#B2B4BA] text-[14px] leading-relaxed font-inter">
          <p className="text-[12px] font-mono text-[#777D87]">Last Updated: November 2026</p>

          <section className="space-y-3">
            <h2 className="font-manrope font-bold text-[18px] text-[#F5F3EE] uppercase">1. Information We Collect</h2>
            <p>
              When you submit a project enquiry through Ediyrex Studio, we collect your name, email address, optional company name, selected service discipline, project budget range, timeline, and project description.
            </p>
            <p>
              We do not collect unnecessary personal data or sell your information to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-manrope font-bold text-[18px] text-[#F5F3EE] uppercase">2. How We Use Your Data</h2>
            <p>
              Your submitted project information is strictly used to evaluate project feasibility, prepare initial scopes or creative treatments, and communicate directly with you regarding your enquiry.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-manrope font-bold text-[18px] text-[#F5F3EE] uppercase">3. Data Security & Storage</h2>
            <p>
              Enquiries are stored in encrypted relational databases protected by strict server-side access controls. Only authorized studio directors can review submitted briefs.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-manrope font-bold text-[18px] text-[#F5F3EE] uppercase">4. Contact & Deletion Requests</h2>
            <p>
              You have the right to request access to or deletion of your enquiry data at any time. To make a request, contact our studio at{' '}
              <a href="mailto:privacy@ediyrex.com" className="text-[#F5F3EE] underline hover:text-[#D6B77A]">
                privacy@ediyrex.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

