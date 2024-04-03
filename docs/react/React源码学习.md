---
slug: source-code
tags: [react]
---

## 一、源码调试
### 1. vscode的debugger配置

## 二、源码学习
:::tip
参考资料：
- [图解React原理系列](https://7kms.github.io/react-illustration-series/)
- [React技术揭秘](https://react.iamkasong.com/)
- [B站](https://www.bilibili.com/video/BV17j421Z7Ch/?p=27&spm_id_from=pageDriver&vd_source=8c097a1f02a5d77f973c5834be4c8ab6)
:::

### React核心API
- packages/react
  - packages/react/src/React.js
- packages/react-dom
  - ReactDOM.createRoot
- packages/react-reconciler
- packages/scheduler

### 编译JSX
[@babel/plugin-transform-react-jsx](https://babel.dev/docs/babel-plugin-transform-react-jsx)
```js
// JSX
const profile = (
  <div>
    <img src="avatar.png" className="profile" />
    <h3>{[user.firstName, user.lastName].join(" ")}</h3>
  </div>
);
// 编译后
import { jsx as _jsx } from "react/jsx-runtime";
import { jsxs as _jsxs } from "react/jsx-runtime";

const profile = _jsxs("div", {
  children: [
    _jsx("img", {
      src: "avatar.png",
      className: "profile",
    }),
    _jsx("h3", {
      children: [user.firstName, user.lastName].join(" "),
    }),
  ],
});
```
