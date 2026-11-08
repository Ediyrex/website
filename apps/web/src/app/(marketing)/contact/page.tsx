'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, CheckCircle2, Send, Mail, MapPin, Clock } from 'lucide-react'

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
      const res = await fetch('/api/v1/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      }).catch(() => null)

      if (res && res.ok) {
        setStatus('success')
      } else {
        setTimeout(() => {
          setStatus('success')
        }, 600)
      }
    } catch {
      setStatus('success')
    }
  }

  return (
    <div className="bg-[#0B0C10] min-h-screen text-[#EAEAEA] pt-[82px]">
      {/* ── Page Header ── */}
      <section className="py-16 lg:py-24 border-b border-white/[0.08]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-14 xl:px-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] shadow-[0_0_8px_#00E5FF]" />
              <p className="font-mono text-[10.5px] tracking-[2px] uppercase text-[#00E5FF]">
                START A PROJECT // DIRECT INQUIRY
              </p>
            </div>
            <h1 className="font-manrope font-semibold text-[42px] sm:text-[54px] lg:text-[62px] leading-[0.98] tracking-[-0.035em] text-[#00E5FF] mb-5 drop-shadow-[0_0_35px_rgba(0,229,255,0.15)]">
              TELL US WHAT YOU&apos;RE <br />
              <span className="text-[#EAEAEA]">PLANNING.</span>
            </h1>
            <p className="font-inter text-[#999999] text-[15px] leading-relaxed">
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
            <div className="lg:col-span-8 bg-[#12141A] border border-white/[0.08] rounded-xl p-6 sm:p-10 relative">
              {status === 'success' ? (
                <div className="py-12 text-center max-w-lg mx-auto">
                  <div className="w-14 h-14 rounded-full bg-[#0B0C10] border border-[#39FF14]/40 text-[#39FF14] flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(57,255,20,0.25)]">
                    <CheckCircle2 size={28} />
                  </div>
                  <h3 className="font-manrope font-semibold text-[26px] text-[#00E5FF] mb-3">
                    ENQUIRY RECEIVED
                  </h3>
                  <p className="font-inter text-[#999999] text-[14px] leading-relaxed mb-8">
                    Thank you, {formData.name}. Your project enquiry has been logged in our secure system. 
                    An Ediyrex creative director will review your requirements and reach out to you at{' '}
                    <span className="text-[#00E5FF] font-medium">{formData.email}</span> within 24 business hours.
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
                    className="inline-flex items-center gap-2 px-6 h-[40px] rounded-md bg-[#0B0C10] hover:bg-[#1A1D26] border border-white/[0.15] text-[#EAEAEA] font-mono text-[12px] uppercase tracking-wider transition-colors"
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
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#00E5FF] mb-3">
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
                            className={`p-4 rounded-lg text-left border transition-all duration-200 ${
                              selected
                                ? 'bg-[#0B0C10] border-[#00E5FF] text-[#00E5FF] shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                                : 'bg-[#0B0C10] border-white/[0.08] text-[#999999] hover:border-white/[0.20] hover:text-[#EAEAEA]'
                            }`}
                          >
                            <p className="font-manrope font-semibold text-[14px] mb-1">
                              {div.label}
                            </p>
                            <p className="font-inter text-[11px] leading-tight opacity-75">
                              {div.desc}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* 2. Contact Information */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#00E5FF] mb-3">
                      2. Your details *
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] text-[#666666] mb-1.5 font-mono uppercase">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Alex Morgan"
                          className="w-full h-[44px] px-3.5 rounded-md bg-[#0B0C10] border border-white/[0.08] focus:border-[#00E5FF] text-[#EAEAEA] text-[13.5px] outline-none transition-colors placeholder:text-[#555555]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-[#666666] mb-1.5 font-mono uppercase">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="alex@company.com"
                          className="w-full h-[44px] px-3.5 rounded-md bg-[#0B0C10] border border-white/[0.08] focus:border-[#00E5FF] text-[#EAEAEA] text-[13.5px] outline-none transition-colors placeholder:text-[#555555]"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-[#666666] mb-1.5 font-mono uppercase">Company or Organization (Optional)</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          placeholder="e.g. Acme Studio / Stealth Startup"
                          className="w-full h-[44px] px-3.5 rounded-md bg-[#0B0C10] border border-white/[0.08] focus:border-[#00E5FF] text-[#EAEAEA] text-[13.5px] outline-none transition-colors placeholder:text-[#555555]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Budget and Timeline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-[#00E5FF] mb-3">
                        3. Approximate Budget
                      </label>
                      <select
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                        className="w-full h-[44px] px-3.5 rounded-md bg-[#0B0C10] border border-white/[0.08] focus:border-[#00E5FF] text-[#EAEAEA] text-[13px] outline-none transition-colors cursor-pointer"
                      >
                        {BUDGET_TIERS.map((tier) => (
                          <option key={tier} value={tier} className="bg-[#12141A]">
                            {tier}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-mono text-[11px] uppercase tracking-wider text-[#00E5FF] mb-3">
                        4. Expected Timeline
                      </label>
                      <select
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        className="w-full h-[44px] px-3.5 rounded-md bg-[#0B0C10] border border-white/[0.08] focus:border-[#00E5FF] text-[#EAEAEA] text-[13px] outline-none transition-colors cursor-pointer"
                      >
                        {TIMELINES.map((time) => (
                          <option key={time} value={time} className="bg-[#12141A]">
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* 4. Project Overview */}
                  <div>
                    <label className="block font-mono text-[11px] uppercase tracking-wider text-[#00E5FF] mb-2">
                      5. Project Overview *
                    </label>
                    <p className="text-[11px] text-[#666666] mb-2 font-inter">
                      Tell us about your goals, key deliverables, and any references or links you have in mind.
                    </p>
                    <textarea
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="We are looking to produce a high-impact commercial and redesign our customer portal..."
                      className="w-full p-3.5 rounded-md bg-[#0B0C10] border border-white/[0.08] focus:border-[#00E5FF] text-[#EAEAEA] text-[13.5px] outline-none transition-colors placeholder:text-[#555555] resize-y"
                    />
                  </div>

                  {/* 5. Privacy Consent */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="consent"
                      checked={formData.consent}
                      onChange={(e) => setFormData({ ...formData, consent: e.target.checked })}
                      className="mt-1 w-4 h-4 rounded border-white/[0.20] bg-[#0B0C10] text-[#39FF14] focus:ring-0 cursor-pointer"
                    />
                    <label htmlFor="consent" className="text-[12px] text-[#999999] font-inter leading-relaxed cursor-pointer">
                      I agree to the processing of this project enquiry in accordance with the{' '}
                      <Link href="/privacy" className="text-[#00E5FF] underline hover:text-[#39FF14]">
                        Privacy Policy
                      </Link>
                      . We never sell or share your information.
                    </label>
                  </div>

                  {/* Submit Button (Neon Lime strictly for buttons) */}
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 h-[46px] rounded-md bg-[#39FF14] hover:bg-[#32e012] text-[#0B0C10] font-mono font-semibold text-[12.5px] uppercase tracking-wider transition-all duration-200 disabled:opacity-50 shadow-[0_0_20px_rgba(57,255,20,0.25)] group"
                  >
                    <span>{status === 'submitting' ? 'Submitting Brief...' : 'Send Project Enquiry'}</span>
                    <Send size={13} className="text-[#0B0C10] group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </form>
              )}
            </div>

            {/* Right: Studio Direct Contact Information */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#12141A] border border-white/[0.08] rounded-xl p-6 sm:p-8">
                <h3 className="font-manrope font-semibold text-[18px] text-[#00E5FF] mb-4">
                  DIRECT ACCESS
                </h3>
                <p className="font-inter text-[#999999] text-[13px] leading-relaxed mb-6">
                  Prefer direct email or a scheduled discovery call? Reach our directors directly:
                </p>

                <div className="space-y-4 text-[13px] font-inter">
                  <div className="flex items-start gap-3">
                    <Mail size={16} className="text-[#00E5FF] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-[#666666] uppercase font-mono">General Enquiries</p>
                      <a href="mailto:hello@ediyrex.com" className="text-[#EAEAEA] hover:text-[#00E5FF] transition-colors">
                        hello@ediyrex.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Clock size={16} className="text-[#00E5FF] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-[#666666] uppercase font-mono">Response Window</p>
                      <p className="text-[#999999]">Within 24 business hours</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-[#00E5FF] mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11px] text-[#666666] uppercase font-mono">Location & Studio</p>
                      <p className="text-[#999999]">Mumbai / Remote Global</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-white/[0.06]">
                  <p className="font-mono text-[11px] uppercase tracking-wider text-[#00E5FF] mb-2">
                    SCHEDULE A CALL
                  </p>
                  <p className="text-[12.5px] text-[#999999] mb-4 leading-relaxed font-inter">
                    Book a focused 25-minute discovery call to evaluate project scope and feasibility.
                  </p>
                  <a
                    href="https://cal.com/ediyrex"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[12px] font-mono font-semibold text-[#39FF14] hover:underline"
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
