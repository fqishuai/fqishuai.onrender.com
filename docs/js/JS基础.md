---
slug: basic
tags: [js]
---

## 异步
```jsx live
function AsyncDemo(props) {
  
  const showResult = () => {
    async function async1() {
      alert('async1 start');
      await async2();
      alert('async1 end');
    }
    async function async2() {
      alert('async2');
    }
    alert('script start');
    setTimeout(function() {
      alert('setTimeout');
    }, 0);
    async1();
    new Promise(function(resolve) {
      alert('promise1');
      resolve();
    }).then(function() {
      alert('promise2');
    });
    alert('script end');
    /*
    正确结果：
    script start
    async1 start
    async2
    promise1
    script end
    async1 end
    promise2
    setTimeout
    */
  }
  return (
    <div>
      <p onClick={showResult}>查看执行结果</p>
    </div>
  );
}
```

## [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- 随着运行大量 JavaScript 脚本的复杂程序的出现，以及 JavaScript 被用在其他环境（例如 Node.js），将 JavaScript 程序拆分为可按需导入的单独模块的机制 就尤为重要。
- 最新的浏览器开始原生支持模块功能了，浏览器能够最优化加载模块，使它比使用库更有效率（使用库通常需要做额外的客户端处理）。
- 演示模块的使用的例子集合：[simple set of examples](https://github.com/mdn/js-examples/tree/master/module-examples)

## 拷贝
:::tip
In JavaScript, all standard built-in object-copy operations (
  - spread syntax
  - Array.prototype.concat()
  - Array.prototype.slice()
  - Array.from()
  - Object.assign()
  - Object.create()
) create shallow copies rather than deep copies.
:::
### [Shallow copy](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy)

### [Deep copy](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy)

### [`structuredClone()`](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
[structuredClone() - the simplest way to clone an object in JavaScript](https://www.crocoder.dev/blog/how-to-clone-object-in-javascript/)

## throw
:::info
throw 语句用来抛出一个用户自定义的异常，当前函数的执行将被停止（throw 之后的语句将不会执行），并且控制将被传递到调用堆栈中的第一个 catch 块。如果调用者函数中没有 catch 块，程序将会终止。
:::

## [Ajax（Asynchronous JavaScript and XML）](https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX/Getting_Started)
Asynchronous JavaScript and XML, or Ajax, is not a technology in itself, but rather an approach to using a number of existing technologies together, including HTML or [XHTML](https://developer.mozilla.org/en-US/docs/Glossary/XHTML), CSS, JavaScript, DOM, XML, [XSLT](https://developer.mozilla.org/en-US/docs/Web/XSLT), and most importantly the XMLHttpRequest object. 异步 JavaScript 和 XML(或 Ajax) 本身并不是一种技术，而是一种结合使用多种现有技术的方法，包括 HTML 或 XHTML、CSS、JavaScript、DOM、XML、XSLT，以及最重要的 XMLHttpRequest 对象。

当这些技术结合在 Ajax 模型中时，Web 应用程序能够对用户界面进行快速、增量更新，而无需重新加载整个浏览器页面。这使应用程序更快，对用户操作的响应更快。

虽然 Ajax 中的 X 代表 XML，但首选 JSON，因为它的大小更轻，而且是用 JavaScript 编写的。 JSON 和 XML 都用于 Ajax 模型中的信息打包。

## 解构
```js
const { data } = undefined
// TypeError: Cannot destructure property 'data' of 'undefined' as it is undefined.
```

## Arguments 对象
- arguments 是一个对应于传递给函数的参数的**类数组对象**
- “类数组”意味着 arguments 有 length 属性 并且属性的索引是从零开始的，但是它没有 Array的 内置方法，例如 `forEach()` 和 `map()`都是没有的。
- arguments对象是所有（非箭头）函数中都可用的局部变量。你可以使用arguments对象在函数中引用函数的参数。此对象包含传递给函数的每个参数，第一个参数在索引 0 处。
<CodeRun>
{
  `
  function func1(a, b, c) {
    console.log(arguments[0]); // Expected output: 1
    console.log(arguments[1]); // Expected output: 2
    console.log(arguments[2]); // Expected output: 3
  }
  func1(1, 2, 3);
  `
}
</CodeRun>

### `arguments.callee`
callee 是 arguments 对象的一个属性。它可以用于引用该函数的函数体内当前正在执行的函数。这在函数的名称是未知时很有用，例如在没有名称的函数表达式 (也称为“匿名函数”) 内。

如下定义一个递归函数：
<CodeRun>
{
  `
  function factorial (n) {
    return !(n > 1) ? 1 : factorial(n - 1) * n;
  }
  [1,2,3,4,5].map(factorial);
  `
}
</CodeRun>

但是，匿名函数时应该怎么写：
```js
[1,2,3,4,5].map(function (n) {
  return !(n > 1) ? 1 : /* what goes here? */ (n - 1) * n;
});
```

为了解决这个问题， `arguments.callee` 添加进来了：
<CodeRun>
{
  `
  [1,2,3,4,5].map(function (n) {
    return !(n > 1) ? 1 : arguments.callee(n - 1) * n;
  });
  `
}
</CodeRun>

:::caution
在严格模式下，第 5 版 ECMAScript (ES5) 禁止使用 `arguments.callee()`。当一个函数必须调用自身的时候，避免使用 `arguments.callee()`，通过要么给函数表达式一个名字，要么使用一个函数声明。
:::
