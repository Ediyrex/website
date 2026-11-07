'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Verify credentials (in local development default studio credentials or any non-empty input)
    setTimeout(() => {
      if (email && password) {
        setLoading(false)
        router.push('/admin')
      } else {
        setLoading(false)
        setError('Please provide valid administrator credentials.')
      }
    }, 600)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#08090B] px-6 py-12 relative overflow-hidden">
      {/* Ambient background glow */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#D6B77A]/5 blur-[120px] pointer-events-none"
      />

      <div className="w-full max-w-md bg-[#0D0F12] border border-[#252A32] rounded-2xl p-8 sm:p-10 relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block group mb-3">
            <span className="font-manrope font-extrabold text-[24px] tracking-tight text-[#F5F3EE]">
              EDIYREX
            </span>
            <span className="font-manrope font-extrabold text-[13px] text-[#F5F3EE] ml-0.5 -translate-y-1 inline-block">
              ®
            </span>
          </Link>
          <p className="font-mono text-[11px] uppercase tracking-[2px] text-[#777D87]">
            STUDIO WORKSPACE &bull; AUTHENTICATION
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-[12px] font-inter">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-[11.5px] font-inter text-[#8C92A4] uppercase tracking-wider mb-2">
              Studio Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ediyrex.com"
                className="w-full h-[44px] pl-10 pr-3.5 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] text-[13.5px] outline-none transition-colors placeholder:text-[#555D69]"
              />
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555D69]" />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11.5px] font-inter text-[#8C92A4] uppercase tracking-wider mb-2">
              Master Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-[44px] pl-10 pr-10 rounded-lg bg-[#08090B] border border-[#252A32] focus:border-[#D6B77A] text-[#F5F3EE] text-[13.5px] outline-none transition-colors placeholder:text-[#555D69]"
              />
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555D69]" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#555D69] hover:text-[#D0CFCC] transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[46px] mt-2 rounded-[10px] bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[12.5px] uppercase tracking-wide flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Enter Studio Workspace'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#1C2028] text-center">
          <Link
            href="/"
            className="text-[12px] font-inter text-[#777D87] hover:text-[#D6B77A] transition-colors"
          >
            &larr; Return to Public Website
          </Link>
        </div>
      </div>
    </div>
  )
}
