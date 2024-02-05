---
tags: [http, 请求库]
---

## [axios](https://axios-http.com/)
:::tip
axios的源码中有很多可以借鉴的工具函数
:::

基于promise可以用于浏览器和node.js的网络请求库，在服务端它使用原生 node.js http 模块, 而在客户端 (浏览端) 则使用 XMLHttpRequests。

安装：`yarn add axios`

为了直接使用 `require` 导入预构建的 CommonJS 模块（如果您的模块打包器无法自动解析它们），我们提供了以下预构建模块：
```js
const axios = require('axios/dist/browser/axios.cjs'); // browser
const axios = require('axios/dist/node/axios.cjs'); // node
```

为了在CommonJS中使用 `require（）` 导入时获得TypeScript类型推断（智能感知/自动完成），请使用以下方法：
```ts
const axios = require('axios').default;

// axios.<method> 能够提供自动完成和参数类型推断功能
```

### axios API
两种使用方式：
1. `axios(config)`
   ```js
   // 发起一个post请求
   axios({
     method: 'post',
     url: '/user/12345',
     data: {
       firstName: 'Fred',
       lastName: 'Flintstone'
     }
   });
   ```
   ```js
   // 在 node.js 用GET请求获取远程图片
   axios({
     method: 'get',
     url: 'http://bit.ly/2mTM3nY',
     responseType: 'stream'
   })
     .then(function (response) {
       response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
     });
   ```

2. `axios(url[, config])`
   ```js
   // 发起一个 GET 请求 (默认请求方式)
   axios('/user/12345');
   ```

#### 请求方式别名
为了方便起见，已经为所有支持的请求方法提供了别名。在使用别名方法时，`url`、`method`、`data` 这些属性都不必在配置中指定。
- `axios.request(config)`
- `axios.get(url[, config])`
- `axios.delete(url[, config])`
- `axios.head(url[, config])`
- `axios.options(url[, config])`
- `axios.post(url[, data[, config]])`
- `axios.put(url[, data[, config]])`
- `axios.patch(url[, data[, config]])`
- `axios.postForm(url[, data[, config]])`
- `axios.putForm(url[, data[, config]])`
- `axios.patchForm(url[, data[, config]])`

#### 使用自定义配置新建一个axios实例
`axios.create([config])`
```js
const instance = axios.create({
  baseURL: 'https://some-domain.com/api/',
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar'}
});
```

以下是可用的实例方法。指定的配置将与实例的配置合并。
- `instance.request(config)`
- `instance.get(url[, config])`
- `instance.delete(url[, config])`
- `instance.head(url[, config])`
- `instance.options(url[, config])`
- `instance.post(url[, data[, config]])`
- `instance.put(url[, data[, config]])`
- `instance.patch(url[, data[, config]])`
- `instance.getUri([config])`

### 基本使用
#### 发送GET请求
```js
const axios = require('axios');

// 向给定ID的用户发起请求
axios.get('/user?ID=12345')
  .then(function (response) {
    // 处理成功情况
    console.log(response);
  })
  .catch(function (error) {
    // 处理错误情况
    console.log(error);
  })
  .finally(function () {
    // 总是会执行
  });

// 上述请求也可以按以下方式完成（可选）
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // 总是会执行
  });  

// 支持async/await用法
async function getUser() {
  try {
    const response = await axios.get('/user?ID=12345');
    console.log(response);
  } catch (error) {
    console.error(error);
  }
}
```

- 发起多个并发请求
  ```js
  function getUserAccount() {
    return axios.get('/user/12345');
  }

  function getUserPermissions() {
    return axios.get('/user/12345/permissions');
  }

  const [acct, perm] = await Promise.all([getUserAccount(), getUserPermissions()]);

  // OR

  Promise.all([getUserAccount(), getUserPermissions()])
    .then(function ([acct, perm]) {
      // ...
    });
  ```

#### 发送POST请求
- 发起一个 POST 请求
  ```js
  axios.post('/user', {
    firstName: 'Fred',
    lastName: 'Flintstone'
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  ```

- 将 HTML Form 转换成 JSON 进行请求
  ```js
  const {data} = await axios.post('/user', document.querySelector('#my-form'), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
  ```

- Forms
  - Multipart (`multipart/form-data`)
  ```js
  const {data} = await axios.post('https://httpbin.org/post', {
      firstName: 'Fred',
      lastName: 'Flintstone',
      orders: [1, 2, 3],
      photo: document.querySelector('#fileInput').files
    }, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  )
  ```

  - URL encoded form (`application/x-www-form-urlencoded`)
  ```js
  const {data} = await axios.post('https://httpbin.org/post', {
      firstName: 'Fred',
      lastName: 'Flintstone',
      orders: [1, 2, 3]
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
  })
  ```

