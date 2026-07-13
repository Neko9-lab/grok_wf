#!/usr/bin/env python3
"""Emit compact session context for GWF / Grok hooks."""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common.util import (  # noqa: E402
    find_gwf_root,
    get_active_task_id,
    list_active_tasks,
    project_root,
    read_developer,
    read_json,
    session_key,
)


def git_lines(root: Path, *args: str) -> str:
    try:
        r = subprocess.run(
            ["git", *args],
            cwd=str(root),
            capture_output=True,
            text=True,
            check=False,
        )
        return (r.stdout or "").strip()
    except Exception:
        return ""


def extract_phase_index(workflow: str) -> str:
    lines = workflow.splitlines()
    out: list[str] = []
    for line in lines:
        if line.startswith("## Phase") or line.startswith("## Turn"):
            out.append(line)
        if line.startswith("### ") and "Phase" in line:
            out.append(line)
    if not out:
        # fallback: first 40 lines
        return "\n".join(lines[:40])
    return "\n".join(out)


def mode_default(gwf: Path) -> None:
    root = project_root(gwf)
    developer = read_developer(gwf)
    active = get_active_task_id(gwf)
    branch = git_lines(root, "rev-parse", "--abbrev-ref", "HEAD") or "(no git)"
    status = git_lines(root, "status", "--porcelain")
    dirty = f"{len(status.splitlines())} dirty paths" if status else "clean"
    recent = git_lines(root, "log", "--oneline", "-5")

    tasks = []
    for p in list_active_tasks(gwf):
        try:
            t = read_json(p / "task.json")
            tasks.append(
                {
                    "id": t.get("id"),
                    "title": t.get("title"),
                    "status": t.get("status"),
                    "assignee": t.get("assignee"),
                    "priority": t.get("priority"),
                }
            )
        except Exception:
            continue

    workflow = (gwf / "workflow.md").read_text(encoding="utf-8")
    phase_index = extract_phase_index(workflow)

    active_detail = None
    if active:
        try:
            td = gwf / "tasks" / active
            if not (td / "task.json").is_file():
                # search
                for p in list_active_tasks(gwf):
                    if read_json(p / "task.json").get("id") == active:
                        td = p
                        break
            tj = read_json(td / "task.json")
            artifacts = [
                n
                for n in (
                    "prd.md",
                    "design.md",
                    "implement.md",
                    "implement.jsonl",
                    "check.jsonl",
                )
                if (td / n).is_file()
            ]
            active_detail = {
                "id": tj.get("id"),
                "title": tj.get("title"),
                "status": tj.get("status"),
                "path": str(td.relative_to(root)).replace("\\", "/"),
                "artifacts": artifacts,
            }
        except Exception as exc:  # noqa: BLE001
            active_detail = {"id": active, "error": str(exc)}

    # journal snippet
    journal_snip = ""
    ws = gwf / "workspace" / developer
    if ws.is_dir():
        journals = sorted(ws.glob("journal-*.md"))
        if journals:
            text = journals[-1].read_text(encoding="utf-8")
            journal_snip = "\n".join(text.strip().splitlines()[-15:])

    payload = {
        "developer": developer,
        "session_key": session_key(),
        "project_root": str(root),
        "gwf_root": str(gwf),
        "git": {"branch": branch, "dirty": dirty, "recent_commits": recent},
        "active_task": active_detail,
        "tasks": tasks,
        "spec_index_paths": [
            ".gwf/spec/frontend/index.md",
            ".gwf/spec/backend/index.md",
            ".gwf/spec/guides/index.md",
        ],
        "phase_index": phase_index,
        "journal_tail": journal_snip,
        "hint": (
            "Follow .gwf/workflow.md. Full task → consent → Plan → Execute → Finish. "
            "Commands: /start /continue /finish-work."
        ),
    }
    print(json.dumps(payload, indent=2, ensure_ascii=False))


def mode_packages(gwf: Path) -> None:
    spec = gwf / "spec"
    if not spec.is_dir():
        print("[]")
        return
    rows = []
    for p in sorted(spec.rglob("index.md")):
        rel = p.relative_to(gwf.parent).as_posix()
        rows.append(rel)
    print(json.dumps(rows, indent=2))


def mode_workflow_state(gwf: Path) -> None:
    """Emit the workflow-state block body for the active task status."""
    active = get_active_task_id(gwf)
    status = "no_task"
    if active:
        try:
            from common.util import resolve_task_dir

            td = resolve_task_dir(gwf, active)
            status = read_json(td / "task.json").get("status") or "planning"
            if status == "completed":
                status = "completed"
        except SystemExit:
            status = "no_task"

    workflow = (gwf / "workflow.md").read_text(encoding="utf-8")
    begin = f"[workflow-state:{status}]"
    end = f"[/workflow-state:{status}]"
    if begin in workflow and end in workflow:
        body = workflow.split(begin, 1)[1].split(end, 1)[0].strip()
    else:
        body = "Refer to .gwf/workflow.md for current step."
    print(f"<workflow-state status=\"{status}\">\n{body}\n</workflow-state>")


def mode_record(gwf: Path) -> None:
    """Context for finish-work."""
    mode_default(gwf)


def main() -> None:
    parser = argparse.ArgumentParser(description="GWF session context")
    parser.add_argument(
        "--mode",
        default="default",
        choices=["default", "packages", "workflow-state", "record"],
    )
    args = parser.parse_args()
    gwf = find_gwf_root()
    if args.mode == "default":
        mode_default(gwf)
    elif args.mode == "packages":
        mode_packages(gwf)
    elif args.mode == "workflow-state":
        mode_workflow_state(gwf)
    elif args.mode == "record":
        mode_record(gwf)


if __name__ == "__main__":
    main()
