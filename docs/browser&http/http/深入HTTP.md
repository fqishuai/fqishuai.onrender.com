---
slug: insight
tags: [http]
---

[HTTP](https://developer.mozilla.org/zh-CN/docs/Web/HTTP) 是一个用于传输超媒体文档（例如 HTML）的应用层协议。它是为 Web 浏览器与 Web 服务器之间的通信而设计的，但也可以用于其他目的。HTTP 遵循经典的客户端—服务端模型，客户端打开一个连接以发出请求，然后等待直到收到服务器端响应。HTTP 是无状态协议，这意味着服务器不会在两个请求之间保留任何数据（状态）。
![http知识图谱](img/http知识图谱.jpg)

## HTTP请求头
### `X-Forwarded-For`
"X-Forwarded-For" 是一个 HTTP 请求头字段，通常用于标识通过代理或负载均衡器访问 Web 服务器的客户端的原始 IP 地址。这个字段可以包含多个 IP 地址，最左边的 IP 地址通常是客户端的原始 IP 地址，后面的 IP 地址是经过的代理服务器的 IP 地址。

例如：
```
X-Forwarded-For: 192.0.2.1, 203.0.113.2, 198.51.100.3
```

在这个例子中，`192.0.2.1` 是客户端的原始 IP 地址，`203.0.113.2` 和 `198.51.100.3` 是代理服务器的 IP 地址。

这个字段在调试和日志记录时非常有用，因为它可以帮助服务器识别和记录客户端的真实 IP 地址，即使请求是通过多个代理服务器转发的。

### `Pragma`
`Pragma` 是一个 HTTP 请求头字段，主要用于向服务器发送特定的指令。最常见的用途是 `Pragma: no-cache`，用于指示中间缓存服务器不要缓存请求或响应。虽然 `Pragma` 字段在 HTTP/1.0 中定义，但它在现代 HTTP/1.1 中仍然被支持，主要用于向后兼容。在 HTTP/1.1 中，应该优先使用 `Cache-Control` 字段来控制缓存行为，但为了向后兼容，可以同时使用 `Pragma` 和 `Cache-Control` 字段。

### `Cache-Control`
`Cache-Control` 头字段不仅可以在响应中使用，也可以在请求中使用。作为请求头，`Cache-Control` 用于向服务器和中间缓存（如代理服务器和 CDN）发送缓存控制指令，指定客户端希望如何处理缓存。

#### 常见的 `Cache-Control` 请求指令

以下是一些常见的 `Cache-Control` 请求指令及其作用：
- `no-cache`

  指示缓存服务器在使用缓存对象前，必须向源服务器重新验证其有效性。这并不意味着不使用缓存，而是要求重新验证。

  ```http
  Cache-Control: no-cache
  ```

- `no-store`

  指示缓存服务器和浏览器不要缓存请求或响应的任何部分。这意味着请求和响应都不会被缓存。

  ```http
  Cache-Control: no-store
  ```

- `max-age=<seconds>`

  指示缓存服务器和浏览器只接受在指定时间内（以秒为单位）缓存的响应。如果缓存对象的年龄超过了这个时间，则必须重新验证。

  ```http
  Cache-Control: max-age=60
  ```

- `max-stale[=<seconds>]`

  指示客户端愿意接受过期的响应。如果指定了时间，则表示愿意接受过期不超过指定时间的响应。

  ```http
  Cache-Control: max-stale=120
  ```

- `min-fresh=<seconds>`

  指示客户端希望接受在指定时间内仍然有效的响应。

  ```http
  Cache-Control: min-fresh=60
  ```

- `only-if-cached`

  指示客户端只接受缓存的响应。如果缓存中没有可用的响应，则返回 504（网关超时）状态码。

  ```http
  Cache-Control: only-if-cached
  ```

#### 使用场景

- 强制重新验证缓存

  在某些情况下，客户端可能希望强制缓存服务器在使用缓存对象前重新验证其有效性。例如：

  ```http
  Cache-Control: no-cache
  ```

  这将指示缓存服务器在使用缓存对象前，必须向源服务器重新验证其有效性。

- 禁止缓存

  在某些情况下，客户端可能希望禁止缓存请求或响应的任何部分。例如：

  ```http
  Cache-Control: no-store
  ```

  这将指示缓存服务器和浏览器不要缓存请求或响应的任何部分。

- 只接受缓存的响应

  在某些情况下，客户端可能希望只接受缓存的响应，而不向源服务器发送请求。例如：

  ```http
  Cache-Control: only-if-cached
  ```

  这将指示客户端只接受缓存的响应，如果缓存中没有可用的响应，则返回 504（网关超时）状态码。

#### Node.js处理`Cache-Control`请求头

以下是一个简单的示例，展示如何在 Node.js 中处理包含 `Cache-Control` 请求头的请求：

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    const cacheControl = req.get('Cache-Control');
    if (cacheControl) {
        console.log(`Cache-Control: ${cacheControl}`);
    }
    res.set('Cache-Control', 'public, max-age=600');
    res.send('Hello, world!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

在这个示例中，服务器会检查请求头中的 `Cache-Control` 头字段，并在响应头中设置 `Cache-Control: public, max-age=600`，指示浏览器缓存对象 600 秒（10 分钟）。

## HTTP响应头
### `Age`
`Age` 是一个 HTTP 响应头字段，用于指示缓存对象在缓存中存储的时间（以秒为单位）。它通常由缓存服务器（如 CDN 或代理服务器）添加，用于帮助客户端和其他缓存服务器确定缓存对象的“新鲜度”。

#### 作用

`Age` 头字段的主要作用包括：

1. **指示缓存对象的年龄**：显示缓存对象在缓存中存储的时间，帮助客户端和其他缓存服务器判断缓存对象是否仍然有效。
2. **缓存管理**：帮助缓存服务器管理缓存对象的生命周期，确保缓存对象在适当的时间内被更新或删除。
3. **性能优化**：通过缓存对象的年龄信息，可以优化缓存策略，提高系统性能和响应速度。

#### 示例

以下是一个示例响应头，包含 `Age`：

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234
Connection: keep-alive
Date: Mon, 01 Jan 2023 12:00:00 GMT
Cache-Control: max-age=3600
Age: 1200
```

在这个示例中，`Age: 1200` 表示缓存对象已经在缓存中存储了 1200 秒（即 20 分钟）。

#### 使用场景
1. CDN 缓存

   在使用 CDN（内容分发网络）时，`Age` 头字段可以帮助客户端和其他缓存服务器判断缓存对象的“新鲜度”，从而决定是否使用缓存对象或从源服务器获取新的对象。

2. 代理缓存

   在使用代理服务器进行缓存时，`Age` 头字段可以帮助代理服务器管理缓存对象的生命周期，确保缓存对象在适当的时间内被更新或删除。

3. 浏览器缓存

   浏览器可以使用 `Age` 头字段来判断缓存对象是否仍然有效，从而决定是否使用缓存对象或发送新的请求。

#### 如何使用

1. **配置缓存服务器**：确保缓存服务器（如 CDN 或代理服务器）正确配置，以生成和返回 `Age` 头字段。
2. **检查响应头**：在客户端或其他缓存服务器中检查响应头中的 `Age` 头字段，判断缓存对象的“新鲜度”。
3. **优化缓存策略**：根据 `Age` 头字段的信息，优化缓存策略，提高系统性能和响应速度。

以下是一个简单的示例，展示如何在 Nginx 中配置缓存并返回 `Age` 头字段：

```nginx
http {
  proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m max_size=10g inactive=60m use_temp_path=off;

  server {
    listen 80;
    server_name example.com;

    location / {
      proxy_pass http://backend_server;
      proxy_cache my_cache;
      proxy_cache_valid 200 302 10m;
      proxy_cache_valid 404 1m;
      add_header X-Cache-Status $upstream_cache_status;
    }
  }
}
```

在这个示例中，Nginx 配置了一个缓存区域 `my_cache`，并在响应头中添加了 `X-Cache-Status` 头字段，用于指示缓存状态。`Age` 头字段将由 Nginx 自动生成和返回。

### `Cache-Control`
`Cache-Control` 头字段不仅可以在请求中使用，也可以在响应中使用。作为响应头，`Cache-Control` 用于指定服务器希望客户端和中间缓存（如代理服务器和 CDN）如何处理缓存。

#### 常见的 `Cache-Control` 响应指令

以下是一些常见的 `Cache-Control` 响应指令及其作用：

- `max-age=<seconds>`

  指定缓存对象的最大存储时间（以秒为单位）。在此时间内，缓存对象被认为是新鲜的，不需要重新验证。

  ```http
  Cache-Control: max-age=3600
  ```

- `s-maxage=<seconds>`

  指定共享缓存（如 CDN 和代理服务器）中缓存对象的最大存储时间（以秒为单位）。优先级高于 `max-age`。

  ```http
  Cache-Control: s-maxage=3600
  ```

- `no-cache`

  强制缓存服务器在每次使用缓存对象前，必须向源服务器重新验证其有效性。这并不意味着不使用缓存，而是要求重新验证。

  ```http
  Cache-Control: no-cache
  ```

- `no-store`

  禁止缓存服务器和浏览器缓存请求或响应的任何部分。这意味着请求和响应都不会被缓存。

  ```http
  Cache-Control: no-store
  ```

- `public`

  指示响应可以被任何缓存（包括浏览器、CDN 和代理服务器）缓存。

  ```http
  Cache-Control: public
  ```

- `private`

  指示响应只能被私有缓存（如浏览器）缓存，不能被共享缓存（如 CDN 和代理服务器）缓存。

  ```http
  Cache-Control: private
  ```

- `must-revalidate`

  指示缓存服务器在使用过期的缓存对象前，必须向源服务器重新验证其有效性。

  ```http
  Cache-Control: must-revalidate
  ```

- `proxy-revalidate`

  指示共享缓存（如 CDN 和代理服务器）在使用过期的缓存对象前，必须向源服务器重新验证其有效性。

  ```http
  Cache-Control: proxy-revalidate
  ```

- `immutable`

  指示缓存对象在其有效期内不会改变，缓存服务器和浏览器可以放心地使用缓存对象，而不需要重新验证。

  ```http
  Cache-Control: immutable
  ```

#### 示例

以下是一些包含 `Cache-Control` 头字段的响应示例：

- 示例 1: 缓存 1 小时

  ```http
  HTTP/1.1 200 OK
  Content-Type: text/html
  Content-Length: 1234
  Cache-Control: max-age=3600
  ```

- 示例 2: 禁止缓存

  ```http
  HTTP/1.1 200 OK
  Content-Type: text/html
  Content-Length: 1234
  Cache-Control: no-store
  ```

- 示例 3: 共享缓存 1 小时，私有缓存 10 分钟

  ```http
  HTTP/1.1 200 OK
  Content-Type: text/html
  Content-Length: 1234
  Cache-Control: public, max-age=600, s-maxage=3600
  ```

#### 使用场景

- 浏览器缓存

  通过设置 `Cache-Control` 头字段，可以控制浏览器缓存对象的行为。例如：

  ```http
  Cache-Control: max-age=600
  ```

  这将指示浏览器缓存对象 600 秒（10 分钟）。

- CDN 缓存

  通过设置 `s-maxage` 指令，可以控制 CDN 缓存对象的行为。例如：

  ```http
  Cache-Control: public, s-maxage=3600
  ```

  这将指示 CDN 缓存对象 3600 秒（1 小时）。

- 代理缓存

  通过设置 `no-cache` 或 `must-revalidate` 指令，可以控制代理缓存对象的行为。例如：

  ```http
  Cache-Control: no-cache
  ```

  这将指示代理服务器在每次使用缓存对象前，必须向源服务器重新验证其有效性。

#### Node.js设置`Cache-Control`响应头

以下是一个简单的示例，展示如何在 Node.js 中设置 `Cache-Control` 头字段：

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    res.set('Cache-Control', 'public, max-age=600, s-maxage=3600');
    res.send('Hello, world!');
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

在这个示例中，响应头中包含 `Cache-Control: public, max-age=600, s-maxage=3600`，指示浏览器缓存对象 600 秒（10 分钟），而共享缓存（如 CDN 和代理服务器）缓存对象 3600 秒（1 小时）。

### `ETag`
`ETag`（实体标签）是一个 HTTP 响应头字段，用于标识特定版本的资源。它是由服务器生成的一个唯一标识符，用于表示资源的当前状态或版本。`ETag` 头字段在缓存控制和条件请求中起着重要作用，帮助客户端和服务器高效地管理缓存和资源更新。通过合理使用 `ETag` 头字段，可以提高缓存效率，减少带宽消耗，提高系统性能。

`ETag` 头字段的主要作用包括：

1. **缓存验证**：通过比较客户端缓存的 `ETag` 和服务器上的 `ETag`，可以确定资源是否发生了变化，从而决定是否需要重新下载资源。
2. **条件请求**：与 `If-None-Match` 请求头字段结合使用，可以实现条件请求，减少不必要的数据传输。


以下是一个包含 `ETag` 头字段的响应示例：

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234
ETag: "686897696a7c876b7e"
```

在这个示例中，`ETag: "686897696a7c876b7e"` 是由服务器生成的唯一标识符，用于表示资源的当前版本。

#### 缓存验证/条件请求
通过使用 `ETag` 和 `If-None-Match` 头字段，可以实现条件请求，减少不必要的数据传输。例如：

```http
GET /example HTTP/1.1
Host: www.example.com
If-None-Match: "686897696a7c876b7e"
```

如果资源没有变化，服务器会返回 304 Not Modified 状态码：

```http
HTTP/1.1 304 Not Modified
```

如果资源发生了变化，服务器会返回新的资源和新的 `ETag` 值：

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234
ETag: "7e897696a7c876b7e6868"
```

#### Node.js 中生成和使用 `ETag`

以下是一个简单的示例，展示如何在 Node.js 中生成和使用 `ETag` 头字段：

```javascript
const express = require('express');
const etag = require('etag');
const app = express();

app.get('/', (req, res) => {
    const body = 'Hello, world!';
    const etagValue = etag(body);

    res.set('ETag', etagValue);

    if (req.get('If-None-Match') === etagValue) {
        res.status(304).end();
    } else {
        res.send(body);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

在这个示例中，服务器生成了一个 `ETag` 值，并在响应头中返回。如果客户端发送的 `If-None-Match` 值与服务器上的 `ETag` 值相同，服务器会返回 304 Not Modified 状态码，而不是重新发送整个资源。

### `Last-modified`
`Last-Modified` 是一个 HTTP 响应头字段，用于指示服务器上资源的最后修改时间。它是由服务器生成的一个时间戳，用于表示资源的最新更新时间。`Last-Modified` 头字段在缓存控制和条件请求中起着重要作用，帮助客户端和服务器高效地管理缓存和资源更新。与 `If-Modified-Since` 请求头字段结合使用，可以实现条件请求，减少不必要的数据传输。通过合理使用 `Last-Modified` 头字段，可以提高缓存效率，减少带宽消耗，提高系统性能。

`Last-Modified` 头字段的主要作用包括：

1. **缓存验证**：通过比较客户端缓存的 `Last-Modified` 时间和服务器上的 `Last-Modified` 时间，可以确定资源是否发生了变化，从而决定是否需要重新下载资源。
2. **条件请求**：与 `If-Modified-Since` 请求头字段结合使用，可以实现条件请求，减少不必要的数据传输。


以下是一个包含 `Last-Modified` 头字段的响应示例：

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234
Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
```

在这个示例中，`Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT` 是由服务器生成的时间戳，用于表示资源的最新更新时间。

#### 缓存验证/条件请求
客户端可以使用 `Last-Modified` 头字段来验证缓存的有效性。例如，当客户端缓存了一个资源并再次请求该资源时，可以使用 `If-Modified-Since` 请求头字段发送缓存的 `Last-Modified` 时间：

```http
GET /example HTTP/1.1
Host: www.example.com
If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT
```

服务器接收到请求后，会比较客户端发送的 `If-Modified-Since` 时间和服务器上的 `Last-Modified` 时间。如果两者相同，表示资源没有变化，服务器会返回 304 Not Modified 状态码，而不是重新发送整个资源：

```http
HTTP/1.1 304 Not Modified
```

如果资源发生了变化，服务器会返回新的资源和新的 `Last-Modified` 时间：

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234
Last-Modified: Thu, 22 Oct 2015 08:30:00 GMT
```

#### Node.js 中生成和使用 `Last-Modified`

以下是一个简单的示例，展示如何在 Node.js 中生成和使用 `Last-Modified` 头字段：

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    const body = 'Hello, world!';
    const lastModified = new Date().toUTCString();

    res.set('Last-Modified', lastModified);

    if (req.get('If-Modified-Since') === lastModified) {
        res.status(304).end();
    } else {
        res.send(body);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

在这个示例中，服务器生成了一个 `Last-Modified` 时间，并在响应头中返回。如果客户端发送的 `If-Modified-Since` 时间与服务器上的 `Last-Modified` 时间相同，服务器会返回 304 Not Modified 状态码，而不是重新发送整个资源。

### `Expires`
`Expires` 是一个 HTTP 响应头字段，用于指定资源的过期时间。它是由服务器生成的一个日期和时间，表示在此时间之后，缓存的资源将被视为过期，需要重新从服务器获取。`Expires` 头字段在缓存控制中起着重要作用，帮助客户端和中间缓存（如代理服务器和 CDN）管理缓存的生命周期。虽然 `Cache-Control` 头字段在 HTTP/1.1 中提供了更强大和灵活的缓存控制机制，但为了向后兼容，可以同时使用 `Expires` 和 `Cache-Control` 头字段。通过合理使用 `Expires` 头字段，可以有效管理缓存的生命周期，提高系统性能。

`Expires` 头字段的主要作用包括：

1. **缓存控制**：通过指定资源的过期时间，帮助客户端和中间缓存决定何时需要重新获取资源。
2. **提高性能**：通过合理设置 `Expires` 头字段，可以减少对服务器的请求，提高系统性能和响应速度。


以下是一个包含 `Expires` 头字段的响应示例：

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234
Expires: Wed, 21 Oct 2023 07:28:00 GMT
```

在这个示例中，`Expires: Wed, 21 Oct 2023 07:28:00 GMT` 指示资源将在 2023 年 10 月 21 日 07:28:00 GMT 过期。


通过设置 `Expires` 头字段，可以控制浏览器缓存对象(或者CDN缓存对象)的生命周期。例如：

```http
Expires: Wed, 21 Oct 2023 07:28:00 GMT
```

这将指示浏览器(或者CDN)在指定时间之前可以使用缓存的资源，而不需要重新从服务器(或者源服务器)获取。

#### 与 `Cache-Control` 的关系

在 HTTP/1.1 中，`Cache-Control` 头字段提供了更强大和灵活的缓存控制机制。通常情况下，应该优先使用 `Cache-Control` 头字段来控制缓存行为。然而，为了向后兼容，可以同时使用 `Expires` 和 `Cache-Control` 头字段。

```http
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234
Cache-Control: max-age=3600
Expires: Wed, 21 Oct 2023 07:28:00 GMT
```

在这个示例中，`Cache-Control: max-age=3600` 指示资源在 3600 秒（1 小时）内有效，而 `Expires` 头字段提供了一个具体的过期时间。

#### Node.js 中设置 `Expires`

以下是一个简单的示例，展示如何在 Node.js 中设置 `Expires` 头字段：

```javascript
const express = require('express');
const app = express();

app.get('/', (req, res) => {
    const body = 'Hello, world!';
    const expires = new Date(Date.now() + 3600 * 1000).toUTCString(); // 1 小时后过期

    res.set('Expires', expires);
    res.send(body);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
```

在这个示例中，服务器生成了一个 `Expires` 时间，并在响应头中返回，指示资源将在 1 小时后过期。

## [HTTP 响应状态码](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status)
HTTP 响应状态码用来表明特定 HTTP 请求是否成功完成。 响应被归为以下五大类：
- 信息响应 (100–199)
- 成功响应 (200–299)
- 重定向消息 (300–399)
- 客户端错误响应 (400–499)
- 服务端错误响应 (500–599)

### 302 Found
HTTP 302 Found 重定向状态码表明请求的资源被暂时的移动到了由该 HTTP 响应的响应头 `Location` 指定的 URL 上。浏览器会重定向到这个 URL。比如浏览器访问`http://localhost:4000/todo`，Node.js服务端会校验cookie及其有效性，校验不通过会重定向到`/login`
![302](img/302.jpg)
![302 location](img/302_location.jpg)

## [跨源资源共享（CORS）](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
:::tip
其他资料：[跨域资源共享 CORS 详解](https://www.ruanyifeng.com/blog/2016/04/cors.html)
:::

- 浏览器的同源策略：协议、域名、端口都相同就是同源。不同源的影响：
  - cookie、local storage、indexdb等存储性内容无法读取
  - dom节点无法访问
  - ajax请求发出去了，但是响应被浏览器拦截了。`XXX has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource`.

- 跨源资源共享（CORS，或通俗地译为跨域资源共享）是一种基于 HTTP 头的机制，该机制通过允许服务器标示除了它自己以外的其他源（域、协议或端口），使得浏览器允许这些源访问加载自己的资源。跨源资源共享还通过一种机制来检查服务器是否会允许要发送的真实请求，该机制通过浏览器发起一个到服务器托管的跨源资源的“预检”("preflight")请求。在预检中，浏览器发送的头中标示有 HTTP 方法和真实请求中会用到的头。

- 出于安全性，浏览器限制脚本内发起的跨源 HTTP 请求。例如，XMLHttpRequest 和 Fetch API 遵循同源策略。这意味着使用这些 API 的 Web 应用程序只能从加载应用程序的同一个域请求 HTTP 资源，除非响应报文包含了正确 CORS 响应头。

![cors](img/cors_principle.png)

- 跨源资源共享标准新增了一组 HTTP 标头字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源。另外，规范要求，对那些可能对服务器数据产生副作用的 HTTP 请求方法（特别是 GET 以外的 HTTP 请求，或者搭配某些 MIME 类型的 POST 请求），浏览器必须首先使用 OPTIONS 方法发起一个预检请求（preflight request），从而获知服务端是否允许该跨源请求。服务器确认允许之后，才发起实际的 HTTP 请求。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证（例如 Cookie 和 HTTP 认证相关数据）。

![simple request](img/simple-req.png)
请求标头字段 `Origin` 表明该请求来源于 `http://foo.example`。服务端返回的 `Access-Control-Allow-Origin` 标头的`Access-Control-Allow-Origin: *` 表明，该资源可以被任意外源访问。

- [用最简单的方式讲清楚常见的几种跨域解决方案](https://mp.weixin.qq.com/s/BUROGy6x-o37TPWHfLpwpQ)

### Nginx 反向代理
- 同源策略限制的是浏览器向服务器发送跨域请求需要遵循的标准。那如果是服务器向服务器发送跨域请求呢？答案当然是，不受浏览器的同源策略限制。
- 利用这个思路，我们就可以搭建一个代理服务器，接受客户端请求，然后将请求转发给服务器，拿到响应后，再将响应转发给客户端。
![nginx反向代理](img/nginx代理.jpg)
```xml
# nginx.config
# ...
server {
  listen       80;
  server_name  www.domain1.com;
  location / {
    proxy_pass   http://www.domain2.com:8080;  #反向代理
    proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
    index  index.html index.htm;

    # 当用 webpack-dev-server 等中间件代理接口访问 nignx 时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Credentials true;
    # ...
  }
}
```

### Node 中间件代理
- 实现的原理和nginx代理服务器的原理一样。需要注意的是，浏览器向代理服务器请求时仍然遵循同源策略，别忘了在 Node 层通过 CORS 做跨域处理。
```js
const https = require('https')
// 接受客户端请求
const sever = https.createServer((req, res) => {
  ...
  const { method, headers } = req
  // 设置 CORS 允许跨域
  res.writeHead(200, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    ...
  })
  // 请求服务器
  const proxy = https.request({ host: 'xxx', method, headers, ...}, response => {
    let body = ''
    response.on('data', chunk => { body = body + chunk })
    response.on('end', () => {
      // 响应结果转发给客户端
      res.end(body)
    })
  })
  // 结束请求
  proxy.end()
})
```

## XMLHttpRequest(XHR)
### `withCredentials`属性
CORS请求默认不发送Cookie和HTTP认证信息。如果要把Cookie发到服务器，一方面要服务器同意，指定`Access-Control-Allow-Credentials`字段: `Access-Control-Allow-Credentials: true`；另一方面，开发者必须在AJAX请求中打开`withCredentials`属性:
```js
var xhr = new XMLHttpRequest();
xhr.withCredentials = true;
```
否则，即使服务器同意发送Cookie，浏览器也不会发送。或者，服务器要求设置Cookie，浏览器也不会处理。但是，如果省略`withCredentials`设置，有的浏览器还是会一起发送Cookie。这时，可以显式关闭`withCredentials`: `xhr.withCredentials = false;`

:::warning
需要注意的是，如果要发送Cookie，`Access-Control-Allow-Origin`就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，Cookie依然遵循同源政策，只有用服务器域名设置的Cookie才会上传，其他域名的Cookie并不会上传，且（跨源）原网页代码中的`document.cookie`也无法读取服务器域名下的Cookie。
:::

## cookie
### HttpOnly
### Domain
### SameSite
### Expires / Max-Age
### js获取cookie
```js
const getCookie = (cookieName: string) => {
  const cookies = document.cookie;
  const name = cookieName + "=";
  var cookieArray = cookies.split(';');
  for (let i=0; i<cookieArray.length; i++) {
    let cookie = cookieArray[i].trim();
    if (cookie.indexOf(name) == 0) return cookie.substring(name.length,cookie.length);
  }
  return "";
}
```

## 优化相关
### 1. [Web 性能优化：控制关键请求的优先级](https://mp.weixin.qq.com/s/P63LEMaXLMyWGYVdLiWxZw)

## 安全
### 1. [Content-Security-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy)
> 示例: 禁用不安全的内联/动态执行, 只允许通过 https加载这些资源 (images, fonts, scripts, etc.)
```markdown
// header
Content-Security-Policy: default-src https:
// meta tag
<meta http-equiv="Content-Security-Policy" content="default-src https:">
```