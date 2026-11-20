"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Eye,
  Trash2,
  ArrowUp,
  ArrowDown,
  Layers,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building,
  Globe,
  Tag,
  Clock,
  RotateCcw,
  Check,
  ChevronDown,
  X,
  Loader2,
  FolderKanban,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PublicPlacementPreviewModal,
  type PreviewProjectData,
} from "./PublicPlacementPreviewModal";
import { INITIAL_SECTORS } from "@/components/sections/IndustriesPage/industries.data";

export interface FeaturedPlacementRow {
  id: string;
  projectId: string;
  destination: "homepage" | "work_archive" | "division" | "industry" | "campaign";
  targetId: string | null;
  displayOrder: number;
  isActive: boolean;
  featuredFrom: string | null;
  featuredUntil: string | null;
  createdAt: string;
  updatedAt: string;
  projectTitle: string;
  projectSlug: string;
  projectSummary: string;
  projectType: "client" | "concept" | "internal";
  industry: string | null;
  projectStatus: "draft" | "published" | "archived";
  isFeatured: boolean;
  coverAssetUrl: string | null;
}

export interface PublishedProjectOption {
  id: string;
  title: string;
  slug: string;
  summary: string;
  projectType: "client" | "concept" | "internal";
  industry: string | null;
  coverAssetUrl: string | null;
  displayOrder: number;
  status: string;
  isFeatured: boolean;
}

const SERVICE_DIVISIONS = [
  { slug: "branding", name: "Branding & Marketing" },
  { slug: "media", name: "Media & Content Production" },
  { slug: "digital", name: "Web, Apps & Digital Products" },
  { slug: "ai", name: "AI & Automation" },
];

