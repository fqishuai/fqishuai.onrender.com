[Runkit](https://runkit.com/) is a node playground in your browser.
>- https://www.jianshu.com/p/6bddbb0b284f
>- https://www.jsdelivr.com/package/npm/react-runkit-embed

在Docusaurus工程中使用Runkit:
1. `npm i react-runkit-embed`
2. 在`src/theme/MDXComponents.ts`中全局范围导入
```ts title="src/theme/MDXComponents.ts"
import RunKit from 'react-runkit-embed/RunKit';
export default {
  // 复用默认的映射
  ...MDXComponents,
  // 把 <RunKit> 标签映射到 RunKit 组件
  RunKit,
};
```
3. 在md文件中使用
```markdown
<RunKit>
  console.log('hello')
</RunKit>
```

如下使用时，模板字符串内不能有空行：
```markdown
<RunKit>
{
  `
  const Company = {
    category: "Technology",
    getNews () {
     console.log("viewing " + this.category + " news on my " + this.name + " device")
    }
  }
  const AppleInc = {
    name: "Apple",
    logo: "Apple fruit",
    operating_system: "Apple Software",
    store: "Apple Store",
    on () {
     console.log("Turning on my " + this.name + " device")
    },
    off () {
     console.log("Turning off my " + this.name + " device")
    },
    getDevice() {
     console.log("I just bought my " + this.name + " from " + this.store)
    }
  }
  const iPhone = {
    name: "iPhone",
    operating_system: "ios"
  }
  AppleInc.__proto__ = Company // NEVER DO THIS IN REAL-LIFE. ONLY FOR DEMONSTRATION PURPOSE
  iPhone.__proto__ = AppleInc // NEVER DO THIS IN REAL-LIFE. ONLY FOR DEMONSTRATION PURPOSE
  // let's buy an iPhone from the Apple store, then let's turn on and off our iPhone.
  console.log(iPhone.getDevice())
  console.log(iPhone.on())
  console.log(iPhone.off())
  console.log(iPhone.getNews())
  `
}
</RunKit>
```

4. 本地启动：`npm start`