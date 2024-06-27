---
tags: [Building tool, Compiler]
---

[swc](https://swc.rs/) 是一个基于 Rust 的可扩展平台，适用于下一代快速开发工具。

SWC 可用于编译和打包。对于编译，它使用现代 JavaScript 功能获取 JavaScript / TypeScript 文件，并输出所有主要浏览器支持的有效代码。（SWC声称：SWC 在单线程上比 Babel 快 20 倍，在四核上比 Babel 快 70 倍。）

安装：`pnpm i -D @swc/cli @swc/core`

SWC 可以使用 `.swcrc` 文件进行配置。

SWC 为配置文件提供了官方的 JSON Schema。
```json title=".swcrc"
{
 "$schema": "https://swc.rs/schema.json",
}
```