### [请求配置](https://axios-http.com/zh/docs/req_config)
这些是创建请求时可以用的配置选项。只有 `url` 是必需的。如果没有指定 `method`，请求将默认使用 `GET` 方法。
```js
{
  // `url` 是用于请求的服务器 URL
  url: '/user',

  // `method` 是创建请求时使用的方法
  method: 'get', // 默认值

  // `baseURL` 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL。
  // 它可以通过设置一个 `baseURL` 便于为 axios 实例的方法传递相对 URL
  baseURL: 'https://some-domain.com/api/',

  // `transformRequest` 允许在向服务器发送前，修改请求数据
  // 它只能用于 'PUT', 'POST' 和 'PATCH' 这几个请求方法
  // 数组中最后一个函数必须返回一个字符串， 一个Buffer实例，ArrayBuffer，FormData，或 Stream
  // 你可以修改请求头。
  transformRequest: [function (data, headers) {
    // 对发送的 data 进行任意转换处理

    return data;
  }],

  // `transformResponse` 在传递给 then/catch 前，允许修改响应数据
  transformResponse: [function (data) {
    // 对接收的 data 进行任意转换处理

    return data;
  }],

  // 自定义请求头
  headers: {'X-Requested-With': 'XMLHttpRequest'},

  // `params` 是与请求一起发送的 URL 参数
  // 必须是一个简单对象或 URLSearchParams 对象
  params: {
    ID: 12345
  },

  // `paramsSerializer`是可选方法，主要用于序列化`params`
  // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
  paramsSerializer: function (params) {
    return Qs.stringify(params, {arrayFormat: 'brackets'})
  },

  // `data` 是作为请求体被发送的数据
  // 仅适用 'PUT', 'POST', 'DELETE 和 'PATCH' 请求方法
  // 在没有设置 `transformRequest` 时，则必须是以下类型之一:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - 浏览器专属: FormData, File, Blob
  // - Node 专属: Stream, Buffer
  data: {
    firstName: 'Fred'
  },
  
  // 发送请求体数据的可选语法
  // 请求方式 post
  // 只有 value 会被发送，key 则不会
  data: 'Country=Brasil&City=Belo Horizonte',

  // `timeout` 指定请求超时的毫秒数。
  // 如果请求时间超过 `timeout` 的值，则请求会被中断
  timeout: 1000, // 默认值是 `0` (永不超时)

  // `withCredentials` 表示跨域请求时是否需要使用凭证
  withCredentials: false, // default

  // `adapter` 允许自定义处理请求，这使测试更加容易。
  // 返回一个 promise 并提供一个有效的响应 （参见 lib/adapters/README.md）。
  adapter: function (config) {
    /* ... */
  },

  // `auth` HTTP Basic Auth
  auth: {
    username: 'janedoe',
    password: 's00pers3cret'
  },

  // `responseType` 表示浏览器将要响应的数据类型
  // 选项包括: 'arraybuffer', 'document', 'json', 'text', 'stream'
  // 浏览器专属：'blob'
  responseType: 'json', // 默认值

  // `responseEncoding` 表示用于解码响应的编码 (Node.js 专属)
  // 注意：忽略 `responseType` 的值为 'stream'，或者是客户端请求
  // Note: Ignored for `responseType` of 'stream' or client-side requests
  responseEncoding: 'utf8', // 默认值

  // `xsrfCookieName` 是 xsrf token 的值，被用作 cookie 的名称
  xsrfCookieName: 'XSRF-TOKEN', // 默认值

  // `xsrfHeaderName` 是带有 xsrf token 值的http 请求头名称
  xsrfHeaderName: 'X-XSRF-TOKEN', // 默认值

  // `onUploadProgress` 允许为上传处理进度事件
  // 浏览器专属
  onUploadProgress: function (progressEvent) {
    // 处理原生进度事件
  },

  // `onDownloadProgress` 允许为下载处理进度事件
  // 浏览器专属
  onDownloadProgress: function (progressEvent) {
    // 处理原生进度事件
  },

  // `maxContentLength` 定义了node.js中允许的HTTP响应内容的最大字节数
  maxContentLength: 2000,

  // `maxBodyLength`（仅Node）定义允许的http请求内容的最大字节数
  maxBodyLength: 2000,

  // `validateStatus` 定义了对于给定的 HTTP状态码是 resolve 还是 reject promise。
  // 如果 `validateStatus` 返回 `true` (或者设置为 `null` 或 `undefined`)，
  // 则promise 将会 resolved，否则是 rejected。
  validateStatus: function (status) {
    return status >= 200 && status < 300; // 默认值
  },

  // `maxRedirects` 定义了在node.js中要遵循的最大重定向数。
  // 如果设置为0，则不会进行重定向
  maxRedirects: 5, // 默认值

  // `socketPath` 定义了在node.js中使用的UNIX套接字。
  // e.g. '/var/run/docker.sock' 发送请求到 docker 守护进程。
  // 只能指定 `socketPath` 或 `proxy` 。
  // 若都指定，这使用 `socketPath` 。
  socketPath: null, // default

  // `httpAgent` and `httpsAgent` define a custom agent to be used when performing http
  // and https requests, respectively, in node.js. This allows options to be added like
  // `keepAlive` that are not enabled by default.
  httpAgent: new http.Agent({ keepAlive: true }),
  httpsAgent: new https.Agent({ keepAlive: true }),

  // `proxy` 定义了代理服务器的主机名，端口和协议。
  // 您可以使用常规的`http_proxy` 和 `https_proxy` 环境变量。
  // 使用 `false` 可以禁用代理功能，同时环境变量也会被忽略。
  // `auth`表示应使用HTTP Basic auth连接到代理，并且提供凭据。
  // 这将设置一个 `Proxy-Authorization` 请求头，它会覆盖 `headers` 中已存在的自定义 `Proxy-Authorization` 请求头。
  // 如果代理服务器使用 HTTPS，则必须设置 protocol 为`https`
  proxy: {
    protocol: 'https',
    host: '127.0.0.1',
    port: 9000,
    auth: {
      username: 'mikeymike',
      password: 'rapunz3l'
    }
  },

  // see https://axios-http.com/zh/docs/cancellation
  cancelToken: new CancelToken(function (cancel) {
  }),

  // `decompress` indicates whether or not the response body should be decompressed 
  // automatically. If set to `true` will also remove the 'content-encoding' header 
  // from the responses objects of all decompressed responses
  // - Node only (XHR cannot turn off decompression)
  decompress: true // 默认值

}
```

