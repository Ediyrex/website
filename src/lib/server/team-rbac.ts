import { eq } from "drizzle-orm";
import {
  accessGroups,
  roles,
  teamRoleDefinitions,
  userRoles,
  users,
} from "@/db/schema/auth";
import type { getDb } from "@/db";

type FullDb = NonNullable<ReturnType<typeof getDb>>;
type TxDb = Parameters<Parameters<FullDb["transaction"]>[0]>[0];
export type DbClient = Pick<FullDb, "select" | "insert" | "update" | "delete"> | TxDb;

export const TEAM_MODULES = [
  { key: "pages", label: "Pages" },
  { key: "portfolio", label: "Portfolio" },
  { key: "services", label: "Services" },
  { key: "blog", label: "Blog" },
  { key: "media", label: "Media" },
  { key: "crm", label: "CRM" },
  { key: "pms", label: "PMS" },
  { key: "settings", label: "Settings" },
  { key: "team", label: "Team" },
] as const;

export type TeamModuleKey = (typeof TEAM_MODULES)[number]["key"];
export type ModuleActionKey = "view" | "create" | "edit" | "delete";

export const TEAM_CAPABILITIES = [
  { key: "publish", label: "Publish Content", description: "Publish pages, portfolio works, services, and blog posts live." },
  { key: "approve", label: "Approve Deliverables", description: "Approve PMS tasks, client deliverables, and review submissions." },
  { key: "inviteUsers", label: "Invite & Manage Users", description: "Send team invitations, change roles, and manage access groups." },
  { key: "manageBilling", label: "Manage Billing", description: "Access studio financial settings, proposals, and billing configurations." },
  { key: "viewConfidential", label: "View Confidential", description: "View confidential client notes, audit logs, and private internal remarks." },
] as const;

export type TeamCapabilityKey = (typeof TEAM_CAPABILITIES)[number]["key"];

export interface RolePermissionsMatrix {
  modules: Record<
    string,
    { view: boolean; create: boolean; edit: boolean; delete: boolean }
  >;
  capabilities: {
    publish: boolean;
    approve: boolean;
    inviteUsers: boolean;
    manageBilling: boolean;
    viewConfidential: boolean;
  };
}

export interface RoleSeedDefinition {
  key: string;
  name: string;
  baseRole: "admin" | "editor" | "viewer";
  description: string;
  isSystem: boolean;
  permissions: RolePermissionsMatrix;
}

function fullModuleAccess(
  view: boolean,
  create: boolean,
  edit: boolean,
  del: boolean
) {
  return { view, create, edit, delete: del };
}

export function buildEmptyPermissions(): RolePermissionsMatrix {
  const modules: RolePermissionsMatrix["modules"] = {};
  for (const mod of TEAM_MODULES) {
    modules[mod.key] = fullModuleAccess(false, false, false, false);
  }
  return {
    modules,
    capabilities: {
      publish: false,
      approve: false,
      inviteUsers: false,
      manageBilling: false,
      viewConfidential: false,
    },
  };
}

