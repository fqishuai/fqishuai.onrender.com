---
slug: doc
tags: [ts]
---

:::tip
[阮一峰ts教程](https://wangdoc.com/typescript/)

[TypeScript](https://www.typescriptlang.org/) 是一种基于 JavaScript 构建的强类型编程语言。

[TypeScript Playground](http://www.typescriptlang.org/play/) 是TypeScript在线编译页面

`tsc` is the TypeScript compiler which will take our TypeScript code and compile it to JavaScript.

当 import 一个没有类型声明的第三方库时，TypeScript 不知道 import 进来的东西是什么类型，只能偷偷地把它指定成 any 类型，这也就是我们常说的隐式 any（implicit any）。所有正常的前端项目都会禁止 implicit any 出现，所以会报错。
:::

## [模块Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
> 从 ECMAScript 2015 开始，JavaScript 有了模块的概念。
- TypeScript 也有这个概念。模块在自己的范围内执行，而不是在全局范围内执行；这意味着在模块中声明的变量、函数、类等在模块外部不可见，除非使用其中一种导出形式显式导出它们。相反，要使用从不同模块导出的变量、函数、类、接口等，必须使用其中一种导入形式导入。

- 模块是声明性的；模块之间的关系是根据文件级别的导入和导出来指定的。

- 模块使用模块加载器(module loader)相互导入。在运行时，模块加载器负责在执行模块之前定位并执行模块的所有依赖项。 JavaScript 中使用的众所周知的模块加载器是 Node.js 的 CommonJS 模块加载器和 Web 应用程序中 AMD 模块的 RequireJS 加载器。

- 在 TypeScript 中，就像在 ECMAScript 2015 中一样，任何包含顶级导入或导出的文件都被视为一个模块。相反，没有任何顶级导入或导出声明的文件被视为一个脚本，其内容在全局范围内可用（因此也适用于模块）。

```ts title="StringValidator.ts"
export interface StringValidator {
  isAcceptable(s: string): boolean;
}
```
```ts title="ZipCodeValidator.ts"
import { StringValidator } from "./StringValidator";

export const numberRegexp = /^[0-9]+$/;
export class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
```

## 命名空间
> 命名空间一个最明确的目的就是解决重名问题。

- 命名空间定义了标识符的可见范围，一个标识符可在多个名字空间中定义，它在不同名字空间中的含义是互不相干的。
- 如果我们需要在外部可以调用 一个命名空间 中的类和接口，则需要在类和接口添加 `export` 关键字
- TypeScript 中命名空间使用 namespace 来定义，语法格式如下：
```ts
namespace SomeNameSpaceName { 
  export interface ISomeInterfaceName {      }  
  export class SomeClassName {      }  
}
```
- 使用命名空间的类和接口的语法格式为：`SomeNameSpaceName.SomeClassName`

- 在ts文件中使用一个命名空间，应该使用三斜杠 /// 引用它，语法格式如下：
```ts title="IShape.ts"
namespace Drawing { 
  export interface IShape { 
    draw(); 
  }
}
```
```ts title="Circle.ts"
/// <reference path = "IShape.ts" /> 
namespace Drawing { 
  export class Circle implements IShape { 
    public draw() { 
      console.log("Circle is drawn"); 
    }  
  }
}
```
```ts title="Triangle.ts"
/// <reference path = "IShape.ts" /> 
namespace Drawing { 
  export class Triangle implements IShape { 
    public draw() { 
      console.log("Triangle is drawn"); 
    } 
  } 
}
```
```ts title="TestShape.ts"
/// <reference path = "IShape.ts" />   
/// <reference path = "Circle.ts" /> 
/// <reference path = "Triangle.ts" />  
function drawAllShapes(shape:Drawing.IShape) { 
  shape.draw(); 
} 
drawAllShapes(new Drawing.Circle());
drawAllShapes(new Drawing.Triangle());
```

## 声明文件
:::tip
- TypeScript 作为 JavaScript 的超集，在开发过程中不可避免要引用其他第三方的 JavaScript 的库。虽然通过直接引用可以调用库的类和方法，但是却无法使用TypeScript 诸如类型检查等特性功能。声明文件用于解决该问题。
- 声明文件不包含实现，它只是类型声明。
:::
- 声明文件以 .d.ts 为后缀
- 声明文件或模块的语法格式如下：
```ts
declare module Module_Name {
}
```
- TypeScript 引入声明文件语法格式：
```ts
/// <reference path = "xxx.d.ts" />
```

### 例子
- 假如定义了一个第三方库`CalcThirdPartyJsLib.js`
```js
var Runoob;  
(function(Runoob) {
  var Calc = (function () { 
    function Calc() { 
    } 
  })
  Calc.prototype.doSum = function (limit) {
    var sum = 0; 

    for (var i = 0; i <= limit; i++) { 
      sum = sum + i; 
    }
    return sum; 
  }
  Runoob.Calc = Calc; 
  return Calc; 
})(Runoob || (Runoob = {})); 
var test = new Runoob.Calc();
```

- 如果想在 TypeScript 中引用上面的代码，则需要设置声明文件，比如`Calc.d.ts`
```ts
declare module Runoob {
  export class Calc { 
    doSum(limit:number) : number; 
  }
}
```

- 在ts文件中使用
```ts title="CalcTest.ts"
/// <reference path = "Calc.d.ts" /> 
var obj = new Runoob.Calc(); 
// obj.doSum("Hello"); // 编译错误，因为需要传入数字参数
console.log(obj.doSum(10));
```

- 使用 tsc 命令来编译 `tsc CalcTest.ts`，生成的 JavaScript 代码如下：
```js title="CalcTest.js"
/// <reference path = "Calc.d.ts" /> 
var obj = new Runoob.Calc();
//obj.doSum("Hello"); // 编译错误
console.log(obj.doSum(10));
```

## 枚举Enums
> TypeScript 提供基于数字和字符串的枚举。可以使用 `enum` 关键字定义枚举。

### 1. Numeric enums
- 定义枚举
```ts
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
// Up初始化为1，下面所有成员都从该点开始自动递增。即，Direction.Up 的值为 1，Down 的值为 2，Left 的值为 3，Right 的值为 4。

enum Direction {
  Up,
  Down,
  Left,
  Right,
}
// Up 的值为 0，Down 的值为 1，以此类推。这种自动递增行为对于 我们不关心成员值本身 但关心成员之间的值互不相同的情况很有用
```

- 使用枚举
```ts
enum UserResponse {
  No = 0,
  Yes = 1,
}
 
function respond(recipient: string, message: UserResponse): void {
  // ...
}
 
respond("Princess Caroline", UserResponse.Yes);
```

:::tip
没有初始值设定项的枚举要么需要放在首位，要么必须在 使用数字常量或其他常量初始化 的数字枚举之后。
```ts
// 以下会报错：Enum member must have initializer.
enum E {
  A = getSomeValue(),
  B,
}
```
:::

### 2. String enums
> 在字符串枚举中，每个成员都必须使用字符串文字或另一个字符串枚举成员进行常量初始化。
```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

## 类型推断
:::tip
- 类型声明并不是必需的，如果没有，TypeScript 会自己推断类型。TypeScript 也可以推断函数的返回值。

- TypeScript 的设计思想是，类型声明是可选的，你可以加，也可以不加。即使不加类型声明，依然是有效的 TypeScript 代码，只是这时不能保证 TypeScript 会正确推断出类型。由于这个原因，所有 JavaScript 代码都是合法的 TypeScript 代码。
:::

```js
let foo = 123;
foo = 'hello'; // 报错 Type 'string' is not assignable to type 'number'.
```
上面示例中，变量foo并没有类型声明，TypeScript 就会推断它的类型。由于它被赋值为一个数值，因此 TypeScript 推断它的类型为number。
后面，如果变量foo更改为其他类型的值，跟推断的类型不一致，TypeScript 就会报错。

```js
function toString(num:number) {
  return String(num);
}
```
上面示例中，函数`toString()`没有声明返回值的类型，但是 TypeScript 推断返回的是字符串。**正是因为 TypeScript 的类型推断，所以函数返回值的类型通常是省略不写的。**

## TypeScript 的编译
:::tip
- JavaScript 的运行环境（浏览器和 Node.js）不认识 TypeScript 代码。所以，TypeScript 项目要想运行，必须先转为 JavaScript 代码，这个代码转换的过程就叫做“编译”（compile）。

- TypeScript 官方没有做运行环境，只提供编译器。**编译时，会将类型声明和类型相关的代码全部删除，只留下能运行的 JavaScript 代码，并且不会改变 JavaScript 的运行结果。**

- 因此，TypeScript 的类型检查只是编译时的类型检查，而不是运行时的类型检查。一旦代码编译为 JavaScript，运行时就不再检查类型了。

- TypeScript 项目里面，其实存在两种代码，一种是底层的“值代码”，另一种是上层的“类型代码”。前者使用 JavaScript 语法，后者使用 TypeScript 的类型语法。TypeScript 的编译过程，实际上就是把“类型代码”全部拿掉，只保留“值代码”。
:::

### tsc 编译器
TypeScript 官方提供的编译器叫做 tsc。可以全局安装 tsc，也可以在项目中将 tsc 安装为一个依赖模块。
```bash
# 全局安装 tsc
npm install -g typescript
# 检查一下是否安装成功
tsc -v
```

下面命令会在当前目录下，生成一个`app.js`脚本文件，这个脚本就是编译后生成的 JavaScript 代码。
```bash
tsc app.ts
```

tsc命令也可以一次编译多个 TypeScript 脚本，下面命令会在当前目录生成三个 JavaScript 脚本文件`file1.js`、`file2.js`、`file3.js`。
```bash
tsc file1.ts file2.ts file3.ts
```

#### tsc 参数
tsc 有很多参数，可以调整编译行为：
- `--outFile` 用于将多个 TypeScript 脚本编译成一个 JavaScript 文件
```bash
tsc file1.ts file2.ts --outFile app.js
```

- `--outDir` 用于指定编译后生成的文件保存的目录（编译结果默认都保存在当前目录）
```bash
tsc app.ts --outDir dist
```

- `--target` 用于指定编译后的 JavaScript 版本。为了保证编译结果能在各种 JavaScript 引擎运行，tsc 默认会将 TypeScript 代码编译成很低版本的 JavaScript，即3.0版本（以es3表示）
```bash
# 指定编译后的 JavaScript 版本 为 es2015
tsc --target es2015 app.ts
```

- `--noEmitOnError` 用于设置一旦报错就停止编译，不生成编译产物（默认情况下如果编译报错，tsc命令就会显示报错信息，但是依然会编译生成 JavaScript 脚本。）
```bash
# 报错后，就不会生成app.js
tsc --noEmitOnError app.ts
```

- `--noEmit` 用于设置只检查类型是否正确，不生成 JavaScript 文件
```bash
# 只检查是否有编译错误，不会生成app.js
tsc --noEmit app.ts
```

- `--noImplicitAny` 用于设置只要推断出any类型就会报错
```bash
tsc --noImplicitAny app.ts
```
:::tip
有一个特殊情况：即使设置了`noImplicitAny`，使用`let`和`var`声明变量时不赋值也不指定类型，是不会报错的。
```ts
// 变量x和y声明时没有赋值，也没有指定类型，TypeScript 会推断它们的类型为any，即使设置了noImplicitAny，也不会报错
var x; // 不报错
let y; // 不报错

x = 123;
x = { foo: 'hello' };
```

由于这个原因，建议使用`let`和`var`声明变量时，如果不赋值，就一定要显式声明类型，否则可能存在安全隐患。
:::

- `--strictNullChecks` 设置`strictNullChecks`以后，赋值为`undefined`的变量会被推断为`undefined`类型，赋值为`null`的变量会被推断为`null`类型；`undefined`和`null`就不能赋值给其他类型的变量（除了`any`类型和`unknown`类型）；`undefined`和`null`这两种值也不能互相赋值了。
```ts
// tsc --strictNullChecks app.ts

let age:number = 24;

age = null;      // 报错 Type 'null' is not assignable to type 'number'.
age = undefined; // 报错 Type 'undefined' is not assignable to type 'number'.

let x:undefined = null; // 报错 Type 'null' is not assignable to type 'undefined'.
let y:null = undefined; // 报错 Type 'undefined' is not assignable to type 'null'.

let x:any = undefined;
let y:unknown = null;
```

#### tsconfig.json
TypeScript 允许将tsc的编译参数，写在配置文件`tsconfig.json`。只要当前目录有这个文件，tsc就会自动读取，所以运行时可以不写参数。`tsc file1.ts file2.ts --outFile dist/app.js` 写成`tsconfig.json`就是下面这样，有了这个配置文件，编译时直接调用tsc命令就可以了`tsc`
```json
{
  "files": ["file1.ts", "file2.ts"],
  "compilerOptions": {
    "outFile": "dist/app.js"
  }
}
```

### ts-node 模块
[ts-node](https://github.com/TypeStrong/ts-node) 是一个非官方的 npm 模块，可以直接运行 TypeScript 代码。如果只是想简单运行 TypeScript 代码看看结果，ts-node 不失为一个便捷的方法。
```bash
# 全局安装
npm install -g ts-node

# 运行 TypeScript 脚本
ts-node script.ts

# 如果不安装 ts-node，也可以通过 npx 调用它来运行 TypeScript 脚本
npx ts-node script.ts
```

如果执行 `ts-node` 命令不带有任何参数，它会提供一个 TypeScript 的命令行 REPL 运行环境，你可以在这个环境中输入 TypeScript 代码，逐行执行。比如执行`npx ts-node`就会提供一个 TypeScript 的命令行 REPL 运行环境。要退出这个 REPL 环境，可以按下 `Ctrl + d`，或者输入`.exit`。

## 类型系统
### 基本类型
:::info
JavaScript 语言（注意，不是 TypeScript）将值分成8种类型。
- boolean
- string
- number
- bigint
- symbol
- object
- undefined
- null

TypeScript 继承了 JavaScript 的类型设计，以上8种类型可以看作 TypeScript 的基本类型。
:::
:::tip
注意，上面所有类型的名称都是小写字母，首字母大写的`Number`、`String`、`Boolean`等在 JavaScript 语言中都是内置对象，而不是类型名称。

另外，`undefined` 和 `null` 既可以作为值，也可以作为类型，取决于在哪里使用它们。作为值，它们有一个特殊的地方：任何其他类型的变量都可以赋值为`undefined`或`null`（不设置`strictNullChecks`的前提下）。
```ts
// strictNullChecks 为 false 的前提下
let age:number = 24;

age = null;      // 正确
age = undefined; // 正确
```
上面代码中，变量age的类型是number，但是赋值为null或undefined并不报错。这并不是因为undefined和null包含在number类型里面，而是故意这样设计，任何类型的变量都可以赋值为undefined和null，以便跟 JavaScript 的行为保持一致。JavaScript 的行为是，变量如果等于undefined就表示还没有赋值，如果等于null就表示值为空。所以，TypeScript 就允许了任何类型的变量都可以赋值为这两个值。
:::

1. `boolean`类型只包含`true`和`false`两个布尔值。
```ts
const x:boolean = true;
const y:boolean = false;
```

2. string类型包含所有字符串。普通字符串和模板字符串都属于 string 类型。
```ts
const x:string = 'hello';
const y:string = `${x} world`;
```

3. number类型包含所有整数和浮点数。整数、浮点数和非十进制数都属于 number 类型。
```ts
const x:number = 123;
const y:number = 3.14;
const z:number = 0xffff;
```

4. bigint 类型包含所有的大整数。
```ts
const x:bigint = 123n;
const y:bigint = 0xffffn;
```
:::tip
- bigint 与 number 类型不兼容。
```ts
// bigint类型赋值为整数和小数，都会报错。
const x:bigint = 123; // 报错 Type 'number' is not assignable to type 'bigint'.
const y:bigint = 3.14; // 报错 Type 'number' is not assignable to type 'bigint'.
```
- bigint 类型是 ES2020 标准引入的。如果使用这个类型，TypeScript 编译的目标 JavaScript 版本不能低于 ES2020（即编译参数`target`不低于`es2020`）。
:::

5. symbol 类型包含所有的 Symbol 值。
```ts
const x:symbol = Symbol();
```

6. object 类型包含了所有对象、数组和函数。
```ts
const x:object = { foo: 123 };
const y:object = [1, 2, 3];
const z:object = (n:number) => n + 1;
```

7. undefined 类型只包含一个值undefined，表示未定义（即还未给出定义，以后可能会有定义）。
```ts
let x:undefined = undefined;
```

8. null 类型也只包含一个值null，表示为空（即此处没有值）。
```ts
const x:null = null;
```
:::tip
没有声明类型的变量被赋值为 `undefined` 或 `null` 时，它们的类型会被推断为 `any`。
```ts
let a = undefined;   // any
const b = undefined; // any

let c = null;        // any
const d = null;      // any
```
可以设置`strictNullChecks`来避免上述情况
```ts
// 设置 strictNullChecks后
let a = undefined;   // undefined
const b = undefined; // undefined

let c = null;        // null
const d = null;      // null
```
:::

### 包装对象类型
:::info
JavaScript 的8种类型之中，`undefined`和`null`其实是两个特殊值，`object`属于复合类型，剩下的5种属于原始类型（primitive value），代表最基本的、不可再分的值。
- boolean
- string
- number
- bigint
- symbol

上面这5种原始类型的值，都有对应的包装对象（wrapper object）。所谓“包装对象”，指的是这些值在需要时，会自动产生的对象。
```js
'hello'.charAt(1) // 'e'
```
上面示例中，字符串hello执行了`charAt()`方法。但是，**在 JavaScript 语言中，只有对象才有方法，原始类型的值本身没有方法。这行代码之所以可以运行，就是因为在调用方法时，字符串会自动转为包装对象**，`charAt()`方法其实是定义在包装对象上。这样的设计省去了将原始类型的值手动转成对象实例的麻烦。

5种包装对象之中，symbol 类型和 bigint 类型无法直接获取它们的包装对象（**`Symbol()` 和 `BigInt()`不能作为构造函数使用**），但是剩下3种可以。
- `Boolean()`
- `String()`
- `Number()`

```js
const s = new String('hello');
typeof s // 'object'
s.charAt(1) // 'e'
```
上面示例中，`s` 就是字符串hello的包装对象，typeof运算符返回object，不是string。

注意，`String()`只有当作构造函数使用时（即带有`new`命令调用），才会返回包装对象。如果当作普通函数使用（不带有`new`命令），返回就是一个普通字符串。其他两个构造函数`Number()`和`Boolean()`也是如此。
:::

**由于包装对象的存在，导致每一个原始类型的值都有包装对象和字面量两种情况。**
```js
'hello' // 字面量
new String('hello') // 包装对象
```
为了区分这两种情况，TypeScript 对5种原始类型分别提供了大写和小写两种类型。
- Boolean 和 boolean
- String 和 string
- Number 和 number
- BigInt 和 bigint
- Symbol 和 symbol

其中，**大写类型同时包含包装对象和字面量两种情况，小写类型只包含字面量，不包含包装对象**。
```ts
const s1:String = 'hello'; // 正确
const s2:String = new String('hello'); // 正确

const s3:string = 'hello'; // 正确
const s4:string = new String('hello'); // 报错 Type 'String' is not assignable to type 'string'. 'string' is a primitive, but 'String' is a wrapper object. Prefer using 'string' when possible.
```
:::tip
建议只使用小写类型，不使用大写类型。因为绝大部分使用原始类型的场合，都是使用字面量，不使用包装对象。而且，TypeScript 把很多内置方法的参数，定义成小写类型，使用大写类型会报错。
```ts
const n1:number = 1;
const n2:Number = 1;

Math.abs(n1) // 1
Math.abs(n2) // 报错 Argument of type 'Number' is not assignable to parameter of type 'number'.'number' is a primitive, but 'Number' is a wrapper object. Prefer using 'number' when possible.
```
:::

### Object 类型与 object 类型
TypeScript 的对象类型也有大写Object和小写object两种。
- 大写的Object类型代表 JavaScript 语言里面的广义对象。所有可以转成对象的值，都是Object类型，这囊括了几乎所有的值。原始类型值、对象、数组、函数都是合法的Object类型。
```ts
let obj:Object;
 
obj = true;
obj = 'hi';
obj = 1;
obj = { foo: 123 };
obj = [1, 2];
obj = (a:number) => a + 1;
```

- 除了`undefined`和`null`这两个值不能转为对象，其他任何值都可以赋值给Object类型。
```ts
let obj:Object;

obj = undefined; // 报错 Type 'undefined' is not assignable to type 'Object'.
obj = null; // 报错 Type 'null' is not assignable to type 'Object'.
```

- 空对象`{}`是Object类型的简写形式，所以使用Object时常常用空对象代替。
```ts
let obj:{};
 
obj = true;
obj = 'hi';
obj = 1;
obj = { foo: 123 };
obj = [1, 2];
obj = (a:number) => a + 1;
```

- 小写的object类型代表 JavaScript 里面的狭义对象，即可以用字面量表示的对象，只包含对象、数组和函数，不包括原始类型的值。建议总是使用小写类型object，不使用大写类型Object。
```ts
let obj:object;
 
obj = { foo: 123 };
obj = [1, 2];
obj = (a:number) => a + 1;
obj = true; // 报错 Type 'boolean' is not assignable to type 'object'.
obj = 'hi'; // 报错 Type 'string' is not assignable to type 'object'.
obj = 1; // 报错 Type 'number' is not assignable to type 'object'.
```
:::tip
无论是大写的Object类型，还是小写的object类型，都只包含 JavaScript 内置对象原生的属性和方法，用户自定义的属性和方法都不存在于这两个类型之中。
```ts
const o1:Object = { foo: 0 };
const o2:object = { foo: 0 };

o1.toString() // 正确
o1.foo // 报错 Property 'foo' does not exist on type 'Object'.

o2.toString() // 正确
o2.foo // 报错 Property 'foo' does not exist on type 'object'.
```
:::

### 值类型
TypeScript 规定，单个值也是一种类型，称为“值类型”。
```ts
let x:'hello';

x = 'hello'; // 正确
x = 'world'; // 报错 Type '"world"' is not assignable to type '"hello"'.
```

**TypeScript 推断类型时，遇到`const`命令声明的变量，如果代码里面没有注明类型，就会推断该变量是值类型。(注意，`const`命令声明的变量，如果赋值为对象，并不会推断为值类型。)**
```ts
// x 的类型是 "https"
const x = 'https';

// y 的类型是 string
const y:string = 'https';

// z 的类型是 { foo: number }
const z = { foo: 1 };
```

**父类型不能赋值给子类型，子类型可以赋值给父类型。如果一定要让子类型可以赋值为父类型的值，就要用到类型断言**
```ts
const x:5 = 4 + 1; // 报错 Type 'number' is not assignable to type '5'.

// 等号左侧的类型是数值5，等号右侧的类型TypeScript 推测为number。由于5是number的子类型，number是5的父类型，所以报错了。

let x:5 = 5;
let y:number = 4 + 1;

x = y; // 报错 Type 'number' is not assignable to type '5'.
y = x; // 正确

const x:5 = (4 + 1) as 5; // 正确。 告诉编译器，可以把4 + 1的类型视为值类型5
```

### 联合类型
联合类型（union types）指的是多个类型组成的一个新类型，使用符号`|`表示。联合类型`A|B`表示，任何一个类型只要属于`A`或`B`，就属于联合类型`A|B`。
```ts
let x:string|number;

x = 123; // 正确
x = 'abc'; // 正确
```

联合类型可以与值类型相结合，表示一个变量的值有若干种可能。
```ts
let setting:true|false;

let gender:'male'|'female';

let rainbowColor:'赤'|'橙'|'黄'|'绿'|'青'|'蓝'|'紫';

let name:string|null;

name = 'John';
name = null;
```

联合类型的第一个成员前面，也可以加上竖杠|，这样便于多行书写。
```ts
let x:
  | 'one'
  | 'two'
  | 'three'
  | 'four';
```

如果一个变量有多种类型，读取该变量时，往往需要进行“类型缩小”（type narrowing），区分该值到底属于哪一种类型，然后再进一步处理。
```ts
function printId( id:number|string ) {
  console.log(id.toUpperCase()); // 报错 Property 'toUpperCase' does not exist on type 'string | number'. Property 'toUpperCase' does not exist on type 'number'.
}
// toUpperCase方法只存在于字符串，不存在于数值

// 解决方法就是对参数id做一下类型缩小，确定它的类型以后再进行处理
function printId( id:number|string ) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase());
  } else {
    console.log(id);
  }
}
```
:::tip
“类型缩小”是 TypeScript 处理联合类型的标准方法，凡是遇到可能为多种类型的场合，都需要先缩小类型，再进行处理。实际上，联合类型本身可以看成是一种“类型放大”（type widening），处理时就需要“类型缩小”（type narrowing）。
```ts
function getPort( scheme: 'http'|'https' ) {
  // 对参数变量scheme进行类型缩小，根据不同的值类型，返回不同的结果
  switch (scheme) {
    case 'http':
      return 80;
    case 'https':
      return 443;
  }
}
```
:::

### 交叉类型
交叉类型（intersection types）指的是多个类型组成的一个新类型，使用符号`&`表示。交叉类型`A&B`表示，任何一个类型必须同时属于`A`和`B`，才属于交叉类型`A&B`，即交叉类型同时满足`A`和`B`的特征。交叉类型的主要用途是表示对象的合成。交叉类型常常用来为对象类型添加新属性。
```ts
let x:number&string; // 变量x同时是数值和字符串，这当然是不可能的，所以 TypeScript 会认为x的类型实际是never。

