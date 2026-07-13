import * as readline from "node:readline";

/**
 * Yes/no prompt. defaultYes=true → empty Enter means yes ([Y/n]).
 * Non-TTY: returns defaultYes (for scripts / CI).
 */
export async function confirm(
  question: string,
  defaultYes = true,
): Promise<boolean> {
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return defaultYes;
  }

  // Chinese-friendly: 是/否，回车默认
  const hint = defaultYes ? "Y/n，直接回车=是" : "y/N，直接回车=否";
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await new Promise<string>((resolve) => {
    rl.question(`${question} [${hint}] `, (a) => resolve(a));
  });
  rl.close();

  const t = answer.trim().toLowerCase();
  if (!t) return defaultYes;
  if (t === "y" || t === "yes" || t === "是" || t === "好" || t === "ok") return true;
  if (t === "n" || t === "no" || t === "否" || t === "不") return false;
  return defaultYes;
}
