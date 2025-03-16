---
slug: usage
tags: [ts]
---

[TypeScript](https://www.typescriptlang.org/) 是一种基于 JavaScript 构建的强类型编程语言。

[TypeScript Playground](http://www.typescriptlang.org/play/) 是TypeScript在线编译页面

[tsconfig](https://www.typescriptlang.org/tsconfig)

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

## interface 覆盖
有时候想复用某个类型，但又有些属性类型不一致，有2种方案：
1. 覆盖指定的类型
```ts
interface A {
  a: number;
  b: number;
}
interface B extends Omit<A, 'a'> {
  a: boolean;
}
```

2. 批量覆盖
```ts
interface A {
  name: string;
  color?: string;
}
type B = Merge<A, {
  name: string | number;
  favorite?: boolean;
}>;
```

## `paths`
配置别名：
```json title="tsconfig.json"
"compilerOptions": {
  "baseUrl": "./",
  "paths":{
    "@/*": ["src/*"],
    "@pages/*": ["src/pages/*"],
  },
}
```

## `Record<Keys, Type>`
用于约束对象属性的类型，比如创建一个对象类型，其key 为任意 string，value 为任意类型。不使用Record：
```ts
type T = {
  [x: string]: any
}
```

使用Record：
```ts
type T = Record<string, any>
```

## `keyof`
在 TypeScript 中，你可以使用对象的键（keys）作为类型来确保类型安全性。为了实现这一点，你可以使用 TypeScript 提供的一些内置类型工具，比如 `keyof` 和索引类型查询。

假设你有一个对象，并且你希望使用该对象的键作为另一个类型的键，你可以这样做：

```typescript
// 假设你有一个对象
const myObject = {
  name: "Alice",
  age: 30,
  isActive: true,
};

// 使用 typeof 和 keyof 获取对象的键作为类型
type MyObjectKeys = keyof typeof myObject;

// 现在 MyObjectKeys 是 "name" | "age" | "isActive"

// 你可以使用这个类型在其他地方
function getValueByKey(obj: typeof myObject, key: MyObjectKeys) {
  return obj[key];
}

// 使用示例
const name = getValueByKey(myObject, "name"); // 这是合法的
const age = getValueByKey(myObject, "age");   // 这是合法的
// const invalid = getValueByKey(myObject, "invalidKey"); // 这会导致类型错误，因为 "invalidKey" 不是 MyObjectKeys 类型的一部分
```

在上述代码中，`keyof typeof myObject` 表示 `myObject` 对象的所有键的联合类型，即 `"name" | "age" | "isActive"`。这使得 `MyObjectKeys` 类型可以被用作函数参数的类型，从而确保只有合法的键可以被传递。

此外，如果你需要定义一个通用函数来处理任意对象的键，你可以使用泛型：

```typescript
function getValueByKey<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// 使用示例
const value1 = getValueByKey(myObject, "name"); // 这是合法的
const value2 = getValueByKey(myObject, "age");  // 这是合法的
// const value3 = getValueByKey(myObject, "invalidKey"); // 这会导致类型错误，因为 "invalidKey" 不是 myObject 的键
```

在这个泛型函数中，`T` 是对象的类型，`K` 是对象的键类型（它必须是 `T` 的一个键）。这种方法使得函数更通用，可以处理不同类型的对象。

## 类型复用（`Pick`）
在 TypeScript 中，如果你有一个类型 `B`，并且想要创建一个类型 `A`，其中包含 `B` 的某些类型，同时 `A` 还可以有自己的类型，你可以使用 TypeScript 的类型工具，比如 `Pick`、`Omit` 和交叉类型。

以下是一个示例，展示了如何实现这一目标：

假设你有一个类型 `B`：

```typescript
type B = {
  id: number;
  name: string;
  age: number;
  address: string;
};
```

现在你想创建一个类型 `A`，它包含 `B` 的 `id` 和 `name` 属性，同时还包含自己的属性 `email` 和 `phone`。

你可以使用 `Pick` 来选择 `B` 中的某些属性，并通过交叉类型来添加新的属性：

```typescript
type A = Pick<B, 'id' | 'name'> & {
  email: string;
  phone: string;
};
```

这样，类型 `A` 就包含了 `B` 的 `id` 和 `name` 属性，以及 `A` 自己的 `email` 和 `phone` 属性。

完整的示例代码如下：

```typescript
type B = {
  id: number;
  name: string;
  age: number;
  address: string;
};

type A = Pick<B, 'id' | 'name'> & {
  email: string;
  phone: string;
};

// 示例对象
const exampleA: A = {
  id: 1,
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '123-456-7890',
};
```

解释：

1. **类型 `B`**:
   - `B` 是一个包含 `id`, `name`, `age`, 和 `address` 属性的类型。

2. **类型 `A`**:
   - 使用 `Pick<B, 'id' | 'name'>` 从类型 `B` 中选择 `id` 和 `name` 属性。
   - 使用交叉类型 `&` 添加 `A` 自己的属性 `email` 和 `phone`。

3. **示例对象**:
   - `exampleA` 是一个符合类型 `A` 的对象，包含 `id`, `name`, `email`, 和 `phone` 属性。

这种方法非常灵活，可以让你在复用现有类型的同时添加新的属性。你也可以使用 `Omit` 来排除某些属性，或者结合使用 `Pick` 和 `Omit` 来创建更加复杂的类型。