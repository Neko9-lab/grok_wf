"""Shared helpers for GWF scripts (stdlib only)."""
from __future__ import annotations

import json
import os
import re
import sys
from datetime import date, datetime
from pathlib import Path
from typing import Any


def find_gwf_root(start: Path | None = None) -> Path:
    cur = (start or Path.cwd()).resolve()
    for p in [cur, *cur.parents]:
        candidate = p / ".gwf"
        if (candidate / "workflow.md").is_file():
            return candidate
    raise SystemExit(
        "ERROR: .gwf/ not found. Run from a GWF project (gwf init -u <name>)."
    )


def project_root(gwf: Path | None = None) -> Path:
    return (gwf or find_gwf_root()).parent


def read_developer(gwf: Path) -> str:
    p = gwf / ".developer"
    if p.is_file():
        return p.read_text(encoding="utf-8").strip() or "unknown"
    return "unknown"


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(path: Path, data: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def slugify(text: str, max_len: int = 48) -> str:
    s = text.strip().lower()
    s = re.sub(r"[^\w\s-]", "", s, flags=re.UNICODE)
    s = re.sub(r"[-\s]+", "-", s).strip("-")
    if not s:
        s = "task"
    return s[:max_len].rstrip("-")


def today_mm_dd() -> str:
    return date.today().strftime("%m-%d")


def session_key() -> str:
    """Best-effort session id for per-window active task."""
    for env in (
        "GWF_SESSION_KEY",
        "GROK_SESSION_ID",
        "CLAUDE_SESSION_ID",
        "TERM_SESSION_ID",
    ):
        v = os.environ.get(env)
        if v:
            return re.sub(r"[^\w.-]+", "_", v)[:80]
    # Fallback: stable-ish per cwd+user for CLI usage
    return "default"


def active_task_path(gwf: Path) -> Path:
    return gwf / ".runtime" / "sessions" / f"{session_key()}.json"


def get_active_task_id(gwf: Path) -> str | None:
    p = active_task_path(gwf)
    if not p.is_file():
        return None
    try:
        data = read_json(p)
        return data.get("task_id") or data.get("id")
    except Exception:
        return None


def set_active_task(gwf: Path, task_id: str | None) -> None:
    p = active_task_path(gwf)
    p.parent.mkdir(parents=True, exist_ok=True)
    if task_id is None:
        if p.is_file():
            p.unlink()
        return
    write_json(
        p,
        {
            "task_id": task_id,
            "updated_at": datetime.now().isoformat(timespec="seconds"),
            "session_key": session_key(),
        },
    )


def resolve_task_dir(gwf: Path, name_or_path: str) -> Path:
    raw = Path(name_or_path)
    if raw.is_dir() and (raw / "task.json").is_file():
        return raw.resolve()
    # id or directory name under tasks/
    tasks = gwf / "tasks"
    direct = tasks / name_or_path
    if (direct / "task.json").is_file():
        return direct.resolve()
    # suffix match
    matches = [
        p
        for p in tasks.iterdir()
        if p.is_dir()
        and p.name != "archive"
        and (p / "task.json").is_file()
        and (p.name == name_or_path or p.name.endswith(name_or_path))
    ]
    if len(matches) == 1:
        return matches[0].resolve()
    if len(matches) > 1:
        names = ", ".join(m.name for m in matches)
        raise SystemExit(f"ERROR: ambiguous task id '{name_or_path}': {names}")
    raise SystemExit(f"ERROR: task not found: {name_or_path}")


def list_active_tasks(gwf: Path) -> list[Path]:
    tasks = gwf / "tasks"
    if not tasks.is_dir():
        return []
    out: list[Path] = []
    for p in sorted(tasks.iterdir()):
        if p.name == "archive" or not p.is_dir():
            continue
        if (p / "task.json").is_file():
            out.append(p)
    return out


def run_lifecycle_hooks(gwf: Path, event: str, task_json: Path) -> None:
    """Optional hooks from config.yaml — best effort, never blocks."""
    cfg_path = gwf / "config.yaml"
    if not cfg_path.is_file():
        return
    try:
        import re as _re

        text = cfg_path.read_text(encoding="utf-8")
        # Minimal YAML subset: hooks.\n  after_x:\n    - 'cmd'
        if "hooks:" not in text or event not in text:
            return
        # Very small parser for list under event key
        pattern = _re.compile(
            rf"{event}:\s*\n((?:\s+-\s+.+\n?)*)",
            _re.MULTILINE,
        )
        m = pattern.search(text)
        if not m:
            return
        cmds = []
        for line in m.group(1).splitlines():
            line = line.strip()
            if line.startswith("- "):
                cmd = line[2:].strip().strip("'\"")
                if cmd and not cmd.startswith("#"):
                    cmds.append(cmd)
        env = os.environ.copy()
        env["TASK_JSON_PATH"] = str(task_json.resolve())
        env["GWF_ROOT"] = str(gwf.resolve())
        for cmd in cmds:
            try:
                import subprocess

                subprocess.run(
                    cmd,
                    shell=True,
                    cwd=str(project_root(gwf)),
                    env=env,
                    check=False,
                )
            except Exception as exc:  # noqa: BLE001
                print(f"[WARN] hook {event} failed: {exc}", file=sys.stderr)
    except Exception as exc:  # noqa: BLE001
        print(f"[WARN] hooks parse failed: {exc}", file=sys.stderr)
