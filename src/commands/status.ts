import fs from "node:fs";
import path from "node:path";
import Table from "cli-table3";
import { readReceipts, verifyReceiptChain } from "../logging/receiptLogger.js";
import { getActiveSession } from "../session/session.js";
import { listCheckpoints, isGitRepo } from "../git/checkpoint.js";

export async function runStatus(options?: { json?: boolean }): Promise<void> {
  const cwd = process.cwd();
  const configPath = path.join(cwd, ".seatbelt", "config.yml");
  const configExists = fs.existsSync(configPath);
  const receipts = readReceipts(cwd);
  const chain = verifyReceiptChain(cwd);
  const session = getActiveSession(cwd);
  const git = await isGitRepo(cwd);
  const checkpoints = listCheckpoints(cwd);

  const payload = {
    workspace: cwd,
    configExists,
    receiptCount: receipts.length,
    receiptChainValid: chain.ok,
    activeSessionId: session?.agentSessionId,
    gitRepo: git,
    checkpointCount: checkpoints.length,
  };

  if (options?.json) {
    console.log(JSON.stringify(payload, null, 2));
    return;
  }

  const table = new Table({
    head: ["Signal", "Value"],
    colWidths: [24, 80],
    wordWrap: true,
  });
  table.push(
    ["Workspace", payload.workspace],
    ["Config", payload.configExists ? "present" : "missing"],
    ["Receipts", String(payload.receiptCount)],
    ["Receipt chain", payload.receiptChainValid ? "valid" : "invalid"],
    ["Active session", payload.activeSessionId ?? "none"],
    ["Git repo", payload.gitRepo ? "yes" : "no"],
    ["Checkpoints", String(payload.checkpointCount)],
  );
  console.log(table.toString());
}
