import chalk from "chalk";
import { verifyReceiptChain } from "../logging/receiptLogger.js";

export function runVerify(options?: { json?: boolean }): void {
  const result = verifyReceiptChain(process.cwd());
  if (options?.json) {
    console.log(JSON.stringify(result, null, 2));
    return;
  }
  if (result.ok) {
    console.log(chalk.green(`Receipt chain verified (${result.checked} receipts checked).`));
    return;
  }
  console.log(chalk.red(`Receipt chain verification failed (${result.broken} issue(s)).`));
  for (const issue of result.issues) {
    console.log(`- ${issue}`);
  }
}
