param(
  [string]$BackupDir = (Join-Path (Resolve-Path (Join-Path $PSScriptRoot "..")).Path "backups"),
  [int]$RetentionDays = 14,
  [string]$PgBinDir = "C:\Program Files\PostgreSQL\18\bin"
)

$ErrorActionPreference = "Stop"

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

$pgDump = Join-Path $PgBinDir "pg_dump.exe"
if (-not (Test-Path $pgDump)) {
  $cmd = Get-Command "pg_dump" -ErrorAction SilentlyContinue
  if ($cmd) {
    $pgDump = $cmd.Source
  } else {
    Write-Error "pg_dump.exe not found at $PgBinDir or PATH"
    exit 1
  }
}

if (-not (Test-Path $BackupDir)) {
  New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$outFile = Join-Path $BackupDir "ediyrex_db_$timestamp.dump"

Write-Host "Starting PostgreSQL backup -> $outFile"
& $pgDump "--dbname=$($env:DATABASE_URL)" "--format=custom" "--no-owner" "--no-privileges" "--file=$outFile"

if ($LASTEXITCODE -ne 0) {
  if (Test-Path $outFile) { Remove-Item $outFile -Force }
  Write-Error "pg_dump failed with exit code $LASTEXITCODE"
  exit $LASTEXITCODE
}

$cutoff = (Get-Date).AddDays(-$RetentionDays)
$expired = Get-ChildItem -Path $BackupDir -Filter "ediyrex_db_*.dump" | Where-Object { $_.LastWriteTime -lt $cutoff }
foreach ($file in $expired) {
  Remove-Item $file.FullName -Force
  Write-Host "Removed expired backup: $($file.Name)"
}

$sizeKb = [Math]::Round((Get-Item $outFile).Length / 1KB, 2)
Write-Host "Backup completed successfully ($sizeKb KB): $outFile"

