"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  FileText,
  CheckCircle2,
  Edit3,
  Eye,
  Home,
  LayoutGrid,
  List,
  Shield,
  MoreHorizontal,
  X,
  Image as ImageIcon,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "./AdminContext";
import { MediaPickerModal, type MediaAssetItem } from "./MediaPickerModal";

type PageStatus = "draft" | "published" | "archived";
type PageType = "home" | "static" | "listing" | "legal";

interface CmsPageRow {
  id: string;
  title: string;
  subtitle: string;
  slug: string;
  pageType: PageType;
  thumbnailAssetId: string | null;
  thumbnailUrl: string | null;
  status: PageStatus;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
  displayOrder: number;
  updatedAt: string;
}

interface PagesStats {
  totalAll: number;
  publishedCount: number;
  draftCount: number;
  latestUpdatedAt: string | null;
  latestTitles: string[];
}

interface PageFormState {
  id?: string;
  title: string;
  subtitle: string;
  slug: string;
  pageType: PageType;
  thumbnailAssetId: string | null;
  thumbnailUrl: string | null;
  bodyMarkdown: string;
  status: PageStatus;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  noIndex: boolean;
  displayOrder: number;
}

const TYPE_META: Record<PageType, { label: string; icon: React.ElementType }> = {
  home: { label: "Home", icon: Home },
  static: { label: "Static", icon: FileText },
  listing: { label: "Listing", icon: LayoutGrid },
  legal: { label: "Legal", icon: Shield },
};

function formatDateLines(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    }),
  };
}

function slugifyPath(val: string): string {
  const cleaned = val
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9/-\s]+/g, "")
    .replace(/\s+/g, "-");
  if (!cleaned || cleaned === "/") return "/";
  return cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
}

