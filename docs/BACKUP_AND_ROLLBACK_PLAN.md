# Ediyrex Database Backup & Rollback Plan

## 1. Automated Daily Backups

Database backups use PostgreSQL custom binary dump format (`pg_dump --format=custom`) via `scripts/db-backup.ps1` with a default **14-day local retention window** (`backups/ediyrex_db_YYYYMMDD_HHmmss.dump`, excluded from git).

### Manual Backup Execution

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\db-backup.ps1
```

### Scheduling Daily Automated Backups (Windows Task Scheduler)

Register a daily 02:00 AM scheduled task on the database/application host:

```powershell
$action = New-ScheduledTaskAction -Execute "powershell.exe" -Argument "-NoProfile -ExecutionPolicy Bypass -File D:\Ediyrex\scripts\db-backup.ps1"
$trigger = New-ScheduledTaskTrigger -Daily -At 2:00AM
Register-ScheduledTask -TaskName "Ediyrex-Daily-PG-Backup" -Action $action -Trigger $trigger -Description "Daily PostgreSQL backup for ediyrex_db"
```

*(For managed cloud deployments, supplement with managed daily snapshots / WAL point-in-time recovery.)*

---

## 2. Database Rollback Procedure

Before applying any risky migration or release:

1. Take a pre-release snapshot:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\db-backup.ps1
   ```
2. Record the generated `.dump` filename and the current `git rev-parse HEAD` commit SHA.

### Restoring from Snapshot

1. Quiesce incoming writes (stop the Next.js server / put reverse proxy into maintenance mode).
2. Execute the restore script targeting the verified `.dump` file:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\scripts\db-restore.ps1 -BackupFile .\backups\ediyrex_db_YYYYMMDD_HHmmss.dump
   ```
3. Verify schema and data integrity:
   - Hit `GET /api/v1/health` and confirm `status: "ok"` and `database: "connected"`.
   - Confirm critical tables (`users`, `services`, `projects`, `enquiries`) match expected row counts.

---

## 3. Application Release Rollback

1. Check out the previously verified git release commit:
   ```powershell
   git checkout <previous-verified-sha>
   ```
2. Rebuild and restart the application process:
   ```powershell
   npm ci
   npm run build
   npm run start
   ```
3. Confirm `/api/v1/health` returns `200 OK` and admin login works.

