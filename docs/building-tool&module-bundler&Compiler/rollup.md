---
tags: [Building tool, Module-bundler]
---

[中文文档](https://www.rollupjs.com/)

## 一、使用
### 1. 常用插件
- rollup-plugin-serve
- @rollup/plugin-node-resolve
- rollup-plugin-filesize
- rollup-plugin-uglify
:::caution
peer `rollup@">=0.66.0 <2"` from `rollup-plugin-uglify@6.0.4`
:::
:::tip
使用`rollup-plugin-terser`替代
:::
- rollup-plugin-terser
- rollup-plugin-livereload
- rollup-plugin-vue vue2.x使用5.x版本 vue3使用6.x版本
- vue-template-compiler
- postcss rollup-plugin-postcss
- @rollup/plugin-commonjs
- @rollup/plugin-babel @babel/core @babel/plugin-transform-runtime

### 2. 配置文件
#### `output.exports`
使用什么导出模式。默认为`auto`，它根据`entry`模块导出的内容猜测你的意图：
- `default` – 如果你使用 `export default ...` 仅仅导出一个东西，那适合用这个
- `named` – 如果你导出多个东西，适合用这个
- `none` – 如果你不导出任何内容 (例如，你正在构建应用程序，而不是库)，则适合用这个

`default` 和 `named`之间的区别会影响其他人如何使用文件束(bundle)。如果您使用`default`，则CommonJS用户可以执行此操作

#### `output.dir`
该选项用于指定所有生成的 chunk 被放置在哪个目录中。如果生成一个以上的 chunk，那么这个选项是必需的。否则，可以使用 `output.file` 选项来代替。

#### `output.globals`
该选项用于在 umd 或 iife bundle 中，使用 `id: variableName` 键值对指定外部依赖。例如，在这样的情况下：`import $ from 'jquery';`，我们需要告诉 Rollup `jquery` 是外部依赖，`jquery` 模块的 ID 为全局变量 `$`：
```js title="rollup.config.js"
// rollup.config.js
export default {
  ...,
  external: ['jquery'],
  output: {
    format: 'iife',
    name: 'MyBundle',
    globals: {
      jquery: '$'
    }
  }
};
```
使用：
```js
var MyBundle = (function ($) {
  // 这里编辑代码
}($));
```

## 二、基于vue的组件rollup打包
### 1. vue-sfc-rollup
:::tip
[vue-sfc-rollup](https://www.npmjs.com/package/vue-sfc-rollup)
:::
- 1）使用
  - npx vue-sfc-rollup
  ```markdown
  Then...
  # Fill in prompts

  # Navigate to library folder
  cd path/to/my-component-or-lib
  npm install

  # Do dev stuff
  npm run serve

  # Run build process
  npm run build

  # Ready to publish!
  ```

- 2）遇到的问题
  - a）写了多个sfc，使用时import多个但只能注册一个。解决方案：修改rollup.config.js中input为'src/entry.esm.js'的output的exports，由`exports: 'named'`改为`exports: 'auto'`。参考：[rollup-output-exports](https://www.rollupjs.com/guide/big-list-of-options)

### 2. 自己搭建遇到的问题
- Error: Invalid value "umd" for option "output.format" - UMD and IIFE output formats are not supported for code-splitting builds.
> 使用AMD。参考[Rollup完全讲解](https://juejin.cn/post/7041874432360448037#heading-29)

- vue.runtime.esm.js:345 Uncaught ReferenceError: process is not defined
> 使用@rollup/plugin-replace解决
```js
import replace from '@rollup/plugin-replace';

plugins: [
  vue(),
  replace({
    'process.env.NODE_ENV': JSON.stringify('development'),
    'process.env.VUE_ENV': JSON.stringify('browser')
  }),
  resolve(),
  babel()
],
```

- [Vue warn]: Failed to mount component: template or render function not defined.
> 发现.vue文件视图部分没用`<template>`包裹

- Uncaught TypeError: Cannot read properties of undefined (reading 'install') at Vue.use
> Vue.use(ElementUI)报的错，原因是rollup配置文件设置了`external: ['element-ui',]`，不排除element-ui就不报错了

:::note
参考：
- [rollup-starter-kit](https://github.com/leohxj/rollup-starter-kit)；[使用 Rollup 构建你的 Library](https://zhuanlan.zhihu.com/p/34218678)
- [xiwen-tooltip](https://github.com/li1164267803/xiwen-tooltip)
- [anchor-ui](https://github.com/jackluson/anchor-ui)
- [rollup 构建vue组件之vue-text-ellipsis2](https://zhuanlan.zhihu.com/p/529869657)
:::

## 二、基于react17的组件rollup打包
