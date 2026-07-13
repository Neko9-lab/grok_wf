import chalk from "chalk";
import { installHooksCommand } from "../commands/install-hooks.js";
import { confirm } from "./confirm.js";
import { trustGrokFolder } from "./grok-trust.js";

export interface AutomationOptions {
  projectRoot: string;
  /** Skip prompt; enable recommended setup. */
  yes?: boolean;
  /** Skip automations entirely. */
  skip?: boolean;
  /** Force rewrite git hook block. */
  forceHooks?: boolean;
}

export interface AutomationResult {
  enabled: boolean;
  gitHooks: "installed" | "skipped" | "failed";
  grokTrust: "created" | "updated" | "unchanged" | "skipped" | "failed";
}

/**
 * One clear confirmation, then enable:
 * 1) Grok auto context on open
 * 2) Git blocks unsafe out-of-scope commits
 */
export async function enableAutomations(
  opts: AutomationOptions,
): Promise<AutomationResult> {
  if (opts.skip) {
    return { enabled: false, gitHooks: "skipped", grokTrust: "skipped" };
  }

  let ok = Boolean(opts.yes);
  if (!opts.yes) {
    console.log("");
    console.log(chalk.bold("还差一步（推荐开启，直接回车即可）"));
    console.log("");
    console.log("  为了「打开 Grok 就能写需求」，需要在本机做两件小事：");
    console.log("");
    console.log(
      "  " +
        chalk.cyan("① 允许本项目自动加载工作流") +
        chalk.dim("（写入 Grok 信任列表）"),
    );
    console.log(
      chalk.dim("     效果：打开 Grok 时自动带上任务/规范上下文，不用每次输入 /start"),
    );
    console.log("");
    console.log(
      "  " +
        chalk.cyan("② 提交代码前检查改动范围") +
        chalk.dim("（安装 git 钩子）"),
    );
    console.log(
      chalk.dim("     效果：防止 AI 改到任务范围外的文件被提交进仓库"),
    );
    console.log("");
    console.log(
      chalk.dim("  若选 n：仍可用 GWF，但要自己 /start，且提交不做范围检查。"),
    );
    console.log("");
    ok = await confirm("是否开启以上两项？", true);
  }

  if (!ok) {
    console.log("");
    console.log(chalk.yellow("已跳过。以后若要开启，在项目目录执行："));
    console.log(chalk.yellow("  gwf enable-automations"));
    console.log("");
    return { enabled: false, gitHooks: "skipped", grokTrust: "skipped" };
  }

  let gitHooks: AutomationResult["gitHooks"] = "failed";
  let grokTrust: AutomationResult["grokTrust"] = "failed";

  console.log("");
  console.log(chalk.dim("正在配置…"));

  try {
    await installHooksCommand({
      cwd: opts.projectRoot,
      force: Boolean(opts.forceHooks),
      uninstall: false,
      quiet: true,
    });
    gitHooks = "installed";
    console.log(chalk.green("  ✓ 已开启：提交前检查改动范围"));
  } catch (e) {
    console.error(
      chalk.red(
        `  ✗ 提交检查安装失败: ${e instanceof Error ? e.message : String(e)}`,
      ),
    );
    gitHooks = "failed";
  }

  try {
    const r = trustGrokFolder(opts.projectRoot);
    grokTrust = r.action;
    console.log(chalk.green("  ✓ 已开启：打开 Grok 自动加载工作流"));
    console.log(chalk.dim(`    (${r.action} → ${r.path})`));
  } catch (e) {
    console.error(
      chalk.red(
        `  ✗ 自动加载配置失败: ${e instanceof Error ? e.message : String(e)}`,
      ),
    );
    console.log(
      chalk.yellow("    可改用：在本项目目录执行  grok --trust"),
    );
    grokTrust = "failed";
  }

  console.log("");
  return { enabled: true, gitHooks, grokTrust };
}
