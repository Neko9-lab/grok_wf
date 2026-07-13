# gwf-cli

**English** | [中文](https://github.com/Neko9-lab/grok_wf/blob/main/packages/cli/README.zh-CN.md)

CLI for **GWF (Grok Workflow Framework)** — **Grok Build only**.

## Install & use

```bash
npm install -g gwf-cli --registry https://registry.npmjs.org/

cd your-project
gwf init -u your-name
# Confirm: auto-load workflow in Grok + commit scope check? Enter = Yes

grok
# Describe your goal
```

| Doc | Link |
|-----|------|
| Deploy & usage (EN) | https://github.com/Neko9-lab/grok_wf/blob/main/docs/deploy-and-usage.md |
| 部署与使用（中文） | https://github.com/Neko9-lab/grok_wf/blob/main/docs/部署与使用.md |
| Changelog | https://github.com/Neko9-lab/grok_wf/blob/main/CHANGELOG.md |
| GitHub | https://github.com/Neko9-lab/grok_wf |

```bash
gwf update
gwf doctor
gwf upgrade
gwf enable-automations
gwf trust
```

## Local monorepo

```bash
npm install
npm run build
npm link -w gwf-cli
```

## License

MIT
