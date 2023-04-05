---
slug: usage
tags: [ts]
---

# [TypeScript](https://www.typescriptlang.org/)
> TypeScript 是一种基于 JavaScript 构建的强类型编程语言。

:::tip
当 import 一个没有类型声明的第三方库时，TypeScript 不知道 import 进来的东西是什么类型，只能偷偷地把它指定成 any 类型，这也就是我们常说的隐式 any（implicit any）。所有正常的前端项目都会禁止 implicit any 出现，所以会报错。
:::

## 一、基础
### 1. [模块Modules](https://www.typescriptlang.org/docs/handbook/modules.html)
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

### 2. 命名空间
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

### 3. 声明文件
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

#### 3.1 例子
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

### 4. 枚举Enums
> TypeScript 提供基于数字和字符串的枚举。可以使用 `enum` 关键字定义枚举。

#### 4.1 Numeric enums
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

#### 4.2 String enums
> 在字符串枚举中，每个成员都必须使用字符串文字或另一个字符串枚举成员进行常量初始化。
```ts
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

## 二、高阶
## 三、遇到的问题
### 1. Argument of type not assignable to parameter type 'never'
> 参考：[Argument of type not assignable to parameter type 'never'](https://bobbyhadz.com/blog/typescript-argument-type-not-assignable-parameter-type-never)

当我们声明一个空数组而没有显式键入它并尝试向其中添加元素时，会出现错误“类型的参数不能分配给‘never’类型的参数”。要解决该错误，请显式键入空数组，比如：`const arr: string[] = [];`

### 2. 'this' implicitly has type 'any' error in TypeScript
> 参考：['this' implicitly has type 'any' error in TypeScript](https://bobbyhadz.com/blog/typescript-this-implicitly-has-type-any)

当我们在类之外或在无法推断 this 类型的函数中使用 this 关键字时，会出现“this 隐式具有任何类型”的错误。要解决此错误，请将 this 关键字的类型添加为函数中的第一个参数。

### 3. Variable 'X' is used before being assigned in TypeScript
> 参考：[Variable 'X' is used before being assigned in TypeScript](https://bobbyhadz.com/blog/typescript-variable-is-used-before-being-assigned)

当我们声明一个变量而不为其赋值或仅在满足条件时才赋值时，会出现错误“变量在赋值之前使用”。要解决该错误，请将变量的类型更改为可能未定义或给它一个初始值。

### 4. This expression is not callable. Type 'X' no call signatures
> 参考：[This expression is not callable. Type 'X' no call signatures](https://bobbyhadz.com/blog/typescript-this-expression-not-callable-type-has-no-call-signatures)

当我们尝试将不是函数的类型调用为函数或作为其他类型键入为函数时，会发生 TypeScript 错误: “此表达式不可调用。类型 'X' 没有调用签名”。要解决此错误，请确保您正在调用一个函数并且它是作为函数输入的。

### 5. [Using DayJS with Typescript](https://issuehunt.io/r/iamkun/dayjs/issues/788)
```jsx
import { default as dayjs } from 'dayjs';

import dayjs = require('dayjs');
```

### 6. Binding element 'X' implicitly has an 'any' type
> 参考：[Binding element 'X' implicitly has an 'any' type](https://bobbyhadz.com/blog/typescript-binding-element-implicitly-has-an-any-type)

The error "Binding element implicitly has an 'any' type" occurs when we don't set the type of an object parameter in a function. The issue is that the functions take an object as a parameter, we destructure the object's properties, but don't type the object. To solve the error, make sure to explicitly type the object parameter of the function. 当我们没有在函数中设置对象参数的类型时，会出现“绑定元素隐式具有‘任何’类型”的错误。问题是函数将对象作为参数，我们解构对象的属性，但不键入对象。要解决该错误，请确保明确键入函数的对象参数。

```ts
// 👇️ With Functions 👇️
// ⛔️ Error: Binding element 'id' implicitly has an 'any' type.ts(7031)
function getEmployee({ id, name }) {
  return { id, name };
}

// 👇️ With Class methods 👇️
class Employee {
  id: number;
  name: string;

  // ⛔️ Error: Binding element 'name' implicitly has an 'any' type.ts(7031)
  constructor({ id, name }) {
    this.id = id;
    this.name = name;
  }
}

// To solve the error, type the object by separating the object parameter and its type by a colon.
// 要解决该错误，请通过用冒号分隔对象参数及其类型来键入对象。
// 👇️ With Functions 👇️
function getEmployee({ id, name }: { id: number; name: string }) {
  return { id, name };
}

// 👇️ With class methods 👇️
class Employee {
  id: number;
  name: string;

  constructor({ id, name }: { id: number; name: string }) {
    this.id = id;
    this.name = name;
  }
}

```

### 7. Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{}'.
> 参考：[Element implicitly has an 'any' type because expression of type 'string' can't be used to index type](https://bobbyhadz.com/blog/typescript-element-implicitly-has-any-type-expression)

- keyof
- typeof
```ts
const str = 'name' as string;

const obj = {
  name: 'Bobby Hadz',
  country: 'Chile',
};

// ⛔️ Error: Element implicitly has an 'any' type
// because expression of type 'string' can't be used
// to index type '{ name: string; }'.
// No index signature with a parameter of type 'string'
// was found on type '{ name: string; }'.ts(7053)
obj[str];

// 使用keyof typeof解决
const str = 'name' as string;

const obj = {
  name: 'Bobby Hadz',
  country: 'Chile',
};

// 👇️ "Bobby Hadz"
console.log(obj[str as keyof typeof obj]);

// 👇️ type T = "name" | "country"
type T = keyof typeof obj;

// 使用keyof解决
const str = 'name' as string;

interface Person {
  name: string;
  country: string;
}

const obj: Person = {
  name: 'Bobby Hadz',
  country: 'Chile',
};

console.log(obj[str as keyof Person]); // 👉️ "Bobby Hadz"

// 👇️ type T = "name" | "country"
type T = keyof Person;

```

### 8. Property 'value' does not exist on type 'HTMLElement'.
> 参考：[Property 'value' does not exist on type 'HTMLElement' in TS](https://bobbyhadz.com/blog/typescript-property-value-not-exist-type-htmlelement)

The error "Property 'value' does not exist on type 'HTMLElement'" occurs when we try to access the value property on an element that has a type of HTMLElement. The reason we got the error is that the return type of the document.getElementById method is `HTMLElement | null` and the `value` property doesn't exist in the HTMLElement type. To solve the error, use a type assertion to type the element as HTMLInputElement (or HTMLTextAreaElement if you're typing a textarea element) before accessing the property. 当我们尝试访问具有 HTMLElement 类型的元素的 value 属性时，会出现错误“属性‘value’在类型‘HTMLElement’上不存在”。我们得到错误的原因是 document.getElementById 方法的返回类型是 `HTMLElement | null` 并且 value 属性在 HTMLElement 类型中不存在。要解决该错误，请在访问该属性之前使用类型断言将元素断言为 HTMLInputElement（或者 对于textarea元素 断言为 HTMLTextAreaElement）。

```ts
// 👇️ const input: HTMLElement | null
const input = document.getElementById('first_name');

if (input != null) {
  // ⛔️ Error: Property 'value' does not exist on type 'HTMLElement'.ts(2339)
  const value = input.value;
}

// 断言为HTMLInputElement
const input = document.getElementById('first_name') as HTMLInputElement | null;

// 👇️ using optional chaining (?.)
const value = input?.value;

console.log(value); // 👉️ Initial value
```