#!/usr/bin/env python3
"""GWF task lifecycle CLI."""
from __future__ import annotations

import argparse
import json
import shutil
import sys
from datetime import date
from pathlib import Path

# Allow running as script
sys.path.insert(0, str(Path(__file__).resolve().parent))
from common.util import (  # noqa: E402
    find_gwf_root,
    get_active_task_id,
    list_active_tasks,
    read_developer,
    read_json,
    resolve_task_dir,
    run_lifecycle_hooks,
    set_active_task,
    slugify,
    today_mm_dd,
    write_json,
)

JSONL_SEED = {
    "_example": (
        'Fill with {"file": "<path>", "reason": "<why>"}. '
        "Spec/research files only — no source code paths. "
        "Delete this line when done."
    )
}


def cmd_create(args: argparse.Namespace) -> None:
    gwf = find_gwf_root()
    title = args.title
    slug = args.slug or slugify(title)
    task_id = f"{today_mm_dd()}-{slug}"
    task_dir = gwf / "tasks" / task_id
    if task_dir.exists():
        # disambiguate
        n = 2
        while (gwf / "tasks" / f"{task_id}-{n}").exists():
            n += 1
        task_id = f"{task_id}-{n}"
        task_dir = gwf / "tasks" / task_id

    developer = read_developer(gwf)
    assignee = args.assignee or developer
    today = date.today().isoformat()

    task = {
        "id": task_id,
        "name": slug,
        "title": title,
        "description": args.description or "",
        "status": "planning",
        "dev_type": None,
        "scope": None,
        "package": None,
        "priority": args.priority or "P2",
        "creator": developer,
        "assignee": assignee,
        "createdAt": today,
        "completedAt": None,
        "branch": None,
        "base_branch": None,
        "worktree_path": None,
        "commit": None,
        "pr_url": None,
        "subtasks": [],
        "children": [],
        "parent": args.parent,
        "relatedFiles": [],
        "notes": "",
        "meta": {},
    }

    task_dir.mkdir(parents=True, exist_ok=True)
    write_json(task_dir / "task.json", task)
    (task_dir / "prd.md").write_text(
        f"""# PRD — {title}

## Goal

{args.description or "(describe the goal)"}

## Requirements

- 

## Acceptance criteria

- [ ] 

## Out of scope

- 

## Notes

- 
""",
        encoding="utf-8",
    )
    (task_dir / "research").mkdir(exist_ok=True)

    for name in ("implement.jsonl", "check.jsonl"):
        (task_dir / name).write_text(
            json.dumps(JSONL_SEED, ensure_ascii=False) + "\n", encoding="utf-8"
        )

    # Blast-radius contract (fill before coding on large repos)
    write_json(
        task_dir / "scope.json",
        {
            "allow_globs": [],
            "deny_globs": [],
            "max_changed_files": 25,
            "_comment": (
                "Fill allow_globs before coding. deny_globs block high-risk trees. "
                "Run: python .gwf/scripts/check_scope.py --strict-missing"
            ),
        },
    )

    if args.parent:
        parent_dir = resolve_task_dir(gwf, args.parent)
        parent = read_json(parent_dir / "task.json")
        children = list(parent.get("children") or [])
        if task_id not in children:
            children.append(task_id)
            parent["children"] = children
            write_json(parent_dir / "task.json", parent)
        task["parent"] = parent_dir.name
        write_json(task_dir / "task.json", task)

    set_active_task(gwf, task_id)
    run_lifecycle_hooks(gwf, "after_create", task_dir / "task.json")
    # Print path for shell capture
    print(str(task_dir))


def cmd_start(args: argparse.Namespace) -> None:
    gwf = find_gwf_root()
    task_dir = resolve_task_dir(gwf, args.task)
    data = read_json(task_dir / "task.json")
    if data.get("status") == "planning":
        data["status"] = "in_progress"
        write_json(task_dir / "task.json", data)
    set_active_task(gwf, data["id"])
    run_lifecycle_hooks(gwf, "after_start", task_dir / "task.json")
    print(f"started: {data['id']} (status={data['status']})")


