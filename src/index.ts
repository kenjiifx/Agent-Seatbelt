#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import { runInit } from "./commands/init.js";
import { runCommand } from "./commands/run.js";
import { showLogs } from "./commands/logs.js";
import { runRollback } from "./commands/rollback.js";
import { runDoctor } from "./commands/doctor.js";
import { runAgentDev } from "./commands/agent.js";
import { runVerify } from "./commands/verify.js";
import { runStatus } from "./commands/status.js";

const program = new Command();

program
  .name("seatbelt")
  .description("AgentSeatbelt: runtime firewall for AI coding agent terminal commands.")
  .version("0.2.0");

program.addHelpText(
  "after",
  `
Getting started:
  seatbelt init
  seatbelt agent dev
  seatbelt run "echo safe path"
  seatbelt run "rm -rf build" --dry-run
  seatbelt verify
  seatbelt status
  seatbelt logs --tail 10
`,
);

program
  .command("init")
  .description("Initialize seatbelt config, logs, and checkpoint metadata.")
  .option("--seed-baseline", "Seed low-risk baseline patterns from local shell history")
  .option("--profile <name>", "Set default profile in config (dev|strict|ci)")
  .option("--policy-pack <name>", "Initialize using policy-packs/<name>.yml")
  .action((opts) => {
    runInit({
      seedBaseline: opts.seedBaseline,
      profile: opts.profile,
      policyPack: opts.policyPack,
    });
  });

program
  .command("run")
  .description("Classify and gate command execution through seatbelt policy.")
  .argument("<command>", "Command to execute under seatbelt control")
  .option("--profile <name>", "Policy profile override (dev|strict|ci)")
  .option("--dry-run", "Show risk/policy decision and skip execution")
  .action(async (command: string, opts: { profile?: string; dryRun?: boolean }) => {
    await runCommand(command, { profile: opts.profile, dryRun: opts.dryRun });
  });

program
  .command("logs")
  .description("Show recent action receipts.")
  .option("--tail <count>", "Number of latest entries", (v) => Number(v))
  .option("--risk <levels>", "Comma-separated risk levels")
  .option("--decision <decisions>", "Comma-separated policy decisions")
  .option("--since <iso>", "ISO timestamp lower bound")
  .option("--command <text>", "Filter by command text")
  .option("--format <fmt>", "table|json|ndjson", "table")
  .action((opts) => {
    showLogs(opts);
  });

program
  .command("rollback")
  .description("Restore latest (or selected) seatbelt checkpoint in current git repo.")
  .option("--list", "List available checkpoints")
  .option("--id <checkpointId>", "Restore specific checkpoint id")
  .action(async (opts) => {
    await runRollback(opts);
  });

program.command("doctor").description("Check local seatbelt readiness.").action(runDoctor);
program
  .command("verify")
  .description("Verify action receipt hash-chain integrity.")
  .option("--json", "Output verification details as JSON")
  .action((opts) => runVerify(opts));

program
  .command("status")
  .description("Show runtime status for config, receipts, session, and checkpoints.")
  .option("--json", "Output status as JSON")
  .action(async (opts) => runStatus(opts));

const agentProgram = program
  .command("agent")
  .description("Manage protected local agent sessions.");

agentProgram.command("dev").description("Start a protected workspace dev session.").action(runAgentDev);

program.configureOutput({
  outputError: (str, write) => write(chalk.red(str)),
});

program.parseAsync(process.argv).catch((error) => {
  console.error(chalk.red(`Fatal error: ${error instanceof Error ? error.message : String(error)}`));
  process.exit(1);
});
