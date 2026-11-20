"use client";

import React from "react";
import Link from "next/link";
import {
  Archive,
  Briefcase,
  Building,
  Building2,
  CalendarPlus,
  FolderKanban,
  Mail,
  Phone,
  Plus,
  RotateCcw,
  Search,
  UserCheck,
  UserPlus,
  Users,
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
  const totalProjects = clients.reduce(
    (acc, c) => acc + (c.pmsProjectCount ?? 0),
    0
  );

  return (
    <div className="space-y-5">
      {/* 1. 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Clients */}
        <div className="p-5 rounded-2xl bg-[#121519] border border-[#292E35] space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#D9B875]/15 border border-[#D9B875]/30 flex items-center justify-center text-[#D9B875]">
              <Building className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">Total Clients</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {String(counts.all).padStart(2, "0")}
            </span>
          </div>
          <p className="text-[11.5px] text-[#898D94]">All client relationships</p>
        </div>

        {/* Active Clients */}
        <div className="p-5 rounded-2xl bg-[#121519] border border-[#292E35] space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#56C58B]/15 border border-[#56C58B]/30 flex items-center justify-center text-[#56C58B]">
              <UserCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">Active Clients</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {String(counts.active).padStart(2, "0")}
            </span>
            {counts.active > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#56C58B]/15 text-[#56C58B] border border-[#56C58B]/25">
                Active
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-[#898D94]">Currently engaged accounts</p>
        </div>

        {/* Archived Accounts */}
        <div className="p-5 rounded-2xl bg-[#121519] border border-[#292E35] space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#898D94]/15 border border-[#898D94]/30 flex items-center justify-center text-[#898D94]">
              <Archive className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">Archived</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {String(counts.archived).padStart(2, "0")}
            </span>
          </div>
          <p className="text-[11.5px] text-[#898D94]">Dormant or past records</p>
        </div>

        {/* PMS Projects */}
        <div className="p-5 rounded-2xl bg-[#121519] border border-[#292E35] space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#F06419]/15 border border-[#F06419]/30 flex items-center justify-center text-[#F06419]">
              <FolderKanban className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">PMS Projects</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {String(totalProjects).padStart(2, "0")}
            </span>
          </div>
          <p className="text-[11.5px] text-[#898D94]">Internal execution projects</p>
        </div>
      </div>

      {/* 2. Client Directory Table Container */}
      <div className="rounded-2xl bg-[#121519] border border-[#292E35] overflow-hidden">
        {/* Header bar */}
        <div className="p-5 border-b border-[#292E35] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: "all", label: "All Clients", count: counts.all },
                { id: "active", label: "Active", count: counts.active },
                {
                  id: "archived",
                  label: "Archived",
                  count: counts.archived,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onStatusFilterChange(tab.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer",
                  statusFilter === tab.id
                    ? "bg-[#161A1F] text-[#F5F2EC] border border-[#F06419]/50 shadow-sm"
                    : "text-[#898D94] hover:text-[#F5F2EC] hover:bg-[#161A1F] border border-transparent"
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#898D94] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => onSearchQueryChange(e.target.value)}
                placeholder="Search clients, companies..."
                className="h-9 w-60 pl-8 pr-3 rounded-xl bg-[#161A1F] border border-[#292E35] text-xs text-[#F5F2EC] placeholder:text-[#898D94] focus:outline-none focus:border-[#F06419]"
              />
            </div>
            {canEdit && (
              <button
                type="button"
                onClick={onAddClient}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F06419] hover:bg-[#d95510] text-[#0C0E10] text-xs font-bold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Client</span>
              </button>
            )}
          </div>
        </div>

        {/* Directory Content */}
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#898D94]">
            Loading studio clients...
          </div>
        ) : clients.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#161A1F] border border-[#292E35] flex items-center justify-center mx-auto text-[#898D94]">
              <Building2 className="w-6 h-6 text-[#D9B875]" />
            </div>
            <div className="text-sm font-semibold text-[#F5F2EC]">
              {counts.all === 0
                ? "No clients or accounts found"
                : "No matching clients"}
            </div>
            <p className="text-xs text-[#898D94] max-w-md mx-auto leading-relaxed">
              {counts.all === 0
                ? "Convert an active inquiry from Leads & Inquiries or create a client record to start managing project engagements."
                : "Try adjusting your search criteria or clearing your status filter."}
            </p>
            {counts.all === 0 && canEdit && (
              <button
                type="button"
                onClick={onAddClient}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F06419] hover:bg-[#d95510] text-[#0C0E10] text-xs font-bold transition-colors cursor-pointer mt-2"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Add Client</span>
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#292E35] text-[10.5px] font-mono uppercase tracking-[0.12em] text-[#898D94] bg-[#0D0F12]/50">
                  <th className="py-3.5 px-4 font-normal">Client</th>
                  <th className="py-3.5 px-4 font-normal">Company &amp; Contact</th>
                  <th className="py-3.5 px-4 font-normal">Service Scope</th>
                  <th className="py-3.5 px-4 font-normal">PMS Projects</th>
                  <th className="py-3.5 px-4 font-normal min-w-[110px]">Status</th>
                  <th className="py-3.5 px-4 font-normal">Added</th>
                  <th className="py-3.5 px-4 font-normal text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292E35]/60 text-xs">
                {clients.map((client) => (
                  <tr
                    key={client.id}
                    className="hover:bg-[#161A1F]/70 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full bg-[#161A1F] border border-[#D9B875]/40 text-[#D9B875] text-[11px] font-semibold flex items-center justify-center shrink-0">
                          {getInitials(client.name)}
                        </span>
                        <div className="min-w-0">
                          <div className="text-xs font-medium text-[#F5F2EC] truncate">
                            {client.name}
                          </div>
                          <div className="text-[11px] text-[#898D94] truncate flex items-center gap-1">
                            <Mail className="w-3 h-3 shrink-0" />
                            <span>{client.emailNormalized}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs text-[#F5F2EC] flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-[#898D94] shrink-0" />
                        <span>{client.companyName || "Independent"}</span>
                      </div>
                      {client.phone && (
                        <div className="text-[11px] text-[#898D94] flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 shrink-0" />
                          <span>{client.phone}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-xs font-medium text-[#F5F2EC]">
                        {client.serviceInterest}
                      </div>
                      <div className="text-[11px] text-[#898D94] mt-0.5">
                        {client.sourceReferenceCode
                          ? `Converted from ${client.sourceReferenceCode}`
                          : formatSourceLabel(client.source)}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <Link
                        href="/admin/projects"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#161A1F] border border-[#292E35] text-xs text-[#D9B875] hover:border-[#D9B875]/50 transition-colors"
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
                    <td className="py-3.5 px-4 min-w-[110px] whitespace-nowrap">
                      <span
                        className={cn(
                          "inline-flex items-center px-2.5 py-1 rounded-full text-[10.5px] font-mono font-semibold uppercase tracking-wider border leading-none whitespace-nowrap",
                          client.status === "active"
                            ? "bg-[#142A1E] text-[#56C58B] border-[#56C58B]/35"
                            : "bg-[#161A1F] text-[#898D94] border-[#292E35]"
                        )}
                      >
                        {client.status === "active" ? "Active" : "Archived"}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-[#898D94] whitespace-nowrap">
                      {formatRelativeDate(client.createdAt)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      {canEdit && (
                        <div className="inline-flex items-center gap-1.5 justify-end">
                          <button
                            type="button"
                            onClick={() => onCreatePmsProject(client)}
                            title="Create internal project in PMS"
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#161A1F] border border-[#292E35] text-[11px] font-medium text-[#D9B875] hover:border-[#D9B875]/60 cursor-pointer transition-colors"
                          >
                            <Briefcase className="w-3 h-3" />
                            <span>PMS Project</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => onCreateFollowup(client)}
                            title="Schedule client follow-up"
                            className="p-1.5 rounded-lg bg-[#161A1F] border border-[#292E35] text-[#898D94] hover:text-[#F5F2EC] hover:border-[#363B43] cursor-pointer transition-colors"
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
                            className="p-1.5 rounded-lg bg-[#161A1F] border border-[#292E35] text-[#898D94] hover:text-[#F5F2EC] hover:border-[#363B43] cursor-pointer transition-colors"
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
    </div>
  );
}
