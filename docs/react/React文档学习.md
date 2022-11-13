---
slug: usage
tags: [react]
---

:::tip
[React]((https://beta.reactjs.org/)) is a library that lets you organize UI code by breaking it apart into pieces called components. React doesn’t take care of routing or data management.This means there are several ways to start a new React project:
- Start with a minimal toolchain, adding more features to your project as you go. (Great for learning!)
- Start with an opinionated framework that has common features like data fetching and routing built-in.
:::

## 一、创建React工程
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

## 二、知识点
### 1. 事件处理
:::tip
React lets you add event handlers to your JSX. Event handlers are your own functions that will be triggered in response to user interactions like clicking, hovering, focusing on form inputs, and so on.
:::

#### 1.1 定义事件处理函数的3种方式
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

#### 1.2 Passing event handlers as props
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

#### 1.3 Event propagation 事件传播(事件冒泡)
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

#### 1.4 Stopping propagation 阻止事件冒泡
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

#### 1.5 Capture events 捕获事件
:::info
捕获事件---在极少数情况下，您可能需要捕获子元素上的所有事件，即使它们停止传播。例如，您可能希望将每次点击记录到分析中，而不管传播逻辑如何。您可以通过在事件名称末尾添加 `Capture` 来做到这一点。
```jsx
<div onClickCapture={() => { /* this runs first */ }}>
  <button onClick={e => e.stopPropagation()} />
  <button onClick={e => e.stopPropagation()} />
</div>
```
:::

#### 1.6 Preventing default behavior 防止默认行为
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

### 2. 组件
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

#### 2.1 JSX
:::tip
JSX and React are two separate things. They’re often used together, but you can [use them independently](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html#whats-a-jsx-transform) of each other. JSX is a syntax extension, while React is a JavaScript library.
:::

##### 1. JSX的规则：
- (1) Return a single root element.
> To return multiple elements from a component, wrap them with a single parent tag. For example, you can use a `<div>`, If you don’t want to add an extra `<div>` to your markup, you can write `<>`and `</>` instead. This empty tag is called a [Fragment](https://beta.reactjs.org/apis/react/Fragment).Fragments let you group things without leaving any trace in the browser HTML tree.
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

##### 2. JSX的花括号中可以写任何JS表达式
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

##### 3. JSX 元素不是“实例”(instances)，因为它们不保存任何内部状态，也不是真正的 DOM 节点。

##### 4. React的JSX中表达式为false时不会渲染任何内容。React将 false 视为 JSX 树中的“漏洞”，就像 null 或 undefined 一样，并不会在其位置渲染任何内容。

##### 5. JSX表达式中使用逻辑与操作符时，&&的左边不要放数字。JavaScript 自动将 && 左侧转换为布尔值。如果左边是 0，那么整个表达式都会得到那个值 (0)，React 会渲染 0 而不是什么都没有。
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

#### 2.2 Keeping components pure
##### 1. 纯函数
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

##### 2. Strict Mode
**注意：使用StrictMode和不使用StrictMode 渲染出的结果不一样，这是因为StrictMode时组件函数被调用了2次，而纯函数只计算，所以调用它们两次不会改变任何东西；不纯的函数则会产生不同的结果**
> [不纯的组件](https://code.juejin.cn/pen/7163198918887637004)

- React 提供了一种“严格模式”，它在开发过程中调用每个组件函数两次。通过调用组件函数两次，严格模式有助于找到违反这些规则的组件。
- 严格模式在生产中没有任何影响，因此它不会为您的用户减慢应用程序的速度。要选择严格模式，您可以将根组件包装到 `<React.StrictMode>` 中，一些框架默认执行此操作。

##### 3. side effects
- These changes—--updating the screen, starting an animation, changing the data—---are called side effects. They’re things that happen “on the side”, not during rendering. 不在渲染期间

- In React, side effects usually belong inside event handlers. Event handlers are functions that React runs when you perform some action—for example, when you click a button. Even though event handlers are defined inside your component, they don’t run during rendering! So event handlers don’t need to be pure. 在 React 中，副作用通常属于事件处理程序。事件处理程序是 在您执行某些操作时 React 运行的函数——例如，当您单击按钮时。**即使在组件内部定义了事件处理程序，它们也不会在渲染期间运行！**所以事件处理程序不需要是纯粹的。

- If you’ve exhausted all other options and can’t find the right event handler for your side effect, you can still attach it to your returned JSX with a useEffect call in your component. This tells React to execute it later, after rendering, when side effects are allowed. However, this approach should be your last resort. When possible, try to express your logic with rendering alone. 如果您已经用尽了所有其他选项仍无法为您的副作用找到正确的事件处理程序，您仍然可以使用组件中的 `useEffect` 将其附加到返回的 JSX。这告诉 React 在渲染之后执行它(不在渲染期间允许执行副作用)。但是，这种方法应该是您最后的手段。如果可能，请尝试仅通过渲染来表达您的逻辑。

:::info
Why does React care about purity?
- Your components could run in a different environment—for example, on the server! Since they return the same result for the same inputs, one component can serve many user requests.
- You can improve performance by [skipping rendering](https://beta.reactjs.org/apis/react/memo) components whose inputs have not changed. This is safe because pure functions always return the same results, so they are safe to cache.
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

#### 2.3 组件库
- [Chakra UI](https://chakra-ui.com/)
- [Material UI](https://mui.com/core/)

#### 2.4 Props
##### 1. 可以通过它们传递任何 JavaScript 值，包括对象、数组和函数。

##### 2. React component functions accept a single argument, a `props` object.
> 这里说的是React函数组件只接收一个入参，即props对象（但不应该还能接受ref这个入参吗？？）

##### 3. 通常你不需要整个 props 对象本身，所以可以将它解构(destructuring)
> [解构](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Unpacking_fields_from_objects_passed_as_a_function_parameter
```jsx
function Avatar(props) {
  let person = props.person;
  let size = props.size;
  // ...
}
// 通常你不需要整个 props 对象本身，所以可以将它解构
function Avatar({ person, size }) {}
```

##### 4. 给prop指定默认值
> 以下面Avatar的prop为例，The default value is only used if the size prop is missing or if you pass `size={undefined}`. But **if you pass `size={null}` or `size={0}`, the default value will not be used**.
```jsx
function Avatar({ person, size = 100 }) {
  // ...
}
```

##### 5. 使用JSX spread syntax传递props
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

##### 6. props的children
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

##### 7. 子组件不要改变props
> 当一个组件需要改变它的 props 时，应该要求父组件传递另外不同的 props(一个新的object)，旧的 props 将被丢弃，最终 JavaScript 引擎将回收它们占用的内存。

:::tip
- Props are read-only snapshots in time: every render receives a new version of props.
- All React components must act like pure functions with respect to their props.
- 保证 React 单向数据流的设计模式，使状态可预测。如果允许子组件修改，那么一个父组件将状态传递给好几个子组件，这几个子组件随意修改，就完全不可预测，不知道在什么地方修改了状态。
:::

#### 2.5 Rendering Lists
##### 1. 箭头函数的隐式返回(implicitly return)及[block body](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#function_body)
```js
// concise body syntax, implied "return"
const func = (x) => x * x;

// with block body, explicit "return" needed
const func2 = (x, y) => {
  return x + y;
};
```
![箭头函数的返回](img/arrow_function_return.jpeg)

##### 2. map中的JSX必须得有key
>- 如果使用 Fragment （`<>...</>`）,`<>`不允许传key，这时可以使用[`<Fragment>`](https://beta.reactjs.org/apis/react/Fragment#rendering-a-list-of-fragments)
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

##### 3. React组件不接收key作为prop，key仅被React本身在其整个生命周期内识别对应的数组的项。
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

#### 2.6 State
:::tip
- In React, data that changes over time is called state. 在 React 中，随时间变化的数据称为状态。
- Unlike regular JavaScript variables, React state behaves more like a snapshot. Setting it does not change the state variable you already have, but instead triggers a re-render. 与常规的 JavaScript 变量不同，React 状态的行为更像是快照。设置它不会更改您已经拥有的状态变量，而是会触发重新渲染。对常规变量的更改不会触发渲染。
- useState 返回的数组总是正好有两项，可以使用数组解构（[array destructuring](https://javascript.info/destructuring-assignment)）获取数组的项。
```jsx
const [count, setCount] = useState(0);

console.log(count);  // 0
setCount(count + 1); // Request a re-render with 1
console.log(count);  // Still 0!
```
Here’s how that happens in action:
1. 您的组件第一次呈现。因为您将 0 传递给 useState 作为 count 的初始值，所以它将返回 [0, setCount]。 React 记住 0 是最新的状态值。
2. 您更新状态。当用户单击按钮时，它会调用 setCount(count + 1)。 count 为 0，所以它是 setCount(1)。这告诉 React 现在记住 count 为 1 并触发另一个渲染。
3. 您的组件的第二次渲染。 React 仍然可以看到 useState(0)，但是因为 React 记得你将 count 设置为 1，所以它会返回 [1, setCount]。
4. 以此类推。
:::

##### 1. State as a Snapshot
```jsx live
// 下面例子中，先点击Send再将下拉框切换为Bob，alert的名字是啥？
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

##### 2. Queueing a series of state updates
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
      <h2>Score: {score}</h2>
    </>
  )
}
```
:::info
State as a Snapshot explains why this is happening. Setting state requests a new re-render, but does not change it in the already running code. So score continues to be 0 right after you call setScore(score + 1). 设置状态会请求新的重新渲染，但不会在已经运行的代码中更改它。
```jsx
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0
setScore(score + 1); // setScore(0 + 1);
console.log(score);  // 0

// 既然一直是0，为啥渲染出来的是1呢？(疑问记录于2022.11.10) ---> 查看上面的 “Here’s how that happens in action” 可以解惑 (解惑记录于2022.11.11)
```
:::

- 在设置状态时传递 更新函数（用 `setScore(s => s + 1)` 替换 `setScore(score + 1)` ） 来解决上述问题。
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
      <h2>Score: {score}</h2>
    </>
  )
}
```

##### 3. 更改类型为对象或数组的state
:::tip
不应该直接修改类型为对象或数组的state，应该创建它的副本并更改副本。Usually, you will use the ... spread syntax to copy objects and arrays that you want to change. 
:::
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
[不使用use-immer的数组state](https://codesandbox.io/s/egqo5y?file=/App.js&utm_medium=sandpack)

或者使用 [Immer](https://github.com/immerjs/use-immer)库 来减少重复代码：
```jsx
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

## 三、Hooks