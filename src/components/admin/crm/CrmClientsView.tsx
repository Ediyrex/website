"use client";

import React from "react";
import Link from "next/link";
import {
  Archive,
  Briefcase,
  Building2,
  CalendarPlus,
  FolderKanban,
  Mail,
  Phone,
  Plus,
  RotateCcw,
  Search,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  formatRelativeDate,
  formatSourceLabel,
  getInitials,
  type CrmClientRow,
} from "./crm-types";

interface CrmClientsViewProps {
  clients: CrmClientRow[];
  counts: { all: number; active: number; archived: number };
  statusFilter: "all" | "active" | "archived";
  onStatusFilterChange: (next: "all" | "active" | "archived") => void;
  searchQuery: string;
  onSearchQueryChange: (next: string) => void;
  loading: boolean;
  canEdit: boolean;
  onAddClient: () => void;
  onCreateFollowup: (client: CrmClientRow) => void;
  onCreatePmsProject: (client: CrmClientRow) => void;
  onToggleClientStatus: (client: CrmClientRow) => void;
}

export function CrmClientsView({
  clients,
  counts,
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  loading,
  canEdit,
  onAddClient,
  onCreateFollowup,
  onCreatePmsProject,
  onToggleClientStatus,
}: CrmClientsViewProps) {
  return (
    <div className="rounded-xl bg-[#111419] border border-[#1E222A] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1E222A] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1">
          {(
            [
              { id: "all", label: "All Clients", count: counts.all },
              { id: "active", label: "Active Clients", count: counts.active },
              {
                id: "archived",
                label: "Archived Clients",
                count: counts.archived,
              },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onStatusFilterChange(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                statusFilter === tab.id
                  ? "bg-[#222731] text-[#D6B77A] border border-[#D6B77A]/35"
                  : "text-[#8D939E] hover:text-[#F5F3EE] hover:bg-[#171A21] border border-transparent"
              )}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#6D7480] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Search clients, companies..."
              className="h-9 w-64 pl-8 pr-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE] placeholder:text-[#6D7480] focus:outline-none focus:border-[#D6B77A]"
            />
          </div>
          {canEdit && (
            <button
              type="button"
              onClick={onAddClient}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add Client</span>
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="p-10 text-center text-xs font-mono text-[#777D87]">
          Loading studio clients...
        </div>
      ) : clients.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <div className="text-sm font-medium text-[#F5F3EE]">
            No client records found
          </div>
          <p className="text-xs text-[#777D87] max-w-md mx-auto">
            Convert an active inquiry from Leads &amp; Inquiries or add a studio
            client directly to manage internal PMS projects and follow-ups.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#1E222A] text-[10px] font-mono uppercase tracking-[0.14em] text-[#777D87] bg-[#0D0F12]/60">
                <th className="py-3 px-4 font-normal">Client</th>
                <th className="py-3 px-4 font-normal">Company &amp; Contact</th>
                <th className="py-3 px-4 font-normal">Service Scope</th>
                <th className="py-3 px-4 font-normal">PMS Projects</th>
                <th className="py-3 px-4 font-normal">Status</th>
                <th className="py-3 px-4 font-normal">Added</th>
                <th className="py-3 px-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1E222A]">
              {clients.map((client) => (
                <tr
                  key={client.id}
                  className="hover:bg-[#161920]/70 transition-colors"
                >
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#241E14] border border-[#D6B77A]/35 text-[#D6B77A] text-[11px] font-semibold flex items-center justify-center shrink-0">
                        {getInitials(client.name)}
                      </span>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-[#F5F3EE] truncate">
                          {client.name}
                        </div>
                        <div className="text-xs text-[#777D87] truncate flex items-center gap-1">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span>{client.emailNormalized}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-xs text-[#E4E0D8] flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#777D87] shrink-0" />
                      <span>{client.companyName || "Independent"}</span>
                    </div>
                    {client.phone && (
                      <div className="text-[11px] text-[#777D87] flex items-center gap-1.5 mt-0.5">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-xs font-medium text-[#E4E0D8]">
                      {client.serviceInterest}
                    </div>
                    <div className="text-[11px] text-[#777D87] mt-0.5">
                      {client.sourceReferenceCode
                        ? `Converted from ${client.sourceReferenceCode}`
                        : formatSourceLabel(client.source)}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <Link
                      href="/admin/tasks"
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161920] border border-[#252A32] text-xs text-[#D6B77A] hover:border-[#D6B77A]/50"
                    >
                      <FolderKanban className="w-3.5 h-3.5" />
                      <span>
                        {client.pmsProjectCount ?? 0}{" "}
                        {(client.pmsProjectCount ?? 0) === 1
                          ? "project"
                          : "projects"}
                      </span>
                    </Link>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium border",
                        client.status === "active"
                          ? "bg-[#13291E] text-[#6FCF97] border-[#6FCF97]/35"
                          : "bg-[#1B1E25] text-[#8D939E] border-[#2E3440]"
                      )}
                    >
                      {client.status === "active" ? "Active" : "Archived"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#8D939E]">
                    {formatRelativeDate(client.createdAt)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {canEdit && (
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onCreatePmsProject(client)}
                          title="Create internal project in PMS"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1A1D24] border border-[#2A303B] text-[11px] font-medium text-[#D6B77A] hover:border-[#D6B77A]/50 cursor-pointer"
                        >
                          <Briefcase className="w-3 h-3" />
                          <span>PMS Project</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onCreateFollowup(client)}
                          title="Schedule client follow-up"
                          className="p-1.5 rounded-lg bg-[#161920] border border-[#252A32] text-[#8D939E] hover:text-[#F5F3EE] cursor-pointer"
                        >
                          <CalendarPlus className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onToggleClientStatus(client)}
                          title={
                            client.status === "active"
                              ? "Archive client"
                              : "Restore active client"
                          }
                          className="p-1.5 rounded-lg bg-[#161920] border border-[#252A32] text-[#8D939E] hover:text-[#F5F3EE] cursor-pointer"
                        >
                          {client.status === "active" ? (
                            <Archive className="w-3.5 h-3.5" />
                          ) : (
                            <RotateCcw className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
