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
- **Vuex 的状态存储是响应式的。** 当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
- 你不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。

### 3. 创建store实例
> Vuex 使用单一状态树，用一个对象就包含了全部的应用层级状态。每个应用将仅仅包含一个 store 实例。存储在 Vuex 中的数据和 Vue 实例中的 data 遵循相同的规则，例如状态对象必须是纯粹 (plain) 的。

#### 3.1 `new Vuex.Store`
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

#### 3.2 createStore
```js
import { createStore } from 'vuex'

const store = createStore({ ...options })
```

#### 3.3 useStore
在 setup 钩子函数中调用该方法可以获取注入的 store。当使用组合式 API 时，可以通过调用该方法检索 store。
```js
import { useStore } from 'vuex'

export default {
  setup () {
    const store = useStore()
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
> 可以认为是 store 的计算属性。就像计算属性一样，getter 的返回值会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。

有时候我们需要从 store 中的 state 中派生出一些状态，例如对列表进行过滤并计数：
```js
computed: {
  doneTodosCount () {
    return this.$store.state.todos.filter(todo => todo.done).length
  }
}
```
如果有多个组件需要用到此属性，我们要么复制这个函数，或者抽取到一个共享函数然后在多处导入它——无论哪种方式都不是很理想。

#### 5.1 getter 接受 state 作为其第一个参数：
```js
const store = new Vuex.Store({
  state: {
    todos: [
      { id: 1, text: '...', done: true },
      { id: 2, text: '...', done: false }
    ]
  },
  getters: {
    doneTodos: state => {
      return state.todos.filter(todo => todo.done)
    }
  }
})
```

#### 5.2 getter 接受 getters 作为其第二个参数：
```js
getters: {
  // ...
  doneTodos: state => {
    return state.todos.filter(todo => todo.done)
  },
  doneTodosCount: (state, getters) => {
    return getters.doneTodos.length
  }
}
```

#### 5.3 也可以通过让 getter 返回一个函数，来实现给 getter 传参：
> 注意，getter 在通过方法访问时，每次都会去进行调用，而不会缓存结果。

```js
getters: {
  // ...
  getTodoById: (state) => (id) => {
    return state.todos.find(todo => todo.id === id)
  }
}

this.$store.getters.getTodoById(2) // -> { id: 2, text: '...', done: false }
```

#### 5.4 在任何组件中使用getter：
> 注意，getter 在通过属性访问时是作为 Vue 的响应式系统的一部分缓存其中的。

```js
computed: {
  doneTodosCount () {
    return this.$store.getters.doneTodosCount
  }
}
```

#### 5.5 辅助函数: mapGetters
mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
```js
import { mapGetters } from 'vuex'

export default {
  // ...
  computed: {
  // 使用对象展开运算符将 getter 混入 computed 对象中
    ...mapGetters([
      'doneTodosCount',
      'anotherGetter',
      // ...
    ])
  }
}

// 如果你想将一个 getter 属性另取一个名字，使用对象形式：
...mapGetters({
  // 把 `this.doneCount` 映射为 `this.$store.getters.doneTodosCount`
  doneCount: 'doneTodosCount'
})
```

### 6. mutations
> 更改 Vuex 的 store 中的状态的唯一方法是提交 mutation。不能直接调用一个 mutation handler，需要以相应的 type 调用 store.commit 方法。

```js
const store = new Vuex.Store({
  state: {
    count: 1,
    obj: {},
  },
  mutations: {
    increment (state) {
      // 变更状态
      state.count++
    },
    increment2 (state, payload) {
      state.count += payload.amount
    }
  }
})

this.$store.commit('increment', 10);
this.$store.commit('increment2', {
  amount: 10
});
// 或者如下使用对象的方式commit
this.$store.commit({
  type: 'increment2',
  amount: 10,
});
```

- 当需要在对象上添加新属性时，使用`state.obj = { ...state.obj, newProp: 123 }`
- **mutation 必须是同步函数**，这是因为 任何在回调函数中进行的状态的改变都是不可追踪的。

#### 6.1 辅助函数：mapMutations
```js
import { mapMutations } from 'vuex'

export default {
  // ...
  methods: {
    // 数组的形式
    ...mapMutations([
      'increment', // 这样， this.increment() 就相当于 this.$store.commit('increment')
      'incrementBy', // 也可以传参，this.incrementBy(amount) 就相当于 this.$store.commit('incrementBy', amount)
    ]),

    // 对象的形式
    ...mapMutations({
      add: 'increment' // 这样， this.add() 就相当于 this.$store.commit('increment')
    })
  }
}
```

### 7. actions
- action 提交的是 mutation，而不是直接变更状态
- action 可以包含任意异步操作
- context对象 与 store实例 具有相同的方法和属性，因此可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters
- action 通过 store.dispatch 方法触发，store.dispatch 触发的action返回的是Promise时，store.dispatch 仍旧返回 Promise
- 一个 store.dispatch 在不同模块中可以触发多个 action 函数。在这种情况下，只有当所有触发函数完成后，返回的 Promise 才会执行。

```js
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    },
    incrementAsync ({ commit }) {
      setTimeout(() => {
        commit('increment')
      }, 1000)
    },
    actionPromise ({ commit }) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          commit('someMutation')
          resolve()
        }, 1000)
      })
    },
    actionPromise2 ({ dispatch, commit }) {
      return dispatch('actionPromise').then(() => {
        commit('someOtherMutation')
      })
    },
    // 假设 getData() 和 getOtherData() 返回的是 Promise
    async actionA ({ commit }) {
      commit('gotData', await getData())
    },
    async actionB ({ dispatch, commit }) {
      await dispatch('actionA') // 等待 actionA 完成
      commit('gotOtherData', await getOtherData())
    },
  }
})


this.$store.dispatch('increment')

// payload
this.$store.dispatch('incrementAsync', {
  amount: 10
})

// 对象形式
this.$store.dispatch({
  type: 'incrementAsync',
  amount: 10
})

// store.dispatch 返回 Promise
this.$store.dispatch('actionPromise').then(() => {
  // ...
})
```

#### 7.1 辅助函数：mapActions
```js
import { mapActions } from 'vuex'

export default {
  // ...
  methods: {
    // 数组形式
    ...mapActions([
      'increment', // 这样，this.increment() 就相当于 this.$store.dispatch('increment')
      'incrementBy', // 也可以传参，this.incrementBy(amount) 就相当于 this.$store.dispatch('incrementBy', amount)
    ]),
    // 对象形式
    ...mapActions({
      add: 'increment', // 这样，this.add() 就相当于 this.$store.dispatch('increment')
    })
  }
}
```

### 8. modules
> Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块。这样可以避免当应用变得非常复杂时，所有的state、mutation、action、getter都写在一个对象中，导致store 对象变得相当臃肿。

```js
import { createStore } from 'vuex'

const moduleA = {
  state: () => ({
    stateA: '',
  }),
  mutations: { ... },
  actions: { ... },
  getters: { ... }
}

const moduleB = {
  state: () => ({
    count: 0,
  }),
  mutations: {
    increment (state, payload) { // 这里的 `state` 对象是模块moduleB的局部状态state
      state.count += payload;
    },
  },
  actions: { ... }
}

const store = createStore({ // 使用createStore，或者使用new Vuex.Store，创建store实例
  modules: {
    a: moduleA,
    b: moduleB
  }
})

// 组件中使用
console.log(this.$store.state.a.stateA)

this.$store.commit('b/increment', 1)
```

- `context.rootState` 获取根节点状态