"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Layers,
  Inbox,
  Image as ImageIcon,
  Plus,
  RefreshCw,
  ArrowRight,
  Settings,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useAdminUser } from "./AdminContext";

interface OverviewResponse {
  stats: {
    totalProjects: number;
    publishedProjects: number;
    draftProjects: number;
    totalServices: number;
    publishedServices: number;
    draftServices: number;
    totalEnquiries: number;
    newEnquiries: number;
    totalMediaAssets: number;
  };
  recentEnquiries: {
    id: string;
    referenceCode: string;
    contactName: string;
    emailNormalized: string;
    projectType: string;
    status: string;
    submittedAt: string;
  }[];
  recentlyUpdated: {
    id: string;
    title: string;
    slug: string;
    status: string;
    updatedAt: string;
    kind: "project" | "service";
  }[];
}

export function AdminOverviewClient() {
  const router = useRouter();
  const { user, canEdit } = useAdminUser();
  const [data, setData] = useState<OverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOverviewData = useCallback(async () => {
    const res = await fetch("/api/v1/admin/overview");
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || "Unable to load CMS overview.");
    }
    return json.data as OverviewResponse;
  }, [router]);

  const loadOverview = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await fetchOverviewData();
      if (result) setData(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Network error loading dashboard overview."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchOverviewData()
      .then((result) => {
        if (!ignore && result) setData(result);
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Network error loading dashboard overview."
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fetchOverviewData]);

  const stats = data?.stats;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
            CMS Overview
          </h1>
          <p className="text-sm text-[#B2B4BA]">
            Welcome back, {user.displayName}. Manage projects, services,
            inquiries, media, and global studio settings.
          </p>
        </div>

        <button
          type="button"
          onClick={loadOverview}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#B2B4BA] hover:text-white hover:border-[#3A414B] transition-colors cursor-pointer"
        >
          <RefreshCw className={loading ? "w-3.5 h-3.5 animate-spin" : "w-3.5 h-3.5"} />
          <span>Refresh</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-[#2A1414] border border-[#F28B82]/40 text-xs text-[#F28B82]">
          {error}
        </div>
      )}

      {/* Actionable Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/projects"
          className="p-5 rounded-xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#777D87]">
            <span>PROJECTS</span>
            <Briefcase className="w-4 h-4 text-[#D6B77A]" />
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats?.totalProjects ?? 0}
          </div>
          <div className="text-xs text-[#B2B4BA]">
            {stats?.publishedProjects ?? 0} published · {stats?.draftProjects ?? 0} draft
          </div>
        </Link>

        <Link
          href="/admin/services"
          className="p-5 rounded-xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#777D87]">
            <span>SERVICES</span>
            <Layers className="w-4 h-4 text-[#7BA9F5]" />
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats?.totalServices ?? 0}
          </div>
          <div className="text-xs text-[#B2B4BA]">
            {stats?.publishedServices ?? 0} published · {stats?.draftServices ?? 0} draft
          </div>
        </Link>

        <Link
          href="/admin/inquiries"
          className="p-5 rounded-xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#777D87]">
            <span>INQUIRIES</span>
            <Inbox className="w-4 h-4 text-[#7CD69F]" />
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats?.totalEnquiries ?? 0}
          </div>
          <div className="text-xs text-[#D6B77A]">
            {stats?.newEnquiries ?? 0} new awaiting review
          </div>
        </Link>

        <Link
          href="/admin/media"
          className="p-5 rounded-xl bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] transition-colors space-y-2"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#777D87]">
            <span>MEDIA ASSETS</span>
            <ImageIcon className="w-4 h-4 text-[#B5A0F5]" />
          </div>
          <div className="font-heading font-bold text-3xl text-[#F5F3EE]">
            {loading ? "—" : stats?.totalMediaAssets ?? 0}
          </div>
          <div className="text-xs text-[#B2B4BA]">Cloudinary / Studio assets</div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-3">
        {canEdit && (
          <>
            <Link
              href="/admin/projects?create=1"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Project</span>
            </Link>
            <Link
              href="/admin/services?create=1"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#191D23] border border-[#3A414B] text-[#F5F3EE] text-xs font-medium hover:bg-[#222730] transition-colors"
            >
              <Plus className="w-4 h-4 text-[#D6B77A]" />
              <span>New Service</span>
            </Link>
            <Link
              href="/admin/media"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-[#B2B4BA] text-xs font-medium hover:text-white hover:border-[#3A414B] transition-colors"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Upload Media</span>
            </Link>
          </>
        )}
        <Link
          href="/admin/settings"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#12151A] border border-[#252A32] text-[#B2B4BA] text-xs font-medium hover:text-white hover:border-[#3A414B] transition-colors"
        >
          <Settings className="w-4 h-4" />
          <span>Website Settings</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Inquiries */}
        <section className="rounded-xl bg-[#12151A] border border-[#252A32] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#252A32] flex items-center justify-between">
            <h2 className="font-heading font-semibold text-sm text-[#F5F3EE]">
              Recent Inquiries
            </h2>
            <Link
              href="/admin/inquiries"
              className="inline-flex items-center gap-1 text-xs text-[#D6B77A] hover:underline"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-[#252A32]">
            {loading ? (
              <div className="p-6 text-xs font-mono text-[#777D87]">
                Loading inquiries...
              </div>
            ) : !data?.recentEnquiries.length ? (
              <div className="p-6 text-xs text-[#777D87]">
                No inquiries submitted yet.
              </div>
            ) : (
              data.recentEnquiries.map((inq) => (
                <Link
                  key={inq.id}
                  href={`/admin/inquiries?id=${inq.id}`}
                  className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-[#161A20] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#F5F3EE] truncate">
                      {inq.contactName}{" "}
                      <span className="text-xs font-mono text-[#777D87]">
                        · {inq.referenceCode}
                      </span>
                    </div>
                    <div className="text-xs text-[#777D87] truncate">
                      {inq.emailNormalized} · {inq.projectType}
                    </div>
                  </div>
                  <Badge variant={inq.status === "new" ? "accent" : "default"}>
                    {inq.status}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* Recently Updated Content */}
        <section className="rounded-xl bg-[#12151A] border border-[#252A32] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#252A32] flex items-center justify-between">
            <h2 className="font-heading font-semibold text-sm text-[#F5F3EE]">
              Recently Updated Content
            </h2>
            <Link
              href="/admin/projects"
              className="inline-flex items-center gap-1 text-xs text-[#D6B77A] hover:underline"
            >
              <span>Manage catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-[#252A32]">
            {loading ? (
              <div className="p-6 text-xs font-mono text-[#777D87]">
                Loading content activity...
              </div>
            ) : !data?.recentlyUpdated.length ? (
              <div className="p-6 text-xs text-[#777D87]">
                No content updates recorded yet.
              </div>
            ) : (
              data.recentlyUpdated.map((item) => (
                <Link
                  key={`${item.kind}-${item.id}`}
                  href={
                    item.kind === "project"
                      ? `/admin/projects?edit=${item.id}`
                      : `/admin/services?edit=${item.id}`
                  }
                  className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-[#161A20] transition-colors"
                >
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-[#F5F3EE] truncate">
                      {item.title}
                    </div>
                    <div className="text-xs font-mono text-[#777D87] truncate">
                      {item.kind} · /{item.slug}
                    </div>
                  </div>
                  <Badge
                    variant={item.status === "published" ? "accent" : "default"}
                  >
                    {item.status}
                  </Badge>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
