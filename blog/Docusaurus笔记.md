---
slug: learn-notes
tags: [以内容为中心的静态网站]
---

# Docusaurus笔记
:::tip
[Docusaurus](https://docusaurus.io/) 使用 [Infima](https://infima.dev/) 作为底层样式框架，Infima 提供了灵活的布局，以及常见的 UI 组件样式，适用于以内容为中心的网站（博客、文档、首页）。
:::

## 1. 路由
- 在 /src/pages/ 目录下所创建的任何 JavaScript/TypeScript 文件都会自动生成相应的网站路径
```js
/src/pages/index.js → [baseUrl]
/src/pages/foo.js → [baseUrl]/foo
/src/pages/foo/test.js → [baseUrl]/foo/test
/src/pages/foo/index.js → [baseUrl]/foo/
```
- 默认情况下，以 _ 开头的任何 Markdown 或 Javascript 文件都会被忽略，也不会为其生成任何路由（参见 exclude 选项，默认情况下，以 _ 开头的文件、测试文件 (.test.js) 和 `__tests__` 目录内的文件不会被转换成页面）。
- 如果你不小心创建映射到同一路由的多个页面，你只能访问最后创建的页面，而其他的冲突页面会被覆盖。 要解决此问题，你需要编辑或移除重复的路由。

## 2. 文档
### 2.1 文档的url
- 默认为它相对于 docs 文件夹的路径，如`/docs/Docusaurus笔记`
- 可以使用`slug`自定义文档url，slug 会被添加到文档插件的 routeBasePath 后面。routeBasePath 默认是 /docs。 

### 2.2 目录
:::tip
目录默认只包括 h2 和 h3 标题。
:::
如果你需要更改显示的标题范围，你可以自定义最小和最大的标题级别——既可以按页配置，也可以全局设置[目录标题级别](https://docusaurus.io/zh-CN/docs/markdown-features/toc#table-of-contents-heading-level)。
> "tableOfContents.minHeadingLevel" must be greater than or equal to 2

### 2.3 页面片段
在 docs 目录下所有带有下划线（_）前缀的文件都会被当作页面「片段」，并被默认忽略。

### 2.4 标签
使用`tags`为文档创建标签
```js
tags:
  - 演示
  - 开始上手

// 或者
tags: [演示, 开始上手]
```

### 2.5 侧边栏
- `sidebar_position`设置相对位置
- `sidebar_label`设置label
- `sidebar_class_name`设置className
- `sidebar_custom_props`设置customProps
- 可以用 `pagination_next` 和 `pagination_prev` 自定义分页导航

### 2.6 文档id
- 每个文档均有唯一的 id（标识符）。 默认情况下，文档 id 是文件相对文档根目录(docs)的路径（不包括后缀）。
- 可以在前言中指定 id 的最后一部分。注意：前面还是相对路径，比如：docs/guide/hello.md 指定id: part1，则其最终的 id 则为 guide/part1。

## 3. blog
- 博客日期可以写在标题里，或者使用前言，如：
```js
---
date: 2021-09-13T10:00
---

---
date: 2021-09-13T18:00
---
```

## 4. markdown
### 4.1 Markdown可以嵌入HTML标签
```md
### Details element example

<details>
  <summary>Toggle me!</summary>
  <div>
    <div>This is the detailed content</div>
    <br/>
    <details>
      <summary>
        Nested toggle! 内含惊喜……
      </summary>
      <div>
        😲😲😲😲😲
      </div>
    </details>
  </div>
</details>
```

### 4.2 MDX
- Docusaurus 原生支持 [MDX v1](https://mdxjs.com/)，可以直接在 Markdown 文档中编写 JSX，并渲染为 React 组件。

- 可以用[MDX 实时编辑器 ](https://mdx-git-renovate-babel-monorepo-mdx.vercel.app/playground/)检验你写的mdx是否正确。（MDX is not [100% compatible with CommonMark](https://github.com/facebook/docusaurus/issues/3018). ）

- 要在 MDX 文件中自定义组件，你必须导出它：只有以 export 开头的段落才会被解析为组件，而不是文本。
```jsx
export const Highlight = ({children, color}) => (
  <span
    style={{
      backgroundColor: color,
      borderRadius: '2px',
      color: '#fff',
      padding: '0.2rem',
    }}>
    {children}
  </span>
);

<Highlight color="#25c2a0">Docusaurus 绿</Highlight> 和 <Highlight color="#1877F2">Facebook 蓝</Highlight> 是我最喜欢的颜色。
// highlight-next-line
我可以把我的 _JSX_ 和 **Markdown** 写在一起！
```

- 可以使用import导入组件
:::caution
**import语句 与下面的内容 之间要空出一行**
:::

- 除了导入组件和导出组件，第三种在 MDX 中使用组件的方式是把它注册到全局作用域，这样它将自动在每个 MDX 文件中可用，无需任何导入声明。如：在`src/theme/MDXComponents`中声明好`underline`后可以在每个文件里自由使用 `<underline>` 了，不需要写导入语句。

## 5. 内置组件
### 5.1 Layout
- title 用于设置document.title 页面标题
- description 用于在设置meta `<meta name="description" content="description这个prop的值" data-rh="true">`

### 5.2 Tabs
```jsx
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="apple" label="苹果" default>
    这是个苹果 🍎
  </TabItem>
  <TabItem value="orange" label="橙子">
    这是个橙子 🍊
  </TabItem>
  <TabItem value="banana" label="香蕉">
    这是个香蕉 🍌
  </TabItem>
</Tabs>
```

### 5.3 CodeBlock
:::info
在非 Markdown 的文件里，你可以用 @theme/CodeBlock 组件，显示代码块
:::

### 5.4 TOCInline
每个 Markdown 文档会在右上角显示一个目录栏。 但也可以通过 TOCInline，直接在 Markdown 文档中显示一个内联目录。
```jsx
import TOCInline from '@theme/TOCInline';


<TOCInline
  // 只显示 h2 和 h4 标题
  toc={toc.filter((node) => node.level === 2 || node.level === 4)}
  minHeadingLevel={2}
  // 除了默认的 h2 和 h3 标题，也把 h4 标题包含进来
  maxHeadingLevel={4}
/>
```

## 6. 代码块
- 支持的语言有：
> -  markup: true,
> -  bash: true,
> -  clike: true,
> -  c: true,
> -  cpp: true,
> -  css: true,
> -  "css-extras": true,
> -  javascript: true,
> -  jsx: true,
> -  "js-extras": true,
> -  "js-templates": true,
> -  coffeescript: true,
> -  diff: true,
> -  git: true,
> -  go: true,
> -  graphql: true,
> -  "markup-templating": true,
> -  handlebars: true,
> -  json: true,
> -  less: true,
> -  makefile: true,
> -  markdown: true,
> -  objectivec: true,
> -  ocaml: true,
> -  python: true,
> -  reason: true,
> -  sass: true,
> -  scss: true,
> -  sql: true,
> -  stylus: true,
> -  tsx: true,
> -  typescript: true,
> -  wasm: true,
> -  yaml: true,

- 你可以用 highlight-next-line、highlight-start、highlight-end 等注释来选择要高亮的行。

- 可以使用`title`设置代码块的title

- 可以使用`showLineNumbers`开启行数显示

- **交互式代码编辑器**
> 由React Live驱动
> - `npm install --save @docusaurus/theme-live-codeblock`
> - 配置`docusaurus.config.js`
```js title="docusaurus.config.js"
module.exports = {
  // ...
  themes: ['@docusaurus/theme-live-codeblock'],
  // ...
};
```
> - 要使用此插件，只需要创建一个代码块，同时在语言元标签中加上 live
```jsx live
function Clock(props) {
  const [date, setDate] = useState(new Date());
  useEffect(() => {
    var timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  });
  function tick() {
    setDate(new Date());
  }
  return (
    <div>
      <h2>现在是 {date.toLocaleTimeString()}。</h2>
    </div>
  );
}
```

## 7. [Admonitions](https://github.com/elviswolcott/remark-admonitions) 告示
- `:::note   :::`
- `:::tip   :::`
- `:::info   :::`
- `:::caution   :::`
- `:::danger   :::`

## 8. 插件
:::tip
Docusaurus 可以从本地目录加载插件，可以通过本地写个插件的方式来使用TailwindCSS
:::

> [Using TailwindCSS v3 in Docusaurus in 5 steps](https://dev.to/sajclarke_62/using-tailwindcss-v3-in-docusaurus-in-5-steps-5c26)

- `npm install -D tailwindcss postcss autoprefixer`
- `npx tailwindcss init`
- 创建一个自定义插件
```js
plugins: [
  async function myPlugin(context, options) {
    return {
      name: "docusaurus-tailwindcss",
      configurePostCss(postcssOptions) {
        // Appends TailwindCSS and AutoPrefixer.
        postcssOptions.plugins.push(require("tailwindcss"));
        postcssOptions.plugins.push(require("autoprefixer"));
        return postcssOptions;
      },
    };
  },
],
```

- 修改`src/css/custom.css`
- 然后使用tailwind css，发现会影响docusaurus原有样式

> [如何在 Docusaurus 中引入 TailwindCSS](https://farer.org/2021/10/08/docusaurus-with-tailwindcss/)

- `npm install --save-dev postcss-nested`
- 修改`src/css/custom.css`，把tailwindcss的基础样式放在`.tailwind`中，使用 postcss-nested，这样可以把 tailwind 的样式限制在带有 tailwind class 的容器中，不会干扰 docusaurus 已有的样式
- 在所有需要用 tailwind 写样式的部分，就在最外层容器加一个 className="tailwind" 即可生效
- 可以不影响docusaurus原有样式使用tailwindcss了，但是控制台有warning： No serializer registered for Warning，这个warning咋解决？虽然不影响，但是有点强迫症😂