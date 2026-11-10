"use client";

import React from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Building2,
  CheckCircle2,
  Clock,
  Cloud,
  Cookie,
  ExternalLink,
  Eye,
  Globe,
  Image as ImageIcon,
  Mail,
  MapPin,
  Megaphone,
  Phone,
  RefreshCw,
  RotateCcw,
  Search,
  Server,
  Shield,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  AssetFieldKey,
  SettingsTabId,
  SiteSettingsState,
  SocialProfileEntry,
} from "./settings-types";

const inputCls =
  "w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE] placeholder:text-[#6D7480] focus:outline-none focus:border-[#D6B77A] disabled:opacity-60";

const textareaCls =
  "w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE] placeholder:text-[#6D7480] focus:outline-none focus:border-[#D6B77A] disabled:opacity-60";

const labelCls =
  "block text-xs font-medium text-[#C8C3B8] mb-1.5";

interface SettingsTabsContentProps {
  tab: SettingsTabId;
  form: SiteSettingsState;
  isAdmin: boolean;
  onChange: (updater: (prev: SiteSettingsState) => SiteSettingsState) => void;
  onOpenAssetPicker: (target: AssetFieldKey) => void;
  onRevalidateCache: () => Promise<void>;
  revalidating: boolean;
  onRequestResetSection: (section: SettingsTabId) => void;
}

