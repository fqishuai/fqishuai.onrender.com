---
slug: ahooks
tags: [react]
---

## `useRequest`
目前已有能力包括：
- 自动请求/手动请求
- 轮询
- 防抖
- 节流
- 屏幕聚焦重新请求
- 错误重试
- loading delay
- SWR(stale-while-revalidate)
- 缓存

`useRequest` 的第一个参数是一个异步函数，在组件初次加载时，会自动触发该函数执行。同时自动管理该异步函数的 `loading` , `data` , `error` 等状态。

如果设置了 `options.manual = true`，则 `useRequest` 不会默认执行，需要通过 `run` 来触发执行。

## `useDeepCompareEffect`
用法与 useEffect 一致，但 deps 通过 [react-fast-compare](https://www.npmjs.com/package/react-fast-compare) 进行深比较。

## 防抖/节流
在 ahooks 的防抖 hook（`useDebounce` 或 `useDebounceFn`）中，`manual` 参数的作用是控制防抖函数的触发方式。具体来说：

1. 基本作用：
   - 当 `manual` 设置为 `true` 时，防抖函数不会自动执行，而是需要手动调用。
   - 当 `manual` 设置为 `false`（默认值）时，防抖函数会在依赖项变化时自动执行。

2. 使用场景：
   - 手动控制：当你需要更精确地控制防抖函数何时执行时，可以使用 `manual: true`。
   - 自动执行：在大多数情况下，默认的自动执行（`manual: false`）就足够了。

3. 实际应用：
   - 使用 `manual: true` 时，你通常会得到一个 `run` 函数，用于手动触发防抖函数。
   - 这在某些复杂的交互场景中特别有用，比如你想在特定的事件发生后才触发防抖。

4. 示例代码：

```javascript
import { useDebounceFn } from 'ahooks';

// 自动执行（默认行为）
const { run: autoRun } = useDebounceFn(() => {
  console.log('Auto debounced');
}, { wait: 500 });

// 手动执行
const { run: manualRun } = useDebounceFn(() => {
  console.log('Manual debounced');
}, { wait: 500, manual: true });

// 使用
useEffect(() => {
  // autoRun 会在依赖项变化时自动调用
  autoRun();
}, [someDepedency]);

// manualRun 需要手动调用
const handleClick = () => {
  manualRun();
};
```

5. 优点：
   - 灵活性：提供了更灵活的控制方式。
   - 精确控制：可以在精确的时间点触发防抖函数。

6. 注意事项：
   - 当使用 `manual: true` 时，需要确保在适当的时候调用 `run` 函数。
   - 如果忘记调用 `run`，可能会导致预期的防抖效果没有发生。

总之，`manual` 参数给了开发者更多控制权，使得防抖 hook 能够适应更复杂的使用场景。在大多数简单场景中，默认的自动执行就足够了，但在需要精细控制的情况下，`manual: true` 会非常有用。