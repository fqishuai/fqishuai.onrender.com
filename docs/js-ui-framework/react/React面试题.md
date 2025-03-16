---
slug: audition
tags: [react]
---

## React18新特性
### Concurrent

### React为什么用`createRoot`取代`ReactDOM.render`？
React 18 引入了新的客户端渲染 API `createRoot`，它取代了旧的 `ReactDOM.render` 方法。这个变化是为了支持 React 的并发特性（Concurrent Features），包括并发模式（Concurrent Mode）和新的更新优先级机制。以下是使用 `createRoot` 而不是 `ReactDOM.render` 的主要原因：

1. **并发模式**：`createRoot` 允许你使用 React 18 的并发模式，这是一种新的渲染策略，可以让 React 在渲染过程中更好地利用多核心处理器的能力，提高应用的响应性和性能。

2. **中断和恢复渲染**：并发模式下，React 可以根据优先级中断和恢复组件的渲染工作。这意味着高优先级的更新（如用户输入）可以打断低优先级的更新（如数据获取），从而提供更流畅的用户体验。

3. **自动批处理**：`createRoot` 提供了自动批处理更新的能力，即使这些更新是由不同事件触发的，也可以将它们合并在一起，减少不必要的渲染次数。

4. **更好的错误处理**：新的渲染 API 提供了更好的错误处理机制，允许开发者更容易地捕获并处理渲染过程中的错误。

5. **未来兼容性**：`createRoot` 是 React 团队为未来的更新和改进铺平道路的一部分。随着 React 的发展，新的特性和优化将会基于这个新的 API 实现。

使用 `createRoot` 的基本示例如下：

```javascript
import { createRoot } from 'react-dom/client';

const container = document.getElementById('app');
const root = createRoot(container); // 创建一个 root
root.render(<App />); // 使用 root.render 来渲染组件
```

虽然 `ReactDOM.render` 在 React 18 中仍然可用，但它已被标记为过时，并且不支持并发特性。因此，推荐新项目使用 `createRoot`，并且建议现有项目在升级到 React 18 时迁移到新的 API。

### 自动批量处理(Automatic Batching)
`setState`是同步还是异步？

### 如何实现错误处理边界


### Suspense
React 的 `Suspense` 组件是一个用于处理组件树中的异步操作的机制。它允许组件“等待”某些内容变得可用，并在此期间显示一个回退（fallback）内容，例如加载指示器。这对于改善用户体验非常有用，因为它可以避免不必要的空白屏幕或加载状态的闪烁。

`Suspense` 最初被引入用于支持 `React.lazy`，这是一种代码分割的方法，允许你动态地加载组件。在 React 18 中，`Suspense` 的能力得到了扩展，现在它也可以用于数据获取。

以下是一个使用 `Suspense` 和 `React.lazy` 的基本示例：

```jsx
import React, { Suspense } from 'react';

const OtherComponent = React.lazy(() => import('./OtherComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OtherComponent />
    </Suspense>
  );
}
```

在这个例子中，`OtherComponent` 是一个动态导入的组件。当 `OtherComponent` 被加载和渲染之前，用户会看到 "Loading..." 文本。

对于数据获取，React 18 引入了新的并发特性，允许 `Suspense` 与新的数据获取库（如 Relay、SWR、React Query 等）一起使用，以实现更加平滑的用户体验。这些库可以提供与 `Suspense` 兼容的数据获取机制，使得组件可以在等待数据时显示回退内容。

使用 `Suspense` 进行数据获取的示例可能如下所示：

```jsx
import React, { Suspense } from 'react';
import { fetchData } from './some-data-fetching-library';

const resource = fetchData();

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading data...</div>}>
      <DataDisplay resource={resource} />
    </Suspense>
  );
}

function DataDisplay({ resource }) {
  const data = resource.read(); // 假设这个方法会抛出一个 promise，直到数据加载完成
  return <div>{data}</div>;
}
```

