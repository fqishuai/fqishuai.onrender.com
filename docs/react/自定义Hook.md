---
slug: custom-hooks
tags: [react]
---

即使不同的组件具有不同的视觉外观，您也想重用它们之间的逻辑，这时候可以考虑通过自定义hook来实现。当您将逻辑提取到自定义 Hook 中时，您可以隐藏如何处理某些外部系统或浏览器 API 的粗糙细节。**React中hook必须以`use`开头，后跟大写字母。hook可以返回任意值。只有Hooks和组件才能调用其他Hooks！不调用 Hook 的函数不需要是 Hook。**如果您的函数不调用任何 Hook，请避免使用 `use` 前缀。

例如，判断设备是否联网的重复逻辑：
```jsx
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    // 监听设备联网的状态
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```
将重复逻辑提取到自定义的hook中：
```js title="useOnlineStatus.js"
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```
使用该自定义hook:
```jsx
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

## 自定义Hook共享状态逻辑
自定义 Hook 共享的只是状态逻辑而不是状态本身。(当你需要在多个组件之间共享 `state` 本身时，需要 将变量提升并传递下去。)

**对 Hook 的每次调用完全独立于对同一个 Hook 的其他调用。**

例子:
```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```
提取重复逻辑到自定义hook中：
```js title="useFormInput.js"
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```
使用该自定义hook:
```jsx
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

## 自定义Hook需要是纯函数
每当组件重新渲染，自定义 Hook 中的代码就会重新运行。这就是组件和自定义 Hook 都 需要是纯函数 的原因。

由于自定义 Hook 会随着组件一起重新渲染，所以组件可以一直接收到最新的 `props` 和 `state`。

例子：
```jsx title="ChatRoom.jsx"
import { useState, useEffect } from 'react';
import { createConnection } from './chat.js';
import { showNotification } from './notifications.js';

export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  // 当你修改 serverUrl 或者 roomId 时，Effect 会对 你的修改做出“响应” 并重新同步。
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    connection.connect();
    return () => connection.disconnect();
  }, [roomId, serverUrl]);

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```
将 Effect 代码移入自定义 Hook：
```js title="useChatRoom.js"
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```
ChatRoom 组件调用自定义 Hook，而不需要关心内部怎么工作：
```jsx title="ChatRoom.jsx"
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```
每次 `ChatRoom` 组件重新渲染时，它都会将最新的 `roomId` 和 `serverUrl` 传递给自定义Hook `useChatRoom`。

