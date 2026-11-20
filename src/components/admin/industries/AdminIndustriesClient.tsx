"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  X,
  FolderPlus,
  Loader2,
  Layers,
  CheckCircle2,
  LayoutGrid,
  List,
  MoreHorizontal,
  ExternalLink,
  Sparkles,
  Building,
  Eye,
  AlertTriangle,
  Lightbulb,
  HelpCircle,
  Cpu,
  ArrowUpRight,
  Star,
  Check,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useAdminUser } from "../AdminContext";
import { MediaPickerModal, type MediaAssetItem } from "../MediaPickerModal";
import { PublicIndustryPreviewModal } from "./PublicIndustryPreviewModal";

interface IndustryRow {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  shortDescription: string;
  description: string;
  heroHeadline?: string | null;
  heroDescription?: string | null;
  heroSupportingLabel?: string | null;
  ctaLabel?: string | null;
  ctaDestination?: string | null;
  subIndustries: string[];
  deliverables: string[];
  challenges: { title: string; description: string; displayOrder?: number }[];
  opportunities: { title: string; description: string; displayOrder?: number }[];
  solutions: {
    title: string;
    description: string;
    serviceIds?: string[];
    divisionIds?: string[];
    displayOrder?: number;
  }[];
  faqs: { question: string; answer: string; displayOrder?: number }[];
  coverImageUrl: string;
  coverAssetId: string | null;
  coverAssetUrl: string | null;
  displayOrder: number;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  isHeroFeatured: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  publishedAt?: string | null;
  services?: { industryId: string; serviceId: string; title: string; divisionSlug: string }[];
  sectorArchitectures?: { industryId: string; architectureId: string; title: string; category: string }[];
  projects?: { industryId: string; projectId: string; title: string; slug: string }[];
}

interface SectorArchitectureRow {
  id: string;
  slug: string;
  number?: string | null;
  category: string;
  title: string;
  description: string;
  capabilities: string[];
  displayOrder: number;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  isHighlighted: boolean;
  detailRoute?: string | null;
  industryIds?: string[];
  industries?: { id: string; name: string }[];
}

interface IndustryFormState {
  id?: string;
  name: string;
  slug: string;
  tagline: string;
  shortDescription: string;
  description: string;
  heroHeadline: string;
  heroDescription: string;
  heroSupportingLabel: string;
  ctaLabel: string;
  ctaDestination: string;
  subIndustries: string[];
  deliverables: string[];
  challenges: { title: string; description: string; displayOrder?: number }[];
  opportunities: { title: string; description: string; displayOrder?: number }[];
  solutions: {
    title: string;
    description: string;
    serviceIds?: string[];
    divisionIds?: string[];
    displayOrder?: number;
  }[];
  faqs: { question: string; answer: string; displayOrder?: number }[];
  coverImageUrl: string;
  coverAssetId: string | null;
  coverAssetUrl: string | null;
  displayOrder: number;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  isHeroFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  serviceIds: string[];
  divisionIds: string[];
  sectorArchitectureIds: string[];
  projectIds: string[];
}

