---
slug: antv
tags: [npmlib, 记录]
---

## @ant-design/plots
> 文档也可以参考g2的文档([g2 API](https://g2.antv.vision/zh/docs/api/general/tooltip))，底层用的是g2

### 1. 自定义tooltip
- 问题：闪烁并且有的地方不显示tooltip，解决方案：设置tooltip的position，position: 'top'

### 2. 图表标注
#### 2.1 [辅助线](https://charts.ant.design/zh/examples/component/annotation/#line-annotation)
API：Line Annotation
- type: 'line', 标识为：辅助线（可带文本）
- start 起始位置
- end 结束位置
:::info
起始位置、结束位置 除了指定原始数据之外，还可以使用预设定数据点，如：
  - 'min': 最小值
  - 'max': 最大值
  - 'mean': 平均值
  - 'median': 中位值
  - 'start': 即 0
  - 'end': 即 1
:::

#### 2.2 [辅助文本](https://charts.ant.design/zh/examples/component/annotation/#text-annotation1)
API：Text Annotation
- type: 'text', 标识为：辅助文本，在指定位置添加文本说明
- position 文本标注位置