export function FeaturedWorkManager() {
  const [placements, setPlacements] = useState<FeaturedPlacementRow[]>([]);
  const [publishedProjects, setPublishedProjects] = useState<PublishedProjectOption[]>([]);
  const [stats, setStats] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [destinationFilter, setDestinationFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [previewProject, setPreviewProject] = useState<PreviewProjectData | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictInfo, setConflictInfo] = useState<{
    newProjectId: string;
    currentProjectTitle: string;
    placementPayload: Record<string, unknown>;
  } | null>(null);

  // New placement form state
  const [formProjectId, setFormProjectId] = useState("");
  const [formDestination, setFormDestination] = useState<
    "homepage" | "work_archive" | "division" | "industry" | "campaign"
  >("homepage");
  const [formTargetId, setFormTargetId] = useState("");
  const [formOrder, setFormOrder] = useState(1);
  const [formFeaturedFrom, setFormFeaturedFrom] = useState("");
  const [formFeaturedUntil, setFormFeaturedUntil] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPlacements = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch("/api/v1/admin/featured-placements");
      if (!res.ok) {
        throw new Error("Unable to fetch featured placements.");
      }
      const json = await res.json();
      if (json?.data) {
        setPlacements(json.data.placements || []);
        setPublishedProjects(json.data.publishedProjects || []);
        setStats(json.data.stats || {});
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching placements.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlacements();
  }, [fetchPlacements]);

  // Filtered placements
  const filteredPlacements = useMemo(() => {
    return placements.filter((p) => {
      if (destinationFilter !== "all" && p.destination !== destinationFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.projectTitle.toLowerCase().includes(q);
        const matchesSlug = p.projectSlug.toLowerCase().includes(q);
        const matchesTarget = (p.targetId || "").toLowerCase().includes(q);
        if (!matchesTitle && !matchesSlug && !matchesTarget) return false;
      }
      return true;
    });
  }, [placements, destinationFilter, searchQuery]);

  // Handle adding new placement
  const handleAddPlacement = async (confirmReplace = false) => {
    if (!formProjectId) {
      setError("Please select a published project to feature.");
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess("");

    const payload = {
      projectId: formProjectId,
      destination: formDestination,
      targetId: formTargetId || null,
      displayOrder: formOrder,
      featuredFrom: formFeaturedFrom ? new Date(formFeaturedFrom).toISOString() : null,
      featuredUntil: formFeaturedUntil ? new Date(formFeaturedUntil).toISOString() : null,
      confirmReplace,
    };

    try {
      const res = await fetch("/api/v1/admin/featured-placements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (res.status === 409 && json.details?.conflict) {
        // Trigger conflict resolution modal
        setConflictInfo({
          newProjectId: formProjectId,
          currentProjectTitle: json.details.currentProject?.title || "existing project",
          placementPayload: payload,
        });
        setConflictModalOpen(true);
        setSubmitting(false);
        return;
      }

      if (!res.ok) {
        setError(json.message || "Unable to add featured placement.");
        return;
      }

      setAddModalOpen(false);
      setConflictModalOpen(false);
      setSuccess("Project added to featured placement successfully.");
      await fetchPlacements();
    } catch {
      setError("Network error adding featured placement.");
    } finally {
      setSubmitting(false);
    }
  };

  // Reorder placement (move up / move down)
  const handleShiftOrder = async (
    item: FeaturedPlacementRow,
    direction: "up" | "down"
  ) => {
    const list = filteredPlacements.filter((p) => p.destination === item.destination);
    const currIndex = list.findIndex((p) => p.id === item.id);
    if (currIndex === -1) return;

    const swapIndex = direction === "up" ? currIndex - 1 : currIndex + 1;
    if (swapIndex < 0 || swapIndex >= list.length) return;

    const targetItem = list[swapIndex];
    const newOrder = targetItem.displayOrder;
    const oldOrder = item.displayOrder;

    const reorderPayload = [
      { id: item.id, displayOrder: newOrder },
      { id: targetItem.id, displayOrder: oldOrder },
    ];

    try {
      await fetch("/api/v1/admin/featured-placements", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reorder: reorderPayload }),
      });
      await fetchPlacements();
    } catch {
      setError("Failed to update display order.");
    }
  };

  // Remove placement
  const handleRemovePlacement = async (item: FeaturedPlacementRow) => {
    if (
      !window.confirm(
        `Remove "${item.projectTitle}" from ${item.destination.toUpperCase()} placement? The project will remain safely published in the portfolio.`
      )
    ) {
      return;
    }

    try {
      const res = await fetch(`/api/v1/admin/featured-placements/${item.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Failed to remove placement.");
        return;
      }
      setSuccess(json.meta?.message || "Placement removed. The project remains published.");
      await fetchPlacements();
    } catch {
      setError("Network error removing placement.");
    }
  };

  // Open Preview Modal
  const handleOpenPreview = (item: FeaturedPlacementRow) => {
    setPreviewProject({
      title: item.projectTitle,
      slug: item.projectSlug,
      summary: item.projectSummary,
      projectType: item.projectType,
      industry: item.industry,
      coverAssetUrl: item.coverAssetUrl,
      destination: formatDestinationName(item.destination, item.targetId),
      displayOrder: item.displayOrder,
    });
    setPreviewOpen(true);
  };

  function formatDestinationName(destination: string, targetId: string | null) {
    switch (destination) {
      case "homepage":
        return "Homepage Featured (Selected Works)";
      case "work_archive":
        return "Work Archive (/work)";
      case "division": {
        const div = SERVICE_DIVISIONS.find((d) => d.slug === targetId);
        return `Division: ${div?.name || targetId || "All"}`;
      }
      case "industry": {
        const ind = INITIAL_SECTORS.find((s) => s.slug === targetId);
        return `Industry: ${ind?.name || targetId || "General"}`;
      }
      case "campaign":
        return `Campaign: ${targetId || "Editorial Showcase"}`;
      default:
        return destination;
    }
  }

  function getDestinationBadgeStyle(destination: string) {
    switch (destination) {
      case "homepage":
        return "bg-[#F06419]/15 text-[#F06419] border-[#F06419]/30";
      case "work_archive":
        return "bg-[#D9B875]/15 text-[#D9B875] border-[#D9B875]/30";
      case "division":
        return "bg-[#68A9FF]/15 text-[#68A9FF] border-[#68A9FF]/30";
      case "industry":
        return "bg-[#56C58B]/15 text-[#56C58B] border-[#56C58B]/30";
      case "campaign":
        return "bg-[#B993F2]/15 text-[#B993F2] border-[#B993F2]/30";
      default:
        return "bg-[#1C2027] text-[#898D94] border-[#292E35]";
    }
  }

  return (
    <div className="space-y-6">
      {/* Messages */}
      {error && (
        <div className="p-3.5 rounded-xl bg-[#2A1414] border border-[#E36B68]/40 text-xs text-[#E36B68] flex items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      {success && (
        <div className="p-3.5 rounded-xl bg-[#112419] border border-[#56C58B]/40 text-xs text-[#56C58B] flex items-center justify-between">
          <span>{success}</span>
          <button type="button" onClick={() => setSuccess("")} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] space-y-1">
          <div className="text-[11px] font-mono text-[#898D94] uppercase tracking-wider">
            Total Placements
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F2EC]">
            {loading ? "—" : placements.length}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] space-y-1">
          <div className="text-[11px] font-mono text-[#F06419] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#F06419]" />
            Homepage
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F2EC]">
            {loading ? "—" : stats.homepage || 0}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] space-y-1">
          <div className="text-[11px] font-mono text-[#D9B875] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D9B875]" />
            Work Archive
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F2EC]">
            {loading ? "—" : stats.work_archive || 0}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] space-y-1">
          <div className="text-[11px] font-mono text-[#68A9FF] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#68A9FF]" />
            Divisions
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F2EC]">
            {loading ? "—" : stats.division || 0}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] space-y-1 col-span-2 sm:col-span-1">
          <div className="text-[11px] font-mono text-[#56C58B] uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#56C58B]" />
            Industries
          </div>
          <div className="font-heading font-bold text-2xl text-[#F5F2EC]">
            {loading ? "—" : stats.industry || 0}
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#1E222A] pb-4">
        {/* Destination Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: "all", label: "All Placements" },
            { id: "homepage", label: "Homepage Featured" },
            { id: "work_archive", label: "Work Archive" },
            { id: "division", label: "Service Divisions" },
            { id: "industry", label: "Industries" },
            { id: "campaign", label: "Campaigns" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDestinationFilter(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-mono transition-colors cursor-pointer",
                destinationFilter === tab.id
                  ? "bg-[#D9B875] text-[#090A0C] font-semibold"
                  : "bg-[#111419] text-[#898D94] hover:text-[#F5F2EC] border border-[#1E222A]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#898D94] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search placements..."
              className="h-9 pl-8 pr-3 rounded-lg bg-[#111419] border border-[#1E222A] text-xs text-[#F5F2EC] placeholder-[#6D7480] focus:outline-none focus:border-[#D9B875] w-48 sm:w-56"
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setFormProjectId(publishedProjects[0]?.id || "");
              setFormDestination("homepage");
              setFormTargetId("");
              setFormOrder(1);
              setFormFeaturedFrom("");
              setFormFeaturedUntil("");
              setAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#F06419] text-white text-xs font-semibold hover:bg-[#d95610] transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Feature a Project</span>
          </button>
        </div>
      </div>

      {/* Placements Directory Table */}
      {loading ? (
        <div className="py-16 text-center text-xs font-mono text-[#898D94] space-y-2">
          <Loader2 className="w-5 h-5 animate-spin mx-auto text-[#D9B875]" />
          <div>Loading featured placements...</div>
        </div>
      ) : filteredPlacements.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-[#111419] border border-[#1E222A] space-y-3">
          <Sparkles className="w-8 h-8 text-[#D9B875] mx-auto opacity-70" />
          <div className="text-sm font-semibold text-[#F5F2EC]">
            No featured placements found
          </div>
          <p className="text-xs text-[#898D94] max-w-md mx-auto">
            {destinationFilter === "all"
              ? "No published projects are currently featured. Click \"Feature a Project\" to manually curate the public showcase."
              : `No projects are currently featured in the "${destinationFilter}" placement.`}
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-[#1E222A] bg-[#111419] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#1E222A] bg-[#0E1013] text-[#898D94] font-mono text-[11px] uppercase tracking-wider">
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Destination Placement</th>
                  <th className="py-3 px-4 text-center">Display Order</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Schedule</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E222A]">
                {filteredPlacements.map((item, idx) => {
                  const isClient = item.projectType === "client";
                  const classLabel = isClient
                    ? "Client Case Study"
                    : item.projectType === "internal"
                    ? "Internal R&D"
                    : "Studio Concept";

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-[#161A1F] transition-colors group"
                    >
                      {/* Project info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-8 rounded bg-[#161A1F] border border-[#292E35] overflow-hidden relative shrink-0">
                            <Image
                              src={
                                item.coverAssetUrl ||
                                "/images/projects/concept-digital-strata.svg"
                              }
                              alt={item.projectTitle}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="font-heading font-semibold text-[#F5F2EC] truncate max-w-xs sm:max-w-sm">
                              {item.projectTitle}
                            </div>
                            <div className="text-[11px] font-mono text-[#898D94] truncate">
                              /work/{item.projectSlug}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Placement destination */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold uppercase tracking-wider border",
                              getDestinationBadgeStyle(item.destination)
                            )}
                          >
                            {item.destination === "homepage" && "★ "}
                            {item.destination.replace("_", " ")}
                          </span>
                          {item.targetId && (
                            <div className="text-[10px] font-mono text-[#898D94]">
                              Target: <span className="text-[#F5F2EC]">{item.targetId}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Display Order with Up/Down buttons */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="inline-flex items-center gap-1.5 bg-[#0E1013] border border-[#1E222A] px-2 py-1 rounded-lg">
                          <span className="font-mono text-xs font-bold text-[#D9B875] w-6 text-center">
                            #{item.displayOrder}
                          </span>
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              onClick={() => handleShiftOrder(item, "up")}
                              disabled={idx === 0}
                              aria-label="Move placement up"
                              className="text-[#898D94] hover:text-[#F5F2EC] disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleShiftOrder(item, "down")}
                              disabled={idx === filteredPlacements.length - 1}
                              aria-label="Move placement down"
                              className="text-[#898D94] hover:text-[#F5F2EC] disabled:opacity-30 cursor-pointer"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Honest classification */}
                      <td className="py-3.5 px-4">
                        <span
                          className={cn(
                            "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono border",
                            isClient
                              ? "border-[#56C58B]/30 bg-[#56C58B]/10 text-[#56C58B]"
                              : "border-[#D9B875]/30 bg-[#D9B875]/10 text-[#D9B875]"
                          )}
                        >
                          {classLabel}
                        </span>
                      </td>

                      {/* Schedule info */}
                      <td className="py-3.5 px-4 text-[11px] font-mono text-[#898D94]">
                        {item.featuredUntil ? (
                          <span className="text-[#E9B45A]">
                            Until{" "}
                            {new Date(item.featuredUntil).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        ) : (
                          <span className="text-[#56C58B]">Permanent</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenPreview(item)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161A1F] border border-[#292E35] text-[11px] text-[#F5F2EC] hover:border-[#D9B875] transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-[#D9B875]" />
                            <span>Preview</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemovePlacement(item)}
                            className="p-1.5 rounded-lg bg-[#161A1F] border border-[#292E35] text-[#898D94] hover:text-[#E36B68] hover:border-[#E36B68]/40 transition-colors cursor-pointer"
                            aria-label="Remove from placement"
                            title="Remove from placement (Project remains published)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD FEATURED PLACEMENT MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#090A0C] border border-[#292E35] shadow-2xl overflow-hidden text-[#F5F2EC]">
            <div className="px-5 py-4 border-b border-[#1E222A] bg-[#0E1013] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-[#F06419]/15 border border-[#F06419]/30 text-[#F06419]">
                  <Sparkles className="w-4 h-4" />
                </span>
                <span className="font-heading font-semibold text-sm text-[#F5F2EC]">
                  Feature a Published Project
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAddModalOpen(false)}
                className="p-1 rounded text-[#898D94] hover:text-[#F5F2EC] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAddPlacement(false);
              }}
              className="p-5 space-y-4 text-xs"
            >
              {/* Select Published Project */}
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] text-[#B8B9BC] uppercase">
                  Select Published Project *
                </label>
                <select
                  required
                  value={formProjectId}
                  onChange={(e) => setFormProjectId(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#111419] border border-[#292E35] text-xs text-[#F5F2EC] focus:border-[#D9B875] focus:outline-none"
                >
                  {publishedProjects.length === 0 ? (
                    <option value="">No published projects available</option>
                  ) : (
                    publishedProjects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.projectType.toUpperCase()})
                      </option>
                    ))
                  )}
                </select>
                <p className="text-[10px] text-[#898D94]">
                  Only published portfolio entries can be featured. Drafts are omitted.
                </p>
              </div>

              {/* Placement Destination */}
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] text-[#B8B9BC] uppercase">
                  Placement Destination *
                </label>
                <select
                  value={formDestination}
                  onChange={(e) => {
                    const dest = e.target.value as any;
                    setFormDestination(dest);
                    if (dest === "division") setFormTargetId(SERVICE_DIVISIONS[0].slug);
                    else if (dest === "industry") setFormTargetId(INITIAL_SECTORS[0].slug);
                    else setFormTargetId("");
                  }}
                  className="w-full h-10 px-3 rounded-lg bg-[#111419] border border-[#292E35] text-xs text-[#F5F2EC] focus:border-[#D9B875] focus:outline-none"
                >
                  <option value="homepage">Homepage Featured (Primary Showcase)</option>
                  <option value="work_archive">Work &amp; Case Studies Archive (/work)</option>
                  <option value="division">Service Division Page</option>
                  <option value="industry">Industry Sector Page</option>
                  <option value="campaign">Temporary Editorial Campaign</option>
                </select>
              </div>

              {/* Conditional Target Options */}
              {formDestination === "division" && (
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] text-[#B8B9BC] uppercase">
                    Service Division *
                  </label>
                  <select
                    value={formTargetId}
                    onChange={(e) => setFormTargetId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#111419] border border-[#292E35] text-xs text-[#F5F2EC]"
                  >
                    {SERVICE_DIVISIONS.map((d) => (
                      <option key={d.slug} value={d.slug}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formDestination === "industry" && (
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] text-[#B8B9BC] uppercase">
                    Industry Sector *
                  </label>
                  <select
                    value={formTargetId}
                    onChange={(e) => setFormTargetId(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-[#111419] border border-[#292E35] text-xs text-[#F5F2EC]"
                  >
                    {INITIAL_SECTORS.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {formDestination === "campaign" && (
                <div className="space-y-1.5">
                  <label className="font-mono text-[11px] text-[#B8B9BC] uppercase">
                    Campaign Identifier
                  </label>
                  <input
                    type="text"
                    value={formTargetId}
                    onChange={(e) => setFormTargetId(e.target.value)}
                    placeholder="e.g. spring-launch-2027"
                    className="w-full h-10 px-3 rounded-lg bg-[#111419] border border-[#292E35] text-xs text-[#F5F2EC]"
                  />
                </div>
              )}

              {/* Display Order */}
              <div className="space-y-1.5">
                <label className="font-mono text-[11px] text-[#B8B9BC] uppercase">
                  Display Position / Slot Number *
                </label>
                <input
                  type="number"
                  min={1}
                  max={999}
                  required
                  value={formOrder}
                  onChange={(e) => setFormOrder(Number(e.target.value) || 1)}
                  className="w-full h-10 px-3 rounded-lg bg-[#111419] border border-[#292E35] text-xs text-[#F5F2EC]"
                />
                <p className="text-[10px] text-[#898D94]">
                  Slot 1 is the primary hero/lead position. Subsequent slots render in ordered priority.
                </p>
              </div>

              {/* Optional Scheduling */}
              <div className="p-3.5 rounded-xl bg-[#111419] border border-[#292E35] space-y-2.5">
                <div className="font-mono text-[10px] uppercase text-[#D9B875] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Optional Editorial Schedule</span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-[10px] text-[#898D94] block mb-1">
                      Featured From
                    </label>
                    <input
                      type="date"
                      value={formFeaturedFrom}
                      onChange={(e) => setFormFeaturedFrom(e.target.value)}
                      className="w-full h-9 px-2.5 rounded bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#898D94] block mb-1">
                      Featured Until
                    </label>
                    <input
                      type="date"
                      value={formFeaturedUntil}
                      onChange={(e) => setFormFeaturedUntil(e.target.value)}
                      className="w-full h-9 px-2.5 rounded bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#1E222A]">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-[#161A1F] border border-[#292E35] text-[#F5F2EC] hover:bg-[#1E222A] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !formProjectId}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#F06419] text-white font-semibold hover:bg-[#d95610] disabled:opacity-50 cursor-pointer"
                >
                  {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Placement</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFLICT RESOLUTION MODAL */}
      {conflictModalOpen && conflictInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0E1013] border border-[#F06419]/40 shadow-2xl p-6 text-[#F5F2EC] space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded-full bg-[#F06419]/15 border border-[#F06419]/40 text-[#F06419]">
                <AlertCircle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-heading font-bold text-sm text-[#F5F2EC]">
                  Placement Conflict Detected
                </h3>
                <p className="text-xs text-[#898D94]">
                  Homepage primary featured slot is already occupied
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs space-y-2 text-[#B8B9BC]">
              <p>
                The primary slot (Slot #1) on the EDYREX homepage is currently assigned to:
              </p>
              <div className="font-semibold text-[#D9B875] pl-2 border-l-2 border-[#D9B875]">
                {conflictInfo.currentProjectTitle}
              </div>
              <p className="text-[11px] text-[#898D94]">
                Proceeding will set your selected project as the new primary showcase. The previous project will be preserved safely as published work.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConflictModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] hover:bg-[#1E222A] cursor-pointer"
              >
                Keep Current
              </button>
              <button
                type="button"
                onClick={() => handleAddPlacement(true)}
                disabled={submitting}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F06419] text-white text-xs font-semibold hover:bg-[#d95610] cursor-pointer"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>Replace &amp; Set Primary</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PUBLIC PLACEMENT PREVIEW MODAL */}
      <PublicPlacementPreviewModal
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        project={previewProject}
      />
    </div>
  );
}
