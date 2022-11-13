---
id: learnJS
slug: usage
tags: [原生js]
---

# JavaScript

## 一、基础
### 1. 循环

### 2. 异步
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

### 3. 正则表达式
### 3.1 提取小括号中的内容
```jsx live
function demo(props) {
  // 提取小括号中的内容
  let sourceStr = 'aa(bb)cc';
  let regex = /\((.+)\)/g; // 匹配小括号
  let tempString = sourceStr.match(regex)[0];
  let result = tempString.substring(1,tempString.length-1);

  return (
    <p>结果为：{result}</p>
  )
}
```

### 3.2 手机号码中间 4 位用星号（*）替换显示
```jsx live
function demo(props) {
  // 提取小括号中的内容
  let phone = '13701134148';
  let result = phone.replace(/^(\d{3})\d{4}(\d+)/, '$1****$2');

  return (
    <p>结果为：{result}</p>
  )
}
```

### 4. [JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- 随着运行大量 JavaScript 脚本的复杂程序的出现，以及 JavaScript 被用在其他环境（例如 Node.js），将 JavaScript 程序拆分为可按需导入的单独模块的机制 就尤为重要。
- 最新的浏览器开始原生支持模块功能了，浏览器能够最优化加载模块，使它比使用库更有效率（使用库通常需要做额外的客户端处理）。
- 演示模块的使用的例子集合：[simple set of examples](https://github.com/mdn/js-examples/tree/master/module-examples)

### 5. 函数
[如何将js回调函数中的数据返回给最外层函数？](https://segmentfault.com/q/1010000013400193/a-1020000013407882)

### 6. 拷贝
#### 6.1 [Shallow copy](https://developer.mozilla.org/en-US/docs/Glossary/Shallow_copy)

#### 6.2 [Deep copy](https://developer.mozilla.org/en-US/docs/Glossary/Deep_copy)

## 二、API
### 1. Object
### 1.1 Object.fromEntries
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

### 1.2 [Object.create](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
:::note
Object.create() 方法用于创建一个新对象，使用现有的对象来作为新创建对象的原型（prototype）。
:::

### 1.3 [Object.getPrototypeOf](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/GetPrototypeOf)
:::note
Object.getPrototypeOf() 方法返回指定对象的原型（内部[[Prototype]]属性的值）。
:::

### 2. HTMLElement
### 2.1 dragstart
> 当用户开始拖动一个元素或者一个选择文本的时候 dragstart 事件就会触发。

### 2.2 dragend
> dragend 事件在拖放操作结束时触发（通过释放鼠标按钮或单击 escape 键）。该事件无法取消。

### 2.3 dragenter
> 当拖动的元素或被选择的文本进入有效的放置目标时， dragenter 事件被触发。

### 2.4 dragleave
> dragleave 事件在拖动的元素或选中的文本离开一个有效的放置目标时被触发。此事件不可取消。

### 2.5 dragover
> 当元素或者选择的文本被拖拽到一个有效的放置目标上时，触发 dragover 事件（每几百毫秒触发一次）。这个事件在可被放置元素的节点上触发。

### 2.6 drag
> drag 事件在用户拖动元素或选择的文本时，每隔几百毫秒就会被触发一次。

### 2.7 drop
> drop 事件在元素或选中的文本被放置在有效的放置目标上时被触发。


- 在 dragstart 事件处理器中，获得对用户拖动的元素的引用。
- 在目标容器的 dragover 事件处理器中，调用 event.preventDefault()，以使得该元素能够接收 drop 事件。
- 在放置区域的 drop 事件处理器中，将可拖动元素从原先的容器移动到该放置区域。

### 3. 循环
### 3.1 Array.prototype.forEach()
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

### 3.2 for...of
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

### 3.3 for...in
- for...in 语句以任意顺序迭代一个对象的除Symbol以外的可枚举属性，包括继承的可枚举属性。
> 可枚举属性是指那些内部“可枚举”标志设置为 true 的属性，对于通过直接的赋值和属性初始化的属性，该标识值默认为 true，对于通过 `Object.defineProperty` 等定义的属性，该标识值默认为 false。

- for...in不应该用于迭代一个关注索引顺序的 Array。
- for...in是为遍历对象属性而构建的，不建议与数组一起使用，数组可以用Array.prototype.forEach()和for...of

### 3.4 for...of 和 for...in的区别
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

### 8. switch
Switch case 使用严格比较（===）。

值必须与要匹配的类型相同。

只有操作数属于同一类型时，严格比较才能为 true。

## 三、手写函数
### 1. 去重
```js
/**
 * 去重
 */
handleDeduplicate(sourceArray,keyName) {
  let deduplicationList = [];
  let obj = {};
  for (let item of sourceArray) {
    if (!obj[item[keyName]]) {
      deduplicationList.push(item);
      obj[item[keyName]] = 1;
    }
  }
  return deduplicationList;
},
```

### 2. 循环删数组元素
```js
var arr = [1,2,2,3,4,5];
var i = arr.length;
// 从后往前遍历
while(i--){
  if(arr[i]==2){
    arr.splice(i,1);
  }
}
console.log(arr);
```
> 也可以使用filter实现
```js
var stuArr = [
  {name:'Jesse',gender:'male'},
  {name:'Leo',gender:'male'},
  {name:'Sophia',gender:'female'},
  {name:'Kathy',gender:'female'},
  {name:'Gaviin',gender:'male'}
];

stuArr = stuArr.filter(function(item){
  return item.gender !== 'male';
})
// 运行结果，删除后数组当前值
[
  {name:'Sophia',gender:'female'},
  {name:'Kathy',gender:'female'},
]
```

### 3. 使用weakmap实现深拷贝
```js
/**
 * 使用weakmap手写深拷贝
 */
deepClone(obj, hash = new WeakMap()) {
  const isComplexDataType = obj => (typeof obj === 'object' || typeof obj === 'function') && (obj !== null);
  if (obj.constructor === Date) return new Date(obj);
  if (obj.constructor === RegExp) return new RegExp(obj);
  if (hash.has(obj)) return hash.get(obj);
  let allDesc = Object.getOwnPropertyDescriptor(obj);
  let cloneObj = Object.create(Object.getPrototypeOf(obj), allDesc);
  hash.set(obj, cloneObj);
  for (const key of Reflect.ownKeys(obj)) {
    cloneObj[key] = (isComplexDataType(obj[key]) && typeof obj[key] !== 'function') ? this.deepClone(obj[key], hash) : obj[key];
  }
  return cloneObj;
},
```

### 4. 数组转树；树转数组
> 参考：[list和tree的相互转换](https://juejin.cn/post/6952442048708345863)
