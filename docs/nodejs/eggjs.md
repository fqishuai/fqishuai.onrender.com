---
tags: [nodejs框架]
---

## 1.目录结构约定
[目录结构](https://www.eggjs.org/zh-CN/basics/structure)
![目录结构](img/eggjs目录结构.jpeg)

### 1.1 框架的扩展(`app/extend/**`)
> [框架扩展](https://www.eggjs.org/zh-CN/basics/extend)

可以对如下对象进行自定义扩展，进一步加强框架的功能：
- Application。Application对象指的是 Koa 的全局应用对象，全局只有一个，在应用启动时被创建。
    > 会把 `app/extend/application.js` 中定义的对象与 Koa Application 的 prototype 对象进行合并，在应用启动时会基于扩展后的 prototype 生成 app 对象。

- Context。Context 指的是 Koa 的请求上下文，每次请求生成一个 Context 实例，通常我们也简写成 ctx。在所有的文档中，Context 和 ctx 都是指 Koa 的上下文对象。
    > 会把 `app/extend/context.js` 中定义的对象与 Koa Context 的 prototype 对象进行合并，在处理请求时会基于扩展后的 prototype 生成 ctx 对象。

- Request。Request 对象和 Koa 的 Request 对象相同，提供了大量请求相关的属性和方法供使用。**访问方式：`ctx.request`**
    > 会把 `app/extend/request.js` 中定义的对象与内置 request 的 prototype 对象进行合并，在处理请求时会基于扩展后的 prototype 生成 request 对象。

- Response。Response 对象和 Koa 的 Response 对象相同，提供了大量响应相关的属性和方法供使用。**访问方式：`ctx.response`**
    > 会把 `app/extend/response.js` 中定义的对象与内置 response 的 prototype 对象进行合并，在处理请求时会基于扩展后的 prototype 生成 response 对象。

- Helper。Helper 函数用来提供一些实用的 utility 函数。**访问方式：`ctx.helper`**
    > 会把 `app/extend/helper.js` 中定义的对象与内置 helper 的 prototype 对象进行合并，在处理请求时会基于扩展后的 prototype 生成 helper 对象。

- Agent
    > `app/extend/agent.js`  扩展 Agent 类

### 1.2 Application实例的访问方式
- `ctx.app`

- Controller，Middleware，Helper，Service 中都可以通过 `this.app` 访问到 Application 对象，例如 this.app.config 访问配置对象。

- 在 app.js 中 app 对象会作为第一个参数注入到入口函数中
```js
// app.js
module.exports = (app) => {
  // 使用 app 对象
};
```

### 1.3 Context实例的访问方式
- middleware 中 `this` 就是 `ctx`，例如 this.cookies.get('foo')。

- controller 有两种写法，类的写法通过 `this.ctx`，方法的写法直接通过 ctx 入参。

- helper，service 中的 this 指向 helper，service 对象本身，使用 `this.ctx` 访问 context 对象，例如 this.ctx.cookies.get('foo')。

### 1.4 启动自定义(`app.js`)
> [启动自定义](https://www.eggjs.org/zh-CN/basics/app-start)
提供了统一的入口文件（app.js）进行启动过程自定义，这个文件返回一个 Boot 类，我们可以通过定义 Boot 类中的生命周期方法(如下)来执行启动应用过程中的初始化工作。
- configWillLoad。配置文件即将加载，这是最后动态修改配置的时机
- configDidLoad。配置文件加载完成
- didLoad。文件加载完成
- willReady。插件启动完毕
- didReady。worker 准备就绪
- serverDidReady。应用启动完成
- beforeClose。应用即将关闭

### 1.5 ts目录结构
> [TypeScript](https://www.eggjs.org/zh-CN/tutorials/typescript)
```markdown
mkdir showcase && cd showcase
npm init egg --type=ts
npm i
npm run dev
```
![ts目录结构](img/eggjs-ts目录结构.jpg)

## 2.自定义插件开发
```js
npm init egg --type=plugin
// 或者 yarn create egg --type=plugin
```
![插件目录结构](img/eggjs插件目录结构.jpg)

- 插件没有独立的 router 和 controller
- 插件没有 plugin.js

## 3.运行环境
### 3.1 指定运行环境
- 1）通过  `config/env` 文件指定，该文件的内容就是运行环境，如 prod。
```markdown
// config/env
prod
```

- 2）通过 EGG_SERVER_ENV 环境变量指定运行环境更加方便，比如在生产环境启动应用：`EGG_SERVER_ENV=prod npm start`

### 3.2 应用内获取运行环境
app.config.env

### 3.3 配置文件
- 不同的运行环境会对应不同的配置。`config.default.js` 为默认的配置文件，所有环境都会加载这个配置文件，一般也会作为开发环境的默认配置文件。

- 当指定 env 时会同时加载默认配置和对应的配置(具名配置)文件，具名配置和默认配置将合并(使用[extend2](https://www.npmjs.com/package/extend2)深拷贝)成最终配置，具名配置项会覆盖默认配置文件的同名配置。如 prod 环境会加载 config.prod.js 和 config.default.js 文件，config.prod.js 会覆盖 config.default.js 的同名配置。

### 3.4 线上环境
- **注意：如果项目需要在线上运行，请先使用 tsc 将 ts 编译成 js （ `npm run tsc` ）再运行 `npm start`**

- 运行 npm start 不会加载 ts。npm start 运行的是 egg-scripts start，而我们只在 egg-bin 中集成了 ts-node，也就是只有在使用 egg-bin 的时候才允许直接运行 ts 。

- prod环境不会在控制台输入log，而是写到项目的log目录下对应的文件中（项目目录下 `run/application_config.json` 的 config.logger定义了不同的log文件）

## 4. 部署
### 4.1 [Master进程](https://www.eggjs.org/zh-CN/core/cluster-and-ipc#master)
- 内置了 egg-cluster 来启动 Master 进程，Master 有足够的稳定性，不再需要使用 [pm2](https://github.com/Unitech/pm2) 等进程守护模块。

### 4.2 [egg-scripts](https://github.com/eggjs/egg-scripts) 用于支持线上环境的运行和停止
