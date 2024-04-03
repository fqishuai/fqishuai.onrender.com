
## husky
[husky](https://typicode.github.io/husky/)自动检查您的提交消息、代码，并在提交或推送时运行测试。

husky 整个安装主要有以下几步：
1. 安装 husky 依赖： `npm install -D husky`

2. 安装 husky 目录：`npx husky install`
   
   `npx husky install` 命令，是为了在项目中创建一个 git hook 目录，同时将本地 git 的 hook 目录指向项目内的 husky 目录。

3. 添加 npm prepare 钩子：`npm pkg set scripts.prepare="husky install"`

  :::info
  npm 中也有一些生命周期钩子，prepare 就是其中一个，以下是对他的运行时机介绍:
   - 在 `npm publish` 和 `npm pack` 期间运行
   - 在本地 `npm install` 时运行
   - 在prepublish和prepublishOnly期间运行
  :::

4. 添加 git pre-commit 钩子：`npx husky add .husky/pre-commit "npm run test"`
   
   `npx husky add` 命令用于添加 git hook 脚本, 这个命令中自动添加了文件头及文件可执行权限。

依次执行完这四步，我们就完成了 husky 的安装以及 一个 pre-commit 钩子的创建。总的来说，当执行 `npx husky install` 时，会通过一个 git 命令，将 git hook 的目录指向 husky 的目录，由于 git 仓库的设置不会同步到远程仓库，所以 husky 巧妙地通过添加 npm 钩子以保证新拉取的仓库在执行 `npm install` 后会自动将 git hook 目录指向 husky 的目录。

:::info
[git官网介绍githooks](https://git-scm.com/docs/githooks)

[husky 源码浅析](https://zhuanlan.zhihu.com/p/668482056)
:::

大多数 Git 命令都包含一个 `-n`或`--no-verify` 选项来跳过hooks，对于没有此选项的命令，请使用 `HUSKY=0` 暂时禁用hooks:
```bash
git commit -m "..." -n # Skips Git hooks

HUSKY=0 git ... # Temporarily disables all Git hooks
git ... # Hooks will run again
```

要测试一个hook，可以在hook脚本中使用 `exit 1` 以中止 Git 命令:
```bash title=".husky/pre-commit"
# .husky/pre-commit

# Your WIP script
# ...

exit 1
```
```bash
git commit -m "testing pre-commit code"
# A commit will not be created
```

## conventional commits（约定式提交）
Conventional Commits是一个提交格式规范，这个规范主要是当你在commit的时候，对我们的提交信息做一个格式规范约束，它提供了一组简单规则来创建清晰的提交历史，通过在提交信息中描述功能、修复、破坏性变更。

message格式如下：
```bash
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```
![message](img/commit_message.webp)

### 使用
- 安装`commitlint`和`husky`，`commitlint`用于对commit message进行格式校验，`husky`则易用git hook。`pnpm add -D @commitlint/cli @commitlint/config-conventional husky`

- 配置：在项目根目录中新建一个`commitlint.config.js`文件，配置commitlint。

- git hooks: 执行`pnpm exec husky install`命令之后，项目根目录会创建一个`.husky`文件夹（husky hook文件夹）。在这个文件夹中创建一个`commit-msg`文件，在`git commit`时，会触发到`commit-msg`这个hooks，执行commitlint进行commit message校验。当检验不通过时，则不能完成本次commit操作。
  ```bash
  # commit-msg
  #!/bin/sh
  . "$(dirname "$0")/_/husky.sh"

  pnpm commitlint --edit $1
  ```