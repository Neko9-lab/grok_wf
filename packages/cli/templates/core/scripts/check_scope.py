#!/usr/bin/env python3
"""Enforce AI change blast-radius for the active (or given) GWF task.

Reads ``scope.json`` next to ``task.json``:

.. code-block:: json

    {
      "allow_globs": ["scripts/**", "tests/test_foo.py"],
      "deny_globs": ["fastapi/**", "docs/**"],
      "max_changed_files": 20,
      "always_allow_globs": [".gwf/**", ".grok/**", "AGENTS.md"]
    }

Exit codes:
  0 — within scope
  1 — violations
  2 — usage / missing task
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from fnmatch import fnmatch
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common.util import (  # noqa: E402
    find_gwf_root,
    get_active_task_id,
    project_root,
    resolve_task_dir,
)

DEFAULT_ALWAYS_ALLOW = [
    ".gwf/**",
    ".grok/**",
    "AGENTS.md",
    ".gitignore",
]


def git_changed_files(root: Path, *, staged_only: bool = False) -> list[str]:
    """Paths relative to repo root (posix).

    staged_only=True  → only index (for pre-commit)
    staged_only=False → vs HEAD + staged + untracked (for interactive check)
    """
    files: set[str] = set()

    def run(*args: str) -> str:
        r = subprocess.run(
            ["git", *args],
            cwd=str(root),
            capture_output=True,
            text=True,
            check=False,
        )
        return r.stdout or ""

    if staged_only:
        outs = (run("diff", "--name-only", "--cached"),)
    else:
        outs = (
            run("diff", "--name-only", "HEAD"),
            run("diff", "--name-only", "--cached"),
            run("ls-files", "--others", "--exclude-standard"),
        )
    for out in outs:
        for line in out.splitlines():
            p = line.strip().replace("\\", "/")
            if p:
                files.add(p)
    return sorted(files)


def match_any(path: str, globs: list[str]) -> bool:
    path = path.replace("\\", "/")
    for g in globs:
        g = g.replace("\\", "/")
        if fnmatch(path, g) or fnmatch(path, g.rstrip("/")):
            return True
        # directory prefix: "fastapi/**" already; also allow "fastapi" as prefix
        if g.endswith("/**") and (path == g[:-3] or path.startswith(g[:-2])):
            return True
    return False


def load_scope(task_dir: Path) -> dict:
    p = task_dir / "scope.json"
    if not p.is_file():
        return {
            "allow_globs": [],
            "deny_globs": [],
            "max_changed_files": None,
            "always_allow_globs": DEFAULT_ALWAYS_ALLOW,
            "missing": True,
        }
    data = json.loads(p.read_text(encoding="utf-8"))
    data.setdefault("allow_globs", [])
    data.setdefault("deny_globs", [])
    data.setdefault("max_changed_files", None)
    always = data.get("always_allow_globs") or []
    data["always_allow_globs"] = list(dict.fromkeys([*DEFAULT_ALWAYS_ALLOW, *always]))
    data["missing"] = False
    return data


def check(files: list[str], scope: dict) -> list[str]:
    violations: list[str] = []
    always = scope.get("always_allow_globs") or DEFAULT_ALWAYS_ALLOW
    allow = [g for g in (scope.get("allow_globs") or []) if g and not str(g).startswith("_")]
    deny = scope.get("deny_globs") or []
    max_n = scope.get("max_changed_files")
    # Fail-closed: empty allow_globs rejects any product change (set ["**/*"] to open).
    require_allow = scope.get("require_allow_globs", True)

    # Product files only for max count (ignore gwf meta)
    product = [f for f in files if not match_any(f, always)]

    if max_n is not None and len(product) > int(max_n):
        violations.append(
            f"max_changed_files exceeded: {len(product)} > {max_n} "
            f"({', '.join(product[:12])}{'…' if len(product) > 12 else ''})"
        )

    if require_allow and not allow and product:
        violations.append(
            "allow_globs is empty but product files changed — fill blast radius "
            f"before coding ({', '.join(product[:8])}{'…' if len(product) > 8 else ''}). "
            'Tip: task.py set-blast-radius … --allow "path/**"  or allow ["**/*"] to disable.'
        )
        return violations

    for f in product:
        if deny and match_any(f, deny):
            violations.append(f"DENIED by deny_globs: {f}")
            continue
        if allow and not match_any(f, allow):
            violations.append(f"NOT in allow_globs: {f}")
    return violations


def main() -> None:
    parser = argparse.ArgumentParser(description="GWF change-scope enforcer")
    parser.add_argument("task", nargs="?", help="Task id (default: active task)")
    parser.add_argument(
        "--strict-missing",
        action="store_true",
        help="Fail if scope.json is missing (recommended for large repos)",
    )
    parser.add_argument(
        "--staged-only",
        action="store_true",
        help="Only check staged files (use in git pre-commit)",
    )
    parser.add_argument(
        "--pre-commit",
        action="store_true",
        help="Git hook mode: no active task → pass; staged-only; strict-missing",
    )
    parser.add_argument("--json", action="store_true", help="Machine-readable output")
    args = parser.parse_args()

    if args.pre_commit:
        args.staged_only = True
        args.strict_missing = True

    gwf = find_gwf_root()
    root = project_root(gwf)
    tid = args.task or get_active_task_id(gwf)
    if not tid:
        if args.pre_commit:
            print("GWF pre-commit: no active task — skip scope gate")
            raise SystemExit(0)
        print("ERROR: no active task; pass task id", file=sys.stderr)
        raise SystemExit(2)

    task_dir = resolve_task_dir(gwf, tid)
    scope = load_scope(task_dir)
    files = git_changed_files(root, staged_only=bool(args.staged_only))

    # Pure meta commits (.gwf only) while task active: still run check; always-allow covers them
    if scope.get("missing"):
        msg = f"WARN: no scope.json in {task_dir.name} — cannot enforce blast radius"
        if args.strict_missing:
            print(msg.replace("WARN", "ERROR"), file=sys.stderr)
            print(
                "Fill scope.json or: python .gwf/scripts/task.py set-blast-radius …",
                file=sys.stderr,
            )
            raise SystemExit(1)
        print(msg, file=sys.stderr)
        if args.json:
            print(json.dumps({"ok": True, "skipped": True, "files": files}, indent=2))
        else:
            print(f"changed={len(files)} (scope check skipped)")
        raise SystemExit(0)

    violations = check(files, scope)
    payload = {
        "ok": len(violations) == 0,
        "task": task_dir.name,
        "changed": files,
        "product_changed": [
            f
            for f in files
            if not match_any(f, scope.get("always_allow_globs") or DEFAULT_ALWAYS_ALLOW)
        ],
        "violations": violations,
        "scope": {
            "allow_globs": scope.get("allow_globs"),
            "deny_globs": scope.get("deny_globs"),
            "max_changed_files": scope.get("max_changed_files"),
        },
    }

    if args.json:
        print(json.dumps(payload, indent=2, ensure_ascii=False))
    else:
        mode = "staged" if args.staged_only else "worktree"
        print(f"task={task_dir.name} mode={mode}")
        print(f"changed_total={len(files)} product={len(payload['product_changed'])}")
        for f in payload["product_changed"]:
            print(f"  · {f}")
        if violations:
            print("VIOLATIONS:")
            for v in violations:
                print(f"  ✗ {v}")
            print("FAIL: diff is outside approved blast radius")
            if args.pre_commit:
                print(
                    "Commit blocked. Fix files, or update scope.json with consent, "
                    "or SKIP with: git commit --no-verify  (not recommended)",
                    file=sys.stderr,
                )
        else:
            print("OK: within scope")

    raise SystemExit(0 if not violations else 1)


if __name__ == "__main__":
    main()