### 指定默认配置
您可以指定默认配置，它将作用于每个请求。

#### 指定全局axios默认配置
例如：
```js
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
```

#### 指定自定义axios实例默认配置
例如：
```js
// 创建实例时配置默认值
const instance = axios.create({
  baseURL: 'https://api.example.com'
});

// 创建实例后修改默认值
instance.defaults.headers.common['Authorization'] = `Bearer ${AUTH_TOKEN}`;
// 设置鉴权token为默认headers配置后，就不用存到local storage里了，但是每次刷新页面后需要重新设置该默认配置，否则之间设置的就没了
```

#### 配置的优先级
每个请求的`config`参数 > 自定义axios实例的`defaults`属性 > axios库提供的默认配置
```js
// 使用库提供的默认配置创建实例
// 此时超时配置的默认值是 `0`
const instance = axios.create();

// 重写库的超时默认值
// 现在，所有使用此实例的请求都将等待2.5秒，然后才会超时
instance.defaults.timeout = 2500;

// 重写此请求的超时时间，因为该请求需要很长时间
instance.get('/longRequest', {
  timeout: 5000
});
```

### 拦截器
在请求或响应被 then 或 catch 处理前拦截它们。
```js
// 添加请求拦截器
axios.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  }, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(error);
  });
```

如果你稍后需要移除拦截器，可以使用`axios.interceptors.request.eject`：
```js
const myInterceptor = axios.interceptors.request.use(function () {/*...*/});
axios.interceptors.request.eject(myInterceptor);
```

可以给自定义的 axios 实例添加拦截器:
```js
const instance = axios.create();
instance.interceptors.request.use(function () {/*...*/});
```

### 错误处理
```js
axios.get('/user/12345')
  .catch(function (error) {
    if (error.response) {
      // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
    } else if (error.request) {
      // 请求已经成功发起，但没有收到响应
      // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
      // 而在node.js中是 http.ClientRequest 的实例
      console.log(error.request);
    } else {
      // 发送请求时出了点问题
      console.log('Error', error.message);
    }
    console.log(error.config);
  });
```

