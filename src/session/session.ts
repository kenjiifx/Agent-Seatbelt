import fs from "node:fs";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { AgentSession } from "../types.js";

function sessionFilePath(cwd: string = process.cwd()): string {
  return path.join(cwd, ".seatbelt", "session.json");
}

export function getActiveSession(cwd: string = process.cwd()): AgentSession | null {
  const file = sessionFilePath(cwd);
  if (!fs.existsSync(file)) {
    return null;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Partial<AgentSession>;
    if (
      typeof parsed.agentSessionId !== "string" ||
      typeof parsed.workspacePath !== "string" ||
      typeof parsed.startedAt !== "string" ||
      !Array.isArray(parsed.protectedSurfaces)
    ) {
      return null;
    }
    if (path.resolve(parsed.workspacePath) !== path.resolve(cwd)) {
      return null;
    }
    if (!parsed.agentSessionId.startsWith("as_")) {
      return null;
    }
    return {
      agentSessionId: parsed.agentSessionId,
      workspacePath: parsed.workspacePath,
      startedAt: parsed.startedAt,
      protectedSurfaces: parsed.protectedSurfaces,
    };
  } catch {
    return null;
  }
}

export function startDevSession(cwd: string = process.cwd()): AgentSession {
  const existing = getActiveSession(cwd);
  if (existing) {
    return existing;
  }
  const seatbeltDir = path.join(cwd, ".seatbelt");
  fs.mkdirSync(seatbeltDir, { recursive: true });

  const session: AgentSession = {
    agentSessionId: `as_${randomUUID()}`,
    workspacePath: cwd,
    startedAt: new Date().toISOString(),
    protectedSurfaces: ["terminal", "repo", "secrets", "production"],
  };

  fs.writeFileSync(sessionFilePath(cwd), JSON.stringify(session, null, 2), "utf8");
  return session;
}
