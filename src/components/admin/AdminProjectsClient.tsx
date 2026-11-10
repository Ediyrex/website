"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  X,
  Image as ImageIcon,
  Images,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useAdminUser } from "./AdminContext";
import { MediaPickerModal, type MediaAssetItem } from "./MediaPickerModal";

interface ProjectListRow {
  id: string;
  title: string;
  slug: string;
  summary: string;
  projectType: "client" | "concept" | "internal";
  industry: string | null;
  clientName: string | null;
  clientIsPublic: boolean;
  projectDate: string | null;
  coverAssetId: string | null;
  coverAssetUrl: string | null;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  displayOrder: number;
}

interface ServiceOption {
  id: string;
  title: string;
  divisionName: string;
}

interface ProjectFormState {
  id?: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  projectType: "client" | "concept" | "internal";
  industry: string;
  clientName: string;
  clientIsPublic: boolean;
  projectDate: string;
  techStack: string[];
  coverAssetId: string | null;
  coverAssetUrl: string | null;
  galleryAssets: { id: string; secureUrl: string; altText: string }[];
  serviceIds: string[];
  liveUrl: string;
  repositoryUrl: string;
  isFeatured: boolean;
  displayOrder: number;
  status: "draft" | "published" | "archived";
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageAssetId: string | null;
  noIndex: boolean;
  includeCaseStudy: boolean;
  challenge: string;
  approach: string;
  solution: string;
  verifiedOutcomes: string[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminProjectsClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { canEdit } = useAdminUser();

  const [projectsList, setProjectsList] = useState<ProjectListRow[]>([]);
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProjectFormState | null>(null);
  const [techDraft, setTechDraft] = useState("");
  const [outcomeDraft, setOutcomeDraft] = useState("");
  const [pickerMode, setPickerMode] = useState<
    "cover" | "gallery" | "og" | null
  >(null);

  const fetchProjectsData = useCallback(async () => {
    const params = new URLSearchParams({ limit: "50" });
    if (statusFilter) params.set("status", statusFilter);
    if (query.trim()) params.set("q", query.trim());

    const [projRes, svcRes] = await Promise.all([
      fetch(`/api/v1/admin/projects?${params.toString()}`),
      fetch("/api/v1/admin/services?limit=50"),
    ]);

    if (projRes.status === 401) {
      router.push("/admin/login");
      return null;
    }

    const [projJson, svcJson] = await Promise.all([projRes.json(), svcRes.json()]);
    if (!projRes.ok) {
      throw new Error(projJson.message || "Unable to fetch projects.");
    }

    return {
      projects: (projJson.data || []) as ProjectListRow[],
      services: (svcJson.data || []) as ServiceOption[],
    };
  }, [statusFilter, query, router]);

  const loadProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchProjectsData();
      if (result) {
        setProjectsList(result.projects);
        setServiceOptions(result.services);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error loading projects."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchProjectsData()
      .then((result) => {
        if (!ignore && result) {
          setProjectsList(result.projects);
          setServiceOptions(result.services);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Network error loading projects."
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fetchProjectsData]);

  const openCreateModal = useCallback(() => {
    setForm({
      title: "",
      slug: "",
      summary: "",
      description: "",
      projectType: "concept",
      industry: "",
      clientName: "",
      clientIsPublic: false,
      projectDate: "",
      techStack: [],
      coverAssetId: null,
      coverAssetUrl: null,
      galleryAssets: [],
      serviceIds: [],
      liveUrl: "",
      repositoryUrl: "",
      isFeatured: false,
      displayOrder: projectsList.length + 1,
      status: "draft",
      seoTitle: "",
      seoDescription: "",
      ogTitle: "",
      ogDescription: "",
      ogImageAssetId: null,
      noIndex: false,
      includeCaseStudy: false,
      challenge: "",
      approach: "",
      solution: "",
      verifiedOutcomes: [],
    });
    setTechDraft("");
    setOutcomeDraft("");
    setEditorOpen(true);
  }, [projectsList.length]);

  const fetchProjectFormById = useCallback(async (id: string): Promise<ProjectFormState> => {
    const res = await fetch(`/api/v1/admin/projects/${id}`);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Unable to load project details.");
    }
    const d = json.data;
    return {
      id: d.id,
      title: d.title,
      slug: d.slug,
      summary: d.summary,
      description: d.description,
      projectType: d.projectType,
      industry: d.industry || "",
      clientName: d.clientName || "",
      clientIsPublic: Boolean(d.clientIsPublic),
      projectDate: d.projectDate || "",
      techStack: Array.isArray(d.techStack) ? d.techStack : [],
      coverAssetId: d.coverAssetId || null,
      coverAssetUrl: d.coverAsset?.secureUrl || null,
      galleryAssets: Array.isArray(d.galleryAssets) ? d.galleryAssets : [],
      serviceIds: Array.isArray(d.serviceIds) ? d.serviceIds : [],
      liveUrl: d.liveUrl || "",
      repositoryUrl: d.repositoryUrl || "",
      isFeatured: Boolean(d.isFeatured),
      displayOrder: d.displayOrder ?? 0,
      status: d.status || "draft",
      seoTitle: d.seoTitle || "",
      seoDescription: d.seoDescription || "",
      ogTitle: d.ogTitle || "",
      ogDescription: d.ogDescription || "",
      ogImageAssetId: d.ogImageAssetId || null,
      noIndex: Boolean(d.noIndex),
      includeCaseStudy: Boolean(d.caseStudy),
      challenge: d.caseStudy?.challenge || "",
      approach: d.caseStudy?.approach || "",
      solution: d.caseStudy?.solution || "",
      verifiedOutcomes: Array.isArray(d.caseStudy?.verifiedOutcomes)
        ? d.caseStudy.verifiedOutcomes
        : [],
    };
  }, []);

  const openEditModal = useCallback(
    async (id: string, previewOnly = false) => {
      setError("");
      try {
        const mapped = await fetchProjectFormById(id);
        setForm(mapped);
        if (previewOnly) {
          setPreviewOpen(true);
        } else {
          setEditorOpen(true);
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Network error loading project record."
        );
      }
    },
    [fetchProjectFormById]
  );

  useEffect(() => {
    const editId = searchParams.get("edit");
    const createFlag = searchParams.get("create");
    let ignore = false;

    if (editId) {
      fetchProjectFormById(editId)
        .then((mapped) => {
          if (!ignore) {
            setForm(mapped);
            setEditorOpen(true);
          }
        })
        .catch((err) => {
          if (!ignore) {
            setError(
              err instanceof Error
                ? err.message
                : "Network error loading project record."
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
  }, [searchParams, editorOpen, form, openCreateModal, fetchProjectFormById]);

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      description: form.description,
      projectType: form.projectType,
      industry: form.industry || null,
      clientName: form.projectType === "client" ? form.clientName || null : null,
      clientIsPublic: form.projectType === "client" ? form.clientIsPublic : false,
      projectDate: form.projectDate || null,
      techStack: form.techStack,
      coverAssetId: form.coverAssetId,
      galleryAssetIds: form.galleryAssets.map((g) => g.id),
      serviceIds: form.serviceIds,
      liveUrl: form.liveUrl || null,
      repositoryUrl: form.repositoryUrl || null,
      isFeatured: form.isFeatured,
      displayOrder: form.displayOrder,
      status: form.status,
      seoTitle: form.seoTitle || null,
      seoDescription: form.seoDescription || null,
      ogTitle: form.ogTitle || null,
      ogDescription: form.ogDescription || null,
      ogImageAssetId: form.ogImageAssetId,
      noIndex: form.noIndex,
      caseStudy: form.includeCaseStudy
        ? {
            challenge: form.challenge,
            approach: form.approach,
            solution: form.solution,
            verifiedOutcomes: form.verifiedOutcomes,
            processSteps: [],
          }
        : null,
    };

    try {
      const endpoint = form.id
        ? `/api/v1/admin/projects/${form.id}`
        : "/api/v1/admin/projects";
      const method = form.id ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to save project.");
        return;
      }

      setEditorOpen(false);
      setSuccess(
        form.id ? "Project updated successfully." : "New project created."
      );
      await loadProjects();
    } catch {
      setError("Network error saving project.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProject = async (proj: ProjectListRow) => {
    if (
      !window.confirm(
        `Delete project "${proj.title}"? This removes its linked case study and gallery links.`
      )
    ) {
      return;
    }
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/v1/admin/projects/${proj.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to delete project.");
        return;
      }
      setProjectsList((prev) => prev.filter((item) => item.id !== proj.id));
      setSuccess(`Deleted project "${proj.title}".`);
    } catch {
      setError("Network error deleting project.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
            Projects &amp; Case Studies
          </h1>
          <p className="text-sm text-[#B2B4BA]">
            Create, edit, preview, order, and publish portfolio projects, media galleries, and SEO metadata.
          </p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search project title, slug, industry, or client..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#12151A] border border-[#252A32] text-sm text-[#F5F3EE] placeholder-[#777D87] focus:outline-none focus:border-[#D6B77A]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs font-mono text-[#F5F3EE]"
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

      {/* Projects Table */}
      <div className="rounded-xl bg-[#12151A] border border-[#252A32] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252A32] text-[11px] font-mono uppercase tracking-wider text-[#777D87] bg-[#0D0F12]">
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Featured</th>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252A32] text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-mono text-[#777D87]">
                    Loading projects...
                  </td>
                </tr>
              ) : projectsList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#777D87]">
                    No projects found.
                  </td>
                </tr>
              ) : (
                projectsList.map((proj) => (
                  <tr key={proj.id} className="hover:bg-[#161A20]">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {proj.coverAssetUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={proj.coverAssetUrl}
                            alt={proj.title}
                            className="w-12 h-9 rounded-lg object-cover border border-[#252A32] shrink-0"
                          />
                        ) : (
                          <div className="w-12 h-9 rounded-lg bg-[#0D0F12] border border-[#252A32] flex items-center justify-center text-[#777D87] shrink-0">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-[#F5F3EE]">{proj.title}</div>
                          <div className="text-xs font-mono text-[#777D87]">
                            /{proj.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={proj.projectType === "concept" ? "concept" : "default"}
                      >
                        {proj.projectType}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={proj.status === "published" ? "accent" : "default"}
                      >
                        {proj.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#B2B4BA]">
                      {proj.isFeatured ? "Featured" : "Standard"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-[#777D87]">
                      #{proj.displayOrder}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => openEditModal(proj.id, true)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#B2B4BA] hover:text-white cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                        {canEdit && (
                          <>
                            <button
                              type="button"
                              onClick={() => openEditModal(proj.id, false)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#191D23] border border-[#252A32] text-xs text-[#F5F3EE] hover:border-[#D6B77A] cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteProject(proj)}
                              aria-label={`Delete ${proj.title}`}
                              className="p-1.5 rounded-lg text-[#777D87] hover:text-[#F28B82] hover:bg-[#2A1414] cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create / Edit Modal */}
      {editorOpen && form && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-2xl bg-[#12151A] border border-[#252A32] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#252A32] flex items-center justify-between">
              <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
                {form.id ? `Edit Project — ${form.title}` : "Create New Project"}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#191D23] border border-[#252A32] text-xs text-[#F5F3EE] cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="p-2 rounded-lg text-[#B2B4BA] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSaveProject}
              className="flex-1 overflow-y-auto p-6 space-y-6"
            >
              {/* Core Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">Title *</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => {
                      const nextTitle = e.target.value;
                      setForm({
                        ...form,
                        title: nextTitle,
                        slug: form.id ? form.slug : slugify(nextTitle),
                      });
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">URL Slug *</label>
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

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">Project Type</label>
                  <select
                    value={form.projectType}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        projectType: e.target.value as ProjectFormState["projectType"],
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                  >
                    <option value="concept">Concept / Studio R&amp;D</option>
                    <option value="client">Client Project</option>
                    <option value="internal">Internal Platform</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as ProjectFormState["status"],
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">
                    Category / Industry
                  </label>
                  <input
                    type="text"
                    value={form.industry}
                    onChange={(e) =>
                      setForm({ ...form, industry: e.target.value })
                    }
                    placeholder="e.g., AI Automation, SaaS, Brand Film"
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">
                    Project Date
                  </label>
                  <input
                    type="text"
                    value={form.projectDate}
                    onChange={(e) =>
                      setForm({ ...form, projectDate: e.target.value })
                    }
                    placeholder="e.g., 2026-10 or Q4 2026"
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                  />
                </div>
              </div>

              {form.projectType === "client" && (
                <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-[#B2B4BA]">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={form.clientName}
                      onChange={(e) =>
                        setForm({ ...form, clientName: e.target.value })
                      }
                      className="w-full h-9 px-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                    />
                  </div>
                  <label className="inline-flex items-center gap-2 text-xs text-[#F5F3EE] cursor-pointer pt-4">
                    <input
                      type="checkbox"
                      checked={form.clientIsPublic}
                      onChange={(e) =>
                        setForm({ ...form, clientIsPublic: e.target.checked })
                      }
                    />
                    <span>Display client name publicly</span>
                  </label>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#B2B4BA]">
                  Short Description * (10–400 chars)
                </label>
                <textarea
                  rows={2}
                  required
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#B2B4BA]">
                  Full Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                />
              </div>

              {/* Cover & Gallery Media */}
              <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs font-mono uppercase text-[#D6B77A]">
                    Cover &amp; Project Gallery
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setPickerMode("cover")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191D23] border border-[#252A32] text-xs text-[#F5F3EE] cursor-pointer"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>
                        {form.coverAssetUrl ? "Change Cover" : "Select Cover Image"}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPickerMode("gallery")}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#191D23] border border-[#252A32] text-xs text-[#F5F3EE] cursor-pointer"
                    >
                      <Images className="w-3.5 h-3.5" />
                      <span>Gallery ({form.galleryAssets.length})</span>
                    </button>
                  </div>
                </div>

                {form.coverAssetUrl && (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={form.coverAssetUrl}
                      alt="Cover preview"
                      className="w-24 h-14 rounded-lg object-cover border border-[#252A32]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setForm({ ...form, coverAssetId: null, coverAssetUrl: null })
                      }
                      className="text-xs text-[#F28B82] cursor-pointer"
                    >
                      Remove cover
                    </button>
                  </div>
                )}

                {form.galleryAssets.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {form.galleryAssets.map((g) => (
                      <div key={g.id} className="relative group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={g.secureUrl}
                          alt={g.altText || "Gallery"}
                          className="w-16 h-12 rounded object-cover border border-[#252A32]"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              galleryAssets: form.galleryAssets.filter(
                                (item) => item.id !== g.id
                              ),
                            })
                          }
                          className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-[#2A1414] text-[#F28B82] text-[10px] leading-none cursor-pointer"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tech Stack & Services */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-mono text-[#B2B4BA]">
                    Technologies Involved
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={techDraft}
                      onChange={(e) => setTechDraft(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          const t = techDraft.trim();
                          if (t) {
                            setForm({ ...form, techStack: [...form.techStack, t] });
                            setTechDraft("");
                          }
                        }
                      }}
                      placeholder="e.g., Next.js, LangGraph"
                      className="flex-1 h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const t = techDraft.trim();
                        if (t) {
                          setForm({ ...form, techStack: [...form.techStack, t] });
                          setTechDraft("");
                        }
                      }}
                      className="px-3 h-9 rounded-lg bg-[#191D23] border border-[#3A414B] text-xs cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {form.techStack.map((t, i) => (
                      <span
                        key={`${t}-${i}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#0D0F12] border border-[#252A32] text-[11px]"
                      >
                        {t}
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              techStack: form.techStack.filter((_, idx) => idx !== i),
                            })
                          }
                          className="text-[#777D87] hover:text-[#F28B82] cursor-pointer"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-mono text-[#B2B4BA]">
                    Linked Studio Services
                  </label>
                  <div className="max-h-32 overflow-y-auto p-2.5 rounded-lg bg-[#0D0F12] border border-[#252A32] space-y-1.5">
                    {serviceOptions.map((svc) => (
                      <label
                        key={svc.id}
                        className="flex items-center gap-2 text-xs text-[#E5E2DC] cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={form.serviceIds.includes(svc.id)}
                          onChange={(e) => {
                            const nextIds = e.target.checked
                              ? [...form.serviceIds, svc.id]
                              : form.serviceIds.filter((id) => id !== svc.id);
                            setForm({ ...form, serviceIds: nextIds });
                          }}
                        />
                        <span className="truncate">
                          {svc.title}{" "}
                          <span className="text-[#777D87]">({svc.divisionName})</span>
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Links, Order & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-mono text-[#B2B4BA]">Live URL</label>
                  <input
                    type="url"
                    value={form.liveUrl}
                    onChange={(e) => setForm({ ...form, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">Order</label>
                  <input
                    type="number"
                    min={0}
                    value={form.displayOrder}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        displayOrder: Number(e.target.value) || 0,
                      })
                    }
                    className="w-full h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
                  />
                </div>
                <label className="inline-flex items-center gap-2 h-9 text-xs text-[#F5F3EE] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm({ ...form, isFeatured: e.target.checked })
                    }
                  />
                  <span>Featured</span>
                </label>
              </div>

              {/* Optional Case Study */}
              <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] space-y-3">
                <label className="inline-flex items-center gap-2 text-xs font-mono uppercase text-[#D6B77A] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.includeCaseStudy}
                    onChange={(e) =>
                      setForm({ ...form, includeCaseStudy: e.target.checked })
                    }
                  />
                  <span>Include Case Study Breakdown</span>
                </label>

                {form.includeCaseStudy && (
                  <div className="space-y-3 pt-2">
                    <textarea
                      rows={2}
                      required
                      value={form.challenge}
                      onChange={(e) =>
                        setForm({ ...form, challenge: e.target.value })
                      }
                      placeholder="Challenge *"
                      className="w-full p-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                    />
                    <textarea
                      rows={2}
                      required
                      value={form.approach}
                      onChange={(e) =>
                        setForm({ ...form, approach: e.target.value })
                      }
                      placeholder="Architecture / Approach *"
                      className="w-full p-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                    />
                    <textarea
                      rows={2}
                      required
                      value={form.solution}
                      onChange={(e) =>
                        setForm({ ...form, solution: e.target.value })
                      }
                      placeholder="Delivered Solution *"
                      className="w-full p-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                    />

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={outcomeDraft}
                        onChange={(e) => setOutcomeDraft(e.target.value)}
                        placeholder="Add verified outcome..."
                        className="flex-1 h-9 px-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const o = outcomeDraft.trim();
                          if (o) {
                            setForm({
                              ...form,
                              verifiedOutcomes: [...form.verifiedOutcomes, o],
                            });
                            setOutcomeDraft("");
                          }
                        }}
                        className="px-3 h-9 rounded-lg bg-[#191D23] border border-[#3A414B] text-xs cursor-pointer"
                      >
                        Add Outcome
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.verifiedOutcomes.map((o, i) => (
                        <span
                          key={`${o}-${i}`}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#12151A] border border-[#252A32] text-[11px]"
                        >
                          {o}
                          <button
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                verifiedOutcomes: form.verifiedOutcomes.filter(
                                  (_, idx) => idx !== i
                                ),
                              })
                            }
                            className="text-[#777D87] hover:text-[#F28B82] cursor-pointer"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SEO & Open Graph */}
              <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] space-y-3">
                <div className="text-xs font-mono uppercase text-[#D6B77A]">
                  SEO &amp; Open Graph Metadata
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={form.seoTitle}
                    onChange={(e) =>
                      setForm({ ...form, seoTitle: e.target.value })
                    }
                    placeholder="SEO Title"
                    className="h-9 px-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                  />
                  <input
                    type="text"
                    value={form.ogTitle}
                    onChange={(e) =>
                      setForm({ ...form, ogTitle: e.target.value })
                    }
                    placeholder="Open Graph Title"
                    className="h-9 px-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                  />
                </div>
                <textarea
                  rows={2}
                  value={form.seoDescription}
                  onChange={(e) =>
                    setForm({ ...form, seoDescription: e.target.value })
                  }
                  placeholder="SEO Meta Description"
                  className="w-full p-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                />
                <textarea
                  rows={2}
                  value={form.ogDescription}
                  onChange={(e) =>
                    setForm({ ...form, ogDescription: e.target.value })
                  }
                  placeholder="Open Graph Description"
                  className="w-full p-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE]"
                />
                <div className="flex flex-wrap items-center justify-between gap-3">
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
                  <button
                    type="button"
                    onClick={() => setPickerMode("og")}
                    className="text-xs text-[#D6B77A] hover:underline cursor-pointer"
                  >
                    {form.ogImageAssetId ? "Change OG Image" : "Select OG Image"}
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 border-t border-[#252A32]">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 rounded-lg text-xs text-[#B2B4BA] hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] disabled:opacity-50 cursor-pointer"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{form.id ? "Save Project" : "Create Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Preview Modal (PLR 5.3 "Preview project information before publication") */}
      {previewOpen && form && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[88vh] overflow-y-auto rounded-2xl bg-[#0D0F12] border border-[#252A32] p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#252A32] pb-3">
              <div className="flex items-center gap-2">
                <Badge variant="accent">Pre-Publish Preview</Badge>
                <Badge variant={form.status === "published" ? "accent" : "default"}>
                  {form.status}
                </Badge>
              </div>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="text-[#777D87] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {form.coverAssetUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={form.coverAssetUrl}
                alt={form.title}
                className="w-full aspect-video object-cover rounded-xl border border-[#252A32]"
              />
            )}

            <div className="space-y-2">
              <div className="text-xs font-mono text-[#D6B77A]">
                /work/{form.slug || "slug"} · {form.projectType.toUpperCase()}
                {form.industry ? ` · ${form.industry}` : ""}
              </div>
              <h3 className="font-heading font-bold text-2xl text-[#F5F3EE]">
                {form.title || "Untitled Project"}
              </h3>
              <p className="text-sm text-[#B2B4BA]">{form.summary}</p>
            </div>

            <div className="text-sm text-[#E5E2DC] whitespace-pre-wrap leading-relaxed">
              {form.description}
            </div>

            {form.techStack.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.techStack.map((t, i) => (
                  <span
                    key={`${t}-${i}`}
                    className="px-2.5 py-1 rounded-full bg-[#12151A] border border-[#252A32] text-xs text-[#D6B77A]"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <MediaPickerModal
        open={pickerMode !== null}
        multi={pickerMode === "gallery"}
        title={
          pickerMode === "gallery"
            ? "Select Gallery Images"
            : pickerMode === "og"
              ? "Select Open Graph Image"
              : "Select Project Cover Image"
        }
        selectedId={
          pickerMode === "cover"
            ? form?.coverAssetId
            : pickerMode === "og"
              ? form?.ogImageAssetId
              : undefined
        }
        selectedIds={
          pickerMode === "gallery"
            ? form?.galleryAssets.map((g) => g.id)
            : undefined
        }
        onClose={() => setPickerMode(null)}
        onSelectSingle={(asset: MediaAssetItem) => {
          if (!form) return;
          if (pickerMode === "cover") {
            setForm({
              ...form,
              coverAssetId: asset.id,
              coverAssetUrl: asset.secureUrl,
            });
          } else if (pickerMode === "og") {
            setForm({ ...form, ogImageAssetId: asset.id });
          }
        }}
        onSelectMulti={(assets: MediaAssetItem[]) => {
          if (!form) return;
          setForm({
            ...form,
            galleryAssets: assets.map((a) => ({
              id: a.id,
              secureUrl: a.secureUrl,
              altText: a.altText,
            })),
          });
        }}
      />
    </div>
  );
}
