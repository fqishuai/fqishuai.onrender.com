---
slug: usage
tags: [react, 记录]
---

:::info
[React官方中文文档](https://zh-hans.react.dev/)

[可视化介绍React](https://react.gg/visualized)
:::

## 使用vite搭建react+typescript工程
1. `pnpm create vite` 选择React、TypeScript（SWC熟练的话可以选择TypeScript+SWC）
2. 生成的`tsconfig.json` 和 `tsconfig.node.json`配置文件如下
```json title="tsconfig.json"
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```
```json title="tsconfig.node.json"
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- 其中`"moduleResolution": "bundler"`会导致使用`<div>`等标签时ts报错：`JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.`，改为`"moduleResolution": "node"`。(注意：`tsconfig.node.json`中的`"moduleResolution": "bundler"`也需要改为`"moduleResolution": "node"`)

- 由于`allowImportingTsExtensions`配置项需要`"moduleResolution": "bundler"`并且需要配置`noEmit`或`emitDeclarationOnly`：`Requires '--moduleResolution bundler' and either '--noEmit' or '--emitDeclarationOnly' to be set.`，所以去掉`"allowImportingTsExtensions": true,`

- `import React from 'react';import ReactDOM from 'react-dom/client';`这种import引入会ts报错：`This module is declared with 'export =', and can only be used with a default import when using the 'allowSyntheticDefaultImports' flag.`，在`tsconfig.json`中设置`"allowSyntheticDefaultImports": true`来解决

- `import App from './App.tsx'`ts报错：`An import path cannot end with a '.tsx' extension. Consider importing './App.js' instead.`，改为`import App from './App'`来解决

3. 设置打包后的目录
```ts title="vite.config.ts"
  build: {
    outDir: 'afterSales',
  },
```

4. vite本身支持scss `pnpm add -D sass`后就可以使用scss
5. 引入react router `pnpm add react-router-dom`
6. 设置react页面的title可以用useEffect
```jsx
useEffect(() => {
  document.title = '页面title'
})
```
7. vite配置项目别名，vite配置文件 和 ts配置文件都需要设置
> [vite中alias别名配置](https://juejin.cn/post/7017701897662365709)
- 使用到`path`、`__dirname`、`__filename`等，需要`pnpm add -D @types/node`
```ts title="vite.config.ts"
import path from "path";

resolve: {
  alias: {
    "@": path.resolve(__dirname, "src"),
    "@pages": path.resolve(__dirname, "src/pages"),
  },
},
```
```json title="tsconfig.json"
"compilerOptions": {
  "baseUrl": "./",
  "paths":{
    "@/*": ["src/*"],
    "@pages/*": ["src/pages/*"],
  },
}
```

8. 如果项目在生产环境想共用已有域名，则可以配置nginx，并相应设置vite打包的`base`及react router的`basename`
比如已有域名aaa.com，项目在生产环境想使用aaa.com/b

- nginx配置
```js
server {
  listen          80;
  server_name     aaa.com;

  root /export/App/dist;

  index index.html;

  location / {
    root /export/App/dist;
    if ($request_filename ~* .*\.(?:htm|html)$)
    {
      add_header Cache-Control "no-store";
    }
    add_header Cache-Control "no-cache";
  }
  
  location /b/ {
    root /export/App/dist/;
    try_files $uri $uri/ /b/index.html;
    if ($request_filename ~* .*\.(?:htm|html)$)
    {
      add_header Cache-Control "no-store";
    }
    add_header Cache-Control "no-cache";
  }
}
```

- vite配置打包的`base`
```ts title="vite.config.ts"
base: '/b/',
```

- react router 配置`basename`
```tsx title="src/main.tsx"
const router = createBrowserRouter([
  {
    path: "/",
    element: <Manage />,
  },
], {
  basename: '/b',
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
```

9. vite环境变量
[环境变量和模式](https://cn.vitejs.dev/guide/env-and-mode.html#env-variables)

- 可以新建配置文件`.env.staging`、`.env.production`
```bash title=".env.staging"
# staging(预发布)模式
VITE_NODE_ENV=prepare
```
```bash title=".env.production"
# production(生产)模式
VITE_NODE_ENV=production
```

- 创建相应的script命令
```json title="package.json"
"scripts": {
  "dev": "vite",
  "pre": "vite --mode staging",
  "prod": "vite --mode production",
  "build": "tsc && vite build",
  "buildPre": "tsc && vite build --mode staging",
  "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
  "preview": "vite preview"
},
```

- 文件中使用：`import.meta.env.VITE_NODE_ENV`

10.  vite开发配置开启https
如下配置，浏览器访问时提示“使用了不受支持的协议”，这是因为https协议需要一个合法可用的证书。
```ts title="vite.config.ts"
server: {
  host: 'test.com',
  port: 443,
  strictPort: true,
  https: true,
},
```
本地开发时，可以添加 `@vitejs/plugin-basic-ssl` 到项目插件中，它会自动创建和缓存一个自签名的证书。
```bash
pnpm add -D @vitejs/plugin-basic-ssl
```
```ts title="vite.config.ts"
import basicSsl from '@vitejs/plugin-basic-ssl'

export default {
  plugins: [
    basicSsl()
  ],
  server: {
    host: 'test.com',
    port: 443,
    strictPort: true,
    https: true, // 不设置也行，@vitejs/plugin-basic-ssl 插件会强制开启https
  },
}
```

11. vite开发配置使用代理
```ts title="vite.config.ts"
  server: {
    port: 8080, // 设置开发服务器的端口号
    host: 'test.com', // 设置开发服务器的主机名
    open: true, // 是否在服务器启动时自动在浏览器中打开应用
    // 服务器代理配置
    proxy: {
      '^/node/.*': {
        target: 'http://127.0.0.1:7001',
        changeOrigin: true,
      },
      '/api': {
        target: 'https://example.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  }
```

## 在React项目中使用TypeScript
:::tip
[React TypeScript 备忘单](https://react-typescript-cheatsheet.netlify.app/)
:::

### 使用useState声明state时声明类型
[How to use React useState hook with Typescript](https://reacthustle.com/blog/how-to-use-react-usestate-with-typescript)

### `React.FC`
`React.FunctionComponent` 或 `React.FC` 显示标明返回的是一个函数组件

### MutableRefObject
`MutableRefObject` 是 `useRef` 钩子返回的对象类型，用于在 React 组件中创建和管理可变的引用对象。它的 `current` 属性可以存储任何可变的值，并在组件的整个生命周期内保持不变。`useRef` 常用于访问和操作 DOM 元素，但也可以用于存储其他可变值。通过使用 `useRef` 和 `MutableRefObject`，你可以在 React 组件中更方便地管理和操作可变的引用对象。

在 TypeScript 中，`MutableRefObject` 的类型定义如下：
```typescript
interface MutableRefObject<T> {
  current: T;
}
```

`useRef` 常用于访问和操作 DOM 元素。例如：
```javascript
import React, { useRef, useEffect } from 'react';

const MyComponent = () => {
  // 创建一个 MutableRefObject，初始值为 null
  const divRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (divRef.current) {
      // 访问和操作 DOM 元素
      divRef.current.style.backgroundColor = 'lightblue';
    }
  }, []);

  return (
    <div ref={divRef}>
      This div has a light blue background.
    </div>
  );
};

export default MyComponent;
```

除了处理 DOM 元素，`useRef` 还可以用于存储其他可变值，例如计数器、定时器 ID 等：
```javascript
import React, { useRef, useEffect } from 'react';

const TimerComponent = () => {
  const timerId = useRef<number | null>(null);

  useEffect(() => {
    timerId.current = window.setTimeout(() => {
      console.log('Timer expired');
    }, 1000);

    return () => {
      if (timerId.current !== null) {
        clearTimeout(timerId.current);
      }
    };
  }, []);

  return (
    <div>
      <p>Check the console for the timer message.</p>
    </div>
  );
};

export default TimerComponent;
```

## key是数组index或者key重复时删除数组渲染会有问题
可以使用随机数
```tsx
setDetailList([{id: Math.random()}]);
```

## react项目keep-alive
[react-activation](https://github.com/CJY0208/react-activation/tree/master)

### 基本使用
1. 安装：`pnpm add react-activation`
2. 在不会被销毁的位置(一般为应用入口处)放置 `<AliveScope>` 外层，用 `<KeepAlive>` 包裹需要保持状态的组件

:::tip
- 建议使用 babel 配置：在 babel 配置文件 `.babelrc` 中增加 `react-activation/babel` 插件
  ```js title="babel.config.js"
  {
    "plugins": [
      "react-activation/babel"
    ]
  }
  ```
- 如果不使用 babel 配置，建议给每个 `<KeepAlive>` 声明全局唯一且不变的 cacheKey 属性，以确保缓存的稳定性
- 与 react-router 或 react-redux 配合使用时，建议将 `<AliveScope>` 放置在 `<Router>` 或 `<Provider>` 内部
:::

```tsx title="src/main.tsx"
import KeepAlive, { AliveScope } from 'react-activation';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename='/aa'>
    <AliveScope>
      <Routes>
        <Route path='/' element={<KeepAlive cacheKey="MANAGE" name="MANAGE"><Manage /></KeepAlive>}></Route>
        <Route path='/detail' element={<Detail />}></Route>
        <Route path='/update' element={<Edit />}></Route>
        <Route path='/create' element={<Edit />}></Route>
        <Route path='/done' element={<Done />}></Route>
      </Routes>
    </AliveScope>
  </BrowserRouter>,
)
```

### 注意事项
1. 跳回被 `<KeepAlive>` 包裹保持状态的组件时，不会执行该组件的`useEffect(() => {}, []);`，还会执行`useEffect(() => {});`。要想还执行该组件的`useEffect(() => {}, []);`，则需要跳回该组件前，手动刷新缓存：
```tsx
import { useAliveController } from 'react-activation';

export default function Demo() {
  const { refreshScope } = useAliveController();

  function handleLink() {
    refreshScope('MANAGE');
    navigate(`//?aa=${searchParams.get('aa')}`);
  }
}
```

2. 被缓存的组件会缓存路由param，如下的`aaValue`:
```tsx
import { useSearchParams } from 'react-router-dom';

const [searchParams] = useSearchParams();

const aaValue = searchParams.get('aa');
```

## JSX中使用`&&`的注意点
[Stop using && in React Conditional Rendering](https://www.crocoder.dev/blog/react-conditional-rendering/)

## 遇到的报错
### 1. A component is changing a controlled input to be uncontrolled.
```jsx
export default function AddressBook() {
  const [detailAddress, setDetailAddress] = useState<string | undefined>(undefined);

  return <>
    <input type="text" value={detailAddress} onChange={(e) => setDetailAddress(e.target.value)}></input>
  </>
}
```
如上写法会报错：Warning: A component is changing a controlled input to be uncontrolled. This is likely caused by the value changing from a defined to undefined, which should not happen. Decide between using a controlled or uncontrolled input element for the lifetime of the component. More info: https://reactjs.org/link/controlled-components

报错原因：首次渲染出的input是这样的`<input type="text" value=undefined/>`，因此react就判定这是一个非受控组件。而一旦开始输入，触发了`onChange`回调，就会给`detailAddress`赋值，这时input就成为了受控的input。

解决方案：定义时初始值赋值为空字符串 `const [detailAddress, setDetailAddress] = useState<string>('');` 或者 给input的value属性一个初始值
```jsx
export default function AddressBook() {
  const [detailAddress, setDetailAddress] = useState<string | undefined>(undefined);

  return <>
    <input type="text" value={detailAddress ?? ''} onChange={(e) => setDetailAddress(e.target.value)}></input>
  </>
}
```

## 父组件调用子组件的方法
在 React 中，父组件调用子组件的方法有几种常见的方式，包括使用 `ref` 和通过 props 传递回调函数。下面我将详细介绍这两种方法。

### 方法一：使用 `ref`

使用 `ref` 是一种直接访问子组件实例的方法，从而可以调用子组件的方法。需要注意的是，只有在类组件或使用了 `forwardRef` 的函数组件中才能使用 `ref`。

示例代码：

1. **子组件**：定义一个包含需要被调用的方法的子组件。

```jsx
import React, { useImperativeHandle, forwardRef, useState } from 'react';

// 使用 forwardRef 和 useImperativeHandle
const ChildComponent = forwardRef((props, ref) => {
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => ({
    incrementCount() {
      setCount(prevCount => prevCount + 1);
    }
  }));

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  );
});

export default ChildComponent;
```

2. **父组件**：使用 `ref` 来访问子组件的方法。

```jsx
import React, { useRef } from 'react';
import ChildComponent from './ChildComponent';

const ParentComponent = () => {
  const childRef = useRef();

  const handleButtonClick = () => {
    if (childRef.current) {
      childRef.current.incrementCount();
    }
  };

  return (
    <div>
      <ChildComponent ref={childRef} />
      <button onClick={handleButtonClick}>Increment Count in Child</button>
    </div>
  );
};

export default ParentComponent;
```

### 方法二：通过 props 传递回调函数

另一种方法是通过 props 将回调函数传递给子组件，然后子组件在适当的时候调用这些回调函数。

示例代码：

1. **子组件**：接受回调函数作为 props，并在需要时调用它。

```jsx
import React from 'react';

const ChildComponent = ({ onIncrement }) => {
  return (
    <div>
      <button onClick={onIncrement}>Increment Count</button>
    </div>
  );
};

export default ChildComponent;
```

2. **父组件**：定义回调函数并将其传递给子组件。

```jsx
import React, { useState } from 'react';
import ChildComponent from './ChildComponent';

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  const incrementCount = () => {
    setCount(prevCount => prevCount + 1);
  };

  return (
    <div>
      <p>Count: {count}</p>
      <ChildComponent onIncrement={incrementCount} />
    </div>
  );
};

export default ParentComponent;
```

解释：

1. **使用 `ref`**：
   - `forwardRef`：在子组件中使用 `forwardRef` 将 `ref` 转发到内部组件。
   - `useImperativeHandle`：在子组件中使用 `useImperativeHandle` 来定义哪些属性和方法可以通过 `ref` 访问。
   - `useRef`：在父组件中使用 `useRef` 创建一个引用，并将其传递给子组件。

2. **通过 props 传递回调函数**：
   - 在父组件中定义回调函数。
   - 将回调函数作为 props 传递给子组件。
   - 在子组件中调用传递的回调函数。

这两种方法各有优劣，具体选择哪种方法取决于你的具体需求和组件设计。一般来说，使用 props 传递回调函数更加符合 React 的数据流向，而使用 `ref` 则适用于需要直接访问组件实例的方法场景。

### 在 TypeScript 中使用 `forwardRef` 和 `useImperativeHandle`
在 TypeScript 中使用 `forwardRef` 和 `useImperativeHandle` 需要一些额外的类型定义，以确保类型安全。下面是一个详细的示例，展示如何在 TypeScript 中使用 `forwardRef` 和 `useImperativeHandle`。

示例代码:

1. **定义子组件**：使用 `forwardRef` 和 `useImperativeHandle` 来定义子组件，并暴露方法给父组件调用。

```tsx
import React, { useImperativeHandle, forwardRef, useState } from 'react';

// 定义子组件暴露的方法类型
interface ChildComponentHandles {
  incrementCount: () => void;
}

// 定义子组件的 props 类型
interface ChildComponentProps {}

// 使用 forwardRef 和 useImperativeHandle
const ChildComponent = forwardRef<ChildComponentHandles, ChildComponentProps>((props, ref) => {
  const [count, setCount] = useState(0);

  useImperativeHandle(ref, () => ({
    incrementCount() {
      setCount(prevCount => prevCount + 1);
    }
  }));

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  );
});

