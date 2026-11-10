"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  Briefcase,
  Layers,
  LogOut,
  Search,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  roles: string[];
}

interface AdminEnquiryRow {
  id: string;
  referenceCode: string;
  contactName: string;
  emailNormalized: string;
  companyName: string | null;
  projectType: string;
  budgetMin: number | null;
  budgetMax: number | null;
  budgetCurrency: string | null;
  expectedTimeline: string;
  status: string;
  wantsDiscoveryCall: boolean;
  submittedAt: string;
}

interface AdminServiceRow {
  id: string;
  title: string;
  slug: string;
  divisionName: string;
  status: string;
  isFeatured: boolean;
  displayOrder: number;
}

interface AdminProjectRow {
  id: string;
  title: string;
  slug: string;
  projectType: string;
  status: string;
  isFeatured: boolean;
  displayOrder: number;
}

type AdminSection = "overview" | "enquiries" | "projects" | "services";

const ENQUIRY_STATUSES = [
  "new",
  "reviewing",
  "qualified",
  "proposal_sent",
  "won",
  "lost",
  "archived",
];

export function AdminDashboardClient({ user }: { user: AdminUser }) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<AdminSection>("overview");
  const [enquiriesList, setEnquiriesList] = useState<AdminEnquiryRow[]>([]);
  const [projectsList, setProjectsList] = useState<AdminProjectRow[]>([]);
  const [servicesList, setServicesList] = useState<AdminServiceRow[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorBanner, setErrorBanner] = useState<string>("");

  const canEdit = user.roles.some((r) => r === "admin" || r === "editor");

  const fetchDashboardRecords = useCallback(
    async (status: string, query: string) => {
      const params = new URLSearchParams();
      if (status) params.set("status", status);
      if (query.trim()) params.set("q", query.trim());

      const [enqRes, projRes, svcRes] = await Promise.all([
        fetch(`/api/v1/admin/enquiries?${params.toString()}`),
        fetch("/api/v1/admin/projects"),
        fetch("/api/v1/admin/services"),
      ]);

      if (enqRes.status === 401) {
        router.push("/admin/login");
        return null;
      }

      const [enqJson, projJson, svcJson] = await Promise.all([
        enqRes.json(),
        projRes.json(),
        svcRes.json(),
      ]);

      return {
        enquiries: (enqJson.data || []) as AdminEnquiryRow[],
        projects: (projJson.data || []) as AdminProjectRow[],
        services: (svcJson.data || []) as AdminServiceRow[],
      };
    },
    [router]
  );

  const loadData = async () => {
    setIsLoading(true);
    setErrorBanner("");
    try {
      const result = await fetchDashboardRecords(statusFilter, searchQuery);
      if (result) {
        setEnquiriesList(result.enquiries);
        setProjectsList(result.projects);
        setServicesList(result.services);
      }
    } catch {
      setErrorBanner("Unable to load dashboard records.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    fetchDashboardRecords(statusFilter, searchQuery)
      .then((result) => {
        if (!ignore && result) {
          setEnquiriesList(result.enquiries);
          setProjectsList(result.projects);
          setServicesList(result.services);
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (!ignore) {
          setErrorBanner("Unable to load dashboard records.");
          setIsLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, [statusFilter, searchQuery, fetchDashboardRecords]);

  const handleStatusUpdate = async (enquiryId: string, nextStatus: string) => {
    try {
      const res = await fetch(`/api/v1/admin/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!res.ok) {
        const err = await res.json();
        setErrorBanner(err.message || "Failed to update enquiry status.");
        return;
      }

      setEnquiriesList((prev) =>
        prev.map((row) =>
          row.id === enquiryId ? { ...row, status: nextStatus } : row
        )
      );
    } catch {
      setErrorBanner("Network error updating enquiry status.");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const newEnquiriesCount = enquiriesList.filter(
    (e) => e.status === "new"
  ).length;
  const publishedProjectsCount = projectsList.filter(
    (p) => p.status === "published"
  ).length;
  const publishedServicesCount = servicesList.filter(
    (s) => s.status === "published"
  ).length;

  const navItems: {
    id: AdminSection;
    label: string;
    icon: React.ElementType;
  }[] = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "enquiries", label: "Enquiries", icon: Inbox },
    { id: "projects", label: "Projects", icon: Briefcase },
    { id: "services", label: "Services", icon: Layers },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#08090B] text-[#F5F3EE]">
      {/* Left Sidebar (240px on desktop) */}
      <aside className="w-full md:w-60 bg-[#0D0F12] border-b md:border-b-0 md:border-r border-[#252A32] p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-heading font-bold text-xl text-[#F5F3EE]"
            >
              <span>Ediyrex</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#12151A] text-[#D6B77A] border border-[#252A32]">
                Admin
              </span>
            </Link>
          </div>

          <nav aria-label="Admin Navigation" className="flex md:flex-col gap-1.5 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap",
                    isActive
                      ? "bg-[#191D23] text-[#F5F3EE] border border-[#3A414B]"
                      : "text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#12151A]"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-[#D6B77A]" : "text-[#777D87]"
                    )}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="hidden md:block pt-6 border-t border-[#252A32] space-y-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Public Site</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar (64px) */}
        <header className="h-16 bg-[#0D0F12] border-b border-[#252A32] px-6 flex items-center justify-between gap-4">
          <h1 className="font-heading font-semibold text-base sm:text-lg text-[#F5F3EE] capitalize">
            {activeSection}
          </h1>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-[#F5F3EE] font-medium">
                {user.displayName}
              </span>
              <Badge variant="accent">{user.roles.join(", ")}</Badge>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12151A] border border-[#252A32] hover:border-[#3A414B] text-xs text-[#B2B4BA] hover:text-[#F5F3EE] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Main Workspace */}
        <main className="flex-1 p-6 max-w-[1200px] w-full space-y-8">
          {errorBanner && (
            <div
              role="alert"
              className="p-3.5 rounded-xl bg-[#F07878]/10 border border-[#F07878]/30 text-[#F07878] text-xs"
            >
              {errorBanner}
            </div>
          )}

          {/* Overview Metrics (Real database-backed counts only) */}
          {activeSection === "overview" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-2">
                  <span className="text-xs font-mono uppercase text-[#777D87]">
                    New Enquiries
                  </span>
                  <div className="font-heading text-3xl font-bold text-[#D6B77A] tabular-nums">
                    {newEnquiriesCount}
                  </div>
                  <p className="text-xs text-[#B2B4BA]">
                    {enquiriesList.length} total recorded enquiries
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-2">
                  <span className="text-xs font-mono uppercase text-[#777D87]">
                    Published Projects
                  </span>
                  <div className="font-heading text-3xl font-bold text-[#F5F3EE] tabular-nums">
                    {publishedProjectsCount}
                  </div>
                  <p className="text-xs text-[#B2B4BA]">
                    {projectsList.length} total portfolio entries
                  </p>
                </div>

                <div className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-2">
                  <span className="text-xs font-mono uppercase text-[#777D87]">
                    Published Services
                  </span>
                  <div className="font-heading text-3xl font-bold text-[#F5F3EE] tabular-nums">
                    {publishedServicesCount}
                  </div>
                  <p className="text-xs text-[#B2B4BA]">
                    Across Media, Digital &amp; AI
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-[#12151A] border border-[#252A32] space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-heading font-semibold text-base text-[#F5F3EE]">
                    Recent Enquiries
                  </h2>
                  <button
                    type="button"
                    onClick={() => setActiveSection("enquiries")}
                    className="text-xs text-[#D6B77A] hover:text-[#E6CC99] cursor-pointer"
                  >
                    Manage all &rarr;
                  </button>
                </div>
                {enquiriesList.length === 0 ? (
                  <p className="text-sm text-[#777D87]">
                    No enquiries recorded yet.
                  </p>
                ) : (
                  <div className="divide-y divide-[#252A32]">
                    {enquiriesList.slice(0, 5).map((enq) => (
                      <div
                        key={enq.id}
                        className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm"
                      >
                        <div>
                          <span className="font-mono text-xs text-[#D6B77A] mr-2">
                            {enq.referenceCode}
                          </span>
                          <span className="font-medium text-[#F5F3EE]">
                            {enq.contactName}
                          </span>
                          <span className="text-[#777D87] text-xs ml-2">
                            ({enq.projectType})
                          </span>
                        </div>
                        <Badge variant="default">{enq.status}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Enquiries Module */}
          {activeSection === "enquiries" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-4 h-4 text-[#777D87] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search reference, name, email..."
                    className="w-full h-10 pl-9 pr-3 rounded-lg bg-[#12151A] border border-[#252A32] text-sm text-[#F5F3EE] placeholder-[#777D87] focus:outline-none focus:border-[#D6B77A]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter enquiries by status"
                    className="h-10 px-3 rounded-lg bg-[#12151A] border border-[#252A32] text-xs text-[#F5F3EE] cursor-pointer"
                  >
                    <option value="">All Statuses</option>
                    {ENQUIRY_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={loadData}
                    aria-label="Refresh enquiries"
                    className="h-10 px-3 rounded-lg bg-[#12151A] border border-[#252A32] text-[#B2B4BA] hover:text-[#F5F3EE] cursor-pointer"
                  >
                    <RefreshCw
                      className={cn("w-4 h-4", isLoading && "animate-spin")}
                    />
                  </button>
                </div>
              </div>

              <div className="rounded-2xl bg-[#12151A] border border-[#252A32] overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="border-b border-[#252A32] text-[11px] font-mono uppercase text-[#777D87]">
                    <tr>
                      <th className="py-3.5 px-4">Reference</th>
                      <th className="py-3.5 px-4">Contact</th>
                      <th className="py-3.5 px-4">Project Type</th>
                      <th className="py-3.5 px-4">Budget</th>
                      <th className="py-3.5 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#252A32]">
                    {enquiriesList.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-10 text-center text-[#777D87]"
                        >
                          No enquiries found matching the current filter.
                        </td>
                      </tr>
                    ) : (
                      enquiriesList.map((enq) => (
                        <tr key={enq.id} className="hover:bg-[#191D23]/50">
                          <td className="py-3.5 px-4 font-mono text-xs text-[#D6B77A]">
                            {enq.referenceCode}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-[#F5F3EE]">
                              {enq.contactName}
                            </div>
                            <div className="text-xs text-[#777D87]">
                              {enq.emailNormalized}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-[#B2B4BA]">
                            {enq.projectType}
                          </td>
                          <td className="py-3.5 px-4 font-mono text-xs text-[#B2B4BA]">
                            {enq.budgetCurrency
                              ? `${enq.budgetCurrency} ${enq.budgetMin ?? 0}${
                                  enq.budgetMax ? `–${enq.budgetMax}` : "+"
                                }`
                              : "Flexible"}
                          </td>
                          <td className="py-3.5 px-4">
                            <select
                              disabled={!canEdit}
                              value={enq.status}
                              onChange={(e) =>
                                handleStatusUpdate(enq.id, e.target.value)
                              }
                              aria-label={`Status for ${enq.referenceCode}`}
                              className="h-8 px-2 rounded bg-[#0D0F12] border border-[#3A414B] text-xs text-[#F5F3EE] disabled:opacity-60 cursor-pointer"
                            >
                              {ENQUIRY_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  {st}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Projects Module */}
          {activeSection === "projects" && (
            <div className="rounded-2xl bg-[#12151A] border border-[#252A32] overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-[#252A32] text-[11px] font-mono uppercase text-[#777D87]">
                  <tr>
                    <th className="py-3.5 px-4">Title</th>
                    <th className="py-3.5 px-4">Type</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4">Featured</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252A32]">
                  {projectsList.map((proj) => (
                    <tr key={proj.id} className="hover:bg-[#191D23]/50">
                      <td className="py-3.5 px-4 font-medium text-[#F5F3EE]">
                        {proj.title}
                      </td>
                      <td className="py-3.5 px-4">
                        <Badge
                          variant={
                            proj.projectType === "concept"
                              ? "concept"
                              : "featured"
                          }
                        >
                          {proj.projectType}
                        </Badge>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#B2B4BA]">
                        {proj.status}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#777D87]">
                        {proj.isFeatured ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Services Module */}
          {activeSection === "services" && (
            <div className="rounded-2xl bg-[#12151A] border border-[#252A32] overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="border-b border-[#252A32] text-[11px] font-mono uppercase text-[#777D87]">
                  <tr>
                    <th className="py-3.5 px-4">Order</th>
                    <th className="py-3.5 px-4">Service Title</th>
                    <th className="py-3.5 px-4">Division</th>
                    <th className="py-3.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252A32]">
                  {servicesList.map((svc) => (
                    <tr key={svc.id} className="hover:bg-[#191D23]/50">
                      <td className="py-3.5 px-4 font-mono text-xs text-[#777D87]">
                        {svc.displayOrder}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-[#F5F3EE]">
                        {svc.title}
                      </td>
                      <td className="py-3.5 px-4 text-[#B2B4BA]">
                        {svc.divisionName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs text-[#54C99A]">
                        {svc.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
