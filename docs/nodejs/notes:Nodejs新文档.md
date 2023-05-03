---
slug: doc
tags: [nodejs]
---

## 介绍Node.js
- [Node.js](https://nodejs.dev/en/) 是一个免费、开源、跨平台的 JavaScript 运行时环境，允许开发人员在浏览器之外编写命令行工具和服务器端脚本。

- Node.js 在浏览器之外运行 V8 JavaScript 引擎。

- Node.js 应用程序在单个进程（single process）中运行，无需为每个请求创建新线程（creating a new thread）。Node.js 在其标准库中提供了一组异步 I/O 原语，以防止 JavaScript 代码阻塞。Node.js provides a set of asynchronous I/O primitives in its standard library that prevent JavaScript code from blocking.

- 当 Node.js 执行 I/O 操作时，如从网络读取、访问数据库或文件系统，Node.js 不会阻塞线程和浪费 CPU 周期等待，而是会在响应返回时恢复操作。这允许 Node.js 处理数千个与单个服务器的并发连接，而​​不会引入管理线程并发的负担。When Node.js performs an I/O operation, like reading from the network, accessing a database or the filesystem, instead of blocking the thread and wasting CPU cycles waiting, Node.js will resume the operations when the response comes back. This allows Node.js to handle thousands of concurrent connections with a single server without introducing the burden of managing thread concurrency, which could be a significant source of bugs.

- 在 Node.js 中，可以毫无问题地使用新的 ECMAScript 标准，因为您不必等待所有用户更新他们的浏览器——您负责通过更改 Node.js 版本来决定使用哪个 ECMAScript 版本，您还可以通过运行带有标志的 Node.js 来启用特定的实验性功能。


## 安装Node.js
有3种最常用的方式：
### 1. the official website installer
> https://nodejs.dev/en/download/

### 2. a package manager
> https://nodejs.dev/en/download/package-manager/  比如：fnm n Nodenv等

#### fnm
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

#### n
- `npm install -g n` 或者 `brew install n`
- 查看使用n安装的列表---`n` 或者 `n ls`
- 安装---`n <version>` `n lts`
- 切换---`n run <version>` run的别名有use、as

### 3. [nvm](https://github.com/nvm-sh/nvm) 
> nvm is a popular way to run Node.js.

#### 安装及配置
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

#### 常用命令
- `nvm install <version>`
- `nvm uninstall <version>` 卸载制定的版本
- `nvm use <version>|<aliasName>` 切换使用指定的版本或别名的node
- `nvm ls` 列出所有版本
- `nvm current` 显示当前版本
- `nvm install` 安装最新版本nvm
- `nvm alias <name> <version>` 给不同的版本号添加别名
- `nvm unalias <name>` 删除已定义的别名