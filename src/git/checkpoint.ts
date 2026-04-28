import fs from "node:fs";
import path from "node:path";
import { CheckpointRecord } from "../types.js";
import { execCapture } from "../utils/exec.js";

interface CheckpointStore {
  checkpoints: CheckpointRecord[];
}

const EMPTY_STORE: CheckpointStore = { checkpoints: [] };

function checkpointPath(cwd: string): string {
  return path.join(cwd, ".seatbelt", "checkpoints.json");
}

function readStore(cwd: string): CheckpointStore {
  const file = checkpointPath(cwd);
  if (!fs.existsSync(file)) {
    return EMPTY_STORE;
  }
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as CheckpointStore;
  return parsed.checkpoints ? parsed : EMPTY_STORE;
}

function writeStore(cwd: string, store: CheckpointStore): void {
  fs.writeFileSync(checkpointPath(cwd), JSON.stringify(store, null, 2), "utf8");
}

export async function isGitRepo(cwd: string = process.cwd()): Promise<boolean> {
  const result = await execCapture("git rev-parse --is-inside-work-tree", cwd);
  return result.exitCode === 0 && result.stdout.includes("true");
}

export async function createCheckpoint(
  command: string,
  cwd: string = process.cwd(),
): Promise<CheckpointRecord | null> {
  if (!(await isGitRepo(cwd))) {
    return null;
  }

  const gitRoot = (await execCapture("git rev-parse --show-toplevel", cwd)).stdout;
  const branch = (await execCapture("git rev-parse --abbrev-ref HEAD", cwd)).stdout;
  const headSha = (await execCapture("git rev-parse HEAD", cwd)).stdout;
  const status = await execCapture("git status --porcelain", cwd);
  const dirty = status.stdout.length > 0;
  const changedFiles = status.stdout.length > 0 ? status.stdout.split("\n").length : 0;

  const checkpointId = `cp_${Date.now()}`;
  const stashMessage = `seatbelt checkpoint ${checkpointId}`;
  const stashCmd = 'git stash push -u -m "' + stashMessage + '"';
  const stashResult = await execCapture(stashCmd, cwd);
  const listResult = await execCapture("git stash list --format=\"%gd|%gs\"", cwd);
  const stashRef = listResult.stdout
    .split("\n")
    .find((line) => line.includes(stashMessage))
    ?.split("|")[0];

  const record: CheckpointRecord = {
    id: checkpointId,
    createdAt: new Date().toISOString(),
    command,
    gitRoot,
    branch,
    headSha,
    dirty,
    changedFiles,
    stashRef: stashResult.exitCode === 0 ? stashRef : undefined,
    status: "active",
  };

  const store = readStore(cwd);
  store.checkpoints.unshift(record);
  writeStore(cwd, store);
  return record;
}

export function listCheckpoints(cwd: string = process.cwd()): CheckpointRecord[] {
  return readStore(cwd).checkpoints;
}

export async function rollbackLatest(
  cwd: string = process.cwd(),
  checkpointId?: string,
): Promise<{ ok: boolean; message: string; checkpoint?: CheckpointRecord }> {
  const store = readStore(cwd);
  const checkpoint =
    checkpointId === undefined
      ? store.checkpoints.find((cp) => cp.status === "active")
      : store.checkpoints.find((cp) => cp.id === checkpointId);

  if (!checkpoint) {
    return { ok: false, message: "No active checkpoint found." };
  }
  if (!checkpoint.stashRef) {
    return { ok: false, message: "Checkpoint has no stash reference to restore.", checkpoint };
  }
  const applyResult = await execCapture(`git stash apply ${checkpoint.stashRef}`, cwd);
  if (applyResult.exitCode !== 0) {
    checkpoint.status = "failed";
    writeStore(cwd, store);
    return {
      ok: false,
      message: applyResult.stderr || "Failed to apply checkpoint stash.",
      checkpoint,
    };
  }

  checkpoint.status = "restored";
  writeStore(cwd, store);
  return { ok: true, message: "Checkpoint restored successfully.", checkpoint };
}
