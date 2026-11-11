"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  FolderKanban,
  Info,
  Layers,
  Plus,
  Save,
  Settings,
  Trash2,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import type {
  AccessGroupRecord,
  GroupProjectBoardKey,
  GroupProjectRoleValue,
  PmsProjectOption,
  RoleDefinitionRecord,
  TeamMemberRecord,
} from "./team-types";
import {
  DEPARTMENT_OPTIONS,
  GROUP_PROJECT_BOARDS,
  GROUP_PROJECT_ROLE_OPTIONS,
  getInitials,
  getRoleBadgeClass,
} from "./team-types";

interface TeamGroupsTabProps {
  groups: AccessGroupRecord[];
  projects: PmsProjectOption[];
  members: TeamMemberRecord[];
  roles: RoleDefinitionRecord[];
  isAdmin: boolean;
  onCreateGroup: (payload: {
    name: string;
    division: string;
    description: string;
    defaultStudioRole: string;
  }) => Promise<void>;
  onUpdateGroup: (payload: {
    groupId: string;
    name: string;
    division: string;
    description: string;
    defaultStudioRole: string;
  }) => Promise<void>;
  onAddMemberToGroup: (groupId: string, userId: string) => Promise<void>;
  onRemoveMemberFromGroup: (groupId: string, userId: string) => Promise<void>;
  onDeleteGroup: (groupId: string) => Promise<void>;
  onSetGroupProjectAccess: (payload: {
    groupId: string;
    projectId: string;
    projectRole: GroupProjectRoleValue;
    allowedBoards?: GroupProjectBoardKey[];
    boardRoles?: Partial<Record<GroupProjectBoardKey, GroupProjectRoleValue>>;
  }) => Promise<void>;
  onOpenMemberProfile: (memberId: string) => void;
}

type GroupDetailSubtab = "projects" | "members" | "settings";

function getRoleOptionMeta(roleValue: string) {
  return (
    GROUP_PROJECT_ROLE_OPTIONS.find((r) => r.value === roleValue) ??
    GROUP_PROJECT_ROLE_OPTIONS[GROUP_PROJECT_ROLE_OPTIONS.length - 1]
  );
}

