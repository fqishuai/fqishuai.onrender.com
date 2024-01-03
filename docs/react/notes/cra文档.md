---
slug: cra
tags: [react]
---

:::info
- 无论您使用 React 还是其他库，[Create React App](https://create-react-app.dev/) 都可以让您专注于代码，而不是构建工具。

- 创建一个TypeScript应用：`npx create-react-app fl-home.onrender.com --template typescript`

- 生成的目录文件的用途：
  - public/manifest.json
  ```json
  {
    "short_name": "React App",
    "name": "Create React App Sample",
    "icons": [
      {
        "src": "favicon.ico",
        "sizes": "64x64 32x32 24x24 16x16",
        "type": "image/x-icon"
      },
      {
        "src": "logo192.png",
        "type": "image/png",
        "sizes": "192x192"
      },
      {
        "src": "logo512.png",
        "type": "image/png",
        "sizes": "512x512"
      }
    ],
    "start_url": ".",
    "display": "standalone",
    "theme_color": "#000000",
    "background_color": "#ffffff"
  }
  ```

  - public/robots.txt
  > [robots.txt 简介](https://developers.google.com/search/docs/crawling-indexing/robots/intro?hl=zh-cn)。robots.txt 文件应位于网站的根目录下。因此，对于网站 `www.example.com`，robots.txt 文件的路径应为 `www.example.com/robots.txt`。robots.txt 是一种遵循漫游器排除标准的纯文本文件，由一条或多条规则组成。每条规则可禁止或允许所有或特定抓取工具抓取托管 robots.txt 文件的网域或子网域上的指定文件路径。除非您在 robots.txt 文件中另行指定，否则所有文件均隐式允许抓取。该 robots.txt 文件的含义是所有用户代理均可抓取整个网站。
  ```markdown
  # https://www.robotstxt.org/robotstxt.html
  User-agent: *
  Disallow:
  ```
  
  - src/reportWebVitals.ts
  ```ts
  import { ReportHandler } from 'web-vitals';

  const reportWebVitals = (onPerfEntry?: ReportHandler) => {
    if (onPerfEntry && onPerfEntry instanceof Function) {
      import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
        getCLS(onPerfEntry);
        getFID(onPerfEntry);
        getFCP(onPerfEntry);
        getLCP(onPerfEntry);
        getTTFB(onPerfEntry);
      });
    }
  };

  export default reportWebVitals;
  ```
  - src/setupTests.ts
  ```ts
  // jest-dom adds custom jest matchers for asserting on DOM nodes.
  // allows you to do things like:
  // expect(element).toHaveTextContent(/react/i)
  // learn more: https://github.com/testing-library/jest-dom
  import '@testing-library/jest-dom';
  ```
  - src/react-app-env.d.ts
  ```ts
  /// <reference types="react-scripts" />
  ```

:::
