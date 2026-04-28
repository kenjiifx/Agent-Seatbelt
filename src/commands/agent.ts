import chalk from "chalk";
import { getActiveSession, startDevSession } from "../session/session.js";

export function runAgentDev(): void {
  const existing = getActiveSession(process.cwd());
  const session = startDevSession(process.cwd());
  if (existing) {
    console.log(chalk.yellow("Protected agent session already active."));
  } else {
    console.log(chalk.green("Protected agent session started."));
  }
  console.log(`agentSessionId  : ${session.agentSessionId}`);
  console.log(`workspacePath   : ${session.workspacePath}`);
  console.log(`startedAt       : ${session.startedAt}`);
  console.log(`protectedSurfaces: ${session.protectedSurfaces.join(", ")}`);
  console.log(chalk.gray("Saved .seatbelt/session.json"));
  console.log(chalk.gray('Next: seatbelt run "echo safe path" --dry-run'));
}
