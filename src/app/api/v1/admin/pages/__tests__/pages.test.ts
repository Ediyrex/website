import { afterAll, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { closeDb } from "@/db";

vi.mock("@/lib/server/session", () => ({
  requireAdminRole: vi.fn().mockResolvedValue({
    session: {
      sessionId: "00000000-0000-0000-0000-000000000001",
      userId: "00000000-0000-0000-0000-000000000002",
      email: "admin@ediyrex.com",
      displayName: "Studio Admin",
      roles: ["admin"],
      expiresAt: new Date(Date.now() + 60_000),
    },
  }),
}));

import { GET } from "../route";

describe("GET /api/v1/admin/pages", () => {
  it("returns 200 with seeded pages and stats when DB is connected", async () => {
    if (!process.env.DATABASE_URL) return;
    const req = new NextRequest(
      "http://localhost:3000/api/v1/admin/pages?page=1&limit=10"
    );
    const res = await GET(req);
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.meta?.stats?.totalAll).toBeGreaterThanOrEqual(7);
  });
});

afterAll(async () => {
  await closeDb();
});
