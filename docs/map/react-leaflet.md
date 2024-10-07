[React Leaflet](https://react-leaflet.js.org/)

## `<MapContainer>`
`MapContainer` 是 `react-leaflet` 中用于创建地图的主要组件。它有许多属性可以配置地图的行为和外观。以下是一些常用的属性：

1. **`center`**: 地图的初始中心点，通常是一个包含纬度和经度的数组，例如 `[51.505, -0.09]`。

2. **`zoom`**: 地图的初始缩放级别，例如 `13`。

3. **`scrollWheelZoom`**: 是否允许使用鼠标滚轮缩放地图，布尔值，例如 `true` 或 `false`。

4. **`style`**: 地图容器的内联样式，例如 `{ height: "100vh", width: "100%" }`。
   ```jsx
   <MapContainer
     center={[51.505, -0.09]}
     zoom={13}
     style={{ height: "100vh", backgroundColor: "lightblue" }} // 设置地图背景颜色
   >
     <TileLayer
       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
       attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
     />
   </MapContainer>
   ```

5. **`className`**: 地图容器的CSS类名。

6. **`whenCreated`**: 一个回调函数，在地图实例创建后调用，接收地图实例作为参数。

7. **`bounds`**: 地图的初始边界，可以是一个包含南西和东北坐标的数组，例如 `[[51.49, -0.08], [51.5, -0.06]]`。
8. **`boundsOptions`**: 用于调整地图视图的选项

9.  **`minZoom`**: 地图的最小缩放级别。

10. **`maxZoom`**: 地图的最大缩放级别。

11. **`maxBounds`**: 地图的最大边界，用户无法平移超出这些边界。

12. **`zoomControl`**: 是否显示默认的缩放控件，布尔值。

13. **`attributionControl`**: 是否显示默认的版权信息控件，布尔值。

14. **`doubleClickZoom`**: 是否允许双击缩放地图，布尔值。

15. **`dragging`**: 是否允许拖动地图，布尔值。

16. **`touchZoom`**: 是否允许触摸缩放地图，布尔值。

17. **`keyboard`**：是否启用键盘导航，布尔值，默认为true。

18. **`keyboardPanDelta`**：用于控制使用键盘箭头键平移地图时的像素距离。具体来说，当你按下箭头键（上、下、左、右）时，地图将平移的距离由 keyboardPanDelta 决定。
    ```ts
    keyboardPanDelta={100} // 设置键盘平移距离为 100 像素
    ```

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

### 示例：Flex布局，左侧渲染地图，右侧可折叠，折叠展开时重新计算地图尺寸
```jsx
import { useState, useCallback } from "react";
import Toggle from './Toggle';

function Example() {
	const [foldedState, setFoldedState] = useState(false); // 初始为展开状态
	
	const handleToggle = useCallback(() => {
	    setFoldedState(!foldedState);
	}, [foldedState]);
	
	return (
		<div className="example3">
			<div className="left">
				<MapContainer
				  style={{ height: "100vh", width: "100%" }}
				  keyboard={false}
				>
					<Toggle onClick={handleToggle} />
				</MapContainer>
			</div>
			<div className={`right ${foldedState ? 'fold' : ''}`}></div>
		</div>
	)
}
```
```scss
.example {
	display: flex;
	height: 100vh;
	.left {
		flex: 1;
	}
	.right {
		width: 35%;
		&.fold {
			width: 0;
			overflow: hidden;
		}
		transition: width 0.3s;
	}
}
```
```tsx
import { memo } from "react";
import Right from "@/assets/home/right.png";

const Toggle = memo(function ({ onClick }: { onClick: ()=>void }) {
  const map = useMap()

  function handleClick() {
    onClick();
    setTimeout(() => {
      map.invalidateSize(); // 重新调整地图大小
    }, 300);
  }
  
  return <img
    src={Right}
    alt=""
    className="right-image"
    onClick={handleClick}
  />
})

export default Toggle
```

### 示例：在弹框中渲染地图
这种场景也需要重新调整地图大小，避免影响地图的渲染
```jsx
// 仅在 isModalVisible 为 true 时渲染 MapContainer，以确保地图在 Modal 打开时正确初始化。
function ModalExample() {
	return (
		<Modal open={isModalVisible}>
			<div>title</div>
			<div className="content">
			{
				isModalVisible && <MapContainer
				  style={{
					height: "208px",
					width: "131px",
					backgroundColor: "#F5F5F6",
				  }}
				  keyboard={false}
				  zoom={11}
				  center={center}
				  zoomControl={false}
				  attributionControl={false}
				>
				  <MiniMap></MiniMap>
				</MapContainer>
			}
			</div>
		</Modal>
	)
}
```
```jsx
function MiniMap() {
	const map = useMap();
	useEffect(() => {
	    map.invalidateSize(); // 重新调整地图大小
	}, [map]);
	
	const fenceGeoJSON = {
		// 数据
		...
	}
	const fenceGeojsonStyle = () => {
	    return {
	      color: '#E4E5E9'
	    }
	}
	const gridGeojsonStyle = () => {
	    return {
	      color: '#3C6EF0'
	    }
	}
	const grid1GeoJSON = {
		// 数据
		...
	}
	const grid2GeoJSON = {
		// 数据
		...
	}
	
	return (
	    <GeoJSON data={fenceGeoJSON} style={fenceGeojsonStyle}>
	      <GeoJSON data={grid1GeoJSON} style={gridGeojsonStyle}></GeoJSON>
	      <GeoJSON data={grid2GeoJSON} style={gridGeojsonStyle}></GeoJSON>
	    </GeoJSON>
	)
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

## `<Marker>`
在 `react-leaflet` 中，`<Marker>` 组件用于在地图上显示一个标记。`<Marker>` 组件接受多种属性来控制其行为和外观。以下是一些常用的属性：

### 常用属性

1. **position** (必需)
   - 类型：`LatLngExpression`
   - 描述：标记的位置，通常是一个包含纬度和经度的数组，例如 `[51.505, -0.09]`。

2. **icon**
   - 类型：`Icon`
   - 描述：自定义标记图标。

3. **draggable**
   - 类型：`boolean`
   - 描述：是否允许拖动标记。

4. **title**
   - 类型：`string`
   - 描述：标记的标题，当鼠标悬停在标记上时显示。

5. **alt**
   - 类型：`string`
   - 描述：标记的替代文本。

6. **riseOnHover**
   - 类型：`boolean`
   - 描述：当鼠标悬停在标记上时，标记是否在其他标记之上显示。

7. **riseOffset**
   - 类型：`number`
   - 描述：当 `riseOnHover` 为 `true` 时，标记上升的像素数。

8. **opacity**
   - 类型：`number`
   - 描述：标记的不透明度，范围从 `0`（完全透明）到 `1`（完全不透明）。

9. **zIndexOffset**
   - 类型：`number`
   - 描述：标记的 z-index 偏移量。

10. **keyboard**
    - 类型：`boolean`
    - 描述：是否允许通过键盘导航到标记。

11. **interactive**
    - 类型：`boolean`
    - 描述：标记是否响应鼠标和触摸事件。

12. **eventHandlers**
    - 类型：`object`
    - 描述：事件处理程序对象，用于处理标记的各种事件（例如 `click`, `mouseover` 等）。


以下是一个使用 `<Marker>` 组件的示例，展示了如何设置一些常用属性：

```jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const position = [51.505, -0.09];

const MapComponent = () => {
  return (
    <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker
        position={position}
        draggable={true}
        title="Example Marker"
        alt="Example Marker"
        riseOnHover={true}
        opacity={0.8}
        zIndexOffset={100}
        eventHandlers={{
          click: () => {
            alert('Marker clicked!');
          },
          mouseover: () => {
            console.log('Mouse over marker');
          }
        }}
      >
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
```

在这个示例中：

1. 我们定义了一个标记位置 `position`。
2. 使用 `<Marker>` 组件在地图上显示一个标记，并设置了一些属性，如 `draggable`, `title`, `alt`, `riseOnHover`, `opacity`, `zIndexOffset` 和 `eventHandlers`。
3. 使用 `<Popup>` 组件为标记添加一个弹出窗口。

你可以根据需要调整这些属性，以适应你的具体需求。

## `<Popup>`
在 `react-leaflet` 中，`<Popup>` 组件用于在地图上显示一个弹出窗口。`<Popup>` 组件接受多种属性来控制其行为和外观。以下是一些常用的属性：

### 常用属性

1. **position**
   - 类型：`LatLngExpression`
   - 描述：弹出窗口的位置，通常是一个包含纬度和经度的数组，例如 `[51.505, -0.09]`。

2. **offset**
   - 类型：`PointExpression`
   - 描述：弹出窗口相对于其锚点的偏移量。

3. **maxWidth**
   - 类型：`number`
   - 描述：弹出窗口的最大宽度（以像素为单位）。

4. **minWidth**
   - 类型：`number`
   - 描述：弹出窗口的最小宽度（以像素为单位）。

5. **maxHeight**
   - 类型：`number`
   - 描述：弹出窗口的最大高度（以像素为单位）。

6. **autoPan**
   - 类型：`boolean`
   - 描述：是否自动平移地图以确保弹出窗口完全可见。

7. **autoPanPaddingTopLeft**
   - 类型：`PointExpression`
   - 描述：自动平移时，地图左上角的填充。

8. **autoPanPaddingBottomRight**
   - 类型：`PointExpression`
   - 描述：自动平移时，地图右下角的填充。

9. **autoPanPadding**
   - 类型：`PointExpression`
   - 描述：自动平移时，地图的填充。

10. **keepInView**
    - 类型：`boolean`
    - 描述：是否确保弹出窗口始终在地图视图内。

11. **closeButton**
    - 类型：`boolean`
    - 描述：是否在弹出窗口中显示关闭按钮。

12. **autoClose**
    - 类型：`boolean`
    - 描述：是否在打开新弹出窗口时自动关闭当前弹出窗口。

13. **closeOnClick**
    - 类型：`boolean`
    - 描述：是否在地图上单击时关闭弹出窗口。

14. **className**
    - 类型：`string`
    - 描述：自定义 CSS 类名，用于自定义弹出窗口的样式。

15. **pane**
    - 类型：`string`
    - 描述：弹出窗口所在的 pane。

16. **eventHandlers**
    - 类型：`object`
    - 描述：事件处理程序对象，用于处理弹出窗口的各种事件（例如 `open`, `close` 等）。

以下是一个使用 `<Popup>` 组件的示例，展示了如何设置一些常用属性：

```jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const position = [51.505, -0.09];

const MapComponent = () => {
  return (
    <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup
          maxWidth={200}
          minWidth={100}
          maxHeight={100}
          autoPan={true}
          autoPanPadding={[10, 10]}
          keepInView={true}
          closeButton={true}
          autoClose={false}
          closeOnClick={false}
          className="custom-popup"
          eventHandlers={{
            open: () => {
              console.log('Popup opened');
            },
            close: () => {
              console.log('Popup closed');
            }
          }}
        >
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
```

在这个示例中：

1. 我们在 `<Marker>` 组件中嵌套了一个 `<Popup>` 组件。
2. 设置了多个属性，如 `maxWidth`, `minWidth`, `maxHeight`, `autoPan`, `autoPanPadding`, `keepInView`, `closeButton`, `autoClose`, `closeOnClick`, `className` 和 `eventHandlers`。
3. 使用 `eventHandlers` 属性来处理弹出窗口的 `open` 和 `close` 事件。

你可以根据需要调整这些属性，以适应你的具体需求。

## `<Polygon>`
在 `react-leaflet` 中，`<Polygon>` 组件用于在地图上绘制一个多边形。`<Polygon>` 组件接受多种属性来控制其行为和外观。以下是一些常用的属性：

### 常用属性

1. **positions** (必需)
   - 类型：`LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][]`
   - 描述：多边形的顶点坐标数组。可以是一个包含纬度和经度的数组，或者是多个数组的数组（用于多边形的孔）。

2. **color**
   - 类型：`string`
   - 描述：多边形边界的颜色。

3. **weight**
   - 类型：`number`
   - 描述：多边形边界的宽度（以像素为单位）。

4. **opacity**
   - 类型：`number`
   - 描述：多边形边界的不透明度，范围从 `0`（完全透明）到 `1`（完全不透明）。

5. **fillColor**
   - 类型：`string`
   - 描述：多边形填充的颜色。

6. **fillOpacity**
   - 类型：`number`
   - 描述：多边形填充的不透明度，范围从 `0`（完全透明）到 `1`（完全不透明）。

7. **dashArray**
   - 类型：`string`
   - 描述：多边形边界的虚线样式，例如 `"5, 10"` 表示线段长度为 5 像素，间隔为 10 像素。

8. **lineCap**
   - 类型：`string`
   - 描述：多边形边界的线帽样式，可以是 `"butt"`, `"round"`, `"square"` 之一。

9. **lineJoin**
   - 类型：`string`
   - 描述：多边形边界的线连接样式，可以是 `"miter"`, `"round"`, `"bevel"` 之一。

10. **className**
    - 类型：`string`
    - 描述：自定义 CSS 类名，用于自定义多边形的样式。

11. **interactive**
    - 类型：`boolean`
    - 描述：多边形是否响应鼠标和触摸事件。

12. **eventHandlers**
    - 类型：`object`
    - 描述：事件处理程序对象，用于处理多边形的各种事件（例如 `click`, `mouseover` 等）。


以下是一个使用 `<Polygon>` 组件的示例，展示了如何设置一些常用属性：

```jsx
import React from 'react';
import { MapContainer, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const positions = [
  [51.505, -0.09],
  [51.51, -0.1],
  [51.51, -0.12]
];

const MapComponent = () => {
  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polygon
        positions={positions}
        color="blue"
        weight={2}
        opacity={1}
        fillColor="red"
        fillOpacity={0.5}
        dashArray="5, 10"
        lineCap="round"
        lineJoin="round"
        className="custom-polygon"
        interactive={true}
        eventHandlers={{
          click: () => {
            alert('Polygon clicked!');
          },
          mouseover: () => {
            console.log('Mouse over polygon');
          }
        }}
      />
      <Polygon pathOptions={{ color: 'purple' }} positions={positions} />
    </MapContainer>
  );
};

export default MapComponent;
```

在这个示例中：

1. 我们定义了一个包含多边形顶点坐标的数组 `positions`。
2. 使用 `<Polygon>` 组件在地图上绘制一个多边形，并设置了一些属性，如 `color`, `weight`, `opacity`, `fillColor`, `fillOpacity`, `dashArray`, `lineCap`, `lineJoin`, `className`, `interactive` 和 `eventHandlers`。
3. 使用 `eventHandlers` 属性来处理多边形的 `click` 和 `mouseover` 事件。

你可以根据需要调整这些属性，以适应你的具体需求。

## `<Tooltip>`
在 `react-leaflet` 中，`<Tooltip>` 组件用于在地图上显示一个工具提示。`<Tooltip>` 组件接受多种属性来控制其行为和外观。以下是一些常用的属性：

### 常用属性

1. **permanent**
   - 类型：`boolean`
   - 描述：如果为 `true`，工具提示将始终显示，而不是仅在鼠标悬停时显示。

2. **sticky**
   - 类型：`boolean`
   - 描述：如果为 `true`，工具提示将跟随鼠标移动。

3. **interactive**
   - 类型：`boolean`
   - 描述：如果为 `true`，工具提示将响应鼠标和触摸事件。

4. **direction**
   - 类型：`string`
   - 描述：工具提示的方向，可以是 `"right"`, `"left"`, `"top"`, `"bottom"`, `"center"`, `"auto"` 之一。默认值为 `"auto"`。

5. **offset**
   - 类型：`PointExpression`
   - 描述：工具提示相对于其锚点的偏移量。

6. **opacity**
   - 类型：`number`
   - 描述：工具提示的不透明度，范围从 `0`（完全透明）到 `1`（完全不透明）。默认值为0.9

7. **className**
   - 类型：`string`
   - 描述：自定义 CSS 类名，用于自定义工具提示的样式。

8. **pane**
   - 类型：`string`
   - 描述：工具提示所在的 pane。

9. **eventHandlers**
   - 类型：`object`
   - 描述：事件处理程序对象，用于处理工具提示的各种事件（例如 `add`, `remove` 等）。


以下是一个使用 `<Tooltip>` 组件的示例，展示了如何设置一些常用属性：

```jsx
import React from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const position = [51.505, -0.09];

const MapComponent = () => {
  return (
    <MapContainer center={position} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Tooltip
          permanent={true}
          direction="top"
          offset={[0, -20]}
          opacity={0.9}
          className="custom-tooltip"
          eventHandlers={{
            add: () => {
              console.log('Tooltip added');
            },
            remove: () => {
              console.log('Tooltip removed');
            }
          }}
        >
          A pretty CSS3 tooltip. <br /> Easily customizable.
        </Tooltip>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
```

在这个示例中：

1. 我们在 `<Marker>` 组件中嵌套了一个 `<Tooltip>` 组件。
2. 设置了多个属性，如 `permanent`, `direction`, `offset`, `opacity`, `className` 和 `eventHandlers`。
3. 使用 `eventHandlers` 属性来处理工具提示的 `add` 和 `remove` 事件。

你可以根据需要调整这些属性，以适应你的具体需求。

### 自定义ToolTip的样式
```jsx
import './example.css'

function Example() {
	return (
	  <Tooltip permanent className='custom-tooltip'>
	    <div>Tooltip for Demo</div>
	    <div>点击可选中</div>
	  </Tooltip>
	)
}
```
```css
.custom-tooltip {
  background-color: #3C6EF0;  /* 设置背景颜色 */
  border: unset;  /* 去掉border */
  color: #FFFFFF;  /* 设置字体颜色 */
}
.custom-tooltip::before {
  border-right-color: transparent; /* 去掉指示小三角 */
}
```

## `<GeoJSON>`
```tsx
import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const geojsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Example Feature"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [102.0, 0.5]
      }
    }
  ]
};

const MapComponent = () => {
  return (
    <MapContainer center={[0.5, 102.0]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={geojsonData} />
    </MapContainer>
  );
};

export default MapComponent;
```

可以通过 `GeoJSON` 组件的 `style` 属性来设置 `GeoJSON` 图层的样式。`style` 属性接受一个函数，该函数返回一个包含样式选项的对象。
```tsx
import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const geojsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Example Feature"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [102.0, 0.0],
            [103.0, 0.0],
            [103.0, 1.0],
            [102.0, 1.0],
            [102.0, 0.0]
          ]
        ]
      }
    }
  ]
};

