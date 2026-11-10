import { z } from "zod";
import { sanitizePlainText } from "@/lib/server/sanitize";

const safeText = (max: number, min = 0) =>
  z
    .string()
    .trim()
    .min(min)
    .max(max)
    .transform(sanitizePlainText);

const optionalSafeText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform(sanitizePlainText)
    .optional()
    .nullable();

const optionalIsoDate = z
  .string()
  .trim()
  .refine((v) => !v || !Number.isNaN(Date.parse(v)), "Invalid date value.")
  .optional()
  .nullable();

export const pmsProjectCreateFullSchema = z.object({
  title: safeText(200, 2),
  clientId: z.string().uuid().optional().nullable(),
  sourceEnquiryId: z.string().uuid().optional().nullable(),
  serviceInterest: safeText(140, 2).default("Studio Delivery"),
  status: z
    .enum([
      "planning",
      "in_progress",
      "review",
      "completed",
      "on_hold",
      "archived",
    ])
    .default("planning"),
  dueDateLabel: safeText(64, 1).default("This month"),
  summary: safeText(4000, 0).default(""),
  description: safeText(12000, 0).default(""),
  startDate: optionalIsoDate,
  dueDate: optionalIsoDate,
  templateKey: safeText(64, 1).optional().nullable(),
  coverAssetId: z.string().uuid().optional().nullable(),
  memberUserIds: z.array(z.string().uuid()).max(50).optional(),
});

export const pmsProjectPatchFullSchema = z.object({
  title: safeText(200, 2).optional(),
  clientId: z.string().uuid().optional().nullable(),
  serviceInterest: safeText(140, 2).optional(),
  status: z
    .enum([
      "planning",
      "in_progress",
      "review",
      "completed",
      "on_hold",
      "archived",
    ])
    .optional(),
  dueDateLabel: safeText(64, 1).optional(),
  summary: safeText(4000, 0).optional(),
  description: safeText(12000, 0).optional(),
  internalNotes: safeText(40000, 0).optional(),
  coverAssetId: z.string().uuid().optional().nullable(),
  progressPercent: z.coerce.number().int().min(0).max(100).optional(),
  startDate: optionalIsoDate,
  dueDate: optionalIsoDate,
  workflowConfig: z
    .object({
      labels: z.array(safeText(40, 1)).max(24).optional(),
      stageNames: z.record(z.string(), safeText(40, 1)).optional(),
    })
    .optional(),
  action: z.enum(["duplicate"]).optional(),
});

export const pmsMemberAddSchema = z.object({
  userId: z.string().uuid(),
  projectRole: z
    .enum([
      "super_admin",
      "studio_admin",
      "project_manager",
      "team_lead",
      "team_member",
      "viewer",
    ])
    .default("team_member"),
  capacityHoursPerWeek: z.coerce.number().int().min(1).max(80).default(40),
});

export const pmsMemberUpdateSchema = z.object({
  userId: z.string().uuid(),
  projectRole: z
    .enum([
      "super_admin",
      "studio_admin",
      "project_manager",
      "team_lead",
      "team_member",
      "viewer",
    ])
    .optional(),
  capacityHoursPerWeek: z.coerce.number().int().min(1).max(80).optional(),
  membershipStatus: z.enum(["active", "inactive"]).optional(),
});

export const pmsMilestoneCreateSchema = z.object({
  title: safeText(180, 2),
  description: safeText(2000, 0).default(""),
  dueDate: optionalIsoDate,
  status: z
    .enum(["pending", "in_progress", "completed", "delayed"])
    .default("pending"),
});

export const pmsMilestoneUpdateSchema = z.object({
  milestoneId: z.string().uuid(),
  title: safeText(180, 2).optional(),
  description: safeText(2000, 0).optional(),
  dueDate: optionalIsoDate,
  status: z
    .enum(["pending", "in_progress", "completed", "delayed"])
    .optional(),
});