export function AdminPagesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { canEdit, isAdmin } = useAdminUser();

  const [pages, setPages] = useState<CmsPageRow[]>([]);
  const [stats, setStats] = useState<PagesStats>({
    totalAll: 0,
    publishedCount: 0,
    draftCount: 0,
    latestUpdatedAt: null,
    latestTitles: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [pageNum, setPageNum] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<PageFormState | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const fetchPages = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(pageNum),
      limit: String(rowsPerPage),
    });
    if (query.trim()) params.set("q", query.trim());
    if (statusFilter) params.set("status", statusFilter);
    if (typeFilter) params.set("type", typeFilter);

    const res = await fetch(`/api/v1/admin/pages?${params.toString()}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Unable to fetch pages.");
    return json;
  }, [pageNum, rowsPerPage, query, statusFilter, typeFilter, router]);

  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      const json = await fetchPages();
      if (json) {
        setPages(json.data || []);
        setTotalFiltered(json.meta?.total ?? 0);
        setTotalPages(json.meta?.totalPages ?? 1);
        if (json.meta?.stats) setStats(json.meta.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load pages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchPages()
      .then((json) => {
        if (!ignore && json) {
          setPages(json.data || []);
          setTotalFiltered(json.meta?.total ?? 0);
          setTotalPages(json.meta?.totalPages ?? 1);
          if (json.meta?.stats) setStats(json.meta.stats);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Network error loading pages."
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [fetchPages]);

  const fetchPageById = useCallback(async (id: string): Promise<PageFormState> => {
    const res = await fetch(`/api/v1/admin/pages/${id}`);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Unable to load page details.");
    }
    const d = json.data;
    return {
      id: d.id,
      title: d.title,
      subtitle: d.subtitle || "",
      slug: d.slug,
      pageType: d.pageType || "static",
      thumbnailAssetId: d.thumbnailAssetId || null,
      thumbnailUrl: d.thumbnailAsset?.secureUrl || null,
      bodyMarkdown: d.bodyMarkdown || "",
      status: d.status || "draft",
      seoTitle: d.seoTitle || "",
      seoDescription: d.seoDescription || "",
      canonicalUrl: d.canonicalUrl || "",
      noIndex: Boolean(d.noIndex),
      displayOrder: d.displayOrder ?? 0,
    };
  }, []);

  useEffect(() => {
    const editId = searchParams.get("edit");
    const createFlag = searchParams.get("create");
    let ignore = false;

    if (editId) {
      fetchPageById(editId)
        .then((mapped) => {
          if (!ignore) {
            setForm(mapped);
            setEditorOpen(true);
            setOpenMenuId(null);
          }
        })
        .catch((err) => {
          if (!ignore) {
            setError(
              err instanceof Error ? err.message : "Network error loading page."
            );
          }
        });
    } else if (createFlag === "1" && !editorOpen) {
      Promise.resolve().then(() => {
        if (!ignore) {
          setForm({
            title: "",
            subtitle: "",
            slug: "",
            pageType: "static",
            thumbnailAssetId: null,
            thumbnailUrl: null,
            bodyMarkdown: "",
            status: "draft",
            seoTitle: "",
            seoDescription: "",
            canonicalUrl: "",
            noIndex: false,
            displayOrder: 1,
          });
          setEditorOpen(true);
        }
      });
    }

    return () => {
      ignore = true;
    };
  }, [searchParams, editorOpen, fetchPageById]);

  const openCreateModal = () => {
    setForm({
      title: "",
      subtitle: "",
      slug: "",
      pageType: "static",
      thumbnailAssetId: null,
      thumbnailUrl: null,
      bodyMarkdown: "",
      status: "draft",
      seoTitle: "",
      seoDescription: "",
      canonicalUrl: "",
      noIndex: false,
      displayOrder: stats.totalAll + 1,
    });
    setEditorOpen(true);
  };

  const openEditModal = async (id: string) => {
    setError("");
    try {
      const mapped = await fetchPageById(id);
      setForm(mapped);
      setEditorOpen(true);
      setOpenMenuId(null);
    } catch {
      setError("Network error loading page record.");
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = form.id
        ? `/api/v1/admin/pages/${form.id}`
        : "/api/v1/admin/pages";
      const method = form.id ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          subtitle: form.subtitle,
          slug: form.slug,
          pageType: form.pageType,
          thumbnailAssetId: form.thumbnailAssetId,
          bodyMarkdown: form.bodyMarkdown,
          status: form.status,
          seoTitle: form.seoTitle || null,
          seoDescription: form.seoDescription || null,
          canonicalUrl: form.canonicalUrl || form.slug,
          noIndex: form.noIndex,
          displayOrder: form.displayOrder,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to save page.");
        return;
      }

      setEditorOpen(false);
      setSuccess(form.id ? "Page updated successfully." : "New page created.");
      await reload();
    } catch {
      setError("Network error saving page.");
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = async (row: CmsPageRow, nextStatus: PageStatus) => {
    setError("");
    setSuccess("");
    setOpenMenuId(null);
    try {
      const res = await fetch(`/api/v1/admin/pages/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: row.title,
          subtitle: row.subtitle,
          slug: row.slug,
          pageType: row.pageType,
          thumbnailAssetId: row.thumbnailAssetId,
          bodyMarkdown: "",
          status: nextStatus,
          seoTitle: row.seoTitle,
          seoDescription: row.seoDescription,
          canonicalUrl: row.canonicalUrl,
          noIndex: row.noIndex,
          displayOrder: row.displayOrder,
        }),
      });
      if (!res.ok) {
        const json = await res.json();
        setError(json.message || "Unable to update page status.");
        return;
      }
      setSuccess(`Set "${row.title}" status to ${nextStatus}.`);
      await reload();
    } catch {
      setError("Network error updating page status.");
    }
  };

  const handleDelete = async (row: CmsPageRow) => {
    if (!window.confirm(`Delete page "${row.title}" (${row.slug})?`)) return;
    setError("");
    setOpenMenuId(null);
    try {
      const res = await fetch(`/api/v1/admin/pages/${row.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to delete page.");
        return;
      }
      setSuccess(`Deleted page "${row.title}".`);
      await reload();
    } catch {
      setError("Network error deleting page.");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === pages.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(pages.map((p) => p.id));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const startIdx = totalFiltered === 0 ? 0 : (pageNum - 1) * rowsPerPage + 1;
  const endIdx = Math.min(pageNum * rowsPerPage, totalFiltered);

  const lastUpdatedLabel = stats.latestUpdatedAt
    ? new Date(stats.latestUpdatedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-[28px] tracking-tight text-[#F5F3EE]">
            Pages
          </h1>
          <p className="text-sm text-[#8D939E]">
            Manage your website pages, content, and publication status.
          </p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create Page</span>
          </button>
        )}
      </div>

      {/* 4-Card KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF]">
            <span className="p-2 rounded-lg bg-[#1A160E] border border-[#D6B77A]/30 text-[#D6B77A]">
              <FileText className="w-4 h-4" />
            </span>
            <span>Total Pages</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats.totalAll}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF]">
            <span className="p-2 rounded-lg bg-[#112419] border border-[#54C99A]/30 text-[#54C99A]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <span>Published</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats.publishedCount}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF]">
            <span className="p-2 rounded-lg bg-[#1D1629] border border-[#B5A0F5]/30 text-[#B5A0F5]">
              <Edit3 className="w-4 h-4" />
            </span>
            <span>Drafts</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats.draftCount}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF]">
            <span className="p-2 rounded-lg bg-[#1A160E] border border-[#D6B77A]/30 text-[#D6B77A]">
              <Eye className="w-4 h-4" />
            </span>
            <span>Last Updated</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F3EE]">
            {loading ? "—" : lastUpdatedLabel}
          </div>
          <div className="text-[11px] text-[#777D87] truncate">
            {stats.latestTitles.length > 0
              ? stats.latestTitles.join(", ")
              : "No recent edits"}
          </div>
        </div>
      </div>

      {/* Filters & View Mode Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[260px]">
          <div className="relative flex-1 max-w-sm min-w-[200px]">
            <Search className="w-4 h-4 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPageNum(1);
              }}
              placeholder="Search pages..."
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#111419] border border-[#1E222A] text-sm text-[#F5F3EE] placeholder-[#6D7480] focus:outline-none focus:border-[#D6B77A]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPageNum(1);
            }}
            aria-label="Filter pages by status"
            className="h-10 px-3 rounded-lg bg-[#111419] border border-[#1E222A] text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPageNum(1);
            }}
            aria-label="Filter pages by type"
            className="h-10 px-3 rounded-lg bg-[#111419] border border-[#1E222A] text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
          >
            <option value="">All Types</option>
            <option value="home">Home</option>
            <option value="static">Static</option>
            <option value="listing">Listing</option>
            <option value="legal">Legal</option>
          </select>
        </div>

        {/* View Toggle */}
        <div className="inline-flex items-center p-1 rounded-lg bg-[#111419] border border-[#1E222A]">
          <button
            type="button"
            onClick={() => setViewMode("list")}
            aria-label="List view"
            className={cn(
              "p-2 rounded-md transition-colors cursor-pointer",
              viewMode === "list"
                ? "bg-[#D6B77A] text-[#08090B]"
                : "text-[#8D939E] hover:text-white"
            )}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            className={cn(
              "p-2 rounded-md transition-colors cursor-pointer",
              viewMode === "grid"
                ? "bg-[#D6B77A] text-[#08090B]"
                : "text-[#8D939E] hover:text-white"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
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

      {/* List View Table */}
      {viewMode === "list" ? (
        <div className="rounded-xl bg-[#111419] border border-[#1E222A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E222A] text-[11px] font-mono uppercase tracking-wider text-[#6D7480] bg-[#0B0D10]">
                  <th className="py-3.5 pl-4 pr-2 w-10">
                    <input
                      type="checkbox"
                      checked={
                        pages.length > 0 && selectedIds.length === pages.length
                      }
                      onChange={toggleSelectAll}
                      aria-label="Select all pages"
                      className="rounded border-[#323946] bg-[#0B0D10]"
                    />
                  </th>
                  <th className="py-3.5 px-3">Page Title</th>
                  <th className="py-3.5 px-4">URL Slug</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Last Updated</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E222A] text-sm">
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-10 text-center text-xs font-mono text-[#777D87]"
                    >
                      Loading pages...
                    </td>
                  </tr>
                ) : pages.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-10 text-center text-xs text-[#777D87]"
                    >
                      No pages match your current filters.
                    </td>
                  </tr>
                ) : (
                  pages.map((row) => {
                    const typeMeta = TYPE_META[row.pageType] || TYPE_META.static;
                    const TypeIcon = typeMeta.icon;
                    const formatted = formatDateLines(row.updatedAt);

                    return (
                      <tr
                        key={row.id}
                        className="hover:bg-[#151920] transition-colors"
                      >
                        <td className="py-3.5 pl-4 pr-2">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(row.id)}
                            onChange={() => toggleRow(row.id)}
                            aria-label={`Select ${row.title}`}
                            className="rounded border-[#323946] bg-[#0B0D10]"
                          />
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="flex items-center gap-3.5">
                            {row.thumbnailUrl ? (
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={row.thumbnailUrl}
                                alt={row.title}
                                className="w-14 h-9 rounded-lg object-cover border border-[#252A32] shrink-0"
                              />
                            ) : (
                              <div className="w-14 h-9 rounded-lg bg-gradient-to-br from-[#231D13] via-[#15181F] to-[#0B0D10] border border-[#252A32] flex items-center justify-center shrink-0">
                                <TypeIcon className="w-4 h-4 text-[#D6B77A]/75" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="font-semibold text-[#F5F3EE] truncate">
                                {row.title}
                              </div>
                              <div className="text-xs text-[#777D87] truncate max-w-[260px]">
                                {row.subtitle || "Website page"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-[#B2B4BA]">
                          {row.slug}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161920] border border-[#252A32] text-xs text-[#B2B4BA]">
                            <TypeIcon className="w-3.5 h-3.5 text-[#8D939E]" />
                            <span>{typeMeta.label}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
                              row.status === "published"
                                ? "bg-[#54C99A]/12 text-[#7CD69F] border-[#54C99A]/30"
                                : row.status === "draft"
                                  ? "bg-[#D6B77A]/12 text-[#D6B77A] border-[#D6B77A]/30"
                                  : "bg-[#181C24] text-[#9CA3AF] border-[#252A32]"
                            )}
                          >
                            <span
                              className={cn(
                                "w-1.5 h-1.5 rounded-full",
                                row.status === "published"
                                  ? "bg-[#7CD69F]"
                                  : row.status === "draft"
                                    ? "bg-[#D6B77A]"
                                    : "bg-[#9CA3AF]"
                              )}
                            />
                            <span className="capitalize">{row.status}</span>
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-xs whitespace-nowrap">
                          <div className="text-[#F5F3EE]">{formatted.date}</div>
                          <div className="text-[11px] text-[#6D7480]">
                            {formatted.time}
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right relative">
                          <div className="inline-flex items-center gap-1.5">
                            <Link
                              href={row.slug}
                              target="_blank"
                              aria-label={`Preview ${row.title}`}
                              className="p-1.5 rounded-md text-[#8D939E] hover:text-[#F5F3EE] hover:bg-[#191D24]"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() => openEditModal(row.id)}
                                aria-label={`Edit ${row.title}`}
                                className="p-1.5 rounded-md text-[#8D939E] hover:text-[#D6B77A] hover:bg-[#191D24] cursor-pointer"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                            )}
                            {canEdit && (
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenMenuId(
                                    openMenuId === row.id ? null : row.id
                                  )
                                }
                                aria-label={`More actions for ${row.title}`}
                                className="p-1.5 rounded-md text-[#8D939E] hover:text-white hover:bg-[#191D24] cursor-pointer"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {openMenuId === row.id && (
                            <div className="absolute right-4 top-12 z-30 w-44 py-1.5 rounded-xl bg-[#14181F] border border-[#252A32] shadow-2xl text-left text-xs">
                              <button
                                type="button"
                                onClick={() => openEditModal(row.id)}
                                className="w-full px-3.5 py-2 text-[#F5F3EE] hover:bg-[#1C212B] flex items-center gap-2 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Edit Page</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  toggleStatus(
                                    row,
                                    row.status === "published"
                                      ? "draft"
                                      : "published"
                                  )
                                }
                                className="w-full px-3.5 py-2 text-[#D6B77A] hover:bg-[#1C212B] flex items-center gap-2 cursor-pointer"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>
                                  {row.status === "published"
                                    ? "Move to Draft"
                                    : "Publish Page"}
                                </span>
                              </button>
                              {isAdmin && row.slug !== "/" && (
                                <button
                                  type="button"
                                  onClick={() => handleDelete(row)}
                                  className="w-full px-3.5 py-2 text-[#F28B82] hover:bg-[#2A1414] flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Page</span>
                                </button>
                              )}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination Footer */}
          <div className="px-4 py-3 border-t border-[#1E222A] bg-[#0B0D10] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8D939E]">
            <div>
              Showing {startIdx}–{endIdx} of {totalFiltered} pages
            </div>

            <div className="flex items-center gap-4">
              <label className="inline-flex items-center gap-2">
                <span>Rows per page</span>
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    setRowsPerPage(Number(e.target.value));
                    setPageNum(1);
                  }}
                  className="h-8 px-2 rounded bg-[#111419] border border-[#1E222A] text-xs text-[#F5F3EE]"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </label>

              <div className="inline-flex items-center gap-1">
                <button
                  type="button"
                  disabled={pageNum <= 1}
                  onClick={() => setPageNum((p) => Math.max(1, p - 1))}
                  className="w-8 h-8 rounded-md bg-[#111419] border border-[#1E222A] flex items-center justify-center disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 h-8 rounded-md bg-[#D6B77A] text-[#08090B] font-semibold flex items-center justify-center">
                  {pageNum}
                </span>
                <button
                  type="button"
                  disabled={pageNum >= totalPages}
                  onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}
                  className="w-8 h-8 rounded-md bg-[#111419] border border-[#1E222A] flex items-center justify-center disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {pages.map((row) => {
            const typeMeta = TYPE_META[row.pageType] || TYPE_META.static;
            const TypeIcon = typeMeta.icon;
            return (
              <div
                key={row.id}
                className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] hover:border-[#D6B77A]/40 transition-colors flex flex-col justify-between gap-4"
              >
                <div className="space-y-3">
                  {row.thumbnailUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={row.thumbnailUrl}
                      alt={row.title}
                      className="w-full aspect-video rounded-lg object-cover border border-[#252A32]"
                    />
                  ) : (
                    <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-[#231D13] via-[#15181F] to-[#0B0D10] border border-[#252A32] flex items-center justify-center">
                      <TypeIcon className="w-7 h-7 text-[#D6B77A]/70" />
                    </div>
                  )}
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-heading font-semibold text-base text-[#F5F3EE] truncate">
                        {row.title}
                      </h3>
                      <span className="text-[11px] font-mono text-[#D6B77A]">
                        {row.slug}
                      </span>
                    </div>
                    <p className="text-xs text-[#777D87] mt-1 line-clamp-2">
                      {row.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1E222A]">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
                      row.status === "published"
                        ? "bg-[#54C99A]/12 text-[#7CD69F] border-[#54C99A]/30"
                        : "bg-[#D6B77A]/12 text-[#D6B77A] border-[#D6B77A]/30"
                    )}
                  >
                    {row.status}
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={row.slug}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs text-[#8D939E] hover:text-white"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => openEditModal(row.id)}
                        className="px-2.5 py-1 rounded-md bg-[#191D23] text-xs text-[#F5F3EE] hover:text-[#D6B77A] cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Page Modal */}
      {editorOpen && form && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#12151A] border border-[#252A32] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#252A32] flex items-center justify-between">
              <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
                {form.id ? `Edit Page — ${form.title}` : "Create New Page"}
              </h2>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="text-[#777D87] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="flex-1 overflow-y-auto p-6 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">
                    Page Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => {
                      const next = e.target.value;
                      setForm({
                        ...form,
                        title: next,
                        slug: form.id ? form.slug : slugifyPath(next),
                      });
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">
                    URL Slug * (starts with /)
                  </label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) =>
                      setForm({ ...form, slug: slugifyPath(e.target.value) })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm font-mono text-[#F5F3EE]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#B2B4BA]">
                  Subtitle / Summary
                </label>
                <input
                  type="text"
                  value={form.subtitle}
                  onChange={(e) =>
                    setForm({ ...form, subtitle: e.target.value })
                  }
                  placeholder="Short description shown under page title"
                  className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">
                    Page Type
                  </label>
                  <select
                    value={form.pageType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        pageType: e.target.value as PageType,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                  >
                    <option value="home">Home</option>
                    <option value="static">Static</option>
                    <option value="listing">Listing</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as PageStatus,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPickerOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 h-10 rounded-lg bg-[#191D23] border border-[#252A32] text-xs cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>
                      {form.thumbnailUrl ? "Change Thumbnail" : "Thumbnail"}
                    </span>
                  </button>
                  {form.thumbnailAssetId && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          thumbnailAssetId: null,
                          thumbnailUrl: null,
                        })
                      }
                      className="text-xs text-[#F28B82] cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#B2B4BA]">
                  Page Content Notes / Markdown
                </label>
                <textarea
                  rows={4}
                  value={form.bodyMarkdown}
                  onChange={(e) =>
                    setForm({ ...form, bodyMarkdown: e.target.value })
                  }
                  placeholder="Optional editorial notes or page copy..."
                  className="w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm font-mono text-[#F5F3EE]"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] space-y-3">
                <div className="text-xs font-mono uppercase text-[#D6B77A]">
                  SEO &amp; Canonical Metadata
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={form.seoTitle}
                    onChange={(e) =>
                      setForm({ ...form, seoTitle: e.target.value })
                    }
                    placeholder="Meta Title"
                    className="h-9 px-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                  />
                  <input
                    type="text"
                    value={form.canonicalUrl}
                    onChange={(e) =>
                      setForm({ ...form, canonicalUrl: e.target.value })
                    }
                    placeholder="Canonical Path (e.g. /about)"
                    className="h-9 px-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs font-mono text-[#F5F3EE]"
                  />
                </div>
                <textarea
                  rows={2}
                  value={form.seoDescription}
                  onChange={(e) =>
                    setForm({ ...form, seoDescription: e.target.value })
                  }
                  placeholder="Meta Description"
                  className="w-full p-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                />
                <label className="inline-flex items-center gap-2 text-xs text-[#B2B4BA] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.noIndex}
                    onChange={(e) =>
                      setForm({ ...form, noIndex: e.target.checked })
                    }
                  />
                  <span>Exclude from indexing (noindex)</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#252A32]">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 text-xs text-[#B2B4BA] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold cursor-pointer"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{form.id ? "Save Page" : "Create Page"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <MediaPickerModal
        open={pickerOpen}
        title="Select Page Thumbnail"
        selectedId={form?.thumbnailAssetId}
        onClose={() => setPickerOpen(false)}
        onSelectSingle={(asset: MediaAssetItem) =>
          setForm((prev) =>
            prev
              ? {
                  ...prev,
                  thumbnailAssetId: asset.id,
                  thumbnailUrl: asset.secureUrl,
                }
              : prev
          )
        }
      />
    </div>
  );
}
