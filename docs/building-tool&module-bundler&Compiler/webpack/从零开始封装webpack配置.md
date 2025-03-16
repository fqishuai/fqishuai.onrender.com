---
slug: webpack-from-scratch
tags: [webpack]
---

## 处理不同文件
### `babel-loader`
`@babel/preset-env`

#### 遇到的报错
- `Error: Can't resolve 'babel-loader'`
  
  解决：使用`require.resolve('babel-loader')`
  ```js
  // webpack配置

  loader: 'babel-loader',
  // 改为
  loader: require.resolve('babel-loader'),
  ```

- `Error: Cannot find package '@babel/preset-env'`
  
  解决：使用`require('@babel/preset-env').default`
  ```js
  // webpack配置

  presets: [
    [
      '@babel/preset-env',
      {
        // ...
      }
    ]
  ]

  // 改为
  presets: [
    [
      require('@babel/preset-env').default,
      {
        // ...
      }
    ]
  ]
  ```

- `Error: Can't resolve 'core-js/modules/es6.symbol.js' Can't resolve 'core-js/modules/es.string.trim.js'`等一堆关于`core-js`的报错
  
  报错的原因是使用了`"useBuiltIns": "usage"`：
  ```js
  // webpack配置
  {
    test: /\.(?:js|mjs|cjs|ts)$/,
    exclude: /node_modules/,
    use: {
      loader: require.resolve('babel-loader'),
      options: {
        presets: [
          ['@babel/preset-env', {
            "targets": {
              "edge": "17",
              "firefox": "60",
              "chrome": "67",
              "safari": "11.1"
            },
            "useBuiltIns": "usage",
            "corejs": "3.6.5"
          }],
          ['@babel/preset-typescript']
        ]
      }
    }
  }
  ```

  解决方案：
  - 如果是monorepo工程，使用workspace形式引入依赖，比如封装webpack配置的应用是A，使用该webpack进行打包的应用是B，则需要在B中安装`core-js`
    ```json title="B/package.json"
    {
      "devDependencies": {
        "A": "workspace:*"
      },
      "dependencies": {
        "core-js": "3.6.5"
      }
    }
    ```
    或者不需要在B中安装`core-js`，而是在A中安装`core-js`，不过需要指定`core-js`的路径：
    ```js
    // A中webpack配置
    resolve: {
      alias: {
        "core-js": path.resolve(__dirname, '../node_modules/core-js')
      },
    },
    ```

  - 如果是封装webpack配置的应用A发布npm包然后应用B引入的情况，则在应用A中安装`core-js`。在A中未指定版本安装`core-js`后，在B中引入A，启动发现还是报这个错，猜测是不是没找到依赖的`core-js`，所以使用`resolve.alias`指定`core-js`的路径：
    ```js
    // webpack配置
    resolve: {
      alias: {
        "core-js": path.resolve(__dirname, '../node_modules/core-js')
      },
    },
    ```
    然后使用`npm link`调试后发现报错变成了`node_modules/babel-runtime/core-js/object/assign.js Can't resolve 'core-js/library/fn/object/assign'`，这个错误表明项目中的某个部分（可能是一个依赖）正在尝试导入 `core-js` 的一个旧版本路径，但是这个路径在你安装的 `core-js` 版本中找不到。`core-js 3.x` 版本中已经不再使用 `core-js/library/...` 这样的路径。根据报错的提示知道是`babel-runtime`使用了低版本的`core-js`，但是B中没有手动安装`babel-runtime`，所以`babel-runtime`应该是B使用的某个npm包的依赖。
    :::tip
    要检查哪个 npm 包依赖于 `babel-runtime`，你可以使用以下方法之一：
    - 使用 npm 的 ls 命令来列出项目依赖树，并搜索 `babel-runtime`：`npm ls babel-runtime` 这个命令会显示所有依赖 `babel-runtime` 的包及其版本。
    - 如果你使用的是 npm 或 Yarn，你可以在 `package-lock.json` 或 `yarn.lock` 文件中搜索 `babel-runtime` 来查看哪些包依赖于它。这些锁文件包含了你项目中所有依赖的确切版本和来源。
    - 有一些第三方工具可以帮助你分析项目的依赖树，例如 `depcheck` 或 `npm-check`。这些工具可以提供关于项目依赖的更详细信息。比如安装 `depcheck`: `npm install -g depcheck` 然后在项目目录中运行它: `depcheck`
    :::
    在B的`package-lock.json`中搜索`babel-runtime`发现是使用的组件库依赖了`babel-runtime`，而`babel-runtime`依赖的`core-js`是2.4.0版本，所以将A中的`core-js`重新安装2.4.0版本，然后使用`npm link`调试，B可以正常启动。
    ```js
    // webpack配置
    module: {
      rules: [
        {
          test: /\.(?:js|mjs|cjs|ts)$/,
          exclude: /node_modules/,
          use: {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                [
                  require('@babel/preset-env').default,
                  {
                    targets: {
                      "edge": "17",
                      "firefox": "60",
                      "chrome": "67",
                      "safari": "11.1"
                    },
                    useBuiltIns: "usage",
                    corejs: '2.4.0',
                  }
                ],
                [
                  require('@babel/preset-typescript').default
                ]
              ]
            }
          }
        },
      ]
    },
    resolve: {
      alias: {
        "core-js": path.resolve(__dirname, '../node_modules/core-js')
      },
    },
    ```
    然后尝试将指定`core-js`的路径改为不指定，发现B仍可以正常启动。
    ```js
    // webpack配置
    {
      test: /\.(?:js|mjs|cjs|ts)$/,
      exclude: /node_modules/,
      use: {
        loader: require.resolve('babel-loader'),
        options: {
          presets: [
            [
              require('@babel/preset-env').default,
              {
                targets: {
                  "edge": "17",
                  "firefox": "60",
                  "chrome": "67",
                  "safari": "11.1"
                },
                useBuiltIns: "usage",
                corejs: '2.4.0',
              }
            ],
            [
              require('@babel/preset-typescript').default
            ]
          ]
        }
      }
    },
    ```

