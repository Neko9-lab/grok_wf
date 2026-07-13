import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import chalk from "chalk";
import { GWF_DIR } from "../lib/paths.js";

export interface InstallHooksOptions {
  cwd: string;
  force: boolean;
  uninstall: boolean;
  /** Suppress banner (when called from init / enable-automations). */
  quiet?: boolean;
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

  if (!opts.quiet) {
    console.log(chalk.bold("\nGWF install-hooks"), chalk.dim(`@ ${projectRoot}\n`));
  }

  const result = spawnSync("python", args, {
    cwd: projectRoot,
    stdio: opts.quiet ? "pipe" : "inherit",
    shell: true,
    encoding: "utf8",
  });

  if (result.status !== 0) {
    const r2 = spawnSync("python3", args, {
      cwd: projectRoot,
      stdio: opts.quiet ? "pipe" : "inherit",
      shell: true,
      encoding: "utf8",
    });
    if (r2.status !== 0) {
      const err =
        (result.stderr || result.stdout || r2.stderr || r2.stdout || "").toString();
      throw new Error(
        `install_git_hooks.py failed (exit ${result.status ?? r2.status})${err ? `: ${err.trim()}` : ""}`,
      );
    }
  }

  if (!opts.uninstall && !opts.quiet) {
    console.log(
      chalk.green(
        "\n✓ 已安装提交检查：有进行中的 GWF 任务时，范围外的改动不能 commit。",
      ),
    );
    console.log(
      chalk.dim(
        "  紧急跳过: git commit --no-verify  |  卸载: gwf install-hooks --uninstall\n",
      ),
    );
  }
}
