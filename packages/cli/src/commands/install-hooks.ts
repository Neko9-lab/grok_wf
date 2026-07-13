import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import chalk from "chalk";
import { GWF_DIR } from "../lib/paths.js";

export interface InstallHooksOptions {
  cwd: string;
  force: boolean;
  uninstall: boolean;
}

export async function installHooksCommand(
  opts: InstallHooksOptions,
): Promise<void> {
  const projectRoot = resolve(opts.cwd);
  const script = join(projectRoot, GWF_DIR, "scripts", "install_git_hooks.py");
  if (!existsSync(script)) {
    throw new Error(
      `Missing ${script}. Run gwf init / gwf update in this project first.`,
    );
  }

  const args = [script];
  if (opts.force) args.push("--force");
  if (opts.uninstall) args.push("--uninstall");

  console.log(chalk.bold("\nGWF install-hooks"), chalk.dim(`@ ${projectRoot}\n`));

  const result = spawnSync("python", args, {
    cwd: projectRoot,
    stdio: "inherit",
    shell: true,
  });

  if (result.status !== 0) {
    // fallback python3
    const r2 = spawnSync("python3", args, {
      cwd: projectRoot,
      stdio: "inherit",
      shell: true,
    });
    if (r2.status !== 0) {
      throw new Error(
        `install_git_hooks.py failed (exit ${result.status ?? r2.status})`,
      );
    }
  }

  if (!opts.uninstall) {
    console.log(chalk.green("\n✓ Git pre-commit will block out-of-scope commits when a GWF task is active."));
    console.log(
      chalk.dim(
        "  Emergency skip: git commit --no-verify  |  Remove: gwf install-hooks --uninstall\n",
      ),
    );
  }
}
