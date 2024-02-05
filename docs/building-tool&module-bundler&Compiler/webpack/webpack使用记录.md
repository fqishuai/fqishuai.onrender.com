---
slug: usage
tags: [Building tool, webpack]
---

:::info
[webpack文档](https://webpack.js.org/)；[中文文档](https://www.webpackjs.com)
- [深入浅出Webpack](https://webpack.wuhaolin.cn/)
- [webpack入门进阶知识](https://juejin.cn/post/6991966321529815053)
- [Webpack揭秘——走向高阶前端的必经之路](https://juejin.cn/post/6844903685407916039)
- [当面试官问Webpack的时候他想知道什么](https://juejin.cn/post/6943468761575849992)
- [webpack 方方面面的核心原理总结](https://mp.weixin.qq.com/s/D_498tIZgrqBDJLZP1HJkw)
- [webpack知识图谱](https://gitmind.cn/app/doc/fac1c196e29b8f9052239f16cff7d4c7)
:::

## [配置](https://www.webpackjs.com/configuration/)
### `optimization`
- `optimization.providedExports` 默认为true，即让webpack找出模块提供了哪些导出，以便为`export * from ...` 生成更高效的代码。
- `optimization.usedExports` tree shaking。usedExports 会使用 terser 判断代码有没有side effect，如果没有用到，又没有side effect 的话，就会在打包时替它标记上unused harmony，并在minify(用 Uglifyjs 或其他工具)的时候移除。

### `performance`
- `performance.hints` 设置为false时，不展示警告或错误提示。默认设置为 "warning"，将展示一条警告，通知你这是体积大的资源。设置为"error"时，将展示一条错误，通知你这是体积大的资源。在生产环境构建时，我们推荐使用"error"，有助于防止把体积巨大的 bundle 部署到生产环境，从而影响网页的性能。

### `resolve`
- `resolve.extensions` 尝试按顺序解析指定的后缀名，能够使用户在引入模块时不带后缀。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。

### `plugins`
用于设置使用各种webpack插件，常用的插件有：
- [`webpack-bundle-analyzer`](https://github.com/webpack-contrib/webpack-bundle-analyzer) 使用交互式可缩放树状图可视化 webpack 输出文件的大小。

- [`@statoscope/webpack-plugin`](https://github.com/statoscope/statoscope) 是一个用于分析（带有基于 UI 的报告）和验证捆绑包(bundle)统计信息的工具包。

### `module`
- `module.rules` 指定规则数组。这些规则能够修改模块的创建方式。 这些规则能够对模块(module)应用 loader，或者修改解析器(parser)。比如：
  ```js
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            'presets': [
              [
                '@babel/preset-env',
                {
                  'loose': true,
                  'modules': false,
                  'targets': {
                    'chrome': '49',
                    'ios': '9',
                  },
                },
              ],
              '@babel/preset-typescript',
              '@babel/preset-react',
            ],
          },
        },
      },
      {
        test: /\.(png|svg|jpg|gif|jpeg)$/,
        type: 'asset/inline',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  ```

### `externals`
externals 配置选项提供了「从输出的 bundle 中排除依赖」的方法。防止将某些 import 的包(package)打包到 bundle 中，而是在运行时(runtime)再去从外部获取这些扩展依赖(external dependencies)。
:::warning
带有 `{ root, amd, commonjs, ... }` 的对象只允许用于 `libraryTarget: 'umd'` 和 `[externalsType: 'umd'](#externalstype）`。其他库的 target 不允许这样做。
```js
// 这里 lodash 这个外部 library 可以在 AMD 和 CommonJS 模块系统中通过 lodash 访问，但在全局变量形式下用 _ 访问。
externals: {
  lodash: {
    commonjs: 'lodash',
    amd: 'lodash',
    root: '_', // 指向全局变量
  },
},
```
:::

## webpack5
[webpack5系列](https://mp.weixin.qq.com/s/pwynolH0pTtT38f-xBUsXw)

### Module Federation
[探索 webpack5 新特性 Module federation 在腾讯文档的应用](https://juejin.cn/post/6844904127596593160)

### 用webpack5封装项目遇到的问题
#### `Module not found: Error: Can't resolve './src'`
解决方案：需要指定`entry`(https://github.com/webpack/webpack-cli/issues/1843)

#### [webpack项目注入全局变量](https://www.cnblogs.com/dshvv/p/14148834.html)
[vue,react 项目.env 环境变量原理解析](https://l-x-f.github.io/2020/10/24/node/env/)

#### 更改样式没有热更新，需要刷新页面
原因是开发环境进行了样式抽取。[webpack 开启热更新之后 样式文件修改后 页面不会刷新 但是js文件可以](https://blog.csdn.net/yunchong_zhao/article/details/108142523)

#### 使用`DefinePlugin`
注意：如果值是字符串，则需要使用`JSON.stringfy`或包裹引号进行处理，不处理的话编译后会原样转化(即不带引号)就会报错。
:::info
请注意，由于本插件会直接替换文本，因此提供的值必须在字符串本身中再包含一个 实际的引号 。通常，可以使用类似 '"production"' 这样的替换引号，或者直接用 `JSON.stringify('production')`。
:::

使用`DefinePlugin`注入全局变量并封装到依赖包后提供给vue项目使用，在template中使用定义的全局变量总是报错。原因：不能在template中直接使用([I think that you should avoid using process directly in template and you can use computed for proxying.](https://github.com/vuejs/vue-cli/issues/5059))。vue文件中的script里可以正常使用。

#### 配置别名
使用`resolve.alias`配置完别名后编译报错：`Can't resolve '@/views`

原因：import `.vue`文件时应该带后缀，不能省略`.vue`这个后缀

1. 封装的webpack作为依赖包让vue工程使用，在vue工程中的package.json中的scripts命令中设置环境变量参数（目的是往DefinePlugin中注入）报错。比如：
```js
// vue工程的package.json
"scripts": {
  "servePre": "webpack-cli serve --env-type pre"
}

// 这时会遇到4个问题：
// 1. 编译时控制台报错：Error: Unknown option '--env-type'
// 针对这个问题的解决方法是：在封装的webpack-cli中定义serve命令时使用option定义该命令的参数，如：
program.command('serve').option('-et, --env-type <envType>', 'set the global variable')
// 2. 此时，--env-type 和 pre，并不会注入到process.argv中，需要用到的一个知识点是：向 npm 脚本传入参数(https://www.ruanyifeng.com/blog/2016/10/npm_scripts.html)
// 针对这个问题的解决方法是：在封装的webpack-cli中定义serve命令的执行操作中使用 -- 向npm脚本传入参数，如：
program.command('serve').option('-et, --env-type <envType>', 'set the global variable').description('serve the project').action((name, options)=>{
  childProcess.spawn('npm', ['run', 'serve', '--', '--env-type', name.envType], {
    // spawn的options
  })
})
// 3. 此时，编译还会报错，如下：
[webpack-cli] Error: Unknown option '--env-type'
[webpack-cli] Run 'webpack --help' to see available commands and options
// 原因是将--env-type当成webpack的参数处理了
// 针对这个问题的解决方法是：使用 -- 隔开，即：
childProcess.spawn('npm', ['run', 'serve', '--', '--', '--env-type', name.envType]
// 4. 上面使用 -- 隔开处理后，编译时还是会解析自定义的命令去对应webpack的配置文件(CLI 中传入的任何参数会在配置文件中映射为对应的参数: https://www.webpackjs.com/api/cli/)，导致报错。
// 最终的解决方案是：放弃使用process.argv（当然，也可以使用往process.argv中push这种方案，不过感觉这种不好），转而使用上层的argv，即使用该依赖包的工程中的scripts命令参数(通过commander的action的入参options进行获取：options.parent.rawArgs)。然后结合process.env，最终将配置文件中的Key-Value注入到DefinePlugin
```

8. [webpack设置和获取命令行动态传参的4种方法](http://www.jsphp.net/webpack/show-26-556-1.html)
9. [_defaultsdeep](https://lodash.shujuwajue.com/object/defaultsdeep)
10. 路由懒加载(即路由组件懒加载)
- [vue-router路由懒加载原理](https://juejin.cn/post/6844904180285456398)
- [Vue Webpack 打包优化——路由懒加载（按需加载）原理讲解及使用方法说明](https://blog.csdn.net/weixin_44869002/article/details/106288371)
> 实现组件懒加载(按需加载)需要2步：(1)对需要按需加载的组件进行单独打包 (2)组件用到的时候再加载而不是一次性加载

> A. 单独打包

> 1）首先正常引入，如：

```
Vue.use(VueRouter)
export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/home',
      component: Home
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
```

> 打包后发现都在一个js文件中(webpack设置splitChunks的话，打包后还会有一个vue的vendor js文件)

> 2）稍作修改，如：

```
Vue.use(VueRouter)
export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/home',
      // component: Home
      component: import('@/views/Home.vue')
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '*',
      redirect: '/home'
    }
  ]
})
```

> 打包后发现，Home.vue会被单独打包到一个js文件中。即**使用ES6的import()实现组件单独打包**。但是，此时使用http-server启动打包后的文件，会报错：Failed to mount component:template or render function not defined

> B. 用到的时候再加载，使用函数实现，函数就是调用的时候才执行

> 对上述的2）再稍作修改，如：

```
Vue.use(VueRouter)
export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/home',
      // component: Home
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '*',
      redirect: '/about'
    }
  ]
})
```

> 打包后发现，Home.vue会被单独打包到一个js文件中，并且启动也不报错了。然后改为一进来匹配/about，使用chrome的network面板观察此时有没有加载Home.vue打包后的文件。发现：切换到/home路由时才请求Home.vue打包后对应的js文件。

> C. 组件单独打包，除了使用ES6的import()方法，还可以使用require.ensure()。如：
```js
{
  path: '/home',
  name: 'home',
  component: resolve  => require.ensure([], () => resolve (require('@/components/home')), 'demo')
},
```

> 注意：require.ensure() 是 webpack 特有的，已经被 import() 取代。

> D. 设置打包生成的文件(chunk)的名字：使用webpack的output.chunkFilename属性。
> - 未设置chunkFilename
![output](../img/webpack_output.png)
> - 设置chunkFilename
![chunkfilename](../img/chunkfilename.png)
> - 注意：不设置的话，output.chunkFilename默认使用 [id].js 或从 output.filename 中推断出的值（[name] 会被预先替换为 [id] 或 [id].）。

> E. 把不同的组件打包到同一个chunk中：import时加注释/* webpackChunkName: "xxx" */
> - 不加注释时，如：

```
Vue.use(VueRouter)
export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/home',
      // component: Home
      component: () => import('@/views/Home.vue')
    },
    {
      path: '/newhome',
      component: () => import('@/views/NewHome.vue')
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '*',
      redirect: '/about'
    }
  ]
})
/*
打包后会有4个js文件：
main.921ffdfb27b326bd1cb0.js
src_views_Home_vue.68656cd9b10d0123407a.js
src_views_NewHome_vue.263b2a91436b3fae382d.js
vendors.b941d293e389a95ae4a1.js
*/
```

> - 加注释后，如：

```
Vue.use(VueRouter)
export default new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/home',
      // component: Home
      component: () => import(/* webpackChunkName: "home" */ '@/views/Home.vue')
    },
    {
      path: '/newhome',
      component: () => import(/* webpackChunkName: "home" */ '@/views/NewHome.vue')
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '*',
      redirect: '/about'
    }
  ]
})
/*
打包后，有3个js文件：
home.050a110d6ab98dee4f87.js
main.1d5d1cca0f9a4f23c610.js
vendors.b941d293e389a95ae4a1.js
*/
```

> F. 对于vue-router官方文档上说的需要安装syntax-dynamic-import这个babel插件来实现路由懒加载，反正使用webpack5的时候不安装也可以，5以下的就没试过了。

1.  使用babel支持typescript
- 在 babel7 之前，是需要同时使用 ts-loader 和 babel-loader 的，其编译过程 TS > TS 编译器 > JS > Babel > JS 。可见编译了两次js，效率有些低下。但是 babel7 出来之后有了解析 typescript 的能力，有了这一层面的支持，我们就可以只使用 babel，而不用再加一轮 ts 的编译流程了。即可以使用babel-loader()来处理ts，而不需要再使用ts-loader。(参考：[Webpack5 搭建 Vue3 + TS 项目](https://blog.csdn.net/lgno2/article/details/116457524))

1.  使用webpack-dev-server 4.x 启动服务后（host:127.0.0.1）请求接口，接口能正常请求到，但浏览器控制台一直报错：[webpack-dev-server] invalid host/origin header。解决方案：配置devServer的allowedHosts，并且host使用allowedHosts里面配置的值。

2.  打包正确姿势：nginx的server的location指定的访问路径===webpack的output的publicPath配置的值

3.  vue 路由懒加载，动态设置webpackChunkName：使用webpack 2.6.0 以上的占位符[ index ]和[ request ]
- [在 vue 路由懒加载中给 Webpack Chunks 命名](https://blog.csdn.net/senmage/article/details/105691054)

1.  windows启动项目提示node-sass安装失败的解决方案：删除项目中的node_modules，切换到cnpm，然后全局安装node-sass，然后再在项目中重新npm install。

2.  webpack < 5 used to include polyfills for node.js core modules by default.
- Can't resolve 'fs'等类似的报错也都是这个原因
- 在运行过程中出现了很多这样的报错信息，是由于在webpack5中移除了nodejs核心模块的polyfill自动引入，所以需要手动引入，如果打包过程中有使用到nodejs核心模块，需要单独配置。[webpack5升级过程遇到的一些坑](https://www.cnblogs.com/sk-3/p/14147612.html)
```js
// webpack.config.js
module.exports = {
  ...
  resolve: {
    // https://github.com/babel/babel/issues/8462
    // https://blog.csdn.net/qq_39807732/article/details/110089893
    // 如果确认需要node polyfill，设置resolve.fallback安装对应的依赖
    fallback: {
      crypto: require.resolve('crypto-browserify'),
      path: require.resolve('path-browserify'),
      url: require.resolve('url'),
      buffer: require.resolve('buffer/'),
      util: require.resolve('util/'),
      stream: require.resolve('stream-browserify/'),
      vm: require.resolve('vm-browserify')
    },
    // 如果确认不需要node polyfill，设置resolve.alias设置为false
    alias: {
      crypto: false
    }
  }
}
```

1.  导入ts文件a但是没带.ts后缀，编译时报错：Can't resolve 'a'
> 解决方法：配置webpack的resolve.extensions，该属性的作用是尝试按顺序解析这些后缀名，能够使用户在引入模块时不带扩展。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。
```js
module.exports = {
  //...
  resolve: {
    extensions: ['.ts', '.js', '.json', '.wasm'],
  },
};
```

## [webpack打包JavaScript库](https://webpack.js.org/guides/author-libraries/)
需要通过 `output.library` 配置项暴露从入口导出的内容。
```js title="webpack.config.js"
 const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-numbers.js',
    library: "webpackNumbers",
  },
};
```
将入口暴露为 `webpackNumbers`，这样用户就可以通过 script 标签使用它：
```html
<script src="https://example.org/webpack-numbers.js"></script>
<script>
  window.webpackNumbers.wordToNum('Five');
</script>
```
此时，它只能通过被 script 标签引用而发挥作用，而不能运行在 CommonJS、AMD、Node.js 等环境中。作为一个库作者，我们希望它能够兼容不同的环境。换言之，除了通过 script 标签使用，用户还应该能够通过以下方式使用打包后的库：
- 在 CommonJS 模块中导入
  ```js
  const webpackNumbers = require('webpack-numbers');
  
  webpackNumbers.wordToNum('Two');
  ```

- 在 AMD 模块中导入
  ```js
  require(['webpackNumbers'], function (webpackNumbers) {
    webpackNumbers.wordToNum('Two');
  });
  ```

更新 `output.library` 配置项，将其 `type` 设置为 'umd'，使得其可以通过 CommonJS、AMD 模块以及 script 标签使用。
```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
    output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-numbers.js',
    library: {
      name: 'webpackNumbers',
      type: 'umd',
    },
  },
};
```
