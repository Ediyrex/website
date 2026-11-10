"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bold,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Code,
  Edit3,
  ExternalLink,
  Eye,
  FileText,
  FolderPlus,
  Heading2,
  Heading3,
  Image as ImageIcon,
  Italic,
  LayoutGrid,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Megaphone,
  MoreHorizontal,
  Plus,
  Quote,
  Search,
  Sparkles,
  Tag,
  Trash2,
  TrendingUp,
  User,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "./AdminContext";
import { MediaPickerModal, type MediaAssetItem } from "./MediaPickerModal";

interface BlogCategoryStat {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  count: number;
}

interface BlogAuthorOption {
  id: string;
  displayName: string;
}

interface BlogPostRow {
  id: string;
  title: string;
  subtitle: string | null;
  slug: string;
  contentType: "post" | "insight" | "announcement";
  excerpt: string;
  tags: string[];
  isFeatured: boolean;
  coverAssetId: string | null;
  coverAssetUrl: string | null;
  authorUserId: string | null;
  authorName: string | null;
  authorBio: string | null;
  categories: { id: string; name: string; slug: string }[];
  status: "draft" | "published" | "archived";
  scheduledFor: string | null;
  publishedAt: string | null;
  updatedAt: string;
}

interface BlogStats {
  totalAll: number;
  publishedCount: number;
  draftCount: number;
  scheduledCount: number;
  insightsCount: number;
  announcementsCount: number;
  archivedCount: number;
  publishedLast30Count: number;
  categories: BlogCategoryStat[];
  authors: BlogAuthorOption[];
  allTags: string[];
  topInsights: {
    id: string;
    title: string;
    slug: string;
    contentType: string;
    isFeatured: boolean;
    publishedAt: string | null;
    updatedAt: string;
  }[];
  recentDrafts: {
    id: string;
    title: string;
    slug: string;
    coverAssetUrl: string | null;
    scheduledFor: string | null;
    updatedAt: string;
  }[];
}

interface BlogFormState {
  id?: string;
  title: string;
  subtitle: string;
  slug: string;
  contentType: "post" | "insight" | "announcement";
  excerpt: string;
  bodyMarkdown: string;
  tags: string[];
  authorUserId: string | null;
  authorBio: string;
  isFeatured: boolean;
  coverAssetId: string | null;
  coverAssetUrl: string | null;
  categoryIds: string[];
  status: "draft" | "published" | "archived";
  scheduledFor: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}

type BlogTab =
  | "all"
  | "published"
  | "draft"
  | "scheduled"
  | "insight"
  | "announcement";

const CATEGORY_DOT_COLORS = [
  "bg-[#73C794]",
  "bg-[#D6B77A]",
  "bg-[#7BA9F5]",
  "bg-[#E5E2DC]",
  "bg-[#E58A76]",
  "bg-[#B5A0F5]",
];

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function toLocalDateTimeInput(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function MarkdownPreviewRenderer({ markdown }: { markdown: string }) {
  const lines = markdown.split("\n");
  return (
    <div className="space-y-3 text-sm text-[#D6D8DE] leading-relaxed">
      {lines.map((raw, idx) => {
        const line = raw.trimEnd();
        if (!line) return <div key={idx} className="h-2" />;
        if (line.startsWith("### ")) {
          return (
            <h3
              key={idx}
              className="font-heading text-lg font-semibold text-[#F5F3EE] pt-2"
            >
              {line.slice(4)}
            </h3>
          );
        }
        if (line.startsWith("## ")) {
          return (
            <h2
              key={idx}
              className="font-heading text-xl font-bold text-[#F5F3EE] pt-3"
            >
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith("> ")) {
          return (
            <blockquote
              key={idx}
              className="border-l-2 border-[#D6B77A] pl-4 py-1 italic text-[#B2B4BA] bg-[#0D0F12]/60 rounded-r-lg"
            >
              {line.slice(2)}
            </blockquote>
          );
        }
        if (line.startsWith("- ") || line.startsWith("* ")) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2">
              <span className="text-[#D6B77A] mt-0.5">•</span>
              <span>{line.slice(2)}</span>
            </div>
          );
        }
        const imgMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
        if (imgMatch) {
          return (
            <div key={idx} className="my-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imgMatch[2]}
                alt={imgMatch[1] || "Inserted editorial visual"}
                className="w-full max-h-72 object-cover rounded-xl border border-[#252A32]"
              />
              {imgMatch[1] && (
                <p className="text-[11px] text-[#777D87] mt-1">{imgMatch[1]}</p>
              )}
            </div>
          );
        }
        return <p key={idx}>{line}</p>;
      })}
    </div>
  );
}

