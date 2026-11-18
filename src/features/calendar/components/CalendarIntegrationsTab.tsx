"use client";

import React, { useState } from "react";
import { ConnectedAccount, ManagedCalendar } from "../types/calendar.types";
import {
  Link2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Calendar as CalendarIcon,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

interface CalendarIntegrationsTabProps {
  accounts: ConnectedAccount[];
  calendars: ManagedCalendar[];
  isConfigured: boolean;
  oauthUrl: string | null;
  onRefresh: () => void;
  onToggleCalendar: (calendarId: string, isSelected: boolean) => Promise<void>;
  onDisconnectAccount: (accountId: string) => Promise<void>;
}

export function CalendarIntegrationsTab({
  accounts,
  calendars,
  isConfigured,
  oauthUrl,
  onRefresh,
  onToggleCalendar,
  onDisconnectAccount,
}: CalendarIntegrationsTabProps) {
  const [disconnectingId, setDisconnectingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const activeAccount = accounts.find((a) => a.isActive);

  async function handleDisconnect(accountId: string) {
    if (!window.confirm("Are you sure you want to disconnect this Google account?")) {
      return;
    }
    setDisconnectingId(accountId);
    try {
      await onDisconnectAccount(accountId);
    } finally {
      setDisconnectingId(null);
    }
  }

  async function handleToggle(calendarId: string, current: boolean) {
    setTogglingId(calendarId);
    try {
      await onToggleCalendar(calendarId, !current);
    } finally {
      setTogglingId(null);
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Google Calendar Connection Card */}
      <div className="p-6 rounded-xl bg-[#12151A] border border-[#252A32] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#252A32] pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D6B77A]/15 border border-[#D6B77A]/30 flex items-center justify-center text-[#D6B77A]">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-heading font-bold text-[#F5F3EE]">
                Google Calendar Integration (OAuth 2.0)
              </h3>
              <p className="text-xs text-[#B2B4BA]">
                Connect your official studio Google Workspace / Gmail account to synchronize events.
              </p>
            </div>
          </div>

          <div>
            {activeAccount ? (
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Connected
                </span>
                <button
                  type="button"
                  onClick={() => handleDisconnect(activeAccount.id)}
                  disabled={disconnectingId === activeAccount.id}
                  className="px-3 py-1 rounded-lg bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs font-mono text-[#EF4444] hover:bg-[#EF4444] hover:text-[#08090B] transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  {disconnectingId === activeAccount.id ? "Disconnecting..." : "Disconnect"}
                </button>
              </div>
            ) : oauthUrl ? (
              <a
                href={oauthUrl}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D6B77A] text-[#08090B] text-xs font-mono font-bold hover:bg-[#E5CCA0] transition-colors shadow-sm"
              >
                <Link2 className="w-4 h-4" />
                <span>Connect Google Account</span>
              </a>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-[#F06419]/15 text-[#F06419] border border-[#F06419]/30">
                <AlertTriangle className="w-3.5 h-3.5" />
                OAuth Pending Setup
              </span>
            )}
          </div>
        </div>

        {/* Account Details or Setup Guidance */}
        {activeAccount ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg bg-[#0E1014] border border-[#252A32] text-xs font-mono">
            <div>
              <span className="text-[#777D87] block mb-1">ACCOUNT NAME</span>
              <span className="text-[#F5F3EE] font-semibold">
                {activeAccount.accountName || "Google Account"}
              </span>
            </div>
            <div>
              <span className="text-[#777D87] block mb-1">CONNECTED EMAIL</span>
              <span className="text-[#D6B77A]">{activeAccount.email}</span>
            </div>
            <div>
              <span className="text-[#777D87] block mb-1">CONNECTED AT</span>
              <span className="text-[#B2B4BA]">
                {new Date(activeAccount.connectedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-lg bg-[#0E1014] border border-[#252A32] space-y-2 text-xs">
            <div className="flex items-center gap-2 text-[#F06419] font-mono font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>OAuth 2.0 Security &amp; Credentials</span>
            </div>
            <p className="text-[#B2B4BA] leading-relaxed">
              To connect live Google Calendar data, provide your Google Cloud OAuth Client credentials:
            </p>
            <div className="font-mono text-[11px] p-2.5 rounded bg-[#08090B] border border-[#252A32] text-[#D6B77A] space-y-1">
              <div>GOOGLE_CLIENT_ID=&quot;your-client-id.apps.googleusercontent.com&quot;</div>
              <div>GOOGLE_CLIENT_SECRET=&quot;your-client-secret&quot;</div>
              <div>GOOGLE_CALENDAR_API_KEY=&quot;AIzaSy...&quot; (active)</div>
            </div>
            <p className="text-[#777D87] text-[11px]">
              Tokens are encrypted at rest with AES-256-GCM authenticated encryption.
            </p>
          </div>
        )}
      </div>

      {/* Synchronized Calendars Selection */}
      <div className="p-6 rounded-xl bg-[#12151A] border border-[#252A32] space-y-4">
        <div className="flex items-center justify-between border-b border-[#252A32] pb-4">
          <div>
            <h3 className="text-sm font-heading font-bold text-[#F5F3EE]">
              Authorized Studio Calendars
            </h3>
            <p className="text-xs text-[#B2B4BA]">
              Choose which calendars are synchronized and displayed in the studio agenda.
            </p>
          </div>

          <button
            type="button"
            onClick={onRefresh}
            className="p-1.5 rounded-lg bg-[#1E232B] text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
            title="Refresh calendars list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {calendars.length === 0 ? (
          <div className="py-8 text-center text-xs font-mono text-[#777D87]">
            No authorized calendars found. Connect an account to retrieve calendars.
          </div>
        ) : (
          <div className="divide-y divide-[#252A32] rounded-lg border border-[#252A32] overflow-hidden bg-[#0E1014]">
            {calendars.map((cal) => (
              <div
                key={cal.id}
                className="p-3.5 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: cal.backgroundColor || "#D6B77A" }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[#F5F3EE] font-semibold truncate">
                        {cal.summary}
                      </span>
                      {cal.isPrimary && (
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#D6B77A]/15 text-[#D6B77A] border border-[#D6B77A]/40">
                          PRIMARY
                        </span>
                      )}
                    </div>
                    {cal.description && (
                      <p className="text-[11px] text-[#777D87] truncate">
                        {cal.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cal.isSelected}
                      disabled={togglingId === cal.id}
                      onChange={() => handleToggle(cal.id, cal.isSelected)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-[#252A32] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#D6B77A]"></div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Cal.com Cross-Integration Notice */}
      <div className="p-5 rounded-xl bg-[#12151A] border border-[#252A32] flex items-start gap-4">
        <div className="w-8 h-8 rounded-lg bg-[#F06419]/15 border border-[#F06419]/30 flex items-center justify-center text-[#F06419] shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="space-y-1 flex-1 text-xs">
          <h4 className="font-heading font-bold text-[#F5F3EE]">
            Cal.com Client Booking Bridge
          </h4>
          <p className="text-[#B2B4BA] leading-relaxed">
            Client discovery calls booked on the website via Cal.com are automatically populated into your primary Google Calendar and tagged under &ldquo;Discovery Call&rdquo; in the Ediyrex scheduling view.
          </p>
        </div>
      </div>
    </div>
  );
}
