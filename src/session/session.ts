import fs from "node:fs";
import path from "node:path";
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
    return JSON.parse(fs.readFileSync(file, "utf8")) as AgentSession;
  } catch {
    return null;
  }
}

export function startDevSession(cwd: string = process.cwd()): AgentSession {
  const seatbeltDir = path.join(cwd, ".seatbelt");
  fs.mkdirSync(seatbeltDir, { recursive: true });

  const session: AgentSession = {
    agentSessionId: `as_${Date.now()}`,
    workspacePath: cwd,
    startedAt: new Date().toISOString(),
    protectedSurfaces: ["terminal", "repo", "secrets", "production"],
  };

  fs.writeFileSync(sessionFilePath(cwd), JSON.stringify(session, null, 2), "utf8");
  return session;
}
