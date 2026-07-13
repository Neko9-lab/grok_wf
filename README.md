# GWF — Grok Workflow Framework

**English** | [中文](./README.zh-CN.md)

An out-of-the-box **AI coding workflow framework for Grok Build only**.

It persists specs, tasks, and session journals in your repo, and runs a **Plan → Execute → Finish** loop so agents follow project standards. Install into any project with `gwf init`.

| | |
|--|--|
| **npm** | [gwf-cli](https://www.npmjs.com/package/gwf-cli) (command: `gwf`) |
| **Deploy & usage** | [docs/deploy-and-usage.md](./docs/deploy-and-usage.md) |
| **Changelog** | [CHANGELOG.md](./CHANGELOG.md) |
| **Releases** | https://github.com/Neko9-lab/grok_wf/releases |

---

## 30-second start

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/

cd your-project
gwf init -u your-name
# Confirm setup (default Yes): auto-load workflow in Grok + commit scope check

grok
# Describe what you want (no need for /start every time)
```

---

## Prerequisites

| Requirement | Version |
|-------------|---------|
| Node.js | >= 18.17 |
| Python | >= 3.9 |
| Git | recent |
| [Grok Build](https://x.ai/) | installed |

---

## Common commands

| Command | Purpose |
|---------|---------|
| `gwf init -u <name>` | Init project; confirm auto-load + commit checks |
| `gwf init -u <name> -y` | Same, no prompt |
| `gwf enable-automations` | Re-enable auto-load + commit checks |
| `gwf trust` | Trust folder for Grok auto context only |
| `gwf update` | Sync project templates to CLI version |
| `gwf upgrade` | Upgrade global CLI |
| `gwf doctor` | Health check |
| `gwf install-hooks` | Git pre-commit scope gate only |

---

## Layout after init

```
your-project/
├── .gwf/          # Core workflow (workflow, spec, tasks, scripts)
├── .grok/         # Grok skills / commands / hooks / agents
└── AGENTS.md      # Grok entry instructions
```

---

## Workflow (for the agent)

1. **Plan** — Clarify requirements, write `prd.md`, fill `scope.json` (allowed paths)
2. **Execute** — Implement within scope + check
3. **Finish** — Update specs, commit, archive, journal

**You mainly:** state the goal, confirm scope, approve commits.

---

## Develop this repo

```bash
npm install
npm run build
npm link -w gwf-cli
```

Full guide: [docs/deploy-and-usage.md](./docs/deploy-and-usage.md).

---

## License

MIT