### [`vue-loader`](https://vue-loader.vuejs.org/zh/)
在 webpack 中，所有的预处理器需要匹配对应的 loader。Vue Loader 允许你使用其它 webpack loader 处理 Vue 组件的某一部分。它会根据 lang 特性以及你 webpack 配置中的规则自动推断出要使用的 loader。

你应该将 `vue-loader` 和 `vue-template-compiler` 一起安装（vue-template-compiler 用于将 Vue 组件的模板编译成渲染函数）。每次升级项目中的 `vue` 包时，也应该匹配升级 `vue-template-compiler`（`vue-template-compiler` 的版本应该与你使用的 `vue` 版本相匹配。对于 `vue` 2.6.x，你应该使用与 `vue` 2.6.x 相同的 `vue-template-compiler` 版本。例如，如果你使用的是 `vue 2.6.12`，那么你应该安装 `vue-template-compiler 2.6.12`。这样可以确保模板编译器与 `vue` 的运行时版本兼容，避免出现版本不匹配的问题。）。

请确保在你的 webpack 配置中添加 Vue Loader 的插件，这个插件是必须的！ 它的职责是将你定义过的其它规则复制并应用到 `.vue` 文件里相应语言的块。例如，如果你有一条匹配 `/\.js$/` 的规则，那么它会应用到 `.vue` 文件里的` <script>` 块。
```js title="webpack.config.js"
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      // 它会应用到普通的 `.js` 文件
      // 以及 `.vue` 文件中的 `<script>` 块
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    // 请确保引入这个插件来施展魔法
    new VueLoaderPlugin()
  ]
}
```

#### 遇到的报错
- `TypeError: Cannot read properties of undefined (reading 'styles')`
  
  需要降低版本，vue2使用`"vue-loader": "^15.10.0"`

- `vue-template-compiler`可以安装在封装webpack的npm包中，它起初是安装在业务工程中，业务工程中uninstall `vue-template-compiler`后启动报错`Cannot find module 'vue-template-compiler'`，是Node.js 的缓存问题，清除 npm 缓存 `npm cache clean --force` 或者删除 `node_modules` 文件夹和 `package-lock.json` 文件，然后重新运行 `npm install`。


### `style-loader` `css-loader`
`style-loader`用于将 CSS 注入 DOM。

`css-loader` 像 `import/require()` 一样解释 `@import 和 url()` 并解析它们。

建议将 `style-loader` 与 `css-loader` 结合使用
```js title="webpack.config.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

### `sass-loader`
加载 Sass/SCSS 文件并将其编译为 CSS。
```bash
npm install sass-loader sass webpack --save-dev
```
```js title="webpack.config.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
    ],
  },
};
```

### postcss-loader
使用 PostCSS 处理 CSS。您需要 webpack v5 才能使用最新版本。对于 Webpack v4，您必须安装 postcss-loader v4。

PostCSS 是一个用于转换 CSS 的工具，它通过 JavaScript 插件来转换样式表。这些插件可以让你使用未来的 CSS 特性、优化 CSS 文件的大小、增加浏览器兼容性等。

`postcss-preset-env`插件 允许你使用未来的 CSS 特性，它会根据目标浏览器或环境转换这些特性为当前可用的等效写法。

```bash
npm install --save-dev postcss-loader postcss
```

在 `css-loader` 和 `style-loader` 之前使用它，但在其他预处理器加载器(例如 `sass-loader` `less-loader` `stylus-loader)之后使用它，因为 webpack 加载器执行顺序是从右到左/从下到上。
```js title="webpack.config.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
            },
          },
          "postcss-loader",
        ],
      },
    ],
  },
};
```
```js title="webpack.config.js"
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          {
            loader: "postcss-loader",
            options: { implementation: require("postcss") },
          },
          { loader: "sass-loader" },
        ],
      },
    ],
  },
};
```

## 遇到的问题
### 启动后el-table不渲染
> [webpack打包vue项目，打包成功，el-table没有渲染出来bug](https://blog.csdn.net/weixin_44009750/article/details/130366508)

解决：设置`resolve.alias`
```js title="webpack.config.js"
resolve: {
  alias: {
    "vue$": 'vue/dist/vue.esm.js'
  },
}
```

### 在执行npm包的bin文件报错`syntax error near unexpected token '('`
解决：在bin文件中添加Shebang行: `#!/usr/bin/env node`。

Shebang行是位于脚本文件顶部的特殊注释行，它告诉操作系统应该使用哪个解释器来执行该文件中的脚本。Shebang行的格式如下：`#!/path/to/interpreter`，例如，对于一个使用bash解释器的脚本，Shebang行会是这样的：`#!/bin/bash`

对于一个Node.js脚本，Shebang行应该是：`#!/usr/bin/env node`。这里，`/usr/bin/env`是一个程序，它在系统的环境变量`PATH`中查找node命令并执行它，这样做可以确保脚本使用的是系统路径中的Node.js解释器。

Shebang行必须是文件的第一行，而且它的前两个字符必须是`#!`。如果你的npm包的bin文件是一个Node.js脚本，确保它以正确的Shebang行开头。如果没有Shebang行或者Shebang行错误，当你尝试执行脚本时，可能会遇到`syntax error near unexpected token '('`之类的错误。

## 边界处理
