import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type DatabaseInstance = PostgresJsDatabase<typeof schema>;

declare global {
  var __ediyrexSql: ReturnType<typeof postgres> | undefined;
  var __ediyrexDb: DatabaseInstance | undefined;
}

/**
 * Returns a shared Drizzle + PostgreSQL client when DATABASE_URL is configured.
 * Returns null when running in local pre-database frontend preview mode.
 */
export function getDb(): DatabaseInstance | null {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    return null;
  }

  if (!globalThis.__ediyrexSql) {
    globalThis.__ediyrexSql = postgres(connectionString, {
      max: 10,
      idle_timeout: 20,
      connect_timeout: 5,
    });
  }

  if (!globalThis.__ediyrexDb) {
    globalThis.__ediyrexDb = drizzle(globalThis.__ediyrexSql, { schema });
  }

  return globalThis.__ediyrexDb;
}

export async function closeDb(): Promise<void> {
  if (globalThis.__ediyrexSql) {
    await globalThis.__ediyrexSql.end();
    globalThis.__ediyrexSql = undefined;
    globalThis.__ediyrexDb = undefined;
  }
}

export * from "./schema";

