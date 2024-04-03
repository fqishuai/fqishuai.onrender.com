---
tags: [Building tool]
---

:::info
vite主要由两部分组成：
- 一个开发服务器，它基于 原生 ES 模块 提供了 丰富的内建功能，如速度快到惊人的 模块热更新（HMR）。

- 一套构建指令，它使用 Rollup 打包你的代码，并且它是预配置的，可输出用于生产环境的高度优化过的静态资源。
:::

## 使用pnpm+vite搭建react+typescript工程
### 1.使用`pnpm create vite`
选择React、TypeScript，SWC熟练的话可以选择TypeScript+SWC

### 2.ts配置文件
生成的`tsconfig.json` 和 `tsconfig.node.json`配置文件如下：
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

1. 其中`"moduleResolution": "bundler"`会导致使用`<div>`等标签时ts报错：`JSX element implicitly has type 'any' because no interface 'JSX.IntrinsicElements' exists.`，改为`"moduleResolution": "node"`。(注意：`tsconfig.node.json`中的`"moduleResolution": "bundler"`也需要改为`"moduleResolution": "node"`)

2. 由于`allowImportingTsExtensions`配置项需要`"moduleResolution": "bundler"`并且需要配置`noEmit`或`emitDeclarationOnly`：`Requires '--moduleResolution bundler' and either '--noEmit' or '--emitDeclarationOnly' to be set.`，所以去掉`"allowImportingTsExtensions": true,`

3. `import React from 'react';import ReactDOM from 'react-dom/client';`这种import引入会ts报错：`This module is declared with 'export =', and can only be used with a default import when using the 'allowSyntheticDefaultImports' flag.`，在`tsconfig.json`中设置`"allowSyntheticDefaultImports": true`来解决

4. `import App from './App.tsx'`ts报错：`An import path cannot end with a '.tsx' extension. Consider importing './App.js' instead.`，改为`import App from './App'`来解决

### 3.安装依赖并启动
使用 `pnpm install` 安装依赖，使用 `pnpm dev` 尝试启动：
1. 启动有报错：`UnhandledPromiseRejectionWarning: SyntaxError: Unexpected token '??='`
  ![error](img/vite-error.jpg)
  这个报错是node版本比较低，`node -v`查看是14.14.0

2. 使用`nvm`切换node版本为16.16.0后执行 `pnpm dev` 启动还报错：`Error: Cannot find module @rollup/rollup-darwin-arm64.`
3. 使用`rimraf node_modules`删除node_modules后，重新执行 `pnpm install` 安装依赖，再次执行 `pnpm dev` 启动成功

### 4.设置打包后的目录
```ts title="vite.config.ts"
  build: {
    outDir: 'afterSales',
  },
```

### 5.使用scss
vite本身支持scss `pnpm add -D sass`后就可以使用scss

### 6.使用react router
引入react-router-dom：`pnpm add react-router-dom`

### 7.设置react页面的title
可以用`useEffect`：
```jsx
useEffect(() => {
  document.title = '页面title'
})
```

