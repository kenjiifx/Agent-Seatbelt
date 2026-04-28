import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import YAML from "yaml";
import chalk from "chalk";
import { DEFAULT_CONFIG } from "../policy/policyEngine.js";

function guessHistoryPath(): string | null {
  const home = os.homedir();
  const candidates = [
    path.join(home, ".bash_history"),
    path.join(home, ".zsh_history"),
    path.join(home, "AppData", "Roaming", "Microsoft", "Windows", "PowerShell", "PSReadLine", "ConsoleHost_history.txt"),
  ];
  return candidates.find((p) => fs.existsSync(p)) ?? null;
}

function collectBaselinePatterns(limit: number = 120): string[] {
  const historyPath = guessHistoryPath();
  if (!historyPath) {
    return [];
  }
  const lines = fs
    .readFileSync(historyPath, "utf8")
    .split(/\r?\n/)
    .map((line: string) => line.trim())
    .filter(Boolean)
    .slice(-limit);

  const lowRiskPatterns = lines
    .filter(
      (line: string) =>
        !/(rm -rf|del \/s|rmdir \/s|\.env|token|secret|id_rsa|git push origin (main|master))/i.test(
          line,
        ),
    )
    .map((line: string) => line.split(" ")[0] ?? "")
    .filter(Boolean);

  return Array.from(new Set(lowRiskPatterns)).slice(0, 20);
}

export function runInit(options?: { seedBaseline?: boolean }): void {
  const root = process.cwd();
  const seatbeltDir = path.join(root, ".seatbelt");
  const logs = path.join(seatbeltDir, "logs");
  const configPath = path.join(seatbeltDir, "config.yml");
  const checkpointsPath = path.join(seatbeltDir, "checkpoints.json");

  fs.mkdirSync(logs, { recursive: true });
  if (!fs.existsSync(checkpointsPath)) {
    fs.writeFileSync(checkpointsPath, JSON.stringify({ checkpoints: [] }, null, 2), "utf8");
  }

  if (!fs.existsSync(configPath)) {
    const config = structuredClone(DEFAULT_CONFIG);
    if (options?.seedBaseline) {
      config.baselineAllowPatterns = collectBaselinePatterns();
    }
    fs.writeFileSync(configPath, YAML.stringify(config), "utf8");
    console.log(chalk.green("Initialized AgentSeatbelt in .seatbelt/"));
    console.log(chalk.gray(`Config: ${configPath}`));
  } else {
    console.log(chalk.yellow("Config already exists, leaving it unchanged."));
  }

  console.log(chalk.green("Logs directory ready at .seatbelt/logs/"));
  console.log(chalk.gray("Next steps:"));
  console.log(chalk.gray('  seatbelt agent dev'));
  console.log(chalk.gray('  seatbelt run "echo safe path"'));
}