在这个例子中，`fetchData` 是一个异步函数，返回一个可以被 `Suspense` 使用的资源对象。`DataDisplay` 组件尝试读取数据，如果数据未准备好，它会抛出一个 promise，这会触发 `Suspense` 显示回退内容。

`Suspense` 为异步渲染提供了一个强大的抽象，使得开发者可以更容易地处理异步数据和组件，同时提供更好的用户体验。随着 React 生态系统的发展，我们可以期待 `Suspense` 将会与更多的库和模式集成，以支持更复杂的异步场景。

### SuspenseList
React 的 `SuspenseList` 组件是一个实验性的功能，它允许开发者协调多个 `<Suspense>` 组件之间的加载顺序。`<Suspense>` 组件是 React 用于等待异步操作（如数据获取或代码分割）完成的一种机制。当包裹在 `<Suspense>` 组件内的子组件等待异步操作时，可以显示一个回退（fallback）内容，比如加载指示器。

`SuspenseList` 组件提供了额外的控制，使得开发者可以定义多个 `<Suspense>` 组件加载的顺序和行为。这对于优化用户体验非常有用，特别是在渲染多个依赖于异步数据的组件时。

`SuspenseList` 支持几个属性来控制其子 `<Suspense>` 组件的行为：

- `revealOrder`：定义子组件的显示顺序。它可以是 `"forwards"`、`"backwards"` 或 `"together"`。
  - `"forwards"`：子组件按照它们在 `SuspenseList` 中的顺序显示，即使它们的数据已经准备好了，也会等待前面的组件先显示。
  - `"backwards"`：子组件从最后一个开始显示，向前等待。
  - `"together"`：所有子组件会等待，直到它们都准备好显示，然后一起显示。

- `tail`：定义当 `revealOrder` 是 `"forwards"` 或 `"backwards"` 时，如何处理尚未准备好显示的组件。它可以是 `"collapsed"`、`"hidden"` 或 `undefined`。
  - `"collapsed"`：尚未准备好的组件会被折叠，不显示它们的回退内容。
  - `"hidden"`：尚未准备好的组件会被隐藏，不显示它们的回退内容。

下面是一个 `SuspenseList` 的基本示例：

```jsx
import React, { Suspense } from 'react';
import { SuspenseList } from 'react';

function MyComponent() {
  return (
    <SuspenseList revealOrder="forwards" tail="collapsed">
      <Suspense fallback={<div>Loading item 1...</div>}>
        <Item1 />
      </Suspense>
      <Suspense fallback={<div>Loading item 2...</div>}>
        <Item2 />
      </Suspense>
      <Suspense fallback={<div>Loading item 3...</div>}>
        <Item3 />
      </Suspense>
    </SuspenseList>
  );
}
```

在这个例子中，`Item1`、`Item2` 和 `Item3` 是可能会执行异步操作的组件。`SuspenseList` 确保这些组件按顺序显示，即使它们的数据可能在不同的时间准备好。

请注意，`SuspenseList` 仍然是一个实验性的功能，并没有在 React 18 的稳定版本中正式发布。如果你想尝试 `SuspenseList` 或其他实验性功能，你可能需要使用 React 的实验性版本，并且要做好随时适应变化的准备。

### transition

### 新的API
#### startTransition

#### useTransition

#### useDeferredValue

#### useId

#### useSyncExternalStore

#### useInsertionEffect


## 状态管理
### 如何理解state与props?

### 什么是HOC？
如何“修改”组件props?

### 函数组件中如何使用state?
组件内部/组件外部

### Redux工作原理

### Redux中间件机制

### Redux Toolkit

### Redux/MobX/Recoil解决什么问题？
设计原理分别是什么？

各有什么优势？

## 组件
### 组件如何通信以及不同通信方式的特点

### 常用组件有哪些以及各自特点

### 组件的常见性能优化手段

### 在循环渲染多个组件时，key如何取值？

### 对受控组件和非受控组件的理解


## Hooks
### Hooks解决了什么问题？
为什么要引入Hooks？

