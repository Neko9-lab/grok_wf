#!/usr/bin/env python3
"""Append a journal entry for the current developer."""
from __future__ import annotations

import argparse
import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from common.util import find_gwf_root, read_developer  # noqa: E402


def main() -> None:
    parser = argparse.ArgumentParser(description="Append GWF journal entry")
    parser.add_argument("--title", required=True)
    parser.add_argument("--commit", default="")
    parser.add_argument("--summary", default="")
    parser.add_argument("--task", default="")
    args = parser.parse_args()

    gwf = find_gwf_root()
    developer = read_developer(gwf)
    ws = gwf / "workspace" / developer
    ws.mkdir(parents=True, exist_ok=True)
    journal = ws / "journal-1.md"
    if not journal.is_file():
        journal.write_text(f"# Journal — {developer}\n\n", encoding="utf-8")

    ts = datetime.now().strftime("%Y-%m-%d %H:%M")
    lines = [
        f"## {ts} — {args.title}",
        "",
    ]
    if args.task:
        lines.append(f"- Task: `{args.task}`")
    if args.commit:
        lines.append(f"- Commit: `{args.commit}`")
    if args.summary:
        lines.append(f"- Summary: {args.summary}")
    lines.append("")

    with journal.open("a", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")

    # Update index
    index = ws / "index.md"
    if not index.is_file():
        index.write_text(f"# {developer}'s workspace\n\n", encoding="utf-8")
    with index.open("a", encoding="utf-8") as f:
        f.write(f"- {ts}: {args.title}\n")

    print(str(journal))


if __name__ == "__main__":
    main()