interface ArchitectureFormState {
  id?: string;
  slug: string;
  number: string;
  category: string;
  title: string;
  description: string;
  capabilities: string[];
  displayOrder: number;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  isHighlighted: boolean;
  detailRoute: string;
  industryIds: string[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminIndustriesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { canEdit, isAdmin } = useAdminUser();

  const [activeTab, setActiveTab] = useState<"directory" | "architectures" | "hero">("directory");

  const [industriesList, setIndustriesList] = useState<IndustryRow[]>([]);
  const [architecturesList, setArchitecturesList] = useState<SectorArchitectureRow[]>([]);
  const [availableServices, setAvailableServices] = useState<{ id: string; title: string; divisionSlug: string }[]>([]);
  const [availableProjects, setAvailableProjects] = useState<{ id: string; title: string; slug: string }[]>([]);

  const [stats, setStats] = useState({
    totalAll: 0,
    publishedCount: 0,
    draftCount: 0,
    featuredCount: 0,
    sectorArchitecturesCount: 0,
  });

  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [featuredFilter, setFeaturedFilter] = useState("");
  const [architectureFilter, setArchitectureFilter] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Industry Drawer
  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<IndustryFormState | null>(null);
  const [previewIndustry, setPreviewIndustry] = useState<IndustryFormState | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

  // Sub-item drafts
  const [subIndustryDraft, setSubIndustryDraft] = useState("");
  const [deliverableDraft, setDeliverableDraft] = useState("");
  const [challengeDraftTitle, setChallengeDraftTitle] = useState("");
  const [challengeDraftDesc, setChallengeDraftDesc] = useState("");
  const [oppDraftTitle, setOppDraftTitle] = useState("");
  const [oppDraftDesc, setOppDraftDesc] = useState("");
  const [solDraftTitle, setSolDraftTitle] = useState("");
  const [solDraftDesc, setSolDraftDesc] = useState("");
  const [faqDraftQ, setFaqDraftQ] = useState("");
  const [faqDraftA, setFaqDraftA] = useState("");

  // Architecture Drawer
  const [archModalOpen, setArchModalOpen] = useState(false);
  const [savingArch, setSavingArch] = useState(false);
  const [archForm, setArchForm] = useState<ArchitectureFormState | null>(null);
  const [capabilityDraft, setCapabilityDraft] = useState("");

  // Hero Index Curation Settings
  const [heroLimit, setHeroLimit] = useState(9);
  const [manyMoreLabel, setManyMoreLabel] = useState("AND MANY MORE INDUSTRIES");
  const [manyMoreUrl, setManyMoreUrl] = useState("#industry-directory");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ limit: "50" });
      if (statusFilter) params.set("status", statusFilter);
      if (featuredFilter) params.set("featured", featuredFilter);
      if (query.trim()) params.set("q", query.trim());

      const [indRes, archRes, svcRes, projRes] = await Promise.all([
        fetch(`/api/v1/admin/industries?${params.toString()}`),
        fetch("/api/v1/admin/sector-architectures"),
        fetch("/api/v1/admin/services?limit=100"),
        fetch("/api/v1/admin/projects?limit=100"),
      ]);

      if (indRes.status === 401) {
        router.push("/admin/login");
        return;
      }

      const [indJson, archJson, svcJson, projJson] = await Promise.all([
        indRes.json(),
        archRes.json(),
        svcRes.json(),
        projRes.json(),
      ]);

      if (indRes.ok) {
        setIndustriesList(indJson.data || []);
        if (indJson.meta?.stats) {
          setStats(indJson.meta.stats);
        }
      }
      if (archRes.ok) {
        setArchitecturesList(archJson.data || []);
      }
      if (svcRes.ok) {
        setAvailableServices(
          (svcJson.data || []).map((s: { id: string; title: string; divisionSlug: string }) => ({
            id: s.id,
            title: s.title,
            divisionSlug: s.divisionSlug,
          }))
        );
      }
      if (projRes.ok) {
        setAvailableProjects(
          (projJson.data || []).map((p: { id: string; title: string; slug: string }) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
          }))
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load industries data.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, featuredFilter, query, router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const openCreateModal = () => {
    setForm({
      name: "",
      slug: "",
      tagline: "",
      shortDescription: "",
      description: "",
      heroHeadline: "",
      heroDescription: "",
      heroSupportingLabel: "SECTOR REGISTER",
      ctaLabel: "Enquire for This Sector",
      ctaDestination: "/contact",
      subIndustries: [],
      deliverables: [],
      challenges: [],
      opportunities: [],
      solutions: [],
      faqs: [],
      coverImageUrl: "",
      coverAssetId: null,
      coverAssetUrl: null,
      displayOrder: industriesList.length + 1,
      status: "draft",
      isFeatured: false,
      isHeroFeatured: false,
      seoTitle: "",
      seoDescription: "",
      canonicalUrl: "",
      serviceIds: [],
      divisionIds: [],
      sectorArchitectureIds: [],
      projectIds: [],
    });
    setEditorOpen(true);
  };

  const openEditModal = async (ind: IndustryRow) => {
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/industries/${ind.id}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to fetch industry details.");

      const full = json.data;
      setForm({
        id: full.id,
        name: full.name,
        slug: full.slug,
        tagline: full.tagline || "",
        shortDescription: full.shortDescription || "",
        description: full.description || "",
        heroHeadline: full.heroHeadline || full.name,
        heroDescription: full.heroDescription || full.shortDescription || "",
        heroSupportingLabel: full.heroSupportingLabel || "SECTOR REGISTER",
        ctaLabel: full.ctaLabel || "Discuss Your Sector",
        ctaDestination: full.ctaDestination || "/contact",
        subIndustries: full.subIndustries || [],
        deliverables: full.deliverables || [],
        challenges: full.challenges || [],
        opportunities: full.opportunities || [],
        solutions: full.solutions || [],
        faqs: full.faqs || [],
        coverImageUrl: full.coverImageUrl || "",
        coverAssetId: full.coverAssetId || null,
        coverAssetUrl: full.coverAsset?.secureUrl || full.coverImageUrl || null,
        displayOrder: full.displayOrder,
        status: full.status,
        isFeatured: full.isFeatured,
        isHeroFeatured: full.isHeroFeatured,
        seoTitle: full.seoTitle || "",
        seoDescription: full.seoDescription || "",
        canonicalUrl: full.canonicalUrl || "",
        serviceIds: full.serviceIds || [],
        divisionIds: [],
        sectorArchitectureIds: full.sectorArchitectureIds || [],
        projectIds: full.projectIds || [],
      });
      setEditorOpen(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error opening editor.");
    }
  };

  const handleSaveIndustry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const isEdit = Boolean(form.id);
      const url = isEdit
        ? `/api/v1/admin/industries/${form.id}`
        : "/api/v1/admin/industries";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || "Failed to save industry.");
      }

      setSuccess(`Industry "${form.name}" saved successfully.`);
      setEditorOpen(false);
      setForm(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save industry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteIndustry = async (ind: IndustryRow) => {
    if (!window.confirm(`Delete industry "${ind.name}"? This action cannot be undone.`)) return;
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/industries/${ind.id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to delete industry.");

      setSuccess(`Deleted industry "${ind.name}".`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete industry.");
    }
  };

  const handleToggleFeatured = async (ind: IndustryRow) => {
    try {
      const res = await fetch(`/api/v1/admin/industries/${ind.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: !ind.isFeatured }),
      });
      if (!res.ok) throw new Error("Failed to toggle featured state.");
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Toggle error.");
    }
  };

  const handleToggleStatus = async (ind: IndustryRow) => {
    const nextStatus = ind.status === "published" ? "draft" : "published";
    try {
      const res = await fetch(`/api/v1/admin/industries/${ind.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Failed to toggle publication status.");
      setSuccess(`Industry status updated to ${nextStatus}.`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status error.");
    }
  };

  // Sector Architecture Actions
  const openCreateArch = () => {
    setArchForm({
      slug: "",
      number: String(architecturesList.length + 1).padStart(2, "0"),
      category: "",
      title: "",
      description: "",
      capabilities: [],
      displayOrder: architecturesList.length + 1,
      status: "published",
      isFeatured: true,
      isHighlighted: false,
      detailRoute: "/contact",
      industryIds: [],
    });
    setArchModalOpen(true);
  };

  const openEditArch = (arch: SectorArchitectureRow) => {
    setArchForm({
      id: arch.id,
      slug: arch.slug,
      number: arch.number || "",
      category: arch.category,
      title: arch.title,
      description: arch.description,
      capabilities: arch.capabilities || [],
      displayOrder: arch.displayOrder,
      status: arch.status,
      isFeatured: arch.isFeatured,
      isHighlighted: arch.isHighlighted,
      detailRoute: arch.detailRoute || "/contact",
      industryIds: arch.industryIds || [],
    });
    setArchModalOpen(true);
  };

  const handleSaveArch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!archForm) return;
    setSavingArch(true);
    setError("");

    try {
      const isEdit = Boolean(archForm.id);
      const url = isEdit
        ? `/api/v1/admin/sector-architectures/${archForm.id}`
        : "/api/v1/admin/sector-architectures";
      const method = isEdit ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(archForm),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save sector architecture.");

      setSuccess(`Sector architecture "${archForm.title}" saved.`);
      setArchModalOpen(false);
      setArchForm(null);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving architecture.");
    } finally {
      setSavingArch(false);
    }
  };

  const handleDeleteArch = async (arch: SectorArchitectureRow) => {
    if (!window.confirm(`Delete architecture "${arch.title}"?`)) return;
    try {
      const res = await fetch(`/api/v1/admin/sector-architectures/${arch.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete sector architecture.");
      setSuccess(`Deleted "${arch.title}".`);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete error.");
    }
  };

  // Filtered directory list
  const filteredIndustries = industriesList.filter((ind) => {
    if (architectureFilter) {
      const hasArch = ind.sectorArchitectures?.some(
        (a) => a.architectureId === architectureFilter
      );
      if (!hasArch) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#D9B875]">
              BUSINESS / VERTICALS
            </span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-[28px] tracking-tight text-[#F5F3EE]">
            Industries Management
          </h1>
          <p className="text-sm text-[#8D939E]">
            Manage industry directories, sector insights, business challenges and industry-specific solution pages.
          </p>
        </div>

        {canEdit && (
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={openCreateArch}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#111419] border border-[#1E222A] text-xs font-semibold text-[#F5F3EE] hover:border-[#D9B875]/50 transition-colors"
            >
              <Cpu className="w-4 h-4 text-[#D9B875]" />
              <span>Add Sector Architecture</span>
            </button>
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F06419] text-white text-xs font-semibold hover:bg-[#FF762F] transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Industry</span>
            </button>
          </div>
        )}
      </div>

      {/* 5-Card KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <span className="p-1.5 rounded-lg bg-[#1A160E] border border-[#D9B875]/30 text-[#D9B875]">
              <Building className="w-3.5 h-3.5" />
            </span>
            <span>Total Industries</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F3EE]">
            {loading ? "—" : stats.totalAll}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <span className="p-1.5 rounded-lg bg-[#112419] border border-[#54C99A]/30 text-[#54C99A]">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
            <span>Published</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F3EE]">
            {loading ? "—" : stats.publishedCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <span className="p-1.5 rounded-lg bg-[#1D1629] border border-[#B5A0F5]/30 text-[#B5A0F5]">
              <Edit3 className="w-3.5 h-3.5" />
            </span>
            <span>Drafts</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F3EE]">
            {loading ? "—" : stats.draftCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <span className="p-1.5 rounded-lg bg-[#261510] border border-[#F06419]/30 text-[#F06419]">
              <Star className="w-3.5 h-3.5" />
            </span>
            <span>Featured</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F3EE]">
            {loading ? "—" : stats.featuredCount}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2 col-span-2 sm:col-span-1">
          <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
            <span className="p-1.5 rounded-lg bg-[#171B24] border border-[#7BA9F5]/30 text-[#7BA9F5]">
              <Cpu className="w-3.5 h-3.5" />
            </span>
            <span>Architectures</span>
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F3EE]">
            {loading ? "—" : stats.sectorArchitecturesCount}
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-[#1E222A] pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("directory")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors ${
            activeTab === "directory"
              ? "border-[#F06419] text-[#F06419]"
              : "border-transparent text-[#8E95A2] hover:text-[#F5F2EC]"
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Industry Directory</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#181C22] text-[#8E95A2]">
            {industriesList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("architectures")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors ${
            activeTab === "architectures"
              ? "border-[#F06419] text-[#F06419]"
              : "border-transparent text-[#8E95A2] hover:text-[#F5F2EC]"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Sector Intelligence Register</span>
          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#181C22] text-[#8E95A2]">
            {architecturesList.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("hero")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold tracking-wide border-b-2 transition-colors ${
            activeTab === "hero"
              ? "border-[#F06419] text-[#F06419]"
              : "border-transparent text-[#8E95A2] hover:text-[#F5F2EC]"
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Hero Index Curation</span>
        </button>
      </div>

      {/* Feedback alerts */}
      {error && (
        <div className="p-3.5 rounded-lg bg-[#2A1215] border border-[#E5484D]/40 text-xs text-[#FFA2A2] flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="text-[#FFA2A2]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {success && (
        <div className="p-3.5 rounded-lg bg-[#112419] border border-[#54C99A]/40 text-xs text-[#54C99A] flex items-center justify-between">
          <span>{success}</span>
          <button type="button" onClick={() => setSuccess("")} className="text-[#54C99A]">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* SUB-VIEW 1: INDUSTRY DIRECTORY */}
      {activeTab === "directory" && (
        <div className="space-y-4">
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-[#111419] border border-[#1E222A]">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search industries, taglines, challenges..."
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#0C0E12] border border-[#1E222A] text-xs text-[#F5F3EE] placeholder-[#5E6570] focus:outline-none focus:border-[#F06419]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#0C0E12] border border-[#1E222A] text-xs text-[#F5F3EE] focus:outline-none focus:border-[#F06419]"
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>

              <select
                value={featuredFilter}
                onChange={(e) => setFeaturedFilter(e.target.value)}
                className="px-3 py-2 rounded-lg bg-[#0C0E12] border border-[#1E222A] text-xs text-[#F5F3EE] focus:outline-none focus:border-[#F06419]"
              >
                <option value="">All Placements</option>
                <option value="true">Featured Only</option>
              </select>

              {architecturesList.length > 0 && (
                <select
                  value={architectureFilter}
                  onChange={(e) => setArchitectureFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-[#0C0E12] border border-[#1E222A] text-xs text-[#F5F3EE] focus:outline-none focus:border-[#F06419]"
                >
                  <option value="">All Architectures</option>
                  {architecturesList.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.title}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="flex items-center gap-1.5 bg-[#0C0E12] border border-[#1E222A] p-0.5 rounded-lg">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md ${
                  viewMode === "grid" ? "bg-[#1E222A] text-[#F5F3EE]" : "text-[#777D87]"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md ${
                  viewMode === "list" ? "bg-[#1E222A] text-[#F5F3EE]" : "text-[#777D87]"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Directory Content */}
          {loading ? (
            <div className="py-20 text-center text-xs font-mono text-[#777D87] space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#F06419]" />
              <p>Loading industries directory...</p>
            </div>
          ) : filteredIndustries.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-[#111419] border border-[#1E222A] p-8 space-y-3">
              <Building className="w-8 h-8 text-[#5E6570] mx-auto" />
              <h3 className="text-base font-semibold text-[#F5F3EE]">No industries found</h3>
              <p className="text-xs text-[#8D939E] max-w-sm mx-auto">
                No industries match your search or filters. Create your first industry to populate the public directory.
              </p>
              {canEdit && (
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F06419] text-white text-xs font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add First Industry</span>
                </button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredIndustries.map((ind) => (
                <div
                  key={ind.id}
                  className="rounded-xl bg-[#111419] border border-[#1E222A] hover:border-[#2E3540] transition-all p-5 flex flex-col justify-between space-y-4 group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading font-extrabold text-2xl text-[#F06419]">
                        {String(ind.displayOrder || 1).padStart(2, "0")}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(ind)}
                          title="Toggle Featured placement"
                          className={`p-1 rounded ${
                            ind.isFeatured
                              ? "text-[#F06419] hover:text-[#FFA266]"
                              : "text-[#4B5260] hover:text-[#777D87]"
                          }`}
                        >
                          <Star className={`w-3.5 h-3.5 ${ind.isFeatured ? "fill-current" : ""}`} />
                        </button>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            ind.status === "published"
                              ? "bg-[#54C99A]/15 text-[#54C99A] border-[#54C99A]/30"
                              : "bg-[#D9B875]/15 text-[#D9B875] border-[#D9B875]/30"
                          }`}
                        >
                          {ind.status}
                        </span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#D9B875] font-semibold block">
                        {ind.tagline || "SECTOR PROFILE"}
                      </span>
                      <h3 className="font-heading font-bold text-lg text-[#F5F2EC] group-hover:text-[#F06419] transition-colors">
                        {ind.name}
                      </h3>
                      <p className="text-xs text-[#8E95A2] line-clamp-3 leading-relaxed mt-1">
                        {ind.shortDescription || ind.description}
                      </p>
                    </div>

                    {ind.deliverables && ind.deliverables.length > 0 && (
                      <div className="space-y-1 pt-2 border-t border-[#1C2027]">
                        <span className="text-[10px] font-mono uppercase text-[#6B7280]">
                          Key Deliverables:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {ind.deliverables.slice(0, 2).map((d, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161A20] text-[#B4B9C2]"
                            >
                              {d}
                            </span>
                          ))}
                          {ind.deliverables.length > 2 && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 text-[#6B7280]">
                              +{ind.deliverables.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-[#1C2027] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewIndustry({
                            ...ind,
                            heroHeadline: ind.heroHeadline || ind.name,
                            heroDescription: ind.heroDescription || ind.shortDescription,
                            heroSupportingLabel: ind.heroSupportingLabel || "SECTOR REGISTER",
                            ctaLabel: ind.ctaLabel || "Discuss Your Sector",
                            ctaDestination: ind.ctaDestination || "/contact",
                            coverAssetUrl: ind.coverAssetUrl || ind.coverImageUrl || null,
                            seoTitle: ind.seoTitle || "",
                            seoDescription: ind.seoDescription || "",
                            canonicalUrl: ind.canonicalUrl || "",
                            serviceIds: ind.services?.map((s) => s.serviceId) || [],
                            divisionIds: [],
                            sectorArchitectureIds: ind.sectorArchitectures?.map((a) => a.architectureId) || [],
                            projectIds: ind.projects?.map((p) => p.projectId) || [],
                          })
                        }
                        className="p-1.5 rounded-lg text-[#8E95A2] hover:text-[#F5F2EC] hover:bg-[#1A1E26] transition-colors"
                        title="Live Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(ind)}
                        className="p-1.5 rounded-lg text-[#8E95A2] hover:text-[#F5F2EC] hover:bg-[#1A1E26] transition-colors"
                        title="Edit Industry"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(ind)}
                        className="text-[11px] font-mono text-[#8E95A2] hover:text-[#F5F2EC] px-2 py-1 rounded bg-[#161A20]"
                      >
                        {ind.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </div>

                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteIndustry(ind)}
                        className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#FFA2A2] hover:bg-[#2A1215] transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-[#111419] border border-[#1E222A] overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0C0E12] text-[#8E95A2] font-mono uppercase text-[10px] border-b border-[#1E222A]">
                  <tr>
                    <th className="px-4 py-3">#</th>
                    <th className="px-4 py-3">Industry Name & Tagline</th>
                    <th className="px-4 py-3">Slug</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Featured</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1C2027]">
                  {filteredIndustries.map((ind) => (
                    <tr key={ind.id} className="hover:bg-[#161A20] transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-[#F06419]">
                        {String(ind.displayOrder || 1).padStart(2, "0")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-[#F5F2EC]">{ind.name}</div>
                        <div className="text-[10px] font-mono text-[#D9B875] uppercase">{ind.tagline}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-[#777D87]">{ind.slug}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                            ind.status === "published"
                              ? "bg-[#54C99A]/15 text-[#54C99A] border-[#54C99A]/30"
                              : "bg-[#D9B875]/15 text-[#D9B875] border-[#D9B875]/30"
                          }`}
                        >
                          {ind.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(ind)}
                          className={ind.isFeatured ? "text-[#F06419]" : "text-[#4B5260]"}
                        >
                          <Star className={`w-3.5 h-3.5 ${ind.isFeatured ? "fill-current" : ""}`} />
                        </button>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(ind)}
                            className="p-1 rounded text-[#8E95A2] hover:text-[#F5F2EC]"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteIndustry(ind)}
                              className="p-1 rounded text-[#6B7280] hover:text-[#FFA2A2]"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SUB-VIEW 2: SECTOR INTELLIGENCE REGISTER */}
      {activeTab === "architectures" && (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-[#111419] border border-[#1E222A]">
            <div>
              <h2 className="text-sm font-semibold text-[#F5F2EC]">Sector Intelligence Register</h2>
              <p className="text-xs text-[#8E95A2]">
                Broader technological and operational environments that group together domain-specific industry systems.
              </p>
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={openCreateArch}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F06419] text-white text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Sector Architecture</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {architecturesList.map((arch, idx) => (
              <div
                key={arch.id}
                className="rounded-xl bg-[#111419] border border-[#1E222A] p-5 flex flex-col justify-between space-y-4 hover:border-[#2E3540] transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-extrabold text-2xl text-[#F06419]">
                      {arch.number || String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-center gap-1.5">
                      {arch.isHighlighted && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#F06419]/15 text-[#F06419] border border-[#F06419]/30">
                          Highlighted
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#181C22] text-[#8E95A2] border border-[#262C36]">
                        {arch.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#D9B875] font-semibold block">
                      {arch.category}
                    </span>
                    <h3 className="font-heading font-bold text-base text-[#F5F2EC] mt-0.5">{arch.title}</h3>
                    <p className="text-xs text-[#8E95A2] line-clamp-3 leading-relaxed mt-1">
                      {arch.description}
                    </p>
                  </div>

                  {arch.capabilities && arch.capabilities.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-[#1C2027]">
                      {arch.capabilities.map((cap, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#161A20] text-[#B4B9C2]"
                        >
                          {cap}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#1C2027] flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#6B7280]">
                    {arch.industryIds?.length || 0} Connected Verticals
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditArch(arch)}
                      className="p-1.5 rounded-lg text-[#8E95A2] hover:text-[#F5F2EC] hover:bg-[#1A1E26]"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    {isAdmin && (
                      <button
                        type="button"
                        onClick={() => handleDeleteArch(arch)}
                        className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#FFA2A2]"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Beyond These Six Configuration Box */}
          <div className="p-6 rounded-2xl bg-[#101216] border border-[#262C36] space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D9B875] uppercase">
              <Sparkles className="w-4 h-4" />
              <span>&quot;Beyond These Six&quot; Directory Invitation Configuration</span>
            </div>
            <p className="text-xs text-[#8E95A2]">
              Configures the persistent invitation panel at the base of the Sector Intelligence section, inviting prospects from unlisted domains to initiate an inquiry.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-[#0C0E12] border border-[#1E222A]">
                <span className="text-[#6B7280] block font-mono text-[10px]">HEADLINE</span>
                <span className="font-semibold text-[#F5F2EC]">Beyond these six.</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0C0E12] border border-[#1E222A]">
                <span className="text-[#6B7280] block font-mono text-[10px]">SUBTITLE</span>
                <span className="font-semibold text-[#F5F2EC]">There are more industries to build for.</span>
              </div>
              <div className="p-3 rounded-lg bg-[#0C0E12] border border-[#1E222A]">
                <span className="text-[#6B7280] block font-mono text-[10px]">TARGET ACTION</span>
                <span className="font-semibold text-[#D9B875]">#industry-directory</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 3: HERO INDEX CURATION */}
      {activeTab === "hero" && (
        <div className="space-y-6">
          <div className="p-5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-[#F5F2EC]">Hero Index Placement Curation</h2>
              <p className="text-xs text-[#8E95A2]">
                Select and reorder the prominent sector cards featured directly in the public Industries Hero section.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs">
              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#8E95A2] block">Visible Display Limit</label>
                <select
                  value={heroLimit}
                  onChange={(e) => setHeroLimit(Number(e.target.value))}
                  className="px-3 py-1.5 rounded-lg bg-[#0C0E12] border border-[#1E222A] text-xs text-[#F5F3EE]"
                >
                  <option value={6}>6 Featured Cards</option>
                  <option value={9}>9 Featured Cards</option>
                  <option value={12}>12 Featured Cards</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#8E95A2] block">Continuation Action Label</label>
                <input
                  type="text"
                  value={manyMoreLabel}
                  onChange={(e) => setManyMoreLabel(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0C0E12] border border-[#1E222A] text-xs text-[#F5F3EE] w-64"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-mono text-[#8E95A2] block">Continuation Target Anchor</label>
                <input
                  type="text"
                  value={manyMoreUrl}
                  onChange={(e) => setManyMoreUrl(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#0C0E12] border border-[#1E222A] text-xs text-[#F5F3EE] w-48 font-mono"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-mono uppercase text-[#D9B875] tracking-wider">
              Featured Hero Cards ({industriesList.filter((i) => i.isHeroFeatured || i.isFeatured).length} Selected)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {industriesList.map((ind) => {
                const isSelected = ind.isHeroFeatured || ind.isFeatured;
                return (
                  <div
                    key={ind.id}
                    className={`p-4 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#161A22] border-[#F06419]/40 shadow-sm"
                        : "bg-[#111419] border-[#1E222A] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono text-[#D9B875] uppercase">{ind.tagline}</span>
                      <h4 className="text-xs font-semibold text-[#F5F2EC]">{ind.name}</h4>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(ind)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-colors ${
                        isSelected
                          ? "bg-[#F06419] text-white"
                          : "bg-[#1E222A] text-[#8E95A2] hover:text-[#F5F2EC]"
                      }`}
                    >
                      {isSelected ? "Featured" : "Add to Hero"}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT INDUSTRY DRAWER */}
      {editorOpen && form && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl h-full bg-[#090A0C] border-l border-[#1E222A] flex flex-col text-[#F5F2EC] shadow-2xl overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#1E222A] bg-[#101216]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#D9B875]">
                  {form.id ? "Edit Industry Record" : "Create New Industry"}
                </span>
                <h2 className="text-base font-semibold text-[#F5F2EC]">
                  {form.name || "Untitled Industry"}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewIndustry(form)}
                  className="px-3 py-1.5 rounded-lg bg-[#181C22] border border-[#262C36] text-xs text-[#D9B875] hover:text-[#F5F2EC] flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="p-1.5 rounded-lg text-[#8E95A2] hover:text-[#F5F2EC] hover:bg-[#1E222A]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Body Scroll */}
            <form onSubmit={handleSaveIndustry} className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Section 01: Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase text-[#F06419] tracking-wider border-b border-[#1E222A] pb-2">
                  01. Basic Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[#8E95A2]">Industry Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => {
                        const name = e.target.value;
                        setForm({
                          ...form,
                          name,
                          slug: form.slug ? form.slug : slugify(name),
                        });
                      }}
                      className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC] focus:border-[#F06419]"
                      placeholder="e.g. Healthcare & Clinics"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#8E95A2]">URL Slug *</label>
                    <input
                      type="text"
                      required
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC] font-mono focus:border-[#F06419]"
                      placeholder="healthcare-clinics"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[#8E95A2]">Tagline / Identifier *</label>
                    <input
                      type="text"
                      required
                      value={form.tagline}
                      onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC] font-mono uppercase focus:border-[#F06419]"
                      placeholder="e.g. PATIENT SYSTEMS / REGULATORY AUTHORITY"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[#8E95A2]">Short Description</label>
                    <textarea
                      rows={2}
                      value={form.shortDescription}
                      onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC] focus:border-[#F06419]"
                      placeholder="Accessible clinic portals, appointment flows and branding..."
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#8E95A2]">Display Order</label>
                    <input
                      type="number"
                      min={0}
                      value={form.displayOrder}
                      onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#8E95A2]">Publication Status</label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          status: e.target.value as "draft" | "published" | "archived",
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC]"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-4 sm:col-span-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={form.isFeatured}
                        onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                        className="rounded border-[#1E222A] text-[#F06419] focus:ring-0"
                      />
                      <span>Featured in Directory</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={form.isHeroFeatured}
                        onChange={(e) => setForm({ ...form, isHeroFeatured: e.target.checked })}
                        className="rounded border-[#1E222A] text-[#F06419] focus:ring-0"
                      />
                      <span>Feature in Homepage / Index Hero</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Section 02: Industry Hero & Overview */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase text-[#F06419] tracking-wider border-b border-[#1E222A] pb-2">
                  02. Hero Presentation & Narrative
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-[#8E95A2]">Hero Headline</label>
                    <input
                      type="text"
                      value={form.heroHeadline}
                      onChange={(e) => setForm({ ...form, heroHeadline: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC]"
                      placeholder="e.g. Healthcare & Medical Technology"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[#8E95A2]">Hero Description</label>
                    <textarea
                      rows={3}
                      value={form.heroDescription}
                      onChange={(e) => setForm({ ...form, heroDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[#8E95A2]">Primary CTA Label</label>
                      <input
                        type="text"
                        value={form.ctaLabel}
                        onChange={(e) => setForm({ ...form, ctaLabel: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC]"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[#8E95A2]">Primary CTA Destination</label>
                      <input
                        type="text"
                        value={form.ctaDestination}
                        onChange={(e) => setForm({ ...form, ctaDestination: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC]"
                      />
                    </div>
                  </div>

                  {/* Sub-industries tags */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[#8E95A2] block">Sub-industries / Verticals</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={subIndustryDraft}
                        onChange={(e) => setSubIndustryDraft(e.target.value)}
                        placeholder="e.g. Dental Clinics"
                        className="flex-1 px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!subIndustryDraft.trim()) return;
                          setForm({
                            ...form,
                            subIndustries: [...form.subIndustries, subIndustryDraft.trim()],
                          });
                          setSubIndustryDraft("");
                        }}
                        className="px-3 py-2 rounded-lg bg-[#181C22] text-[#F5F2EC] hover:bg-[#20252D]"
                      >
                        Add
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {form.subIndustries.map((sub, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#161A20] text-[#B4B9C2] text-[11px]"
                        >
                          <span>{sub}</span>
                          <button
                            type="button"
                            onClick={() =>
                              setForm({
                                ...form,
                                subIndustries: form.subIndustries.filter((_, idx) => idx !== i),
                              })
                            }
                            className="text-[#6B7280] hover:text-[#FFA2A2]"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 03: Deliverables */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase text-[#F06419] tracking-wider border-b border-[#1E222A] pb-2">
                  03. Deliverables & Production Assets
                </h3>
                <div className="space-y-2 text-xs">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={deliverableDraft}
                      onChange={(e) => setDeliverableDraft(e.target.value)}
                      placeholder="e.g. Patient Scheduling & Triage Portals"
                      className="flex-1 px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!deliverableDraft.trim()) return;
                        setForm({
                          ...form,
                          deliverables: [...form.deliverables, deliverableDraft.trim()],
                        });
                        setDeliverableDraft("");
                      }}
                      className="px-3 py-2 rounded-lg bg-[#181C22] text-[#F5F2EC] hover:bg-[#20252D]"
                    >
                      Add Deliverable
                    </button>
                  </div>
                  <ul className="space-y-1.5">
                    {form.deliverables.map((deliv, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between p-2.5 rounded-lg bg-[#111419] border border-[#1E222A]"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#54C99A]" />
                          <span>{deliv}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              deliverables: form.deliverables.filter((_, idx) => idx !== i),
                            })
                          }
                          className="text-[#6B7280] hover:text-[#FFA2A2]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Section 04: Industry Challenges */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase text-[#F06419] tracking-wider border-b border-[#1E222A] pb-2">
                  04. Industry Challenges
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
                    <input
                      type="text"
                      value={challengeDraftTitle}
                      onChange={(e) => setChallengeDraftTitle(e.target.value)}
                      placeholder="Challenge Title (e.g. Regulatory Compliance Friction)"
                      className="w-full px-3 py-2 rounded-lg bg-[#0C0E12] border border-[#1E222A] text-[#F5F2EC]"
                    />
                    <textarea
                      rows={2}
                      value={challengeDraftDesc}
                      onChange={(e) => setChallengeDraftDesc(e.target.value)}
                      placeholder="Challenge Description..."
                      className="w-full px-3 py-2 rounded-lg bg-[#0C0E12] border border-[#1E222A] text-[#F5F2EC]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!challengeDraftTitle.trim()) return;
                        setForm({
                          ...form,
                          challenges: [
                            ...form.challenges,
                            { title: challengeDraftTitle.trim(), description: challengeDraftDesc.trim() },
                          ],
                        });
                        setChallengeDraftTitle("");
                        setChallengeDraftDesc("");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#181C22] text-[#F5F2EC] hover:bg-[#20252D]"
                    >
                      + Add Challenge
                    </button>
                  </div>

                  <div className="space-y-2">
                    {form.challenges.map((c, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-[#111419] border border-[#1E222A] flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <h5 className="font-semibold text-[#F5F2EC]">{c.title}</h5>
                          <p className="text-xs text-[#8E95A2]">{c.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              challenges: form.challenges.filter((_, idx) => idx !== i),
                            })
                          }
                          className="text-[#6B7280] hover:text-[#FFA2A2]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 05: EDYREX Approach & Solutions */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase text-[#F06419] tracking-wider border-b border-[#1E222A] pb-2">
                  05. EDYREX Approach & Solutions
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
                    <input
                      type="text"
                      value={solDraftTitle}
                      onChange={(e) => setSolDraftTitle(e.target.value)}
                      placeholder="Solution Title (e.g. Automated Triage & Inbound Routing)"
                      className="w-full px-3 py-2 rounded-lg bg-[#0C0E12] border border-[#1E222A] text-[#F5F2EC]"
                    />
                    <textarea
                      rows={2}
                      value={solDraftDesc}
                      onChange={(e) => setSolDraftDesc(e.target.value)}
                      placeholder="Solution Description..."
                      className="w-full px-3 py-2 rounded-lg bg-[#0C0E12] border border-[#1E222A] text-[#F5F2EC]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!solDraftTitle.trim()) return;
                        setForm({
                          ...form,
                          solutions: [
                            ...form.solutions,
                            { title: solDraftTitle.trim(), description: solDraftDesc.trim() },
                          ],
                        });
                        setSolDraftTitle("");
                        setSolDraftDesc("");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#181C22] text-[#F5F2EC] hover:bg-[#20252D]"
                    >
                      + Add Solution
                    </button>
                  </div>

                  <div className="space-y-2">
                    {form.solutions.map((s, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-[#111419] border border-[#1E222A] flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <h5 className="font-semibold text-[#F5F2EC]">{s.title}</h5>
                          <p className="text-xs text-[#8E95A2]">{s.description}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              solutions: form.solutions.filter((_, idx) => idx !== i),
                            })
                          }
                          className="text-[#6B7280] hover:text-[#FFA2A2]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 06: Connected Services & Architectures */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase text-[#F06419] tracking-wider border-b border-[#1E222A] pb-2">
                  06. Shared Studio Relationships
                </h3>
                <div className="space-y-4 text-xs">
                  {/* Services Multi-Select */}
                  <div className="space-y-2">
                    <label className="text-[#8E95A2] block">Associated Services ({form.serviceIds.length})</label>
                    <div className="max-h-36 overflow-y-auto p-2 rounded-lg bg-[#111419] border border-[#1E222A] space-y-1">
                      {availableServices.map((svc) => {
                        const checked = form.serviceIds.includes(svc.id);
                        return (
                          <label
                            key={svc.id}
                            className="flex items-center gap-2 p-1.5 rounded hover:bg-[#181C22] cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  serviceIds: e.target.checked
                                    ? [...form.serviceIds, svc.id]
                                    : form.serviceIds.filter((id) => id !== svc.id),
                                });
                              }}
                              className="rounded border-[#1E222A] text-[#F06419]"
                            />
                            <span>{svc.title}</span>
                            <span className="text-[10px] font-mono text-[#D9B875] ml-auto uppercase">
                              {svc.divisionSlug}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sector Architectures Multi-Select */}
                  <div className="space-y-2">
                    <label className="text-[#8E95A2] block">
                      Sector Architecture Groupings ({form.sectorArchitectureIds.length})
                    </label>
                    <div className="max-h-36 overflow-y-auto p-2 rounded-lg bg-[#111419] border border-[#1E222A] space-y-1">
                      {architecturesList.map((arch) => {
                        const checked = form.sectorArchitectureIds.includes(arch.id);
                        return (
                          <label
                            key={arch.id}
                            className="flex items-center gap-2 p-1.5 rounded hover:bg-[#181C22] cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  sectorArchitectureIds: e.target.checked
                                    ? [...form.sectorArchitectureIds, arch.id]
                                    : form.sectorArchitectureIds.filter((id) => id !== arch.id),
                                });
                              }}
                              className="rounded border-[#1E222A] text-[#F06419]"
                            />
                            <span>{arch.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  {/* Related Portfolio Work */}
                  <div className="space-y-2">
                    <label className="text-[#8E95A2] block">
                      Related Case Studies / Portfolio Work ({form.projectIds.length})
                    </label>
                    <div className="max-h-36 overflow-y-auto p-2 rounded-lg bg-[#111419] border border-[#1E222A] space-y-1">
                      {availableProjects.map((p) => {
                        const checked = form.projectIds.includes(p.id);
                        return (
                          <label
                            key={p.id}
                            className="flex items-center gap-2 p-1.5 rounded hover:bg-[#181C22] cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {
                                setForm({
                                  ...form,
                                  projectIds: e.target.checked
                                    ? [...form.projectIds, p.id]
                                    : form.projectIds.filter((id) => id !== p.id),
                                });
                              }}
                              className="rounded border-[#1E222A] text-[#F06419]"
                            />
                            <span>{p.title}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 07: FAQs */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase text-[#F06419] tracking-wider border-b border-[#1E222A] pb-2">
                  07. Sector FAQs
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#111419] border border-[#1E222A] space-y-2">
                    <input
                      type="text"
                      value={faqDraftQ}
                      onChange={(e) => setFaqDraftQ(e.target.value)}
                      placeholder="Question..."
                      className="w-full px-3 py-2 rounded-lg bg-[#0C0E12] border border-[#1E222A] text-[#F5F2EC]"
                    />
                    <textarea
                      rows={2}
                      value={faqDraftA}
                      onChange={(e) => setFaqDraftA(e.target.value)}
                      placeholder="Answer..."
                      className="w-full px-3 py-2 rounded-lg bg-[#0C0E12] border border-[#1E222A] text-[#F5F2EC]"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!faqDraftQ.trim()) return;
                        setForm({
                          ...form,
                          faqs: [...form.faqs, { question: faqDraftQ.trim(), answer: faqDraftA.trim() }],
                        });
                        setFaqDraftQ("");
                        setFaqDraftA("");
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#181C22] text-[#F5F2EC] hover:bg-[#20252D]"
                    >
                      + Add FAQ
                    </button>
                  </div>

                  <div className="space-y-2">
                    {form.faqs.map((f, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-lg bg-[#111419] border border-[#1E222A] flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <h5 className="font-semibold text-[#F5F2EC]">{f.question}</h5>
                          <p className="text-xs text-[#8E95A2]">{f.answer}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              faqs: form.faqs.filter((_, idx) => idx !== i),
                            })
                          }
                          className="text-[#6B7280] hover:text-[#FFA2A2]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 08: SEO & Publishing */}
              <div className="space-y-4">
                <h3 className="text-xs font-mono uppercase text-[#F06419] tracking-wider border-b border-[#1E222A] pb-2">
                  08. SEO & Canonical Metadata
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[#8E95A2]">SEO Meta Title</label>
                    <input
                      type="text"
                      value={form.seoTitle}
                      onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC]"
                    />
                  </div>
                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-[#8E95A2]">SEO Meta Description</label>
                    <textarea
                      rows={2}
                      value={form.seoDescription}
                      onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC]"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-6 border-t border-[#1E222A] flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setEditorOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#1E222A] text-xs text-[#8E95A2] hover:text-[#F5F2EC]"
                >
                  Cancel
                </button>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForm({ ...form, status: "draft" });
                    }}
                    className="px-3.5 py-2 rounded-lg bg-[#161A22] border border-[#262C36] text-xs font-medium text-[#D9B875]"
                  >
                    Set as Draft
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#F06419] text-white text-xs font-semibold hover:bg-[#FF762F] transition-colors disabled:opacity-50"
                  >
                    {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                    <span>{saving ? "Saving..." : "Save Industry"}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE / EDIT SECTOR ARCHITECTURE MODAL */}
      {archModalOpen && archForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#090A0C] border border-[#262C36] p-6 text-[#F5F2EC] shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#1E222A] pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-[#D9B875]">SECTOR INTELLIGENCE</span>
                <h3 className="text-base font-semibold text-[#F5F2EC]">
                  {archForm.id ? "Edit Sector Architecture" : "New Sector Architecture"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setArchModalOpen(false)}
                className="p-1 rounded text-[#8E95A2] hover:text-[#F5F2EC]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveArch} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[#8E95A2]">Architecture Title *</label>
                  <input
                    type="text"
                    required
                    value={archForm.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setArchForm({
                        ...archForm,
                        title,
                        slug: archForm.slug ? archForm.slug : slugify(title),
                      });
                    }}
                    placeholder="e.g. AI, Machine Learning & DevTools"
                    className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#8E95A2]">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={archForm.slug}
                    onChange={(e) => setArchForm({ ...archForm, slug: slugify(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC] font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[#8E95A2]">Category Tagline *</label>
                <input
                  type="text"
                  required
                  value={archForm.category}
                  onChange={(e) => setArchForm({ ...archForm, category: e.target.value })}
                  placeholder="e.g. AUTONOMOUS SYSTEMS / DEVELOPER TOOLS"
                  className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC] font-mono uppercase"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#8E95A2]">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={archForm.description}
                  onChange={(e) => setArchForm({ ...archForm, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC]"
                />
              </div>

              {/* Capabilities pills */}
              <div className="space-y-1.5">
                <label className="text-[#8E95A2]">Capabilities</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={capabilityDraft}
                    onChange={(e) => setCapabilityDraft(e.target.value)}
                    placeholder="e.g. MODEL INFRASTRUCTURE"
                    className="flex-1 px-3 py-1.5 rounded-lg bg-[#111419] border border-[#1E222A] text-[#F5F2EC] uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!capabilityDraft.trim()) return;
                      setArchForm({
                        ...archForm,
                        capabilities: [...archForm.capabilities, capabilityDraft.trim().toUpperCase()],
                      });
                      setCapabilityDraft("");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#181C22] text-[#F5F2EC]"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {archForm.capabilities.map((cap, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#161A20] text-[#B4B9C2] font-mono text-[10px]"
                    >
                      <span>{cap}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setArchForm({
                            ...archForm,
                            capabilities: archForm.capabilities.filter((_, idx) => idx !== i),
                          })
                        }
                        className="text-[#6B7280] hover:text-[#FFA2A2]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={archForm.isFeatured}
                    onChange={(e) => setArchForm({ ...archForm, isFeatured: e.target.checked })}
                    className="rounded border-[#1E222A] text-[#F06419]"
                  />
                  <span>Featured Architecture</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={archForm.isHighlighted}
                    onChange={(e) => setArchForm({ ...archForm, isHighlighted: e.target.checked })}
                    className="rounded border-[#1E222A] text-[#F06419]"
                  />
                  <span>Highlighted Glow Card</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#1E222A] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setArchModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-[#1E222A] text-[#8E95A2]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingArch}
                  className="px-4 py-1.5 rounded-lg bg-[#F06419] text-white font-semibold disabled:opacity-50"
                >
                  {savingArch ? "Saving..." : "Save Architecture"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Public Industry Preview Modal */}
      {previewIndustry && (
        <PublicIndustryPreviewModal
          open={Boolean(previewIndustry)}
          onClose={() => setPreviewIndustry(null)}
          industry={{
            name: previewIndustry.name,
            slug: previewIndustry.slug,
            tagline: previewIndustry.tagline,
            shortDescription: previewIndustry.shortDescription,
            description: previewIndustry.description,
            heroHeadline: previewIndustry.heroHeadline,
            heroDescription: previewIndustry.heroDescription,
            ctaLabel: previewIndustry.ctaLabel,
            deliverables: previewIndustry.deliverables,
            subIndustries: previewIndustry.subIndustries,
            challenges: previewIndustry.challenges,
            opportunities: previewIndustry.opportunities,
            solutions: previewIndustry.solutions,
            faqs: previewIndustry.faqs,
            status: previewIndustry.status,
            isFeatured: previewIndustry.isFeatured,
            isHeroFeatured: previewIndustry.isHeroFeatured,
            displayOrder: previewIndustry.displayOrder,
            coverImageUrl: previewIndustry.coverAssetUrl || previewIndustry.coverImageUrl,
          }}
        />
      )}
    </div>
  );
}
