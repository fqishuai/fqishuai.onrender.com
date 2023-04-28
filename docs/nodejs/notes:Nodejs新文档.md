---
slug: doc
tags: [nodejs]
---

:::tip
- [Node.js](https://nodejs.dev/en/) 是一个免费、开源、跨平台的 JavaScript 运行时环境，允许开发人员在浏览器之外编写命令行工具和服务器端脚本。
- Node.js 在浏览器之外运行 V8 JavaScript 引擎。
- Node.js 应用程序在单个进程（single process）中运行，无需为每个请求创建新线程（creating a new thread）。
- 当 Node.js 执行 I/O 操作时，如从网络读取、访问数据库或文件系统，Node.js 不会阻塞线程和浪费 CPU 周期等待，而是会在响应返回时恢复操作。这允许 Node.js 处理数千个与单个服务器的并发连接，而​​不会引入管理线程并发的负担。When Node.js performs an I/O operation, like reading from the network, accessing a database or the filesystem, instead of blocking the thread and wasting CPU cycles waiting, Node.js will resume the operations when the response comes back. This allows Node.js to handle thousands of concurrent connections with a single server without introducing the burden of managing thread concurrency, which could be a significant source of bugs.
- 在 Node.js 中，可以毫无问题地使用新的 ECMAScript 标准，因为您不必等待所有用户更新他们的浏览器——您负责通过更改 Node.js 版本来决定使用哪个 ECMAScript 版本，您还可以通过运行带有标志的 Node.js 来启用特定的实验性功能。
:::