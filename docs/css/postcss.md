---
tags: [css]
---

简而言之，[PostCSS](https://github.com/postcss/postcss) 与 LESS/SASS/SCSS 做同样的事情......但通过一些插件来增强它，它可以做更多的事情。PostCSS 很像 JavaScript 的 Babel。它在底层使用 Javascript 解析您的 CSS，将其转换为原始 AST（抽象语法树），然后对当今浏览器能够理解和渲染的 CSS 进行转换。

### 在Webpack中使用
1. 在`webpack.config.js`文件中配置`[postcss-loader](https://github.com/postcss/postcss-loader)`:
   ```js title="webpack.config.js"
   module.exports = {
     module: {
       rules: [
         {
           test: /\.css$/,
           exclude: /node_modules/,
           use: [
             {
               loader: 'style-loader',
             },
             {
               loader: 'css-loader',
               options: {
                 importLoaders: 1,
               }
             },
             {
               loader: 'postcss-loader'
             }
           ]
         }
       ]
     }
   }
   ```

2. 创建`postcss.config.js`文件：
   ```js title="postcss.config.js"
   /** @type {import('postcss-load-config').Config} */
   const config = {
     plugins: [
       require('autoprefixer'),
       require('postcss-nested')
     ]
   }

   module.exports = config
   ```