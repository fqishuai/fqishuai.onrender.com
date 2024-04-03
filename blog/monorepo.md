
## monorepo
[2024 年 Monorepo 工具选择和实践](https://mp.weixin.qq.com/s/FIPYVsw7OQYNIyqFbKHNYw)

[Monorepo 的这些坑，我们帮你踩过了！](https://mp.weixin.qq.com/s/PIdmJ2cHmq9QBj6MBJ9ygQ)

[微前端场景下的代码共享](https://mp.weixin.qq.com/s/XE0kJ38P_jIHr8lhlvQWmA)

[基于 Rush 的 Monorepo 多包发布实践](https://mp.weixin.qq.com/s/CLkxXY1zRkMr78NFvjyemQ)

[从微组件到代码共享](https://mp.weixin.qq.com/s/29nIdcijMLBKjrqdMch3zA)

## 使用monorepo的知名开源库
- [vue-cli](https://github.com/vuejs/vue-cli): lerna

- [material-ui](https://github.com/mui/material-ui/tree/next): pnpm workspace + nx

- [babel](https://github.com/babel/babel): yarn workspace
- [react](https://github.com/facebook/react): yarn workspace

- [varlet](https://github.com/varletjs/varlet): pnpm workspace

- [modern.js](https://github.com/web-infra-dev/modern.js): pnpm workspace + nx + changesets

## Changesets
> [Changesets: 流行的 monorepo 场景发包工具](https://zhuanlan.zhihu.com/p/427588430)

:::tip
在版本控制系统中，"changeset"是一个术语，指的是一组在单个提交中引入的更改。每个 "changeset" 都有一个唯一的标识符，通常称为"版本号"或"修订号"。这个标识符可以是数字、字符串或者数字和字符串的组合，用于追踪特定的更改集。
:::

Changesets 是一个用于版本管理和发布的工具，特别适用于处理 monorepo 中的多个包。它通过变更文件（changesets）来跟踪对每个包的更改，并在发布时自动更新版本号和生成 changelog。以下是如何使用 Changesets 的基本步骤：
1. 安装 Changesets CLI: 在你的项目中安装 `@changesets/cli` 作为开发依赖。
   ```bash
   npm install @changesets/cli --save-dev
   # 或者使用 yarn
   yarn add @changesets/cli --dev
   ```

2. 初始化 Changesets: 运行 `changeset init` 来初始化 Changesets 配置。这将创建一个 `.changeset` 目录和一些配置文件。"changeset"文件也会在该目录下生成。
   ```bash
   npx changeset init
   ```

3. 创建变更文件: 当你对包进行更改时，你需要记录这些更改。运行 `changeset` 命令来创建一个新的变更文件(即"changeset"文件)。
   ```bash
   npx changeset
   ```
   这将提示你选择更改的包、更改的类型（major、minor、patch）以及更改的描述。这些信息将被用来生成 changelog 和更新版本号。

   注意：此时只是记录变更信息，不会更新`package.json` 文件中的版本号。

4. 审查变更文件: 变更文件将被添加到 `.changeset` 目录中。你可以审查这些文件以确保更改记录正确。

5. 当你准备好发布时，运行 `changeset version` 命令来应用变更文件中的更改，并更新包的版本号。
   ```bash
   npx changeset version
   ```
   这将更新 `package.json` 文件和 `CHANGELOG.md` 文件，以记录这些更改的详细信息。
   
   同时，相应的变更文件(即"changeset"文件)被消耗，即会被自动删除。

6. 发布到 npm: 运行 `changeset publish` 命令来发布更新的包到 npm。
   ```bash
   npx changeset publish
   ```
   这将自动根据更新的版本号发布包，并将变更文件移动到 `.changeset/README.md` 中。

确保在使用 Changesets 之前，你的包已经在 `package.json` 中正确配置了版本号和发布设置。此外，如果你在 monorepo 中使用 Changesets，你可能还需要配置 `yarn workspaces` 或 `npm workspaces` 来确保依赖关系正确处理。

如果你的项目是一个 monorepo，并且使用了像 Yarn Workspaces 或 npm Workspaces 这样的工具，你需要确保根目录的 `package.json` 被包含在工作区（workspaces）的配置中。这样，Changesets才会更新项目根目录下的 `package.json` 的版本。请注意，如果你的根目录下的 `package.json` 不代表一个可发布的包，而只是用于管理 monorepo 的配置和脚本，那么你可能不需要（也不应该）使用 `@changesets/cli` 来更新它的版本号。在这种情况下，版本号可能没有实际的意义，因为它不会被发布到 npm。

"Bump version" 是一个术语，通常指在软件开发中增加软件的版本号。这个过程可以是手动的，也可以通过自动化工具来完成。版本号通常遵循语义化版本控制（Semantic Versioning，简称 SemVer），它包括三个部分：主版本号（major）、次版本号（minor）和修订号（patch）。
- 主版本号：当你做了不兼容的 API 修改时，需要增加主版本号。

- 次版本号：当你以向下兼容的方式添加功能时，需要增加次版本号。

- 修订号：当你做了向下兼容的问题修正时，需要增加修订号。

版本号的增加通常与软件的新发布相对应，可能包括新功能的添加、bug 修复或其他更新。

在自动化工具中，如 `npm version`、`yarn version` 或使用 `lerna`、`changesets` 等工具时，"bump version" 过程通常包括以下步骤：
1. 更新 `package.json` 文件中的版本号。
2. 创建一个新的 Git 标签来标记这个版本。
3. 可能还会更新 CHANGELOG 文件，列出自上次发布以来的所有更改。

例如，使用 npm 来 bump 版本的命令如下：
```bash
npm version patch # 增加修订号
npm version minor # 增加次版本号
npm version major # 增加主版本号
```
这些命令会自动更新 `package.json` 中的版本号，并根据需要创建一个新的 Git 标签。