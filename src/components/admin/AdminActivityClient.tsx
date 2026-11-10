"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Activity, RefreshCw } from "lucide-react";

interface AuditRow {
  id: string;
  actorEmailSnapshot: string | null;
  action: string;
  entityType: string;
  entityId: string | null;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export function AdminActivityClient() {
  const router = useRouter();
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityFilter, setEntityFilter] = useState("");
  const [error, setError] = useState("");

  const fetchLogs = useCallback(async () => {
    const params = new URLSearchParams({ limit: "50" });
    if (entityFilter) params.set("entityType", entityFilter);

    const res = await fetch(`/api/v1/admin/activity?${params.toString()}`);
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Unable to load activity log.");
    return (json.data || []) as AuditRow[];
  }, [entityFilter, router]);

  const reload = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchLogs();
      if (data) setRows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchLogs()
      .then((data) => {
        if (!ignore && data) setRows(data);
      })
      .catch((err) => {
        if (!ignore) {
          setError(err instanceof Error ? err.message : "Network error.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fetchLogs]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
            Activity &amp; Audit Log
          </h1>
          <p className="text-sm text-[#8D939E]">
            Immutable server-recorded trail of authentication, publishing, media uploads, and settings changes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            className="h-9 px-3 rounded-lg bg-[#111419] border border-[#1E222A] text-xs font-mono text-[#F5F3EE]"
          >
            <option value="">All entities</option>
            <option value="project">Projects</option>
            <option value="service">Services</option>
            <option value="blog_post">Blog Posts</option>
            <option value="enquiry">Inquiries</option>
            <option value="media_asset">Media</option>
            <option value="site_settings">Settings</option>
            <option value="studio_task">Tasks</option>
            <option value="session">Auth / Sessions</option>
          </select>

          <button
            type="button"
            onClick={reload}
            className="inline-flex items-center gap-1.5 px-3 h-9 rounded-lg bg-[#111419] border border-[#1E222A] text-xs text-[#B2B4BA] hover:text-white cursor-pointer"
          >
            <RefreshCw className={loading ? "w-3.5 h-3.5 animate-spin" : "w-3.5 h-3.5"} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-[#2A1414] border border-[#F28B82]/40 text-xs text-[#F28B82]">
          {error}
        </div>
      )}

      <div className="rounded-xl bg-[#111419] border border-[#1E222A] divide-y divide-[#1E222A]">
        {loading ? (
          <div className="p-8 text-center text-xs font-mono text-[#777D87]">
            Loading audit trail...
          </div>
        ) : rows.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#777D87]">
            No activity log entries found.
          </div>
        ) : (
          rows.map((row) => (
            <div
              key={row.id}
              className="px-5 py-3.5 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#161920] border border-[#252A32] flex items-center justify-center text-[#D6B77A] shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[#F5F3EE]">
                    {row.action}
                  </div>
                  <div className="text-xs font-mono text-[#777D87]">
                    {row.entityType}
                    {row.actorEmailSnapshot
                      ? ` · ${row.actorEmailSnapshot}`
                      : ""}
                  </div>
                </div>
              </div>
              <div className="text-xs font-mono text-[#777D87]">
                {new Date(row.createdAt).toLocaleString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

