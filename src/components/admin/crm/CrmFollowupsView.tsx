"use client";

import React from "react";
import {
  Calendar,
  Check,
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
  counts: { upcoming: number; overdue: number; completed: number; all: number };
  filter: "upcoming" | "overdue" | "completed" | "all";
  onFilterChange: (next: "upcoming" | "overdue" | "completed" | "all") => void;
  loading: boolean;
  canEdit: boolean;
  onCreateFollowup: () => void;
  onToggleComplete: (item: CrmFollowupRow) => void;
  onDeleteFollowup: (id: string) => void;
  onOpenEnquiry: (enquiryId: string) => void;
}

const CHANNEL_ICON: Record<string, React.ReactNode> = {
  email: <Mail className="w-3 h-3" />,
  call: <Phone className="w-3 h-3" />,
  meeting: <Users className="w-3 h-3" />,
  whatsapp: <MessageSquare className="w-3 h-3" />,
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
  return (
    <div className="rounded-xl bg-[#111419] border border-[#1E222A] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#1E222A] flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1">
          {(
            [
              { id: "upcoming", label: "Upcoming", count: counts.upcoming },
              { id: "overdue", label: "Overdue", count: counts.overdue },
              { id: "completed", label: "Completed", count: counts.completed },
              { id: "all", label: "All", count: counts.all },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer",
                filter === tab.id
                  ? "bg-[#222731] text-[#D6B77A] border border-[#D6B77A]/35"
                  : "text-[#8D939E] hover:text-[#F5F3EE] hover:bg-[#171A21] border border-transparent"
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
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Follow-up</span>
          </button>
        )}
      </div>

      {loading ? (
        <div className="p-10 text-center text-xs font-mono text-[#777D87]">
          Loading follow-up schedule...
        </div>
      ) : followups.length === 0 ? (
        <div className="p-12 text-center space-y-2">
          <div className="text-sm font-medium text-[#F5F3EE]">
            No follow-ups in this view
          </div>
          <p className="text-xs text-[#777D87] max-w-md mx-auto">
            Schedule reminders for calls, proposals, and client check-ins so no
            studio lead slips through the cracks.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#1E222A]">
          {followups.map((item) => {
            const due = formatDueBadge(item.dueAt, item.completed);
            return (
              <div
                key={item.id}
                className="px-5 py-4 flex items-center justify-between gap-4 hover:bg-[#161920]/70 transition-colors"
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
                        ? "bg-[#6FCF97] border-[#6FCF97] text-[#08090B]"
                        : "bg-[#0D0F12] border-[#323946] hover:border-[#D6B77A]"
                    )}
                  >
                    {item.completed && <Check className="w-3 h-3" />}
                  </button>

                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "text-sm font-medium",
                          item.completed
                            ? "line-through text-[#6D7480]"
                            : "text-[#F5F3EE]"
                        )}
                      >
                        {item.title}
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#161920] border border-[#252A32] text-[10px] font-mono uppercase text-[#9AA1AE]">
                        {CHANNEL_ICON[item.channel] ?? (
                          <Calendar className="w-3 h-3" />
                        )}
                        <span>{item.channel}</span>
                      </span>
                    </div>

                    <div className="text-xs text-[#8D939E] flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-[#D6B77A] font-medium">
                        {item.contactName}
                      </span>
                      {item.clientCompany && <span>{item.clientCompany}</span>}
                      {item.enquiryId && (
                        <button
                          type="button"
                          onClick={() => onOpenEnquiry(item.enquiryId!)}
                          className="text-[#8AB4F8] hover:underline cursor-pointer"
                        >
                          {item.enquiryReference || "Open Inquiry"}
                        </button>
                      )}
                    </div>

                    {item.notes && (
                      <p className="text-xs text-[#777D87] line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div
                      className={cn(
                        "text-xs font-medium",
                        due.isUrgent ? "text-[#F28B82]" : "text-[#E4E0D8]"
                      )}
                    >
                      {due.label}
                    </div>
                    <div className="text-[11px] font-mono text-[#6D7480]">
                      {new Date(item.dueAt).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => onDeleteFollowup(item.id)}
                      className="p-1.5 rounded-lg text-[#777D87] hover:text-[#F28B82] hover:bg-[#1B1E25] cursor-pointer"
                      aria-label={`Delete follow-up ${item.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
