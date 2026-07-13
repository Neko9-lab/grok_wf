import { resolve } from "node:path";
import chalk from "chalk";
import { isGrokFolderTrusted, trustGrokFolder } from "../lib/grok-trust.js";

export interface TrustOptions {
  cwd: string;
}

export async function trustCommand(opts: TrustOptions): Promise<void> {
  const projectRoot = resolve(opts.cwd);
  console.log(chalk.bold("\nGWF trust"), chalk.dim(`@ ${projectRoot}\n`));

  if (isGrokFolderTrusted(projectRoot)) {
    console.log(chalk.green("Already trusted in ~/.grok/trusted_folders.toml"));
    console.log(
      chalk.dim("Open Grok in this folder — SessionStart should inject context.\n"),
    );
    return;
  }

  const r = trustGrokFolder(projectRoot);
  console.log(chalk.green(`✓ Grok trust ${r.action}`));
  console.log(chalk.dim(`  ${r.path}`));
  console.log(
    chalk.dim(
      "\nNext: open Grok Build in this directory (no /start needed if hooks load).\n",
    ),
  );
}
