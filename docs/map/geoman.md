[Geoman](https://github.com/geoman-io/leaflet-geoman)（以前称为 Leaflet.pm）是一个用于 Leaflet 的插件，提供了强大的绘图和编辑功能。它比 Leaflet Draw 更加现代和灵活。

```bash
npm i @geoman-io/leaflet-geoman-free
```

## `workingLayer`
`workingLayer` 是 Leaflet-Geoman 插件在绘制过程中使用的临时图层对象。它代表当前正在绘制的图形（例如多边形、折线等）。在绘制过程中，Geoman 会将顶点添加到这个图层中，并在绘制完成后将其转换为最终的图层。

为了实现撤回上一步的功能，我们需要操作这个 `workingLayer`，因为它包含了当前正在绘制的顶点信息。

以下是一个详细的示例，展示了如何在绘制多边形时实现撤回上一步的功能，并正确操作 `workingLayer`：

```html
<!DOCTYPE html>
<html>
<head>
    <title>Leaflet-Geoman 撤回上一步示例</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css" />
    <style>
        #map {
            height: 100vh;
        }
        #undo-button {
            position: absolute;
            top: 10px;
            left: 10px;
            z-index: 1000;
            background-color: white;
            padding: 10px;
            border: 1px solid black;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <button id="undo-button">撤回上一步</button>

    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.min.js"></script>
    <script>
        // 初始化地图
        const map = L.map('map').setView([51.505, -0.09], 13);

        // 添加底图
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
        }).addTo(map);

        // 启用 Geoman 插件
        map.pm.addControls({
            position: 'topleft',
            drawPolygon: true,
            editMode: false,
            dragMode: false,
            cutPolygon: false,
            removalMode: false,
        });

        // 用于存储顶点的数组
        let vertices = [];
        let workingLayer = null;

        // 监听绘制开始事件
        map.on('pm:drawstart', function(e) {
            if (e.shape === 'Polygon') {
                workingLayer = e.workingLayer;

                // 清除之前的事件监听器，防止重复绑定
                workingLayer.off('pm:vertexadded');

                // 监听顶点添加事件
                workingLayer.on('pm:vertexadded', function(event) {
                    // 将新添加的顶点推入数组
                    vertices.push(event.latlng);
                    console.log('顶点已添加:', event.latlng);
                });
            }
        });

        // 实现撤回上一步的功能
        function undoLastVertex() {
            if (vertices.length > 0) {
                // 移除最后一个顶点
                vertices.pop();

                // 更新 workingLayer 的顶点
                workingLayer.setLatLngs([vertices]);

                // 重新启用编辑模式以更新图层
                workingLayer.pm.enable({ allowSelfIntersection: false });

                console.log('已撤回最后一个顶点');
            } else {
                console.log('没有顶点可以撤回');
            }
        }

        // 绑定按钮点击事件来触发撤回操作
        document.getElementById('undo-button').addEventListener('click', undoLastVertex);
    </script>
</body>
</html>
```

在这个示例中：

1. **初始化地图和 Geoman 插件**：我们初始化了地图并启用了 Geoman 插件的多边形绘制功能。

2. **监听 `pm:drawstart` 事件**：当开始绘制多边形时，我们获取 `workingLayer` 并清除之前的 `pm:vertexadded` 事件监听器，以防止重复绑定。

3. **监听 `pm:vertexadded` 事件**：每当添加一个顶点时，我们将其存储在 `vertices` 数组中。

4. **撤回上一步功能**：当用户点击“撤回上一步”按钮时，我们从 `vertices` 数组中移除最后一个顶点，并使用 `workingLayer.setLatLngs([vertices])` 方法更新多边形的形状。为了确保图层正确更新，我们重新启用了编辑模式。

通过这种方式，你可以确保在绘制多边形时，撤回上一步操作能够正确移除最后一个顶点，并更新多边形的形状。

## `snappable`
在 Geoman（Leaflet-Geoman）中，`snappable` 是一个配置选项，用于控制在绘制或编辑图形时，顶点是否会自动吸附到附近的其他顶点或图形上。这种吸附行为可以帮助用户更精确地对齐顶点，从而绘制出更整齐的图形。

### `snappable` 选项的使用

当 `snappable` 设置为 `true` 时，Geoman 会在绘制或编辑图形时自动检测附近的顶点或图形，并将当前顶点吸附到这些位置上。默认情况下，`snappable` 是启用的。

以下是一个示例代码，展示了如何在 React 中使用 `react-leaflet` 和 `leaflet-geoman` 配置 `snappable` 选项：

```javascript
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-geoman-free/dist/leaflet-geoman.css';
import 'leaflet-geoman-free';

const MapComponent = () => {
  const mapRef = useRef();

  useEffect(() => {
    const map = mapRef.current;

    // 启用Geoman插件并配置snappable选项
    map.pm.addControls({
      position: 'topleft',
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      cutPolygon: true,
      removalMode: true
    });

    // 配置 Geoman 的 snappable 选项
    map.pm.setGlobalOptions({
      snappable: true, // 启用吸附功能
      snapDistance: 20 // 设置吸附距离（单位：像素）
    });

    // 监听绘制多边形的事件
    map.on('pm:create', function(e) {
      console.log('创建了一个新图形:', e.layer);
    });

    // 监听编辑图形的事件
    map.on('pm:edit', function(e) {
      console.log('编辑了一个图形:', e.layer);
    });
  }, []);

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: '100vh', width: '100%' }}
      whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </MapContainer>
  );
};

export default MapComponent;
```

解释:
1. **初始化地图**：我们首先初始化了地图并添加了 Geoman 控件。
2. **配置 `snappable` 选项**：通过 `map.pm.setGlobalOptions` 方法，我们可以全局配置 Geoman 的选项。在这个示例中，我们启用了 `snappable` 选项，并设置了 `snapDistance` 为 20 像素。这意味着在绘制或编辑图形时，顶点会自动吸附到距离 20 像素以内的其他顶点或图形上。
3. **事件监听**：我们还监听了 `pm:create` 和 `pm:edit` 事件，以便在创建或编辑图形时输出相关信息。

### 总结

`snappable` 选项在 Geoman 中非常有用，可以帮助用户更精确地对齐顶点，从而绘制出更整齐的图形。通过配置 `snappable` 选项和 `snapDistance`，你可以控制吸附行为的启用和吸附距离。

## Draw Mode（绘制模式）
方法有：
- `map.pm.enableDraw(shape,options)` 手动启用绘制模式
  ```js
  map.pm.enableDraw('Polygon', {
    snappable: true,
    snapDistance: 20,
    allowSelfIntersection: false,
    hintlineStyle: {
      opacity: 0,
    },
  });
  ```

- `map.pm.disableDraw()` 手动禁用绘制模式

- `map.pm.getGeomanLayers(Boolean)` 以数组形式返回地图上的所有 Leaflet-Geoman 图层。传递 `true` 以获得 `L.FeatureGroup`。
  ```js
  // 例子：获取 Geoman 图层中的 marker

  // 获取所有 Geoman 图层
  const layers = map.pm.getGeomanLayers();

  // 存储所有 marker 的数组
  const markers = [];

  // 遍历每个图层并检查是否是 marker 类型
  layers.forEach(layer => {
      if (layer instanceof L.Marker) {
        markers.push(layer);
      }
  });

  // 输出所有 marker
  console.log(markers);
  ```

- `map.pm.getGeomanDrawLayers(Boolean)` 以数组形式返回地图上所有绘制的 Leaflet-Geoman 图层。传递 `true` 以获得 `L.FeatureGroup`。
  ```js
  // 获取地图上所有Geoman绘制的图层
  const geomanDrawLayers = map.pm.getGeomanDrawLayers();
  // 对地图上绘制的最后一个图层启用编辑模式
  const lastGeomanDrawLayer = geomanDrawLayers[geomanDrawLayers.length-1];
  lastGeomanDrawLayer.pm.enable();
  ```

### draw hooks
可以监听地图事件来挂钩绘图过程:
- `map.on("pm:drawstart", (e) => {})` 启用绘图模式时调用。

- `map.on("pm:drawend", (e) => {})` 当绘制模式被禁用时调用。

- `map.on("pm:create", (e) => {})` 当绘制完成时调用。

## Edit Mode（编辑模式）
- `map.pm.enableGlobalEditMode(options)` 为地图上的所有图层启用编辑模式

- `map.pm.disableGlobalEditMode()` 为地图上的所有图层禁用编辑模式

- `map.pm.globalEditModeEnabled()` 判断地图上的所有图层是否启用了编辑模式

- `myLayer.pm.enable(options)` 仅对指定的图层启用编辑模式
  ```js
  // 获取地图上所有Geoman绘制的图层
  const geomanDrawLayers = map.pm.getGeomanDrawLayers();
  // 对地图上绘制的最后一个图层启用编辑模式
  const lastGeomanDrawLayer = geomanDrawLayers[geomanDrawLayers.length-1];
  lastGeomanDrawLayer.pm.enable();
  // 获取最后一个图层的所有marker
  let geomanMarkers = lastGeomanDrawLayer.pm._markers;
  console.log('geomanMarkers::', geomanMarkers)
  // 获取最后一个图层的所有marker(包含marker间的小marker)
  let geomanCacheMarkers = lastGeomanDrawLayer.pm.markerCache;
  console.log('geomanCacheMarkers::', geomanCacheMarkers)
  ```

可以监听与编辑事件相关的事件:
- `pm:edit` 编辑图层时触发
  ```js
  myLayer.on("pm:edit", (e) => {
    console.log(e);
  });
  ```

- `pm:enable` 当启用图层上的编辑模式时触发
- `pm:disable` 当禁用图层上的编辑模式时触发
- `pm:update` 当图层被编辑后有改动且退出编辑模式时触发

使用`off`清除之前的事件监听器，防止重复绑定:
```js
myLayer.off('pm:enable')
myLayer.off('pm:edit')
myLayer.off('pm:update')
myLayer.off('pm:disable')
```

## geoman设置语言及自定义提示
在 Leaflet-Geoman 中，你可以设置语言和自定义提示信息，以便更好地适应不同的语言环境和用户需求。Leaflet-Geoman 提供了一个 `setLang` 方法，可以用来设置语言和自定义提示信息。

以下是一个详细的示例，展示了如何在 Leaflet-Geoman 中设置语言和自定义提示信息。

```html
<!DOCTYPE html>
<html>
<head>
  <title>Leaflet GeoMan Example</title>
  <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet-geoman-free/dist/leaflet-geoman.css" />
  <style>
    #map {
      height: 100vh;
    }
  </style>
</head>
<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
  <script src="https://unpkg.com/leaflet-geoman-free/dist/leaflet-geoman.min.js"></script>
  <script>
    // 初始化地图
    const map = L.map('map').setView([51.505, -0.09], 13);

    // 添加 OpenStreetMap 图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19
    }).addTo(map);

    // 启用 GeoMan
    map.pm.addControls({
      position: 'topleft',
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      cutPolygon: false,
      removalMode: true
    });

    // 设置语言和自定义提示
    map.pm.setLang('custom', {
      tooltips: {
        placeMarker: '点击地图放置标记',
        firstVertex: '点击地图放置第一个顶点', // 对应 "click to place first vertex"
        continueLine: '点击地图继续绘制线', // 对应 "click to continue drawing"
        finishLine: '点击最后一个点完成线',
        finishPoly: '点击最后一个点完成多边形', // 绘制多边形时对应 "click first marker to finish"
        finishRect: '点击完成矩形',
        startCircle: '点击并拖动以绘制圆',
        finishCircle: '释放鼠标完成圆',
        placeCircleMarker: '点击地图放置圆形标记'
      },
      actions: {
        finish: '完成',
        cancel: '取消',
        removeLastVertex: '移除最后一个顶点'
      },
      buttonTitles: {
        drawMarkerButton: '绘制标记',
        drawPolyButton: '绘制多边形',
        drawLineButton: '绘制线',
        drawCircleButton: '绘制圆',
        drawRectButton: '绘制矩形',
        editButton: '编辑图层',
        dragButton: '拖动图层',
        cutButton: '切割图层',
        deleteButton: '删除图层'
      }
    });
  </script>
</body>
</html>
```

解释：
1. **初始化地图**：
   - 使用 Leaflet 初始化地图，并设置视图中心和缩放级别。
   - 添加 OpenStreetMap 图层。

2. **启用 GeoMan**：
   - 启用 GeoMan 控件，允许用户绘制、编辑和删除多边形等图层。

3. **设置语言和自定义提示**：
   - 使用 `map.pm.setLang` 方法设置语言和自定义提示信息。
   - 第一个参数为语言代码（例如 `'custom'`），第二个参数为包含提示信息的对象。
   - 提示信息包括工具提示（`tooltips`）、操作按钮文本（`actions`）和按钮标题（`buttonTitles`）。

4. **应用自定义语言**：
   - 再次调用 `map.pm.setLang` 方法，并传入自定义语言代码（例如 `'custom'`），以应用自定义语言设置。

通过这种方式，你可以在 Leaflet-Geoman 中设置语言和自定义提示信息。