## 将事件处理程序传递给自定义Hook
自定义 Hook 接受事件处理函数:
```js title="useChatRoom.js"
export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onReceiveMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl, onReceiveMessage]); // ✅ 声明了所有的依赖
}
```
增加对 `onReceiveMessage` 的依赖并不理想，通过 将这个事件处理函数包裹到 Effect Event 中来将它从依赖中移除：
```js title="useChatRoom.js"
import { useEffect, useEffectEvent } from 'react';
// ...

export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
  const onMessage = useEffectEvent(onReceiveMessage);

  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      onMessage(msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]); // ✅ 声明所有依赖
}
```
```jsx title="ChatRoom.jsx"
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl,
    onReceiveMessage(msg) {
      showNotification('New message: ' + msg);
    }
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

## 何时使用自定义Hook
你没必要对每段重复的代码都提取自定义 Hook。但是每当你写 Effect 时，考虑一下把它包裹在自定义 Hook 是否更清晰。你不应该经常使用 Effect，所以如果你正在写 Effect 就意味着你需要“走出 React”和某些外部系统同步，或者需要做一些 React 中没有对应内置 API 的事。把 Effect 包裹进自定义 Hook 可以准确表达你的目标以及数据在里面是如何流动的。

例如，假设 `ShippingForm` 组件展示两个下拉菜单：一个显示城市列表，另一个显示选中城市的区域列表。你可能一开始会像这样写代码：
```jsx
function ShippingForm({ country }) {
  const [cities, setCities] = useState(null);
  // 这个 Effect 拉取一个国家的城市数据
  useEffect(() => {
    let ignore = false;
    fetch(`/api/cities?country=${country}`)
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setCities(json);
        }
      });
    return () => {
      ignore = true;
    };
  }, [country]);

  const [city, setCity] = useState(null);
  const [areas, setAreas] = useState(null);
  // 这个 Effect 拉取选中城市的区域列表
  useEffect(() => {
    if (city) {
      let ignore = false;
      fetch(`/api/areas?city=${city}`)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setAreas(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [city]);

  // ...
```

提取其中的通用逻辑到你自己的 `useData` Hook 来简化上面的 `ShippingForm` 组件：
```js
function useData(url) {
  const [data, setData] = useState(null);
  useEffect(() => {
    if (url) {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }
  }, [url]);
  return data;
}
```
在 `ShippingForm` 组件中调用 `useData` 替换两个 Effect：
```jsx
function ShippingForm({ country }) {
  const cities = useData(`/api/cities?country=${country}`);
  const [city, setCity] = useState(null);
  const areas = useData(city ? `/api/areas?city=${city}` : null);
  // ...
```

Effect 是一个 [脱围机制](https://zh-hans.react.dev/learn/escape-hatches)：当需要“走出 React”且没有更好的内置解决方案时你可以使用他们。随着时间的推移，React 团队的目标是通过给更具体的问题提供更具体的解决方案来最小化应用中的 Effect 数量。把你的 Effect 包裹进自定义 Hook，当这些解决方案可用时升级代码会更加容易。例如，React 18 包含了一个叫做 `useSyncExternalStore` 的专用 API，可以利用这个新 API 来重写你的 `useOnlineStatus` Hook：
```js title="useOnlineStatus.js"
import { useSyncExternalStore } from 'react';

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

export function useOnlineStatus() {
  return useSyncExternalStore(
    subscribe,
    () => navigator.onLine, // 如何在客户端获取值
    () => true // 如何在服务端获取值
  );
}
```

把 Effect 包裹进自定义 Hook 的益处：
- 你让进出 Effect 的数据流非常清晰。
- 你让组件专注于目标，而不是 Effect 的准确实现。
- 当 React 增加新特性时，你可以在不修改任何组件的情况下移除这些 Effect。

## 自定义hook的state
### 触发更新
在 React 中，当自定义 Hook 中的 `state` 更新时，会触发以下几种更新：

1. **使用该 Hook 的组件重新渲染**：
   - 当自定义 Hook 中的 `state` 更新时，使用该 Hook 的组件会重新渲染。这是因为 React 的状态更新机制会触发组件的重新渲染。

2. **依赖该状态的 `useEffect` 钩子重新执行**：
   - 如果在自定义 Hook 或使用该 Hook 的组件中有依赖于该状态的 `useEffect` 钩子，当状态更新时，这些 `useEffect` 钩子会重新执行。


以下是一个详细的示例，展示了自定义 Hook 中的 `state` 更新如何触发组件重新渲染和 `useEffect` 钩子的重新执行。

```jsx
import { useState, useEffect } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prevCount => prevCount + 1);
  const decrement = () => setCount(prevCount => prevCount - 1);

  useEffect(() => {
    console.log(`Count has changed to: ${count}`);
  }, [count]);

  return { count, increment, decrement };
}

export default useCounter;
```

使用自定义 Hook 的组件：

```jsx
import React, { useEffect } from 'react';
import useCounter from './useCounter';

function CounterComponent() {
  const { count, increment, decrement } = useCounter(0);

  useEffect(() => {
    console.log('CounterComponent rendered');
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

export default CounterComponent;
```

解释：

1. **组件重新渲染**：
   - 当 `increment` 或 `decrement` 函数被调用时，`count` 状态会更新。
   - 由于 `count` 状态的更新，`CounterComponent` 会重新渲染。
   - 在重新渲染时，`useEffect` 钩子中的 `console.log('CounterComponent rendered')` 会被执行。

2. **`useEffect` 钩子重新执行**：
   - 在自定义 Hook 中，`useEffect` 钩子依赖于 `count` 状态。
   - 当 `count` 状态更新时，`useEffect` 钩子会重新执行，并打印新的计数值。

通过这种方式，自定义 Hook 中的 `state` 更新会触发使用该 Hook 的组件重新渲染，并且依赖该状态的 `useEffect` 钩子也会重新执行。

### 重新执行
在 React 中，自定义 Hook 本质上是一个函数，当组件调用它时会执行一次。自定义 Hook 中的 `state` 更新不会直接触发该 Hook 重新执行，但会触发使用该 Hook 的组件重新渲染。由于组件重新渲染时会重新调用自定义 Hook，因此看起来像是自定义 Hook 重新执行了。

1. **自定义 Hook 是一个函数**：
   - 自定义 Hook 是一个普通的 JavaScript 函数，通常以 `use` 开头。
   - 当组件调用这个 Hook 时，Hook 函数会执行一次。

2. **状态更新触发组件重新渲染**：
   - 当自定义 Hook 中的 `state` 更新时，使用该 Hook 的组件会重新渲染。
   - 组件重新渲染时，会重新调用自定义 Hook。

3. **自定义 Hook 的重新执行**：
   - 由于组件重新渲染时会重新调用自定义 Hook，因此自定义 Hook 中的代码会再次执行。
   - 这包括重新计算状态、重新设置副作用等。

以下是一个示例，展示了自定义 Hook 中的 `state` 更新如何触发组件重新渲染，并导致自定义 Hook 重新执行。

```jsx
import { useState, useEffect } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(prevCount => prevCount + 1);
  const decrement = () => setCount(prevCount => prevCount - 1);

  useEffect(() => {
    console.log('useCounter executed');
  });

  return { count, increment, decrement };
}

export default useCounter;
```

```jsx
import React, { useEffect } from 'react';
import useCounter from './useCounter';

function CounterComponent() {
  const { count, increment, decrement } = useCounter(0);

  useEffect(() => {
    console.log('CounterComponent rendered');
  });

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
}

export default CounterComponent;
```

解释：

1. **自定义 Hook 执行**：
   - 当 `CounterComponent` 首次渲染时，`useCounter` 自定义 Hook 会被调用，并执行其内部代码。
   - `useEffect` 钩子中的 `console.log('useCounter executed')` 会被执行。

2. **状态更新触发重新渲染**：
   - 当用户点击 "Increment" 或 "Decrement" 按钮时，`count` 状态会更新。
   - 状态更新会触发 `CounterComponent` 重新渲染。

3. **自定义 Hook 重新执行**：
   - 由于 `CounterComponent` 重新渲染，`useCounter` 自定义 Hook 会再次被调用，并重新执行其内部代码。
   - `useEffect` 钩子中的 `console.log('useCounter executed')` 会再次被执行。

通过这种方式，自定义 Hook 中的 `state` 更新会间接导致该 Hook 重新执行，因为使用该 Hook 的组件会重新渲染。

### 状态保留
自定义 Hook 重新执行时，其内部的 `state` 会保留。这是因为 React 的 `useState` 钩子会在组件的整个生命周期内保持状态的一致性，即使组件重新渲染或自定义 Hook 重新执行，状态也不会丢失。

状态的持久性：
- React 的 `useState` 钩子会在组件的整个生命周期内保持状态的一致性。
  - 当组件重新渲染时，React 会记住之前的状态值，并将其传递给 `useState`。
- 自定义 Hook 的状态管理：
  - 自定义 Hook 中使用的 `useState` 钩子与在组件中直接使用 `useState` 钩子没有区别。
  - 当自定义 Hook 重新执行时，React 会确保 `useState` 返回的状态值是最新的。

### 更新state
在 React 中，自定义 Hook 可以返回其内部的状态和状态更新函数，以便使用该 Hook 的组件可以访问和修改这些状态。以下是一个详细的示例，展示了如何创建一个自定义 Hook，并在使用该 Hook 的组件中访问和修改其状态。

首先，我们创建一个自定义 Hook `useCounter`，它包含一个计数器状态和一个更新计数器的函数。`increment` 函数将接受一个参数，并根据传入的参数来增加计数器的值。

```jsx
import { useState } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = (value = 1) => setCount(prevCount => prevCount + value);
  const decrement = (value = 1) => setCount(prevCount => prevCount - value);

  return { count, increment, decrement, setCount };
}

export default useCounter;
```

接下来，我们创建一个组件来使用这个自定义 Hook，并展示如何访问和修改其状态。

```jsx
import React from 'react';
import useCounter from './useCounter';

function CounterComponent() {
  const { count, increment, decrement, setCount } = useCounter(0);

  const handleInputChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    if (!isNaN(newValue)) {
      setCount(newValue);
    }
  };

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => increment(2)}>Increment by 2</button>
      <button onClick={() => decrement(2)}>Decrement by 2</button>
      <input type="number" value={count} onChange={handleInputChange} />
    </div>
  );
}

export default CounterComponent;
```

解释:

1. 自定义 Hook (`useCounter`)：
- 使用 `useState` 来管理计数器的状态。
- 提供 `increment` 和 `decrement` 函数，这些函数接受一个参数 `value`，并根据传入的参数来增加或减少计数器的值。默认值为 `1`。
- 返回计数器的当前值 `count`、更新计数器的函数 `increment` 和 `decrement`，以及直接设置计数器值的函数 `setCount`。

2. 使用自定义 Hook 的组件 (`CounterComponent`)：
- 调用 `useCounter` 来获取计数器的当前值和更新函数。
- 渲染计数器的值，并提供按钮来增加或减少计数器的值。按钮点击时调用 `increment` 和 `decrement` 函数，并传入参数 `2`。
- 提供一个输入框，允许用户直接输入新的计数器值，并使用 `setCount` 函数更新计数器的状态。
