$ErrorActionPreference = "Stop"

Write-Host "== AgentSeatbelt demo (safe mode) =="
Write-Host ""

if (-not (Test-Path "dist/index.js")) {
  Write-Host "Building project first..."
  npm run build
}

$cli = "node dist/index.js"

Write-Host "1) Initialize"
Invoke-Expression "$cli init"
Write-Host ""

Write-Host "2) Allow low-risk path"
Invoke-Expression "$cli run `"echo safe path`""
Write-Host ""

Write-Host "3) Block secret read"
Invoke-Expression "$cli run `"cat .env`""
Write-Host ""

Write-Host "4) Simulate destructive command (dry-run)"
Invoke-Expression "$cli run `"rm -rf build`" --dry-run"
Write-Host ""

Write-Host "5) Simulate production deploy (dry-run)"
Invoke-Expression "$cli run `"vercel --prod`" --dry-run"
Write-Host ""

Write-Host "6) Show recent action receipts"
Invoke-Expression "$cli logs --tail 10"
Write-Host ""

Write-Host "7) Run local diagnostics"
Invoke-Expression "$cli doctor"
Write-Host ""

Write-Host "Demo complete."
