---
slug: vxe-grid
---

:::tip
[vxe-table](https://vxetable.cn/): 一个基于 vue 的 PC 端表格组件，支持增删改查、虚拟列表、虚拟树、懒加载、快捷菜单、数据校验、打印导出、表单渲染、数据分页、弹窗、自定义模板、渲染器、贼灵活的配置项等。
:::

### 1. 按需引入vxe-grid
- `npm install xe-utils vxe-table@legacy`
- `npm install babel-plugin-import -D`
- 在`main.js`中引入
```js title="src/main.js"
import XEUtils from 'xe-utils'
import { VXETable,Grid,Table as VTable } from 'vxe-table' // Table导入时重命名是为了避免和其他UI库的Table组件命名冲突
import zhCN from 'vxe-table/lib/locale/lang/zh-CN'
VXETable.setup({ // 设置国际化中文是为了让vxe-grid的loading显示“加载中”
  i18n: (key, args) => XEUtils.toFormatString(XEUtils.get(zhCN, key), args)
})
Vue.use(Grid)
Vue.use(VTable) // 需要引入vxe-table的Table组件，否则使用vxe-grid时会报错
```
- 配置`babel.config.js`或者`.babelrc`
```js title="babel.config.js"
{
  "plugins": [
    [
      "import",
      {
        "libraryName": "vxe-table",
        "style": true // 样式是否也按需加载
      }
    ]
  ]
}
```