### 8.vite配置项目别名
> [vite中alias别名配置](https://juejin.cn/post/7017701897662365709)

- 使用到`path`、`__dirname`、`__filename`等，需要`pnpm add -D @types/node`

- vite配置文件 和 ts配置文件都需要设置
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
"baseUrl": "./",
"paths":{
  "@/*": ["src/*"],
  "@pages/*": ["src/pages/*"],
 },
```

### 9.vite的`base` 和 react router的`basename`
如果项目在生产环境想共用已有域名，则可以配置nginx，并相应设置vite打包的`base`及react router的`basename`。比如，已有域名`aaa.com`，项目在生产环境想使用`aaa.com/b`:
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

### 10.vite配置环境变量
> [环境变量和模式](https://cn.vitejs.dev/guide/env-and-mode.html#env-variables)

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

### 11.vite开发配置开启https
- 如下配置，浏览器访问时提示“使用了不受支持的协议”，这是因为https协议需要一个合法可用的证书。
  ```ts title="vite.config.ts"
  server: {
    host: 'test.jd.com',
    port: 443,
    strictPort: true,
    https: true,
  },
  ```

- 本地开发时，可以添加 `@vitejs/plugin-basic-ssl` 到项目插件中，它会自动创建和缓存一个自签名的证书。
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

## 配置项
- `root` 项目根目录（`index.html` 文件所在的位置）。可以是一个绝对路径，或者一个相对于该配置文件本身的相对路径。默认为`process.cwd()`

- `mode` 默认为'development' 用于开发，'production' 用于构建

- `logLevel` 调整控制台输出的级别，默认为 'info'。值可以是'info' | 'warn' | 'error' | 'silent'

- `define` 定义全局常量替换方式。

### [构建配置项](https://cn.vitejs.dev/config/build-options.html)
- `build.cssTarget ` 此选项允许用户为 CSS 的压缩设置一个不同的浏览器 target，此处的 target 并非是用于 JavaScript 转写目标。默认值与 `build.target` 一致

- `build.cssCodeSplit` 默认为`true`，即启用 CSS 代码拆分，在异步 chunk 中导入的 CSS 将内联到异步 chunk 本身，并在其被加载时一并获取。

- `build.lib` 构建为库。`entry` 是必需的，因为库不能使用 HTML 作为入口。`name` 则是暴露的全局变量，并且在 `formats` 包含 'umd' 或 'iife' 时是必需的。默认 `formats` 是 `['es', 'umd']`，如果使用了多个配置入口，则是 `['es', 'cjs']`。`fileName` 是输出的包文件名，默认 `fileName` 是 `package.json` 的 `name` 选项
  :::warning
  如果指定了 `build.lib`，`build.cssCodeSplit` 会默认为 `false`，即禁用 CSS 代码拆分，则整个项目中的所有 CSS 将被提取到一个 CSS 文件中。
  :::

- `build.rollupOptions` 自定义底层的 Rollup 打包配置。这与从 Rollup 配置文件导出的选项相同，并将与 Vite 的内部 Rollup 选项合并。（在 build 阶段，Vite 是利用 Rollup 去完成构建，整个过程只需要调用 Rollup 提供的 JS API 即可，整个过程中，Vite 的工作只是在做配置的转换，把 Vite 的配置转换成 Rollup 的 input 和 output 配置。）
  - `build.rollupOptions.external` 不想打包进你开发的库的依赖

- `build.minify` 设置为 `false` 可以禁用最小化混淆，或是用来指定使用哪种混淆器。默认为 `Esbuild`，它比 `terser` 快 20-40 倍，压缩率只差 1%-2%。注意，在 `lib` 模式下使用 'es' 时，`build.minify` 选项不会缩减空格，因为会移除掉 `pure` 标注，导致破坏 tree-shaking。

- `build.emptyOutDir` 若 `outDir` 在 root 目录(默认为`process.cwd()`)下，则 该值默认为`true`，Vite 会在构建时清空该目录，设为`false`则不清空。若 `outDir` 在根目录之外则会抛出一个警告避免意外删除掉重要的文件。可以设置该选项来关闭这个警告。

## [JavaScript API](https://cn.vitejs.dev/guide/api-javascript.html#build)
### `build`
```js
import path from 'path'
import { fileURLToPath } from 'url'
import { build } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

;(async () => {
  await build({
    root: path.resolve(__dirname, './project'),
    base: '/foo/',
    build: {
      rollupOptions: {
        // ...
      },
    },
  })
})()
```

## 使用记录
### h5页面在低版本安卓浏览器白屏
vite4+react18+ts5开发h5页面在低版本安卓（<=安卓10及鸿蒙系统）浏览器中打开出现白屏。用云真机webview调试发现没有任何报错。

查看[vite对浏览器的支持](https://cn.vitejs.dev/guide/#browser-support)和[浏览器兼容性](https://cn.vitejs.dev/guide/build.html#browser-compatibility)：
```markdown
用于生产环境的构建包会假设目标浏览器支持现代 JavaScript 语法。默认情况下，Vite 的目标是能够 `支持原生 ESM script 标签`、`支持原生 ESM 动态导入` 和 `import.meta` 的浏览器：
- Chrome >=87
- Firefox >=78
- Safari >=14
- Edge >=88

你也可以通过 `build.target` 配置项 指定构建目标，最低支持 `es2015`。

请注意，默认情况下 Vite 只处理语法转译，且 不包含任何 polyfill。你可以前往 [Polyfill.io](https://polyfill.io/) 查看，这是一个基于用户浏览器 User-Agent 字符串自动生成 polyfill 包的服务。

传统浏览器可以通过插件 `@vitejs/plugin-legacy` 来支持，它将自动生成传统版本的 chunk 及与其相对应 ES 语言特性方面的 polyfill。兼容版的 chunk 只会在不支持原生 ESM 的浏览器中进行按需加载。
```

所以，使用`@vitejs/plugin-legacy`来尝试解决：
- 安装`@vitejs/plugin-legacy`，必须同时安装terser，因为该插件使用terser进行压缩
  ```bash
  pnpm add @vitejs/plugin-legacy -D
  pnpm add terser -D
  ```

- 配置
  ```ts title="vite.config.ts"
  import legacy from '@vitejs/plugin-legacy';

  export default defineConfig({
    plugins: [
      legacy({
        targets: [
          '> 0%',
          'Chrome > 4',
          'Android >= 4',
          'IOS >= 7',
          'not ie <= 6',
          'Firefox ESR',
        ],
      }),
    ]
  })
  ```

打包部署后在低版本安卓（<=安卓10及鸿蒙系统）浏览器中打开页面正常了，但是在某些app的webview中打开会报错，提示`replaceAll is not a function`，使用`replace`替换`replaceAll`进行解决：
```js
const str = ' A   B   C    D ';
console.log(str.replaceAll(' ', '+')); // +A+++B+++C++++D+
console.log(str.replace(/ /g, '+'));   // +A+++B+++C++++D+
```

:::info
[解决低版本系统白屏问题](https://juejin.cn/post/7224304954596737079)

[从 JavaScript 中的字符串中删除/替换所有空格](https://www.jiyik.com/tm/xwzj/web_2604.html)
:::