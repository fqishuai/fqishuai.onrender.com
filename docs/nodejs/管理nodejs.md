---
slug: nodejs-tool
tags: [管理node版本]
---

## fnm
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

## [nvm](https://github.com/nvm-sh/nvm)
### 1. 安装及配置
- `brew install nvm`
- mkdir ~/.nvm
- `open -e ~/.zshrc`然后把如下配置写进去
```markdown
export NVM_DIR="$HOME/.nvm"
[ -s "/opt/homebrew/opt/nvm/nvm.sh" ] && \. "/opt/homebrew/opt/nvm/nvm.sh"  # This loads nvm
[ -s "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm" ] && \. "/opt/homebrew/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
```
- 更新配置 `source ~/.zshrc`
- 如果是在vscode的terminal操作的如上步骤，则terminal需要关闭再打开

### 2. 常用命令
- `nvm install <version>`
- `nvm uninstall <version>` 卸载制定的版本
- `nvm use <version>|<aliasName>` 切换使用指定的版本或别名的node
- `nvm ls` 列出所有版本
- `nvm current` 显示当前版本
- `nvm install` 安装最新版本nvm
- `nvm alias <name> <version>` 给不同的版本号添加别名
- `nvm unalias <name>` 删除已定义的别名

## n
- `npm install -g n` 或者 `brew install n`
- 查看使用n安装的列表---`n` 或者 `n ls`
- 安装---`n <version>` `n lts`
- 切换---`n run <version>` run的别名有use、as