const geojsonStyle = (feature) => {
  // feature是GeoJSON对象
  return {
    color: 'blue',
    weight: 2,
    opacity: 1,
    fillColor: 'red',
    fillOpacity: 0.5
  };
};

const MapComponent = () => {
  return (
    <MapContainer center={[0.5, 102.5]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={geojsonData} style={geojsonStyle} />
    </MapContainer>
  );
};

export default MapComponent;
```

在 `react-leaflet` 中，`<GeoJSON>` 组件用于在地图上显示 GeoJSON 数据。`<GeoJSON>` 组件接受多种属性来控制其行为和外观。以下是一些常用的属性：

### 常用属性

1. **data** (必需)
   - 类型：`object`
   - 描述：GeoJSON 数据对象。

2. **style**
   - 类型：`function | object`
   - 描述：用于设置 GeoJSON 图层样式的函数或对象。如果是函数，它将接收一个 `feature` 对象并返回一个样式对象。
   - 可以设置的样式属性有：
     - color: 边框颜色
     - weight: 边框宽度
     - opacity: 边框透明度
     - fillColor: 填充颜色
     - fillOpacity: 填充透明度
     - dashArray: 虚线样式，例如 "5, 10"
     - lineCap: 线条端点样式，值可以是 "butt", "round", "square"
     - lineJoin: 线条连接样式，值可以是 "miter", "round", "bevel"

1. **pointToLayer**
   - 类型：`function`
   - 描述：用于将 GeoJSON 点转换为 `Layer` 的函数。该函数接收 `feature` 和 `latlng` 参数，并返回一个 `Layer` 对象。

2. **onEachFeature**
   - 类型：`function`
   - 描述：用于为每个 GeoJSON 特征设置事件处理程序的函数。该函数接收 `feature` 和 `layer` 参数。

3. **filter**
   - 类型：`function`
   - 描述：用于过滤 GeoJSON 特征的函数。该函数接收一个 `feature` 对象并返回一个布尔值。

4. **coordsToLatLng**
   - 类型：`function`
   - 描述：用于将 GeoJSON 坐标转换为 `LatLng` 对象的函数。

5. **pane**
   - 类型：`string`
   - 描述：GeoJSON 图层所在的 pane。

6. **interactive**
   - 类型：`boolean`
   - 描述：GeoJSON 图层是否响应鼠标和触摸事件。

7. **eventHandlers**
   - 类型：`object`
   - 描述：事件处理程序对象，用于处理 GeoJSON 图层的各种事件（例如 `click`, `mouseover` 等）。

以下是一个使用 `<GeoJSON>` 组件的示例，展示了如何设置一些常用属性：

```jsx
import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const geojsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Example Polygon",
        "color": "blue",
        "weight": 2,
        "opacity": 1,
        "fillColor": "red",
        "fillOpacity": 0.5
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0]
          ]
        ]
      }
    }
  ]
};