def cmd_finish(_args: argparse.Namespace) -> None:
    gwf = find_gwf_root()
    tid = get_active_task_id(gwf)
    set_active_task(gwf, None)
    if tid:
        try:
            task_dir = resolve_task_dir(gwf, tid)
            run_lifecycle_hooks(gwf, "after_finish", task_dir / "task.json")
        except SystemExit:
            pass
        print(f"cleared active task: {tid}")
    else:
        print("no active task")


def cmd_archive(args: argparse.Namespace) -> None:
    gwf = find_gwf_root()
    task_dir = resolve_task_dir(gwf, args.task)
    data = read_json(task_dir / "task.json")
    data["status"] = "completed"
    data["completedAt"] = date.today().isoformat()
    write_json(task_dir / "task.json", data)

    ym = date.today().strftime("%Y-%m")
    archive_dir = gwf / "tasks" / "archive" / ym
    archive_dir.mkdir(parents=True, exist_ok=True)
    dest = archive_dir / task_dir.name
    if dest.exists():
        raise SystemExit(f"ERROR: archive target exists: {dest}")
    shutil.move(str(task_dir), str(dest))

    if get_active_task_id(gwf) == data["id"]:
        set_active_task(gwf, None)

    run_lifecycle_hooks(gwf, "after_archive", dest / "task.json")
    print(f"archived: {dest}")


def cmd_list(args: argparse.Namespace) -> None:
    gwf = find_gwf_root()
    developer = read_developer(gwf)
    active = get_active_task_id(gwf)
    for p in list_active_tasks(gwf):
        data = read_json(p / "task.json")
        if args.mine and data.get("assignee") != developer:
            continue
        if args.status and data.get("status") != args.status:
            continue
        mark = "*" if data.get("id") == active else " "
        parent = f" parent={data['parent']}" if data.get("parent") else ""
        print(
            f"{mark} {data.get('id')}  [{data.get('status')}]  "
            f"{data.get('priority')}  {data.get('title')}{parent}"
        )


def cmd_add_context(args: argparse.Namespace) -> None:
    gwf = find_gwf_root()
    task_dir = resolve_task_dir(gwf, args.task)
    target = args.target
    if target not in ("implement", "check"):
        raise SystemExit("target must be implement or check")
    path = Path(args.path)
    # prefer repo-relative
    try:
        rel = path.resolve().relative_to(gwf.parent.resolve()).as_posix()
    except ValueError:
        rel = path.as_posix()
    entry = {"file": rel, "reason": args.reason or ""}
    if path.is_dir():
        entry = {"file": rel, "type": "directory", "reason": args.reason or ""}
    jl = task_dir / f"{target}.jsonl"
    lines = []
    if jl.is_file():
        for line in jl.read_text(encoding="utf-8").splitlines():
            line = line.strip()
            if not line:
                continue
            try:
                obj = json.loads(line)
            except json.JSONDecodeError:
                continue
            if "_example" in obj:
                continue
            lines.append(obj)
    lines.append(entry)
    jl.write_text(
        "".join(json.dumps(x, ensure_ascii=False) + "\n" for x in lines),
        encoding="utf-8",
    )
    print(f"added to {jl.name}: {rel}")


def cmd_validate(args: argparse.Namespace) -> None:
    gwf = find_gwf_root()
    task_dir = resolve_task_dir(gwf, args.task)
    root = gwf.parent
    ok = True
    for name in ("implement.jsonl", "check.jsonl"):
        jl = task_dir / name
        if not jl.is_file():
            continue
        for i, line in enumerate(jl.read_text(encoding="utf-8").splitlines(), 1):
            line = line.strip()
            if not line:
                continue
            obj = json.loads(line)
            if "_example" in obj or "file" not in obj:
                continue
            f = root / obj["file"]
            if not f.exists():
                print(f"MISSING {name}:{i} {obj['file']}")
                ok = False
    if ok:
        print("ok")
    else:
        raise SystemExit(1)


def cmd_list_context(args: argparse.Namespace) -> None:
    gwf = find_gwf_root()
    task_dir = resolve_task_dir(gwf, args.task)
    for name in ("implement.jsonl", "check.jsonl"):
        jl = task_dir / name
        print(f"## {name}")
        if not jl.is_file():
            print("(missing)")
            continue
        for line in jl.read_text(encoding="utf-8").splitlines():
            if line.strip():
                print(line)