type A = { foo: number };

type B = A & { bar: number }; // 类型B是一个交叉类型，用来在A的基础上增加了属性bar
```

### type 命令
type命令用来定义一个类型的别名。别名可以让类型的名字变得更有意义，也能增加代码的可读性，还可以使复杂类型用起来更方便，便于以后修改变量的类型。
```ts
type Age = number; // 为number类型定义了一个别名Age

let age:Age = 55;
```

别名不允许重名。
```ts
type Color = 'red';
type Color = 'blue'; // 报错 Duplicate identifier 'Color'.
```

别名的作用域是块级作用域。这意味着，代码块内部定义的别名，影响不到外部。
```ts
type Color = 'red';

if (Math.random() < 0.5) {
  type Color = 'blue';
}
```

别名支持使用表达式，也可以在定义一个别名时，使用另一个别名，即别名允许嵌套。
```ts
type World = "world";
type Greeting = `hello ${World}`;
```

### typeof 运算符
:::info
JavaScript 里面，`typeof`运算符的操作数是一个值，只可能返回八种结果，而且都是字符串。
```js
typeof undefined; // "undefined"
typeof true; // "boolean"
typeof 1337; // "number"
typeof "foo"; // "string"
typeof {}; // "object"
typeof parseInt; // "function"
typeof Symbol(); // "symbol"
typeof 127n // "bigint"
```
:::
TypeScript 将`typeof`运算符移植到了类型运算，它的操作数依然是一个值，但是返回的不是字符串，而是该值的 TypeScript 类型。这种用法的`typeof`返回的是 TypeScript 类型，所以只能用在类型运算之中（即跟类型相关的代码之中），不能用在值运算。
```ts
const a = { x: 0 };

type T0 = typeof a;   // { x: number }
type T1 = typeof a.x; // number
```

同一段代码可能存在两种`typeof`运算符，一种用在值相关的 JavaScript 代码部分，另一种用在类型相关的 TypeScript 代码部分。
```ts
let a = 1;
let b:typeof a; // 类型运算

if (typeof a === 'number') { // 值运算
  b = a;
}
```

由于编译时不会进行 JavaScript 的值运算，所以TypeScript 规定，`typeof` 的参数只能是标识符，不能是需要运算的表达式。
```ts
type T = typeof Date(); // 报错
```