export const PREDEFINED_ROLE_DEFINITIONS: RoleSeedDefinition[] = [
  {
    key: "super_admin",
    name: "Super Admin",
    baseRole: "admin",
    description:
      "Full unrestricted access across CMS, CRM, PMS, website settings, billing, security, and permission architecture.",
    isSystem: true,
    permissions: {
      modules: {
        pages: fullModuleAccess(true, true, true, true),
        portfolio: fullModuleAccess(true, true, true, true),
        services: fullModuleAccess(true, true, true, true),
        blog: fullModuleAccess(true, true, true, true),
        media: fullModuleAccess(true, true, true, true),
        crm: fullModuleAccess(true, true, true, true),
        pms: fullModuleAccess(true, true, true, true),
        settings: fullModuleAccess(true, true, true, true),
        team: fullModuleAccess(true, true, true, true),
      },
      capabilities: {
        publish: true,
        approve: true,
        inviteUsers: true,
        manageBilling: true,
        viewConfidential: true,
      },
    },
  },
  {
    key: "studio_admin",
    name: "Studio Admin",
    baseRole: "admin",
    description:
      "Operational administration across CMS, CRM, PMS, team onboarding, and website configuration.",
    isSystem: true,
    permissions: {
      modules: {
        pages: fullModuleAccess(true, true, true, true),
        portfolio: fullModuleAccess(true, true, true, true),
        services: fullModuleAccess(true, true, true, true),
        blog: fullModuleAccess(true, true, true, true),
        media: fullModuleAccess(true, true, true, true),
        crm: fullModuleAccess(true, true, true, true),
        pms: fullModuleAccess(true, true, true, true),
        settings: fullModuleAccess(true, true, true, false),
        team: fullModuleAccess(true, true, true, true),
      },
      capabilities: {
        publish: true,
        approve: true,
        inviteUsers: true,
        manageBilling: false,
        viewConfidential: true,
      },
    },
  },
  {
    key: "project_manager",
    name: "Project Manager",
    baseRole: "editor",
    description:
      "Leads CRM pipelines, client coordination, PMS projects, timelines, and deliverable reviews.",
    isSystem: true,
    permissions: {
      modules: {
        pages: fullModuleAccess(true, false, true, false),
        portfolio: fullModuleAccess(true, true, true, false),
        services: fullModuleAccess(true, false, true, false),
        blog: fullModuleAccess(true, true, true, false),
        media: fullModuleAccess(true, true, true, true),
        crm: fullModuleAccess(true, true, true, true),
        pms: fullModuleAccess(true, true, true, true),
        settings: fullModuleAccess(true, false, false, false),
        team: fullModuleAccess(true, false, false, false),
      },
      capabilities: {
        publish: true,
        approve: true,
        inviteUsers: false,
        manageBilling: false,
        viewConfidential: true,
      },
    },
  },
  {
    key: "team_lead",
    name: "Team Lead",
    baseRole: "editor",
    description:
      "Oversees division execution, reviews team tasks, curates media and portfolio content.",
    isSystem: true,
    permissions: {
      modules: {
        pages: fullModuleAccess(true, true, true, false),
        portfolio: fullModuleAccess(true, true, true, false),
        services: fullModuleAccess(true, true, true, false),
        blog: fullModuleAccess(true, true, true, false),
        media: fullModuleAccess(true, true, true, true),
        crm: fullModuleAccess(true, true, true, false),
        pms: fullModuleAccess(true, true, true, false),
        settings: fullModuleAccess(false, false, false, false),
        team: fullModuleAccess(true, false, false, false),
      },
      capabilities: {
        publish: true,
        approve: true,
        inviteUsers: false,
        manageBilling: false,
        viewConfidential: false,
      },
    },
  },
  {
    key: "team_member",
    name: "Team Member",
    baseRole: "editor",
    description:
      "Collaborates inside assigned PMS projects, tasks, media uploads, and editorial drafts.",
    isSystem: true,
    permissions: {
      modules: {
        pages: fullModuleAccess(true, false, false, false),
        portfolio: fullModuleAccess(true, true, true, false),
        services: fullModuleAccess(true, false, false, false),
        blog: fullModuleAccess(true, true, true, false),
        media: fullModuleAccess(true, true, true, false),
        crm: fullModuleAccess(true, false, true, false),
        pms: fullModuleAccess(true, true, true, false),
        settings: fullModuleAccess(false, false, false, false),
        team: fullModuleAccess(true, false, false, false),
      },
      capabilities: {
        publish: false,
        approve: false,
        inviteUsers: false,
        manageBilling: false,
        viewConfidential: false,
      },
    },
  },
  {
    key: "viewer",
    name: "Viewer",
    baseRole: "viewer",
    description:
      "Read-only visibility into approved portfolio items, services, blog drafts, and assigned PMS updates.",
    isSystem: true,
    permissions: {
      modules: {
        pages: fullModuleAccess(true, false, false, false),
        portfolio: fullModuleAccess(true, false, false, false),
        services: fullModuleAccess(true, false, false, false),
        blog: fullModuleAccess(true, false, false, false),
        media: fullModuleAccess(true, false, false, false),
        crm: fullModuleAccess(false, false, false, false),
        pms: fullModuleAccess(true, false, false, false),
        settings: fullModuleAccess(false, false, false, false),
        team: fullModuleAccess(true, false, false, false),
      },
      capabilities: {
        publish: false,
        approve: false,
        inviteUsers: false,
        manageBilling: false,
        viewConfidential: false,
      },
    },
  },
];

export const DEFAULT_ACCESS_GROUPS = [
  {
    name: "Creative Division",
    slug: "creative-division",
    division: "Creative",
    description:
      "Video production, brand identity, photography, and motion graphics contributors.",
    defaultStudioRole: "team_member",
  },
  {
    name: "Digital Division",
    slug: "digital-division",
    division: "Digital",
    description:
      "Website engineering, UI/UX systems, and digital growth operations.",
    defaultStudioRole: "team_lead",
  },
  {
    name: "AI Division",
    slug: "ai-division",
    division: "AI",
    description:
      "AI agents, workflow automation, and intelligent system integrations.",
    defaultStudioRole: "team_lead",
  },
] as const;

export const STUDIO_ROLE_LABELS: Record<string, string> = {
  super_admin: "Super Admin",
  studio_admin: "Studio Admin",
  project_manager: "Project Manager",
  team_lead: "Team Lead",
  team_member: "Team Member",
  viewer: "Viewer",
};

