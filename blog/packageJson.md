## [`package.json`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

### 官方配置
#### `main`
`main`字段指定了当包被引入时（例如，通过`require`或`import`语句）应该默认加载的模块文件。这个字段通常用于指向包的主入口点。

如下，当用户执行`require('some-package')`或`import`相应的模块时，Node.js将会默认加载`index.js`文件。如果`main`字段没有被指定，Node.js会默认查找包根目录下的`index.js`文件。
```json
{
  "name": "some-package",
  "version": "1.0.0",
  "main": "index.js"
}
```

`main`字段是可选的，但是指定它可以让你的包更加清晰地表明其入口点是哪个文件，尤其是当你的主文件不叫`index.js`时。

#### `files`
在`package.json`文件中，`files`字段是一个数组，它指定了哪些文件和目录应该包含在你的npm包中。当你发布一个包到npm时，`files`数组可以用来过滤包含在你的包中的内容，确保只有重要的文件被上传，而不必要的或敏感的文件（如配置文件、测试文件、文档等）被排除在外。

如下，当你运行`npm publish`发布你的包时，只有`lib`目录和`index.js`文件会被包含在你的npm包中。所有其他文件和目录都会被忽略。
```json
{
  "name": "your-package",
  "version": "1.0.0",
  "files": [
    "lib/",
    "index.js"
  ]
}
```

如果你没有在`package.json`中指定`files`字段，npm会默认包含所有目录下的文件，除了那些通过`.npmignore`文件或`.gitignore文件`（如果没有`.npmignore`文件）明确忽略的文件。还有一些文件和目录总是会被忽略，比如`.git`、`node_modules`等。

#### `bin`
`bin`字段用于定义一个或多个可执行文件的映射。这些可执行文件是项目提供的命令行工具或脚本。当你的包被安装为全局包（使用`npm install -g`）或者作为其他项目的依赖时，这些可执行文件会被链接到系统的路径中，使得用户可以直接通过命令行调用它们。

如下，当`my-cool-package`被安装后，`my-cool-command`将会被链接到系统路径。用户可以在命令行中直接运行`my-cool-command`来执行`./bin/my-cool-command.js`文件。
```json
{
  "name": "my-cool-package",
  "version": "1.0.0",
  "bin": {
    "my-cool-command": "./bin/my-cool-command.js"
  }
}
```
如果你只有一个可执行文件，你也可以直接提供一个字符串而不是对象，在这种情况下，可执行命令的名称将默认使用包的名称。
```json
{
  "name": "my-cool-package",
  "version": "1.0.0",
  "bin": "./bin/my-cool-command.js"
}
```

#### `private`
如果你在 `package.json` 中设置了 `"private": true` ，那么 npm 将拒绝发布它。

这是防止意外发布私人存储库的一种方法。如果您想确保给定的包仅发布到特定registry（例如内部registry），请使用 `publishConfig` 在发布时覆盖registry的配置参数。

#### `publishConfig`
npm 包在发布时使用的配置值。比如在安装依赖时指定了 registry 为 taobao 镜像源，但发布时希望在公网发布，就可以指定 `publishConfig`:
```json
"publishConfig": {
  "registry": "https://registry.npmjs.org/"
}
```

