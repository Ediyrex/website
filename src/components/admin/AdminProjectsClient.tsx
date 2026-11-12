"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
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
  FolderKanban,
  CheckCircle2,
  Layers,
  LayoutGrid,
  List,
  MoreHorizontal,
  ExternalLink,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
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
  publishedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

interface PortfolioStats {
  totalAll: number;
  publishedCount: number;
  draftCount: number;
  categoriesCount: number;
  categories: string[];
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
  const [stats, setStats] = useState<PortfolioStats>({
    totalAll: 0,
    publishedCount: 0,
    draftCount: 0,
    categoriesCount: 0,
    categories: [],
  });
  const [serviceOptions, setServiceOptions] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [query, setQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [pageNum, setPageNum] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [totalFiltered, setTotalFiltered] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
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
    const params = new URLSearchParams({
      page: String(pageNum),
      limit: String(rowsPerPage),
    });
    if (statusFilter) params.set("status", statusFilter);
    if (categoryFilter) params.set("category", categoryFilter);
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
      total: (projJson.meta?.total ?? 0) as number,
      totalPages: (projJson.meta?.totalPages ?? 1) as number,
      stats: projJson.meta?.stats as PortfolioStats | undefined,
    };
  }, [pageNum, rowsPerPage, statusFilter, categoryFilter, query, router]);

  const loadProjects = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchProjectsData();
      if (result) {
        setProjectsList(result.projects);
        setServiceOptions(result.services);
        setTotalFiltered(result.total);
        setTotalPages(result.totalPages);
        if (result.stats) setStats(result.stats);
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
          setTotalFiltered(result.total);
          setTotalPages(result.totalPages);
          if (result.stats) setStats(result.stats);
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
      includeCaseStudy: true,
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
      setSuccess(`Deleted project "${proj.title}".`);
      await loadProjects();
    } catch {
      setError("Network error deleting project.");
    }
  };

  const startIdx = totalFiltered === 0 ? 0 : (pageNum - 1) * rowsPerPage + 1;
  const endIdx = Math.min(pageNum * rowsPerPage, totalFiltered);

  const formatCardDate = (proj: ProjectListRow) => {
    if (proj.projectDate) return proj.projectDate;
    const raw = proj.publishedAt || proj.updatedAt || proj.createdAt;
    if (!raw) return "Draft";
    return new Date(raw).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-[28px] tracking-tight text-[#F5F3EE]">
            Portfolio
          </h1>
          <p className="text-sm text-[#8D939E]">
            Manage your portfolio projects, case studies, and creative work.
          </p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Portfolio Project</span>
          </button>
        )}
      </div>

      {/* 4-Card KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF]">
            <span className="p-2 rounded-lg bg-[#1A160E] border border-[#D6B77A]/30 text-[#D6B77A]">
              <FolderKanban className="w-4 h-4" />
            </span>
            <span>Total Projects</span>
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

        <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2.5">
          <div className="flex items-center gap-2.5 text-xs text-[#9CA3AF]">
            <span className="p-2 rounded-lg bg-[#1A160E] border border-[#D6B77A]/30 text-[#D6B77A]">
              <Layers className="w-4 h-4" />
            </span>
            <span>Categories</span>
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats.categoriesCount}
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
              placeholder="Search projects..."
              className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#111419] border border-[#1E222A] text-sm text-[#F5F3EE] placeholder-[#6D7480] focus:outline-none focus:border-[#D6B77A]"
            />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPageNum(1);
            }}
            aria-label="Filter projects by category"
            className="h-10 px-3 rounded-lg bg-[#111419] border border-[#1E222A] text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
          >
            <option value="">All Categories</option>
            {stats.categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPageNum(1);
            }}
            aria-label="Filter projects by status"
            className="h-10 px-3 rounded-lg bg-[#111419] border border-[#1E222A] text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
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

      {/* Grid View (Default matching mockup) */}
      {viewMode === "grid" ? (
        loading ? (
          <div className="py-14 text-center text-xs font-mono text-[#777D87]">
            Loading portfolio projects...
          </div>
        ) : projectsList.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#111419] border border-[#1E222A] text-center space-y-2">
            <p className="text-sm text-[#F5F3EE]">No portfolio projects found.</p>
            <p className="text-xs text-[#777D87]">
              Adjust your search/filters or click Add Portfolio Project to create one.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projectsList.map((proj) => (
              <article
                key={proj.id}
                onClick={() =>
                  canEdit
                    ? openEditModal(proj.id, false)
                    : openEditModal(proj.id, true)
                }
                className="group rounded-2xl bg-[#111419] border border-[#1E222A] hover:border-[#D6B77A]/40 transition-colors overflow-hidden flex flex-col justify-between relative cursor-pointer"
              >
                {/* Visual Top Card Frame */}
                <div className="aspect-[16/9] bg-[#0B0D10] relative overflow-hidden border-b border-[#1E222A]">
                  {proj.coverAssetUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={proj.coverAssetUrl}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#231D13] via-[#13161D] to-[#0B0D10] flex items-center justify-center">
                      <FolderKanban className="w-9 h-9 text-[#D6B77A]/40" />
                    </div>
                  )}

                  {/* Top Left Status Pill */}
                  <div className="absolute top-3 left-3 z-10">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border backdrop-blur-sm",
                        proj.status === "published"
                          ? "bg-[#0D2117]/85 text-[#7CD69F] border-[#54C99A]/40"
                          : proj.status === "draft"
                            ? "bg-[#241D11]/85 text-[#D6B77A] border-[#D6B77A]/40"
                            : "bg-[#15181F]/85 text-[#9CA3AF] border-[#252A32]"
                      )}
                    >
                      <span
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          proj.status === "published"
                            ? "bg-[#7CD69F]"
                            : proj.status === "draft"
                              ? "bg-[#D6B77A]"
                              : "bg-[#9CA3AF]"
                        )}
                      />
                      <span className="capitalize">{proj.status}</span>
                    </span>
                  </div>

                  {/* Top Right Menu Trigger */}
                  <div
                    className="absolute top-3 right-3 z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenMenuId(openMenuId === proj.id ? null : proj.id)
                      }
                      aria-label={`Actions for ${proj.title}`}
                      className="w-8 h-8 rounded-lg bg-[#0B0D10]/80 border border-[#252A32] text-[#B2B4BA] hover:text-white flex items-center justify-center backdrop-blur-sm cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {openMenuId === proj.id && (
                      <div className="absolute right-0 top-10 w-44 py-1.5 rounded-xl bg-[#14181F] border border-[#252A32] shadow-2xl text-xs z-30">
                        <button
                          type="button"
                          onClick={() => {
                            setOpenMenuId(null);
                            openEditModal(proj.id, true);
                          }}
                          className="w-full px-3.5 py-2 text-left text-[#F5F3EE] hover:bg-[#1C212B] flex items-center gap-2 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Preview</span>
                        </button>
                        {canEdit && (
                          <>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                openEditModal(proj.id, false);
                              }}
                              className="w-full px-3.5 py-2 text-left text-[#D6B77A] hover:bg-[#1C212B] flex items-center gap-2 cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit Project</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setOpenMenuId(null);
                                handleDeleteProject(proj);
                              }}
                              className="w-full px-3.5 py-2 text-left text-[#F28B82] hover:bg-[#2A1414] flex items-center gap-2 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete Project</span>
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 flex-1 flex flex-col justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          canEdit
                            ? openEditModal(proj.id, false)
                            : openEditModal(proj.id, true)
                        }
                        className="text-left font-heading font-semibold text-[15px] text-[#F5F3EE] hover:text-[#D6B77A] transition-colors line-clamp-1 cursor-pointer"
                      >
                        {proj.title}
                      </button>
                      <Link
                        href={`/work/${proj.slug}`}
                        target="_blank"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Open public page for ${proj.title}`}
                        className="text-[#777D87] hover:text-[#F5F3EE] shrink-0 mt-0.5"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                    <div className="text-xs text-[#777D87] truncate">
                      {proj.industry || "Studio Showcase"} ·{" "}
                      <span className="capitalize">{proj.projectType}</span>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-[#1E222A] flex items-center justify-between text-[11px] text-[#8D939E]">
                    <span className="inline-flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#6D7480]" />
                      <span>{formatCardDate(proj)}</span>
                    </span>
                    <span className="font-mono text-[#777D87]">
                      {proj.isFeatured ? "★ Featured" : `#${proj.displayOrder}`}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )
      ) : (
        /* List View Table */
        <div className="rounded-xl bg-[#111419] border border-[#1E222A] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#1E222A] text-[11px] font-mono uppercase tracking-wider text-[#6D7480] bg-[#0B0D10]">
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4">Order</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E222A] text-sm">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-xs font-mono text-[#777D87]"
                    >
                      Loading projects...
                    </td>
                  </tr>
                ) : projectsList.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-8 text-center text-xs text-[#777D87]"
                    >
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  projectsList.map((proj) => (
                    <tr key={proj.id} className="hover:bg-[#151920]">
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
                            <div className="font-medium text-[#F5F3EE]">
                              {proj.title}
                            </div>
                            <div className="text-xs font-mono text-[#777D87]">
                              /{proj.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#B2B4BA]">
                        {proj.industry || proj.projectType}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            proj.status === "published" ? "accent" : "default"
                          }
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
      )}

      {/* Pagination Footer */}
      <div className="px-4 py-3 rounded-xl bg-[#111419] border border-[#1E222A] flex flex-wrap items-center justify-between gap-4 text-xs text-[#8D939E]">
        <div>
          Showing {startIdx}–{endIdx} of {totalFiltered} projects
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
              className="h-8 px-2 rounded bg-[#0B0D10] border border-[#1E222A] text-xs text-[#F5F3EE]"
            >
              <option value={6}>6</option>
              <option value={12}>12</option>
              <option value={24}>24</option>
            </select>
          </label>

          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              disabled={pageNum <= 1}
              onClick={() => setPageNum((p) => Math.max(1, p - 1))}
              className="w-8 h-8 rounded-md bg-[#0B0D10] border border-[#1E222A] flex items-center justify-center disabled:opacity-40 cursor-pointer"
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
              className="w-8 h-8 rounded-md bg-[#0B0D10] border border-[#1E222A] flex items-center justify-center disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
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
                    <option value="client">Client Project (Shipped)</option>
                    <option value="internal">Internal Platform (R&amp;D)</option>
                  </select>
                  <p className="text-[11px] text-[#777D87]">
                    Controls public case-study status &amp; deliverables heading
                    (Shipped, Concept, or R&amp;D).
                  </p>
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
                      placeholder={
                        form.projectType === "client"
                          ? "Delivered Solution *"
                          : form.projectType === "internal"
                          ? "Experiments & Technical Findings *"
                          : "Proposed Solution & Design Outputs *"
                      }
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
