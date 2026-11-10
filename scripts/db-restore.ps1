param(
  [Parameter(Mandatory = $true)]
  [string]$BackupFile,
  [switch]$Force,
  [string]$PgBinDir = "C:\Program Files\PostgreSQL\18\bin"
)

$ErrorActionPreference = "Stop"

if (-not (Test-Path $BackupFile)) {
  Write-Error "Backup file not found: $BackupFile"
  exit 1
}

$repoRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$envFile = Join-Path $repoRoot ".env"

if (-not $env:DATABASE_URL -and (Test-Path $envFile)) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match "^\s*DATABASE_URL\s*=\s*(.+?)\s*$") {
      $val = $matches[1].Trim().Trim('"').Trim("'")
      $env:DATABASE_URL = $val
    }
  }
}

if (-not $env:DATABASE_URL) {
  Write-Error "DATABASE_URL is not set in environment or .env"
  exit 1
}

$pgRestore = Join-Path $PgBinDir "pg_restore.exe"
if (-not (Test-Path $pgRestore)) {
  $cmd = Get-Command "pg_restore" -ErrorAction SilentlyContinue
  if ($cmd) {
    $pgRestore = $cmd.Source
  } else {
    Write-Error "pg_restore.exe not found at $PgBinDir or PATH"
    exit 1
  }
}

if (-not $Force) {
  $confirm = Read-Host "This will overwrite objects in the target database from '$BackupFile'. Type RESTORE to continue"
  if ($confirm -ne "RESTORE") {
    Write-Host "Restore cancelled."
    exit 0
  }
}

Write-Host "Restoring PostgreSQL backup from $BackupFile..."
& $pgRestore "--dbname=$($env:DATABASE_URL)" "--clean" "--if-exists" "--no-owner" "--no-privileges" "$BackupFile"

if ($LASTEXITCODE -ne 0) {
  Write-Error "pg_restore failed with exit code $LASTEXITCODE"
  exit $LASTEXITCODE
}

Write-Host "Database restore completed successfully."

