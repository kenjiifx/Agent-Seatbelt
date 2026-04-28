import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const proposals = [
  { command: "echo safe path", reason: "print diagnostic" },
  { command: "cat .env", reason: "debug configuration" },
];

function latestReceiptPath() {
  const logsDir = path.join(process.cwd(), ".seatbelt", "logs");
  if (!fs.existsSync(logsDir)) return null;
  const files = fs
    .readdirSync(logsDir)
    .filter((f) => f.endsWith(".json"))
    .map((f) => path.join(logsDir, f))
    .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);
  return files[0] ?? null;
}

for (const proposal of proposals) {
  console.log(`\n[agent] proposes: ${proposal.command} (${proposal.reason})`);
  execSync(`node dist/index.js run "${proposal.command}" --dry-run`, { stdio: "inherit" });
  const receiptFile = latestReceiptPath();
  if (!receiptFile) continue;
  const receipt = JSON.parse(fs.readFileSync(receiptFile, "utf8"));
  const decision = receipt?.policy?.action;
  if (decision === "allow" && receipt?.risk?.level === "low") {
    console.log("[wrapper] safe to execute for real");
  } else {
    console.log("[wrapper] blocked from real execution by policy");
  }
}
