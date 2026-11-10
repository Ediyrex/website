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
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useAdminUser } from "./AdminContext";
import { MediaPickerModal, type MediaAssetItem } from "./MediaPickerModal";

interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverAssetId: string | null;
  coverAssetUrl: string | null;
  status: "draft" | "published" | "archived";
  updatedAt: string;
}

interface BlogFormState {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  bodyMarkdown: string;
  coverAssetId: string | null;
  coverAssetUrl: string | null;
  status: "draft" | "published" | "archived";
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminBlogClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { canEdit } = useAdminUser();

  const [posts, setPosts] = useState<BlogPostRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<BlogFormState | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  const fetchPosts = useCallback(async () => {
    const params = new URLSearchParams({ limit: "50" });
    if (statusFilter) params.set("status", statusFilter);
    if (query.trim()) params.set("q", query.trim());

    const res = await fetch(`/api/v1/admin/blog?${params.toString()}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Unable to fetch blog posts.");
    return (json.data || []) as BlogPostRow[];
  }, [statusFilter, query, router]);

  useEffect(() => {
    let ignore = false;
    fetchPosts()
      .then((rows) => {
        if (!ignore && rows) setPosts(rows);
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
      const refreshed = await fetchPosts();
      if (refreshed) setPosts(refreshed);
    } catch {
      setError("Network error saving article.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (row: BlogPostRow) => {
    if (!window.confirm(`Delete article "${row.title}"?`)) return;
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/blog/${row.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to delete article.");
        return;
      }
      setPosts((prev) => prev.filter((p) => p.id !== row.id));
      setSuccess(`Deleted "${row.title}".`);
    } catch {
      setError("Network error deleting article.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
            Blog &amp; Insights
          </h1>
          <p className="text-sm text-[#8D939E]">
            Author editorial essays, engineering breakdowns, and studio announcements.
          </p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Blog Post</span>
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search posts by title, slug, or excerpt..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#111419] border border-[#1E222A] text-sm text-[#F5F3EE] placeholder-[#777D87]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg bg-[#111419] border border-[#1E222A] text-xs font-mono text-[#F5F3EE]"
        >
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
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

      <div className="rounded-xl bg-[#111419] border border-[#1E222A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E222A] text-[11px] font-mono uppercase text-[#777D87] bg-[#0B0D10]">
                <th className="py-3 px-4">Article</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Updated</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E222A] text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs font-mono text-[#777D87]">
                    Loading articles...
                  </td>
                </tr>
              ) : posts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs text-[#777D87]">
                    No blog articles yet. Click &ldquo;New Blog Post&rdquo; to create one.
                  </td>
                </tr>
              ) : (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#161920]">
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#F5F3EE]">{post.title}</div>
                      <div className="text-xs font-mono text-[#777D87]">/{post.slug}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={post.status === "published" ? "accent" : "default"}
                      >
                        {post.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#777D87]">
                      {new Date(post.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {canEdit && (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={async () => {
                              const mapped = await fetchPostById(post.id);
                              setForm(mapped);
                              setEditorOpen(true);
                            }}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#191D23] border border-[#252A32] text-xs cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(post)}
                            className="p-1.5 rounded-lg text-[#777D87] hover:text-[#F28B82] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>

      {editorOpen && form && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#12151A] border border-[#252A32] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#252A32] flex items-center justify-between">
              <h2 className="font-heading font-semibold text-base">
                {form.id ? "Edit Blog Post" : "Create Blog Post"}
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
                  <label className="text-xs font-mono text-[#B2B4BA]">Title *</label>
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
                  <label className="text-xs font-mono text-[#B2B4BA]">Slug *</label>
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
                  <label className="text-xs font-mono text-[#B2B4BA]">Status</label>
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
                        setForm({ ...form, coverAssetId: null, coverAssetUrl: null })
                      }
                      className="text-xs text-[#F28B82] cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#B2B4BA]">Excerpt *</label>
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
                  <span>{form.id ? "Save Article" : "Publish / Save Draft"}</span>
                </button>
              </div>
            </form>
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