### 什么是自定义Hook？

### 函数组件中定义的state保存在哪里？
为什么Hook出现后，函数组件中可以定义state？

### useState与useReducer的区别

### 为什么useState/useReducer返回一个数组？
而不是其他数据类型，比如对象

### useRef与useState的区别

### useEffect与useLayoutEffect的区别

### useEffect/useLayoutEffect中的延迟、同步怎么理解？
任务调度

### 为什么不能在循环、条件或嵌套函数中调用Hook？

### useState/useReducer原理

### useImperativeHandle使用场景

### ahooks使用

## 路由
### 前端路由解决的问题
前端路由是什么？

### 前端路由如何切换页面

### history、hash路由的差异

### react-router6的实现原理

## VDOM diff
### React18 VDOM diff算法

### Vue3 VDOM diff算法

### 对比React18/Vue3 VDOM diff算法

## Context
### Context如何使用

### Context原理
栈

## 架构
### 虚拟DOM是什么
为什么要使用它？

### Fiber是什么

### 时间切片是什么

### React的任务调度机制
React 的任务调度机制是指 React 如何管理和优先处理不同的更新任务。从 React 16 引入的 Fiber 架构开始，React 的任务调度机制变得更加灵活和高效。React 18 进一步增强了这一机制，特别是通过引入并发特性，如并发模式（Concurrent Mode）和新的 API，例如 `startTransition`。

以下是 React 任务调度机制的一些关键点：

1. **Fiber 架构**：
   Fiber 是 React 16 中引入的一种新的内部架构，它允许 React 工作在单个更新上，可以将工作分割成多个小任务，并在必要时中断和恢复这些任务。这种能力使得 React 可以在主线程上执行更多的工作，而不会阻塞用户输入和动画。

2. **并发模式**：
   并发模式是 React 18 中的一个新特性，它允许 React 在渲染时更好地利用并发性，从而提高应用的响应性。在并发模式下，React 可以同时处理多个状态更新，而不是按顺序一个接一个地处理。

3. **任务优先级**：
   React 任务调度机制中的一个关键概念是任务优先级。React 可以根据更新的紧急程度分配不同的优先级。例如，用户交互（如点击按钮）通常具有较高的优先级，而数据获取则可能具有较低的优先级。

4. **startTransition**：
   React 18 引入了 `startTransition` API，它允许开发者将某些更新标记为“过渡”更新。这些更新可以稍后执行，从而允许浏览器优先处理更紧急的任务，如用户输入。

5. **useDeferredValue**：
   `useDeferredValue` 是另一个 React 18 的新 API，它允许开发者推迟某些值的更新，直到主要的渲染工作完成。这有助于避免在执行重要更新时出现性能瓶颈。

6. **调度器（Scheduler）**：
   React 使用了一个名为 Scheduler 的包来帮助管理任务的优先级和调度。Scheduler 提供了一个中央化的地方来协调 React 应用中的所有工作。

React 的任务调度机制是为了确保应用的交互性和流畅性，同时提供了一种方式来控制和优化渲染性能。通过这种机制，React 可以在保持用户界面响应的同时执行后台工作，从而提供更好的用户体验。随着 React 的发展，这个调度机制可能会继续演进和改进。

## 其他
### JSX是什么

### 类组件生命周期
React 类组件的生命周期主要分为三个阶段：挂载（Mounting）、更新（Updating）和卸载（Unmounting）。以下是这些阶段中涉及的主要生命周期方法：

1. 挂载（Mounting）：
   - `constructor(props)`: 组件的构造函数，最先被执行，用于初始化状态和绑定事件处理器。
   - `static getDerivedStateFromProps(props, state)`: 在渲染前调用，用于根据props来更新state。
   - `render()`: 渲染组件，返回React元素。
   - `componentDidMount()`: 组件挂载（插入DOM树中）后调用，适合执行副作用操作，如发起网络请求、DOM操作等。

