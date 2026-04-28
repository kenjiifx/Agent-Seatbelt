import Table from "cli-table3";
import { readReceipts } from "../logging/receiptLogger.js";
import { Receipt } from "../types.js";

interface LogsOptions {
  tail?: number;
  risk?: string;
  decision?: string;
  since?: string;
  command?: string;
  format?: "table" | "json" | "ndjson";
}

function filterReceipts(receipts: Receipt[], options: LogsOptions): Receipt[] {
  const riskSet = options.risk ? new Set(options.risk.split(",")) : null;
  const decisionSet = options.decision ? new Set(options.decision.split(",")) : null;
  const sinceDate = options.since ? new Date(options.since) : null;
  return receipts.filter((receipt) => {
    if (riskSet && !riskSet.has(receipt.risk.level)) return false;
    if (decisionSet && !decisionSet.has(receipt.policy.action)) return false;
    if (sinceDate && new Date(receipt.timestamp) < sinceDate) return false;
    if (options.command && !receipt.command.toLowerCase().includes(options.command.toLowerCase())) {
      return false;
    }
    return true;
  });
}

export function showLogs(options: LogsOptions = {}): void {
  const allReceipts = readReceipts();
  const filtered = filterReceipts(allReceipts, options).slice(0, options.tail ?? 20);

  if (options.format === "json") {
    console.log(JSON.stringify(filtered, null, 2));
    return;
  }
  if (options.format === "ndjson") {
    for (const receipt of filtered) {
      console.log(JSON.stringify(receipt));
    }
    return;
  }

  const table = new Table({
    head: ["Timestamp", "Command", "Risk", "Decision", "Approved", "Exit", "Checkpoint"],
    colWidths: [26, 35, 10, 20, 10, 8, 18],
    wordWrap: true,
  });

  filtered.forEach((r) => {
    table.push([
      r.timestamp,
      r.command,
      `${r.risk.level} (${r.risk.score})`,
      r.policy.action,
      String(r.policy.approvedByUser ?? ""),
      String(r.execution.exitCode ?? ""),
      r.checkpoint.id ?? "",
    ]);
  });

  if (filtered.length === 0) {
    console.log("No receipts found.");
    return;
  }

  console.log(table.toString());
}
