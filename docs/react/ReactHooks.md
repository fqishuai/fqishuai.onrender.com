---
slug: hooks
tags: [react]
---

## React内置Hooks
### State Hooks
#### `useState`
[How to store and update arrays in React useState hook](https://www.codingdeft.com/posts/react-usestate-array/)

##### useState怎么区分不同的state？
调用useState时，只传了state的初始值，并没有传是哪个state的标识，它是怎么知道返回哪个state variables的？
- 答案是：Hooks 在同一组件的每个渲染器上都依赖于稳定的调用顺序。Hooks rely on a stable call order on every render of the same component. 因为遵循“只在顶层调用 Hooks”的规则(而不是在某个函数内调用useState()等hooks)，那么Hooks 将总是以相同的顺序被调用。
- 不在顶层调用Hooks会报错：Rendered fewer hooks than expected. This may be caused by an accidental early return statement. 必须无条件地且始终以相同的顺序调用 Hooks！
```jsx live
function FeedbackForm() {
  const [isSent, setIsSent] = useState(false);
  if (isSent) {
    return <h1>Thank you!</h1>;
  } else {
    // eslint-disable-next-line
    const [message, setMessage] = useState('');
    return (
      <form onSubmit={e => {
        e.preventDefault();
        alert(`Sending: "${message}"`);
        setIsSent(true);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <br />
        <button type="submit">Send</button>
      </form>
    );
  }
}
```
- 在内部，React 为每个组件保存一个数组用来存放状态对。
- 下面这个示例**简单阐述useState是怎么工作的**：
```js
let componentHooks = []; // 存放[state,setState]的数组,本例：[[0, setState],[false, setState]]
let currentHookIndex = 0;

// How useState works inside React (simplified).
function useState(initialState) {
  let pair = componentHooks[currentHookIndex];
  if (pair) {
    // This is not the first render, so the state pair already exists.
    // Return it and prepare for next Hook call.
    currentHookIndex++;
    return pair;
  }

  // This is the first time we're rendering, so create a state pair and store it.
  pair = [initialState, setState]; // 在堆内存中创建了一个数组，变量pair存储了该数组在堆内存中的地址

  function setState(nextState) { // 是一个闭包。闭包是由函数以及声明该函数的词法环境组合而成的，该环境包含了这个闭包创建时作用域内的任何局部变量。
    // When the user requests a state change, put the new value into the pair.
    pair[0] = nextState;
    updateDOM();
  }

  // Store the pair for future renders and prepare for the next Hook call.下次渲染时调用useState()
  componentHooks[currentHookIndex] = pair; // componentHooks[currentHookIndex] 也存储了数组在堆内存中的地址
  currentHookIndex++;
  return pair;
}

function Gallery() {
  // Each useState() call will get the next pair.
  const [index, setIndex] = useState(0);
  console.log(index) // setIndex会再次执行Gallery()，此时index（重新创建了变量index）是最新的，但是setIndex执行后立即log的index的值还是上次的（这里应该怎么理解？--->看下面的“close over”，还是闭包的影响）
  const [showMore, setShowMore] = useState(false);
  /**
   * 1. 调用外层的updateDOM进行初次渲染，currentHookIndex置为0，然后调用Gallery()
   * 2. 按顺序先执行useState(0)：创建pair变量（pair = componentHooks[0]），设置pair为 [0, setState]，componentHooks[0] = pair，currentHookIndex++，返回 [0, function setState(nextState) { pair[0]=nextState; updateDOM(); }]，将 0 赋值给index，将 function setState 赋值给setIndex
   * 3. 然后执行useState(false)：创建pair变量（pair = componentHooks[1]），设置pair为 [false, setState]，componentHooks[1] = pair，currentHookIndex++，返回 [false, function setState(nextState) { pair[0]=nextState; updateDOM(); }]，将 false 赋值给showMore，将 function setState 赋值给setShowMore
   * 
   * componentHooks：[[0, setState], [false, setState]]
   */

  function handleNextClick() {
    setIndex(index + 1);
    /**
     * 调用setState(1)
     * 结果：
     * 1. 改变pair的值为[1,setState]，这个pair与componentHooks[0]的指向一致，所以componentHooks[0]为[1,setState]
     * 2. 调用updateDOM(); currentHookIndex置为0; 调用Gallery()
     * 3. 按顺序调用useState(0)，此时componentHooks[0]有值，所以 currentHookIndex++，然后返回pair，即[1,setState]
     * 4. 按顺序调用useState(false)，此时currentHookIndex为1，componentHooks[1]有值，所以 currentHookIndex++，然后返回pair，即[false,setState]
     * 
     * componentHooks：[[1,setState], [false,setState]]
     */
    console.log(index) // index的值还是上次的
  }

  function handleMoreClick() {
    setShowMore(!showMore);
    /**
     * 调用setState(true)
     * 结果：
     * 1. 改变pair的值为[true,setState]，这个pair与componentHooks[1]的指向一致，所以componentHooks[1]为[true,setState]
     * 2. 调用updateDOM(); currentHookIndex置为0; 调用Gallery()
     * 3. 按顺序调用useState(0)，此时componentHooks[0]有值，所以 currentHookIndex++，然后返回pair，即[1,setState]
     * 4. 按顺序调用useState(false)，此时currentHookIndex为1，componentHooks[1]有值，所以 currentHookIndex++，然后返回pair，即[true,setState]
     * 
     * componentHooks：[[1,setState], [true,setState]]
     */
  }

  let sculpture = sculptureList[index];
  // This example doesn't use React, so return an output object instead of JSX.
  return {
    onNextClick: handleNextClick,
    onMoreClick: handleMoreClick,
    header: `${sculpture.name} by ${sculpture.artist}`,
    counter: `${index + 1} of ${sculptureList.length}`,
    more: `${showMore ? 'Hide' : 'Show'} details`,
    description: showMore ? sculpture.description : null,
    imageSrc: sculpture.url,
    imageAlt: sculpture.alt
  };
}

function updateDOM() {
  // Reset the current Hook index before rendering the component.
  currentHookIndex = 0;
  let output = Gallery();

  // Update the DOM to match the output.
  // This is the part React does for you.
  nextButton.onclick = output.onNextClick;
  header.textContent = output.header;
  moreButton.onclick = output.onMoreClick;
  moreButton.textContent = output.more;
  image.src = output.imageSrc;
  image.alt = output.imageAlt;
  if (output.description !== null) {
    description.textContent = output.description;
    description.style.display = '';
  } else {
    description.style.display = 'none';
  }
}

let nextButton = document.getElementById('nextButton');
let header = document.getElementById('header');
let moreButton = document.getElementById('moreButton');
let description = document.getElementById('description');
let image = document.getElementById('image');
let sculptureList = [{
  name: 'Homenaje a la Neurocirugía',
  artist: 'Marta Colvin Andrade',
  description: 'Although Colvin is predominantly known for abstract themes that allude to pre-Hispanic symbols, this gigantic sculpture, an homage to neurosurgery, is one of her most recognizable public art pieces.',
  url: 'https://i.imgur.com/Mx7dA2Y.jpg',
  alt: 'A bronze statue of two crossed hands delicately holding a human brain in their fingertips.'  
}, {
  name: 'Floralis Genérica',
  artist: 'Eduardo Catalano',
  description: 'This enormous (75 ft. or 23m) silver flower is located in Buenos Aires. It is designed to move, closing its petals in the evening or when strong winds blow and opening them in the morning.',
  url: 'https://i.imgur.com/ZF6s192m.jpg',
  alt: 'A gigantic metallic flower sculpture with reflective mirror-like petals and strong stamens.'
}, {
  name: 'Eternal Presence',
  artist: 'John Woodrow Wilson',
  description: 'Wilson was known for his preoccupation with equality, social justice, as well as the essential and spiritual qualities of humankind. This massive (7ft. or 2,13m) bronze represents what he described as "a symbolic Black presence infused with a sense of universal humanity."',
  url: 'https://i.imgur.com/aTtVpES.jpg',
  alt: 'The sculpture depicting a human head seems ever-present and solemn. It radiates calm and serenity.'
}, {
  name: 'Moai',
  artist: 'Unknown Artist',
  description: 'Located on the Easter Island, there are 1,000 moai, or extant monumental statues, created by the early Rapa Nui people, which some believe represented deified ancestors.',
  url: 'https://i.imgur.com/RCwLEoQm.jpg',
  alt: 'Three monumental stone busts with the heads that are disproportionately large with somber faces.'
}, {
  name: 'Blue Nana',
  artist: 'Niki de Saint Phalle',
  description: 'The Nanas are triumphant creatures, symbols of femininity and maternity. Initially, Saint Phalle used fabric and found objects for the Nanas, and later on introduced polyester to achieve a more vibrant effect.',
  url: 'https://i.imgur.com/Sd1AgUOm.jpg',
  alt: 'A large mosaic sculpture of a whimsical dancing female figure in a colorful costume emanating joy.'
}, {
  name: 'Ultimate Form',
  artist: 'Barbara Hepworth',
  description: 'This abstract bronze sculpture is a part of The Family of Man series located at Yorkshire Sculpture Park. Hepworth chose not to create literal representations of the world but developed abstract forms inspired by people and landscapes.',
  url: 'https://i.imgur.com/2heNQDcm.jpg',
  alt: 'A tall sculpture made of three elements stacked on each other reminding of a human figure.'
}, {
  name: 'Cavaliere',
  artist: 'Lamidi Olonade Fakeye',
  description: "Descended from four generations of woodcarvers, Fakeye's work blended traditional and contemporary Yoruba themes.",
  url: 'https://i.imgur.com/wIdGuZwm.png',
  alt: 'An intricate wood sculpture of a warrior with a focused face on a horse adorned with patterns.'
}, {
  name: 'Big Bellies',
  artist: 'Alina Szapocznikow',
  description: "Szapocznikow is known for her sculptures of the fragmented body as a metaphor for the fragility and impermanence of youth and beauty. This sculpture depicts two very realistic large bellies stacked on top of each other, each around five feet (1,5m) tall.",
  url: 'https://i.imgur.com/AlHTAdDm.jpg',
  alt: 'The sculpture reminds a cascade of folds, quite different from bellies in classical sculptures.'
}, {
  name: 'Terracotta Army',
  artist: 'Unknown Artist',
  description: 'The Terracotta Army is a collection of terracotta sculptures depicting the armies of Qin Shi Huang, the first Emperor of China. The army consisted of more than 8,000 soldiers, 130 chariots with 520 horses, and 150 cavalry horses.',
  url: 'https://i.imgur.com/HMFmH6m.jpg',
  alt: '12 terracotta sculptures of solemn warriors, each with a unique facial expression and armor.'
}, {
  name: 'Lunar Landscape',
  artist: 'Louise Nevelson',
  description: 'Nevelson was known for scavenging objects from New York City debris, which she would later assemble into monumental constructions. In this one, she used disparate parts like a bedpost, juggling pin, and seat fragment, nailing and gluing them into boxes that reflect the influence of Cubism’s geometric abstraction of space and form.',
  url: 'https://i.imgur.com/rN7hY6om.jpg',
  alt: 'A black matte sculpture where the individual elements are initially indistinguishable.'
}, {
  name: 'Aureole',
  artist: 'Ranjani Shettar',
  description: 'Shettar merges the traditional and the modern, the natural and the industrial. Her art focuses on the relationship between man and nature. Her work was described as compelling both abstractly and figuratively, gravity defying, and a "fine synthesis of unlikely materials."',
  url: 'https://i.imgur.com/okTpbHhm.jpg',
  alt: 'A pale wire-like sculpture mounted on concrete wall and descending on the floor. It appears light.'
}, {
  name: 'Hippos',
  artist: 'Taipei Zoo',
  description: 'The Taipei Zoo commissioned a Hippo Square featuring submerged hippos at play.',
  url: 'https://i.imgur.com/6o5Vuyu.jpg',
  alt: 'A group of bronze hippo sculptures emerging from the sett sidewalk as if they were swimming.'
}];

// Make UI match the initial state.
updateDOM();

```
[查看执行结果](https://codesandbox.io/s/stupefied-microservice-bdv0tp?file=/index.js)
:::info
- [只有1个state的例子](https://replit.com/@fqishuai/Jian-Yi-Ban-useState#script.js)
- 对闭包的认识不够啊!
> [闭包例子](https://replit.com/@fqishuai/Bi-Bao#script.js)

- setIndex会再次执行Gallery()，此时index（重新创建了变量index）是最新的，但是setIndex执行后立即log的index的值还是上次的，这是因为event handler functions “[close over](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures)” any variables declared while rendering.事件处理程序函数“关闭”了渲染时声明的任何变量。
```jsx live
// 可以在浏览器的控制台查看console.log
function Form() {
  let firstName = '';
  let lastName = '';

  function handleFirstNameChange(e) {
    console.log('e.target.value::', e.target.value)
    firstName = e.target.value;
    console.log('firstName::', firstName)
  }

  function handleLastNameChange(e) {
    lastName = e.target.value;
  }

  function handleReset() {
    firstName = '';
    lastName = '';
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="First name"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Last name"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hi, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reset</button>
    </form>
  );
}
```
```jsx live
function Form() {
  let [firstName,setFirstName] = useState('');
  let [lastName,setLastName] = useState('');

  function handleFirstNameChange(e) {
    console.log('e.target.value::', e.target.value)
    setFirstName(e.target.value);
    console.log('firstName::', firstName)
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  function handleReset() {
    setFirstName('');
    setLastName('');
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <input
        placeholder="First name"
        value={firstName}
        onChange={handleFirstNameChange}
      />
      <input
        placeholder="Last name"
        value={lastName}
        onChange={handleLastNameChange}
      />
      <h1>Hi, {firstName} {lastName}</h1>
      <button onClick={handleReset}>Reset</button>
    </form>
  );
}
```
:::

#### `useReducer`

### Context Hooks
#### `useContext`

### Ref Hooks
:::tip
- Refs 让组件保存一些不用于渲染的信息，例如 DOM节点或超时ID。与state不同，更新ref不会重新渲染您的组件。当您希望组件“记住”某些信息，但不希望该信息触发新的渲染时，可以使用 ref。
- ref 可以和 state 一起使用，需要重新渲染的信息使用state存储，不需要重新渲染的使用ref
- **Don’t read or write ref.current during rendering.** 在 React 中，每次更新都分为两个阶段(render、commit)：在渲染期间，React 调用您的组件来确定屏幕上应该显示什么；在提交期间，React 将差异应用于 DOM。一般来说，您不想在渲染期间访问refs。在第一次渲染期间，DOM 节点尚未创建，因此 `ref.current` 将为 `null`，并且在渲染更新的过程中，DOM节点还没有被更新。React 在提交期间设置 `ref.current`，在更新 DOM 之前，React 将受影响的 `ref.current` 值设置为 `null`，更新 DOM 后，React 立即将它们设置为相应的 DOM 节点。[示例: 不同状态时查看ref.current](https://code.juejin.cn/pen/7293051768584273920)
:::
#### `useRef`
`useRef` 返回一个这样的对象：
```js
{ 
  current: 0 // 你向 useRef 传入的值
}
```
你可以用 `ref.current` 属性访问该 ref 的当前值。这个值是有意被设置为可变的，意味着你既可以读取它也可以写入它。

1. 使用ref存储不需要重新渲染的信息
```tsx
import { useRef } from 'react';

export default function Counter() {
  let ref = useRef(0);

  function handleClick() {
    ref.current = ref.current + 1;
    alert('You clicked ' + ref.current + ' times!');
  }

  return (
    <button onClick={handleClick}>
      Click me!
    </button>
  );
}
```
`useRef` 返回一个对象，类似：
```js
{ 
  current: 0 // The value you passed to useRef
}
```
```tsx
import { useState, useRef } from 'react';

export default function Stopwatch() {
  const [startTime, setStartTime] = useState(null);
  const [now, setNow] = useState(null);
  const intervalRef = useRef(null);

  function handleStart() {
    setStartTime(Date.now());
    setNow(Date.now());

    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setNow(Date.now());
    }, 10);
  }

  function handleStop() {
    clearInterval(intervalRef.current);
  }

  let secondsPassed = 0;
  if (startTime != null && now != null) {
    secondsPassed = (now - startTime) / 1000;
  }

  return (
    <>
      <h1>Time passed: {secondsPassed.toFixed(3)}</h1>
      <button onClick={handleStart}>
        Start
      </button>
      <button onClick={handleStop}>
        Stop
      </button>
    </>
  );
}
```

![ref v.s. state](img/ref.png)

2. 使用ref控制DOM
- `<input ref={inputRef}>` tells React to put this `<input>’s` DOM node into `inputRef.current`.
```jsx
import { useRef } from 'react';

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <input ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

- ref callback function
  ```jsx
  <div ref={(node) => console.log(node)} />
  ```
  :::tip
    - Do not return anything from the ref callback.
    
    - When the `<div>` DOM node is added to the screen, React will call your ref callback with the DOM node as the argument. When that `<div>` DOM node is removed, React will call your ref callback with `null`.(当 `<div>` DOM 节点添加到屏幕上时，React 将以 DOM 节点作为参数调用您的 ref 回调。当该 `<div>` DOM 节点被删除时，React 将使用 `null` 调用您的 ref 回调。)
    
    - React will also call your ref callback whenever you pass a different ref callback. In the above example, `(node) => { ... }` is a different function on every render. When your component re-renders, the previous function will be called with `null` as the argument, and the next function will be called with the DOM node.(每当您传递不同的 ref 回调时，React 也会调用您的 ref 回调。在上面的示例中， `(node) => { ... }` 在每次渲染上都是不同的函数。当您的组件重新渲染时，将使用 `null` 作为参数调用前一个函数，并使用 DOM 节点调用下一个函数。)

    - 参数`node`: A DOM node or `null`. React will pass you the DOM node when the ref gets attached, and `null` when the ref gets detached. Unless you pass the same function reference for the ref callback on every render, the callback will get temporarily detached and re-attached during every re-render of the component.(当引用被附加时，React 会向你传递 DOM 节点，当引用被分离时，React 会传递给你 null。除非您在每次渲染时为 ref 回调传递相同的函数引用，否则回调将在组件的每次重新渲染期间暂时分离并重新附加。)
  :::

  [示例: ref callback function](https://code.juejin.cn/pen/7290371092995440700)

#### `React.forwardRef()`
:::tip
当你在浏览器元素上放置一个 ref 时(如，`<input ref={inputRef}>`)，React 会将该 ref 的 current 属性设置为相应的 DOM 节点。但是，如果您尝试在自定义的组件上放置ref，例如 `<MyInput ref={inputRef} />`，默认情况下您将得到 `null`。这是因为默认情况下 React 不允许组件访问其他组件(连自己的孩子组件都不行)的 DOM 节点，手动操作另一个组件的 DOM 节点会使您的代码更加脆弱。可以使用`React.forwardRef()`来传递自定义组件的ref。
:::

```jsx
import { forwardRef, useRef } from 'react';

// MyInput将收到的ref传递给其中的 <input>
const MyInput = forwardRef((props, ref) => {
  return <input {...props} ref={ref} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus();
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

#### `useImperativeHandle`
用于限制自定义组件使用ref公开暴露的内容。

语法：`useImperativeHandle(ref, createHandle, dependencies?)`
- `ref`是 `forwardRef`函数的第二个参数
- `createHandle`函数没有参数，通常返回一个对象，包含要公开的方法

```jsx
import { forwardRef, useRef, useImperativeHandle } from 'react';

const MyInput = forwardRef((props, ref) => {
  const realInputRef = useRef(null); // 保存实际的 input DOM 节点
  useImperativeHandle(ref, () => ({
    // 只暴露focus()方法
    focus() {
      realInputRef.current.focus();
    },
  }));
  return <input {...props} ref={realInputRef} />;
});

export default function Form() {
  const inputRef = useRef(null);

  function handleClick() {
    inputRef.current.focus(); // 此时 inputRef.current 引用的不是 DOM node，而是 useImperativeHandle调用中创建的自定义对象
  }

  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={handleClick}>
        Focus the input
      </button>
    </>
  );
}
```

### Effect Hooks
#### `useEffect`

#### `useLayoutEffect`
useLayoutEffect 会损害性能。尽可能首选 useEffect。

#### `useInsertionEffect`
useInsertionEffect 适用于 CSS-in-JS 库作者。除非您正在开发 CSS-in-JS 库并且需要一个地方来注入样式，否则您可能需要 useEffect 或 useLayoutEffect。

### Performance Hooks
#### `useMemo`
:::tip
`useMemo` won’t make the first render faster. It only helps you skip unnecessary work on updates.
:::

#### `useCallback`
用于在重新渲染之间缓存函数定义。语法：`useCallback(fn, dependencies)`，使用示例如下：
```jsx
import { useCallback } from 'react';

export default function ProductPage({ productId, referrer, theme }) {
  const handleSubmit = useCallback((orderDetails) => {
    post('/product/' + productId + '/buy', {
      referrer,
      orderDetails,
    });
  }, [productId, referrer]);
  // ...
}
```

#### `useTransition`
在不阻塞 UI 的情况下更新状态

#### `useDeferredValue`
推迟更新部分UI

### Resource Hooks
#### `use`
读取 Promise 或上下文等资源的值。

### Other Hooks
以下hooks对库作者比较有用，日常开发中并不常用：
#### `useDebugValue`

#### `useId`

#### `useSyncExternalStore`

[React useSyncExternalStore 一览](https://www.pipipi.net/19786.html)

[React系列useSyncExternalStore怎么应用](https://www.yisu.com/zixun/724693.html)

`useSyncExternalStore` 是 React 18 中引入的一个新的 Hook，它允许你在 React 组件中安全、高效地订阅外部数据源。这个 Hook 是 `useSubscription` 的替代品，它提供了更好的并发特性，与 React 18 的新特性如自动批处理和转换更新（transitions）更加兼容。

`useSyncExternalStore` 接收三个参数：
- `subscribe`: 一个函数，当外部数据源更新时，它会被调用。这个函数应该接收一个监听器回调，并在数据源更新时调用它。返回清除订阅的函数。
- `getSnapshot`: 一个函数，用于获取外部数据源的最新状态。
- `getServerSnapshot` (可选): 一个函数，用于在服务端渲染时获取数据源的状态。

使用 `useSyncExternalStore` 可以确保你的组件在数据变化时能够及时更新，并且与 React 的并发特性（如 Suspense 和时间切片）兼容，同时避免不必要的重渲染，提高应用性能。

`useSyncExternalStore` 的使用场景主要是当你需要在 React 组件中订阅一个外部数据源，并希望这个订阅与 React 的状态更新和并发特性保持一致时。以下是一些具体的使用场景：
- 集成非 React 状态管理库：如果你正在使用 Redux、MobX 或其他状态管理库，`useSyncExternalStore` 可以帮助你将这些库的状态安全地集成到 React 组件中。

- 订阅浏览器 API 或 DOM 事件：例如，你可能想要订阅 window 对象的 resize 事件来响应浏览器窗口大小的变化。

- 实时数据订阅：如果你的应用需要处理实时数据，如通过 WebSocket 接收的数据，`useSyncExternalStore` 可以帮助你将这些数据流集成到 React 组件中。

- 与自定义订阅逻辑集成：当你有复杂的订阅逻辑，比如需要处理缓存、数据依赖或者优先级时，`useSyncExternalStore` 提供了一个标准的方式来确保这些逻辑与 React 的更新机制兼容。

- 服务端渲染（SSR）：`useSyncExternalStore` 支持服务端渲染，它可以确保在服务端和客户端渲染的数据保持一致。

##### 用处：订阅浏览器 API
当你想订阅一些由浏览器暴露的并随时间变化的值时。例如，假设你想要组件展示网络连接是否正常。浏览器通过一个叫做 `navigator.onLine` 的属性暴露出这一信息。这个值可能在 React 不知道的情况下改变，所以你应当通过 `useSyncExternalStore` 来读取它。
```jsx
function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}

function useOnlineStatus() {
  // ✅ Good: Subscribing to an external store with a built-in Hook
  return useSyncExternalStore(
    subscribe, // React won't resubscribe for as long as you pass the same function
    () => navigator.onLine, // How to get the value on the client
    () => true // How to get the value on the server
  );
}

function ChatIndicator() {
  const isOnline = useOnlineStatus();
  // ...
}
```

通常不会在组件里直接用 `useSyncExternalStore`，而是在自定义 Hook 里调用它。这使得你可以在不同组件里使用相同的外部 store。例如：这里自定义的 useOnlineStatus Hook 追踪网络是否在线：
```js title="useOnlineStatus.js"
import { useSyncExternalStore } from 'react';

export function useOnlineStatus() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot);
  return isOnline;
}

function getSnapshot() {
  return navigator.onLine;
}

function subscribe(callback) {
  window.addEventListener('online', callback);
  window.addEventListener('offline', callback);
  return () => {
    window.removeEventListener('online', callback);
    window.removeEventListener('offline', callback);
  };
}
```
对比使用`useState`和`useEffect`实现的`useOnlineStatus`:
```js
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```

在使用外部数据时，`useSyncExternalStore` 有助于避免 UI 的不一致。

## 自定义Hook
即使不同的组件具有不同的视觉外观，您也想重用它们之间的逻辑，这时候可以考虑通过自定义hook来实现。当您将逻辑提取到自定义 Hook 中时，您可以隐藏如何处理某些外部系统或浏览器 API 的粗糙细节。**React中hook必须以`use`开头，后跟大写字母。hook可以返回任意值。只有Hooks和组件才能调用其他Hooks！不调用 Hook 的函数不需要是 Hook。**如果您的函数不调用任何 Hook，请避免使用 `use` 前缀。

例如，判断设备是否联网的重复逻辑：
```jsx
import { useState, useEffect } from 'react';

export default function StatusBar() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    // 监听设备联网的状态
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```
将重复逻辑提取到自定义的hook中：
```js title="useOnlineStatus.js"
import { useState, useEffect } from 'react';

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);
  useEffect(() => {
    function handleOnline() {
      setIsOnline(true);
    }
    function handleOffline() {
      setIsOnline(false);
    }
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);
  return isOnline;
}
```
使用该自定义hook:
```jsx
import { useOnlineStatus } from './useOnlineStatus.js';

function StatusBar() {
  const isOnline = useOnlineStatus();
  return <h1>{isOnline ? '✅ Online' : '❌ Disconnected'}</h1>;
}
```

### 自定义Hook共享状态逻辑
自定义 Hook 允许您共享状态逻辑，但不能共享状态本身。**对 Hook 的每次调用完全独立于对同一 Hook 的所有其他调用。**

例子:
```jsx
import { useState } from 'react';

export default function Form() {
  const [firstName, setFirstName] = useState('Mary');
  const [lastName, setLastName] = useState('Poppins');

  function handleFirstNameChange(e) {
    setFirstName(e.target.value);
  }

  function handleLastNameChange(e) {
    setLastName(e.target.value);
  }

  return (
    <>
      <label>
        First name:
        <input value={firstName} onChange={handleFirstNameChange} />
      </label>
      <label>
        Last name:
        <input value={lastName} onChange={handleLastNameChange} />
      </label>
      <p><b>Good morning, {firstName} {lastName}.</b></p>
    </>
  );
}
```
提取重复逻辑到自定义hook中：
```js title="useFormInput.js"
import { useState } from 'react';

export function useFormInput(initialValue) {
  const [value, setValue] = useState(initialValue);

  function handleChange(e) {
    setValue(e.target.value);
  }

  const inputProps = {
    value: value,
    onChange: handleChange
  };

  return inputProps;
}
```
使用该自定义hook:
```jsx
import { useFormInput } from './useFormInput.js';

export default function Form() {
  const firstNameProps = useFormInput('Mary');
  const lastNameProps = useFormInput('Poppins');

  return (
    <>
      <label>
        First name:
        <input {...firstNameProps} />
      </label>
      <label>
        Last name:
        <input {...lastNameProps} />
      </label>
      <p><b>Good morning, {firstNameProps.value} {lastNameProps.value}.</b></p>
    </>
  );
}
```

### 自定义Hook需要是纯粹的
自定义 Hook 中的代码将在组件的每次重新渲染期间重新运行。这就是为什么像组件一样，自定义 Hook 需要是纯粹的。

由于自定义 Hook 与您的组件一起重新渲染，因此它们始终会收到最新的 props 和 state。

例子，每次您的 `ChatRoom` 组件重新渲染时，它都会将最新的 `roomId` 和 `serverUrl` 传递给您的 Hook `useChatRoom`。
```js title="useChatRoom.js"
export function useChatRoom({ serverUrl, roomId }) {
  useEffect(() => {
    const options = {
      serverUrl: serverUrl,
      roomId: roomId
    };
    const connection = createConnection(options);
    connection.connect();
    connection.on('message', (msg) => {
      showNotification('New message: ' + msg);
    });
    return () => connection.disconnect();
  }, [roomId, serverUrl]);
}
```
```js
export default function ChatRoom({ roomId }) {
  const [serverUrl, setServerUrl] = useState('https://localhost:1234');

  useChatRoom({
    roomId: roomId,
    serverUrl: serverUrl
  });

  return (
    <>
      <label>
        Server URL:
        <input value={serverUrl} onChange={e => setServerUrl(e.target.value)} />
      </label>
      <h1>Welcome to the {roomId} room!</h1>
    </>
  );
}
```

### 将事件处理程序传递给自定义Hook

### 何时使用自定义Hook
您不需要为每一个小的重复代码提取自定义 Hook。但是，每当您编写 Effect 时，请考虑将其包装在自定义 Hook 中是否会更清晰。