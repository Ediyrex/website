"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  Image as ImageIcon,
  Loader2,
  FileText,
  Eye,
  Calendar,
  FolderPlus,
  CheckCircle2,
  LayoutGrid,
  List,
  MoreHorizontal,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "./AdminContext";
import { MediaPickerModal, type MediaAssetItem } from "./MediaPickerModal";

interface BlogCategoryStat {
  id: string;
  name: string;
  slug: string;
  count: number;
}

interface BlogAuthorOption {
  id: string;
  displayName: string;
}

interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverAssetId: string | null;
  coverAssetUrl: string | null;
  authorUserId: string | null;
  authorName: string | null;
  categories: { id: string; name: string; slug: string }[];
  status: "draft" | "published" | "archived";
  publishedAt: string | null;
  updatedAt: string;
}

interface BlogStats {
  totalAll: number;
  publishedCount: number;
  draftCount: number;
  archivedCount: number;
  publishedLast30Count: number;
  categories: BlogCategoryStat[];
  authors: BlogAuthorOption[];
  recentPublished: {
    id: string;
    title: string;
    slug: string;
    publishedAt: string | null;
    updatedAt: string;
  }[];
  recentDrafts: {
    id: string;
    title: string;
    slug: string;
    coverAssetUrl: string | null;
    updatedAt: string;
  }[];
}

interface BlogFormState {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyMarkdown: string;
  coverAssetId: string | null;
  coverAssetUrl: string | null;
  categoryIds: string[];
  status: "draft" | "published" | "archived";
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}

