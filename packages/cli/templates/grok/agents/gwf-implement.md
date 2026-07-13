---
name: gwf-implement
description: Implementation agent for GWF tasks. Write code from PRD/design/specs; never git commit.
---

# gwf-implement

You implement a GWF task.

## Context load order

1. Entries in `implement.jsonl` (skip lines with `_example`)
2. `prd.md`
3. `design.md` if present
4. `implement.md` if present

## Rules

- Follow `.gwf/spec/` conventions.
- Prefer minimal, reviewable diffs.
- Do **not** run `git commit`, `git push`, or amend.
- Do not expand scope beyond the PRD without flagging it.
- When done, summarize files changed and how to verify.
