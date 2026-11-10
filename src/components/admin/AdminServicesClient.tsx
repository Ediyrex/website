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
  FolderPlus,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useAdminUser } from "./AdminContext";
import { MediaPickerModal, type MediaAssetItem } from "./MediaPickerModal";

interface DivisionRow {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string | null;
  displayOrder: number;
  isActive: boolean;
}

interface ServiceRow {
  id: string;
  divisionId: string;
  title: string;
  slug: string;
  summary: string;
  divisionSlug: string;
  divisionName: string;
  coverAssetId: string | null;
  coverAssetUrl: string | null;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  displayOrder: number;
}

interface ServiceFormState {
  id?: string;
  divisionId: string;
  title: string;
  slug: string;
  summary: string;
  description: string;
  deliverables: string[];
  iconName: string;
  coverAssetId: string | null;
  coverAssetUrl: string | null;
  isFeatured: boolean;
  displayOrder: number;
  status: "draft" | "published" | "archived";
  seoTitle: string;
  seoDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImageAssetId: string | null;
  ogImageAssetUrl: string | null;
  noIndex: boolean;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminServicesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { canEdit, isAdmin } = useAdminUser();

  const [servicesList, setServicesList] = useState<ServiceRow[]>([]);
  const [divisions, setDivisions] = useState<DivisionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [divisionFilter, setDivisionFilter] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deliverableDraft, setDeliverableDraft] = useState("");
  const [form, setForm] = useState<ServiceFormState | null>(null);
  const [pickerTarget, setPickerTarget] = useState<"cover" | "og" | null>(null);

  const [divModalOpen, setDivModalOpen] = useState(false);
  const [newDivName, setNewDivName] = useState("");
  const [newDivSlug, setNewDivSlug] = useState("");
  const [newDivDesc, setNewDivDesc] = useState("");

  const fetchServicesAndDivisions = useCallback(async () => {
    const params = new URLSearchParams({ limit: "50" });
    if (statusFilter) params.set("status", statusFilter);
    if (divisionFilter) params.set("division", divisionFilter);
    if (query.trim()) params.set("q", query.trim());

    const [svcRes, divRes] = await Promise.all([
      fetch(`/api/v1/admin/services?${params.toString()}`),
      fetch("/api/v1/admin/divisions"),
    ]);

    if (svcRes.status === 401) {
      router.push("/admin/login");
      return null;
    }

    const [svcJson, divJson] = await Promise.all([svcRes.json(), divRes.json()]);
    if (!svcRes.ok) {
      throw new Error(svcJson.message || "Unable to fetch services.");
    }

    return {
      services: (svcJson.data || []) as ServiceRow[],
      divisions: (divJson.data || []) as DivisionRow[],
    };
  }, [statusFilter, divisionFilter, query, router]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchServicesAndDivisions();
      if (result) {
        setServicesList(result.services);
        setDivisions(result.divisions);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error loading services."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchServicesAndDivisions()
      .then((result) => {
        if (!ignore && result) {
          setServicesList(result.services);
          setDivisions(result.divisions);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Network error loading services."
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fetchServicesAndDivisions]);

  const openCreateModal = useCallback(() => {
    setForm({
      divisionId: divisions[0]?.id || "",
      title: "",
      slug: "",
      summary: "",
      description: "",
      deliverables: [],
      iconName: "Layers",
      coverAssetId: null,
      coverAssetUrl: null,
      isFeatured: false,
      displayOrder: servicesList.length + 1,
      status: "draft",
      seoTitle: "",
      seoDescription: "",
      ogTitle: "",
      ogDescription: "",
      ogImageAssetId: null,
      ogImageAssetUrl: null,
      noIndex: false,
    });
    setDeliverableDraft("");
    setEditorOpen(true);
  }, [divisions, servicesList.length]);

  const fetchServiceFormById = useCallback(async (id: string): Promise<ServiceFormState> => {
    const res = await fetch(`/api/v1/admin/services/${id}`);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Unable to load service details.");
    }
    const d = json.data;
    return {
      id: d.id,
      divisionId: d.divisionId,
      title: d.title,
      slug: d.slug,
      summary: d.summary,
      description: d.description,
      deliverables: Array.isArray(d.deliverables) ? d.deliverables : [],
      iconName: d.iconName || "",
      coverAssetId: d.coverAssetId || null,
      coverAssetUrl: d.coverAsset?.secureUrl || null,
      isFeatured: Boolean(d.isFeatured),
      displayOrder: d.displayOrder ?? 0,
      status: d.status || "draft",
      seoTitle: d.seoTitle || "",
      seoDescription: d.seoDescription || "",
      ogTitle: d.ogTitle || "",
      ogDescription: d.ogDescription || "",
      ogImageAssetId: d.ogImageAssetId || null,
      ogImageAssetUrl: d.ogImageAsset?.secureUrl || null,
      noIndex: Boolean(d.noIndex),
    };
  }, []);

  const openEditModal = useCallback(
    async (id: string) => {
      setError("");
      try {
        const mapped = await fetchServiceFormById(id);
        setForm(mapped);
        setDeliverableDraft("");
        setEditorOpen(true);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Network error fetching service record."
        );
      }
    },
    [fetchServiceFormById]
  );

  useEffect(() => {
    const editId = searchParams.get("edit");
    const createFlag = searchParams.get("create");
    let ignore = false;

    if (editId) {
      fetchServiceFormById(editId)
        .then((mapped) => {
          if (!ignore) {
            setForm(mapped);
            setDeliverableDraft("");
            setEditorOpen(true);
          }
        })
        .catch((err) => {
          if (!ignore) {
            setError(
              err instanceof Error
                ? err.message
                : "Network error fetching service record."
            );
          }
        });
    } else if (createFlag === "1" && divisions.length > 0 && !editorOpen) {
      Promise.resolve().then(() => {
        if (!ignore) openCreateModal();
      });
    }

    return () => {
      ignore = true;
    };
  }, [searchParams, divisions.length, editorOpen, openCreateModal, fetchServiceFormById]);

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;

    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      divisionId: form.divisionId,
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      description: form.description,
      deliverables: form.deliverables,
      iconName: form.iconName || null,
      coverAssetId: form.coverAssetId,
      isFeatured: form.isFeatured,
      displayOrder: form.displayOrder,
      status: form.status,
      seoTitle: form.seoTitle || null,
      seoDescription: form.seoDescription || null,
      ogTitle: form.ogTitle || null,
      ogDescription: form.ogDescription || null,
      ogImageAssetId: form.ogImageAssetId,
      noIndex: form.noIndex,
    };

    try {
      const endpoint = form.id
        ? `/api/v1/admin/services/${form.id}`
        : "/api/v1/admin/services";
      const method = form.id ? "PATCH" : "POST";

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to save service.");
        return;
      }

      setEditorOpen(false);
      setSuccess(
        form.id ? "Service updated successfully." : "New service created."
      );
      await loadData();
    } catch {
      setError("Network error saving service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (svc: ServiceRow) => {
    if (!window.confirm(`Delete service "${svc.title}"?`)) return;
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/v1/admin/services/${svc.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to delete service.");
        return;
      }
      setServicesList((prev) => prev.filter((item) => item.id !== svc.id));
      setSuccess(`Deleted service "${svc.title}".`);
    } catch {
      setError("Network error deleting service.");
    }
  };

  const handleCreateDivision = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/v1/admin/divisions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newDivName,
          slug: newDivSlug,
          description: newDivDesc,
          displayOrder: divisions.length + 1,
          isActive: true,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to create division.");
        return;
      }
      setDivModalOpen(false);
      setNewDivName("");
      setNewDivSlug("");
      setNewDivDesc("");
      setSuccess("Created new service division.");
      await loadData();
    } catch {
      setError("Network error creating division.");
    }
  };

  const addDeliverable = () => {
    const trimmed = deliverableDraft.trim();
    if (!trimmed || !form) return;
    setForm({ ...form, deliverables: [...form.deliverables, trimmed] });
    setDeliverableDraft("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
            Services &amp; Divisions
          </h1>
          <p className="text-sm text-[#B2B4BA]">
            Manage Media, Digital, AI, and custom studio offerings, deliverables, ordering, and publication status.
          </p>
        </div>

        {canEdit && (
          <div className="flex flex-wrap gap-2.5">
            {isAdmin && (
              <button
                type="button"
                onClick={() => setDivModalOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE] hover:border-[#3A414B] cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-[#D6B77A]" />
                <span>Add Division</span>
              </button>
            )}
            <button
              type="button"
              onClick={openCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Service</span>
            </button>
          </div>
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
            placeholder="Search service title, slug, or summary..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#12151A] border border-[#252A32] text-sm text-[#F5F3EE] placeholder-[#777D87] focus:outline-none focus:border-[#D6B77A]"
          />
        </div>

        <select
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value)}
          className="h-10 px-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs font-mono text-[#F5F3EE]"
        >
          <option value="">All divisions</option>
          {divisions.map((d) => (
            <option key={d.id} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>

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

      {/* Services Table */}
      <div className="rounded-xl bg-[#12151A] border border-[#252A32] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252A32] text-[11px] font-mono uppercase tracking-wider text-[#777D87] bg-[#0D0F12]">
                <th className="py-3 px-4">Service</th>
                <th className="py-3 px-4">Division</th>
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
                    Loading services...
                  </td>
                </tr>
              ) : servicesList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#777D87]">
                    No services found.
                  </td>
                </tr>
              ) : (
                servicesList.map((svc) => (
                  <tr key={svc.id} className="hover:bg-[#161A20]">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        {svc.coverAssetUrl ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={svc.coverAssetUrl}
                            alt={svc.title}
                            className="w-10 h-10 rounded-lg object-cover border border-[#252A32] shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#0D0F12] border border-[#252A32] flex items-center justify-center text-[#777D87] shrink-0">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-[#F5F3EE]">{svc.title}</div>
                          <div className="text-xs font-mono text-[#777D87]">
                            /{svc.slug}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#B2B4BA]">
                      {svc.divisionName}
                    </td>
                    <td className="py-3.5 px-4">
                      <Badge
                        variant={svc.status === "published" ? "accent" : "default"}
                      >
                        {svc.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#B2B4BA]">
                      {svc.isFeatured ? "Featured" : "Standard"}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-[#777D87]">
                      #{svc.displayOrder}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {canEdit && (
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEditModal(svc.id)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#191D23] border border-[#252A32] text-xs text-[#F5F3EE] hover:border-[#D6B77A] cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteService(svc)}
                            aria-label={`Delete ${svc.title}`}
                            className="p-1.5 rounded-lg text-[#777D87] hover:text-[#F28B82] hover:bg-[#2A1414] cursor-pointer"
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

      {/* Create / Edit Service Modal */}
      {editorOpen && form && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-[#12151A] border border-[#252A32] overflow-hidden">
            <div className="px-6 py-4 border-b border-[#252A32] flex items-center justify-between">
              <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
                {form.id ? `Edit Service — ${form.title}` : "Create New Service"}
              </h2>
              <button
                type="button"
                onClick={() => setEditorOpen(false)}
                className="p-2 rounded-lg text-[#B2B4BA] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form
              onSubmit={handleSaveService}
              className="flex-1 overflow-y-auto p-6 space-y-5"
            >
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
                  <label className="text-xs font-mono text-[#B2B4BA]">Division *</label>
                  <select
                    required
                    value={form.divisionId}
                    onChange={(e) =>
                      setForm({ ...form, divisionId: e.target.value })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                  >
                    {divisions.map((div) => (
                      <option key={div.id} value={div.id}>
                        {div.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as ServiceFormState["status"],
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-[#B2B4BA]">
                  Short Summary * (10–320 chars)
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

              {/* Deliverables */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#B2B4BA]">
                  Service Features / Deliverables
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={deliverableDraft}
                    onChange={(e) => setDeliverableDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addDeliverable();
                      }
                    }}
                    placeholder="e.g., 4K Cinema Grading & Sound Design"
                    className="flex-1 h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
                  />
                  <button
                    type="button"
                    onClick={addDeliverable}
                    className="px-3.5 h-9 rounded-lg bg-[#191D23] border border-[#3A414B] text-xs text-[#F5F3EE] cursor-pointer"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.deliverables.map((item, idx) => (
                    <span
                      key={`${item}-${idx}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#0D0F12] border border-[#252A32] text-xs text-[#E5E2DC]"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            deliverables: form.deliverables.filter(
                              (_, i) => i !== idx
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

              {/* Media & Display Order */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-[#B2B4BA]">
                    Display Order
                  </label>
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
                    className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
                  />
                </div>

                <label className="inline-flex items-center gap-2 h-10 text-xs text-[#F5F3EE] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.isFeatured}
                    onChange={(e) =>
                      setForm({ ...form, isFeatured: e.target.checked })
                    }
                  />
                  <span>Featured service</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPickerTarget("cover")}
                    className="inline-flex items-center gap-1.5 px-3 h-10 rounded-lg bg-[#191D23] border border-[#252A32] text-xs text-[#F5F3EE] hover:border-[#D6B77A] cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>
                      {form.coverAssetId ? "Change Cover Media" : "Attach Media"}
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

              {/* SEO Metadata */}
              <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#252A32] space-y-3">
                <div className="text-xs font-mono uppercase text-[#D6B77A]">
                  SEO &amp; Open Graph
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
                  placeholder="Meta Description"
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
                    <span>Exclude from search indexing (noindex)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setPickerTarget("og")}
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
                  <span>{form.id ? "Save Changes" : "Create Service"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Division Modal */}
      {divModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateDivision}
            className="w-full max-w-md rounded-2xl bg-[#12151A] border border-[#252A32] p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
                Add Service Division
              </h2>
              <button
                type="button"
                onClick={() => setDivModalOpen(false)}
                className="text-[#777D87] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">Name *</label>
              <input
                type="text"
                required
                value={newDivName}
                onChange={(e) => {
                  setNewDivName(e.target.value);
                  setNewDivSlug(slugify(e.target.value));
                }}
                className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">Slug *</label>
              <input
                type="text"
                required
                value={newDivSlug}
                onChange={(e) => setNewDivSlug(slugify(e.target.value))}
                className="w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm font-mono text-[#F5F3EE]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-[#B2B4BA]">
                Description *
              </label>
              <textarea
                rows={3}
                required
                value={newDivDesc}
                onChange={(e) => setNewDivDesc(e.target.value)}
                className="w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setDivModalOpen(false)}
                className="px-4 py-2 text-xs text-[#B2B4BA] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold cursor-pointer"
              >
                Create Division
              </button>
            </div>
          </form>
        </div>
      )}

      <MediaPickerModal
        open={pickerTarget !== null}
        title={
          pickerTarget === "og"
            ? "Select Open Graph Image"
            : "Select Service Media"
        }
        selectedId={
          pickerTarget === "og" ? form?.ogImageAssetId : form?.coverAssetId
        }
        onClose={() => setPickerTarget(null)}
        onSelectSingle={(asset: MediaAssetItem) => {
          if (!form) return;
          if (pickerTarget === "cover") {
            setForm({
              ...form,
              coverAssetId: asset.id,
              coverAssetUrl: asset.secureUrl,
            });
          } else if (pickerTarget === "og") {
            setForm({
              ...form,
              ogImageAssetId: asset.id,
              ogImageAssetUrl: asset.secureUrl,
            });
          }
        }}
      />
    </div>
  );
}
