import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { getDb } from "@/db";
import { logger } from "@/lib/server/logger";

export async function GET() {
  const db = getDb();
  const uptimeSeconds = Math.floor(process.uptime());
  const memoryRssMb = Math.round(process.memoryUsage().rss / (1024 * 1024));

  if (!db) {
    return NextResponse.json({
      status: "ok",
      service: "Ediyrex API",
      version: "v1",
      database: "not_configured",
      uptimeSeconds,
      memoryRssMb,
      timestamp: new Date().toISOString(),
    });
  }

  const startedAt = performance.now();
  try {
    await db.execute(sql`SELECT 1`);
    const dbLatencyMs = Math.round((performance.now() - startedAt) * 100) / 100;

    return NextResponse.json({
      status: "ok",
      service: "Ediyrex API",
      version: "v1",
      database: "connected",
      dbLatencyMs,
      uptimeSeconds,
      memoryRssMb,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    const dbLatencyMs = Math.round((performance.now() - startedAt) * 100) / 100;
    logger.error({ err, dbLatencyMs }, "Database health check failed");
    return NextResponse.json(
      {
        status: "degraded",
        service: "Ediyrex API",
        version: "v1",
        database: "unreachable",
        dbLatencyMs,
        uptimeSeconds,
        memoryRssMb,
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
