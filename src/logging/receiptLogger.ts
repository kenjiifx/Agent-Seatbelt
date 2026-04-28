import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { Receipt } from "../types.js";

function logsDir(cwd: string): string {
  return path.join(cwd, ".seatbelt", "logs");
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
  const receiptHash = crypto
    .createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex");
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
