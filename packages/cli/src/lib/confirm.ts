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

  const hint = defaultYes ? "Y/n" : "y/N";
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
  if (t === "y" || t === "yes") return true;
  if (t === "n" || t === "no") return false;
  return defaultYes;
}
