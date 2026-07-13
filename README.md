# GWF — Grok Workflow Framework

**English** | [中文](./README.zh-CN.md)

Out-of-the-box **AI coding workflow for Grok Build only**.

Specs, tasks, and journals live in your repo. Non-trivial work follows **Plan → Execute → Finish**.

| | |
|--|--|
| **npm** | [gwf-cli](https://www.npmjs.com/package/gwf-cli) (`gwf`) |
| **Guide** | [docs/使用说明.md](./docs/使用说明.md) (Chinese) |
| **Changelog** | [CHANGELOG.md](./CHANGELOG.md) |
| **Releases** | https://github.com/Neko9-lab/grok_wf/releases |

## Quick start

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/

cd your-project
gwf init -u your-name
# Prompt: enable auto-load in Grok + commit scope check? Enter = Yes

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
