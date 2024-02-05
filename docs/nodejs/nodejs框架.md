---
slug: frameworks
tags: [nodejs框架]
---

Node.js框架是用于构建Web应用程序的工具集合，它们提供了一些功能和结构，使得开发人员能够更快速地构建应用程序。Node.js框架通常分为MVC框架、全栈MVC框架和REST API框架。

## egg.js
### 1.目录结构约定
[目录结构](https://www.eggjs.org/zh-CN/basics/structure)
![目录结构](img/eggjs目录结构.jpeg)

#### 1.1 框架的扩展(`app/extend/**`)
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

:::info
[例子：扩展Context，封装统一的response](https://code.juejin.cn/pen/7160667676237856798)
> 参考：[如何规范接口输出协议——Eggjs最佳实践系列（一）](https://juejin.cn/post/6963458879032131621)
:::


#### 1.2 Application实例的访问方式
- `ctx.app`

- Controller，Middleware，Helper，Service 中都可以通过 `this.app` 访问到 Application 对象，例如 this.app.config 访问配置对象。

- 在 app.js 中 app 对象会作为第一个参数注入到入口函数中
```js
// app.js
module.exports = (app) => {
  // 使用 app 对象
};
```

#### 1.3 Context实例的访问方式
- middleware 中 `this` 就是 `ctx`，例如 this.cookies.get('foo')。

- controller 有两种写法，类的写法通过 `this.ctx`，方法的写法直接通过 ctx 入参。

- helper，service 中的 this 指向 helper，service 对象本身，使用 `this.ctx` 访问 context 对象，例如 this.ctx.cookies.get('foo')。

#### 1.4 启动自定义(`app.js`)
> [启动自定义](https://www.eggjs.org/zh-CN/basics/app-start)
提供了统一的入口文件（app.js）进行启动过程自定义，这个文件返回一个 Boot 类，我们可以通过定义 Boot 类中的生命周期方法(如下)来执行启动应用过程中的初始化工作。
- configWillLoad。配置文件即将加载，这是最后动态修改配置的时机
- configDidLoad。配置文件加载完成
- didLoad。文件加载完成
- willReady。插件启动完毕
- didReady。worker 准备就绪
- serverDidReady。应用启动完成
- beforeClose。应用即将关闭

#### 1.5 ts目录结构
> [TypeScript](https://www.eggjs.org/zh-CN/tutorials/typescript)
```markdown
mkdir showcase && cd showcase
npm init egg --type=ts
npm i
npm run dev
```
![ts目录结构](img/eggjs-ts目录结构.jpg)

问题：Property 'xxx' does not exist on type 'Application'，解决办法：在index.d.ts中进行声明：
```typescript title="项目根目录/typings/index.d.ts"
import 'egg';

declare module 'egg' {
  interface Application {
    xxx: any;
  }
}
```

### 2.自定义插件开发
```js
npm init egg --type=plugin
// 或者 yarn create egg --type=plugin
```
![插件目录结构](img/eggjs插件目录结构.jpg)

- 插件没有独立的 router 和 controller
- 插件没有 plugin.js

### 3.运行环境
#### 3.1 指定运行环境
- 1）通过  `config/env` 文件指定，该文件的内容就是运行环境，如 prod。
```markdown
// config/env
prod
```

- 2）通过 EGG_SERVER_ENV 环境变量指定运行环境更加方便，比如在生产环境启动应用：`EGG_SERVER_ENV=prod npm start`

#### 3.2 应用内获取运行环境
app.config.env

#### 3.3 配置文件
- 不同的运行环境会对应不同的配置。`config.default.js` 为默认的配置文件，所有环境都会加载这个配置文件，一般也会作为开发环境的默认配置文件。

- 当指定 env 时会同时加载默认配置和对应的配置(具名配置)文件，具名配置和默认配置将合并(使用[extend2](https://www.npmjs.com/package/extend2)深拷贝)成最终配置，具名配置项会覆盖默认配置文件的同名配置。如 prod 环境会加载 config.prod.js 和 config.default.js 文件，config.prod.js 会覆盖 config.default.js 的同名配置。

#### 3.4 线上环境
- **注意：如果项目需要在线上运行，请先使用 tsc 将 ts 编译成 js （ `npm run tsc` ）再运行 `npm start`**

- 运行 npm start 不会加载 ts。npm start 运行的是 egg-scripts start，而我们只在 egg-bin 中集成了 ts-node，也就是只有在使用 egg-bin 的时候才允许直接运行 ts 。

- prod环境不会在控制台输入log，而是写到项目的log目录下对应的文件中（项目目录下 `run/application_config.json` 的 config.logger定义了不同的log文件）

### 4. 部署
#### 4.1 [Master进程](https://www.eggjs.org/zh-CN/core/cluster-and-ipc#master)
- 内置了 egg-cluster 来启动 Master 进程，Master 有足够的稳定性，不再需要使用 [pm2](https://github.com/Unitech/pm2) 等进程守护模块。

#### 4.2 [egg-scripts](https://github.com/eggjs/egg-scripts) 用于支持线上环境的运行和停止

### 5. 路由
:::tip
- Router 主要用来描述请求 URL 和具体承担执行动作的 Controller 的对应关系， 框架约定了 `app/router.js` 文件用于统一所有路由规则。
- 在 Router 定义中， 可以支持多个 Middleware 串联执行
:::

### 6. 中间件

#### 6.1 编写中间件
:::info
约定一个中间件是一个放置在 app/middleware 目录下的单独文件，它需要 exports 一个普通的 function，接受两个参数：
- options: 中间件的配置项，框架会将 `app.config[${middlewareName}]` 传递进来。
- app: 当前应用 Application 的实例。
```js
module.exports = (options) => {
  return async function fn(ctx, next) {
    
  }
}
```
:::

例子：封装中间件处理请求的路由未找到的情况
```typescript title="项目根目录/app/middleware/notFoundHandler.ts"
export default () => {
  return async function notFoundHandler(ctx, next) {
    await next(); // next()执行前用于处理请求，next()执行后用于处理响应
    if (ctx.status === 404 && !ctx.body) {
      ctx.body = ctx.acceptJSON ? {code: 0, message: 'Not Found'} : {code: 0, message: 'Page Not Found'};
    }
  }
}
```
```typescript title="项目根目录/config/config.default.ts"
config.middleware = [
  'notFoundHandler',
];

// 注意：用于router的中间件，不需要在此配置，在router.ts中使用即可。
```

#### 6.2 使用中间件
> 中间件的加载是有顺序的

需要手动挂载中间件，支持以下方式：
- 在`config.default.js`中配置
```js
module.exports = {
  // 配置需要的中间件，数组顺序即为中间件的加载顺序
  middleware: ['gzip'],

  // 配置 gzip 中间件的配置
  gzip: {
    threshold: 1024, // 小于 1k 的响应体不压缩
  },
};

// 该配置最终将在启动时合并到 app.config.appMiddleware
```

- 框架和插件不支持在 `config.default.js` 中匹配 middleware，需要通过以下方式：
```js
// app.js
module.exports = (app) => {
  // 在中间件最前面统计请求时间
  app.config.coreMiddleware.unshift('report');
};

// app/middleware/report.js
module.exports = () => {
  return async function (ctx, next) {
    const startTime = Date.now();
    await next();
    // 上报请求时间
    reportTime(Date.now() - startTime);
  };
};
```
:::tip
  - 应用层定义的中间件（app.config.appMiddleware）和框架默认中间件（app.config.coreMiddleware）都会被加载器加载，并挂载到 app.middleware 上。
  - 以上两种方式配置的中间件是全局的，会处理每一次请求。
:::

- router 中使用中间件。如果只想针对单个路由生效，可以直接在 `app/router.js` 中实例化和挂载，如下：
```js
module.exports = (app) => {
  const gzip = app.middleware.gzip({ threshold: 1024 });
  app.router.get('/needgzip', gzip, app.controller.handler);
};
```

:::tip
无论是应用层加载的中间件还是框架自带中间件，都支持几个通用的配置项：
  - enable：控制中间件是否开启。
  - match：设置只有符合某些规则的请求才会经过这个中间件。
  - ignore：设置符合某些规则的请求不经过这个中间件。
:::

例子：在router中使用中间件gzip
```typescript title="项目根目录/app/router.ts"
import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router, middleware } = app;
  const gzipHandler = middleware.gzip({ threshold: 1024 });

  router.post('/needgzip', gzipHandler, controller.handler);
};
```

### 7. 日志
eggjs产生的日志有三类:
- 业务日志
```plain
common-error.log
egg-agent.log
egg-web.log
${appInfo.name}-web.log
```

- 定时任务日志
```plain
egg-schedule.log
```

框架启动日志
```plain
master-stderr.log
master-stdout.log
```

默认情况下，业务日志和定时任务日志都在${appInfo.root}/logs/${appInfo.name}目录下，例如 /home/admin/logs/example-app。
而框架启动日志在${appInfo.root}/logs/目录下。

当你要把日志文件转移到指定目录下，分三步:
- 第一步对业务日志，需修改配置文件config.{env}.js
```js
config.logger = {
  dir: '日志目录路径',
};
```

- 第二步对定时任务日志，需修改配置文件config.{env}.js
```js
config.customLogger = {
  scheduleLogger: {
    consoleLevel: 'NONE',
    file: 'aaa/bbb/egg-schedule.log',   // 新日志文件路径
  },
 };

config.schedule = {
  directory: [],
};
```

- 第三步对框架启动日志，需要在启动命令上加参数
```bash
npm run start -- --stdout="/xx/master-stdout.log" --stderr="/xx/master-stderr.log"
```

> [基于Egg框架的日志链路追踪实践](https://www.nodejs.red/#/nodejs/logger?id=%e5%9f%ba%e4%ba%8eegg%e6%a1%86%e6%9e%b6%e7%9a%84%e6%97%a5%e5%bf%97%e9%93%be%e8%b7%af%e8%bf%bd%e8%b8%aa%e5%ae%9e%e8%b7%b5)

### 8. egg-ts-helper
ets clean 支持清除包含同名 tsx 文件的 js 文件

### 9. [eggjs处理jsonp请求](https://www.jianshu.com/p/afc0acc6206a)
jsonp作为前端跨域的一种解决方案，优缺点如下：
- 优点
  - 它不像`XMLHttpRequest`对象实现的`Ajax`请求那样受到同源策略的限制
  - 它的兼容性更好，在更加古老的浏览器中都可以运行，不需要`XMLHttpRequest`或`ActiveX`的支持
  - 并且在请求完毕后可以通过调用`callback`的方式回传结果

- 缺点
  - 它只支持`GET`请求而不支持`POST`等其它类型的HTTP请求
  - 它只支持跨域HTTP请求这种情况，不能解决不同域的两个页面之间如何进行JavaScript调用的问题

1. 安装 egg-jsonp 插件 `npm i -S egg-jsonp`
2. 配置`config/plugin.js`
```js
// {app_root}/config/plugin.js
exports.jsonp = {
  enable: true,
  package: 'egg-jsonp',
};
```

3. 配置`config/config.default.js`
```js
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.jsonp = {
    limit: 100,                               // 回调方法名的最大长度，默认为 50。
    // callback: [ '_callback', 'callback' ], // jsonp回调方法key值，默认为 [ '_callback', 'callback' ]
    // csrf: true,                            // 是否启用 csrf 防御检查。默认为 false。
    // whiteList: [                           // 请求referrer的白名单。类型可以是String、Array、RegExp。
    // 'localhost:4000/',
    // '127.0.0.1:4000/',
    // ],
  };
  /**
   * whiteList 为 字符串，如：{whiteList : '.test.com'}
   * whiteList 为 正则，如：{whiteList : / ^ https?: / / test.com / /}，如果 whiteList 的类型是正则，referrer 必须 匹配 whiteList，注意 first^和 last /。
   * whiteList 为 数组，如：{whiteList : [ '.foo.com' , '.bar.com' ]}
   */
  return {
    ...config,
  }
}
```

4. controller
```js
// app/controller/jsonp/index.js
'use strict';

const Controller = require('egg').Controller;

class JsonpController extends Controller {

  async list() {
    const { ctx } = this;
    ctx.body = [
      {
        id: 1,
        name: '天問', 
      },
      {
        id: 2,
        name: '天问', 
      },
      {
        id: 3,
        name: 'Tiven', 
      },
    ];
  }

}

module.exports = JsonpController;
```

5. router
```js
// app/router.js

module.exports = app => {
  const { router, controller } = app;
  const jsonp = app.jsonp();
  
  router.get('/api/v1/jsonp/list', jsonp, controller.jsonp.index.list);
};
```

6. 前端页面调用
```js
function getList(res) {
  if (!res) return
  // jsonp接口返回的数据
  // do ...
  console.log(res)
}
let script = document.createElement('script')
script.src = `http://127.0.0.1:7001/api/v1/jsonp/list?callback=getList&v=${Date.now()}`
document.body.appendChild(script)
```

7. jsonp返回的数据结构
打开控制台的network可以查看jsonp返回的数据结构：
```js
/**/ typeof getList === 'function' && getList([{ "id": 1, "name": '天問'}, { "id": 2,"name": '天问'},{"id": 3, "name": 'Tiven'}]);
```

## [hapi](https://hapi.dev/)
- 官方文档有中文
- [Learn Hapi](https://github.com/dwyl/learn-hapi)

安装：`npm install @hapi/hapi`

### 路由
- `method` 选项可以是任何有效的 HTTP 方法或方法数组。假设您希望在用户发送 PUT 或 POST 请求时得到相同的响应，您可以使用以下命令来实现:
```js
server.route({
  method: ['PUT', 'POST'],
  path: '/',
  handler: function (request, h) {
    return 'I did something!';
  }
});
```

- 命名参数
  ```js
  server.route({
    method: 'GET',
    path: '/hello/{user}',
    handler: function (request, h) {
      // return `Hello ${request.params.user}!`;
      // 最佳实践是始终返回转义且经过验证的用户输入，例如查询/路径参数。这样做是为了防止回显或 XSS 攻击。一种方法是使用 Hoek的escapeHtml() 方法就地转义
      return `Hello ${Hoek.escapeHtml(request.params.user)}!`;
    }
  });
  ```

- 可选参数。在上面的示例中，`user` 参数是必需的：对 `/hello/bob` 或 `/hello/susan` 的请求将起作用，但对 `/hello` 的请求将不起作用。为了使参数可选，请在参数名称末尾添加问号。注意：只有路径中最后一个命名的参数是可选的。这意味着 `/{one?}/{two}/` 是无效路径。
  ```js
  server.route({
    method: 'GET',
    path: '/hello/{user?}',
    handler: function (request, h) {
      const user = request.params.user ? request.params.user : 'stranger';

      return `Hello ${user}!`;
    }
  });
  ```

- 多段参数。使用星号和数字，星号后面的数字表示应分配给参数的路径段数。您也可以完全省略该数字，该参数将匹配任意数量的可用段。注意：星号只能用在路径中的最后一个参数。
  ```js
  server.route({
    method: 'GET',
    path: '/hello/{user*2}', // /hello/john/doe 能匹配上
    handler: function (request, h) {
      const userParts = request.params.user.split('/');

      return `Hello ${userParts[0]} ${userParts[1]}!`;
    }
  });
  ```

- 查询参数。查询参数通过 URL 以 `key=value` 格式发送。
  ```js
  // localhost:3000?name=ferris&location=chicago
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      return `Hello ${request.query.name}!`; // Hello ferris!
    }
  });
  ```
  对于复杂的查询结构，可以考虑使用qs: 
  ```js
  // localhost:3000?foo[bar]=baz
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      return request.query; // { "foo[bar]": "baz" }
    }
  });
  ```
  ```js
  const Hapi = require('@hapi/hapi');
  const Qs = require('qs');

  const server = Hapi.server({
    port: 3000,
    host: 'localhost',
    query: {
      parser: (query) => Qs.parse(query) //  query 是包含传入 request.query 参数的对象
    }
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      return request.query; // { "foo": { "bar": "baz" } }
    }
  });

  const init = async () => {
    await server.start();
    console.log('Server running on %s', server.info.uri);
  };

  process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
  });

  init();
  ```

- `request.payload`
  ```js
  server.route({
    method: 'POST',
    path: '/signup',
    handler: function (request, h) {
      const payload = request.payload;

      return `Welcome ${payload.username}!`;
    }
  });
  ```

- `handler` 选项是一个接受两个参数 `request` 和 `h` 的函数。`request`是一个对象，其中包含有关最终用户请求的详细信息，例如路径参数、关联的负载(associated payload)、查询参数、身份验证信息、headers等。`h` 是响应工具包，是一个具有多种方法的对象，用于响应请求。

- 404处理。每当您的服务器找不到所请求的资源时，就会发生 404 错误。hapi 路由将首先匹配最具体的path，然后变得更广泛，直到找到匹配项。例如，`localhost:3000/login` 将转到 `/login` 路由，而不是 `/{any*}` 路由。
  ```js
  'use strict';

  const Hapi = require('@hapi/hapi');

  const internals = {};

  const init = async () => {

    const server = Hapi.server({
      port: 3000,
      host: 'localhost'
    });

    server.route({
      method: '*', // 涵盖了所有可用的method
      path: '/{any*}', // 这将捕获其他路由未捕获的任何路由。
      handler: function (request, h) {
        return h.response('404 Error! Page Not Found!').code(404);
      }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
  };

  init();
  ```

#### [Route options]((https://hapi.dev/api/?v=21.3.2#route-options))
除了`method` `path` `handler`之外，还可以为每个路由指定一个`options`参数。
```js
server.route({
  method: 'POST',
  path: '/signup',
  handler: function (request, h) {
    const payload = request.payload;

    return `Welcome ${payload.username}!`;
  },
  options: {
    auth: false,
    validate: {
      payload: {
        username: Joi.string().min(1).max(20),
        password: Joi.string().min(7)
      }
    },
    cors: true,
  }
});
```
##### route.options.cors
跨源资源共享协议（[Cross-Origin Resource Sharing](https://www.w3.org/TR/cors/)）允许浏览器进行跨源API调用。`route.options.cors` 设为`true`或设为具有以下属性的对象 来允许跨域请求资源：
- `origin`: 对应响应头`Access-Control-Allow-Origin`的值。其值为一个数组，该数组可以包含完全限定源以及包含通配符`*`字符的源字符串或单个`*`源字符串的任意组合。如果设置为“ignore”，则任何传入的 `Origin` 标头都将被忽略（存在或不存在），并且`Access-Control-Allow-Origin`标头将设置为`*`。默认为任何来源 `['*']`。

- `maxAge`：对应响应头`Access-Control-Max-Age`的值，表示浏览器应缓存 CORS 响应的秒数。该值越大，浏览器检查策略更改所需的时间就越长。默认为 86400（一天）。

- `headers`: 对应响应头`Access-Control-Allow-Headers`的值，表示允许的标头的字符串数组。默认为`['Accept', 'Authorization', 'Content-Type', 'If-None-Match']`

- `additionalHeaders`: 附加标头的字符串数组。使用它来保留默认标头。

- `exposedHeaders`: 对应响应头`Access-Control-Expose-Headers`的值，表示公开标头的字符串数组。默认为`['WWW-Authenticate', 'Server-Authorization']`

- `credentials`: 如果为 true，则允许发送用户凭据（`Access-Control-Allow-Credentials`）。默认为 false。

- `preflightStatusCode`: 用于 CORS 预检响应的状态代码，200 或 204。默认为 200。

### Cookies
- 要使用 cookie，首先需要通过调用 `server.state(name, [options])` 来配置它，其中 name 是 cookie 的名称，options 是用于配置 cookie 的对象。
  ```js
  server.state('data', {
    ttl: null, // ttl表示 cookies 的生存时间（以毫秒为单位）。默认设置为null，即一旦关闭浏览器就会删除cookie。
    isSecure: true, // 设置cookie的Secure属性为true
    isHttpOnly: true, // 设置cookie的HttpOnly属性为true
    encoding: 'base64json', // 表示cookie的值是一个 base64 编码的 JSON 字符串
    clearInvalid: true, // 指示客户端删除无效的cookie
    strictHeader: true // 表示不违反 RFC 6265(https://tools.ietf.org/html/rfc6265)
  });
  ```

- 除此之外，您还可以通过在路由的 `options.state` 对象中指定两个属性来进一步配置路由级别的 cookie 行为。请注意，路由级别的 cookie 配置是 基于 `server.state` 所做的配置的。
  ```js
  {
    options: {
      state: {
        parse: true, // parse属性 决定cookie是否被解析并存储在request.state中。
        failAction: 'error' // failAction属性 决定如何处理 cookie 解析错误。
      }
    }
  }
  ```

- 您可以通过调用 `h.state(name, value, [options]` 设置 cookie。在以下示例中，您在路由处理程序中设置 cookie：
  ```js
  server.state('data', {
    ttl: null,
    isSecure: true,
    isHttpOnly: true,
    encoding: 'base64json',
    clearInvalid: true,
    strictHeader: true
  });
  server.route({
    method: 'GET',
    path: '/',
    handler: function (request, h) {
      // 注意，前提了使用server.state设置了name为data的cookie，否则报错
      h.state('data', { firstVisit: false }); // 将名为 data 的 cookie 的值设置为 {firstVisit: false } 的 Base64 编码 JSON 字符串表示形式
      return h.response('Hello');
      // state() 方法也可用于响应对象，它允许方便的链式调用，如下：
      // return h.response('Hello').state('data', { firstVisit: false });
      // 使用h.state时也可以传入options，注意，h.state的options不能与server.state的options重复。如下设置名为 data 的 cookie 的值为test(不编码处理，此时应设置cookie的值为普通的字符串，否则报错Invalid cookie value，并且server.state的options中的encoding属性应去掉)
      // return h.response('Hello').state('data', 'test', { encoding: 'none' });
    }
  });
  ```

- 可以使用`request.state`获取cookie，比如：`request.state.data`可以获取到名为data的cookie的值`{ firstVisit: false }`

- 可以使用`h.unstate`清除cookie，比如：`h.response('Bye').unstate('data')`

#### [@hapi/cookie](https://hapi.dev/module/cookie/api/?v=12.0.1)
`@hapi/cookie`是一个Cookie身份验证插件。Cookie 身份验证提供简单的基于 cookie 的会话管理。身份验证成功后，浏览器会收到带有会话 cookie 的回复。 cookie 使用 [Iron](https://github.com/hapijs/iron) 对会话内容进行加密和签名。

:::info
- 每个 cookie 都作为不记名令牌(a bearer token)运行，拥有 cookie 内容的任何人都可以使用它来冒充其真正所有者。

- [Cookie 有一个实用的最大长度](https://www.thoughtco.com/cookie-size-limit-3466810)。您存储在 cookie 中的所有数据都会发送到浏览器。如果您的 cookie 太长，浏览器可能不会设置它。如果您需要存储更多数据，请在 cookie 中存储少量标识数据，并将其用作服务器端缓存系统的密钥。
:::

因为'cookie' scheme 使用特定于会话的方法来装饰请求对象，所以它不能被注册多次。

'cookie' scheme 有以下选项：
- cookie，是个对象，有以下属性：
  - `name` cookie名字，默认为'sid'
  - `password` 用于 Iron cookie 编码。长度应至少为 32 个字符。
  - `ttl` 用于设置 cookie 的过期时间（以毫秒为单位）。默认为单个浏览器会话（浏览器关闭时结束）。当 keepAlive 为 true 时需要。
  - `domain` 设置 cookie 域值。默认为无。
  - `path` 设置 cookie 路径值。默认为无。
  - `clearInvalid` 如果为 `true`，则任何验证失败的身份验证 cookie 将在响应中标记为过期并清除。默认为 `false`。
  - `isSameSite` 如果为 `false` 则省略。其他可选的值有`Strict` 或 `Lax`。默认为`Strict`。
  - `isSecure` 如果为 `false`，则允许通过不安全的连接传输 cookie，从而使其遭受攻击。默认为 `true`。
  - `isHttpOnly` 如果为 `false`，则 cookie 将不包含“HttpOnly”标志。默认为 `true`。

- `keepAlive` 如果为 `true`，则在验证后自动设置会话 cookie，以将当前会话延长新的 `ttl` 持续时间。默认为 `false`。
- redirectTo
- appendNext
- `validate` 一个可选的会话验证函数: `async (request, session) => {}`（request 为请求对象；session 是通过 `request.cookieAuth.set()` 设置的cookie的值），用于验证每个请求的会话 cookie 的内容。用于验证内部会话状态是否仍然有效（例如用户帐户仍然存在）。
- requestDecoratorName

#### [@hapi/iron](https://hapi.dev/module/iron/)
封装的令牌。iron 是一种加密实用程序，用于使用对称密钥加密和消息完整性验证来密封 JSON 对象。 或者换句话说，它可以让您加密一个对象，将其发送（以 cookie、身份验证凭据等形式），然后接收并解密。 该算法确保消息不被篡改，并且还提供了简单的密码轮换机制。iron 提供了加密对象、生成消息认证码的方法，并将两者序列化为 cookie / URI / HTTP header友好格式。（消息认证码, message authentication code, MAC）

加密一个对象：
```js
const obj = {
  a: 1,
  b: 2,
  c: [3, 4, 5],
  d: {
    e: 'f'
  }
};

const password = 'some_not_random_password_that_is_at_least_32_characters';

try {
  // 加密对象的结果sealed是一个字符串，可以放到cookie里或者HTTP header里或者作为URI查询参数
  const sealed = await Iron.seal(obj, password, Iron.defaults);
} catch (err) {
  console.log(err.message);
}
```
解密上述字符串：
```js
try {
  const unsealed = await Iron.unseal(sealed, password, Iron.defaults);
} catch (err) {
  console.log(err.message);
}
```

- `seal(object, password, options)`
  - password参数：可以是用于使用 pbkdf2 算法生成密钥的密码字符串（长度应至少为 32 个字符）。也可以是一个对象形如`{id:xx,secret:xx}`或`{id:xx,encryption:xx,integrity:xx}`。建议将密码 id 与 ttl 选项结合起来，生成具有有限时间有效性的 Iron 协议字符串，这也允许轮换密码，而无需保留所有以前的密码（仅保留 ttl 窗口内使用的密码数量）。
  - options。其中，ttl表示加密对象的生命周期（以毫秒为单位），其中 0 表示永远。默认为 0。`Iron.defaults` 可以作为options

:::tip
PBKDF2 是基于密码的密钥派生函数。在许多密码学的应用中，用户安全最终取决于密码，并且由于密码通常不能直接用作密钥，因此需要进行一些处理。盐为任何给定的密码提供了大量的密钥，并且迭代计数增加了从密码生成密钥的成本，从而也增加了攻击的难度。比如，在数据库中存储用户密码时，我们一般不会存储明文，而是将密码加盐后做哈希然后再存储，避免密码泄露的风险。可以考虑直接使用 PBKDF2 函数在进行这一步的加密。
:::

- `Iron.defaults`
  ```js
  {
    encryption: { // 定义加密过程
      saltBits: 256,
      algorithm: 'aes-256-cbc',
      iterations: 1
    },
    integrity: { // 定义 HMAC 完整性验证过程
      saltBits: 256,
      algorithm: 'sha256',
      iterations: 1
    },
    ttl: 0,
    timestampSkewSec: 60,
    localtimeOffsetMsec: 0
  }
  ```


### 身份验证策略
hapi 的身份认证基于两个概念：schemes 和 strategies。

身份验证例子：
1. 访问`localhost:4000`时根据cookie strategy先判断有没有cookie
   1. 没有的话重定向到`localhost:4000/login`
   2. 有的话调用validate校验cookie的有效性，cookie无效的话重定向到`localhost:4000/login`，有效的话进入`localhost:4000`
2. 直接访问`localhost:4000/login`设置禁止重定向，并使用`request.auth.isAuthenticated`进行身份验证，如果有有效的cookie则会重定向到`localhost:4000`
3. logout的话使用`request.cookieAuth.clear()`清除cookie
```js
'use strict';

const Hapi = require('@hapi/hapi');
const Bcrypt = require('bcrypt');
const Iron = require('@hapi/iron');

const internals = {};


// Simulate database for demo

internals.users = [
  {
    id: 1,
    name: 'john',
    password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
  },
];


internals.renderHtml = {
  login: (message) => {
    return `
    <html><head><title>Login page</title></head><body>
    ${message ? '<h3>' + message + '</h3><br></a>' : ''}
    <form method="post" action="/login">
      Username: <input type="text" name="username"><br>
      Password: <input type="password" name="password"><br></a>
    <input type="submit" value="Login"></form>
    </body></html>
      `;
  },
  home: (name) => {
    return `
    <html><head><title>Login page</title></head><body>
    <h3>Welcome ${name}! You are logged in!</h3>
    <form method="get" action="/logout">
      <input type="submit" value="Logout">
    </form>
    </body></html>
      `;
  }
};


internals.server = async function () {

  const server = Hapi.server({ port: 4000, host: 'localhost' });

  await server.register(require('@hapi/cookie'));

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'sid-example',

      // Don't forget to change it to your own secret password!
      password: 'password-should-be-32-characters',

      // For working via HTTP in localhost
      isSecure: false
    },

    redirectTo: '/login',

    validate: async (request, session) => {
      console.log('session cookie: ', session) // session cookie:  { id: 1 }
      const unseal = await Iron.unseal(
        'Fe26.2**6385f16d3746b5c3f7acc5d49cdd9eb4d04454e08b07fda211f98ed7d953c0ec*L_qxkbu3iUexV6P5I1vJvA*5JtC_MPPQq3WfN7m9YuYwA**41df5cdeaee532c96b89b35670c5653261766642803719879de272f417bc32e1*pSacjR7Fh6AZE8Ap8sEeEMYRB4Feci5AbdAVUhUk-RE',
        'password-should-be-32-characters',
        Iron.defaults
      );
      console.log('unseal: ', unseal) // unseal:  { id: 1 }
      const account = internals.users.find((user) => (user.id === session.id));

      if (!account) {
        // Must return { isValid: false } for invalid cookies
        return { isValid: false };
      }

      return { isValid: true, credentials: account }; // credentials 跟 request.cookieAuth.set 的作用类似
    }
  });

  server.auth.default('session');

  server.route([
    {
      method: 'GET',
      path: '/',
      options: {
        handler: (request, h) => {
          return internals.renderHtml.home(request.auth.credentials.name);
        }
      }
    },
    {
      method: 'GET',
      path: '/login',
      options: {
        auth: {
          mode: 'try'
        },
        plugins: {
          cookie: {
            redirectTo: false
          }
        },
        handler: async (request, h) => {
          if (request.auth.isAuthenticated) {
            return h.redirect('/');
          }

          return internals.renderHtml.login();
        }
      }
    },
    {
      method: 'POST',
      path: '/login',
      options: {
        auth: {
          mode: 'try'
        },
        handler: async (request, h) => {
          const { username, password } = request.payload;
          if (!username || !password) {
            return internals.renderHtml.login('Missing username or password');
          }

          // Try to find user with given credentials

          const account = internals.users.find(
            (user) => user.name === username
          );

          if (!account || !(await Bcrypt.compare(password, account.password))) {
            return internals.renderHtml.login('Invalid username or password');
          }

          request.cookieAuth.set({ id: account.id }); // 设置cookie，使用iron加密{ id: 1 }生成加密字符串作为cookie的值发送给客户端
          return h.redirect('/');
        }
      }
    },
    {
      method: 'GET',
      path: '/logout',
      options: {
        handler: (request, h) => {
          request.cookieAuth.clear();
          return h.redirect('/');
        }
      }
    }
  ]);

  await server.start();
  console.log(`Server started at: ${server.info.uri}`);
};


