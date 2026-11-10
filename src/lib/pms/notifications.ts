import type { getDb } from "@/db";
import { pmsActivityLogs, pmsNotifications } from "@/db";

type DbOrTx = Pick<NonNullable<ReturnType<typeof getDb>>, "insert">;

export async function logPmsActivity(
  db: DbOrTx,
  input: {
    projectId?: string | null;
    taskId?: string | null;
    actorUserId?: string | null;
    action: string;
    summary: string;
    metadata?: Record<string, unknown>;
  }
) {
  await db.insert(pmsActivityLogs).values({
    projectId: input.projectId ?? null,
    taskId: input.taskId ?? null,
    actorUserId: input.actorUserId ?? null,
    action: input.action,
    summary: input.summary,
    metadata: input.metadata ?? {},
  });
}

export async function notifyPmsUsers(
  db: DbOrTx,
  input: {
    recipientUserIds: string[];
    actorUserId?: string | null;
    projectId?: string | null;
    taskId?: string | null;
    category: "task" | "mention" | "review" | "file" | "project";
    title: string;
    body?: string;
  }
) {
  const uniqueRecipients = Array.from(new Set(input.recipientUserIds)).filter(
    (uid) => Boolean(uid) && uid !== input.actorUserId
  );
  if (uniqueRecipients.length === 0) return;

  await db.insert(pmsNotifications).values(
    uniqueRecipients.map((recipientUserId) => ({
      recipientUserId,
      actorUserId: input.actorUserId ?? null,
      projectId: input.projectId ?? null,
      taskId: input.taskId ?? null,
      category: input.category,
      title: input.title.slice(0, 200),
      body: input.body ?? "",
      isRead: false,
    }))
  );
}

export function extractMentionedUserIds(
  text: string,
  candidates: Array<{ id: string; displayName: string; emailNormalized: string }>
): string[] {
  const lower = text.toLowerCase();
  if (!lower.includes("@")) return [];
  const matched: string[] = [];
  for (const user of candidates) {
    const nameHandle = user.displayName.toLowerCase().replace(/\s+/g, "");
    const firstHandle = user.displayName.toLowerCase().split(/\s+/)[0] || "";
    const emailLocal = user.emailNormalized.split("@")[0]?.toLowerCase() || "";
    if (
      (nameHandle && lower.includes(`@${nameHandle}`)) ||
      (firstHandle.length >= 3 &&
        new RegExp(`@${firstHandle}\\b`, "i").test(text)) ||
      (emailLocal && lower.includes(`@${emailLocal}`))
    ) {
      matched.push(user.id);
    }
  }
  return Array.from(new Set(matched));
}

