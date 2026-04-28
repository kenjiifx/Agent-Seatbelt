import fs from "node:fs";
import path from "node:path";
import chalk from "chalk";
import { loadConfig } from "../policy/policyEngine.js";
import { execCapture } from "../utils/exec.js";

function checkPathWritable(targetPath: string): boolean {
  try {
    fs.mkdirSync(targetPath, { recursive: true });
    const testFile = path.join(targetPath, ".write-test");
    fs.writeFileSync(testFile, "ok", "utf8");
    fs.unlinkSync(testFile);
    return true;
  } catch {
    return false;
  }
}

export async function runDoctor(): Promise<void> {
  const cwd = process.cwd();
  const gitVersion = await execCapture("git --version", cwd);
  const seatbeltDir = path.join(cwd, ".seatbelt");
  const writable = checkPathWritable(seatbeltDir);
  let configOk = true;
  try {
    loadConfig(cwd);
  } catch {
    configOk = false;
  }

  console.log(chalk.bold("AgentSeatbelt Doctor"));
  console.log(`${gitVersion.exitCode === 0 ? "PASS" : "FAIL"} git installed`);
  console.log(`${writable ? "PASS" : "FAIL"} .seatbelt writable`);
  console.log(`${configOk ? "PASS" : "FAIL"} config parse`);
  if (!configOk) {
    console.log(chalk.yellow("Run `seatbelt init` to regenerate a valid config."));
  }
}