const geojsonStyle = (feature) => {
  return {
    color: feature.properties.color,
    weight: feature.properties.weight,
    opacity: feature.properties.opacity,
    fillColor: feature.properties.fillColor,
    fillOpacity: feature.properties.fillOpacity
  };
};

const onEachFeature = (feature, layer) => {
  if (feature.properties && feature.properties.name) {
    layer.bindPopup(feature.properties.name);
  }
};

const MapComponent = () => {
  return (
    <MapContainer center={[0.5, 100.5]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON
        data={geojsonData}
        style={geojsonStyle}
        onEachFeature={onEachFeature}
        eventHandlers={{
          click: () => {
            alert('GeoJSON layer clicked!');
          }
        }}
      />
    </MapContainer>
  );
};

export default MapComponent;
```

在这个示例中：

1. 我们定义了一个包含 GeoJSON 数据的对象 `geojsonData`。
2. 创建了一个 `geojsonStyle` 函数，该函数根据 GeoJSON 数据中的 `properties` 字段返回样式选项。
3. 创建了一个 `onEachFeature` 函数，用于为每个 GeoJSON 特征设置事件处理程序。
4. 在 `MapComponent` 组件中，我们将 `geojsonData` 传递给 `<GeoJSON>` 组件，并通过 `style` 属性将 `geojsonStyle` 函数传递给 `<GeoJSON>` 组件，同时设置了 `onEachFeature` 和 `eventHandlers` 属性。

这样，GeoJSON 图层将使用你在 `properties` 字段中定义的样式进行渲染，并响应事件处理程序。你可以根据需要调整这些属性，以适应你的具体需求。

### GeoJSON点击选中
在 React-Leaflet 中，你可以使用 `GeoJSON` 组件的 `onEachFeature` 属性来处理每个 GeoJSON 特征的事件。通过 `onEachFeature`，你可以为每个特征添加事件监听器，例如点击事件，并在点击时改变其样式以表示选中状态。

以下是一个完整的示例代码，展示如何在 React-Leaflet 中使用 `GeoJSON` 组件的 `onEachFeature` 属性来实现选中功能并改变样式：

```jsx
import React, { useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

const geojsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-0.1, 51.5],
            [-0.1, 51.6],
            [0.1, 51.6],
            [0.1, 51.5],
            [-0.1, 51.5]
          ]
        ]
      },
      "properties": {
        "name": "Polygon 1"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [-0.2, 51.4],
            [-0.2, 51.5],
            [0.0, 51.5],
            [0.0, 51.4],
            [-0.2, 51.4]
          ]
        ]
      },
      "properties": {
        "name": "Polygon 2"
      }
    }
  ]
};

