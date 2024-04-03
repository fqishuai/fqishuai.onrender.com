---
slug: built-in-apis
tags: [react]
---

- `createContext`: 通常会与 `useContext` 一起配合使用。创建一个 context，你可以将其提供给子组件。
- `forwardRef`: 通常会与 `useRef` 一起配合使用。允许组件将 DOM 节点作为 ref 暴露给父组件。
- `lazy`: 允许你延迟加载组件，直到该组件需要第一次被渲染。
- `memo`: 通常会与 `useMemo` 和 `useCallback` 一起配合使用。用于在组件的 `props` 未更改时跳过组件的重新渲染(skip re-renders)。
- `startTransition`: 与 `useTransition` 类似。用于将状态更新标记为非紧急。

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