internals.start = async function () {
  try {
    await internals.server();
  }
  catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
};

internals.start();
```

#### schemes
```js
function (server, options) {
  const scheme = {
    /**
     * h 是标准 hapi 响应工具包（response toolkit）。
     */
    authenticate: async function (request, h) {
      /**
       * 当身份验证成功时，您必须调用并返回 h.authenticated({credentials,artifacts})。
       * credentials 属性是一个表示经过身份验证的用户（或用户尝试进行身份验证的凭据）的对象。此外，您还可能有一个artifacts 属性，其中可以包含不属于用户凭据一部分的任何身份验证相关数据。
       * credentials和artifacts属性可以稍后作为 request.auth 对象的一部分访问（例如，在路由处理程序中）
       */
      return h.authenticated({ credentials });
    }
  };
  return scheme;
}
```

#### strategies
- a strategy is essentially a pre-configured instance of a scheme. 策略本质上是方案的预配置实例。

- 要注册strategy，您必须首先注册scheme，然后使用 `server.auth.strategy(name, schema, [options])` 注册您的strategy。
  ```js
  const start = async () => {
    const server = Hapi.server({ port: 4000, host: 'localhost' });

    // 注册 @hapi/cookie 这个scheme
    await server.register(require('@hapi/cookie'));

    /**
     * 注册strategy，命名为session，使用的scheme是cookie即@hapi/cookie，options中自定义了cookie redirectTo validate
     *
     * cookie：设置 cookie 的名称，在本例中为 sid-example。password设置将用于加密 cookie 的密码，该长度应至少为 32 个字符。将 isSecure 设置为 false。这对于通过 HTTP 工作时的开发环境来说是可以的。在生产环境，应将其切换回 true，这是默认设置。
     * redirectTo：如果未经身份验证的用户尝试访问需要身份验证的资源，redirectTo将告诉服务器重定向到哪里。
     * validate：用于验证当前 cookie 是否仍然有效。例如，如果用户成功验证自己的身份，收到 cookie，然后离开站点。一旦他们返回，validate 将检查他们当前的 cookie 是否仍然有效。
     */
    server.auth.strategy('session', 'cookie', {
      cookie: {
        name: 'sid-example',
        password: '!wsYhFA*C2U6nz=Bu^%A@^F#SF3&kSR6',
        isSecure: false
      },
      redirectTo: '/login',
      validate: async (request, session) => {
        console.log('session: ', session)
        const account = await users.find(
          (user) => (user.id === session.id)
        );

        if (!account) {
          return { isValid: false };
        }

        return { isValid: true, credentials: account };
      }
    });
  }
  ```

##### Default Strategy
您可以使用 `server.auth.default(param)` 设置默认策略。此方法接受一个参数，该参数可以是一个带有默认策略名称的字符串，也可以是一个与路由处理程序的身份验证选项格式相同的对象。请注意，所有路由都将应用默认策略，即使是在调用 `server.auth.default(param)` 之前添加的路由。

```js
const start = async () => {
  await server.register(require('@hapi/cookie'));

  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'sid-example',
      password: '!wsYhFA*C2U6nz=Bu^%A@^F#SF3&kSR6',
      isSecure: false
    },
    redirectTo: '/login',
    validate: async (request, session) => {
      console.log('session: ', session)
      const account = await users.find(
        (user) => (user.id === session.id)
      );

      if (!account) {
        return { isValid: false };
      }

      return { isValid: true, credentials: account };
    }
  });

  server.auth.default('session'); // 所有路由都校验有没有携带cookie，未携带则重定向到登录页面，此时不会走到策略的validate属性，若携带cookie则会走到策略的validate属性对cookie的有效性进行校验
}
```

##### Route Configuration
除了设置默认策略，还可以通过 `options.auth` 参数在路由上配置身份验证。`options.auth` 的值可以是：
- `false`。如果设置为 `false`，则禁用该路由的身份验证。
  ```js
  {
    method: 'GET',
    path: '/login',
    handler: function (request, h) {
      return `
        <html>
          <head>
            <title>Login page</title>
          </head>
          <body>
            <h3>Please Log In</h3>
            <form method="post" action="/login">
              Username: <input type="text" name="username"><br>
              Password: <input type="password" name="password"><br/>
            <input type="submit" value="Login"></form>
          </body>
        </html>
      `;
    },
    options: {
      auth: false // 禁用该路由的身份验证
    }
  }
  ```

- strategy名字
  ```js
  const start = async () => {
    await server.register(require('@hapi/basic'));
    server.auth.strategy('simple', 'basic', { validate });
    server.route({
      method: 'GET',
      path: '/',
      options: {
        auth: 'simple'
      },
      handler: function (request, h) {
        return 'welcome';
      }
    });
  }
  ```

- 对象，属性可以有`mode` `strategies` `payload`。`mode`属性的值可以有`'required'` `'optional'` `'try'`。如果设置为“required”，为了访问路由，用户必须经过身份验证，并且他们的身份验证必须有效，否则他们将收到错误。如果设置为“optional”，策略仍将应用于路由，但在这种情况下，用户不需要进行身份验证。身份验证数据是可选的，但如果提供，则必须有效。 “try”和“optional”之间的区别在于，“try”会接受无效的身份验证，并且用户仍将到达路由处理程序。
  ```js
  {
    method: 'POST',
    path: '/login',
    handler: async (request, h) => {
      console.log('request: ', request)
      const { username, password } = request.payload;
      const account = users.find(
        (user) => user.username === username
      );

      if (!account || !(await Bcrypt.compare(password, account.password))) {

        return h.redirect('/login');
      }

      request.cookieAuth.set({ id: account.id }); // 设置cookie

      return h.redirect('/');
    },
    options: {
      auth: {
        mode: 'try'
      }
    }
  }
  ```

### [Plugins](https://hapi.dev/plugins/)
#### hapi-mongodb
:::tip
hapi-mongodb 插件只是[官方 MongoDB Node.js 驱动程序](https://mongodb.github.io/node-mongodb-native/)的包装器，因此所有方法的工作原理完全相同。
:::

安装：`npm install hapi-mongodb --save`

注册插件：
```js
await server.register({
  plugin: require('hapi-mongodb'),
  options: {
    uri: 'mongodb+srv://admin:r6H5e4YZNmIV7TP7@cluster0.ghhxkbg.mongodb.net/test?retryWrites=true&w=majority',
    settings : {
      useUnifiedTopology: true
    },
    decorate: true
  }
});
```

### 日志记录

#### `request.log(tags, [data])`
用于在请求上下文中记录某些内容（例如路由处理程序、请求生命周期扩展或身份验证方案）
- tags: 用于标识事件的字符串或字符串数​​组（例如`['error'、'database'、'read']`）。使用标签代替日志级别，并提供更具表现力的机制来描述和过滤事件。

```js
server.route({
  method: 'GET',
  path: '/',
  handler: function (request, h) {
    request.log('error', 'Event error');
    return 'Hello World';
  }
});
```

#### `server.log(tags, [data, [timestamp]])`
当在作用域内没有特定请求时，例如，在服务器启动后或在插件的 `register()` 方法内，使用 `server.log()` 。
- timestamp参数默认为 `Date.now()`
- 其他参数与`request.log`的参数意义相同

```js
const Hapi = require('@hapi/hapi');
const server = Hapi.server({ port: 80 });

