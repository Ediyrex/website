"use client";

import React from "react";
import {
  AlertTriangle,
  Calendar,
  CalendarCheck,
  CalendarClock,
  Check,
  Clock,
  Mail,
  MessageSquare,
  Phone,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDueBadge, type CrmFollowupRow } from "./crm-types";

interface CrmFollowupsViewProps {
  followups: CrmFollowupRow[];
  counts: {
    upcoming: number;
    today?: number;
    overdue: number;
    completed: number;
    all: number;
  };
  filter: "upcoming" | "today" | "overdue" | "completed" | "all";
  onFilterChange: (next: "upcoming" | "today" | "overdue" | "completed" | "all") => void;
  loading: boolean;
  canEdit: boolean;
  onCreateFollowup: () => void;
  onToggleComplete: (item: CrmFollowupRow) => void;
  onDeleteFollowup: (id: string) => void;
  onOpenEnquiry: (enquiryId: string) => void;
}

const CHANNEL_ICON: Record<string, React.ReactNode> = {
  email: <Mail className="w-3.5 h-3.5" />,
  call: <Phone className="w-3.5 h-3.5" />,
  meeting: <Users className="w-3.5 h-3.5" />,
  whatsapp: <MessageSquare className="w-3.5 h-3.5" />,
  other: <Calendar className="w-3.5 h-3.5" />,
};

