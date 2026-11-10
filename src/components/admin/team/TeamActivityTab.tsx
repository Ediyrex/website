"use client";

import React, { useMemo, useState } from "react";
import { Activity, Search, ShieldAlert } from "lucide-react";
import type { TeamActivityRecord } from "./team-types";
import { formatRelativeTime } from "./team-types";

interface TeamActivityTabProps {
  logs: TeamActivityRecord[];
}

function getActionBadgeColor(action: string): string {
  if (action.includes("removed") || action.includes("revoked")) {
    return "border-rose-500/30 bg-rose-500/10 text-rose-300";
  }
  if (action.includes("invited") || action.includes("created")) {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }
  if (action.includes("role") || action.includes("permissions")) {
    return "border-[#e6c27a]/40 bg-[#e6c27a]/15 text-[#f0d290]";
  }
  if (action.includes("login") || action.includes("session")) {
    return "border-sky-500/30 bg-sky-500/10 text-sky-300";
  }
  return "border-white/15 bg-white/5 text-neutral-300";
}

function formatActionTitle(action: string): string {
  return action
    .replaceAll(".", " · ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function TeamActivityTab({ logs }: TeamActivityTabProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<
    "all" | "team" | "roles" | "invitations" | "auth"
  >("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return logs.filter((entry) => {
      if (category === "team" && !entry.action.startsWith("team.member")) {
        return false;
      }
      if (category === "roles" && !entry.action.includes("role")) {
        return false;
      }
      if (category === "invitations" && !entry.action.includes("invitation")) {
        return false;
      }
      if (
        category === "auth" &&
        !entry.action.includes("login") &&
        !entry.action.includes("session")
      ) {
        return false;
      }
      if (q.length > 0) {
        const hay = `${entry.actorEmailSnapshot} ${entry.action} ${
          entry.entityType
        } ${JSON.stringify(entry.metadata)}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [logs, search, category]);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#121216] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div className="flex items-center gap-2.5">
          <Activity className="h-5 w-5 text-[#e6c27a]" />
          <div>
            <h3 className="text-sm font-semibold text-white">
              Security & Access Activity Log
            </h3>
            <p className="text-xs text-neutral-400">
              Monitor invitations, logins, role permission updates, and session
              revocations.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search actor or event..."
              className="rounded-xl border border-white/10 bg-black/40 py-1.5 pr-3 pl-8 text-xs text-white placeholder-neutral-500"
            />
          </div>

          <select
            value={category}
            onChange={(e) =>
              setCategory(
                e.target.value as
                  | "all"
                  | "team"
                  | "roles"
                  | "invitations"
                  | "auth"
              )
            }
            className="rounded-xl border border-white/10 bg-black/40 px-3 py-1.5 text-xs text-neutral-200"
          >
            <option value="all">All Events</option>
            <option value="team">Member Changes</option>
            <option value="invitations">Invitations</option>
            <option value="roles">Roles & Permissions</option>
            <option value="auth">Logins & Sessions</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="py-12 text-center">
          <ShieldAlert className="mx-auto h-9 w-9 text-neutral-600" />
          <p className="mt-3 text-sm text-neutral-300">
            No matching audit events found.
          </p>
        </div>
      ) : (
        <div className="mt-4 divide-y divide-white/[0.06]">
          {filtered.map((entry) => {
            const metaText = Object.entries(entry.metadata ?? {})
              .filter(([, val]) => val !== null && val !== undefined && val !== "")
              .slice(0, 3)
              .map(([key, val]) =>
                `${key}: ${typeof val === "object" ? JSON.stringify(val) : String(val)}`
              )
              .join(" · ");

            return (
              <div
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-3 py-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-medium ${getActionBadgeColor(
                        entry.action
                      )}`}
                    >
                      {formatActionTitle(entry.action)}
                    </span>
                    <span className="font-medium text-white">
                      {entry.actorEmailSnapshot}
                    </span>
                    <span className="text-neutral-500">
                      on {entry.entityType}
                    </span>
                  </div>
                  {metaText && (
                    <p className="font-mono text-[11px] text-neutral-400">
                      {metaText}
                    </p>
                  )}
                </div>

                <div className="text-right text-[11px] text-neutral-400">
                  <p>{formatRelativeTime(entry.createdAt)}</p>
                  <p className="text-[10px] text-neutral-500">
                    {new Date(entry.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

