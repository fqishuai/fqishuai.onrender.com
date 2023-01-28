---
slug: usage
tags: [ts]
---

# [TypeScript](https://www.typescriptlang.org/)

:::tip
当 import 一个没有类型声明的第三方库时，TypeScript 不知道 import 进来的东西是什么类型，只能偷偷地把它指定成 any 类型，这也就是我们常说的隐式 any（implicit any）。所有正常的前端项目都会禁止 implicit any 出现，所以会报错。
:::

## 一、基础
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

