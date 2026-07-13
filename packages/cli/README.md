# gwf-cli

**English** | **中文**

CLI for **GWF (Grok Workflow Framework)** — **Grok Build only**.  
**GWF（Grok 工作流框架）** 命令行 — **仅支持 Grok Build**。

## Install & use / 安装与使用

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/

cd your-project
gwf init -u your-name
# Plain Chinese prompt: enable auto-load workflow + commit scope check? Enter = Yes
# 中文白话确认：开启「打开 Grok 自动加载 + 提交前范围检查」？直接回车 = 是

grok
# Describe your goal / 直接说需求
```

| Doc / 文档 | Link / 链接 |
|------------|-------------|
| Deploy & usage (bilingual) | [docs/deploy-and-usage.md](../../docs/deploy-and-usage.md) |
| 部署与使用（双语） | [docs/部署与使用.md](../../docs/部署与使用.md) |
| Changelog / 更新日志 | [CHANGELOG.md](../../CHANGELOG.md) |
| GitHub | https://github.com/Neko9-lab/grok_wf |

```bash
gwf update
gwf doctor
gwf upgrade
gwf enable-automations   # re-enable auto-load + commit checks / 补开自动加载与提交检查
gwf trust                # Grok auto-load only / 仅自动加载工作流
```

## Local monorepo / 本地 monorepo 开发

```bash
npm install
npm run build
npm link -w gwf-cli
```

## License / 许可

MIT