export default ChildComponent;
```

2. **使用子组件**：在父组件中使用 `useRef` 来访问子组件的方法。

```tsx
import React, { useRef } from 'react';
import ChildComponent from './ChildComponent';

// 定义子组件暴露的方法类型
interface ChildComponentHandles {
  incrementCount: () => void;
}

const ParentComponent: React.FC = () => {
  const childRef = useRef<ChildComponentHandles>(null);

  const handleButtonClick = () => {
    if (childRef.current) {
      childRef.current.incrementCount();
    }
  };

  return (
    <div>
      <ChildComponent ref={childRef} />
      <button onClick={handleButtonClick}>Increment Count in Child</button>
    </div>
  );
};

export default ParentComponent;
```

解释:

1. **定义子组件暴露的方法类型**：
   - 我们定义了 `ChildComponentHandles` 接口，包含子组件暴露的方法 `incrementCount`。

2. **定义子组件的 props 类型**：
   - 我们定义了 `ChildComponentProps` 接口，虽然在这个示例中没有 props，但这是一个良好的实践。

3. **使用 `forwardRef` 和 `useImperativeHandle`**：
   - 在子组件中使用 `forwardRef` 将 `ref` 转发到内部组件。
   - 在子组件中使用 `useImperativeHandle` 来定义哪些属性和方法可以通过 `ref` 访问。
   - `forwardRef` 的泛型参数是子组件暴露的方法类型和子组件的 props 类型。

4. **在父组件中使用 `useRef`**：
   - 在父组件中使用 `useRef` 创建一个引用，并将其传递给子组件。
   - `useRef` 的泛型参数是子组件暴露的方法类型。

通过这种方式，你可以在 TypeScript 中安全地使用 `forwardRef` 和 `useImperativeHandle`，确保类型安全并获得更好的开发体验。

## `React.Key` 是 `string | number` 的类型别名
ts报错：`Type '(value: string, record: IEngineer) => boolean' is not assignable to type '(value: boolean | Key, record: IEngineer) => boolean'.`

这个错误信息表明你正在尝试将一个函数 `(value: string, record: IEngineer) => boolean` 赋值给一个期望的类型 `(value: boolean | React.Key, record: IEngineer) => boolean`。这两个函数签名的第一个参数类型不匹配，导致类型不兼容。

### 错误分析

期望的函数类型是 `(value: boolean | React.Key, record: IEngineer) => boolean`，其中 `value` 可以是 `boolean` 或 `React.Key`（即 `string` 或 `number`），而你提供的函数类型是 `(value: string, record: IEngineer) => boolean`，其中 `value` 必须是 `string`。

### 解决方法

要解决这个问题，你需要确保你的函数接受的参数类型与期望的类型匹配。具体来说，你需要将函数的第一个参数类型从 `string` 改为 `boolean | React.Key`。

以下是一个示例，展示了如何修改你的函数以匹配期望的类型：

```typescript
import React from 'react';

