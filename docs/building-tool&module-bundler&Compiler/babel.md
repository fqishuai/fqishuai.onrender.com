---
tags: [编译工具]
---

[Babel](https://babel.dev/) 是一个 JavaScript 编译器。
:::tip
有关编译器的精彩教程，请查看[the-super-tiny-compiler](https://github.com/thejameskyle/the-super-tiny-compiler)。
:::

## Babel基础
Babel 是一个工具链，主要用于将 ECMAScript 2015+ 代码转换为向后兼容的 JavaScript 版本。

Babel 做的主要事情：
- 转换语法。Babel 通过语法转换器支持最新版本的 JavaScript。
- 填充目标环境中缺少的 Polyfill 功能（通过第三方 Polyfill，例如 core-js）
- 源代码转换（codemods）

```js
// Babel Input: ES2015 arrow function
[1, 2, 3].map(n => n + 1);

// Babel Output: ES5 equivalent
[1, 2, 3].map(function(n) {
  return n + 1;
});
```

Babel 可以转换 JSX 语法！`npm install --save-dev @babel/preset-react`

Babel 可以去掉类型注释！请记住，Babel 不进行类型检查；您仍然需要安装并使用 Flow 或 TypeScript 来检查类型。`npm install --save-dev @babel/preset-typescript`

### 转换语法
如何将使用 ES2015+ 语法的 JavaScript 应用程序代码编译为可在当前浏览器中运行的代码。这将涉及转换新语法和填充缺失的功能。
1. `npm install --save-dev @babel/core @babel/cli @babel/preset-env`
2. 在项目的根目录中创建名为 `babel.config.json` 的配置文件（需要 v7.8.0 及更高版本）
   ```json title="babel.config.json"
   {
     "presets": [
       [
         "@babel/preset-env", // @babel/preset-env将仅加载目标浏览器中不可用的功能的转换插件。
         {
           "targets": { // 示例。您必须针对您想要支持的浏览器进行调整。
             "edge": "17",
             "firefox": "60",
             "chrome": "67",
             "safari": "11.1"
           },
           "useBuiltIns": "usage", // Babel 将检查您的所有代码是否有目标环境中缺少的功能，并且仅包含所需的 polyfill。
           "corejs": "3.6.5"
         }
       ]
     ]
   }
   ```
  如果你使用的是较低版本的 Babel 的话，在项目根目录创建`babel.config.js`:
  ```js title="babel.config.js"
  const presets = [
     [
       "@babel/preset-env",
       {
         targets: {
           edge: "17",
           firefox: "60",
           chrome: "67",
           safari: "11.1",
         },
         useBuiltIns: "usage",
         corejs: "3.6.4",
       },
     ],
   ];

   module.exports = { presets };
  ```

3. 运行如下命令将 src 目录中的所有代码编译到 lib: `npx babel src --out-dir lib`

#### `@babel/core`
Babel 的核心功能位于 `@babel/core` 模块。
```js
const babel = require("@babel/core");

babel.transformSync("code", optionsObject);
```

#### `@babel/cli`
`@babel/cli` 是一个允许你从terminal使用 babel 的工具。
```bash
npm install --save-dev @babel/core @babel/cli

./node_modules/.bin/babel src --out-dir lib # 这将解析 src 目录中的所有 JavaScript 文件，应用我们告诉它的任何转换，并将每个文件输出到 lib 目录。由于我们还没有告诉它应用任何转换，因此输出代码将与输入相同（不保留确切的代码样式）。
```

#### plugins 和 presets
转换以插件的形式出现，它们是小型 JavaScript 程序，指导 Babel 如何对代码进行转换。您甚至可以编写自己的插件来将您想要的任何转换应用到代码中。

要将 ES2015+ 语法转换为 ES5，我们可以依赖 `@babel/plugin-transform-arrow-functions` 等官方插件:
```bash
npm install --save-dev @babel/plugin-transform-arrow-functions

./node_modules/.bin/babel src --out-dir lib --plugins=@babel/plugin-transform-arrow-functions
```
现在我们代码中的任何箭头函数都将转换为 ES5 兼容的函数表达式：
```js
const fn = () => 1;

// converted to

var fn = function fn() {
  return 1;
};
```

我们可以使用“preset”，而不是逐一添加我们想要的所有插件，它只是一组预先设计的插件。就像插件一样，您也可以创建自己的presets来共享您需要的插件的任何组合。
```bash
npm install --save-dev @babel/preset-env # 此预设包含支持现代 JavaScript（ES2015、ES2016 等）的所有插件。

./node_modules/.bin/babel src --out-dir lib --presets=@babel/env
```

### polyfill
:::tip
如果您将生成器或异步函数(`generators` or `async function`)编译为 ES5，并且使用的 `@babel/core` 或 `@babel/plugin-transform-regenerator` 版本早于 7.18.0，则还必须加载 `regenerator` 运行时包。当使用 `@babel/preset-env` 的 `useBuiltIns: "usage" 选项`或 `@babel/plugin-transform-runtime` 时，它​​会自动加载。
:::
`@babel/polyfill` 包括 `core-js` 和自定义`regenerator` 运行时来模拟完整的 ES2015+ 环境。
```bash
npm install --save @babel/polyfill
```

从 Babel 7.4.0 开始，`@babel/polyfill` 已被弃用，直接使用`import "core-js/stable";`以填充 ECMAScript 功能

当使用 `@babel/preset-env` 的 `useBuiltIns: "usage" 选项后如下代码
```js
Promise.resolve().finally();
```
在Edge 17中会变成:
```js
require("core-js/modules/es.promise.finally"); // 自动加载polyfill，因为 Edge 17 没有 Promise.prototype.finally

Promise.resolve().finally();
```

## presets
Babel presets 是功能集，官方presets有：
- `@babel/preset-env` 用于编译 ES2015+ 语法
- `@babel/preset-typescript` 用于TypeScript
- `@babel/preset-react` 用于React
- `@babel/preset-flow` 用于Flow

使用preset，可以指定preset的npm包名(Babel 将检查它是否已安装在 node_modules 中)，或者指定preset的相对或绝对路径：
```json title="babel.config.json"
{
  "presets": ["babel-preset-myPreset", "@babel/preset-env"]
}
```
```json title="babel.config.json"
{
  "presets": ["./myProject/myPreset"]
}
```

preset的执行顺序是从右到左或从下到上，如下将按以下顺序运行：c、b、然后 a。这主要是为了确保向后兼容性。
```json title="babel.config.json"
{
  "presets": ["a", "b", "c"]
}
```

preset可以设置options，对于不使用options的preset，以下写法是等效的：
```json title="babel.config.json"
{
  "presets": [
    "presetA", // bare string
  ]
}
```
```json title="babel.config.json"
{
  "presets": [
    ["presetA"], // wrapped in array
  ]
}
```
```json title="babel.config.json"
{
  "presets": [
    ["presetA", {}] // 2nd argument is an empty options object
  ]
}
```

### `@babel/preset-env`
`@babel/preset-env`允许您使用最新的 JavaScript，它的options有以下：
- `targets` 它允许你指定你想要支持的浏览器或环境的版本。Babel 会根据这些目标来决定需要转换的 JavaScript 特性以及需要包含的 polyfills。你可以以多种方式指定 targets：

  - 浏览器版本：直接指定浏览器和它们的版本，例如 `{ "chrome": "58", "ie": "11" }`。

  - 查询字符串：使用类似于 browserslist 的查询字符串，例如 `"> 0.25%, not dead"`。

  - Node.js 版本：指定 Node.js 的目标版本，例如 `{ "node": "current" }` 或 `{ "node": "10" }`。

  - `esmodules`：设置为 `true` 来支持只支持原生 ES 模块的浏览器。

  如果不设置 `targets`，`@babel/preset-env` 会使用 `browserslist` 的默认配置。

  通过合理配置 `targets`，你可以确保编译后的代码既能在目标环境中运行，又不会因为包含不必要的转换和 polyfills 而变得臃肿。

- `useBuiltIns` 它告诉 Babel 如何处理 polyfills（代码片段，用于在旧环境中提供新特性的支持）。`useBuiltIns` 有三个可能的值：

  - `false`：不自动添加 polyfills。如果你选择这个选项，你需要手动引入所需的 polyfills。

  - `entry`：根据你的目标环境和你的入口文件中的 `import` 语句，自动引入必要的 polyfills。这通常需要在你的入口文件中包含 `import "core-js"` 或 `import "regenerator-runtime/runtime"`。

  - `usage`：Babel 会根据你的代码和目标环境自动引入所需的 polyfills，而不需要在入口文件中显式引入它们。这是最推荐的方式，因为它只会包含必要的 polyfills，从而减小最终包的大小。

  在配置 `useBuiltIns` 时，通常还需要指定 corejs 的版本，以确保 Babel 使用正确的 polyfill 版本。

### `@babel/preset-react`

### `@babel/preset-typescript`

### 开发preset
需要导出一个配置对象，例如：
```js title="preset-example.js"
module.exports = () => ({
  presets: [require("@babel/preset-env")],
  plugins: [
    [require("@babel/plugin-transform-class-properties"), { loose: true }],
    require("@babel/plugin-transform-object-rest-spread"),
  ],
});
```

## plugins
### 开发plugin
使用 [astexplorer.net](https://astexplorer.net/#/KJ8AjD6maa) 即时创建插件或使用 [generator-babel-plugin](https://github.com/babel/generator-babel-plugin) 生成插件模板。

```js title="example-babel-plugin.js"
// A plugin is just a function
export default function({ types: t }) {
  return {
    visitor: {
      Identifier(path) {
        let name = path.node.name; // reverse the name: JavaScript -> tpircSavaJ
        path.node.name = [...name]
          .reverse()
          .join("");
      },
    },
  };
}
```

#### [generator-babel-plugin](https://github.com/babel/generator-babel-plugin)
```bash
npm install -g yo
npm install -g generator-babel-plugin
yo babel-plugin
```
- 按照上述步骤使用时报错Cannot create property 'help' on string 'example'，放弃使用
- 使用[generator-babel-plugin-x](https://github.com/OSpoon/generator-babel-plugin)生成目录，参照该目录创建[babel-plugin-starter](https://github.com/fqishuai/babel-plugin-starter)作为开发babel插件的通用工程

#### [yeoman](https://yeoman.io/)

## Babel使用
### 转译 可选链操作符 及 空值合并运算符
```js title='babel.config.js'
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      // Config for @babel/preset-env
      {
        // Example: Always transpile optional chaining/nullish coalescing
        include: [
          /(optional-chaining|nullish-coalescing)/
        ],
      },
    ],
  ]
}
```

### `@babel/preset-typescript`
`babel-loader` 是一个用于 Webpack 的加载器，它使用 Babel 来转换 JavaScript 文件。虽然 `babel-loader` 本身主要是为了转换 JavaScript 代码，但它也可以转换 TypeScript 代码，只要你配置了相应的 Babel 插件。

如果您使用 TypeScript 建议使用 `@babel/preset-typescript`，它包含插件`@babel/plugin-transform-typescript`
```bash
npm install --save-dev @babel/preset-typescript
```
添加 `@babel/preset-typescript` 到你的预设列表中：
```json title="babel.config.json"
{
  "presets": ["@babel/preset-typescript"]
}
```
请注意，虽然 Babel 可以转换 TypeScript 的语法，它不会进行类型检查。

### `@babel/plugin-proposal-class-properties`
`@babel/plugin-proposal-class-properties` 是一个 Babel 插件，它允许你在 JavaScript 类中使用类属性（class properties）和静态属性（static properties）的语法。这个插件实现了一个提案，该提案现在已经被 ECMAScript 标准正式采纳。

使用这个插件，你可以在类定义中直接声明类的实例属性，而不需要在构造函数中声明。同时，你也可以声明静态属性，这些属性是属于类本身而不是类的实例。

例如：
```js
class MyClass {
  static staticProperty = 'someValue'; // 静态属性
  instanceProperty = 'value'; // 实例属性

  constructor() {
    // ...
  }
}
```

在 Babel 7.8.0 之后，这个插件的功能已经包含在 `@babel/preset-env` 中，所以如果你使用的是这个版本或更高版本的 Babel，并且已经配置了 `@babel/preset-env`，那么你可能不需要单独添加这个插