"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Check,
  FolderKanban,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "./AdminContext";

interface TaskRow {
  id: string;
  pmsProjectId: string | null;
  title: string;
  category: string;
  dueDateLabel: string;
  completed: boolean;
  createdAt: string;
}

interface PmsProjectRow {
  id: string;
  title: string;
  clientId: string | null;
  clientName: string | null;
  clientCompany: string | null;
  sourceEnquiryId: string | null;
  sourceReferenceCode: string | null;
  serviceInterest: string;
  status: "planning" | "in_progress" | "review" | "completed" | "on_hold";
  dueDateLabel: string;
  summary: string;
  totalTasks: number;
  completedTasks: number;
  createdAt: string;
}

export function AdminTasksClient() {
  const router = useRouter();
  const { canEdit } = useAdminUser();

  const [projects, setProjects] = useState<PmsProjectRow[]>([]);
  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [creatingProject, setCreatingProject] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("CMS · Portfolio");
  const [dueDateLabel, setDueDateLabel] = useState("Today");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [newProjectService, setNewProjectService] = useState("Studio Delivery");
  const [newProjectDue, setNewProjectDue] = useState("This month");
  const [showNewProject, setShowNewProject] = useState(false);

  const [error, setError] = useState("");

  const loadWorkspace = useCallback(async () => {
    const [tasksRes, projectsRes] = await Promise.all([
      fetch("/api/v1/admin/tasks"),
      fetch("/api/v1/admin/pms/projects"),
    ]);
    if (tasksRes.status === 401 || projectsRes.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const [tasksJson, projectsJson] = await Promise.all([
      tasksRes.json(),
      projectsRes.json(),
    ]);
    if (!tasksRes.ok) {
      throw new Error(tasksJson.message || "Unable to fetch tasks.");
    }
    return {
      tasks: (tasksJson.data || []) as TaskRow[],
      projects: (projectsJson.data || []) as PmsProjectRow[],
    };
  }, [router]);

  useEffect(() => {
    let ignore = false;
    loadWorkspace()
      .then((res) => {
        if (!ignore && res) {
          setTasks(res.tasks);
          setProjects(res.projects);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Network error loading PMS workspace."
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [loadWorkspace]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setCreating(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category: category.trim(),
          dueDateLabel: dueDateLabel.trim(),
          pmsProjectId: selectedProjectId || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to create task.");
        return;
      }
      setTasks((prev) => [json.data, ...prev]);
      setTitle("");
    } catch {
      setError("Network error creating task.");
    } finally {
      setCreating(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;
    setCreatingProject(true);
    setError("");
    try {
      const res = await fetch("/api/v1/admin/pms/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newProjectTitle.trim(),
          serviceInterest: newProjectService.trim(),
          dueDateLabel: newProjectDue.trim(),
          status: "planning",
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.message || "Unable to create PMS project.");
        return;
      }
      setNewProjectTitle("");
      setShowNewProject(false);
      const refreshed = await loadWorkspace();
      if (refreshed) {
        setTasks(refreshed.tasks);
        setProjects(refreshed.projects);
      }
    } catch {
      setError("Network error creating project.");
    } finally {
      setCreatingProject(false);
    }
  };

  const updateProjectStatus = async (
    projectId: string,
    status: PmsProjectRow["status"]
  ) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === projectId ? { ...p, status } : p))
    );
    await fetch(`/api/v1/admin/pms/projects/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => {});
  };

  const deleteProject = async (projectId: string) => {
    const res = await fetch(`/api/v1/admin/pms/projects/${projectId}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    }
  };

  const toggleTask = async (task: TaskRow) => {
    if (!canEdit) return;
    const next = !task.completed;
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, completed: next } : t))
    );
    await fetch(`/api/v1/admin/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: next }),
    }).catch(() => {});
  };

  const deleteTask = async (id: string) => {
    const res = await fetch(`/api/v1/admin/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTasks((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const projectNameById = new Map(projects.map((p) => [p.id, p.title]));

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
            Projects &amp; Tasks
          </h1>
          <p className="text-sm text-[#8D939E]">
            Internal studio delivery projects from CRM conversions and
            operational studio deliverables.
          </p>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={() => setShowNewProject((v) => !v)}
            className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] cursor-pointer"
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>New PMS Project</span>
          </button>
        )}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-[#2A1414] border border-[#F28B82]/40 text-xs text-[#F28B82]">
          {error}
        </div>
      )}

      {showNewProject && canEdit && (
        <form
          onSubmit={handleCreateProject}
          className="p-4 rounded-xl bg-[#111419] border border-[#252A32] grid grid-cols-1 sm:grid-cols-12 gap-3"
        >
          <input
            type="text"
            required
            value={newProjectTitle}
            onChange={(e) => setNewProjectTitle(e.target.value)}
            placeholder="Internal project title (e.g. Acme Corp — Brand Identity)..."
            className="sm:col-span-6 h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
          />
          <input
            type="text"
            required
            value={newProjectService}
            onChange={(e) => setNewProjectService(e.target.value)}
            placeholder="Service Division"
            className="sm:col-span-3 h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
          />
          <input
            type="text"
            required
            value={newProjectDue}
            onChange={(e) => setNewProjectDue(e.target.value)}
            placeholder="Target Window"
            className="sm:col-span-1 h-10 px-2.5 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
          />
          <button
            type="submit"
            disabled={creatingProject}
            className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] cursor-pointer"
          >
            {creatingProject ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span>Create</span>
          </button>
        </form>
      )}

      {/* Client & Studio PMS Projects Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.14em] text-[#8D939E]">
          <FolderKanban className="w-4 h-4 text-[#D6B77A]" />
          <span>Internal Client Projects ({projects.length})</span>
        </div>

        {loading ? (
          <div className="p-6 rounded-xl bg-[#111419] border border-[#1E222A] text-xs font-mono text-[#777D87]">
            Loading PMS projects...
          </div>
        ) : projects.length === 0 ? (
          <div className="p-6 rounded-xl bg-[#111419] border border-[#1E222A] text-xs text-[#777D87]">
            No internal PMS projects yet. Convert a CRM inquiry or click New PMS
            Project above.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-heading font-semibold text-base text-[#F5F3EE] truncate">
                      {project.title}
                    </h2>
                    <div className="text-xs text-[#8D939E] mt-0.5">
                      {project.clientName
                        ? `${project.clientName}${
                            project.clientCompany
                              ? ` · ${project.clientCompany}`
                              : ""
                          }`
                        : project.serviceInterest}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <select
                      disabled={!canEdit}
                      value={project.status}
                      onChange={(e) =>
                        updateProjectStatus(
                          project.id,
                          e.target.value as PmsProjectRow["status"]
                        )
                      }
                      aria-label={`Status for ${project.title}`}
                      className="h-8 px-2.5 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#D6B77A]"
                    >
                      <option value="planning">Planning</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                      <option value="on_hold">On Hold</option>
                    </select>
                    {canEdit && (
                      <button
                        type="button"
                        onClick={() => deleteProject(project.id)}
                        className="p-1.5 text-[#777D87] hover:text-[#F28B82] cursor-pointer"
                        aria-label={`Delete project ${project.title}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {project.summary && (
                  <p className="text-xs text-[#777D87] line-clamp-2">
                    {project.summary}
                  </p>
                )}

                <div className="pt-2 border-t border-[#1E222A] flex items-center justify-between text-[11px] font-mono text-[#777D87]">
                  <span>{project.serviceInterest}</span>
                  <span>
                    Due: {project.dueDateLabel} · {project.completedTasks}/
                    {project.totalTasks} tasks
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Studio Tasks Checklist */}
      <div className="space-y-3">
        <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#8D939E]">
          Studio Deliverables &amp; Tasks ({tasks.length})
        </div>

        {canEdit && (
          <form
            onSubmit={handleCreateTask}
            className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] grid grid-cols-1 sm:grid-cols-12 gap-3"
          >
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New studio task (e.g. Deliver final brand guidelines)..."
              className="sm:col-span-4 h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
            />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              aria-label="Link task to PMS project"
              className="sm:col-span-3 h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#E4E0D8]"
            >
              <option value="">General Studio Task</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category"
              className="sm:col-span-2 h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
            />
            <input
              type="text"
              value={dueDateLabel}
              onChange={(e) => setDueDateLabel(e.target.value)}
              placeholder="Due"
              className="sm:col-span-1 h-10 px-2.5 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
            />
            <button
              type="submit"
              disabled={creating}
              className="sm:col-span-2 inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-lg bg-[#D6B77A] text-[#08090B] text-xs font-semibold hover:bg-[#E2C68F] cursor-pointer"
            >
              {creating ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Plus className="w-3.5 h-3.5" />
              )}
              <span>Add</span>
            </button>
          </form>
        )}

        <div className="rounded-xl bg-[#111419] border border-[#1E222A] divide-y divide-[#1E222A]">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-[#777D87]">
              Loading studio tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#777D87]">
              No studio tasks yet. Add one above to track progress on your
              Overview dashboard.
            </div>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-[#161920]"
              >
                <button
                  type="button"
                  disabled={!canEdit}
                  onClick={() => toggleTask(task)}
                  className="flex items-start gap-3 text-left flex-1 min-w-0 cursor-pointer disabled:cursor-default"
                >
                  <span
                    className={cn(
                      "mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0",
                      task.completed
                        ? "bg-[#D6B77A] border-[#D6B77A] text-[#08090B]"
                        : "bg-[#0D0F12] border-[#323946]"
                    )}
                  >
                    {task.completed && <Check className="w-3 h-3" />}
                  </span>
                  <div className="min-w-0">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        task.completed
                          ? "line-through text-[#6D7480]"
                          : "text-[#F5F3EE]"
                      )}
                    >
                      {task.title}
                    </div>
                    <div className="text-xs text-[#777D87] flex flex-wrap items-center gap-2">
                      <span>{task.category}</span>
                      {task.pmsProjectId &&
                        projectNameById.get(task.pmsProjectId) && (
                          <span className="text-[#D6B77A]">
                            · {projectNameById.get(task.pmsProjectId)}
                          </span>
                        )}
                    </div>
                  </div>
                </button>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-mono text-[#D6B77A]">
                    {task.completed ? "Completed" : task.dueDateLabel}
                  </span>
                  {canEdit && (
                    <button
                      type="button"
                      onClick={() => deleteTask(task.id)}
                      className="p-1.5 text-[#777D87] hover:text-[#F28B82] cursor-pointer"
                      aria-label={`Delete task ${task.title}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
