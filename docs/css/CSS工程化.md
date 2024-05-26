---
slug: css-modules
tags: [css, modules]
---

## 一、[CSS Modules](http://www.ruanyifeng.com/blog/2016/06/css_modules.html)
[CSS Modules](https://github.com/css-modules/css-modules)

CSS的规则都是全局的，任何一个组件的样式规则，都对整个页面有效。产生局部作用域的唯一方法，就是使用一个独一无二的`class`的名字，不会与其他选择器重名。

CSS Modules 提供各种插件，支持不同的构建工具，比如 Webpack 的`css-loader`插件。

```jsx
import React from 'react';
import style from './App.css';

export default () => {
  return (
    <h1 className={style.title}>
      Hello World
    </h1>
  );
};
```
```css title="App.css"
.title {
  color: red;
}
```

构建工具会将类名`style.title`编译成一个哈希字符串，比如：
```html
<h1 class="_3zyde4l1yATCOkgn-DBWEL">
  Hello World
</h1>
```
`App.css
._3zyde4l1yATCOkgn-DBWEL {
  color: red;
}
```

## 二、css工程化
### 1. [css工程化技术](https://mp.weixin.qq.com/s/HsFW86_oM5r7LXbgojdoBA)

### 2. [手写一个 PurgeCSS -- CSS Tree Shaking 原理揭秘](https://mp.weixin.qq.com/s/PbWD0oV9dXALz4_wsYxblQ)