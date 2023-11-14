---
slug: js_api
tags: [js]
---

## API(应区分JS内置API和宿主环境API)
### 1. Object
#### 1.1 Object.fromEntries
:::note
Object.fromEntries() 方法接收一个键值对的列表参数，并返回一个带有这些键值对的新对象。这个迭代参数应该是一个能够实现@@iterator方法的的对象，返回一个迭代器对象。它生成一个具有两个元素的类数组的对象，第一个元素是将用作属性键的值，第二个元素是与该属性键关联的值。
Object.fromEntries() 执行与 Object.entries 互逆的操作。
:::
```js
// Map 转化为 Object
const map = new Map([ ['foo', 'bar'], ['baz', 42] ]);
const obj = Object.fromEntries(map);
console.log(obj); // { foo: "bar", baz: 42 }

// Array 转化为 Object
const arr = [ ['0', 'a'], ['1', 'b'], ['2', 'c'] ];
const obj = Object.fromEntries(arr);
console.log(obj); // { 0: "a", 1: "b", 2: "c" }
```

#### 1.2 [Object.create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
:::note
Object.create() 方法用于创建一个新对象，使用现有的对象来作为新创建对象的原型（prototype）。
:::

#### 1.3 [Object.getPrototypeOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf)
:::note
Object.getPrototypeOf() 方法返回指定对象的原型（内部[[Prototype]]属性的值）。
:::

#### 1.4 Object.is
用于判断两个值是否相同。
```js
// Case 1: Evaluation result is the same as using ===
Object.is(25, 25); // true
Object.is("foo", "foo"); // true
Object.is("foo", "bar"); // false
Object.is(null, null); // true
Object.is(undefined, undefined); // true
Object.is(window, window); // true
Object.is([], []); // false
const foo = { a: 1 };
const bar = { a: 1 };
const sameFoo = foo;
Object.is(foo, foo); // true
Object.is(foo, bar); // false
Object.is(foo, sameFoo); // true

// Case 2: Signed zero
Object.is(0, -0); // false
Object.is(+0, -0); // false
Object.is(-0, -0); // true

// Case 3: NaN
Object.is(NaN, 0 / 0); // true
Object.is(NaN, Number.NaN); // true
```

#### 1.5 Object.entries
```js
let a = {1: 'a'};
Object.entries(a) // [["1","a"]]
```

#### 1.6 Object.values
```js
let a = {1: 'a'};
Object.values(a) // ["a"]
```

### 2. HTMLElement
#### 2.1 dragstart
> 当用户开始拖动一个元素或者一个选择文本的时候 dragstart 事件就会触发。

#### 2.2 dragend
> dragend 事件在拖放操作结束时触发（通过释放鼠标按钮或单击 escape 键）。该事件无法取消。

#### 2.3 dragenter
> 当拖动的元素或被选择的文本进入有效的放置目标时， dragenter 事件被触发。

#### 2.4 dragleave
> dragleave 事件在拖动的元素或选中的文本离开一个有效的放置目标时被触发。此事件不可取消。

#### 2.5 dragover
> 当元素或者选择的文本被拖拽到一个有效的放置目标上时，触发 dragover 事件（每几百毫秒触发一次）。这个事件在可被放置元素的节点上触发。

#### 2.6 drag
> drag 事件在用户拖动元素或选择的文本时，每隔几百毫秒就会被触发一次。

#### 2.7 drop
> drop 事件在元素或选中的文本被放置在有效的放置目标上时被触发。


- 在 dragstart 事件处理器中，获得对用户拖动的元素的引用。
- 在目标容器的 dragover 事件处理器中，调用 event.preventDefault()，以使得该元素能够接收 drop 事件。
- 在放置区域的 drop 事件处理器中，将可拖动元素从原先的容器移动到该放置区域。

