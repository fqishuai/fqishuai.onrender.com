---
tags: [低代码, lowcode]
---

[teleportHQ](https://teleporthq.io/)

## [UIDL](https://docs.teleporthq.io/uidl/structure.html)
User Interface Definition Language 用户界面定义语言，由人类可读的 JSON 文档表示（JSON是许多编程语言本身支持的格式）。

## 组件生成器
### 映射
官方的 React 映射在 `@teleporthq/teleport-component-generator-react` 中维护

### 插件
:::
插件按照添加的确切顺序进行调用。
:::

- `@teleporthq/teleport-plugin-import-statements` 将处理需要生成的所有导入语句，包括本地依赖项以及项目或库依赖项


### 自定义组件生成器
[例子](https://codesandbox.io/p/sandbox/custom-component-generator-7sej7?file=%2Fsrc%2Findex.js)

## 项目生成器