export function inferBaseRoleSync(
  studioRole: string
): "admin" | "editor" | "viewer" {
  if (studioRole === "super_admin" || studioRole === "studio_admin") {
    return "admin";
  }
  if (studioRole === "viewer") {
    return "viewer";
  }
  return "editor";
}

export async function resolveBaseRole(
  db: DbClient,
  studioRole: string,
  fallbackBaseRole?: "admin" | "editor" | "viewer"
): Promise<"admin" | "editor" | "viewer"> {
  const [roleDef] = await db
    .select({ baseRole: teamRoleDefinitions.baseRole })
    .from(teamRoleDefinitions)
    .where(eq(teamRoleDefinitions.key, studioRole))
    .limit(1);

  const raw = roleDef?.baseRole ?? fallbackBaseRole ?? inferBaseRoleSync(studioRole);
  if (raw === "admin" || raw === "editor" || raw === "viewer") {
    return raw;
  }
  return "editor";
}

export async function ensureTeamDefaultsBootstrapped(db: DbClient): Promise<void> {
  const existingRoles = await db
    .select({ key: teamRoleDefinitions.key })
    .from(teamRoleDefinitions);
  const existingRoleKeys = new Set(existingRoles.map((r) => r.key));

  const missingRoles = PREDEFINED_ROLE_DEFINITIONS.filter(
    (def) => !existingRoleKeys.has(def.key)
  );
  if (missingRoles.length > 0) {
    await db
      .insert(teamRoleDefinitions)
      .values(
        missingRoles.map((def) => ({
          key: def.key,
          name: def.name,
          baseRole: def.baseRole,
          description: def.description,
          isSystem: def.isSystem,
          permissions: def.permissions,
        }))
      )
      .onConflictDoNothing({ target: teamRoleDefinitions.key });
  }

  const existingGroups = await db
    .select({ slug: accessGroups.slug })
    .from(accessGroups);
  if (existingGroups.length === 0) {
    await db
      .insert(accessGroups)
      .values(
        DEFAULT_ACCESS_GROUPS.map((g) => ({
          name: g.name,
          slug: g.slug,
          division: g.division,
          description: g.description,
          defaultStudioRole: g.defaultStudioRole,
        }))
      )
      .onConflictDoNothing({ target: accessGroups.slug });
  }
}

export async function syncUserBaseRole(
  db: DbClient,
  userId: string,
  baseRoleName: "admin" | "editor" | "viewer"
): Promise<void> {
  const [targetRole] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(eq(roles.name, baseRoleName))
    .limit(1);

  if (!targetRole) return;

  await db.delete(userRoles).where(eq(userRoles.userId, userId));
  await db.insert(userRoles).values({
    userId,
    roleId: targetRole.id,
  });
}

export async function hasModulePermission(
  db: DbClient,
  userId: string,
  moduleKey: TeamModuleKey,
  action: ModuleActionKey
): Promise<boolean> {
  await ensureTeamDefaultsBootstrapped(db);

  const [userRow] = await db
    .select({
      studioRole: users.studioRole,
      status: users.status,
      removedAt: users.removedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!userRow || userRow.status !== "active" || userRow.removedAt) {
    return false;
  }

  if (userRow.studioRole === "super_admin") {
    return true;
  }

  const [roleDef] = await db
    .select({
      baseRole: teamRoleDefinitions.baseRole,
      permissions: teamRoleDefinitions.permissions,
    })
    .from(teamRoleDefinitions)
    .where(eq(teamRoleDefinitions.key, userRow.studioRole))
    .limit(1);

  if (!roleDef) {
    const fallback = PREDEFINED_ROLE_DEFINITIONS.find(
      (r) => r.key === userRow.studioRole
    );
    if (!fallback) return false;
    return Boolean(fallback.permissions.modules[moduleKey]?.[action]);
  }

  return Boolean(roleDef.permissions?.modules?.[moduleKey]?.[action]);
}

export async function hasCapability(
  db: DbClient,
  userId: string,
  capabilityKey: TeamCapabilityKey
): Promise<boolean> {
  await ensureTeamDefaultsBootstrapped(db);

  const [userRow] = await db
    .select({
      studioRole: users.studioRole,
      status: users.status,
      removedAt: users.removedAt,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!userRow || userRow.status !== "active" || userRow.removedAt) {
    return false;
  }

  if (userRow.studioRole === "super_admin") {
    return true;
  }

  const [roleDef] = await db
    .select({
      permissions: teamRoleDefinitions.permissions,
    })
    .from(teamRoleDefinitions)
    .where(eq(teamRoleDefinitions.key, userRow.studioRole))
    .limit(1);

  return Boolean(roleDef?.permissions?.capabilities?.[capabilityKey]);
}
