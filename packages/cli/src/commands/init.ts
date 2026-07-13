import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import chalk from "chalk";
import { printScaffoldReport, scaffoldProject } from "../lib/scaffold.js";
import { GWF_DIR } from "../lib/paths.js";
import { readText } from "../lib/fs.js";
import { enableAutomations } from "../lib/enable-automations.js";

export interface InitOptions {
  user: string;
  force: boolean;
  skipExisting: boolean;
  cwd: string;
  cliVersion: string;
  /** Skip prompt; enable git hooks + Grok trust. */
  yes: boolean;
  /** Do not install hooks / trust. */
  noAutomations: boolean;
}

function sanitizeUser(name: string): string {
  const cleaned = name.trim().replace(/[^\w.-]+/g, "-").replace(/^-+|-+$/g, "");
  if (!cleaned) throw new Error("Invalid -u/--user name");
  return cleaned;
}

async function finishWithAutomations(
  projectRoot: string,
  user: string,
  cliVersion: string,
  opts: Pick<InitOptions, "yes" | "noAutomations" | "force">,
  kind: "fresh" | "join",
): Promise<void> {
  await enableAutomations({
    projectRoot,
    yes: opts.yes,
    skip: opts.noAutomations,
    forceHooks: opts.force,
  });

  if (kind === "fresh") {
    console.log(chalk.green(`\n✓ GWF ${cliVersion} 已就绪（开发者：${user}）`));
    console.log(`
${chalk.bold("接下来怎么用：")}
  1. 在本项目目录打开 ${chalk.bold("Grok Build")}
  2. ${chalk.bold("直接说需求")}（例如：加一个登录页）
  3. 复杂功能会问你是否建任务；确认改动范围后即可实现

${chalk.dim("若打开 Grok 后它像「不认识 GWF」：再执行  gwf trust")}
`);
  } else {
    console.log(chalk.green(`\n✓ 已加入项目（开发者：${user}）`));
    console.log(chalk.dim("在本项目打开 Grok，直接说需求即可。\n"));
  }
}

export async function initCommand(opts: InitOptions): Promise<void> {
  const projectRoot = resolve(opts.cwd);
  const user = sanitizeUser(opts.user);
  const gwfDir = join(projectRoot, GWF_DIR);
  const developerPath = join(gwfDir, ".developer");
  const hasGwf = existsSync(gwfDir) && existsSync(join(gwfDir, "workflow.md"));
  const hasDeveloper = existsSync(developerPath);

  console.log(chalk.bold(`\nGWF init`), chalk.dim(`@ ${projectRoot}\n`));

  if (hasGwf && hasDeveloper) {
    const existing = readText(developerPath).trim();
    console.log(
      chalk.yellow(
        `Already initialized (developer: ${existing || "unknown"}).`,
      ),
    );
    console.log(
      chalk.dim(
        "若要重新开启「自动加载 + 提交检查」: gwf enable-automations\n" +
          "其他: gwf update | gwf doctor | gwf trust\n",
      ),
    );
    return;
  }

  // New developer on existing project
  if (hasGwf && !hasDeveloper) {
    console.log(chalk.cyan("Existing GWF project — setting up developer identity.\n"));
    const report = scaffoldProject({
      projectRoot,
      user,
      cliVersion: opts.cliVersion,
      force: opts.force,
      skipExisting: opts.skipExisting || true,
      updateOnly: false,
      isFirstInit: false,
    });
    printScaffoldReport(report);
    await finishWithAutomations(projectRoot, user, opts.cliVersion, opts, "join");
    return;
  }

  // Fresh init
  console.log(chalk.cyan("First-time setup — scaffolding .gwf/ and .grok/\n"));
  const report = scaffoldProject({
    projectRoot,
    user,
    cliVersion: opts.cliVersion,
    force: opts.force,
    skipExisting: opts.skipExisting,
    updateOnly: false,
    isFirstInit: true,
  });
  printScaffoldReport(report);

  await finishWithAutomations(projectRoot, user, opts.cliVersion, opts, "fresh");
}
