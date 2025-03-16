---
slug: usage
tags: [vue, 记录]
---

- [1. 渲染函数 \& JSX](#1-渲染函数--jsx)
  - [1.1 记录一次webpack5搭建的vue工程使用elementui的Tree组件遇到的问题](#11-记录一次webpack5搭建的vue工程使用elementui的tree组件遇到的问题)
  - [1.2 由一次监听`el-switch`的click事件(想在switch切换状态前处理一些逻辑)引发的思考](#12-由一次监听el-switch的click事件想在switch切换状态前处理一些逻辑引发的思考)
  - [1.3 vue中使用jsx](#13-vue中使用jsx)
- [2. filters](#2-filters)
- [3. v-if对computed无效；key对computed无效](#3-v-if对computed无效key对computed无效)
- [4. Array触发视图更新的API](#4-array触发视图更新的api)
- [5. 搭建vite+vue2.7+pnpm工程](#5-搭建vitevue27pnpm工程)
- [6. keep-alive](#6-keep-alive)
- [7. vue.config.js](#7-vueconfigjs)
  - [7.1 pages](#71-pages)
  - [7.2 configureWebpack](#72-configurewebpack)
- [8. 动态组件`<component>/component>`](#8-动态组件componentcomponent)
- [9. vue中如何使用节流（throttle）函数](#9-vue中如何使用节流throttle函数)
- [10. 子组件不应该直接修改它从父组件接收的props](#10-子组件不应该直接修改它从父组件接收的props)
- [11. 折叠面板动效](#11-折叠面板动效)
- [12. 计算属性依赖的变量是引用类型](#12-计算属性依赖的变量是引用类型)
  - [依赖的是对象](#依赖的是对象)
  - [数组](#数组)
- [`computed`的`setter`](#computed的setter)


## 1. 渲染函数 & JSX
### 1.1 记录一次webpack5搭建的vue工程使用elementui的Tree组件遇到的问题
- Tree组件可以通过两种方法进行树节点内容的自定义：`render-content`和 `scoped slot`
- 使用`render-content`需要指定渲染函数，该函数返回需要的节点区内容
```jsx
<div class="block">
  <p>使用 render-content</p>
  <el-tree
    :data="data"
    show-checkbox
    node-key="id"
    default-expand-all
    :expand-on-click-node="false"
    :render-content="renderContent">
  </el-tree>
</div>
renderContent(h, { node, data, store }) {
  return (
    <span class="custom-tree-node">
      <span>{node.label}</span>
      <span>
        <el-button size="mini" type="text" on-click={ () => this.append(data) }>Append</el-button>
        <el-button size="mini" type="text" on-click={ () => this.remove(node, data) }>Delete</el-button>
      </span>
    </span>);
}
```
- `render-content`的渲染函数中使用了jsx，编译时报错（原有的配置是`webpack 5`+`@babel/core 7`+`babel-loader 8`+`vue 2`+`vue-loader 15`+`vue-template-compiler 2`）
- 解决步骤如下：
  - 新增2个依赖`@vue/babel-preset-jsx`和`@vue/babel-helper-vue-jsx-merge-props`
  - 使用`@vue/babel-preset-jsx`（在`webpack.config.js`的babel-loader的options中配置或者在babel的配置文件(`babel.config.js`或`.babelrc`)中配置）
```bash
npm install -D @vue/babel-preset-jsx @vue/babel-helper-vue-jsx-merge-props
```
```js title="webpack.config.js"
{
  test: /\.js/,
  loader: 'babel-loader',
  options: {
    presets: ["@vue/babel-preset-jsx"]
  },
  exclude: /node_modules/
},
```
> 参考：
> - [vue项目启动报错：Support for the experimental syntax ‘jsx‘ isn‘t currently enabled](https://blog.csdn.net/q1ngqingsky/article/details/118421074)
> - [来聊聊Vue中使用Render函数和JSX](https://blog.csdn.net/liuyan19891230/article/details/118533479)

:::note
这个踩坑还有一个点是，这个webpack5搭建的vue工程，其中配置相关(webpack配置、babel配置、postcss配置等)是单独抽出来的一个底层包(目的是与vue相关的配置分离开)，会merge使用这个包的工程的相关配置文件，形成最终的配置。在vue工程中的babel.config.js配置使用`@vue/babel-preset-jsx`时不起作用，最后，在vue工程中又安装了`babel-loader`的依赖（原本是不需要在vue工程中使用babel-loader的，因为底层包配置了babel-loader），将其配置到vue工程中的`webpack.config.js`，在`babel-loader`的options中使用`@vue/babel-preset-jsx`生效了。
:::

### 1.2 由一次监听`el-switch`的click事件(想在switch切换状态前处理一些逻辑)引发的思考
- element ui官方`el-switch`只有`change`事件（以及focus方法）
- 监听其click事件首先想到两种方法：
  - 外面包一层dom，给该dom添加click监听器并阻止事件向下传递，click事件逻辑处理后更改`el-switch`的`v-model`来改其状态，视觉上达到监听`el-switch`的click事件
  ```jsx
  // vue中阻止事件向下传递：
  <div @click.stop.capture="handleClickSelf">
    <el-switch :value="switchOpenFlag" @change="handleClick"></el-switch>
  </div>
  ```
  - 弃用`v-model`，使用 `:value` 和 `@change`
  ```jsx
  <el-switch :value="switchOpenFlag" @change="handleClick" active-inner-text="开" inactive-inner-text="关"></el-switch>
  ```

- 这就引出3个值得深究的点：1）`v-model`是如何实现的？ 2）事件的向上/向下传递过程 3）vue的事件修饰符及如何实现的
> [Vue事件修饰符](https://vuetechworld.com/blog/detail/9570e28eab4b3dcf074a8f2bacdc29c9)

### 1.3 vue中使用jsx

## 2. filters
- filters里面this为undefined，为啥这样设计？
- 解决办法：使用computed或method或filter传this
```jsx
<template>
<div>
{{state | theFilter(this)}}
</div>
</template>
<script>
filters: {
  theFilter: function(value,that) {
    // that.xxx
  },
},
</script>
```

## 3. v-if对computed无效；key对computed无效
如果想通过v-if或key控制一个dom内部的数据清空，那么该dom内部由computed控制的数据是不会被清空的。
- 为啥会这样？
- computed缓存是怎么实现的？怎么让它不缓存？
- 用inject reload?

## 4. Array触发视图更新的API
- concat不能更新视图
```js
// 使用中间变量解决concat不能更新视图的问题
let temArr = this.sourceData.concat(targetData);
this.sourceData = temArr;
```
- Array.prototype.push.apply(this.sourceData, targetData); // 这种方式可以更新视图但watch不到

## 5. 搭建vite+vue2.7+pnpm工程
- `brew install pnpm`
- `pnpm create vite`
- 把工程中的`"vue": "^3.2.25"`换为`"vue": "2.7.8"`
- 把工程中的`"@vitejs/plugin-vue": "^2.3.3"`换为`"@vitejs/plugin-vue2": "^1.1.2"`
- 把工程中的`vite.config.js`的`@vitejs/plugin-vue`换为`@vitejs/plugin-vue2`
- 注意vue3改为vue2后的template--->Component template should contain exactly one root element
- 更改`man.js`
```js title="main.js"
// vue3
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app')

// vue2
import Vue from 'vue'
import App from './App.vue'

new Vue({
  render: h => h(App)
}).$mount('#app')
```
- `pnpm add -D sass`（`Vite提供了对 .scss, .sass, .less, .styl 和 .stylus 文件的内置支持。`）
> 如果使用的是单文件组件，可以通过 `<style lang="scss">`（或其他预处理器）自动开启。

## 6. [keep-alive](https://v2.cn.vuejs.org/v2/api/#keep-alive)
> 主要用于保留组件状态或避免重新渲染。`<keep-alive>` 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。
> - `<keep-alive>` 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中。
> - 当组件在 `<keep-alive>` 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。

- include 字符串或正则表达式或数组。只有名称匹配的组件会被缓存。
- exclude 字符串或正则表达式或数组。任何名称匹配的组件都不会被缓存。
- max 数字。最多可以缓存多少组件实例。

## 7. vue.config.js
### 7.1 pages

### 7.2 configureWebpack
- copy-webpack-plugin不需要install就能在vue.config.js中用，查看node_modules中有，说明copy-webpack-plugin不知道是哪个包的依赖，被附带安装了


## 8. 动态组件`<component>/component>`
背景：多个tab切换，切换时显示的内容都是相同的form表单，不过某些form表单项的默认值不同，切换后保留更改的表单项的值。

设计：将form表单封装为单文件组件，并使用动态组件，`is`属性传入单文件组件，使用`v-bind`传入props，以及回调`@search`接收form表单的值，使用keep-alive包裹：
```js
// A.vue
<template>
  <div>
    <keep-alive>
      <component :is="'my-component'" v-bind="myComponentProps" @search="handleSearch"></component>
    </keep-alive>
  </div>
</template>
<script>
  import MyComponent from './component/MyComponent';
  export default {
    components: {
      MyComponent,
    },
    data: function() {
      return {
        tabList: [
          {
            label: 'first',
            value: '1',
          },
          {
            label: 'second',
            value: '2',
          },
        ],
        currentTabName: '1',
        searchDisabled: false,
      }
    },
    computed: {
      computedDisabled({currentTabName, tabList}) {
        return tabList.find(tab => tab.value === currentTabName)?.disabled;
      },
      myComponentProps({computedDisabled, searchDisabled, currentTabName}) {
        return {
          isDisabled: computedDisabled,
          searchDisabled: searchDisabled,
          tabName: currentTabName,
          key: currentTabName, // 通过设置key，变相地将my-component当作不同的组件来使用
        };
      },
    },
    methods: {
      handleSearch() {

      },
    },
  }
</script>

// MyComponent.vue
<script>
  export default {
    props:{
      isDisabled: {
        type: Boolean,
        default: false,
      },
      searchDisabled: {
        type: Boolean,
        default: false,
      },
      tabName: {
        type: String,
        default: '',
      },
    },
    methods: {
      emitSearch() {
        this.$emit('search', this.queryParam);
      },
    },
  }
</script>
```

## 9. vue中如何使用节流（throttle）函数
`import funHelper from 'lodash/function'` 是一种从 Lodash 库中导入函数相关辅助方法的方式。这种导入方式允许你只引入 Lodash 的 function 模块，而不是整个 Lodash 库，这有助于减少最终打包文件的大小。

在这个 `funHelper` 对象中，你可以找到以下常用的函数处理方法：

1. `after(n, func)`: 创建一个函数，当它被调用 n 次或更多次之后将触发 func 。

2. `ary(func, [n=func.length])`: 创建一个调用 func 的函数。调用 func 时最多接受 n 个参数，忽略多出的参数。

3. `before(n, func)`: 创建一个调用 func 的函数，通过 this 绑定和创建函数的参数调用 func，调用次数不超过 n 次。 之后再调用这个函数，将返回一次最后调用 func 的结果。

4. `curry(func, [arity=func.length])`: 创建一个函数，该函数接收 func 的参数，要么调用 func 返回的结果，如果 func 所需参数已经提供，则直接返回 func 所执行的结果。

5. `debounce(func, [wait=0], [options={}])`: 创建一个防抖动函数，该函数会从上一次被调用后，延迟 wait 毫秒后调用 func 方法。

6. `defer(func, [args])`: 延迟调用 func，直到当前堆栈清理完毕。

7. `delay(func, wait, [args])`: 延迟 wait 毫秒后调用 func。

8. `flip(func)`: 创建一个函数，调用 func 时反转传入的参数。

9. `memoize(func, [resolver])`: 创建一个会缓存 func 结果的函数。

10. `negate(predicate)`: 创建一个针对断言函数 func 结果取反的函数。

11. `once(func)`: 创建一个只能调用一次的函数。

12. `overArgs(func, [transforms=[]])`: 创建一个函数，调用 func 时参数会先一对一的调用 transforms 的相应函数处理。

13. `partial(func, [partials])`: 创建一个函数。该函数调用 func，并传入预设的 partials 参数。

14. `throttle(func, [wait=0], [options={}])`: 创建一个节流函数，在 wait 秒内最多执行 func 一次的函数。

使用示例：

```javascript
import funHelper from 'lodash/function';

const debouncedSave = funHelper.debounce(saveFunction, 300);
const throttledScroll = funHelper.throttle(scrollHandler, 100);
const memoizedExpensiveOperation = funHelper.memoize(expensiveFunction);
```

这些函数在处理事件监听、优化性能、控制函数调用频率等场景中非常有用。根据你的具体需求，你可以选择使用其中的一个或多个函数。

例1:
```html
<div @click="limit">查询</div>
```
```js
import funHelper from 'lodash/function';

export default {
  methods: {
    limit: funHelper.throttle(function() {
      console.log('1秒内点击n次只打印1次')
      // this指向当前Vue组件实例
      // this.queryData();
    }, 1000, { 'trailing': false }),
    queryData() {

    },
  },
}
```

例2：
```html
<div @click="querySendMsgNum">发送短信</div>
```
```js
import funHelper from 'lodash/function';

export default {
  methods: {
      async querySendMsgNum() {
        try {
          const apiResult = await getSendMessageNum();
          if (!apiResult.success) throw apiResult.message;
          this.$dialog({
            id: "send-msg-dialog",
            title: "操作提示",
            content: `今日短信剩余发送次数为${apiResult.result}次`,
            okBtnTxt: "发送短信",
            closeBtn: false,
            onOkBtn: async (event) => {
              this.handleSendMsg();
            }
          });
        } catch (error) {
          console.error('querySendMsgNum:', error);
          if (typeof error == 'string') {
            this.$toast.fail(error);
          }
        }
      },
      handleSendMsg: funHelper.throttle(async () => {
        try {
          let apiResult = await sendMessage();
          if (!apiResult.success) throw apiResult.message;
          this.$toast.success('发送成功');
          this.$dialog.closed(); // 关闭当前dialog
        } catch (error) {
          console.error('sendMessage:', error);
          if (typeof error == 'string') {
            this.$toast.fail(error);
          }
        }
      }, 1000, { 'trailing': false }),
  }
}
```

## 10. 子组件不应该直接修改它从父组件接收的props
在Vue中，props是用来传递数据从父组件到子组件的一种机制，它们是单向数据流的一部分。子组件不应该直接修改它从父组件接收的props。这是因为Vue试图确保数据的流向是可预测的，而直接修改props会破坏这种单向数据流，导致应用程序的状态难以追踪和理解。

如果子组件需要基于父组件传递的prop来修改数据，它应该定义一个本地的data属性或者计算属性（computed property），然后在这个本地属性上进行操作。
```html
<!-- 父组件 -->
<template>
  <div>
    <child-component :parent-message="message" />
  </div>
</template>

<script>
import ChildComponent from './ChildComponent.vue';

export default {
  components: {
    ChildComponent
  },
  data() {
    return {
      message: 'Hello from parent'
    };
  }
}
</script>
```
```html
<!-- 子组件 -->
<template>
  <div>
    <p>{{ localMessage }}</p>
  </div>
</template>

<script>
export default {
  props: ['parentMessage'],
  data() {
    return {
      // 初始化本地数据属性，以prop的值为初始值
      localMessage: this.parentMessage
    };
  },
  watch: {
    // 如果prop更新了，也更新本地数据属性
    parentMessage(newValue) {
      this.localMessage = newValue;
    }
  }
}
</script>
```

如果子组件需要通知父组件它希望更改prop的值，它应该使用自定义事件来通知父组件。父组件可以监听这些事件并相应地更新数据。这样，数据的更新仍然是在父组件中进行的，保持了单向数据流的完整性。(可以巧妙使用`$event`)
```html
<!-- 子组件 -->
<template>
  <div>
    <button @click="updateMessage">Update Message</button>
  </div>
</template>

<script>
export default {
  props: ['parentMessage'],
  methods: {
    updateMessage() {
      // 子组件不能直接修改prop，而是发出一个事件
      this.$emit('update:message', 'New message from child');
    }
  }
}
</script>
```
```html
<!-- 父组件 -->
<template>
  <div>
    <child-component :parent-message="message" @update:message="message = $event" />
  </div>
</template>

<!-- 父组件的其余代码 -->
```

## 11. 折叠面板动效
动态计算内容的高度，并在过渡之前将高度设置为具体的像素值。使用`requestAnimationFrame()`和`will-change`进行优化。

```html title="Collapse.vue"
<template>
  <div class="custom-collapse">
    <div class="title" @click="toggle">
      <div class="left">
        <img alt="icon" :src="titleLeftIcon" />
        <div>{{ titeLeftText }}</div>
      </div>
      <div class="right">
        <div>{{ titleRightText }}</div>
        <img alt="arrowdown icon" :src="arrowupIcon" :style="{transform: expanded ? up : down}" />
      </div>
    </div>
    <div class="content"
      :style="{ willChange: 'height', height: wrapperHeight }"
      @transitionend="onTransitionEnd"
    >
      <div class="content-wrapper" ref="contentRef">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import arrowupIcon from '@/assets/icon-arrowup@3x.png';

export default {
  components: {},
  directives: {},
  mixins: [],
  inject: {},
  props: {
    titleLeftIcon: {
      type: String,
      default: '',
    },
    titeLeftText: {
      type: String,
      default: '',
    },
    titleRightText: {
      type: String,
      default: '',
    },
    expanded: {
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      wrapperHeight: this.expanded ? 'auto' : '0',
      up: 'rotate(0)',
      down: 'rotate(180deg)',
      arrowupIcon,
    }
  },
  computed: {},
  watch: {
    expanded(newValue, oldValue) {
      newValue ? this.openCollapse() : this.closeCollapse();
    },
  },
  created() {},
  mounted() {},
  methods: {
    onTransitionEnd() {
      if (this.expanded) {
        this.wrapperHeight = 'auto';
      }
    },
    openCollapse() {
      this.wrapperHeight = '0px';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const height = this.$refs.contentRef.offsetHeight;
          this.wrapperHeight = height ? `${height}px` : 'auto';
        })
      })
    },
    closeCollapse() {
      const height = this.$refs.contentRef.offsetHeight;
      this.wrapperHeight = height ? `${height}px` : 'auto';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          this.wrapperHeight = '0px';
        })
      })
    },
    toggle() {
      this.$emit('toggle', this.expanded);
    },
  },
}
</script>

<style lang="scss" scoped>
@import './collapse.scss'
</style>
```
```css title="collapse.scss"
.custom-collapse {
  background-color: rgba(255,255,255,1);
  border-radius: 0.08rem;
  margin: 0 auto 0.12rem;
  .content {
    padding: 0 0.12rem;
    overflow: hidden;
    transition: height 0.5s ease-in-out;
  }
}
```
使用示例：
```html
<Collapse
  :titleLeftIcon="icon"
  :titeLeftText="name"
  :titleRightText="tip"
  :expanded="expanded"
  @toggle="expanded = !$event"
>
  <div class="item-wrapper">
    
  </div>
</Collapse>
```

## 12. 计算属性依赖的变量是引用类型
### 依赖的是对象
在Vue 2中，计算属性(computed properties)是基于它们的依赖进行缓存的。如果计算属性依赖于一个对象，并且你想要在对象改变时触发计算属性的重新计算，你需要确保Vue能够检测到对象的变化。

Vue无法检测到对象属性的添加或删除。因此，如果你依赖的对象有新的属性添加或已有属性被删除，你需要使用`Vue.set`方法来添加新属性，或者使用`vm.$set`实例方法（`vm`是Vue实例），这样Vue才能够跟踪变化并更新计算属性。

如果你改变的是对象的某个已有属性的值，那么计算属性应该能够自动检测到变化并重新计算。例如：

```javascript
computed: {
  myComputedProp() {
    return this.myObject.key; // 依赖于myObject的key属性
  }
}
```

当`myObject.key`的值改变时，`myComputedProp`会重新计算。

如果你整个替换了依赖的对象，Vue也能够检测到这个变化，并且会重新计算依赖于该对象的计算属性。例如：

```javascript
methods: {
  updateMyObject() {
    this.myObject = { ...this.myObject, newKey: 'newValue' }; // 整个对象替换
  }
}
```

在这个例子中，当调用`updateMyObject`方法时，`myObject`被整个替换了，计算属性也会因为依赖于`myObject`而重新计算。

### 数组
在Vue 2中，如果计算属性依赖于一个数组，那么当数组的内容发生变化时（例如，通过使用`push`、`pop`、`shift`、`unshift`、`splice`、`sort`或`reverse`方法），计算属性会自动重新计算。这是因为这些方法会触发数组的响应式更新。

例如：

```javascript
data() {
  return {
    myArray: [1, 2, 3]
  };
},
computed: {
  sumOfArray() {
    return this.myArray.reduce((sum, num) => sum + num, 0);
  }
}
```

在这个例子中，如果你使用`this.myArray.push(4)`，`sumOfArray`计算属性会检测到`myArray`的变化，并重新计算数组元素的总和。

然而，如果你直接通过索引修改数组（例如`this.myArray[0] = 10`）或者修改数组的长度（例如`this.myArray.length = 10`），Vue将无法检测到这些变化。为了确保这些类型的变化也能触发计算属性的更新，你应该使用`Vue.set`或`vm.$set`来设置数组索引的值，或者使用`splice`方法来修改数组。

例如，使用`Vue.set`来修改数组中的元素：

```javascript
Vue.set(this.myArray, 0, 10); // 或者 this.$set(this.myArray, 0, 10);
```

或者使用`splice`来修改数组：

```javascript
this.myArray.splice(0, 1, 10); // 替换索引0的元素为10
```

这些方法都会触发Vue的响应式系统，从而更新依赖于`myArray`的计算属性。

## `computed`的`setter`
```js
<template>
  <span>剩余{{ sendNum }}次</span>
</template>
<script>
  export default {
    data() {
      return {
        showSendNum: 3,
      }
    },
    computed: {
      sendNum: {
        set: function(value) {
          localStorage.setItem(this.userId, value);
          this.showSendNum = value;
        },
        get: function({ userId, showSendNum }) {
          if (userId) {
            return localStorage.getItem(userId) || showSendNum;
          } else {
            return '--';
          }
        }
      },
    },
    methods: {
      handleSend() {
        if (this.sendNum <= 0 ) return this.$message({
          type: 'warning',
          message: '已超出今天发送上限，最多3次'
        }); 
        this.$confirm('最多发送3次','发送', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async () => {
          // await api(param)
          if (true) {
            this.$message({
              type: 'success',
              message: '发送成功'
            });
            this.sendNum -= 1;
          } else {
            this.$message({
              type: 'error',
              message: '发送失败'
            });
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消操作'
          });
        })
      },
    }
  }
</script>
```