import { getDb, auditLogs } from "@/db";

export interface AuditEntryInput {
  actorUserId?: string | null;
  actorEmailSnapshot?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: Record<string, unknown>;
}

export async function recordAuditLog(entry: AuditEntryInput): Promise<void> {
  const db = getDb();
  if (!db) return;

  await db.insert(auditLogs).values({
    actorUserId: entry.actorUserId ?? null,
    actorEmailSnapshot: entry.actorEmailSnapshot ?? null,
    action: entry.action,
    entityType: entry.entityType,
    entityId: entry.entityId ?? null,
    metadata: entry.metadata ?? {},
  });
}

