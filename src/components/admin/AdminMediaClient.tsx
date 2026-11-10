"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Check,
  CheckSquare,
  Cloud,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Film,
  Folder,
  FolderOpen,
  FolderPlus,
  HardDrive,
  Image as ImageIcon,
  LayoutGrid,
  Link2,
  List,
  Loader2,
  MoreHorizontal,
  Plus,
  Save,
  Search,
  Square,
  Tag,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "./AdminContext";
import type { MediaAssetItem } from "./MediaPickerModal";

const DEFAULT_FOLDERS = [
  "Portfolio",
  "Services",
  "Blog",
  "Brand Assets",
  "Website",
  "Temp / Drafts",
  "Archive",
];

const ALLOWED_UPLOAD_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "video/mp4",
  "video/webm",
  "application/pdf",
]);
const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

interface UploadQueueItem {
  localId: string;
  name: string;
  size: number;
  previewUrl: string | null;
  progress: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

function extractMediaDimensions(
  file: File
): Promise<{ width: number | null; height: number | null }> {
  return new Promise((resolve) => {
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      const img = new window.Image();
      img.onload = () => {
        const result = { width: img.naturalWidth || null, height: img.naturalHeight || null };
        URL.revokeObjectURL(url);
        resolve(result);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ width: null, height: null });
      };
      img.src = url;
      return;
    }
    if (file.type.startsWith("video/")) {
      const url = URL.createObjectURL(file);
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        const result = { width: video.videoWidth || null, height: video.videoHeight || null };
        URL.revokeObjectURL(url);
        resolve(result);
      };
      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve({ width: null, height: null });
      };
      video.src = url;
      return;
    }
    resolve({ width: null, height: null });
  });
}

interface MediaStats {
  totalAll: number;
  imagesCount: number;
  videosCount: number;
  documentsCount: number;
  totalBytes: number;
  folderCounts: { folder: string; count: number }[];
}

interface MediaUsageItem {
  kind: string;
  id: string;
  title: string;
  slug: string;
}

interface DetailedMediaAsset extends MediaAssetItem {
  usage?: MediaUsageItem[];
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let idx = 0;
  let value = bytes;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  return `${value >= 10 || idx === 0 ? value.toFixed(0) : value.toFixed(1)} ${units[idx]}`;
}

