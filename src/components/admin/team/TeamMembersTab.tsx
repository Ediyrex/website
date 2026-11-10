"use client";

import React, { useMemo, useState } from "react";
import {
  Activity,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FolderKanban,
  LayoutGrid,
  List,
  MoreHorizontal,
  RefreshCw,
  Search,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import type {
  RoleDefinitionRecord,
  TeamInvitationRecord,
  TeamMemberRecord,
  TeamOverviewResponse,
  TeamTabKey,
} from "./team-types";
import {
  formatRelativeTime,
  getInitials,
  getRoleBadgeClass,
  getStatusDotAndLabel,
} from "./team-types";

interface TeamMembersTabProps {
  data: TeamOverviewResponse;
  isAdmin: boolean;
  currentUserId?: string;
  onOpenInvite: () => void;
  onOpenMemberProfile: (memberId: string) => void;
  onSwitchTab: (tab: TeamTabKey) => void;
  onToggleSuspend: (member: TeamMemberRecord) => Promise<void>;
  onRevokeSessions: (member: TeamMemberRecord) => Promise<void>;
  onRemoveMember: (member: TeamMemberRecord) => Promise<void>;
  onInvitationAction: (
    invitationId: string,
    action: "resend" | "activate" | "revoke"
  ) => Promise<void>;
}

export function TeamMembersTab({
  data,
  isAdmin,
  currentUserId,
  onOpenInvite,
  onOpenMemberProfile,
  onSwitchTab,
  onToggleSuspend,
  onRevokeSessions,
  onRemoveMember,
  onInvitationAction,
}: TeamMembersTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "invited" | "disabled"
  >("all");
  const [sortBy, setSortBy] = useState<"last_active" | "name" | "projects">(
    "last_active"
  );
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const filteredMembers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = data.members.filter((m) => {
      if (statusFilter !== "all" && m.status !== statusFilter) return false;
      if (roleFilter !== "all" && m.studioRole !== roleFilter) return false;
      if (departmentFilter !== "all" && m.department !== departmentFilter) {
        return false;
      }
      if (q.length > 0) {
        const hay = `${m.displayName} ${m.emailNormalized} ${m.studioRoleLabel} ${
          m.department
        } ${m.jobTitle ?? ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === "name") {
        return a.displayName.localeCompare(b.displayName);
      }
      if (sortBy === "projects") {
        return b.pmsProjectsCount - a.pmsProjectsCount;
      }
      const aTime = a.lastLoginAt
        ? new Date(a.lastLoginAt).getTime()
        : new Date(a.createdAt).getTime();
      const bTime = b.lastLoginAt
        ? new Date(b.lastLoginAt).getTime()
        : new Date(b.createdAt).getTime();
      return bTime - aTime;
    });

    return list;
  }, [
    data.members,
    searchQuery,
    roleFilter,
    departmentFilter,
    statusFilter,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const paginatedMembers = filteredMembers.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const activePct =
    data.kpis.totalMembers > 0
      ? Math.round((data.kpis.activeMembers / data.kpis.totalMembers) * 100)
      : 0;
  const ringCircumference = 2 * Math.PI * 36;
  const activeStrokeLength = (activePct / 100) * ringCircumference;

  const actionableInvitations: TeamInvitationRecord[] = data.invitations.filter(
    (inv) => inv.status === "pending" || inv.status === "expired"
  );

  return (
    <div className="space-y-6">
      {/* 4 Clickable KPI Cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => {
            setStatusFilter("all");
            setDepartmentFilter("all");
            setRoleFilter("all");
            setPage(1);
          }}
          className={`group rounded-2xl border p-4 text-left transition ${
            statusFilter === "all" && departmentFilter === "all"
              ? "border-[#e6c27a]/45 bg-[#15130f]"
              : "border-white/10 bg-[#121216] hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#e6c27a]/25 bg-[#e6c27a]/10 text-[#e6c27a]">
              <Users className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-medium text-neutral-400">
              All accounts
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">
            {data.kpis.totalMembers}
          </p>
          <p className="mt-0.5 text-xs text-neutral-400">Total Members</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter((prev) => (prev === "active" ? "all" : "active"));
            setPage(1);
          }}
          className={`group rounded-2xl border p-4 text-left transition ${
            statusFilter === "active"
              ? "border-emerald-400/50 bg-emerald-950/20"
              : "border-white/10 bg-[#121216] hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-medium text-emerald-300">
              {activePct}% active
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">
            {data.kpis.activeMembers}
          </p>
          <p className="mt-0.5 text-xs text-neutral-400">Active Members</p>
        </button>

        <button
          type="button"
          onClick={() => {
            setStatusFilter((prev) => (prev === "invited" ? "all" : "invited"));
            setPage(1);
          }}
          className={`group rounded-2xl border p-4 text-left transition ${
            statusFilter === "invited"
              ? "border-amber-400/50 bg-amber-950/20"
              : "border-white/10 bg-[#121216] hover:border-white/20"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-300">
              <Clock className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-medium text-amber-300">
              Awaiting reply
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">
            {data.kpis.pendingInvitations}
          </p>
          <p className="mt-0.5 text-xs text-neutral-400">Pending Invitations</p>
        </button>

        <button
          type="button"
          onClick={() => onSwitchTab("groups")}
          className="group rounded-2xl border border-white/10 bg-[#121216] p-4 text-left transition hover:border-white/20"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10 text-violet-300">
              <Building2 className="h-4 w-4" />
            </span>
            <span className="text-[11px] font-medium text-neutral-400 group-hover:text-white">
              Access groups →
            </span>
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">
            {data.kpis.departmentsCount}
          </p>
          <p className="mt-0.5 text-xs text-neutral-400">Departments</p>
        </button>
      </div>

      {/* Main Content + Right Rail */}
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        {/* Left Main Member Directory */}
        <div className="rounded-2xl border border-white/10 bg-[#121216] p-4 sm:p-5">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="relative min-w-[220px] flex-1">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Search members, emails, or roles..."
                className="w-full rounded-xl border border-white/10 bg-black/40 py-2 pr-3 pl-9 text-sm text-white placeholder-neutral-500 focus:border-[#e6c27a]/60 focus:outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter by role"
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-200 focus:border-[#e6c27a]/60 focus:outline-none"
              >
                <option value="all">All Roles</option>
                {data.roles.map((r: RoleDefinitionRecord) => (
                  <option key={r.key} value={r.key}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                value={departmentFilter}
                onChange={(e) => {
                  setDepartmentFilter(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter by department"
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-200 focus:border-[#e6c27a]/60 focus:outline-none"
              >
                <option value="all">All Departments</option>
                {data.departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(
                    e.target.value as "all" | "active" | "invited" | "disabled"
                  );
                  setPage(1);
                }}
                aria-label="Filter by status"
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-200 focus:border-[#e6c27a]/60 focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="invited">Pending</option>
                <option value="disabled">Suspended</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(
                    e.target.value as "last_active" | "name" | "projects"
                  )
                }
                aria-label="Sort members"
                className="rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-neutral-200 focus:border-[#e6c27a]/60 focus:outline-none"
              >
                <option value="last_active">Sort: Last Active</option>
                <option value="name">Sort: Name</option>
                <option value="projects">Sort: PMS Projects</option>
              </select>

              <div className="inline-flex rounded-xl border border-white/10 bg-black/40 p-0.5">
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  title="List view"
                  className={`rounded-lg p-1.5 transition ${
                    viewMode === "list"
                      ? "bg-[#e6c27a] text-black"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <List className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="Grid view"
                  className={`rounded-lg p-1.5 transition ${
                    viewMode === "grid"
                      ? "bg-[#e6c27a] text-black"
                      : "text-neutral-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {paginatedMembers.length === 0 ? (
            <div className="py-14 text-center">
              <Users className="mx-auto h-10 w-10 text-neutral-600" />
              <p className="mt-3 text-sm font-medium text-white">
                No team members match these filters
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Try clearing your search or invite a new studio collaborator.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setRoleFilter("all");
                  setDepartmentFilter("all");
                  setStatusFilter("all");
                }}
                className="mt-4 rounded-xl border border-white/15 px-3 py-1.5 text-xs text-neutral-200 hover:bg-white/5"
              >
                Reset filters
              </button>
            </div>
          ) : viewMode === "list" ? (
            /* Table View */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                    <th className="py-3 pr-3">Member</th>
                    <th className="px-3 py-3">Role</th>
                    <th className="px-3 py-3">Department</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3">Projects</th>
                    <th className="px-3 py-3">Last Active</th>
                    <th className="py-3 pl-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {paginatedMembers.map((member) => {
                    const statusStyle = getStatusDotAndLabel(member.status);
                    const isSelf = member.id === currentUserId;
                    const menuOpen = openMenuId === member.id;

                    return (
                      <tr
                        key={member.id}
                        className="group transition hover:bg-white/[0.025]"
                      >
                        <td className="py-3.5 pr-3">
                          <button
                            type="button"
                            onClick={() => onOpenMemberProfile(member.id)}
                            className="flex items-center gap-3 text-left"
                          >
                            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e6c27a]/30 bg-gradient-to-br from-[#e6c27a]/25 to-white/5 text-xs font-semibold text-[#f0d290]">
                              {getInitials(
                                member.displayName,
                                member.emailNormalized
                              )}
                            </span>
                            <div>
                              <div className="flex items-center gap-1.5 font-medium text-white group-hover:text-[#e6c27a]">
                                {member.displayName}
                                {isSelf && (
                                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-neutral-300">
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-neutral-400">
                                {member.emailNormalized}
                              </div>
                            </div>
                          </button>
                        </td>

                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-medium ${getRoleBadgeClass(
                              member.studioRole
                            )}`}
                          >
                            {member.studioRoleLabel}
                          </span>
                        </td>

                        <td className="px-3 py-3.5">
                          <span className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-neutral-300">
                            {member.department || "Studio"}
                          </span>
                        </td>

                        <td className="px-3 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${statusStyle.textClass}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${statusStyle.dotClass}`}
                            />
                            {statusStyle.label}
                          </span>
                        </td>

                        <td className="px-3 py-3.5">
                          <button
                            type="button"
                            onClick={() => onOpenMemberProfile(member.id)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-black/30 px-2.5 py-1 text-xs text-neutral-200 hover:border-[#e6c27a]/40"
                          >
                            <FolderKanban className="h-3.5 w-3.5 text-[#e6c27a]" />
                            {member.pmsProjectsCount}
                          </button>
                        </td>

                        <td className="px-3 py-3.5 text-xs text-neutral-400">
                          {formatRelativeTime(member.lastLoginAt)}
                        </td>

                        <td className="relative py-3.5 pl-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onOpenMemberProfile(member.id)}
                              className="rounded-lg border border-white/10 px-2.5 py-1 text-xs text-neutral-300 hover:border-[#e6c27a]/40 hover:text-white"
                            >
                              Profile
                            </button>
                            <div className="relative">
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenMenuId(menuOpen ? null : member.id)
                                }
                                aria-label={`Actions for ${member.displayName}`}
                                className="rounded-lg border border-white/10 p-1.5 text-neutral-400 hover:bg-white/5 hover:text-white"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                              {menuOpen && (
                                <div
                                  onMouseLeave={() => setOpenMenuId(null)}
                                  className="absolute right-0 z-30 mt-1.5 w-48 rounded-xl border border-white/15 bg-[#18181d] p-1.5 text-left shadow-2xl"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setOpenMenuId(null);
                                      onOpenMemberProfile(member.id);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 hover:bg-white/10"
                                  >
                                    View Profile & Edit
                                  </button>
                                  {isAdmin && (
                                    <>
                                      <button
                                        type="button"
                                        disabled={isSelf}
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          void onToggleSuspend(member);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-neutral-200 hover:bg-white/10 disabled:opacity-40"
                                      >
                                        {member.status === "disabled"
                                          ? "Activate Account"
                                          : "Suspend Account"}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          void onRevokeSessions(member);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-amber-300 hover:bg-amber-500/10"
                                      >
                                        Revoke Active Sessions
                                      </button>
                                      <button
                                        type="button"
                                        disabled={isSelf}
                                        onClick={() => {
                                          setOpenMenuId(null);
                                          void onRemoveMember(member);
                                        }}
                                        className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-rose-300 hover:bg-rose-500/10 disabled:opacity-40"
                                      >
                                        Remove Member
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View */
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedMembers.map((member) => {
                const statusStyle = getStatusDotAndLabel(member.status);
                return (
                  <div
                    key={member.id}
                    className="flex flex-col justify-between rounded-2xl border border-white/10 bg-black/30 p-4 transition hover:border-[#e6c27a]/40"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e6c27a]/30 bg-[#e6c27a]/15 text-xs font-semibold text-[#f0d290]">
                            {getInitials(
                              member.displayName,
                              member.emailNormalized
                            )}
                          </span>
                          <div className="min-w-0">
                            <h4 className="truncate text-sm font-semibold text-white">
                              {member.displayName}
                            </h4>
                            <p className="truncate text-xs text-neutral-400">
                              {member.emailNormalized}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusStyle.pillClass}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${statusStyle.dotClass}`}
                          />
                          {statusStyle.label}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex rounded-lg border px-2.5 py-0.5 text-xs font-medium ${getRoleBadgeClass(
                            member.studioRole
                          )}`}
                        >
                          {member.studioRoleLabel}
                        </span>
                        <span className="inline-flex rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-xs text-neutral-300">
                          {member.department || "Studio"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-neutral-400">
                      <div className="flex items-center gap-3">
                        <span>{member.pmsProjectsCount} projects</span>
                        <span>{member.openTasksCount} open tasks</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenMemberProfile(member.id)}
                        className="font-medium text-[#e6c27a] hover:underline"
                      >
                        Profile →
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination Footer */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-neutral-400">
            <div>
              Showing{" "}
              <span className="font-medium text-white">
                {filteredMembers.length === 0
                  ? 0
                  : (safePage - 1) * pageSize + 1}
              </span>
              –
              <span className="font-medium text-white">
                {Math.min(safePage * pageSize, filteredMembers.length)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-white">
                {filteredMembers.length}
              </span>{" "}
              members
            </div>

            <div className="flex items-center gap-2">
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                aria-label="Rows per page"
                className="rounded-lg border border-white/10 bg-black/40 px-2 py-1 text-xs text-neutral-200"
              >
                <option value={8}>8 / page</option>
                <option value={16}>16 / page</option>
                <option value={32}>32 / page</option>
              </select>

              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-white/10 p-1.5 text-neutral-300 hover:bg-white/5 disabled:opacity-40"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>
              <span className="px-2 text-xs text-neutral-200">
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-white/10 p-1.5 text-neutral-300 hover:bg-white/5 disabled:opacity-40"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Rail */}
        <aside className="space-y-4">
          {/* Team Overview Donut Card */}
          <div className="rounded-2xl border border-white/10 bg-[#121216] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Team Overview
              </h3>
              <button
                type="button"
                onClick={() => onSwitchTab("roles")}
                className="text-xs font-medium text-[#e6c27a] hover:underline"
              >
                View Roles →
              </button>
            </div>

            <div className="mt-4 flex items-center gap-5">
              <div className="relative h-24 w-24 shrink-0">
                <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    fill="none"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth="9"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="36"
                    fill="none"
                    stroke="#34d399"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeDasharray={`${activeStrokeLength} ${ringCircumference}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {activePct}%
                  </span>
                  <span className="text-[10px] text-neutral-400">Active</span>
                </div>
              </div>

              <div className="flex-1 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-300">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Active
                  </span>
                  <span className="font-semibold text-white">
                    {data.kpis.activeMembers}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-300">
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    Pending
                  </span>
                  <span className="font-semibold text-white">
                    {data.kpis.pendingInvitations}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-neutral-300">
                    <span className="h-2 w-2 rounded-full bg-rose-400" />
                    Suspended
                  </span>
                  <span className="font-semibold text-white">
                    {data.kpis.suspendedMembers}
                  </span>
                </div>
              </div>
            </div>

            {/* Role Breakdown Summary */}
            <div className="mt-5 space-y-1.5 border-t border-white/10 pt-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">
                Role Distribution
              </p>
              {data.roleBreakdown
                .filter((r) => r.count > 0)
                .map((r) => (
                  <div
                    key={r.key}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-neutral-300">{r.name}</span>
                    <span className="font-medium text-white">{r.count}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="rounded-2xl border border-white/10 bg-[#121216] p-5">
            <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
            <div className="mt-3 space-y-2">
              <button
                type="button"
                onClick={onOpenInvite}
                className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-3 text-left transition hover:border-[#e6c27a]/45 hover:bg-white/[0.04]"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#e6c27a]/15 text-[#e6c27a]">
                  <UserPlus className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">
                    Invite Team Member
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Assign role, department & PMS project
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSwitchTab("roles")}
                className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-3 text-left transition hover:border-[#e6c27a]/45 hover:bg-white/[0.04]"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/15 text-sky-300">
                  <ShieldCheck className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">
                    Manage Roles
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Configure module permission matrix
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => onSwitchTab("activity")}
                className="flex w-full items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-3 text-left transition hover:border-[#e6c27a]/45 hover:bg-white/[0.04]"
              >
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-violet-300">
                  <Activity className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">
                    View Activity Log
                  </p>
                  <p className="text-[11px] text-neutral-400">
                    Audit invitations & role updates
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Pending Invitations Queue */}
          <div className="rounded-2xl border border-white/10 bg-[#121216] p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                Pending Invitations
              </h3>
              <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                {actionableInvitations.length}
              </span>
            </div>

            {actionableInvitations.length === 0 ? (
              <p className="mt-3 text-xs text-neutral-400">
                No pending invitations right now.
              </p>
            ) : (
              <div className="mt-3 space-y-2.5">
                {actionableInvitations.slice(0, 4).map((inv) => (
                  <div
                    key={inv.id}
                    className="rounded-xl border border-white/10 bg-black/30 p-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-white">
                          {inv.fullName || inv.emailNormalized}
                        </p>
                        <p className="truncate text-[11px] text-neutral-400">
                          {inv.emailNormalized}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-medium uppercase ${
                          inv.status === "expired"
                            ? "bg-rose-500/15 text-rose-300"
                            : "bg-amber-500/15 text-amber-300"
                        }`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                      <span>{inv.studioRoleLabel}</span>
                      <span>
                        Exp{" "}
                        {new Date(inv.expiresAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    {isAdmin && (
                      <div className="mt-2.5 flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onInvitationAction(inv.id, "resend")}
                          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-neutral-200 hover:bg-white/10"
                        >
                          <RefreshCw className="h-3 w-3" />
                          Resend
                        </button>
                        <button
                          type="button"
                          onClick={() => onInvitationAction(inv.id, "activate")}
                          className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] text-emerald-300 hover:bg-emerald-500/20"
                        >
                          <UserCheck className="h-3 w-3" />
                          Activate
                        </button>
                        <button
                          type="button"
                          onClick={() => onInvitationAction(inv.id, "revoke")}
                          title="Revoke invitation"
                          className="inline-flex items-center justify-center rounded-lg border border-rose-500/30 bg-rose-500/10 p-1 text-rose-300 hover:bg-rose-500/20"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
