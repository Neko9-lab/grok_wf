# GWF — Grok Workflow Framework

开箱即用的 **Grok Build 专用** AI 编码工作流。  
Out-of-the-box **AI coding workflow for Grok Build only**.

| | |
|--|--|
| **npm** | [gwf-cli](https://www.npmjs.com/package/gwf-cli) · command `gwf` |
| **Docs** | [使用说明](./docs/使用说明.md) |
| **Changelog** | [CHANGELOG.md](./CHANGELOG.md) |
| **Releases** | https://github.com/Neko9-lab/grok_wf/releases |

---

## 中文 · 快速开始

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/

cd 你的项目
gwf init -u 你的名字
# 提示「是否开启自动加载 + 提交检查」时，直接回车即可

grok
# 直接说需求，例如：加一个登录功能
```

**需要：** Node.js ≥ 18、Python ≥ 3.9、Git、[Grok Build](https://x.ai/)

**常用命令：** `gwf init` · `gwf update` · `gwf doctor` · `gwf upgrade`

更细的说明见 [docs/使用说明.md](./docs/使用说明.md)。

---

## English · Quick start

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/

cd your-project
gwf init -u your-name
# When prompted to enable auto-load + commit checks, press Enter for Yes

grok
# Describe what you want, e.g. add a login feature
```

**Requires:** Node.js ≥ 18, Python ≥ 3.9, Git, [Grok Build](https://x.ai/)

**Commands:** `gwf init` · `gwf update` · `gwf doctor` · `gwf upgrade`

Details (Chinese): [docs/使用说明.md](./docs/使用说明.md).

---

## What it does / 做什么

| EN | 中文 |
|----|------|
| Specs, tasks, journals live in the repo | 规范、任务、日志进仓库 |
| Plan → Execute → Finish for non-trivial work | 复杂工作走规划→实现→收尾 |
| Optional auto context in Grok (no `/start` every time) | 可选：打开 Grok 自动带上下文 |
| Optional commit gate for change scope | 可选：提交前检查改动范围 |

---

## Develop this repo / 开发本仓库

```bash
npm install && npm run build && npm link -w gwf-cli
```

## License

MIT
