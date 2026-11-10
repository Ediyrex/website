import "dotenv/config";
import { eq } from "drizzle-orm";
import { getDb, closeDb, users, roles, userRoles } from "./index";
import { hashPassword } from "../lib/server/password";

async function seedAdminUser() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  const displayName = process.env.ADMIN_NAME?.trim() || "Studio Admin";

  if (!email || !password || password.length < 8) {
    console.error(
      "ADMIN_EMAIL and ADMIN_PASSWORD (min 8 chars) environment variables are required to bootstrap an admin user."
    );
    process.exit(1);
  }

  const db = getDb();
  if (!db) {
    console.error("DATABASE_URL is not configured.");
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  await db.transaction(async (tx) => {
    await tx
      .insert(roles)
      .values({
        name: "admin",
        description: "Full administrative access",
      })
      .onConflictDoNothing({ target: roles.name });

    const [adminRole] = await tx
      .select({ id: roles.id })
      .from(roles)
      .where(eq(roles.name, "admin"))
      .limit(1);

    if (!adminRole) {
      throw new Error("Admin role could not be resolved.");
    }

    const [existingUser] = await tx
      .select({ id: users.id })
      .from(users)
      .where(eq(users.emailNormalized, email))
      .limit(1);

    let userId: string;
    if (existingUser) {
      await tx
        .update(users)
        .set({
          displayName,
          passwordHash,
          status: "active",
          emailVerifiedAt: new Date(),
        })
        .where(eq(users.id, existingUser.id));
      userId = existingUser.id;
    } else {
      const [created] = await tx
        .insert(users)
        .values({
          emailNormalized: email,
          displayName,
          passwordHash,
          status: "active",
          emailVerifiedAt: new Date(),
        })
        .returning({ id: users.id });
      userId = created.id;
    }

    await tx
      .insert(userRoles)
      .values({
        userId,
        roleId: adminRole.id,
      })
      .onConflictDoNothing();
  });

  console.log(`[seed-admin] Admin account ready for ${email}`);
  await closeDb();
}

seedAdminUser().catch(async (err) => {
  console.error("[seed-admin] Failed:", err);
  await closeDb();
  process.exit(1);
});

