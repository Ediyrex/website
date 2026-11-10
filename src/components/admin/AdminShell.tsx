"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Layers,
  BookOpen,
  Image as ImageIcon,
  SearchCheck,
  Inbox,
  CheckSquare,
  Settings,
  Users,
  Activity,
  Search,
  Bell,
  HelpCircle,
  ChevronDown,
  LogOut,
  ExternalLink,
  X,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "./AdminContext";

interface NavGroup {
  title: string;
  items: {
    href: string;
    label: string;
    icon: React.ElementType;
    exact?: boolean;
    badge?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Workspace",
    items: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    title: "Content Management (CMS)",
    items: [
      { href: "/admin/pages", label: "Pages", icon: FileText },
      { href: "/admin/projects", label: "Portfolio", icon: FolderKanban },
      { href: "/admin/services", label: "Services", icon: Layers },
      { href: "/admin/blog", label: "Blog & Insights", icon: BookOpen },
      { href: "/admin/media", label: "Media Library", icon: ImageIcon },
      { href: "/admin/seo", label: "SEO & Metadata", icon: SearchCheck },
    ],
  },
  {
    title: "Business Management",
    items: [
      { href: "/admin/inquiries", label: "CRM / Inquiries", icon: Inbox, badge: "Mini" },
      { href: "/admin/tasks", label: "Projects & Tasks", icon: CheckSquare, badge: "Mini" },
    ],
  },
  {
    title: "System",
    items: [
      { href: "/admin/settings", label: "Website Settings", icon: Settings },
      { href: "/admin/team", label: "Team & Access", icon: Users },
      { href: "/admin/activity", label: "Activity Log", icon: Activity },
    ],
  },
];

interface SearchResults {
  projects: { id: string; title: string; slug: string; status: string }[];
  services: { id: string; title: string; slug: string; status: string }[];
  enquiries: {
    id: string;
    referenceCode: string;
    contactName: string;
    status: string;
  }[];
  blogPosts: { id: string; title: string; slug: string; status: string }[];
  tasks: { id: string; title: string; category: string; completed: boolean }[];
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAdminUser();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [searching, setSearching] = useState(false);

