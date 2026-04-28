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

  it("reuses existing valid session for same workspace", () => {
    const workspace = makeTempWorkspace();
    const first = startDevSession(workspace);
    const second = startDevSession(workspace);
    expect(second.agentSessionId).toBe(first.agentSessionId);
  });

  it("returns null for invalid session payload", () => {
    const workspace = makeTempWorkspace();
    const seatbeltDir = path.join(workspace, ".seatbelt");
    fs.mkdirSync(seatbeltDir, { recursive: true });
    fs.writeFileSync(
      path.join(seatbeltDir, "session.json"),
      JSON.stringify({ bad: "payload" }, null, 2),
      "utf8",
    );
    expect(getActiveSession(workspace)).toBeNull();
  });
});
