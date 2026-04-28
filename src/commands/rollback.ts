import Table from "cli-table3";
import chalk from "chalk";
import { listCheckpoints, rollbackLatest } from "../git/checkpoint.js";

interface RollbackOptions {
  list?: boolean;
  id?: string;
}

export async function runRollback(options: RollbackOptions = {}): Promise<void> {
  if (options.list) {
    const checkpoints = listCheckpoints();
    if (checkpoints.length === 0) {
      console.log("No checkpoints found.");
      return;
    }
    const table = new Table({
      head: ["ID", "Created", "Branch", "SHA", "Dirty", "Files", "Status"],
      colWidths: [18, 28, 16, 12, 8, 8, 12],
    });
    checkpoints.forEach((cp) => {
      table.push([
        cp.id,
        cp.createdAt,
        cp.branch,
        cp.headSha.slice(0, 10),
        String(cp.dirty),
        String(cp.changedFiles),
        cp.status,
      ]);
    });
    console.log(table.toString());
    return;
  }

  const result = await rollbackLatest(process.cwd(), options.id);
  if (!result.ok) {
    console.log(chalk.red(result.message));
    return;
  }
  const cp = result.checkpoint;
  if (cp) {
    console.log(
      chalk.green(
        `Restored checkpoint ${cp.id} (${cp.branch} @ ${cp.headSha.slice(0, 10)}; dirty=${cp.dirty}, files=${cp.changedFiles})`,
      ),
    );
  } else {
    console.log(chalk.green(result.message));
  }
}