interface IEngineer {
  id: number;
  name: string;
  // 其他属性
}

// 期望的函数类型
type ExpectedFunctionType = (value: boolean | React.Key, record: IEngineer) => boolean;

// 示例函数，修改第一个参数类型以匹配期望的类型
const myFunction: ExpectedFunctionType = (value, record) => {
  if (typeof value === 'boolean') {
    // 处理 boolean 类型的 value
    return value;
  } else if (typeof value === 'string' || typeof value === 'number') {
    // 处理 React.Key 类型的 value（string 或 number）
    return record.name === value.toString();
  }
  return false;
};

// 示例使用
const engineer: IEngineer = { id: 1, name: 'Alice' };
console.log(myFunction(true, engineer)); // 处理 boolean 类型
console.log(myFunction('Alice', engineer)); // 处理 string 类型
console.log(myFunction(1, engineer)); // 处理 number 类型
```

在这个示例中，`myFunction` 的第一个参数 `value` 类型已经修改为 `boolean | React.Key`。根据实际传入的类型（`boolean`、`string` 或 `number`），函数内部进行了相应的处理。

### 进一步说明

- `React.Key` 是 `string | number` 的类型别名，因此你可以处理这两种类型。
- 确保你的函数能够正确处理所有可能的 `value` 类型，以避免运行时错误。

通过这种方式，你可以确保你的函数类型与期望的类型匹配，从而解决类型不兼容的问题。

## 动态设置className
在 React 中，动态设置 `className` 是一个常见的需求，通常用于根据组件的状态或属性来改变其样式。你可以使用条件运算符或模板字符串来动态设置 `className`。以下是几种常见的方法：

### 使用条件运算符

你可以使用条件运算符来根据条件设置 `className`：

```jsx
import React, { useState } from 'react';

