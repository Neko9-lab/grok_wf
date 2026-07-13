#!/usr/bin/env python3
"""Install GWF git hooks (blast-radius pre-commit gate).

Usage:
  python .gwf/scripts/install_git_hooks.py
  python .gwf/scripts/install_git_hooks.py --force
  python .gwf/scripts/install_git_hooks.py --uninstall
"""
from __future__ import annotations

import argparse
import os
import stat
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common.util import find_gwf_root, project_root  # noqa: E402

MARKER_BEGIN = "# >>> gwf-pre-commit"
MARKER_END = "# <<< gwf-pre-commit"

# Not an f-string: shell uses { } extensively.
HOOK_BODY = (
    MARKER_BEGIN
    + """
# GWF blast-radius gate - blocks commits that violate active task scope.json
# Installed by: python .gwf/scripts/install_git_hooks.py
# Skip once: git commit --no-verify   (not recommended on large repos)

ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
cd "$ROOT" || exit 0

if [ ! -f .gwf/scripts/check_scope.py ]; then
  exit 0
fi

# Prefer `python` first - on Windows `python3` is often a Store stub that fails.
run_scope_check() {
  if command -v python >/dev/null 2>&1; then
    python .gwf/scripts/check_scope.py --pre-commit
    return $?
  fi
  if command -v py >/dev/null 2>&1; then
    py -3 .gwf/scripts/check_scope.py --pre-commit
    return $?
  fi
  if command -v python3 >/dev/null 2>&1; then
    python3 .gwf/scripts/check_scope.py --pre-commit
    return $?
  fi
  echo "GWF pre-commit: python not found; skip scope gate" >&2
  return 0
}

run_scope_check
status=$?
if [ "$status" -ne 0 ]; then
  exit "$status"
fi
"""
    + MARKER_END
    + "\n"
)


def git_hooks_dir(root: Path) -> Path:
    # Respect core.hooksPath if set
    import subprocess

    r = subprocess.run(
        ["git", "rev-parse", "--git-path", "hooks"],
        cwd=str(root),
        capture_output=True,
        text=True,
        check=False,
    )
    if r.returncode == 0 and r.stdout.strip():
        p = Path(r.stdout.strip())
        if not p.is_absolute():
            p = root / p
        return p
    return root / ".git" / "hooks"


def install(root: Path, force: bool) -> str:
    hooks = git_hooks_dir(root)
    hooks.mkdir(parents=True, exist_ok=True)
    path = hooks / "pre-commit"

    if path.is_file():
        existing = path.read_text(encoding="utf-8", errors="replace")
        if MARKER_BEGIN in existing and MARKER_END in existing and not force:
            return "already-installed"
        if MARKER_BEGIN in existing and MARKER_END in existing and force:
            # replace marked section
            pre = existing.split(MARKER_BEGIN)[0]
            post = existing.split(MARKER_END, 1)[1]
            # drop leading newline from post
            if post.startswith("\n"):
                post = post[1:]
            body = pre.rstrip() + "\n\n" + HOOK_BODY
            if post.strip():
                body = body.rstrip() + "\n\n" + post.lstrip()
            path.write_text(body if body.endswith("\n") else body + "\n", encoding="utf-8")
        elif force or not existing.strip():
            shebang = "#!/bin/sh\n"
            path.write_text(shebang + "\n" + HOOK_BODY, encoding="utf-8")
        else:
            # append GWF block to existing hook
            sep = "" if existing.endswith("\n") else "\n"
            path.write_text(existing + sep + "\n" + HOOK_BODY, encoding="utf-8")
    else:
        path.write_text("#!/bin/sh\n\n" + HOOK_BODY, encoding="utf-8")

    # executable bit (no-op meaningful on Windows, fine on Unix)
    try:
        mode = path.stat().st_mode
        path.chmod(mode | stat.S_IXUSR | stat.S_IXGRP | stat.S_IXOTH)
    except OSError:
        pass

    return "installed"


def uninstall(root: Path) -> str:
    hooks = git_hooks_dir(root)
    path = hooks / "pre-commit"
    if not path.is_file():
        return "missing"
    text = path.read_text(encoding="utf-8", errors="replace")
    if MARKER_BEGIN not in text:
        return "not-gwf"
    pre = text.split(MARKER_BEGIN)[0]
    post = text.split(MARKER_END, 1)[1] if MARKER_END in text else ""
    new = (pre.rstrip() + "\n" + post.lstrip()).strip() + "\n"
    # if only shebang left
    stripped = "\n".join(
        ln for ln in new.splitlines() if ln.strip() and ln.strip() != "#!/bin/sh"
    )
    if not stripped.strip():
        path.unlink()
        return "removed"
    path.write_text(new if new.endswith("\n") else new + "\n", encoding="utf-8")
    return "removed-section"


def main() -> None:
    parser = argparse.ArgumentParser(description="Install GWF git hooks")
    parser.add_argument("--force", action="store_true", help="Rewrite GWF hook block")
    parser.add_argument("--uninstall", action="store_true")
    args = parser.parse_args()

    gwf = find_gwf_root()
    root = project_root(gwf)
    if not (root / ".git").exists() and not (root / ".git").is_file():
        # worktree .git can be a file
        import subprocess

        r = subprocess.run(
            ["git", "rev-parse", "--is-inside-work-tree"],
            cwd=str(root),
            capture_output=True,
            text=True,
        )
        if r.returncode != 0:
            print("ERROR: not a git repository", file=sys.stderr)
            raise SystemExit(1)

    if args.uninstall:
        result = uninstall(root)
        print(f"gwf git hooks: {result}")
        return

    result = install(root, force=args.force)
    print(f"gwf git hooks: {result}")
    print("  pre-commit → python .gwf/scripts/check_scope.py --pre-commit")
    print("  test: make an out-of-scope staged change and git commit")


if __name__ == "__main__":
    main()
