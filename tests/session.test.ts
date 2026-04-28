import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { getActiveSession, startDevSession } from "../src/session/session.js";

const tempDirs: string[] = [];

afterEach(() => {
  for (const dir of tempDirs) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  tempDirs.length = 0;
});

function makeTempWorkspace(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "seatbelt-session-test-"));
  tempDirs.push(dir);
  return dir;
}

describe("agent session", () => {
  it("creates session file with required protected metadata", () => {
    const workspace = makeTempWorkspace();
    const session = startDevSession(workspace);
    const sessionFile = path.join(workspace, ".seatbelt", "session.json");

    expect(fs.existsSync(sessionFile)).toBe(true);
    expect(session.agentSessionId.startsWith("as_")).toBe(true);
    expect(session.workspacePath).toBe(workspace);
    expect(session.protectedSurfaces).toEqual([
      "terminal",
      "repo",
      "secrets",
      "production",
    ]);
  });

  it("reads active session from session file", () => {
    const workspace = makeTempWorkspace();
    const started = startDevSession(workspace);
    const loaded = getActiveSession(workspace);

    expect(loaded?.agentSessionId).toBe(started.agentSessionId);
    expect(loaded?.workspacePath).toBe(workspace);
  });
});
