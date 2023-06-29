---
slug: roadmap/nodejs
tags: [nodejs]
---

## Introduction
- [Node.js](https://roadmap.sh/nodejs) is perfect for data-intensive and real-time applications since it uses an event-driven, non-blocking I/O model, making it lightweight and efficient. Node.js 非常适合数据密集型和实时应用程序，因为它使用事件驱动、非阻塞 I/O 模型，使其轻量且高效。

- [Node.js](https://nodejs.dev/en/) 是一个免费、开源、跨平台的 JavaScript 运行时环境，允许开发人员在浏览器之外编写命令行工具和服务器端脚本。

- [Node.js](https://www.tutorialsteacher.com/nodejs) is an open-source server side runtime environment built on Chrome's V8 JavaScript engine. It provides an event driven, non-blocking (asynchronous) I/O and cross-platform runtime environment for building highly scalable server-side applications using JavaScript. Node.js 是基于 Chrome 的 V8 JavaScript 引擎构建的开源服务器端运行时环境。它提供事件驱动、非阻塞（异步）I/O 和跨平台运行时环境，用于使用 JavaScript 构建高度可扩展的服务器端应用程序。

- Node.js 在浏览器之外运行 V8 JavaScript 引擎。

- Node.js 应用程序在单个进程（single process）中运行，无需为每个请求创建新线程（creating a new thread）。Node.js 在其标准库中提供了一组异步 I/O 原语，以防止 JavaScript 代码阻塞。Node.js provides a set of asynchronous I/O primitives in its standard library that prevent JavaScript code from blocking.

- 当 Node.js 执行 I/O 操作时，如从网络读取、访问数据库或文件系统，Node.js 不会阻塞线程和浪费 CPU 周期等待，而是会在响应返回时恢复操作。这允许 Node.js 处理数千个与单个服务器的并发连接，而​​不会引入管理线程并发的负担。When Node.js performs an I/O operation, like reading from the network, accessing a database or the filesystem, instead of blocking the thread and wasting CPU cycles waiting, Node.js will resume the operations when the response comes back. This allows Node.js to handle thousands of concurrent connections with a single server without introducing the burden of managing thread concurrency, which could be a significant source of bugs.

- 在 Node.js 中，可以毫无问题地使用新的 ECMAScript 标准，因为您不必等待所有用户更新他们的浏览器——您负责通过更改 Node.js 版本来决定使用哪个 ECMAScript 版本，您还可以通过运行带有标志的 Node.js 来启用特定的实验性功能。可以通过[node.green](https://node.green/)查看各种版本的 Node.js 中支持的 ECMAScript 功能的情况。

- Node.js supports both the `CommonJS` and `ES module systems` (since Node.js v12), this means that you can use both `require()` and `import` in Node.js.


### 安装Node.js
有3种最常用的方式：
#### 1. the official website installer
> https://nodejs.dev/en/download/

#### 2. a package manager
> https://nodejs.dev/en/download/package-manager/  比如：fnm n Nodenv等

##### fnm
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

##### n
- `npm install -g n` 或者 `brew install n`
- 查看使用n安装的列表---`n` 或者 `n ls`
- 安装---`n <version>` `n lts`
- 切换---`n run <version>` run的别名有use、as

#### 3. [nvm](https://github.com/nvm-sh/nvm) 
> nvm is a popular way to run Node.js.

##### 安装及配置
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

##### 常用命令
- `nvm install <version>`
- `nvm uninstall <version>` 卸载制定的版本
- `nvm use <version>|<aliasName>` 切换使用指定的版本或别名的node
- `nvm ls` 列出所有版本
- `nvm current` 显示当前版本
- `nvm install` 安装最新版本nvm
- `nvm alias <name> <version>` 给不同的版本号添加别名
- `nvm unalias <name>` 删除已定义的别名

### package manager for Node.js
- [npm](https://docs.npmjs.com/) is the standard package manager for Node.js.
- `npm install`
  - `npm install <package-name>@<version>` install a specific version of a package
  - `--save`(`-S`) installs and adds the entry to the package.json file dependencies
  - `--save-dev`(`-D`) installs and adds the entry to the package.json file devDependencies
  - `--no-save` installs but does not add the entry to the package.json file dependencies
  - `--save-optional`(`-O`) installs and adds the entry to the package.json file optionalDependencies
  - `--no-optional` will prevent optional dependencies from being installed

- `npm update` npm 将检查所有包是否有满足版本控制约束的更新版本。
  - `npm update <package-name>` 指定要更新的单个包

- [Yarn](https://classic.yarnpkg.com/en/) 和 [pnpm](https://pnpm.io/) 是 npm cli 的替代品。
- `devDependencies` 和 `dependencies` 之间的区别在于前者包含开发工具，如测试库，而后者与生产中的应用程序捆绑在一起。

### `NODE_ENV=production`
Node.js assumes it's always running in a development environment. Node.js 假定它始终在开发环境中运行。

You can signal Node.js that you are running in production by setting the `NODE_ENV=production` environment variable.
- `NODE_ENV=production node app.js`
- 或者将`export NODE_ENV=production`放到配置文件中，比如`.bash_profile`

## Modules
- 简单来说，模块就是一个 JavaScript 文件。 Node.js 有许多内置模块，并且随 Node.js 安装一起提供，例如 HTTP、fs、path 等。
- CommonJS 和 ESM 是 Node.js 中使用的模块系统(module system)。
- CommonJS 模块使用 `require()` 语句进行模块导入，使用 `module.exports` 进行模块导出；而 ESM 使用 `import` 和 `export`。

## Error Handling
### Error types
JavaScript has six types of errors that may occur during the execution of the script:
> [7 Types of Native Errors in JavaScript You Should Know](https://blog.bitsrc.io/types-of-native-errors-in-javascript-you-must-know-b8238d40e492)
- EvalError
>- `eval()` 是一个危险的函数，它使用与调用者相同的权限执行代码。
>- `eval()` 通常比其他替代方法更慢，因为它必须调用 JS 解释器，而许多其他结构则可被现代 JS 引擎进行优化。

```js
// 使用 eval 的糟糕代码：
function looseJsonParse(obj){
  return eval("(" + obj + ")");
}
console.log(looseJsonParse(
  "{a:(4-1), b:function(){}, c:new Date()}"
))

// 不用 eval 的更好的代码：
function looseJsonParse(obj){
  return Function('"use strict";return (' + obj + ')')();
}
console.log(looseJsonParse(
  "{a:(4-1), b:function(){}, c:new Date()}"
))
```

- RangeError
```js
const arr = [90,88]
arr.length=90**99 // RangeError: Invalid array length
// Because the number we want to increase the arr array to is out of the range specified by JS.

console.log(2**3) // 8
```

- ReferenceError 引用错误
```js
console.log(a) // ReferenceError: a is not defined
```

- SyntaxError
> syntax error occurs during parsing/compile time.

There are different stages in the JS engine our code is put through before we see those results on the terminal:
  - tokenization
  - parsing
  - interpreting

```js
let cat h = "cat"; // SyntaxError: Unexpected identifier
// the “h” was unexpected
```

- TypeError
> TypeError occurs when an operation is performed on a wrong data type.

```js
const num = 123
num.toUpperCase() // TypeError: num.toUpperCase is not a function
```

- URIError
> URI (Uniform Resource Indicator) in JS has the functions: decodeURI, decodeURIComponent, etc. URIError is thrown when there’s a problem encoding or decoding the URI.

```js
decodeURI("%") // IError: URI malformed

// “%” is not the right URI, so a URIError was thrown.
```