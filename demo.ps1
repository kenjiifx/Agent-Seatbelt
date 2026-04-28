$ErrorActionPreference = "Stop"

Write-Host "== AgentSeatbelt demo (safe mode) =="
Write-Host ""

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js is required for this demo."
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
  throw "npm is required for this demo."
}

if (-not (Test-Path "dist/index.js")) {
  Write-Host "Building project first..."
  npm run build
}

$nodeBin = "node"
$cliFile = "dist/index.js"

Write-Host "1) Initialize"
& $nodeBin $cliFile init
Write-Host ""

Write-Host "2) Allow low-risk path"
& $nodeBin $cliFile run "echo safe path"
Write-Host ""

Write-Host "3) Block secret read"
& $nodeBin $cliFile run "cat .env"
Write-Host ""

Write-Host "4) Simulate destructive command (dry-run)"
& $nodeBin $cliFile run "rm -rf build" --dry-run
Write-Host ""

Write-Host "5) Simulate production deploy (dry-run)"
& $nodeBin $cliFile run "vercel --prod" --dry-run
Write-Host ""

Write-Host "6) Show recent action receipts"
& $nodeBin $cliFile logs --tail 10
Write-Host ""

Write-Host "7) Run local diagnostics"
& $nodeBin $cliFile doctor
Write-Host ""

Write-Host "Demo complete."