export function CrmFollowupsView({
  followups,
  counts,
  filter,
  onFilterChange,
  loading,
  canEdit,
  onCreateFollowup,
  onToggleComplete,
  onDeleteFollowup,
  onOpenEnquiry,
}: CrmFollowupsViewProps) {
  const getEmptyStateContent = () => {
    switch (filter) {
      case "overdue":
        return {
          title: "You're all caught up. No overdue follow-ups.",
          description:
            "All scheduled client touchpoints, proposal reviews, and calls are currently on track.",
        };
      case "today":
        return {
          title: "No follow-ups scheduled for today.",
          description:
            "No client check-ins or outreach tasks are scheduled for today. You can plan ahead anytime.",
        };
      case "upcoming":
        return {
          title: "No upcoming follow-ups scheduled.",
          description:
            "Schedule reminders for discovery calls, proposal reviews, and milestones so no studio lead slips through the cracks.",
        };
      case "completed":
        return {
          title: "No completed follow-ups in this period.",
          description:
            "Actioned outreach tasks and completed client communications will appear here once logged.",
        };
      default:
        return {
          title: "No follow-up records found.",
          description:
            "Schedule reminders for calls, proposals, and client check-ins so no studio opportunity slips through the cracks.",
        };
    }
  };

  const emptyState = getEmptyStateContent();

  return (
    <div className="space-y-5">
      {/* 1. KPI Cards Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overdue */}
        <div className="p-5 rounded-2xl bg-[#121519] border border-[#292E35] space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#E36B68]/15 border border-[#E36B68]/30 flex items-center justify-center text-[#E36B68]">
              <AlertTriangle className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">Overdue</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {String(counts.overdue).padStart(2, "0")}
            </span>
            {counts.overdue > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#E36B68]/15 text-[#E36B68] border border-[#E36B68]/25">
                Action Required
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-[#898D94]">Requires immediate touchpoint</p>
        </div>

        {/* Due Today */}
        <div className="p-5 rounded-2xl bg-[#121519] border border-[#292E35] space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#E9B45A]/15 border border-[#E9B45A]/30 flex items-center justify-center text-[#E9B45A]">
              <Clock className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">Due Today</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {String(counts.today ?? 0).padStart(2, "0")}
            </span>
            {(counts.today ?? 0) > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-mono font-medium bg-[#E9B45A]/15 text-[#E9B45A] border border-[#E9B45A]/25">
                Scheduled
              </span>
            )}
          </div>
          <p className="text-[11.5px] text-[#898D94]">Due for today&apos;s outreach</p>
        </div>

        {/* Upcoming */}
        <div className="p-5 rounded-2xl bg-[#121519] border border-[#292E35] space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#68A9FF]/15 border border-[#68A9FF]/30 flex items-center justify-center text-[#68A9FF]">
              <CalendarClock className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">Upcoming</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {String(counts.upcoming).padStart(2, "0")}
            </span>
          </div>
          <p className="text-[11.5px] text-[#898D94]">Scheduled future touchpoints</p>
        </div>

        {/* Completed */}
        <div className="p-5 rounded-2xl bg-[#121519] border border-[#292E35] space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-[#56C58B]/15 border border-[#56C58B]/30 flex items-center justify-center text-[#56C58B]">
              <CalendarCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-medium text-[#B8B9BC]">Completed</span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className="font-heading font-bold text-3xl sm:text-4xl text-[#F5F2EC] tracking-tight">
              {String(counts.completed).padStart(2, "0")}
            </span>
          </div>
          <p className="text-[11.5px] text-[#898D94]">Actioned records closed</p>
        </div>
      </div>

      {/* 2. Main Table & Schedule Container */}
      <div className="rounded-2xl bg-[#121519] border border-[#292E35] overflow-hidden">
        {/* Header bar */}
        <div className="p-5 border-b border-[#292E35] flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {(
              [
                { id: "overdue", label: "Overdue", count: counts.overdue },
                { id: "today", label: "Due Today", count: counts.today ?? 0 },
                { id: "upcoming", label: "Upcoming", count: counts.upcoming },
                { id: "completed", label: "Completed", count: counts.completed },
                { id: "all", label: "All Records", count: counts.all },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => onFilterChange(tab.id)}
                className={cn(
                  "px-3.5 py-1.5 rounded-xl text-xs font-medium transition-colors cursor-pointer",
                  filter === tab.id
                    ? "bg-[#161A1F] text-[#F5F2EC] border border-[#F06419]/50 shadow-sm"
                    : "text-[#898D94] hover:text-[#F5F2EC] hover:bg-[#161A1F] border border-transparent"
                )}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          {canEdit && (
            <button
              type="button"
              onClick={onCreateFollowup}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F06419] hover:bg-[#d95510] text-[#0C0E10] text-xs font-bold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Schedule Follow-up</span>
            </button>
          )}
        </div>

        {/* Content list */}
        {loading ? (
          <div className="p-12 text-center text-xs font-mono text-[#898D94]">
            Loading follow-up schedule...
          </div>
        ) : followups.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#161A1F] border border-[#292E35] flex items-center justify-center mx-auto text-[#898D94]">
              <Calendar className="w-6 h-6 text-[#F06419]" />
            </div>
            <div className="text-sm font-semibold text-[#F5F2EC]">
              {emptyState.title}
            </div>
            <p className="text-xs text-[#898D94] max-w-md mx-auto leading-relaxed">
              {emptyState.description}
            </p>
            {canEdit && (
              <button
                type="button"
                onClick={onCreateFollowup}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#161A1F] border border-[#292E35] hover:border-[#F06419] text-xs font-medium text-[#F5F2EC] hover:text-[#F06419] transition-colors cursor-pointer mt-2"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Schedule Follow-up</span>
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#292E35]">
            {followups.map((item) => {
              const due = formatDueBadge(item.dueAt, item.completed);
              return (
                <div
                  key={item.id}
                  className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#161A1F]/70 transition-colors"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <button
                      type="button"
                      disabled={!canEdit}
                      onClick={() => onToggleComplete(item)}
                      aria-label={
                        item.completed
                          ? "Mark follow-up incomplete"
                          : "Complete follow-up"
                      }
                      className={cn(
                        "mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 cursor-pointer disabled:cursor-default",
                        item.completed
                          ? "bg-[#56C58B] border-[#56C58B] text-[#0C0E10]"
                          : "bg-[#161A1F] border-[#292E35] hover:border-[#F06419]"
                      )}
                    >
                      {item.completed && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={cn(
                            "text-sm font-medium",
                            item.completed
                              ? "line-through text-[#898D94]"
                              : "text-[#F5F2EC]"
                          )}
                        >
                          {item.title}
                        </span>

                        <span
                          className={cn(
                            "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border",
                            item.completed
                              ? "bg-[#161A1F] text-[#898D94] border-[#292E35]"
                              : due.isUrgent
                              ? "bg-[#2D1615] text-[#E36B68] border-[#E36B68]/30"
                              : "bg-[#2E2214] text-[#E9B45A] border-[#E9B45A]/30"
                          )}
                        >
                          {due.label}
                        </span>
                      </div>

                      <div className="text-xs text-[#898D94] flex flex-wrap items-center gap-3">
                        <span className="flex items-center gap-1 text-[#B8B9BC]">
                          {CHANNEL_ICON[item.channel] || CHANNEL_ICON.other}
                          <span className="capitalize">{item.channel}</span>
                        </span>

                        <span>•</span>

                        <span>
                          Target:{" "}
                          <strong className="text-[#F5F2EC] font-medium">
                            {item.contactName}
                          </strong>
                          {item.clientCompany && (
                            <span className="text-[#898D94]">
                              {" "}
                              ({item.clientCompany})
                            </span>
                          )}
                        </span>

                        {item.enquiryId && (
                          <>
                            <span>•</span>
                            <button
                              type="button"
                              onClick={() => onOpenEnquiry(item.enquiryId!)}
                              className="text-[#F06419] hover:underline font-mono text-[11px] cursor-pointer"
                            >
                              {item.enquiryReference || "View Lead"}
                            </button>
                          </>
                        )}
                      </div>

                      {item.notes && (
                        <p className="text-xs text-[#898D94] line-clamp-1 italic pt-0.5">
                          &ldquo;{item.notes}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>

                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => onDeleteFollowup(item.id)}
                      title="Delete follow-up"
                      className="p-2 rounded-xl text-[#898D94] hover:text-[#E36B68] hover:bg-[#161A1F] transition-colors cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
