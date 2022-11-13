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