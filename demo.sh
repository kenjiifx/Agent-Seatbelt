#!/usr/bin/env bash
set -euo pipefail

echo "== AgentSeatbelt demo (safe mode) =="
echo

if [[ ! -f "dist/index.js" ]]; then
  echo "Building project first..."
  npm run build
fi

CLI="node dist/index.js"

echo "1) Initialize"
$CLI init
echo

echo "2) Allow low-risk path"
$CLI run "echo safe path"
echo

echo "3) Block secret read"
$CLI run "cat .env"
echo

echo "4) Simulate destructive command (dry-run)"
$CLI run "rm -rf build" --dry-run
echo

echo "5) Simulate production deploy (dry-run)"
$CLI run "vercel --prod" --dry-run
echo

echo "6) Show recent action receipts"
$CLI logs --tail 10
echo

echo "7) Run local diagnostics"
$CLI doctor
echo

echo "Demo complete."
