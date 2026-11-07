import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service — EDIYREX®',
  description: 'Terms and conditions governing the use of the Ediyrex Studio digital platforms and services.',
}

export default function TermsPage() {
  return (
    <div className="bg-[#08090B] min-h-screen text-[#F5F3EE] pt-[72px] pb-24">
      <div className="w-full max-w-[900px] mx-auto px-6 sm:px-10 py-16">
        <p className="font-inter font-medium text-[10.5px] tracking-[2px] uppercase text-[#777D87] mb-3">
          LEGAL
        </p>
        <h1 className="font-manrope font-extrabold text-[36px] sm:text-[48px] uppercase tracking-[-1.5px] mb-8">
          TERMS OF SERVICE
        </h1>
        <div className="space-y-8 text-[#B2B4BA] text-[14px] leading-relaxed font-inter">
          <p className="text-[12px] font-mono text-[#777D87]">Last Updated: November 2026</p>

          <section className="space-y-3">
            <h2 className="font-manrope font-bold text-[18px] text-[#F5F3EE] uppercase">1. Studio Engagement</h2>
            <p>
              By accessing the Ediyrex Studio website or submitting an enquiry, you agree to these Terms. Custom commercial production, software development, and automation services are governed by separate bilateral Statements of Work (SOW).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-manrope font-bold text-[18px] text-[#F5F3EE] uppercase">2. Intellectual Property</h2>
            <p>
              All trademarks, studio identities, typography systems, imagery, and code samples displayed on this website are the intellectual property of Ediyrex Studio or its respective clients and licensors.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-manrope font-bold text-[18px] text-[#F5F3EE] uppercase">3. Limitation of Liability</h2>
            <p>
              Ediyrex Studio provides website materials on an &ldquo;as is&rdquo; basis. In no event shall Ediyrex be liable for any indirect, consequential, or incidental damages arising out of the use of this website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-manrope font-bold text-[18px] text-[#F5F3EE] uppercase">4. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws applicable to studio operations, without regard to conflict of law provisions.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

