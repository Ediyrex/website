"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminUser } from "./AdminContext";

interface TaskRow {
  id: string;
  title: string;
  category: string;
  dueDateLabel: string;
  completed: boolean;
  createdAt: string;
}

export function AdminTasksClient() {
  const router = useRouter();
  const { canEdit } = useAdminUser();

  const [tasks, setTasks] = useState<TaskRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("CMS · Portfolio");
  const [dueDateLabel, setDueDateLabel] = useState("Today");
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    const res = await fetch("/api/v1/admin/tasks");
    if (res.status === 401) {
      router.push("/admin/login");
      return null;
    }
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Unable to fetch tasks.");
    return (json.data || []) as TaskRow[];
  }, [router]);

  useEffect(() => {
    let ignore = false;
    fetchTasks()
      .then((rows) => {
        if (!ignore && rows) setTasks(rows);
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error ? err.message : "Network error loading tasks."
          );
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [fetchTasks]);

  const handleCreate = async (e: React.FormEvent) => {
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

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-[#F5F3EE]">
          Projects &amp; Tasks
        </h1>
        <p className="text-sm text-[#8D939E]">
          Track editorial updates, asset reviews, and operational studio deliverables.
        </p>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-[#2A1414] border border-[#F28B82]/40 text-xs text-[#F28B82]">
          {error}
        </div>
      )}

      {canEdit && (
        <form
          onSubmit={handleCreate}
          className="p-4 rounded-xl bg-[#111419] border border-[#1E222A] grid grid-cols-1 sm:grid-cols-12 gap-3"
        >
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="New studio task (e.g. Review Lumina case study media)..."
            className="sm:col-span-6 h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-sm text-[#F5F3EE]"
          />
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
            className="sm:col-span-3 h-10 px-3 rounded-lg bg-[#0D0F12] border border-[#252A32] text-xs text-[#F5F3EE]"
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
            No studio tasks yet. Add one above to track progress on your Overview dashboard.
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
                  <div className="text-xs text-[#777D87]">{task.category}</div>
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
  );
}