### 取消请求
#### [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
从 v0.22.0 开始，Axios 支持以 fetch API 方式—— AbortController 取消请求：
```js
const controller = new AbortController();

axios.get('/foo/bar', {
  signal: controller.signal
}).then(function(response) {
  //...
});
// 取消请求
controller.abort()
```

#### CancelToken(已弃用 deprecated)

### 请求体编码
默认情况下，axios将 JavaScript 对象序列化为 JSON 。要以`application/x-www-form-urlencoded`格式发送数据，您可以使用以下选项之一。
- 在浏览器中，可以使用 `URLSearchParams` API
  ```js
  const params = new URLSearchParams();
  params.append('param1', 'value1');
  params.append('param2', 'value2');
  axios.post('/foo', params);
  ```

- 在浏览器中，也可以使用 `qs` 库编码数据
  ```js
  const qs = require('qs');
  axios.post('/foo', qs.stringify({ 'bar': 123 }));

  // ES6
  import qs from 'qs';
  const data = { 'bar': 123 };
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    data: qs.stringify(data),
    url,
  };
  axios(options);
  ```

- 在 node.js 中，可以使用 [querystring](https://nodejs.org/api/querystring.html) 模块
  ```js
  const querystring = require('querystring');
  axios.post('http://something.com/', querystring.stringify({ foo: 'bar' }));
  ```

- 在 node.js 中，也可以使用`url`模块中的`URLSearchParams` API
  ```js
  const url = require('url');
  const params = new url.URLSearchParams({ foo: 'bar' });
  axios.post('http://something.com/', params.toString());
  ```

- 在 node.js 中，也可以使用`qs`库
- 在 node.js, 也可以使用 `form-data` 库
  ```js
  const FormData = require('form-data');
 
  const form = new FormData();
  form.append('my_field', 'my value');
  form.append('my_buffer', new Buffer(10));
  form.append('my_file', fs.createReadStream('/foo/bar.jpg'));

  axios.post('https://example.com', form, { headers: form.getHeaders() })

  // 或者使用拦截器
  axios.interceptors.request.use(config => {
    if (config.data instanceof FormData) {
      Object.assign(config.headers, config.data.getHeaders());
    }
    return config;
  });
  ```

- 当请求头中的 `content-type` 是 `application/x-www-form-urlencoded` 时，Axios 将自动地将普通对象序列化成 `urlencoded` 的格式。在浏览器和 node.js 环境中都适用。
  ```js
  const data = {
    x: 1,
    arr: [1, 2, 3],
    arr2: [1, [2], 3],
    users: [{name: 'Peter', surname: 'Griffin'}, {name: 'Thomas', surname: 'Anderson'}],
  };

  await axios.post('https://postman-echo.com/post', data,
    {headers: {'content-type': 'application/x-www-form-urlencoded'}}
  );
  ```
  对于上面发送的数据，服务器接收到的数据就像是这样：
  ```js
   {
    x: '1',
    'arr[]': [ '1', '2', '3' ],
    'arr2[0]': '1',
    'arr2[1][0]': '2',
    'arr2[2]': '3',
    'arr3[]': [ '1', '2', '3' ],
    'users[0][name]': 'Peter',
    'users[0][surname]': 'griffin',
    'users[1][name]': 'Thomas',
    'users[1][surname]': 'Anderson'
  }
  ```

### `multipart/form-data` 类型发起 POST 请求


### 使用记录
#### [Axios的Post请求传参的两种方式](https://www.jianshu.com/p/41d248172028)
> [ajax post请求怎么传参_怎么让axios发送json格式的请求数据？](https://blog.csdn.net/weixin_31236935/article/details/112481242)

- 表单 Form Data
- json字符串 Request Payload

#### [encodeURIComponent](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
访问链接上带参为啥需要用encodeURIComponent？比如要访问的链接是：`https://xxx/aaa/bbb?a={b:1}` 服务端渲染，根据链接上的路由/aaa/bbb到服务端controller的方法，这个时候这个方法接参接不到
```js
// 改成如下就能正确接到参数
`https://xxx/aaa/bbb?a=${encodeURIComponent({b:1})}`
```

#### timeout of xxx
当axios设置了[timeout](https://axios-http.com/zh/docs/req_config)，超时的情况有以下几种：
- 后端在部署时前端有请求
- 请求到了后端，后端有异常导致本次请求超时
- 请求没到后端(拦截器日志都没打印出来说明没到后端)，比如后端服务只允许企业内网访问，当用户断开了内网自动连接了手机热点等非内部网络时，请求一直pending，超出设置的值后请求变为canceled，报错timeout of xxx