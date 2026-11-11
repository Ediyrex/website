"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check,
  Copy,
  FolderKanban,
  KeyRound,
  LogOut,
  Mail,
  Save,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  X,
} from "lucide-react";
import type {
  PmsProjectOption,
  RoleDefinitionRecord,
  TeamMemberDetailResponse,
} from "./team-types";
import {
  DEPARTMENT_OPTIONS,
  formatRelativeTime,
  getInitials,
  getRoleBadgeClass,
  getStatusDotAndLabel,
} from "./team-types";

interface InviteMemberModalProps {
  open: boolean;
  roles: RoleDefinitionRecord[];
  pmsProjects: PmsProjectOption[];
  onClose: () => void;
  onSubmitInvite: (payload: {
    fullName: string;
    email: string;
    studioRole: string;
    department: string;
    jobTitle: string;
    projectId: string | null;
    projectRole:
      | "super_admin"
      | "studio_admin"
      | "project_manager"
      | "team_lead"
      | "team_member"
      | "viewer";
    expiryDays: number;
  }) => Promise<{ inviteUrl: string }>;
}

export function InviteMemberModal({
  open,
  roles,
  pmsProjects,
  onClose,
  onSubmitInvite,
}: InviteMemberModalProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [studioRole, setStudioRole] = useState("team_member");
  const [department, setDepartment] = useState("Creative");
  const [jobTitle, setJobTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projectRole, setProjectRole] = useState<
    | "super_admin"
    | "studio_admin"
    | "project_manager"
    | "team_lead"
    | "team_member"
    | "viewer"
  >("team_member");
  const [expiryDays, setExpiryDays] = useState(7);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const resetAndClose = () => {
    setFullName("");
    setEmail("");
    setJobTitle("");
    setProjectId("");
    setError("");
    setGeneratedUrl("");
    setCopied(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const result = await onSubmitInvite({
        fullName: fullName.trim(),
        email: email.trim(),
        studioRole,
        department,
        jobTitle: jobTitle.trim(),
        projectId: projectId || null,
        projectRole,
        expiryDays,
      });
      setGeneratedUrl(result.inviteUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create invite.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#121216] p-6 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#e6c27a]/15 text-[#e6c27a]">
              <UserPlus className="h-4 w-4" />
            </span>
            <div>
              <h3 className="text-base font-semibold text-white">
                Invite Team Member
              </h3>
              <p className="text-xs text-neutral-400">
                Assign role, department, and optional PMS project access.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={resetAndClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {generatedUrl ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-200">
              Invitation created for <strong>{fullName}</strong> ({email}). Share
              this studio invitation link before it expires in {expiryDays} days.
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-neutral-300">
                Studio Invitation Link
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedUrl}
                  className="flex-1 rounded-xl border border-white/10 bg-black/50 px-3 py-2 font-mono text-xs text-neutral-200"
                />
                <button
                  type="button"
                  onClick={async () => {
                    await navigator.clipboard.writeText(generatedUrl);
                    setCopied(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#e6c27a] px-3 py-2 text-xs font-semibold text-black hover:bg-[#f0d290]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={resetAndClose}
                className="rounded-xl border border-white/15 px-4 py-2 text-xs font-medium text-white hover:bg-white/5"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {error && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                {error}
              </div>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-neutral-300">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Priya Sharma"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-neutral-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-300">
                  Work Email *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="priya@ediyrex.com"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-neutral-500"
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs text-neutral-300">
                  Assigned Studio Role
                </label>
                <select
                  value={studioRole}
                  onChange={(e) => setStudioRole(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-neutral-100"
                >
                  {roles.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-300">
                  Department / Division
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-neutral-100"
                >
                  {DEPARTMENT_OPTIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-neutral-300">
                Job Title (Optional)
              </label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Motion Designer"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder-neutral-500"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs text-neutral-300">
                  Optional PMS Project Access
                </label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-100"
                >
                  <option value="">No project assigned yet</option>
                  {pmsProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.referenceCode ? `${p.referenceCode} — ` : ""}
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs text-neutral-300">
                  Invite Expiry
                </label>
                <select
                  value={expiryDays}
                  onChange={(e) => setExpiryDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-100"
                >
                  <option value={3}>3 days</option>
                  <option value={7}>7 days</option>
                  <option value={14}>14 days</option>
                  <option value={30}>30 days</option>
                </select>
              </div>
            </div>

            {projectId && (
              <div>
                <label className="mb-1 block text-xs text-neutral-300">
                  Role Inside Selected PMS Project
                </label>
                <select
                  value={projectRole}
                  onChange={(e) =>
                    setProjectRole(
                      e.target.value as
                        | "super_admin"
                        | "studio_admin"
                        | "project_manager"
                        | "team_lead"
                        | "team_member"
                        | "viewer"
                    )
                  }
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-100"
                >
                  <option value="project_manager">Project Manager</option>
                  <option value="team_lead">Team Lead</option>
                  <option value="team_member">Team Member</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 border-t border-white/10 pt-4">
              <button
                type="button"
                onClick={resetAndClose}
                className="rounded-xl border border-white/10 px-4 py-2 text-xs text-neutral-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-[#e6c27a] px-4 py-2 text-xs font-semibold text-black hover:bg-[#f0d290] disabled:opacity-50"
              >
                <Mail className="h-3.5 w-3.5" />
                {submitting ? "Sending Invite..." : "Send Invitation"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

interface MemberProfileDrawerProps {
  memberId: string | null;
  roles: RoleDefinitionRecord[];
  isAdmin: boolean;
  currentUserId?: string;
  onClose: () => void;
  onUpdated: () => Promise<void>;
}

export function MemberProfileDrawer({
  memberId,
  roles,
  isAdmin,
  currentUserId,
  onClose,
  onUpdated,
}: MemberProfileDrawerProps) {
  const [detail, setDetail] = useState<TeamMemberDetailResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirmRemove, setConfirmRemove] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("Creative");
  const [studioRole, setStudioRole] = useState("team_member");

  useEffect(() => {
    if (!memberId) return;
    let active = true;
    const timer = setTimeout(() => {
      if (!active) return;
      setLoading(true);
      setError("");
      setNotice("");
      setConfirmRemove(false);
      fetch(`/api/v1/admin/team/${memberId}`)
        .then(async (res) => {
          const json = await res.json();
          if (!res.ok) throw new Error(json.message || "Unable to load profile.");
          return json.data as TeamMemberDetailResponse;
        })
        .then((payload) => {
          if (!active) return;
          setDetail(payload);
          setDisplayName(payload.member.displayName);
          setJobTitle(payload.member.jobTitle ?? "");
          setPhone(payload.member.phone ?? "");
          setDepartment(payload.member.department || "Creative");
          setStudioRole(payload.member.studioRole || "team_member");
        })
        .catch((err) => {
          if (!active) return;
          setError(err instanceof Error ? err.message : "Failed to load profile.");
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [memberId]);

  if (!memberId) return null;

  const isSelf = memberId === currentUserId;
  const member = detail?.member;
  const statusStyle = getStatusDotAndLabel(member?.status ?? "active");

  const runPatch = async (
    payload: Record<string, unknown>,
    successMsg: string
  ) => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch(`/api/v1/admin/team/${memberId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Update failed.");
      setNotice(successMsg);
      const refreshRes = await fetch(`/api/v1/admin/team/${memberId}`);
      if (refreshRes.ok) {
        const refreshed = await refreshRes.json();
        setDetail(refreshed.data as TeamMemberDetailResponse);
      }
      await onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/v1/admin/team/${memberId}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Removal failed.");
      await onUpdated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Removal failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-2xl flex-col border-l border-white/15 bg-[#0e0e12] shadow-2xl">
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#e6c27a]/40 bg-[#e6c27a]/15 text-sm font-semibold text-[#f0d290]">
              {member
                ? getInitials(member.displayName, member.emailNormalized)
                : "ED"}
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-white">
                  {member?.displayName ?? "Team Member Profile"}
                </h3>
                {member && (
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusStyle.pillClass}`}
                  >
                    {statusStyle.label}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">
                {member?.emailNormalized ?? "Loading..."}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-white/10 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {loading && (
            <p className="text-xs text-neutral-400">Loading member details...</p>
          )}
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
              {error}
            </div>
          )}
          {notice && (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
              {notice}
            </div>
          )}

          {detail && member && (
            <>
              {/* Personal Info + Account Controls */}
              <div className="rounded-2xl border border-white/10 bg-[#141418] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    Personal & Role Configuration
                  </h4>
                  <span
                    className={`rounded-md border px-2 py-0.5 text-[11px] font-medium ${getRoleBadgeClass(
                      member.studioRole
                    )}`}
                  >
                    {member.studioRoleLabel}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-[11px] text-neutral-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-neutral-400">
                      Job Title
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Creative Producer"
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-neutral-400">
                      Phone
                    </label>
                    <input
                      type="text"
                      disabled={!isAdmin}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 ..."
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white disabled:opacity-60"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] text-neutral-400">
                      Department
                    </label>
                    <select
                      disabled={!isAdmin}
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-100 disabled:opacity-60"
                    >
                      {DEPARTMENT_OPTIONS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="mb-1 block text-[11px] text-neutral-400">
                      Assigned Studio Role
                    </label>
                    <select
                      disabled={!isAdmin || isSelf}
                      value={studioRole}
                      onChange={(e) => setStudioRole(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-100 disabled:opacity-60"
                    >
                      {roles.map((r) => (
                        <option key={r.key} value={r.key}>
                          {r.name} ({r.baseRole})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {isAdmin && (
                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        void runPatch(
                          {
                            displayName,
                            jobTitle: jobTitle || null,
                            phone: phone || null,
                            department,
                            studioRole: isSelf ? undefined : studioRole,
                          },
                          "Member profile and role settings saved."
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#e6c27a] px-3.5 py-2 text-xs font-semibold text-black hover:bg-[#f0d290] disabled:opacity-50"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Save Changes
                    </button>
                  </div>
                )}
              </div>

              {/* Account & Security */}
              <div className="rounded-2xl border border-white/10 bg-[#141418] p-4">
                <div className="flex items-center justify-between">
                  <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    <KeyRound className="h-3.5 w-3.5 text-[#e6c27a]" />
                    Account & Security
                  </h4>
                  {isAdmin && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        void runPatch(
                          { revokeAllSessions: true },
                          "All active sessions revoked."
                        )
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[11px] text-amber-300 hover:bg-amber-500/20"
                    >
                      <LogOut className="h-3 w-3" />
                      Revoke All Sessions ({detail.activeSessions.length})
                    </button>
                  )}
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-xs sm:grid-cols-4">
                  <div className="rounded-xl border border-white/10 bg-black/30 p-2.5">
                    <span className="block text-[10px] text-neutral-500">
                      Joined
                    </span>
                    <span className="font-medium text-white">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-2.5">
                    <span className="block text-[10px] text-neutral-500">
                      Last Login
                    </span>
                    <span className="font-medium text-white">
                      {formatRelativeTime(member.lastLoginAt)}
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-2.5">
                    <span className="block text-[10px] text-neutral-500">
                      Active Sessions
                    </span>
                    <span className="font-medium text-white">
                      {detail.activeSessions.length}
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-black/30 p-2.5">
                    <span className="block text-[10px] text-neutral-500">
                      Invitation
                    </span>
                    <span className="font-medium uppercase text-white">
                      {detail.latestInvitation?.status ?? "Direct"}
                    </span>
                  </div>
                </div>
              </div>

              {/* PMS Work Attribution */}
              <div className="rounded-2xl border border-white/10 bg-[#141418] p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    <FolderKanban className="h-3.5 w-3.5 text-[#e6c27a]" />
                    PMS Work Attribution
                  </h4>
                  <span className="text-[11px] text-neutral-400">
                    {detail.assignedProjects.length} projects ·{" "}
                    {detail.assignedTasks.length} tasks
                  </span>
                </div>

                {detail.assignedProjects.length === 0 ? (
                  <p className="text-xs text-neutral-500">
                    No active PMS project assignments.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {detail.assignedProjects.map((proj) => (
                      <Link
                        key={proj.projectId}
                        href={`/admin/projects/${proj.projectId}`}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-xs transition hover:border-[#e6c27a]/45"
                      >
                        <div>
                          <span className="font-medium text-white">
                            {proj.referenceCode
                              ? `${proj.referenceCode} · `
                              : ""}
                            {proj.title}
                          </span>
                          <span className="ml-2 rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-neutral-300">
                            {proj.projectRole}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#e6c27a]">
                          {proj.progressPercent}% →
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {detail.assignedTasks.length > 0 && (
                  <div className="mt-3 space-y-1.5 border-t border-white/10 pt-3">
                    <p className="text-[11px] text-neutral-400">Recent Tasks</p>
                    {detail.assignedTasks.slice(0, 5).map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center justify-between rounded-lg bg-black/25 px-2.5 py-1.5 text-xs"
                      >
                        <span
                          className={
                            task.completed
                              ? "text-neutral-500 line-through"
                              : "text-neutral-200"
                          }
                        >
                          {task.taskCode ? `${task.taskCode} · ` : ""}
                          {task.title}
                        </span>
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] uppercase text-neutral-400">
                          {task.workflowStatus}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Activity */}
              <div className="rounded-2xl border border-white/10 bg-[#141418] p-4">
                <h4 className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  <Shield className="h-3.5 w-3.5 text-[#e6c27a]" />
                  Recent Audit Activity
                </h4>
                {detail.recentActivity.length === 0 ? (
                  <p className="text-xs text-neutral-500">
                    No recorded activity yet.
                  </p>
                ) : (
                  <div className="space-y-1.5 text-xs">
                    {detail.recentActivity.slice(0, 6).map((act) => (
                      <div
                        key={act.id}
                        className="flex items-center justify-between text-neutral-300"
                      >
                        <span>{act.action}</span>
                        <span className="text-[11px] text-neutral-500">
                          {formatRelativeTime(act.createdAt)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Drawer Admin Actions Footer */}
        {isAdmin && member && !isSelf && (
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-[#121216] px-6 py-4">
            <button
              type="button"
              disabled={saving}
              onClick={() =>
                void runPatch(
                  {
                    status:
                      member.status === "disabled" ? "active" : "disabled",
                  },
                  member.status === "disabled"
                    ? "Member account activated."
                    : "Member account suspended and active sessions revoked."
                )
              }
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 px-3 py-2 text-xs font-medium text-neutral-200 hover:bg-white/5"
            >
              <UserCheck className="h-3.5 w-3.5" />
              {member.status === "disabled"
                ? "Activate Account"
                : "Suspend Account"}
            </button>

            {confirmRemove ? (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-rose-300">
                  Preserves task & project history.
                </span>
                <button
                  type="button"
                  onClick={() => setConfirmRemove(false)}
                  className="rounded-lg px-2.5 py-1.5 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => void handleRemove()}
                  className="inline-flex items-center gap-1 rounded-xl bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                >
                  Confirm Remove
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmRemove(true)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/35 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/20"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove Member
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