  const initials = user.displayName
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        setSearchOpen(false);
        setUserMenuOpen(false);
        setHelpOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (!searchOpen || searchQuery.trim().length < 2) {
      return;
    }
    let ignore = false;
    const timer = setTimeout(() => {
      setSearching(true);
      fetch(`/api/v1/admin/search?q=${encodeURIComponent(searchQuery.trim())}`)
        .then((res) => res.json())
        .then((json) => {
          if (!ignore && json?.data) {
            setSearchResults(json.data);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!ignore) setSearching(false);
        });
    }, 180);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [searchOpen, searchQuery]);

  const handleLogout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-[#08090B] text-[#F5F3EE]">
      {/* Desktop Sidebar + Mobile Drawer */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-[#0B0D10] border-r border-[#1C2027] flex flex-col justify-between transition-transform duration-200 lg:static lg:translate-x-0 shrink-0",
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Brand Header */}
          <div className="h-16 px-4 border-b border-[#1C2027] flex items-center justify-between shrink-0">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1A160E] border border-[#D6B77A]/40 flex items-center justify-center text-[#D6B77A]">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M5 4h14v3.2H8.6v3.2h8.8v3.1H8.6v3.3H19V20H5V4z" />
                </svg>
              </div>
              <span className="font-heading font-bold text-sm tracking-tight text-[#F5F3EE]">
                Ediyrex Studio
              </span>
              <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#1B1710] text-[#D6B77A] border border-[#D6B77A]/30">
                ADMIN v1
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden p-1.5 text-[#8D939E] hover:text-white cursor-pointer"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Groups */}
          <nav
            aria-label="Admin CMS Navigation"
            className="flex-1 overflow-y-auto px-3 py-4 space-y-5"
          >
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1">
                <div className="px-3 text-[10px] font-mono uppercase tracking-[0.14em] text-[#5E6570] mb-1.5">
                  {group.title}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.exact
                    ? pathname === "/admin" || pathname === "/admin/dashboard"
                    : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors",
                        isActive
                          ? "bg-[#D6B77A]/12 text-[#F5E7C8] border border-[#D6B77A]/25"
                          : "text-[#9CA3AF] hover:text-[#F5F3EE] hover:bg-[#13161C] border border-transparent"
                      )}
                    >
                      <span className="flex items-center gap-2.5 min-w-0">
                        <Icon
                          className={cn(
                            "w-4 h-4 shrink-0",
                            isActive ? "text-[#D6B77A]" : "text-[#6D7480]"
                          )}
                        />
                        <span className="truncate">{item.label}</span>
                      </span>
                      {item.badge && (
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1B1710] text-[#D6B77A] border border-[#D6B77A]/25">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Studio Card */}
        <div className="p-3 border-t border-[#1C2027]">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-[#111419] border border-[#1E222A] hover:border-[#D6B77A]/40 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#2B2316] to-[#12151A] border border-[#D6B77A]/30 flex items-center justify-center text-[#D6B77A] font-heading font-bold text-xs shrink-0">
                E
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-[#F5F3EE] truncate">
                  Ediyrex Studio
                </div>
                <div className="text-[10px] text-[#777D87] truncate">
                  Creative · Digital · AI
                </div>
              </div>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-[#777D87] shrink-0" />
          </Link>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
        />
      )}

      {/* Main Column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="h-16 px-4 sm:px-8 border-b border-[#1C2027] bg-[#0B0D10]/90 backdrop-blur-xs flex items-center justify-between gap-4 sticky top-0 z-20">
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
              className="lg:hidden p-2 rounded-lg bg-[#12151A] border border-[#1E222A] text-[#B2B4BA] cursor-pointer"
            >
              <Menu className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex-1 h-9 px-3.5 rounded-lg bg-[#111419] border border-[#1E222A] hover:border-[#2C323D] flex items-center justify-between gap-2 text-xs text-[#6D7480] transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-2 truncate">
                <Search className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Search projects, services, inquiries, posts...
                </span>
              </span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#181C23] border border-[#252A32] font-mono text-[10px] text-[#9CA3AF]">
                ⌘ K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 relative">
            <Link
              href="/admin/inquiries"
              aria-label="View recent inquiries"
              className="p-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#9CA3AF] hover:text-[#F5F3EE] hover:border-[#2C323D] transition-colors"
            >
              <Bell className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={() => {
                setHelpOpen((prev) => !prev);
                setUserMenuOpen(false);
              }}
              aria-label="CMS help"
              className="p-2 rounded-lg bg-[#111419] border border-[#1E222A] text-[#9CA3AF] hover:text-[#F5F3EE] hover:border-[#2C323D] transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => {
                setUserMenuOpen((prev) => !prev);
                setHelpOpen(false);
              }}
              className="flex items-center gap-2.5 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-[#111419] border border-transparent hover:border-[#1E222A] transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#D6B77A] text-[#08090B] font-heading font-bold text-xs flex items-center justify-center shrink-0">
                {initials || "AD"}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-semibold text-[#F5F3EE]">
                  {user.displayName}
                </div>
                <div className="text-[10px] text-[#777D87] capitalize">
                  {user.roles[0] === "admin" ? "Administrator" : user.roles[0] || "Staff"}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#777D87] hidden sm:block" />
            </button>

            {helpOpen && (
              <div className="absolute right-0 top-12 w-72 p-4 rounded-xl bg-[#12151A] border border-[#252A32] shadow-2xl text-xs space-y-2 z-50">
                <div className="font-heading font-semibold text-[#F5F3EE]">
                  Ediyrex CMS v1 Shortcuts
                </div>
                <p className="text-[#8D939E] leading-relaxed">
                  Press <code className="text-[#D6B77A]">Ctrl/⌘ + K</code> anytime to search across Projects, Services, Blog posts, Inquiries, and Tasks.
                </p>
                <div className="pt-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setHelpOpen(false)}
                    className="text-[#D6B77A] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {userMenuOpen && (
              <div className="absolute right-0 top-12 w-56 py-1.5 rounded-xl bg-[#12151A] border border-[#252A32] shadow-2xl text-xs z-50">
                <div className="px-3.5 py-2 border-b border-[#252A32]">
                  <div className="font-medium text-[#F5F3EE] truncate">
                    {user.displayName}
                  </div>
                  <div className="text-[11px] text-[#777D87] truncate">
                    {user.email}
                  </div>
                </div>
                <Link
                  href="/admin/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-3.5 py-2 text-[#B2B4BA] hover:bg-[#191D23] hover:text-white"
                >
                  Website Settings
                </Link>
                <Link
                  href="/admin/activity"
                  onClick={() => setUserMenuOpen(false)}
                  className="block px-3.5 py-2 text-[#B2B4BA] hover:bg-[#191D23] hover:text-white"
                >
                  Activity Log
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-3.5 py-2 text-[#F28B82] hover:bg-[#2A1414] flex items-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-5 sm:p-7 lg:p-8 max-w-[1440px] w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Global Command Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#111419] border border-[#252A32] shadow-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#252A32] flex items-center gap-3">
              <Search className="w-4 h-4 text-[#D6B77A]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type at least 2 characters to search CMS..."
                className="flex-1 bg-transparent text-sm text-[#F5F3EE] placeholder-[#6D7480] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-[#777D87] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-96 overflow-y-auto p-3 space-y-3 text-xs">
              {searching ? (
                <div className="p-6 text-center font-mono text-[#777D87]">
                  Searching CMS...
                </div>
              ) : searchQuery.trim().length < 2 ? (
                <div className="p-6 text-center text-[#777D87]">
                  Search across Portfolio Projects, Services, Blog Posts, Inquiries, and Studio Tasks.
                </div>
              ) : !searchResults ||
                (searchResults.projects.length === 0 &&
                  searchResults.services.length === 0 &&
                  searchResults.enquiries.length === 0 &&
                  searchResults.blogPosts.length === 0 &&
                  searchResults.tasks.length === 0) ? (
                <div className="p-6 text-center text-[#777D87]">
                  No matching records found.
                </div>
              ) : (
                <>
                  {searchResults.projects.map((p) => (
                    <Link
                      key={p.id}
                      href={`/admin/projects?edit=${p.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#191D23]"
                    >
                      <span className="text-[#F5F3EE]">{p.title}</span>
                      <span className="font-mono text-[10px] text-[#D6B77A]">
                        Project · {p.status}
                      </span>
                    </Link>
                  ))}
                  {searchResults.services.map((s) => (
                    <Link
                      key={s.id}
                      href={`/admin/services?edit=${s.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#191D23]"
                    >
                      <span className="text-[#F5F3EE]">{s.title}</span>
                      <span className="font-mono text-[10px] text-[#7BA9F5]">
                        Service · {s.status}
                      </span>
                    </Link>
                  ))}
                  {searchResults.blogPosts.map((b) => (
                    <Link
                      key={b.id}
                      href={`/admin/blog?edit=${b.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#191D23]"
                    >
                      <span className="text-[#F5F3EE]">{b.title}</span>
                      <span className="font-mono text-[10px] text-[#B5A0F5]">
                        Blog · {b.status}
                      </span>
                    </Link>
                  ))}
                  {searchResults.enquiries.map((e) => (
                    <Link
                      key={e.id}
                      href={`/admin/inquiries?id=${e.id}`}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#191D23]"
                    >
                      <span className="text-[#F5F3EE]">
                        {e.contactName} ({e.referenceCode})
                      </span>
                      <span className="font-mono text-[10px] text-[#7CD69F]">
                        Inquiry · {e.status}
                      </span>
                    </Link>
                  ))}
                  {searchResults.tasks.map((t) => (
                    <Link
                      key={t.id}
                      href="/admin/tasks"
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-[#191D23]"
                    >
                      <span className="text-[#F5F3EE]">{t.title}</span>
                      <span className="font-mono text-[10px] text-[#8D939E]">
                        Task · {t.completed ? "Done" : "Open"}
                      </span>
                    </Link>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
