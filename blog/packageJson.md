## [`package.json`](https://docs.npmjs.com/cli/v10/configuring-npm/package-json)

- `resolutions`

- `main` 用于指定包的入口文件，应该是相对于包文件夹根目录的文件。比如，如果您的包名为 `foo`，并且用户安装了它，然后执行 `require("foo")`，那么将返回`main`指定的文件的导出对象。如果未设置 `main`，则默认为包根文件夹中的`index.js`。

- `module` 该字段来自关于如何将 ECMAScript 模块集成到 Node 中的[提案](https://github.com/dherman/defense-of-dot-js/blob/f31319be735b21739756b87d551f6711bd7aa283/proposal.md)。因此，用于指定 包的ECMAScript 模块的文件路径。比如，如果您的包名为 `foo`，并且用户安装了它，然后执行 `import {xxx} from 'foo`，那么将返回`module`指定的文件的导出对象。
- `types`
- `typings`
- `unpkg`
- `GravityCDN`
- `files`
- `publishConfig`
- `lint-staged`
- `commitlint`

## 使用`package.json`
```js
const packageJson = require('./package.json')
const name = packageJson.name
```