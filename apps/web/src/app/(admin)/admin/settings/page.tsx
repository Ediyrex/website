'use client'

import { useState } from 'react'
import { Save, Check } from 'lucide-react'

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'EDIYREX®',
    tagline: 'Creative Media. Powerful Web. Intelligent Agents.',
    contactEmail: 'hello@ediyrex.com',
    location: 'Mumbai / Remote Global',
    responseTime: '< 24 hours',
    instagram: 'https://instagram.com/ediyrex',
    linkedin: 'https://linkedin.com/company/ediyrex',
    twitter: 'https://x.com/ediyrex',
    calcomUrl: 'https://cal.com/ediyrex',
  })

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-manrope font-extrabold text-[22px] uppercase text-[#F5F3EE]">
            STUDIO &amp; SITE SETTINGS
          </h1>
          <p className="font-inter text-[13px] text-[#8C92A4] mt-0.5">
            Configure global brand attributes, public contact channels, and discovery call integrations
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Brand Information */}
        <div className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-6 space-y-4">
          <h2 className="font-manrope font-bold text-[15px] uppercase text-[#F5F3EE] border-b border-[#252A32] pb-3">
            1. Brand Identity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] font-inter">
            <div>
              <label className="block text-[#8C92A4] text-[11px] font-mono uppercase mb-1.5">
                Studio Wordmark
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="w-full h-[40px] px-3 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] outline-none"
              />
            </div>
            <div>
              <label className="block text-[#8C92A4] text-[11px] font-mono uppercase mb-1.5">
                Primary Contact Email
              </label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                className="w-full h-[40px] px-3 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[#8C92A4] text-[11px] font-mono uppercase mb-1.5">
                Global Tagline
              </label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full h-[40px] px-3 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Channels & External Integrations */}
        <div className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-6 space-y-4">
          <h2 className="font-manrope font-bold text-[15px] uppercase text-[#F5F3EE] border-b border-[#252A32] pb-3">
            2. Social &amp; Discovery Channels
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] font-inter">
            <div>
              <label className="block text-[#8C92A4] text-[11px] font-mono uppercase mb-1.5">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={settings.linkedin}
                onChange={(e) => setSettings({ ...settings, linkedin: e.target.value })}
                className="w-full h-[40px] px-3 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] outline-none"
              />
            </div>
            <div>
              <label className="block text-[#8C92A4] text-[11px] font-mono uppercase mb-1.5">
                Twitter / X URL
              </label>
              <input
                type="url"
                value={settings.twitter}
                onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                className="w-full h-[40px] px-3 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[#8C92A4] text-[11px] font-mono uppercase mb-1.5">
                Cal.com Discovery Booking URL
              </label>
              <input
                type="url"
                value={settings.calcomUrl}
                onChange={(e) => setSettings({ ...settings, calcomUrl: e.target.value })}
                className="w-full h-[40px] px-3 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 h-[42px] rounded-lg bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[12px] uppercase tracking-wide transition-colors"
          >
            {saved ? (
              <>
                <Check size={14} className="text-emerald-700" />
                <span>Settings Saved</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>Save Changes</span>
              </>
            )}
          </button>
          {saved && (
            <span className="text-[12px] font-mono text-emerald-400">
              Live configuration updated successfully.
            </span>
          )}
        </div>
      </form>
    </div>
  )
}

