"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  CalendarPlus,
  Check,
  Clock,
  FolderKanban,
  Loader2,
  Mail,
  MessageSquare,
  Phone,
  Send,
  Trash2,
  UserCheck,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ALL_STATUS_OPTIONS,
  PIPELINE_STAGES,
  formatDueBadge,
  formatSourceLabel,
  getStatusMeta,
  type CrmClientRow,
  type EnquiryDetail,
  type EnquiryStatus,
  type EnquirySummary,
} from "./crm-types";

const inputClass =
  "w-full h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE] placeholder:text-[#6D7480] focus:outline-none focus:border-[#D6B77A]";

const labelClass =
  "block text-[10px] font-mono uppercase tracking-[0.14em] text-[#777D87] mb-1.5";

/* -------------------------------------------------------------------------- */
/*  1. Add Inquiry Modal                                                       */
/* -------------------------------------------------------------------------- */

export function AddInquiryModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [contactName, setContactName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState("Website Development");
  const [source, setSource] = useState("manual_entry");
  const [status, setStatus] = useState<EnquiryStatus>("new");
  const [expectedTimeline, setExpectedTimeline] = useState("1-2 months");
  const [goalsAndRequirements, setGoalsAndRequirements] = useState("");
  const [wantsDiscoveryCall, setWantsDiscoveryCall] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName,
          email,
          companyName: companyName || undefined,
          phone: phone || undefined,
          projectType,
          source,
          status,
          expectedTimeline,
          goalsAndRequirements:
            goalsAndRequirements.trim() || "Added directly in CRM workspace.",
          wantsDiscoveryCall,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to create inquiry.");
        return;
      }
      onSuccess();
      onClose();
    } catch {
      setError("Network error while creating inquiry.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalFrame
      title="Add New Inquiry"
      subtitle="Log a direct lead from referral, LinkedIn, call, or email."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={labelClass}>Contact Name *</label>
            <input
              type="text"
              required
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              placeholder="e.g. Rohan Khatri"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Company / Brand</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Studio or company name"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Service Interest *</label>
            <input
              type="text"
              required
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              placeholder="Website Development, Brand Identity..."
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Lead Source</label>
            <select
              value={source}
              onChange={(e) => setSource(e.target.value)}
              className={inputClass}
            >
              <option value="manual_entry">Direct / Manual</option>
              <option value="website">Website</option>
              <option value="referral">Referral</option>
              <option value="linkedin">LinkedIn</option>
              <option value="outbound">Outbound</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Pipeline Stage</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as EnquiryStatus)}
              className={inputClass}
            >
              {PIPELINE_STAGES.map((s) => (
                <option key={s.status} value={s.status}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Expected Timeline</label>
            <input
              type="text"
              value={expectedTimeline}
              onChange={(e) => setExpectedTimeline(e.target.value)}
              placeholder="2-4 weeks, Q2..."
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Goals &amp; Brief</label>
          <textarea
            rows={3}
            value={goalsAndRequirements}
            onChange={(e) => setGoalsAndRequirements(e.target.value)}
            placeholder="Scope summary, key deliverables, or initial call context..."
            className="w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE] placeholder:text-[#6D7480] focus:outline-none focus:border-[#D6B77A]"
          />
        </div>

        <label className="inline-flex items-center gap-2 text-xs text-[#C8C3B8] cursor-pointer">
          <input
            type="checkbox"
            checked={wantsDiscoveryCall}
            onChange={(e) => setWantsDiscoveryCall(e.target.checked)}
            className="rounded border-[#323946] bg-[#0D0F12]"
          />
          <span>Requested discovery call</span>
        </label>

        <ModalFooter onClose={onClose} saving={saving} submitLabel="Create Inquiry" />
      </form>
    </ModalFrame>
  );
}

/* -------------------------------------------------------------------------- */
/*  2. Add Client Modal                                                        */
/* -------------------------------------------------------------------------- */

export function AddClientModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [serviceInterest, setServiceInterest] = useState("Brand Identity & Design");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/crm/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          companyName: companyName || undefined,
          phone: phone || undefined,
          serviceInterest,
          source: "direct",
          status: "active",
          notes,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to create client.");
        return;
      }
      onSuccess();
      onClose();
    } catch {
      setError("Network error while adding client.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalFrame
      title="Add Studio Client"
      subtitle="Register an active or retainer client directly in CRM."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={labelClass}>Client Name *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Primary contact name"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Email Address *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="client@company.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Company</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Company or brand"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Primary Service Scope</label>
          <input
            type="text"
            required
            value={serviceInterest}
            onChange={(e) => setServiceInterest(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Account Notes</label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Retainer details, billing notes, or stakeholder preferences..."
            className="w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE] placeholder:text-[#6D7480] focus:outline-none focus:border-[#D6B77A]"
          />
        </div>
        <ModalFooter onClose={onClose} saving={saving} submitLabel="Save Client" />
      </form>
    </ModalFrame>
  );
}

/* -------------------------------------------------------------------------- */
/*  3. Create Follow-up Modal                                                  */
/* -------------------------------------------------------------------------- */

export function CreateFollowupModal({
  enquiriesList,
  clientsList,
  initialEnquiryId,
  initialClientId,
  onClose,
  onSuccess,
}: {
  enquiriesList: EnquirySummary[];
  clientsList: CrmClientRow[];
  initialEnquiryId?: string | null;
  initialClientId?: string | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const defaultTarget = initialClientId
    ? `client:${initialClientId}`
    : initialEnquiryId
    ? `enquiry:${initialEnquiryId}`
    : enquiriesList[0]
    ? `enquiry:${enquiriesList[0].id}`
    : clientsList[0]
    ? `client:${clientsList[0].id}`
    : "";

  const [target, setTarget] = useState(defaultTarget);
  const [title, setTitle] = useState("");
  const [channel, setChannel] = useState<
    "email" | "call" | "meeting" | "whatsapp" | "other"
  >("email");
  const [dueAt, setDueAt] = useState(() => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  });
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!target) {
      setError("Select an inquiry or client first.");
      return;
    }
    const [kind, targetId] = target.split(":");
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/crm/followups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enquiryId: kind === "enquiry" ? targetId : null,
          clientId: kind === "client" ? targetId : null,
          title,
          channel,
          dueAt: new Date(dueAt).toISOString(),
          notes,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to schedule follow-up.");
        return;
      }
      onSuccess();
      onClose();
    } catch {
      setError("Network error while creating follow-up.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalFrame
      title="Schedule Follow-up"
      subtitle="Set a dated reminder linked directly to a lead or client."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}
        <div>
          <label className={labelClass}>Lead or Client *</label>
          <select
            required
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className={inputClass}
          >
            <option value="">Select lead or client...</option>
            {enquiriesList.length > 0 && (
              <optgroup label="Inquiries / Leads">
                {enquiriesList.map((e) => (
                  <option key={e.id} value={`enquiry:${e.id}`}>
                    {e.contactName} — {e.projectType} ({e.referenceCode})
                  </option>
                ))}
              </optgroup>
            )}
            {clientsList.length > 0 && (
              <optgroup label="Clients">
                {clientsList.map((c) => (
                  <option key={c.id} value={`client:${c.id}`}>
                    {c.name} {c.companyName ? `(${c.companyName})` : ""}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div>
          <label className={labelClass}>Follow-up Action *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Share project proposal & timeline"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={labelClass}>Channel</label>
            <select
              value={channel}
              onChange={(e) =>
                setChannel(
                  e.target.value as
                    | "email"
                    | "call"
                    | "meeting"
                    | "whatsapp"
                    | "other"
                )
              }
              className={inputClass}
            >
              <option value="email">Email</option>
              <option value="call">Phone Call</option>
              <option value="meeting">Meeting</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Due Date &amp; Time *</label>
            <input
              type="datetime-local"
              required
              value={dueAt}
              onChange={(e) => setDueAt(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Reminder Notes</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Talking points or documents to attach..."
            className="w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE] placeholder:text-[#6D7480] focus:outline-none focus:border-[#D6B77A]"
          />
        </div>

        <ModalFooter
          onClose={onClose}
          saving={saving}
          submitLabel="Schedule Follow-up"
        />
      </form>
    </ModalFrame>
  );
}

/* -------------------------------------------------------------------------- */
/*  4. Convert Lead to Client Modal (+ Optional PMS Project)                   */
/* -------------------------------------------------------------------------- */

export function ConvertToClientModal({
  enquiriesList,
  initialEnquiry,
  onClose,
  onSuccess,
}: {
  enquiriesList: EnquirySummary[];
  initialEnquiry?: EnquirySummary | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const candidates = enquiriesList.filter((e) => !e.convertedClientId);
  const firstCandidate = initialEnquiry || candidates[0] || null;

  const [selectedId, setSelectedId] = useState(firstCandidate?.id || "");
  const selected =
    enquiriesList.find((e) => e.id === selectedId) || firstCandidate;

  const [name, setName] = useState(selected?.contactName || "");
  const [companyName, setCompanyName] = useState(selected?.companyName || "");
  const [phone, setPhone] = useState(selected?.phone || "");
  const [serviceInterest, setServiceInterest] = useState(
    selected?.projectType || ""
  );
  const [createPmsProject, setCreatePmsProject] = useState(true);
  const [pmsProjectTitle, setPmsProjectTitle] = useState(
    selected
      ? `${selected.companyName || selected.contactName} — ${selected.projectType}`
      : ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSelectLead = (id: string) => {
    setSelectedId(id);
    const found = enquiriesList.find((e) => e.id === id);
    if (found) {
      setName(found.contactName);
      setCompanyName(found.companyName || "");
      setPhone(found.phone || "");
      setServiceInterest(found.projectType);
      setPmsProjectTitle(
        `${found.companyName || found.contactName} — ${found.projectType}`
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId) {
      setError("Please select an inquiry to convert.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/enquiries/${selectedId}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || undefined,
          companyName: companyName || undefined,
          phone: phone || undefined,
          serviceInterest: serviceInterest || undefined,
          createPmsProject,
          pmsProjectTitle: createPmsProject ? pmsProjectTitle : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to convert lead.");
        return;
      }
      onSuccess();
      onClose();
    } catch {
      setError("Network error while converting lead.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalFrame
      title="Convert Lead to Client"
      subtitle="Automatically carry over inquiry details into Clients & PMS without re-entering."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}
        {!initialEnquiry && (
          <div>
            <label className={labelClass}>Select Inquiry *</label>
            <select
              required
              value={selectedId}
              onChange={(e) => handleSelectLead(e.target.value)}
              className={inputClass}
            >
              <option value="">Choose an inquiry...</option>
              {candidates.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.contactName} — {e.projectType} ({e.referenceCode})
                </option>
              ))}
            </select>
          </div>
        )}

        {selected && (
          <div className="p-3 rounded-lg bg-[#0D0F12] border border-[#1E222A] text-xs text-[#8D939E] flex items-center justify-between">
            <span>{selected.emailNormalized}</span>
            <span className="font-mono text-[#D6B77A]">
              {selected.referenceCode}
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={labelClass}>Client Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Company</label>
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Service Scope</label>
            <input
              type="text"
              required
              value={serviceInterest}
              onChange={(e) => setServiceInterest(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#0D0F12] border border-[#252A32] space-y-3">
          <label className="flex items-center gap-2.5 text-xs font-medium text-[#F5F3EE] cursor-pointer">
            <input
              type="checkbox"
              checked={createPmsProject}
              onChange={(e) => setCreatePmsProject(e.target.checked)}
              className="rounded border-[#323946] bg-[#08090B]"
            />
            <span>Also create an internal project &amp; kickoff task in PMS</span>
          </label>
          {createPmsProject && (
            <div>
              <label className={labelClass}>Internal PMS Project Title</label>
              <input
                type="text"
                required
                value={pmsProjectTitle}
                onChange={(e) => setPmsProjectTitle(e.target.value)}
                className={inputClass}
              />
            </div>
          )}
        </div>

        <ModalFooter
          onClose={onClose}
          saving={saving}
          submitLabel="Convert to Client"
        />
      </form>
    </ModalFrame>
  );
}

/* -------------------------------------------------------------------------- */
/*  5. Create Internal PMS Project Modal                                       */
/* -------------------------------------------------------------------------- */

export function CreatePmsProjectModal({
  client,
  enquiry,
  onClose,
  onSuccess,
}: {
  client?: CrmClientRow | null;
  enquiry?: EnquirySummary | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const defaultTitle = client
    ? `${client.companyName || client.name} — ${client.serviceInterest}`
    : enquiry
    ? `${enquiry.companyName || enquiry.contactName} — ${enquiry.projectType}`
    : "";

  const [title, setTitle] = useState(defaultTitle);
  const [serviceInterest, setServiceInterest] = useState(
    client?.serviceInterest || enquiry?.projectType || "Studio Delivery"
  );
  const [dueDateLabel, setDueDateLabel] = useState(
    enquiry?.expectedTimeline || "This month"
  );
  const [summary, setSummary] = useState(
    client?.notes || enquiry?.goalsAndRequirements || ""
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/pms/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          clientId: client?.id || enquiry?.convertedClientId || null,
          sourceEnquiryId: enquiry?.id || client?.sourceEnquiryId || null,
          serviceInterest,
          status: "planning",
          dueDateLabel,
          summary,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to create PMS project.");
        return;
      }
      onSuccess();
      onClose();
    } catch {
      setError("Network error creating PMS project.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ModalFrame
      title="Create Internal PMS Project"
      subtitle="Spin up an operational delivery project and kickoff task under Projects & Tasks."
      onClose={onClose}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorBanner message={error} />}
        <div>
          <label className={labelClass}>Project Title *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          <div>
            <label className={labelClass}>Division / Service</label>
            <input
              type="text"
              required
              value={serviceInterest}
              onChange={(e) => setServiceInterest(e.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Target Window</label>
            <input
              type="text"
              required
              value={dueDateLabel}
              onChange={(e) => setDueDateLabel(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Project Brief / Handover Notes</label>
          <textarea
            rows={3}
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            className="w-full p-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
          />
        </div>
        <ModalFooter
          onClose={onClose}
          saving={saving}
          submitLabel="Create PMS Project"
        />
      </form>
    </ModalFrame>
  );
}

/* -------------------------------------------------------------------------- */
/*  6. Lead Detail Inspector Modal                                             */
/* -------------------------------------------------------------------------- */

export function LeadDetailModal({
  detail,
  loading,
  canEdit,
  isAdmin,
  onClose,
  onStatusChange,
  onAddNote,
  onToggleFollowup,
  onScheduleFollowup,
  onConvertToClient,
  onCreatePmsProject,
  onDeleteEnquiry,
}: {
  detail: EnquiryDetail | null;
  loading: boolean;
  canEdit: boolean;
  isAdmin: boolean;
  onClose: () => void;
  onStatusChange: (status: EnquiryStatus) => Promise<void>;
  onAddNote: (noteText: string) => Promise<void>;
  onToggleFollowup: (followupId: string, completed: boolean) => Promise<void>;
  onScheduleFollowup: () => void;
  onConvertToClient: () => void;
  onCreatePmsProject: () => void;
  onDeleteEnquiry: () => void;
}) {
  const [noteInput, setNoteInput] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  const submitNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    setSavingNote(true);
    try {
      await onAddNote(noteInput.trim());
      setNoteInput("");
    } finally {
      setSavingNote(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-[#111419] border border-[#252A32] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {loading || !detail ? (
          <div className="p-12 text-center text-xs font-mono text-[#777D87] flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-[#D6B77A]" />
            <span>Loading lead record...</span>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 border-b border-[#1E222A] flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-[11px] font-mono text-[#D6B77A] px-2 py-0.5 rounded bg-[#221D13] border border-[#D6B77A]/30">
                    {detail.referenceCode}
                  </span>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
                      getStatusMeta(detail.status).badgeClass
                    )}
                  >
                    {getStatusMeta(detail.status).label}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-[#161920] border border-[#252A32] text-[#9AA1AE]">
                    {formatSourceLabel(detail.source)}
                  </span>
                </div>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-[#F5F3EE] mt-2">
                  {detail.contactName}
                </h2>
                <div className="text-xs text-[#8D939E] mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    {detail.emailNormalized}
                  </span>
                  {detail.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5" />
                      {detail.phone}
                    </span>
                  )}
                  {detail.companyName && (
                    <span className="inline-flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5" />
                      {detail.companyName}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {canEdit && !detail.convertedClientId && (
                  <button
                    type="button"
                    onClick={onConvertToClient}
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Convert to Client</span>
                  </button>
                )}
                {canEdit && (
                  <button
                    type="button"
                    onClick={onCreatePmsProject}
                    className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#171B22] border border-[#2A303B] text-xs font-medium text-[#D6B77A] hover:border-[#D6B77A]/50 cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Create PMS Project</span>
                  </button>
                )}
                {isAdmin && (
                  <button
                    type="button"
                    onClick={onDeleteEnquiry}
                    className="p-2 rounded-lg bg-[#171B22] border border-[#2A303B] text-[#8D939E] hover:text-[#F28B82] cursor-pointer"
                    title="Delete inquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg text-[#777D87] hover:text-[#F5F3EE] cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Brief, Pipeline, Notes */}
              <div className="lg:col-span-7 space-y-5">
                {detail.client && (
                  <div className="p-3.5 rounded-xl bg-[#102018] border border-[#6FCF97]/30 flex items-center justify-between gap-3 text-xs">
                    <div className="text-[#6FCF97] font-medium">
                      Converted Client: {detail.client.name}{" "}
                      {detail.client.companyName
                        ? `(${detail.client.companyName})`
                        : ""}
                    </div>
                    <span className="text-[11px] font-mono uppercase text-[#9AE0B8]">
                      {detail.client.status}
                    </span>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#1E222A] grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#6D7480]">
                      Service Interest
                    </div>
                    <div className="text-[#F5F3EE] font-medium mt-0.5">
                      {detail.projectType}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#6D7480]">
                      Timeline
                    </div>
                    <div className="text-[#F5F3EE] mt-0.5">
                      {detail.expectedTimeline}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#6D7480]">
                      Budget Range
                    </div>
                    <div className="text-[#F5F3EE] mt-0.5">
                      {detail.budgetMin !== null && detail.budgetMax !== null
                        ? `${detail.budgetCurrency || "USD"} ${detail.budgetMin.toLocaleString()}–${detail.budgetMax.toLocaleString()}`
                        : detail.budgetMin !== null
                        ? `${detail.budgetCurrency || "USD"} ${detail.budgetMin.toLocaleString()}+`
                        : "Not specified"}
                    </div>
                  </div>
                </div>

                <div>
                  <div className={labelClass}>Goals &amp; Requirements</div>
                  <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#1E222A] text-sm text-[#D6D1C7] leading-relaxed whitespace-pre-wrap">
                    {detail.goalsAndRequirements}
                  </div>
                </div>

                <div>
                  <div className={labelClass}>Pipeline Stage</div>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_STATUS_OPTIONS.map((opt) => (
                      <button
                        key={opt.status}
                        type="button"
                        disabled={!canEdit}
                        onClick={() => onStatusChange(opt.status)}
                        className={cn(
                          "px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer disabled:cursor-default",
                          detail.status === opt.status
                            ? opt.badgeClass
                            : "bg-[#0D0F12] border-[#252A32] text-[#8D939E] hover:text-[#F5F3EE]"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Internal Notes & Comms */}
                <div className="pt-3 border-t border-[#1E222A] space-y-3">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[#D6B77A]" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8D939E]">
                      Internal Notes &amp; Communication Log
                    </span>
                  </div>

                  {canEdit && (
                    <form onSubmit={submitNote} className="flex gap-2">
                      <input
                        type="text"
                        value={noteInput}
                        onChange={(e) => setNoteInput(e.target.value)}
                        placeholder="Record call summary, email update, or next step..."
                        className="flex-1 h-9 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE] placeholder:text-[#6D7480] focus:outline-none focus:border-[#D6B77A]"
                      />
                      <button
                        type="submit"
                        disabled={savingNote || !noteInput.trim()}
                        className="inline-flex items-center gap-1 h-9 px-3.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] disabled:opacity-50 cursor-pointer"
                      >
                        <Send className="w-3 h-3" />
                        <span>Save</span>
                      </button>
                    </form>
                  )}

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {detail.notes.length === 0 ? (
                      <div className="text-xs text-[#6D7480]">
                        No notes logged yet.
                      </div>
                    ) : (
                      detail.notes.map((n) => (
                        <div
                          key={n.id}
                          className="p-3 rounded-lg bg-[#0D0F12] border border-[#1E222A] space-y-1"
                        >
                          <div className="flex items-center justify-between text-[11px] text-[#777D87]">
                            <span className="font-medium text-[#D6B77A]">
                              {n.authorName || "Studio Team"}
                            </span>
                            <span>
                              {new Date(n.createdAt).toLocaleString()}
                            </span>
                          </div>
                          <p className="text-xs text-[#E4E0D8]">{n.note}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Follow-ups, Linked PMS, Status History */}
              <div className="lg:col-span-5 space-y-5">
                <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8D939E]">
                      Scheduled Follow-ups
                    </span>
                    {canEdit && (
                      <button
                        type="button"
                        onClick={onScheduleFollowup}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#D6B77A] hover:underline cursor-pointer"
                      >
                        <CalendarPlus className="w-3.5 h-3.5" />
                        <span>Schedule</span>
                      </button>
                    )}
                  </div>

                  {detail.followups.length === 0 ? (
                    <div className="text-xs text-[#6D7480]">
                      No follow-ups scheduled for this lead.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {detail.followups.map((f) => {
                        const due = formatDueBadge(f.dueAt, f.completed);
                        return (
                          <div
                            key={f.id}
                            className="p-2.5 rounded-lg bg-[#111419] border border-[#1E222A] flex items-start justify-between gap-2.5"
                          >
                            <button
                              type="button"
                              disabled={!canEdit}
                              onClick={() =>
                                onToggleFollowup(f.id, !f.completed)
                              }
                              className="flex items-start gap-2 text-left min-w-0 cursor-pointer"
                            >
                              <span
                                className={cn(
                                  "mt-0.5 w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0",
                                  f.completed
                                    ? "bg-[#6FCF97] border-[#6FCF97] text-[#08090B]"
                                    : "border-[#323946]"
                                )}
                              >
                                {f.completed && <Check className="w-2.5 h-2.5" />}
                              </span>
                              <div className="min-w-0">
                                <div
                                  className={cn(
                                    "text-xs font-medium",
                                    f.completed
                                      ? "line-through text-[#6D7480]"
                                      : "text-[#F5F3EE]"
                                  )}
                                >
                                  {f.title}
                                </div>
                                <div className="text-[10px] font-mono uppercase text-[#6D7480]">
                                  {f.channel}
                                </div>
                              </div>
                            </button>
                            <span
                              className={cn(
                                "text-[11px] font-medium shrink-0",
                                due.isUrgent
                                  ? "text-[#F28B82]"
                                  : "text-[#8D939E]"
                              )}
                            >
                              {due.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {detail.pmsProjects.length > 0 && (
                  <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-[#8D939E]">
                        Linked PMS Projects
                      </span>
                      <Link
                        href="/admin/tasks"
                        className="text-[11px] text-[#D6B77A] hover:underline"
                      >
                        Open PMS →
                      </Link>
                    </div>
                    {detail.pmsProjects.map((p) => (
                      <div
                        key={p.id}
                        className="p-2.5 rounded-lg bg-[#111419] border border-[#1E222A] flex items-center justify-between gap-2 text-xs"
                      >
                        <span className="text-[#F5F3EE] font-medium flex items-center gap-1.5 truncate">
                          <FolderKanban className="w-3.5 h-3.5 text-[#D6B77A] shrink-0" />
                          {p.title}
                        </span>
                        <span className="text-[10px] font-mono uppercase text-[#8D939E]">
                          {p.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-4 rounded-xl bg-[#0D0F12] border border-[#1E222A] space-y-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.14em] text-[#8D939E]">
                    <Clock className="w-3.5 h-3.5 text-[#D6B77A]" />
                    <span>Activity Timeline</span>
                  </div>
                  <div className="space-y-2 max-h-52 overflow-y-auto">
                    {detail.history.map((h) => (
                      <div
                        key={h.id}
                        className="text-xs border-l-2 border-[#252A32] pl-3 py-0.5"
                      >
                        <div className="text-[#E4E0D8]">
                          {h.previousStatus
                            ? `${getStatusMeta(h.previousStatus).label} → `
                            : ""}
                          <span className="text-[#D6B77A] font-medium">
                            {getStatusMeta(h.newStatus).label}
                          </span>
                        </div>
                        {h.reason && (
                          <div className="text-[11px] text-[#8D939E]">
                            {h.reason}
                          </div>
                        )}
                        <div className="text-[10px] font-mono text-[#6D7480]">
                          {new Date(h.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Shared Modal Primitives                                                    */
/* -------------------------------------------------------------------------- */

function ModalFrame({
  title,
  subtitle,
  onClose,
  children,
}: {
  title: string;
  subtitle: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-2xl bg-[#111419] border border-[#252A32] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-[#1E222A] flex items-start justify-between gap-4">
          <div>
            <h3 className="font-heading font-bold text-lg text-[#F5F3EE]">
              {title}
            </h3>
            <p className="text-xs text-[#8D939E] mt-0.5">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#777D87] hover:text-[#F5F3EE] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="p-3 rounded-lg bg-[#2A1414] border border-[#F28B82]/40 text-xs text-[#F28B82]">
      {message}
    </div>
  );
}

function ModalFooter({
  onClose,
  saving,
  submitLabel,
}: {
  onClose: () => void;
  saving: boolean;
  submitLabel: string;
}) {
  return (
    <div className="pt-3 border-t border-[#1E222A] flex items-center justify-end gap-2.5">
      <button
        type="button"
        onClick={onClose}
        className="h-9 px-4 rounded-lg bg-[#161920] border border-[#252A32] text-xs font-medium text-[#C8C3B8] hover:text-[#F5F3EE] cursor-pointer"
      >
        Cancel
      </button>
      <button
        type="submit"
        disabled={saving}
        className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] disabled:opacity-60 cursor-pointer"
      >
        {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
        <span>{submitLabel}</span>
      </button>
    </div>
  );
}
