'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Upload, Copy, Check, ExternalLink } from 'lucide-react'
import { MEDIA_ASSETS } from '@/features/admin/data/mockAdminData'

export default function AdminMediaPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (path: string, id: string) => {
    navigator.clipboard.writeText(path)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-manrope font-extrabold text-[22px] uppercase text-[#F5F3EE]">
            MEDIA ASSET LIBRARY
          </h1>
          <p className="font-inter text-[13px] text-[#8C92A4] mt-0.5">
            Central repository of optimized studio artwork, photography, and UI graphics
          </p>
        </div>
        <button
          onClick={() => alert('Cloudinary direct upload integration ready for Phase 7.')}
          className="inline-flex items-center gap-1.5 px-4 h-[38px] rounded-lg bg-[#F5F3EE] hover:bg-white text-[#17130B] font-inter font-semibold text-[12px] uppercase tracking-wide transition-colors"
        >
          <Upload size={14} />
          <span>Upload Asset</span>
        </button>
      </div>

      {/* ── Media Grid ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {MEDIA_ASSETS.map((asset) => (
          <div
            key={asset.id}
            className="rounded-xl bg-[#0D0F12] border border-[#252A32] overflow-hidden group hover:border-[#3A414B] transition-all"
          >
            {/* Thumbnail Canvas */}
            <div className="relative aspect-[16/10] bg-[#12151A] border-b border-[#252A32] overflow-hidden flex items-center justify-center">
              <Image
                src={asset.path}
                alt={asset.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            </div>

            {/* Info & Copy Path */}
            <div className="p-4 space-y-2 text-[12px] font-inter">
              <p className="font-semibold text-[#F5F3EE] truncate">{asset.name}</p>
              
              <div className="flex items-center justify-between text-[11px] font-mono text-[#777D87]">
                <span>{asset.dimensions}</span>
                <span>{asset.size}</span>
              </div>

              <div className="pt-2 border-t border-[#1C2028] flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#D6B77A]">{asset.format}</span>
                <button
                  onClick={() => handleCopy(asset.path, asset.id)}
                  className="inline-flex items-center gap-1 text-[11px] font-mono text-[#8C92A4] hover:text-[#F5F3EE] transition-colors"
                  title="Copy relative image path"
                >
                  {copiedId === asset.id ? (
                    <>
                      <Check size={12} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      <span>Copy Path</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

