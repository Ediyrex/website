"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useAdminUser } from "./AdminContext";

interface TeamMember {
  id: string;
  emailNormalized: string;
  displayName: string;
  status: "invited" | "active" | "disabled";
  roles: string[];
  lastLoginAt: string | null;
}

export function AdminTeamClient() {
  const router = useRouter();
  const { user, isAdmin } = useAdminUser();
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchTeam = useCallback(async () => {
    const res = await fetch("/api/v1/admin/team");
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Unable to fetch team.");
    return (json.data || []) as TeamMember[];
  }, [router]);

  useEffect(() => {
    let ignore = false;
    fetchTeam()
      .then((rows) => {
        if (!ignore && rows) setMembers(rows);
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Network error loading team."
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fetchTeam]);

  const updateMember = async (
    id: string,
    payload: { roleName?: string; status?: string }
  ) => {
    setError("");
    setSuccess("");
    const res = await fetch(`/api/v1/admin/team/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json.message || "Unable to update team member.");
      return;
    }
    const refreshed = await fetchTeam();
    if (refreshed) setMembers(refreshed);
    setSuccess("Updated access role/status.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
          Team &amp; Access Control
        </h1>
        <p className="text-sm text-[#8D939E]">
          Role-based access across `admin` (full control), `editor` (content &amp; media), and `viewer` (read-only review).
        </p>
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

      <div className="rounded-xl bg-[#111419] border border-[#1E222A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E222A] text-[11px] font-mono uppercase text-[#777D87] bg-[#0B0D10]">
                <th className="py-3 px-4">Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4">Last Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E222A] text-sm">
              {loading ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-xs font-mono text-[#777D87]">
                    Loading team members...
                  </td>
                </tr>
              ) : (
                members.map((m) => {
                  const isSelf = m.id === user.id;
                  const primaryRole = m.roles[0] || "viewer";
                  return (
                    <tr key={m.id} className="hover:bg-[#161920]">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <Shield className="w-4 h-4 text-[#D6B77A]" />
                          <div>
                            <div className="font-medium text-[#F5F3EE]">
                              {m.displayName}{" "}
                              {isSelf && (
                                <span className="text-[10px] font-mono text-[#D6B77A]">
                                  (You)
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[#777D87]">
                              {m.emailNormalized}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        {isAdmin && !isSelf ? (
                          <select
                            value={primaryRole}
                            onChange={(e) =>
                              updateMember(m.id, { roleName: e.target.value })
                            }
                            className="h-8 px-2.5 rounded bg-[#0D0F12] border border-[#252A32] text-xs font-mono text-[#F5F3EE]"
                          >
                            <option value="admin">admin</option>
                            <option value="editor">editor</option>
                            <option value="viewer">viewer</option>
                          </select>
                        ) : (
                          <Badge variant="accent">{primaryRole}</Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {isAdmin && !isSelf ? (
                          <select
                            value={m.status}
                            onChange={(e) =>
                              updateMember(m.id, { status: e.target.value })
                            }
                            className="h-8 px-2.5 rounded bg-[#0D0F12] border border-[#252A32] text-xs font-mono text-[#F5F3EE]"
                          >
                            <option value="active">active</option>
                            <option value="invited">invited</option>
                            <option value="disabled">disabled</option>
                          </select>
                        ) : (
                          <Badge
                            variant={m.status === "active" ? "accent" : "default"}
                          >
                            {m.status}
                          </Badge>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#777D87]">
                        {m.lastLoginAt
                          ? new Date(m.lastLoginAt).toLocaleString()
                          : "Never"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