2. 更新（Updating）：
   - `static getDerivedStateFromProps(props, state)`: 更新时调用，用于根据props来更新state。
   - `shouldComponentUpdate(nextProps, nextState)`: 决定组件是否应该更新，返回布尔值。
   - `render()`: 重新渲染组件。
   - `getSnapshotBeforeUpdate(prevProps, prevState)`: 获取更新前的DOM快照，发生在更新DOM和refs之前。
   - `componentDidUpdate(prevProps, prevState, snapshot)`: 更新后调用，可以执行DOM操作或发起网络请求。

3. 卸载（Unmounting）：
   - `componentWillUnmount()`: 组件卸载前调用，用于执行清理操作，如取消网络请求、移除事件监听器等。

注意：React 16.3版本引入了新的生命周期方法，并且逐渐废弃了一些旧的生命周期方法（如`componentWillMount`、`componentWillReceiveProps`和`componentWillUpdate`）。在编写新代码时，应避免使用这些即将被废弃的方法。

React 16 废弃了一些旧的生命周期方法，主要是因为以下几个原因：

1. **异步渲染的准备**：React 团队为了使React能够支持异步渲染（即React Fiber架构），需要确保组件的生命周期方法不会因为异步渲染的引入而导致潜在的bug或不一致的行为。旧的生命周期方法在异步渲染环境下可能会被多次调用，从而引发问题。

2. **避免不安全的编码实践**：某些生命周期方法（如`componentWillMount`、`componentWillReceiveProps`和`componentWillUpdate`）经常被误用来执行副作用操作（如数据获取、订阅等），这些操作应该在`componentDidMount`或`componentDidUpdate`中进行。在即将废弃的方法中执行这些操作可能会导致不一致的状态和内存泄漏等问题。

3. **简化组件逻辑**：通过引入新的生命周期方法（如`getDerivedStateFromProps`和`getSnapshotBeforeUpdate`），React 提供了更清晰和更具可预测性的方式来处理特定的用例，从而简化了组件逻辑的编写和理解。

4. **更好的性能**：避免使用即将废弃的生命周期方法可以减少React在更新过程中的工作量，从而提高性能。

为了向前兼容，这些生命周期方法在React 16中被标记为不安全，并在开发模式下触发警告，但在React 17中被完全移除。开发者被鼓励迁移到新的生命周期方法，以确保代码的健壮性和未来的兼容性。

React 的函数组件没有像类组件那样的生命周期方法，因为它们本质上是无状态的，并且是纯函数。然而，React Hooks API 的引入允许函数组件模拟类组件的生命周期行为。

以下是一些常用的 React Hooks，它们可以在函数组件中模拟生命周期行为：

1. **`useState`**:
   用于在函数组件中添加状态。

2. **`useEffect`**:
   用于处理副作用，可以模拟 `componentDidMount`、`componentDidUpdate` 和 `componentWillUnmount` 生命周期方法。通过在 `useEffect` 的依赖数组中传递不同的值，你可以控制副作用函数的执行时机。

   - 空依赖数组 `[]`：副作用函数仅在组件挂载时执行一次，类似于 `componentDidMount`。
   - 有依赖的数组 `[deps]`：副作用函数在挂载时和依赖项变化时执行，类似于 `componentDidUpdate`。
   - 返回一个清理函数：在组件卸载时或依赖项变化前执行清理，类似于 `componentWillUnmount`。

3. **`useContext`**:
   用于访问 React 上下文（context），允许组件订阅 React 上下文的变化。

4. **`useReducer`**:
   用于在组件中使用 reducer 来管理复杂状态逻辑，类似于 Redux 或类组件中的 `this.setState`。

5. **`useRef`**:
   用于创建一个可变的 ref 对象，可以用来访问 DOM 节点或存储可变值，而不会触发组件重新渲染。

6. **`useMemo` 和 `useCallback`**:
   用于优化性能，避免不必要的重新计算和渲染。

