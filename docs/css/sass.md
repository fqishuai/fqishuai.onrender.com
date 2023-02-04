---
tags: [css]
---

:::tip
[Sass](https://sass-lang.com/) is the most mature, stable, and powerful professional grade CSS extension language in the world. Sass 是世界上最成熟、最稳定、最强大的专业级 CSS 扩展语言。

[Sass](https://sass-lang.com/documentation/) is a stylesheet language that’s compiled to CSS. It allows you to use `variables`, `nested rules`, `mixins`, `functions`, and more, all with a fully CSS-compatible syntax. Sass helps keep large stylesheets well-organized and makes it easy to share design within and across projects.

Sass 有两种语法:
- SCSS syntax (.scss)
- indented syntax (.sass) 缩进语法，使用缩进而不是大括号来嵌套语句，并使用换行符而不是分号来分隔

```css
body {
  font: 100% Helvetica, sans-serif;
  color: #333;
}
```
```scss
$font-stack: Helvetica, sans-serif;
$primary-color: #333;

body {
  font: 100% $font-stack;
  color: $primary-color;
}
```
```sass
$font-stack: Helvetica, sans-serif
$primary-color: #333

body
  font: 100% $font-stack
  color: $primary-color
```
:::

### node-sass
Node-sass is a library that provides binding for Node.js to LibSass, the C version of the popular stylesheet preprocessor, Sass. It allows you to natively compile `.scss` files to `css` at incredible speed and automatically via a connect middleware. Node-sass 是一个库，它提供 Node.js 到 LibSass 的绑定，LibSass 是 Sass(流行的样式表预处理器) 的 C 版本。它将 `.scss` 文件编译为 `css`。

安装失败的话:
- 可以使用中国镜像：
```bash
npm install -g mirror-config-china --registry=https://registry.npmmirror.com
npm install node-sass -D
```

- 弃用node-sass(LibSass and Node Sass are deprecated.), 改用sass
> 参考：[你还在为node-sass烦恼吗？快试试官方推荐的dart-sass](https://juejin.cn/post/6966763785130508296)
> - `npm uninstall node-sass`
> - `npm install --save-dev sass`
> - 对于vue项目，全局替换`/deep/` 为 `::v-deep` (在 Vue 项目中，`scoped` 样式是会通过一个哈希化的属性选择器进行隔离的（比如`[data-v-67c6b990]`），如果希望做样式穿透，在Vue2中会用到`/deep/`深度选择器。使用sass后，可能会在运行开发环境时遇到不支持`/deep/`的问题，需要改用`::v-deep`，在Vue3中使用的是`:deep()`这个伪类。)