---
slug: polyfill
---

JavaScript 语言在稳步发展。也会定期出现一些对语言的新提议，它们会被分析讨论，如果认为有价值，就会被加入到 https://tc39.github.io/ecma262/ 的列表中，然后被加到 [规范](http://www.ecma-international.org/publications/standards/Ecma-262.htm) 中。

查看语言特性的当前支持状态的一个很好的页面是 https://kangax.github.io/compat-table/es6/

如何让我们现代的代码在还不支持最新特性的旧引擎上工作？有两个工作可以做到这一点：
- 转译器（Transpilers）
- 垫片（Polyfills）

## 转译器（Transpilers）
- 转译器 是一种可以将源码转译成另一种源码的特殊的软件。它可以解析（“阅读和理解”）现代代码，并使用旧的语法结构对其进行重写，进而使其也可以在旧的JavaScript引擎中工作。例如，在 ES2020 之前没有“空值合并运算符”。所以，如果访问者使用过时了的浏览器访问我们的网页，那么该浏览器可能就不明白 `height = height ?? 100` 这段代码的含义。转译器会分析我们的代码，并将 `height ?? 100` 重写为 `(height !== undefined && height !== null) ? height : 100`。

- 通常，开发者会在自己的计算机上运行转译器，然后将转译后的代码部署到服务器。

- [Babel](https://babeljs.io/) 是最著名的转译器之一。

- 现代项目构建系统，例如 [webpack](https://webpack.js.org/)，提供了在每次代码更改时自动运行转译器的方法，因此很容易将代码转译集成到开发过程中。

## 垫片（Polyfills）
- 新的语言特性可能不仅包括语法结构和运算符，还可能包括内建函数。例如，`Math.trunc(n)` 是一个“截断”数字小数部分的函数，例如 `Math.trunc(1.23)` 返回 1。在一些（非常过时的）JavaScript 引擎中没有 `Math.trunc` 函数，所以这样的代码会执行失败。

- 对于新增函数这类的新特性，由于不是语法更改或者新增运算符，因此无需转译任何内容，而是需要声明缺失的函数，进而使其也可以在旧的JavaScript引擎中工作。

- 更新/添加新函数的脚本被称为“polyfill”，它“填补”了空白并添加了缺失的实现。`Math.trunc` 的 polyfill 是一个实现它的脚本，如下所示：
  ```js
  if (!Math.trunc) { // 如果没有这个函数
    // 实现它
    Math.trunc = function(number) {
      // Math.ceil 和 Math.floor 甚至存在于上古年代的 JavaScript 引擎中，所以在该polyfill中可以使用这俩函数
      return number < 0 ? Math.ceil(number) : Math.floor(number);
    };
  }
  ```

- 两个有趣的 polyfill 库：
  - [core js](https://github.com/zloirock/core-js) 支持了很多特性，允许只包含需要的特性。
  - [polyfill.io](http://polyfill.io/) 提供带有 polyfill 的脚本的服务，具体取决于特性和用户的浏览器。