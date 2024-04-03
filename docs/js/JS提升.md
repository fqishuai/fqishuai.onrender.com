---
slug: insight
tags: [js]
---

- [木易杨前端](https://muyiy.cn/)

## [How JavaScript Works? – Behind the Scenes](https://www.atatus.com/blog/how-does-javascript-works/)

## [wtfjs](https://github.com/denysdovhan/wtfjs/blob/master/README-zh-cn.md)

## [this](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
> [Understanding Javascript ‘this’ keyword (Context)](https://towardsdatascience.com/javascript-context-this-keyword-9a78a19d5786)
:::tip
this 的值取决于它出现的上下文：函数、类或全局。The value of this depends on in which context it appears: function, class, or global.
:::

### 1) 全局上下文环境
无论是否在严格模式下，在全局执行环境中（在任何函数体外部）this 都指向全局对象。
```js
console.log(this === window); // true
```
:::tip
可以使用 [globalThis](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/globalThis) 获取全局对象，无论你的代码是否在当前上下文运行。
:::

### 2) 函数上下文(function context)环境
- 在函数内部，this的值取决于函数被调用的方式。在绝大多数情况下，函数的调用方式决定了 this 的值（运行时绑定）。
- this 不能在执行期间被赋值，并且在每次函数被调用时 this 的值也可能会不同。
- ES5 引入了 bind 方法来设置函数的 this 值，而不用考虑函数如何被调用的。
- ES2015 引入了箭头函数，箭头函数不提供自身的 this 绑定（this 的值将保持为 闭合词法上下文(the enclosing lexical context) 的值）。

- 一般而言，this 的值是访问该函数的对象。换句话说，如果函数调用的形式是 `obj.f()`，那么 this 指的是 `obj`。
- this 的值总是根据函数的调用方式而变化，即使函数是在创建对象时定义的
```jsx live
function showAlert() {

  // begin
  const test = {
    prop: 42,
    func: function() {
      return this.prop;
    },
  };

  const obj4 = {
    name: "obj4",
    getThis() {
      return this;
    },
  };
  const obj5 = { name: "obj5" };
  obj5.getThis = obj4.getThis;
  // end

  function showResult() {
    alert(test.func());
  }
  function showResult2() {
    alert(obj5.getThis());
  }
  return (
    <div>
      <button onClick={showResult}>查看test.func()的结果</button>
      <button onClick={showResult2}>查看obj5.getThis()的结果</button>
    </div>
  );
}
```

- 注意：The value of `this` is not the object that has the function as an own property, but the object that is used to call the function. You can prove this by calling a method of an object up in the prototype chain. this 的值不是 将该函数作为自身属性 的对象，而是 调用该函数 的对象
```jsx live
function showAlert() {

  // begin
  function getThis() {
    return this;
  }

  const obj1 = { name: "obj1" };
  obj1.getThis = getThis;

  const obj3 = {
    __proto__: obj1,
    name: "obj3",
  };
  // end

  function showResult() {
    alert(JSON.stringify(obj1.getThis()))
  }
  function showResult2() {
    alert(JSON.stringify(obj3.getThis()));
  }
  return (
    <div>
      <button onClick={showResult}>查看obj1.getThis()的结果</button>
      <button onClick={showResult2}>查看obj3.getThis()的结果</button>
    </div>
  );
}
```

- 严格模式和非严格模式。在非严格模式下，this总是指向一个对象(In non-strict mode, a special process called this substitution ensures that the value of this is always an object. )，在严格模式下可以是任意值。
```jsx live
function showAlert() {
  // begin
  function getThisStrict() {
    "use strict"; // Enter strict mode
    return this;
  }
  function getThis() {
    return this;
  }
  // end

  function showResult() {
    alert(typeof getThis()); // object
  }
  function showResult2() {
    alert(typeof getThisStrict()); // undefined
  }
  function showResult3() {
    alert(getThis() === globalThis); // true
  }
  return (
    <div>
      <button onClick={showResult}>查看typeof getThis()的结果</button>
      <button onClick={showResult2}>查看typeof getThisStrict()的结果</button>
      <button onClick={showResult3}>查看getThis() === globalThis的结果</button>
    </div>
  );
}
```

- 可以使用 Function.prototype.call()、Function.prototype.apply() 或 Reflect.apply() 方法显式设置 this 的值。

- 使用 Function.prototype.bind()，您可以创建一个 this具有特定值 的新函数，无论函数如何调用，该this值都不会改变。

- 当函数作为回调传递时，this 的值取决于回调的调用方式。直接调用回调函数(而不将其附加到任何对象)时，严格模式下，回调函数的this值为undefined，非严格模式下，回调函数的this值为globalThis。
```jsx live
function showAlert() {
  // begin
  function logThisStrict() {
    "use strict";
    alert(this); // undefined undefined undefined
  }
  function logThis() {
    alert(this);
    alert(this === globalThis);
  }

  function showResult() {
    [1, 2, 3].forEach(logThisStrict);
  }
  function showResult2() {
    [1, 2, 3].forEach(logThis);
  }
  // end

  return <div>
    <button onClick={showResult}>查看严格模式回调函数this</button>
    <button onClick={showResult2}>查看非严格模式回调函数this</button>
  </div>
}
```

- 一些API允许设置回调函数的this值，比如所有迭代数组的API，接收一个可选的参数thisArg
```jsx live
function showAlert() {
  // begin
  function logThisStrict() {
    "use strict";
    alert(JSON.stringify(this));
  }
  function logThis() {
    alert(JSON.stringify(this));
  }
  // end

  function showResult() {
    [1, 2, 3].forEach(logThisStrict, { name: "obj" });
  }
  function showResult2() {
    [1, 2, 3].forEach(logThis, { name: "obj" });
  }
  return <div>
    <button onClick={showResult}>查看有thisArg参数的forEach回调的this</button>
    <button onClick={showResult2}>查看有thisArg参数的forEach回调的this</button>
  </div>
}
```





## [JavaScript Functions are First-Class Citizens](https://www.javascripttutorial.net/javascript-functions-are-first-class-citizens/)


## JS数据结构和常用算法
## JS设计模式
## Promise

## 原型链([prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain))

## JS运行机制
## Google V8引擎
:::tip
[V8](https://v8.dev/) 是 Google 的开源高性能 JavaScript 和 WebAssembly 引擎，用 C++ 编写。它用于 Chrome 和 Node.js 等。它实现了 ECMAScript 和 WebAssembly，V8 可以独立运行，也可以嵌入到任何 C++ 应用程序中。
:::
### 内存管理



The topics you'll learn in this Advanced JavaScript course:
- Javascript Engine
- Javascript Runtime
- Interpreter, Compiler, JIT Compiler
- Writing Optimized Code
- Call Stack + Memory Heap
- Stack Overflow + Memory Leaks
- Garbage Collection
- Node.js
- ES6, ES7, ES8, ES9, ES10, ES2020, ES2021, ES2022 features
- Single Threaded Model
- Execution Context
- Lexical Environment
- Scope Chain
- Hoisting
- Function Invocation
- Function Scope vs Block Scope
- Dynamic vs Lexical Scope
- this: call(), apply(), bind()
- IIFEs
- Context vs Scope
- Static vs Dynamically Typed
- Primitive Types
- Pass by Reference vs Pass by Value
- Type Coercion
- Arrays, Functions, Objects
- Closures
- Prototypal Inheritance
- Class Inheritance
- Memoization
- Functions vs Objects
- Scheme + Java in JavaScript
- OOP (Object Oriented Programming)
- Private vs Public Properties
- Functional Programming
- Immutability
- Imperative vs Declarative code
- Composition vs Inheritance
- Currying
- Partial Application
- Pure Functions
- Referential Transparency
- Compose
- Pipe
- Error Handling
- Asynchronous JavaScript
- Callbacks, Promises, Async/Await
- Event Loop + Callback Queue
- Task Queue + Microtask Queue
- Concurrency + Parallelism
- Modules in Javascript






- 比较好的“入门级”的书有2本，一本是 JavaScript: The Good Parts，算是比较经典的；另外一本是 JavaScript: The Definitive Guide，算是比较权威和随着语言一直在更新的。
- You don't know JS系列中的OLOO vs OOP 可以辩证地看
- 虽然React.PureComponent中的shouldComponentUpdate() 基于性能考虑，不建议用深对比和JSON.stringify()；但如果程序中确实是需要处理复杂的数据结构变化的话，可以用force update或immutable-js来满足类似的需求。
- 如果想对比更复杂的对象，React.memo也支持在第二个实参传入自定义的对比功能。
- React中的setState()是浅合并而不是深拷贝

- Shallow copy 和 deep copy，异步 这些没理解透彻