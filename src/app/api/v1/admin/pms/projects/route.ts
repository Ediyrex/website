import { unstable_rethrow } from "next/navigation";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import type { NextRequest } from "next/server";
import {
  crmClients,
  enquiries,
  getDb,
  mediaAssets,
  pmsCustomTemplates,
  pmsMilestones,
  pmsNotifications,
  pmsProjectMembers,
  pmsProjects,
  pmsStarredProjects,
  pmsTaskAssignees,
  pmsTaskSubtasks,
  studioTasks,
  users,
} from "@/db";
import { logPmsActivity, notifyPmsUsers } from "@/lib/pms/notifications";
import { getPmsTemplate, PMS_PROJECT_TEMPLATES } from "@/lib/pms/templates";
import {
  apiBadRequest,
  apiOk,
  apiServerError,
} from "@/lib/server/api-response";
import { recordAuditLog } from "@/lib/server/audit";
import { handleApiError } from "@/lib/server/errors";
import { logger } from "@/lib/server/logger";
import { requireAdminRole } from "@/lib/server/session";
import { pmsProjectCreateFullSchema } from "@/lib/validations/pms";

export async function GET(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor", "viewer"]);
    if (auth.errorResponse) return auth.errorResponse;

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter")?.trim() || "all";
    const statusParam = searchParams.get("status")?.trim() || "all";
    const q = searchParams.get("q")?.trim().toLowerCase() || "";

    const isGlobalAdmin = auth.session.roles.includes("admin");

    const [
      rawProjects,
      allMembers,
      starredRows,
      allTasks,
      allMilestones,
      studioUsers,
      clientsList,
      myTaskCountRows,
      unreadInboxRows,
      customTemplateRows,
    ] = await Promise.all([
      db
        .select({
          id: pmsProjects.id,
          referenceCode: pmsProjects.referenceCode,
          title: pmsProjects.title,
          clientId: pmsProjects.clientId,
          clientName: crmClients.name,
          clientCompany: crmClients.companyName,
          sourceEnquiryId: pmsProjects.sourceEnquiryId,
          sourceReferenceCode: enquiries.referenceCode,
          serviceInterest: pmsProjects.serviceInterest,
          status: pmsProjects.status,
          dueDateLabel: pmsProjects.dueDateLabel,
          summary: pmsProjects.summary,
          description: pmsProjects.description,
          coverAssetId: pmsProjects.coverAssetId,
          coverUrl: mediaAssets.secureUrl,
          progressPercent: pmsProjects.progressPercent,
          startDate: pmsProjects.startDate,
          dueDate: pmsProjects.dueDate,
          templateKey: pmsProjects.templateKey,
          leadUserId: pmsProjects.leadUserId,
          createdAt: pmsProjects.createdAt,
          updatedAt: pmsProjects.updatedAt,
        })
        .from(pmsProjects)
        .leftJoin(crmClients, eq(pmsProjects.clientId, crmClients.id))
        .leftJoin(enquiries, eq(pmsProjects.sourceEnquiryId, enquiries.id))
        .leftJoin(mediaAssets, eq(pmsProjects.coverAssetId, mediaAssets.id))
        .orderBy(desc(pmsProjects.updatedAt)),
      db
        .select({
          projectId: pmsProjectMembers.projectId,
          userId: pmsProjectMembers.userId,
          projectRole: pmsProjectMembers.projectRole,
          membershipStatus: pmsProjectMembers.membershipStatus,
          displayName: users.displayName,
          emailNormalized: users.emailNormalized,
        })
        .from(pmsProjectMembers)
        .innerJoin(users, eq(pmsProjectMembers.userId, users.id))
        .where(eq(pmsProjectMembers.membershipStatus, "active")),
      db
        .select({ projectId: pmsStarredProjects.projectId })
        .from(pmsStarredProjects)
        .where(eq(pmsStarredProjects.userId, auth.session.userId)),
      db
        .select({
          id: studioTasks.id,
          pmsProjectId: studioTasks.pmsProjectId,
          title: studioTasks.title,
          workflowStatus: studioTasks.workflowStatus,
          completed: studioTasks.completed,
          dueDate: studioTasks.dueDate,
          dueDateLabel: studioTasks.dueDateLabel,
          priority: studioTasks.priority,
        })
        .from(studioTasks),
      db
        .select({
          id: pmsMilestones.id,
          projectId: pmsMilestones.projectId,
          title: pmsMilestones.title,
          dueDate: pmsMilestones.dueDate,
          status: pmsMilestones.status,
        })
        .from(pmsMilestones)
        .orderBy(asc(pmsMilestones.position)),
      db
        .select({
          id: users.id,
          displayName: users.displayName,
          emailNormalized: users.emailNormalized,
          status: users.status,
        })
        .from(users)
        .where(eq(users.status, "active"))
        .orderBy(asc(users.displayName)),
      db
        .select({
          id: crmClients.id,
          name: crmClients.name,
          companyName: crmClients.companyName,
          serviceInterest: crmClients.serviceInterest,
        })
        .from(crmClients)
        .orderBy(asc(crmClients.name)),
      db
        .select({
          taskId: studioTasks.id,
          workflowStatus: studioTasks.workflowStatus,
          completed: studioTasks.completed,
        })
        .from(studioTasks)
        .leftJoin(
          pmsTaskAssignees,
          eq(studioTasks.id, pmsTaskAssignees.taskId)
        )
        .where(
          sql`(${studioTasks.assigneeUserId} = ${auth.session.userId} OR ${pmsTaskAssignees.userId} = ${auth.session.userId}) AND ${studioTasks.completed} = false`
        ),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(pmsNotifications)
        .where(
          and(
            eq(pmsNotifications.recipientUserId, auth.session.userId),
            eq(pmsNotifications.isRead, false)
          )
        ),
      db
        .select()
        .from(pmsCustomTemplates)
        .orderBy(desc(pmsCustomTemplates.createdAt)),
    ]);

    const starredSet = new Set(starredRows.map((s) => s.projectId));

    const membersByProject = new Map<
      string,
      Array<{
        userId: string;
        displayName: string;
        emailNormalized: string;
        projectRole: string;
      }>
    >();
    for (const m of allMembers) {
      const list = membersByProject.get(m.projectId) ?? [];
      list.push({
        userId: m.userId,
        displayName: m.displayName,
        emailNormalized: m.emailNormalized,
        projectRole: m.projectRole,
      });
      membersByProject.set(m.projectId, list);
    }

    const tasksByProject = new Map<
      string,
      Array<(typeof allTasks)[number]>
    >();
    for (const t of allTasks) {
      if (!t.pmsProjectId) continue;
      const list = tasksByProject.get(t.pmsProjectId) ?? [];
      list.push(t);
      tasksByProject.set(t.pmsProjectId, list);
    }

    const milestonesByProject = new Map<
      string,
      Array<(typeof allMilestones)[number]>
    >();
    for (const ms of allMilestones) {
      const list = milestonesByProject.get(ms.projectId) ?? [];
      list.push(ms);
      milestonesByProject.set(ms.projectId, list);
    }

    // Access control filtering
    const accessibleProjects = rawProjects.filter((p) => {
      if (isGlobalAdmin) return true;
      const members = membersByProject.get(p.id) ?? [];
      if (members.some((m) => m.userId === auth.session.userId)) return true;
      if (p.leadUserId === auth.session.userId) return true;
      return members.length === 0;
    });

    const enriched = accessibleProjects.map((p) => {
      const projectTasks = tasksByProject.get(p.id) ?? [];
      const totalTasks = projectTasks.length;
      const completedTasks = projectTasks.filter(
        (t) => t.completed || t.workflowStatus === "done"
      ).length;
      const computedProgress =
        totalTasks > 0
          ? Math.round((completedTasks / totalTasks) * 100)
          : p.progressPercent;
      const projectMilestones = milestonesByProject.get(p.id) ?? [];
      const projectMembers = membersByProject.get(p.id) ?? [];

      return {
        ...p,
        referenceCode:
          p.referenceCode || `PRJ-${p.id.slice(0, 4).toUpperCase()}`,
        isStarred: starredSet.has(p.id),
        totalTasks,
        completedTasks,
        progress: computedProgress,
        milestonesCount: projectMilestones.length,
        completedMilestonesCount: projectMilestones.filter(
          (m) => m.status === "completed"
        ).length,
        team: projectMembers,
      };
    });

    const nonArchived = enriched.filter((p) => p.status !== "archived");

    const kpis = {
      total: nonArchived.length,
      inProgress: nonArchived.filter(
        (p) => p.status === "in_progress" || p.status === "review"
      ).length,
      completed: nonArchived.filter((p) => p.status === "completed").length,
      onHold: nonArchived.filter((p) => p.status === "on_hold").length,
      planning: nonArchived.filter((p) => p.status === "planning").length,
    };

    const filtered = enriched.filter((p) => {
      if (filter === "starred" && !p.isStarred) return false;
      if (statusParam === "all") {
        if (p.status === "archived" && filter !== "archived") return false;
      } else if (p.status !== statusParam) {
        return false;
      }
      if (q) {
        const hay = `${p.title} ${p.referenceCode} ${p.clientName || ""} ${
          p.clientCompany || ""
        } ${p.serviceInterest}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    const upcomingDeadlines = allTasks
      .filter(
        (t) =>
          !t.completed &&
          t.workflowStatus !== "done" &&
          t.dueDate &&
          t.pmsProjectId
      )
      .sort(
        (a, b) =>
          new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime()
      )
      .slice(0, 6)
      .map((t) => {
        const proj = enriched.find((p) => p.id === t.pmsProjectId);
        return {
          id: t.id,
          projectId: t.pmsProjectId!,
          projectTitle: proj?.title || "Studio Project",
          title: t.title,
          priority: t.priority,
          dueDate: t.dueDate,
        };
      });

    // Deduplicate myTaskCountRows
    const myPendingTaskIds = new Set(myTaskCountRows.map((r) => r.taskId));

    return apiOk({
      projects: filtered,
      allProjectsSidebar: nonArchived.slice(0, 20).map((p) => ({
        id: p.id,
        title: p.title,
        status: p.status,
        isStarred: p.isStarred,
      })),
      kpis,
      upcomingDeadlines,
      myPendingTasksCount: myPendingTaskIds.size,
      unreadNotificationsCount: unreadInboxRows[0]?.count ?? 0,
      studioUsers,
      clientsList,
      templates: [
        ...PMS_PROJECT_TEMPLATES.map((t) => ({
          key: t.key,
          name: t.name,
          serviceInterest: t.serviceInterest,
          description: t.description,
          milestonesCount: t.milestones.length,
          tasksCount: t.tasks.length,
          isBuiltIn: true,
        })),
        ...customTemplateRows.map((c) => ({
          key: c.key,
          name: c.name,
          serviceInterest: c.serviceInterest,
          description: c.description,
          milestonesCount: c.milestonesJson.length,
          tasksCount: c.tasksJson.length,
          isBuiltIn: false,
        })),
      ],
    });
  } catch (err) {
    unstable_rethrow(err);
    logger.error({ err }, "Failed to fetch PMS projects");
    return apiServerError("Unable to load PMS projects.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireAdminRole(["admin", "editor"]);
    if (auth.errorResponse) return auth.errorResponse;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiBadRequest("Invalid JSON request body.");
    }

    const parsed = pmsProjectCreateFullSchema.safeParse(body);
    if (!parsed.success) {
      return apiBadRequest(
        "Invalid PMS project payload.",
        parsed.error.flatten().fieldErrors
      );
    }

    const db = getDb();
    if (!db) {
      return apiServerError("Database connection unavailable.");
    }

    const data = parsed.data;
    let template = getPmsTemplate(data.templateKey);
    if (data.templateKey?.startsWith("custom_")) {
      const [customTpl] = await db
        .select()
        .from(pmsCustomTemplates)
        .where(eq(pmsCustomTemplates.key, data.templateKey))
        .limit(1);
      if (customTpl) {
        template = {
          key: customTpl.key,
          name: customTpl.name,
          serviceInterest: customTpl.serviceInterest,
          description: customTpl.description,
          milestones: customTpl.milestonesJson,
          tasks: customTpl.tasksJson,
        };
      }
    }
    const now = new Date();

    const created = await db.transaction(async (tx) => {
      const [{ existingCount }] = await tx
        .select({ existingCount: sql<number>`count(*)::int` })
        .from(pmsProjects);
      const refNum = String(existingCount + 1).padStart(3, "0");
      const referenceCode = `PRJ-${refNum}`;

      const [project] = await tx
        .insert(pmsProjects)
        .values({
          referenceCode,
          title: data.title,
          clientId: data.clientId || null,
          sourceEnquiryId: data.sourceEnquiryId || null,
          serviceInterest:
            data.serviceInterest || template.serviceInterest || "Studio Delivery",
          status: data.status,
          dueDateLabel: data.dueDateLabel,
          summary: data.summary,
          description: data.description || data.summary,
          startDate: data.startDate ? new Date(data.startDate) : now,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          templateKey: data.templateKey || null,
          coverAssetId: data.coverAssetId || null,
          progressPercent: 0,
          leadUserId: auth.session.userId,
        })
        .returning();

      // Add creator as project_manager + requested team members
      const memberIds = Array.from(
        new Set([auth.session.userId, ...(data.memberUserIds ?? [])])
      );
      await tx.insert(pmsProjectMembers).values(
        memberIds.map((uid) => ({
          projectId: project.id,
          userId: uid,
          projectRole:
            uid === auth.session.userId ? "project_manager" : "team_member",
          capacityHoursPerWeek: 40,
          membershipStatus: "active",
        }))
      );

      // Seed milestones from template if selected
      for (let i = 0; i < template.milestones.length; i += 1) {
        const ms = template.milestones[i];
        await tx.insert(pmsMilestones).values({
          projectId: project.id,
          title: ms.title,
          dueDate: new Date(now.getTime() + ms.offsetDays * 86400000),
          status: "pending",
          position: i,
        });
      }

      // Seed tasks from template (or 1 kickoff task if blank project created)
      if (template.tasks.length > 0) {
        for (let i = 0; i < template.tasks.length; i += 1) {
          const tplTask = template.tasks[i];
          const taskDue = new Date(
            now.getTime() + tplTask.offsetDays * 86400000
          );
          const [insertedTask] = await tx
            .insert(studioTasks)
            .values({
              pmsProjectId: project.id,
              taskCode: `TSK-${refNum}-${i + 1}`,
              title: tplTask.title,
              category: `PMS · ${project.serviceInterest}`,
              workflowStatus: tplTask.workflowStatus,
              priority: tplTask.priority,
              labels: tplTask.labels,
              dueDate: taskDue,
              dueDateLabel: taskDue.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              startDate: now,
              estimatedMinutes: tplTask.estimatedMinutes,
              position: i,
              completed: tplTask.workflowStatus === "done",
              assigneeUserId: auth.session.userId,
            })
            .returning();

          await tx.insert(pmsTaskAssignees).values({
            taskId: insertedTask.id,
            userId: auth.session.userId,
          });

          if (tplTask.subtasks && tplTask.subtasks.length > 0) {
            await tx.insert(pmsTaskSubtasks).values(
              tplTask.subtasks.map((st, idx) => ({
                taskId: insertedTask.id,
                title: st,
                completed: false,
                position: idx,
              }))
            );
          }
        }
      } else {
        const [kickoff] = await tx
          .insert(studioTasks)
          .values({
            pmsProjectId: project.id,
            taskCode: `TSK-${refNum}-1`,
            title: `Kickoff: ${project.title}`,
            category: `PMS · ${project.serviceInterest}`,
            workflowStatus: "todo",
            priority: "medium",
            labels: ["Planning"],
            dueDateLabel: project.dueDateLabel || "This week",
            startDate: now,
            dueDate: project.dueDate || new Date(now.getTime() + 7 * 86400000),
            completed: false,
            assigneeUserId: auth.session.userId,
          })
          .returning();

        await tx.insert(pmsTaskAssignees).values({
          taskId: kickoff.id,
          userId: auth.session.userId,
        });
      }

      await logPmsActivity(tx, {
        projectId: project.id,
        actorUserId: auth.session.userId,
        action: "project.created",
        summary: `Created project ${project.referenceCode} (${project.title})`,
        metadata: { templateKey: data.templateKey || "blank" },
      });

      const invitedIds = (data.memberUserIds ?? []).filter(
        (id) => id !== auth.session.userId
      );
      if (invitedIds.length > 0) {
        await notifyPmsUsers(tx, {
          recipientUserIds: invitedIds,
          actorUserId: auth.session.userId,
          projectId: project.id,
          category: "project",
          title: `Added to project: ${project.title}`,
          body: `You were assigned to ${project.referenceCode} (${project.serviceInterest}).`,
        });
      }

      return project;
    });

    await recordAuditLog({
      actorUserId: auth.session.userId,
      actorEmailSnapshot: auth.session.email,
      action: "pms_project.created",
      entityType: "pms_project",
      entityId: created.id,
      metadata: {
        title: created.title,
        referenceCode: created.referenceCode,
        templateKey: data.templateKey || null,
      },
    });

    return apiOk(created, undefined, 201);
  } catch (err) {
    return handleApiError(err, "POST /api/v1/admin/pms/projects");
  }
}
