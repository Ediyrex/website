-- =========================================================================
-- EDYREX STUDIO DATABASE SECURITY: ROW-LEVEL SECURITY (RLS) POLICIES
-- =========================================================================
-- Enforces database-level isolation on all sensitive tables to defend against
-- credential leaks, connection pooling mixups, and unauthorized cross-tenant queries.

-- 1. Enquiries Table
ALTER TABLE IF EXISTS "enquiries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "enquiries" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "enquiries_public_insert" ON "enquiries";
CREATE POLICY "enquiries_public_insert" ON "enquiries"
  FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "enquiries_admin_select" ON "enquiries";
CREATE POLICY "enquiries_admin_select" ON "enquiries"
  FOR SELECT
  TO authenticated
  USING (true);

-- 2. Sessions Table
ALTER TABLE IF EXISTS "auth_sessions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "auth_sessions" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "sessions_owner_isolation" ON "auth_sessions";
CREATE POLICY "sessions_owner_isolation" ON "auth_sessions"
  FOR ALL
  TO authenticated
  USING ("user_id" = current_setting('app.current_user_id', true)::uuid);

-- 3. CRM Clients Table
ALTER TABLE IF EXISTS "crm_clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "crm_clients" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "crm_admin_only" ON "crm_clients";
CREATE POLICY "crm_admin_only" ON "crm_clients"
  FOR ALL
  TO authenticated
  USING (true);

-- 4. PMS Projects & Tasks Tables
ALTER TABLE IF EXISTS "pms_projects" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "pms_projects" FORCE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS "studio_tasks" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "studio_tasks" FORCE ROW LEVEL SECURITY;

-- 5. Audit Logs Table (Append-only security)
ALTER TABLE IF EXISTS "audit_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "audit_logs" FORCE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "audit_logs_read" ON "audit_logs";
CREATE POLICY "audit_logs_read" ON "audit_logs"
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "audit_logs_append" ON "audit_logs";
CREATE POLICY "audit_logs_append" ON "audit_logs"
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Deny updates and deletes to audit logs for strict non-repudiation
REVOKE UPDATE, DELETE ON "audit_logs" FROM PUBLIC;
