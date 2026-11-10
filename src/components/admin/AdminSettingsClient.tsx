"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  ExternalLink,
  Globe,
  History,
  Image as ImageIcon,
  Loader2,
  Plug,
  Save,
  Settings,
  Share2,
  Sliders,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "./AdminContext";
import { MediaPickerModal, type MediaAssetItem } from "./MediaPickerModal";
import { SettingsTabsContent } from "./settings/SettingsTabsContent";
import type {
  AssetFieldKey,
  SettingsTabId,
  SiteSettingsState,
} from "./settings/settings-types";

const TABS: Array<{
  id: SettingsTabId;
  label: string;
  icon: React.ElementType;
}> = [
  { id: "general", label: "General", icon: Sliders },
  { id: "seo", label: "SEO & Metadata", icon: History },
  { id: "social", label: "Social Profiles", icon: Share2 },
  { id: "banners", label: "Banners & Media", icon: ImageIcon },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "advanced", label: "Advanced", icon: Settings },
];

export function AdminSettingsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAdmin } = useAdminUser();

  const tabParam = searchParams.get("tab");
  const activeTab: SettingsTabId =
    tabParam === "seo" ||
    tabParam === "social" ||
    tabParam === "banners" ||
    tabParam === "integrations" ||
    tabParam === "advanced"
      ? tabParam
      : "general";

  const switchTab = (next: SettingsTabId) => {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "general") params.delete("tab");
    else params.set("tab", next);
    const qs = params.toString();
    router.replace(qs ? `/admin/settings?${qs}` : "/admin/settings");
  };

  const [form, setForm] = useState<SiteSettingsState | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [revalidating, setRevalidating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [pickerTarget, setPickerTarget] = useState<AssetFieldKey | null>(null);
  const [confirmResetSection, setConfirmResetSection] =
    useState<SettingsTabId | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/admin/settings");
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
      setSavedSnapshot(JSON.stringify(json.data));
    } catch {
      setError("Network error loading settings.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const t = setTimeout(() => {
      loadSettings();
    }, 0);
    return () => clearTimeout(t);
  }, [loadSettings]);

  const isDirty = form !== null && JSON.stringify(form) !== savedSnapshot;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          section: activeTab,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to save settings.");
        return;
      }
      setForm(json.data);
      setSavedSnapshot(JSON.stringify(json.data));
      setSuccess(
        `Saved ${
          TABS.find((t) => t.id === activeTab)?.label ?? "Website"
        } settings cleanly.`
      );
    } catch {
      setError("Network error saving settings.");
    } finally {
      setSaving(false);
    }
  };

  const handleRevalidateCache = async () => {
    setRevalidating(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/settings/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "revalidate_cache" }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to revalidate cache.");
        return;
      }
      setSuccess("Public website routes & sitemap cache revalidated.");
      await loadSettings();
    } catch {
      setError("Network error revalidating cache.");
    } finally {
      setRevalidating(false);
    }
  };

  const handleConfirmReset = async () => {
    if (!confirmResetSection) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/settings/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset_section",
          section: confirmResetSection,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to reset section.");
        return;
      }
      await loadSettings();
      setSuccess(`Restored ${confirmResetSection} section to studio defaults.`);
      setConfirmResetSection(null);
    } catch {
      setError("Network error resetting section.");
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
    <form onSubmit={handleSave} className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
            Website Settings &amp; Global SEO
          </h1>
          <p className="text-sm text-[#8D939E] mt-1">
            Centralized configuration for studio contact details, availability,
            banners, social profiles, and global SEO defaults.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {isDirty && (
            <span className="px-2.5 py-1 rounded-full bg-[#2C2415] border border-[#D6B77A]/40 text-[11px] font-mono text-[#D6B77A]">
              Unsaved changes
            </span>
          )}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl bg-[#111419] border border-[#252A32] hover:border-[#D6B77A]/45 text-xs font-medium text-[#F5F3EE]"
          >
            <Globe className="w-3.5 h-3.5 text-[#D6B77A]" />
            <span>View Website</span>
            <ExternalLink className="w-3 h-3 text-[#777D87]" />
          </Link>
          {isAdmin && (
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] disabled:opacity-60 cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{saving ? "Saving..." : "Save Changes"}</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Navigation Tabs */}
      <div className="border-b border-[#1E222A] flex items-center gap-1 overflow-x-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => switchTab(t.id)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap border-b-2 transition-colors cursor-pointer",
                active
                  ? "border-[#D6B77A] text-[#F5F3EE]"
                  : "border-transparent text-[#8D939E] hover:text-[#F5F3EE]"
              )}
            >
              <Icon
                className={cn(
                  "w-3.5 h-3.5",
                  active ? "text-[#D6B77A]" : "text-[#6D7480]"
                )}
              />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {!isAdmin && (
        <div className="p-3.5 rounded-xl bg-[#1A1610] border border-[#D6B77A]/40 text-xs text-[#D6B77A]">
          Only full administrators (`admin` role) can modify global website
          settings.
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

      <SettingsTabsContent
        tab={activeTab}
        form={form}
        isAdmin={isAdmin}
        onChange={(updater) =>
          setForm((prev) => (prev ? updater(prev) : prev))
        }
        onOpenAssetPicker={(target) => setPickerTarget(target)}
        onRevalidateCache={handleRevalidateCache}
        revalidating={revalidating}
        onRequestResetSection={(sec) => setConfirmResetSection(sec)}
      />

      {pickerTarget && (
        <MediaPickerModal
          open={Boolean(pickerTarget)}
          onClose={() => setPickerTarget(null)}
          onSelectSingle={(asset: MediaAssetItem) => {
            setForm((prev) => {
              if (!prev) return prev;
              if (pickerTarget === "logoUrl") {
                return { ...prev, logoUrl: asset.secureUrl };
              }
              if (pickerTarget === "faviconUrl") {
                return {
                  ...prev,
                  faviconUrl: asset.secureUrl,
                  banners: { ...prev.banners, faviconUrl: asset.secureUrl },
                };
              }
              if (pickerTarget === "defaultOgImageUrl") {
                return {
                  ...prev,
                  defaultOgImageUrl: asset.secureUrl,
                  banners: {
                    ...prev.banners,
                    defaultOgImageUrl: asset.secureUrl,
                  },
                };
              }
              return {
                ...prev,
                banners: {
                  ...prev.banners,
                  [pickerTarget]: asset.secureUrl,
                },
              };
            });
            setPickerTarget(null);
          }}
        />
      )}

      {confirmResetSection && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setConfirmResetSection(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-[#111419] border border-[#F28B82]/40 p-6 space-y-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 text-[#F28B82]">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-heading font-bold text-base">
                Reset <span className="capitalize">{confirmResetSection}</span>{" "}
                Defaults?
              </h3>
            </div>
            <p className="text-xs text-[#8D939E] leading-relaxed">
              This restores only the{" "}
              <strong className="text-[#F5F3EE]">{confirmResetSection}</strong>{" "}
              configuration back to studio defaults. Other settings tabs and
              per-page SEO records remain untouched.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmResetSection(null)}
                className="h-9 px-4 rounded-lg bg-[#171B22] border border-[#252A32] text-xs text-[#C8C3B8] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmReset}
                disabled={saving}
                className="h-9 px-4 rounded-lg bg-[#F28B82] text-[#08090B] text-xs font-semibold cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
