# GWF — Grok 工作流框架

[English](./README.md) | **中文**

开箱即用的 **Grok Build 专用** AI 编码工作流。

规范、任务、日志进仓库；复杂工作走 **规划 → 实现 → 收尾**。

| | |
|--|--|
| **npm** | [gwf-cli](https://www.npmjs.com/package/gwf-cli)（命令 `gwf`） |
| **使用说明** | [docs/使用说明.md](./docs/使用说明.md) |
| **更新日志** | [CHANGELOG.md](./CHANGELOG.md) |
| **Releases** | https://github.com/Neko9-lab/grok_wf/releases |

## 快速开始

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/

cd 你的项目
gwf init -u 你的名字
# 提示是否开启「自动加载 + 提交检查」时，直接回车即可

grok
# 直接说需求
```

**需要：** Node.js ≥ 18 · Python ≥ 3.9 · Git · [Grok Build](https://x.ai/)

**常用命令：** `gwf init` · `gwf update` · `gwf doctor` · `gwf upgrade` · `gwf trust`

## 开发本仓库

```bash
npm install && npm run build && npm link -w gwf-cli
```

## 许可

MIT
