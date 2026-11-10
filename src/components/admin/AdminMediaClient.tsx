"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  Search,
  Copy,
  Check,
  Trash2,
  Edit3,
  Link2,
  Cloud,
  HardDrive,
  Loader2,
  X,
} from "lucide-react";
import { useAdminUser } from "./AdminContext";
import type { MediaAssetItem } from "./MediaPickerModal";

export function AdminMediaClient() {
  const router = useRouter();
  const { canEdit } = useAdminUser();

  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [showExternalModal, setShowExternalModal] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [externalAlt, setExternalAlt] = useState("");
  const [externalCaption, setExternalCaption] = useState("");

  const [editingAsset, setEditingAsset] = useState<MediaAssetItem | null>(null);
  const [editAlt, setEditAlt] = useState("");
  const [editCaption, setEditCaption] = useState("");

  const fetchMediaAssets = useCallback(async () => {
    const params = new URLSearchParams({ limit: "48" });
    if (query.trim()) params.set("q", query.trim());

    const res = await fetch(`/api/v1/admin/media?${params.toString()}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Unable to fetch media library.");
    }
    return {
      items: (json.data || []) as MediaAssetItem[],
      cloudinaryConfigured: Boolean(json.meta?.cloudinaryConfigured),
    };
  }, [query, router]);

  useEffect(() => {
    let ignore = false;
    fetchMediaAssets()
      .then((result) => {
        if (!ignore && result) {
          setAssets(result.items);
          setCloudinaryConfigured(result.cloudinaryConfigured);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Network error loading media library."
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fetchMediaAssets]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
    setSuccess("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("altText", file.name.replace(/\.[^.]+$/, ""));

      const res = await fetch("/api/v1/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "File upload failed.");
        return;
      }

      setAssets((prev) => [json.data, ...prev]);
      setSuccess(
        `Uploaded "${file.name}" (${json.data.storageProvider}).`
      );
    } catch {
      setError("Network error uploading media file.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleRegisterExternal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const url = externalUrl.trim();
      const res = await fetch("/api/v1/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storageProvider: url.includes("res.cloudinary.com")
            ? "cloudinary"
            : "external",
          providerAssetId: `ext_${Date.now()}`,
          assetUrl: url,
          secureUrl: url,
          resourceType: "image",
          mimeType: "image/jpeg",
          fileSizeBytes: 1024,
          altText: externalAlt.trim(),
          caption: externalCaption.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Failed to register external URL.");
        return;
      }
      setAssets((prev) => [json.data, ...prev]);
      setExternalUrl("");
      setExternalAlt("");
      setExternalCaption("");
      setShowExternalModal(false);
      setSuccess("External media URL registered in CMS library.");
    } catch {
      setError("Network error registering external media URL.");
    }
  };

  const handleSaveMetadata = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAsset) return;
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/media/${editingAsset.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          altText: editAlt,
          caption: editCaption || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Failed to update asset metadata.");
        return;
      }
      setAssets((prev) =>
        prev.map((a) => (a.id === editingAsset.id ? json.data : a))
      );
      setEditingAsset(null);
      setSuccess("Updated media alt text and caption.");
    } catch {
      setError("Network error updating media asset.");
    }
  };

  const handleDelete = async (asset: MediaAssetItem) => {
    if (!window.confirm(`Delete media asset "${asset.altText || asset.id}"?`)) {
      return;
    }
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/v1/admin/media/${asset.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to delete media asset.");
        return;
      }
      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      setSuccess("Media asset deleted.");
    } catch {
      setError("Network error deleting media asset.");
    }
  };

  const copyUrl = async (asset: MediaAssetItem) => {
    await navigator.clipboard.writeText(asset.secureUrl);
    setCopiedId(asset.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
            Media Library
          </h1>
          <p className="text-sm text-[#B2B4BA]">
            Upload studio images, manage alt text, and reuse assets across Projects, Services, and SEO metadata.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs font-mono">
          {cloudinaryConfigured ? (
            <>
              <Cloud className="w-4 h-4 text-[#7CD69F]" />
              <span className="text-[#7CD69F]">Cloudinary Connected</span>
            </>
          ) : (
            <>
              <HardDrive className="w-4 h-4 text-[#D6B77A]" />
              <span className="text-[#D6B77A]">Local Fallback Mode</span>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by alt text, caption, or URL..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#12151A] border border-[#252A32] text-sm text-[#F5F3EE] placeholder-[#777D87] focus:outline-none focus:border-[#D6B77A]"
          />
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setShowExternalModal(true)}
              className="inline-flex items-center gap-2 px-3.5 h-10 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE] hover:border-[#3A414B] cursor-pointer"
            >
              <Link2 className="w-4 h-4 text-[#D6B77A]" />
              <span>Add External URL</span>
            </button>

            <label className="inline-flex items-center gap-2 px-4 h-10 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] cursor-pointer">
              {uploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{uploading ? "Uploading..." : "Upload File (Max 10MB)"}</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm"
                onChange={handleUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

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

      {loading ? (
        <div className="py-12 text-center text-xs font-mono text-[#777D87]">
          Loading media library...
        </div>
      ) : assets.length === 0 ? (
        <div className="p-12 rounded-2xl bg-[#12151A] border border-[#252A32] text-center space-y-2">
          <p className="text-sm text-[#F5F3EE]">No media assets uploaded yet.</p>
          <p className="text-xs text-[#777D87]">
            Upload images or add a Cloudinary/HTTPS URL to populate your library.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-xl bg-[#12151A] border border-[#252A32] overflow-hidden flex flex-col"
            >
              <div className="aspect-video bg-[#08090B] overflow-hidden relative">
                {asset.resourceType === "video" ? (
                  <video
                    src={asset.secureUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={asset.secureUrl}
                    alt={asset.altText || "CMS media asset"}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <div className="p-3.5 flex-1 flex flex-col justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-[#F5F3EE] truncate">
                    {asset.altText || "Untitled asset"}
                  </div>
                  <div className="text-[11px] font-mono text-[#777D87] flex justify-between">
                    <span>{asset.storageProvider}</span>
                    <span>{Math.round(asset.fileSizeBytes / 1024)} KB</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#252A32]">
                  <button
                    type="button"
                    onClick={() => copyUrl(asset)}
                    className="inline-flex items-center gap-1 text-xs text-[#B2B4BA] hover:text-white cursor-pointer"
                  >
                    {copiedId === asset.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#7CD69F]" />
                        <span className="text-[#7CD69F]">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy URL</span>
                      </>
                    )}
                  </button>

                  {canEdit && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAsset(asset);
                          setEditAlt(asset.altText);
                          setEditCaption(asset.caption || "");
                        }}
                        aria-label="Edit metadata"
                        className="p-1.5 rounded text-[#B2B4BA] hover:text-white hover:bg-[#191D23] cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(asset)}
                        aria-label="Delete media asset"
                        className="p-1.5 rounded text-[#777D87] hover:text-[#F28B82] hover:bg-[#2A1414] cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* External URL Modal */}
      {showExternalModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form
            onSubmit={handleRegisterExternal}
            className="w-full max-w-md rounded-2xl bg-[#12151A] border border-[#252A32] p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
                Register External / Cloudinary URL
              </h2>
              <button
                type="button"
                onClick={() => setShowExternalModal(false)}
                className="text-[#777D87] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">Image URL *</label>
              <input
                type="url"
                required
                value={externalUrl}
                onChange={(e) => setExternalUrl(e.target.value)}
                placeholder="https://res.cloudinary.com/..."
                className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">Alt Text *</label>
              <input
                type="text"
                required
                value={externalAlt}
                onChange={(e) => setExternalAlt(e.target.value)}
                placeholder="Studio campaign visual"
                className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">Caption</label>
              <input
                type="text"
                value={externalCaption}
                onChange={(e) => setExternalCaption(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowExternalModal(false)}
                className="px-4 py-2 rounded-lg text-xs text-[#B2B4BA] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold cursor-pointer"
              >
                Register Asset
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editingAsset && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveMetadata}
            className="w-full max-w-md rounded-2xl bg-[#12151A] border border-[#252A32] p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
                Edit Media Metadata
              </h2>
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="text-[#777D87] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">Alt Text</label>
              <input
                type="text"
                value={editAlt}
                onChange={(e) => setEditAlt(e.target.value)}
                className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">Caption</label>
              <textarea
                rows={3}
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditingAsset(null)}
                className="px-4 py-2 rounded-lg text-xs text-[#B2B4BA] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold cursor-pointer"
              >
                Save Metadata
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