### 3. 循环
#### 3.1 Array.prototype.forEach()
:::info
除了抛出异常以外，没有办法中止或跳出 forEach() 循环。若你需要提前终止循环，你可以使用：
- 一个简单的 for 循环
- for...of / for...in 循环
- Array.prototype.every()
- Array.prototype.some()
- Array.prototype.find()
- Array.prototype.findIndex()
:::

forEach中的return：退出当前函数，但迭代继续。

#### 3.2 for...of
- 对于for...of的循环，可以由 break, throw 或 return 终止。
- for...of 语句遍历可迭代对象定义要迭代的数据。
> 若一个对象拥有迭代行为，那么这个对象便是一个可迭代对象。为了实现可迭代，一个对象必须实现 @@iterator 方法，这意味着这个对象（或其原型链中的任意一个对象）必须具有一个带 Symbol.iterator 键（key）的属性。
```js
// 自定义可迭代对象
var myIterable = {
  *[Symbol.iterator]() {
    yield 1;
    yield 2;
    yield 3;
  }
}

for (let value of myIterable) {
  console.log(value);
}

console.log([...myIterable])
```
[查看执行结果](https://code.juejin.cn/pen/7163182011257978884)

#### 3.3 for...in
- for...in 语句以任意顺序迭代一个对象的除Symbol以外的可枚举属性，包括继承的可枚举属性。
> 可枚举属性是指那些内部“可枚举”标志设置为 true 的属性，对于通过直接的赋值和属性初始化的属性，该标识值默认为 true，对于通过 `Object.defineProperty` 等定义的属性，该标识值默认为 false。

- for...in不应该用于迭代一个关注索引顺序的 Array。
- for...in是为遍历对象属性而构建的，不建议与数组一起使用，数组可以用Array.prototype.forEach()和for...of

#### 3.4 for...of 和 for...in的区别
```js
Object.prototype.objCustom = function() {};
Array.prototype.arrCustom = function() {};

let iterable = [3, 5, 7];
iterable.foo = 'hello';

for (let i in iterable) {
  console.log('forin::', i); // 0 1 2 foo arrCustom objCustom
}

for (let i in iterable) {
  if (iterable.hasOwnProperty(i)) {
    console.log('forin-iterable has property::', i);  // 0 1 2 foo
  }
}

for (let i of iterable) {
  console.log('forof::', i); // 3 5 7
}
```
[查看执行结果](https://code.juejin.cn/pen/7163183675436171299)

### 4. export
- export 语句用于从模块中导出实时绑定的函数、对象或原始值，以便其他程序可以通过 import 语句使用它们。
- 无论您是否声明，导出的模块都处于严格模式。export 语句不能用在嵌入式脚本中。

### 5. Intl
> Intl 对象是 ECMAScript 国际化 API 的一个命名空间，它提供了精确的字符串对比、数字格式化，和日期时间格式化。

### 6. [Crypto](https://developer.mozilla.org/en-US/docs/Web/API/Crypto)
> Crypto 接口提供了基本的加密功能，可用于当前的上下文中。

- 在浏览器控制台可以如下使用：
![window crypto](img/window_crypto.jpeg)

- 但是在js中不能使用`randomUUID()`及`self`对象，可以使用`getRandomValues`：
```js
const array = new Uint32Array(1);
window.crypto.getRandomValues(array);
console.log(JSON.stringify(array));
```
[查看执行结果](https://code.juejin.cn/pen/7163899016164409380)

### 7. base64
[url、base64、blob相互转换方法](https://juejin.cn/post/6959003541457502222)

#### 7.1 base64解密
> 参考：[原来浏览器原生支持JS Base64编码解码](https://www.zhangxinxu.com/wordpress/2018/08/js-base64-atob-btoa-encode-decode/)
- 浏览器中
```js
const decodedData = window.atob(encodedData);
```
- Service Workers和Web Workers中
```js
const decodedData = self.atob(encodedData);
```
#### 7.2 base64加密
- 浏览器中
```js
const encodedData = window.btoa(stringToEncode);
```
- Service Workers和Web Workers中
```js
const encodedData = self.btoa(stringToEncode);
```



### 9. Window
#### 9.1 window.prompt
> 显示一个对话框，对话框中包含一条文字信息，用来提示用户输入文字。
```js
result = window.prompt(text, value);

// result 用来存储用户输入文字的字符串，或者是 null。
// text 用来提示用户输入文字的字符串，如果没有任何提示内容，该参数可以省略不写。
// value 文本输入框中的默认值，该参数也可以省略不写。不过在 Internet Explorer 7 和 8 中，省略该参数会导致输入框中显示默认值"undefined"。
```

#### 9.2 window.getComputedStyle
> 获取指定元素的的所有 CSS 属性的值
```js
const currentCell = document.getElementById(refValue);
const parentWidth = currentCell.parentNode.offsetWidth;
const contentWidth = currentCell.offsetWidth;
const parentStyle = document.defaultView.getComputedStyle(currentCell.parentNode, '');
const paddingValue = parseInt(parentStyle.paddingLeft.replace('px', '')) + parseInt(parentStyle.paddingRight.replace('px', ''));
```

### 10. Node
> 各种类型的 DOM API 对象会从这个接口继承

#### 10.1 Node.appendChild()

### 11. XMLHttpRequest
XMLHttpRequest (XHR) 对象用于与服务器交互，这使网页可以只更新页面的一部分，而不会中断用户正在做的事情。

### 12. Fetch API
#### 12.1 `fetch()`

### 13. FormData
FormData 接口提供了一种表示表单数据的键值对 key/value 的构造方式，可以使用 fetch() 或 XMLHttpRequest.send() 方法发送这些值。如果编码类型设置为“multipart/form-data”，它使用的格式与表单使用的格式相同。

### 14. URL API
#### 14.1 URLSearchParams
```js
const paramsString1 = 'http://example.com/search?query=%40';
const searchParams1 = new URLSearchParams(paramsString1);

console.log(searchParams1.has('query')); // false
console.log(searchParams1.has('http://example.com/search?query')); // true

console.log(searchParams1.get('query')); // null
console.log(searchParams1.get('http://example.com/search?query')); // "@" (equivalent to decodeURIComponent('%40'))

const paramsString2 = '?query=value';
const searchParams2 = new URLSearchParams(paramsString2);
console.log(searchParams2.has('query')); // true

const url = new URL('http://example.com/search?query=%40');
const searchParams3 = new URLSearchParams(url.search);
console.log(searchParams3.has('query')); // true

```

### 15. Document
#### 15.1 querySelectorAll
获取整个页面中class前缀都为"operation"的元素：
```js
document.querySelectorAll('[class^="operation"]')
```

### 16. 改变数组
#### 16.1 `Array.prototype.shift()`
- 从数组中删除第一个元素，并返回该元素的值。此方法更改数组的长度。
- shift 方法会读取 `this` 的 length 属性，如果长度为 0，length 再次设置为 0（而之前可能为负值或 undefined）。否则，返回 0 处的属性，其余属性向左移动 1。length 属性递减 1。
<CodeRun>
{
  `
  const arrayLike1 = {
    length: 3,
    unrelated: "foo",
    2: 4,
  };
  console.log('arrayLike1 shift --->', Array.prototype.shift.call(arrayLike1)); // 没有属性0，返回undefined
  console.log('arrayLike1 --->', arrayLike1); // 属性length的值减1，属性2变为1
  const arrayLike2 = {
    length: 3,
    unrelated: "foo",
    1: 4,
    0: 3,
  };
  console.log('arrayLike2 shift --->', Array.prototype.shift.call(arrayLike2));
  console.log('arrayLike2 --->', arrayLike2);
  console.log('arrayLike2 shift --->', [].shift.call(arrayLike2));
  console.log('arrayLike2 --->', arrayLike2);
  `
}
</CodeRun>

#### 16.2 `Array.prototype.sort()`
- 对数组的元素进行排序，此方法改变原数组。如果想要不改变原数组的排序方法，可以使用 `Array.prototype.toSorted()`。