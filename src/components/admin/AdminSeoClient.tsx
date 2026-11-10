"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface SeoHealthRow {
  id: string;
  title: string;
  slug: string;
  kind: "project" | "service" | "blog";
  hasSeoTitle: boolean;
  hasSeoDescription: boolean;
  status: string;
}

export function AdminSeoClient() {
  const [rows, setRows] = useState<SeoHealthRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    Promise.all([
      fetch("/api/v1/admin/projects?limit=50").then((r) => r.json()),
      fetch("/api/v1/admin/services?limit=50").then((r) => r.json()),
      fetch("/api/v1/admin/blog?limit=50").then((r) => r.json()),
    ])
      .then(([proj, svc, blog]) => {
        if (ignore) return;
        const list: SeoHealthRow[] = [
          ...((proj.data || []) as { id: string; title: string; slug: string; status: string; seoTitle?: string | null; seoDescription?: string | null }[]).map((p) => ({
            id: p.id,
            title: p.title,
            slug: `/work/${p.slug}`,
            kind: "project" as const,
            hasSeoTitle: Boolean(p.seoTitle),
            hasSeoDescription: Boolean(p.seoDescription),
            status: p.status,
          })),
          ...((svc.data || []) as { id: string; title: string; slug: string; status: string; seoTitle?: string | null; seoDescription?: string | null }[]).map((s) => ({
            id: s.id,
            title: s.title,
            slug: `/services#${s.slug}`,
            kind: "service" as const,
            hasSeoTitle: Boolean(s.seoTitle),
            hasSeoDescription: Boolean(s.seoDescription),
            status: s.status,
          })),
          ...((blog.data || []) as { id: string; title: string; slug: string; status: string; seoTitle?: string | null; seoDescription?: string | null }[]).map((b) => ({
            id: b.id,
            title: b.title,
            slug: `/blog/${b.slug}`,
            kind: "blog" as const,
            hasSeoTitle: Boolean(b.seoTitle),
            hasSeoDescription: Boolean(b.seoDescription),
            status: b.status,
          })),
        ];
        setRows(list);
      })
      .catch(() => {})
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
            SEO &amp; Metadata
          </h1>
          <p className="text-sm text-[#8D939E]">
            Monitor technical SEO infrastructure, schema markup, canonicals, and per-item meta tags.
          </p>
        </div>

        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold"
        >
          <span>Edit Global SEO Defaults</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Infrastructure Checks */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
        {[
          { label: "SSR + Metadata API", detail: "Unique titles, meta descriptions & canonicals" },
          { label: "Organization + Breadcrumb JSON-LD", detail: "Structured schema injected on public pages" },
          { label: "301 Redirects + Sitemap + Robots", detail: "Configured in next.config.ts, sitemap.ts, robots.ts" },
          { label: "Open Graph & Twitter Cards", detail: "Dynamic OG & Twitter image generation routes" },
          { label: "WebP / AVIF & Lazy Loading", detail: "Next/Image configured for modern formats" },
          { label: "GA4 + Search Console + Consent", detail: "Cookie-gated analytics & verification meta support" },
        ].map((item) => (
          <div
            key={item.label}
            className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] flex items-start gap-3"
          >
            <CheckCircle2 className="w-4 h-4 text-[#7CD69F] shrink-0 mt-0.5" />
            <div>
              <div className="font-semibold text-[#F5F3EE]">{item.label}</div>
              <div className="text-[#777D87] mt-0.5">{item.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* CMS Records SEO Audit */}
      <div className="rounded-xl bg-[#111419] border border-[#1E222A] overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#1E222A] font-heading font-semibold text-sm">
          CMS Entry SEO Coverage
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E222A] text-[11px] font-mono uppercase text-[#777D87] bg-[#0B0D10]">
                <th className="py-3 px-4">Entry</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Custom SEO Title</th>
                <th className="py-3 px-4">Meta Description</th>
                <th className="py-3 px-4 text-right">Edit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E222A] text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-xs font-mono text-[#777D87]">
                    Scanning CMS entries...
                  </td>
                </tr>
              ) : (
                rows.map((r) => (
                  <tr key={`${r.kind}-${r.id}`} className="hover:bg-[#161920]">
                    <td className="py-3 px-4">
                      <div className="font-medium text-[#F5F3EE]">{r.title}</div>
                      <div className="text-xs font-mono text-[#777D87]">{r.slug}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[#B2B4BA]">
                      {r.kind}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {r.hasSeoTitle ? (
                        <span className="inline-flex items-center gap-1 text-[#7CD69F]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Set
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#D6B77A]">
                          <AlertTriangle className="w-3.5 h-3.5" /> Uses fallback
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {r.hasSeoDescription ? (
                        <span className="inline-flex items-center gap-1 text-[#7CD69F]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Set
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#D6B77A]">
                          <AlertTriangle className="w-3.5 h-3.5" /> Uses fallback
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        href={
                          r.kind === "project"
                            ? `/admin/projects?edit=${r.id}`
                            : r.kind === "service"
                              ? `/admin/services?edit=${r.id}`
                              : `/admin/blog?edit=${r.id}`
                        }
                        className="text-xs text-[#D6B77A] hover:underline"
                      >
                        Configure
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

