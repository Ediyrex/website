"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Mail,
  Send,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Filter,
} from "lucide-react";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { useDebouncedLoading } from "@/hooks/ui-speed";
import { startProgressBar, finishProgressBar } from "@/components/ui/OptimisticProgressBar";

interface OutboxStats {
  total: number;
  pending: number;
  processing: number;
  sent: number;
  failed: number;
  deadLetter: number;
}

interface OutboxJob {
  id: string;
  eventType: string;
  entityType: string;
  entityId: string;
  dedupeKey: string | null;
  payload: Record<string, any>;
  status: "pending" | "processing" | "sent" | "failed" | "dead_letter";
  attemptCount: number;
  maxAttempts: number;
  nextRetryAt: string;
  lastError: string | null;
  createdAt: string;
  deliveredAt: string | null;
}

export function AdminNotificationsClient() {
  const [stats, setStats] = useState<OutboxStats>({
    total: 0,
    pending: 0,
    processing: 0,
    sent: 0,
    failed: 0,
    deadLetter: 0,
  });
  const [jobs, setJobs] = useState<OutboxJob[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [testEmailAddress, setTestEmailAddress] = useState<string>("");
  const [isSendingTest, setIsSendingTest] = useState<boolean>(false);
  const [testMessageResult, setTestMessageResult] = useState<string | null>(null);
  const [isProcessingQueue, setIsProcessingQueue] = useState<boolean>(false);
  const [retryingId, setRetryingId] = useState<string | null>(null);

  // Suppress loader flashes under 300ms ("no loader under 300ms")
  const showSkeleton = useDebouncedLoading(isLoading, { delayMs: 300 });

  const fetchOutboxData = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      params.set("page", String(page));
      params.set("limit", String(limit));

      const res = await fetch(`/api/v1/admin/notifications?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setStats(json.data.stats || stats);
          setJobs(json.data.jobs || []);
          if (json.data.pagination) {
            setPagination(json.data.pagination);
          }
        }
      }
    } catch (err) {
      console.warn("Failed to load notifications outbox data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedStatus, page, limit]);

  useEffect(() => {
    fetchOutboxData();
  }, [fetchOutboxData]);

  const handleProcessQueueNow = async () => {
    setIsProcessingQueue(true);
    try {
      const res = await fetch("/api/v1/admin/notifications", { method: "POST" });
      if (res.ok) {
        await fetchOutboxData();
      }
    } catch (err) {
      console.error("Queue process error:", err);
    } finally {
      setIsProcessingQueue(false);
    }
  };

  const handleSendTestEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testEmailAddress.trim()) return;

    setIsSendingTest(true);
    setTestMessageResult(null);

    try {
      const res = await fetch("/api/v1/admin/notifications/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientEmail: testEmailAddress.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setTestMessageResult(
          `Test email dispatched successfully (${data.data?.isMocked ? "Simulated test mode" : `Message ID: ${data.data?.messageId}`})`
        );
        fetchOutboxData();
      } else {
        setTestMessageResult(
          `Delivery failed: ${data.error || "Check Resend credentials"}`
        );
      }
    } catch (err) {
      setTestMessageResult(
        `Error: ${err instanceof Error ? err.message : "Request failed"}`
      );
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleRetryJob = async (jobId: string) => {
    setRetryingId(jobId);
    startProgressBar();

    // Optimistic UI: Snapshot current state for instantaneous UI transition
    const prevJobs = [...jobs];
    const prevStats = { ...stats };

    // Update job status immediately in client state
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? { ...j, status: "pending", lastError: null, attemptCount: 0 }
          : j
      )
    );

    // Optimistically update stat pill counts
    setStats((prev) => ({
      ...prev,
      failed: Math.max(0, prev.failed - 1),
      deadLetter: Math.max(0, prev.deadLetter - (prevJobs.find((j) => j.id === jobId)?.status === "dead_letter" ? 1 : 0)),
      pending: prev.pending + 1,
    }));

    try {
      const res = await fetch("/api/v1/admin/notifications/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (res.ok) {
        await fetchOutboxData();
      } else {
        // Rollback on server error
        setJobs(prevJobs);
        setStats(prevStats);
      }
    } catch (err) {
      console.error("Failed to retry job:", err);
      // Rollback on network failure
      setJobs(prevJobs);
      setStats(prevStats);
    } finally {
      finishProgressBar();
      setRetryingId(null);
    }
  };

  const getStatusBadge = (status: OutboxJob["status"]) => {
    switch (status) {
      case "sent":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 className="w-3 h-3" />
            Sent
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock className="w-3 h-3" />
            Pending
          </span>
        );
      case "processing":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Processing
          </span>
        );
      case "failed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <AlertTriangle className="w-3 h-3" />
            Retrying
          </span>
        );
      case "dead_letter":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle className="w-3 h-3" />
            Dead Letter
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-[#252A32]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono tracking-wider bg-[#D6B77A]/10 text-[#D6B77A] border border-[#D6B77A]/20 uppercase">
              Resend Transactional Infrastructure
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F5F3EE]">
            Email &amp; Notification Outbox
          </h1>
          <p className="text-sm text-[#B2B4BA] mt-1">
            Centralized transactional email delivery, outbox worker status, and webhook telemetry.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleProcessQueueNow}
            disabled={isProcessingQueue}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-mono font-medium bg-[#12151A] hover:bg-[#1A1F27] text-[#F5F3EE] border border-[#252A32] transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isProcessingQueue ? "animate-spin" : ""}`}
            />
            {isProcessingQueue ? "Processing..." : "Flush Outbox"}
          </button>

          <button
            onClick={() => fetchOutboxData()}
            className="p-2 rounded-lg text-[#B2B4BA] hover:text-[#F5F3EE] bg-[#12151A] hover:bg-[#1A1F27] border border-[#252A32] transition-colors"
            title="Refresh outbox"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-[#12151A] border border-[#252A32] rounded-xl p-4">
          <div className="text-xs font-mono text-[#777D87] uppercase tracking-wider mb-1">
            Total Dispatched
          </div>
          <div className="text-2xl font-bold text-[#F5F3EE]">{stats.total}</div>
        </div>

        <div className="bg-[#12151A] border border-[#252A32] rounded-xl p-4">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            Delivered
          </div>
          <div className="text-2xl font-bold text-emerald-400">{stats.sent}</div>
        </div>

        <div className="bg-[#12151A] border border-[#252A32] rounded-xl p-4">
          <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-1">
            In Queue / Pending
          </div>
          <div className="text-2xl font-bold text-amber-400">
            {stats.pending + stats.processing}
          </div>
        </div>

        <div className="bg-[#12151A] border border-[#252A32] rounded-xl p-4">
          <div className="text-xs font-mono text-orange-400 uppercase tracking-wider mb-1">
            Retrying
          </div>
          <div className="text-2xl font-bold text-orange-400">{stats.failed}</div>
        </div>

        <div className="bg-[#12151A] border border-[#252A32] rounded-xl p-4">
          <div className="text-xs font-mono text-rose-400 uppercase tracking-wider mb-1">
            Dead Letter
          </div>
          <div className="text-2xl font-bold text-rose-400">{stats.deadLetter}</div>
        </div>
      </div>

      {/* Test Email Dispatch Panel */}
      <div className="bg-[#12151A] border border-[#252A32] rounded-xl p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold text-[#F5F3EE] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D6B77A]" />
              Resend Delivery Verification
            </h2>
            <p className="text-xs text-[#B2B4BA] mt-0.5">
              Send a test dark editorial notification to verify SPF/DKIM authentication and inbox routing.
            </p>
          </div>

          <form
            onSubmit={handleSendTestEmail}
            className="flex items-center gap-2 w-full md:w-auto"
          >
            <input
              type="email"
              value={testEmailAddress}
              onChange={(e) => setTestEmailAddress(e.target.value)}
              placeholder="target@example.com"
              required
              className="bg-[#08090B] border border-[#252A32] rounded-lg px-3 py-1.5 text-xs text-[#F5F3EE] placeholder-[#777D87] focus:outline-none focus:border-[#D6B77A] w-full md:w-64 font-mono"
            />
            <button
              type="submit"
              disabled={isSendingTest}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-medium bg-[#D6B77A] text-[#08090B] hover:bg-[#E2C790] transition-colors disabled:opacity-50 whitespace-nowrap"
            >
              <Send className="w-3 h-3" />
              {isSendingTest ? "Sending..." : "Test Send"}
            </button>
          </form>
        </div>

        {testMessageResult && (
          <div
            className={`mt-3 p-3 rounded-lg text-xs font-mono ${
              testMessageResult.startsWith("Test email dispatched")
                ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
            }`}
          >
            {testMessageResult}
          </div>
        )}
      </div>

      {/* Outbox Table Section */}
      <div className="bg-[#12151A] border border-[#252A32] rounded-xl overflow-hidden">
        {/* Table Filter Bar */}
        <div className="p-4 border-b border-[#252A32] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            {["all", "pending", "sent", "failed", "dead_letter"].map((statusKey) => (
              <button
                key={statusKey}
                onClick={() => {
                  setSelectedStatus(statusKey);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors capitalize ${
                  selectedStatus === statusKey
                    ? "bg-[#D6B77A] text-[#08090B] font-semibold"
                    : "text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#1A1F27]"
                }`}
              >
                {statusKey === "dead_letter" ? "Dead Letter" : statusKey}
              </button>
            ))}
          </div>

          <span className="text-xs font-mono text-[#777D87]">
            Showing {jobs.length} jobs
          </span>
        </div>

        {/* Table Content */}
        {showSkeleton ? (
          <div className="p-4">
            <SkeletonTable rows={5} columns={6} />
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-[#777D87]">
            No notification jobs found in this view.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#252A32] bg-[#0E1014] text-[11px] font-mono text-[#777D87] uppercase tracking-wider">
                  <th className="py-3 px-4">Event Type / ID</th>
                  <th className="py-3 px-4">Recipient / Subject</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Attempts</th>
                  <th className="py-3 px-4">Created</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#252A32] text-xs">
                {jobs.map((job) => {
                  const recipient =
                    job.payload?.recipientEmail ||
                    job.payload?.email ||
                    "Studio Team";
                  const refCode = job.payload?.referenceCode;

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-[#161A20] transition-colors"
                    >
                      <td className="py-3 px-4 font-mono text-[#F5F3EE]">
                        <div className="font-semibold text-xs text-[#D6B77A]">
                          {job.eventType}
                        </div>
                        <div className="text-[10px] text-[#777D87]">
                          {job.id.slice(0, 8)}... &middot; entity: {job.entityType}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-[#B2B4BA]">
                        <div className="text-[#F5F3EE] font-medium">
                          {recipient}
                        </div>
                        {refCode && (
                          <div className="font-mono text-[10px] text-[#777D87]">
                            Ref: {refCode}
                          </div>
                        )}
                        {job.lastError && (
                          <div className="text-[11px] text-rose-400 mt-0.5 line-clamp-1">
                            {job.lastError}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">{getStatusBadge(job.status)}</td>

                      <td className="py-3 px-4 font-mono text-[#777D87]">
                        {job.attemptCount} / {job.maxAttempts}
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-[#777D87] whitespace-nowrap">
                        {new Date(job.createdAt).toLocaleString()}
                      </td>

                      <td className="py-3 px-4 text-right">
                        {(job.status === "failed" ||
                          job.status === "dead_letter") && (
                          <button
                            onClick={() => handleRetryJob(job.id)}
                            disabled={retryingId === job.id}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-colors disabled:opacity-50"
                          >
                            <RefreshCw
                              className={`w-3 h-3 ${retryingId === job.id ? "animate-spin" : ""}`}
                            />
                            Retry
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-[#252A32] flex flex-wrap items-center justify-between gap-4 bg-[#0E1014] text-xs font-mono text-[#777D87]">
          <div className="flex items-center gap-2">
            <span>Rows:</span>
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setPage(1);
              }}
              className="bg-[#12151A] border border-[#252A32] rounded px-2 py-1 text-xs text-[#F5F3EE] focus:outline-none focus:border-[#D6B77A]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span className="ml-2">
              Showing {jobs.length > 0 ? (page - 1) * limit + 1 : 0} to{" "}
              {Math.min(page * limit, pagination.total)} of {pagination.total} jobs
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrevPage}
              className="px-3 py-1 rounded border border-[#252A32] bg-[#12151A] text-[#F5F3EE] hover:bg-[#1A1F27] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Previous
            </button>
            <span className="px-2">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              type="button"
              onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
              disabled={!pagination.hasNextPage}
              className="px-3 py-1 rounded border border-[#252A32] bg-[#12151A] text-[#F5F3EE] hover:bg-[#1A1F27] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
