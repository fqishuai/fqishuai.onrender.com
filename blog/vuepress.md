---
tags: [以内容为中心的静态网站]
---

## 一、使用过程中遇到的问题
> 参考：[在项目中使用 vuepress 搭建组件文档踩坑](https://juejin.cn/post/6944604256338968583)


### 1. 使用scss
1. npm install -D node-sass sass-loader
2. 启动报错，高版本的node-sass，sass-loader与 vuepress 版本并不兼容，可行的版本是：node-sass@4.14.1，sass-loader@7.3.1。

### 2. 引入组件库
> 以element-ui为例

1. npm install element-ui
2. 使用[enhanceApp.js](https://v1.vuepress.vuejs.org/zh/theme/writing-a-theme.html#%E5%BA%94%E7%94%A8%E9%85%8D%E7%BD%AE)
```js
// 示例
export default ({
  Vue, // VuePress 正在使用的 Vue 构造函数
  options, // 附加到根实例的一些选项
  router, // 当前应用的路由实例
  siteData // 站点元数据
}) => {
  // ...做一些其他的应用级别的优化
}

// 使用
// docs/.vuepress/enhanceApp.js
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

export default ({ Vue, options, router }) => {
  Vue.use(Element);
};
```

3. 上面引入组件库后打包报错：window is not defined
:::info
vuepress是如何工作的:
   - 一个 VuePress 网站是一个由 Vue、Vue Router和 webpack 驱动的单页应用。
   - 在构建时，vuepress会为应用创建一个服务端渲染（SSR）的版本，然后通过虚拟访问每一条路径来渲染对应的HTML。
:::
```js
import 'element-ui/lib/theme-chalk/index.css';

export default async ({ Vue, options, router, isServer }) => {
  if (!isServer) { // 客户端
    let Element = await import('element-ui');
    Vue.use(Element.default);
  }
}

// 使用async-await，避免异步加载第三方依赖包，导致页面渲染会出错
```

4. 引入组件库后启动报错：Cannot find module 'core-js/library/fn/xxx/xxx'
> 原因应该是 UI 组件中依赖的core-js包和 vuepress 所依赖的core-js包版本不兼容造成的。

```js
// 配置chainWebpack解决该问题
// docs/.vuepress/config.js

chainWebpack: config => {
  config.resolve.alias.set('core-js/library/fn', 'core-js/features')
},
```

## 二、主题theme
:::info
- vuepress的入口文件为主题的Layout.vue
- 想自定义主题则新建docs/.vuepress/theme/layouts/Layout.vue
:::

### 1. 继承主题
假设你想创建一个继承自 VuePress 默认主题的派生主题，你只需要在你的主题配置中配置 extend 选项：
```js
// .vuepress/theme/index.js
module.exports = {
  extend: '@vuepress/theme-default'
}
```

### 2. 组件覆盖
- 父主题的所有能力都会"传递"给子主题，对于文件级别的约定，子主题可以通过在同样的位置创建同名文件来覆盖它
- 子主题可以通过`@theme 别名`访问父主题的组件，比如：当子主题中有Navbar.vue时，如下：
```plain
theme
└── components
    └── Navbar.vue
```

:::info
`@theme/components/Navbar.vue` 会自动地映射到子主题中的 Navbar 组件，当子主题移除这个组件时，`@theme/components/Navbar.vue` 又会自动恢复为父主题中的 Navbar 组件。
:::