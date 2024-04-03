---
slug: config
tags: [Building tool, webpack]
---

:::info
- 如果没有配置文件，webpack 会假定项目的入口起点为 `src/index.js`，输出文件为 `dist/main.js`，并且在生产环境开启压缩和优化。
- 如果不配置loader，则打包时遇到非`.js`文件，会报错(如图片文件)或忽略(如样式文件)。
:::

## `entry`
- 不配置`entry`
  - 默认为`src/index.js`
  - 若`output`设置`filename: '[name].js'`,则打包后这个name为`main`，即`index.js`打包后为`main.js`
  
- 配置`entry`
  - string写法 or 对象写法
  ```js
  entry: './src/index.js',
  // 等价于
  entry: {
    main: './src/index.js'
  },
  // main 即 index.js打包后为main.js
  ```

## `output`
```js
output: {
  //如果把资源放在cdn下，则引入cdn
  publicPath: 'http://cdn.com.cn',
  //当entry有多个入口文件时，用[]可以输出多个文件
  filename: '[name].js',
  // 指打包后的文件要放在哪个文件下
  path: path.resolve(__dirname, 'dist')
}
```

Webpack 打包后的资源按大小分有三类，从小到大排列：
- module，即模块，每个引入的文件就是一个module，常言模块化，是开发中的物理最小代码单位
- chunk， N 个模块打包在一起形成的的一个文件（如果 chunk 有 split，则每个分开的文件都是一个独立的 chunk）
- bundle，一次工程编译打包的最终产物，有可能就是 chunk，也有可能包含多个chunk的综合体

这三类资源都可以生成 hash，粒度从低到高依次为：
- hash，根据每次编译的内容计算所得，不是针对每个具体文件的，每次编译都会有一个 hash
- chunkhash，入口级别的 hash，如果入口文件有改动，则从该入口打包引入的所有文件的hash都会变化，主要指同一个入口的js和css文件。
- contenthash，文件级别的 hash，只有文件的内容变了hash才会变

:::info
- [webpack 中，hash、chunkhash、contenthash 的区别是什么？](https://www.cnblogs.com/skychx/p/webpack-hash-chunkhash-contenthash.html)

- [webpack 缓存指南](https://www.webpackjs.com/guides/caching/)

- [webpack 中，filename 和 chunkFilename 的区别是什么？](https://www.cnblogs.com/skychx/p/webpack-filename-chunkFilename.html)
  
  filename 指列在 entry 中，打包后输出的文件的名称；chunkFilename 指未列在 entry 中，却又需要被打包出来的文件的名称。一般来说，这个 chunk 文件指的就是要懒加载的代码。
:::

## `optimization`
- `optimization.providedExports` 默认为true，即让webpack找出模块提供了哪些导出，以便为`export * from ...` 生成更高效的代码。
- `optimization.usedExports` tree shaking。usedExports 会使用 terser 判断代码有没有side effect，如果没有用到，又没有side effect 的话，就会在打包时替它标记上unused harmony，并在minify(用 Uglifyjs 或其他工具)的时候移除。

## `performance`
- `performance.hints` 设置为false时，不展示警告或错误提示。默认设置为 "warning"，将展示一条警告，通知你这是体积大的资源。设置为"error"时，将展示一条错误，通知你这是体积大的资源。在生产环境构建时，我们推荐使用"error"，有助于防止把体积巨大的 bundle 部署到生产环境，从而影响网页的性能。

## `resolve`
- `resolve.extensions` 尝试按顺序解析指定的后缀名，能够使用户在引入模块时不带后缀。如果有多个文件有相同的名字，但后缀名不同，webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀。

## `plugins`
用于设置使用各种webpack插件，常用的插件有：
- [`webpack-bundle-analyzer`](https://github.com/webpack-contrib/webpack-bundle-analyzer) 使用交互式可缩放树状图可视化 webpack 输出文件的大小。

- [`@statoscope/webpack-plugin`](https://github.com/statoscope/statoscope) 是一个用于分析（带有基于 UI 的报告）和验证捆绑包(bundle)统计信息的工具包。

## `module`
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
  - `oneOf` 当规则匹配时，只使用第一个匹配规则


## `externals`
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

## `devServer`
- `devServer.proxy`
```js
// 如下，对 /api/users 的请求会将请求代理到 http://localhost:3000/api/users
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
};

// 如果不希望传递/api，则需要重写路径
module.exports = {
  //...
  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
```

## `mode`
- 如果没有设置，webpack 会将 `mode` 的默认值设置为 `production`

## `devtool`
使用`devtool`配置项控制是否生成，以及如何生成source map。

:::info
当 webpack 打包源代码时，可能会很难追踪到 error(错误) 和 warning(警告) 在源代码中的原始位置。例如，如果将三个源文件（`a.js`, `b.js` 和 `c.js`）打包到一个 bundle（`bundle.js`）中，而其中一个源文件包含一个错误，那么堆栈跟踪就会直接指向到 `bundle.js`。为了更容易地追踪 error 和 warning，JavaScript 提供了 [source maps](https://blog.teamtreehouse.com/introduction-source-maps) 功能，可以将编译后的代码映射回原始源代码。如果一个错误来自于 `b.js`，source map 就会明确的告诉你。
:::