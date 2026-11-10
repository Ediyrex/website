"use client";

import React, { useEffect, useState, useCallback } from "react";
import { X, Upload, Search, Check, Loader2, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MediaAssetItem {
  id: string;
  storageProvider: string;
  assetUrl: string;
  secureUrl: string;
  resourceType: "image" | "video" | "document";
  mimeType: string;
  fileSizeBytes: number;
  width: number | null;
  height: number | null;
  altText: string;
  caption: string | null;
  createdAt: string;
}

interface MediaPickerModalProps {
  open: boolean;
  title?: string;
  selectedId?: string | null;
  selectedIds?: string[];
  multi?: boolean;
  onClose: () => void;
  onSelectSingle?: (asset: MediaAssetItem) => void;
  onSelectMulti?: (assets: MediaAssetItem[]) => void;
}

export function MediaPickerModal(props: MediaPickerModalProps) {
  if (!props.open) return null;
  return <MediaPickerContent {...props} />;
}

function MediaPickerContent({
  title = "Select Media Asset",
  selectedId,
  selectedIds = [],
  multi = false,
  onClose,
  onSelectSingle,
  onSelectMulti,
}: MediaPickerModalProps) {
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [multiSelected, setMultiSelected] = useState<string[]>(selectedIds);

  const fetchAssets = useCallback(async (search: string) => {
    const params = new URLSearchParams({ limit: "40", type: "image" });
    if (search.trim()) params.set("q", search.trim());
    const res = await fetch(`/api/v1/admin/media?${params.toString()}`);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Unable to load media assets.");
    }
    return (json.data || []) as MediaAssetItem[];
  }, []);

  useEffect(() => {
    let ignore = false;
    fetchAssets(query)
      .then((items) => {
        if (!ignore) setAssets(items);
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
  }, [query, fetchAssets]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError("");
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
        setError(json.message || "Upload failed.");
        return;
      }

      const created = json.data as MediaAssetItem;
      setAssets((prev) => [created, ...prev]);
      if (!multi && onSelectSingle) {
        onSelectSingle(created);
        onClose();
      } else if (multi) {
        setMultiSelected((prev) => [...prev, created.id]);
      }
    } catch {
      setError("Upload request failed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const toggleMulti = (id: string) => {
    setMultiSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleConfirmMulti = () => {
    if (!onSelectMulti) return;
    const picked = assets.filter((a) => multiSelected.includes(a.id));
    onSelectMulti(picked);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[88vh] flex flex-col rounded-2xl bg-[#12151A] border border-[#252A32] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#252A32]">
          <div>
            <h3 className="font-heading font-semibold text-base text-[#F5F3EE]">
              {title}
            </h3>
            <p className="text-xs text-[#777D87]">
              Upload a new image or choose from the studio library.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close media picker"
            className="p-2 rounded-lg text-[#B2B4BA] hover:text-white hover:bg-[#191D23] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 py-3.5 border-b border-[#252A32] flex flex-wrap items-center gap-3 justify-between bg-[#0D0F12]">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search media by alt text or filename..."
              className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE] placeholder-[#777D87] focus:outline-none focus:border-[#D6B77A]"
            />
          </div>

          <label className="inline-flex items-center gap-2 px-3.5 h-9 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] transition-colors cursor-pointer">
            {uploading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5" />
            )}
            <span>{uploading ? "Uploading..." : "Upload Image"}</span>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
              onChange={handleFileUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 rounded-lg bg-[#2A1414] border border-[#F28B82]/40 text-xs text-[#F28B82]">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-[#777D87]">
              Loading media assets...
            </div>
          ) : assets.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <ImageIcon className="w-8 h-8 text-[#777D87] mx-auto" />
              <p className="text-sm text-[#B2B4BA]">No media assets found.</p>
              <p className="text-xs text-[#777D87]">
                Upload an image above to add it to your CMS library.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {assets.map((asset) => {
                const isSelected = multi
                  ? multiSelected.includes(asset.id)
                  : selectedId === asset.id;

                return (
                  <button
                    key={asset.id}
                    type="button"
                    onClick={() => {
                      if (multi) {
                        toggleMulti(asset.id);
                      } else if (onSelectSingle) {
                        onSelectSingle(asset);
                        onClose();
                      }
                    }}
                    className={cn(
                      "group relative text-left rounded-xl overflow-hidden border transition-all cursor-pointer bg-[#0D0F12]",
                      isSelected
                        ? "border-[#D6B77A] ring-2 ring-[#D6B77A]/40"
                        : "border-[#252A32] hover:border-[#3A414B]"
                    )}
                  >
                    <div className="aspect-video bg-[#08090B] overflow-hidden relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={asset.secureUrl}
                        alt={asset.altText || "Studio media"}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#D6B77A] text-[#08090B] flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                    </div>
                    <div className="p-2.5 space-y-0.5">
                      <div className="text-xs text-[#F5F3EE] truncate">
                        {asset.altText || "Untitled asset"}
                      </div>
                      <div className="text-[10px] font-mono text-[#777D87] flex justify-between">
                        <span>{asset.storageProvider}</span>
                        <span>{Math.round(asset.fileSizeBytes / 1024)} KB</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {multi && (
          <div className="px-6 py-4 border-t border-[#252A32] bg-[#0D0F12] flex items-center justify-between">
            <span className="text-xs text-[#B2B4BA]">
              {multiSelected.length} image{multiSelected.length === 1 ? "" : "s"} selected
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs text-[#B2B4BA] hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmMulti}
                className="px-4 py-2 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] cursor-pointer"
              >
                Confirm Selection
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
