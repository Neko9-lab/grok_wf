# GWF — Grok Workflow Framework

[中文](./README.md) | **English**

Out-of-the-box **AI coding workflow for Grok Build only**.

Specs, tasks, and journals live in the repo. Non-trivial work follows **Plan → Execute → Finish**.

| | |
|--|--|
| **npm** | [gwf-cli](https://www.npmjs.com/package/gwf-cli) (`gwf`) |
| **Guide (Chinese)** | [docs/使用说明.md](./docs/使用说明.md) |
| **Changelog** | [CHANGELOG.md](./CHANGELOG.md) |
| **Releases** | https://github.com/Neko9-lab/grok_wf/releases |

## Quick start

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/

cd your-project
gwf init -u your-name
# When prompted for auto-load + commit checks, press Enter for Yes

grok
# Describe what you want
```

**Requires:** Node.js ≥ 18 · Python ≥ 3.9 · Git · [Grok Build](https://x.ai/)

**Commands:** `gwf init` · `gwf update` · `gwf doctor` · `gwf upgrade` · `gwf trust`

## Develop

```bash
npm install && npm run build && npm link -w gwf-cli
```

## License

MIT
