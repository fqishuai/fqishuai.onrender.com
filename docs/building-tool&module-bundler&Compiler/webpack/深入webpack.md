---
slug: insight
tags: [Building tool, webpack]
---

- [webpack打包原理 ? 看完这篇你就懂了 !](https://segmentfault.com/a/1190000021494964)

:::info
- bundle 是一个立即执行函数，可以认为它是把所有模块捆绑在一起的一个巨型模块
- webpack 将所有模块打包成了 bundle 的依赖，通过一个对象注入
- webpack 通过 `__webpack_require__` 引入模块，`__webpack_require__` 就是我们使用的 `require`，被 webpack 封装了一层
:::

## tree-shaking
从 Webpack2.x 通过插件逐步实现 tree-shaking，到最近炙手可热的 Vite 构建工具也借助了 rollup 的打包能力，众所周知 Vue 和 React 也是使用 rollup 进行打包的，尤其当我们创建函数库、工具库等库的打包时，首选也是 rollup！那么到底是什么魔力让 rollup 经久不衰呢？答案也许就在 tree-shaking！

### tree-shaking的作用
本质上消除无用的 JS 代码。就是说，当引入一个模块时，并不引入整个模块的所有代码，而是只引入我需要的代码，那些我不需要的无用代码就会被”摇“掉。
> 要注意的是，tree-shaking 虽然能够消除无用代码，但仅针对 ES6 模块语法，因为 ES6 模块采用的是静态分析，从字面量对代码进行分析，可以在编译时正确判断到底加载了什么代码。对于必须执行到才知道引用什么模块的 CommonJS 动态分析模块他就束手无策了，不过我们可以通过插件支持 CommonJS 转 ES6 然后实现 tree-shaking。rollup.js 默认采用 ES 模块标准，但可以通过 rollup-plugin-commonjs 插件使之支持 CommonJS 标准。

### 为什么需要tree-shaking
减少 web 项目中 JavaScript 的无用代码，就是减小文件体积，加载文件资源的时间也就减少了，从而通过减少用户打开页面所需的等待时间，来增强用户体验。

### 什么是无用的代码
- DCE（dead code elimination）：
  - 代码不会被执行，不可到达
  - 代码执行的结果不会被用到
  - 代码只会影响死变量，只写不读

- tree-shaking 是 DCE 的一种新的实现，tree-shaking 更关注消除没有用到的代码。
- tree-shaking 更关注于消除那些引用了但并没有被使用的模块，这种消除原理依赖于 ES6 的模块特性。
- ES6 Module：
  - 只能作为模块顶层的语句出现
  - import 的模块名只能是字符串常量
  - import binding 是 immutable 的（不可改变的）

- tree-shaking：
  - 消除变量：定义的变量 如果没使用到，它们不会出现在打包后的文件中。![tree-shaking](../img/tree-shaking1.png)
  - 消除函数：仅引入但未使用到的 函数方法，不会出现在打包后的文件中。![tree-shaking](../img/tree-shaking2.png)
  - 消除类：仅引用类文件但实际代码中并未用到该类的任何方法和变量时，该类的所有代码，不会出现在打包后的文件中。![tree-shaking](../img/tree-shaking3.png)

- 相对于 Webpack，rollup 在消除副作用方面有很大优势。但对于下列情况下的副作用，rollup 也无能为力：
  - 模块中类的方法未被引用。![tree-shaking](../img/tree-shaking4.png)
  - 模块中定义的变量影响了全局变量。![tree-shaking](../img/tree-shaking5.png)

### 怎么消除无用代码
**基于作用域，在 AST 过程中对函数或全局对象形成对象记录，然后在整个形成的作用域链对象中进行匹配 import 导入的标识，最后只打包匹配的代码，而删除那些未被匹配使用的代码。**

### tree-shaking的实现流程
- rollup 中的 tree-shaking 使用 acorn 实现 AST 抽象语法树的遍历解析，acorn 和 babel 功能相同，但 acorn 更加轻量。
- rollup 使用 magic-string 工具操作字符串和生成 source-map。
![rollup_tree-shaking](../img/rollup_tree-shaking.png)
- rollup()阶段，解析源码，生成 AST tree，对 AST tree 上的每个节点进行遍历，判断出是否 include(标记避免重复打包)，是的话标记，然后生成 chunks，最后导出。
- generate()/write()阶段，根据 rollup()阶段做的标记，进行代码收集，最后生成真正用到的代码。