function formatShortDate(dateValue?: string | null): string {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getFileDisplayName(asset: MediaAssetItem): string {
  if (asset.providerPublicId) {
    const seg = asset.providerPublicId.split("/").pop();
    if (seg) return seg;
  }
  return asset.altText || "Untitled asset";
}

function getUsageHref(kind: string): string {
  if (kind.startsWith("Project")) return "/admin/projects";
  if (kind === "Service") return "/admin/services";
  if (kind === "Blog Post") return "/admin/blog";
  if (kind === "Page") return "/admin/pages";
  return "/admin";
}

export function AdminMediaClient() {
  const router = useRouter();
  const { canEdit } = useAdminUser();

  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [stats, setStats] = useState<MediaStats>({
    totalAll: 0,
    imagesCount: 0,
    videosCount: 0,
    documentsCount: 0,
    totalBytes: 0,
    folderCounts: [],
  });
  const [cloudinaryConfigured, setCloudinaryConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [activeFolder, setActiveFolder] = useState("");
  const [activeTag, setActiveTag] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "largest">("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [customFolders, setCustomFolders] = useState<string[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [uploadQueue, setUploadQueue] = useState<UploadQueueItem[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<DetailedMediaAsset | null>(null);
  const [deletingAsset, setDeletingAsset] = useState(false);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inspectedId, setInspectedId] = useState<string | null>(null);
  const [inspectedDetail, setInspectedDetail] = useState<DetailedMediaAsset | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [editAlt, setEditAlt] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editFolder, setEditFolder] = useState("Website");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [savingDetail, setSavingDetail] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modals
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [showExternalModal, setShowExternalModal] = useState(false);
  const [externalUrl, setExternalUrl] = useState("");
  const [externalAlt, setExternalAlt] = useState("");
  const [externalCaption, setExternalCaption] = useState("");
  const [externalFolder, setExternalFolder] = useState("Website");

  const [bulkMoveOpen, setBulkMoveOpen] = useState(false);
  const [bulkMoveFolder, setBulkMoveFolder] = useState("Portfolio");
  const [bulkTagOpen, setBulkTagOpen] = useState(false);
  const [bulkTagValue, setBulkTagValue] = useState("");
  const [bulkWorking, setBulkWorking] = useState(false);

  const fetchMediaAssets = useCallback(async () => {
    const params = new URLSearchParams({ limit: "48", sort: sortBy });
    if (query.trim()) params.set("q", query.trim());
    if (typeFilter) params.set("type", typeFilter);
    if (activeFolder) params.set("folder", activeFolder);
    if (activeTag) params.set("tag", activeTag);

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
      stats: (json.meta?.stats || {
        totalAll: 0,
        imagesCount: 0,
        videosCount: 0,
        documentsCount: 0,
        totalBytes: 0,
        folderCounts: [],
      }) as MediaStats,
    };
  }, [activeFolder, activeTag, query, router, sortBy, typeFilter]);

  const reloadMedia = async () => {
    setLoading(true);
    try {
      const result = await fetchMediaAssets();
      if (result) {
        setAssets(result.items);
        setCloudinaryConfigured(result.cloudinaryConfigured);
        setStats(result.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error loading media library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchMediaAssets()
      .then((result) => {
        if (!ignore && result) {
          setAssets(result.items);
          setCloudinaryConfigured(result.cloudinaryConfigured);
          setStats(result.stats);
          setInspectedId((prev) => {
            if (prev && result.items.some((i) => i.id === prev)) return prev;
            return result.items[0]?.id ?? null;
          });
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Network error loading media library.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fetchMediaAssets]);

  useEffect(() => {
    if (!inspectedId) return;
    let ignore = false;
    fetch(`/api/v1/admin/media/${inspectedId}`)
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Failed to load asset details.");
        return json.data as DetailedMediaAsset;
      })
      .then((detail) => {
        if (!ignore) {
          setInspectedDetail(detail);
          setEditAlt(detail.altText || "");
          setEditCaption(detail.caption || "");
          setEditFolder(detail.folder || "Website");
          setEditTags(Array.isArray(detail.tags) ? detail.tags : []);
        }
      })
      .catch(() => {
        if (!ignore) {
          setInspectedDetail(null);
        }
      })
      .finally(() => {
        if (!ignore) setDetailLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [inspectedId]);

  const folderDirectory = useMemo(() => {
    const countMap = new Map<string, number>();
    for (const row of stats.folderCounts) {
      countMap.set(row.folder, row.count);
    }
    const allNames = Array.from(
      new Set([
        ...DEFAULT_FOLDERS,
        ...customFolders,
        ...stats.folderCounts.map((f) => f.folder),
      ])
    );
    return allNames.map((name) => ({
      name,
      count: countMap.get(name) ?? 0,
    }));
  }, [customFolders, stats.folderCounts]);

  const selectedBytes = useMemo(() => {
    const idSet = new Set(selectedIds);
    return assets
      .filter((a) => idSet.has(a.id))
      .reduce((acc, item) => acc + (item.fileSizeBytes || 0), 0);
  }, [assets, selectedIds]);

  const selectAssetForInspector = (id: string) => {
    if (id !== inspectedId) {
      setDetailLoading(true);
      setInspectedId(id);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const uploadFileWithProgress = (
    formData: FormData,
    localId: string
  ): Promise<{ id?: string }> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/v1/admin/media/upload");
      xhr.upload.onprogress = (evt) => {
        if (evt.lengthComputable) {
          const pct = Math.min(99, Math.round((evt.loaded / evt.total) * 100));
          setUploadQueue((prev) =>
            prev.map((q) => (q.localId === localId ? { ...q, progress: pct } : q))
          );
        }
      };
      xhr.onload = () => {
        try {
          const parsed = JSON.parse(xhr.responseText || "{}");
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadQueue((prev) =>
              prev.map((q) =>
                q.localId === localId ? { ...q, progress: 100, status: "done" } : q
              )
            );
            resolve(parsed.data || {});
          } else {
            reject(new Error(parsed.message || `Upload failed (${xhr.status}).`));
          }
        } catch {
          reject(new Error("Invalid server response during upload."));
        }
      };
      xhr.onerror = () => reject(new Error("Network error during upload."));
      xhr.send(formData);
    });
  };

  const processUploadFiles = async (fileList: FileList | File[]) => {
    const incoming = Array.from(fileList);
    if (incoming.length === 0 || !canEdit) return;

    setUploading(true);
    setError("");
    setSuccess("");
    const targetFolder = activeFolder || "Website";

    const prepared = incoming.map((file) => {
      const localId = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const previewUrl = file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : null;
      return { file, localId, previewUrl };
    });

    setUploadQueue(
      prepared.map(({ file, localId, previewUrl }) => ({
        localId,
        name: file.name,
        size: file.size,
        previewUrl,
        progress: 0,
        status: "uploading",
      }))
    );

    let uploadedCount = 0;
    let lastUploadedId: string | null = null;

    for (const { file, localId, previewUrl } of prepared) {
      if (!ALLOWED_UPLOAD_MIME_TYPES.has(file.type.toLowerCase())) {
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.localId === localId
              ? { ...q, status: "error", error: "Unsupported format" }
              : q
          )
        );
        continue;
      }
      if (file.size <= 0 || file.size > MAX_UPLOAD_SIZE_BYTES) {
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.localId === localId
              ? { ...q, status: "error", error: "Exceeds 10 MB limit" }
              : q
          )
        );
        continue;
      }

      try {
        const dims = await extractMediaDimensions(file);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("altText", file.name.replace(/\.[^.]+$/, ""));
        formData.append("folder", targetFolder);
        if (dims.width) formData.append("width", String(dims.width));
        if (dims.height) formData.append("height", String(dims.height));

        const uploaded = await uploadFileWithProgress(formData, localId);
        uploadedCount += 1;
        lastUploadedId = uploaded.id ?? lastUploadedId;
      } catch (err) {
        setUploadQueue((prev) =>
          prev.map((q) =>
            q.localId === localId
              ? {
                  ...q,
                  status: "error",
                  error: err instanceof Error ? err.message : "Upload failed",
                }
              : q
          )
        );
      } finally {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
      }
    }

    if (uploadedCount > 0) {
      setSuccess(
        `Uploaded ${uploadedCount} ${uploadedCount === 1 ? "asset" : "assets"} to ${targetFolder}.`
      );
      await reloadMedia();
      if (lastUploadedId) {
        setDetailLoading(true);
        setInspectedId(lastUploadedId);
      }
    }
    setUploading(false);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processUploadFiles(files);
    e.target.value = "";
  };

  const handleDropFiles = async (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processUploadFiles(e.dataTransfer.files);
    }
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = newFolderName.trim();
    if (!cleaned) return;
    if (!customFolders.includes(cleaned) && !DEFAULT_FOLDERS.includes(cleaned)) {
      setCustomFolders((prev) => [...prev, cleaned]);
    }
    setActiveFolder(cleaned);
    setNewFolderName("");
    setShowFolderModal(false);
    setSuccess(`Folder "${cleaned}" ready. Upload or move files into it to persist.`);
  };

  const handleRegisterExternal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storageProvider: "external",
          providerAssetId: `ext-${Date.now()}`,
          assetUrl: externalUrl,
          secureUrl: externalUrl,
          resourceType: "image",
          mimeType: "image/webp",
          fileSizeBytes: 0,
          altText: externalAlt || "Studio image asset",
          caption: externalCaption || undefined,
          folder: externalFolder || activeFolder || "Website",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to register URL.");
        return;
      }
      setShowExternalModal(false);
      setExternalUrl("");
      setExternalAlt("");
      setExternalCaption("");
      setSuccess("External asset registered in media library.");
      await reloadMedia();
    } catch {
      setError("Network error registering external media URL.");
    }
  };

  const handleSaveDetail = async () => {
    if (!inspectedId || !canEdit) return;
    setSavingDetail(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/v1/admin/media/${inspectedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          altText: editAlt.trim() || "Studio media asset",
          caption: editCaption.trim() || null,
          folder: editFolder,
          tags: editTags,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to update media metadata.");
        return;
      }
      setSuccess("Asset metadata saved.");
      await reloadMedia();
      setInspectedDetail((prev) => (prev ? { ...prev, ...json.data } : prev));
    } catch {
      setError("Network error updating media metadata.");
    } finally {
      setSavingDetail(false);
    }
  };

  const handleAddTag = () => {
    const clean = newTagInput.trim().toLowerCase();
    if (!clean) return;
    if (!editTags.includes(clean)) {
      setEditTags((prev) => [...prev, clean]);
    }
    setNewTagInput("");
  };

  const requestDeleteAsset = async (asset: DetailedMediaAsset) => {
    if (!canEdit) return;
    try {
      const res = await fetch(`/api/v1/admin/media/${asset.id}`);
      const json = await res.json();
      if (res.ok && json.data) {
        setDeleteTarget(json.data as DetailedMediaAsset);
      } else {
        setDeleteTarget(asset);
      }
    } catch {
      setDeleteTarget(asset);
    }
  };

  const confirmDeleteAsset = async () => {
    if (!deleteTarget || !canEdit) return;
    setDeletingAsset(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/v1/admin/media/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to delete asset.");
        setDeleteTarget(null);
        return;
      }
      setSuccess("Asset deleted.");
      setSelectedIds((prev) => prev.filter((id) => id !== deleteTarget.id));
      if (inspectedId === deleteTarget.id) {
        setInspectedId(null);
        setInspectedDetail(null);
      }
      setDeleteTarget(null);
      await reloadMedia();
    } catch {
      setError("Network error deleting asset.");
    } finally {
      setDeletingAsset(false);
    }
  };

  const handleBulkAction = async (
    action: "move_folder" | "add_tag" | "delete",
    extra?: { folder?: string; tag?: string }
  ) => {
    if (selectedIds.length === 0 || !canEdit) return;
    setBulkWorking(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch("/api/v1/admin/media/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ids: selectedIds,
          action,
          folder: extra?.folder,
          tag: extra?.tag,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Bulk action failed.");
        return;
      }
      const affectedCount =
        json.data?.affected ??
        json.data?.updated ??
        json.data?.deleted ??
        selectedIds.length;
      setBulkMoveOpen(false);
      setBulkTagOpen(false);
      setBulkTagValue("");
      if (action === "delete") {
        setSelectedIds([]);
        if (inspectedId && selectedIds.includes(inspectedId)) {
          setInspectedId(null);
          setInspectedDetail(null);
        }
        setSuccess(`Deleted ${affectedCount} assets.`);
      } else if (action === "move_folder") {
        setSuccess(`Moved ${affectedCount} assets to "${extra?.folder}".`);
      } else if (action === "add_tag") {
        setSuccess(`Tagged ${affectedCount} assets with "${extra?.tag}".`);
      }
      await reloadMedia();
    } catch {
      setError("Network error running bulk action.");
    } finally {
      setBulkWorking(false);
    }
  };

  const handleBulkDownload = () => {
    const picked = assets.filter((a) => selectedIds.includes(a.id));
    for (const item of picked) {
      const link = document.createElement("a");
      link.href = item.secureUrl;
      link.download = getFileDisplayName(item);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const copyUrl = async (asset: MediaAssetItem) => {
    try {
      await navigator.clipboard.writeText(asset.secureUrl);
      setCopiedId(asset.id);
      setTimeout(() => setCopiedId(null), 1600);
    } catch {
      setError("Failed to copy URL to clipboard.");
    }
  };

  const storageCapBytes = 5 * 1024 * 1024 * 1024;
  const storagePercent = Math.min(
    100,
    Math.max(stats.totalBytes > 0 ? 2 : 0, Math.round((stats.totalBytes / storageCapBytes) * 100))
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-[#F5F3EE] tracking-tight">
            Media Library
          </h1>
          <p className="text-sm text-[#8F96A3] mt-1">
            Manage your studio&apos;s media assets, including images, videos, documents, and other files.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {canEdit && (
            <>
              <button
                type="button"
                onClick={() => setShowFolderModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] text-xs font-medium text-[#F5F3EE] transition-colors cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-[#D6B77A]" />
                <span>Create Folder</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setExternalFolder(activeFolder || "Website");
                  setShowExternalModal(true);
                }}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] text-xs font-medium text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors cursor-pointer"
              >
                <Link2 className="w-3.5 h-3.5 text-[#7BA9F5]" />
                <span>Register URL</span>
              </button>

              <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D6B77A] hover:bg-[#E2C58B] text-xs font-semibold text-[#17130B] transition-colors cursor-pointer shadow-xs">
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>{uploading ? "Uploading..." : "Upload Media"}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*,application/pdf"
                  onChange={handleUpload}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </>
          )}
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#8F96A3]">
            <span className="w-7 h-7 rounded-lg bg-[#D6B77A]/12 border border-[#D6B77A]/25 flex items-center justify-center">
              <ImageIcon className="w-3.5 h-3.5 text-[#D6B77A]" />
            </span>
            <span>Total Assets</span>
          </div>
          <p className="font-heading text-2xl font-bold text-[#F5F3EE]">
            {stats.totalAll}
          </p>
          <p className="text-[11px] text-[#777D87]">
            {cloudinaryConfigured ? "Cloudinary CDN active" : "Local studio storage"}
          </p>
        </div>

        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#8F96A3]">
            <span className="w-7 h-7 rounded-lg bg-[#7BA9F5]/12 border border-[#7BA9F5]/25 flex items-center justify-center">
              <ImageIcon className="w-3.5 h-3.5 text-[#7BA9F5]" />
            </span>
            <span>Images</span>
          </div>
          <p className="font-heading text-2xl font-bold text-[#F5F3EE]">
            {stats.imagesCount}
          </p>
          <p className="text-[11px] text-[#777D87]">WEBP · PNG · JPG</p>
        </div>

        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#8F96A3]">
            <span className="w-7 h-7 rounded-lg bg-[#E58A76]/12 border border-[#E58A76]/25 flex items-center justify-center">
              <Film className="w-3.5 h-3.5 text-[#E58A76]" />
            </span>
            <span>Videos</span>
          </div>
          <p className="font-heading text-2xl font-bold text-[#F5F3EE]">
            {stats.videosCount}
          </p>
          <p className="text-[11px] text-[#777D87]">MP4 · MOV · Reels</p>
        </div>

        <div className="rounded-2xl bg-[#12151A] border border-[#252A32] p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#8F96A3]">
            <span className="w-7 h-7 rounded-lg bg-[#B5A0F5]/12 border border-[#B5A0F5]/25 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5 text-[#B5A0F5]" />
            </span>
            <span>Documents</span>
          </div>
          <p className="font-heading text-2xl font-bold text-[#F5F3EE]">
            {stats.documentsCount}
          </p>
          <p className="text-[11px] text-[#777D87]">PDF · Briefs · Decks</p>
        </div>

        <div className="col-span-2 lg:col-span-1 rounded-2xl bg-[#12151A] border border-[#252A32] p-4 flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between text-xs text-[#8F96A3]">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[#D6B77A]/12 border border-[#D6B77A]/25 flex items-center justify-center">
                {cloudinaryConfigured ? (
                  <Cloud className="w-3.5 h-3.5 text-[#D6B77A]" />
                ) : (
                  <HardDrive className="w-3.5 h-3.5 text-[#D6B77A]" />
                )}
              </span>
              <span>Storage Used</span>
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="font-heading text-xl font-bold text-[#F5F3EE]">
              {formatBytes(stats.totalBytes)}
            </p>
            <span className="text-[11px] text-[#777D87]">/ 5 GB pool</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#191D23] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#D6B77A] to-[#B69454]"
              style={{ width: `${storagePercent}%` }}
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-[#F07878]/10 border border-[#F07878]/30 text-sm text-[#F07878] flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {success && (
        <div className="px-4 py-3 rounded-xl bg-[#73C794]/10 border border-[#73C794]/30 text-sm text-[#73C794] flex items-center justify-between">
          <span>{success}</span>
          <button type="button" onClick={() => setSuccess("")} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 3-Column Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Folder Tree */}
        <aside className="lg:col-span-3 xl:col-span-2 rounded-2xl bg-[#12151A] border border-[#252A32] p-3.5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-[#F5F3EE]">Folders</span>
            {canEdit && (
              <button
                type="button"
                onClick={() => setShowFolderModal(true)}
                title="Create folder"
                className="p-1 rounded-md text-[#8F96A3] hover:text-[#F5F3EE] hover:bg-[#191D23] cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => setActiveFolder("")}
              className={cn(
                "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer",
                activeFolder === ""
                  ? "bg-[#D6B77A]/15 text-[#D6B77A] border border-[#D6B77A]/30 font-medium"
                  : "text-[#B2B4BA] hover:bg-[#191D23] hover:text-[#F5F3EE]"
              )}
            >
              <span className="flex items-center gap-2 truncate">
                <FolderOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">All Media</span>
              </span>
              <span className="text-[11px] text-[#777D87]">{stats.totalAll}</span>
            </button>

            {folderDirectory.map((f) => (
              <button
                key={f.name}
                type="button"
                onClick={() => setActiveFolder(f.name)}
                className={cn(
                  "w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-colors cursor-pointer",
                  activeFolder === f.name
                    ? "bg-[#D6B77A]/15 text-[#D6B77A] border border-[#D6B77A]/30 font-medium"
                    : "text-[#B2B4BA] hover:bg-[#191D23] hover:text-[#F5F3EE]"
                )}
              >
                <span className="flex items-center gap-2 truncate">
                  <Folder className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{f.name}</span>
                </span>
                <span className="text-[11px] text-[#777D87]">{f.count}</span>
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#252A32] px-1 space-y-2">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#8F96A3]">Storage</span>
              <span className="text-[#D6B77A] font-medium">{storagePercent}%</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#191D23] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#D6B77A]"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
            <p className="text-[10px] text-[#777D87]">
              {formatBytes(stats.totalBytes)} across {stats.totalAll} assets
            </p>
          </div>
        </aside>

        {/* Center Gallery + Drag & Drop + Toolbar + Bulk Bar */}
        <section
          onDragOver={(e) => {
            if (!canEdit) return;
            e.preventDefault();
            setIsDraggingOver(true);
          }}
          onDragLeave={(e) => {
            if (e.currentTarget.contains(e.relatedTarget as Node)) return;
            setIsDraggingOver(false);
          }}
          onDrop={handleDropFiles}
          className={cn(
            "lg:col-span-6 xl:col-span-7 rounded-2xl bg-[#12151A] border overflow-hidden flex flex-col relative transition-colors",
            isDraggingOver
              ? "border-[#D6B77A] ring-2 ring-[#D6B77A]/30"
              : "border-[#252A32]"
          )}
        >
          {isDraggingOver && (
            <div className="absolute inset-0 z-30 bg-[#08090B]/85 backdrop-blur-xs flex flex-col items-center justify-center gap-2 pointer-events-none border-2 border-dashed border-[#D6B77A] m-2 rounded-xl">
              <Upload className="w-8 h-8 text-[#D6B77A]" />
              <p className="text-sm font-semibold text-[#F5F3EE]">
                Drop files to upload to {activeFolder || "Website"}
              </p>
              <p className="text-xs text-[#8F96A3]">
                Images, MP4/WebM videos &amp; PDFs up to 10 MB
              </p>
            </div>
          )}

          {/* Upload Queue & Progress Strip */}
          {uploadQueue.length > 0 && (
            <div className="px-3.5 py-2.5 border-b border-[#252A32] bg-[#0D0F12] space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-medium text-[#D6B77A]">
                  Upload Queue ({uploadQueue.length})
                </span>
                <button
                  type="button"
                  onClick={() => setUploadQueue([])}
                  className="text-[#8F96A3] hover:text-[#F5F3EE] cursor-pointer"
                >
                  Clear
                </button>
              </div>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {uploadQueue.map((item) => (
                  <div
                    key={item.localId}
                    className="flex items-center gap-2.5 text-xs bg-[#12151A] border border-[#252A32] rounded-lg px-2.5 py-1.5"
                  >
                    {item.previewUrl ? (
                      <img
                        src={item.previewUrl}
                        alt={item.name}
                        className="w-7 h-5 rounded object-cover shrink-0"
                      />
                    ) : (
                      <FileText className="w-4 h-4 text-[#8F96A3] shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate text-[11px] text-[#F5F3EE]">
                          {item.name}
                        </span>
                        <span className="text-[10px] text-[#777D87] shrink-0">
                          {item.status === "error"
                            ? item.error
                            : item.status === "done"
                              ? "Uploaded"
                              : `${item.progress}%`}
                        </span>
                      </div>
                      <div className="w-full h-1 rounded-full bg-[#191D23] mt-1 overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            item.status === "error"
                              ? "bg-[#F07878]"
                              : item.status === "done"
                                ? "bg-[#73C794]"
                                : "bg-[#D6B77A]"
                          )}
                          style={{
                            width: `${item.status === "error" ? 100 : item.progress}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Toolbar */}
          <div className="p-3.5 border-b border-[#252A32] flex flex-wrap items-center gap-2.5 bg-[#0D0F12]/60">
            <div className="relative flex-1 min-w-[180px]">
              <Search className="w-3.5 h-3.5 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={`Search filename, tags in ${activeFolder || "All Media"}...`}
                className="w-full h-9 rounded-lg bg-[#12151A] border border-[#252A32] pl-8 pr-3 text-xs text-[#F5F3EE] placeholder:text-[#666C75] focus:outline-none focus:border-[#D6B77A]"
              />
            </div>
            {activeTag && (
              <button
                type="button"
                onClick={() => setActiveTag("")}
                className="inline-flex items-center gap-1 h-9 px-2.5 rounded-lg bg-[#D6B77A]/15 border border-[#D6B77A]/40 text-xs text-[#D6B77A] cursor-pointer"
              >
                <Tag className="w-3 h-3" />
                <span>#{activeTag}</span>
                <X className="w-3 h-3" />
              </button>
            )}

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              aria-label="Filter media type"
              className="h-9 rounded-lg bg-[#12151A] border border-[#252A32] px-2.5 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
            >
              <option value="">All Types</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>

            <select
              value={activeFolder}
              onChange={(e) => setActiveFolder(e.target.value)}
              aria-label="Filter media folder"
              className="h-9 rounded-lg bg-[#12151A] border border-[#252A32] px-2.5 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
            >
              <option value="">All Folders</option>
              {folderDirectory.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "newest" | "oldest" | "largest")}
              aria-label="Sort assets"
              className="h-9 rounded-lg bg-[#12151A] border border-[#252A32] px-2.5 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="largest">Largest First</option>
            </select>

            <div className="inline-flex rounded-lg border border-[#252A32] bg-[#12151A] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                title="Grid view"
                className={cn(
                  "p-1.5 rounded-md cursor-pointer",
                  viewMode === "grid"
                    ? "bg-[#D6B77A] text-[#17130B]"
                    : "text-[#8F96A3] hover:text-[#F5F3EE]"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                title="List view"
                className={cn(
                  "p-1.5 rounded-md cursor-pointer",
                  viewMode === "list"
                    ? "bg-[#D6B77A] text-[#17130B]"
                    : "text-[#8F96A3] hover:text-[#F5F3EE]"
                )}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Grid / List Content */}
          <div className="p-3.5 min-h-[420px]">
            {loading ? (
              <div className="py-20 text-center text-sm text-[#8F96A3] flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#D6B77A]" />
                <span>Loading media library...</span>
              </div>
            ) : assets.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <p className="text-sm font-medium text-[#F5F3EE]">
                  No media assets found in {activeFolder || "this view"}.
                </p>
                <p className="text-xs text-[#777D87]">
                  Upload images, videos, or PDFs into this folder or clear your filters.
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {assets.map((asset) => {
                  const isChecked = selectedIds.includes(asset.id);
                  const isInspected = inspectedId === asset.id;

                  return (
                    <div
                      key={asset.id}
                      onClick={() => selectAssetForInspector(asset.id)}
                      className={cn(
                        "group rounded-xl bg-[#0D0F12] border overflow-hidden transition-colors cursor-pointer flex flex-col",
                        isInspected
                          ? "border-[#D6B77A] ring-1 ring-[#D6B77A]/30"
                          : "border-[#252A32] hover:border-[#3A414B]"
                      )}
                    >
                      <div className="aspect-[16/10] bg-[#08090B] relative overflow-hidden flex items-center justify-center">
                        {asset.resourceType === "image" ? (
                          <img
                            src={asset.secureUrl}
                            alt={asset.altText}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : asset.resourceType === "video" ? (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-[#15181F] text-[#E58A76] gap-1">
                            <Film className="w-7 h-7" />
                            <span className="text-[10px] font-mono uppercase">Video</span>
                          </div>
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center bg-[#15181F] text-[#F07878] gap-1">
                            <FileText className="w-7 h-7" />
                            <span className="text-[10px] font-mono uppercase">PDF / Doc</span>
                          </div>
                        )}

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(asset.id);
                          }}
                          title={isChecked ? "Deselect" : "Select"}
                          className={cn(
                            "absolute top-2 right-2 w-5 h-5 rounded-md flex items-center justify-center transition-opacity cursor-pointer",
                            isChecked
                              ? "bg-[#D6B77A] text-[#17130B] opacity-100"
                              : "bg-black/65 text-white border border-white/25 opacity-0 group-hover:opacity-100"
                          )}
                        >
                          {isChecked ? <Check className="w-3 h-3" /> : null}
                        </button>
                      </div>

                      <div className="p-2.5 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[#F5F3EE] truncate">
                            {getFileDisplayName(asset)}
                          </p>
                          <p className="text-[10px] text-[#777D87] truncate">
                            {formatBytes(asset.fileSizeBytes)}
                            {asset.width && asset.height
                              ? ` · ${asset.width}×${asset.height}`
                              : ` · ${asset.folder || "Website"}`}
                          </p>
                        </div>
                        <MoreHorizontal className="w-3.5 h-3.5 text-[#777D87] shrink-0" />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="divide-y divide-[#252A32]">
                {assets.map((asset) => {
                  const isChecked = selectedIds.includes(asset.id);
                  const isInspected = inspectedId === asset.id;
                  return (
                    <div
                      key={asset.id}
                      onClick={() => selectAssetForInspector(asset.id)}
                      className={cn(
                        "flex items-center justify-between gap-3 py-2.5 px-2 rounded-lg cursor-pointer transition-colors",
                        isInspected ? "bg-[#D6B77A]/10" : "hover:bg-[#191D23]/60"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSelect(asset.id);
                          }}
                          className="text-[#8F96A3] hover:text-[#D6B77A] cursor-pointer"
                        >
                          {isChecked ? (
                            <CheckSquare className="w-4 h-4 text-[#D6B77A]" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                        <div className="w-10 h-7 rounded bg-[#08090B] border border-[#252A32] overflow-hidden shrink-0 flex items-center justify-center">
                          {asset.resourceType === "image" ? (
                            <img
                              src={asset.secureUrl}
                              alt={asset.altText}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="w-3.5 h-3.5 text-[#8F96A3]" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-[#F5F3EE] truncate">
                            {getFileDisplayName(asset)}
                          </p>
                          <p className="text-[11px] text-[#777D87] truncate">
                            {asset.folder || "Website"} · {formatBytes(asset.fileSizeBytes)}
                          </p>
                        </div>
                      </div>
                      <span className="text-[11px] text-[#777D87] shrink-0">
                        {formatShortDate(asset.createdAt)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Bottom Bulk Selection Bar */}
          <div className="px-3.5 py-2.5 border-t border-[#252A32] bg-[#0D0F12]/80 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 text-xs text-[#8F96A3]">
              <button
                type="button"
                onClick={() => {
                  if (selectedIds.length === assets.length && assets.length > 0) {
                    setSelectedIds([]);
                  } else {
                    setSelectedIds(assets.map((a) => a.id));
                  }
                }}
                className="text-[#B2B4BA] hover:text-[#F5F3EE] cursor-pointer"
              >
                {selectedIds.length > 0 && selectedIds.length === assets.length ? (
                  <CheckSquare className="w-4 h-4 text-[#D6B77A]" />
                ) : (
                  <Square className="w-4 h-4" />
                )}
              </button>
              <span>
                {selectedIds.length} {selectedIds.length === 1 ? "item" : "items"} selected
                {selectedIds.length > 0 ? ` · ${formatBytes(selectedBytes)}` : ""}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={selectedIds.length === 0 || !canEdit}
                onClick={() => setBulkMoveOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#B2B4BA] hover:text-[#F5F3EE] disabled:opacity-40 cursor-pointer"
              >
                <Folder className="w-3.5 h-3.5" />
                <span>Move to Folder</span>
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0 || !canEdit}
                onClick={() => setBulkTagOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#B2B4BA] hover:text-[#F5F3EE] disabled:opacity-40 cursor-pointer"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Tag</span>
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0}
                onClick={handleBulkDownload}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#B2B4BA] hover:text-[#F5F3EE] disabled:opacity-40 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
              <button
                type="button"
                disabled={selectedIds.length === 0 || !canEdit || bulkWorking}
                onClick={() => handleBulkAction("delete")}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#F07878]/10 border border-[#F07878]/30 text-xs text-[#F07878] hover:bg-[#F07878]/20 disabled:opacity-40 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </section>

        {/* Right Asset Details Inspector */}
        <aside className="lg:col-span-3 rounded-2xl bg-[#12151A] border border-[#252A32] p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-sm font-semibold text-[#F5F3EE]">
              Asset Details
            </h2>
            {inspectedDetail && (
              <button
                type="button"
                onClick={() => {
                  setInspectedId(null);
                  setInspectedDetail(null);
                }}
                aria-label="Close asset details"
                className="p-1 rounded-md text-[#8F96A3] hover:text-[#F5F3EE] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {detailLoading ? (
            <div className="py-12 text-center text-xs text-[#8F96A3] flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-[#D6B77A]" />
              <span>Loading details...</span>
            </div>
          ) : !inspectedDetail ? (
            <div className="py-12 text-center space-y-2">
              <p className="text-xs text-[#8F96A3]">
                Select any asset from the grid to inspect metadata, tags, and CMS usage.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="aspect-[16/10] rounded-xl bg-[#08090B] border border-[#252A32] overflow-hidden flex items-center justify-center">
                {inspectedDetail.resourceType === "image" ? (
                  <img
                    src={inspectedDetail.secureUrl}
                    alt={inspectedDetail.altText}
                    className="w-full h-full object-cover"
                  />
                ) : inspectedDetail.resourceType === "video" ? (
                  <video
                    src={inspectedDetail.secureUrl}
                    controls
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-1.5 text-[#F07878]">
                    <FileText className="w-8 h-8" />
                    <span className="text-xs font-mono uppercase">
                      {inspectedDetail.mimeType}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <p className="text-sm font-semibold text-[#F5F3EE] break-all">
                  {getFileDisplayName(inspectedDetail)}
                </p>
                <p className="text-xs text-[#777D87]">
                  {formatBytes(inspectedDetail.fileSizeBytes)} ·{" "}
                  {inspectedDetail.mimeType.split("/")[1]?.toUpperCase() ||
                    inspectedDetail.resourceType.toUpperCase()}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <a
                  href={inspectedDetail.secureUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open file"
                  className="h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#3A414B] flex items-center justify-center text-[#B2B4BA] hover:text-[#F5F3EE]"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href={inspectedDetail.secureUrl}
                  download={getFileDisplayName(inspectedDetail)}
                  title="Download"
                  className="h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#3A414B] flex items-center justify-center text-[#B2B4BA] hover:text-[#F5F3EE]"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button
                  type="button"
                  onClick={() => copyUrl(inspectedDetail)}
                  title="Copy URL"
                  className="h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] hover:border-[#3A414B] flex items-center justify-center text-[#B2B4BA] hover:text-[#F5F3EE] cursor-pointer"
                >
                  {copiedId === inspectedDetail.id ? (
                    <Check className="w-3.5 h-3.5 text-[#73C794]" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => requestDeleteAsset(inspectedDetail)}
                    title="Delete asset"
                    className="h-9 rounded-lg bg-[#F07878]/10 border border-[#F07878]/30 hover:bg-[#F07878]/20 flex items-center justify-center text-[#F07878] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="pt-3 border-t border-[#252A32] space-y-2.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#777D87]">Dimensions</span>
                  <span className="text-[#F5F3EE] font-mono">
                    {inspectedDetail.width && inspectedDetail.height
                      ? `${inspectedDetail.width} × ${inspectedDetail.height}`
                      : "—"}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#777D87]">Uploaded</span>
                  <span className="text-[#B2B4BA]">
                    {formatShortDate(inspectedDetail.createdAt)}
                  </span>
                </div>
                <div className="space-y-1">
                  <label className="text-[#777D87] block">Folder</label>
                  <select
                    value={editFolder}
                    disabled={!canEdit}
                    onChange={(e) => setEditFolder(e.target.value)}
                    className="w-full h-8 rounded-lg bg-[#0D0F12] border border-[#252A32] px-2.5 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                  >
                    {folderDirectory.map((f) => (
                      <option key={f.name} value={f.name}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#777D87] block">Alt Text</label>
                  <input
                    type="text"
                    value={editAlt}
                    disabled={!canEdit}
                    onChange={(e) => setEditAlt(e.target.value)}
                    className="w-full h-8 rounded-lg bg-[#0D0F12] border border-[#252A32] px-2.5 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                  />
                </div>

                <div className="space-y-1.5">
                  <span className="text-[#777D87] block">Tags</span>
                  <div className="flex flex-wrap gap-1.5">
                    {editTags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#191D23] border border-[#252A32] text-[11px] text-[#B2B4BA]"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveTag(tag)}
                          title={`Filter by #${tag}`}
                          className="hover:text-[#D6B77A] cursor-pointer"
                        >
                          #{tag}
                        </button>
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() =>
                              setEditTags((prev) => prev.filter((item) => item !== tag))
                            }
                            className="text-[#777D87] hover:text-[#F07878] cursor-pointer"
                          >
                            <X className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </span>
                    ))}
                  </div>
                  {canEdit && (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={newTagInput}
                        onChange={(e) => setNewTagInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        placeholder="Add tag..."
                        className="flex-1 h-7 rounded-md bg-[#0D0F12] border border-[#252A32] px-2 text-[11px] text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-2 h-7 rounded-md bg-[#191D23] border border-[#252A32] text-[#D6B77A] hover:bg-[#222730] cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>

                {canEdit && (
                  <button
                    type="button"
                    disabled={savingDetail}
                    onClick={handleSaveDetail}
                    className="w-full h-8 rounded-lg bg-[#D6B77A] hover:bg-[#E2C58B] text-[#17130B] font-semibold text-xs inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {savingDetail ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Save className="w-3.5 h-3.5" />
                    )}
                    <span>Save Details</span>
                  </button>
                )}
              </div>

              <div className="pt-3 border-t border-[#252A32] space-y-2">
                <span className="text-xs font-medium text-[#F5F3EE] block">Usage</span>
                {inspectedDetail.usage && inspectedDetail.usage.length > 0 ? (
                  <div className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-2.5 space-y-2">
                    <p className="text-[11px] text-[#D6B77A] flex items-center gap-1.5">
                      <Link2 className="w-3 h-3" />
                      <span>
                        Used in {inspectedDetail.usage.length}{" "}
                        {inspectedDetail.usage.length === 1 ? "entry" : "entries"}
                      </span>
                    </p>
                    <ul className="space-y-1">
                      {inspectedDetail.usage.map((u) => (
                        <li key={`${u.kind}-${u.id}`}>
                          <Link
                            href={getUsageHref(u.kind)}
                            className="text-[11px] text-[#B2B4BA] hover:text-[#F5F3EE] flex items-center justify-between gap-2"
                          >
                            <span className="truncate">
                              <span className="text-[#73C794] mr-1">•</span>
                              {u.title}
                            </span>
                            <span className="text-[10px] text-[#777D87] shrink-0">
                              {u.kind}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-[11px] text-[#777D87]">
                    Not attached to any page, project, service, or blog post yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>

      {/* Create Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                Create Media Folder
              </h2>
              <button
                type="button"
                onClick={() => setShowFolderModal(false)}
                className="text-[#8F96A3] hover:text-[#F5F3EE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                required
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="e.g. Brand Assets / Logos"
                className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-3.5 py-2 rounded-lg text-xs text-[#B2B4BA] hover:text-[#F5F3EE] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D6B77A] text-xs font-semibold text-[#17130B] cursor-pointer"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* External URL Modal */}
      {showExternalModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#12151A] border border-[#252A32] p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-lg text-[#F5F3EE]">
                Register External Asset URL
              </h2>
              <button
                type="button"
                onClick={() => setShowExternalModal(false)}
                className="text-[#8F96A3] hover:text-[#F5F3EE] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleRegisterExternal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                  Image / Asset URL *
                </label>
                <input
                  type="url"
                  required
                  value={externalUrl}
                  onChange={(e) => setExternalUrl(e.target.value)}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                  Folder
                </label>
                <select
                  value={externalFolder}
                  onChange={(e) => setExternalFolder(e.target.value)}
                  className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                >
                  {folderDirectory.map((f) => (
                    <option key={f.name} value={f.name}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                  Alt Text *
                </label>
                <input
                  type="text"
                  required
                  value={externalAlt}
                  onChange={(e) => setExternalAlt(e.target.value)}
                  placeholder="Descriptive alt text"
                  className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#B2B4BA] mb-1.5">
                  Caption (optional)
                </label>
                <input
                  type="text"
                  value={externalCaption}
                  onChange={(e) => setExternalCaption(e.target.value)}
                  className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExternalModal(false)}
                  className="px-4 py-2 rounded-lg text-xs font-medium text-[#B2B4BA] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#D6B77A] text-xs font-semibold text-[#17130B] cursor-pointer"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Move Folder Modal */}
      {bulkMoveOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
            <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
              Move {selectedIds.length} items to Folder
            </h2>
            <select
              value={bulkMoveFolder}
              onChange={(e) => setBulkMoveFolder(e.target.value)}
              className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
            >
              {folderDirectory.map((f) => (
                <option key={f.name} value={f.name}>
                  {f.name}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBulkMoveOpen(false)}
                className="px-3.5 py-2 rounded-lg text-xs text-[#B2B4BA] hover:text-[#F5F3EE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={bulkWorking}
                onClick={() => handleBulkAction("move_folder", { folder: bulkMoveFolder })}
                className="px-4 py-2 rounded-lg bg-[#D6B77A] text-xs font-semibold text-[#17130B] cursor-pointer"
              >
                Move Items
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Add Tag Modal */}
      {bulkTagOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-[#12151A] border border-[#252A32] p-5 space-y-4">
            <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
              Add Tag to {selectedIds.length} items
            </h2>
            <input
              type="text"
              value={bulkTagValue}
              onChange={(e) => setBulkTagValue(e.target.value)}
              placeholder="e.g. hero, portfolio, webp"
              className="w-full h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setBulkTagOpen(false)}
                className="px-3.5 py-2 rounded-lg text-xs text-[#B2B4BA] hover:text-[#F5F3EE] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={bulkWorking || !bulkTagValue.trim()}
                onClick={() => handleBulkAction("add_tag", { tag: bulkTagValue.trim().toLowerCase() })}
                className="px-4 py-2 rounded-lg bg-[#D6B77A] text-xs font-semibold text-[#17130B] cursor-pointer disabled:opacity-50"
              >
                Apply Tag
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Referenced Usage Delete Confirmation / Warning Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#12151A] border border-[#252A32] p-6 space-y-4 shadow-2xl">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F07878]/15 border border-[#F07878]/30 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-4 h-4 text-[#F07878]" />
              </div>
              <div className="space-y-1">
                <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                  {deleteTarget.usage && deleteTarget.usage.length > 0
                    ? "Asset In Use — Deletion Blocked"
                    : "Confirm Asset Deletion"}
                </h2>
                <p className="text-xs text-[#8F96A3]">
                  {getFileDisplayName(deleteTarget)}
                </p>
              </div>
            </div>

            {deleteTarget.usage && deleteTarget.usage.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-[#F07878] leading-relaxed">
                  This asset is currently referenced by {deleteTarget.usage.length}{" "}
                  {deleteTarget.usage.length === 1 ? "entry" : "entries"} on your website. Detach it from those entries before deleting:
                </p>
                <div className="rounded-xl bg-[#0D0F12] border border-[#252A32] p-3 space-y-1.5 max-h-40 overflow-y-auto">
                  {deleteTarget.usage.map((u) => (
                    <Link
                      key={`${u.kind}-${u.id}`}
                      href={getUsageHref(u.kind)}
                      className="flex items-center justify-between text-xs text-[#B2B4BA] hover:text-[#D6B77A]"
                    >
                      <span className="truncate">{u.title}</span>
                      <span className="text-[10px] font-mono text-[#777D87] shrink-0">
                        {u.kind}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 rounded-lg bg-[#D6B77A] text-xs font-semibold text-[#17130B] cursor-pointer"
                  >
                    Understood
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-[#B2B4BA] leading-relaxed">
                  No pages, portfolio projects, services, or blog posts reference this asset. Deleting it removes it permanently from your Media Library.
                </p>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(null)}
                    className="px-3.5 py-2 rounded-lg text-xs text-[#B2B4BA] hover:text-[#F5F3EE] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={deletingAsset}
                    onClick={confirmDeleteAsset}
                    className="px-4 py-2 rounded-lg bg-[#F07878] text-[#08090B] text-xs font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {deletingAsset ? "Deleting..." : "Delete Asset"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