const defaultStyle = {
  color: 'blue',
  weight: 2,
  opacity: 1,
  fillOpacity: 0.5
};

const selectedStyle = {
  color: 'red',
  weight: 2,
  opacity: 1,
  fillOpacity: 0.5
};

const App = () => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        setSelectedFeature(feature);
      }
    });
  };

  const style = (feature) => {
    return feature === selectedFeature ? selectedStyle : defaultStyle;
  };

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <GeoJSON data={geojsonData} style={style} onEachFeature={onEachFeature} />
    </MapContainer>
  );
};

export default App;
```

解释：

1. **初始化地图**：
   ```jsx
   <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh' }}>
     <TileLayer
       url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
       maxZoom={19}
     />
     <GeoJSON data={geojsonData} style={style} onEachFeature={onEachFeature} />
   </MapContainer>
   ```

2. **示例 GeoJSON 数据**：
   ```jsx
   const geojsonData = {
     "type": "FeatureCollection",
     "features": [
       {
         "type": "Feature",
         "geometry": {
           "type": "Polygon",
           "coordinates": [
             [
               [-0.1, 51.5],
               [-0.1, 51.6],
               [0.1, 51.6],
               [0.1, 51.5],
               [-0.1, 51.5]
             ]
           ]
         },
         "properties": {
           "name": "Polygon 1"
         }
       },
       {
         "type": "Feature",
         "geometry": {
           "type": "Polygon",
           "coordinates": [
             [
               [-0.2, 51.4],
               [-0.2, 51.5],
               [0.0, 51.5],
               [0.0, 51.4],
               [-0.2, 51.4]
             ]
           ]
         },
         "properties": {
           "name": "Polygon 2"
         }
       }
     ]
   };
   ```

3. **默认样式和选中样式**：
   ```jsx
   const defaultStyle = {
     color: 'blue',
     weight: 2,
     opacity: 1,
     fillOpacity: 0.5
   };

   const selectedStyle = {
     color: 'red',
     weight: 2,
     opacity: 1,
     fillOpacity: 0.5
   };
   ```

4. **当前选中的特征**：
   ```jsx
   const [selectedFeature, setSelectedFeature] = useState(null);
   ```

5. **处理每个特征的事件**：
   ```jsx
   const onEachFeature = (feature, layer) => {
     layer.on({
       click: () => {
         setSelectedFeature(feature);
       }
     });
   };
   ```

6. **设置样式**：
   ```jsx
   const style = (feature) => {
     return feature === selectedFeature ? selectedStyle : defaultStyle;
   };
   ```

通过这些方法，你可以在 React-Leaflet 中使用 `GeoJSON` 组件的 `onEachFeature` 属性来实现选中功能，并在点击特征时改变其样式以表示选中状态。

### GeoJSON点击选中再次点击取消选中
以下使用`state`判断的方案可以正常点击选中，但是再次点击取消选中不生效
```jsx
function App() {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        if (selectedFeature === feature) {
          setSelectedFeature(null); // 取消选中
        } else {
          setSelectedFeature(feature); // 选中
        }
      }
    });
  };

  const style = (feature) => {
    return {
      fillColor: selectedFeature === feature ? 'blue' : 'green',
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };

  return (
    <div className="App">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100vh" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          data={geojsonData}
          onEachFeature={onEachFeature}
          style={style}
        />
      </MapContainer>
    </div>
  );
}

