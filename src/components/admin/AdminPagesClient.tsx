import React from "react";
import Link from "next/link";
import { ExternalLink, CheckCircle2 } from "lucide-react";

const PUBLIC_PAGES = [
  { route: "/", name: "Homepage", h1: "Single Hero H1", canonical: "/" },
  { route: "/services", name: "Services Overview", h1: "Single Page H1", canonical: "/services" },
  { route: "/services/media", name: "Media Division", h1: "Single Page H1", canonical: "/services/media" },
  { route: "/services/digital", name: "Digital Division", h1: "Single Page H1", canonical: "/services/digital" },
  { route: "/services/ai", name: "AI Division", h1: "Single Page H1", canonical: "/services/ai" },
  { route: "/work", name: "Portfolio & Case Studies", h1: "Single Page H1", canonical: "/work" },
  { route: "/about", name: "About Studio", h1: "Single Page H1", canonical: "/about" },
  { route: "/contact", name: "Contact & Discovery Call", h1: "Single Page H1", canonical: "/contact" },
  { route: "/privacy", name: "Privacy Policy", h1: "Single Page H1", canonical: "/privacy" },
  { route: "/terms", name: "Terms of Service", h1: "Single Page H1", canonical: "/terms" },
];

export function AdminPagesClient() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
            Website Pages Directory
          </h1>
          <p className="text-sm text-[#8D939E]">
            Public route inventory with canonical URLs, breadcrumbs, single-H1 compliance, and SSR verification.
          </p>
        </div>

        <Link
          href="/admin/seo"
          className="px-4 py-2 rounded-lg bg-[#191D23] border border-[#252A32] text-xs text-[#D6B77A] hover:border-[#D6B77A]"
        >
          Inspect SEO Coverage
        </Link>
      </div>

      <div className="rounded-xl bg-[#111419] border border-[#1E222A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E222A] text-[11px] font-mono uppercase text-[#777D87] bg-[#0B0D10]">
                <th className="py-3 px-4">Page</th>
                <th className="py-3 px-4">Route</th>
                <th className="py-3 px-4">Canonical</th>
                <th className="py-3 px-4">Heading Structure</th>
                <th className="py-3 px-4 text-right">Visit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E222A] text-sm">
              {PUBLIC_PAGES.map((p) => (
                <tr key={p.route} className="hover:bg-[#161920]">
                  <td className="py-3.5 px-4 font-medium text-[#F5F3EE]">
                    {p.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#D6B77A]">
                    {p.route}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-xs text-[#8D939E]">
                    {p.canonical}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#7CD69F]">
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {p.h1}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={p.route}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-[#B2B4BA] hover:text-white"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

