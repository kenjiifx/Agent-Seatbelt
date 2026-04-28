import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { writeReceipt, readReceipts } from "../src/logging/receiptLogger.js";
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
    const newest = receipts[0];
    const prior = receipts[1];

    expect(newest.chainIndex).toBe(2);
    expect(prior.chainIndex).toBe(1);
    expect(newest.previousReceiptHash).toBe(prior.receiptHash);
    expect(typeof newest.receiptHash).toBe("string");
    expect(typeof prior.receiptHash).toBe("string");
  });
});
