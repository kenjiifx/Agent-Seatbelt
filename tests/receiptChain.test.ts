import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { writeReceipt, readReceipts, verifyReceiptChain } from "../src/logging/receiptLogger.js";
import { Receipt } from "../src/types.js";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  tempDirs.length = 0;
});

function makeTempWorkspace(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "seatbelt-receipt-test-"));
  tempDirs.push(dir);
  return dir;
}

function receiptBase(id: string, timestamp: string): Receipt {
  return {
    id,
    timestamp,
    command: "echo hi",
    profile: "dev",
    dryRun: true,
    risk: {
      level: "low",
      score: 10,
      whyRisky: ["No high-risk patterns detected."],
      blastRadius: "Limited local effect expected.",
      matchedPatterns: [],
      matchDetails: [],
      remediation: [],
    },
    policy: {
      action: "allow",
      approvalRequired: false,
      approvedByUser: null,
    },
    checkpoint: {
      available: false,
    },
    execution: {
      executed: false,
    },
  };
}

describe("receipt hash chaining", () => {
  it("writes chain index and links previous hash", () => {
    const workspace = makeTempWorkspace();
    writeReceipt(receiptBase("rcpt_1", "2026-04-28T00:00:00.000Z"), workspace);
    writeReceipt(receiptBase("rcpt_2", "2026-04-28T00:00:01.000Z"), workspace);

    const receipts = readReceipts(workspace);
    const byId = new Map(receipts.map((r) => [r.id, r]));
    const first = byId.get("rcpt_1");
    const second = byId.get("rcpt_2");

    expect(first?.chainIndex).toBe(1);
    expect(second?.chainIndex).toBe(2);
    expect(second?.previousReceiptHash).toBe(first?.receiptHash);
    expect(typeof second?.receiptHash).toBe("string");
    expect(typeof first?.receiptHash).toBe("string");
  });

  it("detects tampered receipt hash chain", () => {
    const workspace = makeTempWorkspace();
    writeReceipt(receiptBase("rcpt_1", "2026-04-28T00:00:00.000Z"), workspace);
    writeReceipt(receiptBase("rcpt_2", "2026-04-28T00:00:01.000Z"), workspace);
    const receipts = readReceipts(workspace);
    const newest = receipts[0];
    if (!newest) throw new Error("Expected receipt");
    newest.command = "echo tampered";
    const logsDir = path.join(workspace, ".seatbelt", "logs");
    const newestFile = fs
      .readdirSync(logsDir)
      .filter((n) => n.endsWith(".json"))
      .map((n) => path.join(logsDir, n))
      .sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
    if (!newestFile) throw new Error("Expected receipt file");
    fs.writeFileSync(newestFile, JSON.stringify(newest, null, 2), "utf8");
    const verified = verifyReceiptChain(workspace);
    expect(verified.ok).toBe(false);
    expect(verified.broken).toBeGreaterThan(0);
  });
});