def cmd_set_branch(args: argparse.Namespace) -> None:
    gwf = find_gwf_root()
    task_dir = resolve_task_dir(gwf, args.task)
    data = read_json(task_dir / "task.json")
    data["branch"] = args.branch
    write_json(task_dir / "task.json", data)
    print(f"branch={args.branch}")


def cmd_set_scope(args: argparse.Namespace) -> None:
    gwf = find_gwf_root()
    task_dir = resolve_task_dir(gwf, args.task)
    data = read_json(task_dir / "task.json")
    data["scope"] = args.scope
    write_json(task_dir / "task.json", data)
    print(f"scope={args.scope}")


def cmd_set_blast_radius(args: argparse.Namespace) -> None:
    """Write/merge scope.json allow/deny globs for check_scope.py."""
    gwf = find_gwf_root()
    task_dir = resolve_task_dir(gwf, args.task)
    path = task_dir / "scope.json"
    if path.is_file():
        data = read_json(path)
    else:
        data = {"allow_globs": [], "deny_globs": [], "max_changed_files": 25}
    if args.allow:
        data["allow_globs"] = list(args.allow)
    if args.deny:
        data["deny_globs"] = list(args.deny)
    if args.max_files is not None:
        data["max_changed_files"] = args.max_files
    data.pop("_comment", None)
    write_json(path, data)
    print(json.dumps(data, indent=2, ensure_ascii=False))


def main() -> None:
    parser = argparse.ArgumentParser(prog="task.py", description="GWF task manager")
    sub = parser.add_subparsers(dest="cmd", required=True)

    p = sub.add_parser("create", help="Create a task")
    p.add_argument("title")
    p.add_argument("--slug")
    p.add_argument("--assignee")
    p.add_argument("--priority", default="P2", choices=["P0", "P1", "P2", "P3"])
    p.add_argument("--description", default="")
    p.add_argument("--parent", default=None)
    p.set_defaults(func=cmd_create)

    p = sub.add_parser("start", help="Mark task in_progress and set active")
    p.add_argument("task")
    p.set_defaults(func=cmd_start)

    p = sub.add_parser("finish", help="Clear active task for this session")
    p.set_defaults(func=cmd_finish)

    p = sub.add_parser("archive", help="Archive a completed task")
    p.add_argument("task")
    p.set_defaults(func=cmd_archive)

    p = sub.add_parser("list", help="List active tasks")
    p.add_argument("--mine", action="store_true")
    p.add_argument("--status")
    p.set_defaults(func=cmd_list)

    p = sub.add_parser("add-context", help="Add jsonl context entry")
    p.add_argument("task")
    p.add_argument("target", choices=["implement", "check"])
    p.add_argument("path")
    p.add_argument("reason", nargs="?", default="")
    p.set_defaults(func=cmd_add_context)

    p = sub.add_parser("validate", help="Validate jsonl file paths")
    p.add_argument("task")
    p.set_defaults(func=cmd_validate)

    p = sub.add_parser("list-context", help="Show jsonl entries")
    p.add_argument("task")
    p.set_defaults(func=cmd_list_context)

    p = sub.add_parser("set-branch")
    p.add_argument("task")
    p.add_argument("branch")
    p.set_defaults(func=cmd_set_branch)

    p = sub.add_parser("set-scope")
    p.add_argument("task")
    p.add_argument("scope")
    p.set_defaults(func=cmd_set_scope)

    p = sub.add_parser(
        "set-blast-radius",
        help="Set scope.json allow/deny globs for check_scope.py",
    )
    p.add_argument("task")
    p.add_argument(
        "--allow",
        nargs="*",
        default=None,
        help="allow_globs (fnmatch), e.g. 'src/foo/**' 'tests/foo/**'",
    )
    p.add_argument(
        "--deny",
        nargs="*",
        default=None,
        help="deny_globs, e.g. 'vendor/**' '**/migrations/**'",
    )
    p.add_argument("--max-files", type=int, default=None)
    p.set_defaults(func=cmd_set_blast_radius)

    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
