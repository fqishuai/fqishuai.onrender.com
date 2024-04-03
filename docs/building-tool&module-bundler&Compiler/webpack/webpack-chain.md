[webpack-chain](https://github.com/Yatoo2018/webpack-chain/tree/zh-cmn-Hans)
- [读 VuePress（二）：使用 Webpack-chain 链式生成 webpack 配置](https://www.jianshu.com/p/a63b55b1d9cc)

## Chainable
```js
module.exports = class {
  constructor(parent) {
    this.parent = parent;
  }

  batch(handler) {
    handler(this);
    return this;
  }

  end() {
    return this.parent;
  }
};
```
- end 方法便是来源于这了，它会返回调用链中最前端的那个对象。比如：
```js
config
    .use('cache-loader')
    .loader('cache-loader')
    .options({
      cacheDirectory,
      cacheIdentifier
    })
    .end() // 返回的便又是 config 了
    .use('babel-loader')
      .loader('babel-loader')
      .options({
        // do not pick local project babel config
        babelrc: false,
        presets: [
          require.resolve('@vue/babel-preset-app')
        ]
      })
```

## ChainedMap---继承于 Chainable

## ChainedSet---继承于 Chainable
- add
```js
config
  .entry('app')
    .add('src/index.js')

// 等价于下面的webpack配置
entry: {
  app: './src/index.js'
}
```

