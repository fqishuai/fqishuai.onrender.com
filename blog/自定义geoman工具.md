---
slug: custom-geoman
---

实现撤回：
直接调用`map.pm.Draw.Polygon._removeLastVertex();`不生效

查看源码：`Draw.Polygon`继承自`Draw.Line`，查看`Draw.Line`的`_removeLastVertex()`的实现

重新实现了撤回操作，但是辅助线的状态一直不更新：设置原始辅助线为`opacity: 0`，然后手动画辅助线

手画辅助线这种方式可以，但是手动触发`drawend`后，甚至`disableDraw`后，`mouseover`事件仍然被监听

`map.removeLayer()`不生效
```jsx
 let customHintLine = L.polyline([], { color: 'red', dashArray: [5, 5], className: 'customHintLine' });
const customHintLineLayer = layers.find(layer => layer.options.className === 'customHintLine');

if (customHintLineLayer) {
  console.log('draw start customHintLineLayer::', customHintLineLayer)
  map.removeLayer(customHintLineLayer);
}
console.log('draw start remove layers', layers)
hintLineRef.current = customHintLine.addTo(map);
```

MapContainer中嵌入的自定义组件，点击穿透，使用`e.stopPropagation();`不好使



## `L.DomEvent.on(domRef.current, 'click', handler)` 执行了2遍

如果 `L.DomEvent.on(domRef.current, 'click', handler)` 执行了两遍，可能是因为事件监听器被多次添加，或者组件在 React 中重新渲染时没有正确清理旧的事件监听器。以下是一些可能的原因和解决方法：

### 1. 确保事件监听器只添加一次

在 React 中，使用 `useEffect` 钩子来确保事件监听器只在组件挂载时添加，并在组件卸载时移除：

```javascript
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const MyComponent = () => {
  const domRef = useRef(null);

  useEffect(() => {
    const handleClick = () => {
      console.log('Element clicked!');
    };

    if (domRef.current) {
      L.DomEvent.on(domRef.current, 'click', handleClick);
    }

    // 清理函数，确保在组件卸载时移除事件监听器
    return () => {
      if (domRef.current) {
        L.DomEvent.off(domRef.current, 'click', handleClick);
      }
    };
  }, []);

  return <div ref={domRef}>Click me</div>;
};

export default MyComponent;
```

### 2. 检查组件是否多次渲染

确保组件没有因为某些原因多次渲染，导致事件监听器被多次添加。你可以在组件中添加一些日志来调试：

```javascript
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

const MyComponent = () => {
  const domRef = useRef(null);

  useEffect(() => {
    console.log('Component mounted or updated');

    const handleClick = () => {
      console.log('Element clicked!');
    };

    if (domRef.current) {
      L.DomEvent.on(domRef.current, 'click', handleClick);
    }

    return () => {
      if (domRef.current) {
        L.DomEvent.off(domRef.current, 'click', handleClick);
      }
    };
  }, []);

  return <div ref={domRef}>Click me</div>;
};

export default MyComponent;
```

### 3. 确保事件处理函数的引用不变

在 React 中，如果事件处理函数的引用在每次渲染时都发生变化，可能会导致事件监听器被多次添加。确保事件处理函数的引用不变：

```javascript
import React, { useEffect, useRef, useCallback } from 'react';
import L from 'leaflet';

const MyComponent = () => {
  const domRef = useRef(null);

  const handleClick = useCallback(() => {
    console.log('Element clicked!');
  }, []);

  useEffect(() => {
    if (domRef.current) {
      L.DomEvent.on(domRef.current, 'click', handleClick);
    }

    return () => {
      if (domRef.current) {
        L.DomEvent.off(domRef.current, 'click', handleClick);
      }
    };
  }, [handleClick]);

  return <div ref={domRef}>Click me</div>;
};

export default MyComponent;
```

通过这些方法，你可以确保事件监听器只被添加一次，并在组件卸载时正确移除，避免重复执行的问题。