---
slug: jsinfo
tags: [读书笔记]
---

:::tip
[javascript.info](https://javascript.info/)
:::

# 阅读JavaScript.info

### 1. 同源策略 Same-origin policy
#### 1.1 源（Origin）
- Web 内容的源由用于访问它的 URL 的方案（协议）、主机名（域名）和端口定义。只有当协议、主机和端口都匹配时，两个对象才具有相同的源。
- 某些操作仅限于同源内容，但可以使用 CORS 解除这个限制。
- 注意不同文件路径与是否同源无关：
```js
// 由于它们具有相同的协议（http）和主机名（example.com），以下两个地址是同源的。
http://example.com/app1/index.html
http://example.com/app2/index.html

// 服务器默认从 80 端口传送 HTTP 内容，所以以下两个地址同源
http://Example.com:80
http://example.com

// 由于协议不同，以下两个地址不属于同源
http://example.com/app1
https://example.com/app2

// 由于主机名不同，以下几个地址不属于同源
http://example.com
http://www.example.com
http://myapp.example.com
```

#### 1.2 嵌入跨源的资源的情况
- 使用 `<script src="…"></script>` 标签嵌入的 JavaScript 脚本。
> 语法错误信息只能被同源脚本中捕捉到。

- 使用 `<link rel="stylesheet" href="…">` 标签嵌入的 CSS。
> 由于 CSS 的松散的语法规则，CSS 的跨源需要一个设置正确的 `Content-Type` 标头。如果样式表是跨源的，且 MIME 类型不正确，资源不以有效的 CSS 结构开始，浏览器会阻止它的加载。

- 通过 `<img>` 展示的图片。
- 通过 `<video>` 和 `<audio>` 播放的多媒体资源。
- 通过 `<object>` 和 `<embed>` 嵌入的插件。
- 通过 `@font-face` 引入的字体。
> 一些浏览器允许跨源字体（cross-origin fonts），另一些需要同源字体（same-origin fonts）。

- 通过 `<iframe>` 载入的任何资源。
> 站点可以使用 `X-Frame-Options` 标头来阻止这种形式的跨源交互。

#### 1.3 如何允许跨源访问
- 可以使用 CORS 来允许跨源访问。CORS 是 HTTP 的一部分，它允许服务端来指定哪些主机可以从这个服务端加载资源。
- 为了能让不同源中的文档进行交流，可以使用 `window.postMessage` 安全地实现跨源通信。

#### 1.4 如何阻止跨源访问
[跨站请求伪造（CSRF）](https://owasp.org/www-community/attacks/csrf)

#### 1.5 跨源数据存储访问
- 访问存储在浏览器中的数据，如 `Web Storage` 和 `IndexedDB`，是以源进行分割的。每个源都拥有自己单独的存储空间，一个源中的 JavaScript 脚本不能对属于其它源的数据进行读写操作。

- `Cookie` 使用不同的源定义方式。
- 一个页面可以为本域和其父域设置 cookie，只要是父域不是公共后缀（public suffix）即可。
> Firefox 和 Chrome 使用 [Public Suffix List](https://publicsuffix.org/) 检测一个域是否是公共后缀。

- 当你设置 cookie 时，你可以使用 Domain、Path、Secure 和 HttpOnly 标记来限定可访问性。

- 当你读取 cookie 时，你无法知道它是在哪里被设置的。**即使只使用安全的 https 连接，你所看到的任何 cookie 都有可能是使用不安全的连接进行设置的。**