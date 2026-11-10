"use client";

import React, { useState } from "react";
import { Building2, Info, Layers, Plus, Trash2, UserPlus, X } from "lucide-react";
import type {
  AccessGroupRecord,
  RoleDefinitionRecord,
  TeamMemberRecord,
} from "./team-types";
import { DEPARTMENT_OPTIONS, getInitials, getRoleBadgeClass } from "./team-types";

interface TeamGroupsTabProps {
  groups: AccessGroupRecord[];
  members: TeamMemberRecord[];
  roles: RoleDefinitionRecord[];
  isAdmin: boolean;
  onCreateGroup: (payload: {
    name: string;
    division: string;
    description: string;
    defaultStudioRole: string;
  }) => Promise<void>;
  onAddMemberToGroup: (groupId: string, userId: string) => Promise<void>;
  onRemoveMemberFromGroup: (groupId: string, userId: string) => Promise<void>;
  onDeleteGroup: (groupId: string) => Promise<void>;
  onOpenMemberProfile: (memberId: string) => void;
}

export function TeamGroupsTab({
  groups,
  members,
  roles,
  isAdmin,
  onCreateGroup,
  onAddMemberToGroup,
  onRemoveMemberFromGroup,
  onDeleteGroup,
  onOpenMemberProfile,
}: TeamGroupsTabProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [division, setDivision] = useState("Creative");
  const [description, setDescription] = useState("");
  const [defaultRole, setDefaultRole] = useState("team_member");
  const [submitting, setSubmitting] = useState(false);
  const [selectedAddMember, setSelectedAddMember] = useState<
    Record<string, string>
  >({});

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;
    setSubmitting(true);
    try {
      await onCreateGroup({
        name: groupName.trim(),
        division,
        description: description.trim(),
        defaultStudioRole: defaultRole,
      });
      setGroupName("");
      setDescription("");
      setShowCreate(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header & Info Callout */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#121216] p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#e6c27a]/30 bg-[#e6c27a]/10 text-[#e6c27a]">
            <Layers className="h-4 w-4" />
          </span>
          <div>
            <h3 className="text-sm font-semibold text-white">
              Divisions & Access Groups
            </h3>
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-neutral-400">
              <Info className="h-3.5 w-3.5 shrink-0 text-neutral-500" />
              Organize studio departments cleanly without automatically granting
              unrestricted access to confidential PMS projects.
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => setShowCreate((v) => !v)}
            className="inline-flex items-center gap-2 rounded-xl bg-[#e6c27a] px-4 py-2 text-xs font-semibold text-black hover:bg-[#f0d290]"
          >
            <Plus className="h-3.5 w-3.5" />
            New Access Group
          </button>
        )}
      </div>

      {showCreate && isAdmin && (
        <form
          onSubmit={handleCreate}
          className="rounded-2xl border border-[#e6c27a]/35 bg-[#161510] p-5"
        >
          <h4 className="text-sm font-semibold text-white">
            Create Access Group
          </h4>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-neutral-400">
                Group Name *
              </label>
              <input
                type="text"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Video Production Pod"
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-neutral-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-400">
                Division
              </label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-200"
              >
                {DEPARTMENT_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs text-neutral-400">
                Default Role Scope
              </label>
              <select
                value={defaultRole}
                onChange={(e) => setDefaultRole(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-200"
              >
                {roles.map((r) => (
                  <option key={r.key} value={r.key}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-3">
            <label className="mb-1 block text-xs text-neutral-400">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Scope and collaboration purpose for this group..."
              className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white placeholder-neutral-500"
            />
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="rounded-xl border border-white/10 px-3 py-1.5 text-xs text-neutral-300 hover:bg-white/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[#e6c27a] px-4 py-1.5 text-xs font-semibold text-black hover:bg-[#f0d290]"
            >
              {submitting ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      )}

      {/* Groups Grid */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {groups.map((group) => {
          const existingIds = new Set(group.members.map((m) => m.userId));
          const availableToAdd = members.filter((m) => !existingIds.has(m.id));
          const chosenUserId = selectedAddMember[group.id] ?? "";

          return (
            <div
              key={group.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121216] p-5"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-[#e6c27a]">
                      <Building2 className="h-3 w-3" />
                      {group.division}
                    </span>
                    <h4 className="mt-2 text-base font-semibold text-white">
                      {group.name}
                    </h4>
                  </div>

                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => void onDeleteGroup(group.id)}
                      title="Delete access group"
                      className="rounded-lg border border-white/10 p-1.5 text-neutral-500 hover:border-rose-500/40 hover:text-rose-300"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <p className="mt-1.5 text-xs text-neutral-400">
                  {group.description || "Department collaboration group."}
                </p>

                {/* Member List */}
                <div className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-neutral-400">
                    <span>Members ({group.members.length})</span>
                    <span>Default: {group.defaultStudioRole}</span>
                  </div>

                  {group.members.length === 0 ? (
                    <p className="py-2 text-xs text-neutral-500">
                      No members assigned to this group yet.
                    </p>
                  ) : (
                    <div className="space-y-1.5">
                      {group.members.map((member) => (
                        <div
                          key={member.userId}
                          className="flex items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-black/30 px-2.5 py-2"
                        >
                          <button
                            type="button"
                            onClick={() => onOpenMemberProfile(member.userId)}
                            className="flex min-w-0 items-center gap-2 text-left"
                          >
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e6c27a]/15 text-[11px] font-semibold text-[#f0d290]">
                              {getInitials(
                                member.displayName,
                                member.emailNormalized
                              )}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate text-xs font-medium text-white hover:text-[#e6c27a]">
                                {member.displayName}
                              </p>
                              <p className="truncate text-[10px] text-neutral-400">
                                {member.emailNormalized}
                              </p>
                            </div>
                          </button>

                          <div className="flex shrink-0 items-center gap-1.5">
                            <span
                              className={`rounded border px-1.5 py-0.5 text-[10px] ${getRoleBadgeClass(
                                member.studioRole
                              )}`}
                            >
                              {member.studioRole}
                            </span>
                            {isAdmin && (
                              <button
                                type="button"
                                onClick={() =>
                                  void onRemoveMemberFromGroup(
                                    group.id,
                                    member.userId
                                  )
                                }
                                title="Remove from group"
                                className="rounded p-1 text-neutral-500 hover:bg-rose-500/10 hover:text-rose-300"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Add Member Control */}
              {isAdmin && availableToAdd.length > 0 && (
                <div className="mt-4 flex items-center gap-2 border-t border-white/10 pt-3">
                  <select
                    value={chosenUserId}
                    onChange={(e) =>
                      setSelectedAddMember((prev) => ({
                        ...prev,
                        [group.id]: e.target.value,
                      }))
                    }
                    className="flex-1 rounded-xl border border-white/10 bg-black/40 px-2.5 py-1.5 text-xs text-neutral-200"
                  >
                    <option value="">Select member to add...</option>
                    {availableToAdd.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.displayName} ({m.studioRoleLabel})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    disabled={!chosenUserId}
                    onClick={async () => {
                      if (!chosenUserId) return;
                      await onAddMemberToGroup(group.id, chosenUserId);
                      setSelectedAddMember((prev) => ({
                        ...prev,
                        [group.id]: "",
                      }));
                    }}
                    className="inline-flex items-center gap-1 rounded-xl border border-[#e6c27a]/40 bg-[#e6c27a]/15 px-3 py-1.5 text-xs font-medium text-[#e6c27a] hover:bg-[#e6c27a]/25 disabled:opacity-40"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

