---
slug: docs
tags: [react]
---

:::tip
[React](https://react.dev/) is a library that lets you organize UI code by breaking it apart into pieces called components. React doesn’t take care of routing or data management.This means there are several ways to start a new React project:
- Start with a minimal toolchain, adding more features to your project as you go. (Great for learning!)
- Start with an opinionated framework that has common features like data fetching and routing built-in.
:::

:::info
[React JS Best Practices From The New Docs](https://sebastiancarlos.medium.com/react-js-best-practices-from-the-new-docs-1c65570e785d)
:::

## 创建React工程
### 1. minimal toolchain---[Create React App](https://create-react-app.dev/)
Popular alternatives:
- [Vite](https://vitejs.dev/guide/)
- [Parcel](https://parceljs.org/getting-started/webapp/)

:::info
Custom toolchains 
> You may prefer to create and configure your own toolchain. A toolchain typically consists of:

- A package manager lets you install, update, and manage third-party packages. Popular package managers: [npm](https://www.npmjs.com/) (built into Node.js), [Yarn](https://yarnpkg.com/), [pnpm](https://pnpm.io/).
- A compiler lets you compile modern language features and additional syntax like JSX or type annotations for the browsers. Popular compilers: [Babel](https://babeljs.io/), [TypeScript](https://www.typescriptlang.org/), [swc](https://swc.rs/).
- A bundler lets you write modular code and bundle it together into small packages to optimize load time. Popular bundlers: [webpack](https://webpack.js.org/), [Parcel](https://parceljs.org/), [esbuild](https://esbuild.github.io/), [swc](https://swc.rs/).
- A minifier makes your code more compact so that it loads faster. Popular minifiers: [Terser](https://terser.org/), [swc](https://swc.rs/).
- A server handles server requests so that you can render components to HTML. Popular servers: [Express](https://expressjs.com/).
- A linter checks your code for common mistakes. Popular linters: [ESLint](https://eslint.org/).
- A test runner lets you run tests against your code. Popular test runners: [Jest](https://jestjs.io/).

If you prefer to set up your own JavaScript toolchain from scratch, [check out this guide](https://medium.com/@JedaiSaboteur/creating-a-react-app-from-scratch-f3c693b84658) that re-creates some of the Create React App functionality. A framework will usually also provide a routing and a data fetching solution. In a larger project, you might also want to manage multiple packages in a single repository with a tool like [Nx](https://nx.dev/) or [Turborepo](https://turbo.build/).
:::

:::info
install the JSX preprocessor:
```bash
npm install babel-cli@6 babel-preset-react-app@3
```
对src文件夹中的jsx进行编译转换成js:
```bash
npx babel --watch src --out-dir . --presets react-app/prod
```
Linting & Formatting:
- [ESLint with the recommended configuration for React](https://www.npmjs.com/package/eslint-config-react-app)，包含的校验规则为：[eslint-plugin-react-hooks](https://www.npmjs.com/package/eslint-plugin-react-hooks)
- 如果你的 ESLint 预设有格式规则，它们可能与 [Prettier](https://prettier.io/) 冲突。我们建议使用 [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) 禁用 ESLint 预设中的所有格式规则，以便 ESLint 仅用于捕获逻辑错误。
```bash
prettier --check "src/**/*.js"
```
[html-to-jsx](https://transform.tools/html-to-jsx)
:::

### 2. full-featured framework---[Next.js](https://nextjs.org/)
> Next.js 是一个很好的起点。 Next.js 是一个流行的轻量级框架，用于使用 React 构建的静态和服务器渲染应用程序。它预装了路由、样式和服务器端渲染等功能，让您的项目快速启动和运行。

Popular alternatives:
- [Gatsby](https://www.gatsbyjs.com/)
- [Remix](https://remix.run/)
- [Razzle](https://razzlejs.org/)

## 定义事件处理函数的3种方式
:::tip
React 允许您向 JSX 添加事件处理程序。 事件处理程序是您自己的函数，将响应用户交互（例如单击、悬停、聚焦表单输入等）而触发。
:::

- 组件内部function handleXxx
```jsx
function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}

// 注意 onClick={handleClick} 最后没有括号！不要调用事件处理函数，你只需要传递它。当用户单击按钮时，React 将调用您的事件处理程序。
```

- JSX行内定义function handleXxx
```jsx
<button onClick={function handleClick() {
  alert('You clicked me!');
}}>
```

- JSX行内定义箭头函数
```jsx
<button onClick={() => {
  alert('You clicked me!');
}}>
```
```jsx
export default function App() {
  return (
    <Toolbar
      onPlayMovie={() => alert('Playing!')}
      onUploadImage={() => alert('Uploading!')}
    />
  );
}

function Toolbar({ onPlayMovie, onUploadImage }) {
  return (
    <div>
      <Button onClick={onPlayMovie}>
        Play Movie
      </Button>
      <Button onClick={onUploadImage}>
        Upload Image
      </Button>
    </div>
  );
}

function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

:::info
不要调用事件处理函数，只需要传递它。
![event handlers](img/event_handlers.jpeg)
handleClick() 末尾的 () 在渲染期间立即触发该函数，无需任何点击。这是因为 JSX 花括号中的 JavaScript 会立即执行。
:::

## 将事件处理程序作为 props 传递
父组件指定子组件的事件处理程序（[Everything you need to know about Design Systems](https://uxdesign.cc/everything-you-need-to-know-about-design-systems-54b109851969)）
```jsx
function Button({ onClick, children }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}

function PlayButton({ movieName }) {
  function handlePlayClick() {
    alert(`Playing ${movieName}!`);
  }

  return (
    <Button onClick={handlePlayClick}>
      Play "{movieName}"
    </Button>
  );
}

function UploadButton() {
  return (
    <Button onClick={() => alert('Uploading!')}>
      Upload Image
    </Button>
  );
}

export default function Toolbar() {
  return (
    <div>
      <PlayButton movieName="Kiki's Delivery Service" />
      <UploadButton />
    </div>
  );
}
```
[查看执行结果](https://code.juejin.cn/pen/7164647346758746148)

## 事件传播(事件冒泡)
事件处理程序还将捕获来自您的组件可能拥有的任何子级的事件。
```jsx live
// 如果单击任一按钮，其 onClick 将首先运行，然后是父 <div> 的 onClick。所以会出现两条消息。如果您单击工具栏本身，则只有父 <div> 的 onClick 会运行。
function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <button onClick={() => alert('Playing!')}>
        Play Movie
      </button>
      <button onClick={() => alert('Uploading!')}>
        Upload Image
      </button>
    </div>
  );
}
```
:::info
除了 onScroll ，所有事件都在 React 中传播。
:::

## 阻止事件冒泡
- 事件处理程序接收一个事件对象作为其唯一参数。按照惯例，它通常被称为 `e`，代表“事件”。您可以使用此对象来读取有关事件的信息。
- 该事件对象还允许您停止传播。如果你想阻止事件到达父组件，你需要像这个 Button 组件一样调用 `e.stopPropagation()`
```jsx
// Since the propagation was stopped, the parent <div>’s onClick handler does not run.
function Button({ onClick, children }) {
  return (
    <button onClick={e => {
      e.stopPropagation();
      onClick();
    }}>
      {children}
    </button>
  );
}

export default function Toolbar() {
  return (
    <div className="Toolbar" onClick={() => {
      alert('You clicked on the toolbar!');
    }}>
      <Button onClick={() => alert('Playing!')}>
        Play Movie
      </Button>
      <Button onClick={() => alert('Uploading!')}>
        Upload Image
      </Button>
    </div>
  );
}
```
[查看执行结果](https://code.juejin.cn/pen/7164656358560628751)

## 捕获事件
:::info
捕获事件---在极少数情况下，您可能需要捕获子元素上的所有事件，即使它们停止传播。例如，您可能希望将每次点击记录到分析中，而不管传播逻辑如何。您可以通过在事件名称末尾添加 `Capture` 来做到这一点。
```jsx
<div onClickCapture={() => { /* this runs first */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```
:::

## 防止默认行为
**一些浏览器事件具有与之关联的默认行为。例如，`<form>` 提交事件，默认情况下会重新加载整个页面。**
```jsx
function Signup() {
  return (
    <form onSubmit={() => alert('Submitting!')}>
      <input />
      <button>Send</button>
    </form>
  );
}
```
[查看效果](https://codesandbox.io/s/uo78y9?file=/App.js:15-157&utm_medium=sandpack)

可以使用 `e.preventDefault()` 来阻止默认行为
```jsx live
function Signup() {
  return (
    <form onSubmit={e => {
      e.preventDefault();
      alert('Submitting!');
    }}>
      <input />
      <button>Send</button>
    </form>
  );
}
```
:::info
- [e.stopPropagation()](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/stopPropagation) 用于阻止事件冒泡
- [e.preventDefault()](https://developer.mozilla.org/zh-CN/docs/Web/API/Event/preventDefault) 用于阻止少数事件的默认浏览器行为
:::

## 组件
:::tip
- 应遵循单一职责原则(single responsibility principle)，即一个组件在理想情况下应该只做一件事。如果它最终增长，它应该被分解成更小的子组件。
- 单向数据流(one-way data flow): 数据从顶层组件向下流向树底部的组件。
- 组件可以小到一个按钮，也可以大到整个页面。
- DRY（Don't repeat yourself）原则
:::

[Thinking in React](https://code.juejin.cn/pen/7161767735733534728)
- Warning: You provided a `value` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultValue`. Otherwise, set either `onChange` or `readOnly`.
```jsx
<input type="text" value={filterText} placeholder="Search..." />
```
- Warning: You provided a `checked` prop to a form field without an `onChange` handler. This will render a read-only field. If the field should be mutable use `defaultChecked`. Otherwise, set either `onChange` or `readOnly`.
```jsx
<input type="checkbox" checked={inStockOnly} />
```

- props可以传递 对象、数组、函数，甚至可以传递JSX

- React 组件是常规的 JavaScript 函数（但它们的名称必须以大写字母开头，否则它们将不起作用！），返回JSX markup。
```jsx
function profile() {
  return (
    <img
      src="https://i.imgur.com/QIrZWGIs.jpg"
      alt="Alan L. Hart"
    />
  );
}

export default function Gallery() {
  return (
    <section>
      <h1>Amazing scientists</h1>
      <profile />
      <profile />
      <profile />
    </section>
  );
}

// Warning: The tag <profile> is unrecognized in this browser. If you meant to render a React component, start its name with an uppercase letter.
```

- 一个文件只能有一个默认导出（one default export），但可以有任意多个命名导出（many named exports）。
> 默认导出的文件导入时可以使用任何的名字；不要定义没有名字的组件。

![default export & named export](img/default_export_&_named_export.jpeg)

- A component must return something. In some situations, you won’t want to render anything at all. In this case, you can return null.
```jsx
function Item({ name, isPacked }) {
  if (isPacked) {
    return null;
  }
  return <li className="item">{name}</li>;
}
```
:::tip
实际上，从组件返回 null 并不常见，更常见的是，有条件地包含或排除。
```jsx
// 使用三元运算符
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {isPacked ? name + ' ✔' : name}
    </li>
  );
}
// 使用逻辑与操作符，逻辑与操作符左边为false时整个表达式为false，React将 false 视为 JSX 树中的“漏洞”，就像 null 或 undefined 一样，并不会在其位置渲染任何内容。
function Item({ name, isPacked }) {
  return (
    <li className="item">
      {name} {isPacked && '✔'}
    </li>
  );
}
```
:::

### JSX
:::tip
JSX and React are two separate things. They’re often used together, but you can [use them independently](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) of each other. JSX is a syntax extension, while React is a JavaScript library.
:::

#### JSX的规则
- (1) Return a single root element.
> To return multiple elements from a component, wrap them with a single parent tag. For example, you can use a `<div>`, If you don’t want to add an extra `<div>` to your markup, you can write `<>`and `</>` instead. This empty tag is called a [Fragment](https://react.dev/reference/react/Fragment).Fragments let you group things without leaving any trace in the browser HTML tree.
```jsx
<>
  <h1>Hedy Lamarr's Todos</h1>
  <img 
    src="https://i.imgur.com/yXOvdOSs.jpg" 
    alt="Hedy Lamarr" 
    class="photo"
  >
  <ul>
    ...
  </ul>
</>
```
:::info
JSX 看起来像 HTML，但在底层它被转换为纯 JavaScript 对象。正如 无法从函数返回两个对象（如果不将它们包装到数组中），你也不能返回两个 JSX 标签而不将它们包装到另一个标签或Fragment中。
:::

- (2) Close all the tags
> JSX 要求标签显式关闭，比如`<img />` `<li>111</li>`

- (3) 属性小驼峰
> JSX被转成JS对象，其属性就是JS变量，JS对变量名有限制，例如，它们的名称不能包含破折号，不能是`class`等保留字，等等。
HTML `<ul style="background-color: black">`，JSX `<ul style={{ backgroundColor: 'black' }}>`

可以使用[转换器](https://transform.tools/html-to-jsx)转换，帮助写JSX，如：
```html
<!-- Hello world -->
<div class="awesome" style="border: 1px solid red">
  <label for="name">Enter your name: </label>
  <input type="text" id="name" />
</div>
<p>Enter your HTML here</p>
```
```jsx
<>
  {/* Hello world */}
  <div className="awesome" style={{ border: "1px solid red" }}>
    <label htmlFor="name">Enter your name: </label>
    <input type="text" id="name" />
  </div>
  <p>Enter your HTML here</p>
</>
```

#### JSX的花括号中可以写任何JS表达式
> 包括函数调用，比如`{formatDate(new Date())}`；对象，比如`style={{backgroundColor: 'black',color: 'pink'}}`；花括号中也可以写JSX：
```jsx
function Item({ name, importance }) {
  return (
    <li className="item">
      {name}
      {importance > 0 && ' '}
      {importance > 0 &&
        <i>(Importance: {importance})</i>
      }
    </li>
  );
}
export default function PackingList() {
  return (
    <section>
      <h1>Sally Ride's Packing List</h1>
      <ul>
        <Item 
          importance={9} 
          name="Space suit" 
        />
        <Item 
          importance={0} 
          name="Helmet with a golden leaf" 
        />
        <Item 
          importance={6} 
          name="Photo of Tam" 
        />
      </ul>
    </section>
  );
}
```

#### JSX 元素不是“实例”(instances)
JSX 元素不是“实例”(instances)，因为它们不保存任何内部状态，也不是真正的 DOM 节点。

#### React的JSX中表达式为`false`时不会渲染任何内容
React将 `false` 视为 JSX 树中的“漏洞”，就像 `null` 或 `undefined` 一样，并不会在其位置渲染任何内容。

#### JSX表达式中使用逻辑与操作符时，`&&`的左边不要放数字
JavaScript 自动将 `&&` 左侧转换为布尔值。如果左边是 0，那么整个表达式都会得到那个值 (0)，React 会渲染 0 而不是什么都没有。
```jsx
const list = [1,2];
const emptyList = [];
// 下面渲染出来的是hello
{
  list.length && <h1>hello</h1>
}
// 下面渲染出来的是数字0
{
  emptyList.length && <h1>666</h1>
}
```
[查看执行结果](https://code.juejin.cn/pen/7163629449186361352)

### Keeping components pure
#### 纯函数
:::info
纯函数：
- Minds its own business. It does not change any objects or variables that existed before it was called. 不会改变 被调用前存在的 任何对象或变量
- Same inputs, same output. Given the same inputs, a pure function should always return the same result. 相同的输入总是有相同的输出
```js
function double(number) {
  return 2 * number;
}

// double is a pure function. If you pass it 3, it will return 6. Always.
```
:::

- 纯函数不会改变函数范围之外的变量或调用之前创建的对象！

- 将组件编写为纯函数，可以避免随着代码的增加出现一些令人困惑的错误和不可预测的行为。

- 每个组件都应该只“为自己考虑”，而不是在渲染过程中试图与其他组件协调或依赖。每个组件都应该自己计算 JSX！渲染可以随时发生，因此组件不应依赖于彼此的渲染顺序。

- 当您想要更改某些内容以响应用户输入时，您应该设置状态（set state）而不是写入变量。在渲染组件时，您永远不应该更改预先存在的变量或对象。

#### Strict Mode
**注意：使用StrictMode和不使用StrictMode 渲染出的结果不一样，这是因为StrictMode时组件函数被调用了2次，而纯函数只计算，所以调用它们两次不会改变任何东西；不纯的函数则会产生不同的结果**
> [不纯的组件](https://code.juejin.cn/pen/7163198918887637004)

- React 提供了一种“严格模式”，它在开发过程中调用每个组件函数两次。通过调用组件函数两次，严格模式有助于找到违反这些规则的组件。
- 严格模式在生产中没有任何影响，因此它不会为您的用户减慢应用程序的速度。要选择严格模式，您可以将根组件包装到 `<React.StrictMode>` 中，一些框架默认执行此操作。

#### side effects
- These changes—--updating the screen, starting an animation, changing the data—---are called side effects. They’re things that happen “on the side”, not during rendering. 不在渲染期间

- In React, side effects usually belong inside event handlers. Event handlers are functions that React runs when you perform some action—for example, when you click a button. Even though event handlers are defined inside your component, they don’t run during rendering! So event handlers don’t need to be pure. 在 React 中，副作用通常属于事件处理程序。事件处理程序是 在您执行某些操作时 React 运行的函数——例如，当您单击按钮时。**即使在组件内部定义了事件处理程序，它们也不会在渲染期间运行！**所以事件处理程序不需要是纯粹的。

- If you’ve exhausted all other options and can’t find the right event handler for your side effect, you can still attach it to your returned JSX with a useEffect call in your component. This tells React to execute it later, after rendering, when side effects are allowed. However, this approach should be your last resort. When possible, try to express your logic with rendering alone. 如果您已经用尽了所有其他选项仍无法为您的副作用找到正确的事件处理程序，您仍然可以使用组件中的 `useEffect` 将其附加到返回的 JSX。这告诉 React 在渲染之后执行它(不在渲染期间允许执行副作用)。但是，这种方法应该是您最后的手段。如果可能，请尝试仅通过渲染来表达您的逻辑。

:::info
Why does React care about purity?
- Your components could run in a different environment—for example, on the server! Since they return the same result for the same inputs, one component can serve many user requests.
- You can improve performance by [skipping rendering](https://react.dev/reference/react/memo) components whose inputs have not changed. This is safe because pure functions always return the same results, so they are safe to cache.
- If some data changes in the middle of rendering a deep component tree, React can restart rendering without wasting time to finish the outdated render. Purity makes it safe to stop calculating at any time.
:::

（1）下面的示例中的副作用是 修改DOM。In this example, the side effect (modifying the DOM) was not necessary at all. You only needed to return JSX. 在此示例中，根本不需要副作用（修改 DOM）。你只需要返回 JSX
![side effects](img/side_effects.jpeg)

（2）下面的示例中，StoryTray函数 不纯。通过在接收到的 stories 数组（一个prop！）上调用 push，它正在改变一个在 StoryTray 开始渲染之前创建的对象。这使得它有缺陷并且很难预测。
![change prop](img/change_prop.jpeg)
```jsx
export default function StoryTray({ stories }) {
  // Copy the array!
  let storiesToDisplay = stories.slice();

  // Does not affect the original array:
  storiesToDisplay.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {storiesToDisplay.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}

// It is useful to remember which operations on arrays mutate them, and which don’t. For example, push, pop, reverse, and sort will mutate the original array, but slice, filter, and map will create a new one.
```
[查看执行结果](https://codesandbox.io/s/zhz5w9?file=/StoryTray.js&utm_medium=sandpack)
```jsx
export default function StoryTray({ stories }) {
  let list = JSON.parse(JSON.stringify(stories));
  list.push({
    id: 'create',
    label: 'Create Story'
  });

  return (
    <ul>
      {list.map(story => (
        <li key={story.id}>
          {story.label}
        </li>
      ))}
    </ul>
  );
}
```
[查看执行结果](https://codesandbox.io/s/d66eg9?file=/StoryTray.js:0-303&utm_medium=sandpack)

### 组件库
- [Chakra UI](https://chakra-ui.com/)
- [Material UI](https://mui.com/core/)

### Props
#### 可以通过它们传递任何 JavaScript 值，包括对象、数组和函数。

#### React component functions accept a single argument, a `props` object.
> 这里说的是React函数组件只接收一个入参，即props对象（但不应该还能接受ref这个入参吗？？）

#### 通常你不需要整个 props 对象本身，所以可以将它解构(destructuring)
> [解构](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter)
```jsx
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
// 通常你不需要整个 props 对象本身，所以可以将它解构
function Avatar({ person, size }) {}
```

#### 给prop指定默认值
> 以下面Avatar的prop为例，The default value is only used if the size prop is missing or if you pass `size={undefined}`. But **if you pass `size={null}` or `size={0}`, the default value will not be used**.
```jsx
function Avatar({ person, size = 100 }) {
  // ...
}
```

#### 使用JSX spread syntax传递props
> 适用于不直接使用任何props，仅仅是传递

```jsx
function Profile(props) {
  return (
    <div className="card">
      <Avatar {...props} />
    </div>
  );
}

// 上面等同于如下写法
function Profile({ person, size, isSepia, thickBorder }) {
  return (
    <div className="card">
      <Avatar
        person={person}
        size={size}
        isSepia={isSepia}
        thickBorder={thickBorder}
      />
    </div>
  );
}
```

:::info
JSX "spread" 语法，不仅仅可以用于props，比如：
```jsx
import { Pie } from '@ant-design/plots';

export default function PieDemo(props) {
  const pieConfig = {
    angleField: 'value',
    colorField: 'type',
    innerRadius: 0.7,
    label: null,
  };

  return <div>
    <div className='pie-container'>
      <Pie {...{...pieConfig,
        radius: 0.9,
      }} />
    </div>
  </div>
}
```
:::

#### props的children
> When you nest content inside a JSX tag, the parent component will receive that content in a prop called children.

```jsx
function Card({ children }) {
  return (
    <div className="card">
      {children}
    </div>
  );
}
function Avatar({ person, size }) {
  return (
    <img
      className="avatar"
      src={getImageUrl(person)}
      alt={person.name}
      width={size}
      height={size}
    />
  );
}
export default function Profile() {
  return (
    <Card>
      <Avatar
        size={100}
        person={{ 
          name: 'Katsuko Saruhashi',
          imageId: 'YfeOqp2'
        }}
      />
    </Card>
  );
}
function getImageUrl(person, size = 's') {
  return (
    'https://i.imgur.com/' +
    person.imageId +
    size +
    '.jpg'
  );
}
```

:::tip
props的children对应的内容可以有多个标签（不需要有一个外层的标签包裹），例如：
```jsx
function Card({ children }) {
  return <div className="card">
    <div className="card-content">
      { children }
    </div>
  </div>
}
export default function Profile() {
  return (
    <div>
      <Card>
        <h1>Photo</h1>
        <img
          className="avatar"
          src="https://i.imgur.com/OKS67lhm.jpg"
          alt="Aklilu Lemma"
          width={80}
          height={80}
        />
      </Card>
      <Card>
        <h1>About</h1>
        <p>Aklilu Lemma was a distinguished Ethiopian scientist who discovered a natural treatment to schistosomiasis.</p>
      </Card>
    </div>
  );
}
```
[查看执行结果](https://code.juejin.cn/pen/7163614463877185539)
:::

#### 子组件不要改变props
> 当一个组件需要改变它的 props 时，应该要求父组件传递另外不同的 props(一个新的object)，旧的 props 将被丢弃，最终 JavaScript 引擎将回收它们占用的内存。

:::tip
- Props are read-only snapshots in time: every render receives a new version of props.
- All React components must act like pure functions with respect to their props.
- 保证 React 单向数据流的设计模式，使状态可预测。如果允许子组件修改，那么一个父组件将状态传递给好几个子组件，这几个子组件随意修改，就完全不可预测，不知道在什么地方修改了状态。
:::

### Rendering Lists
#### 箭头函数的隐式返回(implicitly return)及[block body](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body)
```js
// concise body syntax, implied "return"
const func = (x) => x * x;

// with block body, explicit "return" needed
const func2 = (x, y) => {
  return x + y;
};
```
![箭头函数的返回](img/arrow_function_return.jpeg)

#### map中的JSX必须得有key
>- 如果使用 Fragment （`<>...</>`）,`<>`不允许传key，这时可以使用[`<Fragment>`](https://react.dev/reference/react/Fragment#rendering-a-list-of-fragments)
>- 不要即时生成key，例如`key={Math.random()}`，这将导致每次都重新创建所有组件和 DOM。这不仅速度慢，而且还会丢失列表项中的任何用户输入。

```jsx
import { Fragment } from 'react';

// ...

const listItems = people.map(person =>
  <Fragment key={person.id}>
    <h1>{person.name}</h1>
    <p>{person.bio}</p>
  </Fragment>
);

// 在DOM中<Fragment>本身将消失，最终渲染的是其包裹的内容
```

#### React组件不接收`key`作为prop
`key`仅被React本身在其整个生命周期内识别对应的数组的项。
>- set key on each component in a collection so React can keep track of each of them even if their position or data changes.
>- 如果您的组件需要 key 对应的值，则必须将其作为单独的 prop 传递。Warning: Child: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)
```jsx
function Child(props) {
  return <>
    key:: { props.key } -- { props.keyValue }
  </>
}
function Parent() {
  return <Child key={1} keyValue={1}></Child>
}
```
[查看执行结果](https://code.juejin.cn/pen/7163925086418763813)

### The lifecycle of components
每个React组件都经历相同的生命周期：
- 挂载(mount)：当组件被添加到屏幕上时。
- 更新(update)：当组件接收到新的props或state时(通常是作为对交互的响应)，它会更新。
- 卸载(unmount)：当组件从屏幕中移除时。

## Render and Commit
:::tip
1. Triggering a render
2. Rendering the component
3. Committing to the DOM
:::

### Triggering a render
:::info
组件渲染的原因有2个：
- 组件的初始渲染 initial render
- 组件(或其父组件)的state被更新 component’s (or one of its ancestors’) state has been updated
:::

1. initial render
> createRoot(); render();
```jsx
import Image from './Image.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Image />);
```

2. Re-renders when state updates
更新组件的状态会自动对渲染进行排队。Updating your component’s state automatically queues a render. 

### React renders your components
:::tip
“Rendering” means that React is calling your component, which is a function. 
:::
- 在初始渲染时，React 将调用根组件。
- 对于后续的渲染，React 将调用状态更新触发渲染的函数组件。
- 这个过程是递归的：如果更新的组件返回一些其他组件，React 将接下来渲染该组件，如果该组件也返回一些组件，它将接下来渲染该组件，依此类推。这个过程将一直持续到没有更多的嵌套组件并且 React 确切地知道应该在屏幕上显示什么。
```jsx
// index.js
import Gallery from './Gallery.js';
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root'))
root.render(<Gallery />);

/**
 * 在初始渲染期间，React 将为 <section>、<h1> 和三个 <img> 标签创建 DOM 节点（ Document.createElement() ）。
 * 在重新渲染期间，React 将计算它们的哪些属性（如果有）自上次渲染以来发生了变化。在下一步，即提交阶段之前，它不会对这些信息做任何事情。
 */

// Gallery.js
export default function Gallery() {
  return (
    <section>
      <h1>Inspiring Sculptures</h1>
      <Image />
      <Image />
      <Image />
    </section>
  );
}

function Image() {
  return (
    <img
      src="https://i.imgur.com/ZF6s192.jpg"
      alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
    />
  );
}
```

### React commits changes to the DOM
:::tip
React只在不同的渲染之间有差异时才会改变DOM节点。React only changes the DOM nodes if there’s a difference between renders. 比如这个例子：[时间变了input框的内容还在](https://codesandbox.io/s/7fc59g?file=/Clock.js&utm_medium=sandpack)
```jsx
function Clock({ time }) {
  return (
    <>
      <h1>{time}</h1>
      <input />
    </>
  );
}
// React仅仅使用新的time值更新<h1>的内容
// <input>出现在 JSX 中与上次相同的位置，因此 React 不会触及 <input> ！
// 如果渲染结果与上次相同，React 不会触及 DOM。React does not touch the DOM if the rendering result is the same as last time.
```
:::
- 在渲染（调用）你的组件后，React将修改DOM:
  - 对于初始渲染，React将使用[appendChild()](https://developer.mozilla.org/zh-CN/docs/Web/API/Node/appendChild)将上一步创建的所有DOM节点放在根节点下。
  - 对于重新渲染，React将应用最小的必要操作（在渲染时计算！）以使DOM符合最新的渲染输出。

- 渲染完成并且 React 更新 DOM(update the DOM tree) 后，浏览器将重新绘制屏幕repaint the screen。

## State
:::tip
- In React, data that changes over time is called state. 在 React 中，随时间变化的数据称为状态。
- Unlike regular JavaScript variables, React state behaves more like a snapshot. Setting it does not change the state variable you already have, but instead triggers a re-render. 与常规的 JavaScript 变量不同，React 状态的行为更像是快照。设置它不会更改您已经拥有的状态变量，而是会触发重新渲染。对常规变量的更改不会触发渲染。
- useState 返回的数组总是正好有两项，可以使用数组解构（[array destructuring](https://javascript.info/destructuring-assignment)）获取数组的项。
```js
let [a,b] = [1,2];
a // 1
b // 2
```
- **视图层的state呈现的是setState()中的运算结果（自己的理解,记录于2022.11.17--->查看"简单阐述useState是怎么工作的"）**
```jsx
const [count, setCount] = useState(0);

console.log(count);  // 0
setCount(count + 1); // Request a re-render with 1
console.log(count);  // Still 0!
```
```jsx live
function Gallery() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
    setCount(3);
    setCount(4);
  }

  return (
    <>
      <button onClick={handleClick}> Count+1 </button>
      <h3> {count} </h3>
    </>
  );
}
```
- Here’s how that happens in action:
  - 1. 您的组件第一次呈现。因为您将 0 传递给 useState 作为 count 的初始值，所以它将返回 [0, setCount]。 React 记住 0 是最新的状态值。
  - 2. 您更新状态。当用户单击按钮时，它会调用 setCount(count + 1)。 count 为 0，所以它是 setCount(1)。这告诉 React 现在记住 count 为 1 并触发另一个渲染。
  - 3. 您的组件的第二次渲染。 React 仍然可以看到 useState(0)，但是因为 React 记得你将 count 设置为 1，所以它会返回 [1, setCount]。
  - 4. 以此类推。

- State is isolated and private, if you render the same component twice, each copy will have completely isolated state! Changing one of them will not affect the other.
:::

### State as a Snapshot
:::tip
- state的行为更像是快照。设置它不会更改已有的state变量，而是会触发重新渲染。
- 组件函数返回的 JSX 就像 UI 的及时快照，它的props、事件处理程序(event handlers，即使是异步的)和局部变量(local variables)都是**使用渲染时的state（用户与之交互时的状态快照a snapshot of the state）计算的**。Its value was “fixed” when React “took the snapshot” of the UI by calling your component.
- When React re-renders a component:
  - React calls your function again. 再次调用组件函数
  - Your function returns a new JSX snapshot.
  - React then updates the screen to match the snapshot you’ve returned. React更新屏幕（update the DOM tree）以匹配返回的快照

:::
```jsx live
// 下面例子中，先点击Send再将下拉框切换为Bob，alert的名字是啥？
// alert运行时state可能已经改变，但是props、事件处理程序(event handlers，即使是异步的)和局部变量(local variables)都是使用渲染时的state（用户与之交互时的状态快照）计算的
function Form() {
  const [to, setTo] = useState('Alice');
  const [message, setMessage] = useState('Hello');

  function handleSubmit(e) {
    e.preventDefault();
    setTimeout(() => {
      alert(`You said ${message} to ${to}`);
    }, 5000);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        To:{' '}
        <select
          value={to}
          onChange={e => setTo(e.target.value)}>
          <option value="Alice">Alice</option>
          <option value="Bob">Bob</option>
        </select>
      </label>
      <textarea
        placeholder="Message"
        value={message}
        onChange={e => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
}
```

### Queueing a series of state updates
- 下面这个组件有问题：点击“+3”只会增加一次分数。
```jsx live
function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(score + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h3>Score: {score}</h3>
    </>
  )
}
```
:::info
- Calling `setScore` will only change it for the next render, but will not affect the event handler from the previous render.
- State as a Snapshot explains why this is happening. Setting state requests a new re-render, but does not change it in the already running code. So score continues to be 0 right after you call setScore(score + 1). 设置状态会请求新的重新渲染，但不会在已经运行的代码中更改它。
- Setting state only changes it for the next render. 设置state仅仅会在下一次渲染时更改该state。
- **props、事件处理程序(event handlers，即使是异步的)和局部变量(local variables)都是使用渲染时的state（用户与之交互时的状态快照a snapshot of the state）计算的**。
```jsx
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0

// 既然一直是0，为啥渲染出来的是1呢？(疑问记录于2022.11.10) ---> 查看上面的 “Here’s how that happens in action” 可以解惑 (解惑记录于2022.11.11)

/**
 * Here is what this button’s click handler tells React to do:
 * 1. setScore(score + 1): score is 0 so setScore(0 + 1). React prepares to change score to 1 on the next render.
 * 2. setScore(score + 1): score is 0 so setScore(0 + 1). React prepares to change score to 1 on the next render.
 * 3. setScore(score + 1): score is 0 so setScore(0 + 1). React prepares to change score to 1 on the next render.
 * Even though you called setScore(score + 1) three times, in this render’s event handler score is always 0, so you set the state to 1 three times. 
 */
```
:::

#### React batches state updates 批量状态更新
:::tip
- React waits until all code in the event handlers has run before processing your state updates. 在处理状态更新之前，React 会等到事件处理程序中的所有代码都已运行。这就是为什么重新渲染只发生在所有这些 setScore() 调用之后。
- batching(批处理)：在您的事件处理程序及其中的任何代码完成之前，UI 不会更新。这使您可以更新多个state变量(甚至来自多个组件)，而不会触发太多重新渲染，可以让你的 React 应用程序运行得更快。
- React does not batch across multiple intentional events like clicks—each click is handled separately. React 不会 跨事件 进行批处理，例如点击事件，每个点击事件都是单独处理的。例如，如果第一次单击按钮禁用了表单，则第二次单击不会再次提交它。
:::

#### Updating the same state variable multiple times before the next render
- 如果您想在下一次渲染之前多次更新同一个state变量，可以传递一个 基于队列中的前一个状态计算下一个状态 的函数，如 `setScore(s => s + 1)`。这是一种告诉 React “用状态值做某事”而不是仅仅替换它的方法。
```jsx live
function Counter() {
  const [score, setScore] = useState(0);

  function increment() {
    setScore(s => s + 1);
  }

  return (
    <>
      <button onClick={() => increment()}>+1</button>
      <button onClick={() => {
        increment();
        increment();
        increment();
      }}>+3</button>
      <h3>Score: {score}</h3>
    </>
  )
}
```
:::info
`s => s + 1` is called an updater function. When you pass it to a state setter:
1. React queues this function to be processed after all the other code in the event handler has run. 在事件处理程序中的所有其他代码运行之后，React 将此函数排队等待处理。
2. During the next render, React goes through the queue and gives you the final updated state. 在下一次渲染期间，React 遍历队列并为您提供最终的更新后的状态。
:::
![updater function works](img/updater_function.jpeg)

#### What happens if you update state after replacing it
```jsx live
function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h3>{number}</h3>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
      }}>Increase the number</button>
    </>
  )
}
```
![how it works](img/state_queue.jpeg)

#### What happens if you replace state after updating it
```jsx live
function Counter() {
  const [number, setNumber] = useState(0);

  return (
    <>
      <h3>{number}</h3>
      <button onClick={() => {
        setNumber(number + 5);
        setNumber(n => n + 1);
        setNumber(42);
      }}>Increase the number</button>
    </>
  )
}
```
![how it works](img/state_queue2.jpeg)

:::info
state setter:
- An updater function (e.g. n => n + 1) gets added to the queue.
- Any other value (e.g. number 5) adds “replace with 5” to the queue, **ignoring what’s already queued**.
- After the event handler completes, React will trigger a re-render. During the re-render, React will process the queue.
- Updater functions run during rendering, so **updater functions must be pure and only return the result**.
- 不要尝试在updater function内部设置状态或运行其他副作用。
- 在严格模式下，React 将运行每个updater function两次（但丢弃第二次结果）以帮助您发现错误。
- updater function参数的命名：使用相应state变量的首字母(如：number--->`setNumber(n => n + 1)`)；或者使用state变量名(如：number--->`setNumber(number => number + 1)`)；或者使用前缀(如：number--->`setNumber(prevNumber => prevNumber + 1)`)
- React processes state updates after event handlers have finished running. This is called batching.


[搞懂这个例子](https://codesandbox.io/s/still-leftpad-e0gtx6?file=/App.js)
:::

### 更改类型为对象或数组的state
:::tip
- treat state as read-only(immutable)
- When you store objects in state, mutating them will not trigger renders and will change the state in previous render “snapshots”. 当您将对象存储在状态中时，改变它们不会触发渲染，并且会更改先前渲染“快照”中的状态。
- Instead of mutating an object, create a new version of it, and trigger a re-render by setting state to it. 不应该直接修改类型为对象或数组的state，应该创建它的副本并更改副本。Usually, you will use the `...`([spread syntax](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax#spread_in_object_literals)) to copy objects and arrays that you want to change. 或者，新建一个object或array用于setState
- you should only mutate objects that you have just created.
```jsx
const [position, setPosition] = useState({
  x: 0,
  y: 0
});
onPointerMove={e => {
  setPosition({
    x: e.clientX,
    y: e.clientY
  });
  // 或者
  const nextPosition = {};
  nextPosition.x = e.clientX;
  nextPosition.y = e.clientY;
  setPosition(nextPosition);
}}
```
- Spread syntax is shallow: it only copies one level deep.
- 也不应该使用改变数组的方法，比如 push() 和 pop()。
- When dealing with arrays inside React state, you will need to avoid the methods in the left column, and instead prefer the methods in the right column:
![array state](img/array_state.jpeg)

- Unfortunately, slice and splice are named similarly but are very different. In React, you will be using slice (no p!) a lot more often because you don’t want to mutate objects or arrays in state.
  - slice lets you copy an array or a part of it.
  - splice mutates the array (to insert or delete items).
:::

1. object state的例子
```jsx live
function Form() {
  const [person, setPerson] = useState({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://images.pexels.com/photos/14208426/pexels-photo-14208426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    }
  });

  function handleNameChange(e) {
    setPerson({
      ...person,
      name: e.target.value
    });
  }

  function handleTitleChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        title: e.target.value
      }
    });
  }

  function handleCityChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        city: e.target.value
      }
    });
  }

  function handleImageChange(e) {
    setPerson({
      ...person,
      artwork: {
        ...person.artwork,
        image: e.target.value
      }
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```
```jsx live
// 合并事件，使用动态属性名[e.target.name]
function Form() {
  const [person, setPerson] = useState({
    firstName: 'Barbara',
    lastName: 'Hepworth',
    email: 'bhepworth@sculpture.com'
  });

  function handleChange(e) {
    setPerson({
      ...person,
      [e.target.name]: e.target.value // e.target.name 指的是赋予 <input> DOM 元素的 name 属性
    });
  }

  return (
    <>
      <label>
        First name:
        <input
          name="firstName"
          value={person.firstName}
          onChange={handleChange}
        />
      </label>
      <label>
        Last name:
        <input
          name="lastName"
          value={person.lastName}
          onChange={handleChange}
        />
      </label>
      <label>
        Email:
        <input
          name="email"
          value={person.email}
          onChange={handleChange}
        />
      </label>
      <p>
        {person.firstName}{' '}
        {person.lastName}{' '}
        ({person.email})
      </p>
    </>
  );
}
```

2. array state的例子
```jsx live
// copy array
function List() {
  let nextId = 3;
  const initialList = [
    { id: 0, title: 'Big Bellies' },
    { id: 1, title: 'Lunar Landscape' },
    { id: 2, title: 'Terracotta Army' },
  ];

  const [list, setList] = useState(initialList);

  function handleClick() {
    const nextList = [...list];
    nextList.reverse(); // 由于reverse()会改变原数组，所以不能直接使用list.reverse()
    setList(nextList);
  }

  return (
    <>
      <button onClick={handleClick}>
        Reverse
      </button>
      <ul>
        {list.map(artwork => (
          <li key={artwork.id}>{artwork.title}</li>
        ))}
      </ul>
    </>
  );
}
```
:::info
注意：
- even if you copy an array, you can’t mutate existing items inside of it directly. This is because copying is shallow—--the new array will contain the same items as the original one.
```jsx
const nextList = [...list];
nextList[0].title = '666'; // Problem: mutates list[0]
setList(nextList); 
```
- Although nextList and list are two different arrays, **`nextList[0]` and `list[0]` point to the same object**. So by changing `nextList[0].title`, you are also changing `list[0].title`. This is a state mutation, which you should avoid!
- Objects are not really located “inside” arrays. They might appear to be “inside” in code, but each object in an array is a separate value, to which the array “points”.
- When updating nested state, you need to create copies from the point where you want to update, and all the way up to the top level.
  - [错误的例子](https://codesandbox.io/s/46d808?file=/App.js:553-560&utm_medium=sandpack)
  - [正确的例子](https://codesandbox.io/s/8sk5hs?file=/App.js&utm_medium=sandpack)
```jsx
setMyList(myList.map(artwork => {
  if (artwork.id === artworkId) {
    // Create a *new* object with changes
    return { ...artwork, seen: nextSeen };
  } else {
    // No changes
    return artwork;
  }
});
```
[看这个例子的官方写法和自己的写法的区别](https://codesandbox.io/s/pensive-chihiro-0761e1?file=/App.js)

[数组的增删改](https://codesandbox.io/s/2mdzuq?file=/App.js&utm_medium=sandpack)

[数组的增删改(使用useImmer)](https://codesandbox.io/s/admiring-heyrovsky-2cii8l?file=/App.js)
:::

### 用 Immer 编写简洁的更新逻辑
:::tip
Immer 提供的 draft 是一种特殊类型的对象，称为 [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)，它会“记录”你用它做了什么。Immer 计算出 draft 的哪些部分被更改了，并生成一个全新对象，所以可以随意修改 draft。
:::
[不使用use-immer的数组state](https://codesandbox.io/s/egqo5y?file=/App.js&utm_medium=sandpack)

或者使用 [Immer](https://github.com/immerjs/use-immer)库 来减少重复代码：
```jsx
import { useImmer } from 'use-immer';

function Form() {
  const [person, updatePerson] = useImmer({
    name: 'Niki de Saint Phalle',
    artwork: {
      title: 'Blue Nana',
      city: 'Hamburg',
      image: 'https://images.pexels.com/photos/14208426/pexels-photo-14208426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    }
  });

  function handleNameChange(e) {
    updatePerson(draft => {
      draft.name = e.target.value;
    });
  }

  function handleTitleChange(e) {
    updatePerson(draft => {
      draft.artwork.title = e.target.value;
    });
  }

  function handleCityChange(e) {
    updatePerson(draft => {
      draft.artwork.city = e.target.value;
    });
  }

  function handleImageChange(e) {
    updatePerson(draft => {
      draft.artwork.image = e.target.value;
    });
  }

  return (
    <>
      <label>
        Name:
        <input
          value={person.name}
          onChange={handleNameChange}
        />
      </label>
      <label>
        Title:
        <input
          value={person.artwork.title}
          onChange={handleTitleChange}
        />
      </label>
      <label>
        City:
        <input
          value={person.artwork.city}
          onChange={handleCityChange}
        />
      </label>
      <label>
        Image:
        <input
          value={person.artwork.image}
          onChange={handleImageChange}
        />
      </label>
      <p>
        <i>{person.artwork.title}</i>
        {' by '}
        {person.name}
        <br />
        (located in {person.artwork.city})
      </p>
      <img
        src={person.artwork.image}
        alt={person.artwork.title}
      />
    </>
  );
}
```
[查看执行结果](https://replit.com/@fqishuai/use-immer#src/App.jsx)

[使用use-immer的数组state](https://codesandbox.io/s/mclx2n?file=/App.js&utm_medium=sandpack)

## Managing State
[以状态驱动的思维方式处理交互(approach interactions with a state-driven mindset)](https://codesandbox.io/s/xenodochial-golick-0645w2?file=/App.js)

### Reacting to Input with State
Remove non-essential state to avoid bugs and paradoxes. 删除非必要状态以避免错误和悖论。

如果在两种情况下都返回了相似的 JSX 树，那么最好将它们写成一个 JSX 片段；如果两个不同的 JSX 块描述同一棵树，则它们的嵌套必须对齐，否则切换不同的JSX将重新创建整棵树并重置其状态。
```jsx
import { useState } from 'react';

// 不同的情况下返回一个JSX
function Picture() {
  const [isActive, setIsActive] = useState(false);

  let backgroundClassName = 'background';
  let pictureClassName = 'picture';
  if (isActive) {
    pictureClassName += ' picture--active';
  } else {
    backgroundClassName += ' background--active';
  }

  return (
    <div
      className={backgroundClassName}
      onClick={() => setIsActive(false)}
    >
      <img
        onClick={e => {
          e.stopPropagation();
          setIsActive(true);
        }}
        className={pictureClassName}
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://i.imgur.com/5qwVYb1.jpeg"
      />
    </div>
  );
}

// 返回两个JSX，此时JSX的嵌套必须对齐(如下，第一个 `<div>` → 第一个 `<img>`都对齐)，否则，切换 isActive 将重新创建整棵树并重置其状态。
function Picture() {
  const [isActive, setIsActive] = useState(false);
  if (isActive) {
    return (
      <div
        className="background"
        onClick={() => setIsActive(false)}
      >
        <img
          className="picture picture--active"
          alt="Rainbow houses in Kampung Pelangi, Indonesia"
          src="https://images.pexels.com/photos/14932984/pexels-photo-14932984.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
          onClick={e => e.stopPropagation()}
        />
      </div>
    );
  }
  return (
    <div className="background background--active">
      <img
        className="picture"
        alt="Rainbow houses in Kampung Pelangi, Indonesia"
        src="https://images.pexels.com/photos/14932984/pexels-photo-14932984.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
        onClick={() => setIsActive(true)}
      />
    </div>
  );
}
```

```jsx live
function EditProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Jacobs');

  return (
    <form onSubmit={e => {
      e.preventDefault();
      setIsEditing(!isEditing);
    }}>
      <label>
        First name:{' '}
        {isEditing ? (
          <input
            value={firstName}
            onChange={e => {
              setFirstName(e.target.value)
            }}
          />
        ) : (
          <b>{firstName}</b>
        )}
      </label>
      <label>
        Last name:{' '}
        {isEditing ? (
          <input
            value={lastName}
            onChange={e => {
              setLastName(e.target.value)
            }}
          />
        ) : (
          <b>{lastName}</b>
        )}
      </label>
      <button type="submit">
        {isEditing ? 'Save' : 'Edit'} Profile
      </button>
      <p><i>Hello, {firstName} {lastName}!</i></p>
    </form>
  );
}
```

React avoids touching the DOM for properties that have not changed since the last time they were set. React 避免触及 属性自上次设置后未更改的 DOM。

### Choosing the state structure

#### Principles for structuring state
1. Group related state. 如果你总是同时更新两个或多个状态变量，请考虑将它们合并为一个状态变量。

```jsx
const [x, setX] = useState(0);
const [y, setY] = useState(0);

// 合并
const [position, setPosition] = useState({ x: 0, y: 0 });
```

注意：if you wanted to set x alone, you would either do `setPosition({ ...position, x: 100 })`, you can’t do `setPosition({ x: 100 })`.

```jsx live
function MovingDot() {
  const [position, setPosition] = useState({
    x: 0,
    y: 0
  });
  return (
    <div
      onPointerMove={e => {
        setPosition({
          x: e.clientX,
          y: e.clientY
        });
      }}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
      }}>
      <div style={{
        position: 'absolute',
        backgroundColor: 'red',
        borderRadius: '50%',
        transform: `translate(${position.x}px, ${position.y}px)`,
        left: -10,
        top: -10,
        width: 20,
        height: 20,
      }} />
    </div>
  )
}
```

2. Avoid contradictions in state. 避免定义的多个state变量使某个状态相互矛盾。

3. Avoid redundant state. 避免定义冗余的state变量。如果你可以在渲染期间从组件的 props 或其现有状态变量中计算出一些信息，则不应将该信息放入该组件的状态中。

```jsx live
function Form() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const fullName = firstName + ' ' + lastName; // When you call setFirstName or setLastName, you trigger a re-render, and then the next fullName will be calculated from the fresh data.

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <h2>Let’s check you in</h2>
      <label>
        First name:{' '}
        <input
          value={firstName}
          onChange={handleFirstNameChange}
        />
      </label>
      <label>
        Last name:{' '}
        <input
          value={lastName}
          onChange={handleLastNameChange}
        />
      </label>
      <p>
        Your ticket will be issued to: <b>{fullName}</b>
      </p>
    </>
  );
}
```

Here, a color state variable is initialized to the messageColor prop. **The problem is that if the parent component passes a different value of `messageColor` later (for example, 'red' instead of 'blue'), the `color` state variable would not be updated! The state is only initialized during the first render. When the prop changes, this does not affect the state variable!**
```jsx
function Message({ messageColor }) {
  const [color, setColor] = useState(messageColor);
}
```

Instead, use the messageColor prop directly in your code. If you want to give it a shorter name, use a constant. This way it won’t get out of sync with the prop passed from the parent component. 这样它就不会与从父组件传递的 prop 不同步。
```jsx
function Message({ messageColor }) {
  const color = messageColor;
}
```

4. Avoid duplication in state.

对比下面两个selectedItem的初始化，第一个是更改items后还需要手动更改selectedItem后`{selectedItem.title}`才是最新的；第二个是更改items后`{selectedItem.title}`就是最新的。
```jsx
import { useState } from 'react';

const initialItems = [
  { title: 'pretzels', id: 0 },
  { title: 'crispy seaweed', id: 1 },
  { title: 'granola bar', id: 2 },
];

export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedItem, setSelectedItem] = useState(
    items[0]
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>What's your travel snack?</h2> 
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedItem(item);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}

// Now if you edit the selected item, the message below will update immediately. 
// This is because setItems triggers a re-render, and items.find(...) would find the item with the updated title. 
// You didn’t need to hold the selected item in state, because only the selected ID is essential. The rest could be calculated during render.
export default function Menu() {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState(0);

  const selectedItem = items.find(item =>
    item.id === selectedId
  );

  function handleItemChange(id, e) {
    setItems(items.map(item => {
      if (item.id === id) {
        return {
          ...item,
          title: e.target.value,
        };
      } else {
        return item;
      }
    }));
  }

  return (
    <>
      <h2>What's your travel snack?</h2>
      <ul>
        {items.map((item, index) => (
          <li key={item.id}>
            <input
              value={item.title}
              onChange={e => {
                handleItemChange(item.id, e)
              }}
            />
            {' '}
            <button onClick={() => {
              setSelectedId(item.id);
            }}>Choose</button>
          </li>
        ))}
      </ul>
      <p>You picked {selectedItem.title}.</p>
    </>
  );
}
```

5. Avoid deeply nested state. 避免定义深度嵌套的state

If the state is too nested to update easily, consider making it “flat”(also known as “normalized”). 如果状态嵌套太多而不易更新，请考虑使其“扁平化”。

嵌套的数据结构（a tree-like structure）：
```js
export const initialTravelPlan = {
  id: 0,
  title: "(Root)",
  childPlaces: [
    {
      id: 1,
      title: "Earth",
      childPlaces: [
        {
          id: 2,
          title: "Africa",
          childPlaces: [
            {
              id: 3,
              title: "Botswana",
              childPlaces: []
            },
            {
              id: 4,
              title: "Egypt",
              childPlaces: []
            }
          ]
        }
      ]
    },
    {
      id: 43,
      title: "Moon",
      childPlaces: [
        {
          id: 44,
          title: "Rheita",
          childPlaces: []
        },
        {
          id: 45,
          title: "Piccolomini",
          childPlaces: []
        },
        {
          id: 46,
          title: "Tycho",
          childPlaces: []
        }
      ]
    },
    {
      id: 47,
      title: "Mars",
      childPlaces: [
        {
          id: 48,
          title: "Corn Town",
          childPlaces: []
        },
        {
          id: 49,
          title: "Green Hill",
          childPlaces: []
        }
      ]
    }
  ]
};
```

扁平的数据结构：
```js
export const initialTravelPlan = {
  0: {
    id: 0,
    title: "(Root)",
    childIds: [1, 43, 47]
  },
  1: {
    id: 1,
    title: "Earth",
    childIds: [2]
  },
  2: {
    id: 2,
    title: "Africa",
    childIds: [3, 4]
  },
  3: {
    id: 3,
    title: "Botswana",
    childIds: []
  },
  4: {
    id: 4,
    title: "Egypt",
    childIds: []
  },
  43: {
    id: 43,
    title: "Moon",
    childIds: [44, 45, 46]
  },
  44: {
    id: 44,
    title: "Rheita",
    childIds: []
  },
  45: {
    id: 45,
    title: "Piccolomini",
    childIds: []
  },
  46: {
    id: 46,
    title: "Tycho",
    childIds: []
  },
  47: {
    id: 47,
    title: "Mars",
    childIds: [48, 49]
  },
  48: {
    id: 48,
    title: "Corn Town",
    childIds: []
  },
  49: {
    id: 49,
    title: "Green Hill",
    childIds: []
  }
};
```

[使用useImmer删除扁平化后的嵌套数据](https://codesandbox.io/s/zim79i?file=/App.js&utm_medium=sandpack)

:::tip
一个优化点：使用 `Set.prototype.has()` 替代 `Array.prototype.includes()`，array search with `includes()` takes linear time, `Set` provides a fast `has()` operation.
- `new Set()`
- `has()`
- `add()`
- `delete()`

```jsx
import { useState } from 'react';
import { letters } from './data.js';
import Letter from './Letter.js';

// 使用Array
export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState([]);

  const selectedCount = selectedIds.length;

  function handleToggle(toggledId) {
    // Was it previously selected?
    if (selectedIds.includes(toggledId)) {
      // Then remove this ID from the array.
      setSelectedIds(selectedIds.filter(id =>
        id !== toggledId
      ));
    } else {
      // Otherwise, add this ID to the array.
      setSelectedIds([
        ...selectedIds,
        toggledId
      ]);
    }
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.includes(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            You selected {selectedCount} letters
          </b>
        </p>
      </ul>
    </>
  );
}

// 使用Set
export default function MailClient() {
  const [selectedIds, setSelectedIds] = useState(
    new Set()
  );

  const selectedCount = selectedIds.size;

  function handleToggle(toggledId) {
    // Create a copy (to avoid mutation).
    const nextIds = new Set(selectedIds);
    if (nextIds.has(toggledId)) {
      nextIds.delete(toggledId);
    } else {
      nextIds.add(toggledId);
    }
    setSelectedIds(nextIds);
  }

  return (
    <>
      <h2>Inbox</h2>
      <ul>
        {letters.map(letter => (
          <Letter
            key={letter.id}
            letter={letter}
            isSelected={
              selectedIds.has(letter.id)
            }
            onToggle={handleToggle}
          />
        ))}
        <hr />
        <p>
          <b>
            You selected {selectedCount} letters
          </b>
        </p>
      </ul>
    </>
  );
}
```
:::

### Sharing state between components
:::tip
Sometimes, you want the state of two components to always change together. To do it, remove state from both of them, move it to their closest common parent, and then pass it down to them via props. This is known as “lifting state up”, and it’s one of the most common things you will do writing React code.
:::

### Preserving and resetting state 保留/重置状态
:::tip
- When you re-render a component, React needs to decide which parts of the tree to keep (and update), and which parts to discard or re-create from scratch. In most cases, React’s automatic behavior works well enough. By default, React preserves the parts of the tree that “match up” with the previously rendered component tree. 当你重新渲染一个组件时，React 需要决定树的哪些部分要保留（和更新），哪些部分要丢弃或从头开始重新创建。在大多数情况下，React 的自动行为工作得很好。默认情况下，React 保留树中与先前渲染的组件树“匹配”的部分。
- React 允许您覆盖默认行为，通过向组件传递不同的 `key` 来强制组件重置其状态，即从头开始重新创建该组件。
:::

### Extracting state logic into a reducer
- useReducer 是useState的替代方案，当有多个event handlers更新一个state时，使用useReducer更合适
```jsx
// 使用useState
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(initialCount)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
    </>
  );
}

// 使用useReducer
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

- 使用 useReducer 还能给那些会触发深更新的组件做性能优化，因为你可以向子组件传递 dispatch 而不是回调函数，比如[这个例子](https://codesandbox.io/s/39bmj9?file=/App.js&utm_medium=sandpack)

- To model the state more precisely, you can extract it into a reducer. Reducers let you unify multiple state variables into a single object and consolidate all the related logic! 为了更精确地对状态建模，您可以将其提取到reducer中。 Reducers 让您可以将多个状态变量统一到一个对象中，并整合所有相关逻辑！

### Passing data deeply with context
- createContext
- useContext

[查看示例](https://codesandbox.io/s/sbhymf?file=/Section.js&utm_medium=sandpack)

### 使用 reducer 和 context 进行扩展
[reducer和context结合使用](https://codesandbox.io/s/rxg0dv?file=/TasksContext.js&utm_medium=sandpack)

## 使用 Refs 引用值

## 使用 Refs 操作 DOM
### 使用`flushSync`可以同步更新state
```jsx
setTodos([ ...todos, newTodo]);
listRef.current.lastChild.scrollIntoView();
```
由于在React中，设置state仅仅会在下一次渲染时更改该state，So the time you scroll the list to its last element, the todo has not yet been added. To fix this issue, you can force React to update (“flush”) the DOM synchronously.
```jsx
import { flushSync } from 'react-dom';

function handleAdd() {
  const newTodo = { id: nextId++, text: text };
  flushSync(() => {
    setText('');
    setTodos([ ...todos, newTodo]);      
  });
  listRef.current.lastChild.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest'
  });
}
```

## 使用 Effects 将组件与 React 之外的某些系统同步
:::tip
Effects 通常用于“跳出”React 代码并与某些外部系统同步，这包括浏览器 API、第三方小部件、网络等。**如果不涉及外部系统（例如，如果您想在某些 props 或 state 更改时更新组件的state），则不需要 Effect。**
:::

### 如何使用Effect
- 没有任何依赖的Effect：每次组件渲染时，React都会更新屏幕，然后运行useEffect内的代码。换句话说，useEffect会“延迟”一段代码的运行，直到该渲染在屏幕上反映出来。
  ```jsx
  useEffect(() => {
    // Code here will run after *every* render
  });
  ```
  ```jsx
  import { useState, useRef, useEffect } from 'react';

  function VideoPlayer({ src, isPlaying }) {
    const ref = useRef(null);

    /*
    // 以下代码不放到useEffect中会报错，因为当第一次调用VideoPlayer时，它的DOM尚不存在！没有DOM节点可以调用play()或pause()，因为React在返回JSX之前不知道要创建什么DOM。
    if (isPlaying) {
      ref.current.play();  // Calling these while rendering isn't allowed.
    } else {
      ref.current.pause(); // Also, this crashes.
    }
    */
    // React先更新屏幕，确保<video>标签在DOM中具有正确的props，然后运行useEffect内的代码
    useEffect(() => {
      if (isPlaying) {
        ref.current.play();
      } else {
        ref.current.pause();
      }
    });

    return <video ref={ref} src={src} loop playsInline />;
  }

  export default function App() {
    const [isPlaying, setIsPlaying] = useState(false);
    return (
      <>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <VideoPlayer
          isPlaying={isPlaying}
          src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
        />
      </>
    );
  }
  ```
  ```jsx
  // 如下代码会产生无限循环
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(count + 1);
  });
  ```

- 有依赖的Effect：可以通过指定依赖项数组作为 `useEffect()` 的第二个参数来告诉 React 跳过不必要的 Effect运行。依赖数组可以包含多个依赖项。React使用 `Object.is()` 来比较依赖值。如果所有的依赖项都相同，则React会忽略本次渲染中的Effect。
  ```jsx
  // 将 [isPlaying] 指定为依赖项数组告诉 React，如果 isPlaying 与上一次渲染时相同，它应该跳过重新运行您的 Effect。
  useEffect(() => {
    if (isPlaying) { // It's used here...
      // ...
    } else {
      // ...
    }
  }, [isPlaying]); // ...so it must be declared here!
  ```
  :::tip
  Effect有没有依赖项的区别：
  ```jsx
  useEffect(() => {
    // This runs after every render
  });

  useEffect(() => {
    // This runs only on mount (when the component appears) 这告诉React仅在组件“挂载”时(开发环境中，React在每个组件初始挂载后立即重新挂载一次)运行此代码，即首次出现在屏幕上时。
  }, []);

  useEffect(() => {
    // This runs on mount *and also* if either a or b have changed since the last render
  }, [a, b]);
  ```
  :::

- 需要时可以在`useEffect`中增加cleanup function。**React在每次Effect再次运行之前都会调用您的清理函数，并在组件卸载（被移除）时最后一次调用。** [Effect cleanup 示例](https://code.juejin.cn/pen/7294184776930426906)（示例中把`clearTimeout(timeoutId);`注掉看看啥效果）
  ```jsx
  useEffect(() => {
    const connection = createConnection();
    connection.connect();
    return () => {
      connection.disconnect();
    };
  }, []);
  ```
  ```jsx
  useEffect(() => {
    function handleScroll(e) {
      console.log(window.scrollX, window.scrollY);
    }
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  ```
  ```jsx
  // 如果你的 Effect 请求了一些数据，清理函数应该要么中止这个请求，要么忽略它的结果。
  useEffect(() => {
    let ignore = false;

    async function startFetching() {
      const json = await fetchTodos(userId);
      if (!ignore) {
        setTodos(json);
      }
    }

    startFetching();

    return () => {
      ignore = true;
    };
  }, [userId]); // 如果userId从'Alice'更改为'Bob'，清理函数确保即使'Alice'的响应在'Bob'的响应之后到达，也会忽略'Alice'的响应。
  ```

### 发请求获取数据的方案
1. 在Effect中发请求获取数据，可行，但有以下缺点：
   - 不适用于SSR场景。Effects不在服务器上运行，这意味着初始服务器呈现的HTML是不带数据，客户端计算机将不得不下载所有JavaScript并渲染您的应用程序，然后发现需要加载数据。这不是非常有效的。
   - 在Effects中直接获取数据容易造成“网络瀑布”(“network waterfalls”)。您渲染父组件，它获取一些数据，然后渲染子组件，然后它们开始获取它们的数据。如果网络不是很快，这比并行获取所有数据要慢得多。
    > [网络瀑布是网络事件在时间轴上发生顺序的二维可视化表示](https://nischithbm.medium.com/web-performance-optimizing-the-network-waterfall-8a65df932df6)
   - 直接在Effects中获取数据通常意味着您不会预加载或缓存数据。例如，如果组件卸载然后重新挂载，它将需要再次获取数据。

2. 使用框架如`Next.js`等，集成了高效的数据获取机制，不会遇到上述问题。
3. 使用 [React Query](https://tanstack.com/query/latest/docs/react/overview) 或 React Router(loader) 等
   ```jsx
   // React Router(loader)
   createBrowserRouter([
     {
       path: "/",
       element: <Root />,
       children: [
         {
           path: "contact",
           element: <Contact />,
         },
         {
           path: "dashboard",
           element: <Dashboard />,
           loader: ({ request }) =>
             fetch("/api/dashboard.json", {
               signal: request.signal,
             }),
         },
         {
           element: <AuthLayout />,
           children: [
             {
               path: "login",
               element: <Login />,
               loader: redirectIfUser,
             },
             {
               path: "logout",
               action: logoutUser,
             },
           ],
         },
       ],
     },
   ]);
   ```
4. 构建自己的解决方案，在这种情况下，你会使用Effects作为基础，然后添加逻辑来**去重请求、缓存响应并避免网络瀑布效应（通过预加载数据或提升数据要求到路由）**。

### 每个渲染都有自己的Effect
每个渲染的Effect都是相互隔离的。（闭包）

## 你可能不需要 Effect
:::info
有两种常见情况不需要 Effects：
- 您不需要 Effects 来转换数据以进行渲染(例如您想在显示列表之前对其进行过滤)。当你更新state时，React 将首先调用你的组件函数来计算屏幕上应该显示的内容，然后 React 会将这些更改“提交”(commit)到 DOM，从而更新屏幕，然后 React 将运行你的 Effects。如果您的 Effect 也立即更新state，这将从头开始重新启动整个过程！为了避免不必要的渲染过程，请在组件的顶层转换所有数据。每当您的 props 或 state 发生变化时，该代码都会自动重新运行。
  ```jsx
  // 不推荐。效率很低：使用旧的 fullName 值执行整个渲染过程，然后立即使用更新的值重新渲染。
  function Form() {
    const [firstName, setFirstName] = useState('Taylor');
    const [lastName, setLastName] = useState('Swift');

    // 🔴 Avoid: redundant state and unnecessary Effect
    const [fullName, setFullName] = useState('');
    useEffect(() => {
      setFullName(firstName + ' ' + lastName);
    }, [firstName, lastName]);
    // ...
  }
  ```
  ```jsx
  // 推荐
  function Form() {
    const [firstName, setFirstName] = useState('Taylor');
    const [lastName, setLastName] = useState('Swift');
    // ✅ Good: calculated during rendering
    const fullName = firstName + ' ' + lastName;
    // ...
  }
  ```

- 您不需要 Effects 来处理用户事件。通常会在相应的事件处理程序中处理用户事件。
:::
1. 可以使用`useMemo`避免重复计算
  ```jsx
  // 不推荐
  function TodoList({ todos, filter }) {
    const [newTodo, setNewTodo] = useState('');

    // 🔴 Avoid: redundant state and unnecessary Effect
    const [visibleTodos, setVisibleTodos] = useState([]);
    useEffect(() => {
      setVisibleTodos(getFilteredTodos(todos, filter));
    }, [todos, filter]);

    // ...
  }
  ```
  ```jsx
  // 推荐
  function TodoList({ todos, filter }) {
    const [newTodo, setNewTodo] = useState('');
    // ✅ This is fine if getFilteredTodos() is not slow.
    const visibleTodos = getFilteredTodos(todos, filter);
    // ...
  }
  ```
  ```jsx
  // 如果一些不相关的状态变量（如 newTodo）发生了变化，您不想重新计算 getFilteredTodos()（比如getFilteredTodos运算比较慢不想重复计算），可以使用 useMemo
  import { useMemo, useState } from 'react';

  function TodoList({ todos, filter }) {
    const [newTodo, setNewTodo] = useState('');
    const visibleTodos = useMemo(() => {
      // ✅ Does not re-run unless todos or filter change
      return getFilteredTodos(todos, filter);
    }, [todos, filter]);
    // ...
  }
  ```
  ```js
  // 打印耗时 可以使用 console.time console.timeEnd
  console.time('filter array');
  const visibleTodos = getFilteredTodos(todos, filter);
  console.timeEnd('filter array');
  ```

2. 当prop改变需要重置state时，不建议使用 Effect，建议使用 `key`。通常，当同一组件在同一位置渲染时，React 会保留状态。通过将 userId 作为 Profile 组件的 `key` 传递，您要求 React 将具有不同 userId 的两个 Profile 组件视为两个不应该共享任何 state 的不同组件。每当 `key`（您设置为 userId）更改时，React 将重新创建 DOM 并重置 Profile 组件及其所有子组件的 state。
  ```jsx
  // 不推荐
  function ProfilePage({ userId }) {
    const [comment, setComment] = useState('');

    // 🔴 Avoid: Resetting state on prop change in an Effect
    useEffect(() => {
      setComment('');
    }, [userId]);
    // ...
  }
  ```
  ```jsx
  // 推荐
  function ProfilePage({ userId }) {
    return (
      <Profile
        userId={userId}
        key={userId}
      />
    );
  }

  function Profile({ userId }) {
    // ✅ This and any other state below will reset on key change automatically
    const [comment, setComment] = useState('');
    // ...
  }
  ```

3. 当prop改变需要更新部分state时，不建议使用 Effect，建议在渲染时更新state（Storing information from previous renders）
  ```jsx
  // 不推荐
  function List({ items }) {
    const [isReverse, setIsReverse] = useState(false);
    const [selection, setSelection] = useState(null);

    // 🔴 Avoid: Adjusting state on prop change in an Effect
    useEffect(() => {
      setSelection(null);
    }, [items]);
    // ...
  }
  ```
  ```jsx
  // 一般
  function List({ items }) {
    const [isReverse, setIsReverse] = useState(false);
    const [selection, setSelection] = useState(null);

    // Better: Adjust the state while rendering
    const [prevItems, setPrevItems] = useState(items);
    if (items !== prevItems) {
      setPrevItems(items);
      setSelection(null);
    }
    // ...
  }
  ```
  ```jsx
  // 推荐
  function List({ items }) {
    const [isReverse, setIsReverse] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    // ✅ Best: Calculate everything during rendering
    const selection = items.find(item => item.id === selectedId) ?? null;
    // ...
  }
  ```
  :::tip
  当您在渲染期间更新组件时，React 会丢弃返回的 JSX 并立即重试渲染(When you update a component during rendering, React throws away the returned JSX and immediately retries rendering.)。为了避免非常慢的级联重试(very slow cascading retries)，React 只允许您在渲染期间更新同一组件的 state。如果您在渲染期间更新另一个组件的 state，会报错。
  :::

4. 事件处理程序中的共享逻辑不要放到 Effect 中。当您不确定某些代码是否应该在 Effect 中还是在事件处理程序中时，问问自己为什么需要运行该代码。因页面被显示而运行的代码才考虑使用 Effect。如下示例中，`showNotification` 应该是用户点击按钮时调用，而不是页面被显示时调用。
  ```jsx
  // 不推荐
  function ProductPage({ product, addToCart }) {
    // 🔴 Avoid: Event-specific logic inside an Effect
    useEffect(() => {
      if (product.isInCart) {
        showNotification(`Added ${product.name} to the shopping cart!`);
      }
    }, [product]);

    function handleBuyClick() {
      addToCart(product);
    }

    function handleCheckoutClick() {
      addToCart(product);
      navigateTo('/checkout');
    }
    // ...
  }
  ```
  ```jsx
  function ProductPage({ product, addToCart }) {
    // ✅ Good: Event-specific logic is called from event handlers
    function buyProduct() {
      addToCart(product);
      showNotification(`Added ${product.name} to the shopping cart!`);
    }

    function handleBuyClick() {
      buyProduct();
    }

    function handleCheckoutClick() {
      buyProduct();
      navigateTo('/checkout');
    }
    // ...
  }
  ```

5. 如果某些逻辑必须在每次应用程序加载时运行一次，而不是每次组件挂载(mount)时运行一次，请添加一个顶级变量来跟踪它是否已执行
  ```jsx
  // 不推荐
  function App() {
    // 🔴 Avoid: Effects with logic that should only ever run once
    useEffect(() => {
      loadDataFromLocalStorage();
      checkAuthToken();
    }, []);
    // ...
  }
  ```
  ```jsx
  // 推荐
  let didInit = false;

  function App() {
    useEffect(() => {
      if (!didInit) {
        didInit = true;
        // ✅ Only runs once per app load
        loadDataFromLocalStorage();
        checkAuthToken();
      }
    }, []);
    // ...
  }
  ```

6. race condition(两个不同的请求相互“竞争”，并且以与您预期不同的顺序呈现。). 如下示例，假如快速输入"hello"，变量 `query` will change from "h", to "he", "hel", "hell", and "hello"，每次改变都会发起请求，“hell”的响应可能在“hello”的响应之后到达，这种情况下调用 `setResults` 导致 `results` 的值是错误的。
  ```jsx
  function SearchResults({ query }) {
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);

    useEffect(() => {
      // 🔴 Avoid: Fetching without cleanup logic
      fetchResults(query, page).then(json => {
        setResults(json);
      });
    }, [query, page]);

    function handleNextPageClick() {
      setPage(page + 1);
    }
    // ...
  }
  ```
  ```jsx
  // 推荐。添加一个清理函数来忽略过时的响应，这确保了当您的 Effect 获取数据时，除了最后请求的响应之外的所有响应都将被忽略。
  function SearchResults({ query }) {
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    useEffect(() => {
      let ignore = false;
      fetchResults(query, page).then(json => {
        if (!ignore) {
          setResults(json);
        }
      });
      return () => {
        ignore = true;
      };
    }, [query, page]);

    function handleNextPageClick() {
      setPage(page + 1);
    }
    // ...
  }
  ```
  ```jsx
  // 抽取 获取数据 作为一个自定义hook
  function useData(url) {
    const [data, setData] = useState(null);
    useEffect(() => {
      let ignore = false;
      fetch(url)
        .then(response => response.json())
        .then(json => {
          if (!ignore) {
            setData(json);
          }
        });
      return () => {
        ignore = true;
      };
    }, [url]);
    return data;
  }
  ```

## Effect的生命周期

## Optimizing Performance
> [Performance](https://reactjs.org/docs/optimizing-performance.html#gatsby-focus-wrapper)
### Use the Production Build 使用生产版本
### Profiling Components with the DevTools Profiler 使用 DevTools Profiler 分析组件
### Virtualize Long Lists 虚拟化长列表
### Avoid Reconciliation 避免调合
### shouldComponentUpdate In Action

## 旧版 React API
不建议在新编写的代码中使用。

### `Children`

### `cloneElement`
- `cloneElement` 允许您使用另一个元素作为起点创建一个新的 React 元素。`const clonedElement = cloneElement(element, props, ...children)`
  ```jsx
  import { cloneElement } from 'react';

  // ...
  const clonedElement = cloneElement(
    <Row title="Cabbage">
      Hello
    </Row>,
    { isHighlighted: true },
    'Goodbye'
  );

  console.log(clonedElement); // <Row title="Cabbage" isHighlighted={true}>Goodbye</Row>
  ```

- `cloneElement` 返回一个带有以下属性的 React 元素对象：
  - `type` 与 `element.type` 相同。
  - `props` 将 `element.props` 与您传递的`props` 浅合并的结果。
  - `ref` 原始 `element.ref`，除非它被 `props.ref` 覆盖。
  - `key` 原始的`element.key`，除非它被`props.key`覆盖。

#### 替代方案
使用`cloneElement`的例子：
```jsx
import { Children, cloneElement, useState } from 'react';

export default function List({ children }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="List">
      {Children.map(children, (child, index) =>
        cloneElement(child, {
          isHighlighted: index === selectedIndex 
        })
      )}
      <hr />
      <button onClick={() => {
        setSelectedIndex(i =>
          (i + 1) % Children.count(children)
        );
      }}>
        Next
      </button>
    </div>
  );
}
```

1. 使用 render prop 传递数据
   ```jsx
   import { useState } from 'react';

   export default function List({ items, renderItem }) {
     const [selectedIndex, setSelectedIndex] = useState(0);
     return (
       <div className="List">
         {items.map((item, index) => {
           const isHighlighted = index === selectedIndex;
           return renderItem(item, isHighlighted);
         })}
         <hr />
         <button onClick={() => {
           setSelectedIndex(i =>
             (i + 1) % items.length
           );
         }}>
           Next
         </button>
       </div>
     );
   }
   ```
   ```jsx
   export default function App() {
     return (
       <List
         items={products}
         renderItem={(product, isHighlighted) =>
           <Row
             key={product.id}
             title={product.title}
             isHighlighted={isHighlighted}
           />
         }
       />
     );
   }
   ```

2. 使用 context 传递数据

3. 将逻辑提取到自定义 Hook 中

将“非视觉”逻辑提取到您自己的 Hook 中，并使用 Hook 返回的信息来决定渲染什么。

### `Component`
### `createElement`
### `createRef`
### `isValidElement`
### `PureComponent`
