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

## 使用`package.json`
```js
const packageJson = require('./package.json')
const name = packageJson.name
```