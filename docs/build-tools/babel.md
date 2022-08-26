---
tags: [编译工具]
---

## 一、开发babel插件
:::tip
- [Babel 插件手册](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/zh-Hans/plugin-handbook.md)
- 最好是跟[英文版](https://github.com/jamiebuilds/babel-handbook/blob/master/translations/en/plugin-handbook.md)对比着看
:::

### [generator-babel-plugin](https://github.com/babel/generator-babel-plugin)
```js
npm install -g yo
npm install -g generator-babel-plugin
yo babel-plugin
```
- 按照上述步骤使用时报错Cannot create property 'help' on string 'example'，放弃使用
- 使用[generator-babel-plugin-x](https://github.com/OSpoon/generator-babel-plugin)生成目录，参照该目录创建[babel-plugin-starter](https://github.com/fqishuai/babel-plugin-starter)作为开发babel插件的通用工程

### [yeoman](https://yeoman.io/)