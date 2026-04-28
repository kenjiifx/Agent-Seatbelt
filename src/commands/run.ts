import readline from "node:readline/promises";
import chalk from "chalk";
import { classifyCommand } from "../risk/classifier.js";
import { loadConfig, resolvePolicyDecision } from "../policy/policyEngine.js";
import { createCheckpoint, isGitRepo } from "../git/checkpoint.js";
import { writeReceipt } from "../logging/receiptLogger.js";
import { execCommand } from "../utils/exec.js";
import { PolicyAction, Receipt } from "../types.js";

interface RunOptions {
  profile?: string;
  dryRun?: boolean;
}

function colorLevel(level: string): string {
  if (level === "critical") return chalk.red(level);
  if (level === "high") return chalk.yellow(level);
  if (level === "medium") return chalk.cyan(level);
  return chalk.green(level);
}

function printRiskPanel(
  command: string,
  risk: ReturnType<typeof classifyCommand>,
  action: PolicyAction,
  approvalRequired: boolean,
  rollbackAvailable: boolean,
): void {
  console.log(chalk.bold("\nAgentSeatbelt Risk Report"));
  console.log(chalk.gray("--------------------------------------------------"));
  console.log(`Command            : ${command}`);
  console.log(`Risk level         : ${colorLevel(risk.riskLevel)} (${risk.riskScore}/100)`);
  console.log(`Why risky          : ${risk.whyRisky.join("; ")}`);
  console.log(`Blast radius       : ${risk.blastRadius}`);
  console.log(`Policy decision    : ${action}`);
  console.log(`Approval required  : ${approvalRequired ? "yes" : "no"}`);
  console.log(`Rollback available : ${rollbackAvailable ? "yes" : "no"}`);
  if (risk.remediation.length > 0) {
    console.log(`Safe alternatives  : ${risk.remediation.join("; ")}`);
  }
  console.log(
    chalk.gray(
      "Timeline           : classify -> policy -> approval -> checkpoint -> execute -> receipt",
    ),
  );
  console.log(chalk.gray("--------------------------------------------------"));
}

async function askApproval(command: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  const response = await rl.question(
    chalk.yellow(`Approval required to run "${command}". Continue? (y/N): `),
  );
  rl.close();
  return response.trim().toLowerCase() === "y";
}

export async function runCommand(command: string, options?: RunOptions): Promise<void> {
  const cwd = process.cwd();
  const { config } = loadConfig(cwd);
  const profile = options?.profile ?? config.settings?.defaultProfile ?? "dev";
  const risk = classifyCommand(command);
  const policy = resolvePolicyDecision(risk, config, profile);
  const rollbackAvailable = await isGitRepo(cwd);

  // Always block direct secret reads by default.
  if (/\b(cat|type|get-content)\s+.*(\.env|id_rsa|\.pem|token|secret)\b/i.test(command)) {
    policy.action = "block";
    policy.approvalRequired = false;
  }

  printRiskPanel(command, risk, policy.action, policy.approvalRequired, rollbackAvailable);

  let approvedByUser: boolean | null = null;
  let executed = false;
  let exitCode: number | undefined;
  let checkpointId: string | undefined;

  if (policy.action === "block") {
    console.log(chalk.red("Blocked by AgentSeatbelt policy."));
  } else {
    if (policy.approvalRequired) {
      approvedByUser = await askApproval(command);
      if (!approvedByUser) {
        console.log(chalk.yellow("Command canceled by user."));
      }
    }

    const allowedToRun = policy.action === "allow" || approvedByUser === true;
    if (allowedToRun) {
      if ((risk.riskLevel === "high" || risk.riskLevel === "critical") && rollbackAvailable) {
        const checkpoint = await createCheckpoint(command, cwd);
        checkpointId = checkpoint?.id;
        if (checkpoint) {
          console.log(chalk.blue(`Checkpoint created: ${checkpoint.id}`));
        }
      }
      if (options?.dryRun) {
        console.log(chalk.cyan("Dry run mode: command execution skipped."));
      } else {
        executed = true;
        const result = await execCommand(command, cwd);
        exitCode = result.exitCode;
      }
    }
  }

  const receipt: Receipt = {
    id: `rcpt_${Date.now()}`,
    timestamp: new Date().toISOString(),
    command,
    profile,
    dryRun: Boolean(options?.dryRun),
    risk: {
      level: risk.riskLevel,
      score: risk.riskScore,
      whyRisky: risk.whyRisky,
      blastRadius: risk.blastRadius,
      matchedPatterns: risk.matchedPatterns,
      matchDetails: risk.matchDetails,
      remediation: risk.remediation,
    },
    policy: {
      action: policy.action,
      approvalRequired: policy.approvalRequired,
      approvedByUser,
      matchedRule: policy.matchedRule,
    },
    checkpoint: {
      available: Boolean(checkpointId),
      id: checkpointId,
    },
    execution: {
      executed,
      exitCode,
    },
  };
  const receiptPath = writeReceipt(receipt, cwd);
  console.log(chalk.gray(`Receipt: ${receiptPath}`));
}
