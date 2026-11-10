"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Layers,
  Inbox,
  Image as ImageIcon,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "./AdminContext";

const NAV_ITEMS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/projects", label: "Projects", icon: Briefcase, exact: false },
  { href: "/admin/services", label: "Services", icon: Layers, exact: false },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox, exact: false },
  { href: "/admin/media", label: "Media Library", icon: ImageIcon, exact: false },
  { href: "/admin/settings", label: "Settings", icon: Settings, exact: false },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAdminUser();

  const handleLogout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#08090B] text-[#F5F3EE]">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0D0F12] border-b md:border-b-0 md:border-r border-[#252A32] p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-7">
          <div className="flex items-center justify-between">
            <Link
              href="/admin"
              className="flex items-center gap-2 font-heading font-bold text-xl text-[#F5F3EE]"
            >
              <span>Ediyrex</span>
              <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#12151A] text-[#D6B77A] border border-[#252A32]">
                CMS v1
              </span>
            </Link>
          </div>

          <nav
            aria-label="Admin CMS Navigation"
            className="flex md:flex-col gap-1.5 overflow-x-auto pb-1 md:pb-0"
          >
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.exact
                ? pathname === "/admin" || pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    isActive
                      ? "bg-[#191D23] text-[#F5F3EE] border border-[#3A414B]"
                      : "text-[#B2B4BA] hover:text-[#F5F3EE] hover:bg-[#12151A] border border-transparent"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 shrink-0",
                      isActive ? "text-[#D6B77A]" : "text-[#777D87]"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden md:block pt-6 border-t border-[#252A32] space-y-4">
          <div className="text-xs space-y-1">
            <div className="font-medium text-[#F5F3EE] truncate">
              {user.displayName}
            </div>
            <div className="text-[#777D87] truncate">{user.email}</div>
            <div className="inline-block font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-[#12151A] text-[#D6B77A] border border-[#252A32]">
              {user.roles.join(", ")}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 text-xs text-[#B2B4BA] hover:text-[#F5F3EE] py-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Public Site</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 text-xs text-[#F28B82] hover:text-white py-1.5 cursor-pointer text-left"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-5 sm:p-8 lg:p-10 space-y-8">
        {/* Mobile top quick utility bar */}
        <div className="flex md:hidden items-center justify-between gap-3 pb-4 border-b border-[#252A32]">
          <div className="text-xs">
            <span className="font-medium text-[#F5F3EE]">{user.displayName}</span>
            <span className="ml-2 font-mono text-[10px] uppercase text-[#D6B77A]">
              {user.roles[0] || "staff"}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="text-xs text-[#B2B4BA] hover:text-[#F5F3EE]"
            >
              Public Site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs text-[#F28B82] cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>

        {children}
      </main>
    </div>
  );
}