const MyComponent = () => {
  const [isActive, setIsActive] = useState(false);

  return (
    <div className={isActive ? 'active' : 'inactive'}>
      <button onClick={() => setIsActive(!isActive)}>
        Toggle Active State
      </button>
    </div>
  );
};

export default MyComponent;
```

在这个示例中，根据 `isActive` 状态的值，`div` 的 `className` 会被设置为 `active` 或 `inactive`。

### 使用模板字符串

你可以使用模板字符串来组合多个类名：

```jsx
import React, { useState } from 'react';

const MyComponent = () => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  return (
    <div className={`my-component ${isActive ? 'active' : ''} ${isDisabled ? 'disabled' : ''}`}>
      <button onClick={() => setIsActive(!isActive)}>
        Toggle Active State
      </button>
      <button onClick={() => setIsDisabled(!isDisabled)}>
        Toggle Disabled State
      </button>
    </div>
  );
};

export default MyComponent;
```

在这个示例中，`div` 的 `className` 会根据 `isActive` 和 `isDisabled` 的状态动态地包含 `active` 和 `disabled` 类名。

### 使用 `classnames` 库

`classnames` 是一个非常流行的库，用于动态地构建类名字符串。它使得处理复杂的类名逻辑更加简洁和易读。

首先，安装 `classnames` 库：

```bash
npm install classnames
```

然后，你可以这样使用它：

```jsx
import React, { useState } from 'react';
import classNames from 'classnames';

