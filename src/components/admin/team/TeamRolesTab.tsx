"use client";

import React, { useMemo, useState } from "react";
import { Check, Lock, Plus, Save, ShieldCheck, Sparkles } from "lucide-react";
import type {
  ModulePermissionEntry,
  RoleDefinitionRecord,
  RolePermissionsMatrix,
} from "./team-types";
import {
  TEAM_CAPABILITY_LIST,
  TEAM_MODULE_LIST,
  getRoleBadgeClass,
} from "./team-types";

interface TeamRolesTabProps {
  roles: RoleDefinitionRecord[];
  isAdmin: boolean;
  onSaveRolePermissions: (
    role: RoleDefinitionRecord,
    permissions: RolePermissionsMatrix
  ) => Promise<void>;
  onCreateCustomRole: (payload: {
    key: string;
    name: string;
    description: string;
    baseRole: "admin" | "editor" | "viewer";
  }) => Promise<void>;
}

function buildMatrixForRole(role: RoleDefinitionRecord): RolePermissionsMatrix {
  const modules: Record<string, ModulePermissionEntry> = {};
  for (const mod of TEAM_MODULE_LIST) {
    const existing = role.permissions?.modules?.[mod.key];
    modules[mod.key] = {
      view: Boolean(existing?.view),
      create: Boolean(existing?.create),
      edit: Boolean(existing?.edit),
      delete: Boolean(existing?.delete),
    };
  }
  return {
    modules,
    capabilities: {
      publish: Boolean(role.permissions?.capabilities?.publish),
      approve: Boolean(role.permissions?.capabilities?.approve),
      inviteUsers: Boolean(role.permissions?.capabilities?.inviteUsers),
      manageBilling: Boolean(role.permissions?.capabilities?.manageBilling),
      viewConfidential: Boolean(role.permissions?.capabilities?.viewConfidential),
    },
  };
}

