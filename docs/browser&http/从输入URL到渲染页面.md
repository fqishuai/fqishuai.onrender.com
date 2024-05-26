---
slug: url-render
tags: [browser]
---

[浏览器输入URL后究竟发生了什么？](https://mp.weixin.qq.com/s/LCuu-CbgBGwxrKCRH1E58Q)

从输入URL到回车后发生的行为如下：
- URL解析
- DNS查询
- TCP连接
- HTTP请求
- 响应请求
- 页面渲染

## URL解析
URL（Uniform Resource Locator，统一资源定位符）是用于定位互联网上资源的地址。`http://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#SomewhereInTheDocument`这个URL可以分解为以下几个部分：
- 协议（Scheme）: 指定了用于访问资源的协议类型。常见的协议还包括https（加密的http）、ftp等。该示例为"http"。
- 主机名（Host）：指定了托管资源的服务器的域名。该示例为`www.example.com`。
- 端口（Port）：指定了服务器上用于访问资源的端口号。HTTP的默认端口是80，HTTPS的默认端口是443。如果使用默认端口，通常可以省略。该示例为80。
- 路径（Path）：指定了在服务器上资源的具体位置。路径类似于文件系统中的路径。该示例为"/path/to/myfile.html"。
- 查询字符串（Query）：提供了额外的参数，用于搜索、过滤或其他目的。查询字符串以`?`开始，参数间以`&`分隔。该示例为"?key1=value1&key2=value2"。
- 片段（Fragment）：指定了资源内部的一个锚点（如网页中的一个特定位置）。浏览器会滚动到锚点指定的位置。片段不会发送到服务器。该示例为"#SomewhereInTheDocument"。

在JavaScript中，可以使用URL构造函数来解析和操作URL：
```js
const myUrl = new URL('http://www.example.com:80/path/to/myfile.html?key1=value1&key2=value2#SomewhereInTheDocument');

console.log(myUrl.protocol); // "http:"
console.log(myUrl.hostname); // "www.example.com"
console.log(myUrl.port);     // ""
console.log(myUrl.pathname); // "/path/to/myfile.html"
console.log(myUrl.search);   // "?key1=value1&key2=value2"
console.log(myUrl.hash);     // "#SomewhereInTheDocument"
```

