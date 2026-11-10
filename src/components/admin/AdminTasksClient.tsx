"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAdminUser } from "./AdminContext";
import { PmsDashboardView } from "./pms/PmsDashboardView";
import { PmsProjectWorkspace } from "./pms/PmsProjectWorkspace";
import { PmsSecondarySidebar } from "./pms/PmsSecondarySidebar";
import { PmsTaskDrawer } from "./pms/PmsTaskDrawer";
import {
  PmsReportsView,
  PmsTemplatesView,
  type CustomTemplateItem,
  type PmsReportsPayload,
} from "./pms/PmsExpansionViews";
import {
  NewProjectModal,
  NewTaskModal,
  PmsInboxView,
  PmsMyTasksView,
  PmsWorkloadView,
  type InboxNotificationRow,
  type MyTaskRow,
  type WorkloadMemberRow,
} from "./pms/PmsViews";
import type {
  PmsMainView,
  PmsProjectSummary,
  PmsProjectTab,
  PmsSavedFilterRow,
  PmsTemplateSummary,
  PmsWorkspacePayload,
  StudioUserSummary,
  TaskWorkflowStatus,
} from "./pms/pms-types";

export function AdminTasksClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, canEdit } = useAdminUser();
  const isAdmin = user.roles.includes("admin");

  const projectParam = searchParams.get("project");
  const viewParam = searchParams.get("view");
  const tabParam = (searchParams.get("tab") || "overview") as PmsProjectTab;
  const taskParam = searchParams.get("task");

  const activeView: PmsMainView = projectParam
    ? "project"
    : viewParam === "my-tasks" ||
      viewParam === "inbox" ||
      viewParam === "all" ||
      viewParam === "starred" ||
      viewParam === "workload" ||
      viewParam === "templates" ||
      viewParam === "reports"
    ? viewParam
    : "overview";

  const updateRoute = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      for (const [k, v] of Object.entries(updates)) {
        if (v === null) params.delete(k);
        else params.set(k, v);
      }
      const qs = params.toString();
      router.replace(qs ? `/admin/tasks?${qs}` : "/admin/tasks");
    },
    [router, searchParams]
  );

  // Dashboard / list state
  const [projects, setProjects] = useState<PmsProjectSummary[]>([]);
  const [sidebarProjects, setSidebarProjects] = useState<
    Array<{ id: string; title: string; status: string; isStarred: boolean }>
  >([]);
  const [kpis, setKpis] = useState({
    total: 0,
    inProgress: 0,
    completed: 0,
    onHold: 0,
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<
    Array<{
      id: string;
      projectId: string;
      projectTitle: string;
      title: string;
      priority: string;
      dueDate: string | null;
    }>
  >([]);
  const [templates, setTemplates] = useState<PmsTemplateSummary[]>([]);
  const [studioUsers, setStudioUsers] = useState<StudioUserSummary[]>([]);
  const [clientsList, setClientsList] = useState<
    Array<{
      id: string;
      name: string;
      companyName: string | null;
      serviceInterest: string;
    }>
  >([]);
  const [myPendingCount, setMyPendingCount] = useState(0);
  const [unreadInboxCount, setUnreadInboxCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Project workspace state
  const [workspace, setWorkspace] = useState<PmsWorkspacePayload | null>(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(false);

  // My Tasks state
  const [myTasksTab, setMyTasksTab] = useState<
    "all" | "today" | "upcoming" | "overdue" | "completed"
  >("all");
  const [myTasks, setMyTasks] = useState<MyTaskRow[]>([]);
  const [myTasksCounts, setMyTasksCounts] = useState({
    all: 0,
    today: 0,
    upcoming: 0,
    overdue: 0,
    completed: 0,
  });
  const [loadingMyTasks, setLoadingMyTasks] = useState(false);

  // Inbox state
  const [inboxTab, setInboxTab] = useState<"all" | "tasks" | "mentions">("all");
  const [notifications, setNotifications] = useState<InboxNotificationRow[]>(
    []
  );
  const [inboxUnreadCounts, setInboxUnreadCounts] = useState({
    all: 0,
    tasks: 0,
    mentions: 0,
  });
  const [loadingInbox, setLoadingInbox] = useState(false);

  // Workload state
  const [workloadMembers, setWorkloadMembers] = useState<WorkloadMemberRow[]>(
    []
  );
  const [loadingWorkload, setLoadingWorkload] = useState(false);

  // v1.5: Templates, Reports, Saved Filters
  const [savedFilters, setSavedFilters] = useState<PmsSavedFilterRow[]>([]);
  const [builtInTemplates, setBuiltInTemplates] = useState<
    CustomTemplateItem[]
  >([]);
  const [customTemplates, setCustomTemplates] = useState<CustomTemplateItem[]>(
    []
  );
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [reportsData, setReportsData] = useState<PmsReportsPayload | null>(
    null
  );
  const [loadingReports, setLoadingReports] = useState(false);

  // Modals & Drawers
  const [newProjectModal, setNewProjectModal] = useState<{
    open: boolean;
    templateKey?: string;
  }>({ open: false });
  const [newTaskModal, setNewTaskModal] = useState<{
    open: boolean;
    initialStatus: TaskWorkflowStatus;
  }>({ open: false, initialStatus: "todo" });
  const [errorBanner, setErrorBanner] = useState("");

  const loadProjectsOverview = useCallback(async () => {
    setLoadingProjects(true);
    try {
      const params = new URLSearchParams({ status: statusFilter });
      if (activeView === "starred") params.set("filter", "starred");
      if (searchQuery.trim()) params.set("q", searchQuery.trim());

      const res = await fetch(`/api/v1/admin/pms/projects?${params.toString()}`);
      if (res.status === 401) {
        router.push("/admin/login");
        return;
      }
      const json = await res.json();
      if (!res.ok) {
        setErrorBanner(json.message || "Unable to fetch PMS projects.");
        return;
      }
      const d = json.data;
      setProjects(d.projects || []);
      setSidebarProjects(d.allProjectsSidebar || []);
      setKpis(d.kpis || { total: 0, inProgress: 0, completed: 0, onHold: 0 });
      setUpcomingDeadlines(d.upcomingDeadlines || []);
      setTemplates(d.templates || []);
      setStudioUsers(d.studioUsers || []);
      setClientsList(d.clientsList || []);
      setMyPendingCount(d.myPendingTasksCount ?? 0);
      setUnreadInboxCount(d.unreadNotificationsCount ?? 0);
    } catch {
      setErrorBanner("Network error loading PMS projects.");
    } finally {
      setLoadingProjects(false);
    }
  }, [activeView, router, searchQuery, statusFilter]);

  const loadProjectWorkspace = useCallback(
    async (projectId: string) => {
      setLoadingWorkspace(true);
      setErrorBanner("");
      try {
        const res = await fetch(`/api/v1/admin/pms/projects/${projectId}`);
        if (res.status === 401) {
          router.push("/admin/login");
          return;
        }
        const json = await res.json();
        if (!res.ok) {
          setErrorBanner(json.message || "Unable to open project workspace.");
          setWorkspace(null);
          return;
        }
        setWorkspace(json.data);
      } catch {
        setErrorBanner("Network error loading project workspace.");
      } finally {
        setLoadingWorkspace(false);
      }
    },
    [router]
  );

  const loadMyTasks = useCallback(async () => {
    setLoadingMyTasks(true);
    try {
      const res = await fetch(`/api/v1/admin/pms/my-tasks?tab=${myTasksTab}`);
      const json = await res.json();
      if (res.ok && json.data) {
        setMyTasks(json.data.tasks || []);
        setMyTasksCounts(
          json.data.counts || {
            all: 0,
            today: 0,
            upcoming: 0,
            overdue: 0,
            completed: 0,
          }
        );
      }
    } finally {
      setLoadingMyTasks(false);
    }
  }, [myTasksTab]);

  const loadInbox = useCallback(async () => {
    setLoadingInbox(true);
    try {
      const res = await fetch(`/api/v1/admin/pms/inbox?tab=${inboxTab}`);
      const json = await res.json();
      if (res.ok && json.data) {
        setNotifications(json.data.notifications || []);
        setInboxUnreadCounts(
          json.data.unreadCounts || { all: 0, tasks: 0, mentions: 0 }
        );
        setUnreadInboxCount(json.data.unreadCounts?.all ?? 0);
      }
    } finally {
      setLoadingInbox(false);
    }
  }, [inboxTab]);

  const loadWorkload = useCallback(async () => {
    setLoadingWorkload(true);
    try {
      const res = await fetch("/api/v1/admin/pms/workload");
      const json = await res.json();
      if (res.ok && json.data) {
        setWorkloadMembers(json.data.members || []);
      }
    } finally {
      setLoadingWorkload(false);
    }
  }, []);

  const loadSavedFilters = useCallback(async () => {
    const res = await fetch("/api/v1/admin/pms/filters?scope=tasks");
    if (res.ok) {
      const json = await res.json();
      setSavedFilters(json.data || []);
    }
  }, []);

  const loadTemplates = useCallback(async () => {
    setLoadingTemplates(true);
    try {
      const res = await fetch("/api/v1/admin/pms/templates");
      const json = await res.json();
      if (res.ok && json.data) {
        setBuiltInTemplates(json.data.builtIn || []);
        setCustomTemplates(json.data.custom || []);
      }
    } finally {
      setLoadingTemplates(false);
    }
  }, []);

  const loadReports = useCallback(async () => {
    setLoadingReports(true);
    try {
      const res = await fetch("/api/v1/admin/pms/reports");
      const json = await res.json();
      if (res.ok && json.data) {
        setReportsData(json.data);
      }
    } finally {
      setLoadingReports(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      loadProjectsOverview();
    }, 100);
    return () => clearTimeout(t);
  }, [loadProjectsOverview]);

  useEffect(() => {
    if (activeView !== "project" || !projectParam) return;
    const t = setTimeout(() => {
      loadProjectWorkspace(projectParam);
    }, 0);
    return () => clearTimeout(t);
  }, [activeView, loadProjectWorkspace, projectParam]);

  useEffect(() => {
    if (activeView !== "my-tasks") return;
    const t = setTimeout(() => {
      loadMyTasks();
    }, 0);
    return () => clearTimeout(t);
  }, [activeView, loadMyTasks]);

  useEffect(() => {
    if (activeView !== "inbox") return;
    const t = setTimeout(() => {
      loadInbox();
    }, 0);
    return () => clearTimeout(t);
  }, [activeView, loadInbox]);

  useEffect(() => {
    if (activeView !== "workload") return;
    const t = setTimeout(() => {
      loadWorkload();
    }, 0);
    return () => clearTimeout(t);
  }, [activeView, loadWorkload]);

  useEffect(() => {
    if (activeView !== "project") return;
    const t = setTimeout(() => {
      loadSavedFilters();
    }, 0);
    return () => clearTimeout(t);
  }, [activeView, loadSavedFilters]);

  useEffect(() => {
    if (activeView !== "templates") return;
    const t = setTimeout(() => {
      loadTemplates();
    }, 0);
    return () => clearTimeout(t);
  }, [activeView, loadTemplates]);

  useEffect(() => {
    if (activeView !== "reports") return;
    const t = setTimeout(() => {
      loadReports();
    }, 0);
    return () => clearTimeout(t);
  }, [activeView, loadReports]);

  const refreshActive = useCallback(async () => {
    await loadProjectsOverview();
    if (projectParam) await loadProjectWorkspace(projectParam);
    if (activeView === "my-tasks") await loadMyTasks();
    if (activeView === "inbox") await loadInbox();
    if (activeView === "workload") await loadWorkload();
  }, [
    activeView,
    loadInbox,
    loadMyTasks,
    loadProjectWorkspace,
    loadProjectsOverview,
    loadWorkload,
    projectParam,
  ]);

  const handleToggleStar = async (id: string) => {
    await fetch(`/api/v1/admin/pms/projects/${id}/star`, { method: "POST" });
    await refreshActive();
  };

  const handleProjectStatusChange = async (id: string, nextStatus: string) => {
    await fetch(`/api/v1/admin/pms/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });
    await refreshActive();
  };

  const handleDuplicateProject = async (id: string) => {
    const res = await fetch(`/api/v1/admin/pms/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "duplicate" }),
    });
    if (res.ok) await refreshActive();
  };

  const handleDeleteProject = async (id: string) => {
    setErrorBanner("");
    const res = await fetch(`/api/v1/admin/pms/projects/${id}`, {
      method: "DELETE",
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErrorBanner(
        (json as { message?: string }).message ||
          "Unable to delete project permanently."
      );
      return;
    }
    if (projectParam === id) {
      setWorkspace(null);
      updateRoute({ project: null, tab: null, task: null, view: "overview" });
    }
    await Promise.all([loadProjectsOverview(), loadMyTasks(), loadInbox()]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-5 items-start">
      <PmsSecondarySidebar
        activeView={activeView}
        activeProjectId={projectParam}
        onSelectView={(v) =>
          updateRoute({ view: v, project: null, tab: null, task: null })
        }
        onSelectProject={(id) =>
          updateRoute({ project: id, view: null, tab: "tasks", task: null })
        }
        onNewProject={() => setNewProjectModal({ open: true })}
        canCreateProject={canEdit}
        myPendingCount={myPendingCount}
        unreadInboxCount={unreadInboxCount}
        projects={sidebarProjects}
      />

      <div className="flex-1 min-w-0 w-full space-y-4">
        {errorBanner && (
          <div className="p-3.5 rounded-xl bg-[#2A1517] border border-[#E47777]/40 text-xs text-[#E47777] flex items-center justify-between">
            <span>{errorBanner}</span>
            <button
              type="button"
              onClick={() => setErrorBanner("")}
              className="underline cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        )}

        {activeView === "project" && projectParam ? (
          loadingWorkspace && !workspace ? (
            <div className="p-12 rounded-xl bg-[#111419] border border-[#252A31] text-center text-xs font-mono text-[#A1A6AE]">
              Opening project workspace...
            </div>
          ) : workspace ? (
            <PmsProjectWorkspace
              workspace={workspace}
              savedFilters={savedFilters}
              activeTab={tabParam}
              onTabChange={(nextTab) => updateRoute({ tab: nextTab })}
              onBackToProjects={() =>
                updateRoute({ project: null, tab: null, view: "overview" })
              }
              onRefresh={refreshActive}
              onDeleteProject={() => handleDeleteProject(workspace.project.id)}
              onOpenTask={(tid) => updateRoute({ task: tid })}
              onNewTask={(initialStatus) =>
                setNewTaskModal({ open: true, initialStatus })
              }
              onToggleStar={() => handleToggleStar(workspace.project.id)}
              onSaveFilter={async (name, filterConfig) => {
                await fetch("/api/v1/admin/pms/filters", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ scope: "tasks", name, filterConfig }),
                });
                await loadSavedFilters();
              }}
              onDeleteFilter={async (id) => {
                await fetch(`/api/v1/admin/pms/filters?id=${id}`, {
                  method: "DELETE",
                });
                await loadSavedFilters();
              }}
            />
          ) : null
        ) : activeView === "my-tasks" ? (
          <PmsMyTasksView
            tasks={myTasks}
            counts={myTasksCounts}
            tab={myTasksTab}
            onTabChange={setMyTasksTab}
            loading={loadingMyTasks}
            canEdit={canEdit}
            onOpenTask={(tid) => updateRoute({ task: tid })}
            onToggleStatus={async (task) => {
              await fetch(`/api/v1/admin/pms/tasks/${task.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  workflowStatus: task.completed ? "in_progress" : "done",
                }),
              });
              await refreshActive();
            }}
          />
        ) : activeView === "inbox" ? (
          <PmsInboxView
            notifications={notifications}
            unreadCounts={inboxUnreadCounts}
            tab={inboxTab}
            onTabChange={setInboxTab}
            loading={loadingInbox}
            onMarkRead={async (notificationId, isRead) => {
              await fetch("/api/v1/admin/pms/inbox", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ notificationId, isRead }),
              });
              await loadInbox();
            }}
            onMarkAllRead={async () => {
              await fetch("/api/v1/admin/pms/inbox", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ markAllRead: true }),
              });
              await loadInbox();
            }}
            onNavigateTarget={(pid, tid) => {
              if (pid) {
                updateRoute({
                  project: pid,
                  view: null,
                  tab: "tasks",
                  task: tid,
                });
              } else if (tid) {
                updateRoute({ task: tid });
              }
            }}
          />
        ) : activeView === "workload" ? (
          <PmsWorkloadView
            members={workloadMembers}
            loading={loadingWorkload}
          />
        ) : activeView === "templates" ? (
          <PmsTemplatesView
            builtIn={builtInTemplates}
            custom={customTemplates}
            loading={loadingTemplates}
            canEdit={canEdit}
            onUseTemplate={(templateKey) =>
              setNewProjectModal({ open: true, templateKey })
            }
            onCreateCustom={async (payload) => {
              await fetch("/api/v1/admin/pms/templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });
              await Promise.all([loadTemplates(), loadProjectsOverview()]);
            }}
            onDeleteCustom={async (id) => {
              await fetch(`/api/v1/admin/pms/templates?id=${id}`, {
                method: "DELETE",
              });
              await Promise.all([loadTemplates(), loadProjectsOverview()]);
            }}
          />
        ) : activeView === "reports" ? (
          <PmsReportsView
            reports={reportsData}
            loading={loadingReports}
            onOpenProject={(pid) =>
              updateRoute({ project: pid, view: null, tab: "overview" })
            }
          />
        ) : (
          <PmsDashboardView
            title={
              activeView === "starred"
                ? "Starred Projects"
                : activeView === "all"
                ? "All Studio Projects"
                : "Projects & Tasks — Overview"
            }
            projects={projects}
            kpis={kpis}
            upcomingDeadlines={upcomingDeadlines}
            templates={templates}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            loading={loadingProjects}
            canEdit={canEdit}
            isAdmin={isAdmin}
            onOpenProject={(id) =>
              updateRoute({ project: id, view: null, tab: "tasks" })
            }
            onToggleStar={handleToggleStar}
            onStatusChange={handleProjectStatusChange}
            onDuplicateProject={handleDuplicateProject}
            onDeleteProject={handleDeleteProject}
            onNewProject={(templateKey) =>
              setNewProjectModal({ open: true, templateKey })
            }
            onOpenTask={(pid, tid) =>
              updateRoute({ project: pid, view: null, tab: "tasks", task: tid })
            }
          />
        )}
      </div>

      {/* Task Detail Drawer */}
      <PmsTaskDrawer
        taskId={taskParam}
        canEditTasks={
          workspace ? workspace.permissions.canEditTasks : canEdit
        }
        canApproveReviews={
          workspace ? workspace.permissions.canApproveReviews : isAdmin
        }
        studioUsers={workspace?.studioUsers || studioUsers}
        onClose={() => updateRoute({ task: null })}
        onChanged={refreshActive}
      />

      {/* New Project Modal */}
      {newProjectModal.open && (
        <NewProjectModal
          templates={templates}
          clients={clientsList}
          studioUsers={studioUsers}
          initialTemplateKey={newProjectModal.templateKey}
          onClose={() => setNewProjectModal({ open: false })}
          onCreated={async (createdId) => {
            await loadProjectsOverview();
            updateRoute({ project: createdId, view: null, tab: "tasks" });
          }}
        />
      )}

      {/* New Task Modal */}
      {newTaskModal.open && projectParam && (
        <NewTaskModal
          projectId={projectParam}
          initialStatus={newTaskModal.initialStatus}
          studioUsers={workspace?.studioUsers || studioUsers}
          onClose={() =>
            setNewTaskModal({ open: false, initialStatus: "todo" })
          }
          onCreated={refreshActive}
        />
      )}
    </div>
  );
}
