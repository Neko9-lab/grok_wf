---
description: Orient this Grok session with GWF context (workflow, tasks, git, specs)
---

# /start — GWF session start

1. Run: `python .gwf/scripts/get_context.py`
2. Read `.gwf/workflow.md` phase index (or rely on context payload).
3. Summarize for the user:
   - Developer identity
   - Git branch / dirty state
   - Active task (if any) and other open tasks
   - Suggested next action per workflow
4. Ask what they want to work on.

Do not create a task until the user wants a full task and consents.