export default App;
```

上述不生效的原因是 `onEachFeature` 函数中的 `layer.on` 无法直接访问组件的 `state`。为了在点击事件中正确地获取和更新组件的状态，可以使用 React 的 `useRef` 钩子来存储对状态的引用。如下示例：
```jsx
function App() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const selectedFeatureRef = useRef(selectedFeature);

  useEffect(() => {
    selectedFeatureRef.current = selectedFeature;
  }, [selectedFeature]);

  const onEachFeature = (feature, layer) => {
    layer.on({
      click: () => {
        if (selectedFeatureRef.current === feature) {
          setSelectedFeature(null); // 取消选中
        } else {
          setSelectedFeature(feature); // 选中
        }
      }
    });
  };

  const style = (feature) => {
    return {
      fillColor: selectedFeature === feature ? 'blue' : 'green',
      weight: 2,
      opacity: 1,
      color: 'white',
      fillOpacity: 0.7
    };
  };

  return (
    <div className="App">
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: "100vh" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <GeoJSON
          data={geojsonData}
          onEachFeature={onEachFeature}
          style={style}
        />
      </MapContainer>
    </div>
  );
}

export default App;
```

上述解决方案中`useEffect`不是必要的，如下为最终示例：
```jsx
function Example() {
	const [selectedAois, setSelectedAois] = useState([]);
	const selectedAoisRef = useRef(selectedAois);
	
	function handleEachFeature(feature, layer) {
	    layer.on({
	      click: () => {
	        const foundIndex = selectedAoisRef.current.findIndex(ele => ele === feature)
	        if (foundIndex != -1) {
	          setSelectedAois(selectedAois.filter(ele => ele != feature));
	          selectedAoisRef.current.splice(foundIndex,1);
	        } else {
	          setSelectedAois(selectedAois.concat([feature]));
	          selectedAoisRef.current.push(feature);
	        }
	      },
	    });
	}
	function geojsonStyle(feature) {
	    return {
	      color: selectedAois.includes(feature) ? 'yellow' : feature.properties.fillColor,
	    }
	}
	
	reurn (
		<GeoJSON
      data={aoiGeoJson}
      style={geojsonStyle}
      onEachFeature={handleEachFeature}
    />
	)
}
```

### 动态控制 GeoJSON 图层的点击事件
为了在 `react-leaflet` 中动态控制 `GeoJSON` 图层的点击事件，我们需要确保每次状态变化时，`GeoJSON` 图层能够处理不同的点击行为。为了在点击事件中正确地获取和更新组件的状态，可以使用 React 的 `useRef` 钩子来存储对状态的引用。

如下示例，使用状态管理工具 `zustand` 存储选择方式，当选择方式不是`点选`时，`GeoJSON` 图层的点击不处理：
```jsx title="src/store/index.ts"
import { create } from 'zustand'