server.log(['test', 'error'], 'Test event');
```

### [JWT](https://hapi.dev/module/jwt/)
JWT (JSON Web Token) 身份验证：`yarn add @hapi/jwt` 或 `npm install @hapi/jwt`:
```js
await server.register(require('@hapi/jwt'));

server.auth.strategy('my_jwt_strategy', 'jwt', options)

// options示例
{
  keys: 'some_shared_secret', // 包含用于 jwt 验证的关键方法的对象或对象数组。
  verify: { // 确定如何在密钥签名之外验证密钥内容。设置为 false 不进行验证。
    aud: 'urn:audience:test', // 与令牌受众匹配的字符串或正则表达式或字符串或正则表达式数组。设置为布尔值 false 不验证 aud。如果 verify 不为 false，则为必填项。
    iss: 'urn:issuer:test', // 与令牌发行者匹配的字符串或字符串数​​组。设置为 boolean false 不验证 iss。如果 verify 不为 false，则为必填项。
    sub: false, // 与令牌主题匹配的字符串或字符串数​​组。设置为布尔值 false 以不验证sub。如果 verify 不为 false，则为必填项。
    nbf: true, // 布尔值，用于确定是否应验证令牌的“不早于”NumericDate。默认为 true。
    exp: true, // 布尔值，用于确定是否应验证令牌的“到期时间”NumericDate。默认为 true。
    maxAgeSec: 14400, // 4 hours 用于确定令牌的最长期限（以秒为单位）的整数。默认值为 0。这是使用“发布于”NumericDate (iat) 的时间验证。请注意，0 有效地禁用此验证，它不会使令牌的最大期限为 0 秒。此外，如果 maxAgeSec 不为 0 并且 exp 为 true，则两者都将被验证，如果其中一个验证失败，则令牌验证将失败。
    timeSkewSec: 15 // 用于调整 exp 和 maxAgeSec 的整数，以考虑服务器时间漂移（以秒为单位）。默认值为 0。
  },
  /**
   * 允许基于解码的有效负载进行额外验证并将特定凭据放入请求对象中的函数。如果不需要额外的验证，可以设置为 false。
   * artifacts = { // 包含令牌信息的对象
   *  token: xxx, // 发送的完整令牌
   *  decoded: { // 包含已解码令牌的对象
   *    header: { // 包含标头信息的对象
   *      alg: xxx, // 用于签署令牌的算法
   *      typ: 'JWT', // 令牌类型（如果存在，应为“JWT”）（可选）
   *    },
   *    payload: {}, // 包含有效负载的对象
   *    signature: 'xxx', // 令牌的签名字符串
   *  },
   *  raw: {}, // 包含按标头、有效负载和签名细分的已发送令牌的对象
   *  keys: [ // 有关用于身份验证的密钥的信息数组
   *   {
   *     key: 'xxx', // 密钥
   *     algorithm: 'xxx', // 用于签署令牌的算法
   *     kid: 'xxx', // 密钥 ID 标头。如果没有设置则为undefined。
   *    }
   *  ]
   * }
   */
  validate: (artifacts, request, h) => {

    return {
      isValid: true,
      credentials: { user: artifacts.decoded.payload.user }
    };
  },
  headerName: 'authorization', // 告诉 jwt 插件从指定的标头中读取令牌。默认为“authorization”。
  httpAuthScheme: 'Bearer', // 字符串表示身份验证方案。默认为“Bearer”。
  headless: 'xxx', // 表示 base64 标头或用作无头令牌标头的对象的字符串。如果设置了此选项，包含标头部分的令牌将返回 401
  unauthorizedAttributes: 'xxx', // 如果没有抛出自定义错误，则直接传递给 Boom.unauthorized 的字符串。对于在 WWW-Authenticate 标头中设置领域属性很有用。默认为undefined。
}
```

其中keys选项有以下几种：
```js
// Single shared secret
{
  keys: 'some_shared_secret'
}
...

