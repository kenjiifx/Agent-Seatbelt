import chalk from "chalk";
import { startDevSession } from "../session/session.js";

export function runAgentDev(): void {
  const session = startDevSession(process.cwd());
  console.log(chalk.green("Protected agent session started."));
  console.log(`agentSessionId  : ${session.agentSessionId}`);
  console.log(`workspacePath   : ${session.workspacePath}`);
  console.log(`startedAt       : ${session.startedAt}`);
  console.log(`protectedSurfaces: ${session.protectedSurfaces.join(", ")}`);
  console.log(chalk.gray("Saved .seatbelt/session.json"));
}
