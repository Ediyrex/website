import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { logger } from "@/lib/server/logger";

export async function GET() {
  const db = getDb();

  if (!db) {
    return NextResponse.json({
      status: "ok",
      service: "Ediyrex API",
      version: "v1",
      database: "not_configured",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    await db.execute(sql`SELECT 1`);
    return NextResponse.json({
      status: "ok",
      service: "Ediyrex API",
      version: "v1",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    logger.error({ err }, "Database health check failed");
    return NextResponse.json(
      {
        status: "degraded",
        service: "Ediyrex API",
        version: "v1",
        database: "unreachable",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
