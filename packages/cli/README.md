# gwf-cli

CLI for **GWF (Grok Workflow Framework)** — Grok Build only.

## Install & use

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/

cd your-project
gwf init -u your-name
# 中文二次确认：开启「打开 Grok 自动加载 + 提交前范围检查」？直接回车=是

grok
# 直接说需求
```

完整说明（中文）：仓库根目录 [docs/部署与使用.md](../../docs/部署与使用.md)  
GitHub：https://github.com/Neko9-lab/grok_wf

```bash
gwf update
gwf doctor
gwf upgrade
gwf enable-automations   # 已有项目补开自动加载/提交检查
```

## Local monorepo

```bash
npm install
npm run build
npm link -w gwf-cli
```