// Single shared secret with algorithms and key ID header
{
  keys: {
    key: 'some_shared_secret',
    algorithms: ['HS256', 'HS512'],
    kid: 'someKid'
  }
}
...

// Multiple shared secret
{
  keys: ['some_shared_secret_1', 'shared_secret_2', 'shared_secret_3']
}
...

// Multiple shared secret with algorithm and key ID header
{
  keys: [
    {
      key: 'some_shared_secret'
      algorithms: ['HS256', 'HS512'],
      kid: 'someKid'
    },
    {
      key: 'shared_secret2'
      algorithms: ['HS512'],
      kid: 'someKid2'
    }
  ]
}
...

// Single Public Key
{
  keys: fs.readFileSync('public.pem')
}
...

// Single EdDSA key with algorithms
{
  keys: {
    key: Mock.pair('EdDSA', 'ed25519').public,
    algorithms: ['EdDSA']
  }
}

...
// Single JWKS with headers and algorithms
{
  keys: {
    uri: 'https://jwks-provider.com/.well-known/jwks.json',
    headers: {'x-org-name': 'my_company'},
    algorithms: ['RS256', 'RS512']
  }
}
...

// No algorithms
{
  keys: ['none']
}
...

// Single custom function
// This function accomplishes the same thing as Single shared secret
{
  keys: () => { return 'some_shared_secret'; }
}
```

例子：
```js
'use strict';