const CATEGORY_DOT_COLORS = [
  "bg-[#7CD69F]",
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

export function AdminBlogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { canEdit } = useAdminUser();

  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [stats, setStats] = useState<BlogStats>({
    totalAll: 0,
    publishedCount: 0,
    draftCount: 0,
    archivedCount: 0,
    publishedLast30Count: 0,
    categories: [],
    authors: [],
    recentPublished: [],
    recentDrafts: [],
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
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
  const [editorOpen, setEditorOpen] = useState(false);
  const [previewPost, setPreviewPost] = useState<BlogFormState | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BlogFormState | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const [catModalOpen, setCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatSlug, setNewCatSlug] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");

  const fetchPosts = useCallback(async () => {
    const params = new URLSearchParams({
      page: String(pageNum),
      limit: String(rowsPerPage),
    });
    if (statusFilter) params.set("status", statusFilter);
    if (categoryFilter) params.set("category", categoryFilter);
    if (authorFilter) params.set("author", authorFilter);
    if (query.trim()) params.set("q", query.trim());

    const res = await fetch(`/api/v1/admin/blog?${params.toString()}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Unable to fetch blog posts.");
    return json;
  }, [pageNum, rowsPerPage, statusFilter, categoryFilter, authorFilter, query, router]);

  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      const json = await fetchPosts();
      if (json) {
        setPosts(json.data || []);
        setTotalFiltered(json.meta?.total ?? 0);
        setTotalPages(json.meta?.totalPages ?? 1);
        if (json.meta?.stats) setStats(json.meta.stats);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error loading blog."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchPosts()
      .then((json) => {
        if (!ignore && json) {
          setPosts(json.data || []);
          setTotalFiltered(json.meta?.total ?? 0);
          setTotalPages(json.meta?.totalPages ?? 1);
          if (json.meta?.stats) setStats(json.meta.stats);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Network error loading blog."
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fetchPosts]);

  const openCreateModal = useCallback(() => {
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      bodyMarkdown: "",
      coverAssetId: null,
      coverAssetUrl: null,
      categoryIds: [],
      status: "draft",
      seoTitle: "",
      seoDescription: "",
      canonicalUrl: "",
    });
    setEditorOpen(true);
  }, []);

  const fetchPostById = useCallback(async (id: string): Promise<BlogFormState> => {
    const res = await fetch(`/api/v1/admin/blog/${id}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Unable to load article.");
    const d = json.data;
    return {
      id: d.id,
      title: d.title,
      slug: d.slug,
      excerpt: d.excerpt,
      bodyMarkdown: d.bodyMarkdown,
      coverAssetId: d.coverAssetId || null,
      coverAssetUrl: d.coverAsset?.secureUrl || null,
      categoryIds: Array.isArray(d.categoryIds) ? d.categoryIds : [],
      status: d.status || "draft",
      seoTitle: d.seoTitle || "",
      seoDescription: d.seoDescription || "",
      canonicalUrl: d.canonicalUrl || "",
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
            setEditorOpen(true);
          }
        })
        .catch((err) => {
          if (!ignore) {
            setError(
              err instanceof Error ? err.message : "Unable to load article."
            );
          }
        });
    } else if (createFlag === "1" && !editorOpen && !form) {
      Promise.resolve().then(() => {
        if (!ignore) openCreateModal();
      });
    }

    return () => {
      ignore = true;
    };
  }, [searchParams, editorOpen, form, openCreateModal, fetchPostById]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const endpoint = form.id
        ? `/api/v1/admin/blog/${form.id}`
        : "/api/v1/admin/blog";
      const method = form.id ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug,
          excerpt: form.excerpt,
          bodyMarkdown: form.bodyMarkdown,
          coverAssetId: form.coverAssetId,
          categoryIds: form.categoryIds,
          status: form.status,
          seoTitle: form.seoTitle || null,
          seoDescription: form.seoDescription || null,
          canonicalUrl: form.canonicalUrl || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to save article.");
        return;
      }

      setEditorOpen(false);
      setSuccess(form.id ? "Article updated." : "Article created.");
      await reload();
    } catch {
      setError("Network error saving article.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: BlogPostRow) => {
    if (!window.confirm(`Delete article "${row.title}"?`)) return;
    setError("");
    setOpenMenuId(null);
    try {
      const res = await fetch(`/api/v1/admin/blog/${row.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to delete article.");
        return;
      }
      setSuccess(`Deleted "${row.title}".`);
      await reload();
    } catch {
      setError("Network error deleting article.");
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/v1/admin/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName,
          slug: newCatSlug,
          description: newCatDesc || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to create category.");
        return;
      }
      setNewCatName("");
      setNewCatSlug("");
      setNewCatDesc("");
      setSuccess("Created blog category.");
      await reload();
    } catch {
      setError("Network error creating category.");
    }
  };

  const handleDeleteCategory = async (catId: string, catName: string) => {
    if (!window.confirm(`Delete category "${catName}"?`)) return;
    setError("");
    const res = await fetch(`/api/v1/admin/blog/categories/${catId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setSuccess(`Deleted category "${catName}".`);
      await reload();
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === posts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(posts.map((p) => p.id));
    }
  };

  const toggleRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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
            Create, manage, and publish blog posts, insights, and studio updates.
          </p>
        </div>

        {canEdit && (
          <div className="flex flex-wrap gap-2.5">
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
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] transition-colors cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Write New Post</span>
            </button>
          </div>
        )}
      </div>

      {/* Top 4 KPI Cards */}
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
          <div className="text-[11px] text-[#777D87]">
            {stats.publishedCount} published · {stats.draftCount} drafts
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF]">
            <span className="p-2 rounded-lg bg-[#112419] border border-[#54C99A]/30 text-[#54C99A]">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <span>Published</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats.publishedCount}
          </div>
          <div className="text-[11px] text-[#777D87]">Live studio articles</div>
        </div>

        <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
          <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF]">
            <span className="p-2 rounded-lg bg-[#1D1629] border border-[#B5A0F5]/30 text-[#B5A0F5]">
              <Edit3 className="w-4 h-4" />
            </span>
            <span>Drafts &amp; Review</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats.draftCount}
          </div>
          <div className="text-[11px] text-[#777D87]">
            {stats.archivedCount} archived
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
          <div className="text-[11px] text-[#777D87]">Rolling 30-day window</div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-6 border-b border-[#1E222A] overflow-x-auto">
        {[
          { key: "", label: "All Posts", count: stats.totalAll },
          { key: "published", label: "Published", count: stats.publishedCount },
          { key: "draft", label: "Drafts", count: stats.draftCount },
          { key: "archived", label: "Archived", count: stats.archivedCount },
        ].map((tab) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => {
              setStatusFilter(tab.key);
              setPageNum(1);
            }}
            className={cn(
              "pb-3 text-xs font-medium inline-flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer",
              statusFilter === tab.key && categoryFilter === ""
                ? "border-[#D6B77A] text-[#F5F3EE]"
                : "border-transparent text-[#8D939E] hover:text-white"
            )}
          >
            <span>{tab.label}</span>
            <span className="px-2 py-0.5 rounded-full bg-[#181C23] border border-[#252A32] text-[10px] font-mono text-[#B2B4BA]">
              {tab.count}
            </span>
          </button>
        ))}
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

      {/* Main 12-Col Split Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left 8 Columns: Filter + Table/Grid */}
        <div className="xl:col-span-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[240px]">
              <div className="relative flex-1 max-w-xs min-w-[180px]">
                <Search className="w-4 h-4 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setPageNum(1);
                  }}
                  placeholder="Search blog posts..."
                  className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#111419] border border-[#1E222A] text-sm text-[#F5F3EE] placeholder-[#6D7480] focus:outline-none focus:border-[#D6B77A]"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => {
                  setCategoryFilter(e.target.value);
                  setPageNum(1);
                }}
                aria-label="Filter posts by category"
                className="h-10 px-3 rounded-lg bg-[#111419] border border-[#1E222A] text-xs text-[#F5F3EE]"
              >
                <option value="">All Categories</option>
                {stats.categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={authorFilter}
                onChange={(e) => {
                  setAuthorFilter(e.target.value);
                  setPageNum(1);
                }}
                aria-label="Filter posts by author"
                className="h-10 px-3 rounded-lg bg-[#111419] border border-[#1E222A] text-xs text-[#F5F3EE]"
              >
                <option value="">All Authors</option>
                {stats.authors.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.displayName}
                  </option>
                ))}
              </select>
            </div>

            {/* Grid / List Toggle */}
            <div className="inline-flex items-center p-1 rounded-lg bg-[#111419] border border-[#1E222A]">
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
            </div>
          </div>

          {viewMode === "list" ? (
            <div className="rounded-xl bg-[#111419] border border-[#1E222A] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#1E222A] text-[11px] font-mono uppercase tracking-wider text-[#6D7480] bg-[#0B0D10]">
                      <th className="py-3 pl-4 pr-2 w-10">
                        <input
                          type="checkbox"
                          checked={
                            posts.length > 0 && selectedIds.length === posts.length
                          }
                          onChange={toggleSelectAll}
                          aria-label="Select all posts"
                          className="rounded border-[#323946] bg-[#0B0D10]"
                        />
                      </th>
                      <th className="py-3 px-3">Post</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Published</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1E222A] text-sm">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-10 text-center text-xs font-mono text-[#777D87]"
                        >
                          Loading articles...
                        </td>
                      </tr>
                    ) : posts.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-10 text-center text-xs text-[#777D87]"
                        >
                          No blog articles match your filters. Click Write New Post to author one.
                        </td>
                      </tr>
                    ) : (
                      posts.map((post) => (
                        <tr key={post.id} className="hover:bg-[#151920]">
                          <td className="py-3.5 pl-4 pr-2">
                            <input
                              type="checkbox"
                              checked={selectedIds.includes(post.id)}
                              onChange={() => toggleRow(post.id)}
                              aria-label={`Select ${post.title}`}
                              className="rounded border-[#323946] bg-[#0B0D10]"
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
                                <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-[#231D13] via-[#15181F] to-[#0B0D10] border border-[#252A32] flex items-center justify-center shrink-0">
                                  <FileText className="w-3.5 h-3.5 text-[#D6B77A]/70" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <div className="font-semibold text-[#F5F3EE] truncate max-w-[230px]">
                                  {post.title}
                                </div>
                                <div className="text-xs text-[#777D87] truncate max-w-[230px]">
                                  {post.excerpt}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-3">
                            {post.categories.length > 0 ? (
                              <span className="inline-block px-2.5 py-1 rounded-md bg-[#161920] border border-[#252A32] text-[11px] text-[#B2B4BA] whitespace-nowrap">
                                {post.categories[0].name}
                              </span>
                            ) : (
                              <span className="text-xs text-[#6D7480]">—</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap",
                                post.status === "published"
                                  ? "bg-[#54C99A]/12 text-[#7CD69F] border-[#54C99A]/30"
                                  : post.status === "draft"
                                    ? "bg-[#D6B77A]/12 text-[#D6B77A] border-[#D6B77A]/30"
                                    : "bg-[#181C24] text-[#9CA3AF] border-[#252A32]"
                              )}
                            >
                              <span
                                className={cn(
                                  "w-1.5 h-1.5 rounded-full",
                                  post.status === "published"
                                    ? "bg-[#7CD69F]"
                                    : post.status === "draft"
                                      ? "bg-[#D6B77A]"
                                      : "bg-[#9CA3AF]"
                                )}
                              />
                              <span className="capitalize">{post.status}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-3 text-xs text-[#8D939E] whitespace-nowrap">
                            {formatDate(post.publishedAt)}
                          </td>
                          <td className="py-3.5 px-4 text-right relative">
                            <div className="inline-flex items-center gap-1">
                              {canEdit && (
                                <button
                                  type="button"
                                  onClick={async () => {
                                    const mapped = await fetchPostById(post.id);
                                    setForm(mapped);
                                    setEditorOpen(true);
                                  }}
                                  aria-label={`Edit ${post.title}`}
                                  className="p-1.5 rounded-md text-[#8D939E] hover:text-[#D6B77A] hover:bg-[#191D24] cursor-pointer"
                                >
                                  <Edit3 className="w-4 h-4" />
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
                                <ExternalLink className="w-4 h-4" />
                              </button>
                              {canEdit && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    setOpenMenuId(
                                      openMenuId === post.id ? null : post.id
                                    )
                                  }
                                  aria-label={`More options for ${post.title}`}
                                  className="p-1.5 rounded-md text-[#8D939E] hover:text-white hover:bg-[#191D24] cursor-pointer"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </button>
                              )}
                            </div>

                            {openMenuId === post.id && (
                              <div className="absolute right-4 top-12 z-30 w-40 py-1.5 rounded-xl bg-[#14181F] border border-[#252A32] shadow-2xl text-left text-xs">
                                <button
                                  type="button"
                                  onClick={async () => {
                                    setOpenMenuId(null);
                                    const mapped = await fetchPostById(post.id);
                                    setPreviewPost(mapped);
                                  }}
                                  className="w-full px-3.5 py-2 text-[#F5F3EE] hover:bg-[#1C212B] flex items-center gap-2 cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Preview</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDelete(post)}
                                  className="w-full px-3.5 py-2 text-[#F28B82] hover:bg-[#2A1414] flex items-center gap-2 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  <span>Delete Post</span>
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Footer */}
              <div className="px-4 py-3 border-t border-[#1E222A] bg-[#0B0D10] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8D939E]">
                <div>
                  Showing {startIdx}–{endIdx} of {totalFiltered} posts
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
                      <option value={6}>6</option>
                      <option value={10}>10</option>
                      <option value={20}>20</option>
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
                      onClick={() =>
                        setPageNum((p) => Math.min(totalPages, p + 1))
                      }
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] hover:border-[#D6B77A]/40 transition-colors space-y-3"
                >
                  {post.coverAssetUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={post.coverAssetUrl}
                      alt={post.title}
                      className="w-full aspect-video rounded-lg object-cover border border-[#252A32]"
                    />
                  ) : (
                    <div className="w-full aspect-video rounded-lg bg-gradient-to-br from-[#231D13] via-[#15181F] to-[#0B0D10] border border-[#252A32] flex items-center justify-center">
                      <FileText className="w-6 h-6 text-[#D6B77A]/60" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-[#F5F3EE]">
                      {post.title}
                    </div>
                    <div className="text-xs text-[#777D87] line-clamp-2">
                      {post.excerpt}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-[#1E222A] flex items-center justify-between text-xs">
                    <span className="capitalize text-[#D6B77A] font-mono">
                      {post.status}
                    </span>
                    {canEdit && (
                      <button
                        type="button"
                        onClick={async () => {
                          const mapped = await fetchPostById(post.id);
                          setForm(mapped);
                          setEditorOpen(true);
                        }}
                        className="text-[#B2B4BA] hover:text-white cursor-pointer"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>

        {/* Right 4 Columns: Insights, Categories, Recent Drafts */}
        <aside className="xl:col-span-4 space-y-5">
          {/* Card 1: Recent Published Highlights */}
          <section className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-sm text-[#F5F3EE]">
                Recent Published
              </h2>
              <TrendingUp className="w-4 h-4 text-[#D6B77A]" />
            </div>

            {stats.recentPublished.length === 0 ? (
              <p className="text-xs text-[#777D87]">
                No published insights yet.
              </p>
            ) : (
              <div className="space-y-3">
                {stats.recentPublished.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={async () => {
                      const mapped = await fetchPostById(item.id);
                      setPreviewPost(mapped);
                    }}
                    className="w-full text-left flex items-center justify-between gap-3 p-2 -mx-2 rounded-lg hover:bg-[#161920] transition-colors cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="text-xs font-medium text-[#F5F3EE] truncate">
                        {item.title}
                      </div>
                      <div className="text-[11px] font-mono text-[#777D87] truncate">
                        /{item.slug}
                      </div>
                    </div>
                    <span className="text-[11px] text-[#D6B77A] shrink-0">
                      {formatDate(item.publishedAt || item.updatedAt)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* Card 2: Categories */}
          <section className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-4">
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
                  + Add
                </button>
              )}
            </div>

            <div className="space-y-2.5">
              {stats.categories.map((cat, idx) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategoryFilter(
                      categoryFilter === cat.slug ? "" : cat.slug
                    );
                    setPageNum(1);
                  }}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer",
                    categoryFilter === cat.slug
                      ? "bg-[#D6B77A]/15 text-[#F5E7C8]"
                      : "text-[#B2B4BA] hover:bg-[#161920] hover:text-white"
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
                  <span className="px-2 py-0.5 rounded bg-[#181C23] border border-[#252A32] font-mono text-[10px] text-[#9CA3AF]">
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {/* Card 3: Recent Drafts */}
          <section className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-sm text-[#F5F3EE]">
                Recent Drafts
              </h2>
              <button
                type="button"
                onClick={() => {
                  setStatusFilter("draft");
                  setCategoryFilter("");
                  setPageNum(1);
                }}
                className="text-xs text-[#D6B77A] hover:underline cursor-pointer"
              >
                View all →
              </button>
            </div>

            {stats.recentDrafts.length === 0 ? (
              <p className="text-xs text-[#777D87]">No active drafts.</p>
            ) : (
              <div className="space-y-3">
                {stats.recentDrafts.map((draft) => (
                  <button
                    key={draft.id}
                    type="button"
                    onClick={async () => {
                      const mapped = await fetchPostById(draft.id);
                      setForm(mapped);
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
                        <div className="w-11 h-8 rounded bg-gradient-to-br from-[#231D13] to-[#0B0D10] border border-[#252A32] flex items-center justify-center shrink-0">
                          <Edit3 className="w-3.5 h-3.5 text-[#D6B77A]/70" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="text-xs font-medium text-[#F5F3EE] truncate">
                          {draft.title}
                        </div>
                        <div className="text-[11px] text-[#777D87]">
                          Edited {formatDate(draft.updatedAt)}
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

      {/* Write / Edit Post Modal */}
      {editorOpen && form && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#12151A] border border-[#252A32] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#252A32] flex items-center justify-between">
              <h2 className="font-heading font-semibold text-base">
                {form.id ? "Edit Blog Post" : "Write New Post"}
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
                    Title *
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
                        slug: form.id ? form.slug : slugify(next),
                      });
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.slug}
                    onChange={(e) =>
                      setForm({ ...form, slug: slugify(e.target.value) })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm font-mono text-[#F5F3EE]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as BlogFormState["status"],
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
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
                      {form.coverAssetUrl ? "Change Cover" : "Select Cover Image"}
                    </span>
                  </button>
                  {form.coverAssetId && (
                    <button
                      type="button"
                      onClick={() =>
                        setForm({
                          ...form,
                          coverAssetId: null,
                          coverAssetUrl: null,
                        })
                      }
                      className="text-xs text-[#F28B82] cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Categories Selection */}
              {stats.categories.length > 0 && (
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">
                    Categories
                  </label>
                  <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-[#0D0F12] border border-[#252A32]">
                    {stats.categories.map((cat) => {
                      const checked = form.categoryIds.includes(cat.id);
                      return (
                        <label
                          key={cat.id}
                          className={cn(
                            "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs cursor-pointer",
                            checked
                              ? "bg-[#D6B77A]/15 border-[#D6B77A]/50 text-[#F5E7C8]"
                              : "bg-[#12151A] border-[#252A32] text-[#9CA3AF]"
                          )}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => {
                              const nextIds = e.target.checked
                                ? [...form.categoryIds, cat.id]
                                : form.categoryIds.filter((id) => id !== cat.id);
                              setForm({ ...form, categoryIds: nextIds });
                            }}
                            className="sr-only"
                          />
                          <span>{cat.name}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#B2B4BA]">
                  Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  className="w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#B2B4BA]">
                  Body (Markdown) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={form.bodyMarkdown}
                  onChange={(e) =>
                    setForm({ ...form, bodyMarkdown: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm font-mono text-[#F5F3EE]"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] space-y-3">
                <div className="text-xs font-mono uppercase text-[#D6B77A]">
                  SEO &amp; Canonical
                </div>
                <input
                  type="text"
                  value={form.seoTitle}
                  onChange={(e) =>
                    setForm({ ...form, seoTitle: e.target.value })
                  }
                  placeholder="SEO Title"
                  className="w-full h-9 px-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                />
                <input
                  type="text"
                  value={form.canonicalUrl}
                  onChange={(e) =>
                    setForm({ ...form, canonicalUrl: e.target.value })
                  }
                  placeholder="Canonical URL (optional)"
                  className="w-full h-9 px-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                />
                <textarea
                  rows={2}
                  value={form.seoDescription}
                  onChange={(e) =>
                    setForm({ ...form, seoDescription: e.target.value })
                  }
                  placeholder="SEO Meta Description"
                  className="w-full p-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                />
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
                  <span>
                    {form.id ? "Save Article" : "Save / Publish Post"}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Categories Modal */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#12151A] border border-[#252A32] p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
                Manage Blog Categories
              </h2>
              <button
                type="button"
                onClick={() => setCatModalOpen(false)}
                className="text-[#777D87] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  type="text"
                  required
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    setNewCatSlug(slugify(e.target.value));
                  }}
                  placeholder="Category Name"
                  className="h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
                />
                <input
                  type="text"
                  required
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(slugify(e.target.value))}
                  placeholder="slug"
                  className="h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs font-mono text-[#F5F3EE]"
                />
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  placeholder="Optional description"
                  className="flex-1 h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
                />
                <button
                  type="submit"
                  className="px-4 h-9 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold cursor-pointer"
                >
                  Add
                </button>
              </div>
            </form>

            <div className="max-h-56 overflow-y-auto divide-y divide-[#252A32] border border-[#252A32] rounded-xl bg-[#0D0F12]">
              {stats.categories.map((cat) => (
                <div
                  key={cat.id}
                  className="px-3.5 py-2.5 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-medium text-[#F5F3EE]">
                      {cat.name}
                    </span>
                    <span className="ml-2 font-mono text-[10px] text-[#777D87]">
                      /{cat.slug} ({cat.count})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    aria-label={`Delete ${cat.name}`}
                    className="text-[#777D87] hover:text-[#F28B82] cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Article Preview Modal */}
      {previewPost && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl bg-[#0D0F12] border border-[#252A32] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#252A32] pb-3">
              <span className="text-xs font-mono text-[#D6B77A]">
                Article Preview · /{previewPost.slug}
              </span>
              <button
                type="button"
                onClick={() => setPreviewPost(null)}
                className="text-[#777D87] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {previewPost.coverAssetUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={previewPost.coverAssetUrl}
                alt={previewPost.title}
                className="w-full aspect-video object-cover rounded-xl border border-[#252A32]"
              />
            )}
            <h3 className="font-heading font-bold text-2xl text-[#F5F3EE]">
              {previewPost.title}
            </h3>
            <p className="text-sm text-[#B2B4BA]">{previewPost.excerpt}</p>
            <div className="text-sm text-[#E5E2DC] whitespace-pre-wrap leading-relaxed pt-2 border-t border-[#252A32]">
              {previewPost.bodyMarkdown}
            </div>
          </div>
        </div>
      )}

      <MediaPickerModal
        open={pickerOpen}
        title="Select Article Cover Image"
        selectedId={form?.coverAssetId}
        onClose={() => setPickerOpen(false)}
        onSelectSingle={(asset: MediaAssetItem) =>
          setForm((prev) =>
            prev
              ? {
                  ...prev,
                  coverAssetId: asset.id,
                  coverAssetUrl: asset.secureUrl,
                }
              : prev
          )
        }
      />
    </div>
  );
}