通过这些 Hooks，函数组件可以实现类似于类组件生命周期方法的行为，同时保持函数式组件的简洁和易用性。Hooks API 的引入使得函数组件成为了 React 中推荐的组件编写方式。

### React事件机制
React 的事件机制是一个封装了浏览器原生事件系统的抽象层，它提供了一些关键特性来简化事件处理并确保跨浏览器的一致性。以下是 React 事件机制的核心特点：

1. **合成事件（SyntheticEvent）**：
   React 创建了自己的事件包装器，称为合成事件。这些合成事件封装了浏览器的原生事件，提供了跨浏览器的一致接口。合成事件具有与原生事件相似的属性和方法，但它们在所有浏览器中的行为是统一的。

2. **事件委托（Event Delegation）**：
   React 通常不会将事件处理器直接绑定到 DOM 元素上。相反，它在 DOM 树的较高层级（通常是根节点）上使用事件委托。这意味着所有的事件处理器都被附加到一个共同的祖先元素上，利用事件冒泡机制来处理事件。这有助于减少内存占用并提高性能。

3. **批处理更新（Batched Updates）**：
   当事件处理函数被触发时，React 会将多个状态更新批量处理，这样可以在一个事件循环中执行多个更新。这有助于优化性能，因为它减少了不必要的渲染和 DOM 操作。

4. **合成事件池（Event Pooling）**：
   为了提高性能，React 会重用合成事件对象。这意味着事件对象在事件回调函数执行完毕后会被清空，并且回收到一个池中以供后续事件重用。因此，不应该在异步代码中引用这些事件对象，因为它们的值可能会被清除。

5. **非受控组件（Uncontrolled Components）**：
   虽然 React 推荐使用受控组件来处理表单输入，但在非受控组件中，你可以使用 ref 直接与 DOM 节点交互，并可能需要处理原生 DOM 事件。

6. **自定义组件事件**：
   在自定义组件中，你可以传递回调作为 props，类似于传递原生事件处理器。这允许在组件树中向上传递事件和数据。

React 的事件系统是其声明式编程模型的一个重要组成部分，它简化了事件处理并提供了一种高效的方式来更新 UI。随着 React 的发展，事件机制可能会继续演进，但上述特点提供了一个基本的理解框架。

#### `packages/react-dom/src/events`
这个目录包含了 React 事件系统的大部分逻辑，包括不同类型的事件插件和事件处理的核心代码。

##### `packages/react-dom/src/events/DOMPluginEventSystem.js`
> [React18 事件系统源码解析](https://juejin.cn/post/7191308289177550906)

`listenToAllSupportedEvents` 是 React 源码中的一个内部函数，它不是公开的 API，而是 React 事件系统的一部分。这个函数的作用是在文档级别（通常是 `document` 对象）上为所有支持的事件类型添加事件监听器。React 事件系统使用这种机制来实现事件委托，即将事件监听器放在更高的 DOM 层级上，而不是直接绑定到每个元素上。

通过这种方式，React 可以在一个中央位置处理所有的事件，并根据需要将它们分派到具体的组件。当一个事件发生时，React 会根据事件的目标元素和冒泡路径来确定哪个组件应该接收该事件，并调用相应的事件处理函数。

这个机制有几个好处：

1. **性能优化**：减少了直接绑定到元素上的事件监听器的数量，这有助于减少内存占用，并提高大型应用的性能。

2. **一致性**：React 可以确保事件的行为在不同浏览器中保持一致，因为它使用合成事件来封装原生事件。

3. **React 特性支持**：这种事件处理方式与 React 的虚拟 DOM 和组件生命周期紧密集成，使得状态更新和视图渲染可以更加高效。

由于 `listenToAllSupportedEvents` 是 React 内部实现的一部分，开发者通常不需要直接与之交互。React 会自动处理事件监听和分派的细节，开发者只需要通过 JSX 语法为组件添加事件处理函数即可。

### React事件绑定的方式有哪些？
有什么区别？

### React渲染机制


### 脚手架选择
如何搭建一个React项目

### React版本之间的差异