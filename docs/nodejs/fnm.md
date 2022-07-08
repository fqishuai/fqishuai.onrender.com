---
tags: [管理node版本]
---

:::tip
🚀 Fast and simple Node.js version manager, built in Rust
:::

- brew install fnm
- 在终端执行以下命令：`eval "$(fnm env --use-on-cd)"`
- 在vscode的terminal执行以下命令：`eval "$(fnm env --use-on-cd)"`
- fnm -h
- fnm -V
- fnm list(fnm ls)
- fnm install
```bash
fnm install 14.14.0
fnm install 16.16.0
```
- fnm use
```bash
fnm use 14.14.0
fnm use a2
```
- fnm alias
```bash
fnm alias 16.16.0 a1
fnm alias 14.14.0 a2
```
- fnm unalias