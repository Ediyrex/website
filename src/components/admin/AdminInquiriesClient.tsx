"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  RefreshCw,
  Eye,
  Trash2,
  X,
  MessageSquarePlus,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useAdminUser } from "./AdminContext";

interface EnquirySummary {
  id: string;
  referenceCode: string;
  contactName: string;
  emailNormalized: string;
  companyName: string | null;
  phone: string | null;
  projectType: string;
  goalsAndRequirements: string;
  budgetMin: number | null;
  budgetMax: number | null;
  budgetCurrency: string | null;
  expectedTimeline: string;
  status: string;
  wantsDiscoveryCall: boolean;
  submittedAt: string;
  updatedAt: string;
}

interface EnquiryDetail extends EnquirySummary {
  source: string;
  history: {
    id: string;
    previousStatus: string | null;
    newStatus: string;
    reason: string | null;
    createdAt: string;
  }[];
  notes: {
    id: string;
    note: string;
    authorId: string | null;
    createdAt: string;
  }[];
}

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "reviewing", label: "Reviewing / Contacted" },
  { value: "qualified", label: "In Progress / Qualified" },
  { value: "proposal_sent", label: "Proposal Sent" },
  { value: "won", label: "Converted / Won" },
  { value: "lost", label: "Closed / Lost" },
  { value: "archived", label: "Archived" },
];