请参阅[配置](https://docs.npmjs.com/cli/v10/using-npm/config)以查看可以覆盖的配置选项列表。

#### `engines`

#### `peerDependencies`
在 npm 版本 3 到 6 中，`peerDependencies` 不会自动安装，如果在依赖树中发现对等依赖项的无效版本，则会发出警告。从 npm v7 开始，默认安装`peerDependencies`。

peerDependencies 的作用：
- 版本一致性：确保多个包使用相同版本的依赖。例如，多个 React 组件库可能需要确保它们使用相同版本的 React。
- 避免重复安装：防止在项目中安装多个版本的同一个依赖，从而减少包的体积和潜在的冲突。
- 明确依赖关系：让使用你包的开发者明确知道需要安装哪些额外的依赖。

### 第三方配置
一些第三方库或应用在进行某些内部处理时会依赖这些字段，使用它们时需要安装对应的第三方库。

#### `module`
`module`字段是一个非官方的约定，用于指定一个包含ES6模块语法（即`import`和`export`语句）的入口点。这个字段主要用于构建工具和包管理器，以便它们可以在打包应用程序时优先使用ES模块版本的代码，这可能允许更好的摇树优化（tree-shaking）和其他模块化优势。

如下，`main`字段指向了一个CommonJS模块版本的入口点，而`module`字段指向了一个ES模块版本的入口点。当使用支持ES模块的工具（如Webpack、Rollup或其他现代JavaScript工具）时，这些工具可能会查找`module`字段以获取ES模块版本的代码。
```json
{
  "name": "my-es6-module",
  "version": "1.0.0",
  "main": "dist/my-es6-module.cjs.js",
  "module": "dist/my-es6-module.esm.js"
}
```

请注意，module字段不是Node.js官方支持的字段，它是社区约定的一个扩展。因此，Node.js本身在运行代码时不会使用这个字段，它主要是为了打包和构建工具设计的。

该字段来自关于如何将 ECMAScript 模块集成到 Node 中的[提案](https://github.com/dherman/defense-of-dot-js/blob/f31319be735b21739756b87d551f6711bd7aa283/proposal.md)。因此，用于指定 包的ECMAScript 模块的文件路径。比如，如果您的包名为 `foo`，并且用户安装了它，然后执行 `import {xxx} from 'foo`，那么将返回`module`指定的文件的导出对象。

#### `resolutions`
在`package.json`文件中，`resolutions`字段是一个Yarn特有的功能，它允许你覆盖依赖项的子依赖项的版本。这意味着你可以指定项目中使用的特定包的版本，即使这些包是作为其他包的依赖项安装的。这在解决版本冲突或强制使用某个修复版本的包时非常有用。

例如，如果你想要为一个子依赖项指定一个版本，你可以在`package.json`中这样写：
```json
{
  "resolutions": {
    "some-sub-dependency": "1.2.3"
  }
}
```
这将确保无论你的项目依赖树中的哪个包依赖`some-sub-dependency`，Yarn都会安装版本1.2.3。

请注意，`resolutions`字段是Yarn的一个特性，不是所有的包管理器都支持它。例如，npm就没有内置的等效功能。如果你使用的是npm，你可能需要使用其他工具或方法来解决依赖项版本的问题。

#### `types` `typings`
指定 TypeScript 的类型定义的入口文件
```json
"types": "./es/index.d.ts",
"typings": "./es/index.d.ts",
```

#### `unpkg`
unpkg是一个快速的全球内容交付网络（CDN），它可以为任何在npm上发布的包提供文件。

在`package.json`文件中，`unpkg`字段指定当用户通过unpkg CDN请求你的npm包时应该提供哪个文件，这通常是一个已经被转译和压缩的浏览器友好版本的文件，一般为UMD（Universal Module Definition）构建版本的文件。

例如：
```json
{
  "name": "your-package-name",
  "version": "1.0.0",
  "main": "index.js",
  "unpkg": "dist/your-package.min.js"
}
```
在这个例子中，当用户通过unpkg CDN请求这个包时，CDN将提供位于`dist/your-package.min.js`的文件。这使得用户可以很容易地在网页中通过一个`<script>`标签直接引入这个包`<script src="https://unpkg.com/your-package-name@1.0.0"></script>
`，而不需要自己构建或打包。这个URL将会解析到你在`package.json`文件的`unpkg`字段中指定的文件。

如果没有指定`unpkg`字段，unpkg CDN默认会提供`main`字段指定的文件。

#### `sideEffects`
`sideEffects`不是npm官方的标准，是Webpack 官方推出的私有属性。Rollup 也适配了这个属性。`sideEffects` 除了能设置 boolean 值, 还可以设置为数组, 传递需要保留副作用的代码文件。

`sideEffects`字段是一个告诉打包工具（如Webpack）哪些模块是“有副作用”的。这个字段主要用于优化打包过程，如下表明包中的所有模块都没有副作用，因此打包工具可以自由地进行树摇（tree shaking），移除未使用的代码。
```json
{
  "name": "your-package",
  "version": "1.0.0",
  "sideEffects": false
}
```

实际项目中, 通常并不能简单的设置为 `"sideEffects": false`, 有些副作用是需要保留的, 比如引入样式文件。比如在项目中整体引入 Ant Design 组件库的 css 文件。
```js
import 'antd/dist/antd.css'; // or 'antd/dist/antd.less'
```
如果 Ant Design 的 `package.json` 里不设置 `sideEffects`，那么 webapck 构建打包时会认为这段代码只是引入了但并没有使用，可以 tree-shaking 剔除掉，最终导致产物缺少样式。

所以 Ant Design 在 `package.json` 里设置了如下的 `sideEffects`，来告知 webpack，这些文件具有副作用，引入后不能被删除。
```json
"sideEffects": [
  "dist/*",
  "es/**/style/*",
  "lib/**/style/*",
  "*.less"
]
```

#### `lint-staged`

#### `commitlint`

#### `exports`
在 `package.json` 文件中，`exports` 字段用于定义包的导出路径，以便消费者可以通过不同的入口点导入包的不同部分。这个字段在 Node.js 和现代打包工具（如 Webpack 和 Rollup）中非常有用，因为它允许你更精细地控制包的导出结构。

`exports` 字段是一个对象，其中键是导出路径，值是导出路径的目标。你可以使用不同的条件来定义不同的导出路径，例如 `require`、`import`、`node`、`default` 等。

下面是一个示例，展示如何在 `package.json` 中使用 `exports` 字段：

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "index.js",
  "exports": {
    ".": {
      "import": "./esm/index.js",
      "require": "./cjs/index.js"
    },
    "./feature": {
      "import": "./esm/feature.js",
      "require": "./cjs/feature.js"
    },
    "./package.json": "./package.json"
  }
}
```
- **`"."`**：表示包的主入口点。
  - **`"import"`**：用于 ES 模块导入（`import`）。
  - **`"require"`**：用于 CommonJS 模块导入（`require`）。
- **`"./feature"`**：表示包的一个子模块。
  - **`"import"`**：用于 ES 模块导入（`import`）。
  - **`"require"`**：用于 CommonJS 模块导入（`require`）。
- **`"./package.json"`**：允许消费者直接导入 `package.json` 文件。

假设你有以下文件结构：

```
my-package/
├── cjs/
│   ├── index.js
│   └── feature.js
├── esm/
│   ├── index.js
│   └── feature.js
└── package.json
```

在你的项目中，你可以这样导入 `my-package`：

```javascript
// 使用 ES 模块导入
import { mainFunction } from 'my-package';
import { featureFunction } from 'my-package/feature';

// 使用 CommonJS 模块导入
const { mainFunction } = require('my-package');
const { featureFunction } = require('my-package/feature');
```

你还可以使用条件导出来根据不同的环境导出不同的模块。例如，你可以为浏览器和 Node.js 环境定义不同的导出路径：

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "main": "index.js",
  "exports": {
    ".": {
      "browser": "./dist/browser/index.js",
      "node": "./dist/node/index.js",
      "default": "./dist/index.js"
    }
  }
}
```

在这个示例中：

- **`"browser"`**：用于浏览器环境。
- **`"node"`**：用于 Node.js 环境。
- **`"default"`**：用于默认导出路径。

通过这种方式，你可以更精细地控制包的导出结构，以便在不同的环境中使用不同的模块。

#### `prepublishOnly`
`prepublishOnly` 是 `package.json` 中的一个脚本钩子，它在 `npm publish` 和 `npm install`（仅当安装的是本地包时）命令运行之前执行。这个钩子非常适合用于在发布包之前执行一些必要的构建或验证步骤。

你可以在 `package.json` 文件的 `scripts` 字段中定义 `prepublishOnly` 脚本。例如：

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "test": "jest",
    "prepublishOnly": "npm run build && npm test"
  },
  "devDependencies": {
    "webpack": "^5.0.0",
    "jest": "^26.0.0"
  }
}
```

在这个示例中：
- **`build`**：定义了一个构建脚本，使用 Webpack 进行构建。
- **`test`**：定义了一个测试脚本，使用 Jest 进行测试。
- **`prepublishOnly`**：在发布包之前运行构建和测试脚本。

什么时候运行 `prepublishOnly`:
- **`npm publish`**：当你运行 `npm publish` 命令时，`prepublishOnly` 脚本会在发布包之前执行。
- **`npm install`**：当你在本地安装包（例如 `npm install ./path/to/package`）时，`prepublishOnly` 脚本也会执行。

假设你有一个简单的项目结构：
```
my-package/
├── src/
│   └── index.js
├── dist/
│   └── index.js
├── package.json
└── webpack.config.js
```

你可以在 `package.json` 中定义 `prepublishOnly` 脚本，以确保在发布包之前进行构建和测试：

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "scripts": {
    "build": "webpack --config webpack.config.js",
    "test": "jest",
    "prepublishOnly": "npm run build && npm test"
  },
  "devDependencies": {
    "webpack": "^5.0.0",
    "jest": "^26.0.0"
  }
}
```

当你运行 `npm publish` 命令时，以下步骤将依次执行：

1. **`prepublishOnly`**：首先执行 `prepublishOnly` 脚本，即 `npm run build && npm test`。
2. **发布包**：如果 `prepublishOnly` 脚本成功执行，包将被发布到 npm 注册表。

通过这种方式，你可以确保在发布包之前进行必要的构建和测试步骤，从而提高包的质量和可靠性。

## 使用`package.json`
```js
const packageJson = require('./package.json')
const name = packageJson.name
```