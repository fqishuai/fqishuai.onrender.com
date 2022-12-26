---
slug: vuex
tags: [vue]
---

![vuex](img/vuex.png)

## 一、简单的状态共享
:::info
- 通过根 Vue 实例共享数据
- `vm.$root` 当前组件树的根 Vue 实例。如果当前实例没有父实例，此实例将会是其自己。
:::
```js
new Vue({
  router: routerInstance,
  store,
  data: {
    eventHub: new Vue()
  },
  render: h => h(App)
}).$mount('#app')
```
```js
this.$root.eventHub.$emit(name,value);
this.$root.eventHub.$on(name, (value) => {
  // ...
});
```

### 1. [`vm.$emit( eventName, […args] )`](https://v2.cn.vuejs.org/v2/api/#vm-emit)
触发当前实例上的事件。附加参数都会传给监听器回调。
```js
Vue.component('magic-eight-ball', {
  data: function () {
    return {
      possibleAdvice: ['Yes', 'No', 'Maybe']
    }
  },
  methods: {
    giveAdvice: function () {
      var randomAdviceIndex = Math.floor(Math.random() * this.possibleAdvice.length)
      this.$emit('give-advice', this.possibleAdvice[randomAdviceIndex])
    }
  },
  template: `
    <button v-on:click="giveAdvice">
      Click me for advice
    </button>
  `
})
```

### 2. [`vm.$on( event, callback )`](https://v2.cn.vuejs.org/v2/api/#vm-on)
监听当前实例上的自定义事件。事件可以由 vm.$emit 触发。回调函数会接收所有传入事件触发函数的额外参数。
```js
vm.$on('test', function (msg) {
  console.log(msg)
})
vm.$emit('test', 'hi')
// => "hi"
```

### 3. [`vm.$off( [event, callback] )`](https://v2.cn.vuejs.org/v2/api/#vm-off)
移除自定义事件监听器。
- 如果没有提供参数，则移除所有的事件监听器；
- 如果只提供了事件，则移除该事件所有的监听器；
- 如果同时提供了事件与回调，则只移除这个回调的监听器。

## 二、简单的store模式
:::info
- store 中 state 的变更，都放置在 store 自身的 action 中去管理。
- 这种集中式状态管理能够被更容易地理解哪种类型的变更将会发生，以及它们是如何被触发。
- 当错误出现时，我们现在也会有一个 log 记录 bug 之前发生了什么。
:::
```js
var store = {
  debug: true,
  state: {
    message: 'Hello!'
  },
  setMessageAction (newValue) {
    if (this.debug) console.log('setMessageAction triggered with', newValue)
    this.state.message = newValue
  },
  clearMessageAction () {
    if (this.debug) console.log('clearMessageAction triggered')
    this.state.message = ''
  }
}
```

每个实例/组件仍然可以拥有和管理自己的私有状态：
```js
var vmA = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})

var vmB = new Vue({
  data: {
    privateState: {},
    sharedState: store.state
  }
})
```

- 组件和 store 需要引用同一个共享对象，变更才能够被观察到。
- 可以约定：组件不允许直接变更属于 store 实例的 state，而应执行 action 来分发 (dispatch) 事件通知 store 去改变。这样约定的好处是，我们能够记录所有 store 中发生的 state 变更，实现 能做到记录变更、保存状态快照、历史回滚/时光旅行 的调试工具。

## 三、Vuex
> Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以一种可预测的方式发生变化。Vuex 依赖 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Using_promises)。

### 1. 安装
- `npm install vuex --save`
- 在一个模块化的打包系统中，必须显式地通过 Vue.use() 来安装 Vuex：
```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
```

### 2. Vuex和单纯的全局对象的区别
Vuex 和单纯的全局对象有以下两点不同：
- Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
- 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

### 3. `new Vuex.Store`
> Vuex 使用单一状态树，用一个对象就包含了全部的应用层级状态。每个应用将仅仅包含一个 store 实例。存储在 Vuex 中的数据和 Vue 实例中的 data 遵循相同的规则，例如状态对象必须是纯粹 (plain) 的。

```js
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})
```

可以通过 store.state 来获取状态对象，以及通过 store.commit 方法触发状态变更:
```js
store.commit('increment')

console.log(store.state.count) // -> 1
```

为了在 Vue 组件中访问 `this.$store`，你需要为 Vue 实例提供创建好的 store，把 store 的实例注入到根组件下的所有子组件中：
```js
new Vue({
  el: '#app',
  store: store,
})
```

现在我们可以从组件的方法提交一个变更：
```js
computed: {
  count () {
    return this.$store.state.count
  }
},
methods: {
  increment() {
    this.$store.commit('increment')
    console.log(this.$store.state.count)
  }
}
```

### 4. 辅助函数：mapState
> mapState 函数返回的是一个对象。用于简化写法

```js
import { mapState } from 'vuex'

computed: {
  localComputed () { /* ... */ },
  // 使用对象展开运算符将此对象混入到外部对象中
  ...mapState({
    count: state => state.count,

    // 为了能够使用 `this` 获取局部状态，必须使用常规函数
    countPlusLocalState (state) {
      return state.count + this.localCount
    }
  })
}
```

当映射的计算属性的名称与 state 的子节点名称相同时，也可以给 mapState 传一个字符串数组：
```js
computed: mapState([
  // 映射 this.count 为 store.state.count
  'count'
])
```

### 5. getters
有时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数：
```js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```
如果有多个组件需要用到此属性，我们要么复制这个函数，或者抽取到一个共享函数然后在多处导入它——无论哪种方式都不是很理想。