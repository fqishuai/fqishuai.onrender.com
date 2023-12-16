---
tags: [ECMAScript Language Specification]
---

# `import.meta`
- `import.meta` 是一个给 JavaScript 模块暴露特定上下文的元数据属性的对象。它包含了这个模块的信息，比如说这个模块的 URL。

- `import.meta` 对象是由 ECMAScript 实现的，它带有一个 `null` 的原型对象。这个对象可以扩展，并且它的属性都是可写、可配置和可枚举的。

- 在客户端(如浏览器)，`import.meta.url`是当前文件的url。
  ```js title="src/utils/px-to-rem.ts"
  console.log(import.meta.url) // 'https://test.com/customPages/src/utils/px-to-rem.ts?t=1702377976704'
  export const pxToRem = (pxValue: number, baseFontSize = 75) => {
    // Convert the pixel value to rem using the base font size
    const remValue = pxValue / baseFontSize;
    return +remValue.toFixed(5);
  }
  ```

- 在Node服务端是本地文件的路径，即是file:URL协议的字符串。
  ```js title="index.js"
  import express from 'express';
  import { createServer } from 'node:http';
  import { fileURLToPath } from 'node:url';
  import { dirname, join } from 'node:path';

  const app = express();
  const server = createServer(app);

  console.log(import.meta.url) // file:///Users/fqs/Documents/demos/socket-chat-example/index.js
  const __dirname = dirname(fileURLToPath(import.meta.url));

  app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
  });

  server.listen(3001, () => {
    console.log('server running at http://localhost:3001');
  });
  ```