export function AdminInquiriesClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { canEdit, isAdmin } = useAdminUser();

  const [rows, setRows] = useState<EnquirySummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [selectedDetail, setSelectedDetail] = useState<EnquiryDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [savingNote, setSavingNote] = useState(false);
  const [statusReason, setStatusReason] = useState("");

  const fetchEnquiriesData = useCallback(async () => {
    const params = new URLSearchParams({ limit: "50" });
    if (statusFilter) params.set("status", statusFilter);
    if (query.trim()) params.set("q", query.trim());

    const res = await fetch(`/api/v1/admin/enquiries?${params.toString()}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Unable to fetch inquiries.");
    }
    return (json.data || []) as EnquirySummary[];
  }, [statusFilter, query, router]);

  const loadEnquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchEnquiriesData();
      if (data) setRows(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Network error loading inquiries."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchInspectorDetail = useCallback(async (id: string) => {
    const res = await fetch(`/api/v1/admin/enquiries/${id}`);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Unable to load enquiry details.");
    }
    return json.data as EnquiryDetail;
  }, []);

  const openInspector = useCallback(
    async (id: string) => {
      setDetailLoading(true);
      setError("");
      try {
        const detail = await fetchInspectorDetail(id);
        setSelectedDetail(detail);
        setStatusReason("");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Network error loading enquiry details."
        );
      } finally {
        setDetailLoading(false);
      }
    },
    [fetchInspectorDetail]
  );

  useEffect(() => {
    let ignore = false;
    fetchEnquiriesData()
      .then((data) => {
        if (!ignore && data) setRows(data);
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Network error loading inquiries."
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fetchEnquiriesData]);

  useEffect(() => {
    const idFromQuery = searchParams.get("id");
    if (!idFromQuery) return;
    let ignore = false;
    fetchInspectorDetail(idFromQuery)
      .then((detail) => {
        if (!ignore) {
          setSelectedDetail(detail);
          setStatusReason("");
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Network error loading enquiry details."
          );
        }
      });
    return () => {
      ignore = true;
    };
  }, [searchParams, fetchInspectorDetail]);

  const handleStatusChange = async (
    id: string,
    nextStatus: string,
    reason?: string
  ) => {
    setError("");
    setSuccessMsg("");
    try {
      const res = await fetch(`/api/v1/admin/enquiries/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          reason: reason?.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Failed to update inquiry status.");
        return;
      }

      setRows((prev) =>
        prev.map((row) => (row.id === id ? { ...row, status: nextStatus } : row))
      );
      if (selectedDetail?.id === id) {
        await openInspector(id);
      }
      setSuccessMsg(`Updated status to "${nextStatus}".`);
    } catch {
      setError("Network error updating inquiry status.");
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDetail || !noteText.trim()) return;
    setSavingNote(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/enquiries/${selectedDetail.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ note: noteText.trim() }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Failed to add note.");
        return;
      }
      setNoteText("");
      await openInspector(selectedDetail.id);
    } catch {
      setError("Network error adding inquiry note.");
    } finally {
      setSavingNote(false);
    }
  };

  const handleDelete = async (id: string, refCode: string) => {
    if (
      !window.confirm(
        `Permanently delete inquiry ${refCode}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setError("");
    try {
      const res = await fetch(`/api/v1/admin/enquiries/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to delete inquiry.");
        return;
      }
      setRows((prev) => prev.filter((r) => r.id !== id));
      if (selectedDetail?.id === id) setSelectedDetail(null);
      setSuccessMsg(`Deleted inquiry ${refCode}.`);
    } catch {
      setError("Network error deleting inquiry.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
            Inquiries
          </h1>
          <p className="text-sm text-[#B2B4BA]">
            Review inbound leads, update lifecycle stages, log internal notes, and archive or remove records.
          </p>
        </div>

        <button
          type="button"
          onClick={loadEnquiries}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#B2B4BA] hover:text-white cursor-pointer"
        >
          <RefreshCw className={loading ? "w-3.5 h-3.5 animate-spin" : "w-3.5 h-3.5"} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search reference code, contact name, email, or service..."
            className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#12151A] border border-[#252A32] text-sm text-[#F5F3EE] placeholder-[#777D87] focus:outline-none focus:border-[#D6B77A]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter inquiries by status"
          className="h-10 px-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs font-mono text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
        >
          <option value="">All statuses</option>
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-[#2A1414] border border-[#F28B82]/40 text-xs text-[#F28B82]">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="p-3.5 rounded-xl bg-[#13261C] border border-[#7CD69F]/40 text-xs text-[#7CD69F]">
          {successMsg}
        </div>
      )}

      {/* Table */}
      <div className="rounded-xl bg-[#12151A] border border-[#252A32] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#252A32] text-[11px] font-mono uppercase tracking-wider text-[#777D87] bg-[#0D0F12]">
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4">Contact</th>
                <th className="py-3 px-4">Scope &amp; Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252A32] text-sm">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs font-mono text-[#777D87]">
                    Loading inquiries...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-[#777D87]">
                    No inquiries match your filters.
                  </td>
                </tr>
              ) : (
                rows.map((inq) => (
                  <tr key={inq.id} className="hover:bg-[#161A20] transition-colors">
                    <td className="py-3.5 px-4 font-mono text-xs text-[#D6B77A]">
                      {inq.referenceCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-[#F5F3EE]">{inq.contactName}</div>
                      <div className="text-xs text-[#777D87]">{inq.emailNormalized}</div>
                      {inq.companyName && (
                        <div className="text-[11px] text-[#B2B4BA]">{inq.companyName}</div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs text-[#F5F3EE]">{inq.projectType}</div>
                      <div className="text-[11px] font-mono text-[#777D87]">
                        {inq.budgetCurrency || "USD"}{" "}
                        {inq.budgetMin ? inq.budgetMin.toLocaleString() : "Flexible"}
                        {inq.budgetMax ? `–${inq.budgetMax.toLocaleString()}` : ""}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      {canEdit ? (
                        <select
                          value={inq.status}
                          onChange={(e) => handleStatusChange(inq.id, e.target.value)}
                          aria-label={`Change status for ${inq.referenceCode}`}
                          className="h-8 px-2 rounded bg-[#0D0F12] border border-[#252A32] text-xs font-mono text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
                        >
                          {STATUS_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <Badge variant="default">{inq.status}</Badge>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#777D87] whitespace-nowrap">
                      {new Date(inq.submittedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => openInspector(inq.id)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#191D23] border border-[#252A32] text-xs text-[#F5F3EE] hover:border-[#D6B77A] cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </button>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => handleDelete(inq.id, inq.referenceCode)}
                            aria-label={`Delete ${inq.referenceCode}`}
                            className="p-1.5 rounded-lg text-[#777D87] hover:text-[#F28B82] hover:bg-[#2A1414] cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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

      {/* Inspector Modal */}
      {(selectedDetail || detailLoading) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-end">
          <div className="w-full max-w-2xl h-full bg-[#0D0F12] border-l border-[#252A32] flex flex-col overflow-hidden">
            <div className="px-6 py-4 border-b border-[#252A32] flex items-center justify-between">
              <div>
                <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
                  {selectedDetail
                    ? `${selectedDetail.referenceCode} — ${selectedDetail.contactName}`
                    : "Loading Enquiry..."}
                </h2>
                {selectedDetail && (
                  <p className="text-xs text-[#777D87]">
                    Submitted {new Date(selectedDetail.submittedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelectedDetail(null)}
                className="p-2 rounded-lg text-[#B2B4BA] hover:text-white hover:bg-[#191D23] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {detailLoading || !selectedDetail ? (
              <div className="p-8 text-xs font-mono text-[#777D87] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Loading inquiry record...</span>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-[#12151A] border border-[#252A32] text-xs">
                  <div>
                    <div className="text-[#777D87] font-mono">EMAIL</div>
                    <div className="text-[#F5F3EE] mt-0.5">{selectedDetail.emailNormalized}</div>
                  </div>
                  <div>
                    <div className="text-[#777D87] font-mono">PHONE</div>
                    <div className="text-[#F5F3EE] mt-0.5">
                      {selectedDetail.phone || "Not provided"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#777D87] font-mono">COMPANY</div>
                    <div className="text-[#F5F3EE] mt-0.5">
                      {selectedDetail.companyName || "Individual / Unspecified"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#777D87] font-mono">DISCOVERY CALL</div>
                    <div className="text-[#F5F3EE] mt-0.5">
                      {selectedDetail.wantsDiscoveryCall ? "Requested" : "Not requested"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[#777D87] font-mono">SERVICE / SCOPE</div>
                    <div className="text-[#F5F3EE] mt-0.5">{selectedDetail.projectType}</div>
                  </div>
                  <div>
                    <div className="text-[#777D87] font-mono">TIMELINE</div>
                    <div className="text-[#F5F3EE] mt-0.5">{selectedDetail.expectedTimeline}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-mono text-[#777D87] uppercase">
                    Project Goals &amp; Requirements
                  </div>
                  <div className="p-4 rounded-xl bg-[#12151A] border border-[#252A32] text-sm text-[#E5E2DC] whitespace-pre-wrap leading-relaxed">
                    {selectedDetail.goalsAndRequirements}
                  </div>
                </div>

                {canEdit && (
                  <div className="p-4 rounded-xl bg-[#12151A] border border-[#252A32] space-y-3">
                    <div className="text-xs font-mono text-[#777D87] uppercase">
                      Update Status
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <input
                        type="text"
                        value={statusReason}
                        onChange={(e) => setStatusReason(e.target.value)}
                        placeholder="Optional reason for audit log..."
                        className="flex-1 min-w-[180px] h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE] placeholder-[#777D87]"
                      />
                      <select
                        value={selectedDetail.status}
                        onChange={(e) =>
                          handleStatusChange(
                            selectedDetail.id,
                            e.target.value,
                            statusReason
                          )
                        }
                        className="h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs font-mono text-[#F5F3EE]"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {/* Notes */}
                <div className="space-y-3">
                  <div className="text-xs font-mono text-[#777D87] uppercase">
                    Internal Studio Notes ({selectedDetail.notes.length})
                  </div>

                  {canEdit && (
                    <form onSubmit={handleAddNote} className="space-y-2">
                      <textarea
                        value={noteText}
                        onChange={(e) => setNoteText(e.target.value)}
                        rows={3}
                        placeholder="Add an internal follow-up note..."
                        className="w-full p-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE] placeholder-[#777D87] focus:outline-none focus:border-[#D6B77A]"
                      />
                      <button
                        type="submit"
                        disabled={savingNote || !noteText.trim()}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold disabled:opacity-50 cursor-pointer"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" />
                        <span>{savingNote ? "Saving..." : "Add Note"}</span>
                      </button>
                    </form>
                  )}

                  <div className="space-y-2">
                    {selectedDetail.notes.map((n) => (
                      <div
                        key={n.id}
                        className="p-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs space-y-1"
                      >
                        <p className="text-[#F5F3EE] whitespace-pre-wrap">{n.note}</p>
                        <p className="text-[10px] font-mono text-[#777D87]">
                          {new Date(n.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* History */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-[#777D87] uppercase">
                    Status History
                  </div>
                  <div className="space-y-1.5">
                    {selectedDetail.history.map((h) => (
                      <div
                        key={h.id}
                        className="px-3 py-2 rounded-lg bg-[#12151A] border border-[#252A32] text-xs flex flex-wrap justify-between gap-2"
                      >
                        <span>
                          {h.previousStatus ? `${h.previousStatus} -> ` : ""}
                          <strong className="text-[#D6B77A]">{h.newStatus}</strong>
                          {h.reason ? ` (${h.reason})` : ""}
                        </span>
                        <span className="font-mono text-[10px] text-[#777D87]">
                          {new Date(h.createdAt).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
