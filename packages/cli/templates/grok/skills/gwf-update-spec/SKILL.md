---
name: gwf-update-spec
description: >
  Promote durable learnings into .gwf/spec/. Use after non-obvious design decisions, repeated
  bugs, or new team conventions discovered during a task. Triggers: update spec, document convention,
  write guideline, gwf-update-spec.
---

# gwf-update-spec

## Goal

Turn session knowledge into **executable** specs (not vague principles).

## Steps

1. Decide what is durable (convention / pattern / decision / gotcha / forbidden pattern).
2. Choose the right file under `.gwf/spec/` (or create one and link from `index.md`).
3. Write concrete rules with good/bad examples when possible.
4. Update the layer `index.md` status to **Filled**.
5. Keep task-specific notes in the task directory, not in global specs.

## Quality bar

- Specific enough that a future agent can follow without re-asking
- Prefer signatures, contracts, and examples over slogans
