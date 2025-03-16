---
slug: lowcode
tags: [低代码]
---

# 低代码
[从实现原理看低代码](https://zhuanlan.zhihu.com/p/451340998)

[20个开源的前端低代码项目](https://juejin.cn/post/7164694758588153863?searchId=20240913112418182407F0689F37791606)

## [TinyEngine](https://github.com/opentiny/tiny-engine)
### [出码功能简介与使用](https://opentiny.design/tiny-engine#/help-center/course/engine/7342098765432108)

## [amis](https://github.com/baidu/amis)

## [lowcode-engine](https://github.com/alibaba/lowcode-engine)
### [出码模块设计](https://lowcode-engine.cn/site/docs/guide/design/generator)

## [teleportHQ](https://teleporthq.io/)
### [组件生成器](https://docs.teleporthq.io/guides/getting-started.html)

## [builder.io](https://builder.io/)
React、Vue、Svelte、Qwik 等的可视化开发

### [Mitosis](https://mitosis.builder.io/)
Mitosis 是 Builder.io 团队开发的一个开源项目，旨在通过一次编写代码并生成多种框架版本的组件。它的目标是解决跨框架开发的复杂性，使开发者能够用一种通用的语法编写组件，然后自动生成适用于不同前端框架（如 React、Vue、Angular、Svelte 等）的代码。

Mitosis 的核心概念:

1. **通用语法**：Mitosis 使用一种通用的语法来定义组件，这种语法类似于 JSX，但具有更高的抽象性。通过这种通用语法，开发者可以编写一次代码，然后生成多种框架的版本。

2. **编译器**：Mitosis 提供了一个编译器，将通用语法的组件代码转换为目标框架的代码。编译器可以生成 React、Vue、Angular、Svelte 等多种框架的代码。

3. **跨框架一致性**：通过使用 Mitosis，开发者可以确保跨框架的一致性，减少重复工作，提高开发效率。


以下是一个简单的 Mitosis 组件示例，以及如何将其编译为不同框架的代码。

```jsx
// HelloWorld.mitosis.jsx
export default function HelloWorld(props) {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <button onClick={() => alert('Hello, ' + props.name)}>Click Me</button>
    </div>
  );
}
```

编译为 React 组件:
```jsx
// HelloWorld.react.jsx
import React from 'react';

const HelloWorld = (props) => {
  return (
    <div>
      <h1>Hello, {props.name}!</h1>
      <button onClick={() => alert('Hello, ' + props.name)}>Click Me</button>
    </div>
  );
};

export default HelloWorld;
```

编译为 Vue 组件:
```html
<!-- HelloWorld.vue -->
<template>
  <div>
    <h1>Hello, {{ name }}!</h1>
    <button @click="handleClick">Click Me</button>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
  },
  methods: {
    handleClick() {
      alert('Hello, ' + this.name);
    },
  },
};
</script>
```

要使用 Mitosis，你需要安装其 CLI 工具并进行配置。以下是基本的使用步骤：

1. **安装 Mitosis CLI**

```bash
npm install -g @builder.io/mitosis-cli
```

2. **创建 Mitosis 项目**

```bash
mitosis init my-mitosis-project
cd my-mitosis-project
```

3. **编写 Mitosis 组件**

在 `src` 目录下编写你的 Mitosis 组件，例如 `HelloWorld.mitosis.jsx`。

4. **编译组件**

使用 Mitosis CLI 将组件编译为目标框架的代码：

```bash
mitosis build --target react
mitosis build --target vue
```

Mitosis 是一个强大的工具，旨在简化跨框架组件开发。通过使用通用的语法和编译器，开发者可以一次编写组件代码，然后生成适用于多种前端框架的版本，从而提高开发效率，确保一致性，并减少维护成本。