type SelectTypeState = {
  selectType: string | number | null
}
type SelectTypeAction = {
  updateSelectType: (newSelectType: SelectTypeState['selectType']) => void
}

export const useSelectType = create<SelectTypeState & SelectTypeAction>((set) => ({
  selectType: null,
  updateSelectType: (newSelectType) => set({ selectType: newSelectType })
}))
```
```jsx
function Example() {
	const [selectedAois, setSelectedAois] = useState([]);
	const selectedAoisRef = useRef(selectedAois);
  const selectType = useSelectType((state) => state.selectType);
  const selectTypeRef = useRef(selectType);

  useEffect(() => {
    if (selectType) selectTypeRef.current = selectType;
  }, [selectType]);
	
	function handleEachFeature(feature, layer) {
	    layer.on({
	      click: () => {
          if (selectTypeRef.current != '点选') return;
	        const foundIndex = selectedAoisRef.current.findIndex(ele => ele === feature)
	        if (foundIndex != -1) {
	          setSelectedAois(selectedAois.filter(ele => ele != feature));
	          selectedAoisRef.current.splice(foundIndex,1);
	        } else {
	          setSelectedAois(selectedAois.concat([feature]));
	          selectedAoisRef.current.push(feature);
	        }
	      },
	    });
	}
	function geojsonStyle(feature) {
     return {
       color: selectedAois.includes(feature) ? 'yellow' : feature.properties.fillColor,
     }
	}
	
	reurn (
		<GeoJSON
      data={aoi.aoiGeoJson}
      style={geojsonStyle}
      onEachFeature={handleEachFeature}
    />
	)
}
```

### GeoJSON 获取边界
在 `react-leaflet` 中，你可以使用 `GeoJSON` 组件来显示 GeoJSON 数据，并使用 Leaflet 的 `getBounds` 方法来获取 GeoJSON 图层的边界。`getBounds` 方法返回一个 `LatLngBounds` 对象，表示包含所有 GeoJSON 特征的最小矩形边界。

以下是一个示例，展示如何在 React 中使用 `react-leaflet` 获取 GeoJSON 图层的边界，并将地图视图调整到这些边界：

```jsx
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const geojsonData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Example Polygon"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [100.0, 0.0],
            [101.0, 0.0],
            [101.0, 1.0],
            [100.0, 1.0],
            [100.0, 0.0]
          ]
        ]
      }
    }
  ]
};

const FitBoundsComponent = ({ geoJsonLayer }) => {
  const map = useMap();

  useEffect(() => {
    if (geoJsonLayer.current) {
      const bounds = geoJsonLayer.current.getBounds();
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 15
      });
    }
  }, [map, geoJsonLayer]);

  return null;
};

const MapComponent = () => {
  const geoJsonLayer = useRef();

  return (
    <MapContainer center={[0.5, 100.5]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={geojsonData} ref={geoJsonLayer} />
      <FitBoundsComponent geoJsonLayer={geoJsonLayer} />
    </MapContainer>
  );
};

export default MapComponent;
```

在这个示例中：

1. 我们定义了一个包含 GeoJSON 数据的对象 `geojsonData`。
2. 创建了一个 `FitBoundsComponent` 组件，该组件使用 `useMap` 钩子获取地图实例，并在 `useEffect` 钩子中调用 `geoJsonLayer.current.getBounds` 方法来获取 GeoJSON 图层的边界，然后调用 `map.fitBounds` 方法来调整地图视图。
3. 在 `MapComponent` 组件中，我们使用 `useRef` 钩子创建一个 `geoJsonLayer` 引用，并将其传递给 `GeoJSON` 组件的 `ref` 属性。
4. 将 `geoJsonLayer` 引用传递给 `FitBoundsComponent` 组件，以便在该组件中访问 GeoJSON 图层。

这样，地图视图将自动调整到包含所有 GeoJSON 特征的最小矩形边界。你可以根据需要调整 `fitBounds` 方法的选项，以适应你的具体需求。

### 设置GeoJSON的zIndex
在Leaflet中，GeoJSON图层本身没有直接的`zIndex`属性，但你可以通过设置图层的`pane`来控制其渲染顺序。`pane`是Leaflet中的一个概念，用于控制图层的渲染顺序。每个图层都可以分配到一个特定的`pane`，并且每个`pane`都有一个`zIndex`。

以下是一个示例，展示如何为GeoJSON图层设置`zIndex`：

```javascript
import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MyComponent = () => {
  const geojsonData = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-0.09, 51.505]
        },
        "properties": {
          "name": "A point"
        }
      },
      {
        "type": "Feature",
        "geometry": {
          "type": "Point",
          "coordinates": [-0.1, 51.51]
        },
        "properties": {
          "name": "Another point"
        }
      }
    ]
  };

  const map = useMap();

  useEffect(() => {
    // 创建自定义pane
    map.createPane('geojsonPane');
    // 设置pane的zIndex
    map.getPane('geojsonPane').style.zIndex = 650;
  }, [map]);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <GeoJSON
        data={geojsonData}
        pane="geojsonPane"
      />
    </MapContainer>
  );
};

