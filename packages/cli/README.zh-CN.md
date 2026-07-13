# gwf-cli

[English](./README.md) | **中文**

**GWF（Grok 工作流框架）** 命令行 — **仅支持 Grok Build**。

## 安装与使用

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/

cd your-project
gwf init -u 你的名字
# 中文白话确认：开启「打开 Grok 自动加载 + 提交前范围检查」？直接回车 = 是

grok
# 直接说需求
```

| 文档 | 链接 |
|------|------|
| 部署与使用（中文） | https://github.com/Neko9-lab/grok_wf/blob/main/docs/部署与使用.md |
| Deploy & usage (EN) | https://github.com/Neko9-lab/grok_wf/blob/main/docs/deploy-and-usage.md |
| 更新日志 | https://github.com/Neko9-lab/grok_wf/blob/main/CHANGELOG.zh-CN.md |
| GitHub | https://github.com/Neko9-lab/grok_wf |

```bash
gwf update
gwf doctor
gwf upgrade
gwf enable-automations
gwf trust
```

## 本地 monorepo 开发

```bash
npm install
npm run build
npm link -w gwf-cli
```

## 许可

MIT