export function AdminBlogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { canEdit } = useAdminUser();
  const bodyTextareaRef = useRef<HTMLTextAreaElement | null>(null);

  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [stats, setStats] = useState<BlogStats>({
    totalAll: 0,
    publishedCount: 0,
    draftCount: 0,
    scheduledCount: 0,
    insightsCount: 0,
    announcementsCount: 0,
    archivedCount: 0,
    publishedLast30Count: 0,
    categories: [],
    authors: [],
    allTags: [],
    topInsights: [],
    recentDrafts: [],
  });

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BlogTab>("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [authorFilter, setAuthorFilter] = useState("");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [pageNum, setPageNum] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Dedicated Editorial Writer
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorMode, setEditorMode] = useState<"write" | "split" | "preview">("split");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BlogFormState | null>(null);
  const [tagDraft, setTagDraft] = useState("");
  const [pickerTarget, setPickerTarget] = useState<"cover" | "inline" | null>(null);

  // Preview modal
  const [previewPost, setPreviewPost] = useState<BlogFormState | null>(null);

  // Category Management modal (create + edit + delete)
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [savingCat, setSavingCat] = useState(false);

  const fetchBlogData = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(pageNum),
      limit: String(rowsPerPage),
    });
    if (activeTab === "published" || activeTab === "draft") {
      params.set("status", activeTab);
    } else if (activeTab === "scheduled") {
      params.set("scheduled", "1");
    } else if (activeTab === "insight" || activeTab === "announcement") {
      params.set("type", activeTab);
    }
    if (categoryFilter) params.set("category", categoryFilter);
    if (tagFilter) params.set("tag", tagFilter);
    if (authorFilter) params.set("author", authorFilter);
    if (query.trim()) params.set("q", query.trim());

    const res = await fetch(`/api/v1/admin/blog?${params.toString()}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Unable to fetch blog posts.");
    }
    return {
      items: (json.data || []) as BlogPostRow[],
      total: (json.meta?.total ?? 0) as number,
      totalPages: (json.meta?.totalPages ?? 1) as number,
      stats: (json.meta?.stats || null) as BlogStats | null,
    };
  }, [
    activeTab,
    authorFilter,
    categoryFilter,
    pageNum,
    query,
    router,
    rowsPerPage,
    tagFilter,
  ]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchBlogData();
      if (result) {
        setPosts(result.items);
        setTotalFiltered(result.total);
        setTotalPages(result.totalPages);
        if (result.stats) setStats(result.stats);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error loading blog CMS.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchBlogData()
      .then((result) => {
        if (!ignore && result) {
          setPosts(result.items);
          setTotalFiltered(result.total);
          setTotalPages(result.totalPages);
          if (result.stats) setStats(result.stats);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Network error loading blog CMS.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fetchBlogData]);

  const openCreateModal = useCallback(() => {
    setForm({
      title: "",
      subtitle: "",
      slug: "",
      contentType: "post",
      excerpt: "",
      bodyMarkdown: "",
      tags: [],
      authorUserId: stats.authors[0]?.id ?? null,
      authorBio: "",
      isFeatured: false,
      coverAssetId: null,
      coverAssetUrl: null,
      categoryIds: [],
      status: "draft",
      scheduledFor: "",
      seoTitle: "",
      seoDescription: "",
      canonicalUrl: "",
    });
    setTagDraft("");
    setEditorMode("split");
    setEditorOpen(true);
  }, [stats.authors]);

  const fetchPostById = useCallback(async (id: string): Promise<BlogFormState> => {
    const res = await fetch(`/api/v1/admin/blog/${id}`);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Unable to fetch blog post.");
    }
    const p = json.data;
    return {
      id: p.id,
      title: p.title,
      subtitle: p.subtitle || "",
      slug: p.slug,
      contentType: p.contentType || "post",
      excerpt: p.excerpt,
      bodyMarkdown: p.bodyMarkdown || "",
      tags: Array.isArray(p.tags) ? p.tags : [],
      authorUserId: p.authorUserId ?? null,
      authorBio: p.authorBio || "",
      isFeatured: Boolean(p.isFeatured),
      coverAssetId: p.coverAssetId,
      coverAssetUrl: p.coverAsset?.secureUrl ?? null,
      categoryIds: Array.isArray(p.categoryIds) ? p.categoryIds : [],
      status: p.status,
      scheduledFor: toLocalDateTimeInput(p.scheduledFor),
      seoTitle: p.seoTitle || "",
      seoDescription: p.seoDescription || "",
      canonicalUrl: p.canonicalUrl || "",
    };
  }, []);

  useEffect(() => {
    const editId = searchParams.get("edit");
    const createFlag = searchParams.get("create");
    let ignore = false;

    if (editId) {
      fetchPostById(editId)
        .then((mapped) => {
          if (!ignore) {
            setForm(mapped);
            setEditorMode("split");
            setEditorOpen(true);
          }
        })
        .catch((err) => {
          if (!ignore) {
            setError(err instanceof Error ? err.message : "Network error opening post.");
          }
        });
    } else if (createFlag === "1" && !editorOpen) {
      Promise.resolve().then(() => {
        if (!ignore) openCreateModal();
      });
    }

    return () => {
      ignore = true;
    };
  }, [searchParams, editorOpen, openCreateModal, fetchPostById]);

  const insertFormatting = (before: string, after = "", fallbackText = "text") => {
    if (!form) return;
    const el = bodyTextareaRef.current;
    if (!el) {
      setForm({
        ...form,
        bodyMarkdown: `${form.bodyMarkdown}\n${before}${fallbackText}${after}`,
      });
      return;
    }
    const start = el.selectionStart ?? form.bodyMarkdown.length;
    const end = el.selectionEnd ?? form.bodyMarkdown.length;
    const selected = form.bodyMarkdown.slice(start, end) || fallbackText;
    const nextBody =
      form.bodyMarkdown.slice(0, start) +
      before +
      selected +
      after +
      form.bodyMarkdown.slice(end);

    setForm({ ...form, bodyMarkdown: nextBody });
    setTimeout(() => {
      el.focus();
      const cursorPos = start + before.length + selected.length;
      el.setSelectionRange(cursorPos, cursorPos);
    }, 0);
  };

  const handleSave = async (
    e: React.FormEvent,
    overrideStatus?: "draft" | "published" | "archived"
  ) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setSuccess("");

    const finalStatus = overrideStatus ?? form.status;
    const scheduledIso =
      finalStatus === "draft" && form.scheduledFor
        ? new Date(form.scheduledFor).toISOString()
        : null;

    const payload = {
      title: form.title,
      subtitle: form.subtitle || null,
      slug: form.slug,
      contentType: form.contentType,
      excerpt: form.excerpt,
      bodyMarkdown: form.bodyMarkdown,
      tags: form.tags,
      authorUserId: form.authorUserId,
      authorBio: form.authorBio || null,
      isFeatured: form.isFeatured,
      coverAssetId: form.coverAssetId,
      categoryIds: form.categoryIds,
      status: finalStatus,
      scheduledFor: scheduledIso,
      seoTitle: form.seoTitle || null,
      seoDescription: form.seoDescription || null,
      canonicalUrl: form.canonicalUrl || null,
    };

    try {
      const endpoint = form.id
        ? `/api/v1/admin/blog/${form.id}`
        : "/api/v1/admin/blog";
      const method = form.id ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to save blog post.");
        return;
      }

      setEditorOpen(false);
      setSuccess(
        finalStatus === "published"
          ? "Article published."
          : scheduledIso
            ? "Article scheduled for publication."
            : "Draft saved."
      );
      await loadData();
    } catch {
      setError("Network error saving article.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post: BlogPostRow) => {
    if (!window.confirm(`Delete article "${post.title}"?`)) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/v1/admin/blog/${post.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("Failed to delete article.");
        return;
      }
      setOpenMenuId(null);
      setSuccess(`Deleted "${post.title}".`);
      await loadData();
    } catch {
      setError("Network error deleting article.");
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setSavingCat(true);
    setError("");
    try {
      const endpoint = editingCatId
        ? `/api/v1/admin/blog/categories/${editingCatId}`
        : "/api/v1/admin/blog/categories";
      const method = editingCatId ? "PATCH" : "POST";
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          slug: (newCatSlug.trim() || slugify(newCatName)).toLowerCase(),
          description: newCatDesc.trim() || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to save category.");
        return;
      }
      setNewCatName("");
      setNewCatSlug("");
      setNewCatDesc("");
      setEditingCatId(null);
      setSuccess(editingCatId ? "Category updated." : "Category created.");
      await loadData();
    } catch {
      setError("Network error saving category.");
    } finally {
      setSavingCat(false);
    }
  };

  const handleDeleteCategory = async (cat: BlogCategoryStat) => {
    if (!window.confirm(`Delete category "${cat.name}"?`)) return;
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/blog/categories/${cat.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        setError("Unable to delete category.");
        return;
      }
      if (categoryFilter === cat.slug) setCategoryFilter("");
      await loadData();
    } catch {
      setError("Network error deleting category.");
    }
  };

  const startIdx = totalFiltered === 0 ? 0 : (pageNum - 1) * rowsPerPage + 1;
  const endIdx = Math.min(pageNum * rowsPerPage, totalFiltered);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-[28px] tracking-tight text-[#F5F3EE]">
            Blog &amp; Insights
          </h1>
          <p className="text-sm text-[#8D939E]">
            Create, schedule, and publish blog articles, insights, and studio announcements.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {canEdit && (
            <>
              <button
                type="button"
                onClick={() => setCatModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#111419] border border-[#1E222A] text-xs text-[#F5F3EE] hover:border-[#D6B77A]/50 cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-[#D6B77A]" />
                <span>Manage Categories</span>
              </button>
              <button
                type="button"
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Write New Post</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* 4 Honest Editorial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF]">
            <span className="p-2 rounded-lg bg-[#1A160E] border border-[#D6B77A]/30 text-[#D6B77A]">
              <FileText className="w-4 h-4" />
            </span>
            <span>Total Posts</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats.totalAll}
          </div>
          <div className="text-xs text-[#777D87]">
            {stats.publishedCount} published · {stats.draftCount} drafts
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF]">
            <span className="p-2 rounded-lg bg-[#112419] border border-[#73C794]/30 text-[#73C794]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span>Insights &amp; News</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats.insightsCount + stats.announcementsCount}
          </div>
          <div className="text-xs text-[#777D87]">
            {stats.insightsCount} insights · {stats.announcementsCount} announcements
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF]">
            <span className="p-2 rounded-lg bg-[#1D1629] border border-[#B5A0F5]/30 text-[#B5A0F5]">
              <Clock className="w-4 h-4" />
            </span>
            <span>Scheduled &amp; Drafts</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats.draftCount}
          </div>
          <div className="text-xs text-[#777D87]">
            {stats.scheduledCount} scheduled · {stats.archivedCount} archived
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF]">
            <span className="p-2 rounded-lg bg-[#1A160E] border border-[#D6B77A]/30 text-[#D6B77A]">
              <Calendar className="w-4 h-4" />
            </span>
            <span>Published (30 Days)</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats.publishedLast30Count}
          </div>
          <div className="text-xs text-[#777D87]">Rolling 30-day window</div>
        </div>
      </div>

      {/* Content Tabs: All Posts | Published | Drafts | Scheduled | Insights | Announcements */}
      <div className="border-b border-[#1E222A] flex items-center gap-5 overflow-x-auto">
        {(
          [
            { key: "all", label: "All Posts", count: stats.totalAll },
            { key: "published", label: "Published", count: stats.publishedCount },
            { key: "draft", label: "Drafts", count: stats.draftCount },
            { key: "scheduled", label: "Scheduled", count: stats.scheduledCount },
            { key: "insight", label: "Insights", count: stats.insightsCount },
            {
              key: "announcement",
              label: "Announcements",
              count: stats.announcementsCount,
            },
          ] as const
        ).map((tab) => {
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => {
                setActiveTab(tab.key);
                setPageNum(1);
              }}
              className={cn(
                "pb-3 text-xs sm:text-sm font-medium inline-flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer",
                active
                  ? "border-[#D6B77A] text-[#F5F3EE]"
                  : "border-transparent text-[#8D939E] hover:text-[#F5F3EE]"
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[11px] font-mono",
                  active
                    ? "bg-[#221E15] text-[#D6B77A]"
                    : "bg-[#151820] text-[#777D87]"
                )}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-[#F07878]/10 border border-[#F07878]/30 text-xs text-[#F07878]">
          {error}
        </div>
      )}
      {success && (
        <div className="p-3 rounded-lg bg-[#73C794]/10 border border-[#73C794]/30 text-xs text-[#73C794]">
          {success}
        </div>
      )}

      {/* Main 12-Col Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        <div className="xl:col-span-8 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-2.5 justify-between">
            <div className="flex flex-wrap items-center gap-2.5 flex-1">
              <div className="relative flex-1 min-w-[180px] max-w-xs">
                <Search className="w-4 h-4 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPageNum(1);
                  }}
                  placeholder="Search articles, subtitles, tags..."
                  className="w-full h-9 pl-9 pr-3 rounded-lg bg-[#111419] border border-[#1E222A] text-xs text-[#F5F3EE] placeholder:text-[#6D7480] focus:outline-none focus:border-[#D6B77A]"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPageNum(1);
                }}
                aria-label="Filter by category"
                className="h-9 px-3 rounded-lg bg-[#111419] border border-[#1E222A] text-xs text-[#B2B4BA]"
              >
                <option value="">All Categories</option>
                {stats.categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>

              <select
                value={tagFilter}
                onChange={(e) => {
                  setTagFilter(e.target.value);
                  setPageNum(1);
                }}
                aria-label="Filter by tag"
                className="h-9 px-3 rounded-lg bg-[#111419] border border-[#1E222A] text-xs text-[#B2B4BA]"
              >
                <option value="">All Tags</option>
                {stats.allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    #{tag}
                  </option>
                ))}
              </select>

              <select
                value={authorFilter}
                onChange={(e) => {
                  setAuthorFilter(e.target.value);
                  setPageNum(1);
                }}
                aria-label="Filter by author"
                className="h-9 px-3 rounded-lg bg-[#111419] border border-[#1E222A] text-xs text-[#B2B4BA]"
              >
                <option value="">All Authors</option>
                {stats.authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.displayName}
                  </option>
                ))}
              </select>
            </div>

            <div className="inline-flex items-center p-0.5 rounded-lg bg-[#111419] border border-[#1E222A]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-md cursor-pointer",
                  viewMode === "grid"
                    ? "bg-[#D6B77A] text-[#08090B]"
                    : "text-[#8D939E] hover:text-[#F5F3EE]"
                )}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-md cursor-pointer",
                  viewMode === "list"
                    ? "bg-[#D6B77A] text-[#08090B]"
                    : "text-[#8D939E] hover:text-[#F5F3EE]"
                )}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Posts Table / Grid */}
          {viewMode === "list" ? (
            <div className="rounded-xl bg-[#111419] border border-[#1E222A] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1E222A] text-[10px] font-mono uppercase tracking-wider text-[#777D87] bg-[#0D0F12]">
                      <th className="py-3 pl-4 pr-2 w-8">
                        <input
                          type="checkbox"
                          checked={
                            posts.length > 0 && selectedIds.length === posts.length
                          }
                          onChange={() =>
                            setSelectedIds(
                              selectedIds.length === posts.length
                                ? []
                                : posts.map((p) => p.id)
                            )
                          }
                          aria-label="Select all posts"
                          className="accent-[#D6B77A]"
                        />
                      </th>
                      <th className="py-3 px-3">Article</th>
                      <th className="py-3 px-3">Type / Category</th>
                      <th className="py-3 px-3">Author</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E222A] text-xs">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-10 text-center text-[#777D87]"
                        >
                          <Loader2 className="w-4 h-4 animate-spin inline mr-2 text-[#D6B77A]" />
                          Loading articles...
                        </td>
                      </tr>
                    ) : posts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="p-10 text-center text-[#777D87]"
                        >
                          No articles match these filters.
                        </td>
                      </tr>
                    ) : (
                      posts.map((post) => {
                        const isScheduled =
                          post.status === "draft" && Boolean(post.scheduledFor);
                        return (
                          <tr key={post.id} className="hover:bg-[#151920]">
                            <td className="py-3.5 pl-4 pr-2">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(post.id)}
                                onChange={() =>
                                  setSelectedIds((prev) =>
                                    prev.includes(post.id)
                                      ? prev.filter((i) => i !== post.id)
                                      : [...prev, post.id]
                                  )
                                }
                                className="accent-[#D6B77A]"
                              />
                            </td>
                            <td className="py-3.5 px-3">
                              <div className="flex items-center gap-3">
                                {post.coverAssetUrl ? (
                                  /* eslint-disable-next-line @next/next/no-img-element */
                                  <img
                                    src={post.coverAssetUrl}
                                    alt={post.title}
                                    className="w-12 h-9 rounded-lg object-cover border border-[#252A32] shrink-0"
                                  />
                                ) : (
                                  <div className="w-12 h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] flex items-center justify-center shrink-0">
                                    <FileText className="w-3.5 h-3.5 text-[#D6B77A]/70" />
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <div className="font-semibold text-[#F5F3EE] truncate max-w-[210px] flex items-center gap-1.5">
                                    <span>{post.title}</span>
                                    {post.isFeatured && (
                                      <Sparkles className="w-3 h-3 text-[#D6B77A] shrink-0" />
                                    )}
                                  </div>
                                  <div className="text-[11px] text-[#777D87] truncate max-w-[210px]">
                                    {post.subtitle || post.excerpt}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-3 space-y-1">
                              <span className="inline-block px-2 py-0.5 rounded bg-[#0D0F12] border border-[#252A32] text-[10px] font-mono uppercase text-[#B2B4BA]">
                                {post.contentType}
                              </span>
                              {post.categories[0] && (
                                <div className="text-[11px] text-[#777D87]">
                                  {post.categories[0].name}
                                </div>
                              )}
                            </td>
                            <td className="py-3.5 px-3 text-[#B2B4BA] whitespace-nowrap">
                              {post.authorName || "Studio Team"}
                            </td>
                            <td className="py-3.5 px-3 whitespace-nowrap">
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] border",
                                  post.status === "published"
                                    ? "bg-[#73C794]/12 text-[#73C794] border-[#73C794]/30"
                                    : isScheduled
                                      ? "bg-[#7BA9F5]/12 text-[#7BA9F5] border-[#7BA9F5]/30"
                                      : "bg-[#D6B77A]/12 text-[#D6B77A] border-[#D6B77A]/30"
                                )}
                              >
                                <span className="capitalize">
                                  {isScheduled ? "Scheduled" : post.status}
                                </span>
                              </span>
                            </td>
                            <td className="py-3.5 px-3 text-[#8D939E] whitespace-nowrap">
                              {isScheduled
                                ? formatDate(post.scheduledFor)
                                : formatDate(post.publishedAt ?? post.updatedAt)}
                            </td>
                            <td className="py-3.5 px-4 text-right relative">
                              <div className="inline-flex items-center gap-1">
                                {canEdit && (
                                  <button
                                    type="button"
                                    onClick={async () => {
                                      const mapped = await fetchPostById(post.id);
                                      setForm(mapped);
                                      setEditorMode("split");
                                      setEditorOpen(true);
                                    }}
                                    aria-label={`Edit ${post.title}`}
                                    className="p-1.5 rounded-md text-[#8D939E] hover:text-[#D6B77A] hover:bg-[#191D24] cursor-pointer"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const mapped = await fetchPostById(post.id);
                                    setPreviewPost(mapped);
                                  }}
                                  aria-label={`Preview ${post.title}`}
                                  className="p-1.5 rounded-md text-[#8D939E] hover:text-white hover:bg-[#191D24] cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                {canEdit && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setOpenMenuId(
                                        openMenuId === post.id ? null : post.id
                                      )
                                    }
                                    className="p-1.5 rounded-md text-[#8D939E] hover:text-white cursor-pointer"
                                  >
                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </div>
                              {openMenuId === post.id && (
                                <div className="absolute right-4 top-10 z-20 w-40 rounded-xl bg-[#161A22] border border-[#252A32] shadow-xl py-1 text-left text-xs">
                                  <button
                                    type="button"
                                    onClick={() => handleDelete(post)}
                                    className="w-full px-3 py-2 text-[#F07878] hover:bg-[#1D222B] flex items-center gap-2 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    <span>Delete</span>
                                  </button>
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
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-xl bg-[#111419] border border-[#1E222A] overflow-hidden flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-[16/9] bg-[#0B0D10] relative">
                      {post.coverAssetUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={post.coverAssetUrl}
                          alt={post.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FileText className="w-6 h-6 text-[#D6B77A]/50" />
                        </div>
                      )}
                      <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/75 border border-white/15 text-[10px] font-mono uppercase text-[#D6B77A]">
                        {post.contentType}
                      </span>
                    </div>
                    <div className="p-4 space-y-1.5">
                      <h3 className="font-heading font-semibold text-sm text-[#F5F3EE]">
                        {post.title}
                      </h3>
                      <p className="text-xs text-[#777D87] line-clamp-2">
                        {post.subtitle || post.excerpt}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-3 border-t border-[#1E222A] flex items-center justify-between text-xs text-[#8D939E]">
                    <span>{formatDate(post.publishedAt ?? post.updatedAt)}</span>
                    <div className="flex gap-2">
                      {canEdit && (
                        <button
                          type="button"
                          onClick={async () => {
                            const mapped = await fetchPostById(post.id);
                            setForm(mapped);
                            setEditorMode("split");
                            setEditorOpen(true);
                          }}
                          className="text-[#D6B77A] hover:underline cursor-pointer"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={async () => {
                          const mapped = await fetchPostById(post.id);
                          setPreviewPost(mapped);
                        }}
                        className="text-[#B2B4BA] hover:text-white cursor-pointer"
                      >
                        Preview
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-[#8D939E]">
            <span>
              Showing {startIdx}–{endIdx} of {totalFiltered} posts
            </span>
            <div className="flex items-center gap-3">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPageNum(1);
                }}
                className="h-8 px-2 rounded-md bg-[#111419] border border-[#1E222A] text-xs text-[#F5F3EE]"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={pageNum <= 1}
                  onClick={() => setPageNum((p) => Math.max(1, p - 1))}
                  className="p-1.5 rounded-md border border-[#1E222A] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="px-2.5 py-1 rounded bg-[#D6B77A] text-[#17130B] font-semibold">
                  {pageNum}
                </span>
                <span className="px-1 text-[#777D87]">/ {totalPages}</span>
                <button
                  type="button"
                  disabled={pageNum >= totalPages}
                  onClick={() => setPageNum((p) => Math.min(totalPages, p + 1))}
                  className="p-1.5 rounded-md border border-[#1E222A] disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Editorial Sidebar */}
        <aside className="xl:col-span-4 space-y-5">
          {/* Top Insights */}
          <section className="rounded-xl bg-[#111419] border border-[#1E222A] p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-sm text-[#F5F3EE]">
                Top Insights
              </h2>
              <TrendingUp className="w-4 h-4 text-[#D6B77A]" />
            </div>

            {stats.topInsights.length === 0 ? (
              <p className="text-xs text-[#777D87]">
                Publish or feature articles to highlight Top Insights.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.topInsights.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={async () => {
                      const mapped = await fetchPostById(item.id);
                      setForm(mapped);
                      setEditorMode("split");
                      setEditorOpen(true);
                    }}
                    className="w-full text-left flex items-start justify-between gap-3 group cursor-pointer"
                  >
                    <div className="min-w-0">
                      <span className="text-[10px] font-mono uppercase text-[#D6B77A] flex items-center gap-1">
                        {item.isFeatured && <Sparkles className="w-3 h-3" />}
                        <span>{item.contentType}</span>
                      </span>
                      <div className="text-xs font-medium text-[#F5F3EE] group-hover:text-[#D6B77A] truncate mt-0.5">
                        {item.title}
                      </div>
                    </div>
                    <span className="text-[11px] text-[#777D87] shrink-0 mt-3">
                      {formatDate(item.publishedAt ?? item.updatedAt)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Categories */}
          <section className="rounded-xl bg-[#111419] border border-[#1E222A] p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-sm text-[#F5F3EE]">
                Categories ({stats.categories.length})
              </h2>
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setCatModalOpen(true)}
                  className="text-xs text-[#D6B77A] hover:underline cursor-pointer"
                >
                  + Manage
                </button>
              )}
            </div>

            <div className="space-y-2">
              {stats.categories.map((cat, idx) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() =>
                    setCategoryFilter((prev) =>
                      prev === cat.slug ? "" : cat.slug
                    )
                  }
                  className={cn(
                    "w-full flex items-center justify-between text-xs py-1.5 px-2 rounded-lg transition-colors cursor-pointer",
                    categoryFilter === cat.slug
                      ? "bg-[#221E15] text-[#D6B77A]"
                      : "text-[#B2B4BA] hover:bg-[#161920]"
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "w-2 h-2 rounded-full",
                        CATEGORY_DOT_COLORS[idx % CATEGORY_DOT_COLORS.length]
                      )}
                    />
                    <span>{cat.name}</span>
                  </span>
                  <span className="text-[#777D87]">{cat.count}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Recent Drafts */}
          <section className="rounded-xl bg-[#111419] border border-[#1E222A] p-5 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-sm text-[#F5F3EE]">
                Recent Drafts
              </h2>
              <button
                type="button"
                onClick={() => setActiveTab("draft")}
                className="text-xs text-[#D6B77A] hover:underline cursor-pointer"
              >
                View all →
              </button>
            </div>

            {stats.recentDrafts.length === 0 ? (
              <p className="text-xs text-[#777D87]">No unfinished drafts.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentDrafts.map((draft) => (
                  <button
                    key={draft.id}
                    type="button"
                    onClick={async () => {
                      const mapped = await fetchPostById(draft.id);
                      setForm(mapped);
                      setEditorMode("split");
                      setEditorOpen(true);
                    }}
                    className="w-full text-left flex items-center justify-between gap-3 p-2 -mx-2 rounded-lg hover:bg-[#161920] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {draft.coverAssetUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={draft.coverAssetUrl}
                          alt={draft.title}
                          className="w-11 h-8 rounded object-cover border border-[#252A32] shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-8 rounded bg-[#0D0F12] border border-[#252A32] flex items-center justify-center shrink-0">
                          <Edit3 className="w-3.5 h-3.5 text-[#D6B77A]/70" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[#F5F3EE] truncate">
                          {draft.title}
                        </div>
                        <div className="text-[11px] text-[#777D87]">
                          {draft.scheduledFor
                            ? `Scheduled ${formatDate(draft.scheduledFor)}`
                            : `Edited ${formatDate(draft.updatedAt)}`}
                        </div>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[#777D87] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </section>
        </aside>
      </div>

      {/* Dedicated Editorial Writing Workspace Modal */}
      {editorOpen && form && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
          <div className="w-full max-w-6xl h-[92vh] flex flex-col rounded-2xl bg-[#12151A] border border-[#252A32] overflow-hidden shadow-2xl">
            {/* Top Bar */}
            <div className="px-5 py-3.5 border-b border-[#252A32] flex flex-wrap items-center justify-between gap-3 bg-[#0D0F12]">
              <div className="flex items-center gap-3">
                <span className="font-heading font-semibold text-sm text-[#F5F3EE]">
                  {form.id ? "Editorial Studio · Editing" : "Editorial Studio · New Article"}
                </span>
                <div className="inline-flex p-0.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs">
                  {(["write", "split", "preview"] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setEditorMode(mode)}
                      className={cn(
                        "px-2.5 py-1 rounded-md capitalize cursor-pointer",
                        editorMode === mode
                          ? "bg-[#D6B77A] text-[#17130B] font-semibold"
                          : "text-[#8F96A3] hover:text-[#F5F3EE]"
                      )}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={saving}
                  onClick={(e) => handleSave(e, "draft")}
                  className="px-3 py-1.5 rounded-lg bg-[#191D23] border border-[#252A32] hover:border-[#3A414B] text-xs text-[#F5F3EE] cursor-pointer disabled:opacity-50"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={(e) => handleSave(e, "published")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D6B77A] hover:bg-[#E2C58B] text-xs font-semibold text-[#17130B] cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  <span>Publish Now</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="p-1.5 rounded-lg text-[#777D87] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body Split */}
            <form
              onSubmit={(e) => handleSave(e)}
              className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12"
            >
              {/* Left Writing Column */}
              <div
                className={cn(
                  "p-6 space-y-5 overflow-y-auto",
                  editorMode === "write"
                    ? "lg:col-span-8"
                    : editorMode === "split"
                      ? "lg:col-span-6 border-r border-[#252A32]"
                      : "hidden"
                )}
              >
                {/* Title & Subtitle */}
                <div className="space-y-3">
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => {
                      const next = e.target.value;
                      setForm({
                        ...form,
                        title: next,
                        slug: form.id ? form.slug : slugify(next),
                      });
                    }}
                    placeholder="Article headline..."
                    className="w-full bg-transparent text-2xl font-heading font-bold text-[#F5F3EE] placeholder:text-[#555C66] focus:outline-none"
                  />
                  <input
                    type="text"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                    placeholder="Editorial subtitle or deck (optional)..."
                    className="w-full bg-transparent text-sm text-[#B2B4BA] placeholder:text-[#555C66] focus:outline-none border-b border-[#252A32] pb-3"
                  />
                </div>

                {/* Rich-Text / Content Block Toolbar */}
                <div className="p-1.5 rounded-xl bg-[#0D0F12] border border-[#252A32] flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertFormatting("## ", "", "Section Heading")}
                    title="Heading 2"
                    className="p-1.5 rounded-md text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#191D23] cursor-pointer"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("### ", "", "Subheading")}
                    title="Heading 3"
                    className="p-1.5 rounded-md text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#191D23] cursor-pointer"
                  >
                    <Heading3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("**", "**", "bold text")}
                    title="Bold"
                    className="p-1.5 rounded-md text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#191D23] cursor-pointer"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("*", "*", "italic text")}
                    title="Italic"
                    className="p-1.5 rounded-md text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#191D23] cursor-pointer"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("- ", "", "Bullet point")}
                    title="Bullet List"
                    className="p-1.5 rounded-md text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#191D23] cursor-pointer"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("1. ", "", "Numbered item")}
                    title="Numbered List"
                    className="p-1.5 rounded-md text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#191D23] cursor-pointer"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("> ", "", "Editorial quotation")}
                    title="Quotation"
                    className="p-1.5 rounded-md text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#191D23] cursor-pointer"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("[", "](https://)", "link label")}
                    title="Insert Link"
                    className="p-1.5 rounded-md text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#191D23] cursor-pointer"
                  >
                    <Link2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("```\n", "\n```", "code snippet")}
                    title="Code Block"
                    className="p-1.5 rounded-md text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#191D23] cursor-pointer"
                  >
                    <Code className="w-4 h-4" />
                  </button>
                  <span className="h-4 w-px bg-[#252A32] mx-1" />
                  <button
                    type="button"
                    onClick={() => setPickerTarget("inline")}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#191D23] border border-[#252A32] hover:border-[#D6B77A] text-xs text-[#D6B77A] cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>Insert Image</span>
                  </button>
                </div>

                {/* Body */}
                <textarea
                  ref={bodyTextareaRef}
                  rows={16}
                  required
                  value={form.bodyMarkdown}
                  onChange={(e) =>
                    setForm({ ...form, bodyMarkdown: e.target.value })
                  }
                  placeholder="Write your article in Markdown... Use the toolbar above for headings, lists, quotes, links, and inline images."
                  className="w-full rounded-xl bg-[#0D0F12] border border-[#252A32] p-4 text-sm text-[#F5F3EE] leading-relaxed font-mono focus:outline-none focus:border-[#D6B77A]"
                />
              </div>

              {/* Center/Right Live Preview Pane */}
              {(editorMode === "split" || editorMode === "preview") && (
                <div
                  className={cn(
                    "p-6 overflow-y-auto bg-[#0B0D10]/70 space-y-4",
                    editorMode === "preview"
                      ? "lg:col-span-8"
                      : "lg:col-span-3 border-r border-[#252A32]"
                  )}
                >
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-[#D6B77A]">
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Article Preview</span>
                  </div>

                  {form.coverAssetUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={form.coverAssetUrl}
                      alt={form.title}
                      className="w-full aspect-[16/9] object-cover rounded-xl border border-[#252A32]"
                    />
                  )}
                  <div className="space-y-1.5">
                    <span className="inline-block px-2 py-0.5 rounded bg-[#191D23] text-[10px] font-mono uppercase text-[#D6B77A]">
                      {form.contentType}
                    </span>
                    <h1 className="font-heading text-xl font-bold text-[#F5F3EE]">
                      {form.title || "Untitled Article"}
                    </h1>
                    {form.subtitle && (
                      <p className="text-sm text-[#B2B4BA]">{form.subtitle}</p>
                    )}
                    <p className="text-[11px] text-[#777D87] pt-1">
                      By{" "}
                      {stats.authors.find((a) => a.id === form.authorUserId)
                        ?.displayName || "Studio Author"}
                      {form.authorBio ? ` · ${form.authorBio}` : ""}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#252A32]">
                    <MarkdownPreviewRenderer markdown={form.bodyMarkdown} />
                  </div>
                </div>
              )}

              {/* Right Settings & Metadata Rail */}
              <div
                className={cn(
                  "p-5 space-y-4 overflow-y-auto bg-[#0D0F12]/90 text-xs",
                  editorMode === "split" ? "lg:col-span-3" : "lg:col-span-4"
                )}
              >
                <div>
                  <label className="block text-[#8F96A3] mb-1">Content Type</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(
                      [
                        { id: "post", label: "Blog Post", icon: FileText },
                        { id: "insight", label: "Insight", icon: Sparkles },
                        { id: "announcement", label: "News", icon: Megaphone },
                      ] as const
                    ).map((ct) => {
                      const Icon = ct.icon;
                      return (
                        <button
                          key={ct.id}
                          type="button"
                          onClick={() => setForm({ ...form, contentType: ct.id })}
                          className={cn(
                            "py-2 px-2 rounded-lg border text-[11px] flex flex-col items-center gap-1 cursor-pointer",
                            form.contentType === ct.id
                              ? "bg-[#D6B77A]/15 border-[#D6B77A] text-[#D6B77A]"
                              : "bg-[#12151A] border-[#252A32] text-[#8F96A3]"
                          )}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{ct.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[#8F96A3] mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                    className="w-full h-9 rounded-lg bg-[#12151A] border border-[#252A32] px-2.5 font-mono text-[#F5F3EE]"
                  />
                </div>

                <div>
                  <label className="block text-[#8F96A3] mb-1">Excerpt / Summary *</label>
                  <textarea
                    rows={2}
                    required
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    className="w-full rounded-lg bg-[#12151A] border border-[#252A32] p-2.5 text-[#F5F3EE]"
                  />
                </div>

                <div>
                  <label className="block text-[#8F96A3] mb-1">Featured Image</label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPickerTarget("cover")}
                      className="flex-1 h-9 rounded-lg bg-[#12151A] border border-[#252A32] hover:border-[#D6B77A] text-[#F5F3EE] inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[#D6B77A]" />
                      <span>{form.coverAssetUrl ? "Change Cover" : "Pick Featured Image"}</span>
                    </button>
                    {form.coverAssetId && (
                      <button
                        type="button"
                        onClick={() =>
                          setForm({ ...form, coverAssetId: null, coverAssetUrl: null })
                        }
                        className="text-[#F07878] hover:underline cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[#8F96A3] mb-1.5">Categories</label>
                  <div className="flex flex-wrap gap-1.5">
                    {stats.categories.map((cat) => {
                      const checked = form.categoryIds.includes(cat.id);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            const next = checked
                              ? form.categoryIds.filter((id) => id !== cat.id)
                              : [...form.categoryIds, cat.id];
                            setForm({ ...form, categoryIds: next });
                          }}
                          className={cn(
                            "px-2.5 py-1 rounded-full text-[11px] border cursor-pointer inline-flex items-center gap-1",
                            checked
                              ? "bg-[#D6B77A]/15 border-[#D6B77A] text-[#D6B77A]"
                              : "bg-[#12151A] border-[#252A32] text-[#8F96A3]"
                          )}
                        >
                          {checked && <Check className="w-3 h-3" />}
                          <span>{cat.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-[#8F96A3] mb-1">Tags</label>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {form.tags.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#12151A] border border-[#252A32] text-[11px] text-[#B2B4BA]"
                      >
                        <Tag className="w-2.5 h-2.5 text-[#D6B77A]" />
                        <span>{t}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              tags: form.tags.filter((x) => x !== t),
                            })
                          }
                          className="text-[#777D87] hover:text-[#F07878] cursor-pointer"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      value={tagDraft}
                      onChange={(e) => setTagDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const clean = tagDraft.trim().toLowerCase();
                          if (clean && !form.tags.includes(clean)) {
                            setForm({ ...form, tags: [...form.tags, clean] });
                          }
                          setTagDraft("");
                        }
                      }}
                      placeholder="Add tag & press Enter"
                      className="flex-1 h-8 rounded-lg bg-[#12151A] border border-[#252A32] px-2.5 text-[#F5F3EE]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const clean = tagDraft.trim().toLowerCase();
                        if (clean && !form.tags.includes(clean)) {
                          setForm({ ...form, tags: [...form.tags, clean] });
                        }
                        setTagDraft("");
                      }}
                      className="px-2.5 h-8 rounded-lg bg-[#12151A] border border-[#252A32] text-[#D6B77A] cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Author Information */}
                <div className="pt-2 border-t border-[#252A32] space-y-2">
                  <span className="text-[#F5F3EE] font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#D6B77A]" /> Author Information
                  </span>
                  <select
                    value={form.authorUserId ?? ""}
                    onChange={(e) =>
                      setForm({ ...form, authorUserId: e.target.value || null })
                    }
                    className="w-full h-9 rounded-lg bg-[#12151A] border border-[#252A32] px-2.5 text-[#F5F3EE]"
                  >
                    <option value="">Current Signed-in User</option>
                    {stats.authors.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.displayName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={form.authorBio}
                    onChange={(e) => setForm({ ...form, authorBio: e.target.value })}
                    placeholder="Author role / short bio line"
                    className="w-full h-8 rounded-lg bg-[#12151A] border border-[#252A32] px-2.5 text-[#F5F3EE]"
                  />
                </div>

                {/* Scheduling & Publishing */}
                <div className="pt-2 border-t border-[#252A32] space-y-2">
                  <label className="block text-[#8F96A3]">Schedule Publication (Drafts)</label>
                  <input
                    type="datetime-local"
                    value={form.scheduledFor}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: "draft",
                        scheduledFor: e.target.value,
                      })
                    }
                    className="w-full h-9 rounded-lg bg-[#12151A] border border-[#252A32] px-2.5 text-[#F5F3EE]"
                  />
                  <label className="flex items-center gap-2 text-[#B2B4BA] cursor-pointer pt-1">
                    <input
                      type="checkbox"
                      checked={form.isFeatured}
                      onChange={(e) =>
                        setForm({ ...form, isFeatured: e.target.checked })
                      }
                      className="accent-[#D6B77A]"
                    />
                    <span>Feature in Top Insights</span>
                  </label>
                </div>

                {/* SEO Controls */}
                <div className="pt-2 border-t border-[#252A32] space-y-2">
                  <span className="text-[#F5F3EE] font-medium block">SEO Metadata</span>
                  <input
                    type="text"
                    value={form.seoTitle}
                    onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                    placeholder="SEO Title"
                    className="w-full h-8 rounded-lg bg-[#12151A] border border-[#252A32] px-2.5 text-[#F5F3EE]"
                  />
                  <textarea
                    rows={2}
                    value={form.seoDescription}
                    onChange={(e) =>
                      setForm({ ...form, seoDescription: e.target.value })
                    }
                    placeholder="Meta Description"
                    className="w-full rounded-lg bg-[#12151A] border border-[#252A32] p-2 text-[#F5F3EE]"
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Standalone Article Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[88vh] flex flex-col rounded-2xl bg-[#12151A] border border-[#252A32] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#252A32] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-[#191D23] border border-[#252A32] text-[10px] font-mono uppercase text-[#D6B77A]">
                  {previewPost.contentType}
                </span>
                <span className="text-xs text-[#777D87] font-mono">
                  /blog/{previewPost.slug}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPost(null)}
                className="text-[#777D87] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-5">
              {previewPost.coverAssetUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={previewPost.coverAssetUrl}
                  alt={previewPost.title}
                  className="w-full aspect-[16/9] object-cover rounded-xl border border-[#252A32]"
                />
              )}
              <div className="space-y-2">
                <h2 className="font-heading text-2xl font-bold text-[#F5F3EE]">
                  {previewPost.title}
                </h2>
                {previewPost.subtitle && (
                  <p className="text-base text-[#B2B4BA]">{previewPost.subtitle}</p>
                )}
              </div>
              <MarkdownPreviewRenderer markdown={previewPost.bodyMarkdown} />
            </div>
          </div>
        </div>
      )}

      {/* Category Management Modal (Create, Edit, Delete) */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#12151A] border border-[#252A32] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-base font-semibold text-[#F5F3EE]">
                Manage Categories
              </h2>
              <button
                type="button"
                onClick={() => {
                  setCatModalOpen(false);
                  setEditingCatId(null);
                }}
                className="text-[#8F96A3] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!editingCatId) setNewCatSlug(slugify(e.target.value));
                  }}
                  placeholder="Category Name"
                  className="h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-xs text-[#F5F3EE]"
                />
                <input
                  type="text"
                  required
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(slugify(e.target.value))}
                  placeholder="slug"
                  className="h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-xs font-mono text-[#F5F3EE]"
                />
              </div>
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="Description (optional)"
                className="w-full h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] px-3 text-xs text-[#F5F3EE]"
              />
              <div className="flex justify-end gap-2">
                {editingCatId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCatId(null);
                      setNewCatName("");
                      setNewCatSlug("");
                      setNewCatDesc("");
                    }}
                    className="px-3 py-1.5 text-xs text-[#8F96A3] cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={savingCat}
                  className="px-4 py-1.5 rounded-lg bg-[#D6B77A] text-[#17130B] text-xs font-semibold cursor-pointer"
                >
                  {editingCatId ? "Update Category" : "Create Category"}
                </button>
              </div>
            </form>

            <div className="border-t border-[#252A32] pt-3 space-y-2 max-h-56 overflow-y-auto">
              {stats.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between gap-2 p-2 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs"
                >
                  <div>
                    <span className="font-medium text-[#F5F3EE]">{cat.name}</span>
                    <span className="ml-2 text-[#777D87] font-mono">/{cat.slug}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-[#777D87]">{cat.count} posts</span>
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCatId(cat.id);
                        setNewCatName(cat.name);
                        setNewCatSlug(cat.slug);
                        setNewCatDesc(cat.description || "");
                      }}
                      className="text-[#D6B77A] hover:underline cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-[#F07878] hover:underline cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <MediaPickerModal
        open={pickerTarget !== null}
        title={
          pickerTarget === "inline"
            ? "Insert Image into Article Body"
            : "Select Featured Cover Image"
        }
        selectedId={pickerTarget === "cover" ? form?.coverAssetId ?? null : null}
        onClose={() => setPickerTarget(null)}
        onSelectSingle={(asset: MediaAssetItem) => {
          if (!form) return;
          if (pickerTarget === "cover") {
            setForm({
              ...form,
              coverAssetId: asset.id,
              coverAssetUrl: asset.secureUrl,
            });
          } else if (pickerTarget === "inline") {
            const alt = asset.altText || "Article image";
            insertFormatting(`\n![${alt}](${asset.secureUrl})\n`, "", "");
          }
          setPickerTarget(null);
        }}
      />
    </div>
  );
}
