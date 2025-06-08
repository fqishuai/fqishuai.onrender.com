---
slug: vue3
tags: [vue, 记录]
---

## 选项式 API 和组合式 API
Vue 的组件可以按两种不同的风格书写：选项式 API 和组合式 API。

实际上，选项式 API 是在组合式 API 的基础上实现的！关于 Vue 的基础概念和知识在它们之间都是通用的。

### 选项式 API (Options API)​
使用选项式 API，我们可以用包含多个选项的对象来描述组件的逻辑，例如 `data`、`methods` 和 `mounted`。选项所定义的属性都会暴露在函数内部的 `this` 上，它会指向当前的组件实例。
```vue
<script>
export default {
  // data() 返回的属性将会成为响应式的状态
  // 并且暴露在 `this` 上
  data() {
    return {
      count: 0
    }
  },

  // methods 是一些用来更改状态与触发更新的函数
  // 它们可以在模板中作为事件处理器绑定
  methods: {
    increment() {
      this.count++
    }
  },

  // 生命周期钩子会在组件生命周期的各个不同阶段被调用
  // 例如这个函数就会在组件挂载完成后被调用
  mounted() {
    console.log(`The initial count is ${this.count}.`)
  }
}
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

### 组合式 API (Composition API)​
通过组合式 API，我们可以使用导入的 API 函数来描述组件逻辑。在单文件组件中，组合式 API 通常会与 `<script setup>` 搭配使用。这个 `setup` attribute 是一个标识，告诉 Vue 需要在编译时进行一些处理，让我们可以更简洁地使用组合式 API。比如，`<script setup>` 中的导入和顶层变量/函数都能够在模板中直接使用。

组合式 API 的核心思想是直接在函数作用域内定义响应式状态变量，并将从多个函数中得到的状态组合起来处理复杂问题。
```vue
<script setup>
import { ref, onMounted } from 'vue'

// 响应式状态
const count = ref(0)

// 用来修改状态、触发更新的函数
function increment() {
  count.value++
}

// 生命周期钩子
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <button @click="increment">Count is: {{ count }}</button>
</template>
```

## 创建一个 Vue 应用
```bash
pnpm create vue@latest
```
这一指令将会安装并执行 [`create-vue`](https://github.com/vuejs/create-vue)，它是 Vue 官方的项目脚手架工具。

每个 Vue 应用都是通过 `createApp` 函数创建一个新的应用实例：
```js
import { createApp } from 'vue'

const app = createApp({
  /* 根组件选项 */
})
app.mount('#app')
```
应用实例必须在调用了 `.mount()` 方法后才会渲染出来。该方法接收一个“容器”参数，可以是一个实际的 DOM 元素或是一个 CSS 选择器字符串。应用根组件的内容将会被渲染在容器元素里面。容器元素自己将不会被视为应用的一部分。

应用实例会暴露一个 `.config` 对象允许我们配置一些应用级的选项，例如定义一个应用级的错误处理器，用来捕获所有子组件上的错误：
```js
app.config.errorHandler = (err) => {
  /* 处理错误 */
}
```

应用实例还提供了一些方法来注册应用范围内可用的资源，例如注册一个组件，如下 `TodoDeleteButton` 在应用的任何地方都是可用的。
```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

:::tip
`.mount()` 方法应该始终在整个应用配置和资源注册完成后被调用，它的返回值是根组件实例而非应用实例。
:::

当根组件没有设置 `template` 选项时，Vue 将自动使用容器的 `innerHTML` 作为模板。

### 模板语法
Vue 使用一种基于 HTML 的模板语法，使我们能够声明式地将其组件实例的数据绑定到呈现的 DOM 上。

在底层机制中，Vue 会将模板编译成高度优化的 JavaScript 代码。结合响应式系统，当应用状态变更时，Vue 能够智能地推导出需要重新渲染的组件的最少数量，并应用最少的 DOM 操作。

也可以结合可选的 JSX 支持直接手写渲染函数而不采用模板。但请注意，这将不会享受到和模板同等级别的编译时优化。

#### Attribute 绑定
如下使用 `v-bind` 指令指示 Vue 将元素的 `id` attribute 与组件的 `dynamicId` 属性保持一致。
```vue
<div v-bind:id="dynamicId"></div>
```

如果绑定的值是 `null` 或者 `undefined`，那么该 attribute 将会从渲染的元素上移除。

:::tip
`v-bind` 指令可以缩写为 `:`，例如 `v-bind:id` 可以缩写为 `:id`。

Vue 3.4 及以上版本中支持同名简写，即如果 attribute 的名称与绑定的 JavaScript 值的名称相同，可以如下简写：
```vue
<!-- 与 :id="id" 相同 -->
<div :id></div>

<!-- 这也同样有效 -->
<div v-bind:id></div>
```
:::

如果你有像这样的一个包含多个 attribute 的 JavaScript 对象，你可以通过不带参数的 `v-bind` 将它们绑定到单个元素上：
```js
const objectOfAttrs = {
  id: 'container',
  class: 'wrapper',
  style: 'background-color:green'
}
```
```vue
<div v-bind="objectOfAttrs"></div>
```

#### JavaScript 表达式
在 Vue 模板内，JavaScript 表达式会以当前组件实例为作用域解析执行。
```vue
<div :id="`list-${id}`"></div>

<div>{{ message.split('').reverse().join('') }}</div>
```

可以在绑定的表达式中使用一个组件暴露的方法：
```vue
<time :title="toTitleDate(date)" :datetime="date">
  {{ formatDate(date) }}
</time>
```
:::tip
绑定在表达式中的方法在组件每次更新时都会被重新调用，因此不应该产生任何副作用，比如改变数据或触发异步操作。
:::

模板中的表达式将被沙盒化，仅能够访问到[有限的全局对象列表](https://github.com/vuejs/core/blob/main/packages/shared/src/globalsAllowList.ts#L3)。该列表中会暴露常用的内置全局对象，比如 `Math` 和 `Date`。

没有显式包含在列表中的全局对象将不能在模板内表达式中访问，例如用户附加在 `window` 上的属性。然而，你也可以自行在 `app.config.globalProperties` 上显式地添加它们，供所有的 Vue 表达式使用。