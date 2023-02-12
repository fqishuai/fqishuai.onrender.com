---
tags: [browser, performance]
---

Chrome DevTools Performance Tab
:::tip
[官方文档](https://developer.chrome.com/docs/devtools/performance/reference/)

[What I Learned at Work this Week: Chrome DevTools Performance Tab](https://mike-diaz006.medium.com/what-i-learned-at-work-this-week-chrome-devtools-performance-tab-4dfdf5aa531e)
:::

### Performance介绍
- Record: click this to start collecting data on site performance. The resulting recording is called a Profile. 单击此按钮开始收集有关站点性能的数据。生成的记录称为配置文件。

- Start profiling and reload page: this will produce a full performance profile after a page reload. We’ll use it to get an idea of what functions are being called and how long they take when our page starts up. 这将在页面重新加载后生成完整的性能配置文件。我们将使用它来了解正在调用哪些函数以及页面启动时它们需要多长时间。

- Clear: clears the current performance profile.

- Load Profile: We can use this to view a previously saved profile. 我们可以使用它来查看以前保存的配置文件。

- Save Profile: If we’ve got a profile on in the console, we can save it!

- Show recent timeline sessions: Switch between multiple recordings.

- Capture screenshots: Checking this box means that we’ll be able to see exactly how the page looked at the moment of a certain function call. This can help with figuring out whether certain scripts can be made asynchronous, delayed, or even removed completely. A big part of performance management is determining the balance between load speed and site experience. 选中此框意味着我们将能够准确地看到页面在某个函数调用时的样子。这有助于确定某些脚本是否可以异步、延迟甚至完全删除。性能管理的很大一部分是确定加载速度和站点体验之间的平衡。

- Capture settings: This gear toggles the next bar.

- Disable JavaScript samples: By default, our recording will show a full call stack of JS functions. This information can be insightful, but can also make the chart busy and harder to read. Disabling JavaScript samples will compress the call stack display. 默认情况下，我们的录制将显示 JS 函数的完整调用堆栈。这些信息可能很有见地，但也会使图表变得拥挤且难以阅读。禁用 JavaScript 示例将压缩调用堆栈显示。

- Enable advanced paint instrumentation (slow): Paint instrumentation allows us to analyze animations. It’s not super relevant to site performance, but it’s worth exploration. 启用高级绘图工具（慢）：绘图工具允许我们分析动画。它与网站性能并没有太大关系，但值得探索。

- Network: Throttling allows us to simulate a slower connection speed so that we can test our site’s performance in different situations. When loading content at a non-optimal speed, we can get a much better idea of what loads on our site when. 节流允许我们模拟较慢的连接速度，以便我们可以测试我们网站在不同情况下的性能。当以非最佳速度加载内容时，我们可以更好地了解什么时候加载到我们的网站上。

- CPU: We can also throttle our CPU, simulating a slower device rather than a slower network. 我们还可以限制我们的 CPU，模拟较慢的设备而不是较慢的网络。

### Performance insights介绍