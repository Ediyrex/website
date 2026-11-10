"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Loader2, Image as ImageIcon } from "lucide-react";
import { useAdminUser } from "./AdminContext";
import { MediaPickerModal } from "./MediaPickerModal";

interface SiteSettingsState {
  siteName: string;
  tagline: string;
  businessEmail: string;
  phoneNumber: string;
  studioLocation: string;
  officeHours: string;
  availabilityEnabled: boolean;
  availabilityLabel: string;
  footerNote: string;
  copyrightText: string;
  socialLinks: {
    github: string;
    linkedin: string;
    instagram: string;
    x: string;
    youtube: string;
  };
  defaultSeoTitle: string;
  defaultSeoDescription: string;
  defaultOgImageUrl: string;
  robotsAllowIndex: boolean;
  updatedAt?: string | null;
}

export function AdminSettingsClient() {
  const router = useRouter();
  const { isAdmin } = useAdminUser();

  const [form, setForm] = useState<SiteSettingsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  useEffect(() => {
    fetch("/api/v1/admin/settings")
      .then(async (res) => {
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const json = await res.json();
        if (!res.ok) {
          setError(json.message || "Unable to load website settings.");
          return;
        }
        setForm(json.data);
      })
      .catch(() => setError("Network error loading settings."))
      .finally(() => setLoading(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to save settings.");
        return;
      }
      setForm(json.data);
      setSuccess("Website settings & global SEO configuration saved.");
    } catch {
      setError("Network error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return (
      <div className="py-12 text-xs font-mono text-[#777D87]">
        Loading website settings...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
          Website Settings &amp; Global SEO
        </h1>
        <p className="text-sm text-[#B2B4BA]">
          Centralized configuration for studio contact details, availability banner, social profiles, footer copy, and global SEO defaults.
        </p>
      </div>

      {!isAdmin && (
        <div className="p-3.5 rounded-xl bg-[#1A1610] border border-[#D6B77A]/40 text-xs text-[#D6B77A]">
          Only full administrators (`admin` role) can modify global website settings.
        </div>
      )}

      {error && (
        <div className="p-3.5 rounded-xl bg-[#2A1414] border border-[#F28B82]/40 text-xs text-[#F28B82]">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3.5 rounded-xl bg-[#13261C] border border-[#7CD69F]/40 text-xs text-[#7CD69F]">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Branding & Footer */}
        <section className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-4">
          <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
            Studio Identity &amp; Footer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">Site Name *</label>
              <input
                type="text"
                required
                disabled={!isAdmin}
                value={form.siteName}
                onChange={(e) => setForm({ ...form, siteName: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">Tagline *</label>
              <input
                type="text"
                required
                disabled={!isAdmin}
                value={form.tagline}
                onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#B2B4BA]">Footer Statement</label>
            <textarea
              rows={2}
              disabled={!isAdmin}
              value={form.footerNote}
              onChange={(e) => setForm({ ...form, footerNote: e.target.value })}
              className="w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#B2B4BA]">Copyright Text *</label>
            <input
              type="text"
              required
              disabled={!isAdmin}
              value={form.copyrightText}
              onChange={(e) => setForm({ ...form, copyrightText: e.target.value })}
              className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
            />
          </div>
        </section>

        {/* Contact & Availability */}
        <section className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-4">
          <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
            Contact &amp; Availability
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">Business Email *</label>
              <input
                type="email"
                required
                disabled={!isAdmin}
                value={form.businessEmail}
                onChange={(e) =>
                  setForm({ ...form, businessEmail: e.target.value })
                }
                className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">Phone Number</label>
              <input
                type="text"
                disabled={!isAdmin}
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                placeholder="+91 ..."
                className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">Studio Location *</label>
              <input
                type="text"
                required
                disabled={!isAdmin}
                value={form.studioLocation}
                onChange={(e) =>
                  setForm({ ...form, studioLocation: e.target.value })
                }
                className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">Office Hours *</label>
              <input
                type="text"
                required
                disabled={!isAdmin}
                value={form.officeHours}
                onChange={(e) => setForm({ ...form, officeHours: e.target.value })}
                className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
              />
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <label className="inline-flex items-center gap-2 text-xs text-[#F5F3EE] cursor-pointer">
              <input
                type="checkbox"
                disabled={!isAdmin}
                checked={form.availabilityEnabled}
                onChange={(e) =>
                  setForm({ ...form, availabilityEnabled: e.target.checked })
                }
                className="rounded border-[#3A414B]"
              />
              <span>Show availability banner in Hero</span>
            </label>
            <input
              type="text"
              disabled={!isAdmin}
              value={form.availabilityLabel}
              onChange={(e) =>
                setForm({ ...form, availabilityLabel: e.target.value })
              }
              className="flex-1 min-w-[220px] h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
            />
          </div>
        </section>

        {/* Social Links */}
        <section className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-4">
          <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
            Social Media Links
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(["linkedin", "instagram", "x", "youtube", "github"] as const).map(
              (network) => (
                <div key={network} className="space-y-1.5">
                  <label className="text-xs font-mono uppercase text-[#B2B4BA]">
                    {network}
                  </label>
                  <input
                    type="url"
                    disabled={!isAdmin}
                    value={form.socialLinks[network] || ""}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        socialLinks: {
                          ...form.socialLinks,
                          [network]: e.target.value,
                        },
                      })
                    }
                    placeholder={`https://${network}.com/...`}
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
                  />
                </div>
              )
            )}
          </div>
        </section>

        {/* Global SEO Defaults */}
        <section className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-4">
          <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
            Global SEO Defaults
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#B2B4BA]">Default SEO Title *</label>
            <input
              type="text"
              required
              disabled={!isAdmin}
              value={form.defaultSeoTitle}
              onChange={(e) =>
                setForm({ ...form, defaultSeoTitle: e.target.value })
              }
              className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#B2B4BA]">
              Default Meta Description *
            </label>
            <textarea
              rows={2}
              required
              disabled={!isAdmin}
              value={form.defaultSeoDescription}
              onChange={(e) =>
                setForm({ ...form, defaultSeoDescription: e.target.value })
              }
              className="w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-[#B2B4BA]">
              Default Open Graph Image URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                disabled={!isAdmin}
                value={form.defaultOgImageUrl}
                onChange={(e) =>
                  setForm({ ...form, defaultOgImageUrl: e.target.value })
                }
                placeholder="/opengraph-image or Cloudinary URL"
                className="flex-1 h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
              />
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 h-10 rounded-lg bg-[#191D23] border border-[#252A32] text-xs text-[#F5F3EE] hover:border-[#D6B77A] cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Library</span>
                </button>
              )}
            </div>
          </div>

          <label className="inline-flex items-center gap-2 text-xs text-[#F5F3EE] cursor-pointer pt-1">
            <input
              type="checkbox"
              disabled={!isAdmin}
              checked={form.robotsAllowIndex}
              onChange={(e) =>
                setForm({ ...form, robotsAllowIndex: e.target.checked })
              }
            />
            <span>Allow search engine indexing by default</span>
          </label>
        </section>

        {isAdmin && (
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] disabled:opacity-50 cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? "Saving..." : "Save Settings"}</span>
            </button>
          </div>
        )}
      </form>

      <MediaPickerModal
        open={pickerOpen}
        title="Choose Default OG Image"
        onClose={() => setPickerOpen(false)}
        onSelectSingle={(asset) =>
          setForm((prev) =>
            prev ? { ...prev, defaultOgImageUrl: asset.secureUrl } : prev
          )
        }
      />
    </div>
  );
}