export default MyComponent;
```

在这个示例中，我们首先创建了一个自定义的`pane`，并设置了它的`zIndex`。然后，我们在创建GeoJSON图层时，将其分配到这个自定义的`pane`。

通过这种方式，你可以控制GeoJSON图层的渲染顺序。如果你有多个图层，并希望控制它们的叠放顺序，可以为每个图层分配不同的`pane`，并设置相应的`zIndex`。

### GeoJSON开启编辑模式及禁用编辑
```jsx
function Example() {
 const mapGeoJsonRef = useRef([])
 
 const handleClick = () => {
  mapGeoJsonRef.current.forEach(item => {
    item.pm.enable({
      snappable: true,
      snapDistance: 20,
      allowSelfIntersection: false,
    })
  })
 }
 const handleClick2 = () => {
  mapGeoJsonRef.current.forEach(item => {
    // 清除之前的事件监听器，防止重复绑定
    item.off('pm:enable')
    item.off('pm:edit')
    item.off('pm:update')
    item.off('pm:disable')

    // biome-ignore lint/suspicious/noExplicitAny: Layer use toGeoJSON
    item.on('pm:disable', (e: any) => {
      console.log('layer disable::', e)
    })

    item.pm.disable()
  })
 }
 
 return (
  <>
   {
    [geojsonData,geojsonData2].map((item,index) => {
      return <GeoJSON data={item} key={index} style={geojsonStyle} onEachFeature={handleEachFeature} ref={(ele) => (mapGeoJsonRef.current[index] = ele)}></GeoJSON>
    })
   }
   <button style={{position: 'absolute', left: 200, top: 160, backgroundColor: 'green', width: 100, height: 100, zIndex: 1000}} onClick={handleClick}>开启编辑</button>
   <button style={{position: 'absolute', left: 400, top: 160, backgroundColor: 'red', width: 100, height: 100, zIndex: 1000}} onClick={handleClick2}>取消编辑</button>
  </>
 )
}
```

## `useMapEvents` `useMapEvent`
Leaflet 提供了许多地图事件，可以帮助你监听和响应用户的交互。以下是一些常见的 Leaflet 地图事件：

1. **zoomstart**: 当地图开始缩放时触发。
2. **zoom**: 当地图正在缩放时持续触发。
3. **zoomend**: 当地图完成缩放时触发。
4. **movestart**: 当地图开始移动时触发。
5. **move**: 当地图正在移动时持续触发。
6. **moveend**: 当地图完成移动时触发。
7. **dragstart**: 当用户开始拖动地图时触发。
8. **drag**: 当用户正在拖动地图时持续触发。
9. **dragend**: 当用户完成拖动地图时触发。
10. **resize**: 当地图大小改变时触发。
11. **click**: 当用户点击地图时触发。
12. **dblclick**: 当用户双击地图时触发。
13. **mousedown**: 当用户在地图上按下鼠标按钮时触发。
14. **mouseup**: 当用户在地图上释放鼠标按钮时触发。
15. **mouseover**: 当鼠标指针进入地图区域时触发。
16. **mouseout**: 当鼠标指针离开地图区域时触发。
17. **mousemove**: 当鼠标指针在地图上移动时持续触发。
18. **contextmenu**: 当用户在地图上右键点击时触发。
19. **keypress**: 当用户在地图上按下键盘键时触发。
20. **preclick**: 在地图上的任何点击事件之前触发。

你可以使用这些事件来监听和响应用户在地图上的各种交互。例如：

```javascript
const map = L.map('map').setView([51.505, -0.09], 13);

map.on('zoomend', function() {
  console.log('Zoom ended');
});

map.on('moveend', function() {
  console.log('Move ended');
});

map.on('click', function(e) {
  console.log('Map clicked at', e.latlng);
});
```

### 监听地图的缩小和放大事件
在 Leaflet 中，虽然没有直接名为 `zoomin` 的事件，但你可以通过监听 `zoom` 事件并检查缩放级别的变化来实现类似的效果。具体来说，你可以在 `zoom` 事件中比较当前缩放级别和之前的缩放级别，以确定是否发生了放大操作。

以下是一个示例，展示如何监听地图的放大事件：

```javascript
// 初始化地图
const map = L.map('map').setView([51.505, -0.09], 13);

// 记录上一次的缩放级别
let lastZoomLevel = map.getZoom();

