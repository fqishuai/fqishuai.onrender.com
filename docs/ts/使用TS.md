---
slug: usage
tags: [ts]
---

当 import 一个没有类型声明的第三方库时，TypeScript 不知道 import 进来的东西是什么类型，只能偷偷地把它指定成 any 类型，这也就是我们常说的隐式 any（implicit any）。所有正常的前端项目都会禁止 implicit any 出现，所以会报错。