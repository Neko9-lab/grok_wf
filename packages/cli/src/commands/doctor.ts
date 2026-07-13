import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import chalk from "chalk";
import { GWF_DIR, GROK_DIR } from "../lib/paths.js";
import { readText } from "../lib/fs.js";

export interface DoctorOptions {
  cwd: string;
  cliVersion: string;
}

function checkCmd(cmd: string, args: string[]): { ok: boolean; detail: string } {
  const r = spawnSync(cmd, args, { encoding: "utf8", shell: true });
  if (r.error) return { ok: false, detail: r.error.message };
  if (r.status !== 0) return { ok: false, detail: (r.stderr || r.stdout || "").trim() };
  return { ok: true, detail: (r.stdout || "").trim().split("\n")[0] ?? "ok" };
}

export async function doctorCommand(opts: DoctorOptions): Promise<void> {
  const projectRoot = resolve(opts.cwd);
  console.log(chalk.bold("\nGWF doctor"), chalk.dim(`@ ${projectRoot}\n`));

  const checks: Array<{ name: string; ok: boolean; detail: string }> = [];

  checks.push({
    name: "CLI version",
    ok: true,
    detail: opts.cliVersion,
  });

  const node = checkCmd("node", ["-v"]);
  checks.push({ name: "Node.js", ok: node.ok, detail: node.detail });

  let py = checkCmd("python", ["--version"]);
  if (!py.ok) py = checkCmd("python3", ["--version"]);
  checks.push({ name: "Python", ok: py.ok, detail: py.detail || "not found" });

  const git = checkCmd("git", ["--version"]);
  checks.push({ name: "Git", ok: git.ok, detail: git.detail });

  const gwfDir = join(projectRoot, GWF_DIR);
  const initialized = existsSync(join(gwfDir, "workflow.md"));
  checks.push({
    name: "Project initialized",
    ok: initialized,
    detail: initialized ? ".gwf/workflow.md found" : "run gwf init -u <name>",
  });

  if (initialized) {
    const ver = existsSync(join(gwfDir, ".version"))
      ? readText(join(gwfDir, ".version")).trim()
      : "missing";
    checks.push({
      name: "Project template version",
      ok: Boolean(ver && ver !== "missing"),
      detail: ver,
    });
    checks.push({
      name: "Version match",
      ok: ver === opts.cliVersion,
      detail:
        ver === opts.cliVersion
          ? "project == CLI"
          : `project ${ver} != CLI ${opts.cliVersion} → run gwf update`,
    });

    const dev = existsSync(join(gwfDir, ".developer"))
      ? readText(join(gwfDir, ".developer")).trim()
      : "";
    checks.push({
      name: "Developer identity",
      ok: Boolean(dev),
      detail: dev || "missing .gwf/.developer — run gwf init -u <name>",
    });

    checks.push({
      name: "Grok skills",
      ok: existsSync(join(projectRoot, GROK_DIR, "skills")),
      detail: existsSync(join(projectRoot, GROK_DIR, "skills"))
        ? ".grok/skills present"
        : "missing .grok/skills",
    });

    checks.push({
      name: "Grok hooks",
      ok: existsSync(join(projectRoot, GROK_DIR, "hooks")),
      detail: existsSync(join(projectRoot, GROK_DIR, "hooks"))
        ? ".grok/hooks present (trust: grok --trust or /hooks-trust)"
        : "missing .grok/hooks",
    });

    checks.push({
      name: "AGENTS.md",
      ok: existsSync(join(projectRoot, "AGENTS.md")),
      detail: existsSync(join(projectRoot, "AGENTS.md"))
        ? "present"
        : "missing — re-run gwf update",
    });
  }

  let failed = 0;
  for (const c of checks) {
    const mark = c.ok ? chalk.green("✓") : chalk.red("✗");
    if (!c.ok) failed += 1;
    console.log(`  ${mark} ${c.name}: ${chalk.dim(c.detail)}`);
  }

  console.log(
    failed === 0
      ? chalk.green("\nAll checks passed.\n")
      : chalk.yellow(`\n${failed} check(s) need attention.\n`),
  );
  if (failed > 0) process.exitCode = 1;
}