// 监听 zoom 事件
map.on('zoom', function() {
  const currentZoomLevel = map.getZoom();
  
  // 检查是否是放大操作
  if (currentZoomLevel > lastZoomLevel) {
    console.log('Map zoomed in');
  }
  
  // 更新上一次的缩放级别
  lastZoomLevel = currentZoomLevel;
});
```

在这个示例中：

1. 初始化地图并设置初始视图和缩放级别。
2. 使用 `map.getZoom()` 方法记录上一次的缩放级别。
3. 监听 `zoom` 事件，在事件处理函数中获取当前的缩放级别。
4. 比较当前缩放级别和上一次的缩放级别，如果当前缩放级别更大，则表示发生了放大操作。
5. 更新上一次的缩放级别，以便在下一次 `zoom` 事件中进行比较。

### `moveend` 事件
在 Leaflet 中，`moveend` 事件会在地图完成移动（包括平移和缩放）后触发。你可以使用这个事件来执行一些操作，例如按需加载数据、更新地图上的图层等。

在 React-Leaflet 中，可以使用 `useMapEvents` 钩子来监听 `moveend` 事件，并在事件触发时执行相应的操作。

以下是一个示例代码，展示如何在 React-Leaflet 中使用 `moveend` 事件按需加载数据，在 `moveend` 事件触发时，获取当前地图的边界，并根据边界加载相应的 GeoJSON 数据。

```jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';

const LoadGeoJSON = ({ setGeoJsonData }) => {
  useMapEvents({
    moveend: () => {
      const map = useMapEvents();
      const bounds = map.getBounds();
      const url = `https://example.com/geojson?bbox=${bounds.toBBoxString()}`;
      fetch(url)
        .then(response => response.json())
        .then(data => setGeoJsonData(data));
    }
  });

  return null;
};

const App = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <LoadGeoJSON setGeoJsonData={setGeoJsonData} />
      {geoJsonData && <GeoJSON data={geoJsonData} />}
    </MapContainer>
  );
};

export default App;
```

## 渲染大规模的 AOI
在使用 React-Leaflet 渲染大规模的 AOI（Area of Interest）数据时，可能会遇到性能问题。为了提高渲染性能，可以采用以下几种方法：

1. **简化几何图形**：使用工具或库（如 Turf.js）来简化几何图形，减少顶点数量。
2. **按需加载数据**：使用瓦片服务或按需加载数据，只加载当前视图范围内的数据。
3. **使用 WebGL**：使用基于 WebGL 的渲染库（如 Mapbox GL JS）来提高渲染性能。
4. **虚拟化**：将数据分块处理，逐步加载和渲染。

以下是每种方法的详细说明和示例代码：

### 方法一：简化几何图形

使用 Turf.js 的 `simplify` 方法来简化几何图形，减少顶点数量。

```jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import * as turf from '@turf/turf';

const App = () => {
  const [simplifiedData, setSimplifiedData] = useState(null);

  useEffect(() => {
    // 示例 AOI 数据（GeoJSON 格式）
    const aoiData = {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "geometry": {
            "type": "Polygon",
            "coordinates": [
              [
                [-0.1, 51.5],
                [-0.1, 51.6],
                [0.1, 51.6],
                [0.1, 51.5],
                [-0.1, 51.5]
              ]
            ]
          }
        }
      ]
    };

    // 使用 Turf.js 简化几何图形
    const simplified = turf.simplify(aoiData, { tolerance: 0.01, highQuality: false });
    setSimplifiedData(simplified);
  }, []);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      {simplifiedData && <GeoJSON data={simplifiedData} />}
    </MapContainer>
  );
};

export default App;
```

### 方法二：按需加载数据

使用 React-Leaflet 的 `useMapEvents` 钩子按需加载数据。

```jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMapEvents } from 'react-leaflet';

const LoadGeoJSON = ({ setGeoJsonData }) => {
  useMapEvents({
    moveend: () => {
      const map = useMapEvents();
      const bounds = map.getBounds();
      const url = `https://example.com/geojson?bbox=${bounds.toBBoxString()}`;
      fetch(url)
        .then(response => response.json())
        .then(data => setGeoJsonData(data));
    }
  });

  return null;
};

const App = () => {
  const [geoJsonData, setGeoJsonData] = useState(null);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <LoadGeoJSON setGeoJsonData={setGeoJsonData} />
      {geoJsonData && <GeoJSON data={geoJsonData} />}
    </MapContainer>
  );
};

export default App;
```

### 方法三：使用 WebGL

使用基于 WebGL 的渲染库（如 Mapbox GL JS）来提高渲染性能。

```jsx
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'your-access-token';

const App = () => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-0.09, 51.505],
      zoom: 13
    });

    map.on('load', () => {
      map.addSource('aoi', {
        'type': 'geojson',
        'data': 'https://example.com/large-aoi-data.geojson'
      });

      map.addLayer({
        'id': 'aoi-layer',
        'type': 'fill',
        'source': 'aoi',
        'layout': {},
        'paint': {
          'fill-color': '#888888',
          'fill-opacity': 0.4
        }
      });
    });

    return () => map.remove();
  }, []);

  return <div ref={mapContainer} style={{ height: '100vh' }} />;
};

export default App;
```

### 方法四：虚拟化

将数据分块处理，逐步加载和渲染。

```jsx
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';

const App = () => {
  const [features, setFeatures] = useState([]);
  const chunkSize = 100; // 每次处理的特征数量
  let currentIndex = 0;

  useEffect(() => {
    // 示例 AOI 数据（GeoJSON 格式）
    const aoiData = {
      "type": "FeatureCollection",
      "features": [
        // 大量的多边形数据
      ]
    };

    function processChunk() {
      const chunk = aoiData.features.slice(currentIndex, currentIndex + chunkSize);
      if (chunk.length > 0) {
        setFeatures(prevFeatures => [...prevFeatures, ...chunk]);
        currentIndex += chunkSize;
        requestAnimationFrame(processChunk);
      }
    }

    // 开始处理
    processChunk();
  }, []);

  return (
    <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <GeoJSON data={{ type: 'FeatureCollection', features }} />
    </MapContainer>
  );
};

export default App;
```

通过这些方法，你可以有效地提高 React-Leaflet 渲染大规模 AOI 数据的性能。选择适合你项目需求的方法即可。

## 

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