function GroupRolePicker({
  value,
  disabled,
  openKey,
  pickerKey,
  onToggleOpen,
  onChange,
}: {
  value: GroupProjectRoleValue;
  disabled: boolean;
  openKey: string | null;
  pickerKey: string;
  onToggleOpen: (key: string | null) => void;
  onChange: (nextRole: GroupProjectRoleValue) => Promise<void>;
}) {
  const isOpen = openKey === pickerKey;
  const currentMeta = getRoleOptionMeta(value);

  const badgeColors =
    value === "no_access"
      ? "border-white/10 bg-black/40 text-neutral-400"
      : value === "studio_admin"
      ? "border-[#e6c27a]/45 bg-[#e6c27a]/15 text-[#f0d290]"
      : value === "project_manager"
      ? "border-sky-400/40 bg-sky-500/15 text-sky-200"
      : value === "team_lead"
      ? "border-violet-400/40 bg-violet-500/15 text-violet-200"
      : value === "team_member"
      ? "border-emerald-400/35 bg-emerald-500/10 text-emerald-200"
      : "border-white/20 bg-white/[0.06] text-neutral-300";

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onToggleOpen(isOpen ? null : pickerKey)}
        className={`inline-flex min-w-[148px] items-center justify-between gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${badgeColors} hover:border-[#e6c27a]/50 disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span>{currentMeta.shortLabel}</span>
        <ChevronDown className="h-3.5 w-3.5 opacity-75" />
      </button>

      {isOpen && !disabled && (
        <div
          onMouseLeave={() => onToggleOpen(null)}
          className="absolute right-0 z-40 mt-1.5 w-72 rounded-2xl border border-white/15 bg-[#16181e] p-2 shadow-2xl"
        >
          <p className="border-b border-white/10 px-2.5 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
            Select Role
          </p>
          <div className="mt-1.5 space-y-1">
            {GROUP_PROJECT_ROLE_OPTIONS.map((opt) => {
              const selected = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={async () => {
                    onToggleOpen(null);
                    await onChange(opt.value);
                  }}
                  className={`flex w-full items-start gap-2.5 rounded-xl border p-2.5 text-left transition ${
                    selected
                      ? "border-[#e6c27a]/50 bg-[#e6c27a]/15"
                      : "border-transparent hover:bg-white/[0.05]"
                  }`}
                >
                  <span
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      selected
                        ? "border-[#e6c27a] bg-[#e6c27a] text-black"
                        : "border-white/25"
                    }`}
                  >
                    {selected && <Check className="h-2.5 w-2.5 stroke-[3]" />}
                  </span>
                  <div>
                    <p
                      className={`text-xs font-semibold ${
                        selected ? "text-[#f0d290]" : "text-white"
                      }`}
                    >
                      {opt.label}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-snug text-neutral-400">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function TeamGroupsTab({
  groups,
  projects,
  members,
  roles,
  isAdmin,
  onCreateGroup,
  onUpdateGroup,
  onAddMemberToGroup,
  onRemoveMemberFromGroup,
  onDeleteGroup,
  onSetGroupProjectAccess,
  onOpenMemberProfile,
}: TeamGroupsTabProps) {
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [detailSubtab, setDetailSubtab] =
    useState<GroupDetailSubtab>("projects");
  const [expandedProjectIds, setExpandedProjectIds] = useState<
    Record<string, boolean>
  >({});
  const [openPickerKey, setOpenPickerKey] = useState<string | null>(null);

  const [showCreate, setShowCreate] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [division, setDivision] = useState("Creative");
  const [description, setDescription] = useState("");
  const [defaultRole, setDefaultRole] = useState("team_member");
  const [submitting, setSubmitting] = useState(false);
  const [selectedAddMember, setSelectedAddMember] = useState<
    Record<string, string>
  >({});

  // Group settings editor state
  const activeGroup = useMemo(
    () => groups.find((g) => g.id === selectedGroupId) ?? null,
    [groups, selectedGroupId]
  );

  const [editName, setEditName] = useState("");
  const [editDivision, setEditDivision] = useState("Creative");
  const [editDescription, setEditDescription] = useState("");
  const [editDefaultRole, setEditDefaultRole] = useState("team_member");

  const openGroupWorkspace = (
    group: AccessGroupRecord,
    subtab: GroupDetailSubtab = "projects"
  ) => {
    setSelectedGroupId(group.id);
    setDetailSubtab(subtab);
    setEditName(group.name);
    setEditDivision(group.division);
    setEditDescription(group.description);
    setEditDefaultRole(group.defaultStudioRole);
    setOpenPickerKey(null);
  };

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

  // Group Detail Workspace View (Team > Access Groups > [Group] > Projects access)
  if (activeGroup) {
    const existingIds = new Set(activeGroup.members.map((m) => m.userId));
    const availableToAdd = members.filter((m) => !existingIds.has(m.id));
    const chosenUserId = selectedAddMember[activeGroup.id] ?? "";
    const accessByProject = new Map(
      (activeGroup.projectAccess ?? []).map((pa) => [pa.projectId, pa])
    );

    return (
      <div className="space-y-5">
        {/* Breadcrumb & Subtabs */}
        <div className="rounded-2xl border border-white/10 bg-[#121216] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
              <button
                type="button"
                onClick={() => setSelectedGroupId(null)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/40 px-2.5 py-1.5 font-medium text-neutral-200 hover:border-white/25 hover:text-white"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Access Groups
              </button>
              <span>/</span>
              <span className="font-semibold text-white">{activeGroup.name}</span>
              <span>/</span>
              <span className="text-[#e6c27a]">
                {detailSubtab === "projects"
                  ? "Projects access"
                  : detailSubtab === "members"
                  ? "Members"
                  : "Settings"}
              </span>
            </div>

            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-black/40 p-1">
              <button
                type="button"
                onClick={() => setDetailSubtab("projects")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  detailSubtab === "projects"
                    ? "bg-[#e6c27a] text-black"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                <FolderKanban className="h-3.5 w-3.5" />
                Projects access
              </button>
              <button
                type="button"
                onClick={() => setDetailSubtab("members")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  detailSubtab === "members"
                    ? "bg-[#e6c27a] text-black"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                <Users className="h-3.5 w-3.5" />
                Members ({activeGroup.members.length})
              </button>
              <button
                type="button"
                onClick={() => setDetailSubtab("settings")}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
                  detailSubtab === "settings"
                    ? "bg-[#e6c27a] text-black"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                <Settings className="h-3.5 w-3.5" />
                Settings
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white">
                  {activeGroup.name}
                </h3>
                <span className="rounded-md border border-[#e6c27a]/30 bg-[#e6c27a]/10 px-2 py-0.5 text-[11px] font-medium text-[#e6c27a]">
                  {activeGroup.division} Division
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-400">
                {activeGroup.description ||
                  "Configure scoped PMS project & board access rules for this access group."}
              </p>
            </div>
          </div>
        </div>

        {/* Subtab: Projects Access (Image 2 style) */}
        {detailSubtab === "projects" && (
          <div className="rounded-2xl border border-white/10 bg-[#121216] p-5">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Project & Workflow Board Access
                </h4>
                <p className="text-xs text-neutral-400">
                  Assign group roles per PMS project and expand any project to
                  tailor workflow board permissions. Changes automatically sync
                  to members of {activeGroup.name}.
                </p>
              </div>
            </div>

            {projects.length === 0 ? (
              <div className="rounded-xl border border-white/10 bg-black/30 p-8 text-center text-xs text-neutral-400">
                No active PMS projects exist yet. Create a project in Projects &
                Tasks first.
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-black/30">
                <div className="grid grid-cols-[minmax(0,1fr)_180px_170px] items-center border-b border-white/10 px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                  <div>Project</div>
                  <div>Boards</div>
                  <div className="text-right">Role</div>
                </div>

                <div className="divide-y divide-white/[0.06]">
                  {projects.map((proj) => {
                    const rule = accessByProject.get(proj.id);
                    const projectRole = (rule?.projectRole ??
                      "no_access") as GroupProjectRoleValue;
                    const boardRoles = rule?.boardRoles ?? {};
                    const isExpanded = Boolean(expandedProjectIds[proj.id]);
                    const accessibleBoardsCount =
                      projectRole === "no_access"
                        ? 0
                        : GROUP_PROJECT_BOARDS.filter(
                            (b) =>
                              (boardRoles[b.key] ?? projectRole) !== "no_access"
                          ).length;

                    return (
                      <div key={proj.id}>
                        <div className="grid grid-cols-[minmax(0,1fr)_180px_170px] items-center px-4 py-3 transition hover:bg-white/[0.02]">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedProjectIds((prev) => ({
                                  ...prev,
                                  [proj.id]: !isExpanded,
                                }))
                              }
                              aria-label={`Toggle boards for ${proj.title}`}
                              className="rounded-md p-1 text-neutral-400 hover:bg-white/10 hover:text-white"
                            >
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </button>

                            <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#e6c27a]/30 bg-[#e6c27a]/10 text-[#e6c27a]">
                              <FolderKanban className="h-3.5 w-3.5" />
                            </span>

                            <div className="min-w-0">
                              <p className="truncate text-xs font-semibold text-white">
                                {proj.title}
                              </p>
                              <p className="truncate font-mono text-[10px] text-neutral-400">
                                {proj.referenceCode
                                  ? `#${proj.referenceCode}`
                                  : "PMS Project"}{" "}
                                · {proj.status}
                              </p>
                            </div>
                          </div>

                          <div className="text-xs text-neutral-300">
                            {projectRole === "no_access" ? (
                              <span className="text-neutral-500">
                                No active board access
                              </span>
                            ) : (
                              <span>
                                Access to{" "}
                                <strong className="text-white">
                                  {accessibleBoardsCount} of{" "}
                                  {GROUP_PROJECT_BOARDS.length}
                                </strong>{" "}
                                boards
                              </span>
                            )}
                          </div>

                          <div className="text-right">
                            <GroupRolePicker
                              value={projectRole}
                              disabled={!isAdmin}
                              openKey={openPickerKey}
                              pickerKey={`project:${proj.id}`}
                              onToggleOpen={setOpenPickerKey}
                              onChange={async (nextRole) => {
                                const nextBoardRoles: Partial<
                                  Record<
                                    GroupProjectBoardKey,
                                    GroupProjectRoleValue
                                  >
                                > = {};
                                for (const b of GROUP_PROJECT_BOARDS) {
                                  nextBoardRoles[b.key] = nextRole;
                                }
                                await onSetGroupProjectAccess({
                                  groupId: activeGroup.id,
                                  projectId: proj.id,
                                  projectRole: nextRole,
                                  allowedBoards:
                                    nextRole === "no_access"
                                      ? []
                                      : GROUP_PROJECT_BOARDS.map((b) => b.key),
                                  boardRoles: nextBoardRoles,
                                });
                              }}
                            />
                          </div>
                        </div>

                        {/* Nested Boards Accordion */}
                        {isExpanded && (
                          <div className="border-t border-white/[0.05] bg-black/40 py-2 pl-14 pr-4 space-y-1.5">
                            {GROUP_PROJECT_BOARDS.map((board) => {
                              const currentBoardRole = (
                                projectRole === "no_access"
                                  ? "no_access"
                                  : boardRoles[board.key] ?? projectRole
                              ) as GroupProjectRoleValue;

                              return (
                                <div
                                  key={board.key}
                                  className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-[#14161b] px-3.5 py-2"
                                >
                                  <span className="text-xs font-medium text-neutral-200">
                                    {board.label}
                                  </span>

                                  <GroupRolePicker
                                    value={currentBoardRole}
                                    disabled={!isAdmin}
                                    openKey={openPickerKey}
                                    pickerKey={`board:${proj.id}:${board.key}`}
                                    onToggleOpen={setOpenPickerKey}
                                    onChange={async (nextBoardRole) => {
                                      const nextBoardRoles: Partial<
                                        Record<
                                          GroupProjectBoardKey,
                                          GroupProjectRoleValue
                                        >
                                      > = {};
                                      for (const b of GROUP_PROJECT_BOARDS) {
                                        nextBoardRoles[b.key] = (
                                          b.key === board.key
                                            ? nextBoardRole
                                            : boardRoles[b.key] ?? projectRole
                                        ) as GroupProjectRoleValue;
                                      }
                                      const nextAllowedBoards =
                                        GROUP_PROJECT_BOARDS.filter(
                                          (b) =>
                                            nextBoardRoles[b.key] !== "no_access"
                                        ).map((b) => b.key);

                                      const effectiveProjectRole =
                                        projectRole === "no_access" &&
                                        nextBoardRole !== "no_access"
                                          ? nextBoardRole
                                          : nextAllowedBoards.length === 0
                                          ? "no_access"
                                          : projectRole;

                                      await onSetGroupProjectAccess({
                                        groupId: activeGroup.id,
                                        projectId: proj.id,
                                        projectRole: effectiveProjectRole,
                                        allowedBoards: nextAllowedBoards,
                                        boardRoles: nextBoardRoles,
                                      });
                                    }}
                                  />
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Subtab: Group Members */}
        {detailSubtab === "members" && (
          <div className="rounded-2xl border border-white/10 bg-[#121216] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Group Members ({activeGroup.members.length})
                </h4>
                <p className="text-xs text-neutral-400">
                  Members automatically inherit this group&apos;s project
                  permissions when added.
                </p>
              </div>

              {isAdmin && availableToAdd.length > 0 && (
                <div className="flex items-center gap-2">
                  <select
                    value={chosenUserId}
                    onChange={(e) =>
                      setSelectedAddMember((prev) => ({
                        ...prev,
                        [activeGroup.id]: e.target.value,
                      }))
                    }
                    className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-200"
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
                      await onAddMemberToGroup(activeGroup.id, chosenUserId);
                      setSelectedAddMember((prev) => ({
                        ...prev,
                        [activeGroup.id]: "",
                      }));
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#e6c27a] px-3.5 py-2 text-xs font-semibold text-black hover:bg-[#f0d290] disabled:opacity-40"
                  >
                    <UserPlus className="h-3.5 w-3.5" />
                    Add Member
                  </button>
                </div>
              )}
            </div>

            {activeGroup.members.length === 0 ? (
              <p className="rounded-xl border border-white/10 bg-black/30 p-6 text-center text-xs text-neutral-400">
                No members are assigned to this access group yet.
              </p>
            ) : (
              <div className="grid gap-2.5 sm:grid-cols-2">
                {activeGroup.members.map((member) => (
                  <div
                    key={member.userId}
                    className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5"
                  >
                    <button
                      type="button"
                      onClick={() => onOpenMemberProfile(member.userId)}
                      className="flex min-w-0 items-center gap-2.5 text-left"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e6c27a]/15 text-xs font-semibold text-[#f0d290]">
                        {getInitials(
                          member.displayName,
                          member.emailNormalized
                        )}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-white hover:text-[#e6c27a]">
                          {member.displayName}
                        </p>
                        <p className="truncate text-[11px] text-neutral-400">
                          {member.emailNormalized}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded border px-2 py-0.5 text-[10px] ${getRoleBadgeClass(
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
                              activeGroup.id,
                              member.userId
                            )
                          }
                          title="Remove from group"
                          className="rounded-lg p-1 text-neutral-500 hover:bg-rose-500/10 hover:text-rose-300"
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
        )}

        {/* Subtab: Group Settings */}
        {detailSubtab === "settings" && (
          <div className="rounded-2xl border border-white/10 bg-[#121216] p-5 space-y-4">
            <h4 className="text-sm font-semibold text-white">
              Access Group Configuration
            </h4>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs text-neutral-400">
                  Group Name
                </label>
                <input
                  type="text"
                  disabled={!isAdmin}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white disabled:opacity-60"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-neutral-400">
                  Division
                </label>
                <select
                  disabled={!isAdmin}
                  value={editDivision}
                  onChange={(e) => setEditDivision(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-200 disabled:opacity-60"
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
                  Default Studio Role
                </label>
                <select
                  disabled={!isAdmin}
                  value={editDefaultRole}
                  onChange={(e) => setEditDefaultRole(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-200 disabled:opacity-60"
                >
                  {roles.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-xs text-neutral-400">
                Description
              </label>
              <input
                type="text"
                disabled={!isAdmin}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-white disabled:opacity-60"
              />
            </div>

            {isAdmin && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                <button
                  type="button"
                  onClick={async () => {
                    await onDeleteGroup(activeGroup.id);
                    setSelectedGroupId(null);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-medium text-rose-300 hover:bg-rose-500/20"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete Access Group
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void onUpdateGroup({
                      groupId: activeGroup.id,
                      name: editName.trim() || activeGroup.name,
                      division: editDivision,
                      description: editDescription.trim(),
                      defaultStudioRole: editDefaultRole,
                    })
                  }
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#e6c27a] px-4 py-2 text-xs font-semibold text-black hover:bg-[#f0d290]"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Group Settings
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

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
              Organize studio departments and configure scoped PMS project &
              workflow board access per group.
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
                placeholder="e.g. UI/UX Pod"
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
          const activeProjectsCount = (group.projectAccess ?? []).filter(
            (pa) => pa.projectRole !== "no_access"
          ).length;

          return (
            <div
              key={group.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121216] p-5 transition hover:border-[#e6c27a]/35"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[11px] font-medium text-[#e6c27a]">
                      <Building2 className="h-3 w-3" />
                      {group.division}
                    </span>
                    <button
                      type="button"
                      onClick={() => openGroupWorkspace(group, "projects")}
                      className="mt-2 block text-left text-base font-semibold text-white hover:text-[#e6c27a]"
                    >
                      {group.name}
                    </button>
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

                {/* Group Quick Stats + Projects Access Trigger */}
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openGroupWorkspace(group, "projects")}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#e6c27a]/30 bg-[#e6c27a]/10 px-2.5 py-1 text-[11px] font-medium text-[#e6c27a] hover:bg-[#e6c27a]/20"
                  >
                    <FolderKanban className="h-3 w-3" />
                    Projects Access ({activeProjectsCount}/{projects.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => openGroupWorkspace(group, "settings")}
                    className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-neutral-300 hover:border-white/25 hover:text-white"
                  >
                    <Settings className="h-3 w-3" />
                    Configure
                  </button>
                </div>

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
