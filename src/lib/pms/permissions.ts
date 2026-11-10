import { and, eq, sql } from "drizzle-orm";
import type { getDb } from "@/db";
import { pmsProjectMembers, pmsProjects } from "@/db";
import type { AuthenticatedSession } from "@/lib/server/session";

export type PmsProjectRole =
  | "super_admin"
  | "studio_admin"
  | "project_manager"
  | "team_lead"
  | "team_member"
  | "viewer";

export interface ProjectPermissions {
  exists: boolean;
  effectiveRole: PmsProjectRole | null;
  canView: boolean;
  canEditTasks: boolean;
  canManageProject: boolean;
  canApproveReviews: boolean;
  canDeleteProject: boolean;
}

type DbClient = NonNullable<ReturnType<typeof getDb>>;

export async function getProjectPermissions(
  db: DbClient,
  session: AuthenticatedSession,
  projectId: string
): Promise<ProjectPermissions> {
  const [project] = await db
    .select({
      id: pmsProjects.id,
      leadUserId: pmsProjects.leadUserId,
    })
    .from(pmsProjects)
    .where(eq(pmsProjects.id, projectId))
    .limit(1);

  if (!project) {
    return {
      exists: false,
      effectiveRole: null,
      canView: false,
      canEditTasks: false,
      canManageProject: false,
      canApproveReviews: false,
      canDeleteProject: false,
    };
  }

  const isGlobalAdmin = session.roles.includes("admin");
  if (isGlobalAdmin) {
    return {
      exists: true,
      effectiveRole: "studio_admin",
      canView: true,
      canEditTasks: true,
      canManageProject: true,
      canApproveReviews: true,
      canDeleteProject: true,
    };
  }

  const [member] = await db
    .select({
      projectRole: pmsProjectMembers.projectRole,
      membershipStatus: pmsProjectMembers.membershipStatus,
    })
    .from(pmsProjectMembers)
    .where(
      and(
        eq(pmsProjectMembers.projectId, projectId),
        eq(pmsProjectMembers.userId, session.userId)
      )
    )
    .limit(1);

  let effectiveRole: PmsProjectRole | null = null;

  if (member && member.membershipStatus === "active") {
    effectiveRole = member.projectRole as PmsProjectRole;
  } else if (project.leadUserId === session.userId) {
    effectiveRole = "project_manager";
  } else {
    // Allow studio editors on legacy/unassigned projects that have zero explicit members yet
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(pmsProjectMembers)
      .where(eq(pmsProjectMembers.projectId, projectId));

    if (count === 0) {
      if (session.roles.includes("editor")) effectiveRole = "team_lead";
      else if (session.roles.includes("viewer")) effectiveRole = "viewer";
    }
  }

  if (!effectiveRole) {
    return {
      exists: true,
      effectiveRole: null,
      canView: false,
      canEditTasks: false,
      canManageProject: false,
      canApproveReviews: false,
      canDeleteProject: false,
    };
  }

  const isManager =
    effectiveRole === "super_admin" ||
    effectiveRole === "studio_admin" ||
    effectiveRole === "project_manager";
  const isLeadOrAbove = isManager || effectiveRole === "team_lead";
  const isContributor = isLeadOrAbove || effectiveRole === "team_member";

  return {
    exists: true,
    effectiveRole,
    canView: true,
    canEditTasks: isContributor,
    canManageProject: isManager,
    canApproveReviews: isLeadOrAbove,
    canDeleteProject: isGlobalAdmin || effectiveRole === "super_admin",
  };
}

