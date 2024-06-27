[React Leaflet](https://react-leaflet.js.org/)

## `<MapContainer>`
`MapContainer` 是 `react-leaflet` 中用于创建地图的主要组件。它有许多属性可以配置地图的行为和外观。以下是一些常用的属性：

1. **`center`**: 地图的初始中心点，通常是一个包含纬度和经度的数组，例如 `[51.505, -0.09]`。

2. **`zoom`**: 地图的初始缩放级别，例如 `13`。

3. **`scrollWheelZoom`**: 是否允许使用鼠标滚轮缩放地图，布尔值，例如 `true` 或 `false`。

4. **`style`**: 地图容器的内联样式，例如 `{ height: "100vh", width: "100%" }`。

5. **`className`**: 地图容器的CSS类名。

6. **`whenCreated`**: 一个回调函数，在地图实例创建后调用，接收地图实例作为参数。

7. **`bounds`**: 地图的初始边界，可以是一个包含南西和东北坐标的数组，例如 `[[51.49, -0.08], [51.5, -0.06]]`。
8. **`boundsOptions`**: 用于调整地图视图的选项

9. **`minZoom`**: 地图的最小缩放级别。

10. **`maxZoom`**: 地图的最大缩放级别。

11. **`maxBounds`**: 地图的最大边界，用户无法平移超出这些边界。

12. **`zoomControl`**: 是否显示默认的缩放控件，布尔值。

13. **`attributionControl`**: 是否显示默认的版权信息控件，布尔值。

14. **`doubleClickZoom`**: 是否允许双击缩放地图，布尔值。

15. **`dragging`**: 是否允许拖动地图，布尔值。

16. **`touchZoom`**: 是否允许触摸缩放地图，布尔值。

示例代码：
```jsx
import { MapContainer, TileLayer } from 'react-leaflet';

function MyMap() {
  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
}

export default MyMap;
```

这些属性可以帮助你根据需要配置和定制地图的行为和外观。

## `<TileLayer>`
TileLayer 用于加载地图瓦片，url 属性指定瓦片的 URL 模板，attribution 属性用于显示地图数据的版权信息。

## `useMap`

源码(去掉类型声明便于查看)：
```js
import { useLeafletContext } from '@react-leaflet/core'

export function useMap() {
  return useLeafletContext().map
}
```

## `<LayersControl>`
`react-leaflet` 中的 `LayersControl` 组件允许你在地图上添加图层控制，以便用户可以切换不同的地图图层。以下是一个示例，展示如何使用 `LayersControl` 组件：

首先，确保你已经安装了 `react-leaflet` 和 `leaflet`：

```bash
npm install react-leaflet leaflet
```

然后，你可以创建一个包含 `LayersControl` 的地图组件：

```jsx
import React from 'react';
import { MapContainer, TileLayer, LayersControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const { BaseLayer, Overlay } = LayersControl;

const MyMap = () => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <LayersControl position="topright">
        <BaseLayer checked name="OpenStreetMap">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </BaseLayer>
        <BaseLayer name="OpenTopoMap">
          <TileLayer
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
          />
        </BaseLayer>
        <Overlay name="Cities">
          <TileLayer
            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </Overlay>
      </LayersControl>
    </MapContainer>
  );
};

export default MyMap;
```

在这个示例中：

1. `LayersControl` 组件用于创建图层控制面板，`position` 属性设置控制面板的位置。
2. `BaseLayer` 组件用于定义基础图层（只能选择一个）。
3. `Overlay` 组件用于定义覆盖图层（可以选择多个）。

在 `LayersControl` 内部，你可以添加多个 `BaseLayer` 和 `Overlay`，每个图层都有一个 `name` 属性，用于在控制面板中显示图层名称。

将这个组件导入并使用在你的应用中即可显示一个带有图层控制的地图。

## `<FeatureGroup>`
`react-leaflet` 中的 `FeatureGroup` 组件允许你将多个图层（如 `Marker`、`Circle`、`Polygon` 等）组合在一起，并对整个组应用相同的事件处理程序或样式。`FeatureGroup` 还可以与 `Popup` 和 `Tooltip` 组件一起使用，以便为整个组提供弹出窗口或工具提示。

以下是一个示例，展示如何在 `react-leaflet` 中使用 `FeatureGroup` 组件：

首先，确保你已经安装了 `react-leaflet` 和 `leaflet`：

```bash
npm install react-leaflet leaflet
```

然后，你可以创建一个包含 `FeatureGroup` 的地图组件：

```jsx
import React from 'react';
import { MapContainer, TileLayer, FeatureGroup, Circle, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MyMap = () => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <FeatureGroup pathOptions={{ color: 'purple' }}>
        <Popup>这是一个 FeatureGroup</Popup>
        <Tooltip>这是一个工具提示</Tooltip>
        
        <Circle
          center={[51.51, -0.12]}
          radius={200}
        />
        <Circle
          center={[51.49, -0.08]}
          radius={100}
        />
      </FeatureGroup>
    </MapContainer>
  );
};

export default MyMap;
```

在这个示例中：

1. `MapContainer` 是地图的容器组件，`center` 属性设置地图的初始中心点，`zoom` 属性设置初始缩放级别。
2. `TileLayer` 用于加载地图瓦片。
3. `FeatureGroup` 组件用于将多个图层组合在一起，`pathOptions` 属性用于设置整个组的样式，例如颜色。
4. 在 `FeatureGroup` 内部，我们添加了两个 `Circle` 组件，它们将继承 `FeatureGroup` 的样式。
5. `Popup` 和 `Tooltip` 组件用于为整个 `FeatureGroup` 提供弹出窗口和工具提示。

将这个组件导入并使用在你的应用中即可显示一个包含 `FeatureGroup` 的地图。这样，你可以方便地对一组图层应用相同的样式和事件处理。

## `<Pane>`
在 `react-leaflet` 中，`Pane` 组件允许你创建自定义的图层面板，以便你可以控制图层的渲染顺序和样式。`Pane` 是 Leaflet 的一个概念，它提供了一种将不同图层分组并控制其渲染顺序的方法。

以下是一个示例，展示如何在 `react-leaflet` 中使用 `Pane` 组件：

首先，确保你已经安装了 `react-leaflet` 和 `leaflet`：

```bash
npm install react-leaflet leaflet
```

然后，你可以创建一个包含自定义 `Pane` 的地图组件：

```jsx
import React from 'react';
import { MapContainer, TileLayer, Pane, Circle, Rectangle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MyMap = () => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      
      <Pane name="customPane" style={{ zIndex: 650 }}>
        <Circle
          center={[51.505, -0.09]}
          radius={200}
          pathOptions={{ color: 'red' }}
        />
      </Pane>
      
      <Pane name="anotherPane" style={{ zIndex: 660 }}>
        <Rectangle
          bounds={[[51.49, -0.08], [51.5, -0.06]]}
          pathOptions={{ color: 'blue' }}
        />
      </Pane>
    </MapContainer>
  );
};

export default MyMap;
```

在这个示例中：

1. `MapContainer` 是地图的容器组件，`center` 属性设置地图的初始中心点，`zoom` 属性设置初始缩放级别。
2. `TileLayer` 用于加载地图瓦片。
3. `Pane` 组件用于创建自定义的图层面板，`name` 属性指定面板的名称，`style` 属性可以设置面板的样式，例如 `zIndex` 用于控制图层的渲染顺序。
4. 在自定义的 `Pane` 中，我们添加了一个 `Circle` 和一个 `Rectangle`，它们将根据 `Pane` 的 `zIndex` 属性进行渲染。

将这个组件导入并使用在你的应用中即可显示一个包含自定义图层面板的地图。

## `@react-leaflet/core`

### `createContainerComponent`
创建一个`forwardRef`包裹的组件，传递了上下文的值

源码(去掉类型声明便于查看)：
```js
export function createContainerComponent(useElement) {
  function ContainerComponent(props, forwardedRef) {
    const { instance, context } = useElement(props).current
    useImperativeHandle(forwardedRef, () => instance)

    return props.children == null ? null : (
      <LeafletProvider value={context}>{props.children}</LeafletProvider>
    )
  }

  return forwardRef(ContainerComponent)
}
```

```js title="LeafletProvider"
import { createContext, useContext } from 'react'

// 创建一个React上下文
export const LeafletContext = createContext(
  null,
)
// 上下文的Provider
export const LeafletProvider = LeafletContext.Provider
```

以下是一个示例，展示如何使用 `createContainerComponent` 创建一个自定义的容器组件：

```jsx
import React from 'react';
import { createContainerComponent } from '@react-leaflet/core';
import { Map as LeafletMap } from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// 创建自定义的容器组件
const CustomMapContainer = createContainerComponent(function createLeafletElement(props, context) {
  const instance = new LeafletMap(props.center, props);
  return { instance, context };
});

const MyMap = () => {
  return (
    <CustomMapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </CustomMapContainer>
  );
};

export default MyMap;
```

### `extendContext`
`extendContext` 是 `react-leaflet` 提供的一个辅助函数，用于扩展上下文，并保证上下文不可变

源码(去掉类型声明便于查看)：
```js
export function extendContext(source, extra) {
  return Object.freeze({ ...source, ...extra }) // 设置对象所有的属性变得只读
}
```

使用：
```js
function createSquare(props, context) {
  const square = new L.Rectangle(getBounds(props))
  return createElementObject(
    square,
    extendContext(context, { overlayContainer: square }),
  )
}
```

### `createControlHook`
`react-leaflet` 提供了 `createControlHook` 函数，用于创建自定义的控制组件。控制组件是那些可以添加到地图上的交互元素，例如缩放控件、图层切换控件等。

以下是一个示例，展示如何使用 `createControlHook` 创建一个自定义的控制组件：

```jsx
import React from 'react';
import { createControlHook } from '@react-leaflet/core';
import { Control } from 'leaflet';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// 创建自定义的控制钩子
const useCustomControl = createControlHook((props) => {
  const control = new Control({ position: props.position });
  control.onAdd = () => {
    const div = Control.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
    div.innerHTML = '<button>Click me</button>';
    div.onclick = () => {
      alert('Button clicked!');
    };
    return div;
  };
  return control;
});

// 创建自定义的控制组件
const CustomControl = (props) => {
  useCustomControl(props);
  return null;
};

const MyMap = () => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <CustomControl position="topright" />
    </MapContainer>
  );
};

export default MyMap;
```

在这个示例中：

1. `createControlHook` 是一个高阶函数，用于创建自定义的控制钩子。
2. `useCustomControl` 是我们自定义的控制钩子，它使用 `createControlHook` 创建。这个钩子接收 `props` 作为参数，并返回一个 Leaflet 控制实例。
3. 在 `useCustomControl` 中，我们创建了一个新的 `Control` 实例，并定义了 `onAdd` 方法，该方法返回一个包含按钮的 `div` 元素。当按钮被点击时，会弹出一个提示框。
4. `CustomControl` 是我们自定义的控制组件，它使用 `useCustomControl` 钩子，并将 `props` 传递给钩子。
5. 在 `MyMap` 组件中，我们使用 `CustomControl` 并设置其位置为 `topright`。

这个示例展示了如何使用 `createControlHook` 创建一个自定义的控制组件，并将其添加到地图上。你可以根据需要自定义控制组件的行为和外观。

### `createElementHook`
`react-leaflet` 提供了 `createElementHook` 函数，用于创建自定义的地图元素钩子。这个钩子可以帮助你将自定义的 Leaflet 元素集成到 React 组件中。

源码(去掉类型声明便于查看)：
```js
export function createElementHook(createElement, updateElement) {
  if (updateElement == null) {
    // 返回一个自定义hook
    return function useImmutableLeafletElement(props, context) {
      const elementRef = useRef()
      if (!elementRef.current)
        elementRef.current = createElement(props, context)
      return elementRef
    }
  }

  // 返回一个自定义hook
  return function useMutableLeafletElement(props, context) {
    const elementRef = useRef()
    if (!elementRef.current) elementRef.current = createElement(props, context)
    const propsRef = useRef(props)
    const { instance } = elementRef.current

    useEffect(
      function updateElementProps() {
        if (propsRef.current !== props) {
          updateElement(instance, props, propsRef.current)
          propsRef.current = props
        }
      },
      [instance, props, updateElement],
    )

    return elementRef
  }
}
```

以下是一个示例，展示如何使用 `createElementHook` 创建一个自定义的地图元素钩子：

```jsx
import React from 'react';
import { createElementHook } from '@react-leaflet/core';
import { Circle as LeafletCircle } from 'leaflet';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// 创建自定义的元素钩子
const useCustomCircle = createElementHook(
  (props, context) => {
    const instance = new LeafletCircle(props.center, props);
    return { instance, context };
  },
  (instance, props, prevProps) => {
    if (props.center !== prevProps.center) {
      instance.setLatLng(props.center);
    }
    if (props.radius !== prevProps.radius) {
      instance.setRadius(props.radius);
    }
    if (props.color !== prevProps.color) {
      instance.setStyle({ color: props.color });
    }
  }
);

// 创建自定义的 Circle 组件
const CustomCircle = (props) => {
  useCustomCircle(props);
  return null;
};

const MyMap = () => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <CustomCircle center={[51.505, -0.09]} radius={200} color="red" />
    </MapContainer>
  );
};

export default MyMap;
```

在这个示例中：

1. `createElementHook` 是一个高阶函数，用于创建自定义的元素钩子。
2. `useCustomCircle` 是我们自定义的元素钩子，它使用 `createElementHook` 创建。这个钩子接收 `props` 和 `context` 作为参数，并返回一个包含 `instance` 和 `context` 的对象。
3. 在 `useCustomCircle` 中，我们创建了一个新的 `LeafletCircle` 实例，并定义了更新逻辑，以便在 `props` 变化时更新圆的属性。
4. `CustomCircle` 是我们自定义的 Circle 组件，它使用 `useCustomCircle` 钩子，并将 `props` 传递给钩子。
5. 在 `MyMap` 组件中，我们使用 `CustomCircle` 并设置其中心、半径和颜色。

这个示例展示了如何使用 `createElementHook` 创建一个自定义的地图元素钩子，并将其集成到 React 组件中。你可以根据需要自定义元素的行为和属性。

### `createElementObject`
`createElementObject` 是 `react-leaflet` 提供的一个辅助函数，用于将 Leaflet 元素实例和上下文包装成一个对象，以便更好地管理元素的生命周期和与 React 的集成。它的主要作用是简化自定义地图元素的创建和管理。

源码(去掉类型声明便于查看)：
```js
export function createElementObject(instance, context, container) {
  return Object.freeze({ instance, context, container }) // 设置对象所有的属性变得只读
}
```

### `useLayerLifecycle`
一个自定义hook，封装了往地图添加图层，以及组件卸载时从地图移除图层

源码(去掉类型声明便于查看)：
```js
export function useLayerLifecycle(element, context) {
  useEffect(
    function addLayer() {
      const container = context.layerContainer ?? context.map
      container.addLayer(element.instance)

      return function removeLayer() {
        context.layerContainer?.removeLayer(element.instance)
        context.map.removeLayer(element.instance)
      }
    },
    [context, element],
  )
}
```

### `useEventHandlers`
一个自定义hook，封装了图层的监听事件和移除事件

源码(去掉类型声明便于查看)：
```js
export function useEventHandlers(element, eventHandlers) {
  const eventHandlersRef = useRef()

  useEffect(
    function addEventHandlers() {
      if (eventHandlers != null) {
        element.instance.on(eventHandlers)
      }
      eventHandlersRef.current = eventHandlers

      return function removeEventHandlers() {
        if (eventHandlersRef.current != null) {
          element.instance.off(eventHandlersRef.current)
        }
        eventHandlersRef.current = null
      }
    },
    [element, eventHandlers],
  )
}
```

### `useLeafletContext`

源码(去掉类型声明便于查看)：
```js
export const LeafletContext = createContext(null)

export const LeafletProvider = LeafletContext.Provider

export function useLeafletContext() {
  const context = useContext(LeafletContext)
  if (context == null) {
    throw new Error(
      'No context provided: useLeafletContext() can only be used in a descendant of <MapContainer>',
    )
  }
  return context
}
```

### `createPathHook`
用于调用多个自定义hook，用于图层的事件监听/移除、地图添加/移除图层、图层的外观设置

源码(去掉类型声明便于查看)：
```js
export function createPathHook(useElement) {
  return function usePath(props) {
    const context = useLeafletContext()
    const elementRef = useElement(withPane(props, context), context)

    useEventHandlers(elementRef.current, props.eventHandlers)
    useLayerLifecycle(elementRef.current, context)
    usePathOptions(elementRef.current, props)

    return elementRef
  }
}
```
`usePathOptions`是一个自定义hook，path选项改变时设置图层的外观
```js title="usePathOptions"
export function usePathOptions(element,props) {
  const optionsRef = useRef()

  useEffect(
    function updatePathOptions() {
      if (props.pathOptions !== optionsRef.current) {
        const options = props.pathOptions ?? {}
        element.instance.setStyle(options)
        optionsRef.current = options
      }
    },
    [element, props],
  )
}
```
`withPane`用于添加`pane`属性
```js title="withPane"
export function withPane(props, context) {
  const pane = props.pane ?? context.pane
  return pane ? { ...props, pane } : props
}
```

### `createPathComponent`

源码(去掉类型声明便于查看)：
```js
export function createPathComponent(createElement, updateElement) {
  const useElement = createElementHook(createElement, updateElement)
  const usePath = createPathHook(useElement)
  return createContainerComponent(usePath)
}
```

### `createLeafletContext`

源码(去掉类型声明便于查看)：
```js
export const CONTEXT_VERSION = 1

export function createLeafletContext(map) {
  return Object.freeze({ __version: CONTEXT_VERSION, map })
}
```

### `createLeafComponent`
创建一个`forwardRef`包裹的组件

源码(去掉类型声明便于查看)：
```js
export function createLeafComponent(useElement) {
  function LeafComponent(props, forwardedRef) {
    const { instance } = useElement(props).current
    useImperativeHandle(forwardedRef, () => instance)

    return null
  }

  return forwardRef(LeafComponent)
}
```

### `useAttribution`
一个自定义hook，用于更新地图数据来源和版权信息的控件的信息

源码(去掉类型声明便于查看)：
```js
export function useAttribution(map, attribution) {
  const attributionRef = useRef(attribution)

  useEffect(
    function updateAttribution() {
      if (
        attribution !== attributionRef.current &&
        map.attributionControl != null
      ) {
        if (attributionRef.current != null) {
          map.attributionControl.removeAttribution(attributionRef.current)
        }
        if (attribution != null) {
          map.attributionControl.addAttribution(attribution)
        }
      }
      attributionRef.current = attribution
    },
    [map, attribution],
  )
}
```

### `createDivOverlayHook`
用于调用多个自定义hook，用于更新地图数据来源和版权信息的控件的信息、图层的事件监听/移除、地图添加/移除图层

源码(去掉类型声明便于查看)：
```js
export function createDivOverlayHook(useElement, useLifecycle) {
  return function useDivOverlay(props, setOpen) {
    const context = useLeafletContext()
    const elementRef = useElement(withPane(props, context), context)

    useAttribution(context.map, props.attribution)
    useEventHandlers(elementRef.current, props.eventHandlers)
    useLifecycle(elementRef.current, context, props, setOpen)

    return elementRef
  }
}
```

### `createDivOverlayComponent`

源码(去掉类型声明便于查看)：
```js
export function createDivOverlayComponent(useElement) {
  function OverlayComponent(props, forwardedRef) {
    const [isOpen, setOpen] = useState(false)
    const { instance } = useElement(props, setOpen).current

    useImperativeHandle(forwardedRef, () => instance)
    // biome-ignore lint/correctness/useExhaustiveDependencies: update overlay when children change
    useEffect(
      function updateOverlay() {
        if (isOpen) {
          instance.update()
        }
      },
      [instance, isOpen, props.children],
    )

    // @ts-ignore _contentNode missing in type definition
    const contentNode = instance._contentNode
    return contentNode ? createPortal(props.children, contentNode) : null
  }

  return forwardRef(OverlayComponent)
}
```

### `createOverlayComponent`

源码(去掉类型声明便于查看)：
```js
export function createOverlayComponent(createElement, useLifecycle) {
  const useElement = createElementHook(createElement)
  const useOverlay = createDivOverlayHook(useElement, useLifecycle)
  return createDivOverlayComponent(useOverlay)
}
```