export const pmsTaskCreateSchema = z.object({
  pmsProjectId: z.string().uuid().optional().nullable(),
  title: safeText(200, 2),
  description: safeText(8000, 0).default(""),
  category: safeText(100, 1).default("General"),
  workflowStatus: z
    .enum(["backlog", "todo", "in_progress", "in_review", "done"])
    .default("todo"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  labels: z.array(safeText(40, 1)).max(12).default([]),
  dueDateLabel: safeText(40, 1).default("This week"),
  startDate: optionalIsoDate,
  dueDate: optionalIsoDate,
  estimatedMinutes: z.coerce.number().int().min(0).max(100000).default(0),
  assigneeUserIds: z.array(z.string().uuid()).max(20).optional(),
  dependencyTaskIds: z.array(z.string().uuid()).max(20).optional(),
  recurrenceRule: z
    .enum(["none", "daily", "weekly", "biweekly", "monthly"])
    .default("none"),
});

export const pmsTaskUpdateSchema = z.object({
  title: safeText(200, 2).optional(),
  description: safeText(8000, 0).optional(),
  category: safeText(100, 1).optional(),
  workflowStatus: z
    .enum(["backlog", "todo", "in_progress", "in_review", "done"])
    .optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  labels: z.array(safeText(40, 1)).max(12).optional(),
  dueDateLabel: safeText(40, 1).optional(),
  startDate: optionalIsoDate,
  dueDate: optionalIsoDate,
  estimatedMinutes: z.coerce.number().int().min(0).max(100000).optional(),
  position: z.coerce.number().int().min(0).max(10000).optional(),
  completed: z.boolean().optional(),
  assigneeUserIds: z.array(z.string().uuid()).max(20).optional(),
  dependencyTaskIds: z.array(z.string().uuid()).max(20).optional(),
  recurrenceRule: z
    .enum(["none", "daily", "weekly", "biweekly", "monthly"])
    .optional(),
});

export const pmsSubtaskActionSchema = z.object({
  action: z.enum(["add", "toggle", "delete"]),
  subtaskId: z.string().uuid().optional(),
  title: safeText(240, 1).optional(),
  completed: z.boolean().optional(),
});

export const pmsWorkLogCreateSchema = z.object({
  minutes: z.coerce.number().int().min(1).max(2400),
  note: safeText(300, 0).default(""),
});

export const pmsTaskCommentCreateSchema = z.object({
  body: safeText(4000, 1),
  attachmentAssetIds: z.array(z.string().uuid()).max(10).default([]),
});

export const pmsTaskReviewSchema = z.object({
  decision: z.enum(["submit", "approve", "request_revisions"]),
  feedback: optionalSafeText(2000),
});

export const pmsDiscussionCreateSchema = z.object({
  parentId: z.string().uuid().optional().nullable(),
  body: safeText(6000, 1),
  attachmentAssetIds: z.array(z.string().uuid()).max(10).default([]),
});

export const pmsFileRegisterSchema = z.object({
  mediaAssetId: z.string().uuid(),
  taskId: z.string().uuid().optional().nullable(),
  title: safeText(240, 1),
  category: z
    .enum(["deliverable", "reference", "export", "document"])
    .default("deliverable"),
  versionGroupId: z.string().uuid().optional().nullable(),
  version: z.coerce.number().int().min(1).max(999).default(1),
  versionNote: optionalSafeText(240),
});

export const pmsCustomTemplateCreateSchema = z.object({
  name: safeText(140, 2),
  serviceInterest: safeText(140, 2).default("Studio Delivery"),
  description: safeText(2000, 0).default(""),
  sourceProjectId: z.string().uuid().optional(),
  labels: z.array(safeText(40, 1)).max(24).default([]),
  milestones: z
    .array(
      z.object({
        title: safeText(180, 1),
        offsetDays: z.coerce.number().int().min(0).max(365).default(7),
      })
    )
    .max(20)
    .default([]),
  tasks: z
    .array(
      z.object({
        title: safeText(200, 1),
        workflowStatus: z
          .enum(["backlog", "todo", "in_progress", "in_review", "done"])
          .default("todo"),
        priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
        labels: z.array(safeText(40, 1)).max(12).default([]),
        offsetDays: z.coerce.number().int().min(0).max(365).default(5),
        estimatedMinutes: z.coerce.number().int().min(0).max(100000).default(120),
      })
    )
    .max(40)
    .default([]),
});

export const pmsSavedFilterCreateSchema = z.object({
  scope: z.enum(["projects", "tasks", "my_tasks"]),
  name: safeText(80, 1),
  filterConfig: z.record(z.string(), z.string()),
});


