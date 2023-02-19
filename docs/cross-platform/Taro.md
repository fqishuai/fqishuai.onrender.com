---
slug: taro
tags: [小程序开发,h5开发,跨端]
---

- [1. 安装cli及创建项目](#1-安装cli及创建项目)
  - [1.1 编译支付宝小程序](#11-编译支付宝小程序)
- [2. 全局配置](#2-全局配置)
  - [2.1. pages](#21-pages)
  - [2.2. window](#22-window)
  - [2.3. tabBar](#23-tabbar)
  - [2.4. subPackages](#24-subpackages)
- [3. 项目配置](#3-项目配置)
- [4. 编译配置](#4-编译配置)
  - [4.1 alias](#41-alias)
- [5. 页面配置](#5-页面配置)
  - [5.1 动态设置页面标题](#51-动态设置页面标题)
  - [5.2 动态设置页面导航条颜色](#52-动态设置页面导航条颜色)
- [6. 生命周期](#6-生命周期)
- [7. Ref](#7-ref)
- [8. Hooks](#8-hooks)
- [9. Minified React error](#9-minified-react-error)
- [10. 入口组件](#10-入口组件)
- [11. 路由](#11-路由)
- [12. 网路](#12-网路)
  - [12.1 发起请求](#121-发起请求)
- [13. 文件\&下载](#13-文件下载)
  - [13.1 下载文件资源到本地 `Taro.downloadFile`](#131-下载文件资源到本地-tarodownloadfile)
  - [13.2 新开页面打开文档 `Taro.openDocument(option)`](#132-新开页面打开文档-taroopendocumentoption)
- [14. 样式问题](#14-样式问题)
- [15. 交互](#15-交互)
  - [15.1 loading](#151-loading)
  - [15.2 toast](#152-toast)
  - [15.3 modal](#153-modal)
  - [15.4 actionSheet](#154-actionsheet)


:::info
- 相较于 Taro 1/2 编译时架构，Taro 3 采用了重运行时的架构，让开发者可以获得完整的 React / Vue 等框架的开发体验。具体原理请参考 [《小程序跨框架开发的探索与实践》](https://mp.weixin.qq.com/s?__biz=MzU3NDkzMTI3MA==&mid=2247483770&idx=1&sn=ba2cdea5256e1c4e7bb513aa4c837834)。

- Taro 3 支持将 Web 框架直接运行在各平台，开发者使用的是真实的 React 和 Vue 等框架。

- 从 Taro v3.5 开始，Taro 将默认使用 React 18 版本。
  - 开发支付宝小程序时，Webpack4 暂不支持使用 React18（[#12134](https://github.com/NervJS/taro/issues/12134#issuecomment-1197904281)）。
  - 受小程序环境限制，诸如新 SSR Suspense 等特性将不能在小程序中使用。
  - RN 暂不支持 React v18。
  - 如果升级了 Taro v3.5，但不想使用 React v18，可以将项目 `package.json` 中 `react / react-dom` 版本降级为 ^17 并重新安装依赖。

- 因为 Taro 遵循小程序的路由规范，所以引入了 入口组件 和 页面组件 的概念，分别对应小程序规范的入口组件 app 和页面组件 page。

- 一个 Taro 应用由一个入口组件和至少一个页面组件所组成。每一个 Taro 应用都需要一个入口组件（React 组件）用来注册应用。入口文件默认是 src 目录下的 `app.js`。在入口组件中我们可以设置全局状态或访问小程序入口实例的生命周期。

- Taro 中可以使用小程序规范的内置组件进行开发，如 `<View>`、`<Text>`、`<Button>`等。

- 小程序的 `bindtap` 对应 Taro 的 `onClick`，其余小程序事件名把 `bind` 换成 `on` 即是 Taro 事件名（支付宝小程序除外，它的事件就是以 `on` 开头）

- dataset 是小程序中特别的模版属性，主要作用是可以在事件回调的 event 对象中获取到 dataset 相关数据。在事件回调对象中可以通过 `event.target.dataset` 或 `event.currentTarget.dataset` 获取到。

- 由于小程序不支持动态引入，因此小程序中无法使用 `React.lazy` API。

- 不能在页面组件的 DOM 树之外插入元素，因此不支持 `<Portal>`。
:::

## 1. 安装cli及创建项目
:::tip
如果安装过程出现sass相关的安装错误，请在安装 [mirror-config-china](https://www.npmjs.com/package/mirror-config-china) 后重试。
```bash
npm install -g mirror-config-china
```
:::

- 使用npm或yarn
```bash
# 使用 npm 安装 CLI
npm install -g @tarojs/cli

# 使用 yarn 安装 CLI
yarn global add @tarojs/cli

# 使用cli命令创建模板项目
taro init myApp
```

- 使用npx
```bash
# npm 5.2+ 也可在不全局安装的情况下使用 npx 创建模板项目
npx @tarojs/cli init myApp
```

### 1.1 编译支付宝小程序
```bash
# pnpm
pnpm build:alipay
pnpm dev:alipay

# npm
npm run dev:alipay
npm run build:alipay

# npx 用户也可以使用
npx taro build --type alipay --watch
npx taro build --type alipay

# yarn
yarn dev:alipay
yarn build:alipay

# watch 同时开启压缩
set NODE_ENV=production && taro build --type alipay --watch # CMD
NODE_ENV=production taro build --type alipay --watch # Bash
```

选择项目根目录下 dist 目录（根目录 config 中的 outputRoot 设置的目录）进行预览。

需要注意开发者工具的项目设置：
- 需要关闭 ES6 转 ES5 功能，开启可能报错
- 需要关闭上传代码时样式自动补全，开启可能报错
- 需要关闭代码压缩上传，开启可能报错

:::tip
1. 预览模式生成的文件较大，设置 NODE_ENV 为 production 可以开启压缩。
Example:`NODE_ENV=production taro build --type alipay --watch`
```json title="package.json"
"scripts": {
  "dev:alipay": "NODE_ENV=production taro build --type alipay --watch"
}
```

2. 建议开启持久化缓存功能，能有效提升二次编译速度，详情请参考: https://docs.taro.zone/docs/config-detail#cache。
:::

## 2. 全局配置
根目录下的 `app.config.js` 文件用来对小程序进行全局配置，配置项遵循微信小程序规范，并且对所有平台进行统一。

- Taro v3.4 之前，`app.config.js` 里引用的 JS 文件没有经过 Babel 编译。(Taro v3.4 开始支持）
- 多端差异化逻辑可以使用 `process.env.TARO_ENV` 变量作条件判断来实现。
- `app.config.js` 不支持多端文件的形式，如 `app.weapp.js` 这样是不起作用的。

```jsx
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/about/index',
  ],
  tabBar: {
    list: [
      {
        pagePath: '',
        text: '',
      },
      {
        pagePath: '',
        text: '',
      }
    ],
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
})
```

### 2.1. pages
### 2.2. window
### 2.3. tabBar
### 2.4. subPackages

## 3. 项目配置
- 各类小程序平台均有自己的项目配置文件，为了能够适配不同小程序平台的配置文件不同的情况，Taro 支持为各个小程序平台添加各自的项目配置文件。
- 通过 Taro 模板创建的项目都会默认拥有 `project.config.json` 这一项目配置文件，这个文件 只能用于微信小程序，若要兼容到其他小程序平台，请按如下对应规则来增加相应平台的配置文件，其配置与各自小程序平台要求的一致：
  - 微信小程序  project.config.json
  - 支付宝小程序  project.alipay.json
  - 字节跳动小程序	project.tt.json
  - 百度小程序	project.swan.json

## 4. 编译配置
> 项目的`config`目录下存放的是不同环境的编译配置文件

### 4.1 alias
> 用于配置目录别名，从而方便书写代码引用路径。比如：

```js
module.exports = {
  // ...
  alias: {
    '@/components': path.resolve(__dirname, '..', 'src/components'),
    '@/utils': path.resolve(__dirname, '..', 'src/utils'),
    '@/package': path.resolve(__dirname, '..', 'package.json'),
    '@/project': path.resolve(__dirname, '..', 'project.config.json'),
  },
}
```

为了让编辑器（VS Code）不报错，并继续使用自动路径补全的功能，需要在项目根目录下的 `jsconfig.json` 或者 `tsconfig.json` 中配置 `paths` 让编辑器认得我们的别名，形式如下：
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["./src/components/*"],
      "@/utils/*": ["./src/utils/*"],
      "@/package": ["./package.json"],
      "@/project": ["./project.config.json"]
    }
  }
}
```



## 5. 页面配置
每一个小程序页面都可以使用 `xx.config.js` 文件来对本页面的窗口表现进行配置。页面中配置项在当前页面会覆盖全局配置 `app.config.js` 的 window 中相同的配置项。比如index页面:
```js title="src/pages/index/index.config.ts"
export default definePageConfig({
  navigationBarTitleText: '首页'
})
```

也可以不配置`xx.config.js`，直接在页面文件(指的是在app.config.js的pages中声明的路径)中定义，比如index页面:
```jsx title="src/pages/index/index.tsx"
definePageConfig({
  navigationBarTitleText: '首页',
});

export default function Index() {
  return <>首页</>
}
```

### 5.1 动态设置页面标题
使用[`Taro.setNavigationBarTitle(option)`](https://taro-docs.jd.com/docs/apis/ui/navigation-bar/setNavigationBarTitle)可以动态设置页面标题。
```jsx
export default function Detail() {
  useEffect(() => {
    Taro.setNavigationBarTitle({
      title: '详情',
    });
  });
  
  return <>详情</>
}
```
### 5.2 动态设置页面导航条颜色
`Taro.setNavigationBarColor(option)`
- backgroundColor 必填 背景颜色值，有效值为十六进制颜色
- frontColor 必填 前景颜色值，包括按钮、标题、状态栏的颜色，仅支持 #ffffff 和 #000000
```jsx
export default function Detail() {
  useEffect(() => {
    Taro.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#ff0000',
      animation: {
        duration: 400,
        timingFunc: 'easeIn'
      }
    });
  });
  
  return <>详情</>
}
```

## 6. 生命周期
- Taro 3 在小程序逻辑层上实现了一份遵循 Web 标准 BOM 和 DOM API。因此 React 使用的 `document.appendChild`、`document.removeChild` 等 API 其实是 Taro 模拟实现的，最终的效果是把 React 的虚拟 DOM 树渲染为 Taro 模拟的 Web 标准 DOM 树。
- React 组件的生命周期方法在 Taro 中都支持使用。
- 生命周期触发时机和在 Web 开发中有一些偏差。触发时机：
  - `componentWillMount ()`：`onLoad`之后，页面组件渲染到 Taro 的虚拟 DOM 之前触发。
  - `componentDidMount ()`：页面组件渲染到 Taro 的虚拟 DOM 之后触发。此时能访问到 Taro 的虚拟 DOM（使用 `React ref`、`document.getElementById` 等手段），并支持对其进行操作（设置 DOM 的 style 等）。但此时不代表 Taro 的虚拟 DOM 数据已经完成从逻辑层 `setData` 到视图层。因此这时无法通过 `createSelectorQuery` 等方法获取小程序渲染层 DOM 节点。 只能在 `onReady` 生命周期中获取。

## 7. Ref
- 在 Taro 中 ref 的用法和 React 完全一致，但是获取到的 “DOM” 和浏览器环境还有小程序环境都有不同。
- 使用 React Ref 获取到的是 Taro 的虚拟 DOM，和浏览器的 DOM 相似，可以操作它的 style，调用它的 API 等。但是 **Taro 的虚拟 DOM 运行在小程序的逻辑层，并不是真实的小程序渲染层节点**，它没有尺寸宽高等信息。
- 获取真实的小程序渲染层节点，需要在 `onReady` 生命周期中，调用小程序中用于获取 DOM 的 API。
```jsx
import React from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'

export default class Test extends React.Component {
  onReady () {
    // onReady 触发后才能获取小程序渲染层的节点
    Taro.createSelectorQuery().select('#only')
      .boundingClientRect()
      .exec(res => console.log(res))
  }

  render () {
    return (
      <View id='only' />
    )
  }
}
```

## 8. Hooks

## 9. Minified React error
- 因为 development 版本的 React 体积较大，为了减少小程序体积，方便开发时真机预览。Taro 在构建小程序时默认使用 production 版本的 React 相关依赖。
- 但是 production 版本的 React 出错时不会展示报错堆栈的信息。因此当你遇到类似这种报错时：【Error: Minified React error #152】，可以修改编译配置中的 `mini.debugReact` 选项，然后重新开启编译。这样 Taro 会使用 development 版本的 React，从而输出报错堆栈。

## 10. 入口组件
```jsx title="src/app.js"
import React, { useEffect } from 'react'

// Taro 额外添加的 hooks 要从 '@tarojs/taro' 中引入
import { useDidShow, useDidHide } from '@tarojs/taro'

// 假设我们要使用 Redux
import { Provider } from 'react-redux'
import configStore from './store'

// 全局样式
import './app.css'

const store = configStore()

function App (props) {
  // 可以使用所有的 React Hooks
  useEffect(() => {})

  // 对应 onShow
  useDidShow(() => {})

  // 对应 onHide
  useDidHide(() => {})

  return (
    // 在入口组件不会渲染任何内容，但我们可以在这里做类似于状态管理的事情
    <Provider store={store}>
      {/* props.children 是将要被渲染的页面 */}
      {props.children}
    </Provider>
  )
}

export default App
```

## 11. 路由
- 默认，Taro 遵循微信小程序的路由规范。只需要修改全局配置`src/app.config.ts`的 pages 属性，配置为 Taro 应用中每个页面的路径即可。
- Taro v3.6(canary 版本) 开始支持前端路由库，包括 [react-router](https://reactrouter.com/en/main) 和 vue-router。
- 已有项目升级到 canary 版本：
  - 将 package.json 文件中 Taro 相关依赖的版本修改为 3.6.0-canary.9
  - 重新安装依赖，如果安装失败或打开项目失败，可以删除 node_modules、yarn.lock、package-lock.json 后重新安装依赖重新尝试。
- 在路由库中，诸如`<Link>` 组件内部会动态生成 `<a>` 标签，因此需要引入 `@tarojs/plugin-html` 插件以支持在 Taro 中使用 html 标签开发组件。
- 前端路由库的基本原理是监听 `popstate` 或 `hashchange` 事件触发后，读取 location 对象对视图进行操控更新。 Taro 为了支持前端路由库的使用，在运行时中引入了 `histroy` `location` 对象的实现，且尽可能与 Web 端规范对齐，你可以在 window 对象上访问到 history 和 location 对象。
- 小程序天然支持多页面(pages数组)，Taro 并非以整个应用为一个路由系统，而是顺应小程序规范以页面维度进行路由管理。每当切换页面时，会将当前页面的页面路由状态缓存。跳转至新页面后会重新创建页面路由状态，并挂载在 window 对象上。当返回上一级页面时，会重新将当前页面的页面路由状态挂载到 window 对象中。（这里的"页面路由状态"指的是history 和 location 对象，将 history 和 location 对象统称为页面路由状态。）

## 12. 网路
### 12.1 发起请求
[Taro.request](https://taro-docs.jd.com/docs/apis/network/request/) 发起 HTTPS 网络请求
```jsx
Taro.request({
  url: 'test.php', //仅为示例，并非真实的接口地址
  data: {
    x: '',
    y: ''
  },
  header: {
    'content-type': 'application/json' // 默认值
  },
  success: function (res) {
    console.log(res.data)
  }
})

// async/await 用法：
const res = await Taro.request(params)
```

## 13. 文件&下载
### 13.1 下载文件资源到本地 `Taro.downloadFile`
客户端直接发起一个 HTTPS GET 请求，返回文件的本地临时路径，单次下载允许的最大文件为 50MB。
```js
Taro.downloadFile({
  url: 'https://example.com/audio/123', //仅为示例，并非真实的资源
  success: function (res) {
    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
    if (res.statusCode === 200) {
      Taro.playVoice({
        filePath: res.tempFilePath
      })
    }
  }
})
```

### 13.2 新开页面打开文档 `Taro.openDocument(option)`
注意： 小程序开发者工具： 不支持。 my.openDocument 只支持在真机上测试，无法在 IDE 上调试
```js
Taro.downloadFile({
  url: 'https://example.com/somefile.pdf',
  success: function (res) {
    var filePath = res.tempFilePath
    Taro.openDocument({
      filePath: filePath,
      success: function (res) {
        console.log('打开文档成功')
      }
    })
  }
})
```

## 14. 样式问题
- Taro 默认会使用 postcss 把 px 按比例解析为 rpx(小程序中) 和 rem(H5中)
> 在 Taro 中尺寸单位建议使用 px、 百分比 %，Taro 默认会对所有单位进行转换。在 Taro 中书写尺寸按照 1:1 的关系来进行书写，即从设计稿上量的长度 100px，那么尺寸书写就是 100px，当转成微信小程序的时候，尺寸将默认转换为 100rpx，当转成 H5 时将默认转换为以 rem 为单位的值。如果你希望部分 px 单位不被转换成 rpx 或者 rem ，最简单的做法就是在 px 单位中增加一个大写字母，例如 Px 或者 PX 这样，则会被转换插件忽略。

- Taro 默认以 750px 作为换算尺寸标准，如果设计稿不是以 750px 为标准，则需要在项目配置 config/index.js 中进行设置，例如设计稿尺寸是 640px，则需要修改项目配置 config/index.js 中的 designWidth 配置为 640：
```js title="/config/index.js"
const config = {
  projectName: 'myProject',
  date: '2018-4-18',
  designWidth: 640,
  ....
}
```

- 在编译时，Taro 会帮你对样式做尺寸转换操作，但是如果是在 JS 中书写了行内样式，那么编译时就无法做替换了，针对这种情况，Taro 提供了 API `Taro.pxTransform` 来做运行时的尺寸转换。
```js
Taro.pxTransform(10) // 小程序：rpx，H5：rem
```

- 在小程序中部分 CSS 选择器不会生效，如：
  - 通配符 `*`
  - 媒体查询
  - 属性选择器，当属性不是对应小程序组件的内置属性时

- 暂不支持使用 rem

## 15. 交互
### 15.1 loading
### 15.2 toast
`Taro.showToast(option)`
```jsx
Taro.showToast({
  title: '成功',
  icon: 'success',
  duration: 2000
})
```

### 15.3 modal
### 15.4 actionSheet