const MyComponent = () => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const divClassName = classNames('my-component', {
    'active': isActive,
    'disabled': isDisabled,
  });

  return (
    <div className={divClassName}>
      <button onClick={() => setIsActive(!isActive)}>
        Toggle Active State
      </button>
      <button onClick={() => setIsDisabled(!isDisabled)}>
        Toggle Disabled State
      </button>
    </div>
  );
};

export default MyComponent;
```

在这个示例中，`classNames` 函数根据状态动态地构建 `className` 字符串。

### 使用对象展开运算符

在某些情况下，你也可以使用对象展开运算符来动态设置类名：

```jsx
import React, { useState } from 'react';

const MyComponent = () => {
  const [isActive, setIsActive] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const classNames = {
    'my-component': true,
    'active': isActive,
    'disabled': isDisabled,
  };

  return (
    <div className={Object.keys(classNames).filter(className => classNames[className]).join(' ')}>
      <button onClick={() => setIsActive(!isActive)}>
        Toggle Active State
      </button>
      <button onClick={() => setIsDisabled(!isDisabled)}>
        Toggle Disabled State
      </button>
    </div>
  );
};

export default MyComponent;
```

在这个示例中，使用对象展开运算符和 `filter` 方法来动态地构建 `className` 字符串。

这些方法都可以帮助你在 React 中根据组件的状态或属性动态地设置 `className`，从而实现灵活的样式控制。