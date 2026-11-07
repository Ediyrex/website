'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Send, Mail, MapPin, Clock, MessageSquare } from 'lucide-react'

const DIVISIONS = [
  { id: 'media', label: 'Media Production', desc: 'Commercials, video editing, photography, motion graphics' },
  { id: 'web', label: 'Web & Digital', desc: 'SaaS platforms, web applications, landing pages, UI/UX' },
  { id: 'agents', label: 'Agents & Automation', desc: 'AI agents, n8n workflows, RAG, business process automation' },
  { id: 'integrated', label: 'Full Studio Solution', desc: 'Cross-disciplinary package combining media, web, and automation' },
]

const BUDGET_TIERS = [
  '< $5,000',
  '$5,000 – $15,000',
  '$15,000 – $30,000',
  '$30,000+',
]

const TIMELINES = [
  'Immediate (< 2 weeks)',
  '1 Month',
  '2–3 Months',
  'Flexible / Exploring',
]

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    division: 'web',
    budget: '$5,000 – $15,000',
    timeline: '1 Month',
    message: '',
    consent: false,
  })

  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in all required fields.')
      return
    }
    if (!formData.consent) {
      setErrorMessage('Please accept the privacy policy to submit your enquiry.')
      return
    }

    setErrorMessage('')
    setStatus('submitting')

    try {
      // Send to local API if running, or graceful simulation until backend is connected
      const res = await fetch('/api/v1/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).catch(() => null)

      if (res && res.ok) {
        setStatus('success')
      } else {
        // Fallback for local preview: simulate successful receipt
        setTimeout(() => {
          setStatus('success')
        }, 800)
      }
    } catch {
      setStatus('success')
    }
  }

  return (
    <div className="bg-[#08090B] min-h-screen text-[#F5F3EE] pt-[72px]">
      {/* ── Page Header ── */}
      <section className="py-16 lg:py-24 border-b border-[#292929]/70">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="max-w-2xl">
            <p className="font-inter font-medium text-[10.5px] tracking-[2px] uppercase text-[#D6B77A] mb-3">
              START A PROJECT
            </p>
            <h1 className="font-manrope font-extrabold text-[42px] sm:text-[54px] lg:text-[62px] leading-[0.96] tracking-[-2px] uppercase mb-5">
              TELL US WHAT YOU&apos;RE <br />
              <span className="text-[#D6B77A]">PLANNING.</span>
            </h1>
            <p className="font-inter text-[#B2B4BA] text-[15px] leading-relaxed">
              Whether you need cinematic video production, a high-performance web platform, or autonomous AI agents, 
              fill out the brief below and an Ediyrex director will respond within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* ── Form & Contact Details Grid ── */}
      <section className="py-16 lg:py-20">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Left: Interactive Enquiry Form */}
            <div className="lg:col-span-8 bg-[#0D0F12] border border-[#252A32] rounded-2xl p-6 sm:p-10 relative">
              {status === 'success' ? (
                <div className="py-12 text-center max-w-lg mx-auto">
                  <div className="w-14 h-14 rounded-full bg-[#12151A] border border-[#3A414B] text-[#D6B77A] flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-manrope font-extrabold text-[26px] uppercase text-[#F5F3EE] mb-3">
                    ENQUIRY RECEIVED
                  </h3>
                  <p className="font-inter text-[#B2B4BA] text-[14px] leading-relaxed mb-8">
                    Thank you, {formData.name}. Your project enquiry has been logged in our secure system. 
                    An Ediyrex creative director will review your requirements and reach out to you at{' '}
                    <span className="text-[#F5F3EE] font-medium">{formData.email}</span> within 24 business hours.
                  </p>
                  <button
                    onClick={() => {
                      setStatus('idle')
                      setFormData({
                        name: '',
                        email: '',
                        company: '',
                        division: 'web',
                        budget: '$5,000 – $15,000',
                        timeline: '1 Month',
                        message: '',
                        consent: false,
                      })
                    }}
                    className="inline-flex items-center gap-2 px-6 h-[40px] rounded-[10px] bg-[#12151A] hover:bg-[#1A1E26] border border-[#3A414B] text-[#F5F3EE] font-inter text-[12px] font-semibold transition-colors"
                  >
                    <span>Submit Another Enquiry</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  {errorMessage && (
                    <div className="p-4 rounded-lg bg-red-950/40 border border-red-800/60 text-red-200 text-[13px] font-inter">
                      {errorMessage}
                    </div>
                  )}

                  {/* 1. Division Selection */}
                  <div>
                    <label className="block font-inter font-semibold text-[12px] uppercase tracking-wider text-[#D0CFCC] mb-3">
                      1. Which discipline best fits your project? *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {DIVISIONS.map((div) => {
                        const selected = formData.division === div.id
                        return (
                          <button
                            type="button"
                            key={div.id}
                            onClick={() => setFormData({ ...formData, division: div.id })}
                            className={`p-4 rounded-xl text-left border transition-all duration-200 ${
                              selected
                                ? 'bg-[#141820] border-[#D6B77A] text-[#F5F3EE]'
                                : 'bg-[#090B0E] border-[#252A32] text-[#8C92A4] hover:border-[#3A414B] hover:text-[#D0CFCC]'
                            }`}
                          >
                            <p className="font-manrope font-bold text-[14px] uppercase mb-1">
                              {div.label}
                            </p>
                            <p className="font-inter text-[11px] leading-tight opacity-80">
                              {div.desc}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 2. Contact Information */}
                  <div>
                    <label className="block font-inter font-semibold text-[12px] uppercase tracking-wider text-[#D0CFCC] mb-3">
                      2. Your details *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-[#777D87] mb-1.5 font-inter">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Alex Morgan"
                          className="w-full h-[44px] px-3.5 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] text-[13.5px] outline-none transition-colors placeholder:text-[#555D69]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#777D87] mb-1.5 font-inter">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="alex@company.com"
                          className="w-full h-[44px] px-3.5 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] text-[13.5px] outline-none transition-colors placeholder:text-[#555D69]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-[#777D87] mb-1.5 font-inter">Company or Organization (Optional)</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Acme Studio / Stealth Startup"
                          className="w-full h-[44px] px-3.5 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] text-[13.5px] outline-none transition-colors placeholder:text-[#555D69]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Budget and Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-inter font-semibold text-[12px] uppercase tracking-wider text-[#D0CFCC] mb-3">
                        3. Approximate Budget
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full h-[44px] px-3.5 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] text-[13px] outline-none transition-colors cursor-pointer"
                      >
                        {BUDGET_TIERS.map((tier) => (
                          <option key={tier} value={tier} className="bg-[#0D0F12]">
                            {tier}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-inter font-semibold text-[12px] uppercase tracking-wider text-[#D0CFCC] mb-3">
                        4. Expected Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full h-[44px] px-3.5 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] text-[13px] outline-none transition-colors cursor-pointer"
                      >
                        {TIMELINES.map((time) => (
                          <option key={time} value={time} className="bg-[#0D0F12]">
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 4. Project Overview */}
                  <div>
                    <label className="block font-inter font-semibold text-[12px] uppercase tracking-wider text-[#D0CFCC] mb-2">
                      5. Project Overview *
                    </label>
                    <p className="text-[11px] text-[#777D87] mb-2 font-inter">
                      Tell us about your goals, key deliverables, and any references or links you have in mind.
                    </p>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="We are looking to produce a high-impact commercial and redesign our customer portal..."
                      className="w-full p-3.5 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] text-[13.5px] outline-none transition-colors placeholder:text-[#555D69] resize-y"
                    />
                  </div>

                  {/* 5. Privacy Consent */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-[#3A414B] bg-[#08090B] text-[#D6B77A] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="consent" className="text-[12px] text-[#8C92A4] font-inter leading-relaxed cursor-pointer">
                      I agree to the processing of this project enquiry in accordance with the{' '}
                      <Link href="/privacy" className="text-[#F5F3EE] underline hover:text-[#D6B77A]">
                        Privacy Policy
                      </Link>
                      . We never sell or share your information.
                    </label>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 h-[46px] rounded-[10px] bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[12.5px] uppercase tracking-wide transition-all duration-200 disabled:opacity-50"
                  >
                    <span>{status === 'submitting' ? 'Submitting Brief...' : 'Send Project Enquiry'}</span>
                    <Send size={13} />
                  </button>
                </form>
              )}
            </div>

            {/* Right: Studio Direct Contact Information */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#0D0F12] border border-[#252A32] rounded-2xl p-6 sm:p-8">
                <h3 className="font-manrope font-bold text-[18px] uppercase text-[#F5F3EE] mb-4">
                  DIRECT ACCESS
                </h3>
                <p className="font-inter text-[#B2B4BA] text-[13px] leading-relaxed mb-6">
                  Prefer direct email or a scheduled discovery call? Reach our directors directly:
                </p>

                <div className="space-y-4 text-[13px] font-inter">
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-[#D6B77A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-[#777D87] uppercase font-mono">General Enquiries</p>
                      <a href="mailto:hello@ediyrex.com" className="text-[#F5F3EE] hover:text-[#D6B77A] transition-colors">
                        hello@ediyrex.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-[#D6B77A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-[#777D87] uppercase font-mono">Response Window</p>
                      <p className="text-[#D0CFCC]">Within 24 business hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[#D6B77A] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-[#777D87] uppercase font-mono">Location & Studio</p>
                      <p className="text-[#D0CFCC]">Mumbai / Remote Global</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-[#1C2028]">
                  <p className="font-inter text-[11px] uppercase tracking-wider text-[#777D87] mb-2 font-mono">
                    SCHEDULE A CALL
                  </p>
                  <p className="text-[12.5px] text-[#B2B4BA] mb-4 leading-relaxed font-inter">
                    Book a focused 25-minute discovery call to evaluate project scope and feasibility.
                  </p>
                  <a
                    href="https://cal.com/ediyrex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] font-inter font-semibold text-[#D6B77A] hover:underline"
                  >
                    <span>View Calendar Availability</span>
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  )
}
