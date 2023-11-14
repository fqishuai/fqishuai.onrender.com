---
slug: basic
tags: [js]
---

:::info
JavaScript 没有输入或输出的概念，它是一个在宿主环境（host environment）下运行的脚本语言，任何与外界沟通的机制都是由宿主环境提供的。浏览器是最常见的宿主环境，但在非常多的其他程序中也包含 JavaScript 解释器，如 Adobe Acrobat、Adobe Photoshop、SVG 图像、Yahoo！的 Widget 引擎，Node.js 之类的服务器端环境，NoSQL 数据库（如开源的 [Apache CouchDB](https://couchdb.apache.org/))、嵌入式计算机，以及包括 [GNOME](https://www.gnome.org/)（注：GNU/Linux 上最流行的 GUI 之一）在内的桌面环境等等。

JavaScript 是一种多范式的“动态类型”（dynamically typed）语言，它包含类型、运算符、标准内置（built-in）对象和方法。
> “动态类型”（dynamically typed）的编程语言，意思是虽然编程语言中有不同的数据类型，但是你定义的变量并不会在定义后，被限制为某一数据类型。

JavaScript 支持面向对象编程。JavaScript是通过**[原型链（prototype chain）](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)**而不是 [类](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Classes) 来支持面向对象编程。

JavaScript 也支持函数式编程。在JavaScript中，函数也是对象，函数也可以被保存在变量中，并且像其他对象一样被传递。

学习资料：
- [重新介绍 JavaScript](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Language_Overview)
- [Learn ES2015](https://babeljs.io/docs/en/learn)
- [ecma](https://www.ecma-international.org/)
- [tc39](https://tc39.es/) 所属 Ecma International 的 TC39 是一个由 JavaScript 开发者、实现者、学者等组成的团体，与 JavaScript 社区合作维护和发展 JavaScript 的标准。
:::

## 严格模式
- "use strict" 或者 'use strict'，当它处于脚本文件的顶部（请确保 "use strict" 出现在脚本的最顶部，否则严格模式可能无法启用。只有注释可以出现在 "use strict" 的上面。）时，则整个脚本文件都将以“现代”模式进行工作。
- "use strict" 可以被放在函数体的开头，这样则可以只在该函数中启用严格模式。
- 现代 JavaScript 支持 “class” 和 “module”，它们会自动启用 use strict。因此，如果我们使用它们，则无需添加 "use strict" 指令。

例如，旧版本中可以简单地通过赋值来创建一个变量。现在如果我们不在脚本中使用 use strict 声明启用严格模式，这仍然可以正常工作，这是为了保持对旧脚本的兼容。
```js
// 注意：这个例子中没有 "use strict"

num = 5; // 如果变量 "num" 不存在，就会被创建

alert(num); // 5
```
```js
"use strict";

num = 5; // 错误：num 未定义
```

## 数据类型
在 JavaScript 中有 8 种基本的数据类型（7 种原始类型和 1 种引用类型）：
1. 七种原始数据类型：
- "number" 用于任何类型的数字：整数或浮点数，在 ±(2^53-1) 范围内的整数。
- "bigint" 用于任意长度的整数。
- "string" 用于字符串：一个字符串可以包含 0 个或多个字符，所以没有单独的单字符类型。
- "boolean" 用于 true 和 false。
- "null" 用于未知的值 —— 只有一个 `null` 值的独立类型。
- "undefined" 用于未定义的值 —— 只有一个 `undefined` 值的独立类型。
- "symbol" 用于唯一的标识符。

2. 一种非原始数据类型：
- "object" 用于更复杂的数据结构。

### Number 类型
Number 类型，包括整数和浮点数，还包括所谓的“特殊数值（special numeric values）”：`Infinity`、`-Infinity` 和 `NaN`。
- `Infinity` 代表数学概念中的 无穷大 ，是一个比任何数字都大的特殊值。`alert( 1 / 0 ); // Infinity`
- `NaN` 代表一个计算错误。它是一个不正确的或者一个未定义的数学操作所得到的结果。`NaN` 是粘性的:任何对 `NaN` 的进一步数学运算都会返回 `NaN`（只有一个例外：`NaN ** 0` 结果为 1）。
> 幂（`**`）运算符返回第一个操作数取第二个操作数的幂的结果。它等价于 `Math.pow()`，不同之处在于，它还接受 `BigInt` 作为操作数。

<CodeRun>
{
  `
  console.log( "not a number" / 2 ); // NaN，这样的除法是错误的
  console.log( NaN + 1 ); // NaN
  console.log( 3 * NaN ); // NaN
  console.log( "not a number" / 2 - 1 ); // NaN
  console.log( NaN ** 0 ); // 1
  `
}
</CodeRun>

### BigInt 类型
- 在 JavaScript 中，Number 类型超出安全整数范围 ±(2^53-1) 会出现精度问题，因为并非所有数字都适合固定的 64 位存储。因此，可能存储的是“近似值”。如下两个数字（正好超出了安全整数范围）是相同的：
<CodeRun>
{
  `
  console.log(9007199254740991 + 1); // 9007199254740992
  console.log(9007199254740991 + 2); // 9007199254740992
  `
}
</CodeRun>

- BigInt 类型用于表示任意长度的整数。可以通过将 `n` 附加到整数字段的末尾来创建 BigInt 值。
  ```js
  // 尾部的 "n" 表示这是一个 BigInt 类型
  const bigInt = 1234567890123456789012345678901234567890n;
  ```


### String 类型
### Boolean 类型
Boolean类型仅包含两个值：true 和 false。

### null
JavaScript 中的 `null` 仅仅是一个代表“无”、“空”或“值未知”的特殊值。

### undefined
`undefined` 的含义是 未被赋值。如果一个变量已被声明，但未被赋值，那么它的值就是 `undefined`。从技术上讲，可以显式地将 `undefined` 赋值给变量，但是不建议这样做。**通常，使用 `null` 将一个“空”或者“未知”的值写入变量中，而 `undefined` 则保留作为未进行初始化的事物的默认初始值。**

### Object 类型
- 创建对象的2种语法: 构造函数、字面量(object literal)。
  ```js
  let user = new Object(); // “构造函数” 的语法
  let user = {};  // “字面量” 的语法
  ```

- 对象的属性(`key`)是字符串类型 或者 Symbol类型（其他类型会被自动地转换为字符串），属性的值可以是任意类型。
  ```js
  let user = {
    name: "John",         // 键 "name"，值 "John"
    age: 30,              // 键 "age"，值 30
    "likes birds": true   // 多词属性名必须加引号
    0: "test"             // 等同于 "0": "test"
  };

  // 相同的属性（数字 0 被转为字符串 "0"）
  alert( obj["0"] ); // test
  alert( obj[0] );   // test
  ```

- 可以使用 点符号 或者 方括号 访问/设置属性值。点符号要求 `key` 是有效的变量标识符，这意味着：不包含空格，不以数字开头，也不包含特殊字符（允许使用 `$` 和 `_`）。使用方括号，可用于任何字符串。方括号同样提供了一种可以通过任意表达式来获取属性名的方式(点符号不能以类似的方式使用)。
  ```js
  alert( user.name ); // John
  alert( user.age ); // 30
  alert( user["likes birds"] );
  ```
  ```js
  let key = "likes birds";

  user[key] = true; // 跟 user["likes birds"] = true; 一样

  alert( user.key ) // undefined
  ```

- 可以用 `delete` 操作符移除属性
  ```js
  delete user.age;
  delete user["likes birds"];
  ```

- 作为对象属性的函数被称为 方法(method)。
  ```js
  let user = {
    sayHi: function() {
      alert("Hello");
    }
  };

  // 方法简写
  let user = {
    sayHi() { // 与 "sayHi: function(){...}" 一样
      alert("Hello");
    }
  };
  ```

#### 对象方法中的`this`
```js
let user = {
  name: "John",
  age: 30,

  sayHi() {
    // "this" 指的是“当前的对象”
    alert(this.name);
  }

};

user.sayHi(); // John
```

- 技术上讲，也可以在不使用 `this` 的情况下，通过外部变量名来引用它，但这样的代码是不可靠的。例如：
  ```js
  let user = {
    name: "John",
    age: 30,

    sayHi() {
      alert( user.name );
    }
  };

  let admin = user;
  user = null; // 重写

  admin.sayHi(); // TypeError: Cannot read property 'name' of null
  ```

  使用`this`可以避免上述错误：
  <CodeRun>{`
  let user = {
    name: "John",
    age: 30,
    sayHi() {
      console.log( this.name );
    }
  };
  let admin = user;
  user = null; // 重写
  admin.sayHi();
  `}</CodeRun>

#### 计算属性
当创建一个对象时，我们可以在对象字面量中使用方括号。这叫做 计算属性。
```js
let fruit = prompt("Which fruit to buy?", "apple");

let bag = {
  [fruit]: 5, // 属性名是从 fruit 变量中得到的
};

alert( bag.apple ); // 5 如果一个用户输入 "apple"，bag 将变为 {apple: 5}。
```
<CodeRun>
{`
let fruit = 'apple';
let bag = {
  [fruit + 'Computers']: 5 // bag.appleComputers = 5
};
console.log( bag.appleComputers )
`}
</CodeRun>

#### `in`操作符
- JavaScript 的对象有一个需要注意的特性：能够被访问任何属性。即使属性不存在也不会报错！读取不存在的属性只会得到 `undefined`。
  ```js
  let user = {};

  alert( user.noSuchProperty === undefined ); // true 意思是没有这个属性
  ```

- 可以使用`in`操作符检查属性是否存在。请注意，`in` 的左边必须是 属性名，通常是一个带引号的字符串。如果我们省略引号，就意味着左边是一个变量，它应该包含要判断的实际属性名。
  <CodeRun>
  {`
  let user = { name: "John", age: 30 };
  console.log( "age" in user );           // true，user.age 存在
  console.log( "blabla" in user );        // false，user.blabla 不存在。
  let key = "age";
  console.log( key in user );             // true，属性 "age" 存在
  `}
  </CodeRun>

- 大部分情况下与 `undefined` 进行比较来判断属性是否存在就可以了。当 属性存在但存储的值是 `undefined` 时，这种比对方式会有问题，而 `in` 运算符的判断结果仍是对的。
  <CodeRun>
  {`
  let obj = {
    test: undefined
  };
  console.log( obj.test );       // 显示 undefined，所以属性不存在？
  console.log( "test" in obj );  // true，属性存在！
  `}
  </CodeRun>

- 通常情况下不应该给对象属性赋值 `undefined`。我们通常会用 `null` 来表示未知的或者空的值。

#### `for..in` 循环
为了遍历一个对象的所有键（`key`），可以使用一个特殊形式的循环：`for..in`。注意，所有的 “for” 结构体都允许我们在循环中定义变量，像如下的 `let prop`。
<CodeRun>
{`
let user = {
  name: "John",
  age: 30,
  isAdmin: true
};
for (let prop in user) {
  // keys
  console.log( prop );  // name, age, isAdmin
  // 属性键的值
  console.log( user[prop] ); // John, 30, true
}
`}
</CodeRun>

遍历一个对象时，整数属性会被进行排序，其他属性则按照创建的顺序显示。
> 这里的“整数属性”指的是一个可以在不做任何更改的情况下与一个整数进行相互转换的字符串。例如："49" 是一个整数属性名（因为我们把它转换成整数，再转换回来，它还是一样的。），但是 “+49” 和 “1.2” 就不是。

<CodeRun>
{`
let codes = {
  "49": "Germany",
  "41": "Switzerland",
  "44": "Great Britain",
  // ..,
  "1": "USA"
};
for(let code in codes) {
  console.log(code); // "1", "41", "44", "49"
}
`}
</CodeRun>
<CodeRun>
{`
let user = {
  name: "John",
  surname: "Smith"
};
user.age = 25; // 增加一个
// 非整数属性是按照创建的顺序来排列的
for (let prop in user) {
  console.log( prop ); // "name", "surname", "age"
}
`}
</CodeRun>

#### 对象引用和复制
- 原始类型的复制
  ```js
  let message = "Hello!";
  let phrase = message;
  ```
  ![原始类型的复制](img/clone1.jpeg)

- 赋值了对象(如下方的`{name:"John"}`)的变量(如下方的`user`) 存储的不是对象本身，而是该对象“在内存中的地址”，换句话说就是对该对象的“引用”。
  ```js
  let user = {
    name: "John"
  };
  // 该对象被存储在内存中的某个位置（在下图的右侧），而变量 user（在下图的左侧）保存的是对其的“引用”。
  ```
  ![值为对象的变量的存储](img/clone2.jpeg)

- 当一个对象变量被复制，其实是引用被复制，而该对象自身并没有被复制。
  ```js
  let user = { name: "John" };

  let admin = user; // 现在我们有了两个变量，它们保存的都是对同一个对象的引用。

  // 仍然只有一个对象，但现在有两个引用它的变量。

  // 可以通过其中任意一个变量来访问该对象并修改它的内容
  admin.name = 'Pete'; // 通过 "admin" 引用来修改

  alert(user.name); // 'Pete'，修改能通过 "user" 引用看到
  ```
  ![值为对象的变量的复制](img/clone3.jpeg)

- 仅当两个变量都引用同一个对象时，它们才相等。
  <CodeRun>
  {`
  let a = {};
  let b = a; // 复制引用
  console.log( a == b );  // true，都引用同一对象
  console.log( a === b ); // true
  // 引用两个独立的对象的变量并不相等，即使它们看起来很像（如都为空时）
  let c = {};
  let d = {};
  console.log( c == d );  // false
  `}
  </CodeRun>

#### 对象的克隆与合并
- 克隆对象 可以创建一个新对象，通过遍历已有对象的属性，并在原始类型值的层面复制它们，以实现对已有对象结构的复制。
  <CodeRun>
  {`
  let user = {
    name: "John",
    age: 30,
  };
  let clone = {}; // 新的空对象
  // 将 user 中所有的属性拷贝到其中
  for (let key in user) {
    clone[key] = user[key];
  }
  // 现在 clone 是带有相同内容的完全独立的对象
  clone.name = "Pete"; // 改变了其中的数据
  console.log( clone );
  console.log( user.name ); // 原来的对象中的 name 属性依然是 John
  `}
  </CodeRun>

- 可以使用 `Object.assign(dest, [src1, src2, src3...])` 方法进行对象的合并及“浅拷贝”（嵌套对象被通过引用进行拷贝，即如果对象的属性也是一个对象，则拷贝后该属性的值被共享），该方法将从第二个开始的所有参数的属性都被拷贝到第一个参数的对象中。调用结果返回 `dest`。如果被拷贝的属性的属性名已经存在，那么它会被覆盖。
  <CodeRun>
  {`
  let user = { name: "John" };
  let permissions1 = { canView: true };
  let permissions2 = { canEdit: true };
  // 将 permissions1 和 permissions2 中的所有属性都拷贝到 user 中
  let cloneResult = Object.assign(user, permissions1, permissions2);
  console.log( user );
  console.log( cloneResult );
  let cloneResult2 = Object.assign(user, { name: "Pete" });
  console.log( user );
  console.log( cloneResult2 );
  `}
  </CodeRun>

- 也可以用 `Object.assign` 代替 `for..in` 循环来进行简单克隆
  <CodeRun>
  {`
  let user = {
    name: "John",
    age: 30,
  };
  let clone = Object.assign({}, user);
  console.log( clone );
  `}
  </CodeRun>

- 还可以使用 `spread` 语法 克隆对象
  <CodeRun>{`
  let user = {
    name: "John",
    age: 30,
  };
  let clone = {...user};
  console.log( clone );
  `}</CodeRun>

#### 深层克隆对象
对象的属性可以是对其他对象的引用，这时简单的克隆对象后，该属性的值会以引用形式被拷贝。
<CodeRun>{`
let user = {
  name: "John",
  sizes: {
    height: 182,
    width: 50
  }
};
let clone = Object.assign({}, user);
console.log( user.sizes === clone.sizes ); // true，同一个对象
// user 和 clone 共享同一个 sizes
user.sizes.width++;                        // 通过其中一个改变属性值
console.log(clone.sizes.width);            // 51，能从另外一个获取到变更后的结果
`}</CodeRun>

为了解决这个问题，并让 `user` 和 `clone` 成为两个真正独立的对象，我们应该使用一个拷贝循环来检查 `user[key]` 的每个值，如果它是一个对象，那么也复制它的结构。这就是所谓的“深拷贝”。我们可以使用递归来实现它。或者为了不重复造轮子，采用现有的实现，例如 [lodash](https://lodash.com/) 库的 [`_.cloneDeep(obj)`](https://lodash.com/docs#cloneDeep)。

#### 对象的属性标志
- 使用 `const` 声明的对象也是可以被修改的。如下使用`const`声明的变量`user`的值是一个常量，它必须始终引用同一个对象，但该对象的属性可以被自由修改。
  <CodeRun>{`
  const user = {
    name: "John"
  };
  user.name = "Pete";
  console.log(user.name); // Pete
  `}</CodeRun>

#### 对象到原始值的转换
对于类似 `obj1 > obj2` 的比较，或者跟一个原始类型值的比较 `obj == 5`，对象都会被转换为原始值。

#### 其他对象
有时候大家会说“Array 类型”或“Date 类型”，但其实它们并不是自身所属的类型，而是属于一个对象类型即 “object”。它们以不同的方式对 “object” 做了一些扩展。
- Function（函数）
- Array 用于存储有序数据集合
- Date 用于存储时间日期
- RegExp（正则表达式）
- Error 用于存储错误信息

### Symbol 类型

### `typeof` 运算符
`typeof` 是一个操作符，不是一个函数。`typeof(x)` 与 `typeof x` 相同，但是这里的括号不是 `typeof` 的一部分，它是数学运算分组的括号。
```jsx live
function typeofDemo() {
  function showResult() {
    alert( typeof undefined );      // 'undefined'
    alert( typeof 0 );              // 'number'
    // console.log( typeof 10n );   // 'bigint'
    alert( typeof true );           // 'boolean'
    alert( typeof "foo" );          // 'string'
    alert( typeof Symbol("id") );   // 'symbol'
    alert( typeof Math );           // 'object'
    alert( typeof null );           // 'object'
    alert( typeof console.log );    // 'function'
  }

  return (
    <div>
      <p onClick={showResult}>查看执行结果</p>
    </div>
  );
}
```
- `Math` 是一个提供数学运算的内建 object。

- 在 JavaScript 语言中没有一个特别的 “function” 类型。函数隶属于 object 类型。但是 `typeof` 会对函数区分对待，并返回 "function"。这也是来自于 JavaScript 语言早期的问题。从技术上讲，这种行为是不正确的，但在实际编程中却非常方便。

- `typeof null` 的结果为 "object"，这是官方承认的 `typeof` 的错误，这个问题来自于 JavaScript 语言的早期阶段，并为了兼容性而保留了下来。`null` 绝对不是一个 `object`。`null` 有自己的类型，它是一个特殊值。
  ![typeof null](img/typeofnull.jpeg)

## 数据类型的转换
> [数据类型的转换](https://wangdoc.com/javascript/features/conversion)

### 手动强制转换
强制转换主要指使用 `Number()`、`String()`和`Boolean()` 三个函数，手动将各种类型的值，分别转换成数字、字符串或者布尔值。

#### `Number()`
1. 参数是原始类型值

转换规则：
![Number()转换规则](img/Number()转换规则.png)
<CodeRun>
{
  `
  console.log( Number("   123   ") ); // 123
  console.log( Number("123z") );      // NaN（从字符串“读取”数字，读到 "z" 时出现错误）
  console.log( Number("") );          // 0
  console.log( Number(true) );        // 1
  console.log( Number(false) );       // 0
  console.log( Number(undefined) );   // NaN
  console.log( Number(null) );        // 0
  console.log( Number("+49") );       // 49 这个解析规则是怎样的
  console.log( Number("-49") );       // -49 这个解析规则是怎样的
  console.log( Number("*49") );       // NaN
  console.log( Number("/49") );       // NaN
  `
}
</CodeRun>

:::tip
`Number`函数将字符串转为数值，要比`parseInt`函数严格很多。`parseInt`逐个解析字符，而`Number`函数整体转换字符串的类型。
<CodeRun>
{
  `
  console.log( parseInt('42 cats') )         // 42
  console.log( Number('42 cats') )           // NaN
  console.log( parseInt('12.34') )           // 12
  console.log( Number('12.34') )             // 12.34
  `
}
</CodeRun>
:::

2. 参数是对象

`Number()`的参数是对象时，将返回 `NaN`，除非是包含单个数值的数组。
<CodeRun>
{
  `
  console.log( Number({a: 1}) )      // NaN
  console.log( Number([1, 2, 3]) )   // NaN
  console.log( Number([5]) )         // 5
  console.log( Number({}) )          // NaN
  console.log( Number([]) )          // 0
  console.log([].toString())         // ''
  `
}
</CodeRun>

转换规则：
- 第一步，调用对象自身的 `valueOf` 方法。如果返回原始类型的值，则直接对该值使用Number函数，不再进行后续步骤。
- 第二步，如果 `valueOf` 方法返回的还是对象，则改为调用对象自身的 `toString` 方法。如果 `toString` 方法返回原始类型的值，则对该值使用Number函数，不再进行后续步骤。
- 第三步，如果 `toString` 方法返回的是对象，就报错。
<CodeRun>
{
  `
  var obj = {x: 1};
  console.log( Number(obj) ) // NaN
  console.log(obj.valueOf(), typeof obj.valueOf(), obj.toString())
  // 等同于
  if (typeof obj.valueOf() === 'object') {
    console.log( Number(obj.toString()) );
  } else {
    console.log( Number(obj.valueOf()) );
  }
  /*
  首先调用obj.valueOf方法, 结果返回对象本身；于是，继续调用obj.toString方法，这时返回字符串[object Object]，对这个字符串使用Number函数，得到NaN。
  */
  `
}
</CodeRun>
<CodeRun>
{
  `
  var obj = {
    valueOf: function () {
      return {};
    },
    toString: function () {
      return {};
    }
  };
  console.log( Number(obj) ) // TypeError: Cannot convert object to primitive value
  /*
  valueOf和toString方法，返回的都是对象，所以转成数值时会报错。
  */
  `
}
</CodeRun>
<CodeRun>
{
  `
  console.log( Number({
    valueOf: function () {
      return 2;
    }
  }) ) // 2
  console.log( Number({
    toString: function () {
      return 3;
    }
  }) ) // 3
  console.log( Number({
    valueOf: function () {
      return 2;
    },
    toString: function () {
      return 3;
    }
  }) ) // 2
  `
}
</CodeRun>

#### `String()`
1. 参数是原始类型值

转换规则：
- 数值：转为相应的字符串。
- 字符串：转换后还是原来的值。
- 布尔值：true转为字符串"true"，false转为字符串"false"。
- `undefined`：转为字符串"undefined"。
- `null`：转为字符串"null"。
<CodeRun>
{
  `
  console.log( String(123) )       // "123"
  console.log( String('abc') )     // "abc"
  console.log( String(true) )      // "true"
  console.log( String(undefined) ) // "undefined"
  console.log( String(null) )      // "null"
  `
}
</CodeRun>

2. 参数是对象

转换规则：
- 先调用对象自身的 `toString` 方法。如果返回原始类型的值，则对该值使用String函数，不再进行以下步骤。
- 如果 `toString` 方法返回的是对象，再调用原对象的 `valueOf` 方法。如果 `valueOf` 方法返回原始类型的值，则对该值使用String函数，不再进行以下步骤。
- 如果 `valueOf` 方法返回的是对象，就报错。
<CodeRun>
{
  `
  console.log( String([1, 2, 3]) ) // "1,2,3"
  console.log( String([{a:1}, {b:2}, {c:3}]) ) // "[object Object],[object Object],[object Object]"
  console.log( [1, 2, 3].toString() )
  console.log( [{a:1}, {b:2}, {c:3}].toString() )
  // 先调用对象{a: 1}的toString方法，发现返回的是字符串[object Object]，就不再调用valueOf方法了
  console.log( String({a: 1}) )    // "[object Object]"
  console.log( {a: 1}.toString() )
  `
}
</CodeRun>
<CodeRun>
{
  `
  // toString和valueOf方法，返回的都是对象，就会报错
  var obj = {
    valueOf: function () {
      return {};
    },
    toString: function () {
      return {};
    }
  };
  console.log( String(obj) ) // TypeError: Cannot convert object to primitive value
  `
}
</CodeRun>
<CodeRun>
{
  `
  console.log( String({
    toString: function () {
      return 3;
    }
  }) ) // "3"
  console.log( String({
    valueOf: function () {
      return 2;
    }
  }) ) // "[object Object]"
  console.log( String({
    valueOf: function () {
      return 2;
    },
    toString: function () {
      return 3;
    }
  }) ) // "3"
  `
}
</CodeRun>

#### `Boolean()`
转换规则：除了以下五个值的转换结果为`false`，其他的值全部为`true`
- `undefined`
- `null`
- `0`（包含`-0` 和 `+0`）
- `NaN`
- ''（空字符串）
<CodeRun>
{
  `
  console.log( Boolean(undefined) ) // false
  console.log( Boolean(null) )      // false
  console.log( Boolean(0) )         // false
  console.log( Boolean(NaN) )       // false
  console.log( Boolean('') )        // false
  `
}
</CodeRun>

:::warning
注意，所有对象（包括空对象）的转换结果都是`true`，甚至连`false`对应的布尔对象`new Boolean(false)`也是`true`
<CodeRun>
{
  `
  console.log( Boolean({}) )                 // true
  console.log( Boolean([]) )                 // true
  console.log( Boolean(new Boolean(false)) ) // true
  `
}
</CodeRun>
:::

### 自动转换
遇到以下三种情况时，JavaScript 会自动转换数据类型:
1. 不同类型的数据互相运算。虽然变量的数据类型是不确定的，但是各种运算符对数据类型是有要求的。如果运算符发现，运算元的类型与预期不符，就会自动转换类型。
   - **除了加法运算符（+）有可能把运算元转为字符串，其他运算符都会把运算元自动转成数值（会自动调用`Number()`函数）**。
   - 字符串的自动转换，主要发生在字符串的加法运算时，只要任意一个运算元是字符串，那么另一个运算元也将被转化为字符串（会自动调用`String()`函数）。
<CodeRun>
{
  `
  console.log( "6" / "2" )           // 3
  console.log( '5' - '2' )           // 3
  console.log( '5' * '2' )           // 10
  console.log( true - 1 )            // 0
  console.log( false - 1 )           // -1
  console.log( '1' - 1 )             // 0
  console.log( '5' * [] )            // 0
  console.log( false / '5' )         // 0
  console.log( 'abc' - 1 )           // NaN
  console.log( null + 1 )            // 1
  console.log( undefined + 1 )       // NaN
  console.log( "" + 1 + 0 )          // "10"
  console.log( "" - 1 + 0 )          // -1
  console.log( "  -9  " + 5 )        // "  -9  5"
  console.log( "  -9  " - 5 )        // -14
  `
}
</CodeRun>

   ```js
   console.log( " \t \n" - 2 )        // -2
   ```
   <CodeRun>
   {
     `
     console.log( 123 + 'abc' )         // "123abc"
     console.log( '5' + 1 )             // '51'
     console.log( '5' + true )          // "5true"
     console.log( '5' + false )         // "5false"
     console.log( '5' + {} )            // "5[object Object]"
     console.log( '5' + [] )            // "5"
     console.log( '5' + function (){} ) // "5function (){}"
     console.log( '5' + undefined )     // "5undefined"
     console.log( '5' + null )          // "5null"
     `
   }
   </CodeRun>

2. JavaScript 遇到预期为布尔值的地方（比如if语句的条件部分），就会将非布尔值的参数自动转换为布尔值（会自动调用`Boolean()`函数）。
<CodeRun>
{
  `
  if ('abc') {
    console.log('hello')
  }
  // 下面两种写法，有时也用于将一个表达式转为布尔值。它们内部调用的也是Boolean()函数。
  // 写法一
  expression ? true : false
  // 写法二
  !! expression
  `
}
</CodeRun>

3. 对非数值类型的值使用一元运算符（即+和-），会把运算元转成数值。
<CodeRun>
{
  `
  console.log( +{foo: 'bar'} )  // NaN
  console.log( -[1, 2, 3] )     // NaN
  console.log( +'abc' )         // NaN
  console.log( -'abc' )         // NaN
  console.log( +true )          // 1
  console.log( -false )         // 0
  console.log( +"" )            // 0
  `
}
</CodeRun>

## 运算符
所有的运算符中都隐含着优先级顺序。[优先级汇总表](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Operator_Precedence#%E6%B1%87%E6%80%BB%E8%A1%A8)
- 圆括号拥有最高优先级
- 一元运算符优先级高于二元运算符
- 如果优先级相同，则按照由左至右的顺序执行

### 赋值运算符
在 JavaScript 中，所有运算符都会返回一个值。**语句 `x = value` 将值 `value` 写入 `x` 然后返回 `value`。**
```js
// (a = b + 1) 的结果是 赋给 a 的值（也就是 3）。然后该值被用于进一步的运算。
let a = 1;
let b = 2;

let c = 3 - (a = b + 1);

alert( a ); // 3
alert( c ); // 0
```

### “修改并赋值”运算符
所有算术和位运算符都有简短的“修改并赋值”运算符：`/=` 和 `-=` 等。这类运算符的优先级与普通赋值运算符的优先级相同，所以它们在大多数其他运算之后执行:
<CodeRun>
{
  `
  let n = 2;
  n *= 3 + 5;
  console.log( n ); // 16 （右边部分先被计算，等同于 n *= 8）
  `
}
</CodeRun>

### 位运算符
- 按位与 ( `&` )
- 按位或 ( `|` )
- 按位异或 ( `^` )
- 按位非 ( `~` )
- 左移 ( `<<` )
- 右移 ( `>>` )
- 无符号右移 ( `>>>` )

### 逗号运算符
逗号运算符能让我们处理多个表达式，使用 `,` 将它们分开，每个表达式都运行了，但是只有最后一个的结果会被返回。
<CodeRun>
{
  `
  let a = (1 + 2, 3 + 4); // 逗号运算符的优先级非常低，比 = 还要低，因此此处圆括号非常重要
  console.log(a) // 7（3 + 4 的结果）
  // 一行上有三个运算符
  for (a = 1, b = 3, c = a * b; a < 10; a++) {
   // ...
  }
  `
}
</CodeRun>

### 逻辑运算符
JavaScript 中有四个逻辑运算符：`||`（或），`&&`（与），`!`（非），`??`（空值合并运算符, Nullish Coalescing）。

#### 或运算寻找第一个真值
一个或运算 `||` 的链，将返回第一个真值，如果不存在真值，就返回该链的最后一个值。
```js
result = value1 || value2 || value3;
```
- 从左到右依次计算操作数。
- 处理每一个操作数时，**都将其转化为布尔值**。如果结果是 `true`，就停止计算，返回这个操作数的初始值。
- 如果所有的操作数都被计算过（也就是，转换结果都是 `false`），则返回最后一个操作数。
<CodeRun>
{
  `
  console.log( 1 || 0 );                 // 1（1 是真值）
  console.log( null || 1 );              // 1（1 是第一个真值）
  console.log( null || 0 || 1 );         // 1（第一个真值）
  console.log( undefined || null || 0 ); // 0（都是假值，返回最后一个值）
  `
}
</CodeRun>

#### 短路求值（Short-circuit evaluation）
- 或运算符 `||` 在遇到 “真值” 时立即停止运算
<CodeRun>
{
  `
  // 或运算符 || 在遇到 true 时立即停止运算
  true || console.log("not printed");
  false || console.log("printed");
  // 先输出1然后输出2
  // 第一个或运算 || 对它的左值 console.log(1) 进行了计算。这就显示了第一条信息 1。
  // 函数console.log没有返回值，或者说返回的是 undefined。所以或运算继续检查第二个操作数以寻找真值
  console.log( console.log(1) || 2 || console.log(3) );
  `
}
</CodeRun>

- 与运算符 `&&` 在遇到 “假值” 时立即停止运算
<CodeRun>
{
  `
  // 先输出1然后输出undefined
  console.log( console.log(1) && console.log(2) );
  `
}
</CodeRun>

#### 与运算寻找第一个假值
与运算返回第一个假值，如果没有假值就返回最后一个值。
```js
result = value1 && value2 && value3;
```
- 从左到右依次计算操作数。
- 在处理每一个操作数时，都将其转化为布尔值。如果结果是 `false`，就停止计算，并返回这个操作数的初始值。
- 如果所有的操作数都被计算过（例如都是真值），则返回最后一个操作数。
<CodeRun>
{
  `
  // 与运算寻找第一个假值，找不到就返回最后一个操作数的初始值
  console.log( 1 && 0 );                // 0
  console.log( 1 && 5 );                // 5
  console.log( 1 && 2 && null && 3 );   // null
  // 如果第一个操作数是假值，
  // 与运算将直接返回它。后面的操作数会被忽略
  console.log( null && 5 );             // null
  console.log( 0 && "no matter what" ); // 0
  `
}
</CodeRun>

:::tip
与运算 `&&` 的优先级比或运算 `||` 要高。`a && b || c && d` 等同于 `(a && b) || (c && d)`
<CodeRun>
{
  `
  // 与运算 && 的优先级比 || 高，所以它第一个被执行。
  console.log( null || 2 && 3 || 4 );
  `
}
</CodeRun>
:::

#### 逻辑非运算符
逻辑非运算符接受一个参数，并按如下运作：
1. 将操作数转化为布尔类型：`true` 或 `false`。
2. 返回相反的值。

- **两个非运算 `!!` 用来将某个值转化为布尔类型**
<CodeRun>
{
  `
  // 第一个非运算将该值转化为布尔类型并取反，第二个非运算再次取反。
  console.log( !!"non-empty string" );        // true
  console.log( !!null );                      // false
  // 内建的 Boolean 函数也可以实现同样的效果
  console.log( Boolean("non-empty string") ); // true
  console.log( Boolean(null) );               // false
  `
}
</CodeRun>

- 非运算符 `!` 的优先级在所有逻辑运算符里面最高

#### 空值合并运算符`??`
如果第一个操作数不是 `null` 或 `undefined`，则 `??` 返回第一个操作数。否则，返回第二个操作数。
```js
result = a ?? b;
// 等同于
result = (a !== null && a !== undefined) ? a : b;
```

`||` 无法区分 `false`、`0`、空字符串 ""、 `null`、`undefined`。它们都一样是假值（falsy values）。如果其中任何一个是 `||` 的第一个操作数，那么我们将得到第二个操作数作为结果。
```js
let height = 0;
console.log(height || 100); // 100
console.log(height ?? 100); // 0
```

`??` 运算符的优先级与 `||` 相同

## 值的比较
### 字符串比较
字符串是按字符（母）逐个进行比较的(遵循 Unicode 编码顺序)：
1. 首先比较两个字符串的首位字符大小。
2. 如果一方字符较大（或较小），则该字符串大于（或小于）另一个字符串。算法结束。
3. 否则，如果两个字符串的首位字符相等，则继续取出两个字符串各自的后一位字符进行比较。
4. 重复上述步骤进行比较，直到比较完成某字符串的所有字符为止。
5. 如果两个字符串的字符同时用完，那么则判定它们相等，否则未结束（还有未比较的字符）的字符串更大。
<CodeRun>
{
  `
  console.log( 'Z' > 'A' );       // true
  console.log( 'Glow' > 'Glee' ); // true
  console.log( 'Bee' > 'Be' );    // true
  `
}
</CodeRun>

:::tip
字符串比较对字母大小写是敏感的。大写的 "A" 并不等于小写的 "a"。小写的 "a" 更大。这是因为在 JavaScript 使用的内部编码表中（Unicode），小写字母的字符索引值更大。
:::

### 不同类型间的比较
**当对不同类型的值进行比较时，JavaScript 会首先将其转化为数字（number）再判定大小。**
:::warning
`undefined` 和 `null` 在相等性检查 `==` 中不会进行任何的类型转换，它们有自己独立的比较规则: 除了它们之间互等外，不会等于任何其他的值。
:::

<CodeRun>
{
  `
  console.log( '2' > 1 );    // true，字符串 '2' 会被转化为数字 2
  console.log( '01' == 1 );  // true，字符串 '01' 会被转化为数字 1
  // 对于布尔类型值，true 会被转化为 1、false 转化为 0
  console.log( true == 1 );  // true
  console.log( false == 0 ); // true
  console.log( "2" > "12" ); // true 注意：不同类型的值进行比较时会先将其转化为数字再判定大小；同类型字符串比较按 Unicode 编码顺序比较，首位字符 "2" 大于 "1"
  `
}
</CodeRun>

#### 严格相等
普通的相等性检查 `==` 存在一个问题，它不能区分出 `0` 和 `false` 以及 空字符串 和 `false`，这是因为在比较不同类型的值时，处于相等判断符号 `==` 两侧的值会先被转化为数字。空字符串和 `false` 也是如此，转化后它们都为数字 `0`。
<CodeRun>
{
  `
  console.log( 0 == false );  // true
  console.log( '' == false ); // true
  `
}
</CodeRun>

严格相等运算符 `===` 在进行比较时不会做任何的类型转换。换句话说，如果 `a` 和 `b` 属于不同的数据类型，那么 `a === b` 不会做任何的类型转换而立刻返回 `false`。
<CodeRun>
{
  `
  console.log( 0 === false ); // false，因为被比较值的数据类型不同
  `
}
</CodeRun>

#### `null` 或 `undefined` 参与的值比较
1. 当使用严格相等 `===` 比较二者时，它们不相等，因为它们属于不同的类型。
   <CodeRun>
   {
    `
    console.log( null === undefined ); // false
    `
   }
   </CodeRun>

2. **当使用非严格相等 `==` 比较时，`null`、`undefined`仅仅等于对方而不等于其他任何的值。**
<CodeRun>
{
  `
  console.log( undefined == null ) // true
  console.log( undefined == 0 )    // false
  console.log( null == 0 )         // false
  `
}
</CodeRun>

3. 当使用数学式或其他比较方法 `<` `>` `<=` `>=` 时，`null`、`undefined` 会被转化为数字：`null` 被转化为 `0`，`undefined` 被转化为 `NaN`。**`NaN` 是一个特殊的数值型值，它与任何值进行比较都会返回 `false`。**
<CodeRun>
{
  `
  console.log( null > 0 );       // false
  console.log( null == 0 );      // false
  console.log( null >= 0 );      // true
  console.log( undefined > 0 );  // false
  console.log( undefined < 0 );  // false
  console.log( undefined == 0 ); // false
  `
}
</CodeRun>

## 循环
循环体的单次执行叫作 一次迭代。
### `for` 循环
```js
for (begin; condition; step) {
  // ……循环体……
}

// 变量 i 是在循环中声明的，这叫做“内联”变量声明
for (let i = 0; i < 3; i++) { // 结果为 0、1、2
  alert(i);
}
```
- `for` 循环的任何语句段都可以被省略。
```js
let i = 0; // 我们已经声明了 i 并对它进行了赋值

for (; i < 3; i++) { // 不再需要 "begin" 语句段
  alert( i ); // 0, 1, 2
}
for (; i < 3;) {
  alert( i++ );
}
for (;;) {
  // 无限循环
}
```

### 使用 `break` 指令跳出循环
```js
let sum = 0;

while (true) {

  let value = +prompt("Enter a number", '');

  if (!value) break; // 执行后立刻终止循环，将控制权传递给循环后的第一行，即alert( 'Sum: ' + sum );

  sum += value;

}
alert( 'Sum: ' + sum );
```

### 使用 `continue` 指令继续下一次迭代
`continue` 不会停掉整个循环，而是停止当前这一次迭代，并强制启动新一轮循环（如果条件允许的话）。
<CodeRun>
{`
for (let i = 0; i < 10; i++) {
  //如果为真，跳过循环体的剩余部分。
  if (i % 2 == 0) continue;
  console.log(i); // 1，然后 3，5，7，9
}
`}
</CodeRun>

### break/continue 标签
- 用于一次从多层嵌套的循环中跳出来或跳转到标记循环的下一次迭代
- 标签 是在循环之前带有冒号的标识符
  ```js
  labelName: for (...) {
    ...
  }
  ```
- `break <labelName>` 语句跳出循环至标签处
  ```js
  outer: for (let i = 0; i < 3; i++) {

    for (let j = 0; j < 3; j++) {

      let input = prompt(`Value at coords (${i},${j})`, '');

      // 如果是空字符串或被取消，则中断并跳出这两个循环。
      if (!input) break outer; // 执行后 向上寻找名为 outer 的标签并跳出当前循环，控制权转至 alert('Done!')。

      // 用得到的值做些事……
    }
  }

  alert('Done!');
  ```
- `continue` 指令也可以与标签一起使用。在这种情况下，执行跳转到标记循环的下一次迭代。

## `switch` 语句
```js
switch(x) {
  case 'value1':  // if (x === 'value1')
    ...
    [break]

  case 'value2':  // if (x === 'value2')
    ...
    [break]

  default:
    ...
    [break]
}
```
- 比较 `x` 值与第一个 `case`（也就是 `value1`）**是否严格相等(被比较的值必须是相同的类型才能进行匹配)**，然后比较第二个 `case`（`value2`）以此类推。
- 如果相等，`switch` 语句就执行相应 `case` 下的代码块，直到遇到最靠近的 `break` 语句（或者直到 `switch` 语句末尾）。
- 如果没有符合的 `case`，则执行 `default` 代码块（如果 `default` 存在）。

- 如果没有 `break`，程序将不经过任何检查就会继续执行下一个 `case`。
  <CodeRun>
  {`
  let a = 2 + 2;
  switch (a) {
    case 3:
      console.log( 'Too small' );
    case 4:
      console.log( 'Exactly!' );
    case 5:
      console.log( 'Too big' );
    default:
      console.log( "I don't know such values" );
  }
  `}
  </CodeRun>

- `switch` 和 `case` 都允许任意表达式。
  <CodeRun>
  {`
  let a = "1";
  let b = 0;
  switch (+a) {
    case b + 1:
      console.log("this runs, because +a is 1, exactly equals b+1");
      break;
    default:
      console.log("this doesn't run");
  }
  `}
  </CodeRun>

- 共享同一段代码的几个 `case` 分支可以被分为一组
  <CodeRun>
  {`
  let a = 3;
  switch (a) {
    case 4:
      console.log('Right!');
      break;
    case 3: // (*) 下面这两个 case 被分在一组
    case 5:
      console.log('Wrong!');
      console.log("Why don't you take a math class?");
      break;
    default:
      console.log('The result is strange. Really.');
  }
  `}
  </CodeRun>

## 函数
- 在函数中声明的变量只在该函数内部可见。
- 函数对外部变量拥有全部的访问权限。函数也可以修改外部变量。
  <CodeRun>
  {`
  let userName = 'John';
  function showMessage() {
    userName = "Bob"; // (1) 改变外部变量
    let message = 'Hello, ' + userName;
    console.log(message);
  }
  console.log( userName ); // John 在函数调用之前
  showMessage();
  console.log( userName ); // Bob，值被函数修改了
  `}
  </CodeRun>
- 只有在没有局部变量的情况下才会使用外部变量。
  <CodeRun>
  {`
  let userName = 'John';
  function showMessage() {
    let userName = "Bob"; // 声明一个局部变量
    let message = 'Hello, ' + userName; // Bob
    console.log(message);
  }
  // 函数会创建并使用它自己的 userName
  showMessage();
  console.log( userName ); // John，未被更改，函数没有访问外部变量。
  `}
  </CodeRun>
- 函数的参数也是局部变量。作为参数传递给函数的值，会被复制到函数的局部变量。
  <CodeRun>
  {`
  function showMessage(from, text) {
    from = '*' + from + '*'; // 让 "from" 看起来更优雅
    console.log( from + ': ' + text );
  }
  let from = "Ann";
  showMessage(from, "Hello"); // *Ann*: Hello
  // "from" 值相同，函数修改了一个局部的副本。
  console.log( from ); // Ann
  `}
  </CodeRun>
- 在 JavaScript 中，每次函数在没带个别参数的情况下被调用，默认参数会被计算出来。
  ```js
  function showMessage(from, text = anotherFunction()) {
    // anotherFunction() 仅在没有给定 text 时执行
    // 其运行结果将成为 text 的值
    // 如果传递了参数 text，那么 anotherFunction() 就不会被调用。
  }
  ```
- 空值的 `return` 或没有 `return` 的函数返回值为 `undefined`
  <CodeRun>
  {`
  function doNothing() { /* 没有代码 */ }
  console.log( doNothing() === undefined ); // true
  function doNothing2() {
    return;
  }
  console.log( doNothing2() === undefined ); // true
  `}
  </CodeRun>

### 函数表达式
-  用 函数声明 的方式创建函数
  ```js
  function sum(a, b) {
    return a + b;
  }
  ```
- 用 函数表达式 的方式创建函数
  ```js
  let sum = function(a, b) {
    return a + b;
  };
  ```

- JavaScript 引擎 对于 函数声明 与 函数表达式 创建函数的时机不同。在函数声明被定义之前，它就可以被调用。例如，一个全局函数声明对整个脚本来说都是可见的，无论它被写在这个脚本的哪个位置。这是内部算法的缘故。当 JavaScript 准备 运行脚本时，首先会在脚本中寻找全局函数声明，并创建这些函数。我们可以将其视为“初始化阶段”。在处理完所有函数声明后，代码才被执行。所以运行时能够使用这些函数。
  <CodeRun>
  {`
  sayHi("John"); // 在函数声明被定义之前，它就可以被调用
  function sayHi(name) { // 函数声明 sayHi 是在 JavaScript 准备运行脚本时被创建的，在这个脚本的任何位置都可见。
    console.log( 'Hello' + name );
  }
  `}
  </CodeRun>

- 函数表达式 是在代码执行到它时才会被创建，并且仅从那一刻起可用。一旦代码执行到赋值表达式 `let sum = function…` 的右侧，此时就会开始创建该函数，并且可以从现在开始使用（分配，调用等）。
  <CodeRun>
  {`
  sayHi("John"); // ReferenceError: sayHi is not defined
  let sayHi = function(name) {
    console.log( 'Hello' + name );
  };
  `}
  </CodeRun>

- 严格模式下，当一个函数声明在一个代码块内时，它在该代码块内的任何位置都是可见的。但在代码块外不可见。
  ```js
  let age = 16;

  if (age < 18) {
    welcome();               // \   (运行)
                             //  |
    function welcome() {     //  |
      alert("Hello!");       //  |  函数声明在声明它的代码块内任意位置都可用
    }                        //  |
                             //  |
    welcome();               // /   (运行)

  } else {

    function welcome() {
      alert("Greetings!");
    }
  }

  // 在这里，我们在花括号外部调用函数，我们看不到它们内部的函数声明。
  welcome(); // Error: welcome is not defined
  ```
  ```js
  // 使用函数表达式
  let age = prompt("What is your age?", 18);

  let welcome;

  if (age < 18) {

    welcome = function() {
      alert("Hello!");
    };

  } else {

    welcome = function() {
      alert("Greetings!");
    };

  }

  welcome(); // 现在可以了
  ```
  ```js
  // 使用问号运算符 ? 来进一步对代码进行简化
  let age = prompt("What is your age?", 18);

  let welcome = (age < 18) ?
    function() { alert("Hello!"); } :
    function() { alert("Greetings!"); };

  welcome(); // 现在可以了
  ```

- 无论函数是如何创建的，函数都是一个值。可以像使用其他类型的值一样使用它。
  ```js
  function sayHi() {   // 声明创建了函数，并把它放入到变量 sayHi
    alert( "Hello" );
  }

  let func = sayHi;    // 将 sayHi 复制到了变量 func

  func();              // 运行复制的值（正常运行）输出 Hello
  sayHi();             // 运行输出 Hello
  ```

- 在大多数情况下，当我们需要声明一个函数时，最好使用函数声明，因为函数在被声明之前也是可见的。这使我们在代码组织方面更具灵活性，通常也会使得代码可读性更高。仅当函数声明不适合对应的任务时，才应使用函数表达式。

### 回调函数
主要思想是我们传递一个函数，并期望在稍后必要时将其“回调”。如下例子中，`showOk` 是回答 “yes” 的回调，`showCancel` 是回答 “no” 的回调。
```js
function ask(question, yes, no) {
  if (confirm(question)) yes()
  else no();
}

function showOk() {
  alert( "You agreed." );
}

function showCancel() {
  alert( "You canceled the execution." );
}

// 用法：函数 showOk 和 showCancel 被作为参数传入到 ask
ask("Do you agree?", showOk, showCancel);
```

- 可以使用函数表达式来编写一个等价的、更简洁的函数。直接在 `ask(...)` 调用内声明两个匿名函数，这样的函数在 `ask` 外无法访问（因为没有对它们分配变量），这正符合 JavaScript 语言的思想。
  ```js
  function ask(question, yes, no) {
    if (confirm(question)) yes()
    else no();
  }

  ask(
    "Do you agree?",
    function() { alert("You agreed."); },
    function() { alert("You canceled the execution."); }
  );
  ```

- [如何将js回调函数中的数据返回给最外层函数？](https://segmentfault.com/q/1010000013400193/a-1020000013407882)

### 箭头函数
创建函数还有另外一种非常简单的语法，并且这种方法通常比函数表达式更好，即箭头函数:
```js
// 创建了一个函数 func，它接受参数 arg1..argN，然后使用参数对右侧的 expression 求值并返回其结果
let func = (arg1, arg2, ..., argN) => expression;

// 上面是下面这段代码的更短的版本
let func = function(arg1, arg2, ..., argN) {
  return expression;
};

// 如果没有参数，括号则是空的（但括号必须保留）
let sayHi = () => alert("Hello!");
```

- 箭头函数可以像函数表达式一样使用。
  ```js
  let age = prompt("What is your age?", 18);

  let welcome = (age < 18) ?
    () => alert('Hello!') :
    () => alert("Greetings!");

  welcome();
  ```

- 多行的箭头函数: 用花括号括起来，需要包含 return 才能返回值
  ```js
  let sum = (a, b) => {  // 花括号表示开始一个多行函数
    let result = a + b;
    return result; // 如果我们使用了花括号，那么我们需要一个显式的 “return”
  };

  alert( sum(1, 2) ); // 3
  ```

- 箭头函数没有自己的 `this`。当我们并不想要一个独立的 `this`，反而想从外部上下文中获取时，它很有用。
  <CodeRun>{`
  let user = {
    firstName: "Ilya",
    sayHi() {
      let arrow = () => console.log(this.firstName);
      arrow();
    }
  };
  user.sayHi(); // Ilya
  `}</CodeRun>

### 构造函数
构造函数(或简称构造器)在技术上是常规函数。不过有两个约定：
- 它们的命名以大写字母开头。
- 它们只能由 `new` 操作符来执行。

<CodeRun>{`
function User(name) {
  this.name = name;
  this.isAdmin = false;
}
let user = new User("Jack");
console.log(user.name);    // Jack
console.log(user.isAdmin); // false
`}</CodeRun>

`new User(...)` 做的事情可以简单理解为：
```js
function User(name) {
  // this = {};（隐式创建）

  // 添加属性到 this
  this.name = name;
  this.isAdmin = false;

  // return this;（隐式返回）
}
```

```js
function User(name) {
  this.name = name;
  // 添加方法到 this
  this.sayHi = function() {
    alert( "My name is: " + this.name );
  };
}

let john = new User("John");

john.sayHi(); // My name is: John

/*
john = {
  name: "John",
  sayHi: function() { ... }
}
*/
```

- 构造器的主要目的: 创建多个类似的对象。
- 从技术上讲，任何函数（除了箭头函数，它没有自己的 `this`）都可以用作构造器。
- 如果没有参数，可以省略括号，但不建议这样做
  ```js
  let user = new User; // <-- 没有参数
  // 等同于
  let user = new User();
  ```

#### `new function() { … }`
可以用 `new function() { … }` 封装构建单个对象的代码，而无需将来重用。这个构造函数不能被再次调用，因为它不保存在任何地方，只是被创建和调用。如果我们有许多行用于创建单个复杂对象的代码，就可以使用 `new function() { … }`，例如：
```js
let user = new function() {
  this.name = "John";
  this.isAdmin = false;

  // ……用于用户创建的其他代码
  // 也许是复杂的逻辑和语句
  // 局部变量等
};
```

#### `new.target`
在一个函数内部，我们可以使用 `new.target` 属性来检查它是否被使用 `new` 进行调用了。对于常规调用，它为 `undefined`，对于使用 `new` 的调用，则等于该函数。
<CodeRun>{`
function User() {
  console.log(new.target);
}
// 不带 "new"：
User();      // undefined
// 带 "new"：
new User();  // function User { ... }
`}</CodeRun>

如下方式有时被用在库中以使语法更加灵活。这样人们在调用函数时，无论是否使用了 `new`，程序都能工作。
<CodeRun>{`
function User(name) {
  if (!new.target) { // 如果你没有通过 new 运行我
    return new User(name); // ……我会给你添加 new
  }
  this.name = name;
}
let john = User("John");
console.log(john.name); // John
`}</CodeRun>

#### 构造器的`return`
通常，构造器没有 `return` 语句。如果有，则：
- 如果 `return` 返回的是一个对象，则返回这个对象，而不是 `this`。
- 如果 `return` 返回的是一个原始类型，则忽略。

<CodeRun>{`
function BigUser() {
  this.name = "John";
  return { name: "Godzilla" };  // <-- 返回这个对象
}
console.log( new BigUser().name );  // Godzilla
`}</CodeRun>
<CodeRun>{`
function SmallUser() {
  this.name = "John";
  return; // <-- 返回 this
}
console.log( new SmallUser().name );  // John
`}</CodeRun>

### pure functions and side effects
[What are Pure Functions and Side Effects in JavaScript?](https://blog.greenroots.info/what-are-pure-functions-and-side-effects-in-javascript)

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

## ES2015风格的计算属性命名功能
> [计算属性名](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Object_initializer#%E8%AE%A1%E7%AE%97%E5%B1%9E%E6%80%A7%E5%90%8D)

ES2015中，使用字面量创建对象时也可以使用变量来创建属性名，具体方案是使用计算属性名（computed property name），使用形式是 `[property]` 或 `[表达式]`，如：
```js
var i = 1;
var obj = {
  [i]: 3
};
console.log(obj); // {'1': 3}

var obj = {
  a: 1
};
obj.b = 2;
var k = 'c';
obj[k] = 3;
obj['a'] = 0;
console.log(obj);

// [表达式]
var i = 0;
var a = {
  ["foo" + ++i]: i,
  ["foo" + ++i]: i,
  ["foo" + ++i]: i
};

console.log(a.foo1); // 1
console.log(a.foo2); // 2
console.log(a.foo3); // 3

var param = 'size';
var config = {
  [param]: 12,
  ["mobile" + param.charAt(0).toUpperCase() + param.slice(1)]: 4
};

console.log(config); // { size: 12, mobileSize: 4 }
```

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