export function TeamRolesTab({
  roles,
  isAdmin,
  onSaveRolePermissions,
  onCreateCustomRole,
}: TeamRolesTabProps) {
  const [selectedKey, setSelectedKey] = useState<string>(
    roles[1]?.key || roles[0]?.key || "studio_admin"
  );
  const selectedRole = useMemo(
    () => roles.find((r) => r.key === selectedKey) ?? roles[0],
    [roles, selectedKey]
  );

  const [draftMatrix, setDraftMatrix] = useState<RolePermissionsMatrix | null>(
    null
  );
  const [saving, setSaving] = useState(false);

  const [showCreateRole, setShowCreateRole] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleKey, setNewRoleKey] = useState("");
  const [newRoleBase, setNewRoleBase] = useState<"admin" | "editor" | "viewer">(
    "editor"
  );
  const [newRoleDesc, setNewRoleDesc] = useState("");

  const activeMatrix = useMemo(() => {
    if (draftMatrix) return draftMatrix;
    if (!selectedRole) return null;
    return buildMatrixForRole(selectedRole);
  }, [draftMatrix, selectedRole]);

  const handleSelectRole = (role: RoleDefinitionRecord) => {
    setSelectedKey(role.key);
    setDraftMatrix(buildMatrixForRole(role));
  };

  const isLockedRole = selectedRole?.key === "super_admin" || !isAdmin;

  const toggleModulePermission = (
    moduleKey: string,
    action: keyof ModulePermissionEntry
  ) => {
    if (!activeMatrix || isLockedRole) return;
    const current = activeMatrix.modules[moduleKey] ?? {
      view: false,
      create: false,
      edit: false,
      delete: false,
    };
    const nextValue = !current[action];
    const nextEntry = { ...current, [action]: nextValue };
    // Granting create/edit/delete automatically ensures view access
    if (nextValue && action !== "view") {
      nextEntry.view = true;
    }
    setDraftMatrix({
      ...activeMatrix,
      modules: {
        ...activeMatrix.modules,
        [moduleKey]: nextEntry,
      },
    });
  };

  const toggleAllForModule = (moduleKey: string) => {
    if (!activeMatrix || isLockedRole) return;
    const current = activeMatrix.modules[moduleKey];
    const allEnabled =
      current?.view && current?.create && current?.edit && current?.delete;
    const nextVal = !allEnabled;
    setDraftMatrix({
      ...activeMatrix,
      modules: {
        ...activeMatrix.modules,
        [moduleKey]: {
          view: nextVal,
          create: nextVal,
          edit: nextVal,
          delete: nextVal,
        },
      },
    });
  };

  const toggleCapability = (
    capKey: keyof RolePermissionsMatrix["capabilities"]
  ) => {
    if (!activeMatrix || isLockedRole) return;
    setDraftMatrix({
      ...activeMatrix,
      capabilities: {
        ...activeMatrix.capabilities,
        [capKey]: !activeMatrix.capabilities[capKey],
      },
    });
  };

  const handleSave = async () => {
    if (!selectedRole || !activeMatrix || isLockedRole) return;
    setSaving(true);
    try {
      await onSaveRolePermissions(selectedRole, activeMatrix);
    } finally {
      setSaving(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRoleName.trim()) return;
    const normalizedKey =
      (newRoleKey || newRoleName)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") || "custom_role";

    setSaving(true);
    try {
      await onCreateCustomRole({
        key: normalizedKey,
        name: newRoleName.trim(),
        description:
          newRoleDesc.trim() || "Custom studio role with tailored module access.",
        baseRole: newRoleBase,
      });
      setNewRoleName("");
      setNewRoleKey("");
      setNewRoleDesc("");
      setShowCreateRole(false);
      setSelectedKey(normalizedKey);
      setDraftMatrix(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
      {/* Left Role Directory */}
      <div className="space-y-4">
        <div className="rounded-2xl border border-white/10 bg-[#121216] p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Studio Roles</h3>
            {isAdmin && (
              <button
                type="button"
                onClick={() => setShowCreateRole((v) => !v)}
                className="inline-flex items-center gap-1 rounded-lg border border-[#e6c27a]/35 bg-[#e6c27a]/10 px-2.5 py-1 text-xs font-medium text-[#e6c27a] hover:bg-[#e6c27a]/20"
              >
                <Plus className="h-3.5 w-3.5" />
                Custom Role
              </button>
            )}
          </div>

          {showCreateRole && isAdmin && (
            <form
              onSubmit={handleCreateSubmit}
              className="mt-3 space-y-2.5 rounded-xl border border-white/10 bg-black/40 p-3"
            >
              <input
                type="text"
                required
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Role name (e.g. Creative Director)"
                className="w-full rounded-lg border border-white/10 bg-[#121216] px-2.5 py-1.5 text-xs text-white placeholder-neutral-500"
              />
              <input
                type="text"
                value={newRoleKey}
                onChange={(e) => setNewRoleKey(e.target.value)}
                placeholder="Key slug (optional)"
                className="w-full rounded-lg border border-white/10 bg-[#121216] px-2.5 py-1.5 text-xs text-white placeholder-neutral-500"
              />
              <select
                value={newRoleBase}
                onChange={(e) =>
                  setNewRoleBase(
                    e.target.value as "admin" | "editor" | "viewer"
                  )
                }
                className="w-full rounded-lg border border-white/10 bg-[#121216] px-2.5 py-1.5 text-xs text-neutral-200"
              >
                <option value="editor">Base Tier: Editor / Collaborator</option>
                <option value="viewer">Base Tier: Viewer (Read-only)</option>
                <option value="admin">Base Tier: Administrator</option>
              </select>
              <textarea
                rows={2}
                value={newRoleDesc}
                onChange={(e) => setNewRoleDesc(e.target.value)}
                placeholder="Short scope description..."
                className="w-full rounded-lg border border-white/10 bg-[#121216] px-2.5 py-1.5 text-xs text-white placeholder-neutral-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateRole(false)}
                  className="rounded-lg px-2.5 py-1 text-xs text-neutral-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-[#e6c27a] px-3 py-1 text-xs font-semibold text-black hover:bg-[#f0d290]"
                >
                  Create Role
                </button>
              </div>
            </form>
          )}

          <div className="mt-3 space-y-2">
            {roles.map((role) => {
              const active = role.key === selectedRole?.key;
              return (
                <button
                  key={role.key}
                  type="button"
                  onClick={() => handleSelectRole(role)}
                  className={`w-full rounded-xl border p-3 text-left transition ${
                    active
                      ? "border-[#e6c27a]/60 bg-[#e6c27a]/10"
                      : "border-white/10 bg-black/30 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex rounded-md border px-2 py-0.5 text-xs font-medium ${getRoleBadgeClass(
                        role.key
                      )}`}
                    >
                      {role.name}
                    </span>
                    <span className="text-[11px] text-neutral-400">
                      {role.memberCount ?? 0} members
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-[11px] text-neutral-400">
                    {role.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right Permission Matrix & Capabilities */}
      {selectedRole && activeMatrix && (
        <div className="space-y-5 rounded-2xl border border-white/10 bg-[#121216] p-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-[#e6c27a]" />
                <h3 className="text-lg font-semibold text-white">
                  {selectedRole.name} Permissions
                </h3>
                <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] uppercase text-neutral-300">
                  {selectedRole.baseRole} tier
                </span>
              </div>
              <p className="mt-1 text-xs text-neutral-400">
                {selectedRole.description}
              </p>
            </div>

            {isAdmin && (
              <button
                type="button"
                disabled={saving || isLockedRole}
                onClick={() => void handleSave()}
                className="inline-flex items-center gap-2 rounded-xl bg-[#e6c27a] px-4 py-2 text-xs font-semibold text-black transition hover:bg-[#f0d290] disabled:opacity-45"
              >
                <Save className="h-3.5 w-3.5" />
                {saving ? "Saving..." : "Save Permissions"}
              </button>
            )}
          </div>

          {selectedRole.key === "super_admin" && (
            <div className="flex items-center gap-2.5 rounded-xl border border-[#e6c27a]/30 bg-[#e6c27a]/10 px-3.5 py-2.5 text-xs text-[#f0d290]">
              <Lock className="h-4 w-4 shrink-0" />
              Super Admin safeguards keep all module permissions enabled to
              prevent studio lockout.
            </div>
          )}

          {/* Module CRUD Matrix */}
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              Module Access Matrix
            </h4>
            <div className="overflow-x-auto rounded-xl border border-white/10 bg-black/30">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-[11px] uppercase tracking-wider text-neutral-400">
                    <th className="px-4 py-3">Module</th>
                    <th className="px-3 py-3 text-center">View</th>
                    <th className="px-3 py-3 text-center">Create</th>
                    <th className="px-3 py-3 text-center">Edit</th>
                    <th className="px-3 py-3 text-center">Delete</th>
                    <th className="px-4 py-3 text-right">Quick</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06]">
                  {TEAM_MODULE_LIST.map((mod) => {
                    const perms = activeMatrix.modules[mod.key] ?? {
                      view: false,
                      create: false,
                      edit: false,
                      delete: false,
                    };
                    return (
                      <tr key={mod.key} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-medium text-white">
                          {mod.label}
                        </td>
                        {(["view", "create", "edit", "delete"] as const).map(
                          (action) => {
                            const checked = Boolean(perms[action]);
                            return (
                              <td key={action} className="px-3 py-3 text-center">
                                <button
                                  type="button"
                                  disabled={isLockedRole}
                                  onClick={() =>
                                    toggleModulePermission(mod.key, action)
                                  }
                                  aria-label={`${mod.label} ${action}`}
                                  className={`inline-flex h-6 w-6 items-center justify-center rounded-md border transition ${
                                    checked
                                      ? "border-[#e6c27a] bg-[#e6c27a] text-black"
                                      : "border-white/15 bg-white/[0.03] text-transparent hover:border-white/30"
                                  } disabled:cursor-not-allowed disabled:opacity-70`}
                                >
                                  <Check className="h-3.5 w-3.5 stroke-[2.5]" />
                                </button>
                              </td>
                            );
                          }
                        )}
                        <td className="px-4 py-3 text-right">
                          <button
                            type="button"
                            disabled={isLockedRole}
                            onClick={() => toggleAllForModule(mod.key)}
                            className="text-[11px] text-neutral-400 hover:text-[#e6c27a] disabled:opacity-40"
                          >
                            Toggle all
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Granular Studio Capabilities */}
          <div>
            <h4 className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
              <Sparkles className="h-3.5 w-3.5 text-[#e6c27a]" />
              Granular Capabilities
            </h4>
            <div className="grid gap-3 sm:grid-cols-2">
              {TEAM_CAPABILITY_LIST.map((cap) => {
                const enabled = Boolean(
                  activeMatrix.capabilities[
                    cap.key as keyof RolePermissionsMatrix["capabilities"]
                  ]
                );
                return (
                  <button
                    key={cap.key}
                    type="button"
                    disabled={isLockedRole}
                    onClick={() =>
                      toggleCapability(
                        cap.key as keyof RolePermissionsMatrix["capabilities"]
                      )
                    }
                    className={`flex items-start justify-between gap-3 rounded-xl border p-3.5 text-left transition ${
                      enabled
                        ? "border-[#e6c27a]/45 bg-[#e6c27a]/[0.07]"
                        : "border-white/10 bg-black/30 hover:border-white/20"
                    } disabled:cursor-not-allowed`}
                  >
                    <div>
                      <p className="text-xs font-semibold text-white">
                        {cap.label}
                      </p>
                      <p className="mt-0.5 text-[11px] text-neutral-400">
                        {cap.description}
                      </p>
                    </div>
                    <span
                      className={`mt-0.5 inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition ${
                        enabled ? "bg-[#e6c27a]" : "bg-white/15"
                      }`}
                    >
                      <span
                        className={`h-4 w-4 rounded-full bg-black transition-transform ${
                          enabled ? "translate-x-4" : "translate-x-0"
                        }`}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

