[前端在线代码编辑器技术杂谈](https://mp.weixin.qq.com/s?__biz=Mzg4NTczNzg2OA==&mid=2247505439&idx=1&sn=de1efd05aceb0748982bf88342b883b2&scene=21#wechat_redirect)

开源的使用最多的编辑器：Monaco Editor、Ace 和 Code Mirror。

## react-playground
Monaco Editor生态丰富功能强大，还是vscode同款编辑器，带代码提示等功能，开发友好。react-playgound是用的就是 `@monaco-editor/react`

## react-live

## codesandbox
codesandbox 开源了 `@codesandbox/sandpack-react` 库，这个React库提供了很多开箱即用的codesandbox模块。

## stackblitz
stackblitz 核心技术是 webcontainers

### 什么是webcontainers？
[WebContainer](https://webcontainers.io/) 是由 StackBlitz 团队开发的一项革命性技术，它允许我们在浏览器中运行完整的 Node.js 环境。这使得我们可以在浏览器中运行现代 JavaScript 开发工具，如 Webpack、Vite 和各种 npm 包，而无需安装任何本地依赖。

以前，我们如果想要在浏览器内实现本地化，主流想法是以electron为例，把浏览器的内核引擎与node环境进行搭配，实现了web应用的本地化，但是随着wasm的技术的发展，浏览器的运算能力已经能够比肩系统级，因此，也就能够支持起来将node.js移植到浏览器内的可行性。这种技术 就是webcontainers。

以前需要云虚拟机来执行用户代码的应用程序，现在在 WebContainers 中可以完全在浏览器中运行。

简而言之：webContainer 就是一个可以运行在浏览器页面中的微型操作系统，提供了文件系统、运行进程的能力，同时内置了 nodejs、npm/yarn/pnpm 等包管理器。

主要特性：
- 能够在浏览器中运行 node.js 及其工具链（如：webpack、vite 等）
- 灵活：在 WebContainers 支持下，编码体验将会大幅提升
- 安全：所有内容都运行在浏览器页面中，天然隔离，非常安全
- 快速：毫秒级启动整个开发环境。
- 始终开源免费
- 零延时。离线工作。

热更新从代码编写，到编译打包，完全在浏览器中闭环，只要打开一个浏览器就完成所有的动作。

### WebAssembly
WebAssembly 是 WebContainers 能够在浏览器中运行的核心。通过将 Node.js 编译为 WebAssembly，WebContainers 能够在浏览器中提供一个完整的开发环境，包括运行 Node.js 代码、安装和管理 npm 包等功能。

WebAssembly 是一门低级的类汇编语言。它有一种紧凑的二进制格式，使其能够以接近原生性能的速度运行。


## runkit
[Runkit](https://runkit.com/) is a node playground in your browser.
>- https://www.jianshu.com/p/6bddbb0b284f
>- https://www.jsdelivr.com/package/npm/react-runkit-embed

在Docusaurus工程中使用Runkit:
1. `npm i react-runkit-embed`
2. 在`src/theme/MDXComponents.ts`中全局范围导入
   ```ts title="src/theme/MDXComponents.ts"
   import RunKit from 'react-runkit-embed/RunKit';
   export default {
     // 复用默认的映射
     ...MDXComponents,
     // 把 <RunKit> 标签映射到 RunKit 组件
     RunKit,
   };
   ```
3. 在md文件中使用
   ```markdown
   <RunKit>
     console.log('hello')
   </RunKit>
   ```

   如下使用时，模板字符串内最外层不能有空行，函数体等里面可以有空行：
   ```markdown
   <RunKit>
   {
     `
     const Company = {
       category: "Technology",
       getNews () {
        console.log("viewing " + this.category + " news on my " + this.name + " device")
       }
     }
     const AppleInc = {
       name: "Apple",
       logo: "Apple fruit",
       operating_system: "Apple Software",
       store: "Apple Store",
       on () {
        console.log("Turning on my " + this.name + " device")
       },
       off () {
        console.log("Turning off my " + this.name + " device")
       },
       getDevice() {
        console.log("I just bought my " + this.name + " from " + this.store)
       }
     }
     const iPhone = {
       name: "iPhone",
       operating_system: "ios"
     }
     AppleInc.__proto__ = Company // NEVER DO THIS IN REAL-LIFE. ONLY FOR DEMONSTRATION PURPOSE
     iPhone.__proto__ = AppleInc // NEVER DO THIS IN REAL-LIFE. ONLY FOR DEMONSTRATION PURPOSE
     // let's buy an iPhone from the Apple store, then let's turn on and off our iPhone.
     console.log(iPhone.getDevice())
     console.log(iPhone.on())
     console.log(iPhone.off())
     console.log(iPhone.getNews())
     `
   }
   </RunKit>
   ```

4. 本地启动：`npm start`