import { describe, expect, it } from "vitest";
import {
  PREDEFINED_ROLE_DEFINITIONS,
  TEAM_CAPABILITIES,
  TEAM_MODULES,
  buildEmptyPermissions,
  inferBaseRoleSync,
} from "@/lib/server/team-rbac";
import {
  accessGroupActionSchema,
  teamBulkActionSchema,
  teamCustomRoleCreateSchema,
  teamInviteCreateSchema,
} from "@/lib/validations/cms";

describe("Team RBAC definitions and schemas", () => {
  it("defines all 6 predefined studio roles across all 9 modules", () => {
    const keys = PREDEFINED_ROLE_DEFINITIONS.map((r) => r.key);
    expect(keys).toEqual([
      "super_admin",
      "studio_admin",
      "project_manager",
      "team_lead",
      "team_member",
      "viewer",
    ]);

    for (const def of PREDEFINED_ROLE_DEFINITIONS) {
      for (const mod of TEAM_MODULES) {
        expect(def.permissions.modules[mod.key]).toBeDefined();
      }
      for (const cap of TEAM_CAPABILITIES) {
        expect(typeof def.permissions.capabilities[cap.key]).toBe("boolean");
      }
    }
  });

  it("initializes empty role permissions cleanly", () => {
    const empty = buildEmptyPermissions();
    expect(Object.keys(empty.modules)).toHaveLength(TEAM_MODULES.length);
    expect(empty.capabilities.publish).toBe(false);
    expect(empty.modules.pms.view).toBe(false);
  });

  it("maps studio roles to legacy base roles accurately", () => {
    expect(inferBaseRoleSync("super_admin")).toBe("admin");
    expect(inferBaseRoleSync("studio_admin")).toBe("admin");
    expect(inferBaseRoleSync("project_manager")).toBe("editor");
    expect(inferBaseRoleSync("team_lead")).toBe("editor");
    expect(inferBaseRoleSync("team_member")).toBe("editor");
    expect(inferBaseRoleSync("viewer")).toBe("viewer");
  });

  it("validates team invite and custom role schemas", () => {
    const validInvite = teamInviteCreateSchema.safeParse({
      fullName: "Priya Sharma",
      email: "priya@ediyrex.com",
      studioRole: "team_member",
      department: "Creative",
      projectRole: "team_member",
      expiryDays: 7,
    });
    expect(validInvite.success).toBe(true);

    const invalidCustomRole = teamCustomRoleCreateSchema.safeParse({
      key: "Invalid Key!",
      name: "Creative Lead",
      description: "Scope description",
    });
    expect(invalidCustomRole.success).toBe(false);

    const validBulk = teamBulkActionSchema.safeParse({
      action: "set_status",
      userIds: ["550e8400-e29b-41d4-a716-446655440000"],
      status: "disabled",
    });
    expect(validBulk.success).toBe(true);

    const validProjectAccess = accessGroupActionSchema.safeParse({
      action: "set_project_access",
      groupId: "550e8400-e29b-41d4-a716-446655440000",
      projectId: "550e8400-e29b-41d4-a716-446655440001",
      projectRole: "project_manager",
      allowedBoards: ["backlog", "todo", "in_progress"],
    });
    expect(validProjectAccess.success).toBe(true);
  });
});

