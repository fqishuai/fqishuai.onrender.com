---
slug: built-in-apis
tags: [react]
---

内置的 React API:
- `createContext`: 通常会与 `useContext` 一起配合使用。创建一个 context，你可以将其提供给子组件。
- `forwardRef`: 通常会与 `useRef` 一起配合使用。允许组件将 DOM 节点作为 ref 暴露给父组件。
- `lazy`: 允许你延迟加载组件，直到该组件需要第一次被渲染。
- `memo`: 通常会与 `useMemo` 和 `useCallback` 一起配合使用。用于在组件的 `props` 未更改时跳过组件的重新渲染(skip re-renders)。
- `startTransition`: 与 `useTransition` 类似。用于将状态更新标记为非紧急。
- `act`: 允许你在测试中包装渲染和交互，以确保在断言之前已完成更新。

## `forwardRef`
:::tip
当你在浏览器元素上放置一个 ref 时(如，`<input ref={inputRef}>`)，React 会将该 ref 的 current 属性设置为相应的 DOM 节点。但是，如果您尝试在自定义的组件上放置ref，例如 `<MyInput ref={inputRef} />`，默认情况下您将得到 `null`。这是因为默认情况下 React 不允许组件访问其他组件(连自己的孩子组件都不行)的 DOM 节点，手动操作另一个组件的 DOM 节点会使您的代码更加脆弱。可以使用`React.forwardRef()`来传递自定义组件的ref。
:::

```jsx
import { forwardRef, useRef } from 'react';

// MyInput将收到的ref传递给其中的 <input>
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

## `createContext`
语法：`createContext(defaultValue)`
- `defaultValue`：当读取上下文的组件上方的树中没有匹配的上下文时，希望该上下文具有的默认值。倘若没有任何有意义的默认值，可指定其为 `null`。该默认值是用于作为“最后的手段”的后备方案。它是静态的，永远不会随时间改变。

- 返回一个上下文对象。该上下文对象本身不包含任何信息。它只表示其他组件读取或提供的那个上下文。一般来说，在组件上方使用 `SomeContext.Provider` 指定上下文的值，并在被包裹的下方组件内调用 `useContext(SomeContext)` 读取它。上下文对象有一些属性：
  - `SomeContext.Provider` 让你为被它包裹的组件提供上下文的值。
    ```js
    import { createContext } from 'react';

    const ThemeContext = createContext('light');

    function App() {
      const [theme, setTheme] = useState('light');
      // ……
      return (
        <ThemeContext.Provider value={theme}>
          <Page />
        </ThemeContext.Provider>
      );
    }
    ```

    `value`：该值为想传递给所有处于这个 provider 内读取该上下文的组件，无论它们处于多深的层级。上下文的值可以为任何类型。provider 内的组件可通过调用 `useContext(SomeContext)` 获取上方距离它最近的上下文 provider 的 `value`。

  - `SomeContext.Consumer` 它用于读取上下文的值，遗留方式 (不推荐)。应该通过 `useContext()` 来读取上下文(当来自父组件的上下文发生变化时，React 会重新调用该函数)：
    ```js
    function Button() {
      // ✅ 推荐方式
      const theme = useContext(ThemeContext);
      return <button className={theme} />;
    }
    ```

上下文使得组件能够无需通过显式传递参数的方式 将信息逐层传递。在任何组件外调用 `createContext` 来创建一个或多个上下文。
```js title="Contexts.js"
import { createContext } from 'react';

export const ThemeContext = createContext('light');
export const AuthContext = createContext(null);
```

上下文之所以有用，是因为可以 提供来自其他组件的其他的、动态变化的值：
```js
// Page 组件以及其所包裹的任何子组件，无论层级多深，都会看到传入上下文的值。
// 如果上下文的值发生变化， React 也会重新渲染读取该值的组件。
import { ThemeContext, AuthContext } from './Contexts.js';

function App() {
  const [theme, setTheme] = useState('dark');
  const [currentUser, setCurrentUser] = useState({ name: 'Taylor' });

  // ...

  return (
    <ThemeContext.Provider value={theme}>
      <AuthContext.Provider value={currentUser}>
        <Page />
      </AuthContext.Provider>
    </ThemeContext.Provider>
  );
}
```

## `memo`
React中 每当组件的父组件重新渲染时，通常都会重新渲染该组件。使用 `memo` 包装组件，只要组件的 `props` 没有改变，当它的父组件重新渲染时，组件通常不会被重新渲染。语法：`memo(Component, arePropsEqual?)` 其中 `Component` 可以是任何有效的 React 组件，包括 `forwardRef` 返回的组件；`arePropsEqual`是可选的，用于自定义比较函数。

注意：仅当您的组件经常使用相同的`props`重新渲染时，使用`memo`进行优化才有价值。如果传递给组件的`props 始终不同，例如传递一个对象或在渲染期间定义的普通函数，那么 `memo` 是完全没有用的。

### 用处：当 `props` 不变时跳过重新渲染
使用 `memo`，您可以创建一个组件，只要其新 `props` 与旧 `props` 相同，React 就不会在其父级重新渲染时重新渲染。

注意：即使使用`memo`，如果组件自身的状态(state)发生变化或者它正在使用的上下文(context)发生变化，您的组件也会重新渲染。

在下面示例中，请注意，每当name更改时 Greeting 组件都会重新渲染（因为这是它的 props 之一），但在address更改时则不会重新渲染（因为它没有作为 props 传递给 Greeting）：
```jsx
import { memo, useState } from 'react';

export default function MyApp() {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  return (
    <>
      <label>
        Name{': '}
        <input value={name} onChange={e => setName(e.target.value)} />
      </label>
      <label>
        Address{': '}
        <input value={address} onChange={e => setAddress(e.target.value)} />
      </label>
      <Greeting name={name} />
    </>
  );
}

const Greeting = memo(function Greeting({ name }) {
  console.log("Greeting was rendered at", new Date().toLocaleTimeString());
  return <h3>Hello{name && ', '}{name}!</h3>;
});
```

### 尽量减少`props`变化
当您使用 `memo` 时，只要任何 `prop` 不浅等于之前的值，您的组件就会重新渲染。这意味着 React 使用 `Object.is` 将组件中的每个 `prop` 与其之前的值进行比较。请注意，`Object.is(3, 3)` 为 `true`，但 `Object.is({}, {})` 为 `false`。为了充分利用`memo`，请尽量减少`props`更改的次数。例如，如果 `prop` 是一个对象，请使用 `useMemo` 防止父组件每次都重新创建该对象：
```jsx
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);

  const person = useMemo(
    () => ({ name, age }),
    [name, age]
  );

  return <Profile person={person} />;
}

const Profile = memo(function Profile({ person }) {
  // ...
});
```

最小化 `props` 更改的更好方法是确保组件在其 `props` 中接受最少的必要信息。例如，它可以接受单个值而不是整个对象：
```jsx
function Page() {
  const [name, setName] = useState('Taylor');
  const [age, setAge] = useState(42);
  return <Profile name={name} age={age} />;
}

const Profile = memo(function Profile({ name, age }) {
  // ...
});
```