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

## 在React项目中使用TypeScript
:::tip
[React TypeScript 备忘单](https://react-typescript-cheatsheet.netlify.app/)
:::

### 使用useState声明state时声明类型
[How to use React useState hook with Typescript](https://reacthustle.com/blog/how-to-use-react-usestate-with-typescript)

### `React.FC`
`React.FunctionComponent` 或 `React.FC` 显示标明返回的是一个函数组件

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
