import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Receipt } from "../types.js";

function logsDir(cwd: string): string {
  return path.join(cwd, ".seatbelt", "logs");
}

function withChainFieldsRemoved(receipt: Receipt): Omit<Receipt, "receiptHash"> {
  const { receiptHash, ...rest } = receipt;
  void receiptHash;
  return rest;
}

export function computeReceiptHash(receipt: Receipt): string {
  const payload = withChainFieldsRemoved(receipt);
  return crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export function writeReceipt(receipt: Receipt, cwd: string = process.cwd()): string {
  const dir = logsDir(cwd);
  fs.mkdirSync(dir, { recursive: true });
  const existing = readReceipts(cwd);
  const previous = existing[0];
  const chainIndex = (previous?.chainIndex ?? 0) + 1;
  const previousReceiptHash = previous?.receiptHash;
  const payload = {
    ...receipt,
    chainIndex,
    previousReceiptHash,
  };
  const receiptHash = computeReceiptHash(payload);
  const chained: Receipt = {
    ...payload,
    receiptHash,
  };
  const fileName = `${receipt.timestamp.replaceAll(":", "-")}_${receipt.id}.json`;
  const receiptPath = path.join(dir, fileName);
  fs.writeFileSync(receiptPath, JSON.stringify(chained, null, 2), "utf8");
  return receiptPath;
}

export function readReceipts(cwd: string = process.cwd()): Receipt[] {
  const dir = logsDir(cwd);
  if (!fs.existsSync(dir)) {
    return [];
  }
  const files = fs
    .readdirSync(dir)
    .filter((name: string) => name.endsWith(".json"))
    .map((name: string) => path.join(dir, name))
    .sort((a: string, b: string) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs);

  return files.map((file: string) => JSON.parse(fs.readFileSync(file, "utf8")) as Receipt);
}

export function verifyReceiptChain(cwd: string = process.cwd()): {
  ok: boolean;
  checked: number;
  broken: number;
  issues: string[];
} {
  const receiptsDesc = readReceipts(cwd);
  const receipts = [...receiptsDesc].reverse();
  const issues: string[] = [];

  for (let i = 0; i < receipts.length; i += 1) {
    const current = receipts[i];
    if (!current) continue;
    const expectedIndex = i + 1;
    if (current.chainIndex !== expectedIndex) {
      issues.push(`Receipt ${current.id}: chainIndex ${current.chainIndex ?? "missing"} != ${expectedIndex}`);
    }
    const expectedHash = computeReceiptHash(current);
    if (current.receiptHash !== expectedHash) {
      issues.push(`Receipt ${current.id}: receiptHash mismatch`);
    }
    if (i > 0) {
      const prev = receipts[i - 1];
      if (current.previousReceiptHash !== prev?.receiptHash) {
        issues.push(`Receipt ${current.id}: previousReceiptHash link mismatch`);
      }
    } else if (current.previousReceiptHash !== undefined) {
      issues.push(`Receipt ${current.id}: first receipt must not have previousReceiptHash`);
    }
  }

  return {
    ok: issues.length === 0,
    checked: receipts.length,
    broken: issues.length,
    issues,
  };
}
