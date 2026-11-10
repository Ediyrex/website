"use client";

import React, { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Activity,
  Check,
  Copy,
  Layers,
  Shield,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";
import { useAdminUser } from "./AdminContext";
import { TeamActivityTab } from "./team/TeamActivityTab";
import { TeamGroupsTab } from "./team/TeamGroupsTab";
import { TeamMembersTab } from "./team/TeamMembersTab";
import { InviteMemberModal, MemberProfileDrawer } from "./team/TeamModals";
import { TeamRolesTab } from "./team/TeamRolesTab";
import type {
  AccessGroupRecord,
  RoleDefinitionRecord,
  RolePermissionsMatrix,
  TeamMemberRecord,
  TeamOverviewResponse,
  TeamTabKey,
} from "./team/team-types";

const TABS: Array<{
  key: TeamTabKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { key: "members", label: "Team Members", icon: Users },
  { key: "roles", label: "Roles & Permissions", icon: ShieldCheck },
  { key: "groups", label: "Access Groups", icon: Layers },
  { key: "activity", label: "Activity Log", icon: Activity },
];

export function AdminTeamClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAdmin } = useAdminUser();

  const tabParam = searchParams.get("tab");
  const activeTab: TeamTabKey =
    tabParam === "roles" ||
    tabParam === "groups" ||
    tabParam === "activity" ||
    tabParam === "members"
      ? tabParam
      : "members";

  const [overview, setOverview] = useState<TeamOverviewResponse | null>(null);
  const [groups, setGroups] = useState<AccessGroupRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [resentInviteUrl, setResentInviteUrl] = useState("");
  const [copiedResent, setCopiedResent] = useState(false);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);

  const switchTab = useCallback(
    (tab: TeamTabKey) => {
      const next = new URLSearchParams(searchParams.toString());
      if (tab === "members") {
        next.delete("tab");
      } else {
        next.set("tab", tab);
      }
      const query = next.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams]
  );

  const refreshAll = useCallback(async () => {
    const [teamRes, groupsRes] = await Promise.all([
      fetch("/api/v1/admin/team"),
      fetch("/api/v1/admin/team/groups"),
    ]);

    if (teamRes.status === 401 || groupsRes.status === 401) {
      router.push("/admin/login");
      return;
    }

    const teamJson = await teamRes.json();
    if (!teamRes.ok) {
      throw new Error(teamJson.message || "Unable to fetch team overview.");
    }

    const groupsJson = await groupsRes.json();
    if (!groupsRes.ok) {
      throw new Error(groupsJson.message || "Unable to fetch access groups.");
    }

    setOverview(teamJson.data as TeamOverviewResponse);
    setGroups((groupsJson.data?.groups ?? []) as AccessGroupRecord[]);
  }, [router]);

  useEffect(() => {
    let active = true;
    const timer = setTimeout(() => {
      if (!active) return;
      setLoading(true);
      setError("");
      refreshAll()
        .catch((err) => {
          if (!active) return;
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load Team & Access console."
          );
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 0);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [refreshAll]);

  const handleToggleSuspend = async (member: TeamMemberRecord) => {
    setError("");
    setSuccess("");
    try {
      const nextStatus = member.status === "disabled" ? "active" : "disabled";
      const res = await fetch(`/api/v1/admin/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Status update failed.");
      await refreshAll();
      setSuccess(
        `${member.displayName} is now ${
          nextStatus === "disabled" ? "suspended" : "active"
        }.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Status update failed.");
    }
  };

  const handleRevokeSessions = async (member: TeamMemberRecord) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/v1/admin/team/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ revokeAllSessions: true }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to revoke sessions.");
      await refreshAll();
      setSuccess(`Revoked active sessions for ${member.displayName}.`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to revoke sessions."
      );
    }
  };

  const handleRemoveMember = async (member: TeamMemberRecord) => {
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/v1/admin/team/${member.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to remove member.");
      await refreshAll();
      setSuccess(
        `${member.displayName} removed from active studio access. Historical task and project attribution preserved.`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to remove member.");
    }
  };

  const handleInvitationAction = async (
    invitationId: string,
    action: "resend" | "activate" | "revoke"
  ) => {
    setError("");
    setSuccess("");
    setResentInviteUrl("");
    setCopiedResent(false);
    try {
      if (action === "revoke") {
        const res = await fetch(
          `/api/v1/admin/team/invitations/${invitationId}`,
          { method: "DELETE" }
        );
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || "Revoke failed.");
        await refreshAll();
        setSuccess("Invitation revoked.");
        return;
      }

      const res = await fetch(
        `/api/v1/admin/team/invitations/${invitationId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action }),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Invitation action failed.");
      await refreshAll();
      if (action === "resend" && json.data?.inviteUrl) {
        setResentInviteUrl(json.data.inviteUrl as string);
        setSuccess("Fresh invitation link generated (valid 7 days).");
      } else {
        setSuccess("Invited member account activated.");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Invitation action failed."
      );
    }
  };

  const handleSubmitInvite = async (payload: {
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
  }) => {
    const res = await fetch("/api/v1/admin/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Failed to send invitation.");
    }
    await refreshAll();
    setSuccess(`Invitation sent to ${payload.email}.`);
    return { inviteUrl: String(json.data?.inviteUrl || "") };
  };

  const handleSaveRolePermissions = async (
    role: RoleDefinitionRecord,
    permissions: RolePermissionsMatrix
  ) => {
    setError("");
    setSuccess("");
    const res = await fetch("/api/v1/admin/team/roles", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: role.key,
        name: role.name,
        description: role.description,
        baseRole: role.baseRole,
        permissions,
      }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.message || "Failed to save role permissions.");
      return;
    }
    await refreshAll();
    setSuccess(`Updated permission matrix for ${role.name}.`);
  };

  const handleCreateCustomRole = async (payload: {
    key: string;
    name: string;
    description: string;
    baseRole: "admin" | "editor" | "viewer";
  }) => {
    setError("");
    setSuccess("");
    const res = await fetch("/api/v1/admin/team/roles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.message || "Failed to create custom role.");
      return;
    }
    await refreshAll();
    setSuccess(`Created custom studio role "${payload.name}".`);
  };

  const runGroupAction = async (body: Record<string, unknown>, msg: string) => {
    setError("");
    setSuccess("");
    const res = await fetch("/api/v1/admin/team/groups", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.message || "Access group update failed.");
      return;
    }
    await refreshAll();
    setSuccess(msg);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#e6c27a]">
            Studio Security & Access Control
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white">
            Team & Access Management
          </h1>
          <p className="mt-1 text-xs text-neutral-400">
            Manage studio collaborators, invitations, role permissions,
            divisions, and security logs.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {!isAdmin && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/25 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
              <Shield className="h-3.5 w-3.5" />
              Read-only access
            </span>
          )}

          <button
            type="button"
            onClick={() => switchTab("roles")}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#121216] px-4 py-2 text-xs font-medium text-neutral-200 transition hover:border-white/30 hover:text-white"
          >
            <ShieldCheck className="h-3.5 w-3.5 text-[#e6c27a]" />
            Manage Roles
          </button>

          {isAdmin && (
            <button
              type="button"
              onClick={() => setInviteOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-[#e6c27a] px-4 py-2 text-xs font-semibold text-black transition hover:bg-[#f0d290]"
            >
              <UserPlus className="h-3.5 w-3.5" />
              Invite Member
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b border-white/10">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => switchTab(tab.key)}
              className={`inline-flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-medium transition ${
                active
                  ? "border-[#e6c27a] text-[#e6c27a]"
                  : "border-transparent text-neutral-400 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Feedback Banners */}
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          {error}
        </div>
      )}
      {success && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-200">
          <span>{success}</span>
          {resentInviteUrl && (
            <div className="flex items-center gap-2">
              <code className="max-w-xs truncate rounded bg-black/40 px-2 py-1 text-[11px]">
                {resentInviteUrl}
              </code>
              <button
                type="button"
                onClick={async () => {
                  await navigator.clipboard.writeText(resentInviteUrl);
                  setCopiedResent(true);
                }}
                className="inline-flex items-center gap-1 rounded-lg bg-[#e6c27a] px-2.5 py-1 text-[11px] font-semibold text-black"
              >
                {copiedResent ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Content Area */}
      {loading && !overview ? (
        <div className="rounded-2xl border border-white/10 bg-[#121216] p-10 text-center text-xs text-neutral-400">
          Loading EDYREX Team & Access Control Center...
        </div>
      ) : overview ? (
        <>
          {activeTab === "members" && (
            <TeamMembersTab
              data={overview}
              isAdmin={isAdmin}
              currentUserId={user?.id}
              onOpenInvite={() => setInviteOpen(true)}
              onOpenMemberProfile={(id) => setSelectedMemberId(id)}
              onSwitchTab={switchTab}
              onToggleSuspend={handleToggleSuspend}
              onRevokeSessions={handleRevokeSessions}
              onRemoveMember={handleRemoveMember}
              onInvitationAction={handleInvitationAction}
            />
          )}

          {activeTab === "roles" && (
            <TeamRolesTab
              roles={overview.roles}
              isAdmin={isAdmin}
              onSaveRolePermissions={handleSaveRolePermissions}
              onCreateCustomRole={handleCreateCustomRole}
            />
          )}

          {activeTab === "groups" && (
            <TeamGroupsTab
              groups={groups}
              members={overview.members}
              roles={overview.roles}
              isAdmin={isAdmin}
              onCreateGroup={(payload) =>
                runGroupAction(
                  { action: "create_group", ...payload },
                  `Created access group "${payload.name}".`
                )
              }
              onAddMemberToGroup={(groupId, userId) =>
                runGroupAction(
                  { action: "add_member", groupId, userId },
                  "Added member to access group."
                )
              }
              onRemoveMemberFromGroup={(groupId, userId) =>
                runGroupAction(
                  { action: "remove_member", groupId, userId },
                  "Removed member from access group."
                )
              }
              onDeleteGroup={(groupId) =>
                runGroupAction(
                  { action: "delete_group", groupId },
                  "Access group deleted."
                )
              }
              onOpenMemberProfile={(id) => setSelectedMemberId(id)}
            />
          )}

          {activeTab === "activity" && (
            <TeamActivityTab logs={overview.activityLogs} />
          )}
        </>
      ) : null}

      {/* Invite Member Modal */}
      {overview && (
        <InviteMemberModal
          open={inviteOpen}
          roles={overview.roles}
          pmsProjects={overview.pmsProjectsList}
          onClose={() => setInviteOpen(false)}
          onSubmitInvite={handleSubmitInvite}
        />
      )}

      {/* Member Profile Slide-over Drawer */}
      {overview && (
        <MemberProfileDrawer
          memberId={selectedMemberId}
          roles={overview.roles}
          isAdmin={isAdmin}
          currentUserId={user?.id}
          onClose={() => setSelectedMemberId(null)}
          onUpdated={refreshAll}
        />
      )}
    </div>
  );
}