export function SettingsTabsContent({
  tab,
  form,
  isAdmin,
  onChange,
  onOpenAssetPicker,
  onRevalidateCache,
  revalidating,
  onRequestResetSection,
}: SettingsTabsContentProps) {
  if (tab === "general") {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left 8 cols */}
        <div className="xl:col-span-8 space-y-5">
          <SectionCard
            icon={<Building2 className="w-4 h-4 text-[#D6B77A]" />}
            title="Studio Identity & Footer"
            subtitle="Core studio information displayed across the website, including footer content."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Site Name *</label>
                <input
                  type="text"
                  required
                  disabled={!isAdmin}
                  value={form.siteName}
                  onChange={(e) =>
                    onChange((p) => ({ ...p, siteName: e.target.value }))
                  }
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Tagline *</label>
                <input
                  type="text"
                  required
                  disabled={!isAdmin}
                  value={form.tagline}
                  onChange={(e) =>
                    onChange((p) => ({ ...p, tagline: e.target.value }))
                  }
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Footer Statement</label>
              <textarea
                rows={3}
                disabled={!isAdmin}
                value={form.footerNote}
                onChange={(e) =>
                  onChange((p) => ({ ...p, footerNote: e.target.value }))
                }
                className={textareaCls}
              />
            </div>

            <div>
              <label className={labelCls}>Copyright Text *</label>
              <input
                type="text"
                required
                maxLength={120}
                disabled={!isAdmin}
                value={form.copyrightText}
                onChange={(e) =>
                  onChange((p) => ({ ...p, copyrightText: e.target.value }))
                }
                className={inputCls}
              />
              <div className="text-right text-[11px] font-mono text-[#777D87] mt-1">
                {form.copyrightText.length} / 120
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#1E222A]">
              <AssetUrlControl
                label="Studio Logo"
                value={form.logoUrl}
                disabled={!isAdmin}
                onChange={(val) => onChange((p) => ({ ...p, logoUrl: val }))}
                onPick={() => onOpenAssetPicker("logoUrl")}
              />
              <AssetUrlControl
                label="Favicon"
                value={form.faviconUrl}
                disabled={!isAdmin}
                onChange={(val) => onChange((p) => ({ ...p, faviconUrl: val }))}
                onPick={() => onOpenAssetPicker("faviconUrl")}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={<Phone className="w-4 h-4 text-[#D6B77A]" />}
            title="Contact & Availability"
            subtitle="Public contact details and studio availability information."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Business Email *</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    disabled={!isAdmin}
                    value={form.businessEmail}
                    onChange={(e) =>
                      onChange((p) => ({ ...p, businessEmail: e.target.value }))
                    }
                    className={cn(inputCls, "pl-9")}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Phone Number</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={!isAdmin}
                    value={form.phoneNumber}
                    onChange={(e) =>
                      onChange((p) => ({ ...p, phoneNumber: e.target.value }))
                    }
                    placeholder="+91 98765 43210"
                    className={cn(inputCls, "pl-9")}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Studio Location *</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    disabled={!isAdmin}
                    value={form.studioLocation}
                    onChange={(e) =>
                      onChange((p) => ({
                        ...p,
                        studioLocation: e.target.value,
                      }))
                    }
                    className={cn(inputCls, "pl-9")}
                  />
                </div>
              </div>
              <div>
                <label className={labelCls}>Office Hours *</label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    disabled={!isAdmin}
                    value={form.officeHours}
                    onChange={(e) =>
                      onChange((p) => ({ ...p, officeHours: e.target.value }))
                    }
                    className={cn(inputCls, "pl-9")}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
              <div>
                <label className={labelCls}>Availability Label *</label>
                <input
                  type="text"
                  required
                  disabled={!isAdmin}
                  value={form.availabilityLabel}
                  onChange={(e) =>
                    onChange((p) => ({
                      ...p,
                      availabilityLabel: e.target.value,
                    }))
                  }
                  className={inputCls}
                />
              </div>
              <ToggleRow
                label="Show Availability Badge on Hero"
                checked={form.availabilityEnabled}
                disabled={!isAdmin}
                onChange={(next) =>
                  onChange((p) => ({ ...p, availabilityEnabled: next }))
                }
              />
            </div>

            <div>
              <label className={labelCls}>Primary Contact Information Note</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={form.primaryContactNote}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    primaryContactNote: e.target.value,
                  }))
                }
                className={inputCls}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={<Globe className="w-4 h-4 text-[#D6B77A]" />}
            title="Global Website Preferences"
            subtitle="Default localization, announcement banner toggle, and site availability."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Default Language</label>
                <select
                  disabled={!isAdmin}
                  value={form.defaultLanguage}
                  onChange={(e) =>
                    onChange((p) => ({ ...p, defaultLanguage: e.target.value }))
                  }
                  className={inputCls}
                >
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="en-IN">English (India)</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Default Timezone</label>
                <select
                  disabled={!isAdmin}
                  value={form.defaultTimezone}
                  onChange={(e) =>
                    onChange((p) => ({ ...p, defaultTimezone: e.target.value }))
                  }
                  className={inputCls}
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                  <option value="Europe/London">Europe/London (GMT)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToggleRow
                label="Announcement Banner Visibility"
                checked={form.banners.announcement.enabled}
                disabled={!isAdmin}
                onChange={(next) =>
                  onChange((p) => ({
                    ...p,
                    banners: {
                      ...p.banners,
                      announcement: {
                        ...p.banners.announcement,
                        enabled: next,
                      },
                    },
                  }))
                }
              />
              <ToggleRow
                label="Maintenance Mode"
                checked={form.advanced.maintenanceMode}
                disabled={!isAdmin}
                onChange={(next) =>
                  onChange((p) => ({
                    ...p,
                    advanced: { ...p.advanced, maintenanceMode: next },
                  }))
                }
              />
            </div>
          </SectionCard>
        </div>

        {/* Right 4 cols matching mockup */}
        <div className="xl:col-span-4 space-y-5">
          <SectionCard
            icon={<Search className="w-4 h-4 text-[#D6B77A]" />}
            title="Global SEO Defaults"
            subtitle="Default SEO settings used across all pages (can be overridden per page)."
          >
            <div>
              <label className={labelCls}>Meta Title (Default)</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={form.defaultSeoTitle}
                onChange={(e) =>
                  onChange((p) => ({ ...p, defaultSeoTitle: e.target.value }))
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Meta Description (Default)</label>
              <textarea
                rows={4}
                maxLength={320}
                disabled={!isAdmin}
                value={form.defaultSeoDescription}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    defaultSeoDescription: e.target.value,
                  }))
                }
                className={textareaCls}
              />
              <div className="text-right text-[11px] font-mono text-[#777D87] mt-1">
                {form.defaultSeoDescription.length} / 160
              </div>
            </div>
          </SectionCard>

          <SectionCard
            icon={<Eye className="w-4 h-4 text-[#D6B77A]" />}
            title="Search Preview"
            subtitle="How your website may appear on Google."
          >
            <SerpPreview
              siteName={form.siteName}
              baseUrl={form.defaultCanonicalBaseUrl}
              title={form.defaultSeoTitle}
              description={form.defaultSeoDescription}
            />
          </SectionCard>

          <SectionCard
            icon={<Sliders className="w-4 h-4 text-[#D6B77A]" />}
            title="Global Settings"
            subtitle="Site-wide configuration and basic preferences."
          >
            <div className="space-y-3">
              <ToggleRow
                label="Enable Site Indexing (Allow search engines)"
                checked={form.robotsAllowIndex}
                disabled={!isAdmin}
                onChange={(next) =>
                  onChange((p) => ({ ...p, robotsAllowIndex: next }))
                }
              />
              <ToggleRow
                label="Auto-generate Sitemap"
                checked={form.autoGenerateSitemap}
                disabled={!isAdmin}
                onChange={(next) =>
                  onChange((p) => ({ ...p, autoGenerateSitemap: next }))
                }
              />
              <ToggleRow
                label="Use Default Robots.txt (Recommended)"
                checked={form.useDefaultRobots}
                disabled={!isAdmin}
                onChange={(next) =>
                  onChange((p) => ({ ...p, useDefaultRobots: next }))
                }
              />
            </div>
          </SectionCard>
        </div>
      </div>
    );
  }

  if (tab === "seo") {
    return (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8 space-y-5">
          <div className="p-4 rounded-xl bg-[#16140F] border border-[#D6B77A]/35 flex flex-wrap items-center justify-between gap-3 text-xs text-[#E4DFD3]">
            <span>
              Global SEO defaults apply only when a Page, Portfolio project,
              Service, or Blog post has no custom SEO metadata set.
            </span>
            <Link
              href="/admin/seo"
              className="inline-flex items-center gap-1 text-[#D6B77A] font-semibold hover:underline"
            >
              <span>Open Per-Page SEO &amp; Audits</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          <SectionCard
            icon={<Search className="w-4 h-4 text-[#D6B77A]" />}
            title="Global Metadata & Canonical Base"
            subtitle="Fallback title template, description, and canonical origin URL."
          >
            <div>
              <label className={labelCls}>Default Meta Title *</label>
              <input
                type="text"
                required
                disabled={!isAdmin}
                value={form.defaultSeoTitle}
                onChange={(e) =>
                  onChange((p) => ({ ...p, defaultSeoTitle: e.target.value }))
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Default Meta Description *</label>
              <textarea
                rows={3}
                required
                disabled={!isAdmin}
                value={form.defaultSeoDescription}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    defaultSeoDescription: e.target.value,
                  }))
                }
                className={textareaCls}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Default Canonical Base URL</label>
                <input
                  type="url"
                  disabled={!isAdmin}
                  value={form.defaultCanonicalBaseUrl}
                  onChange={(e) =>
                    onChange((p) => ({
                      ...p,
                      defaultCanonicalBaseUrl: e.target.value,
                    }))
                  }
                  className={inputCls}
                />
              </div>
              <AssetUrlControl
                label="Default Open Graph Image"
                value={form.defaultOgImageUrl}
                disabled={!isAdmin}
                onChange={(val) =>
                  onChange((p) => ({ ...p, defaultOgImageUrl: val }))
                }
                onPick={() => onOpenAssetPicker("defaultOgImageUrl")}
              />
            </div>
          </SectionCard>

          <SectionCard
            icon={<Globe className="w-4 h-4 text-[#D6B77A]" />}
            title="Social Sharing & Indexing Controls"
            subtitle="Open Graph / Twitter card defaults and crawler directives."
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Twitter / X Card Type</label>
                <select
                  disabled={!isAdmin}
                  value={form.socialTwitterCard}
                  onChange={(e) =>
                    onChange((p) => ({
                      ...p,
                      socialTwitterCard: e.target.value as
                        | "summary"
                        | "summary_large_image",
                    }))
                  }
                  className={inputCls}
                >
                  <option value="summary_large_image">
                    Summary Large Image
                  </option>
                  <option value="summary">Summary Card</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Open Graph Locale</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={form.socialLocale}
                  onChange={(e) =>
                    onChange((p) => ({ ...p, socialLocale: e.target.value }))
                  }
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <ToggleRow
                label="Allow Search Indexing"
                checked={form.robotsAllowIndex}
                disabled={!isAdmin}
                onChange={(next) =>
                  onChange((p) => ({ ...p, robotsAllowIndex: next }))
                }
              />
              <ToggleRow
                label="Auto Sitemap"
                checked={form.autoGenerateSitemap}
                disabled={!isAdmin}
                onChange={(next) =>
                  onChange((p) => ({ ...p, autoGenerateSitemap: next }))
                }
              />
              <ToggleRow
                label="Default Robots Policy"
                checked={form.useDefaultRobots}
                disabled={!isAdmin}
                onChange={(next) =>
                  onChange((p) => ({ ...p, useDefaultRobots: next }))
                }
              />
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-4 space-y-5">
          <SectionCard
            icon={<Eye className="w-4 h-4 text-[#D6B77A]" />}
            title="Live Google & Social Preview"
            subtitle="Real-time preview of fallback metadata."
          >
            <SerpPreview
              siteName={form.siteName}
              baseUrl={form.defaultCanonicalBaseUrl}
              title={form.defaultSeoTitle}
              description={form.defaultSeoDescription}
            />
            <div className="mt-4 p-3 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-2">
              <div className="text-[10px] font-mono uppercase text-[#777D87]">
                Organization Schema Snapshot
              </div>
              <div className="text-xs font-medium text-[#F5F3EE]">
                {form.seoSchema.orgName}
              </div>
              <div className="text-[11px] text-[#8D939E]">
                {form.seoSchema.orgUrl} · {form.seoSchema.areaServed}
              </div>
              <Link
                href="/admin/seo?tab=advanced"
                className="inline-block text-[11px] text-[#D6B77A] hover:underline"
              >
                Edit full JSON-LD in SEO &amp; Metadata →
              </Link>
            </div>
          </SectionCard>
        </div>
      </div>
    );
  }

  if (tab === "social") {
    const moveProfile = (index: number, delta: -1 | 1) => {
      const target = index + delta;
      if (target < 0 || target >= form.socialProfiles.length) return;
      onChange((prev) => {
        const next = [...prev.socialProfiles];
        const [item] = next.splice(index, 1);
        next.splice(target, 0, item);
        return {
          ...prev,
          socialProfiles: next.map((p, idx) => ({ ...p, order: idx })),
        };
      });
    };

    const updateProfile = (
      index: number,
      patch: Partial<SocialProfileEntry>
    ) => {
      onChange((prev) => {
        const next = prev.socialProfiles.map((p, idx) =>
          idx === index ? { ...p, ...patch } : p
        );
        return { ...prev, socialProfiles: next };
      });
    };

    return (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8">
          <SectionCard
            icon={<Globe className="w-4 h-4 text-[#D6B77A]" />}
            title="Public Social Profiles"
            subtitle="Configure URLs, visibility, and display ordering for all studio social channels."
          >
            <div className="divide-y divide-[#1E222A]">
              {form.socialProfiles.map((profile, index) => (
                <div
                  key={profile.platform}
                  className="py-3.5 first:pt-0 last:pb-0 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <span className="text-xs font-mono text-[#777D87] w-5">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-medium text-[#F5F3EE]">
                      {profile.label}
                    </span>
                  </div>

                  <div className="sm:col-span-6">
                    <input
                      type="url"
                      disabled={!isAdmin}
                      value={profile.url}
                      onChange={(e) =>
                        updateProfile(index, { url: e.target.value })
                      }
                      placeholder={`https://${profile.platform === "x" ? "x.com" : `${profile.platform}.com`}/ediyrex`}
                      className={inputCls}
                    />
                  </div>

                  <div className="sm:col-span-3 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      disabled={!isAdmin}
                      onClick={() =>
                        updateProfile(index, { visible: !profile.visible })
                      }
                      className={cn(
                        "px-2.5 py-1 rounded-full text-[11px] font-medium border cursor-pointer disabled:opacity-50",
                        profile.visible
                          ? "bg-[#13291E] text-[#6FCF97] border-[#6FCF97]/35"
                          : "bg-[#171A21] text-[#8D939E] border-[#252A32]"
                      )}
                    >
                      {profile.visible ? "Visible" : "Hidden"}
                    </button>
                    <button
                      type="button"
                      disabled={!isAdmin || index === 0}
                      onClick={() => moveProfile(index, -1)}
                      className="p-1.5 rounded bg-[#0D0F12] border border-[#252A32] text-[#8D939E] hover:text-[#F5F3EE] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={
                        !isAdmin || index === form.socialProfiles.length - 1
                      }
                      onClick={() => moveProfile(index, 1)}
                      className="p-1.5 rounded bg-[#0D0F12] border border-[#252A32] text-[#8D939E] hover:text-[#F5F3EE] disabled:opacity-30 cursor-pointer"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <div className="xl:col-span-4">
          <SectionCard
            icon={<Eye className="w-4 h-4 text-[#D6B77A]" />}
            title="Footer Social Links Preview"
            subtitle="Only visible links with valid URLs appear on the public website."
          >
            <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#1E222A] flex flex-wrap gap-2">
              {form.socialProfiles.filter((p) => p.visible && p.url.trim())
                .length === 0 ? (
                <div className="text-xs text-[#777D87]">
                  Add and enable a social URL to preview footer pills.
                </div>
              ) : (
                form.socialProfiles
                  .filter((p) => p.visible && p.url.trim())
                  .map((p) => (
                    <span
                      key={p.platform}
                      className="px-2.5 py-1 rounded-md bg-[#111419] border border-[#252A32] text-xs font-mono text-[#D6B77A]"
                    >
                      {p.label}
                    </span>
                  ))
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    );
  }

  if (tab === "banners") {
    return (
      <div className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <BannerConfigCard
            title="Global Announcement Banner"
            subtitle="Site-wide top bar notice with optional CTA link and schedule."
            banner={form.banners.announcement}
            isAdmin={isAdmin}
            onChange={(next) =>
              onChange((p) => ({
                ...p,
                banners: { ...p.banners, announcement: next },
              }))
            }
          />
          <BannerConfigCard
            title="Promotional Banner"
            subtitle="Campaign notice for seasonal studio offers or product launches."
            banner={form.banners.promotional}
            isAdmin={isAdmin}
            onChange={(next) =>
              onChange((p) => ({
                ...p,
                banners: { ...p.banners, promotional: next },
              }))
            }
          />
        </div>

        <SectionCard
          icon={<ImageIcon className="w-4 h-4 text-[#D6B77A]" />}
          title="Global Visual Assets & Fallbacks"
          subtitle="Centralized brand assets, Open Graph fallbacks, and placeholder media."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <AssetUrlControl
              label="Default Open Graph Image"
              value={form.banners.defaultOgImageUrl}
              disabled={!isAdmin}
              onChange={(val) =>
                onChange((p) => ({
                  ...p,
                  defaultOgImageUrl: val,
                  banners: { ...p.banners, defaultOgImageUrl: val },
                }))
              }
              onPick={() => onOpenAssetPicker("defaultOgImageUrl")}
            />
            <AssetUrlControl
              label="Fallback Studio Logo"
              value={form.banners.fallbackLogoUrl}
              disabled={!isAdmin}
              onChange={(val) =>
                onChange((p) => ({
                  ...p,
                  banners: { ...p.banners, fallbackLogoUrl: val },
                }))
              }
              onPick={() => onOpenAssetPicker("fallbackLogoUrl")}
            />
            <AssetUrlControl
              label="Favicon URL"
              value={form.banners.faviconUrl}
              disabled={!isAdmin}
              onChange={(val) =>
                onChange((p) => ({
                  ...p,
                  faviconUrl: val,
                  banners: { ...p.banners, faviconUrl: val },
                }))
              }
              onPick={() => onOpenAssetPicker("faviconUrl")}
            />
            <AssetUrlControl
              label="Default Website Thumbnail"
              value={form.banners.defaultThumbnailUrl}
              disabled={!isAdmin}
              onChange={(val) =>
                onChange((p) => ({
                  ...p,
                  banners: { ...p.banners, defaultThumbnailUrl: val },
                }))
              }
              onPick={() => onOpenAssetPicker("defaultThumbnailUrl")}
            />
            <AssetUrlControl
              label="Default Placeholder Image"
              value={form.banners.defaultPlaceholderUrl}
              disabled={!isAdmin}
              onChange={(val) =>
                onChange((p) => ({
                  ...p,
                  banners: { ...p.banners, defaultPlaceholderUrl: val },
                }))
              }
              onPick={() => onOpenAssetPicker("defaultPlaceholderUrl")}
            />
          </div>
        </SectionCard>
      </div>
    );
  }

  if (tab === "integrations") {
    const st = form.integrationStatus;
    return (
      <div className="space-y-5">
        <div className="p-3.5 rounded-xl bg-[#111419] border border-[#252A32] text-xs text-[#8D939E] flex flex-wrap items-center justify-between gap-2">
          <span>
            Private API secrets and credentials remain strictly server-side in
            environment variables and are never exposed in admin settings.
          </span>
          {st.lastSyncedAt && (
            <span className="font-mono text-[#D6B77A]">
              Last verified: {new Date(st.lastSyncedAt).toLocaleString()}
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <IntegrationCard
            title="Google Analytics 4"
            purpose="Website traffic analytics"
            connected={Boolean(form.integrations.gaMeasurementId)}
          >
            <label className={labelCls}>Measurement ID</label>
            <input
              type="text"
              disabled={!isAdmin}
              value={form.integrations.gaMeasurementId}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  integrations: {
                    ...p.integrations,
                    gaMeasurementId: e.target.value,
                  },
                }))
              }
              placeholder="G-XXXXXXXXXX"
              className={inputCls}
            />
          </IntegrationCard>

          <IntegrationCard
            title="Google Tag Manager"
            purpose="Tag management"
            connected={Boolean(form.integrations.gtmContainerId)}
          >
            <label className={labelCls}>Container ID</label>
            <input
              type="text"
              disabled={!isAdmin}
              value={form.integrations.gtmContainerId}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  integrations: {
                    ...p.integrations,
                    gtmContainerId: e.target.value,
                  },
                }))
              }
              placeholder="GTM-XXXXXXX"
              className={inputCls}
            />
          </IntegrationCard>

          <IntegrationCard
            title="Google Search Console"
            purpose="Search performance & ownership verification"
            connected={Boolean(form.integrations.gscVerificationCode)}
          >
            <label className={labelCls}>HTML Meta Verification Code</label>
            <input
              type="text"
              disabled={!isAdmin}
              value={form.integrations.gscVerificationCode}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  integrations: {
                    ...p.integrations,
                    gscVerificationCode: e.target.value,
                  },
                }))
              }
              placeholder="google-site-verification token"
              className={inputCls}
            />
          </IntegrationCard>

          <IntegrationCard
            title="Cloudinary Media"
            purpose="Media storage, optimization & delivery"
            connected={st.cloudinaryConfigured}
            statusLabel={
              st.cloudinaryConfigured
                ? `Connected (${st.cloudinaryCloudName})`
                : "Env Not Set"
            }
          >
            <div className="p-3 rounded-lg bg-[#0D0F12] border border-[#1E222A] text-xs text-[#8D939E] flex items-center gap-2">
              <Cloud className="w-4 h-4 text-[#D6B77A] shrink-0" />
              <span>
                Configured securely via server environment variables
                (`CLOUDINARY_CLOUD_NAME`, API Key/Secret hidden).
              </span>
            </div>
          </IntegrationCard>

          <IntegrationCard
            title="reCAPTCHA / Cloudflare Turnstile"
            purpose="Contact & inquiry form protection"
            connected={
              form.integrations.captchaProvider !== "none" &&
              Boolean(form.integrations.captchaSiteKey)
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Provider</label>
                <select
                  disabled={!isAdmin}
                  value={form.integrations.captchaProvider}
                  onChange={(e) =>
                    onChange((p) => ({
                      ...p,
                      integrations: {
                        ...p.integrations,
                        captchaProvider: e.target.value as
                          | "none"
                          | "turnstile"
                          | "recaptcha",
                      },
                    }))
                  }
                  className={inputCls}
                >
                  <option value="none">Disabled</option>
                  <option value="turnstile">Cloudflare Turnstile</option>
                  <option value="recaptcha">Google reCAPTCHA</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Public Site Key</label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={form.integrations.captchaSiteKey}
                  onChange={(e) =>
                    onChange((p) => ({
                      ...p,
                      integrations: {
                        ...p.integrations,
                        captchaSiteKey: e.target.value,
                      },
                    }))
                  }
                  placeholder="0x4AAA..."
                  className={inputCls}
                />
              </div>
            </div>
          </IntegrationCard>

          <IntegrationCard
            title="Email Provider"
            purpose="Contact form & notification delivery"
            connected={st.emailConfigured}
            statusLabel={
              st.emailConfigured
                ? `Connected (${st.emailProviderLabel})`
                : "Local Preview / Env Not Set"
            }
          >
            <label className={labelCls}>Sender Display Name</label>
            <input
              type="text"
              disabled={!isAdmin}
              value={form.integrations.emailFromName}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  integrations: {
                    ...p.integrations,
                    emailFromName: e.target.value,
                  },
                }))
              }
              className={inputCls}
            />
          </IntegrationCard>
        </div>
      </div>
    );
  }

  // TAB: ADVANCED
  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
      <div className="xl:col-span-7 space-y-5">
        <SectionCard
          icon={<Cookie className="w-4 h-4 text-[#D6B77A]" />}
          title="Cookie & Consent Configuration"
          subtitle="Control public privacy notice text and default consent behavior."
        >
          <ToggleRow
            label="Enable Public Cookie Consent Banner"
            checked={form.advanced.cookieConsentEnabled}
            disabled={!isAdmin}
            onChange={(next) =>
              onChange((p) => ({
                ...p,
                advanced: { ...p.advanced, cookieConsentEnabled: next },
              }))
            }
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Banner Title</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={form.advanced.cookieBannerTitle}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    advanced: {
                      ...p.advanced,
                      cookieBannerTitle: e.target.value,
                    },
                  }))
                }
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Default Mode</label>
              <select
                disabled={!isAdmin}
                value={form.advanced.defaultConsentMode}
                onChange={(e) =>
                  onChange((p) => ({
                    ...p,
                    advanced: {
                      ...p.advanced,
                      defaultConsentMode: e.target.value as
                        | "essential"
                        | "analytics",
                    },
                  }))
                }
                className={inputCls}
              >
                <option value="essential">Essential First (Strict)</option>
                <option value="analytics">Analytics Allowed by Default</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>Consent Description</label>
            <textarea
              rows={2}
              disabled={!isAdmin}
              value={form.advanced.cookieBannerDescription}
              onChange={(e) =>
                onChange((p) => ({
                  ...p,
                  advanced: {
                    ...p.advanced,
                    cookieBannerDescription: e.target.value,
                  },
                }))
              }
              className={textareaCls}
            />
          </div>
        </SectionCard>

        <SectionCard
          icon={<Server className="w-4 h-4 text-[#D6B77A]" />}
          title="Technical SEO, Cache & Deployment"
          subtitle="Sitemap, Robots, Redirect links, and ISR cache revalidation."
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <Link
              href="/admin/seo?tab=sitemap"
              className="p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A]/45 text-xs text-[#F5F3EE] font-medium"
            >
              Sitemap Config →
            </Link>
            <Link
              href="/admin/seo?tab=advanced"
              className="p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A]/45 text-xs text-[#F5F3EE] font-medium"
            >
              Robots.txt Editor →
            </Link>
            <Link
              href="/admin/seo?tab=redirects"
              className="p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#D6B77A]/45 text-xs text-[#F5F3EE] font-medium"
            >
              URL Redirects →
            </Link>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#1E222A] grid grid-cols-3 gap-3 text-xs">
            <div>
              <div className="text-[10px] font-mono uppercase text-[#777D87]">
                Environment
              </div>
              <div className="text-[#F5F3EE] font-mono mt-0.5">
                {form.environmentInfo.nodeEnv}
              </div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-[#777D87]">
                Database
              </div>
              <div className="text-[#6FCF97] font-mono mt-0.5">Connected</div>
            </div>
            <div>
              <div className="text-[10px] font-mono uppercase text-[#777D87]">
                Public URL
              </div>
              <div className="text-[#F5F3EE] font-mono truncate mt-0.5">
                {form.environmentInfo.siteUrl}
              </div>
            </div>
          </div>

          {isAdmin && (
            <button
              type="button"
              disabled={revalidating}
              onClick={onRevalidateCache}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-[#171B22] border border-[#252A32] hover:border-[#D6B77A]/45 text-xs font-medium text-[#D6B77A] cursor-pointer"
            >
              <RefreshCw
                className={cn("w-3.5 h-3.5", revalidating && "animate-spin")}
              />
              <span>
                {revalidating
                  ? "Revalidating Routes..."
                  : "Revalidate Public Website Cache"}
              </span>
            </button>
          )}
        </SectionCard>

        <div className="p-5 rounded-xl bg-[#1A1112] border border-[#F28B82]/35 space-y-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#F28B82]">
            <AlertTriangle className="w-4 h-4" />
            <span>Maintenance &amp; Reset Controls</span>
          </div>

          <ToggleRow
            label="Enable Studio Maintenance Mode Banner"
            checked={form.advanced.maintenanceMode}
            disabled={!isAdmin}
            onChange={(next) =>
              onChange((p) => ({
                ...p,
                advanced: { ...p.advanced, maintenanceMode: next },
              }))
            }
          />
          <input
            type="text"
            disabled={!isAdmin}
            value={form.advanced.maintenanceMessage}
            onChange={(e) =>
              onChange((p) => ({
                ...p,
                advanced: { ...p.advanced, maintenanceMessage: e.target.value },
              }))
            }
            placeholder="Maintenance notice displayed to visitors..."
            className={inputCls}
          />

          {isAdmin && (
            <div className="pt-2 border-t border-[#F28B82]/20 flex flex-wrap gap-2">
              {(
                [
                  "general",
                  "seo",
                  "social",
                  "banners",
                  "integrations",
                  "advanced",
                ] as const
              ).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => onRequestResetSection(sec)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#2A1517] border border-[#F28B82]/35 text-[11px] font-medium text-[#F28B82] hover:bg-[#381B1E] cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="capitalize">Reset {sec}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Change History Audit Log */}
      <div className="xl:col-span-5">
        <SectionCard
          icon={<Shield className="w-4 h-4 text-[#D6B77A]" />}
          title="Settings Change History"
          subtitle="Tracks who modified global configuration settings and when."
        >
          {form.changeHistory.length === 0 ? (
            <div className="text-xs text-[#777D87]">
              No global settings changes recorded yet.
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[520px] overflow-y-auto">
              {form.changeHistory.map((h) => (
                <div
                  key={h.id}
                  className="p-3 rounded-lg bg-[#0D0F12] border border-[#1E222A] text-xs space-y-0.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[#D6B77A]">
                      {h.action}
                    </span>
                    <span className="text-[10px] font-mono text-[#777D87]">
                      {new Date(h.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-[#8D939E]">
                    By {h.actorEmail || "Studio Admin"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared Primitives                                                          */
/* -------------------------------------------------------------------------- */

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-4">
      <div className="flex items-start gap-3 pb-3 border-b border-[#1E222A]">
        <div className="w-9 h-9 rounded-lg bg-[#241E14] border border-[#D6B77A]/30 flex items-center justify-center shrink-0">
          {icon}
        </div>
        <div>
          <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
            {title}
          </h2>
          <p className="text-xs text-[#8D939E] mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function ToggleRow({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#0D0F12] border border-[#1E222A] cursor-pointer">
      <span className="text-xs text-[#E4E0D8]">{label}</span>
      <input
        type="checkbox"
        disabled={disabled}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 accent-[#D6B77A] cursor-pointer"
      />
    </label>
  );
}

function AssetUrlControl({
  label,
  value,
  disabled,
  onChange,
  onPick,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (next: string) => void;
  onPick: () => void;
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      <div className="flex gap-2">
        <input
          type="text"
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://res.cloudinary.com/..."
          className={inputCls}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={onPick}
          className="px-3 h-10 rounded-lg bg-[#171B22] border border-[#252A32] hover:border-[#D6B77A]/45 text-xs text-[#D6B77A] shrink-0 cursor-pointer"
        >
          Media
        </button>
      </div>
    </div>
  );
}

function SerpPreview({
  siteName,
  baseUrl,
  title,
  description,
}: {
  siteName: string;
  baseUrl: string;
  title: string;
  description: string;
}) {
  const domain = baseUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");
  return (
    <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-1.5">
      <div className="flex items-center gap-2 text-xs">
        <span className="w-5 h-5 rounded-full bg-[#241E14] border border-[#D6B77A]/40 text-[#D6B77A] text-[10px] font-bold flex items-center justify-center">
          {(siteName || "E")[0]}
        </span>
        <div>
          <div className="text-[11px] text-[#E4E0D8] leading-none">
            {domain || "ediyrex.com"}
          </div>
          <div className="text-[10px] text-[#777D87]">{baseUrl}</div>
        </div>
      </div>
      <div className="text-sm font-medium text-[#8AB4F8] line-clamp-1 pt-0.5">
        {title || "Ediyrex Studio — Creative Technology, Media, Digital & AI"}
      </div>
      <p className="text-xs text-[#9AA0A6] line-clamp-2 leading-relaxed">
        {description ||
          "Independent creative technology studio uniting commercial media production, digital experiences, and intelligent AI systems."}
      </p>
    </div>
  );
}

function BannerConfigCard({
  title,
  subtitle,
  banner,
  isAdmin,
  onChange,
}: {
  title: string;
  subtitle: string;
  banner: SiteSettingsState["banners"]["announcement"];
  isAdmin: boolean;
  onChange: (next: SiteSettingsState["banners"]["announcement"]) => void;
}) {
  return (
    <SectionCard
      icon={<Megaphone className="w-4 h-4 text-[#D6B77A]" />}
      title={title}
      subtitle={subtitle}
    >
      <ToggleRow
        label="Banner Active"
        checked={banner.enabled}
        disabled={!isAdmin}
        onChange={(next) => onChange({ ...banner, enabled: next })}
      />
      <div>
        <label className={labelCls}>Banner Message</label>
        <input
          type="text"
          disabled={!isAdmin}
          value={banner.title}
          onChange={(e) => onChange({ ...banner, title: e.target.value })}
          placeholder="e.g. Booking Q4 brand films & AI automation sprints"
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelCls}>CTA Label</label>
          <input
            type="text"
            disabled={!isAdmin}
            value={banner.ctaText}
            onChange={(e) => onChange({ ...banner, ctaText: e.target.value })}
            placeholder="Book Discovery"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Destination URL</label>
          <input
            type="text"
            disabled={!isAdmin}
            value={banner.ctaUrl}
            onChange={(e) => onChange({ ...banner, ctaUrl: e.target.value })}
            placeholder="/contact"
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Schedule Start (Optional)</label>
          <input
            type="date"
            disabled={!isAdmin}
            value={banner.startAt}
            onChange={(e) => onChange({ ...banner, startAt: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Schedule End (Optional)</label>
          <input
            type="date"
            disabled={!isAdmin}
            value={banner.endAt}
            onChange={(e) => onChange({ ...banner, endAt: e.target.value })}
            className={inputCls}
          />
        </div>
      </div>
      {banner.title && (
        <div className="p-2.5 rounded-lg bg-[#17130C] border border-[#D6B77A]/35 text-xs text-center text-[#F5F3EE]">
          <span>{banner.title}</span>
          {banner.ctaText && (
            <span className="ml-2 text-[#D6B77A] font-semibold">
              {banner.ctaText} →
            </span>
          )}
        </div>
      )}
    </SectionCard>
  );
}

function IntegrationCard({
  title,
  purpose,
  connected,
  statusLabel,
  children,
}: {
  title: string;
  purpose: string;
  connected: boolean;
  statusLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-3.5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-heading font-semibold text-sm text-[#F5F3EE]">
            {title}
          </h3>
          <p className="text-xs text-[#8D939E]">{purpose}</p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border shrink-0",
            connected
              ? "bg-[#13291E] text-[#6FCF97] border-[#6FCF97]/35"
              : "bg-[#171A21] text-[#8D939E] border-[#252A32]"
          )}
        >
          {connected && <CheckCircle2 className="w-3 h-3" />}
          <span>{statusLabel || (connected ? "Connected" : "Not Configured")}</span>
        </span>
      </div>
      <div>{children}</div>
    </div>
  );
}

