[Biome](biomejs.dev) 是一个适用于 JavaScript、TypeScript、JSX 和 JSON 的快速格式化工具，与 Prettier 有高达 97% 的兼容覆盖率，能有效节约持续化集成和开发者的时间。

Biome 也是一个适用于 JavaScript、TypeScript 和 JSX 的高性能 linter，拥有来自 ESLint、typescript-eslint 以及其它规则源的超过 200 条规则。

安装：`pnpm add --save-dev --save-exact @biomejs/biome`

- 格式化命令：`npx @biomejs/biome format --write ./src`
- lint命令：`npx @biomejs/biome lint --write ./src`
- 你不仅可以分别对代码进行格式化和 lint，还可以通过一条命令同时完成它们！`npx @biomejs/biome check --write ./src`

我们建议为每个项目创建一个`biome.json`配置文件。它可以避免每次运行命令时重复输入CLI选项，并确保Biome在编辑器中应用相同的配置。如果您对Biome的默认设置满意，则无需创建配置。