const Hapi = require('@hapi/hapi');
const Bcrypt = require('bcrypt');
const Dotenv = require('dotenv');
const Jwt = require('@hapi/jwt');
const Boom = require('@hapi/boom');

Dotenv.config();

// Simulate database for demo
const users = [
  {
    id: 1,
    name: 'john',
    password: '$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm',   // 'secret'
  },
];

const corsOrigin = [process.env.CORS_ORIGIN];

const init = async function () {
  const server = Hapi.server({ host: process.env.HOST, port: process.env.PORT });

  await server.register(Jwt);

  /**
   * 使用 jwt 方案声明身份验证策略
   * keys: 使用共享密钥或 json Web 密钥集 uri
   * verify: 确定如何在签名之外验证密钥内容
   * 如果 verify 设置为 false，则不需要并忽略 keys 选项
   * 如果 verify 未设置为 false，则需要 verify: { aud, iss, sub } 选项
   * verify: { exp, nbf, timeSkewSec, maxAgeSec } 参数有默认值
   * validate: 创建一个在令牌验证后调用的函数
   */
  server.auth.strategy('my_jwt_strategy', 'jwt', {
    keys: process.env.JWT_KEYS,
    verify: {
      aud: process.env.JWT_AUD,
      iss: process.env.JWT_ISS,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: +process.env.JWT_MAXAGESEC, // 4 hours
      timeSkewSec: 15
    },
    validate: async (artifacts, request, h) => {
      console.log('payload: ', artifacts.decoded.payload)
      /*
      payload: {
        aud: 'render:audience:react',
        iss: 'render:issuer:hapi',
        user: 'john',
        group: 'hapi_render',
        iat: 1705394079,
        exp: 1705408479
      }
      */

      const headerAuthorization = request.headers['authorization'];
      console.log('artifacts.token: ', artifacts.token) // 颁发的token. 会校验请求头是否包含设置的headerName(默认为'authorization')以及它的值是否以设置的httpAuthScheme(默认为'Bearer')开头

      let isValid;
      // 每次请求验证客户端请求头中的Authorization中的token
      if (headerAuthorization) {
        // const token = request.headers['authorization'].split('Bearer ').pop();
        const token = artifacts.token;
        const decodedToken = Jwt.token.decode(token);
        console.log('decodedToken: ', decodedToken)
        /*
        decodedToken: {
          token: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJyZW5kZXI6YXVkaWVuY2U6cmVhY3QiLCJpc3MiOiJyZW5kZXI6aXNzdWVyOmhhcGkiLCJ1c2VyIjoiam9obiIsImdyb3VwIjoiaGFwaV9yZW5kZXIiLCJpYXQiOjE3MDUzOTQwNzksImV4cCI6MTcwNTQwODQ3OX0.y7eRNgdRUkHiix_tQWgQ2Gm7NkzwEebehKfqDztuKrYy2wwuGFizVvD5ykt9v_omX2qaIxKTOzIYEU6Ty-kFLA',
          decoded: {
            header: { alg: 'HS512', typ: 'JWT' },
            payload: {
              aud: 'render:audience:react',
              iss: 'render:issuer:hapi',
              user: 'john',
              group: 'hapi_render',
              iat: 1705394079,
              exp: 1705408479
            },
            signature: 'y7eRNgdRUkHiix_tQWgQ2Gm7NkzwEebehKfqDztuKrYy2wwuGFizVvD5ykt9v_omX2qaIxKTOzIYEU6Ty-kFLA'
          },
          raw: {
            header: 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9',
            payload: 'eyJhdWQiOiJyZW5kZXI6YXVkaWVuY2U6cmVhY3QiLCJpc3MiOiJyZW5kZXI6aXNzdWVyOmhhcGkiLCJ1c2VyIjoiam9obiIsImdyb3VwIjoiaGFwaV9yZW5kZXIiLCJpYXQiOjE3MDUzOTQwNzksImV4cCI6MTcwNTQwODQ3OX0',
            signature: 'y7eRNgdRUkHiix_tQWgQ2Gm7NkzwEebehKfqDztuKrYy2wwuGFizVvD5ykt9v_omX2qaIxKTOzIYEU6Ty-kFLA'
          }
        }
        */

        try {
          const validResult = Jwt.token.verify(decodedToken, process.env.JWT_KEYS);
          console.log('validResult: ', validResult)
          isValid = true;
        } catch(error) {
          // jwt token校验不通过的逻辑
          console.log('verify token error: ', error.message)
          isValid = false;
        }
      } else {
        isValid = false;
      }
      
      return {
        isValid,
        credentials: { user: artifacts.decoded.payload.user }
      };
    }
  });

  server.auth.default('my_jwt_strategy');

  await server.register({
    plugin: require('hapi-mongodb'),
    options: {
      url: process.env.DATABASE_URL,
      settings: {
        useUnifiedTopology: true
      },
      decorate: true
    }
  });

  server.route([
    {
      method: '*', // 涵盖了所有可用的method
      path: '/{any*}', // 这将捕获其他路由未捕获的任何路由。
      handler: function (request, h) {
        return Boom.notFound('missing');
      },
      options: {
        cors: {
          origin: corsOrigin,
        },
      }
    },
    {
      method: 'POST',
      path: '/login',
      handler: async (request, h) => {
        const { userName, password } = request.payload;
        if (!userName || !password) {
          return h.response({
            data: null,
            success: false,
            message: '用户名或密码不能为空'
          });
        }

        const account = users.find((user) => user.name === userName);
        if (!account || !(await Bcrypt.compare(password, account.password))) {
          return h.response({
            data: null,
            success: false,
            message: '无效的用户名或密码'
          });
        }

        // 用户名密码验证通过后生成JWT token并发送给客户端
        const token = Jwt.token.generate(
          { // payload
            aud: process.env.JWT_AUD,
            iss: process.env.JWT_ISS,
            user: userName,
            group: 'hapi_render'
          },
          { // secret
            key: process.env.JWT_KEYS,
            algorithm: 'HS512'
          },
          { // options
            ttlSec: +process.env.JWT_MAXAGESEC // 4 hours
          }
        );

        return h.response({
          data: userName,
          token: token,
          success: true,
        });
      },
      options: {
        auth: { // 使用strategy则默认auth的值为{mode: 'required'}
          mode: 'try' // 任何请求凭据都会尝试进行身份验证，但如果凭据无效，则无论身份验证错误如何，请求都会继续进行。
        },
        cors: {
          origin: corsOrigin,
        },
      }
    },
    {
      method: 'GET',
      path: '/logout',
      handler: (request, h) => {
        request.cookieAuth.clear();
        return h.redirect('/');
      }
    },
    // 获取一个todo事项
    {
      method: 'GET',
      path: '/todo',
      handler: async (request, h) => {
        const todo = await request.mongo.db.collection('todolists').findOne({})

        return h.response(todo);
      },
      options: {
        cors: {
          origin: corsOrigin,
        },
      },
    }
  ]);

  await server.start();
  console.log(`Server started at: ${server.info.uri}`);
};


const start = async function () {
  try {
    await init();
  }
  catch (err) {
    console.error(err.stack);
    process.exit(1);
  }
};

start();
```

### [Boom](https://hapi.dev/module/boom/)
安装：`npm install @hapi/boom` 或 `yarn add @hapi/boom`。boom提供一组用于返回 HTTP 错误的工具包

- `Boom.unauthorized([message], [scheme], [attributes])` 返回 401 未经授权错误

## nestjs