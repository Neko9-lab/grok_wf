---
name: gwf-break-loop
description: >
  Retrospective after a hard bug fix. Use when debugging took many attempts or the same class
  of bug might recur. Triggers: break loop, root cause, hard bug, prevent recurrence.
---

# gwf-break-loop

## Produce a 5-part analysis

1. **Root cause category** — missing spec / contract break / change propagation / test gap / hidden assumption
2. **Why earlier fixes failed**
3. **Prevention** — spec update, type constraint, lint, test, review checklist
4. **Blast radius** — where else the same pattern exists
5. **Knowledge solidification** — hand off to **gwf-update-spec**

Debugging value is preventing the *class* of bug, not only this instance.
